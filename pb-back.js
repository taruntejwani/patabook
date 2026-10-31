/* PBBack: phone Back closes the top-most layer (lightbox, popup, full-screen view) instead of leaving the page.
   Usage: PBBack.open(closeFn) when a layer opens; PBBack.close() to close it from code (it runs closeFn via Back).
   PBBack.watch(selector): अपने-आप — जो भी तत्व selector से मेल खाकर page में जुड़े, उसे एक layer मान लो
   (Back → हट जाए; अपने ✕ से हटे तो history का कदम भी वापस ले लो)। */
(function () {
  if (window.PBBack) return;
  var stack = [];
  function depth() { try { return (history.state && history.state.pbl) || 0; } catch (e) { return 0; } }
  window.PBBack = {
    open: function (fn, node) {
      stack.push({ fn: fn, node: node || null });
      try { history.pushState(Object.assign({}, history.state || {}, { pbl: stack.length }), ""); } catch (e) {}
    },
    close: function () { if (stack.length) { try { history.back(); } catch (e) { var f = stack.pop(); f && f.fn && f.fn(); } } },
    isOpen: function () { return stack.length > 0; },
    watch: function (sel) {
      if (!window.MutationObserver) return;
      function track(n) {
        if (!n || n.nodeType !== 1 || n.__pbl || !n.matches || !n.matches(sel)) return;
        n.__pbl = 1; PBBack.open(function () { if (n.isConnected) n.remove(); }, n);
      }
      function untrack(n) {
        if (!n || n.nodeType !== 1 || !n.__pbl) return;
        for (var i = stack.length - 1; i >= 0; i--) if (stack[i].node === n) {
          if (i === stack.length - 1) { try { history.back(); } catch (e) { stack.pop(); } } else stack.splice(i, 1);
          return;
        }
      }
      function start() {
        new MutationObserver(function (ms) { ms.forEach(function (m) {
          Array.prototype.forEach.call(m.addedNodes, track); Array.prototype.forEach.call(m.removedNodes, untrack); }); })
          .observe(document.body, { childList: true });
      }
      if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
    }
  };
  window.addEventListener("popstate", function () {
    var d = depth();
    while (stack.length > d) { var e = stack.pop(); try { e && e.fn && e.fn(); } catch (x) {} }
  });
  PBBack.watch(".lbx,.psh,#repSheet,.pbc-o,.pbh-sc");
})();
