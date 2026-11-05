/* PataBook — My Shop → Gallery: फ़ोल्डर (Logo · Profile Banner · Gallery · Home Ad) + 🎬 Loader (50 में से चुनें; पुराना Opening Photo हटाया)
   हर फ़ोल्डर में ＋ से फ़ोटो जुड़ती है; फ़ोटो पर tap → बड़ी होकर Delete / Set (Photos में दिखाओ-छिपाओ).
   कुल सीमा = plan की "photos" संख्या (सारे फ़ोल्डर मिलाकर, Admin → Plans).
   mybusiness.html की चीज़ें इस्तेमाल होती हैं: rpc, esc, L, $, ME, PBA, SB, KEY, ROWS, draw, PH, PREM, PHOTOS, LOGOS, COVER, BAN,
   squareImage, coverImage, bannerImage, resizeImage, extOf, PDAYS, PDOPEN, posterDays */
(function () {
  var LIB = {}, LOAD = {}, GO = {}, MSG = {};
  var RX = /^https:\/\/kkvbpzysktozghnxplxv\.supabase\.co\/storage\/v1\/object\/public\/shop-logos\//;
  var KINDS = [["logo", "🖼️", "Logo", "Logo"], ["cover", "🌄", "Profile Banner", "Profile Banner"], ["photo", "📷", "Gallery", "Gallery"], ["front", "📢", "Home Ad", "Home Ad"], ["open", "🚪", "Opening Photo", "Opening Photo"]];
  var OPEN = {};
  var SHOWN = KINDS.filter(function (K) { return K[0] !== "open"; });   /* 🚪 Opening Photo अब नहीं दिखता (फ़ोटो database में वैसी ही रहती हैं) */
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
  function hp(b, p) { return !b.h || (b.perms || []).indexOf(p) >= 0; }   /* सहायक को यह इजाज़त है? (मालिक: हाँ) */
  function isH(s) { return !!((ROWS || []).filter(function (r) { return r && r.slug === s; })[0] || {}).h; }
  async function load(s) {
    if (isH(s)) { LIB[s] = []; try { PHOTOS[s] = (await rpc("pb_my_photos", { p_slug: s })) || []; } catch (e) {} draw(); return; }   /* सहायक: सिर्फ़ फ़ोटो */
    try { LIB[s] = (await rpc("pb_lib_my", { p_slug: s })) || []; } catch (e) { LIB[s] = LIB[s] || []; }
    try { PHOTOS[s] = (await rpc("pb_my_photos", { p_slug: s })) || []; } catch (e) {}
    if (!ILOADED[s]) introLoad(s);
    if (!DLOADED[s]) designLoad(s);
    draw();
  }
  function reload(b) { LOAD[b.slug] = 1; return load(b.slug); }

  window.galleryBlock = function (b, i) {
    var s = b.slug;
    if (b.h) GO[s] = "photo";
    if (!LOAD[s]) { LOAD[s] = 1; load(s); }
    var msg = MSG[s] ? '<div class="err" style="margin:6px 2px">' + esc(MSG[s]) + '</div>' : '';
    var open = GO[s];
    if (open === "staff" && !b.h) return staffPage(b, i);
    if (open === "intro" && !b.h) return introPage(b, i);
    if (open === "design" && !b.h) return designPage(b, i);
    if (open) {   /* 📂 फ़ोल्डर का पूरा पन्ना: ऊपर ← नाम ＋ ; नीचे फ़ोन जैसी जाली */
      var K = KINDS.filter(function (x) { return x[0] === open; })[0], k = open, arr = listOf(b, k), ok = can(b, k), act = active(b, k);
      var bar = '<div class="gph">' + (b.h ? '' : '<button type="button" class="gbk" data-gb="1" aria-label="' + T("वापस", "Back") + '">‹</button>') + '<b>' + esc(nm(K)) + '</b><span>' + arr.length + '</span>' +
        (ok && hp(b, "add") ? (k === "photo" ? '<button type="button" class="gplus2" data-gsec="' + i + '" style="border:0" title="' + T("फ़ोटो जोड़ें", "Add photos") + '" aria-label="' + T("फ़ोटो जोड़ें", "Add photos") + '">＋</button>' : '<label class="gplus2" title="' + T("फ़ोटो जोड़ें", "Add photos") + '">＋<input type="file" accept="image/*" multiple hidden data-gup="' + k + '" data-i="' + i + '"></label>') : '') + '</div>';
      var ovl = {}, vi = 0, LM = lim(b);   /* प्लान की सीमा के बाहर वाली फ़ोटो: मालिक को दिखती है, ग्राहक को नहीं */
      if (k === "photo") arr.forEach(function (x) { if (!x.hidden) { if (LM && vi >= LM) ovl[x.id] = 1; vi++; } });
      var body = !ok ? '<div class="gbd"><small>' + T("यह सुविधा आपके प्लान में नहीं है।", "This is not in your plan.") + '</small></div>'
        : arr.length ? gridOf(k, arr, arr.map(function (x, n) {
          var on = k === "photo" ? !x.hidden : !!(act && x.url === act);
          return (k === "photo" ? '<div class="gw">' : '') + '<button type="button" class="gt' + (on ? '' : ' hid') + '" data-gv="' + k + '" data-n="' + n + '" data-i="' + i + '"><img src="' + esc(x.url) + '" alt="" loading="lazy">' + (k === "photo" ? '<span class="gsb" title="' + esc(secLabel(x)) + '">' + secOf(x)[1] + '</span>' : '') + (k === "photo" && !b.h && x.by_role === "helper" ? '<span class="gby" title="' + esc(x.by_who || "") + '">👤 ' + T("सहायक", "Helper") + '</span>' : '') + (hp(b, "hide") || k !== "photo" ? '<span class="gck' + (on ? ' on' : '') + '" role="checkbox" aria-checked="' + on + '" data-gk="' + k + '" data-n="' + n + '" data-i="' + i + '">' + (on ? '✔' : '') + '</span>' : '') + (k === "photo" && on && ovl[x.id] ? '<span class="gtm" style="background:rgba(180,35,24,.94)">⛔ ' + T("सीमा पार · छिपी", "Over limit · hidden") + '</span>' : '') + (k === "photo" && !on && x.off_since ? '<span class="gtm">⏳ ' + hrsLeft(x) + T(" घं बचे", "h left") + '</span>' : '') + '</button>' + (k === "photo" && hp(b, "edit") ? '<button type="button" class="gdt' + (sumTxt(x) ? ' has' : '') + '" data-gd="' + n + '" data-i="' + i + '" aria-label="' + esc(T("विवरण जोड़ें", "Add details")) + '">' + (sumTxt(x) ? esc(sumTxt(x)) : '＋') + '</button></div>' : '');
        }))
        : '<div class="gbd"><small>' + T("अभी इसमें कोई फ़ोटो नहीं — ऊपर ＋ दबाकर जोड़ें।", "No photos yet — tap ＋ above to add.") + '</small>' + sizeNote(k) + '</div>';
      var hint = arr.length && ok ? '<div class="szn" style="margin:6px 2px">' + (k === "photo" ? T("✔ वाली फ़ोटो सार्वजनिक को दिखती है। ✔ दबाकर चुनें।", "Ticked photos are shown to the public. Tap ✔ to choose.") + ' (' + arr.filter(function (x) { return !x.hidden; }).length + '/' + arr.length + ')' + (arr.some(function (x) { return "off_since" in x; }) ? '<br><span style="color:#b45309">' + T("बिना ✔ की (छिपी) फ़ोटो 72 घंटे बाद अपने-आप हमेशा के लिए हट जाती है। ✔ लगाते ही वह बच जाती है।", "Photos without ✔ (hidden) are deleted permanently after 72 hours. Tick ✔ to keep one.") + '</span>' : '') : T("✔ वाली फ़ोटो चालू है। दूसरी पर ✔ लगाने से वह चालू हो जाएगी।", "The ticked photo is in use. Tick another to switch.")) + '</div>' : '';
      return bar + msg + (arr.length ? sizeNote(k) : "") + hint + body;
    }
    return msg + '<div class="gl">' + SHOWN.map(function (K) {   /* चार फ़ोल्डर: सिर्फ़ नाम और गिनती */
      if (!can(b, K[0])) return '<button type="button" class="gfh glk" data-glk="1"><span class="gi">' + K[1] + '</span><span class="gn"><b>' + esc(nm(K)) + '</b></span><i>🔒</i></button>';
      return '<button type="button" class="gfh" data-gf="' + K[0] + '" data-i="' + i + '"><span class="gi">' + K[1] + '</span><span class="gn"><b>' + esc(nm(K)) + '</b></span><i>' + listOf(b, K[0]).length + '</i><em>›</em></button>';
    }).join("") + (b.h ? '' : introRow(b, i) + designRow(b, i)) + '</div>' + '<div class="glkm" id="glkm" style="display:none">' + T("यह सुविधा आपके प्लान में नहीं है।", "This is not in your plan.") + ' <button type="button" data-setcat="plan">' + T("प्लान देखें", "See plans") + ' ›</button></div>' + (function () {
      var parts = SHOWN.map(function (K) { return esc(nm(K)) + " <b>" + listOf(b, K[0]).length + "</b>"; }).join(" · ");
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
    if (k === "photo" && !hp(b, "hide")) { MSG[s] = T("आपको फ़ोटो दिखाने/छिपाने की इजाज़त नहीं है।", "You are not allowed to show or hide photos."); draw(); return; }
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
      (k === "photo" ? (hp(b, "hide") ? '<button type="button" data-a="hide" style="' + btn + 'background:' + (x.hidden ? '#1e9e57' : '#fff') + ';color:' + (x.hidden ? '#fff' : '#0b2f73') + '">' + (x.hidden ? "👁️ " + T("दिखाओ", "Show") : "🙈 " + T("छिपाओ", "Hide")) + '</button>' : '')
        : (act ? '<button type="button" data-a="unset" style="' + btn + 'background:#fff;color:#0b2f73">✖ ' + T("चालू नहीं रखना", "Stop using") + '</button>' : '<button type="button" data-a="set" style="' + btn + 'background:#1e9e57;color:#fff">✔ ' + T("Set (चालू करें)", "Set (use this)") + '</button>')) +
      (hp(b, "remove") ? '<button type="button" data-a="del" style="' + btn + 'background:#d93025;color:#fff">🗑️ ' + T("हटाएँ", "Delete") + '</button>' : '') + '</div><div id="gme" style="color:#ffb4ab;font-size:13px;min-height:16px"></div>';
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
      ".hcard{border:1px solid #e1e8f5;border-radius:14px;padding:10px 12px;margin:8px 0;background:#fff}.hpl{font-size:12.5px;color:#5b6475;margin:6px 0 2px}.hpm{display:flex;align-items:center;gap:8px;font-size:13.5px;padding:5px 0}.hpm input{width:18px;height:18px}.pbok{color:#1e7a46;font-weight:700;font-size:13.5px;margin:8px 2px}" +
      ".gby{position:absolute;left:5px;bottom:5px;background:rgba(255,255,255,.94);border-radius:8px;padding:1px 6px;font-size:11px;font-weight:700;color:#0b2f73;box-shadow:0 1px 3px rgba(0,0,0,.25)}" +
      ".ghl{display:flex;align-items:center;gap:10px;width:100%;margin-top:10px;padding:12px 14px;border:1px solid #d8e1ee;border-radius:14px;background:#fff;text-align:left}.ghl span{font-size:22px}.ghl b{font-size:14px;color:#0b2f73}.ghl em{margin-left:auto;font-style:normal;font-size:12px;color:#5b6475}" +
      ".hrow{display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid #eef2f8;font-size:13.5px}.hrow b{flex:1;min-width:0;word-break:break-all}.hrow img{width:36px;height:36px;object-fit:cover;border-radius:8px;flex:none}.hrow small{display:block;color:#5b6475;font-size:12px}.hrow button{border:1px solid #f0c9c4;color:#b42318;background:#fff;border-radius:999px;padding:4px 10px;font-size:12px}" +
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
  var RATIO = { logo: 1, front: 2, cover: 16 / 9, open: 9 / 16 };   /* कौन-सी फ़ोटो किस नाप के फ्रेम में सेट होगी */
  window.pbCrop = function (f, r) { return cropEdit(f, 1, 1, r); };
  function cropEdit(file, n, tot, ratio) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file), im = new Image(), done = false;
      im.onerror = function () { URL.revokeObjectURL(url); resolve(file); };
      im.onload = function () {
        var ov = document.createElement("div"); ov.className = "pbgov";
        var F = Math.min(340, Math.floor(Math.min(window.innerWidth, 420) * .86)), R = ratio > 0 ? ratio : 1, FW, FH;
        if (R >= 1) { FW = F; FH = Math.round(F / R); } else { FH = Math.round(F * 1.15); FW = Math.round(FH * R); }
        ov.innerHTML = '<div class="pbgsh" role="dialog" aria-modal="true"><h3>' + T("फ़ोटो सेट करें", "Set your photo") + (tot > 1 ? ' (' + n + '/' + tot + ')' : '') + '</h3>' +
          '<p class="hn">' + T("दो उँगली से ज़ूम करें और खिसकाकर सही जगह लगाएँ। जो फ्रेम में दिखेगा वही ग्राहक को दिखेगा।", "Pinch to zoom and drag to place it. What you see in the frame is what customers will see.") + '</p>' +
          '<div id="pbgcf" style="width:' + FW + 'px;height:' + FH + 'px;margin:6px auto;position:relative;overflow:hidden;background:#fff;border:2px solid #0060f0;border-radius:14px;touch-action:none"></div>' +
          '<input type="range" id="pbgcz" min="0" max="100" value="0" style="width:' + Math.max(FW, 200) + 'px;display:block;margin:10px auto" aria-label="' + esc(T("ज़ूम", "Zoom")) + '">' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button type="button" class="pbgsv" id="pbgdn" style="flex:2">' + T("हो गया", "Done") + '</button>' +
          '<button type="button" class="pbgop" id="pbgrs" style="flex:1;margin:0;justify-content:center">' + T("रीसेट", "Reset") + '</button>' +
          '<button type="button" class="pbgop" id="pbgsk" style="flex:1;margin:0;justify-content:center">' + T("ऐसे ही रखें", "Keep as is") + '</button></div>' +
          '<button type="button" class="pbgop" id="pbgcx" style="margin-top:8px;justify-content:center">' + T("रद्द करें", "Cancel") + '</button></div>';
        document.body.appendChild(ov);
        var prevO = document.body.style.overflow; document.body.style.overflow = "hidden";
        var box = ov.querySelector("#pbgcf"), z = ov.querySelector("#pbgcz");
        var iw = im.naturalWidth, ih = im.naturalHeight, fit = Math.min(FW / iw, FH / ih), cover = Math.max(FW / iw, FH / ih), mx = cover * 4;
        var sc = cover, tx = 0, ty = 0;
        im.style.cssText = "position:absolute;left:0;top:0;max-width:none;transform-origin:0 0;user-select:none;-webkit-user-drag:none;pointer-events:none";
        box.appendChild(im);
        function clamp() {
          var w = iw * sc, h = ih * sc;
          tx = w >= FW ? Math.min(0, Math.max(FW - w, tx)) : Math.min(FW - w, Math.max(0, tx));
          ty = h >= FH ? Math.min(0, Math.max(FH - h, ty)) : Math.min(FH - h, Math.max(0, ty));
        }
        function paint() { clamp(); im.style.width = iw * sc + "px"; im.style.height = ih * sc + "px"; im.style.transform = "translate(" + tx + "px," + ty + "px)"; z.value = Math.round((sc - fit) / (mx - fit) * 100); }
        function zoomAt(ns, cx, cy) { ns = Math.max(fit, Math.min(mx, ns)); tx = cx - (cx - tx) * ns / sc; ty = cy - (cy - ty) * ns / sc; sc = ns; paint(); }
        function reset() { sc = cover; tx = (FW - iw * sc) / 2; ty = (FH - ih * sc) / 2; paint(); }
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
        z.addEventListener("input", function () { zoomAt(fit + (mx - fit) * z.value / 100, FW / 2, FH / 2); });
        function fin(v) {
          if (done) return; done = true; ov.remove(); document.body.style.overflow = prevO; URL.revokeObjectURL(url); resolve(v);
        }
        var closeTop = function (v) { pending = v; if (window.PBBack && PBBack.isOpen()) PBBack.close(); else fin(v); }, pending = null;
        if (window.PBBack) PBBack.open(function () { fin(pending); });
        ov.querySelector("#pbgdn").onclick = function () {
          var ow = Math.round(FW / sc), oh = Math.round(FH / sc), mm = Math.min(1, 1600 / Math.max(ow, oh)), cw = Math.max(200, Math.round(ow * mm)), c = document.createElement("canvas"); c.width = cw; c.height = Math.round(cw * FH / FW);
          var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); var k = cw / FW;
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
  /* 👥 फ़ोटो सहायक: मालिक स्टाफ़ को जोड़ता है (प्लान की सीमा तक) और देखता है किसने क्या किया */
  function actTxt(a) {
    return ({ add: T("फ़ोटो जोड़ी", "added a photo"), edit: T("विवरण बदला", "edited details"), hide: T("फ़ोटो छिपाई", "hid a photo"), show: T("फ़ोटो दिखाई", "showed a photo"),
      remove: T("फ़ोटो हटाई", "removed a photo"), live_on: T("फ़ोटो चालू की", "turned a photo on"), live_off: T("फ़ोटो बंद की", "turned a photo off") })[a] || a;
  }
  function whoTxt(x) { return x.role === "owner" ? T("आप", "You") : x.role === "admin" ? "PataBook" : String(x.who || "?"); }
  function helperErr(m) {
    m = String(m || "");
    return /helper limit/.test(m) ? T("आपके प्लान में इतने ही सहायक जुड़ सकते हैं।", "Your plan allows only this many helpers.")
      : /bad contact/.test(m) ? T("सही ईमेल या 10 अंकों का मोबाइल नंबर लिखें।", "Enter a valid email or a 10-digit mobile number.")
      : /already/.test(m) ? T("यह सहायक पहले से जुड़ा है।", "This helper is already added.")
      : /not allowed|login/.test(m) ? T("यह सिर्फ़ दुकान का मालिक कर सकता है।", "Only the shop owner can do this.")
      : T("नहीं हो पाया। दोबारा कोशिश करें।", "Could not do it. Try again.");
  }
  var HST = {};
  function staffOpen(i) {
    var s = ROWS[i].slug; GO[s] = "staff"; HST[s] = HST[s] || {};
    try { history.pushState(Object.assign({}, history.state || {}, { pbgal: 1 }), ""); } catch (x) {}
    draw(); window.scrollTo(0, 0); staffLoad(s);
  }
  async function staffLoad(s) {
    var S = HST[s] = HST[s] || {};
    try { S.D = (await rpc("pb_helper_list", { p_slug: s })) || { lim: 0, items: [] }; S.err = ""; } catch (e) { S.D = null; S.err = T("लोड नहीं हुआ।", "Could not load."); }
    try { S.A = (await rpc("pb_photo_activity", { p_slug: s })) || []; } catch (e) { S.A = []; }
    draw();
  }
  var PERMS = [["add", "➕", "फ़ोटो जोड़ना", "Add photos"], ["edit", "✏️", "कीमत / कैप्शन बदलना", "Edit price & details"], ["hide", "👁️", "फ़ोटो दिखाना / छिपाना", "Show / hide photos"], ["remove", "🗑️", "फ़ोटो हटाना", "Remove photos"]];
  function permBoxes(sel, attr) {
    return PERMS.map(function (q) { return '<label class="hpm"><input type="checkbox" ' + attr + '="' + q[0] + '"' + (sel.indexOf(q[0]) >= 0 ? " checked" : "") + '> ' + q[1] + ' ' + esc(T(q[2], q[3])) + '</label>'; }).join("");
  }
  async function rpcFb(fn, args, fb) {   /* नया SQL न चला हो तो पुराने तरीके से */
    try { return await rpc(fn, args); } catch (e) { if (fb && (e.status === 404 || /function|schema cache/i.test(e.message || ""))) return rpc(fb[0], fb[1]); throw e; }
  }
  async function staffAct(i, mode, id) {
    var s = ROWS[i].slug, S = HST[s] = HST[s] || {};
    if (S.busy) return; S.busy = 1; S.msg = ""; S.ok = "";
    try {
      if (mode === "add") {
        var v = ((document.getElementById("pbghc") || {}).value || "").trim(), np = S.np || ["add", "edit"];
        if (!v) { S.msg = T("पहले स्टाफ़ का ईमेल या मोबाइल नंबर लिखें।", "First type the staff's email or mobile number."); S.busy = 0; draw(); return; }
        if (!np.length) { S.msg = T("कम से कम एक इजाज़त चुनें।", "Choose at least one permission."); S.busy = 0; draw(); return; }
        S.msg = "⏳ " + T("जोड़ा जा रहा है…", "Adding…"); draw();
        await rpcFb("pb_helper_add", { p_slug: s, p_contact: v, p_perms: np }, ["pb_helper_add", { p_slug: s, p_contact: v }]);
        S.msg = ""; S.ok = "✅ " + T("स्टाफ़ जुड़ गया।", "Staff added."); S.np = null;
      } else {
        if (!confirm(T("इस स्टाफ़ को हटाएँ? उसकी पहुँच तुरंत बंद हो जाएगी।", "Remove this staff member? Their access will stop right away."))) { S.busy = 0; return; }
        await rpc("pb_helper_remove", { p_slug: s, p_id: id }); S.ok = "✅ " + T("स्टाफ़ हट गया।", "Staff removed.");
      }
      await staffLoad(s);
    } catch (x) { S.msg = helperErr(x && x.message); S.ok = ""; draw(); }
    S.busy = 0;
  }
  async function staffPerm(i, id) {   /* एक स्टाफ़ की इजाज़तें बदलीं → तुरंत सेव */
    var s = ROWS[i].slug, S = HST[s] = HST[s] || {}, boxes = document.querySelectorAll('[data-hpr="' + id + '"]'), ps = [];
    boxes.forEach(function (c) { if (c.checked) ps.push(c.dataset.hp2); });
    if (!ps.length) { S.msg = T("कम से कम एक इजाज़त रखें। या स्टाफ़ को हटाएँ।", "Keep at least one permission, or remove the staff."); S.ok = ""; await staffLoad(s); return; }
    try { await rpc("pb_helper_set", { p_slug: s, p_id: id, p_perms: ps }); S.msg = ""; S.ok = "✅ " + T("इजाज़तें सेव हो गईं।", "Permissions saved."); }
    catch (x) { S.msg = helperErr(x && x.message); S.ok = ""; }
    await staffLoad(s);
  }
  function staffPage(b, i) {
    var S = HST[b.slug] || {}, D = S.D, A = S.A || [], lim = D ? +D.lim || 0 : 0, items = D && D.items ? D.items : [], np = S.np || ["add", "edit"];
    var h = '<div class="gph"><button type="button" class="gbk" data-gb="1" aria-label="' + T("वापस", "Back") + '">‹</button><b>👥 ' + T("स्टाफ़ एक्सेस", "Staff access") + '</b></div>' +
      '<p class="hn" style="margin:6px 2px">' + T("स्टाफ़ सिर्फ़ \"प्रोडक्ट और सर्विस\" की फ़ोटो पर, आपकी चुनी इजाज़तों के हिसाब से काम कर सकता है। लोगो, बैनर, प्लान और सेटिंग सिर्फ़ आपके पास रहती हैं। हर स्टाफ़ की इजाज़त अलग रख सकते हैं।", "Staff can work only on \"Products & Services\" photos, as per the permissions you choose. Logo, banner, plan and settings stay with you only. You can set different permissions for each staff.") + '</p>';
    if (!D) h += '<p class="hn">' + (S.err ? esc(S.err) : '…') + '</p>';
    else if (!lim) h += '<div class="pbger" style="display:block">' + T("यह सुविधा आपके प्लान में नहीं है। Silver में 1, Gold में 2, Platinum में 5 स्टाफ़।", "This is not in your plan. Silver 1, Gold 2, Platinum 5 staff.") + '</div>';
    else {
      h += '<div class="szn" style="margin:6px 2px">' + T("जुड़े स्टाफ़", "Staff added") + ': <b>' + items.length + ' / ' + lim + '</b></div>' +
        items.map(function (x) {
          var ps = x.perms || ["add", "edit"];
          return '<div class="hcard"><div class="hrow" style="border:0;padding:0 0 4px"><b>' + esc(x.email || x.phone) + '</b><button type="button" data-hrm="' + x.id + '" data-i="' + i + '">' + T("हटाएँ", "Remove") + '</button></div>' +
            '<div class="hpl">' + T("इजाज़तें", "Permissions") + ':</div>' + permBoxes(ps, 'data-hpr="' + x.id + '" data-i="' + i + '" data-hp2') + '</div>';
        }).join("");
      if (items.length < lim) h += '<div class="hcard"><div class="hpl" style="margin-top:0"><b>' + T("नया स्टाफ़ जोड़ें", "Add new staff") + '</b></div><input class="pbgin" id="pbghc" maxlength="80" inputmode="email" placeholder="' + esc(T("स्टाफ़ का Google ईमेल या 10 अंकों का मोबाइल", "Staff's Google email or 10-digit mobile")) + '" aria-label="' + esc(T("स्टाफ़ का ईमेल या मोबाइल", "Staff's email or mobile")) + '">' +
        '<div class="hpl">' + T("इस स्टाफ़ को क्या करने दें:", "What can this staff do:") + '</div>' + permBoxes(np, 'data-hnw="1" data-hp2') +
        '<button type="button" class="pbgsv" data-hadd="1" data-i="' + i + '" style="margin-top:8px">' + T("स्टाफ़ जोड़ें", "Add staff") + '</button></div>';
      h += '<p class="hn" style="margin:8px 2px">' + T("स्टाफ़ को बस patabook.in पर इसी ईमेल या नंबर से लॉगिन करना है — उसका काम अपने-आप खुल जाएगा, फ़ोटो एक लाइन में 3।", "Staff just log in at patabook.in with this email or number — their work opens automatically, 3 photos per line.") + '</p>';
    }
    if (S.ok) h += '<div class="pbok">' + esc(S.ok) + '</div>';
    if (S.msg) h += '<div class="pbger" style="display:block">' + esc(S.msg) + '</div>';
    h += '<div class="gsh" style="margin-top:14px"><b>' + T("हाल की गतिविधि", "Recent activity") + '</b></div>';
    h += A.length ? A.slice(0, 30).map(function (x) {
      var dt = new Date(x.at), when = isNaN(dt) ? "" : dt.toLocaleString(en() ? "en-IN" : "hi-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
      return '<div class="hrow">' + (x.url ? '<img src="' + esc(x.url) + '" alt="">' : '') + '<b>' + esc(whoTxt(x)) + ' · ' + esc(actTxt(x.action)) + '<small>' + esc(when) + '</small></b></div>';
    }).join("") : '<p class="hn" style="margin:6px 2px">' + T("अभी कोई गतिविधि नहीं।", "No activity yet.") + '</p>';
    return h;
  }
  window.pbgOpen = function (slug) { return GO[slug] || ""; };
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


  /* 🎬 Loader: दुकानदार 50 cinematic loader में से एक चुने (sql-35). ग्राहक को दुकान का page खुलते ही यही चलता है */
  var INTRO = {}, ISEL = {}, IERR = {}, IPLAY = null, ILOADED = {};
  function introRow(b, i) {
    var cur = INTRO[b.slug], lab = cur ? "#" + cur.scene : (paid(b) ? T("चुनें", "Choose") : "");
    if (!paid(b)) return '<button type="button" class="gfh glk" data-glk="1"><span class="gi">🎬</span><span class="gn"><b>' + T("लोडर", "Loader") + '</b></span><i>🔒</i></button>';
    return '<button type="button" class="gfh" data-gf="intro" data-i="' + i + '"><span class="gi">🎬</span><span class="gn"><b>' + T("लोडर", "Loader") + '</b></span><i>' + esc(lab) + '</i><em>›</em></button>';
  }
  function engine() {
    return new Promise(function (ok, no) {
      if (window.PBIntro) return ok(); var e = document.getElementById("pbiEngine");
      if (!e) { e = document.createElement("script"); e.id = "pbiEngine"; e.src = "pb-intro/engine.js?v=1"; document.head.appendChild(e); }
      e.addEventListener("load", function () { ok(); }); e.addEventListener("error", function () { no(); });
    });
  }
  async function introLoad(s) {
    ILOADED[s] = 1;
    try { var j = await rpc("pb_intro_get", { p_slug: s }); INTRO[s] = j && j.scene ? { scene: +j.scene, style: j.style || "gold" } : null; IERR[s] = ""; }
    catch (e) { INTRO[s] = null; IERR[s] = /function|schema cache|404/i.test(String(e && e.message)) ? "setup" : ""; }
    if (!ISEL[s]) ISEL[s] = INTRO[s] ? { scene: INTRO[s].scene, style: INTRO[s].style } : { scene: 1, style: "gold" };
    draw(); introPlaySoon(s);
  }
  function introCss() {
    if (document.getElementById("pbiGal")) return; var st = document.createElement("style"); st.id = "pbiGal";
    st.textContent = ".ipw{display:grid;gap:12px;margin:8px 2px}.ipv{position:relative;width:min(100%,300px);aspect-ratio:9/16;margin:0 auto;border-radius:16px;overflow:hidden;background:#050505;box-shadow:0 10px 30px rgba(0,0,0,.25)}" +
      ".ipv .ipp{position:absolute;inset:0;border:0;background:radial-gradient(circle,rgba(255,255,255,.06),transparent 60%);color:#f2e2b0;font:800 15px/1.3 inherit;cursor:pointer;z-index:2}" +
      ".ipn{text-align:center;font-size:14px;font-weight:800;color:#0b2f73}.ipn small{display:block;font-weight:600;color:#5b6475;font-size:12.5px}" +
      ".ist{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.ist button{border:1px solid #d0d7e2;background:#fff;border-radius:10px;padding:8px 4px;font:inherit;font-size:12.5px;font-weight:800;color:#33395a;cursor:pointer}.ist button.on{border-color:#b8862b;background:#fff8e6;color:#7a5716}.ist i{display:block;width:16px;height:16px;border-radius:50%;margin:0 auto 4px}" +
      ".igd{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}@media(min-width:560px){.igd{grid-template-columns:repeat(8,minmax(0,1fr))}}" +
      ".igd button{position:relative;border:1px solid #d0d7e2;background:#0e0e10;color:#e9d59a;border-radius:10px;padding:9px 2px 7px;font:inherit;cursor:pointer;min-width:0}.igd button b{display:block;font-size:15px;font-variant-numeric:tabular-nums}.igd button span{display:block;font-size:9.5px;color:#a49a82;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 3px}" +
      ".igd button.on{outline:3px solid #1a73e8;outline-offset:1px}.igd button.cur::after{content:'✓';position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;background:#137333;color:#fff;font-size:11px;display:grid;place-items:center}" +
      ".iac{display:flex;gap:8px;flex-wrap:wrap}.iac button{flex:1;min-width:140px;border:0;border-radius:12px;padding:12px;font:inherit;font-weight:800;cursor:pointer}.iac .s{background:#137333;color:#fff}.iac .r{background:#eef1f6;color:#b42318}";
    document.head.appendChild(st);
  }
  function introPage(b, i) {
    var s = b.slug; introCss(); if (!ILOADED[s]) introLoad(s);
    if (!window.PBIntro && !introPage.w) { introPage.w = 1; engine().then(function () { draw(); introPlaySoon(s); }, function () {}); }
    var sel = ISEL[s] || { scene: 1, style: "gold" }, cur = INTRO[s], names = (window.PBIntro && PBIntro.names) || [];
    var bar = '<div class="gph"><button type="button" class="gbk" data-gb="1" aria-label="' + T("वापस", "Back") + '">‹</button><b>🎬 ' + T("लोडर", "Loader") + '</b><span>50</span></div>';
    if (IERR[s] === "setup") return bar + '<div class="gbd"><small>' + T("यह सुविधा जल्दी चालू होगी।", "This will be available soon.") + '</small></div>';
    var SN = [["gold", "Gold", "linear-gradient(180deg,#fff1c4,#b8862b 55%,#6e4f16)"], ["silver", "Silver", "linear-gradient(180deg,#fff,#9aa3ae 55%,#4a525c)"], ["black", "Black", "linear-gradient(180deg,#e9ecf1,#2b2f36 55%,#000)"], ["white", "White", "linear-gradient(180deg,#fff,#e9e6df 55%,#bdb6a8)"]];
    var grid = ""; for (var n = 1; n <= 50; n++) grid += '<button type="button" class="' + (n === sel.scene ? "on" : "") + (cur && cur.scene === n ? " cur" : "") + '" data-ipv="' + n + '" data-i="' + i + '" aria-label="' + T("लोडर", "Loader") + ' ' + n + '"><b>' + n + '</b><span>' + esc(names[n - 1] || "") + '</span></button>';
    var same = cur && cur.scene === sel.scene && cur.style === sel.style;
    return bar + '<div class="ipw">' +
      '<div class="szn">' + T("ग्राहक आपकी दुकान का page खोलते ही यह loader देखेंगे (आपके logo और नाम के साथ)। नंबर दबाकर देखें, पसंद आए तो \"यह लगाएँ\" दबाएँ।", "Customers see this loader when they open your shop page (with your logo and name). Tap a number to preview, then tap \"Use this\".") + '</div>' +
      '<div class="ipv" id="ipv' + i + '"><button type="button" class="ipp" data-iplay="' + i + '">▶ ' + T("चलाकर देखें", "Play preview") + '</button></div>' +
      '<div class="ipn">#' + sel.scene + ' · ' + esc(names[sel.scene - 1] || "") + '<small>' + (cur ? T("अभी लगा है: ", "Now in use: ") + "#" + cur.scene + " · " + esc(cur.style) : T("अभी कोई loader नहीं चुना", "No loader chosen yet")) + '</small></div>' +
      '<div class="ist">' + SN.map(function (z) { return '<button type="button" class="' + (sel.style === z[0] ? "on" : "") + '" data-ist="' + z[0] + '" data-i="' + i + '"><i style="background:' + z[2] + '"></i>' + z[1] + '</button>'; }).join("") + '</div>' +
      '<div class="iac"><button type="button" class="s" data-isave="' + i + '"' + (same ? " disabled" : "") + '>' + (same ? "✅ " + T("यही लगा है", "In use") : "✅ " + T("यह लगाएँ", "Use this")) + '</button>' + (cur ? '<button type="button" class="r" data-irm="' + i + '">' + T("हटाएँ", "Remove") + '</button>' : '') + '</div>' +
      (IERR[s] && IERR[s] !== "setup" ? '<div class="err">' + esc(IERR[s]) + '</div>' : '') +
      '<div class="igd">' + grid + '</div></div>';
  }
  function introPlaySoon(s) { setTimeout(function () { var r = (ROWS || []).map(function (x, k) { return x && x.slug === s ? k : -1; }).filter(function (k) { return k >= 0; })[0]; if (r != null && GO[s] === "intro") introPlay(r); }, 30); }
  async function introPlay(i) {
    var b = ROWS[i], box = document.getElementById("ipv" + i); if (!b || !box) return;
    try { await engine(); } catch (e) { return; }
    if (IPLAY) try { IPLAY.stop(); } catch (e) {}
    var old = box.querySelector(".pbcl"); if (old) old.remove();
    var pb = box.querySelector(".ipp"); if (pb) pb.style.display = "none";
    var sel = ISEL[b.slug] || { scene: 1, style: "gold" };
    IPLAY = PBIntro.play({ mount: box, scene: sel.scene, style: sel.style, name: b.name, logo: LOGOS[b.slug] || "", tag: [b.category, String(b.address || "").split(",").slice(-1)[0].trim()].filter(Boolean).join(" · "),
      onDone: function () { var q = box.querySelector(".ipp"); if (q) { q.style.display = ""; q.textContent = "↻ " + T("फिर से देखें", "Play again"); } } });
  }

  /* 🌐 Website Design: Platinum दुकानदार 100 design (10 layout × 10 रंग) में से एक चुने (sql-36). ग्राहक को Platinum दुकान का page उसी design में (brand.html) */
  var DSN = {}, DSEL = {}, DERR = {}, DLOADED = {};
  var DLY = [["लग्ज़री", "Luxury"], ["सिनेमा", "Cinematic"], ["एडिटोरियल", "Editorial"], ["ऑनलाइन स्टोर", "Store"], ["मिनिमल", "Minimal"], ["पोस्टर", "Bold Poster"], ["स्प्लिट", "Split Screen"], ["बेंटो", "Bento Grid"], ["क्लासिक दुकान", "Classic Shop"], ["प्रेस्टीज ब्रांड", "Prestige Brand"]];
  var DTH = [["नेवी प्लैटिनम", "Navy Platinum", "#0a1230", "#c7d2e8"], ["काला-गोल्ड", "Black Gold", "#0b0b0c", "#d8c39a"], ["रोज़ गोल्ड", "Rose Gold", "#fbf3f0", "#b76e79"], ["एमराल्ड", "Emerald", "#06261d", "#d6b46a"], ["मैरून रॉयल", "Royal Maroon", "#3a0b14", "#e6c27a"], ["सफ़ेद मिनिमल", "Pure White", "#ffffff", "#111111"], ["आइवरी सैंड", "Ivory Sand", "#f4efe6", "#8a6a3d"], ["मिडनाइट वायलेट", "Midnight Violet", "#140c2a", "#b9a3ff"], ["ओशन टील", "Ocean Teal", "#03242b", "#7fe0d4"], ["चारकोल ऑरेंज", "Charcoal Orange", "#16181b", "#ff7a3d"]];
  /* 🧪 Website Design अभी सिर्फ़ इस एक दुकान पर test */
  var DTEST = "tejwani-detergent-and-chemical-gandhidham-31oyn";
  function plat(b) { return paid(b) && (typeof tierOf !== "function" || tierOf(b) === "platinum"); }
  function dsplit(n) { return { ly: Math.floor((n - 1) / 10) + 1, th: (n - 1) % 10 + 1 }; }
  function dname(n) { var z = dsplit(n); return T(DLY[z.ly - 1][0], DLY[z.ly - 1][1]) + " · " + T(DTH[z.th - 1][0], DTH[z.th - 1][1]); }
  function designRow(b, i) {
    if (b.slug !== DTEST) return "";
    if (!plat(b)) return '<button type="button" class="gfh glk" data-glk="1"><span class="gi">🌐</span><span class="gn"><b>' + T("वेबसाइट डिज़ाइन", "Website Design") + '</b></span><i>💎🔒</i></button>';
    var cur = DSN[b.slug];
    return '<button type="button" class="gfh" data-gf="design" data-i="' + i + '"><span class="gi">🌐</span><span class="gn"><b>' + T("वेबसाइट डिज़ाइन", "Website Design") + '</b></span><i>' + (cur ? "#" + cur : T("चुनें", "Choose")) + '</i><em>›</em></button>';
  }
  async function designLoad(s) {
    DLOADED[s] = 1;
    try { var j = await rpc("pb_design_get", { p_slug: s }); DSN[s] = +j >= 1 && +j <= 100 ? +j : null; DERR[s] = ""; }
    catch (e) { DSN[s] = null; DERR[s] = /function|schema cache|404/i.test(String(e && e.message)) ? "setup" : ""; }
    if (!DSEL[s]) DSEL[s] = DSN[s] || 1;
    draw();
  }
  function designCss() {
    if (document.getElementById("pbdGal")) return; var st = document.createElement("style"); st.id = "pbdGal";
    st.textContent = ".dpw{display:grid;gap:12px;margin:8px 2px}.dpf{position:relative;width:min(100%,300px);aspect-ratio:9/17;margin:0 auto;border-radius:22px;overflow:hidden;background:#0a1230;border:6px solid #111;box-shadow:0 12px 34px rgba(0,0,0,.28)}" +
      ".dpf iframe{position:absolute;left:0;top:0;width:390px;height:737px;border:0;transform-origin:0 0;background:#fff}" +
      ".dpn{text-align:center;font-size:15px;font-weight:800;color:#0b2f73}.dpn small{display:block;font-weight:600;color:#5b6475;font-size:12.5px;margin-top:2px}" +
      ".dpl{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}.dpl button{border:1px solid #d0d7e2;background:#fff;border-radius:10px;padding:8px 2px;font:inherit;font-size:11.5px;font-weight:800;color:#33395a;cursor:pointer;min-width:0}.dpl button span{display:block;font-size:10px;color:#8a93a6}.dpl button.on{border-color:#1a73e8;background:#eef4ff;color:#0b2f73}" +
      ".dpc{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}.dpc button{border:1px solid #d0d7e2;background:#fff;border-radius:10px;padding:8px 2px;font:inherit;font-size:10.5px;font-weight:700;color:#33395a;cursor:pointer;min-width:0}.dpc button.on{border-color:#1a73e8;background:#eef4ff}.dpc i{display:block;width:26px;height:26px;border-radius:50%;margin:0 auto 4px;border:2px solid #d0d7e2;position:relative;overflow:hidden}.dpc i b{position:absolute;right:-1px;bottom:-1px;width:14px;height:14px;border-radius:50%}" +
      ".dph{font-size:12.5px;font-weight:800;color:#5b6475;margin:4px 2px -4px}.dpa{display:flex;gap:8px;flex-wrap:wrap}.dpa button,.dpa a{flex:1;min-width:140px;border:0;border-radius:12px;padding:12px;font:inherit;font-weight:800;cursor:pointer;text-align:center;text-decoration:none}.dpa .s{background:#137333;color:#fff}.dpa .s[disabled]{opacity:.7}.dpa .r{background:#eef1f6;color:#b42318}.dpa .o{background:#eef4ff;color:#0b2f73}" +
      ".dpnv{display:flex;gap:8px}.dpnv button{flex:1;border:1px solid #d0d7e2;background:#fff;border-radius:10px;padding:9px;font:inherit;font-weight:800;color:#33395a;cursor:pointer}";
    document.head.appendChild(st);
  }
  function designFit() { document.querySelectorAll(".dpf").forEach(function (f) { var fr = f.querySelector("iframe"); if (fr) fr.style.transform = "scale(" + (f.clientWidth / 390) + ")"; }); }
  window.addEventListener("resize", designFit);
  function designPage(b, i) {
    if (b.slug !== DTEST) return "";
    var s = b.slug; designCss(); if (!DLOADED[s]) designLoad(s);
    var bar = '<div class="gph"><button type="button" class="gbk" data-gb="1" aria-label="' + T("वापस", "Back") + '">‹</button><b>🌐 ' + T("वेबसाइट डिज़ाइन", "Website Design") + '</b><span>100</span></div>';
    if (!plat(b)) return bar + '<div class="gbd"><small>' + T("यह सुविधा 💎 Platinum plan में है।", "This is in the 💎 Platinum plan.") + '</small></div>';
    if (DERR[s] === "setup") return bar + '<div class="gbd"><small>' + T("यह सुविधा जल्दी चालू होगी।", "This will be available soon.") + '</small></div>';
    var n = DSEL[s] || 1, z = dsplit(n), cur = DSN[s], same = cur === n;
    var src = "brand.html?slug=" + encodeURIComponent(s) + "&d=" + n;
    setTimeout(designFit, 0);
    return bar + '<div class="dpw">' +
      '<div class="szn">' + T("ग्राहक आपकी दुकान खोलेंगे तो उन्हें आपकी अपनी वेबसाइट इसी डिज़ाइन में दिखेगी — आपके सामान, फ़ोटो, पते और WhatsApp के साथ। लेआउट और रंग चुनकर देखें, पसंद आए तो \"यह लगाएँ\" दबाएँ।", "Customers will see your own website in this design — with your products, photos, address and WhatsApp. Pick a layout and a colour to preview, then tap \"Use this\".") + '</div>' +
      '<div class="dpf"><iframe src="' + esc(src) + '" title="' + esc(T("डिज़ाइन की झलक", "Design preview")) + '" loading="lazy"></iframe></div>' +
      '<div class="dpn">#' + n + ' · ' + esc(dname(n)) + '<small>' + (cur ? T("अभी लगा है: ", "Now in use: ") + "#" + cur + " · " + esc(dname(cur)) : T("अभी कोई डिज़ाइन नहीं चुना — ग्राहक को साधारण पेज दिखता है", "No design chosen yet — customers see the standard page")) + '</small></div>' +
      '<div class="dpnv"><button type="button" data-dstep="-1" data-i="' + i + '" aria-label="' + T("पिछला डिज़ाइन", "Previous design") + '">‹ ' + T("पिछला", "Previous") + '</button><button type="button" data-dstep="1" data-i="' + i + '" aria-label="' + T("अगला डिज़ाइन", "Next design") + '">' + T("अगला", "Next") + ' ›</button></div>' +
      '<div class="dph">1. ' + T("लेआउट", "Layout") + '</div><div class="dpl">' + DLY.map(function (l, k) { return '<button type="button" class="' + (z.ly === k + 1 ? "on" : "") + '" data-dly="' + (k + 1) + '" data-i="' + i + '"><span>' + (k + 1) + '</span>' + esc(T(l[0], l[1])) + '</button>'; }).join("") + '</div>' +
      '<div class="dph">2. ' + T("रंग", "Colour") + '</div><div class="dpc">' + DTH.map(function (t, k) { return '<button type="button" class="' + (z.th === k + 1 ? "on" : "") + '" data-dth="' + (k + 1) + '" data-i="' + i + '"><i style="background:' + t[2] + '"><b style="background:' + t[3] + '"></b></i>' + esc(T(t[0], t[1])) + '</button>'; }).join("") + '</div>' +
      '<div class="dpa"><button type="button" class="s" data-dsave="' + i + '"' + (same ? " disabled" : "") + '>✅ ' + (same ? T("यही लगा है", "In use") : T("यह लगाएँ", "Use this")) + '</button>' +
      '<a class="o" href="' + esc(src) + '" target="_blank" rel="noopener">↗ ' + T("पूरा देखें", "Open full preview") + '</a>' +
      (cur ? '<button type="button" class="r" data-drm="' + i + '">' + T("हटाएँ", "Remove") + '</button>' : '') + '</div>' +
      (DERR[s] && DERR[s] !== "setup" ? '<div class="err">' + esc(DERR[s]) + '</div>' : '') + '</div>';
  }
  document.getElementById("list").addEventListener("click", async function (e) {
    function pick(i, n) { var b = ROWS[i]; if (!b) return; DSEL[b.slug] = n; draw(); }
    var ly = e.target.closest("[data-dly]"); if (ly) { var b0 = ROWS[+ly.dataset.i], z0 = dsplit(DSEL[b0.slug] || 1); pick(+ly.dataset.i, (+ly.dataset.dly - 1) * 10 + z0.th); return; }
    var th = e.target.closest("[data-dth]"); if (th) { var b1 = ROWS[+th.dataset.i], z1 = dsplit(DSEL[b1.slug] || 1); pick(+th.dataset.i, (z1.ly - 1) * 10 + +th.dataset.dth); return; }
    var st = e.target.closest("[data-dstep]"); if (st) { var b2 = ROWS[+st.dataset.i], n2 = (DSEL[b2.slug] || 1) + +st.dataset.dstep; if (n2 < 1) n2 = 100; if (n2 > 100) n2 = 1; pick(+st.dataset.i, n2); return; }
    var sv = e.target.closest("[data-dsave]"); if (sv) { var b3 = ROWS[+sv.dataset.dsave], s3 = b3.slug, n3 = DSEL[s3] || 1; sv.disabled = true;
      try { ME = await PBA.session(); await rpc("pb_design_set", { p_slug: s3, p_design: n3 }); DSN[s3] = n3; DERR[s3] = ""; }
      catch (er) { DERR[s3] = /platinum/i.test(String(er && er.message)) ? T("यह सुविधा Platinum plan में है।", "This is in the Platinum plan.") : /rate/i.test(String(er && er.message)) ? T("आज बहुत बार बदला गया — कल कोशिश करें।", "Changed too many times today — try tomorrow.") : T("सेव नहीं हो सका। दोबारा कोशिश करें।", "Could not save. Try again."); }
      draw(); return; }
    var rm = e.target.closest("[data-drm]"); if (rm) { var b4 = ROWS[+rm.dataset.drm], s4 = b4.slug; rm.disabled = true;
      try { ME = await PBA.session(); await rpc("pb_design_set", { p_slug: s4, p_design: null }); DSN[s4] = null; DERR[s4] = ""; }
      catch (er) { DERR[s4] = T("हटाया नहीं जा सका। दोबारा कोशिश करें।", "Could not remove. Try again."); }
      draw(); return; }
  });
  document.getElementById("list").addEventListener("click", async function (e) {
    var gfi = e.target.closest('[data-gf="intro"]'); if (gfi) { var bi = ROWS[+gfi.dataset.i]; if (bi) introPlaySoon(bi.slug); return; }
    var pv = e.target.closest("[data-ipv]"); if (pv) { var b = ROWS[+pv.dataset.i]; ISEL[b.slug] = { scene: +pv.dataset.ipv, style: (ISEL[b.slug] || {}).style || "gold" }; draw(); introPlaySoon(b.slug); return; }
    var stb = e.target.closest("[data-ist]"); if (stb) { var b2 = ROWS[+stb.dataset.i]; ISEL[b2.slug] = { scene: (ISEL[b2.slug] || {}).scene || 1, style: stb.dataset.ist }; draw(); introPlaySoon(b2.slug); return; }
    var pl = e.target.closest("[data-iplay]"); if (pl) { introPlay(+pl.dataset.iplay); return; }
    var sv = e.target.closest("[data-isave]"); if (sv) { var b3 = ROWS[+sv.dataset.isave], s3 = b3.slug, sel = ISEL[s3]; sv.disabled = true;
      try { ME = await PBA.session(); await rpc("pb_intro_set", { p_slug: s3, p_scene: sel.scene, p_style: sel.style }); INTRO[s3] = { scene: sel.scene, style: sel.style }; IERR[s3] = ""; try { localStorage.setItem("pbi_" + s3, sel.scene + "|" + sel.style); } catch (x) {} }
      catch (er) { IERR[s3] = /premium/i.test(String(er && er.message)) ? T("यह सुविधा Silver / Gold / Platinum plan में है।", "This is in the Silver / Gold / Platinum plan.") : T("सेव नहीं हो सका। दोबारा कोशिश करें।", "Could not save. Try again."); }
      draw(); return; }
    var rm = e.target.closest("[data-irm]"); if (rm) { var b4 = ROWS[+rm.dataset.irm], s4 = b4.slug; rm.disabled = true;
      try { ME = await PBA.session(); await rpc("pb_intro_set", { p_slug: s4, p_scene: null, p_style: null }); INTRO[s4] = null; IERR[s4] = ""; try { localStorage.removeItem("pbi_" + s4); } catch (x) {} }
      catch (er) { IERR[s4] = T("हटाया नहीं जा सका। दोबारा कोशिश करें।", "Could not remove. Try again."); }
      draw(); return; }
  });
  window.addEventListener("popstate", function () { if (IPLAY) try { IPLAY.stop(); } catch (e) {} });
  window.addEventListener("popstate", function (ev) { if (ev.state && ev.state.pbgal) return; var any = false; for (var k in GO) if (GO[k]) { any = true; GO[k] = ""; } if (any) draw(); });
  document.getElementById("list").addEventListener("click", function (e) {
    var gf = e.target.closest("[data-gf]"); if (gf) { var b = ROWS[+gf.dataset.i]; GO[b.slug] = gf.dataset.gf; try { history.pushState(Object.assign({}, history.state || {}, { pbgal: 1 }), ""); } catch (x) {} draw(); window.scrollTo(0, 0); return; }
    if (e.target.closest("[data-glk]")) { var m = document.getElementById("glkm"); if (m) m.style.display = "block"; return; }
    var gb = e.target.closest("[data-gb]"); if (gb) { if (history.state && history.state.pbgal) history.back(); else { GO = {}; draw(); } return; }
    var gk = e.target.closest("[data-gk]"); if (gk) { e.stopPropagation(); tick(+gk.dataset.i, gk.dataset.gk, +gk.dataset.n); return; }
    var hl = e.target.closest("[data-hlp]"); if (hl) { staffOpen(+hl.dataset.hlp); return; }
    var ha = e.target.closest("[data-hadd]"); if (ha) { staffAct(+ha.dataset.i, "add"); return; }
    var hr = e.target.closest("[data-hrm]"); if (hr) { staffAct(+hr.dataset.i, "rm", +hr.dataset.hrm); return; }
    var gs = e.target.closest("[data-gsec]"); if (gs) { chooseSec(+gs.dataset.gsec); return; }
    var gd = e.target.closest("[data-gd]"); if (gd) { e.stopPropagation(); details(+gd.dataset.i, +gd.dataset.gd); return; }
    var gv = e.target.closest("[data-gv]"); if (gv) { light(+gv.dataset.i, gv.dataset.gv, +gv.dataset.n); return; }
  });
  document.getElementById("list").addEventListener("change", function (e) {
    var pr = e.target.closest("[data-hpr]"); if (pr) { staffPerm(+pr.dataset.i, +pr.dataset.hpr); return; }
    var nw = e.target.closest("[data-hnw]"); if (nw) { var sl = ROWS[(document.querySelector("[data-hadd]") || {}).dataset ? +document.querySelector("[data-hadd]").dataset.i : 0].slug, S = HST[sl] = HST[sl] || {}, a = []; document.querySelectorAll("[data-hnw]").forEach(function (c) { if (c.checked) a.push(c.dataset.hp2); }); S.np = a; return; }
    var g = e.target.closest("[data-gup]"); if (g && g.files && g.files.length) { var fs = Array.prototype.slice.call(g.files), gi = +g.dataset.i, gk = g.dataset.gup; g.value = "";
      (async function () {
        var rt = RATIO[gk] || 1, out = [];
        for (var q = 0; q < fs.length; q++) { if (!/^image\//.test(fs[q].type)) { out.push(fs[q]); continue; } var r = await cropEdit(fs[q], q + 1, fs.length, rt); if (r === null) return; out.push(r); }
        GO[ROWS[gi].slug] = gk; up(gi, gk, out);
      })(); }
  });
})();
