/* PataBook — Admin / Team पैनल की भाषा (हिन्दी ↔ English).
   कोड में लिखे हिन्दी वाक्यों को English मोड में पन्ने पर बदल देता है; डेटा और सर्वर को नहीं छूता।
   भाषा वही 'pb-lang' key में रहती है जो पूरी साइट इस्तेमाल करती है। */
(function () {
  var L = 'en'; try { L = localStorage.getItem('pb-lang') === 'hi' ? 'hi' : 'en'; } catch (e) {}
  var pairs = [], sorted = null, DEV = /[ऀ-ॿ]/;
  var PBL = window.PBL = {
    lang: function () { return L; },
    loc: function () { return L === 'en' ? 'en-IN' : 'hi-IN'; },
    add: function (arr) { pairs = pairs.concat(arr); sorted = null; if (L === 'en' && document.body) PBL.run(document.body); },
    t: function (s) {
      if (L !== 'en' || !s || !DEV.test(s)) return s;
      if (!sorted) sorted = pairs.slice().sort(function (a, b) { return b[0].length - a[0].length; });
      for (var i = 0; i < sorted.length; i++) { if (s.indexOf(sorted[i][0]) >= 0) s = s.split(sorted[i][0]).join(sorted[i][1]); if (!DEV.test(s)) break; }
      return s;
    },
    set: function (l) { try { localStorage.setItem('pb-lang', l); } catch (e) {} location.reload(); },
    run: function (root) {
      if (L !== 'en') return;
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, list = [];
      while ((n = w.nextNode())) { var p = n.parentNode; if (p && /^(SCRIPT|STYLE)$/.test(p.nodeName)) continue; if (DEV.test(n.nodeValue)) list.push(n); }
      list.forEach(function (x) { var v = PBL.t(x.nodeValue); if (v !== x.nodeValue) x.nodeValue = v; });
      if (root.querySelectorAll) root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(function (el) {
        ['placeholder', 'title', 'aria-label'].forEach(function (a) { var v = el.getAttribute(a); if (v && DEV.test(v)) { var t = PBL.t(v); if (t !== v) el.setAttribute(a, t); } });
      });
    }
  };
  document.documentElement.lang = L;
  var _a = window.alert, _c = window.confirm, _p = window.prompt;
  window.alert = function (m) { return _a.call(window, PBL.t(String(m))); };
  window.confirm = function (m) { return _c.call(window, PBL.t(String(m))); };
  window.prompt = function (m, d) { return _p.call(window, PBL.t(String(m)), d); };
  function toggle() {
    var b = document.createElement('button');
    b.type = 'button'; b.id = 'pbLangBtn'; b.textContent = L === 'en' ? 'हिन्दी' : 'English';
    var h = document.querySelector('header');
    b.setAttribute('style', h ? 'border:1px solid #ffffff66;background:#ffffff26;color:#fff;border-radius:11px;padding:6px 11px;font:700 12px var(--pbf,system-ui,sans-serif);cursor:pointer;flex:none' : 'position:fixed;top:10px;right:10px;z-index:99;border:1px solid #00000033;background:#fff;color:#0b2f73;border-radius:11px;padding:6px 11px;font:700 12px var(--pbf,system-ui,sans-serif);cursor:pointer');
    b.onclick = function () { PBL.set(L === 'en' ? 'hi' : 'en'); };
    (h || document.body).appendChild(b);
  }
  function start() {
    toggle();
    if (L !== 'en') return;
    if (DEV.test(document.title)) document.title = PBL.t(document.title);
    PBL.run(document.body);
    var busy = false;
    new MutationObserver(function (ms) {
      if (busy) return; busy = true;
      try {
        ms.forEach(function (m) {
          if (m.type === 'characterData') { var v = PBL.t(m.target.nodeValue); if (v !== m.target.nodeValue) m.target.nodeValue = v; }
          m.addedNodes && m.addedNodes.forEach(function (n) { if (n.nodeType === 3) { var v = PBL.t(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; } else if (n.nodeType === 1) PBL.run(n); });
        });
      } finally { busy = false; }
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
