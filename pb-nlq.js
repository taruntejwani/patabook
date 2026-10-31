/* PataBook — सवाल जैसी खोज समझना (Natural Language Query, सिर्फ़ नियमों से — कोई AI / खर्च नहीं).
   "Jay Shankar Restaurant kahan hai?" → text:"Jay Shankar Restaurant", intent:"where".
   सुरक्षा का नियम: वाक्य में कोई सवाल/इरादे वाला शब्द न हो तो कुछ नहीं बदलता (changed:false) — तब खोज आज जैसी ही चलती है.
   बंद करने के लिए URL में ?nlq=0 */
(function () {
  function set(s) { var o = {}; s.split(/\s+/).forEach(function (w) { if (w) o[w] = 1; }); return o; }
  /* सवाल / इरादे वाले शब्द: मिलें तो वाक्य "सवाल" माना जाता है */
  var WHERE = set("kahan kaha kahaan kidhar kidhr kahaan कहाँ कहां कहा किधर ક્યાં ક્યા where");
  var DO = set("batao bata btao bataiye bataiyen bataye batana dikhao dikha dikhaiye dikhana chahiye chahie chaiye chahye milega milegi milenge milta milti show find tell give बताओ बताइए बताइये बताना बता दिखाओ दिखाइए दिखाना चाहिए चाहिये मिलेगा मिलेगी मिलता बતાવો બતાવ બતાવો આપો જોઈએ મળશે મળે");
  var BEST = set("achha acha accha achhe acche achhi acchi badhiya best top sasta सबसे अच्छा अच्छी अच्छे बढ़िया सस्ता સારું સારી સારા સસ્તું");
  var NEAR = set("near nearby paas pass najdik nazdik nazdeek पास नज़दीक नजदीक નજીક");
  var PHONE = set("number nmbr num नंबर नम्बर नं. નંબર");
  var ASIDE = set("mobile phone contact call whatsapp मोबाइल फोन फ़ोन कॉल મોબાઇલ ફોન");   /* सिर्फ़ तब हटते हैं जब "number" भी लिखा हो */
  var DIR = set("rasta raasta route direction directions navigate रास्ता रूट रस्ता રસ્તો રૂટ");
  var ADDR = set("address pata pta पता સરનામું સરનામુ");
  var LOC = set("location loc लोकेशन લોકેશન");
  var OPEN = set("khula khule khuli open timing time timings band closed खुला खुली खुले बंद टाइम समय ખુલ્લું ખુલ્લી ખુલ્લા બંધ ટાઈમ");
  /* सिर्फ़ फ़ालतू (सवाल मिलने पर हटते हैं) */
  var STOP = set("hai hain he hu hoon ho hota hoga hogi ka ki ke ko se mein me mai main ma pe par per mujhe mujhko mere meri mera humko hame ek koi kuch kya kyu aap abhi ab aaj wala wali wale vala vali vale liye lie for the a an is are of to in at on please plz pls do de dena dijiye dijie kijiye karo kare karna kar sakta sakte sakti bhi toh aur jyada " +
    "है हैं हूँ होगा होगी का की के को से में मैं पे पर मुझे मेरे मेरी मेरा हमें एक कोई कुछ क्या अभी अब आज वाला वाली वाले के लिए लिये दो दे दीजिए कीजिए करो करें करना कर सकता सकते सकती भी तो और ज़्यादा " +
    "છે છે? નો ની ના નું માં મને મારી મારા એક કોઈ કંઈ શું હમણાં અત્યારે આજે નજીકમાં ને થી પર કરો કરી આપો");
  function norm(q) { return String(q || "").replace(/[?!।॥,;:()"'*]/g, " ").replace(/\s+/g, " ").trim(); }
  function parse(q) {
    var out = { changed: false, text: String(q || ""), intent: "", best: false, near: false };
    try {
      if (/(^|[?&])nlq=0(&|$)/.test(location.search)) return out;
      var toks = norm(q).split(" ").filter(Boolean); if (toks.length < 2 && !/\?$/.test(String(q || "").trim())) {
        /* एक शब्द ("kahan") अकेला हो तो भी कुछ नहीं */ if (toks.length < 2) return out; }
      var low = toks.map(function (t) { return t.toLowerCase(); });
      var trig = false, hasNum = low.some(function (t) { return PHONE[t]; });
      low.forEach(function (t, i) {
        if (WHERE[t] || DO[t] || BEST[t] || NEAR[t] || PHONE[t] || DIR[t] || ADDR[t] || LOC[t] || OPEN[t]) trig = true;
        if (t === "kya" && /^(hai|he|h|hain)$/.test(low[i - 1] || "")) trig = true;
      });
      if (!trig) return out;
      var keep = [], intent = "";
      var pri = { phone: 5, dir: 4, open: 3, addr: 2, where: 1 };
      function it(x) { if (!intent || pri[x] > pri[intent]) intent = x; }
      for (var i = 0; i < toks.length; i++) {
        var t = low[i];
        if (PHONE[t]) { it("phone"); continue; }
        if (ASIDE[t] && hasNum) continue;
        if (DIR[t]) { it("dir"); continue; }
        if (OPEN[t]) { it("open"); continue; }
        if (ADDR[t]) { it("addr"); continue; }
        if (WHERE[t] || LOC[t]) { it("where"); continue; }
        if (BEST[t]) { out.best = true; continue; }
        if (NEAR[t]) { out.near = true; continue; }
        if (DO[t] || STOP[t]) continue;
        keep.push(toks[i]);
      }
      if (!keep.length) return out;   /* सब कुछ हट गया → असली शब्द ही नहीं बचे, छोड़ दो */
      out.changed = true; out.text = keep.join(" "); out.intent = intent || (out.best || out.near ? "find" : "find");
    } catch (e) {}
    return out;
  }
  window.PBNLQ = { parse: parse };
})();
