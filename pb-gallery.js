/* PataBook — My Shop → Gallery: 4 फ़ोल्डर (Logo · Photos · Banner · Shop Front Photo)
   हर फ़ोल्डर में ＋ से फ़ोटो जुड़ती है; फ़ोटो पर tap → बड़ी होकर Delete / Set (Photos में दिखाओ-छिपाओ).
   कुल सीमा = plan की "photos" संख्या (सारे फ़ोल्डर मिलाकर, Admin → Plans).
   mybusiness.html की चीज़ें इस्तेमाल होती हैं: rpc, esc, L, $, ME, PBA, SB, KEY, ROWS, draw, PH, PREM, PHOTOS, LOGOS, COVER, BAN,
   squareImage, coverImage, bannerImage, resizeImage, extOf, PDAYS, PDOPEN, posterDays */
(function () {
  var LIB = {}, LOAD = {}, GO = {}, MSG = {};
  var RX = /^https:\/\/kkvbpzysktozghnxplxv\.supabase\.co\/storage\/v1\/object\/public\/shop-logos\//;
  var KINDS = [["logo", "🖼️", "Logo", "Logo"], ["photo", "📷", "Photos", "फ़ोटो"], ["cover", "🌄", "Banner", "Banner"], ["front", "🏪", "Shop Front Photo", "दुकान के सामने की फ़ोटो"]];
  function en() { return L() === "en"; }
  function T(h, e) { return en() ? e : h; }
  function paid(b) { return !!(PREM && PREM[b.slug] && PREM[b.slug].until); }
  function can(b, k) { return k === "logo" ? PH(b, "logo") : k === "photo" ? PH(b, "photos") : k === "front" ? PH(b, "banner") : paid(b); }
  function lim(b) { return (window.PBPlan && PBPlan.lim(b.slug, "photos")) || 0; }
  function listOf(b, k) { return k === "photo" ? (PHOTOS[b.slug] || []) : (LIB[b.slug] || []).filter(function (x) { return x.kind === k; }); }
  function total(b) { return (PHOTOS[b.slug] || []).length + (LIB[b.slug] || []).length; }
  function active(b, k) { return k === "logo" ? (LOGOS[b.slug] || "") : k === "cover" ? (COVER[b.slug] || "") : k === "front" ? ((BAN[b.slug] && BAN[b.slug].url) || "") : ""; }
  async function load(s) {
    try { LIB[s] = (await rpc("pb_lib_my", { p_slug: s })) || []; } catch (e) { LIB[s] = LIB[s] || []; }
    try { PHOTOS[s] = (await rpc("pb_my_photos", { p_slug: s })) || []; } catch (e) {}
    draw();
  }
  function reload(b) { LOAD[b.slug] = 1; return load(b.slug); }

  window.galleryBlock = function (b, i) {
    var s = b.slug;
    if (!paid(b)) return '<div class="pm"><small style="margin:0">' + T("Logo, Photos, Banner और Shop Front Photo Member plan के साथ मिलते हैं। Settings में “Member Plan” देखें।", "Logo, Photos, Banner and Shop Front Photo come with a Member plan. See “Member Plan” in Settings.") + '</small></div>';
    if (!LOAD[s]) { LOAD[s] = 1; load(s); }
    var L0 = lim(b), used = total(b);
    var h = '<div class="gcnt">🗂️ ' + T("कुल फ़ोटो", "Total photos") + ': <b>' + used + ' / ' + (L0 || 0) + '</b></div>' + (MSG[s] ? '<div class="err" style="margin:6px 0">' + esc(MSG[s]) + '</div>' : '');
    h += KINDS.map(function (K) {
      var k = K[0], open = GO[s] === k, arr = listOf(b, k), ok = can(b, k), act = active(b, k);
      var cnt = arr.length ? arr.length : "";
      var sub = (k === "photo") ? (arr.filter(function (x) { return !x.hidden; }).length + " " + T("दिख रही", "visible")) : (act ? "✔ " + T("चालू", "in use") : T("कोई नहीं लगी", "none set"));
      var head = '<div class="gfr"><button type="button" class="gfh' + (open ? ' on' : '') + '" data-gf="' + k + '" data-i="' + i + '"><span class="gi">' + K[1] + '</span><span class="gn"><b>' + esc(K[2]) + '</b><small>' + (ok ? esc(sub) : T("plan में नहीं", "not in plan")) + '</small></span><i>' + cnt + '</i><em>' + (open ? '▴' : '▾') + '</em></button>' +
        (ok ? '<label class="gplus" title="' + T("फ़ोटो जोड़ें", "Add photos") + '">＋<input type="file" accept="image/*" multiple hidden data-gup="' + k + '" data-i="' + i + '"></label>' : '') + '</div>';
      var body = "";
      if (open) {
        if (!ok) body = '<div class="gbd"><small>' + T("यह सुविधा आपके plan में नहीं है।", "This is not in your plan.") + '</small></div>';
        else {
          body = '<div class="gbd">' + (arr.length ? '<div class="gg">' + arr.map(function (x, n) {
            var on = k !== "photo" && act && x.url === act;
            return '<button type="button" class="gt' + (x.hidden ? ' hid' : '') + '" data-gv="' + k + '" data-n="' + n + '" data-i="' + i + '"><img src="' + esc(x.url) + '" alt="" loading="lazy">' + (on ? '<span class="gok">✔</span>' : '') + (x.hidden ? '<span class="ghd">' + T("छिपी", "hidden") + '</span>' : '') + '</button>';
          }).join("") + '</div>' : '<small>' + T("अभी इसमें कोई फ़ोटो नहीं — ऊपर ＋ दबाकर जोड़ें।", "No photos yet — tap ＋ above to add.") + '</small>') + sizeNote(k);
          if (k === "front" && PDAYS[s] && PDAYS[s].quota) body += '<div class="bb" style="margin-top:8px"><button type="button" class="sd" data-pdt="' + i + '">📅 ' + T("Date चुनें", "Set Date") + '</button></div>' + (PDOPEN[s] ? posterDays(b, i) : "");
          body += '</div>';
        }
      }
      return '<div class="gf">' + head + body + '</div>';
    }).join("");
    return h;
  };
  function sizeNote(k) {
    var t = k === "logo" ? T("चौकोर फ़ोटो सबसे अच्छी (400×400)।", "Square works best (400×400).") : k === "cover" ? T("चौड़ी फ़ोटो 16:9 (1200×675)।", "Wide 16:9 (1200×675).") : k === "front" ? T("पेज खुलते ही पूरी screen पर कुछ सेकंड दिखती है (1200×600)।", "Shown full-screen for a few seconds when your page opens (1200×600).") : T("दुकान / काम / टीम की फ़ोटो। जो ‘दिखाओ’ पर हैं वही ग्राहकों को दिखती हैं।", "Shop, work or team photos. Only the ‘shown’ ones are visible to customers.");
    return '<div class="szn">📐 ' + t + '</div>';
  }

  async function up(i, k, files) {
    var b = ROWS[i], s = b.slug, name = KINDS.filter(function (x) { return x[0] === k; })[0][2];
    for (var f = 0; f < files.length; f++) {
      var file = files[f];
      try {
        if (!/^image\//.test(file.type)) throw new Error("type");
        MSG[s] = "🔍 " + T("AI फ़ोटो जांच रहा है…", "AI is checking the photo…") + (files.length > 1 ? " (" + (f + 1) + "/" + files.length + ")" : ""); draw();
        var ck = window.PBImg ? await PBImg.check(file, k === "logo" ? { slug: s, kind: "logo" } : { slug: s, kind: "shop", poster: k === "cover" || k === "front" }) : { ok: true };
        if (!ck.ok) { MSG[s] = ck.msg; draw(); continue; }
        MSG[s] = T("Upload हो रहा है…", "Uploading…"); draw();
        ME = await PBA.session();
        var blob = k === "logo" ? await squareImage(file) : k === "cover" ? await coverImage(file) : k === "front" ? await bannerImage(file) : await resizeImage(file, 1000);
        var ext = blob.type === "image/webp" ? "webp" : "jpg", pre = k === "logo" ? "logo-" : k === "cover" ? "cover-" : k === "front" ? "banner-" : "photo-";
        var path = encodeURIComponent(s) + "/" + pre + Date.now() + "-" + f + "." + ext;
        var r = await fetch(SB + "/storage/v1/object/shop-logos/" + path, { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + ME.access_token, "Content-Type": blob.type, "x-upsert": "false" }, body: blob });
        if (!r.ok) throw new Error("upload");
        var pub = SB + "/storage/v1/object/public/shop-logos/" + path;
        if (k === "photo") await rpc("pb_photo_add", { p_slug: s, p_url: pub });
        else {
          await rpc("pb_lib_add", { p_slug: s, p_kind: k, p_url: pub });
          if (!active(b, k)) { try { await setActive(b, k, pub); } catch (e) {} }   /* पहली फ़ोटो अपने-आप चालू */
        }
        MSG[s] = "";
      } catch (x) {
        var m = String(x && x.message || "");
        MSG[s] = /too many/.test(m) ? T("फ़ोटो की सीमा पूरी हो गई (सारे फ़ोल्डर मिलाकर)।", "Photo limit reached (all folders together).") : /premium/.test(m) ? T("यह सुविधा आपके plan में नहीं है।", "This is not in your plan.") : T("फ़ोटो upload नहीं हुई। दोबारा कोशिश करें।", "Could not upload. Try again.");
        break;
      }
    }
    await reload(b);
  }

  async function setActive(b, k, url) {
    var s = b.slug;
    if (k === "logo") { await rpc("pb_set_logo", { p_slug: s, p_url: url || null }); LOGOS[s] = url || ""; }
    else if (k === "cover") { await rpc("pb_profile_banner_set", { p_slug: s, p_url: url || "" }); COVER[s] = url || ""; }
    else if (k === "front") { if (url) { await rpc("pb_banner_set", { p_slug: s, p_url: url }); BAN[s] = await rpc("pb_my_banner", { p_slug: s }); } else { await rpc("pb_banner_remove", { p_slug: s }); BAN[s] = null; } }
  }

  function light(i, k, n) {
    var b = ROWS[i], s = b.slug, arr = listOf(b, k), x = arr[n]; if (!x) return;
    var act = k !== "photo" && active(b, k) === x.url, ov = document.createElement("div");
    ov.style.cssText = "position:fixed;inset:0;z-index:300;background:rgba(8,16,36,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px;gap:12px";
    var btn = "border:0;border-radius:12px;padding:12px 18px;font:inherit;font-weight:800;font-size:15px;cursor:pointer;";
    ov.innerHTML = '<button type="button" data-x aria-label="Close" style="position:absolute;top:12px;right:14px;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.18);color:#fff;font-size:22px;cursor:pointer">✕</button>' +
      '<img src="' + esc(x.url) + '" alt="" style="max-width:100%;max-height:68vh;border-radius:14px;object-fit:contain;background:#000">' +
      (act ? '<div style="color:#8ef0b0;font-weight:800">✔ ' + T("अभी यही चालू है", "This one is in use") + '</div>' : "") + (x.hidden ? '<div style="color:#ffd28a;font-weight:800">' + T("यह फ़ोटो छिपी है", "This photo is hidden") + '</div>' : "") +
      '<div id="gbr" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' +
      (k === "photo" ? '<button type="button" data-a="hide" style="' + btn + 'background:' + (x.hidden ? '#1e9e57' : '#fff') + ';color:' + (x.hidden ? '#fff' : '#0b2f73') + '">' + (x.hidden ? "👁️ " + T("दिखाओ", "Show") : "🙈 " + T("छिपाओ", "Hide")) + '</button>'
        : (act ? '<button type="button" data-a="unset" style="' + btn + 'background:#fff;color:#0b2f73">✖ ' + T("चालू नहीं रखना", "Stop using") + '</button>' : '<button type="button" data-a="set" style="' + btn + 'background:#1e9e57;color:#fff">✔ ' + T("Set (चालू करें)", "Set (use this)") + '</button>')) +
      '<button type="button" data-a="del" style="' + btn + 'background:#d93025;color:#fff">🗑️ ' + T("Delete", "Delete") + '</button></div><div id="gme" style="color:#ffb4ab;font-size:13px;min-height:16px"></div>';
    document.body.appendChild(ov);
    var prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    function close() { ov.remove(); document.body.style.overflow = prev; }
    ov.addEventListener("click", async function (e) {
      if (e.target === ov || e.target.closest("[data-x]")) { close(); return; }
      var a = e.target.closest("[data-a]"); if (!a) return; var w = a.dataset.a, em = ov.querySelector("#gme"); a.disabled = true;
      try {
        if (w === "del") {
          if (!confirm(T("यह फ़ोटो हटाएँ?" + (act ? " (यही चालू है — हट जाएगी)" : ""), "Delete this photo?"))) { a.disabled = false; return; }
          if (k === "photo") await rpc("pb_photo_remove", { p_slug: s, p_id: x.id }); else { await rpc("pb_lib_remove", { p_slug: s, p_id: x.id }); if (act) { if (k === "logo") LOGOS[s] = ""; else if (k === "cover") COVER[s] = ""; else BAN[s] = null; } }
        } else if (w === "hide") await rpc("pb_photo_hide", { p_slug: s, p_id: x.id, p_hidden: !x.hidden });
        else if (w === "set") await setActive(b, k, x.url);
        else if (w === "unset") await setActive(b, k, "");
        close(); await reload(b);
      } catch (er) {
        a.disabled = false; var m = String(er && er.message || "");
        em.textContent = /rate/.test(m) ? T("आज बहुत बार बदला। कल कोशिश करें।", "Too many changes today. Try tomorrow.") : /premium|not in plan/.test(m) ? T("यह सुविधा आपके plan में नहीं है।", "This is not in your plan.") : T("नहीं हो सका। दोबारा कोशिश करें।", "Could not do it. Try again.");
      }
    });
  }

  document.getElementById("list").addEventListener("click", function (e) {
    var gf = e.target.closest("[data-gf]"); if (gf) { var b = ROWS[+gf.dataset.i]; GO[b.slug] = GO[b.slug] === gf.dataset.gf ? "" : gf.dataset.gf; draw(); return; }
    var gv = e.target.closest("[data-gv]"); if (gv) { light(+gv.dataset.i, gv.dataset.gv, +gv.dataset.n); return; }
  });
  document.getElementById("list").addEventListener("change", function (e) {
    var g = e.target.closest("[data-gup]"); if (g && g.files && g.files.length) { var fs = Array.prototype.slice.call(g.files); GO[ROWS[+g.dataset.i].slug] = g.dataset.gup; up(+g.dataset.i, g.dataset.gup, fs); g.value = ""; }
  });
})();
