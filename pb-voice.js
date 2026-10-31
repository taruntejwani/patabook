/* PataBook — 🎤 बोलकर search: माइक दबाएँ, बोलें → search डिब्बे में लिखा जाए → अपने आप search हो.
   फ़ोन का अपना speech-to-text (मुफ़्त). जहाँ चलता नहीं (कुछ iPhone / WebView) वहाँ बटन दिखता ही नहीं. */
(function () {
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  function lang() { try { return window.PB && PB.lang && PB.lang() === "en" ? "en-IN" : "hi-IN"; } catch (e) { return "hi-IN"; } }
  function init() {
    var q = document.getElementById("q"); if (!q || q.dataset.mic) return; q.dataset.mic = "1";
    var box = q.closest("label") || q.parentNode, form = q.form, rec = null, on = false;
    var st = document.createElement("style");
    st.textContent = ".pbmic{flex:none;width:36px;height:36px;border-radius:50%;border:0;background:#eef3fd;color:#1a73e8;line-height:1;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0}.pbmic.on{background:#d93025;color:#fff;animation:pbmicp 1s infinite}@keyframes pbmicp{50%{box-shadow:0 0 0 7px rgba(217,48,37,.2)}}";
    document.head.appendChild(st);
    var MIC = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0"/><path d="M12 18v3M9 21h6"/></svg>', STOP = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2.5"/></svg>';
    var b = document.createElement("button"); b.type = "button"; b.className = "pbmic"; b.innerHTML = MIC;
    function lbl() { var e = window.PB && PB.lang && PB.lang() === "en"; b.setAttribute("aria-label", e ? "Search by voice" : "बोलकर खोजें"); b.title = e ? "Speak to search" : "बोलकर खोजें"; }
    lbl(); box.appendChild(b);
    function stop() { on = false; b.classList.remove("on"); b.innerHTML = MIC; }
    b.addEventListener("click", function () {
      if (on && rec) { try { rec.stop(); } catch (e) {} return; }
      try {
        rec = new SR(); rec.lang = lang(); rec.interimResults = true; rec.maxAlternatives = 1; rec.continuous = false;
        var fin = "";
        rec.onresult = function (ev) {
          var t = ""; for (var i = ev.resultIndex; i < ev.results.length; i++) { t += ev.results[i][0].transcript; if (ev.results[i].isFinal) fin = t; }
          q.value = (fin || t).trim(); try { q.dispatchEvent(new Event("input", { bubbles: true })); } catch (e) {}
        };
        rec.onerror = function () { stop(); };
        rec.onend = function () {
          var had = on; stop();
          if (had && q.value.trim()) { try { if (form && form.requestSubmit) form.requestSubmit(); else if (form) form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })); } catch (e) {} }
        };
        on = true; b.classList.add("on"); b.innerHTML = STOP; rec.start();
      } catch (e) { stop(); }
    });
    document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest("[data-lang],#pbLang")) setTimeout(lbl, 200); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
