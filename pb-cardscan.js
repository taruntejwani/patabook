/* PataBook — 📸 विज़िटिंग कार्ड से फ़ॉर्म भरें (list.html — नई दुकान)
   • कार्ड की फ़ोटो फ़ोन पर ही पढ़ी जाती है (Tesseract.js, Apache-2.0) — फ़ोटो कहीं upload नहीं होती
   • पहली बार ~10 MB की English पहचान-फ़ाइल आती है (फिर फ़ोन में रहती है)
   • निकले हुए: दुकान का नाम, मालिक का नाम, मोबाइल, ईमेल, वेबसाइट, पता, PIN, शहर — सिर्फ़ खाली खानों में भरते हैं
   • कुछ भी अपने-आप submit नहीं होता; दुकानदार हर चीज़ जाँचकर आगे बढ़ता है */
(function () {
  if (window.PBCardScan) return;
  var TJS = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
  function EN() { try { if (window.PB && PB.lang) return PB.lang() !== "hi"; return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function L(en, hi) { return EN() ? en : hi; }
  function $(id) { return document.getElementById(id); }
  var CITIES = ["Gandhidham", "Adipur", "Anjar", "Bhuj", "Mundra", "Mandvi", "Bhachau", "Rapar", "Nakhatrana", "Kandla", "Ahmedabad", "Rajkot", "Surat", "Vadodara", "Jamnagar", "Morbi", "Bhavnagar", "Jaipur", "Jodhpur", "Mumbai", "Pune", "Delhi"];
  var BIZW = /\b(traders?|trading|enterprises?|agency|agencies|store|stores|shop|mart|emporium|industries|industry|corporation|company|co\.|pvt|ltd|llp|motors?|garage|chemicals?|detergents?|electricals?|electronics|hardware|medical|pharma|clinic|hospital|hotel|restaurant|caterers?|services?|solutions?|works|associates|brothers|sons|centre|center|studio|salon|parlour|boutique|jewell?ers?|textiles?|furniture|automobiles?|auto|marketing|distributors?|suppliers?|exports?|imports?)\b/i;
  var ADDRW = /\b(road|rd\.?|nagar|plot|sector|shop no|office no|near|opp\.?|opposite|gidc|ward|street|st\.|market|complex|chowk|circle|highway|lane|marg|society|colony|area|estate|park|bazar|bazaar|plaza|tower|floor|bldg|building|block|survey|kutch|kachchh|gujarat|taluka|dist)\b/i;

  function loadTJS() {
    if (window.Tesseract) return Promise.resolve();
    return new Promise(function (ok, no) { var s = document.createElement("script"); s.src = TJS; s.onload = function () { window.Tesseract ? ok() : no(new Error("tjs")); }; s.onerror = function () { no(new Error("tjs")); }; document.head.appendChild(s); });
  }
  /* फ़ोटो छोटी + grayscale (तेज़ और बेहतर पढ़ाई) */
  function prep(file) {
    return new Promise(function (ok, no) {
      var img = new Image(), u = URL.createObjectURL(file);
      img.onload = function () {
        var M = 1800, sc = Math.min(1, M / Math.max(img.width, img.height)), w = Math.round(img.width * sc), h = Math.round(img.height * sc);
        var c = document.createElement("canvas"); c.width = w; c.height = h; var x = c.getContext("2d"); x.drawImage(img, 0, 0, w, h);
        try { var d = x.getImageData(0, 0, w, h), p = d.data; for (var i = 0; i < p.length; i += 4) { var g = p[i] * .299 + p[i + 1] * .587 + p[i + 2] * .114; p[i] = p[i + 1] = p[i + 2] = g; } x.putImageData(d, 0, 0); } catch (e) {}
        URL.revokeObjectURL(u); ok(c);
      };
      img.onerror = function () { URL.revokeObjectURL(u); no(new Error("img")); };
      img.src = u;
    });
  }
  function tc(s) { return s.toLowerCase().replace(/(^|[\s(])([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); }); }
  /* पढ़े हुए text से जानकारी */
  function parse(text) {
    var raw = String(text || "").replace(/\r/g, ""), lines = raw.split("\n").map(function (l) { return l.replace(/[|_~`^*<>]+/g, " ").replace(/\s+/g, " ").trim(); }).filter(function (l) { return l.length >= 2; });
    var all = lines.join("\n"), out = {};
    var ph = all.replace(/(\d)[oO]/g, "$10").replace(/[oO](\d)/g, "0$1").match(/(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/g) || [];
    var phones = ph.map(function (p) { return p.replace(/\D/g, "").slice(-10); }).filter(function (p, i, a) { return /^[6-9]\d{9}$/.test(p) && a.indexOf(p) === i; });
    if (phones.length) out.phone = phones[0];
    var em = all.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/); if (em) out.email = em[0].toLowerCase();
    var wb = all.match(/\b((?:https?:\/\/)?(?:www\.)[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+(?:\/\S*)?)/i); if (wb) out.web = wb[1].toLowerCase();
    var gst = all.toUpperCase().replace(/\s/g, "").match(/\d{2}[A-Z]{5}\d{4}[A-Z][0-9A-Z]Z[0-9A-Z]/); if (gst) out.gst = gst[0];
    var cleanPh = all.replace(/(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/g, " ");
    var pin = cleanPh.match(/\b([1-8]\d{2})\s?(\d{3})\b/); if (pin) out.pin = pin[1] + pin[2];
    CITIES.some(function (c) { if (new RegExp("\\b" + c + "\\b", "i").test(all)) { out.city = c; return true; } return false; });
    /* पता: पता जैसे शब्द / PIN वाली लाइनें (नंबर, ईमेल वाली नहीं) */
    var adr = lines.filter(function (l) { return (ADDRW.test(l) || /\b\d{6}\b/.test(l)) && !/@|www\.|https?:/i.test(l) && !/(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/.test(l) && !/^(mob|ph|tel|call|whatsapp)/i.test(l); });
    if (adr.length) out.address = adr.join(", ").replace(/^(address|add|addr)\s*[:.-]?\s*/i, "").replace(/\s*,(\s*,)+/g, ",").slice(0, 300);
    /* मालिक: Prop. / Proprietor / Mr. वाली लाइन */
    lines.some(function (l) { var m = l.match(/^(?:prop(?:rietor)?\.?|owner|mr\.?|mrs\.?|ms\.?|shri|contact person)\s*[:.-]?\s*([A-Za-z][A-Za-z .]{2,40})$/i); if (m) { out.owner = tc(m[1].replace(/\s+/g, " ").trim()); return true; } return false; });
    /* दुकान का नाम: व्यापार वाले शब्द वाली लाइन, नहीं तो पहली बड़ी लाइन */
    var cand = lines.filter(function (l) { return !/@|www\.|https?:|\d{5,}/i.test(l) && !ADDRW.test(l) && /[A-Za-z]{3,}/.test(l) && l.length <= 60 && l.split(" ").length <= 7; });
    var biz = cand.filter(function (l) { return BIZW.test(l); })[0] || cand.filter(function (l) { return l === l.toUpperCase() && l.replace(/[^A-Z]/g, "").length >= 5; })[0] || cand[0];
    if (biz) out.shop = tc(biz.replace(/[^A-Za-z0-9&.,'() -]/g, "").trim()).slice(0, 80);
    if (out.owner && out.shop && out.owner.toLowerCase() === out.shop.toLowerCase()) delete out.owner;
    return out;
  }
  function setVal(id, v) { var el = $(id); if (!el || !v || String(el.value || "").trim()) return false; el.value = v; try { el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); } catch (e) {} return true; }
  function apply(o) {
    var got = [], N = { shop: L("Shop name", "दुकान का नाम"), owner: L("Owner name", "मालिक का नाम"), phone: L("Mobile", "मोबाइल"), email: L("Email", "ईमेल"), web: L("Website", "वेबसाइट"), city: L("City", "शहर"), address: L("Address", "पता"), pin: "PIN" };
    ["phone", "shop", "owner", "email", "web", "city", "address", "pin"].forEach(function (k) { if (setVal(k, o[k])) got.push(N[k] + ": " + o[k]); });
    return got;
  }

  function mount() {
    var step = document.querySelector('.step[data-s="phone"]'); if (!step || $("pbcs")) return;
    var box = document.createElement("div"); box.id = "pbcs";
    box.style.cssText = "border:1.5px dashed #9ec5ff;background:#f4f8ff;border-radius:14px;padding:12px;margin:0 0 14px";
    box.innerHTML = '<button type="button" id="pbcsB" style="width:100%;border:0;border-radius:12px;background:#1a73e8;color:#fff;font:inherit;font-weight:700;font-size:15px;padding:12px;cursor:pointer"></button>' +
      '<input type="file" id="pbcsF" accept="image/*" capture="environment" hidden><p id="pbcsH" style="margin:8px 0 0;font-size:13px;color:#5b6475;line-height:1.45"></p><div id="pbcsR" style="margin-top:6px;font-size:13px;line-height:1.5"></div>';
    step.insertBefore(box, step.firstChild);
    texts();
    $("pbcsB").onclick = function () { $("pbcsF").click(); };
    $("pbcsF").onchange = function () { var f = this.files && this.files[0]; this.value = ""; if (f) run(f); };
    try { if (window.PB && PB.onChange) PB.onChange(texts); } catch (e) {}
  }
  function texts() {
    if (!$("pbcsB")) return;
    $("pbcsB").textContent = "📸 " + L("Fill from visiting card", "विज़िटिंग कार्ड से भरें");
    $("pbcsH").textContent = L("Take a photo of your visiting card. It is read on your phone only (not uploaded). Check every box before going ahead.", "अपने विज़िटिंग कार्ड की फ़ोटो लें। कार्ड सिर्फ़ आपके फ़ोन में पढ़ा जाता है (कहीं भेजा नहीं जाता)। आगे बढ़ने से पहले हर खाना जाँच लें।");
  }
  function msg(h, c) { var r = $("pbcsR"); if (r) { r.style.color = c || "#344054"; r.innerHTML = h; } }
  var busy = false;
  function run(file) {
    if (busy) return; busy = true; $("pbcsB").disabled = true;
    msg(L("Reading the card… (first time may take a minute)", "कार्ड पढ़ रहे हैं… (पहली बार 1 मिनट तक लग सकता है)"));
    var worker = null;
    Promise.all([loadTJS(), prep(file)]).then(function (r) {
      var cv = r[1];
      return Tesseract.createWorker("eng", 1, { logger: function (m) { if (m && m.status === "recognizing text" && m.progress) msg(L("Reading the card… ", "कार्ड पढ़ रहे हैं… ") + Math.round(m.progress * 100) + "%"); } })
        .then(function (w) { worker = w; return w.recognize(cv); });
    }).then(function (res) {
      var o = parse(res && res.data && res.data.text), got = apply(o);
      var esc = function (t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
      if (!got.length) msg(L("Could not find details on the card. Try a clearer photo in good light, or fill the form yourself.", "कार्ड से जानकारी नहीं मिली। रोशनी में साफ़ फ़ोटो लें, या फ़ॉर्म खुद भरें।"), "#b42318");
      else msg("<b>✅ " + esc(L("Filled from the card — please check:", "कार्ड से भरा गया — कृपया जाँच लें:")) + "</b><br>" + got.map(esc).join("<br>"), "#1e6b35");
      try { window.PBT && PBT.ev && PBT.ev("reg", "cardscan-" + (got.length ? "ok" : "none")); } catch (e) {}
    }).catch(function () {
      msg(L("Could not read the card right now. Please fill the form yourself.", "अभी कार्ड नहीं पढ़ पाए। कृपया फ़ॉर्म खुद भरें।"), "#b42318");
    }).then(function () { busy = false; $("pbcsB").disabled = false; try { if (worker) worker.terminate(); } catch (e) {} });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
  window.PBCardScan = { parse: parse };
})();
