/* PataBook Messenger Bot — मुफ़्त FAQ बॉट (कोई server / key नहीं)।
   हर पेज पर बस:  <script src="pb-bot.js" defer></script>  */
(function () {
  if (window.__pbBot) return; window.__pbBot = 1;
  var S = window.PB_SITE || {};
  var MAIL = S.email || 'patabook.in@gmail.com';

  /* सवाल-जवाब: q = बटन का नाम, k = टाइप करने पर पहचानने वाले शब्द, a = जवाब (HTML), */
  var FAQ = [
    { q: '🏪 दुकान कैसे जोड़ें?', k: ['जोड', 'add', 'shop', 'दुकान', 'register', 'list', 'नई'],
      a: 'दुकान जोड़ना <b>मुफ़्त</b> है:<br>1) <a href="list.html">दुकान जोड़ें</a> खोलिए<br>2) मोबाइल नंबर से login कीजिए<br>3) दुकान का नाम, श्रेणी, पता और फ़ोटो भरकर सेव कीजिए<br>बाद में बदलाव <a href="mybusiness.html">मेरी दुकान</a> से करें।' },
    { q: '💎 Silver / Gold / Platinum क्या हैं?', k: ['silver', 'gold', 'platinum', 'plan', 'प्लान', 'member', 'premium', 'सदस्य'],
      a: 'ये PataBook के पैसे वाले <b>Member plan</b> हैं (1 साल के लिए):<br>🥈 Silver — ₹3,000<br>👑 Gold — ₹9,000<br>💎 Platinum — ₹15,000<br>ऊँचा plan = दुकान ज़्यादा प्रमुखता से दिखती है। पूरी शर्तें <a href="terms.html">Terms</a> में हैं। साधारण listing हमेशा मुफ़्त है।' },
    { q: '💰 पैसे वापसी (Refund)', k: ['refund', 'वापस', 'रिफंड', 'पैसे', 'paisa', 'cancel'],
      a: 'पैसे वापसी के नियम <a href="refund.html">Refund Policy</a> में लिखे हैं। कोई खास मामला हो तो नीचे "शिकायत / मदद" से हमें बताइए।' },
    { q: '📍 मेरी दुकान की जानकारी बदलनी है', k: ['बदल', 'edit', 'सुधार', 'update', 'पता', 'फोन', 'फ़ोन', 'number', 'नंबर', 'photo', 'फोटो', 'फ़ोटो'],
      a: 'login करके <a href="mybusiness.html">मेरी दुकान</a> खोलिए। वहाँ नाम, पता, फ़ोन, फ़ोटो, समय वगैरह बदल सकते हैं।' },
    { q: '🔎 दुकान कैसे ढूँढें?', k: ['ढूँढ', 'ढूंढ', 'search', 'खोज', 'find', 'near', 'पास'],
      a: 'होम पेज पर ऊपर <b>search</b> में दुकान या सेवा का नाम लिखिए, या श्रेणी (Category) चुनिए। <a href="map.html">नक्शे</a> पर भी पास की दुकानें दिखती हैं।' },
    { q: '🗑️ अकाउंट / दुकान हटानी है', k: ['delete', 'हटा', 'डिलीट', 'remove', 'बंद'],
      a: 'अकाउंट हटाने का पेज: <a href="delete-account.html">Delete Account</a>। दुकान हटाने में दिक्कत हो तो "शिकायत / मदद" से बताइए।' },
    { q: '✍️ शिकायत / मदद', k: ['शिकायत', 'complaint', 'help', 'मदद', 'problem', 'दिक्कत', 'समस्या', 'contact', 'संपर्क', 'सहायता', 'support'],
      a: 'हम मदद के लिए हैं। <a href="contact.html">Contact पेज</a> पर अपनी बात लिखिए, या email कीजिए: <a href="mailto:' + MAIL + '">' + MAIL + '</a><br>लिखते समय दुकान का नाम और मोबाइल नंबर ज़रूर बताइए।' }
  ];
  var HELLO = 'नमस्ते! 🙏 मैं <b>PataBook Messenger Bot</b> हूँ। नीचे से कोई सवाल चुनिए, या अपना सवाल लिखिए।';
  var NOANS = 'माफ़ कीजिए, इसका जवाब मेरे पास नहीं है। नीचे कोई बटन चुनिए, या <a href="contact.html">Contact पेज</a> / <a href="mailto:' + MAIL + '">' + MAIL + '</a> पर हमें लिखिए।';

  var css = '' +
    '#pbBotFab{position:fixed;right:14px;bottom:16px;z-index:90;display:flex;align-items:center;gap:8px;border:0;cursor:pointer;background:#1a73e8;color:#fff;font:600 14px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:12px 16px 12px 13px;border-radius:999px;box-shadow:0 4px 16px rgba(26,115,232,.45);-webkit-tap-highlight-color:transparent}' +
    '#pbBotFab span.i{font-size:20px;line-height:1}' +
    '#pbBotBox{position:fixed;right:10px;bottom:10px;z-index:91;width:min(380px,calc(100vw - 20px));height:min(560px,calc(100dvh - 20px));background:#fff;border-radius:18px;box-shadow:0 10px 40px rgba(0,0,0,.28);display:none;flex-direction:column;overflow:hidden;font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1f2937}' +
    '#pbBotBox.on{display:flex}' +
    '#pbBotHd{background:#1a73e8;color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px}' +
    '#pbBotHd .av{width:36px;height:36px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:20px}' +
    '#pbBotHd b{display:block;font-size:15px}#pbBotHd small{opacity:.85;font-size:12px}' +
    '#pbBotHd button{margin-left:auto;background:none;border:0;color:#fff;font-size:24px;line-height:1;cursor:pointer;padding:4px 8px}' +
    '#pbBotMsgs{flex:1;overflow-y:auto;padding:12px;background:#f1f4f9;display:flex;flex-direction:column;gap:8px}' +
    '#pbBotMsgs .m{max-width:86%;padding:9px 12px;border-radius:14px;word-wrap:break-word}' +
    '#pbBotMsgs .b{background:#fff;border-bottom-left-radius:4px;align-self:flex-start;box-shadow:0 1px 2px rgba(0,0,0,.08)}' +
    '#pbBotMsgs .u{background:#1a73e8;color:#fff;border-bottom-right-radius:4px;align-self:flex-end}' +
    '#pbBotMsgs a{color:#1a73e8;font-weight:600}' +
    '#pbBotQ{display:flex;flex-wrap:wrap;gap:6px;padding:8px 10px;background:#fff;border-top:1px solid #e5e7eb;max-height:132px;overflow-y:auto}' +
    '#pbBotQ button{border:1px solid #1a73e8;background:#fff;color:#1a73e8;border-radius:999px;padding:7px 11px;font-size:13px;line-height:1.2;font-family:inherit;cursor:pointer}' +
    '#pbBotF{display:flex;gap:8px;padding:8px 10px;background:#fff;border-top:1px solid #e5e7eb}' +
    '#pbBotF input{flex:1;min-width:0;border:1px solid #cbd5e1;border-radius:999px;padding:10px 14px;font-size:15px;line-height:1.2;font-family:inherit;outline:0}' +
    '#pbBotF button{border:0;background:#1a73e8;color:#fff;border-radius:999px;padding:0 16px;font-size:18px;cursor:pointer}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var fab = document.createElement('button');
  fab.id = 'pbBotFab'; fab.type = 'button'; fab.setAttribute('aria-label', 'PataBook Messenger Bot');
  fab.innerHTML = '<span class="i">💬</span><span>PataBook Messenger Bot</span>';
  var box = document.createElement('div');
  box.id = 'pbBotBox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'PataBook Messenger Bot');
  box.innerHTML = '<div id="pbBotHd"><div class="av">📍</div><div><b>PataBook Messenger Bot</b><small>मुफ़्त मदद · तुरंत जवाब</small></div><button type="button" id="pbBotX" aria-label="बंद करें">×</button></div>' +
    '<div id="pbBotMsgs"></div><div id="pbBotQ"></div>' +
    '<form id="pbBotF" autocomplete="off"><input id="pbBotI" type="text" maxlength="200" placeholder="अपना सवाल लिखिए…" aria-label="सवाल"><button type="submit" aria-label="भेजें">➤</button></form>';
  document.body.appendChild(fab); document.body.appendChild(box);

  var msgs = box.querySelector('#pbBotMsgs'), qs = box.querySelector('#pbBotQ'), inp = box.querySelector('#pbBotI'), started = false;
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function add(cls, html) { var d = document.createElement('div'); d.className = 'm ' + cls; d.innerHTML = html; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
  function reply(html) { setTimeout(function () { add('b', html); }, 250); }
  function match(t) {
    t = t.toLowerCase(); var best = null, bs = 0;
    FAQ.forEach(function (f) { var s = 0; f.k.forEach(function (w) { if (t.indexOf(w.toLowerCase()) > -1) s++; }); if (s > bs) { bs = s; best = f; } });
    return best;
  }
  qs.innerHTML = FAQ.map(function (f, i) { return '<button type="button" data-i="' + i + '">' + esc(f.q) + '</button>'; }).join('');
  qs.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var f = FAQ[+b.getAttribute('data-i')]; add('u', esc(f.q)); reply(f.a);
  });
  box.querySelector('#pbBotF').addEventListener('submit', function (e) {
    e.preventDefault(); var t = inp.value.trim(); if (!t) return;
    add('u', esc(t)); inp.value = ''; var f = match(t); reply(f ? f.a : NOANS);
  });
  function open() { box.classList.add('on'); fab.style.display = 'none'; if (!started) { started = true; add('b', HELLO); } }
  function close() { box.classList.remove('on'); fab.style.display = ''; }
  fab.addEventListener('click', open);
  box.querySelector('#pbBotX').addEventListener('click', close);
})();
