/* PataBook — ❤️ Stamp card (sql-54)
   • दुकान का पेज: card चालू हो तो "N stamps = इनाम" का डिब्बा + "मेरा code" (stamps.html)
   • PBStamps.ownerHTML(b, en) — My Shop → ❤️ Stamp card: card बनाना, ग्राहक का code लिखकर / QR scan करके +1 stamp, इनाम देना
   • ग्राहक का नाम / नंबर दुकानदार को कभी नहीं दिखता — सिर्फ़ 6 अक्षर का code */
(function () {
  if (window.PBStamps) return;
  var SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
  function EN() { try { if (window.PB && PB.lang) return PB.lang() !== "hi"; return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function L(e, h) { return EN() ? e : h; }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function post(fn, body, tok) {
    return fetch(SB + "/rest/v1/rpc/" + fn, { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + (tok || KEY), "Content-Type": "application/json" }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.text().then(function (t) { var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {} if (!r.ok) { throw new Error((j && (j.message || j.hint)) || ("HTTP " + r.status)); } return j; }); });
  }
  function call(fn, a) { if (typeof window.rpc === "function") return window.rpc(fn, a); return Promise.reject(new Error("no rpc")); }
  function off(e) { return /404|PGRST202|function/i.test(String(e && e.message)); }
  function dots(n, need) { var s = ""; for (var i = 0; i < need; i++) s += '<span style="display:inline-block;width:22px;height:22px;line-height:22px;text-align:center;border-radius:50%;margin:2px;font-size:13px;' + (i < n ? 'background:#e8590c;color:#fff">❤' : 'border:1.5px dashed #f4a77a;color:#f4a77a">' + (i + 1)) + '</span>'; return s; }
  var css = document.createElement("style");
  css.textContent = ".pbst{border:1.5px solid #ffc9c9;border-radius:16px;background:#fff5f5;padding:14px 16px;margin:16px 0;color:#14161c;font-family:inherit}.pbst h3{margin:0 0 4px;font-size:16px;color:#c92a2a}.pbst p{margin:0;font-size:14px;color:#344054;line-height:1.5}.pbst a{display:inline-block;margin-top:8px;font-weight:700;font-size:14px;color:#c92a2a}" +
    "#pbstScan{position:fixed;inset:0;z-index:9999;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center}#pbstScan video{width:100%;max-width:520px;max-height:70vh;object-fit:cover}#pbstScan p{color:#fff;margin:12px 16px;text-align:center;font-size:15px}#pbstScan button{border:0;border-radius:12px;background:#fff;color:#14161c;font:inherit;font-weight:700;padding:12px 22px;cursor:pointer}";
  document.head.appendChild(css);

  /* ---------- दुकान का पेज ---------- */
  var slug = ""; try { slug = new URLSearchParams(location.search).get("slug") || ""; } catch (e) {}
  if (slug && /\/(shop|business|brand)(\.html)?$/.test(location.pathname)) {
    var C = null, el = null;
    var place = function () {
      if (!C) return; var anchor = document.getElementById("pbRate"); if (!anchor) return;
      var host = anchor.closest(".rate, .card, section") || anchor, of = document.querySelector(".pbof") || document.querySelector(".pbtr");
      var before = of && of.parentNode === host.parentNode ? of : host;
      if (!el || !document.body.contains(el)) { el = document.createElement("div"); el.className = "pbst"; el.setAttribute("data-pbh", "stamps"); before.parentNode.insertBefore(el, before); }
      el.innerHTML = '<h3>❤️ ' + esc(L("Stamp card", "Stamp card")) + '</h3><p>' + esc(L("Get 1 stamp on every purchase. After " + C.need + " stamps: ", "हर ख़रीद पर 1 stamp। " + C.need + " stamps पूरे होने पर: ")) + '<b>' + esc(C.reward) + '</b></p><div style="margin-top:6px">' + dots(0, C.need) + '</div>' +
        '<a href="stamps.html">' + esc(L("Show my PataBook code at the shop ›", "दुकान पर अपना PataBook code दिखाएँ ›")) + '</a>';
    };
    post("pb_stamp_public", { p_slug: slug }).then(function (j) {
      if (!j || !j.need) return; C = j; place();
      var k = 0, mo = new MutationObserver(function () { if (k++ > 300) return mo.disconnect(); if (!el || !document.body.contains(el)) place(); });
      mo.observe(document.body, { childList: true, subtree: true }); setTimeout(function () { mo.disconnect(); }, 20000);
      try { if (window.PB && PB.onChange) PB.onChange(function () { setTimeout(place, 50); }); } catch (e) {}
    }).catch(function () {});
  }

  /* ---------- दुकानदार: My Shop → ❤️ Stamp card ---------- */
  var CARD = {};
  function box(s) { var a = document.querySelectorAll(".pbsto"); for (var i = 0; i < a.length; i++) if (a[i].getAttribute("data-stslug") === s) return a[i]; return null; }
  var inp = "font:inherit;font-size:15px;padding:10px;border:1px solid #d0d5dd;border-radius:10px";
  var btn = "border:0;border-radius:12px;font:inherit;font-weight:700;font-size:15px;padding:12px 14px;cursor:pointer";
  function ownerHTML(b, en) {
    setTimeout(function () { load(b.slug); }, 0);
    return '<div class="pbsto" data-stslug="' + esc(b.slug) + '"><p style="margin:0 0 10px;color:#5b6475;font-size:14px;line-height:1.5">' +
      esc(en ? "Give customers 1 stamp on every purchase. When the stamps are complete, give them your reward. The customer shows their PataBook code (or QR) — you never see their name or number." : "हर ख़रीद पर ग्राहक को 1 stamp दें। stamps पूरे होने पर अपना इनाम दें। ग्राहक अपना PataBook code (या QR) दिखाता है — उसका नाम या नंबर आपको नहीं दिखता।") +
      '</p><div data-stbody><p style="color:#5b6475">…</p></div></div>';
  }
  function draw(s) {
    var el = box(s); if (!el) return; var en = EN(), d = CARD[s] || {}, c = d.card;
    var opts = ""; for (var i = 3; i <= 20; i++) opts += '<option value="' + i + '"' + ((c ? c.need : 5) === i ? " selected" : "") + '>' + i + '</option>';
    var give = c && c.active ? '<div style="border:1.5px solid #ffc9c9;background:#fff5f5;border-radius:14px;padding:12px;margin-bottom:12px"><b style="display:block;margin-bottom:8px">' + esc(en ? "➕ Give a stamp" : "➕ Stamp दें") + '</b>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><input data-stcode maxlength="6" autocapitalize="characters" autocomplete="off" placeholder="' + esc(en ? "Customer code (6 letters)" : "ग्राहक का code (6 अक्षर)") + '" style="' + inp + ';flex:1;min-width:150px;text-transform:uppercase;letter-spacing:2px">' +
      ('BarcodeDetector' in window && navigator.mediaDevices ? '<button type="button" data-stscan style="' + btn + ';background:#fff;border:1px solid #d0d5dd;color:#14161c">📷 ' + esc(en ? "Scan QR" : "QR scan") + '</button>' : '') + '</div>' +
      '<button type="button" data-stadd style="' + btn + ';width:100%;margin-top:8px;background:#e8590c;color:#fff">❤️ ' + esc(en ? "+1 Stamp" : "+1 Stamp दें") + '</button><div data-stres style="margin-top:8px;font-size:14px;min-height:20px"></div></div>' : '';
    el.querySelector("[data-stbody]").innerHTML = give +
      (d.customers != null ? '<p style="font-size:13px;color:#5b6475;margin:0 0 10px">' + esc(en ? d.customers + " customers · " + d.stamps + " stamps given · " + d.rewards + " rewards given" : d.customers + " ग्राहक · " + d.stamps + " stamps दिए · " + d.rewards + " इनाम दिए") + '</p>' : '') +
      '<div style="border:1px solid #e3e8f2;border-radius:14px;padding:12px"><b style="display:block;margin-bottom:8px">' + esc(c ? (en ? "⚙️ Card settings" : "⚙️ Card की सेटिंग") : (en ? "➕ Start a stamp card" : "➕ Stamp card शुरू करें")) + '</b>' +
      '<label style="display:flex;align-items:center;gap:8px;font-size:14px;margin-bottom:8px">' + esc(en ? "Stamps needed" : "कितने stamps पर इनाम") + ' <select data-stneed style="' + inp + ';padding:8px">' + opts + '</select></label>' +
      '<input data-strew maxlength="80" value="' + esc(c ? c.reward : "") + '" placeholder="' + esc(en ? "Reward (e.g. 1 car shampoo free)" : "इनाम (जैसे 1 कार शैम्पू मुफ़्त)") + '" style="' + inp + ';width:100%;box-sizing:border-box">' +
      '<label style="display:flex;align-items:center;gap:8px;font-size:14px;margin:8px 0"><input type="checkbox" data-stact' + (!c || c.active ? " checked" : "") + '> ' + esc(en ? "Card is on (shows on your shop page)" : "Card चालू है (दुकान के पेज पर दिखेगा)") + '</label>' +
      '<button type="button" data-stsave style="' + btn + ';width:100%;background:#f08c00;color:#fff">' + esc(en ? "Save card" : "Card सेव करें") + '</button><div data-stmsg style="margin-top:8px;font-size:14px;min-height:20px"></div></div>';
  }
  function load(s) {
    call("pb_stamp_card_get", { p_slug: s }).then(function (j) { CARD[s] = j || {}; draw(s); }).catch(function (e) {
      var el = box(s); if (!el) return;
      el.querySelector("[data-stbody]").innerHTML = '<p style="color:#b42318;font-size:14px">' + esc(off(e) ? L("This feature is being switched on. Please try again later.", "यह सुविधा अभी चालू हो रही है। थोड़ी देर बाद फिर कोशिश करें।") : L("Could not load.", "नहीं खुल पाया।")) + '</p>';
    });
  }
  function result(el, s, j, code) {
    var r = el.querySelector("[data-stres]"), en = EN();
    r.style.color = "#14161c";
    r.innerHTML = '<b>' + esc(code) + '</b>: ' + esc(en ? j.stamps + " / " + j.need + " stamps" : j.stamps + " / " + j.need + " stamps") + '<div>' + dots(Math.min(j.stamps, j.need), j.need) + '</div>' +
      (j.ready ? '<p style="margin:6px 0;color:#067647;font-weight:700">🎉 ' + esc(en ? "Reward is ready! Give the reward, then tap below." : "इनाम तैयार है! इनाम देकर नीचे दबाएँ।") + '</p><button type="button" data-stred="' + esc(code) + '" style="' + btn + ';background:#067647;color:#fff">🎁 ' + esc(en ? "Reward given" : "इनाम दे दिया") + '</button>' : '');
  }
  function err(m) {
    m = String(m);
    return /bad code/.test(m) ? L("Wrong code. Check it with the customer.", "गलत code। ग्राहक से फिर देखें।") : /own code/.test(m) ? L("You cannot give a stamp to yourself.", "खुद को stamp नहीं दे सकते।") :
      /too soon/.test(m) ? L("A stamp was given to this customer just now. Try after 10 minutes.", "इस ग्राहक को अभी stamp दिया था। 10 मिनट बाद दें।") : /no card/.test(m) ? L("Turn the card on first.", "पहले card चालू करें।") :
      /not enough/.test(m) ? L("Not enough stamps yet.", "अभी stamps पूरे नहीं हैं।") : /rate/.test(m) ? L("Too many today. Try tomorrow.", "आज बहुत हो गए। कल कोशिश करें।") : L("Could not save. Please try again.", "नहीं हो पाया। फिर कोशिश करें।");
  }
  function give(el, s, code, redeem, t) {
    var r = el.querySelector("[data-stres]");
    if (!/^[A-Z2-9]{6}$/.test(code)) { r.style.color = "#b42318"; r.textContent = L("Enter the 6-letter code.", "6 अक्षर का code लिखें।"); return; }
    if (t) t.disabled = true; r.style.color = "#5b6475"; r.textContent = L("Saving…", "सेव हो रहा है…");
    call("pb_stamp_add", { p_slug: s, p_code: code, p_redeem: !!redeem }).then(function (j) {
      result(el, s, j, code); if (redeem) { var p = document.createElement("p"); p.style.cssText = "margin:6px 0 0;color:#067647;font-weight:700"; p.textContent = "✅ " + L("Reward recorded.", "इनाम दर्ज हो गया।"); r.appendChild(p); }
      el.querySelector("[data-stcode]").value = ""; call("pb_stamp_card_get", { p_slug: s }).then(function (d) { CARD[s] = d || {}; var x = el.querySelector("[data-stbody] > p"); if (x && d) x.textContent = L(d.customers + " customers · " + d.stamps + " stamps given · " + d.rewards + " rewards given", d.customers + " ग्राहक · " + d.stamps + " stamps दिए · " + d.rewards + " इनाम दिए"); }).catch(function () {});
    }).catch(function (e) { r.style.color = "#b42318"; r.textContent = err(e && e.message); }).then(function () { if (t) t.disabled = false; });
  }

  /* 📷 QR scan (BarcodeDetector) — फ़ोन का Back बटन बंद करता है */
  var SCAN = null;
  function scanClose(fromPop) {
    if (!SCAN) return; var x = SCAN; SCAN = null;
    try { x.stream.getTracks().forEach(function (t) { t.stop(); }); } catch (e) {}
    clearInterval(x.timer); x.ov.remove();
    if (!fromPop && history.state && history.state.pbstScan) history.back();
  }
  window.addEventListener("popstate", function () { if (SCAN) scanClose(true); });
  function scan(el, s) {
    var det; try { det = new BarcodeDetector({ formats: ["qr_code"] }); } catch (e) { return; }
    var ov = document.createElement("div"); ov.id = "pbstScan";
    ov.innerHTML = '<video playsinline muted></video><p>' + esc(L("Point the camera at the customer's PataBook QR", "ग्राहक के PataBook QR पर camera रखें")) + '</p><button type="button">' + esc(L("Close", "बंद करें")) + '</button>';
    document.body.appendChild(ov);
    var v = ov.querySelector("video");
    SCAN = { ov: ov, stream: null, timer: 0 };
    try { history.pushState({ pbstScan: 1 }, ""); } catch (e) {}
    ov.querySelector("button").onclick = function () { scanClose(false); };
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function (st) {
      if (!SCAN) { st.getTracks().forEach(function (t) { t.stop(); }); return; }
      SCAN.stream = st; v.srcObject = st; v.play();
      SCAN.timer = setInterval(function () {
        det.detect(v).then(function (a) {
          var raw = a && a[0] && a[0].rawValue || "", m = /PBSTAMP:([A-Z2-9]{6})/.exec(raw); if (!m || !SCAN) return;
          scanClose(false); el.querySelector("[data-stcode]").value = m[1]; give(el, s, m[1], false, null);
        }).catch(function () {});
      }, 350);
    }).catch(function () { ov.querySelector("p").textContent = L("Camera permission is needed. You can also type the code.", "Camera की अनुमति चाहिए। आप code लिखकर भी दे सकते हैं।"); });
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-stsave],[data-stadd],[data-stred],[data-stscan]"); if (!t) return;
    var el = t.closest(".pbsto"); if (!el) return; var s = el.getAttribute("data-stslug");
    if (t.hasAttribute("data-stscan")) return scan(el, s);
    if (t.hasAttribute("data-stadd")) return give(el, s, el.querySelector("[data-stcode]").value.trim().toUpperCase(), false, t);
    if (t.hasAttribute("data-stred")) {
      if (t.dataset.armed !== "1") { t.dataset.armed = "1"; t.textContent = L("Tap again to confirm", "पक्का करने के लिए फिर दबाएँ"); return; }
      return give(el, s, t.dataset.stred, true, t);
    }
    var m = el.querySelector("[data-stmsg]"), rew = el.querySelector("[data-strew]").value.trim();
    if (rew.length < 3) { m.style.color = "#b42318"; m.textContent = L("Write the reward (at least 3 letters).", "इनाम लिखें (कम से कम 3 अक्षर)।"); return; }
    t.disabled = true; m.style.color = "#5b6475"; m.textContent = L("Saving…", "सेव हो रहा है…");
    call("pb_stamp_card_set", { p_slug: s, p_need: +el.querySelector("[data-stneed]").value, p_reward: rew, p_active: el.querySelector("[data-stact]").checked })
      .then(function () { load(s); setTimeout(function () { var mm = box(s) && box(s).querySelector("[data-stmsg]"); if (mm) { mm.style.color = "#1e8e3e"; mm.textContent = "✅ " + L("Saved.", "सेव हो गया।"); } }, 400); })
      .catch(function (er) { t.disabled = false; m.style.color = "#b42318"; m.textContent = /rate/.test(String(er && er.message)) ? L("Too many changes today. Try tomorrow.", "आज बहुत बार बदला। कल कोशिश करें।") : L("Could not save. Please try again.", "सेव नहीं हो पाया। फिर कोशिश करें।"); });
  });
  document.addEventListener("input", function (e) { if (e.target.matches && e.target.matches("[data-stcode]")) e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""); });

  window.PBStamps = { ownerHTML: ownerHTML, post: post, dots: dots };
})();
