/* PataBook — 💼 "नौकरी खाली है" का नारंगी निशान (design B)
   PBHire.tile(px)  → icon का HTML
   PBHire.top(on)   → ऊपर भाषा वाले button के पास छोटा निशान; दबाने पर नीचे vacancy वाली पट्टी पर ले जाता है */
(function () {
  var css = document.createElement("style");
  css.textContent =
    ".pbh-t{position:relative;flex:none;display:grid;place-items:center;border-radius:28%;background:radial-gradient(circle at 30% 25%,#ffb36b,#e8590c 72%);" +
    "box-shadow:inset -3px -4px 8px rgba(0,0,0,.18),inset 3px 3px 7px rgba(255,255,255,.5),0 8px 14px -7px #e8590c}" +
    ".pbh-t svg{width:52%;height:52%}" +
    ".pbh-t .rb{position:absolute;bottom:-18%;left:50%;transform:translateX(-50%);background:#12141c;color:#ffd21f;font-weight:900;letter-spacing:.05em;border-radius:999px;white-space:nowrap;border:2px solid #fff;line-height:1.25}" +
    ".pbh-top{flex:none;border:0;background:none;padding:0 0 6px;margin:0 2px;cursor:pointer;-webkit-tap-highlight-color:transparent}" +
    ".pbh-top:active .pbh-t{transform:translateY(-2px)}" +
    ".pbh-flash{box-shadow:0 0 0 3px #e8590c!important;transition:box-shadow .3s}" +
    "#vacFlag.pbh{flex-direction:row!important;align-items:center;gap:14px!important;background:#fff!important;border:1.5px solid #ffd2a8!important;border-radius:18px!important;padding:14px 16px 16px!important;color:#12141c!important;box-shadow:0 6px 18px rgba(232,89,12,.10)}" +
    "#vacFlag.pbh .tx{min-width:0}#vacFlag.pbh .tx b{display:block;font-size:16px;color:#12141c}#vacFlag.pbh .tx span{display:block;font-size:13.5px;color:#5b6475;margin-top:3px;line-height:1.4}" +
    "#vacFlag.pbh .tx a{display:inline-block;margin-top:6px;font-size:13px;font-weight:800;color:#1a73e8;text-decoration:none}";
  document.head.appendChild(css);
  var BAG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7.5" width="18" height="12.5" rx="2.2"/><path d="M9 7.5V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2M3 13h18"/></svg>';
  function tile(px) {
    px = px || 64;
    var fs = Math.max(7, Math.round(px * 0.15));
    return '<span class="pbh-t" style="width:' + px + 'px;height:' + px + 'px">' + BAG + '<span class="rb" style="font-size:' + fs + 'px;padding:0 ' + Math.round(fs * 0.7) + 'px">HIRING</span></span>';
  }
  function en() { try { return !!(window.PB && PB.lang && PB.lang() !== "hi"); } catch (e) { return false; } }
  function top(on) {
    var b = document.getElementById("pbhTop"), lang = document.getElementById("pbLang");
    if (!on) { if (b) b.remove(); return; }
    if (!lang || !lang.parentNode) return;
    if (!b) {
      b = document.createElement("button"); b.type = "button"; b.id = "pbhTop"; b.className = "pbh-top";
      b.innerHTML = tile(36);
      b.onclick = function () {
        var v = document.getElementById("vacFlag"); if (!v) return;
        v.scrollIntoView({ behavior: "smooth", block: "center" });
        v.classList.add("pbh-flash"); setTimeout(function () { v.classList.remove("pbh-flash"); }, 1600);
      };
      lang.parentNode.insertBefore(b, lang);
    }
    b.setAttribute("aria-label", en() ? "Hiring — vacancy available" : "नौकरी खाली है");
    b.title = b.getAttribute("aria-label");
  }
  window.PBHire = { tile: tile, top: top };
})();
