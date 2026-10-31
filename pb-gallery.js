/* PataBook — My Shop → Gallery: 5 फ़ोल्डर (Logo · Profile Banner · Gallery · Home Ad · Opening Photo)
   हर फ़ोल्डर में ＋ से फ़ोटो जुड़ती है; फ़ोटो पर tap → बड़ी होकर Delete / Set (Photos में दिखाओ-छिपाओ).
   कुल सीमा = plan की "photos" संख्या (सारे फ़ोल्डर मिलाकर, Admin → Plans).
   mybusiness.html की चीज़ें इस्तेमाल होती हैं: rpc, esc, L, $, ME, PBA, SB, KEY, ROWS, draw, PH, PREM, PHOTOS, LOGOS, COVER, BAN,
   squareImage, coverImage, bannerImage, resizeImage, extOf, PDAYS, PDOPEN, posterDays */
(function () {
  var LIB = {}, LOAD = {}, GO = {}, MSG = {};
  var RX = /^https:\/\/kkvbpzysktozghnxplxv\.supabase\.co\/storage\/v1\/object\/public\/shop-logos\//;
  var KINDS = [["logo", "🖼️", "Logo", "Logo"], ["cover", "🌄", "Profile Banner", "Profile Banner"], ["photo", "📷", "Gallery", "Gallery"], ["front", "📢", "Home Ad", "Home Ad"], ["open", "🚪", "Opening Photo", "Opening Photo"]];
  var OPEN = {};
  function en() { return L() === "en"; }
  function T(h, e) { return en() ? e : h; }
  function paid(b) { return !!(PREM && PREM[b.slug] && PREM[b.slug].until); }
  function can(b, k) { return k === "logo" ? true : k === "photo" ? PH(b, "photos") : k === "front" || k === "open" ? PH(b, "banner") : paid(b); }
  function lim(b) { return (window.PBPlan && PBPlan.lim(b.slug, "photos")) || 0; }
  function listOf(b, k) { return k === "photo" ? (PHOTOS[b.slug] || []) : (LIB[b.slug] || []).filter(function (x) { return x.kind === k; }); }
  function total(b) { return (PHOTOS[b.slug] || []).length + (LIB[b.slug] || []).length; }
  function active(b, k) { return k === "logo" ? (LOGOS[b.slug] || "") : k === "cover" ? (COVER[b.slug] || "") : k === "front" ? ((BAN[b.slug] && BAN[b.slug].url) || "") : k === "open" ? (OPEN[b.slug] || "") : ""; }
  async function load(s) {
    try { LIB[s] = (await rpc("pb_lib_my", { p_slug: s })) || []; } catch (e) { LIB[s] = LIB[s] || []; }
    try { PHOTOS[s] = (await rpc("pb_my_photos", { p_slug: s })) || []; } catch (e) {}
    try { var ou = await rpc("pb_open_get", { p_slug: s }); OPEN[s] = typeof ou === "string" ? ou : ""; } catch (e) {}
    draw();
  }
  function reload(b) { LOAD[b.slug] = 1; return load(b.slug); }

  window.galleryBlock = function (b, i) {
    var s = b.slug;
    if (!LOAD[s]) { LOAD[s] = 1; load(s); }
    var msg = MSG[s] ? '<div class="err" style="margin:6px 2px">' + esc(MSG[s]) + '</div>' : '';
    var open = GO[s];
    if (open) {   /* 📂 फ़ोल्डर का पूरा पन्ना: ऊपर ← नाम ＋ ; नीचे फ़ोन जैसी जाली */
      var K = KINDS.filter(function (x) { return x[0] === open; })[0], k = open, arr = listOf(b, k), ok = can(b, k), act = active(b, k);
      var bar = '<div class="gph"><button type="button" class="gbk" data-gb="1" aria-label="Back">‹</button><b>' + esc(K[2]) + '</b><span>' + arr.length + '</span>' +
        (ok ? '<label class="gplus2" title="' + T("फ़ोटो जोड़ें", "Add photos") + '">＋<input type="file" accept="image/*" multiple hidden data-gup="' + k + '" data-i="' + i + '"></label>' : '') + '</div>';
      var body = !ok ? '<div class="gbd"><small>' + T("यह सुविधा आपके plan में नहीं है।", "This is not in your plan.") + '</small></div>'
        : arr.length ? '<div class="gg3">' + arr.map(function (x, n) {
          var on = k === "photo" ? !x.hidden : !!(act && x.url === act);
          return '<button type="button" class="gt' + (on ? '' : ' hid') + '" data-gv="' + k + '" data-n="' + n + '" data-i="' + i + '"><img src="' + esc(x.url) + '" alt="" loading="lazy"><span class="gck' + (on ? ' on' : '') + '" role="checkbox" aria-checked="' + on + '" data-gk="' + k + '" data-n="' + n + '" data-i="' + i + '">' + (on ? '✔' : '') + '</span></button>';
        }).join("") + '</div>'
        : '<div class="gbd"><small>' + T("अभी इसमें कोई फ़ोटो नहीं — ऊपर ＋ दबाकर जोड़ें।", "No photos yet — tap ＋ above to add.") + '</small>' + sizeNote(k) + '</div>';
      var hint = arr.length && ok ? '<div class="szn" style="margin:6px 2px">' + (k === "photo" ? T("✔ वाली फ़ोटो public को दिखती है। ✔ दबाकर चुनें।", "Ticked photos are shown to the public. Tap ✔ to choose.") + ' (' + arr.filter(function (x) { return !x.hidden; }).length + '/' + arr.length + ')' : T("✔ वाली फ़ोटो चालू है। दूसरी पर ✔ लगाने से वह चालू हो जाएगी।", "The ticked photo is in use. Tick another to switch.")) + '</div>' : '';
      return bar + msg + (arr.length ? sizeNote(k) : "") + hint + body;
    }
    return msg + '<div class="gl">' + KINDS.map(function (K) {   /* चार फ़ोल्डर: सिर्फ़ नाम और गिनती */
      if (!can(b, K[0])) return '<button type="button" class="gfh glk" data-glk="1"><span class="gi">' + K[1] + '</span><span class="gn"><b>' + esc(K[2]) + '</b></span><i>🔒</i></button>';
      return '<button type="button" class="gfh" data-gf="' + K[0] + '" data-i="' + i + '"><span class="gi">' + K[1] + '</span><span class="gn"><b>' + esc(K[2]) + '</b></span><i>' + listOf(b, K[0]).length + '</i><em>›</em></button>';
    }).join("") + '</div><div class="glkm" id="glkm" style="display:none">' + T("यह सुविधा आपके प्लान में नहीं है।", "This is not in your plan.") + ' <button type="button" data-setcat="plan">' + T("Plans देखें", "See plans") + ' ›</button></div>' + (function () {
      var parts = KINDS.map(function (K) { return esc(K[2]) + " <b>" + listOf(b, K[0]).length + "</b>"; }).join(" · ");
      return '<div class="gsum">' + parts + '<div class="gtot">' + T("कुल", "Total") + ' <b>' + (paid(b) ? total(b) : (PHOTOS[b.slug] || []).length) + '</b> / ' + (lim(b) || 100) + '</div></div>';
    })();
  };
  function sizeNote(k) {
    var t = k === "logo" ? T("चौकोर फ़ोटो (400×400)। नाम के पास दिखता है।", "Square (400×400). Shown beside your name.")
      : k === "cover" ? T("आड़ी फ़ोटो 16:9 (1200×675)। नाम के पीछे सबसे ऊपर दिखती है।", "Wide 16:9 (1200×675). Shown behind your name at the top.")
      : k === "photo" ? T("कोई भी फ़ोटो (लंबा किनारा 1000 तक)। shop पेज पर नीचे दिखती है।", "Any photo (long side up to 1000). Shown on your shop page.")
      : k === "front" ? T("आड़ी फ़ोटो 2:1 (1200×600)। Home पेज पर नीचे चलने वाला poster।", "Wide 2:1 (1200×600). The poster that slides on the Home page.")
      : T("खड़ी फ़ोटो 9:16 (1080×1920)। link खुलते ही पूरी screen पर कुछ सेकंड दिखती है।", "Tall 9:16 (1080×1920). Shown full-screen for a few seconds when your link opens.");
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
        var hh = await dhash(file), dup = false;
        if (hh) { try { dup = await rpc("pb_img_dup", { p_slug: s, p_hash: hh }); } catch (e2) { dup = false; } }
        if (dup === true) { MSG[s] = "🚫 " + T("यह फ़ोटो किसी दूसरी दुकान की है। कृपया अपनी खुद की फ़ोटो डालें।", "This photo belongs to another shop. Please upload your own photo."); draw(); continue; }
        MSG[s] = T("Upload हो रहा है…", "Uploading…"); draw();
        ME = await PBA.session();
        var ef = await enhance(file);
        var blob = k === "logo" ? await squareImage(ef) : k === "cover" ? await coverImage(ef) : k === "front" ? await bannerImage(ef) : k === "open" ? await packImg(ef, 1080, 1920, 150000, [1, .8, .64], 1) : await resizeImage(ef, 1000);
        var ext = blob.type === "image/webp" ? "webp" : "jpg", pre = k === "logo" ? "logo-" : k === "cover" ? "cover-" : k === "front" ? "banner-" : k === "open" ? "open-" : "photo-";
        var path = encodeURIComponent(s) + "/" + pre + Date.now() + "-" + f + "." + ext;
        var r = await fetch(SB + "/storage/v1/object/shop-logos/" + path, { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + ME.access_token, "Content-Type": blob.type, "x-upsert": "false" }, body: blob });
        if (!r.ok) throw new Error("upload");
        var pub = SB + "/storage/v1/object/public/shop-logos/" + path;
        if (k === "photo") await rpc("pb_photo_add", { p_slug: s, p_url: pub });
        else {
          await rpc("pb_lib_add", { p_slug: s, p_kind: k, p_url: pub });
          if (!active(b, k)) { try { await setActive(b, k, pub); } catch (e) {} }   /* पहली फ़ोटो अपने-आप चालू */
        }
        if (hh) { try { await rpc("pb_img_reg", { p_slug: s, p_hash: hh }); } catch (e3) {} }
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
    else if (k === "open") { await rpc("pb_open_set", { p_slug: s, p_url: url || "" }); OPEN[s] = url || ""; }
  }


  /* दोहराई फ़ोटो की पहचान: 64-bit "उंगलियों का निशान" (dHash)। फ़ोटो थोड़ी छोटी-बड़ी हो तो भी वही रहता है */
  function dhash(file) {
    return new Promise(function (res) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        try {
          var c = document.createElement("canvas"); c.width = 9; c.height = 8; var x = c.getContext("2d"); x.drawImage(im, 0, 0, 9, 8);
          var d = x.getImageData(0, 0, 9, 8).data, g = [], i, j, bits = "", ones = 0;
          for (i = 0; i < 72; i++) g.push(d[i * 4] * .299 + d[i * 4 + 1] * .587 + d[i * 4 + 2] * .114);
          for (i = 0; i < 8; i++) for (j = 0; j < 8; j++) { var b = g[i * 9 + j] > g[i * 9 + j + 1] ? 1 : 0; ones += b; bits += b; }
          var hex = ""; for (i = 0; i < 64; i += 4) hex += parseInt(bits.substr(i, 4), 2).toString(16);
          URL.revokeObjectURL(u); res(ones < 6 || ones > 58 ? null : hex);   /* सादी / एक रंग की फ़ोटो पर जाँच नहीं */
        } catch (e) { URL.revokeObjectURL(u); res(null); }
      };
      im.onerror = function () { URL.revokeObjectURL(u); res(null); }; im.src = u;
    });
  }

  async function tick(i, k, n) {
    var b = ROWS[i], s = b.slug, x = listOf(b, k)[n]; if (!x) return;
    try {
      ME = await PBA.session();
      if (k === "photo") await rpc("pb_photo_hide", { p_slug: s, p_id: x.id, p_hidden: !x.hidden });
      else await setActive(b, k, active(b, k) === x.url ? "" : x.url);
      MSG[s] = ""; await reload(b);
    } catch (er) {
      var m = String(er && er.message || "");
      MSG[s] = /rate/.test(m) ? T("आज बहुत बार बदला। कल कोशिश करें।", "Too many changes today. Try tomorrow.") : /premium|not in plan/.test(m) ? T("यह सुविधा आपके plan में नहीं है।", "This is not in your plan.") : T("नहीं हो सका। दोबारा कोशिश करें।", "Could not do it. Try again."); draw();
    }
  }


  /* ✨ Auto-सुधार: रोशनी / रंग / तीखापन थोड़ा ठीक (फ़ोटो की चीज़ें नहीं बदलतीं)। कुछ गड़बड़ हो तो असली फ़ोटो ही लौटती है */
  function enhance(file) {
    return new Promise(function (res) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onerror = function () { URL.revokeObjectURL(u); res(file); };
      im.onload = function () {
        try {
          var k = Math.min(1, 1600 / Math.max(im.width, im.height)), w = Math.max(1, Math.round(im.width * k)), h = Math.max(1, Math.round(im.height * k));
          var c = document.createElement("canvas"); c.width = w; c.height = h; var x = c.getContext("2d");
          x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.drawImage(im, 0, 0, w, h); URL.revokeObjectURL(u);
          var id = x.getImageData(0, 0, w, h), d = id.data, n = w * h, hist = new Array(256).fill(0), i, L;
          for (i = 0; i < n; i++) { L = (d[i * 4] * 299 + d[i * 4 + 1] * 587 + d[i * 4 + 2] * 114) / 1000 | 0; hist[L]++; }
          var acc = 0, lo = 0, hi = 255; for (i = 0; i < 256; i++) { acc += hist[i]; if (acc >= n * .01) { lo = i; break; } }
          acc = 0; for (i = 255; i >= 0; i--) { acc += hist[i]; if (acc >= n * .01) { hi = i; break; } }
          lo = Math.min(lo, 40); hi = Math.max(hi, 215);                    /* ज़्यादा खींचना नहीं */
          var sc = 255 / (hi - lo), sum = 0;
          for (i = 0; i < 256; i++) sum += hist[i] * Math.min(255, Math.max(0, (i - lo) * sc));
          var mean = Math.max(20, Math.min(235, sum / n)), g = Math.log(.48) / Math.log(mean / 255); g = Math.max(.8, Math.min(1.25, g));
          var lut = new Uint8ClampedArray(256); for (i = 0; i < 256; i++) lut[i] = 255 * Math.pow(Math.min(255, Math.max(0, (i - lo) * sc)) / 255, g);
          for (i = 0; i < n; i++) {
            var r = lut[d[i * 4]], gg = lut[d[i * 4 + 1]], b = lut[d[i * 4 + 2]], y = .299 * r + .587 * gg + .114 * b;
            d[i * 4] = y + (r - y) * 1.08; d[i * 4 + 1] = y + (gg - y) * 1.08; d[i * 4 + 2] = y + (b - y) * 1.08;
          }
          /* हल्का तीखापन (unsharp): असली रंग वही, सिर्फ़ किनारे साफ़ */
          var src = new Uint8ClampedArray(d), a = .22, row = w * 4, ch, p;
          for (var yy = 1; yy < h - 1; yy++) for (var xx = 1; xx < w - 1; xx++) { p = (yy * w + xx) * 4;
            for (ch = 0; ch < 3; ch++) d[p + ch] = src[p + ch] * (1 + 4 * a) - a * (src[p + ch - 4] + src[p + ch + 4] + src[p + ch - row] + src[p + ch + row]); }
          x.putImageData(id, 0, 0);
          c.toBlob(function (bl) { res(bl ? new File([bl], "e.webp", { type: bl.type }) : file); }, "image/webp", .95);
        } catch (e) { try { URL.revokeObjectURL(u); } catch (e2) {} res(file); }
      };
      im.src = u;
    });
  }

  function light(i, k, n) {
    var b = ROWS[i], s = b.slug, arr = listOf(b, k), x = arr[n]; if (!x) return;
    var act = k !== "photo" && active(b, k) === x.url, ov = document.createElement("div");
    ov.style.cssText = "position:fixed;inset:0;z-index:300;background:rgba(8,16,36,.92);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 10px 14px;gap:10px";
    var btn = "border:0;border-radius:12px;padding:12px 18px;font:inherit;font-weight:800;font-size:15px;cursor:pointer;";
    ov.innerHTML = '<button type="button" data-x aria-label="Close" style="position:absolute;top:12px;right:14px;width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.18);color:#fff;font-size:22px;cursor:pointer">✕</button>' +
      '<img src="' + esc(x.url) + '" alt="" style="width:100%;flex:1 1 auto;min-height:0;max-height:calc(100dvh - 170px);border-radius:10px;object-fit:contain;background:#000">' +
      (act ? '<div style="color:#8ef0b0;font-weight:800">✔ ' + T("अभी यही चालू है", "This one is in use") + '</div>' : "") + (x.hidden ? '<div style="color:#ffd28a;font-weight:800">' + T("यह फ़ोटो छिपी है", "This photo is hidden") + '</div>' : "") +
      '<div id="gbr" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">' +
      (k === "photo" ? '<button type="button" data-a="hide" style="' + btn + 'background:' + (x.hidden ? '#1e9e57' : '#fff') + ';color:' + (x.hidden ? '#fff' : '#0b2f73') + '">' + (x.hidden ? "👁️ " + T("दिखाओ", "Show") : "🙈 " + T("छिपाओ", "Hide")) + '</button>'
        : (act ? '<button type="button" data-a="unset" style="' + btn + 'background:#fff;color:#0b2f73">✖ ' + T("चालू नहीं रखना", "Stop using") + '</button>' : '<button type="button" data-a="set" style="' + btn + 'background:#1e9e57;color:#fff">✔ ' + T("Set (चालू करें)", "Set (use this)") + '</button>')) +
      '<button type="button" data-a="del" style="' + btn + 'background:#d93025;color:#fff">🗑️ ' + T("Delete", "Delete") + '</button></div><div id="gme" style="color:#ffb4ab;font-size:13px;min-height:16px"></div>';
    document.body.appendChild(ov);
    var prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    var gone = false;
    function gc() { if (gone) return; gone = true; ov.remove(); document.body.style.overflow = prev; }
    function close() { if (window.PBBack) PBBack.close(); else gc(); }
    if (window.PBBack) PBBack.open(gc);
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

  window.addEventListener("popstate", function (ev) { if (ev.state && ev.state.pbgal) return; var any = false; for (var k in GO) if (GO[k]) { any = true; GO[k] = ""; } if (any) draw(); });
  document.getElementById("list").addEventListener("click", function (e) {
    var gf = e.target.closest("[data-gf]"); if (gf) { var b = ROWS[+gf.dataset.i]; GO[b.slug] = gf.dataset.gf; try { history.pushState(Object.assign({}, history.state || {}, { pbgal: 1 }), ""); } catch (x) {} draw(); window.scrollTo(0, 0); return; }
    if (e.target.closest("[data-glk]")) { var m = document.getElementById("glkm"); if (m) m.style.display = "block"; return; }
    var gb = e.target.closest("[data-gb]"); if (gb) { if (history.state && history.state.pbgal) history.back(); else { GO = {}; draw(); } return; }
    var gk = e.target.closest("[data-gk]"); if (gk) { e.stopPropagation(); tick(+gk.dataset.i, gk.dataset.gk, +gk.dataset.n); return; }
    var gv = e.target.closest("[data-gv]"); if (gv) { light(+gv.dataset.i, gv.dataset.gv, +gv.dataset.n); return; }
  });
  document.getElementById("list").addEventListener("change", function (e) {
    var g = e.target.closest("[data-gup]"); if (g && g.files && g.files.length) { var fs = Array.prototype.slice.call(g.files); GO[ROWS[+g.dataset.i].slug] = g.dataset.gup; up(+g.dataset.i, g.dataset.gup, fs); g.value = ""; }
  });
})();
