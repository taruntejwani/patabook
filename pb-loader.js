/* PataBook — "पृथ्वी" वाली लोडिंग (हल्की: कोई बाहरी फ़ाइल/library नहीं)
   बिंदुओं वाली घूमती पृथ्वी → भारत पर ठहरती है → PataBook का पिन गिरता है → छल्ले।
   - पन्ना 0.45 सेकंड से जल्दी खुल जाए तो दिखती ही नहीं (झपकी नहीं)
   - दबने/स्क्रॉल में बाधा नहीं (pointer-events:none), 15 सेकंड बाद अपने-आप हट जाती है
   - दुकान का अपना poster-intro चल रहा हो तो नहीं दिखती
   - बंद करने के लिए: पन्नों से इस फ़ाइल का <script> टैग हटा दें */
(function () {
  if (window.PBLoad) return;
  var LAND = { STEP: 2.5, COLS: 144, ROWS: 68, B64: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/5///gAAAAAAAAAAAAAAAAEz/P//8ABwAAAADAAAAAAAABKZAP//8AAAAA4AH4AAAAAAADwDQAP/8AAAAGAH/4AIAAgEABfG/gH/4AAAAGHf//9/gAB///1Ds4H/gAAf4F6///////8/////w+H8BAB/0/////////AP////UcHwCAD3/////////+A////8BgDgAAPn////////74AeB//+B6AAAAPn///////4CAAIAf//h+AAACFP///////gOAAAAP//7/gAANH////////wMAAAAH////wAAD/////////wAAAAAD///04AAD/////////wAAAAAD///8AAAB//X3/////gAAAAAD///wAAAB6+Dv/////EAAAAAD///gAAAPhvbz////8IAAAAAB///AAAAPAp/z///+IIAAAAAB///AAAAA8Af/////EwAAAAAAf/+AAAAH8AP/////BAAAAAAAX/4AAAAP/uv/////gAAAAAAAP8EAAAAP///v////gAAAAAAAD4EAAAA///3z////AAAAAAAAB4AAAAA///3+H//+gAAAAAAAA4gAAAB///7/D+fgAAAAAAAAA9gYAAA///7+B8PQAAAAAAAAAHgAAAB///94B4HggAAAAAAAAA4AAAB////gAwHwwAAAAAAAAAAoAAA///+QAwFgAAAAAAAAAAF/AAAf///wAAEAIAAAAAAAAAB/gAAPv//wAICAAAAAAAAAAAB/8AAAD//gAAGGAAAAAAAAAAD/8AAAD//AAADOAAAAAAAAAAD//AAAD/+AAADOjAAAAAAAAAD//4AAD/8AAABAg8AAAAAAAAD//8AAB/8AAAAgAeAAAAAAAAD//8AAB/8AAAABoIAAAAAAAAB//4AAB/8AAAAAAAAAAAAAAAB//wAAB/8QAAAADAAAAAAAAAAf/wAAB/8wAAAAfkAAAAAAAAAP/wAAB/wwAAAAf+AAAAAAAAAP/wAAB/xgAAAD//AAAAAAAAAP/AAAA/xgAAAH//AAAAAAAAAP+AAAA/gAAAAH//gAAAAAAAAf8AAAAfgAAAAD//gAAAAAAAAf8AAAAfAAAAAD//gAAAAAAAAf4AAAAcAAAAADw/gAAAAAAAAfgAAAAAAAAAAAAPAAAAAAAAAfAAAAAAAAAAAAACACAAAAAAA8AAAAAAAAAAAAACAEAAAAAAAcAAAAAAAAAAAAAAAIAAAAAAA4AAAAAAAAAAAAAAAQAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAwgAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" };
  var DELAY = 450, MINSHOW = 700, MAXWAIT = 15000;
  var IN_LON = 78, IN_LAT = 22;           /* भारत */

  function lang() { try { return (window.PB && PB.lang && PB.lang()) || "hi"; } catch (e) { return "hi"; } }
  function txt() { return lang() === "hi" ? "लोड हो रहा है…" : "Loading…"; }

  /* ---- ज़मीन के बिंदु (bitmap → sin(lat), cos(lat), lon) ---- */
  var DOTS = null;
  function dots() {
    if (DOTS) return DOTS;
    var bin = atob(LAND.B64), out = [];
    for (var i = 0, n = LAND.COLS * LAND.ROWS; i < n; i++) {
      if ((bin.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1) {
        var r = (i / LAND.COLS) | 0, c = i % LAND.COLS;
        var lat = (85 - r * LAND.STEP - LAND.STEP / 2) * Math.PI / 180;
        var lon = (-180 + c * LAND.STEP + LAND.STEP / 2) * Math.PI / 180;
        out.push([Math.sin(lat), Math.cos(lat), lon]);
      }
    }
    return (DOTS = out);
  }

  function css() {
    if (document.getElementById("pbLdCss")) return;
    var s = document.createElement("style"); s.id = "pbLdCss";
    s.textContent =
      "#pbLd{position:fixed;inset:0;z-index:8500;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;" +
      "background:radial-gradient(ellipse at 50% 38%,#12306b 0%,#08183a 62%,#050f26 100%);color:#fff;pointer-events:none;opacity:0;transition:opacity .28s ease;font-family:inherit}" +
      "#pbLd.on{opacity:1}#pbLd.off{opacity:0}" +
      "#pbLd .st{position:absolute;inset:0;overflow:hidden}" +
      "#pbLd .st i{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff;opacity:.55;animation:pbLdTw 2.6s ease-in-out infinite}" +
      "@keyframes pbLdTw{0%,100%{opacity:.15}50%{opacity:.85}}" +
      "#pbLd .gl{position:relative;width:200px;height:200px;border-radius:50%;box-shadow:0 0 0 1px rgba(140,185,255,.25),0 0 40px 6px rgba(70,140,255,.35),0 0 90px 22px rgba(40,100,230,.22)}" +
      "#pbLd canvas{width:200px;height:200px;display:block;border-radius:50%}" +
      "#pbLd .pin{position:absolute;left:50%;top:50%;width:34px;height:42px;margin:-42px 0 0 -17px;background:url(pin.png) center/contain no-repeat;opacity:0;transform:translateY(-150px);filter:drop-shadow(0 4px 5px rgba(0,0,0,.45))}" +
      "#pbLd .pin.drop{animation:pbLdDrop .62s cubic-bezier(.3,1.4,.5,1) forwards}" +
      "@keyframes pbLdDrop{0%{opacity:0;transform:translateY(-150px)}25%{opacity:1}100%{opacity:1;transform:none}}" +
      "#pbLd .rg{position:absolute;left:50%;top:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;border:2px solid rgba(255,214,102,.9);opacity:0}" +
      "#pbLd .rg.go{animation:pbLdRg 1.7s ease-out infinite}#pbLd .rg.go.b{animation-delay:.85s}" +
      "@keyframes pbLdRg{0%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(7)}}" +
      "#pbLd .nm{font-weight:800;font-size:22px;letter-spacing:.3px}#pbLd .nm b{color:#ffd666}" +
      "#pbLd .tx{font-size:13.5px;opacity:.8;font-weight:600}" +
      "@media(prefers-reduced-motion:reduce){#pbLd .pin.drop{animation:none;opacity:1;transform:none}#pbLd .rg.go{animation:none}#pbLd .st i{animation:none}}";
    document.head.appendChild(s);
  }

  function ease(t) { t = Math.min(1, Math.max(0, t)); return 1 - Math.pow(1 - t, 3); }
  var reduce = false; try { reduce = matchMedia("(prefers-reduced-motion:reduce)").matches; } catch (e) {}

  function build() {
    css();
    var ov = document.createElement("div"); ov.id = "pbLd"; ov.setAttribute("role", "status"); ov.setAttribute("aria-live", "polite");
    var stars = ""; for (var i = 0; i < 26; i++) stars += '<i style="left:' + ((i * 37 + 11) % 100) + '%;top:' + ((i * 53 + 7) % 100) + '%;animation-delay:' + ((i % 7) * 0.35) + 's"></i>';
    ov.innerHTML = '<div class="st">' + stars + '</div><div class="gl"><canvas id="pbLdC" width="400" height="400"></canvas><span class="rg"></span><span class="rg b"></span><span class="pin"></span></div>' +
      '<div class="nm">Pata<b>Book</b></div><div class="tx">' + txt() + '</div>';
    document.body.appendChild(ov);
    return ov;
  }

  function show() {
    var ov = build(), cv = ov.querySelector("#pbLdC"), cx = cv.getContext("2d"), D = dots();
    var pin = ov.querySelector(".pin"), rgs = ov.querySelectorAll(".rg");
    var W = 400, R = 190, c0 = W / 2, lat0 = IN_LAT * Math.PI / 180, sl0 = Math.sin(lat0), cl0 = Math.cos(lat0);
    var START = performance.now(), SPIN = reduce ? 1 : 1900, startLon = IN_LON - 330, raf = 0, dead = false, dropped = false;

    function frame(now) {
      if (dead) return;
      var t = (now - START), p = ease(t / SPIN), lon0 = (startLon + (IN_LON - startLon) * p) * Math.PI / 180;
      cx.clearRect(0, 0, W, W);
      var g = cx.createRadialGradient(c0 - 55, c0 - 60, 20, c0, c0, R + 6);
      g.addColorStop(0, "#2f7bff"); g.addColorStop(.55, "#1450c8"); g.addColorStop(1, "#0a2a78");
      cx.fillStyle = g; cx.beginPath(); cx.arc(c0, c0, R, 0, 6.2832); cx.fill();
      for (var i = 0; i < D.length; i++) {
        var d = D[i], dl = d[2] - lon0, cd = Math.cos(dl);
        var cc = sl0 * d[0] + cl0 * d[1] * cd;                 /* सामने की तरफ़ वाले बिंदु ही */
        if (cc <= 0.02) continue;
        var x = d[1] * Math.sin(dl), y = cl0 * d[0] - sl0 * d[1] * cd, s = 1.5 + 2.1 * cc;
        cx.fillStyle = "rgba(214,234,255," + (0.35 + 0.65 * cc).toFixed(2) + ")";
        cx.fillRect(c0 + x * R - s / 2, c0 - y * R - s / 2, s, s);
      }
      var sh = cx.createRadialGradient(c0, c0, R * .62, c0, c0, R);   /* किनारे पर हल्की छाया */
      sh.addColorStop(0, "rgba(5,15,50,0)"); sh.addColorStop(1, "rgba(5,15,50,.55)");
      cx.fillStyle = sh; cx.beginPath(); cx.arc(c0, c0, R, 0, 6.2832); cx.fill();
      if (!dropped && t >= SPIN - 250) {
        dropped = true; pin.classList.add("drop");
        setTimeout(function () { for (var k = 0; k < rgs.length; k++) rgs[k].classList.add("go"); }, 520);
      }
      if (t < SPIN + 50) raf = requestAnimationFrame(frame);    /* ठहरने के बाद drawing बंद (बैटरी बचती है) */
    }
    raf = requestAnimationFrame(frame);
    requestAnimationFrame(function () { ov.classList.add("on"); });
    return { el: ov, at: performance.now(), stop: function () { dead = true; cancelAnimationFrame(raf); } };
  }

  function hide(h) {
    if (!h) return;
    var rest = Math.max(0, MINSHOW - (performance.now() - h.at));
    setTimeout(function () {
      h.el.classList.remove("on"); h.el.classList.add("off");
      setTimeout(function () { h.stop(); if (h.el.parentNode) h.el.parentNode.removeChild(h.el); }, 320);
    }, rest);
  }

  /* test() → true जब तक पन्ना "लोड हो रहा है" दिखा रहा हो */
  function watch(test) {
    var t0 = Date.now(), h = null;
    function tick() {
      var loading = false; try { loading = !!test(); } catch (e) {}
      var intro = !!(window.__pbIntro || document.getElementById("pbIntro"));
      if (!h && loading && !intro && Date.now() - t0 >= DELAY && document.body) h = show();
      if (h && (!loading || Date.now() - t0 > MAXWAIT)) { hide(h); return; }
      if (!h && !loading) return;                        /* जल्दी खुल गया: कभी दिखी ही नहीं */
      if (Date.now() - t0 > MAXWAIT + 2000) return;
      setTimeout(tick, 100);
    }
    tick();
  }

  function auto() {
    var app = document.getElementById("app"), ld = document.getElementById("loading");
    if (ld) { watch(function () { return document.getElementById("loading"); }); return; }
    if (app) watch(function () {
      var a = document.getElementById("app");
      return a && a.children.length === 1 && a.firstElementChild.className.indexOf("note") > -1 && /लोड|Loading|loading/.test(a.textContent || "");
    });
  }

  window.PBLoad = { watch: watch };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
})();
