/* PBBack: phone Back closes the top-most layer (lightbox, popup, full-screen view) instead of leaving the page.
   Usage: PBBack.open(closeFn) when a layer opens; PBBack.close() to close it from code (it runs closeFn via Back). */
(function () {
  if (window.PBBack) return;
  var stack = [];
  function depth() { try { return (history.state && history.state.pbl) || 0; } catch (e) { return 0; } }
  window.PBBack = {
    open: function (fn) {
      stack.push(fn);
      try { history.pushState(Object.assign({}, history.state || {}, { pbl: stack.length }), ""); } catch (e) {}
    },
    close: function () { if (stack.length) { try { history.back(); } catch (e) { var f = stack.pop(); f && f(); } } },
    isOpen: function () { return stack.length > 0; }
  };
  window.addEventListener("popstate", function () {
    var d = depth();
    while (stack.length > d) { var f = stack.pop(); try { f && f(); } catch (e) {} }
  });
})();
