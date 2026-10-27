/* PataBook — नीचे हिलने वाला "Add Your Business" बटन (दुकान जोड़ने के पेज पर ले जाता है)।
   हर पेज पर:  <script src="pb-addbtn.js" defer></script>  */
(function () {
  if (window.__pbAdd) return; window.__pbAdd = 1;
  var css = '' +
    '#pbAddFab{position:fixed;right:14px;bottom:16px;z-index:90;display:flex;align-items:center;gap:8px;text-decoration:none;color:#1b1b1b;background:linear-gradient(135deg,#ffcb2e,#ff9f1a);font:800 15px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:13px 18px 13px 14px;border-radius:999px;box-shadow:0 4px 16px rgba(255,159,26,.55);-webkit-tap-highlight-color:transparent;animation:pbBuzz 4s ease-in-out infinite}' +
    '#pbAddFab i{font-style:normal;font-size:20px;line-height:1}' +
    '#pbAddFab::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:0 0 0 0 rgba(255,159,26,.6);animation:pbRing 2s ease-out infinite;pointer-events:none}' +
    '@keyframes pbBuzz{0%,72%,100%{transform:translateX(0) rotate(0)}74%{transform:translateX(-4px) rotate(-3deg)}78%{transform:translateX(4px) rotate(3deg)}82%{transform:translateX(-4px) rotate(-3deg)}86%{transform:translateX(4px) rotate(3deg)}90%{transform:translateX(-2px) rotate(-1deg)}94%{transform:translateX(2px) rotate(1deg)}}' +
    '@keyframes pbRing{0%{box-shadow:0 0 0 0 rgba(255,159,26,.55)}80%,100%{box-shadow:0 0 0 14px rgba(255,159,26,0)}}' +
    '@media (prefers-reduced-motion:reduce){#pbAddFab,#pbAddFab::after{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var a = document.createElement('a');
  a.id = 'pbAddFab'; a.href = 'list.html'; a.setAttribute('aria-label', 'Add Your Business');
  a.innerHTML = '<i>➕</i><span id="pbAddTx">Add Your Business</span>';
  function lab() { try { if (window.PB && PB.t) { var v = PB.t('addbiz'); if (v && v !== 'addbiz') { document.getElementById('pbAddTx').textContent = v; a.setAttribute('aria-label', v); } } } catch (e) {} }
  a.addEventListener('click', function () { try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) {} });
  document.body.appendChild(a);
  lab(); if (window.PB && PB.onChange) PB.onChange(lab);
})();
