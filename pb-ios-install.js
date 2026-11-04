/* 📲 iPhone / iPad: PataBook को app की तरह लगाएँ (PWA) — Safari / Chrome में "Share ⬆️ → Add to Home Screen" के चित्र वाले कदम।
   सिर्फ़ iPhone/iPad पर, तब जब PataBook पहले से Home Screen से नहीं खुला। ऊपर की "इंस्टॉल करें" पट्टी के बटन से खुलता है। */
(function () {
  var ua = navigator.userAgent || "";
  var IOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!IOS) return;
  /* iPhone Safari "user-scalable=no" नहीं मानता: दो उँगली से zoom रोको (PC पर असर नहीं) */
  ["gesturestart", "gesturechange"].forEach(function (ev) { document.addEventListener(ev, function (e) { e.preventDefault(); }, { passive: false }); });
  var standalone = window.navigator.standalone === true || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
  if (standalone) return;
  if (/FBAN|FBAV|Instagram|Line\//.test(ua)) return;   /* Facebook/Instagram के अंदर वाले browser में यह काम नहीं करता */
  var K = "pb-ios-install";
  function get() { try { return +localStorage.getItem(K) || 0; } catch (e) { return 0; } }
  function set(v) { try { localStorage.setItem(K, String(v)); } catch (e) {} }
  var en = true; try { en = (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) {}
  var T = function (hi, e) { return en ? e : hi; };
  var chrome = /CriOS/.test(ua);
  var shareIc = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="vertical-align:-4px"><path fill="none" stroke="#1a73e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 15V3m0 0L8 7m4-4 4 4M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/></svg>';
  var addIc = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="vertical-align:-4px"><rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="#1a73e8" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="#1a73e8" stroke-width="2" stroke-linecap="round"/></svg>';
  function show() {
    if (document.getElementById("pbIos")) return;
    var st = document.createElement("style");
    st.textContent = "#pbIos{position:fixed;inset:0;z-index:100001;background:rgba(10,20,40,.5);display:flex;align-items:flex-end;justify-content:center;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
      "#pbIos .bx{background:#fff;width:100%;max-width:440px;border-radius:22px 22px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom));box-shadow:0 -8px 30px rgba(0,0,0,.2);animation:pbIosUp .25s ease}" +
      "@keyframes pbIosUp{from{transform:translateY(60px);opacity:.3}to{transform:none;opacity:1}}" +
      "#pbIos .hd{display:flex;align-items:center;gap:12px}#pbIos .hd img{width:52px;height:52px;border-radius:13px;box-shadow:0 2px 8px rgba(0,0,0,.15)}" +
      "#pbIos .hd b{display:block;font-size:17px;color:#0b2f73}#pbIos .hd small{display:block;font-size:13px;color:#5b6475;margin-top:2px}" +
      "#pbIos ol{margin:14px 0 0;padding:0;list-style:none;counter-reset:s}#pbIos li{counter-increment:s;display:flex;align-items:center;gap:10px;font-size:15px;color:#12141c;padding:9px 0;border-top:1px solid #eef1f6}" +
      "#pbIos li:before{content:counter(s);flex:none;width:24px;height:24px;border-radius:50%;background:#e8f0fe;color:#1a73e8;font-weight:800;font-size:13px;display:grid;place-items:center}" +
      "#pbIos .bt{display:flex;gap:8px;margin-top:14px}#pbIos .bt button{flex:1;border:0;border-radius:12px;padding:12px;font:inherit;font-weight:800;cursor:pointer}" +
      "#pbIos .ok{background:#1a73e8;color:#fff}#pbIos .no{background:#eef1f6;color:#12141c}" +
      "#pbIos .ar{text-align:center;color:#1a73e8;font-size:24px;margin-top:6px;animation:pbIosB 1.2s ease-in-out infinite}@keyframes pbIosB{50%{transform:translateY(6px)}}";
    document.head.appendChild(st);
    var ov = document.createElement("div"); ov.id = "pbIos";
    ov.innerHTML = '<div class="bx" role="dialog" aria-modal="true" aria-label="' + T("PataBook app लगाएँ", "Install PataBook app") + '">' +
      '<div class="hd"><img src="apple-touch-icon.png" alt=""><div><b>' + T("PataBook को app की तरह लगाएँ", "Add PataBook as an app") + '</b><small>' + T("मुफ़्त · App Store की ज़रूरत नहीं · फ़ोन पर icon आ जाएगा", "Free · no App Store needed · an icon on your phone") + '</small></div></div>' +
      '<ol><li><span>' + (chrome ? T("ऊपर दाईं तरफ़ ", "Tap ") + shareIc + T(" (Share) दबाएँ", " (Share) at the top right") : T("नीचे ", "Tap ") + shareIc + T(" (Share) बटन दबाएँ", " (Share) at the bottom")) + '</span></li>' +
      '<li><span>' + T("नीचे खिसकाकर ", "Scroll down and tap ") + addIc + ' <b>' + T("\"Add to Home Screen\"", "\"Add to Home Screen\"") + '</b>' + T(" दबाएँ", "") + '</span></li>' +
      '<li><span>' + T("ऊपर दाईं तरफ़ ", "Tap ") + '<b>Add</b>' + T(" दबाएँ — हो गया!", " at the top right — done!") + '</span></li></ol>' +
      (chrome ? '' : '<div class="ar" aria-hidden="true">⬇</div>') +
      '<div class="bt"><button type="button" class="no" data-later>' + T("बाद में", "Later") + '</button><button type="button" class="ok" data-ok>' + T("ठीक है", "Got it") + '</button></div></div>';
    document.body.appendChild(ov);
    var gone = false;
    function kill() { if (gone) return; gone = true; ov.remove(); }
    function close(days) { set(Date.now() + days * 864e5); if (window.PBBack && PBBack.isOpen && PBBack.isOpen()) PBBack.close(); else kill(); }
    if (window.PBBack && PBBack.open) PBBack.open(function () { set(Date.now() + 7 * 864e5); kill(); }, ov);
    ov.addEventListener("click", function (e) {
      if (e.target.closest("[data-ok]")) return close(30);
      if (e.target.closest("[data-later]") || e.target === ov) return close(7);
    });
  }
  /* ऊपर की "PataBook App — इंस्टॉल करें" पट्टी का बटन iPhone पर यही चित्र वाला तरीका खोलता है (i18n.js) */
  window.PBIosInstall = { show: show };
})();
