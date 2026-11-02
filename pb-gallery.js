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
  function nm(K) { var H = { photo: "प्रोडक्ट और सर्विस", logo: "लोगो", cover: "प्रोफ़ाइल बैनर", front: "होम विज्ञापन", open: "शुरुआती फ़ोटो" }; return K[0] === "photo" ? T(H.photo, "Products & Services") : T(H[K[0]] || K[2], K[2]); }   /* "Gallery" फ़ोल्डर = प्रोडक्ट और सर्विस की फ़ोटो */
  function paid(b) { return !!(PREM && PREM[b.slug] && PREM[b.slug].until); }
  function can(b, k) { return k === "logo" ? true : k === "photo" ? PH(b, "photos") : k === "front" || k === "open" ? PH(b, "banner") : paid(b); }
  function lim(b) { return (window.PBPlan && PBPlan.lim(b.slug, "photos")) || 0; }
  function listOf(b, k) { return k === "photo" ? (PHOTOS[b.slug] || []) : (LIB[b.slug] || []).filter(function (x) { return x.kind === k; }); }
  function total(b) { return (PHOTOS[b.slug] || []).length + (LIB[b.slug] || []).length; }
  /* 🗑️ फ़ोटो हटने पर उसकी फ़ाइल भी Storage से हटाओ (सिर्फ़ इसी दुकान के folder की; गड़बड़ हो तो चुप रहो) */
  async function purge(slug, url) {
    try {
      var m = String(url || "").match(/\/storage\/v1\/object\/public\/shop-logos\/(.+?)(?:\?.*)?$/);
      if (!m || m[1].indexOf(encodeURIComponent(slug) + "/") !== 0) return;
      var sess = await PBA.session(); if (!sess || !sess.access_token) return;
      await fetch(SB + "/storage/v1/object/shop-logos/" + m[1], { method: "DELETE", headers: { apikey: KEY, Authorization: "Bearer " + sess.access_token } });
    } catch (e) {}
  }
  window.pbPurge = purge;
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
      var bar = '<div class="gph"><button type="button" class="gbk" data-gb="1" aria-label="Back">‹</button><b>' + esc(nm(K)) + '</b><span>' + arr.length + '</span>' +
        (ok ? (k === "photo" ? '<button type="button" class="gplus2" data-gsec="' + i + '" style="border:0" title="' + T("फ़ोटो जोड़ें", "Add photos") + '" aria-label="' + T("फ़ोटो जोड़ें", "Add photos") + '">＋</button>' : '<label class="gplus2" title="' + T("फ़ोटो जोड़ें", "Add photos") + '">＋<input type="file" accept="image/*" multiple hidden data-gup="' + k + '" data-i="' + i + '"></label>') : '') + '</div>';
      var ovl = {}, vi = 0, LM = lim(b);   /* प्लान की सीमा के बाहर वाली फ़ोटो: मालिक को दिखती है, ग्राहक को नहीं */
      if (k === "photo") arr.forEach(function (x) { if (!x.hidden) { if (LM && vi >= LM) ovl[x.id] = 1; vi++; } });
      var body = !ok ? '<div class="gbd"><small>' + T("यह सुविधा आपके प्लान में नहीं है।", "This is not in your plan.") + '</small></div>'
        : arr.length ? gridOf(k, arr, arr.map(function (x, n) {
          var on = k === "photo" ? !x.hidden : !!(act && x.url === act);
          return (k === "photo" ? '<div class="gw">' : '') + '<button type="button" class="gt' + (on ? '' : ' hid') + '" data-gv="' + k + '" data-n="' + n + '" data-i="' + i + '"><img src="' + esc(x.url) + '" alt="" loading="lazy">' + (k === "photo" ? '<span class="gsb" title="' + esc(secLabel(x)) + '">' + secOf(x)[1] + '</span>' : '') + '<span class="gck' + (on ? ' on' : '') + '" role="checkbox" aria-checked="' + on + '" data-gk="' + k + '" data-n="' + n + '" data-i="' + i + '">' + (on ? '✔' : '') + '</span>' + (k === "photo" && on && ovl[x.id] ? '<span class="gtm" style="background:rgba(180,35,24,.94)">⛔ ' + T("सीमा पार · छिपी", "Over limit · hidden") + '</span>' : '') + (k === "photo" && !on && x.off_since ? '<span class="gtm">⏳ ' + hrsLeft(x) + T(" घं बचे", "h left") + '</span>' : '') + '</button>' + (k === "photo" ? '<button type="button" class="gdt' + (sumTxt(x) ? ' has' : '') + '" data-gd="' + n + '" data-i="' + i + '" aria-label="' + esc(T("विवरण जोड़ें", "Add details")) + '">' + (sumTxt(x) ? esc(sumTxt(x)) : '＋') + '</button></div>' : '');
        }))
        : '<div class="gbd"><small>' + T("अभी इसमें कोई फ़ोटो नहीं — ऊपर ＋ दबाकर जोड़ें।", "No photos yet — tap ＋ above to add.") + '</small>' + sizeNote(k) + '</div>';
      var hint = arr.length && ok ? '<div class="szn" style="margin:6px 2px">' + (k === "photo" ? T("✔ वाली फ़ोटो सार्वजनिक को दिखती है। ✔ दबाकर चुनें।", "Ticked photos are shown to the public. Tap ✔ to choose.") + ' (' + arr.filter(function (x) { return !x.hidden; }).length + '/' + arr.length + ')' + (arr.some(function (x) { return "off_since" in x; }) ? '<br><span style="color:#b45309">' + T("बिना ✔ की (छिपी) फ़ोटो 72 घंटे बाद अपने-आप हमेशा के लिए हट जाती है। ✔ लगाते ही वह बच जाती है।", "Photos without ✔ (hidden) are deleted permanently after 72 hours. Tick ✔ to keep one.") + '</span>' : '') : T("✔ वाली फ़ोटो चालू है। दूसरी पर ✔ लगाने से वह चालू हो जाएगी।", "The ticked photo is in use. Tick another to switch.")) + '</div>' : '';
      return bar + msg + (arr.length ? sizeNote(k) : "") + hint + body;
    }
    return msg + '<div class="gl">' + KINDS.map(function (K) {   /* चार फ़ोल्डर: सिर्फ़ नाम और गिनती */
      if (!can(b, K[0])) return '<button type="button" class="gfh glk" data-glk="1"><span class="gi">' + K[1] + '</span><span class="gn"><b>' + esc(nm(K)) + '</b></span><i>🔒</i></button>';
      return '<button type="button" class="gfh" data-gf="' + K[0] + '" data-i="' + i + '"><span class="gi">' + K[1] + '</span><span class="gn"><b>' + esc(nm(K)) + '</b></span><i>' + listOf(b, K[0]).length + '</i><em>›</em></button>';
    }).join("") + '</div><div class="glkm" id="glkm" style="display:none">' + T("यह सुविधा आपके प्लान में नहीं है।", "This is not in your plan.") + ' <button type="button" data-setcat="plan">' + T("प्लान देखें", "See plans") + ' ›</button></div>' + (function () {
      var parts = KINDS.map(function (K) { return esc(nm(K)) + " <b>" + listOf(b, K[0]).length + "</b>"; }).join(" · ");
      return '<div class="gsum">' + parts + '<div class="gtot">' + T("कुल", "Total") + ' <b>' + (paid(b) ? total(b) : (PHOTOS[b.slug] || []).length) + '</b> / ' + (lim(b) || 100) + '</div></div>';
    })();
  };
  function gridOf(k, arr, tiles) {   /* फ़ोटो फ़ोल्डर: हर section अलग शीर्षक के साथ */
    if (k !== "photo") return '<div class="gg3">' + tiles.join("") + '</div>';
    var order = [], map = {};
    arr.forEach(function (x, n) { var key = x.sec === "custom" ? "custom:" + (x.sec_name || "") : (x.sec || "products"); if (!map[key]) { map[key] = []; order.push(key); } map[key].push(n); });
    var rank = function (key) { var i2 = SECS.map(function (z) { return z[0]; }).indexOf(key.split(":")[0]); return i2 < 0 ? 9 : i2; };
    order.sort(function (a, b2) { return rank(a) - rank(b2); });
    return order.map(function (key) {
      var ns = map[key], x0 = arr[ns[0]];
      return '<div class="gsh"><b>' + secOf(x0)[1] + ' ' + esc(secLabel(x0)) + '</b><span>' + ns.length + '</span></div><div class="gg3">' + ns.map(function (n) { return tiles[n]; }).join("") + '</div>';
    }).join("");
  }
  function hrsLeft(x) { var t = Date.parse(x.off_since); if (!isFinite(t)) return 72; return Math.max(0, Math.ceil((t + 72 * 3600000 - Date.now()) / 3600000)); }
  function sizeNote(k) {
    var t = k === "logo" ? T("चौकोर फ़ोटो (400×400)। नाम के पास दिखता है।", "Square (400×400). Shown beside your name.")
      : k === "cover" ? T("आड़ी फ़ोटो 16:9 (1200×675)। नाम के पीछे सबसे ऊपर दिखती है।", "Wide 16:9 (1200×675). Shown behind your name at the top.")
      : k === "photo" ? T("कोई भी फ़ोटो (लंबा किनारा 1000 तक)। दुकान पेज पर नीचे दिखती है।", "Any photo (long side up to 1000). Shown on your shop page.")
      : k === "front" ? T("आड़ी फ़ोटो 2:1 (1200×600)। होम पेज पर नीचे चलने वाला पोस्टर।", "Wide 2:1 (1200×600). The poster that slides on the Home page.")
      : T("खड़ी फ़ोटो 9:16 (1080×1920)। लिंक खुलते ही पूरी स्क्रीन पर कुछ सेकंड दिखती है।", "Tall 9:16 (1080×1920). Shown full-screen for a few seconds when your link opens.");
    return '<div class="szn">📐 ' + t + '</div>';
  }

  async function up(i, k, files, meta) {
    var b = ROWS[i], s = b.slug, name = nm(KINDS.filter(function (x) { return x[0] === k; })[0]);
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
        MSG[s] = T("अपलोड हो रहा है…", "Uploading…"); draw();
        ME = await PBA.session();
        var ef = await enhance(file);
        var blob = k === "logo" ? await squareImage(ef) : k === "cover" ? await coverImage(ef) : k === "front" ? await bannerImage(ef) : k === "open" ? await packImg(ef, 1080, 1920, 150000, [1, .8, .64], 1) : await resizeImage(ef, 1000);
        var ext = blob.type === "image/webp" ? "webp" : "jpg", pre = k === "logo" ? "logo-" : k === "cover" ? "cover-" : k === "front" ? "banner-" : k === "open" ? "open-" : "photo-";
        var path = encodeURIComponent(s) + "/" + pre + Date.now() + "-" + f + "." + ext;
        var r = await fetch(SB + "/storage/v1/object/shop-logos/" + path, { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + ME.access_token, "Content-Type": blob.type, "x-upsert": "false" }, body: blob });
        if (!r.ok) throw new Error("upload");
        var pub = SB + "/storage/v1/object/public/shop-logos/" + path;
        if (k === "photo") { var nid = await rpc("pb_photo_add", { p_slug: s, p_url: pub }); if (meta && nid) { try { await rpc("pb_photo_set", { p_slug: s, p_id: nid, p_sec: meta.sec, p_sec_name: meta.name || null, p_title: null, p_price: null, p_disc: null, p_caption: null, p_descr: null, p_extra: null, p_price_from: false, p_sold: false }); } catch (e4) {} } }
        else {
          await rpc("pb_lib_add", { p_slug: s, p_kind: k, p_url: pub });
          if (!active(b, k)) { try { await setActive(b, k, pub); } catch (e) {} }   /* पहली फ़ोटो अपने-आप चालू */
        }
        if (hh) { try { await rpc("pb_img_reg", { p_slug: s, p_hash: hh }); } catch (e3) {} }
        MSG[s] = "";
      } catch (x) {
        var m = String(x && x.message || "");
        MSG[s] = /too many/.test(m) ? T("फ़ोटो की सीमा पूरी हो गई (सारे फ़ोल्डर मिलाकर)।", "Photo limit reached (all folders together).") : /premium/.test(m) ? T("यह सुविधा आपके प्लान में नहीं है।", "This is not in your plan.") : T("फ़ोटो अपलोड नहीं हुई। दोबारा कोशिश करें।", "Could not upload. Try again.");
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
      MSG[s] = /rate/.test(m) ? T("आज बहुत बार बदला। कल कोशिश करें।", "Too many changes today. Try tomorrow.") : /premium|not in plan/.test(m) ? T("यह सुविधा आपके प्लान में नहीं है।", "This is not in your plan.") : T("नहीं हो सका। दोबारा कोशिश करें।", "Could not do it. Try again."); draw();
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
          if (k === "photo") { await rpc("pb_photo_remove", { p_slug: s, p_id: x.id }); purge(s, x.url); } else { await rpc("pb_lib_remove", { p_slug: s, p_id: x.id }); purge(s, x.url); if (act) { if (k === "logo") LOGOS[s] = ""; else if (k === "cover") COVER[s] = ""; else BAN[s] = null; } }
        } else if (w === "hide") await rpc("pb_photo_hide", { p_slug: s, p_id: x.id, p_hidden: !x.hidden });
        else if (w === "set") await setActive(b, k, x.url);
        else if (w === "unset") await setActive(b, k, "");
        close(); await reload(b);
      } catch (er) {
        a.disabled = false; var m = String(er && er.message || "");
        em.textContent = /rate/.test(m) ? T("आज बहुत बार बदला। कल कोशिश करें।", "Too many changes today. Try tomorrow.") : /premium|not in plan/.test(m) ? T("यह सुविधा आपके प्लान में नहीं है।", "This is not in your plan.") : T("नहीं हो सका। दोबारा कोशिश करें।", "Could not do it. Try again.");
      }
    });
  }


  /* ============ 🛍️ Products & Services: हर फ़ोटो का अपना section + विवरण ============ */
  var SECS = [["products", "🛍️", "Products", "प्रोडक्ट"], ["services", "🛠️", "Services", "सर्विस"], ["properties", "🏠", "Properties", "प्रॉपर्टी"], ["menu", "🍽️", "Menu", "मेन्यू"], ["gallery", "🖼️", "Gallery", "गैलरी"], ["custom", "✏️", "Set your work name", "अपने काम का नाम रखें"]];
  var XTRA = { products: ["Size / Pack", "साइज़ / पैक"], services: ["Time taken", "समय"], properties: ["Area (sq ft)", "एरिया (sq ft)"], menu: ["Half / Full", "हाफ़ / फुल"] };
  var GF = null, PEND = null;
  function secOf(x) { var k = (x && x.sec) || "products"; return SECS.filter(function (z) { return z[0] === k; })[0] || SECS[0]; }
  function secLabel(x) { var z = secOf(x); return z[0] === "custom" ? (x.sec_name || T("अपने काम का नाम रखें", "Set your work name")) : T(z[3], z[2]); }
  function inr(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
  function netPrice(x) { return x.price != null && x.disc ? Math.round(x.price * (100 - x.disc) / 100) : x.price; }
  function sumTxt(x) {   /* फ़ोटो के नीचे बटन पर छोटा सार */
    if (x.title) return x.title;
    if (x.price != null) return inr(netPrice(x)) + (x.disc ? " · -" + x.disc + "%" : "");
    return x.caption || x.descr || "";
  }
  (function () {
    if (document.getElementById("pbgCss")) return;
    var st = document.createElement("style"); st.id = "pbgCss";
    st.textContent = ".pbgov{position:fixed;inset:0;z-index:320;background:rgba(10,20,40,.45);display:flex;align-items:flex-end;justify-content:center}.pbgsh{background:#fff;width:100%;max-width:520px;max-height:90vh;overflow:auto;border-radius:20px 20px 0 0;padding:16px 16px 22px}@media(min-width:700px){.pbgov{align-items:center}.pbgsh{border-radius:20px}}" +
      ".pbgsh h3{margin:0 0 4px;font-size:17px;color:#0b2f73}.pbgsh .hn{font-size:12.5px;color:#5b6475;margin:0 0 12px;line-height:1.4}" +
      ".pbgop{display:flex;align-items:center;gap:12px;width:100%;border:1.5px solid #e1e8f5;background:#fff;border-radius:14px;padding:13px 14px;margin-bottom:8px;font:inherit;font-weight:800;font-size:15px;color:#0b2f73;cursor:pointer;text-align:left}.pbgop span{font-size:22px}" +
      ".pbgin{width:100%;padding:11px 12px;border:1.5px solid #dbe5f7;border-radius:11px;font:inherit;font-size:15px;margin:2px 0 8px;background:#fff}textarea.pbgin{min-height:78px;resize:vertical}" +
      ".pbgf label{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;color:#33395a}.pbgf label button{border:0;background:none;color:#b42318;font:inherit;font-weight:800;cursor:pointer;padding:2px 6px}" +
      ".pbgch{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 10px}.pbgch button{border:1.5px dashed #9fb6e6;background:#f4f8ff;color:#1a4fb4;border-radius:999px;padding:8px 13px;font:inherit;font-weight:800;font-size:13.5px;cursor:pointer}" +
      ".pbgsv{width:100%;border:0;border-radius:13px;padding:13px;background:linear-gradient(135deg,#0030c0,#0070f0);color:#fff;font:inherit;font-weight:800;font-size:16px;cursor:pointer;margin-top:6px}.pbgsv:disabled{opacity:.6}" +
      ".pbgtg{display:flex;align-items:center;gap:9px;margin:6px 0;font-size:14px;font-weight:700;color:#33395a}.pbgtg input{width:19px;height:19px}.pbger{color:#b42318;font-size:13px;min-height:16px;margin:4px 0}" +
      ".gsh{display:flex;align-items:center;justify-content:space-between;margin:14px 2px 6px;font-size:14.5px;color:#0b2f73}.gsh:first-child{margin-top:4px}.gsh span{background:#eef3fc;color:#1a4fb4;border-radius:999px;padding:1px 9px;font-size:12.5px;font-weight:800}.gw{min-width:0}.gdt{display:block;width:100%;margin-top:3px;border:1px solid #cfdcf5;background:#f4f8ff;color:#1a4fb4;border-radius:8px;padding:5px 3px;font:inherit;font-weight:800;font-size:12px;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.gdt.has{background:#e9f9ef;border-color:#bfe6cc;color:#14703d}" +
      ".gsb{position:absolute;left:5px;top:5px;background:rgba(255,255,255,.92);border-radius:8px;padding:1px 5px;font-size:13px;box-shadow:0 1px 3px rgba(0,0,0,.25)}";
    document.head.appendChild(st);
  })();
  function mkSheet(inner, onclick) {   /* नीचे से खुलने वाली शीट; फ़ोन का Back उसे पहले बंद करता है */
    var ov = document.createElement("div"), gone = false;
    ov.className = "pbgov"; ov.innerHTML = '<div class="pbgsh" role="dialog" aria-modal="true">' + inner + '</div>';
    document.body.appendChild(ov);
    var prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    function gc() { if (gone) return; gone = true; ov.remove(); document.body.style.overflow = prev; }
    function close() { if (window.PBBack) PBBack.close(); else gc(); }
    if (window.PBBack) PBBack.open(gc);
    ov.addEventListener("click", function (e) { if (e.target === ov) { close(); return; } if (onclick) onclick(e, close); });
    return { ov: ov, sh: ov.firstChild, close: close };
  }
  /* फ़ोटो चुनने के बाद: दुकानदार खुद ज़ूम/खिसकाकर चौकोर फ्रेम में सेट करे। Done = फ्रेम वाला हिस्सा; Skip = जैसी है वैसी; रद्द/Back = null */
  function cropEdit(file, n, tot) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file), im = new Image(), done = false;
      im.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      im.onload = function () {
        var ov = document.createElement("div"); ov.className = "pbgov";
        var F = Math.min(340, Math.floor(Math.min(window.innerWidth, 420) * .86));
        ov.innerHTML = '<div class="pbgsh" role="dialog" aria-modal="true"><h3>' + T("फ़ोटो सेट करें", "Set your photo") + (tot > 1 ? ' (' + n + '/' + tot + ')' : '') + '</h3>' +
          '<p class="hn">' + T("दो उँगली से ज़ूम करें और खिसकाकर सही जगह लगाएँ। जो फ्रेम में दिखेगा वही ग्राहक को दिखेगा।", "Pinch to zoom and drag to place it. What you see in the frame is what customers will see.") + '</p>' +
          '<div id="pbgcf" style="width:' + F + 'px;height:' + F + 'px;margin:6px auto;position:relative;overflow:hidden;background:#fff;border:2px solid #0060f0;border-radius:14px;touch-action:none"></div>' +
          '<input type="range" id="pbgcz" min="0" max="100" value="0" style="width:' + F + 'px;display:block;margin:10px auto" aria-label="' + esc(T("ज़ूम", "Zoom")) + '">' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button type="button" class="pbgsv" id="pbgdn" style="flex:2">' + T("हो गया", "Done") + '</button>' +
          '<button type="button" class="pbgop" id="pbgrs" style="flex:1;margin:0;justify-content:center">' + T("रीसेट", "Reset") + '</button>' +
          '<button type="button" class="pbgop" id="pbgsk" style="flex:1;margin:0;justify-content:center">' + T("ऐसे ही रखें", "Keep as is") + '</button></div>' +
          '<button type="button" class="pbgop" id="pbgcx" style="margin-top:8px;justify-content:center">' + T("रद्द करें", "Cancel") + '</button></div>';
        document.body.appendChild(ov);
        var prevO = document.body.style.overflow; document.body.style.overflow = "hidden";
        var box = ov.querySelector("#pbgcf"), z = ov.querySelector("#pbgcz");
        var iw = im.naturalWidth, ih = im.naturalHeight, fit = Math.min(F / iw, F / ih), cover = Math.max(F / iw, F / ih), mx = cover * 4;
        var sc = cover, tx = 0, ty = 0;
        im.style.cssText = "position:absolute;left:0;top:0;max-width:none;transform-origin:0 0;user-select:none;-webkit-user-drag:none;pointer-events:none";
        box.appendChild(im);
        function clamp() {
          var w = iw * sc, h = ih * sc;
          tx = w >= F ? Math.min(0, Math.max(F - w, tx)) : Math.min(F - w, Math.max(0, tx));
          ty = h >= F ? Math.min(0, Math.max(F - h, ty)) : Math.min(F - h, Math.max(0, ty));
        }
        function paint() { clamp(); im.style.width = iw * sc + "px"; im.style.height = ih * sc + "px"; im.style.transform = "translate(" + tx + "px," + ty + "px)"; z.value = Math.round((sc - fit) / (mx - fit) * 100); }
        function zoomAt(ns, cx, cy) { ns = Math.max(fit, Math.min(mx, ns)); tx = cx - (cx - tx) * ns / sc; ty = cy - (cy - ty) * ns / sc; sc = ns; paint(); }
        function reset() { sc = cover; tx = (F - iw * sc) / 2; ty = (F - ih * sc) / 2; paint(); }
        reset();
        var pts = {}, last = 0;
        box.addEventListener("pointerdown", function (e) { box.setPointerCapture(e.pointerId); pts[e.pointerId] = { x: e.clientX, y: e.clientY }; last = 0; });
        box.addEventListener("pointermove", function (e) {
          var p = pts[e.pointerId]; if (!p) return;
          var ids = Object.keys(pts);
          if (ids.length === 1) { tx += e.clientX - p.x; ty += e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; paint(); }
          else { p.x = e.clientX; p.y = e.clientY; var a = pts[ids[0]], b2 = pts[ids[1]], d = Math.hypot(a.x - b2.x, a.y - b2.y), r = box.getBoundingClientRect();
            if (last) zoomAt(sc * d / last, (a.x + b2.x) / 2 - r.left, (a.y + b2.y) / 2 - r.top); last = d; }
        });
        function up2(e) { delete pts[e.pointerId]; last = 0; }
        box.addEventListener("pointerup", up2); box.addEventListener("pointercancel", up2);
        box.addEventListener("wheel", function (e) { e.preventDefault(); var r = box.getBoundingClientRect(); zoomAt(sc * (e.deltaY < 0 ? 1.1 : 1 / 1.1), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
        z.addEventListener("input", function () { zoomAt(fit + (mx - fit) * z.value / 100, F / 2, F / 2); });
        function fin(v) {
          if (done) return; done = true; ov.remove(); document.body.style.overflow = prevO; URL.revokeObjectURL(url); resolve(v);
        }
        var closeTop = function (v) { pending = v; if (window.PBBack && PBBack.isOpen()) PBBack.close(); else fin(v); }, pending = null;
        if (window.PBBack) PBBack.open(function () { fin(pending); });
        ov.querySelector("#pbgdn").onclick = function () {
          var out = Math.max(300, Math.min(1000, Math.round(F / sc))), c = document.createElement("canvas"); c.width = c.height = out;
          var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, out, out); var k = out / F;
          g.drawImage(im, tx * k, ty * k, iw * sc * k, ih * sc * k);
          c.toBlob(function (bl) { closeTop(bl ? new File([bl], "set.webp", { type: bl.type }) : file); }, "image/webp", .92);
        };
        ov.querySelector("#pbgrs").onclick = reset;
        ov.querySelector("#pbgsk").onclick = function () { closeTop(file); };
        ov.querySelector("#pbgcx").onclick = function () { closeTop(null); };
      };
      im.src = url;
    });
  }
  function fileInput() {
    if (GF) return GF;
    GF = document.createElement("input"); GF.type = "file"; GF.accept = "image/*"; GF.multiple = true; GF.hidden = true; document.body.appendChild(GF);
    GF.addEventListener("change", function () {
      if (GF.files && GF.files.length && PEND) {
        var fs = Array.prototype.slice.call(GF.files), p = PEND; PEND = null;
        (async function () {
          var out = [];
          for (var q = 0; q < fs.length; q++) {
            if (!/^image\//.test(fs[q].type)) { out.push(fs[q]); continue; }
            var r = await cropEdit(fs[q], q + 1, fs.length);
            if (r === null) return;   /* रद्द / Back */
            out.push(r);
          }
          GO[ROWS[p.i].slug] = "photo"; up(p.i, "photo", out, { sec: p.sec, name: p.name });
        })();
      }
      GF.value = "";
    });
    return GF;
  }
  /* ＋ दबाया: पहले चुनें कि यह फ़ोटो किस section की है, फिर फ़ोटो चुनने की खिड़की */
  function chooseSec(i) {
    var inp = fileInput(), custom = false;
    var inner = '<h3>' + T("यह फ़ोटो किसकी है?", "What is this photo for?") + '</h3><p class="hn">' + T("अपना काम चुनें — उसी नाम के हिस्से में ग्राहक को दिखेगी।", "Pick your work — it will show under that heading to customers.") + '</p>' +
      SECS.map(function (z) { return '<button type="button" class="pbgop" data-sec="' + z[0] + '"><span>' + z[1] + '</span>' + esc(T(z[3], z[2])) + '</button>'; }).join("") +
      '<div id="pbgcu" style="display:none"><input class="pbgin" id="pbgcn" maxlength="24" placeholder="' + esc(T("अपने हिस्से का नाम (जैसे: हमारा काम)", "Name of your section (e.g. Our Work)")) + '" aria-label="' + esc(T("हिस्से का नाम", "Section name")) + '"><div class="pbger" id="pbgce"></div><button type="button" class="pbgsv" data-go="1">' + T("आगे — फ़ोटो चुनें", "Next — choose photos") + '</button></div>';
    mkSheet(inner, function (e, close) {
      var o = e.target.closest("[data-sec]"), go = e.target.closest("[data-go]");
      if (o) {
        if (o.dataset.sec === "custom") { document.getElementById("pbgcu").style.display = "block"; custom = true; var c = document.getElementById("pbgcn"); if (c) c.focus(); return; }
        PEND = { i: i, sec: o.dataset.sec, name: "" }; inp.click(); close(); return;
      }
      if (go && custom) {
        var nmv = (document.getElementById("pbgcn").value || "").trim();
        if (!nmv) { document.getElementById("pbgce").textContent = T("नाम लिखें।", "Please type a name."); return; }
        PEND = { i: i, sec: "custom", name: nmv }; inp.click(); close();
      }
    });
  }
  /* फ़ोटो के नीचे ＋: कीमत / डिस्काउंट / Caption / Description जो चाहें वही जोड़ें */
  function details(i, n) {
    var b = ROWS[i], s = b.slug, x = listOf(b, "photo")[n]; if (!x) return;
    var S = { sec: x.sec || "products", name: x.sec_name || "", title: x.title || "", price: x.price == null ? "" : String(x.price), disc: x.disc ? String(x.disc) : "", cap: x.caption || "", desc: x.descr || "", extra: x.extra || "", from: !!x.price_from, sold: !!x.sold };
    var O = { price: S.price !== "", disc: !!S.disc, cap: !!S.cap, desc: !!S.desc, extra: !!S.extra }, err = "", h;
    function field(f, lab, inner) { return '<div class="pbgf"><label>' + lab + '<button type="button" data-rm="' + f + '" aria-label="' + esc(T("हटाएँ", "Remove")) + '">✕</button></label>' + inner + '</div>'; }
    function html() {
      var xl = XTRA[S.sec], chips = [];
      var out = '<div style="display:flex;gap:12px;align-items:center;margin-bottom:10px"><img src="' + esc(x.url) + '" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:12px"><div style="flex:1"><h3>' + T("फ़ोटो का विवरण", "Photo details") + '</h3><div class="hn" style="margin:0">' + T("जो चाहें वही जोड़ें — बाकी ग्राहक को नहीं दिखेगा।", "Add only what you need — the rest stays hidden.") + '</div></div></div>' +
        '<div class="pbgf"><label>' + T("किस हिस्से में", "Section") + '</label><select class="pbgin" data-f="sec">' + SECS.map(function (z) { return '<option value="' + z[0] + '"' + (z[0] === S.sec ? " selected" : "") + '>' + esc(T(z[3], z[2])) + '</option>'; }).join("") + '</select>' +
        (S.sec === "custom" ? '<input class="pbgin" data-f="name" maxlength="24" value="' + esc(S.name) + '" placeholder="' + esc(T("अपने हिस्से का नाम", "Your section name")) + '" aria-label="' + esc(T("हिस्से का नाम", "Section name")) + '">' : '') + '</div>' +
        '<div class="pbgf"><label>' + T("नाम", "Name") + '</label><input class="pbgin" data-f="title" maxlength="80" value="' + esc(S.title) + '" placeholder="' + esc(T("प्रोडक्ट / सर्विस का नाम", "Product / service name")) + '"></div>';
      if (O.price) out += field("price", "💰 " + T("कीमत (₹)", "Price (₹)"), '<input class="pbgin" data-f="price" inputmode="decimal" value="' + esc(S.price) + '" placeholder="499">');
      if (O.disc) { var pv = Number(S.price), dv = Number(S.disc); out += field("disc", "🏷️ " + T("डिस्काउंट (%)", "Discount (%)"), '<input class="pbgin" data-f="disc" inputmode="numeric" maxlength="2" value="' + esc(S.disc) + '" placeholder="10">' + (pv > 0 && dv > 0 && dv < 96 ? '<div class="hn" style="margin-top:-4px">' + T("ग्राहक को दिखेगा: ", "Customers see: ") + '<b>' + inr(Math.round(pv * (100 - dv) / 100)) + '</b> <s>' + inr(pv) + '</s></div>' : '')); }
      if (O.cap) out += field("cap", "📝 " + T("कैप्शन", "Caption"), '<input class="pbgin" data-f="cap" maxlength="120" value="' + esc(S.cap) + '" placeholder="' + esc(T("एक छोटी लाइन", "One short line")) + '">');
      if (O.desc) out += field("desc", "📄 " + T("विवरण", "Description"), '<textarea class="pbgin" data-f="desc" maxlength="600" placeholder="' + esc(T("पूरी जानकारी लिखें", "Write the full details")) + '">' + esc(S.desc) + '</textarea>');
      if (O.extra && xl) out += field("extra", "ℹ️ " + T(xl[1], xl[0]), '<input class="pbgin" data-f="extra" maxlength="60" value="' + esc(S.extra) + '">');
      if (!O.price) chips.push(["price", "💰 " + T("कीमत", "Price")]);
      if (!O.disc) chips.push(["disc", "🏷️ " + T("डिस्काउंट", "Discount")]);
      if (!O.cap) chips.push(["cap", "📝 " + T("कैप्शन", "Caption")]);
      if (!O.desc) chips.push(["desc", "📄 " + T("विवरण", "Description")]);
      if (!O.extra && xl) chips.push(["extra", "ℹ️ " + T(xl[1], xl[0])]);
      if (chips.length) out += '<div class="pbgch">' + chips.map(function (c) { return '<button type="button" data-add="' + c[0] + '">＋ ' + c[1] + '</button>'; }).join("") + '</div>';
      if (O.price) out += '<label class="pbgtg"><input type="checkbox" data-f="from"' + (S.from ? " checked" : "") + '>' + T("“से शुरू” कीमत", "“Starting from” price") + '</label>';
      out += '<label class="pbgtg"><input type="checkbox" data-f="sold"' + (S.sold ? " checked" : "") + '>' + T("अभी उपलब्ध नहीं (बिक चुका)", "Not available now (Sold out)") + '</label>' +
        '<div class="pbger">' + esc(err) + '</div><button type="button" class="pbgsv" data-save="1">' + T("सेव करें", "Save") + '</button>';
      return out;
    }
    function read() { h.sh.querySelectorAll("[data-f]").forEach(function (el) { var f = el.dataset.f; S[f] = el.type === "checkbox" ? el.checked : el.value; }); }
    function draw2() { h.sh.innerHTML = html(); }
    h = mkSheet(html(), async function (e, close) {
      var a = e.target.closest("[data-add]"), r = e.target.closest("[data-rm]"), sv = e.target.closest("[data-save]");
      if (a) { read(); O[a.dataset.add] = true; if (a.dataset.add === "disc") O.price = true; err = ""; draw2(); return; }
      if (r) { read(); var f = r.dataset.rm; O[f] = false; if (f === "price") { S.price = ""; O.disc = false; S.disc = ""; S.from = false; } if (f === "disc") S.disc = ""; if (f === "cap") S.cap = ""; if (f === "desc") S.desc = ""; if (f === "extra") S.extra = ""; draw2(); return; }
      if (e.target.matches && e.target.matches("select[data-f='sec']")) return;
      if (!sv) return;
      read();
      if (S.sec === "custom" && !String(S.name).trim()) { err = T("हिस्से का नाम लिखें।", "Please type the section name."); draw2(); return; }
      var pr = O.price && S.price !== "" ? Number(String(S.price).replace(/,/g, "")) : null, dc = O.disc && pr != null && S.disc !== "" ? Math.round(Number(S.disc)) : null;
      if (pr != null && !(pr >= 0)) { err = T("कीमत सही लिखें।", "Enter a valid price."); draw2(); return; }
      if (dc != null && !(dc >= 1 && dc <= 95)) { err = T("डिस्काउंट 1 से 95 के बीच हो।", "Discount must be between 1 and 95."); draw2(); return; }
      sv.disabled = true;
      try {
        ME = await PBA.session();
        await rpc("pb_photo_set", { p_slug: s, p_id: x.id, p_sec: S.sec, p_sec_name: S.sec === "custom" ? String(S.name).trim() : null, p_title: S.title || null, p_price: pr, p_disc: dc, p_caption: O.cap ? S.cap || null : null, p_descr: O.desc ? S.desc || null : null, p_extra: O.extra ? S.extra || null : null, p_price_from: !!(O.price && S.from), p_sold: !!S.sold });
        close(); await reload(b);
      } catch (er) { sv.disabled = false; err = T("सेव नहीं हो सका। दोबारा कोशिश करें।", "Could not save. Try again."); draw2(); }
    });
    h.sh.addEventListener("change", function (e) { if (e.target.matches("select[data-f='sec']")) { read(); err = ""; draw2(); } });
  }

  window.addEventListener("popstate", function (ev) { if (ev.state && ev.state.pbgal) return; var any = false; for (var k in GO) if (GO[k]) { any = true; GO[k] = ""; } if (any) draw(); });
  document.getElementById("list").addEventListener("click", function (e) {
    var gf = e.target.closest("[data-gf]"); if (gf) { var b = ROWS[+gf.dataset.i]; GO[b.slug] = gf.dataset.gf; try { history.pushState(Object.assign({}, history.state || {}, { pbgal: 1 }), ""); } catch (x) {} draw(); window.scrollTo(0, 0); return; }
    if (e.target.closest("[data-glk]")) { var m = document.getElementById("glkm"); if (m) m.style.display = "block"; return; }
    var gb = e.target.closest("[data-gb]"); if (gb) { if (history.state && history.state.pbgal) history.back(); else { GO = {}; draw(); } return; }
    var gk = e.target.closest("[data-gk]"); if (gk) { e.stopPropagation(); tick(+gk.dataset.i, gk.dataset.gk, +gk.dataset.n); return; }
    var gs = e.target.closest("[data-gsec]"); if (gs) { chooseSec(+gs.dataset.gsec); return; }
    var gd = e.target.closest("[data-gd]"); if (gd) { e.stopPropagation(); details(+gd.dataset.i, +gd.dataset.gd); return; }
    var gv = e.target.closest("[data-gv]"); if (gv) { light(+gv.dataset.i, gv.dataset.gv, +gv.dataset.n); return; }
  });
  document.getElementById("list").addEventListener("change", function (e) {
    var g = e.target.closest("[data-gup]"); if (g && g.files && g.files.length) { var fs = Array.prototype.slice.call(g.files); GO[ROWS[+g.dataset.i].slug] = g.dataset.gup; up(+g.dataset.i, g.dataset.gup, fs); g.value = ""; }
  });
})();
