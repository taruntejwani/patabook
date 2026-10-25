/* PataBook — दुकान का "प्रकार" (category से अपने-आप)
   Premium Products वाले हिस्से के लिए: दुकान सामान बेचती है या सेवा देती है, और किस Unit में।
   AI नहीं — नीचे की table (RULES) से तय होता है। नई category जोड़ो तो यहाँ एक line जोड़ दो।
   इस्तेमाल: shop.html, business.html (ग्राहक) और pb-products-owner.js (दुकानदार) */
(function () {
  /* Unit: i = icon, hi/en = नाम, z = size / rate वाले बटन, x = "और जानकारी" के खाने [key, हिन्दी, English, उदाहरण] */
  var X_PROD = [["Brand", "🏷️ Brand", "🏷️ Brand", "Tejwani"], ["Packing", "📦 Packing", "📦 Packing", "Can / Bottle / Pouch"], ["Min order", "🚚 कम से कम Order", "🚚 Min order", "5 Can"]];
  var X_SVC = [["Area", "📍 कहाँ तक सेवा", "📍 Service area", "Gandhidham, Adipur"], ["Time", "⏱️ कितना समय लगता है", "⏱️ Time taken", "1–2 घंटे"], ["Includes", "✅ इसमें शामिल", "✅ Includes", "Material अलग"]];
  var UNITS = {
    vol: { i: "🧴", hi: "Ltr / ML", en: "Ltr / ML", z: ["100 ML", "200 ML", "500 ML", "1 Ltr", "5 Ltr", "20 Ltr", "25 Ltr", "50 Ltr"], x: X_PROD },
    wt: { i: "⚖️", hi: "वज़न (Kg/g)", en: "Weight (Kg/g)", z: ["100 g", "250 g", "500 g", "1 Kg", "5 Kg", "25 Kg", "50 Kg", "1 Quintal"], x: X_PROD },
    pcs: { i: "🔢", hi: "पीस", en: "Pieces", z: ["1 PCS", "2 PCS", "6 PCS", "12 PCS (1 Dozen)", "1 Box", "1 Packet"], x: X_PROD },
    sz: { i: "👕", hi: "Size", en: "Size", z: ["S", "M", "L", "XL", "XXL", "Free Size", "6", "7", "8", "9", "10"], x: X_PROD },
    len: { i: "📏", hi: "लंबाई", en: "Length", z: ["1 Meter", "5 Meter", "10 Meter", "1 Feet", "10 Feet"], x: X_PROD },
    svc: { i: "🛠️", hi: "सेवा", en: "Service", z: ["Per visit", "Per hour", "Per day", "Per job"], x: X_SVC },
    ship: { i: "🚚", hi: "माल ढुलाई", en: "Goods transport", z: ["Per kg", "Per ton", "Per km", "Per trip", "Per container", "Per parcel"],
      x: [["Routes", "🗺️ रूट / शहर", "🗺️ Routes / cities", "Gandhidham → Mumbai"], ["Vehicle", "🚛 गाड़ी", "🚛 Vehicle", "Truck / Container / Tempo"], ["Min load", "📦 कम से कम माल", "📦 Minimum load", "1 Ton"]] },
    ride: { i: "🚕", hi: "सवारी / यात्रा", en: "Ride / Travel", z: ["Per km", "Per trip", "Per day", "Per person", "Per package"],
      x: [["Routes", "🗺️ रूट / शहर", "🗺️ Routes / cities", "Gandhidham → Ahmedabad"], ["Vehicle", "🚗 गाड़ी", "🚗 Vehicle", "Sedan / SUV / Bus"], ["Seats", "💺 सीट", "💺 Seats", "4 + 1"]] },
    stay: { i: "🛏️", hi: "कमरा / ठहरना", en: "Room / Stay", z: ["Per night", "Per room", "Per person", "Per day", "Per month"],
      x: [["Room", "❄️ AC / Non-AC", "❄️ AC / Non-AC", "AC"], ["Beds", "🛏️ बेड", "🛏️ Beds", "2 Bed"], ["Includes", "🍳 साथ में", "🍳 Includes", "Breakfast, WiFi"]] },
    food: { i: "🍽️", hi: "प्लेट / थाली", en: "Plate / Thali", z: ["Per plate", "Per thali", "Per person", "Half", "Full", "Per kg"],
      x: [["Type", "🥗 Veg / Non-veg", "🥗 Veg / Non-veg", "Veg"], ["Serves", "👥 कितने लोग", "👥 Serves", "2 लोग"], ["Timing", "🕘 कब मिलता है", "🕘 Available", "Lunch / Dinner"]] },
    edu: { i: "🎓", hi: "फ़ीस", en: "Fees", z: ["Per month", "Per course", "Per class", "Per year"],
      x: [["Duration", "⏳ अवधि", "⏳ Duration", "3 Months"], ["Batch", "🕘 Batch का समय", "🕘 Batch time", "सुबह 8–10"], ["Mode", "🏫 Online / Offline", "🏫 Online / Offline", "Offline"]] },
    med: { i: "🩺", hi: "जाँच / सलाह", en: "Consultation / Test", z: ["Per visit", "Per consultation", "Per test", "Per session"],
      x: [["Doctor", "👨‍⚕️ डॉक्टर", "👨‍⚕️ Doctor", "Dr. Sharma"], ["Timing", "🕘 समय", "🕘 Timing", "10 AM – 1 PM"], ["Report", "📄 रिपोर्ट कब", "📄 Report in", "उसी दिन"]] },
    event: { i: "🎉", hi: "Event / Booking", en: "Event / Booking", z: ["Per event", "Per day", "Per hour", "Per person"], x: X_SVC },
    pro: { i: "💼", hi: "Professional फ़ीस", en: "Professional fee", z: ["Per case", "Per hour", "Per project", "Per month"], x: X_SVC }
  };
  var ORDER = ["vol", "wt", "pcs", "sz", "len", "svc", "ship", "ride", "stay", "food", "edu", "med", "event", "pro"];

  /* ⭐ TABLE: category के शब्द → Unit + हिस्सा (p = सामान, s = सेवा, b = दोनों). ऊपर वाली line पहले जाँची जाती है */
  var RULES = [
    [/truck|transport|courier|parcel|logistic|shipping|cargo|freight|container|packers|movers|tempo|goods carrier|माल/, "ship", "s"],
    [/taxi|\bcab\b|car rental|rickshaw|travel|tour|ticket|bus service/, "ride", "s"],
    [/sweet|mithai|farsan|namkeen|dry ?fruit/, "wt", "p"],
    [/bakery|cake/, "pcs", "p"],
    [/restaurant|dhaba|cafe|coffee|fast food|catering|tiffin|thali|food court|mess\b|hotel restaurant/, "food", "b"],
    [/guest ?house|lodge|resort|dharamshala|\bpg\b|paying guest|hostel|homestay|\bhotel\b|rooms/, "stay", "s"],
    [/medical store|pharmacy|chemist|druggist/, "pcs", "p"],
    [/doctor|hospital|clinic|dental|dentist|diagnostic|\blab\b|laboratory|pathology|physio|nursing home|ayurved|homeopath/, "med", "s"],
    [/school|college|coaching|tuition|classes|computer class|institute|academy|training|education/, "edu", "s"],
    [/wedding|event|photograph|photo studio|videograph|\bdj\b|decorat|tent house|banquet|party hall/, "event", "s"],
    [/lawyer|advocate|notary|\bca\b|chartered|accountant|tax consult|architect|interior|digital marketing|consultant|insurance|loan|real estate|property|builder|broker/, "pro", "s"],
    [/salon|saloon|spa|parlour|parlor|beauty|barber|massage|gym|yoga|fitness/, "svc", "s"],
    [/\bac\b|air condition|carpenter|plumber|painter|electrician|repair|cleaning|pest control|car wash|detailing|garage|mechanic|car service|servicing|home service|ro water|purifier|laundry|dry clean|tailor/, "svc", "s"],
    [/cloth|garment|fashion|boutique|saree|footwear|shoe|chappal|readymade/, "sz", "p"],
    [/chemical|detergent|lubricant|engine oil|\boil\b|paint|phenyl|shampoo|polish|liquid|sanitizer|acid/, "vol", "p"],
    [/grocery|kirana|provision|rice|grain|flour|atta|spice|masala|vegetable|fruit|dairy|milk/, "wt", "p"],
    [/hardware|pipe|cable|wire|cloth roll|fabric/, "len", "p"],
    [/electronic|\bmobile|furniture|auto parts|spare|tyre|tire|battery|bike|scooter|car dealer|showroom|plastic|engineering|machine|fabrication|supplier|distributor|wholesale|stationery|gift|toy|book/, "pcs", "p"]
  ];
  function lineOf(desc, k) { var m = new RegExp("^" + k + ":\\s*(.+)$", "mi").exec(String(desc || "")); return m ? m[1].trim() : ""; }
  function match(t) {
    t = String(t || "").toLowerCase();
    if (!t.trim()) return null;
    for (var i = 0; i < RULES.length; i++) if (RULES[i][0].test(t)) return { unit: RULES[i][1], mode: RULES[i][2] };
    return null;
  }
  /* b = दुकान ({category, description} या सिर्फ़ description) → {unit, mode, auto}. कुछ न मिले तो {unit:"", mode:"p"} */
  function of(b) {
    b = b || {};
    var d = b.description || b.d || "";
    var first = [lineOf(d, "Subcategory"), lineOf(d, "Category")].join(" ");
    /* पहले दुकान की अपनी category, फिर "क्या बेचते हैं" वाली line, आखिर में बड़ी category (Automobile जैसी) */
    var r = match(first) || match(lineOf(d, "Services")) || match(b.category) || match(lineOf(d, "Type"));
    return r ? { unit: r.unit, mode: r.mode, auto: true } : { unit: "", mode: "p", auto: false };
  }
  /* Unit से हिस्सा: सेवा वाले Unit = सेवा */
  var SVC_UNITS = { svc: 1, ship: 1, ride: 1, stay: 1, edu: 1, med: 1, event: 1, pro: 1 };
  function modeOfUnit(u, fallback) { return u === "food" ? "b" : SVC_UNITS[u] ? "s" : UNITS[u] ? "p" : (fallback || "p"); }
  /* products के size से Unit का अंदाज़ा (पुराने products) */
  function guess(list) {
    var t = (list || []).map(function (p) { return String(p.size || ""); }).join(" | ").toLowerCase();
    if (!t.replace(/[\s|]/g, "")) return "";
    var best = "", n = 0;
    ORDER.forEach(function (k) {
      var c = 0; UNITS[k].z.forEach(function (z) { if (t.indexOf(z.toLowerCase()) >= 0) c++; });
      if (c > n) { n = c; best = k; }
    });
    if (best) return best;
    if (/\b(ml|ltr|litre|liter)\b/.test(t)) return "vol"; if (/\b(kg|g|gram|quintal)\b/.test(t)) return "wt";
    if (/\b(pcs|pc|dozen|box|packet)\b/.test(t)) return "pcs"; if (/\b(meter|feet|ft)\b/.test(t)) return "len";
    return "";
  }
  /* हिस्से के शब्द (ग्राहक और दुकानदार दोनों के लिए) */
  var WORDS = {
    p: { sec: ["हमारे Products", "Our Products"], ic: "🛍️", nav: ["Products", "Products"], one: ["Product", "Product"], ask: ["कीमत पूछें", "Ask price"], best: ["सबसे ज़्यादा बिकता", "Best seller"], out: ["अभी Stock में नहीं", "Out of stock"], btn: ["Products", "Products"], nw: ["नया", "New"] },
    s: { sec: ["हमारी सेवाएँ", "Our Services"], ic: "🛠️", nav: ["सेवाएँ", "Services"], one: ["सेवा", "Service"], ask: ["Rate पूछें", "Ask rate"], best: ["सबसे लोकप्रिय", "Most popular"], out: ["अभी उपलब्ध नहीं", "Not available now"], btn: ["सेवाएँ", "Services"], nw: ["नई", "New"] },
    b: { sec: ["Products और सेवाएँ", "Products & Services"], ic: "🍽️", nav: ["Menu", "Menu"], one: ["Item", "Item"], ask: ["कीमत पूछें", "Ask price"], best: ["सबसे लोकप्रिय", "Most popular"], out: ["अभी उपलब्ध नहीं", "Not available now"], btn: ["Menu / सेवाएँ", "Menu / Services"], nw: ["नया", "New"] }
  };
  function word(mode, k, en) { var w = (WORDS[mode] || WORDS.p)[k]; return Array.isArray(w) ? w[en ? 1 : 0] : w; }
  /* "Routes: …" जैसी खूबी का नाम ग्राहक की भाषा में */
  function featLabel(f, en) {
    var m = /^([A-Za-z ]+):\s*(.+)$/.exec(String(f || "")); if (!m) return f;
    for (var k in UNITS) { var xs = UNITS[k].x; for (var i = 0; i < xs.length; i++) if (xs[i][0].toLowerCase() === m[1].trim().toLowerCase()) return (en ? xs[i][2] : xs[i][1]) + ": " + m[2]; }
    return f;
  }
  window.PBKind = { UNITS: UNITS, ORDER: ORDER, RULES: RULES, of: of, match: match, guess: guess, modeOfUnit: modeOfUnit, word: word, featLabel: featLabel };
})();
