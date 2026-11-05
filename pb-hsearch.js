/* PataBook — दुकान के पेज के ऊपर (PataBook नाम के पास) छोटा 🔍 बटन।
   दबाने पर: PataBook नाम पीछे खिसककर छिपता है, खोज का box पूरी पट्टी में फैलता है → दूसरी दुकान / सामान खोजें (search.html?q=…)।
   ✕ / फ़ोन का Back / Esc = बंद।
   PBHS.mount(logoEl, barEl) — logoEl: PataBook वाला link (box इसके ठीक बाद लगता है), barEl: header की पट्टी में कोई तत्व */
(function () {
  if (window.PBHS) return;
  function en() { try { if (window.PB && PB.lang) return PB.lang() !== "hi"; return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function T(hi, e) { return en() ? e : hi; }
  var ICON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';
  var css = document.createElement("style");
  css.textContent =
    ".hsb{flex:1 1 auto;min-width:0;max-width:420px;height:40px;display:flex;align-items:center;gap:6px;border-radius:999px;border:1.5px solid #c9d8f0;background:#f5f8fd;color:#1a73e8;cursor:text;padding:0 10px 0 12px;margin:0 2px;font:inherit;text-align:left;-webkit-tap-highlight-color:transparent;box-sizing:border-box}" +
    ".hsb svg{flex:none;width:18px;height:18px}.hsb span{flex:1;min-width:0;color:#6b7486;font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    ".hsb:active{background:#eaf1fc}.hsb .s{display:none}@media(max-width:400px){.hsb .l{display:none}.hsb .s{display:block}}@media(max-width:345px){.hsb .s{display:none}.hsb{flex:0 0 auto;width:44px;padding:0;justify-content:center}}" +
    /* फ़ोन पर: PataBook सिर्फ़ P निशान (पीछे), search box आगे बड़ा */
    "@media(max-width:640px){.hs-has .pbwm{display:none!important}.hs-has .sp,.hs-has #tb{display:none!important}}" +
    ".hs-go{transition:transform .22s ease,opacity .22s ease!important;transform:translateX(-110%)!important;opacity:0!important}" +
    ".hs-on>*:not(.hsf){display:none!important}" +
    ".hsf{flex:1;min-width:0;display:flex;align-items:center;gap:6px;height:42px;margin:0;background:#fff;border:1.5px solid #1a73e8;border-radius:999px;padding:0 4px 0 12px;box-sizing:border-box;animation:hsGrow .25s ease-out both;transform-origin:right center}" +
    "@keyframes hsGrow{from{opacity:.3;transform:scaleX(.2)}to{opacity:1;transform:none}}" +
    ".hsf svg{flex:none;color:#1a73e8}" +
    ".hsf input{flex:1;min-width:0;border:0;outline:none!important;background:none;font:inherit;font-size:16px;color:#14161c;padding:0;height:100%}" +
    ".hsf input::-webkit-search-cancel-button{display:none}" +
    ".hsf .hsx{flex:none;width:34px;height:34px;border-radius:50%;border:0;background:#eef2f8;color:#3b4252;font-size:15px;cursor:pointer;display:grid;place-items:center}" +
    ".hsf .hsg{flex:none;height:34px;border-radius:999px;border:0;background:#1a73e8;color:#fff;font:inherit;font-size:14px;font-weight:700;padding:0 14px;cursor:pointer}" +
    "@media(prefers-reduced-motion:reduce){.hsf{animation:none}.hs-go{transition:none!important}}";
  document.head.appendChild(css);

  function mount(logo, before) {
    if (!logo || !before || !before.parentNode || document.getElementById("hsBtn")) return;
    var bar = before.parentNode, open = false, backed = false, form = null;
    var b = document.createElement("button");
    b.type = "button"; b.id = "hsBtn"; b.className = "hsb";
    function lab() { b.innerHTML = ICON + "<span class=\"l\">" + T("दुकान खोजें…", "Search shops…") + "</span><span class=\"s\">" + T("खोजें…", "Search…") + "</span>"; b.setAttribute("aria-label", T("दूसरी दुकान खोजें", "Search other shops")); }
    lab(); bar.insertBefore(b, logo.nextSibling); bar.classList.add("hs-has");
    if (window.PB && PB.onChange) { try { PB.onChange(lab); } catch (e) {} }

    function close(fromBack) {
      if (!open) return; open = false;
      if (form && form.parentNode) form.remove(); form = null;
      bar.classList.remove("hs-on"); logo.classList.remove("hs-go");
      if (backed && !fromBack && window.PBBack && PBBack.isOpen()) { backed = false; PBBack.close(); } else backed = false;
      b.focus({ preventScroll: true });
    }
    function show() {
      if (open) return; open = true;
      logo.classList.add("hs-go");   /* PataBook नाम पीछे खिसके */
      setTimeout(function () {
        if (!open) return;
        form = document.createElement("form"); form.className = "hsf"; form.setAttribute("role", "search");
        form.innerHTML = ICON + '<input type="search" enterkeyhint="search" autocomplete="off" maxlength="80" aria-label="' + T("दुकान या सामान खोजें", "Search shops or products") + '" placeholder="' + T("दुकान या सामान खोजें…", "Search shops or products…") + '">' +
          '<button type="submit" class="hsg">' + T("खोजें", "Search") + '</button>' +
          '<button type="button" class="hsx" aria-label="' + T("बंद करें", "Close") + '">✕</button>';
        bar.appendChild(form); bar.classList.add("hs-on");
        var inp = form.querySelector("input");
        inp.focus();
        form.querySelector(".hsx").onclick = function () { close(false); };
        inp.onkeydown = function (e) { if (e.key === "Escape") close(false); };
        form.onsubmit = function (e) {
          e.preventDefault(); var q = inp.value.trim();
          if (!q) { inp.focus(); return; }
          location.href = "search.html?q=" + encodeURIComponent(q);
        };
      }, 180);
      if (window.PBBack && PBBack.open) { backed = true; PBBack.open(function () { backed = false; close(true); }); }
    }
    b.onclick = show;
  }
  window.PBHS = { mount: mount };
})();
