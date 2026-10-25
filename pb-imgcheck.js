/* PataBook — फ़ोटो की AI जांच (upload से पहले)
   PBImg.check(file) → {ok:true} या {ok:false, cat, msg}
   - फ़ोटो को छोटा (384px JPEG — Gemini में 258 tokens) करके "PataBook AI" Worker के /check-image पर भेजता है
   - Worker पुराना हो, AI न चले, इंटरनेट धीमा हो → फ़ोटो रुकती नहीं (ok:true), ताकि दुकानदार परेशान न हो
   - असली फ़ोटो server पर नहीं रुकती; सिर्फ़ जांच के लिए छोटी copy जाती है */
(function () {
  var READY = null;   // Worker में /check-image है या नहीं (v2)
  function base() { return ((window.PB_SITE && PB_SITE.aiUrl) || "").replace(/\/$/, ""); }
  function en() { return !!(window.PB && PB.lang && PB.lang() === "en"); }
  var WHY = {
    nude: ["इसमें अश्लील / आपत्तिजनक सामग्री दिख रही है।", "it shows nudity or vulgar content."],
    child: ["इसमें बच्चों से जुड़ी आपत्तिजनक सामग्री दिख रही है।", "it shows indecent content involving a child."],
    gore: ["इसमें खून / हिंसा दिख रही है।", "it shows blood or violence."],
    weapon: ["इसमें हथियार दिख रहे हैं।", "it shows weapons."],
    drugs: ["इसमें शराब / तंबाकू / नशे का सामान दिख रहा है।", "it shows alcohol, tobacco or drugs."],
    hate: ["इसमें किसी धर्म / समुदाय के ख़िलाफ़ आपत्तिजनक सामग्री है।", "it has hateful content against a religion or community."],
    qr: ["Payment / UPI QR code की फ़ोटो नहीं लगा सकते (धोखाधड़ी से बचाव)।", "payment / UPI QR code photos are not allowed (fraud safety)."],
    doc: ["ID card / बैंक card / नोटों की फ़ोटो नहीं लगा सकते (आपकी सुरक्षा के लिए)।", "ID cards, bank cards or currency notes are not allowed (for your safety)."],
    gamble: ["इसमें जुआ / सट्टा से जुड़ी सामग्री है।", "it shows gambling or betting."],
    screen: ["यह mobile / computer की screenshot लग रही है।", "it looks like a phone / computer screenshot."],
    unrelated: ["यह फ़ोटो आपके product / दुकान से जुड़ी नहीं लग रही।", "it does not look related to your product / shop."],
    unclear: ["फ़ोटो में चीज़ साफ़ नहीं दिख रही (धुंधली / अंधेरी)। अच्छी रोशनी में साफ़ फ़ोटो लें।", "the item is not clearly visible (blurry / dark). Take a clear photo in good light."]
  };
  function msg(cat) {
    var w = WHY[cat] || WHY.nude, E = en();
    var tail = cat === "unclear" ? "" : (E ? " Please add a clear photo of your shop or product." : " कृपया अपनी दुकान या product की साफ़ फ़ोटो लगाएँ।");
    return (E ? "❌ This photo cannot be added: " + w[1] : "❌ यह फ़ोटो नहीं लग सकती: " + w[0]) + tail;
  }
  async function ready() {
    if (READY !== null) return READY;
    var b = base(); if (!b) return (READY = false);
    try {
      var r = await fetch(b + "/", { method: "GET" }); var j = await r.json();
      READY = !!(j && j.v >= 2);
    } catch (e) { READY = false; }
    return READY;
  }
  function small(file) {
    return new Promise(function (res, rej) {
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var k = Math.min(1, 384 / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
        var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res({ data: c.toDataURL("image/jpeg", 0.72), w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error("img")); };
      img.src = url;
    });
  }
  /* दुकान की पहचान (category, sub-category, नाम) — AI को बताने के लिए; एक बार लाकर याद रखते हैं */
  var SHOP = {};
  function ln(d, k) { var m = String(d || "").match(new RegExp("^" + k + ":\\s*(.+)$", "mi")); return m ? m[1].trim() : ""; }
  async function shopInfo(slug) {
    if (!slug) return {};
    if (SHOP[slug]) return SHOP[slug];
    var row = ((typeof ROWS !== "undefined" && ROWS) || []).filter(function (x) { return x && x.slug === slug; })[0] || {};
    var I = { shop: row.name || "", cat: row.category || "", sub: ln(row.description, "Subcategory"), svc: ln(row.description, "Services") };
    var sb = typeof SB !== "undefined" ? SB : "", key = typeof KEY !== "undefined" ? KEY : "";
    if (!I.cat && sb && key) {
      try {
        var r = await fetch(sb + "/rest/v1/businesses?select=name,category,description&slug=eq." + encodeURIComponent(slug) + "&limit=1", { headers: { apikey: key, Authorization: "Bearer " + key } });
        var j = r.ok ? await r.json() : []; if (j && j[0]) { I.shop = I.shop || j[0].name || ""; I.cat = j[0].category || ""; I.sub = ln(j[0].description, "Subcategory"); I.svc = ln(j[0].description, "Services"); }
      } catch (e) {}
    }
    try { I.unit = localStorage.getItem("pb-unit-" + slug) || ""; } catch (e) {}
    return (SHOP[slug] = I);
  }
  function isScreen(file, w, h) {
    if (/screen ?shot|screenshot|scrnshot|capture/i.test(String(file && file.name || ""))) return true;
    var lo = Math.min(w, h), hi = Math.max(w, h), r = hi / Math.max(1, lo);
    var dpr = window.devicePixelRatio || 1, sw = Math.round((screen.width || 0) * dpr), sh = Math.round((screen.height || 0) * dpr);
    var near = function (a, b) { return Math.abs(a - b) <= Math.max(6, b * 0.01); };
    if (sw && sh && near(lo, Math.min(sw, sh)) && near(hi, Math.max(sw, sh))) return true;   /* इसी phone (Fold की अंदर/बाहर वाली screen भी) जितना */
    return r >= 1.9 && r <= 2.75 && lo >= 600 && lo <= 1600;                            /* 18:9 – 23:9 वाला phone / Fold बाहर वाली screen का screenshot */
  }
  /* 🛠️ सिर्फ़ Admin के phone पर (admin page खोलने से pb-notrack=1 लगता है): जांच का नतीजा छोटी पट्टी में */
  function isAdm() { try { return localStorage.getItem("pb-notrack") === "1"; } catch (e) { return false; } }
  function dbg(t) {
    if (!isAdm()) return;
    try {
      var d = document.createElement("div");
      d.setAttribute("style", "position:fixed;left:8px;right:8px;bottom:12px;z-index:99999;background:#12141c;color:#fff;font:600 12.5px/1.4 system-ui,sans-serif;padding:9px 12px;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,.35);word-break:break-word");
      d.textContent = t + "  (सिर्फ़ admin को दिखता है)";
      d.onclick = function () { d.remove(); };
      document.body.appendChild(d); setTimeout(function () { d.remove(); }, 9000);
    } catch (e) {}
  }
  /* PBImg.check(file, {slug, kind:"product"|"logo"|"shop", name}) */
  async function check(file, info) {
    try {
      if (!(await ready())) { dbg("⚠️ AI जांच बंद: Worker (v2+) नहीं मिला / aiUrl खाली"); return { ok: true, skipped: "off" }; }
      info = info || {};
      var I = await shopInfo(info.slug), ctxo = { kind: info.kind || "shop", item: String(info.name || "").slice(0, 80), shop: String(I.shop || "").slice(0, 80), cat: String(I.cat || "").slice(0, 60), sub: String(I.sub || "").slice(0, 60), svc: String(I.svc || "").slice(0, 120), unit: I.unit || "" };
      var sm = await small(file), data = sm.data;
      /* 📱 पक्की जांच (बिना AI): phone के screenshot का नाप screen जैसा लंबा-पतला होता है (जैसे 1080×2400) या नाम में Screenshot */
      if (isScreen(file, sm.w, sm.h)) { dbg("🤖 नाप से screenshot पकड़ा (" + sm.w + "×" + sm.h + ")"); return { ok: false, cat: "screen", msg: msg("screen"), local: true }; }
      var ctl = new AbortController(), tm = setTimeout(function () { ctl.abort(); }, 15000);
      try {
        var r = await fetch(base() + "/check-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ img: data, ctx: ctxo }), signal: ctl.signal });
        var j = {}; try { j = await r.json(); } catch (e) { j = { skipped: "http " + r.status }; }
        if (window.console) console.log("PataBook AI photo check:", j);
        dbg((j.skipped ? "⚠️ AI जांच नहीं हुई (" + j.skipped + ")" : "🤖 AI [" + (j.src || "?") + "]: " + (j.ok === false ? "❌ रोका – " + j.cat : "✅ ठीक")) +
          (j.what ? " · \"" + j.what + "\"" : j.r ? " · " + String(j.r).slice(0, 120) : "") + " · " + sm.w + "×" + sm.h + (j.ge ? " · Gemini error: " + j.ge : ""));
        if (j && j.ok === false) return { ok: false, cat: j.cat, msg: msg(j.cat) };
        return { ok: true };
      } finally { clearTimeout(tm); }
    } catch (e) { dbg("⚠️ AI जांच नहीं हुई: " + (e && e.name === "AbortError" ? "15 सेकंड में जवाब नहीं आया" : String(e && e.message || e))); return { ok: true, skipped: "err" }; }
  }
  window.PBImg = { check: check, msg: msg };
})();
