/* PataBook app (Play Store / home-screen app): फ़ोन का Back हमेशा पिछले PataBook पेज पर ले जाए, app बंद न हो।
   Chrome कुछ history कदमों को (जो पेज ने बिना छुए जोड़े) Back पर छोड़ देता है — इससे दुकान के पेज से Back पर app ही बंद हो जाता था।
   यहाँ Back को CloseWatcher से पकड़कर खुद history.back() करते हैं (JS वाला back कोई कदम नहीं छोड़ता)।
   • पीछे कोई PataBook पेज न हो (सीधा link / notification से खुला) → Home खुले
   • सिर्फ़ Android app में; browser tab या computer पर कुछ नहीं बदलता। Home (index) पर यह file नहीं लगती। */
(function () {
  try {
    if (!("CloseWatcher" in window) || !/Android/i.test(navigator.userAgent || "")) return;
    var app = (window.matchMedia && (matchMedia("(display-mode: standalone)").matches || matchMedia("(display-mode: fullscreen)").matches || matchMedia("(display-mode: minimal-ui)").matches)) || navigator.standalone;
    if (!app) return;
    var w = null;
    function home() { location.replace("index.html"); }
    function back() {
      var can = true;
      try { can = (window.navigation && "canGoBack" in navigation) ? navigation.canGoBack : history.length > 1; } catch (e) {}
      if (!can) { home(); return; }
      try { history.back(); } catch (e) { home(); }
    }
    function arm() {
      if (w) return;
      try {
        w = new CloseWatcher();
        w.onclose = function () { w = null; back(); setTimeout(arm, 50); };
      } catch (e) { w = null; }
    }
    /* एक ही पेज में layer (photo, popup) बंद होने पर popstate आता है — watcher फिर से तैयार */
    addEventListener("popstate", function () { setTimeout(arm, 50); });
    addEventListener("pageshow", function (e) { if (e.persisted) { try { w && w.destroy(); } catch (x) {} w = null; arm(); } });
    arm();
  } catch (e) {}
})();
