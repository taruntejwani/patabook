/* PataBook — सादी लोडिंग: PataBook का पिन हल्का उछलता है (कोई बाहरी फ़ाइल नहीं)
   - पन्ना 0.45 सेकंड से जल्दी खुल जाए तो दिखती ही नहीं (झपकी नहीं)
   - दबने/स्क्रॉल में बाधा नहीं (pointer-events:none), 15 सेकंड बाद अपने-आप हट जाती है
   - दुकान का अपना poster-intro चल रहा हो तो नहीं दिखती
   - बंद करने के लिए: पन्नों से इस फ़ाइल का <script> टैग हटा दें */
(function () {
  if (window.PBLoad) return;
  var DELAY = 450, MINSHOW = 600, MAXWAIT = 15000;
  function lang() { try { return (window.PB && PB.lang && PB.lang()) || "hi"; } catch (e) { return "hi"; } }
  function txt() { return lang() === "hi" ? "लोड हो रहा है…" : "Loading…"; }

  function css() {
    if (document.getElementById("pbLdCss")) return;
    var s = document.createElement("style"); s.id = "pbLdCss";
    s.textContent =
      "#pbLd{position:fixed;inset:0;z-index:8500;display:flex;flex-direction:column;align-items:center;justify-content:center;" +
      "background:linear-gradient(180deg,#f4f8ff 0%,#e6efff 100%);pointer-events:none;opacity:0;transition:opacity .25s ease;font-family:inherit;color:#0b2f73}" +
      "#pbLd.on{opacity:1}#pbLd.off{opacity:0}" +
      "#pbLd .pw{position:relative;width:90px;height:120px}" +
      "#pbLd .pn{position:absolute;left:50%;bottom:22px;width:56px;height:68px;margin-left:-28px;background:url(pin.png) center/contain no-repeat;transform-origin:50% 100%;animation:pbLdHop 1s cubic-bezier(.35,0,.35,1) infinite;filter:drop-shadow(0 6px 6px rgba(11,47,115,.25))}" +
      "#pbLd .sh{position:absolute;left:50%;bottom:12px;width:40px;height:10px;margin-left:-20px;border-radius:50%;background:rgba(11,47,115,.22);animation:pbLdSh 1s cubic-bezier(.35,0,.35,1) infinite}" +
      "@keyframes pbLdHop{0%,100%{transform:translateY(0) scale(1.06,.94)}50%{transform:translateY(-34px) scale(.97,1.03)}}" +
      "@keyframes pbLdSh{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(.55);opacity:.4}}" +
      "#pbLd .nm{margin-top:6px;font-weight:700;font-size:22px;letter-spacing:.3px}#pbLd .nm b{color:#1a73e8}" +
      "#pbLd .tx{margin-top:4px;font-size:13px;font-weight:600;opacity:.65}" +
      "@media(prefers-reduced-motion:reduce){#pbLd .pn,#pbLd .sh{animation:none}}";
    document.head.appendChild(s);
  }

  function show() {
    css();
    var ov = document.createElement("div"); ov.id = "pbLd"; ov.setAttribute("role", "status"); ov.setAttribute("aria-live", "polite");
    ov.innerHTML = '<div class="pw"><span class="sh"></span><span class="pn"></span></div><div class="nm"><img src="pb-wordmark.webp" alt="PataBook" style="height:26px;width:auto;display:block;margin:0 auto"></div><div class="tx">' + txt() + '</div>';
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add("on"); });
    return { el: ov, at: performance.now() };
  }

  function hide(h) {
    if (!h) return;
    var rest = Math.max(0, MINSHOW - (performance.now() - h.at));
    setTimeout(function () {
      h.el.classList.remove("on"); h.el.classList.add("off");
      setTimeout(function () { if (h.el.parentNode) h.el.parentNode.removeChild(h.el); }, 300);
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
