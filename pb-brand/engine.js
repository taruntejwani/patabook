/* PataBook Platinum — Brand page engine: 10 layouts × 10 colour themes = 100 designs.
   PBBrand.render(root, D, layout(1-10), theme(1-10)) — D = दुकान का data (brand.html / demo बनाता है) */
(function () {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
  const rs = n => "₹" + Number(n).toLocaleString("en-IN");
  let NOCOLL = false, D = null, LY = 1, TH = 1, ROOT = null, CAT = "all", Q = "", BAG = {};
  const L = (hi, en) => D.en ? en : hi;
  const I = {
    call: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 21l1.6-4.6A9 9 0 1 1 8 19.6z"/><path d="M9 9.5c.3 2.2 2.3 4.2 4.5 4.5l1-1.2 2 .8c-.2 1.3-1.2 2-2.6 1.8A7 7 0 0 1 8 9.5c-.2-1.4.5-2.4 1.8-2.6l.8 2z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    arr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    star: '★'
  };

  /* 🎨 10 रंग — हर theme में सिर्फ़ CSS variables */
  const THEMES = [
    { k: "navy", hi: "नेवी प्लैटिनम", en: "Navy Platinum", dark: 1, v: { bg: "#0a1230", bg2: "#0f1b47", fg: "#eef2fa", mu: "#93a0c2", ac: "#c7d2e8", ln: "rgba(140,160,215,.24)", card: "linear-gradient(160deg,#f4f6fb,#dde3ef)", acfg: "#0a1230", bgr: "10,18,48", metal: "linear-gradient(135deg,#fff 0%,#c9d3e8 28%,#8ea0c8 48%,#eef2fb 62%,#a9b6d4 100%)", deco: "chev" } },
    { k: "gold", hi: "काला-गोल्ड", en: "Black Gold", dark: 1, v: { bg: "#0b0b0c", bg2: "#151517", fg: "#f3efe7", mu: "#a19c92", ac: "#d8c39a", ln: "#2a292d", card: "#f3efe7", acfg: "#0b0b0c", bgr: "11,11,12", metal: "linear-gradient(135deg,#f6e7c3,#cfae6e 45%,#f3e2b8 60%,#b08d4f)", deco: "glow" } },
    { k: "rose", hi: "रोज़ गोल्ड", en: "Rose Gold", dark: 0, v: { bg: "#fbf3f0", bg2: "#f4e3dd", fg: "#3b1f22", mu: "#8d6a68", ac: "#b76e79", ln: "rgba(183,110,121,.25)", card: "#fff", acfg: "#fff", bgr: "251,243,240", metal: "linear-gradient(135deg,#f2c9bc,#c98b7f 45%,#f6d9cf 60%,#a5606a)", deco: "arc" } },
    { k: "emerald", hi: "एमराल्ड", en: "Emerald", dark: 1, v: { bg: "#06261d", bg2: "#0a3326", fg: "#eef5ef", mu: "#93b3a3", ac: "#d6b46a", ln: "rgba(214,180,106,.22)", card: "#f2efe6", acfg: "#06261d", bgr: "6,38,29", metal: "linear-gradient(135deg,#f3dfa6,#c99d48 45%,#f1dca3 60%,#a37b31)", deco: "glow" } },
    { k: "maroon", hi: "मैरून रॉयल", en: "Royal Maroon", dark: 1, v: { bg: "#3a0b14", bg2: "#4a1019", fg: "#fbefe6", mu: "#c99c97", ac: "#e6c27a", ln: "rgba(230,194,122,.24)", card: "#fbf4ea", acfg: "#3a0b14", bgr: "58,11,20", metal: "linear-gradient(135deg,#f8e3ad,#d6a74f 45%,#f6dfa6 60%,#b0832f)", deco: "arc" } },
    { k: "white", hi: "सफ़ेद मिनिमल", en: "Pure White", dark: 0, v: { bg: "#ffffff", bg2: "#f4f4f2", fg: "#111111", mu: "#6b6b6b", ac: "#111111", ln: "#e6e6e3", card: "#f4f4f2", acfg: "#fff", bgr: "255,255,255", metal: "linear-gradient(135deg,#111,#3a3a3a)", deco: "none" } },
    { k: "sand", hi: "आइवरी सैंड", en: "Ivory Sand", dark: 0, v: { bg: "#f4efe6", bg2: "#ebe3d5", fg: "#2b2620", mu: "#7d7262", ac: "#8a6a3d", ln: "rgba(138,106,61,.22)", card: "#fbf8f2", acfg: "#fbf8f2", bgr: "244,239,230", metal: "linear-gradient(135deg,#b08b55,#7a5a2e)", deco: "none" } },
    { k: "violet", hi: "मिडनाइट वायलेट", en: "Midnight Violet", dark: 1, v: { bg: "#140c2a", bg2: "#1d1340", fg: "#f1edff", mu: "#a79cc9", ac: "#b9a3ff", ln: "rgba(185,163,255,.22)", card: "#f1edff", acfg: "#140c2a", bgr: "20,12,42", metal: "linear-gradient(135deg,#efe9ff,#a68cff 45%,#e6ddff 60%,#7d63e0)", deco: "chev" } },
    { k: "teal", hi: "ओशन टील", en: "Ocean Teal", dark: 1, v: { bg: "#03242b", bg2: "#06313a", fg: "#e9fbf8", mu: "#8fb9b5", ac: "#7fe0d4", ln: "rgba(127,224,212,.2)", card: "#eaf7f5", acfg: "#03242b", bgr: "3,36,43", metal: "linear-gradient(135deg,#d9fff9,#62cfc1 45%,#c8f7f0 60%,#3aa597)", deco: "arc" } },
    { k: "racing", hi: "चारकोल ऑरेंज", en: "Charcoal Orange", dark: 1, v: { bg: "#16181b", bg2: "#1f2226", fg: "#f4f4f2", mu: "#9ea3aa", ac: "#ff7a3d", ln: "#2c3036", card: "#eef0f2", acfg: "#16181b", bgr: "22,24,27", metal: "linear-gradient(135deg,#ffb07f,#ff6a2a 50%,#ff9a5c)", deco: "chev" } }
  ];
  const LAYOUTS = [
    { k: "luxury", hi: "लग्ज़री", en: "Luxury" }, { k: "cinema", hi: "सिनेमा", en: "Cinematic" }, { k: "edit", hi: "एडिटोरियल", en: "Editorial" },
    { k: "store", hi: "ऑनलाइन स्टोर", en: "Store" }, { k: "minimal", hi: "मिनिमल", en: "Minimal" }, { k: "poster", hi: "पोस्टर", en: "Bold Poster" },
    { k: "split", hi: "स्प्लिट", en: "Split Screen" }, { k: "bento", hi: "बेंटो", en: "Bento Grid" }, { k: "classic", hi: "क्लासिक दुकान", en: "Classic Shop" },
    { k: "prestige", hi: "प्रेस्टीज ब्रांड", en: "Prestige Brand" }
  ];
  function decoUrl(t) {
    const c = t.v.ac, f = t.v.bg2;
    let svg = "";
    if (t.v.deco === "chev") svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".4" stop-color="' + c + '" stop-opacity=".5"/><stop offset=".65" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="' + c + '" stop-opacity=".3"/></linearGradient></defs><path d="M0 0h170l300 400-300 400H0z" fill="' + f + '"/><path d="M1200 0h-170L730 400l300 400h170z" fill="' + f + '"/><g fill="none" stroke="url(#m)" stroke-width="3"><path d="M170 0l300 400-300 400"/><path d="M1030 0L730 400l300 400"/><path d="M60 120l210 280-210 280"/><path d="M1140 120L930 400l210 280"/><path d="M430 800l170-230 170 230"/><path d="M380 0l220 290 220-290" stroke-width="1.5" opacity=".7"/></g></svg>';
    else if (t.v.deco === "arc") svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="' + c + '" stroke-opacity=".35"><circle cx="1050" cy="120" r="260" stroke-width="1.5"/><circle cx="1050" cy="120" r="330"/><circle cx="150" cy="760" r="240" stroke-width="1.5"/><circle cx="150" cy="760" r="300"/></g></svg>';
    else if (t.v.deco === "glow") svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="g"><stop offset="0" stop-color="' + c + '" stop-opacity=".22"/><stop offset="1" stop-color="' + c + '" stop-opacity="0"/></radialGradient></defs><ellipse cx="600" cy="330" rx="520" ry="360" fill="url(#g)"/><path d="M0 700h1200" stroke="' + c + '" stroke-opacity=".25"/></svg>';
    return svg ? 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/'/g, "%27") + '")' : "none";
  }
  function applyTheme(el, n) {
    const t = THEMES[n - 1];
    Object.keys(t.v).forEach(k => { if (k !== "deco") el.style.setProperty("--" + k, t.v[k]); });
    el.style.setProperty("--deco", decoUrl(t));
    el.dataset.dark = t.dark ? "1" : "0";
  }

  /* ---------- छोटे हिस्से ---------- */
  const offerOf = p => p.offer || 0;
  function price(p, cls) { const o = offerOf(p); if (!o && !p.mrp) return ""; return '<span class="' + (cls || "pr") + '">' + (o && p.mrp && o < p.mrp ? '<s>' + rs(p.mrp) + '</s> ' : '') + '<b>' + rs(o || p.mrp) + '</b>' + (!o && p.mrp ? ' <small>MRP</small>' : '') + '</span>'; }
  function offPct(p) { const o = offerOf(p); return o && p.mrp && o < p.mrp ? Math.round((p.mrp - o) * 100 / p.mrp) : 0; }
  function askMsg(p) { return L("नमस्ते, मुझे " + p.name + (p.size ? " (" + p.size + ")" : "") + " चाहिए। PataBook पर आपका पेज देखा।", "Hello, I'm interested in " + p.name + (p.size ? " (" + p.size + ")" : "") + ". I saw it on your PataBook page."); }
  function ask(p, cls, txt) { const u = D.waLink(askMsg(p)); return u ? '<a class="' + (cls || "ask") + '" href="' + esc(u) + '" target="_blank" rel="noopener">' + (txt || L("WhatsApp पर पूछें", "Enquire on WhatsApp")) + '</a>' : ''; }
  function tag(p) { return p.stock === false ? '<span class="tg os">' + L("अभी स्टॉक में नहीं", "Out of stock") + '</span>' : p.best ? '<span class="tg">' + L("बेस्टसेलर", "Bestseller") + '</span>' : offPct(p) ? '<span class="tg">' + offPct(p) + '% ' + L("छूट", "off") + '</span>' : ''; }
  function img(p) { return p.img ? '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async">' : '<i class="noimg">' + esc((p.name || "?")[0]) + '</i>'; }
  function feats(p, n) { const f = (p.feats || []).slice(0, n || 4); return f.length ? '<ul class="fts">' + f.map(x => '<li>' + esc(x) + '</li>').join("") + '</ul>' : ''; }
  function cats() { const P = D.products, c = [["all", L("सभी", "All")]]; if (P.some(offerOf)) c.push(["offer", L("ऑफ़र", "Offers")]); if (P.some(p => p.best)) c.push(["best", L("बेस्टसेलर", "Bestsellers")]); if (P.some(p => p.stock === false)) c.push(["stock", L("स्टॉक में", "In stock")]); return c.length > 1 ? c : []; }
  function catBar(cls) { const c = cats(); return c.length ? '<div class="cats ' + (cls || "") + '" role="group" aria-label="' + esc(L("फ़िल्टर", "Filter")) + '">' + c.map(x => '<button type="button" data-c="' + x[0] + '" aria-pressed="' + (CAT === x[0]) + '">' + esc(x[1]) + '</button>').join("") + '</div>' : ''; }
  function filtered() { const q = Q.trim().toLowerCase(); return D.products.filter(p => (CAT === "all" || (CAT === "offer" && offerOf(p)) || (CAT === "best" && p.best) || (CAT === "stock" && p.stock !== false)) && (!q || (p.name + " " + (p.size || "") + " " + (p.feats || []).join(" ")).toLowerCase().includes(q))); }
  const pidx = p => D.products.indexOf(p);
  const nn = i => String(i + 1).padStart(2, "0");
  function waBtn(cls, txt) { const u = D.waLink(L("नमस्ते, PataBook पर आपका पेज देखा।", "Hello, I saw your page on PataBook.")); return u ? '<a class="' + cls + '" href="' + esc(u) + '" target="_blank" rel="noopener">' + I.wa + '<span>' + (txt || "WhatsApp") + '</span></a>' : ''; }
  function callBtn(cls, txt) { return D.ph ? '<a class="' + cls + '" href="tel:' + esc(D.ph) + '">' + I.call + '<span>' + (txt || L("कॉल करें", "Call")) + '</span></a>' : ''; }
  function dirBtn(cls, txt) { return D.dir ? '<a class="' + cls + '" href="' + esc(D.dir) + '">' + I.pin + '<span>' + (txt || L("रास्ता देखें", "Directions")) + '</span></a>' : ''; }
  function openChip(cls) { return D.open ? '<span class="' + (cls || "st") + (D.open.o ? '' : ' cl') + '"><i></i>' + esc(D.open.t) + '</span>' : ''; }
  function navs() { return [D.products.length && !NOCOLL && ["coll", L("कलेक्शन", "Collection")], D.gallery.length && ["gal", L("गैलरी", "Gallery")], ["about", L("हमारे बारे में", "About")], ["visit", L("पता", "Visit")]].filter(Boolean); }
  /* दुकान का Logo (plan में हो और दुकानदार ने लगाया हो) */
  function logoImg(c) { return D.logo ? '<img class="mlg ' + (c || '') + '" src="' + esc(D.logo) + '" alt="' + esc(D.name) + ' logo" decoding="async">' : ''; }
  /* दुकान के काम के बटन: नौकरी · डिजिटल कार्ड · शेयर · शिकायत (हर design में, footer के ऊपर) */
  function tools() {
    const T = D.tools || {}, b = [];
    if (T.hire) b.push('<button type="button" class="tl hire" data-tool="hire"><i>💼</i><span>' + L("नौकरी खाली है", "We're hiring") + '</span></button>');
    if (T.card) b.push('<button type="button" class="tl" data-tool="card" data-pbh="share"><i>🪪</i><span>' + L("डिजिटल कार्ड", "Digital card") + '</span></button>');
    if (T.share) b.push('<button type="button" class="tl" data-tool="share" data-pbh="share"><i>📤</i><span>' + L("शेयर करें", "Share") + '</span></button>');
    if (T.report) b.push('<button type="button" class="tl rp" data-tool="report"><i>🚩</i><span>' + L("शिकायत करें", "Report") + '</span></button>');
    return b.length ? '<section class="tools" aria-label="' + esc(L("और काम", "More actions")) + '"><div class="w">' + b.join("") + '</div></section>' : '';
  }
  function nav(extra) {
    return '<header class="nv"><div class="w in"><a class="mk' + (D.logo ? ' hl' : '') + '" href="#top">' + logoImg() + '<span class="mkt"><b>' + esc(D.name) + '</b><small>' + esc(D.sub) + '</small></span></a>' +
      '<nav class="lk" aria-label="' + esc(L("मुख्य मेनू", "Main menu")) + '">' + navs().map(n => '<a href="#' + n[0] + '">' + esc(n[1]) + '</a>').join("") + '</nav>' +
      '<div class="nr">' + (extra || '') + setLink("lg nset", 1) + '<button type="button" class="lg" data-lang aria-label="' + esc(L("भाषा बदलें", "Change language")) + '">' + (D.en ? "Hindi" : "English") + '</button><button type="button" class="mn" data-menu>' + L("मेनू", "Menu") + '</button></div></div></header>';
  }
  /* ⚙️ दुकान का मालिक (इसी फ़ोन पर login) अपने page पर हो तो Settings का रास्ता */
  function isOwner() { try { const sl = new URLSearchParams(location.search).get("slug") || ""; const se = JSON.parse(localStorage.getItem("pb-session") || "null"); const a = JSON.parse(localStorage.getItem("pb-my-shops") || "[]"); return !!(sl && se && se.refresh_token && Array.isArray(a) && a.indexOf(sl) >= 0); } catch (e) { return false; } }
  function editLink() { return isOwner() ? '<a class="dset" href="mybusiness.html#go=prof&s=' + encodeURIComponent(new URLSearchParams(location.search).get("slug") || "") + '">✏️ ' + esc(L("प्रोफ़ाइल बदलें", "Edit profile")) + '</a>' : ''; }
  function setLink(cls, icon) { return isOwner() ? '<a class="' + cls + '" href="mybusiness.html" aria-label="' + esc(L("सेटिंग", "Settings")) + '">⚙️' + (icon ? '' : ' ' + esc(L("सेटिंग", "Settings"))) + '</a>' : ''; }
  function drawer() { return '<div class="drw" data-drw aria-hidden="true"><button type="button" class="x" data-x aria-label="' + esc(L("बंद करें", "Close")) + '">✕</button>' + editLink() + setLink("dset") + navs().map(n => '<a href="#' + n[0] + '">' + esc(n[1]) + '</a>').join("") + '<div class="db">' + waBtn("btn p") + callBtn("btn") + '</div></div>'; }
  function lightbox() { return '<div class="lb" data-lb aria-hidden="true"><button type="button" class="x" data-x aria-label="' + esc(L("बंद करें", "Close")) + '">✕</button><div class="im"><img alt=""></div><div class="cap"><button type="button" data-lp aria-label="' + esc(L("पिछली", "Previous")) + '">‹</button><span></span><button type="button" data-ln aria-label="' + esc(L("अगली", "Next")) + '">›</button></div><div class="lbt"></div></div>'; }
  function sticky() { const a = callBtn(""), b = waBtn("g"); return (a || b) ? '<div class="stk' + (a && b ? '' : ' one') + '" data-stk>' + a + b + '</div>' : ''; }
  function eb(t) { return '<div class="eb">' + esc(t) + '</div>'; }
  function gallery(cls) { if (!D.gallery.length) return ''; return '<div class="gal ' + (cls || "") + ' n' + Math.min(D.gallery.length, 3) + '">' + D.gallery.map((g, i) => '<button type="button" class="rv" data-gi="' + i + '" aria-label="' + esc(g.cap || L("फ़ोटो", "Photo") + " " + (i + 1)) + '"><img src="' + esc(g.src) + '" alt="' + esc(g.cap || "") + '" loading="lazy" decoding="async">' + (g.cap ? '<small>' + esc(g.cap) + '</small>' : '') + '</button>').join("") + '</div>'; }
  function facts(cls) { const f = D.facts; return f.length ? '<div class="facts ' + (cls || "") + '">' + f.map(x => '<div><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>').join("") + '</div>' : ''; }
  function why() {
    /* सिर्फ़ दुकानदार का अपना data — कोई बनाया हुआ दावा / वाक्य नहीं */
    return [D.type && [L("व्यवसाय", "Business"), D.type, ""],
    D.services && [L("उत्पाद / सेवाएँ", "Products / Services"), D.services.split(",").slice(0, 3).map(s => s.trim()).join(" · "), ""],
    D.hours && [L("खुलने का समय", "Opening hours"), D.hours.split("\n")[0], D.hours.split("\n")[1] || ""]].filter(Boolean);
  }
  function aboutLine() { return esc(D.name) + (D.city ? " — <em>" + esc(D.city) + "</em>" : ""); }
  function rating(cls) {
    const has = +D.rating;
    if (!has && !D.rateInline) return '';
    return '<div class="rate ' + (cls || "") + ' rv">' + eb(L("ग्राहकों की रेटिंग", "Customer rating")) +
      (has ? '<div class="big">' + esc(Number(D.rating).toFixed(1)) + '</div><div class="stars">' + "★★★★★".slice(0, Math.round(+D.rating)) + '</div><p>' +
        (D.count ? L(D.count + " ग्राहकों ने PataBook पर रेटिंग दी", D.count + (D.count == 1 ? " customer rating" : " customer ratings") + " on PataBook") : L("PataBook पर रेटिंग", "Rating on PataBook")) + '</p>'
        : '<p>' + L("अभी कोई रेटिंग नहीं — पहली रेटिंग आप दें", "No ratings yet — be the first to rate") + '</p>') +
      (D.rateInline ? '<div id="pbRate" class="pbr-in"></div>' : D.rateUrl ? '<a class="btn" href="' + esc(D.rateUrl) + '">' + L("अपनी रेटिंग दें", "Rate this shop") + '</a>' : '') + '</div>';
  }

  function contacts() {
    return '<div class="cl">' + D.nums.map(n => '<a href="tel:+91' + n + '"><span>' + L("फ़ोन", "Phone") + '</span>+91 ' + n + '</a>').join("") +
      (D.nums[0] && D.waLink("x") ? '<a href="' + esc(D.waLink(L("नमस्ते, PataBook पर आपका पेज देखा।", "Hello, I saw your page on PataBook."))) + '" target="_blank" rel="noopener"><span>WhatsApp</span>+91 ' + D.nums[0] + '</a>' : '') +
      (D.email ? '<a href="mailto:' + esc(D.email) + '"><span>Email</span>' + esc(D.email) + '</a>' : '') +
      (D.web ? '<a href="' + esc(D.web) + '" target="_blank" rel="noopener"><span>Website</span>' + esc(D.web.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")) + '</a>' : '') +
      (D.ig ? '<a href="' + esc(D.ig) + '" target="_blank" rel="noopener"><span>Instagram</span>' + L("हमें फ़ॉलो करें", "Follow us") + '</a>' : '') +
      (D.fb ? '<a href="' + esc(D.fb) + '" target="_blank" rel="noopener"><span>Facebook</span>' + L("हमारा पेज", "Our page") + '</a>' : '') + '</div>';
  }
  function addrBlock() { return D.addr ? '<p class="ad">' + esc(D.addr) + (D.landmark ? '<br>' + L("पहचान: ", "Landmark: ") + esc(D.landmark) : '') + '</p>' : ''; }
  function mapHtml() {
    const la = +D.lat, ln = +D.lng; if (!la || !ln) return '<div class="map nomap" data-map><i></i><span>' + esc(D.city || D.name) + '</span></div>';
    const z = 16, n = 2 ** z, xf = (ln + 180) / 360 * n, yr = la * Math.PI / 180, yf = (1 - Math.log(Math.tan(yr) + 1 / Math.cos(yr)) / Math.PI) / 2 * n, x = Math.floor(xf), y = Math.floor(yf);
    let t = ""; for (let dy = -1; dy <= 1; dy++)for (let dx = -1; dx <= 1; dx++)t += '<img alt="" loading="lazy" src="https://tile.openstreetmap.org/' + z + '/' + (x + dx) + '/' + (y + dy) + '.png">';
    return '<a class="map" data-map href="' + esc(D.dir || "#") + '" data-fx="' + (xf - x) + '" data-fy="' + (yf - y) + '" aria-label="' + esc(L("नक्शे पर देखें", "Open in map")) + '"><div class="tl">' + t + '</div><i></i><span>' + esc(D.name) + '</span><em>© OpenStreetMap</em></a>';
  }
  function visit(title) {
    return '<div class="vs rv"><div class="vi">' + eb(L("पता", "Address")) + '<h3>' + esc(D.city || D.name) + '</h3>' + addrBlock() + (D.hours ? '<p class="hr">' + esc(D.hours) + '</p>' : '') + contacts() + '<div class="btns">' + dirBtn("btn p") + callBtn("btn") + '</div></div>' + mapHtml() + '</div>';
  }
  function footer() {
    return tools() + '<footer class="ft">' + (D.demo ? '<div class="dm">' + L("डेमो: कीमतें और नंबर नमूना हैं।", "Demo: prices and numbers are samples.") + '</div>' : '') +
      '<div>' + L("यह जानकारी दुकानदार ने दी है; PataBook ने इसकी पुष्टि नहीं की है।", "This information was provided by the shop owner; PataBook has not verified it.") + (D.stdUrl ? ' <a href="' + esc(D.stdUrl) + '">' + L("साधारण पेज", "Standard page") + '</a>' : '') + ' · <a href="terms.html">' + L("नियम", "Terms") + '</a></div>' +
      '<a class="pb" href="index.html"><img src="' + esc(D.pin || "pin.png") + '" alt="">Powered by PataBook</a></footer>';
  }
  const shell = (body, hasStk) => drawer() + body + footer() + (hasStk === false ? '' : sticky()) + lightbox();
  /* दुकान का poster (Profile Banner) नाम के पीछे नहीं — अलग, पूरा दिखे (नाम साफ़ पढ़ा जाए) */
  const heroBg = () => '';
  const coverImg = cls => D.cover ? '<figure class="cvb ' + (cls || '') + ' rv"><img src="' + esc(D.cover) + '" alt="' + esc(D.name) + '" decoding="async"></figure>' : '';
  function nameSplit() { const w = String(D.name).trim().split(/\s+/); if (w.length < 2) return esc(D.name); const last = w.pop(); return esc(w.join(" ")) + " <em>" + esc(last) + "</em>"; }
  const empty = () => '<p class="empty">' + L("इसमें अभी कुछ नहीं है।", "Nothing here yet.") + '</p>';
  const secHead = (e, h, extra) => '<div class="sh rv"><div>' + eb(e) + '<h2>' + h + '</h2></div>' + (extra || '') + '</div>';

  /* ================= 10 LAYOUTS ================= */
  const LY_ = {};
  /* 1 · Luxury — बड़ा hero, एक-एक product की row */
  LY_[1] = {
    list: P => P.length ? P.map((p, i) => '<article class="item rv"><button type="button" class="ph" data-pi="' + pidx(p) + '">' + img(p) + tag(p) + '</button><div class="tx"><div class="no">' + nn(i) + '</div><h3>' + esc(p.name) + '</h3>' + feats(p, 5) +
      '<div class="meta">' + (p.size ? '<span><b>' + L("साइज़", "Size") + '</b>' + esc(p.size) + '</span>' : '') + ((offerOf(p) || p.mrp) ? '<span><b>' + L("कीमत", "Price") + '</b>' + price(p) + '</span>' : '') + '</div>' + ask(p, "ask", L("WhatsApp पर पूछें", "Enquire on WhatsApp") + " →") + '</div></article>').join("") : empty(),
    page: () => nav() + '<section class="hero nobg' + (D.cover ? ' hc' : '') + '" id="top" data-hero><div class="w in">' + eb(D.sub) + '<h1>' + nameSplit() + '</h1>' + (D.services ? '<p class="lead">' + esc(D.services) + '</p>' : '') + openChip() +
      '<div class="btns">' + waBtn("btn p") + callBtn("btn") + (D.products.length ? '<a class="btn" href="#coll">' + L("कलेक्शन देखें", "View collection") + '</a>' : '') + '</div></div></section>' +
      (D.cover ? '<div class="w">' + coverImg() + '</div>' : '') +
      (D.products.length ? '<section class="blk" id="coll"><div class="w">' + secHead(L("हमारे उत्पाद", "Our products"), L("कलेक्शन", "The Collection"), catBar()) + '<div data-plist>' + LY_[1].list(filtered()) + '</div></div></section>' : '') +
      (D.gallery.length ? '<section class="blk" id="gal"><div class="w">' + secHead(L("दुकान की झलक", "Inside the store"), L("गैलरी", "Gallery")) + gallery() + '</div></section>' : '') +
      '<section class="blk deco" id="about"><div class="w"><div class="story"><div class="rv">' + eb(L("हमारे बारे में", "About us")) + '<blockquote>' + aboutLine() + '</blockquote></div>' + facts("rv") + '</div>' +
      (why().length ? '<div class="pill3">' + why().map(p => '<div class="rv"><span>' + esc(p[0]) + '</span><b>' + esc(p[1]) + '</b>' + (p[2] ? '<p>' + esc(p[2]) + '</p>' : '') + '</div>').join("") + '</div>' : '') + '</div></section>' +
      ((+D.rating || D.rateInline) ? '<section class="blk"><div class="w">' + rating() + '</div></section>' : '') +
      '<section class="blk" id="visit"><div class="w">' + secHead(L("हमसे मिलें", "Visit us"), L("पता और संपर्क", "Find us")) + visit() + '</div></section>'
  };
  /* 2 · Cinematic — पूरी screen, बहुत बड़े अक्षर, products की पट्टी */
  LY_[2] = {
    list: P => P.length ? '<div class="rail">' + P.map((p, i) => '<article class="card"><button type="button" class="ph" data-pi="' + pidx(p) + '">' + img(p) + tag(p) + '</button><div class="cb"><span class="no">' + nn(i) + '</span><h3>' + esc(p.name) + '</h3>' + (p.size ? '<span class="sz">' + esc(p.size) + '</span>' : '') + price(p) + ask(p, "ask", L("पूछें", "Enquire") + " →") + '</div></article>').join("") + '</div>' : empty(),
    page: () => {
      const w = String(D.name).trim().split(/\s+/);
      return nav() + '<section class="hero" id="top" data-hero>' + heroBg() + '<div class="sweep"></div><div class="w in"><div class="eb">' + esc(D.sub) + '</div><h1>' + w.map((x, i) => '<span style="--d:' + (i * .12) + 's"><span>' + esc(x) + '</span></span>').join("") + '</h1>' +
        '<div class="hrow">' + (D.services ? '<p class="lead">' + esc(D.services) + '</p>' : '<span></span>') + '<div class="btns">' + waBtn("btn p") + callBtn("btn") + '</div></div>' + openChip() + '</div></section>' + coverImg("full2") +
        (D.services ? '<div class="marq" aria-hidden="true"><div>' + Array(4).fill(D.services.split(",").map(s => '<span>' + esc(s.trim()) + '</span><i>✦</i>').join("")).join("") + '</div></div>' : '') +
        (D.products.length ? '<section class="blk" id="coll"><div class="w">' + secHead(L("उत्पाद", "Products"), L("हमारा कलेक्शन", "The Line-up"), catBar()) + '</div><div data-plist>' + LY_[2].list(filtered()) + '</div></section>' : '') +
        (D.gallery.length ? '<section class="blk" id="gal">' + D.gallery.map((g, i) => '<button type="button" class="full rv" data-gi="' + i + '"><img src="' + esc(g.src) + '" alt="' + esc(g.cap || "") + '" loading="lazy"><span class="w"><b>' + nn(i) + '</b>' + esc(g.cap || L("दुकान की झलक", "Inside the store")) + '</span></button>').join("") + '</section>' : '') +
        '<section class="blk deco" id="about"><div class="w"><div class="chap rv">' + eb(L("हमारे बारे में", "About")) + '<h2 class="hx">' + aboutLine() + '</h2></div>' +
        (why().length ? '<div class="why">' + why().map((p, i) => '<div class="rv"><b>' + nn(i) + '</b><h3>' + esc(p[1]) + '</h3><p>' + esc(p[0]) + (p[2] ? ' — ' + esc(p[2]) : '') + '</p></div>').join("") + '</div>' : '') + facts("rv") + '</div></section>' +
        ((+D.rating || D.rateInline) ? '<section class="blk"><div class="w">' + rating() + '</div></section>' : '') +
        '<section class="blk vbig" id="visit"><div class="w">' + secHead(L("पता", "Address"), L("हमसे मिलें", "Visit us")) + (D.nums[0] ? '<a class="huge" href="tel:+91' + D.nums[0] + '">+91 ' + D.nums[0] + '</a>' : '') + visit() + '</div></section>';
    }
  };
  /* 3 · Editorial — magazine page: masthead, drop cap, asymmetric mosaic */
  LY_[3] = {
    list: P => P.length ? '<div class="mos">' + P.map((p, i) => '<article class="m' + (i % 5) + ' rv"><button type="button" class="ph" data-pi="' + pidx(p) + '">' + img(p) + tag(p) + '</button><div class="cap"><span class="no">' + L("नं.", "No.") + ' ' + nn(i) + '</span><h3>' + esc(p.name) + '</h3><p>' + esc([p.size, (p.feats || [])[0]].filter(Boolean).join(" — ")) + '</p>' + price(p) + ask(p, "ask") + '</div></article>').join("") + '</div>' : empty(),
    page: () => {
      const d = new Date(), mo = d.toLocaleString(D.en ? "en-IN" : "hi-IN", { month: "long", year: "numeric" });
      return nav() + '<section class="hero" id="top" data-hero><div class="w"><div class="mast rv"><span>' + esc(D.city) + '</span><span>' + esc(mo) + '</span><span>' + esc(D.cat) + '</span></div><h1 class="rv">' + esc(D.name) + '</h1>' +
        '<div class="cov rv">' + (D.cover ? '<figure><img src="' + esc(D.cover) + '" alt=""><figcaption>' + esc(D.sub) + '</figcaption></figure>' : '') + '<div class="intro"><p class="dc">' + esc(D.services || D.sub) + '</p>' + openChip() + '<div class="btns">' + waBtn("btn p") + callBtn("btn") + '</div></div></div></div></section>' +
        (D.products.length ? '<section class="blk" id="coll"><div class="w">' + secHead(L("इस अंक में", "In this issue"), L("सूची", "The Index"), catBar()) +
          '<ol class="idx rv">' + D.products.map((p, i) => '<li><a href="#p' + i + '" data-pi="' + i + '"><b>' + nn(i) + '</b><span>' + esc(p.name) + '</span><i>' + esc(p.size || "") + '</i></a></li>').join("") + '</ol><div data-plist>' + LY_[3].list(filtered()) + '</div></div></section>' : '') +
        (D.gallery.length ? '<section class="blk" id="gal"><div class="w">' + secHead(L("फ़ोटो निबंध", "Photo essay"), L("दुकान से", "From the store")) + gallery("ed") + '</div></section>' : '') +
        '<section class="blk" id="about"><div class="w"><div class="essay">' + eb(L("हमारे बारे में", "About")) + '<h2 class="rv">' + aboutLine() + '</h2><div class="cols rv">' + why().map(p => '<p><b>' + esc(p[0]) + ':</b> ' + esc(p[1]) + (p[2] ? ' · ' + esc(p[2]) : '') + '</p>').join("") + '</div>' + facts("rv") + '</div></div></section>' +
        ((+D.rating || D.rateInline) ? '<section class="blk"><div class="w">' + rating("ed") + '</div></section>' : '') +
        '<section class="blk" id="visit"><div class="w">' + secHead(L("पता", "Colophon"), L("हमसे मिलें", "Visit us")) + visit() + '</div></section>';
    }
  };
  /* 4 · Store — online दुकान: search, grid, order bag → WhatsApp */
  LY_[4] = {
    list: P => P.length ? '<div class="grid">' + P.map(p => { const i = pidx(p), q = BAG[i] || 0; return '<article class="pc"><button type="button" class="ph" data-pi="' + i + '">' + img(p) + tag(p) + '</button><div class="pb2"><h3>' + esc(p.name) + '</h3><span class="sz">' + esc(p.size || "") + '</span>' + price(p) + (p.stock === false ? '<button type="button" class="add" disabled>' + L("स्टॉक में नहीं", "Out of stock") + '</button>' : q ? '<div class="qty"><button type="button" data-dec="' + i + '" aria-label="' + esc(L("कम करें", "Decrease")) + '">−</button><b>' + q + '</b><button type="button" data-add="' + i + '" aria-label="' + esc(L("बढ़ाएँ", "Increase")) + '">+</button></div>' : '<button type="button" class="add" data-add="' + i + '">' + I.bag + L("ऑर्डर में जोड़ें", "Add to order") + '</button>') + '</div></article>'; }).join("") + '</div>' : '<p class="empty">' + L("इस नाम का सामान नहीं मिला।", "No products match.") + '</p>',
    page: () => {
      const best = D.products.find(offPct);
      return (best ? '<div class="ann">' + L(best.name + " पर " + offPct(best) + "% की छूट · WhatsApp पर ऑर्डर करें", offPct(best) + "% off " + best.name + " · Order on WhatsApp") + '</div>' : '') +
        nav('<button type="button" class="bagb" data-bagopen aria-label="' + esc(L("ऑर्डर देखें", "View order")) + '">' + I.bag + '<b data-bagn>0</b></button>') +
        '<section class="hero" id="top" data-hero><div class="w"><div class="ban rv' + (D.cover ? ' wc' : '') + '"><div class="bt">' + eb(D.sub) + '<h1>' + esc(D.name) + '</h1>' + (D.services ? '<p class="lead">' + esc(D.services) + '</p>' : '') + openChip() + '<div class="btns">' + (D.products.length ? '<a class="btn p" href="#coll">' + L("अभी खरीदें", "Shop now") + '</a>' : '') + waBtn("btn p") + callBtn("btn p") + dirBtn("btn p") + '</div></div>' + (D.cover ? '<div class="bim"><img src="' + esc(D.cover) + '" alt="' + esc(D.name) + '"></div>' : '') + '</div>' +
        '<div class="usp rv">' + [[I.wa, L("WhatsApp पर ऑर्डर", "Order on WhatsApp")], [I.pin, D.city || L("पता", "Address")], [I.call, D.hours ? D.hours.split("\n")[0] : L("कॉल करें", "Call us")]].map(x => '<div>' + x[0] + '<span>' + esc(x[1]) + '</span></div>').join("") + '</div></div></section>' +
        (D.products.length ? '<section class="blk" id="coll"><div class="w"><div class="shd"><h2>' + L("सारे उत्पाद", "All products") + '</h2><label class="srch"><input type="search" data-q placeholder="' + esc(L("सामान खोजें…", "Search products…")) + '" aria-label="' + esc(L("सामान खोजें", "Search products")) + '"></label></div>' + catBar("chips") + '<div data-plist>' + LY_[4].list(filtered()) + '</div></div></section>' : '') +
        (D.gallery.length ? '<section class="blk" id="gal"><div class="w"><div class="shd"><h2>' + L("दुकान की फ़ोटो", "Store photos") + '</h2></div>' + gallery("st") + '</div></section>' : '') +
        '<section class="blk" id="about"><div class="w"><div class="abx rv"><div>' + eb(L("हमारे बारे में", "About us")) + '<h2>' + aboutLine() + '</h2></div>' + facts() + '</div>' + ((+D.rating || D.rateInline) ? rating("stx") : '') + '</div></section>' +
        '<section class="blk" id="visit"><div class="w"><div class="shd"><h2>' + L("दुकान का पता", "Store location") + '</h2></div>' + visit() + '</div></section>' +
        '<div class="bagbar" data-bagbar hidden><span data-bagt></span><a class="btn p" data-bagwa target="_blank" rel="noopener">' + I.wa + L("WhatsApp पर ऑर्डर भेजें", "Send order on WhatsApp") + '</a></div>';
    }
  };
  /* 5 · Minimal — बहुत सादा, बीच में, पतले अक्षर */
  LY_[5] = {
    list: P => P.length ? '<div class="rows">' + P.map((p, i) => '<article class="r rv"><button type="button" class="ph" data-pi="' + pidx(p) + '">' + img(p) + '</button><div class="rt"><h3>' + esc(p.name) + '</h3><p>' + esc([p.size].concat(p.feats || []).filter(Boolean).slice(0, 3).join(" · ")) + '</p></div><div class="rp">' + price(p) + ask(p, "ask", L("पूछें", "Ask")) + '</div></article>').join("") + '</div>' : empty(),
    page: () => nav() + '<section class="hero" id="top" data-hero><div class="w in rv">' + eb(D.sub) + '<h1>' + esc(D.name) + '</h1>' + (D.services ? '<p class="lead">' + esc(D.services) + '</p>' : '') + openChip() + '<div class="btns">' + waBtn("btn p") + callBtn("btn") + dirBtn("btn") + '</div></div>' + (D.cover ? '<div class="w"><div class="wide rv"><img src="' + esc(D.cover) + '" alt=""></div></div>' : '') + '</section>' +
      (D.products.length ? '<section class="blk" id="coll"><div class="w nar">' + secHead(L("उत्पाद", "Products"), L("उत्पाद", "Products"), catBar()) + '<div data-plist>' + LY_[5].list(filtered()) + '</div></div></section>' : '') +
      (D.gallery.length ? '<section class="blk" id="gal"><div class="w">' + gallery("mn") + '</div></section>' : '') +
      '<section class="blk" id="about"><div class="w nar"><p class="say rv">' + aboutLine() + '</p>' + facts("rv") + ((+D.rating || D.rateInline) ? rating("mn") : '') + '</div></section>' +
      '<section class="blk" id="visit"><div class="w nar">' + secHead(L("पता", "Visit"), L("पता", "Visit")) + visit() + '</div></section>'
  };
  /* 6 · Bold Poster — रंग के बड़े blocks, बहुत बड़े नंबर */
  LY_[6] = {
    list: P => P.length ? '<div class="tiles">' + P.map((p, i) => '<article class="t rv' + (i % 3 === 0 ? ' big' : '') + '"><span class="n">' + nn(i) + '</span><button type="button" class="ph" data-pi="' + pidx(p) + '">' + img(p) + tag(p) + '</button><div class="tb"><h3>' + esc(p.name) + '</h3>' + (p.size ? '<span class="sz">' + esc(p.size) + '</span>' : '') + price(p) + ask(p, "ask", L("अभी पूछें", "Ask now") + " →") + '</div></article>').join("") + '</div>' : empty(),
    page: () => nav() + '<section class="hero" id="top" data-hero><div class="w in"><h1>' + String(D.name).trim().split(/\s+/).map((x, i) => '<span class="rv" style="transition-delay:' + (i * .08) + 's">' + esc(x) + '</span>').join("") + '</h1><div class="hz"><div>' + eb(D.sub) + (D.services ? '<p class="lead">' + esc(D.services) + '</p>' : '') + openChip() + '</div><div class="btns">' + waBtn("btn p") + callBtn("btn") + '</div></div></div>' + (D.cover ? '<div class="pimg rv"><img src="' + esc(D.cover) + '" alt=""></div>' : '') + '</section>' +
      (D.products.length ? '<section class="blk inv" id="coll"><div class="w">' + secHead(L("उत्पाद", "Products"), L("हमारे उत्पाद", "Our products"), catBar()) + '<div data-plist>' + LY_[6].list(filtered()) + '</div></div></section>' : '') +
      (D.gallery.length ? '<section class="blk" id="gal"><div class="w">' + secHead(L("झलक", "Look"), L("गैलरी", "Gallery")) + gallery("pst") + '</div></section>' : '') +
      '<section class="blk acc" id="about"><div class="w"><h2 class="mega rv">' + aboutLine() + '</h2>' + (why().length ? '<div class="why">' + why().map((p, i) => '<div class="rv"><b>' + nn(i) + '</b><h3>' + esc(p[1]) + '</h3>' + (p[2] ? '<p>' + esc(p[2]) + '</p>' : '') + '</div>').join("") + '</div>' : '') + '</div></section>' +
      '<section class="blk" id="facts"><div class="w">' + facts("rv") + ((+D.rating || D.rateInline) ? rating("pst") : '') + '</div></section>' +
      '<section class="blk" id="visit"><div class="w">' + secHead(L("पता", "Visit"), L("हमसे मिलें", "Visit us")) + visit() + '</div></section>'
  };
  /* 7 · Split — desktop पर बायाँ हिस्सा रुका रहता है, दायाँ scroll */
  LY_[7] = {
    list: P => P.length ? '<div class="sl">' + P.map((p, i) => '<article class="s rv"><button type="button" class="ph" data-pi="' + pidx(p) + '">' + img(p) + tag(p) + '</button><div><span class="no">' + nn(i) + '</span><h3>' + esc(p.name) + '</h3>' + feats(p, 3) + '<div class="sp">' + (p.size ? '<span class="sz">' + esc(p.size) + '</span>' : '') + price(p) + '</div>' + ask(p, "ask", L("WhatsApp पर पूछें", "Enquire on WhatsApp") + " →") + '</div></article>').join("") + '</div>' : empty(),
    page: () => '<div class="split"><aside class="side" id="top" data-hero><div class="si"><a class="mk" href="#top">' + logoImg("sl") + '<small>' + esc(D.sub) + '</small></a><h1>' + nameSplit() + '</h1>' + (D.services ? '<p class="lead">' + esc(D.services) + '</p>' : '') + openChip() +
      '<div class="btns">' + waBtn("btn p") + callBtn("btn") + dirBtn("btn") + '</div><nav class="sn">' + navs().map(n => '<a href="#' + n[0] + '">' + esc(n[1]) + '</a>').join("") + '<button type="button" class="lg" data-lang>' + (D.en ? "Hindi" : "English") + '</button></nav></div></aside><main class="main">' + (D.cover ? '<div class="mtop">' + coverImg() + '</div>' : '') +
      (D.products.length ? '<section class="blk" id="coll">' + secHead(L("उत्पाद", "Products"), L("कलेक्शन", "Collection"), catBar()) + '<div data-plist>' + LY_[7].list(filtered()) + '</div></section>' : '') +
      (D.gallery.length ? '<section class="blk" id="gal">' + secHead(L("झलक", "Look inside"), L("गैलरी", "Gallery")) + gallery("spg") + '</section>' : '') +
      '<section class="blk" id="about">' + eb(L("हमारे बारे में", "About")) + '<h2 class="ab rv">' + aboutLine() + '</h2>' + facts("rv") + ((+D.rating || D.rateInline) ? rating("sp") : '') + '</section>' +
      '<section class="blk" id="visit">' + secHead(L("पता", "Visit"), L("हमसे मिलें", "Find us")) + visit() + '</section></main></div>'
  };
  /* 8 · Bento — टाइलों की grid */
  LY_[8] = {
    list: P => P.length ? '<div class="bgrid">' + P.map((p, i) => '<article class="bt rv' + (i === 0 ? ' wide' : '') + '"><button type="button" class="ph" data-pi="' + pidx(p) + '">' + img(p) + tag(p) + '</button><div class="bb"><h3>' + esc(p.name) + '</h3><span class="sz">' + esc(p.size || "") + '</span>' + price(p) + ask(p, "ask", I.wa) + '</div></article>').join("") + '</div>' : empty(),
    page: () => nav() + '<section class="hero" id="top" data-hero><div class="w"><div class="bento">' +
      '<div class="b1 rv">' + eb(D.sub) + '<h1>' + esc(D.name) + '</h1>' + (D.services ? '<p class="lead">' + esc(D.services) + '</p>' : '') + '</div>' +
      (D.cover ? '<div class="b2 rv" style="background-image:url(\'' + esc(D.cover) + '\')"></div>' : '') +
      (D.open ? '<div class="b3 rv">' + openChip("st big") + (D.hours ? '<p>' + esc(D.hours.split("\n").join(" · ")) + '</p>' : '') + '</div>' : '') +
      (+D.rating ? '<div class="b4 rv"><b>' + esc(Number(D.rating).toFixed(1)) + '</b><span>★★★★★</span><small>' + (D.count ? L(D.count + " रेटिंग", D.count + " ratings") : "PataBook") + '</small></div>' : '') +
      (D.waLink("x") ? '<a class="b5 rv" href="' + esc(D.waLink(L("नमस्ते, PataBook पर आपका पेज देखा।", "Hello, I saw your page on PataBook."))) + '" target="_blank" rel="noopener">' + I.wa + '<b>WhatsApp</b><small>' + L("अभी बात करें", "Chat now") + '</small></a>' : '') +
      (D.ph ? '<a class="b6 rv" href="tel:' + esc(D.ph) + '">' + I.call + '<b>' + L("कॉल", "Call") + '</b><small>+91 ' + esc(D.nums[0]) + '</small></a>' : '') +
      (D.dir ? '<a class="b7 rv" href="' + esc(D.dir) + '">' + I.pin + '<b>' + esc(D.city || L("पता", "Address")) + '</b><small>' + L("रास्ता देखें", "Get directions") + '</small></a>' : '') +
      '</div></div></section>' +
      (D.products.length ? '<section class="blk" id="coll"><div class="w">' + secHead(L("उत्पाद", "Products"), L("हमारे उत्पाद", "Our products"), catBar()) + '<div data-plist>' + LY_[8].list(filtered()) + '</div></div></section>' : '') +
      (D.gallery.length ? '<section class="blk" id="gal"><div class="w">' + secHead(L("झलक", "Look"), L("गैलरी", "Gallery")) + gallery("bg") + '</div></section>' : '') +
      '<section class="blk" id="about"><div class="w"><div class="bento2"><div class="rv">' + eb(L("हमारे बारे में", "About us")) + '<h2>' + aboutLine() + '</h2></div>' + why().map(p => '<div class="rv"><span>' + esc(p[0]) + '</span><b>' + esc(p[1]) + '</b>' + (p[2] ? '<p>' + esc(p[2]) + '</p>' : '') + '</div>').join("") + '</div>' + facts("rv") + '</div></section>' +
      '<section class="blk" id="visit"><div class="w">' + secHead(L("पता", "Visit"), L("हमसे मिलें", "Find us")) + visit() + '</div></section>'
  };
  /* 9 · Classic Shop — दुकान का बोर्ड, फ़्रेम वाले cards */
  LY_[9] = {
    list: P => P.length ? '<div class="cgrid">' + P.map(p => '<article class="cc rv"><div class="fr"><button type="button" class="ph" data-pi="' + pidx(p) + '">' + img(p) + tag(p) + '</button></div><h3>' + esc(p.name) + '</h3>' + (p.size ? '<span class="sz">' + esc(p.size) + '</span>' : '') + '<div class="orn">✦</div>' + price(p) + ask(p, "btn sm") + '</article>').join("") + '</div>' : empty(),
    page: () => nav() + '<section class="hero" id="top" data-hero><div class="w"><div class="board rv"><div class="bin"><div class="orn">✦ ' + esc(D.cat) + ' ✦</div><h1>' + esc(D.name) + '</h1><div class="rule"></div><p class="lead">' + esc(D.services || D.sub) + '</p>' + (D.city ? '<div class="eb">' + esc(D.addr || D.city) + '</div>' : '') + openChip() + '<div class="btns">' + waBtn("btn p") + callBtn("btn") + '</div></div></div>' + (D.cover ? '<div class="cfr">' + coverImg() + '</div>' : '') + '</div></section>' +
      (D.products.length ? '<section class="blk" id="coll"><div class="w"><div class="ct rv"><div class="orn">✦</div><h2>' + L("हमारे उत्पाद", "Our Products") + '</h2>' + catBar() + '</div><div data-plist>' + LY_[9].list(filtered()) + '</div></div></section>' : '') +
      (D.gallery.length ? '<section class="blk" id="gal"><div class="w"><div class="ct rv"><div class="orn">✦</div><h2>' + L("हमारी दुकान", "Our Store") + '</h2></div>' + gallery("cl") + '</div></section>' : '') +
      '<section class="blk" id="about"><div class="w"><div class="ct rv"><div class="orn">✦</div><h2>' + L("हमारे बारे में", "About Us") + '</h2><p class="say">' + aboutLine() + '</p></div><div class="ctab rv">' + facts() + '</div>' + ((+D.rating || D.rateInline) ? rating("cl") : '') + '</div></section>' +
      '<section class="blk" id="visit"><div class="w"><div class="ct rv"><div class="orn">✦</div><h2>' + L("दुकान पर पधारें", "Visit Our Store") + '</h2></div>' + visit() + '</div></section>'
  };
  /* 10 · Prestige — business brand: products पहली screen पर, साफ़ नाम, भरोसे की पट्टी, साफ़ CTA */
  function trust() {
    const t = [];
    if (D.verified) t.push(["✓", L("PataBook सत्यापित", "PataBook Verified")]);
    if (D.type) t.push(["✓", D.type]);
    if (D.facts.some(f => f[0] === "GST")) t.push(["✓", L("GST सत्यापित", "GST Verified")]);
    if (+D.rating) t.push(["★", Number(D.rating).toFixed(1) + (D.count ? " · " + L(D.count + " रेटिंग", D.count + (D.count == 1 ? " rating" : " ratings")) : "")]);
    if (D.city) t.push(["⌖", D.city]);
    return t;
  }
  LY_[10] = {
    list: P => P.length ? '<div class="pgrid">' + P.map(p => '<article class="pcard rv"><button type="button" class="ph" data-pi="' + pidx(p) + '">' + img(p) + tag(p) + '</button><div class="pcb"><h3>' + esc(p.name) + '</h3><p class="pm">' + esc([p.size].concat((p.feats || []).slice(0, 2)).filter(Boolean).join(" · ")) + '</p><div class="prow">' + price(p) + ask(p, "btn sm p", I.wa + '<span>' + L("पूछें", "Enquire") + '</span>') + '</div></div></article>').join("") + '</div>' : empty(),
    page: () => {
      const P = D.products, G = D.gallery, hero = D.cover || (G[0] || {}).src || (P.find(p => p.img) || {}).img || "";
      const tr = trust();
      return nav('<a class="ncta" href="' + esc(D.waLink(L("नमस्ते, PataBook पर आपका पेज देखा।", "Hello, I saw your page on PataBook.")) || "#visit") + '"' + (D.waLink("x") ? ' target="_blank" rel="noopener"' : '') + '>' + I.wa + '<span>' + L("संपर्क करें", "Contact") + '</span></a>') +
        '<section class="hero" id="top" data-hero><div class="w hg">' +
        '<div class="ht rv">' + eb(D.sub) + '<h1>' + esc(D.name) + '</h1>' + (D.services ? '<p class="lead">' + esc(D.services) + '</p>' : '') + openChip() +
        '<div class="btns">' + (G.length ? '<a class="btn p" href="#gal">' + L("उत्पाद देखें", "View products") + I.arr + '</a>' : '') + waBtn("btn") + callBtn("btn") + '</div></div>' +
        (hero ? '<div class="hv rv"><div class="hvi"><img src="' + esc(hero) + '" alt="' + esc(D.name) + '" decoding="async"></div>' +
          (G.length > 1 ? '<div class="hth">' + G.slice(0, 4).map((g, i) => '<button type="button" data-gi="' + i + '" aria-label="' + esc(g.cap || L("फ़ोटो", "Photo") + " " + (i + 1)) + '"><img src="' + esc(g.src) + '" alt="" loading="lazy">' + (g.cap ? '<span>' + esc(g.cap) + '</span>' : '') + '</button>').join("") + '</div>' : '') + '</div>' : '') +
        '</div></section>' +
        (tr.length ? '<div class="tbar"><div class="w">' + tr.map(x => '<div><i>' + x[0] + '</i><span>' + esc(x[1]) + '</span></div>').join("") + '</div></div>' : '') +
        (D.gallery.length ? '<section class="blk" id="gal"><div class="w">' + secHead(L("गैलरी", "Gallery"), L("उत्पाद और दुकान की झलक", "Products & store")) + gallery("pg") + '</div></section>' : '') +
        '<section class="blk alt" id="about"><div class="w ab2"><div class="rv">' + eb(L("कंपनी के बारे में", "About the company")) + '<h2>' + aboutLine() + '</h2>' +
        (why().length ? '<div class="why">' + why().map(p => '<div><span>' + esc(p[0]) + '</span><b>' + esc(p[1]) + '</b>' + (p[2] ? '<p>' + esc(p[2]) + '</p>' : '') + '</div>').join("") + '</div>' : '') + '</div>' + (function () { const f = D.facts.filter(x => x[1] !== D.type && x[1] !== D.hours); return f.length ? '<div class="facts rv">' + f.map(x => '<div><span>' + esc(x[0]) + '</span><b>' + esc(x[1]) + '</b></div>').join("") + '</div>' : ''; })() + '</div></section>' +
        ((+D.rating || D.rateInline) ? '<section class="blk alt"><div class="w">' + rating("pr") + '</div></section>' : '') +
        '<section class="blk" id="visit"><div class="w">' + secHead(L("संपर्क", "Contact"), L("हमसे संपर्क करें", "Get in touch")) +
        '<div class="ccards rv">' + callBtn("cc") + waBtn("cc w") + dirBtn("cc") + '</div>' + visit() + '</div></section>';
    }
  };

  /* ---------- wiring ---------- */
  let RIO = null, SIO = null, LB = [], LBI = 0;
  function reveal() {
    if (!("IntersectionObserver" in window)) { ROOT.querySelectorAll(".rv").forEach(e => e.classList.add("in")); return; }
    RIO = RIO || new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); RIO.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
    ROOT.querySelectorAll(".rv:not(.in)").forEach(e => RIO.observe(e));
  }
  function layer(el) {
    el.classList.add("on"); el.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden";
    const close = () => { el.classList.remove("on"); el.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };
    if (window.PBBack) { PBBack.open(close); el._close = () => PBBack.close(); return; }
    /* PBBack न हो (demo): अपना history कदम — फ़ोन का Back पहले popup बंद करे */
    STK.push(close); try { history.pushState({ pbbl: STK.length }, ""); } catch (_) { }
    el._close = () => { try { history.back(); } catch (_) { const f = STK.pop(); f && f(); } };
  }
  const STK = [];
  addEventListener("popstate", () => { const f = STK.pop(); if (f) f(); });
  function lbShow() {
    const lb = ROOT.querySelector("[data-lb]"), u = LB[LBI]; lb.querySelector(".im img").src = u.src;
    lb.querySelector(".cap span").textContent = (u.cap ? u.cap + " · " : "") + (LBI + 1) + " / " + LB.length;
    lb.querySelectorAll("[data-lp],[data-ln]").forEach(b => b.style.visibility = LB.length > 1 ? "visible" : "hidden");
    /* Amazon जैसा: नीचे छोटी फ़ोटो की पट्टी — दबाओ तो वही फ़ोटो */
    const t = lb.querySelector(".lbt"); t.innerHTML = LB.length > 1 ? LB.map((x, i) => '<button type="button" data-lt="' + i + '" class="' + (i === LBI ? "on" : "") + '" aria-label="' + esc(L("फ़ोटो", "Photo") + " " + (i + 1)) + '"><img src="' + esc(x.src) + '" alt=""></button>').join("") : "";
    const on = t.querySelector(".on"); if (on) on.scrollIntoView({ block: "nearest", inline: "center" });
  }
  /* उँगली से बाएँ-दाएँ खिसकाकर अगली / पिछली फ़ोटो */
  let SX = null;
  function lbSwipe(lb) {
    const im = lb.querySelector(".im");
    im.ontouchstart = e => { SX = e.touches.length === 1 ? e.touches[0].clientX : null; };
    im.ontouchend = e => { if (SX == null || LB.length < 2) return; const dx = e.changedTouches[0].clientX - SX; SX = null; if (Math.abs(dx) > 45) { LBI = (LBI + (dx < 0 ? 1 : -1) + LB.length) % LB.length; lbShow(); } };
  }
  function relist() { const pl = ROOT.querySelector("[data-plist]"); if (pl) { pl.innerHTML = LY_[LY].list(filtered()); reveal(); } }
  function bagPaint() {
    const n = Object.values(BAG).reduce((a, b) => a + b, 0), bn = ROOT.querySelector("[data-bagn]"), bar = ROOT.querySelector("[data-bagbar]"); if (bn) bn.textContent = n;
    if (!bar) return; bar.hidden = !n; if (!n) return;
    let tot = 0; const lines = Object.keys(BAG).map(i => { const p = D.products[i], q = BAG[i], pr = offerOf(p) || p.mrp || 0; tot += pr * q; return "• " + p.name + (p.size ? " (" + p.size + ")" : "") + " × " + q + (pr ? " = " + rs(pr * q) : ""); });
    bar.querySelector("[data-bagt]").textContent = L(n + " सामान", n + (n === 1 ? " item" : " items")) + (tot ? " · " + rs(tot) : "");
    const msg = L("नमस्ते, मुझे ये सामान चाहिए:\n", "Hello, I'd like to order:\n") + lines.join("\n") + (tot ? "\n" + L("कुल: ", "Total: ") + rs(tot) : "") + "\n" + L("(PataBook पेज से)", "(from your PataBook page)");
    const u = D.waLink(msg); const a = bar.querySelector("[data-bagwa]"); if (u) a.href = u; else a.removeAttribute("href");
  }
  function placeMap() { const m = ROOT.querySelector(".map[data-fx]"); if (!m) return; const t = m.querySelector(".tl"); t.style.left = (m.clientWidth / 2 - (256 + +m.dataset.fx * 256)) + "px"; t.style.top = (m.clientHeight / 2 - (256 + +m.dataset.fy * 256)) + "px"; }
  function wire() {
    ROOT.onclick = e => {
      const t = e.target;
      const c = t.closest("[data-c]"); if (c) { CAT = c.dataset.c; ROOT.querySelectorAll("[data-c]").forEach(b => b.setAttribute("aria-pressed", b.dataset.c === CAT)); relist(); return; }
      if (t.closest("[data-lang]")) { const to = D.en ? "hi" : "en"; try { localStorage.setItem("pb-lang", to); } catch (_) { } if (D.onLang) D.onLang(to); return; }
      if (t.closest("[data-menu]")) { layer(ROOT.querySelector("[data-drw]")); return; }
      const dl = t.closest("[data-drw] a[href^='#']"); if (dl) { e.preventDefault(); const h = dl.getAttribute("href"), d = ROOT.querySelector("[data-drw]"); d._close && d._close(); setTimeout(() => { const x = ROOT.querySelector(h); if (x) x.scrollIntoView({ behavior: "smooth" }); }, 140); return; }
      const x = t.closest("[data-x]"); if (x) { const l = x.parentElement; l._close && l._close(); return; }
      const lb = t.closest("[data-lb]"); if (lb) { const lt = t.closest("[data-lt]"); if (lt) { LBI = +lt.dataset.lt; lbShow(); return; } if (t.closest("[data-lp]")) { LBI = (LBI - 1 + LB.length) % LB.length; lbShow(); } else if (t.closest("[data-ln]")) { LBI = (LBI + 1) % LB.length; lbShow(); } else if (t.classList.contains("im")) lb._close && lb._close(); return; }
      const pi = t.closest("[data-pi]"); if (pi) { e.preventDefault(); const p = D.products[+pi.dataset.pi]; if (!p || !p.img) return; LB = [{ src: p.img, cap: p.name + (p.size ? " · " + p.size : "") }]; LBI = 0; lbShow(); layer(ROOT.querySelector("[data-lb]")); return; }
      const gi = t.closest("[data-gi]"); if (gi) { LB = D.gallery.map(g => ({ src: g.src, cap: g.cap || "" })); LBI = +gi.dataset.gi; lbShow(); layer(ROOT.querySelector("[data-lb]")); return; }
      const ad = t.closest("[data-add]"); if (ad) { const i = ad.dataset.add; BAG[i] = (BAG[i] || 0) + 1; relist(); bagPaint(); return; }
      const dc = t.closest("[data-dec]"); if (dc) { const i = dc.dataset.dec; BAG[i] = (BAG[i] || 0) - 1; if (BAG[i] <= 0) delete BAG[i]; relist(); bagPaint(); return; }
      if (t.closest("[data-bagopen]")) { const b = ROOT.querySelector("[data-bagbar]"); if (b && !b.hidden) b.querySelector("a").focus(); else { const c2 = ROOT.querySelector("#coll"); if (c2) c2.scrollIntoView({ behavior: "smooth" }); } return; }
    };
    const q = ROOT.querySelector("[data-q]"); if (q) { q.value = Q; q.oninput = () => { Q = q.value; relist(); }; }
    const s = ROOT.querySelector("[data-stk]"), h = ROOT.querySelector("[data-hero]");
    if (SIO) SIO.disconnect();
    if (s && h && "IntersectionObserver" in window) { SIO = new IntersectionObserver(es => es.forEach(en => s.classList.toggle("on", !en.isIntersecting)), { threshold: .12 }); SIO.observe(h); }
    reveal(); placeMap(); bagPaint(); fitTitles();
    const lbx = ROOT.querySelector("[data-lb]"); if (lbx) lbSwipe(lbx);
    try { document.fonts && document.fonts.ready.then(fitTitles); } catch (_) { }
  }
  /* बड़े नाम: किसी भी font में screen से बाहर न जाएँ — ज़रूरत हो तो अक्षर छोटे */
  function fitTitles() {
    if (!ROOT) return;
    ROOT.querySelectorAll(".ly-2 .hero h1,.ly-3 .hero h1,.ly-6 .hero h1").forEach(h => {
      h.style.fontSize = ""; let fs = parseFloat(getComputedStyle(h).fontSize), n = 0;
      const wide = () => Array.from(h.querySelectorAll("span")).concat([h]).some(e => e.scrollWidth > h.clientWidth + 1);
      while (wide() && fs > 24 && n++ < 40) { fs *= .94; h.style.fontSize = fs + "px"; }
    });
  }
  addEventListener("resize", () => { if (ROOT) { placeMap(); fitTitles(); } });

  /* हर layout के अपने font — सिर्फ़ ज़रूरत वाले ही लोड हों (हिन्दी के लिए Tiro + Hind हमेशा) */
  const FONTS = { 1: "Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500", 2: "Anton&family=Inter:wght@300;400;500;600", 3: "Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;700",
    4: "Plus+Jakarta+Sans:wght@400;500;600;700;800", 5: "Inter:wght@200;300;400;500", 6: "Anton&family=DM+Sans:wght@400;500;700", 7: "Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@400;500;700",
    8: "Plus+Jakarta+Sans:wght@400;500;600;700;800", 9: "Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital@0;1", 10: "Inter:wght@300;400;500;600;700" };
  function fonts(ly) {
    if (window.PBBrandNoFonts) return;
    const id = "pbbf" + ly; if (document.getElementById(id)) return;
    const l = document.createElement("link"); l.id = id; l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=" + FONTS[ly] + "&family=Tiro+Devanagari+Hindi:ital@0;1&family=Hind:wght@300;400;500;600&display=swap"; document.head.appendChild(l);
  }
  window.PBBrand = {
    THEMES, LAYOUTS,
    render(root, data, ly, th) {
      ROOT = root; D = data; LY = Math.min(10, Math.max(1, +ly || 1)); TH = Math.min(10, Math.max(1, +th || 1));
      fonts(LY); NOCOLL = LY === 10;   /* Prestige: अलग "Product collection" नहीं — सब फ़ोटो Gallery में */
      root.style.setProperty("--mw", Math.max(4, ...String(data.name || "").trim().split(/\s+/).map(w => w.length)));   /* सबसे लंबा शब्द: बड़े नाम screen से बाहर न जाएँ */
      root.className = "pbb ly-" + LY + " th-" + THEMES[TH - 1].k; root.lang = D.en ? "en" : "hi"; applyTheme(root, TH);
      if (RIO) { RIO.disconnect(); RIO = null; }
      root.innerHTML = shell(LY_[LY].page());
      wire();
    },
    num: (ly, th) => (ly - 1) * 10 + th,
    split: n => ({ ly: Math.floor((n - 1) / 10) + 1, th: (n - 1) % 10 + 1 })
  };
})();
