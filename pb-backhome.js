/* PataBook — दुकान का पेज: Back (← या फ़ोन का Back)
   • PataBook के अंदर से आए (Home, Category, Search, Map, Favourites, City Market…) → Back उसी पेज पर लौटे
   • बाहर से आए (WhatsApp / Google / सीधा link / app में पहला पेज) → Back पर PataBook का Home खुले (app बंद न हो) */
(function () {
  try {
    var rf = document.referrer || "";
    /* business.html → shop.html redirect में referrer business.html हो जाता है; असली referrer वहाँ sessionStorage में रखा है */
    try {
      var rp = rf ? new URL(rf) : null;
      if (rp && rp.origin === location.origin && /\/business(\.html)?$/.test(rp.pathname) && /\/shop(\.html)?$/.test(location.pathname)) {
        var keep = sessionStorage.getItem("pb-ref"); if (keep !== null) rf = keep;
      }
    } catch (_) {}
    var inside = false;
    try { var u = rf ? new URL(rf) : null; inside = !!(u && u.origin === location.origin && !(u.pathname === location.pathname && u.search === location.search)); } catch (_) {}
    if (inside) return;   /* अंदर से आए: browser का अपना Back सही है */
    var st = history.state || {};
    if (!st.pbshop && !st.pbhome) { history.replaceState({ pbhome: 1 }, ""); history.pushState({ pbshop: 1 }, ""); }
    addEventListener("popstate", function (e) { if (e.state && e.state.pbhome) location.replace("index.html"); });
  } catch (_) {}
})();
