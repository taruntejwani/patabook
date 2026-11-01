/* PataBook — Home: "City की दुकानें" (default) + "Near me" (2/5/10/20 km). कोई DB बदलाव नहीं; सिर्फ़ public businesses पढ़ता है।
   भाषा: PB.lang() — "hi" नहीं तो English (default English)। */
(function () {
  "use strict";
  var cfg = window.PATABOOK_SUPABASE; if (!cfg) return;
  var SBU = cfg.url, KEY = cfg.anonKey, H = { apikey: KEY, Authorization: "Bearer " + KEY };
  var LOGO_RX = /^https:\/\/kkvbpzysktozghnxplxv\.supabase\.co\/storage\/v1\/object\/public\/shop-logos\//;
  var RADII = [2, 5, 10, 20];
  var COLS = "slug,name,address,category,latitude,longitude,logo_url";
  var mode = "city", radius = 5, pos = null, rows = [], busy = 0, msg = "";
  try { var sv = JSON.parse(localStorage.getItem("pb-nb") || "null"); if (sv && RADII.indexOf(sv.r) >= 0) radius = sv.r; } catch (e) {}
  function save() { try { localStorage.setItem("pb-nb", JSON.stringify({ r: radius })); } catch (e) {} }
  function en() { return !(window.PB && PB.lang && PB.lang() === "hi"); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function city() { var e = document.getElementById("city"); return e ? String(e.value || "").trim() : ""; }
  var T = {
    city_t: ["Shops in {c}", "{c} की दुकानें"], all_t: ["Shops on PataBook", "PataBook की दुकानें"],
    near_t: ["Shops near you · within {r} km", "आपके पास की दुकानें · {r} km के अंदर"],
    chip_near: ["📍 Near me", "📍 मेरे पास"], chip_city: ["🏙️ {c}", "🏙️ {c}"], chip_all: ["🏙️ City", "🏙️ शहर"],
    none_city: ["No shops found for this city yet.", "इस शहर की दुकानें अभी नहीं मिलीं।"],
    none_near: ["No shops within {r} km. Try a bigger distance.", "{r} km के अंदर कोई दुकान नहीं मिली। दूरी बढ़ाकर देखें।"],
    deny: ["Allow location to see shops near you.", "पास की दुकानें देखने के लिए लोकेशन की इजाज़त दें।"],
    wait: ["Finding your location…", "आपकी लोकेशन ढूँढ रहे हैं…"], load: ["Loading…", "लोड हो रहा है…"],
    nopos: ["Location not available on this device.", "इस फ़ोन पर लोकेशन उपलब्ध नहीं है।"]
  };
  function t(k, o) { var s = T[k][en() ? 0 : 1]; for (var x in (o || {})) s = s.replace("{" + x + "}", o[x]); return s; }

  var css = document.createElement("style");
  css.textContent = "#nb{margin:14px auto 6px;max-width:560px;padding:0 16px}#nb h2{margin:0 0 8px;font-size:17px;color:var(--navy,#0b2f73)}" +
    "#nb .nbc{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px}#nb .nbc button{border:1px solid var(--line,#e4eaf5);background:#fff;color:var(--navy,#0b2f73);border-radius:999px;padding:7px 13px;font:inherit;font-size:13.5px;font-weight:700;cursor:pointer}" +
    "#nb .nbc button.on{background:var(--blue,#1a73e8);border-color:var(--blue,#1a73e8);color:#fff}#nb .nbm{font-size:13px;color:var(--muted,#5b6475);padding:6px 2px}" +
    "#nb .nbl{display:flex;gap:10px;overflow-x:auto;padding:2px 2px 8px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}" +
    "#nb .nbk{flex:0 0 auto;width:150px;scroll-snap-align:start;background:#fff;border:1px solid var(--line,#e4eaf5);border-radius:14px;padding:10px;text-decoration:none;color:inherit;box-shadow:0 2px 8px rgba(26,115,232,.07);display:flex;flex-direction:column;gap:3px}" +
    "#nb .nbk .ic{width:42px;height:42px;border-radius:11px;background:#eef3ff;display:flex;align-items:center;justify-content:center;font-size:21px;overflow:hidden}#nb .nbk .ic img{width:100%;height:100%;object-fit:cover}" +
    "#nb .nbk b{font-size:13.5px;color:var(--ink,#12141c);line-height:1.2;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}" +
    "#nb .nbk em{font-style:normal;font-size:12px;color:var(--muted,#5b6475);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#nb .nbk small{font-size:12px;font-weight:800;color:#137333}";
  document.head.appendChild(css);
  var sec = document.createElement("section"); sec.id = "nb"; sec.setAttribute("aria-label", "Shops");
  var anchor = document.getElementById("ns");
  if (!anchor || !anchor.parentNode) return;
  anchor.parentNode.insertBefore(sec, anchor);

  function km(a, b) {
    var r = Math.PI / 180, dLa = (a[0] - b[0]) * r, dLn = (a[1] - b[1]) * r;
    var x = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(b[0] * r) * Math.cos(a[0] * r) * Math.sin(dLn / 2) * Math.sin(dLn / 2);
    return 2 * 6371 * Math.asin(Math.sqrt(x));
  }
  function kmTxt(d) { return d < 1 ? Math.max(50, Math.round(d * 1000 / 50) * 50) + " m" : (d < 10 ? d.toFixed(1) : Math.round(d)) + " km"; }
  function ico(c) { c = String(c || "").toLowerCase(); var M = [["food|restaurant|cafe|sweet|bakery", "🍽️"], ["auto|car|bike|tyre|garage", "🚗"], ["health|doctor|hospital|medical|clinic", "🏥"], ["school|college|tuition|coaching|education", "🎓"], ["salon|beauty|spa|parlour", "💇"], ["hotel|guest|resort", "🏨"], ["electric|plumb|carpenter|repair|cleaning|home", "🛠️"], ["mobile|electronic", "📱"], ["cloth|footwear|fashion", "👗"], ["grocery|kirana", "🛒"], ["furniture|interior", "🛋️"]]; for (var i = 0; i < M.length; i++) if (new RegExp(M[i][0]).test(c)) return M[i][1]; return "🏪"; }

  function draw() {
    var c = city(), h = "";
    var title = mode === "near" ? t("near_t", { r: radius }) : (c ? t("city_t", { c: esc(c) }) : t("all_t"));
    h += "<h2>" + title + "</h2><div class='nbc'>";
    h += "<button type='button' data-m='city' class='" + (mode === "city" ? "on" : "") + "'>" + (c ? t("chip_city", { c: esc(c) }) : t("chip_all")) + "</button>";
    h += "<button type='button' data-m='near' class='" + (mode === "near" ? "on" : "") + "'>" + t("chip_near") + "</button></div>";
    if (mode === "near") {
      h += "<div class='nbc'>" + RADII.map(function (r) { return "<button type='button' data-r='" + r + "' class='" + (r === radius ? "on" : "") + "'>" + r + " km</button>"; }).join("") + "</div>";
    }
    if (msg) h += "<div class='nbm'>" + esc(msg) + "</div>";
    if (busy && !rows.length) h += "<div class='nbm'>" + t("load") + "</div>";
    else if (!rows.length && !msg) h += "<div class='nbm'>" + (mode === "near" ? t("none_near", { r: radius }) : t("none_city")) + "</div>";
    else if (rows.length) h += "<div class='nbl'>" + rows.map(function (b) {
      var lg = LOGO_RX.test(b.logo_url || "");
      return "<a class='nbk' href='business.html?slug=" + encodeURIComponent(b.slug) + "'><span class='ic'>" + (lg ? "<img src='" + esc(b.logo_url) + "' alt='' loading='lazy'>" : ico(b.category)) + "</span><b>" + esc(b.name) + "</b><em>" + esc(b.category || b.address || "") + "</em>" + (b._d != null ? "<small>📍 " + kmTxt(b._d) + "</small>" : "<em>" + esc(b.address || "") + "</em>") + "</a>";
    }).join("") + "</div>";
    sec.innerHTML = h;
  }

  function get(q) { return fetch(SBU + "/rest/v1/businesses?select=" + COLS + "&is_active=eq.true&deleted_at=is.null" + q, { headers: H }).then(function (r) { return r.ok ? r.json() : null; }); }

  function loadCity() {
    var n = ++busy, c = city().replace(/[*,()%\\:."']/g, " ").trim();
    var f = c ? "&address=ilike." + encodeURIComponent("*" + c + "*") : "";
    msg = ""; draw();
    get(f + "&order=created_at.desc&limit=24").then(function (d) { return d || get(f + "&limit=24"); }).then(function (d) {
      if (n !== busy) return; busy = 0; rows = Array.isArray(d) ? d : []; rows.forEach(function (b) { b._d = null; }); draw();
    }).catch(function () { if (n === busy) { busy = 0; rows = []; draw(); } });
  }
  function loadNear() {
    if (!pos) return;
    var n = ++busy, dg = radius / 111, dl = radius / (111 * Math.max(0.2, Math.cos(pos[0] * Math.PI / 180)));
    msg = ""; draw();
    get("&latitude=gte." + (pos[0] - dg) + "&latitude=lte." + (pos[0] + dg) + "&longitude=gte." + (pos[1] - dl) + "&longitude=lte." + (pos[1] + dl) + "&limit=300").then(function (d) {
      if (n !== busy) return; busy = 0;
      d = Array.isArray(d) ? d : [];
      rows = d.filter(function (b) { return +b.latitude && +b.longitude; }).map(function (b) { b._d = km([+b.latitude, +b.longitude], pos); return b; })
        .filter(function (b) { return b._d <= radius; }).sort(function (a, b) { return a._d - b._d; }).slice(0, 30);
      draw();
    }).catch(function () { if (n === busy) { busy = 0; rows = []; draw(); } });
  }
  function goNear() {
    mode = "near";
    if (pos) { loadNear(); return; }
    if (!navigator.geolocation) { mode = "city"; msg = t("nopos"); draw(); loadCity(); return; }
    msg = t("wait"); draw();
    navigator.geolocation.getCurrentPosition(function (p) { pos = [p.coords.latitude, p.coords.longitude]; msg = ""; loadNear(); },
      function () { mode = "city"; loadCity(); msg = t("deny"); draw(); setTimeout(function () { if (msg === t("deny")) { msg = ""; draw(); } }, 6000); },
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 });
  }
  sec.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.dataset.m === "city") { mode = "city"; msg = ""; loadCity(); }
    else if (b.dataset.m === "near") { goNear(); }
    else if (b.dataset.r) { radius = +b.dataset.r; save(); loadNear(); }
  });
  function onCity() { if (mode === "city") loadCity(); else draw(); }
  var ci = document.getElementById("city");
  if (ci) { ci.addEventListener("change", onCity); }
  document.addEventListener("pb-city-auto", onCity);
  if (window.PB && PB.onChange) PB.onChange(draw);
  draw(); setTimeout(loadCity, 600);   /* शहर अपने-आप मिलने का थोड़ा इंतज़ार; मिलते ही pb-city-auto से दोबारा */
})();
