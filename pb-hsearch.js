/* PataBook — दुकान के पेज के ऊपर (PataBook निशान के पास) खोज का box।
   उसी box में लिखें → होम जैसे सुझाव (दुकानें, "क्या आपका मतलब", कैटेगरी) नीचे; Enter → search.html?q=…
   PBHS.mount(logoEl, barEl) — logoEl: PataBook वाला link (box इसके ठीक बाद लगता है), barEl: header की पट्टी में कोई तत्व */
(function () {
  if (window.PBHS) return;
  function en() { try { if (window.PB && PB.lang) return PB.lang() !== "hi"; return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function T(hi, e) { return en() ? e : hi; }
  var ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  var css = document.createElement("style");
  css.textContent =
    ".hsb{flex:1 1 auto;min-width:0;max-width:420px;height:40px;display:flex;align-items:center;gap:6px;border-radius:999px;border:1.5px solid #c9d8f0;background:#f5f8fd;color:#1a73e8;cursor:text;padding:0 10px 0 12px;margin:0 2px;font:inherit;text-align:left;-webkit-tap-highlight-color:transparent;box-sizing:border-box}" +
    ".hsb svg{flex:none;width:18px;height:18px}.hsb input{flex:1;min-width:0;width:100%;border:0;outline:none!important;background:none;font:inherit;font-size:15px;font-weight:500;color:#14161c;padding:0;height:100%}.hsb input::placeholder{color:#6b7486}.hsb input::-webkit-search-cancel-button{display:none}.hsb:focus-within{border-color:#1a73e8;background:#fff}" +
    
    /* फ़ोन पर: PataBook सिर्फ़ P निशान (पीछे), search box आगे बड़ा */
    "@media(max-width:640px){.hs-has .pbwm{display:none!important}.hs-has .sp,.hs-has #tb{display:none!important}}" +
    ".hsug{position:fixed;left:10px;right:10px;z-index:9990;max-width:720px;margin:0 auto;max-height:62vh;overflow:auto;background:#fff;border:1px solid #e3e6ea;border-radius:18px;box-shadow:0 10px 30px rgba(20,30,60,.18);display:none;font-family:inherit}" +
    ".hsug.on{display:block}.hsug a{display:flex;align-items:center;gap:12px;padding:12px 16px;font-size:16px;cursor:pointer;border-bottom:1px solid #f1f3f4;color:#14161c;text-decoration:none}" +
    ".hsug a:last-child{border:0}.hsug a:hover,.hsug a:focus{background:#f1f6ff;outline:none}.hsug i{font-style:normal;font-size:20px;flex:none;width:34px;text-align:center}" +
    ".hsug small{color:#70757a;font-size:13px;margin-inline-start:auto}.hsug a.shop{background:#f8fbff}.hsug a.shop span{flex:1;min-width:0}" +
    ".hsug a.shop b{display:block;font-size:16px;color:#0b2f73;line-height:1.25}.hsug a.shop em{display:block;font-style:normal;font-size:13px;color:#70757a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".hsug .slg{flex:none;width:34px;height:34px;border-radius:10px;object-fit:cover;background:#fff;box-shadow:0 0 0 1px #e4eaf5}" +
    ".hsug small.km{flex:none;margin-inline-start:6px;background:#e8f0fe;color:#1a73e8;font-weight:700;font-size:12px;border-radius:999px;padding:3px 9px;white-space:nowrap}" +
    ".hsug .sh{font-size:12px;font-weight:700;letter-spacing:.04em;color:#5b6475;background:#f4f7ff;padding:7px 16px}" +
    "";
  document.head.appendChild(css);

  /* ---- होम पेज जैसे सुझाव: 3 अक्षर लिखते ही दुकानें (logo, पता, दूरी) + "क्या आपका मतलब" + कैटेगरी ---- */
  var SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
  try { if (window.PATABOOK_SUPABASE) { SB = PATABOOK_SUPABASE.url || SB; KEY = PATABOOK_SUPABASE.anonKey || KEY; } } catch (e) {}
  var LOGO = /^https:\/\/kkvbpzysktozghnxplxv\.supabase\.co\/storage\/v1\/object\/public\/shop-logos\//;
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var SUBS = [["Automobile", "ऑटोमोबाइल", "🚗", [["Car Wash & Detailing", "कार वॉश"], ["Garage & Repair", "गैरेज"], ["Tyres & Batteries", "टायर बैटरी"], ["Showroom & Dealer", "शोरूम"], ["Spare Parts & Accessories", "स्पेयर पार्ट्स"]]],
    ["Food", "खाना", "🍽️", [["Restaurant", "रेस्टोरेंट"], ["Sweets & Bakery", "मिठाई बेकरी"], ["Cafe & Snacks", "चाय नाश्ता"], ["Catering & Tiffin", "केटरिंग टिफिन"]]],
    ["Health", "हेल्थ", "🏥", [["Dental Care", "डेंटल दांत"], ["Doctor & Clinic", "डॉक्टर क्लिनिक"], ["Medical Store", "मेडिकल दवा"], ["Lab & Diagnostics", "लैब"], ["Gym & Fitness", "जिम योगा"]]],
    ["Shopping", "शॉपिंग", "🛍️", [["Mobile & Electronics", "मोबाइल"], ["Clothing & Fashion", "कपड़े"], ["Grocery & Kirana", "किराना"], ["Jewellery", "ज्वेलरी सोना"], ["Gifts & Stationery", "गिफ्ट स्टेशनरी"]]],
    ["Education", "शिक्षा", "🎓", [["School & College", "स्कूल कॉलेज"], ["Coaching & Tuition", "कोचिंग ट्यूशन"], ["Computer & Skill Training", "कंप्यूटर कोर्स"]]],
    ["Home", "घर की सेवाएँ", "🏠", [["Plumber", "प्लंबर"], ["Electrician", "इलेक्ट्रीशियन"], ["Interior & Furniture", "फर्नीचर"], ["Cleaning & Pest Control", "सफाई पेस्ट"], ["Construction & Hardware", "हार्डवेयर"]]],
    ["Professional", "प्रोफेशनल", "💼", [["Lawyer & Legal", "वकील"], ["CA & Accounting", "सीए टैक्स"], ["Property Dealer", "प्रॉपर्टी"], ["Manufacturer & Wholesaler", "होलसेल"], ["Transport & Logistics", "ट्रांसपोर्ट"]]],
    ["Hotel", "होटल", "🏨", [["Hotel & Lodge", "होटल लॉज"]]]];
  var CATS = []; SUBS.forEach(function (c) { CATS.push({ n: c[0], h: c[1], e: c[2], cat: c[0], ch: c[1], k: (c[0] + " " + c[1]).toLowerCase() }); c[3].forEach(function (x) { CATS.push({ n: x[0], h: x[1], e: c[2], cat: c[0], ch: c[1], k: (x[0] + " " + x[1]).toLowerCase() }); }); });
  var MYPOS = null;
  function myPos() { try { if (!navigator.geolocation || !navigator.permissions) return; navigator.permissions.query({ name: "geolocation" }).then(function (st) { if (st.state !== "granted") return;
    navigator.geolocation.getCurrentPosition(function (p) { MYPOS = [p.coords.latitude, p.coords.longitude]; }, function () {}, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }); }).catch(function () {}); } catch (e) {} }
  function km(b) { var la = +b.latitude, ln = +b.longitude; if (!MYPOS || !la || !ln) return ""; var r = Math.PI / 180, dA = (la - MYPOS[0]) * r, dN = (ln - MYPOS[1]) * r,
    a = Math.pow(Math.sin(dA / 2), 2) + Math.cos(MYPOS[0] * r) * Math.cos(la * r) * Math.pow(Math.sin(dN / 2), 2), k = 2 * 6371 * Math.asin(Math.sqrt(a));
    return k < 1 ? Math.max(50, Math.round(k * 1000 / 50) * 50) + " m" : (k < 10 ? k.toFixed(1) : Math.round(k)) + " km"; }
  function dist(b) { var la = +b.latitude, ln = +b.longitude; if (!MYPOS || !la || !ln) return 1e9; return Math.pow(la - MYPOS[0], 2) + Math.pow((ln - MYPOS[1]) * Math.cos(la * Math.PI / 180), 2); }
  function shopUrl(sl) { return window.PBPlan && PBPlan.url ? PBPlan.url(sl) : "business.html?slug=" + encodeURIComponent(sl); }
  function suggester(inp, bar, go, nav) {
    var box = document.createElement("div"); box.className = "hsug"; box.setAttribute("role", "listbox"); document.body.appendChild(box);
    var SH = [], SW = [], rq = 0, wq = 0, t1 = null, t2 = null, swOk = true;
    function place() { var r = bar.getBoundingClientRect(); box.style.top = Math.round(r.bottom + 6) + "px"; }
    function draw() {
      var v = inp.value.trim().toLowerCase(), E = en();
      if (!v) { box.className = "hsug"; box.innerHTML = ""; return; }
      var m = CATS.filter(function (x) { return x.k.split(/[\s&]+/).some(function (w) { return w && w.indexOf(v) === 0; }); }).slice(0, SH.length ? 4 : 8), h = "";
      if (SW.length) h += '<div class="sh">' + T("क्या आपका मतलब", "DID YOU MEAN") + '</div>' + SW.map(function (x) { return '<a data-n="' + esc(x.label) + '"><i>🔍</i>' + esc(x.label) + '</a>'; }).join("");
      if (SH.length) h += '<div class="sh">' + T("दुकानें", "SHOPS") + '</div>' + SH.map(function (b) { var d = km(b), lg = LOGO.test(b.logo_url || "");
        return '<a class="shop" data-slug="' + esc(b.slug) + '">' + (lg ? '<img class="slg" src="' + esc(b.logo_url) + '" alt="" loading="lazy">' : '<i>🏪</i>') + '<span><b>' + esc(b.name) + '</b><em>📍 ' + esc(b.address || "") + '</em></span>' + (d ? '<small class="km">' + d + '</small>' : '') + '</a>'; }).join("");
      if (m.length) h += (SH.length ? '<div class="sh">' + T("कैटेगरी", "CATEGORIES") + '</div>' : '') + m.map(function (x) { var nm = E ? x.n : x.h, ct = E ? x.cat : x.ch;
        return '<a data-n="' + esc(x.n) + '"><i>' + x.e + '</i>' + esc(nm) + (x.n === x.cat ? '' : '<small>' + esc(ct) + '</small>') + '</a>'; }).join("");
      place(); box.innerHTML = h; box.className = h ? "hsug on" : "hsug";
    }
    function words(v) {
      clearTimeout(t2); if (!swOk || v.length < 3) { if (SW.length) { SW = []; draw(); } return; }
      t2 = setTimeout(function () { var n = ++wq;
        fetch(SB + "/rest/v1/rpc/pb_suggest", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_q: v.slice(0, 60), p_limit: 6 }) })
          .then(function (r) { if (r.status === 404) { swOk = false; return null; } return r.ok ? r.json() : null; })
          .then(function (d) { if (!Array.isArray(d) || n !== wq) return; var low = v.toLowerCase(); SW = d.filter(function (x) { return x && x.label && String(x.label).toLowerCase() !== low; }).slice(0, 4); draw(); }).catch(function () {});
      }, 250);
    }
    function input() {
      var v = inp.value.trim(), c = v.replace(/[*,()%\\:."']/g, " ").trim();
      clearTimeout(t1); if (c.length < 3) { SH = []; SW = []; draw(); return; }
      words(c); draw();
      t1 = setTimeout(function () { var n = ++rq, lc = c.toLowerCase();
        fetch(SB + "/rest/v1/businesses?select=slug,name,address,latitude,longitude,logo_url&is_active=eq.true&deleted_at=is.null&limit=8&name=ilike." + encodeURIComponent("*" + c + "*"), { headers: { apikey: KEY, Authorization: "Bearer " + KEY } })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (rows) { if (!Array.isArray(rows) || n !== rq) return;
            rows.sort(function (a, b) { var sa = String(a.name).toLowerCase().indexOf(lc) === 0 ? 1 : 0, sb = String(b.name).toLowerCase().indexOf(lc) === 0 ? 1 : 0; return (sb - sa) || (dist(a) - dist(b)); });
            SH = rows.slice(0, 6); var p = window.PBPL ? PBPL(SH) : null; return Promise.resolve(p).then(function () { if (n === rq) draw(); }); }).catch(function () {});
      }, 250);
    }
    inp.addEventListener("input", input);
    box.addEventListener("mousedown", function (e) { e.preventDefault(); });   /* box पर दबाने से keyboard / input न छूटे */
    box.addEventListener("click", function (e) { var a = e.target.closest("a"); if (!a) return;
      if (a.dataset.slug) { nav(shopUrl(a.dataset.slug)); return; }
      inp.value = a.dataset.n || ""; go(); });
    addEventListener("resize", function () { if (box.className.indexOf("on") > 0) place(); });
    return { kill: function () { clearTimeout(t1); clearTimeout(t2); rq++; wq++; box.remove(); } };
  }

  function mount(logo, before) {
    if (!logo || !before || !before.parentNode || document.getElementById("hsBtn")) return;
    var bar = before.parentNode;
    /* box अपनी जगह पर ही रहता है (PataBook का निशान नहीं हटता, box बड़ा नहीं होता) — उसी में लिखें, सुझाव नीचे */
    var f = document.createElement("form"); f.id = "hsBtn"; f.className = "hsb"; f.setAttribute("role", "search");
    f.innerHTML = ICON + '<input type="search" enterkeyhint="search" autocomplete="off" maxlength="80">';
    var inp = f.querySelector("input");
    function lab() { var sm = innerWidth <= 400; inp.placeholder = sm ? T("खोजें…", "Search…") : T("दुकान खोजें…", "Search shops…"); inp.setAttribute("aria-label", T("दूसरी दुकान या सामान खोजें", "Search other shops or products")); }
    lab(); bar.insertBefore(f, logo.nextSibling); bar.classList.add("hs-has");
    if (window.PB && PB.onChange) { try { PB.onChange(lab); } catch (e) {} }
    addEventListener("resize", lab);
    function nav(u) { location.href = u; }
    function go() { var q = inp.value.trim(); if (!q) { inp.focus(); return; } nav("search.html?q=" + encodeURIComponent(q)); }
    f.onsubmit = function (e) { e.preventDefault(); go(); };
    /* 🕘 पिछली खोजें (pb-recent.js — ज़रूरत पर ही लोड) */
    (function () { function at() { try { PBRecent.attach(inp); } catch (e) {} } if (window.PBRecent) return at(); var s = document.createElement("script"); s.src = "pb-recent.js?v=3"; s.onload = at; document.head.appendChild(s); })();
    var sg = null;
    inp.addEventListener("focus", function () { myPos(); if (!sg) sg = suggester(inp, bar, go, nav); });
    inp.addEventListener("keydown", function (e) { if (e.key === "Escape") { inp.value = ""; inp.dispatchEvent(new Event("input")); inp.blur(); } });
    inp.addEventListener("blur", function () { setTimeout(function () { if (document.activeElement !== inp && sg) { sg.kill(); sg = null; } }, 150); });
    /* दूसरी दुकान खोलकर Back से लौटे → सुझाव साफ़ */
    addEventListener("pageshow", function (e) { if (e.persisted && sg) { sg.kill(); sg = null; } });
  }
  window.PBHS = { mount: mount };
})();
