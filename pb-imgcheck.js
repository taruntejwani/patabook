/* PataBook — फ़ोटो की AI जांच (upload से पहले)
   PBImg.check(file) → {ok:true} या {ok:false, cat, msg}
   - फ़ोटो को छोटा (448px JPEG) करके "PataBook AI" Worker के /check-image पर भेजता है
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
    gamble: ["इसमें जुआ / सट्टा से जुड़ी सामग्री है।", "it shows gambling or betting."]
  };
  function msg(cat) {
    var w = WHY[cat] || WHY.nude, E = en();
    return E ? "❌ This photo cannot be added: " + w[1] + " Please add a clear photo of your shop or product."
             : "❌ यह फ़ोटो नहीं लग सकती: " + w[0] + " कृपया अपनी दुकान या product की साफ़ फ़ोटो लगाएँ।";
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
        var k = Math.min(1, 448 / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * k)); c.height = Math.max(1, Math.round(img.height * k));
        var x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = function () { URL.revokeObjectURL(url); rej(new Error("img")); };
      img.src = url;
    });
  }
  async function check(file) {
    try {
      if (!(await ready())) return { ok: true, skipped: "off" };
      var data = await small(file);
      var ctl = new AbortController(), tm = setTimeout(function () { ctl.abort(); }, 15000);
      try {
        var r = await fetch(base() + "/check-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ img: data }), signal: ctl.signal });
        var j = await r.json();
        if (j && j.ok === false) return { ok: false, cat: j.cat, msg: msg(j.cat) };
        return { ok: true };
      } finally { clearTimeout(tm); }
    } catch (e) { return { ok: true, skipped: "err" }; }
  }
  window.PBImg = { check: check, msg: msg };
})();
