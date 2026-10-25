/* PataBook — ✏️ अपनी दुकान का page वहीं से बदलना (सिर्फ़ login हुए मालिक को, सिर्फ़ उसकी अपनी दुकान पर)
   PBEdit.start({slug, row, page:"shop"|"biz"})   — row = pb_my_businesses की पंक्ति
   Logo · Products · Photos · जानकारी · नंबर · Vacancy — सब My Shop वाले नियमों (RPC) से */
(function () {
  var SBU = "https://kkvbpzysktozghnxplxv.supabase.co", PK = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
  var O = null, ON = false;
  function en() { try { return localStorage.getItem("pb-lang") === "en"; } catch (e) { return false; } }
  function T(h, e) { return en() ? e : h; }
  function E(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  async function rpc(fn, args) {
    var s = await PBA.session(); if (!s) throw new Error("login");
    var r = await fetch(SBU + "/rest/v1/rpc/" + fn, { method: "POST", headers: { apikey: PK, Authorization: "Bearer " + s.access_token, "Content-Type": "application/json" }, body: JSON.stringify(args || {}) });
    var j = null; try { j = await r.json(); } catch (e) {}
    if (!r.ok) { var er = new Error((j && (j.message || j.msg)) || ("HTTP " + r.status)); er.status = r.status; throw er; }
    return j;
  }
  function desc() { try { return (typeof B !== "undefined" && B && B.description) || ""; } catch (e) { return ""; } }
  function ln(k) { var m = desc().match(new RegExp("^" + k + ":\\s*(.+)$", "mi")); return m ? m[1].trim() : ""; }
  function prem() { try { return typeof PREM !== "undefined" && !!PREM; } catch (e) { return false; } }
  function squareImage(file){
  return new Promise((res,rej)=>{
    const img=new Image(),url=URL.createObjectURL(file);
    img.onload=()=>{
      const S=320,c=document.createElement("canvas");c.width=S;c.height=S;
      const x=c.getContext("2d"),m=Math.min(img.width,img.height);
      x.fillStyle="#fff";x.fillRect(0,0,S,S);
      x.drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,S,S);
      URL.revokeObjectURL(url);
      c.toBlob(bl=>{
        if(bl&&bl.type==="image/webp")return res(bl);
        c.toBlob(b2=>b2?res(b2):rej(new Error("img")),"image/jpeg",0.85);
      },"image/webp",0.85);
    };
    img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error("img"));};
    img.src=url;
  });
}

  function resizeImage(file,maxSide){return new Promise((res,rej)=>{const img=new Image(),url=URL.createObjectURL(file);
  img.onload=()=>{const k=Math.min(1,maxSide/Math.max(img.width,img.height)),c=document.createElement("canvas");c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);
    const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);
    /* 📉 हर फ़ोटो छोटी करो (WebP, ~150 KB तक) ताकि ज़्यादा फ़ोटो रखी जा सकें और page जल्दी खुले */
    const tryQ=q=>c.toBlob(bl=>{if(bl&&bl.size<150000)return res(bl);if(q>0.4)return tryQ(Math.round((q-0.1)*100)/100);bl?res(bl):rej(new Error("img"));},"image/webp",q);tryQ(0.78);};
  img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error("img"));};img.src=url;});}

  /* ---------- रूप ---------- */
  var css = document.createElement("style");
  css.textContent =
    ".pbe-btn{flex:none;display:inline-flex;align-items:center;gap:5px;border:0;border-radius:999px;padding:8px 13px;font:inherit;font-size:13.5px;font-weight:800;background:linear-gradient(135deg,#ffd21f,#f5b400);color:#12141c;cursor:pointer;box-shadow:0 2px 8px rgba(245,180,0,.35)}" +
    ".pbe-on .pbe-btn{background:#12141c;color:#fff;box-shadow:none}" +
    ".pbe-pen{position:absolute;top:8px;right:8px;z-index:6;width:38px;height:38px;border-radius:50%;border:2px solid #fff;background:#ffd21f;font-size:17px;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.25);display:none}" +
    ".pbe-on .pbe-pen{display:grid;place-items:center}" +
    ".pbe-on .pbe-t{outline:2px dashed #f5b400;outline-offset:3px;border-radius:16px}" +
    ".pbe-bar{position:fixed;left:0;right:0;bottom:0;z-index:9000;background:#12141c;color:#fff;padding:10px 10px calc(10px + env(safe-area-inset-bottom));display:none;box-shadow:0 -6px 20px rgba(0,0,0,.25)}" +
    ".pbe-on .pbe-bar{display:block}.pbe-on .dock{display:none!important}" +
    ".pbe-bar .h{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;margin:0 4px 8px}.pbe-bar .h b{flex:1}.pbe-bar .h button{border:0;border-radius:999px;padding:7px 13px;font:inherit;font-weight:800;background:#1e9e57;color:#fff;cursor:pointer}" +
    ".pbe-bar .g{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}.pbe-bar .g::-webkit-scrollbar{display:none}" +
    ".pbe-bar .g button{flex:none;border:1px solid #3a3f4d;background:#1f2330;color:#fff;border-radius:12px;padding:8px 11px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}" +
    ".pbe-on{padding-bottom:120px!important}" +
    ".pbe-sc{position:fixed;inset:0;z-index:9500;background:rgba(10,20,40,.55);display:flex;align-items:flex-end;justify-content:center}" +
    ".pbe-sh{position:relative;width:100%;max-width:640px;max-height:92vh;display:flex;flex-direction:column;background:#fff;border-radius:22px 22px 0 0;overflow:hidden}" +
    "@media(min-width:640px){.pbe-sc{align-items:center}.pbe-sh{border-radius:22px}}" +
    ".pbe-hd{display:flex;align-items:center;gap:10px;padding:14px 16px 10px;border-bottom:1px solid #eef1f6}.pbe-hd b{flex:1;font-size:16.5px;color:#123568}.pbe-hd button{width:36px;height:36px;border-radius:50%;border:0;background:#f1f4f9;font-size:15px;cursor:pointer}" +
    ".pbe-bd{overflow:auto;padding:14px 16px calc(18px + env(safe-area-inset-bottom));font-size:14.5px;line-height:1.5}" +
    ".pbe-fr{width:100%;height:78vh;border:0;display:block}" +
    ".pbe-row{display:flex;align-items:center;gap:12px;border:1px solid #e4eaf5;border-radius:14px;padding:12px;margin-bottom:10px}.pbe-row .t{flex:1;min-width:0}.pbe-row small{display:block;color:#5b6475;font-size:12.5px}" +
    ".pbe-sw{flex:none;width:52px;height:30px;border-radius:999px;border:0;background:#c9ced8;position:relative;cursor:pointer}.pbe-sw i{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:left .2s}.pbe-sw.on{background:#1e9e57}.pbe-sw.on i{left:25px}" +
    ".pbe-b{display:block;width:100%;border:0;border-radius:14px;padding:13px;font:inherit;font-weight:800;font-size:15px;cursor:pointer;margin-top:8px;text-align:center}.pbe-b.p{background:#1a73e8;color:#fff}.pbe-b.s{background:#f1f4f9;color:#12141c}.pbe-b.d{background:#fdecea;color:#c5221f}" +
    ".pbe-in{width:100%;box-sizing:border-box;padding:12px;border:1.5px solid #cfd8ea;border-radius:12px;font:inherit;font-size:17px;margin-top:8px}.pbe-sm{border:1px solid #cfd8ea;background:#f4f8ff;color:#123568;border-radius:10px;padding:8px 11px;font:inherit;font-size:13px;font-weight:800;cursor:pointer}" +
    ".pbe-note{background:#fff7e6;border:1px solid #ffd591;color:#874d00;border-radius:12px;padding:10px 12px;font-size:13px;margin:6px 0 10px}" +
    ".pbe-er{color:#c5221f;font-size:13px;font-weight:700;min-height:18px;margin-top:8px}" +
    ".pbe-pg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.pbe-pg .t{position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;background:#eef3fd}.pbe-pg img{width:100%;height:100%;object-fit:cover}.pbe-pg .t button{position:absolute;top:5px;right:5px;width:28px;height:28px;border-radius:50%;border:0;background:rgba(197,34,31,.92);color:#fff;cursor:pointer}" +
    ".pbe-pg label{aspect-ratio:1;border-radius:12px;border:2px dashed #9fc0f5;background:#f4f8ff;display:grid;place-items:center;font-size:30px;color:#1a73e8;cursor:pointer}";
  document.head.appendChild(css);

  /* ---------- sheet ---------- */
  function sheet(title, html, onClose) {
    var sc = document.createElement("div"); sc.className = "pbe-sc";
    sc.innerHTML = '<div class="pbe-sh"><div class="pbe-hd"><b>' + title + '</b><button type="button" aria-label="Close">✕</button></div><div class="pbe-bd">' + html + '</div></div>';
    function close() { sc.remove(); window.removeEventListener("message", onMsg); if (onClose) onClose(); }
    function onMsg(e) { if (e.origin === location.origin && e.data && e.data.pbEdit === "saved") { sc.remove(); window.removeEventListener("message", onMsg); location.reload(); } }
    window.addEventListener("message", onMsg);
    sc.querySelector(".pbe-hd button").onclick = close;
    sc.addEventListener("click", function (e) { if (e.target === sc) close(); });
    document.body.appendChild(sc);
    return { el: sc, body: sc.querySelector(".pbe-bd"), close: close };
  }
  function frame(title, src, reloadOnClose) {
    var s = sheet(title, '<iframe class="pbe-fr" src="' + E(src) + '"></iframe>', reloadOnClose ? function () { location.reload(); } : null);
    s.body.style.padding = "0"; return s;
  }

  /* ---------- काम ---------- */
  function editDetails(focus, sec) {
    var tt = sec === "about" ? "🏪 " + T("हमारे बारे में — बदलें", "About us — edit") : sec === "visit" ? "📍 " + T("पता और नक्शा — बदलें", "Address & map — edit") : "🏪 " + T("जानकारी बदलें", "Edit details");
    frame(tt, "edit.html?slug=" + encodeURIComponent(O.slug) + "&embed=1" + (focus ? "&focus=" + focus : "") + (sec ? "&sec=" + sec : ""), false);
  }
  function editProducts() { frame("🛍️ " + T("Products बदलें", "Edit products"), "myproducts.html?slug=" + encodeURIComponent(O.slug), true); }

  function pickFile(cb) { var i = document.createElement("input"); i.type = "file"; i.accept = "image/*"; i.onchange = function () { if (i.files && i.files[0]) cb(i.files[0]); }; i.click(); }
  async function upload(blob, name) {
    var s = await PBA.session(), ext = blob.type === "image/webp" ? "webp" : "jpg", path = encodeURIComponent(O.slug) + "/" + name + "-" + Date.now() + "." + ext;
    var up = await fetch(SBU + "/storage/v1/object/shop-logos/" + path, { method: "POST", headers: { apikey: PK, Authorization: "Bearer " + s.access_token, "Content-Type": blob.type, "x-upsert": "false" }, body: blob });
    if (!up.ok) throw new Error("upload");
    return SBU + "/storage/v1/object/public/shop-logos/" + path;
  }
  function editLogo() {
    var has = false; try { has = !!(typeof B !== "undefined" && B && /shop-logos\//.test(B.logo_url || "")); } catch (e) {}
    var s = sheet("🖼️ " + T("Logo", "Logo"), '<p style="color:#5b6475;font-size:13.5px">' + T("चौकोर (square) फ़ोटो सबसे अच्छी लगती है।", "A square photo works best.") + '</p>' +
      '<button type="button" class="pbe-b p" id="pbeLc">📷 ' + (has ? T("Logo बदलें", "Change logo") : T("Logo लगाएँ", "Add logo")) + '</button>' +
      (has ? '<button type="button" class="pbe-b d" id="pbeLr">🗑️ ' + T("Logo हटाएँ", "Remove logo") + '</button>' : '') + '<div class="pbe-er" id="pbeLe"></div>');
    var er = s.body.querySelector("#pbeLe");
    s.body.querySelector("#pbeLc").onclick = function () {
      pickFile(async function (f) {
        try {
          er.style.color = "#5b6475"; er.textContent = "🔍 " + T("AI फ़ोटो जांच रहा है…", "AI is checking the photo…");
          var ck = window.PBImg ? await PBImg.check(f, { slug: O.slug, kind: "logo" }) : { ok: true };
          if (!ck.ok) { er.style.color = ""; er.textContent = ck.msg; return; }
          er.textContent = T("Upload हो रहा है…", "Uploading…");
          var url = await upload(await squareImage(f), "logo");
          await rpc("pb_set_logo", { p_slug: O.slug, p_url: url }); location.reload();
        } catch (x) { er.style.color = ""; er.textContent = T("Logo नहीं लग सका, फिर कोशिश करें।", "Could not set the logo. Try again."); }
      });
    };
    var rm = s.body.querySelector("#pbeLr");
    if (rm) rm.onclick = async function () { if (!confirm(T("Logo हटाएँ?", "Remove the logo?"))) return; try { await rpc("pb_set_logo", { p_slug: O.slug, p_url: null }); location.reload(); } catch (x) { er.textContent = T("नहीं हुआ, फिर कोशिश करें।", "Failed. Try again."); } };
  }
  async function editPhotos() {
    var s = sheet("📷 " + T("दुकान की फ़ोटो", "Shop photos"), '<p style="color:#5b6475">…</p>', function () { if (s.changed) location.reload(); });
    async function paint() {
      var L = [];
      try { L = await rpc("pb_my_photos", { p_slug: O.slug }) || []; } catch (x) { s.body.innerHTML = '<p class="pbe-note">' + (/premium/i.test(x.message) ? T("फ़ोटो सिर्फ़ Premium दुकानों के लिए हैं।", "Photos are for Premium shops.") : T("खुल नहीं सका।", "Could not load.")) + '</p>'; return; }
      s.body.innerHTML = '<div class="pbe-pg">' + L.map(function (x) { return '<div class="t"><img src="' + E(x.url) + '" alt="" loading="lazy"><button type="button" data-rm="' + x.id + '" aria-label="Remove">✕</button></div>'; }).join("") +
        (L.length < 8 ? '<label>＋<input type="file" accept="image/*" hidden id="pbePf"></label>' : '') + '</div><small style="display:block;color:#5b6475;margin-top:8px">' + L.length + ' / 8 ' + T("फ़ोटो", "photos") + '</small><div class="pbe-er" id="pbePe"></div>';
      var inp = s.body.querySelector("#pbePf"), er = s.body.querySelector("#pbePe");
      if (inp) inp.onchange = async function () {
        var f = inp.files && inp.files[0]; if (!f) return;
        try {
          er.style.color = "#5b6475"; er.textContent = "🔍 " + T("AI फ़ोटो जांच रहा है…", "AI is checking the photo…");
          var ck = window.PBImg ? await PBImg.check(f, { slug: O.slug, kind: "shop" }) : { ok: true };
          if (!ck.ok) { er.style.color = ""; er.textContent = ck.msg; return; }
          er.textContent = T("Upload हो रहा है…", "Uploading…");
          var url = await upload(await resizeImage(f, 1000), "photo");
          await rpc("pb_photo_add", { p_slug: O.slug, p_url: url }); s.changed = true; paint();
        } catch (x) { er.style.color = ""; er.textContent = /too many/.test(x.message || "") ? T("8 से ज़्यादा फ़ोटो नहीं।", "Max 8 photos.") : T("फ़ोटो upload नहीं हुई।", "Could not upload."); }
      };
      s.body.querySelectorAll("[data-rm]").forEach(function (b) { b.onclick = async function () { if (!confirm(T("यह फ़ोटो हटाएँ?", "Remove this photo?"))) return; try { await rpc("pb_photo_remove", { p_slug: O.slug, p_id: +b.dataset.rm }); s.changed = true; paint(); } catch (x) {} }; });
    }
    paint();
  }
  /* दुकान की जानकारी की सारी lines (edit.html जैसी) — सिर्फ़ जो बदलना है वह over में; बाकी जैसी की तैसी */
  var LKEYS = ["GST", "Udyam", "Type", "Hours", "Closed", "WhatsApp", "Phone2", "PIN", "Delivery", "Email", "Website", "Services", "Landmark"];
  function allLines(over) {
    var p = {}; LKEYS.forEach(function (k) { p[k] = ln(k); });
    p.PIN = ln("PIN") || ln("Pincode"); var h = ln("Hide"); if (h) p.Hide = h;
    Object.keys(over || {}).forEach(function (k) { p[k] = over[k]; });
    return p;
  }
  var OTPERR = {
    invalid_otp: ["OTP गलत है।", "Wrong OTP."], otp_expired: ["OTP की समय-सीमा खत्म हो गई। नया OTP मँगाएँ।", "OTP expired. Ask for a new one."], otp_expired_or_missing: ["OTP की समय-सीमा खत्म हो गई। नया OTP मँगाएँ।", "OTP expired. Ask for a new one."],
    too_many_attempts: ["3 बार गलत OTP। नया OTP मँगाएँ।", "3 wrong tries. Ask for a new OTP."], resend_too_soon: ["थोड़ी देर बाद दोबारा मँगाएँ।", "Please wait before asking again."],
    rate_limited_mobile: ["इस नंबर पर आज के OTP पूरे हो गए। कल कोशिश करें।", "Today's OTP limit for this number is used."], rate_limited_ip: ["बहुत ज़्यादा कोशिशें। थोड़ी देर बाद करें।", "Too many attempts. Try later."],
    sms_failed: ["SMS नहीं जा सका। थोड़ी देर बाद कोशिश करें।", "SMS failed. Try later."], login_required: ["Login की समय-सीमा खत्म हो गई। पेज दोबारा खोलें।", "Login expired. Reopen the page."],
    captcha_failed: ["“मैं रोबोट नहीं हूँ” जाँच पूरी नहीं हुई। पेज refresh करें।", "Robot check failed. Refresh the page."], bad_phone: ["10 अंकों का सही नंबर लिखें।", "Enter a correct 10-digit number."]
  };
  function otpMsg(e) { var c = (e && (e.code || e.message)) || "", m = OTPERR[c]; return (m ? T(m[0], m[1]) : T("कुछ गड़बड़ हुई। फिर कोशिश करें।", "Something went wrong. Try again.")) + (c === "invalid_otp" && e.attempts_left ? " " + e.attempts_left + T(" कोशिश बाकी।", " tries left.") : ""); }
  function n10(v) { var d = String(v || "").replace(/\D/g, ""); return d.length > 10 ? d.slice(-10) : d; }

  function editNumbers() {
    var on = O.show_phone !== false, main = n10(O.phone);
    var cur = { Phone2: n10(ln("Phone2")), WhatsApp: n10(ln("WhatsApp")) }, next = { Phone2: cur.Phone2, WhatsApp: cur.WhatsApp }, VER = {}, ed = null;
    var ROW = [["Phone2", "☎️ " + T("दुकान / staff का Call नंबर", "Shop / staff call number")], ["WhatsApp", "💬 " + T("दुकान / staff का WhatsApp", "Shop / staff WhatsApp")]];
    var s = sheet("📞 " + T("ग्राहकों के लिए नंबर", "Numbers for customers"), "", function () { if (s.changed) location.reload(); });
    var dn = s.el.querySelector(".pbe-hd button"); dn.textContent = "✔ " + T("Done", "Done"); dn.style.cssText = "width:auto;height:auto;border-radius:999px;padding:8px 14px;background:#12141c;color:#fff;font:inherit;font-weight:800";
    function dirty() { return next.Phone2 !== cur.Phone2 || next.WhatsApp !== cur.WhatsApp; }
    function paint() {
      var h = '<div class="pbe-row"><div class="t"><b>📱 ' + T("मेरा मुख्य (login) नंबर दिखाएँ", "Show my main (login) number") + '</b><small>' + E(O.phone || "") + ' · ' + T("Login हमेशा इसी नंबर से होगा", "Login always stays on this number") + '</small></div><button type="button" class="pbe-sw' + (on ? " on" : "") + '" id="pbeSw" aria-label="Switch"><i></i></button></div>';
      ROW.forEach(function (r) {
        var k = r[0];
        h += '<div class="pbe-row" style="flex-wrap:wrap"><div class="t"><b>' + r[1] + '</b>';
        if (ed && ed.k === k) {
          h += '<small>' + (ed.stage === "otp" ? T("+91 ", "+91 ") + E(ed.num) + ' — ' + T("पर OTP भेजा गया। नीचे डालें।", "OTP sent. Enter it below.") : T("नया नंबर लिखें (10 अंक)", "Enter the new number (10 digits)")) + '</small></div>';
          h += '<div style="flex:0 0 100%">' + (ed.stage === "otp"
            ? '<input class="pbe-in" id="pbeO" inputmode="numeric" maxlength="6" placeholder="6-digit OTP" style="letter-spacing:4px;text-align:center"><button type="button" class="pbe-b p" id="pbeOk">✔ ' + T("OTP से पक्का करें", "Verify OTP") + '</button>'
            : '<input class="pbe-in" id="pbeN" type="tel" inputmode="numeric" maxlength="10" placeholder="98XXXXXXXX" value="' + E(ed.num || "") + '"><button type="button" class="pbe-b p" id="pbeSend">📩 ' + T("OTP भेजें", "Send OTP") + '</button>') +
            '<button type="button" class="pbe-b s" id="pbeCx">' + T("रद्द करें", "Cancel") + '</button></div>';
        } else {
          var ch = next[k] !== cur[k];
          h += '<small>' + (next[k] || T("नहीं डाला", "not added")) + (ch ? ' · <b style="color:' + (next[k] ? "#137333" : "#c5221f") + '">' + (next[k] ? "✔ " + T("पक्का — नीचे Save दबाएँ", "verified — press Save below") : T("हटेगा — नीचे Save दबाएँ", "will be removed — press Save below")) + '</b>' : "") + '</small></div>' +
            '<div style="display:flex;gap:6px"><button type="button" class="pbe-sm" data-ed="' + k + '">✏️ ' + T("बदलें", "Change") + '</button>' + (next[k] ? '<button type="button" class="pbe-sm" data-rm="' + k + '" aria-label="Remove">🗑</button>' : "") + '</div>';
        }
        h += '</div>';
      });
      h += '<p class="pbe-note">' + T("नया नंबर उसी नंबर पर OTP आने के बाद ही लगेगा। इस नंबर से login नहीं होगा, यह सिर्फ़ ग्राहकों को दिखेगा।", "A new number is added only after the OTP on that number. It cannot be used to log in; it is only shown to customers.") + '</p>';
      if (dirty() && !ed) h += '<button type="button" class="pbe-b p" id="pbeSave" style="background:#1e9e57">💾 ' + T("Save", "Save") + '</button>';
      h += '<div class="pbe-er" id="pbeNr"></div>';
      s.body.innerHTML = h; wire();
    }
    function err(t, good) { var e = s.body.querySelector("#pbeNr"); if (e) { e.style.color = good ? "#1a73e8" : ""; e.textContent = t; } }
    function wire() {
      var sw = s.body.querySelector("#pbeSw");
      sw.onclick = async function () {
        var want = !sw.classList.contains("on");
        if (!want && !next.Phone2 && !next.WhatsApp && !confirm(T("दुकान / staff का कोई नंबर नहीं डाला है। मुख्य नंबर छिपाया तो कोई call नहीं कर पाएगा। फिर भी छिपाएँ?", "No shop / staff number is added. If you hide the main number nobody can call you. Hide anyway?"))) return;
        sw.disabled = true;
        try { var v = await rpc("pb_set_show_phone", { p_slug: O.slug, p_on: want }); O.show_phone = v === false ? false : want; on = O.show_phone !== false; sw.classList.toggle("on", on); s.changed = true; err(""); }
        catch (x) { err(T("बदल नहीं सका, फिर कोशिश करें।", "Could not change. Try again.")); }
        sw.disabled = false;
      };
      s.body.querySelectorAll("[data-ed]").forEach(function (b) { b.onclick = function () { ed = { k: b.dataset.ed, stage: "num", num: "" }; paint(); var i = s.body.querySelector("#pbeN"); if (i) i.focus(); }; });
      s.body.querySelectorAll("[data-rm]").forEach(function (b) { b.onclick = function () { next[b.dataset.rm] = ""; paint(); }; });
      var cx = s.body.querySelector("#pbeCx"); if (cx) cx.onclick = function () { ed = null; paint(); };
      var sd = s.body.querySelector("#pbeSend");
      if (sd) sd.onclick = async function () {
        var num = n10(s.body.querySelector("#pbeN").value);
        if (!/^[6-9]\d{9}$/.test(num)) { err(T("10 अंकों का सही नंबर लिखें।", "Enter a correct 10-digit number.")); return; }
        if (num === cur[ed.k] || num === main || VER[num]) { next[ed.k] = num; ed = null; paint(); return; }   /* पहले से पक्का नंबर */
        sd.disabled = true; err(T("OTP भेज रहे हैं…", "Sending OTP…"), true);
        try { await PBA.mobile.staffSend(O.slug, num); ed.num = num; ed.stage = "otp"; paint(); var o = s.body.querySelector("#pbeO"); if (o) o.focus(); }
        catch (e) { err(otpMsg(e)); sd.disabled = false; }
      };
      var ok = s.body.querySelector("#pbeOk");
      if (ok) ok.onclick = async function () {
        var c = s.body.querySelector("#pbeO").value.replace(/\D/g, "");
        if (c.length !== 6) { err(T("6 अंकों का OTP डालें।", "Enter the 6-digit OTP.")); return; }
        ok.disabled = true;
        try { await PBA.mobile.staffVerify(O.slug, ed.num, c); VER[ed.num] = 1; next[ed.k] = ed.num; ed = null; paint(); }
        catch (e) { err(otpMsg(e)); ok.disabled = false; if (/expired|too_many/.test((e && e.code) || "")) { ed.stage = "num"; paint(); err(otpMsg(e)); } }
      };
      var sv = s.body.querySelector("#pbeSave");
      if (sv) sv.onclick = async function () {
        sv.disabled = true; err(T("Save हो रहा है…", "Saving…"), true);
        try {
          await rpc("pb_owner_set_details", { p_slug: O.slug, p: allLines({ Phone2: next.Phone2, WhatsApp: next.WhatsApp }) });
          s.el.remove(); location.reload();
        } catch (e) {
          err(/not verified/i.test(e.message || "") ? T("यह नंबर OTP से पक्का नहीं हुआ। नंबर फिर से डालकर OTP करें।", "This number is not verified by OTP. Enter it again and verify.") : T("Save नहीं हुआ, फिर कोशिश करें।", "Could not save. Try again."));
          sv.disabled = false;
        }
      };
    }
    paint();
  }
  async function editVacancy() {
    var open = false; try { var r = await fetch(SBU + "/rest/v1/rpc/pb_vacancy_status", { method: "POST", headers: { apikey: PK, Authorization: "Bearer " + PK, "Content-Type": "application/json" }, body: JSON.stringify({ p_slugs: [O.slug] }) }); var j = r.ok ? await r.json() : {}; open = !!(j && j[O.slug]); } catch (e) {}
    var s = sheet("💼 " + T("Vacancy (नौकरी खाली है)", "Vacancy available"), '<div class="pbe-row"><div class="t"><b>' + T("स्टाफ़ चाहिए?", "Need staff?") + '</b><small>' + T("ON करने पर आपके page पर “नौकरी खाली है” दिखेगा (30 दिन बाद अपने-आप बंद)", "When ON, your page shows “Vacancy available” (auto-off after 30 days)") + '</small></div><button type="button" class="pbe-sw' + (open ? " on" : "") + '" id="pbeVs" aria-label="Switch"><i></i></button></div><div class="pbe-er" id="pbeVe"></div>', function () { if (s.changed) location.reload(); });
    var sw = s.body.querySelector("#pbeVs");
    sw.onclick = async function () { var want = !sw.classList.contains("on"); sw.disabled = true; try { var v = await rpc("pb_set_vacancy", { p_slug: O.slug, p_on: want }); sw.classList.toggle("on", !!(v && v.open)); s.changed = true; } catch (x) { s.body.querySelector("#pbeVe").textContent = T("बदल नहीं सका।", "Could not change."); } sw.disabled = false; };
  }
  /* 👁️ public को क्या दिखे — हर हिस्से का switch; दुकान की जानकारी में "Hide:" line बनकर save */
  var VIS = [
    ["prods", "🛍️", "Products", "Products"], ["photos", "📷", "फ़ोटो", "Photos"], ["about", "🏪", "हमारे बारे में (जानकारी)", "About us (details)"],
    ["hours", "🕘", "खुलने-बंद होने का समय", "Opening hours"], ["addr", "📍", "पता और Directions", "Address & directions"],
    ["gst", "🧾", "GST Registered वाला निशान", "GST Registered badge"], ["web", "🌐", "Email / Website", "Email / Website"],
    ["vac", "💼", "Vacancy वाली पट्टी", "Vacancy strip"], ["near", "🏬", "आस-पास की दुकानें", "Nearby shops"],
    ["share", "📤", "“दोस्त को भेजें” और Visiting card", "“Send to friend” & visiting card"]
  ];
  function editVisible() {
    var H = {}, cur = window.PBHide ? PBHide.cur() : {}; Object.keys(cur).forEach(function (k) { H[k] = 1; });
    var s = sheet("👁️ " + T("Public को क्या दिखे", "What customers see"),
      '<p class="pbe-note">' + T("🟢 चालू = ग्राहक को दिखेगा · ⚪ बंद = ग्राहक को नहीं दिखेगा। दुकान का नाम, Logo, Call / WhatsApp हमेशा दिखेंगे।", "🟢 ON = customers see it · ⚪ OFF = hidden. Shop name, logo, Call / WhatsApp always show.") + '</p>' +
      VIS.map(function (v) { return '<div class="pbe-row"><div class="t"><b>' + v[1] + ' ' + T(v[2], v[3]) + '</b></div><button type="button" class="pbe-sw' + (H[v[0]] ? "" : " on") + '" data-k="' + v[0] + '" aria-label="Switch"><i></i></button></div>'; }).join("") +
      '<button type="button" class="pbe-b p" id="pbeVsv">✔ ' + T("Save करें", "Save") + '</button><div class="pbe-er" id="pbeVer"></div>');
    s.body.querySelectorAll("[data-k]").forEach(function (b) { b.onclick = function () { b.classList.toggle("on"); if (b.classList.contains("on")) delete H[b.dataset.k]; else H[b.dataset.k] = 1; }; });
    var sv = s.body.querySelector("#pbeVsv"), er = s.body.querySelector("#pbeVer");
    sv.onclick = async function () {
      var val = VIS.map(function (v) { return v[0]; }).filter(function (k) { return H[k]; }).join(",");
      sv.disabled = true; er.style.color = "#1a73e8"; er.textContent = T("Save हो रहा है…", "Saving…");
      try {
        await rpc("pb_owner_set_details", { p_slug: O.slug, p: Object.assign(allLines(), { Hide: val }) });
        /* पक्का करें कि line सच में save हुई */
        var r = await fetch(SBU + "/rest/v1/businesses?select=description&slug=eq." + encodeURIComponent(O.slug) + "&limit=1", { headers: { apikey: PK, Authorization: "Bearer " + PK } });
        var j = r.ok ? await r.json() : [], d = (j && j[0] && j[0].description) || "", got = window.PBHide ? Object.keys(PBHide.parse(d)).sort().join(",") : val;
        if (got !== val.split(",").filter(Boolean).sort().join(",")) throw new Error("notsaved");
        s.el.remove(); location.reload();
      } catch (x) {
        er.style.color = ""; er.textContent = x.message === "notsaved" ? T("❌ Setting save नहीं हुई — Supabase में थोड़ा बदलाव चाहिए (admin को बताएँ)।", "❌ Not saved — the server needs a small update (tell admin).") : T("❌ Save नहीं हुआ, फिर कोशिश करें।", "❌ Could not save. Try again.");
        if (window.console) console.warn("PataBook visibility save:", x);
      }
      sv.disabled = false;
    };
  }
  var ACT = { logo: editLogo, products: editProducts, photos: editPhotos, details: function () { editDetails(""); }, about: function () { editDetails("", "about"); }, visit: function () { editDetails("", "visit"); }, numbers: editNumbers, vacancy: editVacancy, visible: editVisible };

  /* ---------- pencils ---------- */
  var MAP = {
    shop: [[".hlogo", "logo"], ["#prods", "products"], ["#photos", "photos"], ["#about", "about"], ["#visit", "visit"], ["#contact", "numbers"], ["#vacFlag", "vacancy"]],
    biz: [[".lgw", "logo"], ["#prods", "products"], ["#galM", "photos"], ["#det", "details"], ["#contact", "numbers"], ["#vacFlag", "vacancy"]]
  };
  function pens() {
    if (!ON) return;
    (MAP[O.page] || []).forEach(function (m) {
      document.querySelectorAll(m[0]).forEach(function (el) {
        if (el.querySelector(":scope > .pbe-pen")) return;
        if (getComputedStyle(el).position === "static") el.style.position = "relative";
        el.classList.add("pbe-t");
        var b = document.createElement("button"); b.type = "button"; b.className = "pbe-pen"; b.setAttribute("aria-label", "Edit"); b.textContent = "✏️";
        b.onclick = function (e) { e.preventDefault(); e.stopPropagation(); ACT[m[1]](); };
        el.appendChild(b);
      });
    });
  }
  function bar() {
    var d = document.createElement("div"); d.className = "pbe-bar";
    var P = prem(), items = [["logo", "🖼️ Logo"]].concat(P ? [["products", "🛍️ Products"], ["photos", "📷 " + T("फ़ोटो", "Photos")]] : []).concat([["details", "🏪 " + T("जानकारी", "Details")], ["numbers", "📞 " + T("नंबर", "Numbers")], ["vacancy", "💼 Vacancy"], ["visible", "👁️ " + T("क्या दिखाएँ", "Show / hide")]]);
    d.innerHTML = '<div class="h"><span>✏️</span><b>' + T("आप अपना page बदल रहे हैं — पीली ✏️ दबाएँ", "You are editing your page — tap a yellow ✏️") + '</b><button type="button" id="pbeDone">✔ ' + T("हो गया", "Done") + '</button></div><div class="g">' +
      items.map(function (x) { return '<button type="button" data-a="' + x[0] + '">' + x[1] + '</button>'; }).join("") + '</div>';
    d.onclick = function (e) { var b = e.target.closest("[data-a]"); if (b) return ACT[b.dataset.a](); if (e.target.closest("#pbeDone")) toggle(false); };
    document.body.appendChild(d);
  }
  function toggle(v) {
    ON = v === undefined ? !ON : v;
    document.body.classList.toggle("pbe-on", ON);
    var b = document.getElementById("pbeBtn"); if (b) b.textContent = ON ? "✔ " + T("हो गया", "Done") : "✏️ " + T("Edit", "Edit");
    try { sessionStorage.setItem("pbe-on-" + O.slug, ON ? "1" : ""); } catch (e) {}
    if (ON) pens();
  }
  function start(o) {
    if (O || !o || !o.slug || !o.row) return;
    O = { slug: o.slug, page: o.page, show_phone: o.row.show_phone, phone: o.row.phone || "" };
    var host = o.page === "shop" ? document.querySelector(".top .wrap") : document.querySelector("header .nav");
    var lang = document.getElementById("pbLang");
    var btn = document.createElement("button"); btn.type = "button"; btn.id = "pbeBtn"; btn.className = "pbe-btn"; btn.textContent = "✏️ " + T("Edit", "Edit");
    btn.onclick = function () { toggle(); };
    if (host && lang && lang.parentNode === host) host.insertBefore(btn, lang); else if (host) host.appendChild(btn);
    bar();
    new MutationObserver(function () { if (ON) pens(); }).observe(document.body, { childList: true, subtree: true });
    var keep = false; try { keep = sessionStorage.getItem("pbe-on-" + O.slug) === "1"; } catch (e) {}
    if (keep) toggle(true);
  }
  window.PBEdit = { start: start };
})();
