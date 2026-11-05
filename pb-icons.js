/* PataBook — सादे एक जैसे icon (emoji की जगह)। उपयोग: PBI("call") → inline SVG, रंग = आसपास के text का रंग */
(function () {
  var P = {
    call: '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z"/>',
    dir: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
    check: '<path d="M22 11.1V12a10 10 0 11-5.9-9.1"/><polyline points="22 4 12 14 9 11"/>',
    insta: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h5M13 14h5"/>',
    store: '<path d="M3 9l1-5h16l1 5M3 9v11h18V9M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M9 20v-6h6v6"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    mail: '<path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/><polyline points="22 6 12 13 2 6"/>',
    globe: '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
    star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
    home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/>',
    brief: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>',
    box: '<path d="M21 16V8a2 2 0 00-1-1.7l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.7l7 4a2 2 0 002 0l7-4a2 2 0 001-1.7z"/><path d="M3.3 7L12 12l8.7-5M12 22V12"/>',
    bag: '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/>',
    tool: '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.8a6 6 0 01-7.9 7.9l-6.9 6.9a2.1 2.1 0 01-3-3l6.9-6.9a6 6 0 017.9-7.9z"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>',
    gem: '<path d="M6 3h12l4 6-10 13L2 9z"/><path d="M2 9h20M12 22L8 9l4-6 4 6z"/>',
    stop: '<circle cx="12" cy="12" r="10"/><path d="M4.9 4.9l14.2 14.2"/>',
    phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    rupee: '<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 000-10"/>',
    chart: '<path d="M18 20V10M12 20V4M6 20v-6"/>'
  };
  /* emoji → एक जैसे icon (हर फ़ोन पर एक जैसे दिखें). PBI.clean(el) / PBI.watch(el) */
  var EMO = { "📍": "pin", "🧭": "dir", "📞": "call", "💬": "chat", "🪪": "card", "📤": "share", "🖼️": "image", "🖼": "image", "🚩": "flag", "🏁": "flag", "✏️": "edit", "✏": "edit",
    "🌐": "globe", "📧": "mail", "✅": "check", "✔": "check", "✔️": "check", "🧾": "check", "⭐": "star", "🗓️": "cal", "🗓": "cal", "💼": "brief", "🚚": "truck", "🏠": "home",
    "🏭": "store", "🏪": "store", "📦": "box", "🛍️": "bag", "🛍": "bag", "🛠️": "tool", "🛠": "tool", "ℹ": "info", "ℹ️": "info", "🕘": "clock", "👥": "users", "📱": "phone",
    "💎": "gem", "👑": "gem", "🥈": "gem", "⛔": "stop", "➕": "plus", "📋": "copy", "📊": "chart", "💰": "rupee", "👷": "brief", "📘": "globe" };
  var KEYS = Object.keys(EMO).sort(function (a, b) { return b.length - a.length; });
  var RX = new RegExp("(" + KEYS.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|") + ")\uFE0F?", "g");
  function clean(root) {
    if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { var p = n.parentNode; if (!p || /^(SCRIPT|STYLE|TEXTAREA|INPUT|OPTION|TITLE)$/.test(p.nodeName) || (p.closest && p.closest("[data-noicon],.pbi"))) return NodeFilter.FILTER_REJECT; RX.lastIndex = 0; return RX.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP; } });
    var list = [], n; while ((n = w.nextNode())) list.push(n);
    list.forEach(function (t) {
      var span = document.createElement("span"); span.style.display = "contents";
      span.innerHTML = t.nodeValue.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }).replace(RX, function (m, e) { return window.PBI(EMO[e] || EMO[e.replace(/\uFE0F/g, "")]); });
      t.parentNode.replaceChild(span, t);
    });
  }
  var MO = null;
  function watch(root) { if (!root || !window.MutationObserver) return; clean(root); if (MO) MO.disconnect(); var busy = false; MO = new MutationObserver(function () { if (busy) return; busy = true; requestAnimationFrame(function () { clean(root); busy = false; }); }); MO.observe(root, { childList: true, subtree: true, characterData: true }); }
  window.PBI = function (n, cls) {
    return '<svg class="pbi' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || "") + '</svg>';
  };
  window.PBI.clean = clean; window.PBI.watch = watch;
  var st = document.createElement("style");
  st.textContent = ".pbi{width:1.15em;height:1.15em;vertical-align:-.2em;flex:none;display:inline-block}";
  document.head.appendChild(st);
})();
