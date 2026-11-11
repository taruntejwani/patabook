/* ऊपर का ← (href="index.html"): PataBook के अंदर से आए हों तो phone के Back जैसा — पिछले पेज पर (नया Home नहीं खुलता)।
   बाहर से (WhatsApp / Google / सीधा link) आए हों तो पहले जैसा Home। */
(function () {
  if (window.__pbBackLink) return; window.__pbBackLink = 1;
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a.back[href="index.html"]'); if (!a) return;
    var r = null; try { r = new URL(document.referrer); } catch (_) { return; }
    if (r.origin !== location.origin || history.length < 2) return;
    if (/\/(login|admin-login|team-login)(\.html)?$/.test(r.pathname)) return;     /* login के बाद आए → Home */
    if (r.pathname === location.pathname && r.search === location.search) return;
    e.preventDefault();
    var d = 0; try { d = (history.state && history.state.pbl) || 0; } catch (_) {}
    history.go(-(d + 1));
  }, true);
})();
