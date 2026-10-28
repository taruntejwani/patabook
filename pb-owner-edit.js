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
  /* plan में यह सुविधा ON है? (Admin → Plans) */
  function has(f) { if (window.PBPlan && O) return PBPlan.has(O.slug, f); return prem(); }
  function plim(k, d) { return window.PBPlan && O ? (PBPlan.lim(O.slug, k) || d) : d; }
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
    ".pbe-btn{flex:none;display:inline-flex;align-items:center;gap:5px;border:0;border-radius:999px;padding:8px 13px;font:inherit;font-size:13.5px;font-weight:800;background:#e8f1ff;color:#0b3a94;border:1px solid #cfe0fb;cursor:pointer}" +
    ".pbe-on .pbe-btn{background:#0b3a94;color:#fff;border-color:#0b3a94}.pbe-btn svg{width:15px;height:15px}" +
    ".pbe-pen{position:absolute;top:8px;right:8px;z-index:6;width:38px;height:38px;border-radius:50%;border:2px solid #fff;background:#ffd21f;font-size:17px;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.25);display:none}" +
    ".pbe-on .pbe-pen{display:grid;place-items:center}" +
    ".pbe-on .pbe-t{outline:2px dashed #f5b400;outline-offset:3px;border-radius:16px}" +
    ".pbe-bar{position:fixed;left:0;right:0;bottom:0;z-index:9000;background:#12141c;color:#fff;padding:10px 10px calc(10px + env(safe-area-inset-bottom));display:none;box-shadow:0 -6px 20px rgba(0,0,0,.25)}" +
    ".pbe-on .pbe-bar{display:none}" +
    ".qa3{position:relative}.qa3>.pbe-pen{top:-18px;right:auto;left:calc(33.3% - 19px)}" +
    ".qa>.pbe-pen{top:-18px;right:auto;left:calc(25% - 19px);z-index:9;opacity:1;background:#ffd21f!important;border:2px solid #fff!important;padding:0!important;width:38px!important;height:38px!important;border-radius:50%!important;font-size:17px!important}" +
    ".pbe-bar .h{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;margin:0 4px 8px}.pbe-bar .h b{flex:1}.pbe-bar .h button{border:0;border-radius:999px;padding:7px 13px;font:inherit;font-weight:800;background:#1e9e57;color:#fff;cursor:pointer}" +
    ".pbe-bar .g{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}.pbe-bar .g::-webkit-scrollbar{display:none}" +
    ".pbe-bar .g button{flex:none;border:1px solid #3a3f4d;background:#1f2330;color:#fff;border-radius:12px;padding:8px 11px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}" +
    
    ".pbe-sc{position:fixed;inset:0;z-index:9500;background:rgba(10,20,40,.55);display:flex;align-items:flex-end;justify-content:center}" +
    ".pbe-sh{position:relative;width:100%;max-width:640px;max-height:92vh;display:flex;flex-direction:column;background:#fff;border-radius:22px 22px 0 0;overflow:hidden}" +
    "@media(min-width:640px){.pbe-sc{align-items:center}.pbe-sh{border-radius:22px}}" +
    ".pbe-hd{display:flex;align-items:center;gap:10px;padding:14px 16px 10px;border-bottom:1px solid #eef1f6}.pbe-hd b{flex:1;font-size:16.5px;color:#123568}.pbe-hd button.pbe-dn{border-radius:999px;border:0;background:#12141c;color:#fff;font:inherit;font-weight:800;font-size:14px;padding:8px 14px;cursor:pointer}" +
    ".pbe-bd{overflow:auto;padding:14px 16px calc(18px + env(safe-area-inset-bottom));font-size:14.5px;line-height:1.5}" +
    ".pbe-fr{width:100%;height:78vh;border:0;display:block}" +
    ".pbe-hub .pbe-sh{height:92vh}.pbe-hub .pbe-bd{flex:1;min-height:0}" +
    ".pbe-tabs{flex:none;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:9px 14px;border-bottom:1px solid #eef1f6;background:#fafbfe}.pbe-tabs::-webkit-scrollbar{display:none}" +
    ".pbe-tabs button{flex:none;border:1px solid #cfe0fb;background:#fff;color:#0b3a94;border-radius:999px;padding:7px 13px;font:inherit;font-size:13.5px;font-weight:800;cursor:pointer}.pbe-tabs button.on{background:#0b3a94;color:#fff;border-color:#0b3a94}" +
    ".pbe-hub .pbe-fr{height:100%;min-height:62vh}" +
    ".pbe-row{display:flex;align-items:center;gap:12px;border:1px solid #e4eaf5;border-radius:14px;padding:12px;margin-bottom:10px}.pbe-row .t{flex:1;min-width:0}.pbe-row small{display:block;color:#5b6475;font-size:12.5px}" +
    ".pbe-sw{flex:none;width:52px;height:30px;border-radius:999px;border:0;background:#c9ced8;position:relative;cursor:pointer}.pbe-sw i{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:left .2s}.pbe-sw.on{background:#1e9e57}.pbe-sw.on i{left:25px}" +
    ".pbe-b{display:block;width:100%;border:0;border-radius:14px;padding:13px;font:inherit;font-weight:800;font-size:15px;cursor:pointer;margin-top:8px;text-align:center}.pbe-b.p{background:#1a73e8;color:#fff}.pbe-b.s{background:#f1f4f9;color:#12141c}.pbe-b.d{background:#fdecea;color:#c5221f}" +
    ".pbe-in{width:100%;box-sizing:border-box;padding:12px;border:1.5px solid #cfd8ea;border-radius:12px;font:inherit;font-size:17px;margin-top:8px}.pbe-sm{border:1px solid #cfd8ea;background:#f4f8ff;color:#123568;border-radius:10px;padding:8px 11px;font:inherit;font-size:13px;font-weight:800;cursor:pointer}" +
    ".pbe-note{background:#fff7e6;border:1px solid #ffd591;color:#874d00;border-radius:12px;padding:10px 12px;font-size:13px;margin:6px 0 10px}" +
    ".pbe-er{color:#c5221f;font-size:13px;font-weight:700;min-height:18px;margin-top:8px}" +
    ".pbe-pg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.pbe-pg .t{position:relative;aspect-ratio:1;border-radius:12px;overflow:hidden;background:#eef3fd}.pbe-pg img{width:100%;height:100%;object-fit:cover}.pbe-pg .t button{position:absolute;top:5px;right:5px;width:28px;height:28px;border-radius:50%;border:0;background:rgba(197,34,31,.92);color:#fff;cursor:pointer}" +
    ".pbe-rk{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}.pbe-rk div{border:1.5px solid #ecdcb0;border-radius:16px;background:linear-gradient(180deg,#fffdf6,#fff6df);text-align:center;padding:10px 4px}.pbe-rk i{display:block;font-style:normal;font-size:22px}.pbe-rk b{display:block;font-size:21px;color:#123568;line-height:1.2;margin-top:2px}.pbe-rk small{display:block;font-size:11.5px;color:#5b6475;font-weight:700}" +
    ".pbe-gr{border:1px solid #eef1f6;border-radius:16px;padding:10px 10px 4px}.pbe-gr svg{width:100%;height:auto;display:block}.pbe-lg{display:flex;gap:14px;justify-content:center;font-size:12px;color:#5b6475;margin-top:8px}.pbe-lg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:4px;vertical-align:-1px}" +
    ".pbe-pg label{aspect-ratio:1;border-radius:12px;border:2px dashed #9fc0f5;background:#f4f8ff;display:grid;place-items:center;font-size:30px;color:#1a73e8;cursor:pointer}";
  document.head.appendChild(css);

  /* ---------- sheet ---------- */
  function sheet(title, html, onClose) { return HUB && HUB.active ? hubSheet(title, html, onClose) : sheet0(title, html, onClose); }
  function sheet0(title, html, onClose) {
    var sc = document.createElement("div"); sc.className = "pbe-sc";
    sc.innerHTML = '<div class="pbe-sh"><div class="pbe-hd"><b>' + title + '</b><button type="button" aria-label="Done" class="pbe-dn">✔ ' + T("Done", "Done") + '</button></div><div class="pbe-bd">' + html + '</div></div>';
    var o = { el: sc, body: sc.querySelector(".pbe-bd"), dirty: false, changed: false };
    function gone() { sc.remove(); window.removeEventListener("message", onMsg); }
    function close(force) {
      if (!force && o.dirty && !confirm(T("बदलाव Save नहीं हुए। फिर भी बंद करें?", "Changes are not saved. Close anyway?"))) return;
      gone(); if (onClose) onClose();
    }
    function onMsg(e) {
      if (e.origin !== location.origin || !e.data) return;
      if (e.data.pbEdit === "saved") { gone(); location.reload(); }
      else if (e.data.pbEdit === "dirty") o.dirty = true;
      else if (e.data.pbEdit === "clean") o.dirty = false;
    }
    window.addEventListener("message", onMsg);
    sc.querySelector(".pbe-hd button").onclick = function () { close(); };
    sc.addEventListener("click", function (e) { if (e.target === sc) close(); });
    document.body.appendChild(sc);
    o.close = close; o.remove = gone;
    return o;
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
    if (!has("logo")) return premOnly("🖼️ Logo");
    var hasLogo = false; try { hasLogo = !!(typeof B !== "undefined" && B && /shop-logos\//.test(B.logo_url || "")); } catch (e) {}
    var st = { blob: null, prev: "", rm: false };
    var s = sheet("🖼️ " + T("Logo", "Logo"), "");
    function paint() {
      var h = '<p style="color:#5b6475;font-size:13.5px">' + T("चौकोर (square) फ़ोटो सबसे अच्छी लगती है।", "A square photo works best.") + '</p>';
      if (st.prev) h += '<div style="text-align:center;margin:8px 0"><img src="' + E(st.prev) + '" alt="" style="width:110px;height:110px;border-radius:24px;object-fit:cover;box-shadow:0 0 0 3px #e2b34c"><div style="font-size:13px;color:#137333;font-weight:700;margin-top:6px">✔ ' + T("नया logo चुना — नीचे Save दबाएँ", "New logo chosen — press Save below") + '</div></div>';
      if (st.rm) h += '<p class="pbe-note">' + T("Logo हटेगा — नीचे Save दबाएँ।", "Logo will be removed — press Save below.") + '</p>';
      h += '<button type="button" class="pbe-b s" id="pbeLc">📷 ' + ((hasLogo || st.blob) ? T("Logo बदलें", "Change logo") : T("Logo लगाएँ", "Add logo")) + '</button>';
      if (hasLogo && !st.rm && !st.blob) h += '<button type="button" class="pbe-b d" id="pbeLr">🗑️ ' + T("Logo हटाएँ", "Remove logo") + '</button>';
      if (st.blob || st.rm) h += '<button type="button" class="pbe-b p" id="pbeLs" style="background:#1e9e57">💾 ' + T("Save", "Save") + '</button>';
      h += '<div class="pbe-er" id="pbeLe"></div>';
      s.body.innerHTML = h; wire();
    }
    function wire() {
      var er = s.body.querySelector("#pbeLe");
      s.body.querySelector("#pbeLc").onclick = function () {
        pickFile(async function (f) {
          try {
            er.style.color = "#5b6475"; er.textContent = "🔍 " + T("AI फ़ोटो जांच रहा है…", "AI is checking the photo…");
            var ck = window.PBImg ? await PBImg.check(f, { slug: O.slug, kind: "logo" }) : { ok: true };
            if (!ck.ok) { er.style.color = ""; er.textContent = ck.msg; return; }
            var bl = await squareImage(f); if (st.prev) URL.revokeObjectURL(st.prev);
            st.blob = bl; st.prev = URL.createObjectURL(bl); st.rm = false; s.dirty = true; paint();
          } catch (x) { er.style.color = ""; er.textContent = T("फ़ोटो पढ़ नहीं सका, दूसरी फ़ोटो चुनें।", "Could not read the photo. Pick another."); }
        });
      };
      var rm = s.body.querySelector("#pbeLr"); if (rm) rm.onclick = function () { st.rm = true; s.dirty = true; paint(); };
      var sv = s.body.querySelector("#pbeLs");
      if (sv) sv.onclick = async function () {
        sv.disabled = true; er.style.color = "#5b6475"; er.textContent = T("Save हो रहा है…", "Saving…");
        try {
          var url = null; if (st.blob) url = await upload(st.blob, "logo");
          await rpc("pb_set_logo", { p_slug: O.slug, p_url: url });
          s.dirty = false; s.remove(); location.reload();
        } catch (x) { er.style.color = ""; er.textContent = T("Save नहीं हुआ, फिर कोशिश करें।", "Could not save. Try again."); sv.disabled = false; }
      };
    }
    paint();
  }
  async function editPhotos() {
    var s = sheet("📷 " + T("दुकान की फ़ोटो", "Shop photos"), '<p style="color:#5b6475">…</p>');
    var L = [], rm = {}, add = [];
    try { L = await rpc("pb_my_photos", { p_slug: O.slug }) || []; } catch (x) { s.body.innerHTML = '<p class="pbe-note">' + (/premium/i.test(x.message) ? T("फ़ोटो सिर्फ़ Premium दुकानों के लिए हैं।", "Photos are for Premium shops.") : T("खुल नहीं सका।", "Could not load.")) + '</p>'; return; }
    function count() { return L.filter(function (x) { return !rm[x.id]; }).length + add.length; }
    function paint() {
      var n = count(), h = '<div class="pbe-pg">' +
        L.filter(function (x) { return !rm[x.id]; }).map(function (x) { return '<div class="t"><img src="' + E(x.url) + '" alt="" loading="lazy"><button type="button" data-rm="' + x.id + '" aria-label="Remove">✕</button></div>'; }).join("") +
        add.map(function (a, i) { return '<div class="t" style="outline:2px solid #1e9e57"><img src="' + E(a.prev) + '" alt=""><button type="button" data-ra="' + i + '" aria-label="Remove">✕</button></div>'; }).join("") +
        (n < plim("photos", 8) ? '<label>＋<input type="file" accept="image/*" hidden id="pbePf"></label>' : '') + '</div><small style="display:block;color:#5b6475;margin-top:8px">' + n + ' / ' + plim("photos", 8) + ' ' + T("फ़ोटो", "photos") + '</small>';
      if (s.dirty) h += '<button type="button" class="pbe-b p" id="pbePs" style="background:#1e9e57">💾 ' + T("Save", "Save") + '</button>';
      h += '<div class="pbe-er" id="pbePe"></div>';
      s.body.innerHTML = h;
      var inp = s.body.querySelector("#pbePf"), er = s.body.querySelector("#pbePe");
      if (inp) inp.onchange = async function () {
        var f = inp.files && inp.files[0]; if (!f) return;
        try {
          er.style.color = "#5b6475"; er.textContent = "🔍 " + T("AI फ़ोटो जांच रहा है…", "AI is checking the photo…");
          var ck = window.PBImg ? await PBImg.check(f, { slug: O.slug, kind: "shop" }) : { ok: true };
          if (!ck.ok) { er.style.color = ""; er.textContent = ck.msg; return; }
          var bl = await resizeImage(f, 1000); add.push({ blob: bl, prev: URL.createObjectURL(bl) }); s.dirty = true; paint();
        } catch (x) { er.style.color = ""; er.textContent = T("फ़ोटो पढ़ नहीं सका, दूसरी चुनें।", "Could not read the photo. Pick another."); }
      };
      s.body.querySelectorAll("[data-rm]").forEach(function (b) { b.onclick = function () { rm[b.dataset.rm] = 1; s.dirty = true; paint(); }; });
      s.body.querySelectorAll("[data-ra]").forEach(function (b) { b.onclick = function () { var a = add.splice(+b.dataset.ra, 1)[0]; if (a) URL.revokeObjectURL(a.prev); s.dirty = add.length > 0 || Object.keys(rm).length > 0; paint(); }; });
      var sv = s.body.querySelector("#pbePs");
      if (sv) sv.onclick = async function () {
        sv.disabled = true; er.style.color = "#5b6475"; er.textContent = T("Save हो रहा है…", "Saving…");
        try {
          for (var id in rm) await rpc("pb_photo_remove", { p_slug: O.slug, p_id: +id });
          for (var i = 0; i < add.length; i++) { var url = await upload(add[i].blob, "photo"); await rpc("pb_photo_add", { p_slug: O.slug, p_url: url }); }
          s.dirty = false; s.remove(); location.reload();
        } catch (x) { er.style.color = ""; er.textContent = /too many/.test(x.message || "") ? T(plim("photos", 8) + " से ज़्यादा फ़ोटो नहीं।", "Max " + plim("photos", 8) + " photos.") : T("Save नहीं हुआ, फिर कोशिश करें।", "Could not save. Try again."); sv.disabled = false; }
      };
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
    var on = O.show_phone !== false, on0 = on, main = n10(O.phone);
    var cur = { Phone2: n10(ln("Phone2")), WhatsApp: n10(ln("WhatsApp")) }, next = { Phone2: cur.Phone2, WhatsApp: cur.WhatsApp }, VER = {}, ed = null;
    var ROW = [["Phone2", "☎️ " + T("दुकान / staff का Call नंबर", "Shop / staff call number")], ["WhatsApp", "💬 " + T("दुकान / staff का WhatsApp", "Shop / staff WhatsApp")]];
    var s = sheet("📞 " + T("ग्राहकों के लिए नंबर", "Numbers for customers"), "");
    function dirty() { return next.Phone2 !== cur.Phone2 || next.WhatsApp !== cur.WhatsApp || on !== on0; }
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
      if (on !== on0) h += '<p class="pbe-note">' + (on ? T("मुख्य नंबर दिखेगा — नीचे Save दबाएँ।", "Main number will show — press Save below.") : T("मुख्य नंबर छिपेगा — नीचे Save दबाएँ।", "Main number will be hidden — press Save below.")) + '</p>';
      if (dirty() && !ed) h += '<button type="button" class="pbe-b p" id="pbeSave" style="background:#1e9e57">💾 ' + T("Save", "Save") + '</button>';
      h += '<div class="pbe-er" id="pbeNr"></div>';
      s.body.innerHTML = h; wire();
    }
    function err(t, good) { var e = s.body.querySelector("#pbeNr"); if (e) { e.style.color = good ? "#1a73e8" : ""; e.textContent = t; } }
    function wire() {
      var sw = s.body.querySelector("#pbeSw");
      sw.onclick = function () { on = !on; s.dirty = dirty(); paint(); };
      s.body.querySelectorAll("[data-ed]").forEach(function (b) { b.onclick = function () { ed = { k: b.dataset.ed, stage: "num", num: "" }; paint(); var i = s.body.querySelector("#pbeN"); if (i) i.focus(); }; });
      s.body.querySelectorAll("[data-rm]").forEach(function (b) { b.onclick = function () { next[b.dataset.rm] = ""; s.dirty = dirty(); paint(); }; });
      var cx = s.body.querySelector("#pbeCx"); if (cx) cx.onclick = function () { ed = null; paint(); };
      var sd = s.body.querySelector("#pbeSend");
      if (sd) sd.onclick = async function () {
        var num = n10(s.body.querySelector("#pbeN").value);
        if (!/^[6-9]\d{9}$/.test(num)) { err(T("10 अंकों का सही नंबर लिखें।", "Enter a correct 10-digit number.")); return; }
        if (num === cur[ed.k] || num === main || VER[num]) { next[ed.k] = num; ed = null; s.dirty = dirty(); paint(); return; }   /* पहले से पक्का नंबर */
        sd.disabled = true; err(T("OTP भेज रहे हैं…", "Sending OTP…"), true);
        try { await PBA.mobile.staffSend(O.slug, num); ed.num = num; ed.stage = "otp"; paint(); var o = s.body.querySelector("#pbeO"); if (o) o.focus(); }
        catch (e) { err(otpMsg(e)); sd.disabled = false; }
      };
      var ok = s.body.querySelector("#pbeOk");
      if (ok) ok.onclick = async function () {
        var c = s.body.querySelector("#pbeO").value.replace(/\D/g, "");
        if (c.length !== 6) { err(T("6 अंकों का OTP डालें।", "Enter the 6-digit OTP.")); return; }
        ok.disabled = true;
        try { await PBA.mobile.staffVerify(O.slug, ed.num, c); VER[ed.num] = 1; next[ed.k] = ed.num; ed = null; s.dirty = dirty(); paint(); }
        catch (e) { err(otpMsg(e)); ok.disabled = false; if (/expired|too_many/.test((e && e.code) || "")) { ed.stage = "num"; paint(); err(otpMsg(e)); } }
      };
      var sv = s.body.querySelector("#pbeSave");
      if (sv) sv.onclick = async function () {
        if (!on && !next.Phone2 && !next.WhatsApp && !confirm(T("दुकान / staff का कोई नंबर नहीं डाला है। मुख्य नंबर छिपाया तो कोई call नहीं कर पाएगा। फिर भी छिपाएँ?", "No shop / staff number is added. If you hide the main number nobody can call you. Hide anyway?"))) return;
        sv.disabled = true; err(T("Save हो रहा है…", "Saving…"), true);
        try {
          if (next.Phone2 !== cur.Phone2 || next.WhatsApp !== cur.WhatsApp) await rpc("pb_owner_set_details", { p_slug: O.slug, p: allLines({ Phone2: next.Phone2, WhatsApp: next.WhatsApp }) });
          if (on !== on0) await rpc("pb_set_show_phone", { p_slug: O.slug, p_on: on });
          s.dirty = false; s.remove(); location.reload();
        } catch (e) {
          err(/not verified/i.test(e.message || "") ? T("यह नंबर OTP से पक्का नहीं हुआ। नंबर फिर से डालकर OTP करें।", "This number is not verified by OTP. Enter it again and verify.") : T("Save नहीं हुआ, फिर कोशिश करें।", "Could not save. Try again."));
          sv.disabled = false;
        }
      };
    }
    paint();
  }
  async function editVacancy() {
    if (!has("hiring")) return premOnly("💼 " + T("नौकरी (Hiring)", "Hiring"));
    if (window.PBHire && PBHire.editor) return PBHire.editor(O.slug, rpc, function () { location.reload(); });   /* sql-26: पूरी जानकारी */
    var open = false; try { var r = await fetch(SBU + "/rest/v1/rpc/pb_vacancy_status", { method: "POST", headers: { apikey: PK, Authorization: "Bearer " + PK, "Content-Type": "application/json" }, body: JSON.stringify({ p_slugs: [O.slug] }) }); var j = r.ok ? await r.json() : {}; open = !!(j && j[O.slug]); } catch (e) {}
    var open0 = open, s = sheet("💼 " + T("Vacancy (नौकरी खाली है)", "Vacancy available"), "");
    function paint() {
      s.body.innerHTML = '<div class="pbe-row"><div class="t"><b>' + T("स्टाफ़ चाहिए?", "Need staff?") + '</b><small>' + T("ON करने पर आपके page पर “नौकरी खाली है” दिखेगा (30 दिन बाद अपने-आप बंद)", "When ON, your page shows “Vacancy available” (auto-off after 30 days)") + '</small></div><button type="button" class="pbe-sw' + (open ? " on" : "") + '" id="pbeVs" aria-label="Switch"><i></i></button></div>' +
        (open !== open0 ? '<button type="button" class="pbe-b p" id="pbeVv" style="background:#1e9e57">💾 ' + T("Save", "Save") + '</button>' : '') + '<div class="pbe-er" id="pbeVe"></div>';
      s.body.querySelector("#pbeVs").onclick = function () { open = !open; s.dirty = open !== open0; paint(); };
      var sv = s.body.querySelector("#pbeVv");
      if (sv) sv.onclick = async function () {
        sv.disabled = true;
        try { await rpc("pb_set_vacancy", { p_slug: O.slug, p_on: open }); s.dirty = false; s.remove(); location.reload(); }
        catch (x) { s.body.querySelector("#pbeVe").textContent = T("Save नहीं हुआ, फिर कोशिश करें।", "Could not save. Try again."); sv.disabled = false; }
      };
    }
    paint();
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
    s.body.querySelectorAll("[data-k]").forEach(function (b) { b.onclick = function () { b.classList.toggle("on"); if (b.classList.contains("on")) delete H[b.dataset.k]; else H[b.dataset.k] = 1; s.dirty = true; }; });
    var sv = s.body.querySelector("#pbeVsv"), er = s.body.querySelector("#pbeVer");
    sv.onclick = async function () {
      var val = VIS.map(function (v) { return v[0]; }).filter(function (k) { return H[k]; }).join(",");
      sv.disabled = true; er.style.color = "#1a73e8"; er.textContent = T("Save हो रहा है…", "Saving…");
      try {
        /* sql-25: सिर्फ़ Hide line बदलने वाली अलग function; वह न हो तो पुराना तरीका */
        try { await rpc("pb_owner_set_hide", { p_slug: O.slug, p_keys: val }); }
        catch (x1) { if (x1.status === 404 || /could not find|PGRST202/i.test(x1.message || "")) await rpc("pb_owner_set_details", { p_slug: O.slug, p: Object.assign(allLines(), { Hide: val }) }); else throw x1; }
        /* पक्का करें कि line सच में save हुई */
        var r = await fetch(SBU + "/rest/v1/businesses?select=description&slug=eq." + encodeURIComponent(O.slug) + "&limit=1", { headers: { apikey: PK, Authorization: "Bearer " + PK } });
        var j = r.ok ? await r.json() : [], d = (j && j[0] && j[0].description) || "", got = window.PBHide ? Object.keys(PBHide.parse(d)).sort().join(",") : val;
        if (got !== val.split(",").filter(Boolean).sort().join(",")) throw new Error("notsaved");
        s.dirty = false; s.remove(); location.reload();
      } catch (x) {
        er.style.color = ""; er.textContent = x.message === "notsaved" ? T("❌ Setting save नहीं हुई — Supabase में थोड़ा बदलाव चाहिए (admin को बताएँ)।", "❌ Not saved — the server needs a small update (tell admin).") : T("❌ Save नहीं हुआ, फिर कोशिश करें।", "❌ Could not save. Try again.");
        if (window.console) console.warn("PataBook visibility save:", x);
      }
      sv.disabled = false;
    };
  }
  /* 📊 रिपोर्ट: पिछले 14 दिन (free दुकान: 7 दिन) — कितनों ने देखा, Call, WhatsApp, रास्ता */
  function istDay(k) { var d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })); d.setDate(d.getDate() - k); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function reportBody(R) {
    var days = Math.min((R && R.days) || 7, 14), D = [], M = {}, tot = { view: 0, call: 0, wa: 0, dir: 0 }, k;
    for (k = days - 1; k >= 0; k--) D.push(istDay(k));
    ((R && R.rows) || []).forEach(function (x) { (M[x.day] = M[x.day] || {})[x.kind] = x.n; });
    D.forEach(function (d) { var m = M[d] || {}; for (var q in tot) tot[q] += (m[q] || 0); });
    var mx = 1; D.forEach(function (d) { var m = M[d] || {}; mx = Math.max(mx, m.view || 0, (m.call || 0) + (m.wa || 0)); });
    var W = 320, H = 130, base = H - 16, bw = W / D.length, bars = "";
    D.forEach(function (d, i) {
      var m = M[d] || {}, v = m.view || 0, c = (m.call || 0) + (m.wa || 0), x = i * bw, hv = v / mx * (base - 10), hc = c / mx * (base - 10);
      bars += '<rect x="' + (x + bw * .12).toFixed(1) + '" y="' + (base - hv).toFixed(1) + '" width="' + (bw * .4).toFixed(1) + '" height="' + Math.max(hv, v ? 2 : 0).toFixed(1) + '" rx="2" fill="#6b5cf0"><title>' + d + ': ' + v + '</title></rect>';
      bars += '<rect x="' + (x + bw * .52).toFixed(1) + '" y="' + (base - hc).toFixed(1) + '" width="' + (bw * .36).toFixed(1) + '" height="' + Math.max(hc, c ? 2 : 0).toFixed(1) + '" rx="2" fill="#1e9e57"><title>' + d + ': ' + c + '</title></rect>';
      if (i % (days > 7 ? 2 : 1) === 0 || i === days - 1) bars += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 3) + '" font-size="8.5" fill="#8a93a3" text-anchor="middle">' + (i === days - 1 ? T("आज", "today") : String(+d.slice(8))) + '</text>';
    });
    var tile = function (ic, n, t) { return '<div><i>' + ic + '</i><b>' + n + '</b><small>' + t + '</small></div>'; };
    return '<p style="margin:0 0 10px;font-weight:800;color:#123568">' + T("पिछले " + days + " दिन", "Last " + days + " days") + '</p>' +
      '<div class="pbe-rk">' + tile("👀", tot.view, T("ने देखा", "Views")) + tile("📞", tot.call, "Call") + tile("💬", tot.wa, "WhatsApp") + tile("🧭", tot.dir, T("रास्ता", "Directions")) + '</div>' +
      '<div class="pbe-gr"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="report">' + bars + '<line x1="0" x2="' + W + '" y1="' + base + '" y2="' + base + '" stroke="#e4eaf5"/></svg>' +
      '<div class="pbe-lg"><span><i style="background:#6b5cf0"></i>' + T("देखा", "Views") + '</span><span><i style="background:#1e9e57"></i>Call + WhatsApp</span></div></div>' +
      (days < 14 ? '<p class="pbe-note" style="margin-top:12px">💎 ' + T("Premium दुकान को 14 दिन की रिपोर्ट मिलती है।", "Premium shops get a 14-day report.") + '</p>' : '');
  }
  function premOnly(t) { sheet(t, '<p style="font-size:15px;line-height:1.6">💎 ' + T("यह सुविधा आपके plan में नहीं है। बड़ा plan लेने के लिए PataBook से बात करें।", "This is not in your plan. Contact PataBook to upgrade.") + '</p>'); }
  function editReport() {
    if (!has("report")) return premOnly("📊 " + T("दुकान की रिपोर्ट", "Shop report"));
    var s = sheet("📊 " + T("दुकान की रिपोर्ट", "Shop report"), '<p style="color:#5b6475">…</p>');
    rpc("pb_my_report", { p_slug: O.slug }).then(function (R) { s.body.innerHTML = reportBody(R); })
      .catch(function () { s.body.innerHTML = '<p class="pbe-er">' + T("रिपोर्ट नहीं खुल सकी। इंटरनेट जाँचकर फिर कोशिश करें।", "Could not load the report. Check internet and try again.") + '</p>'; });
  }
  /* 🔗 patabook.in/<नाम> — पहली बार चुनना + 1 बार बदलना */
  async function editLink() {
    var cur = (typeof LNK !== "undefined" && LNK) || {}, left = cur.left == null ? 2 : cur.left;
    if (cur.link && left <= 0) { sheet("🔗 " + T("आपका link", "Your link"), '<p>patabook.in/<b>' + E(cur.link) + '</b></p><p class="pbe-note">' + T("यह link बदला जा चुका है और अब नहीं बदल सकता। ज़रूरत हो तो Support से संपर्क करें।", "This link has already been changed and is now locked. Contact Support if needed.") + '</p>'); return; }
    var nm = ""; try { nm = (B && B.name) || ""; } catch (e) {}
    var start = cur.link || fix(nm);
    var s = sheet("🔗 " + T("आपका link", "Your link"),
      '<p style="margin:0 0 8px;color:#5b6475">' + (cur.link ? T("link बदलें — यह आख़िरी बदलाव होगा।", "Change your link — this is your last change.") : T("अपनी दुकान का छोटा link चुनें (space की जगह - लगेगा)।", "Choose your shop\'s short link (spaces become -).")) + '</p>' +
      '<div style="display:flex;align-items:center;gap:4px;font-weight:700">patabook.in/<input id="pbeLk" maxlength="30" autocomplete="off" autocapitalize="off" spellcheck="false" style="flex:1;min-width:0;font:inherit;border:1px solid #cfd6e4;border-radius:10px;padding:10px" value="' + E(start) + '"></div>' +
      '<div id="pbeLs" style="min-height:24px;margin:8px 0;font-weight:700"></div>' +
      '<button type="button" class="pbe-b p" id="pbeLgo" disabled>' + T("Save", "Save") + '</button><div class="pbe-er" id="pbeLe"></div>');
    var inp = s.body.querySelector("#pbeLk"), st = s.body.querySelector("#pbeLs"), go = s.body.querySelector("#pbeLgo"), er = s.body.querySelector("#pbeLe"), tm = null, okv = "";
    function fix(v) { return String(v || "").toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-+/, "").slice(0, 30); }
    function chk() {
      var v = fix(inp.value); if (v !== inp.value) inp.value = v; okv = ""; go.disabled = true; er.textContent = "";
      clearTimeout(tm);
      if (v.length < 3) { st.style.color = "#5b6475"; st.textContent = T("कम से कम 3 अक्षर", "At least 3 characters"); return; }
      if (cur.link && v === cur.link) { st.style.color = "#5b6475"; st.textContent = T("यही अभी का link है", "This is your current link"); return; }
      st.style.color = "#5b6475"; st.textContent = "…";
      tm = setTimeout(async function () {
        try {
          var r = await rpc("pb_link_check", { p_link: v });
          if (fix(inp.value) !== v) return;
          if (r && r.ok) { okv = v; go.disabled = false; st.style.color = "#1e9e57"; st.textContent = "✅ " + T("यह नाम मिल सकता है", "Available"); }
          else { st.style.color = "#c5221f"; st.textContent = "❌ " + (r && r.reason === "taken" ? T("यह नाम किसी और का है", "Already taken") : r && r.reason === "reserved" ? T("यह नाम साइट के लिए रखा है", "Reserved name") : T("सिर्फ़ a-z, 0-9 और -  (3 से 30 अक्षर)", "Only a-z, 0-9 and - (3 to 30 characters)")); }
        } catch (x) { st.style.color = "#c5221f"; st.textContent = T("जाँच नहीं हो सकी, फिर कोशिश करें।", "Could not check. Try again."); }
      }, 450);
    }
    inp.oninput = chk; chk();
    go.onclick = async function () {
      if (!okv) return;
      var after = Math.max(0, left - 1);
      var msg = T("आपका link बनेगा:\n\npatabook.in/" + okv + "\n\n" + (after > 0 ? "इसके बाद आप इसे सिर्फ़ " + after + " बार और बदल सकेंगे।" : "यह आख़िरी बदलाव है — इसके बाद link बदला नहीं जा सकेगा।") + "\n\nपक्का करें?",
        "Your link will be:\n\npatabook.in/" + okv + "\n\n" + (after > 0 ? "After this you can change it " + after + " more time." : "This is the last change — the link cannot be changed after this.") + "\n\nConfirm?");
      if (!confirm(msg)) return;
      go.disabled = true; er.style.color = "#5b6475"; er.textContent = T("Save हो रहा है…", "Saving…");
      try { await rpc("pb_owner_set_link", { p_slug: O.slug, p_link: okv }); s.dirty = false; s.remove(); location.reload(); }
      catch (x) {
        var m = x.message || ""; er.style.color = "";
        er.textContent = /link_taken/.test(m) ? T("यह नाम अभी किसी और ने ले लिया।", "Someone just took this name.") : /link_locked/.test(m) ? T("link बदलने की सीमा पूरी हो चुकी है।", "Change limit reached.") : /link_reserved/.test(m) ? T("यह नाम नहीं मिल सकता।", "This name is not allowed.") : T("Save नहीं हुआ, फिर कोशिश करें।", "Could not save. Try again.");
        go.disabled = false;
      }
    };
  }
  /* ✏️ एक ही Edit विंडो: ऊपर टैब (लोगो · प्रोडक्ट · गैलरी · जानकारी · नंबर · लिंक · क्या दिखे); हर टैब में वही पुराना editor */

  /* 🤖 AI सहायक: ✏️ दबाते ही सबसे पहले यही खुलता है — "मैं आपकी कैसे मदद करूँ?" */
  function bInfo() { try { return { shop: (B && B.name) || "", cat: (B && B.category) || "", sub: ln("Type") }; } catch (e) { return { shop: "", cat: "", sub: "" }; } }
  async function editAI() {
    var s = hubSheet("🤖 AI", ""), body = s.body, I = bInfo();
    s.close = s.close;
    function go(k) { if (HUB) HUB.go(k); }
    function bub(h) { return '<div style="background:#f1ebff;border-radius:16px 16px 16px 4px;padding:12px 14px;color:#2d1b69;margin-bottom:10px">' + h + '</div>'; }
    function btn(k, ic, t, sm) { return '<button type="button" data-ai="' + k + '" style="display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1.5px solid #e1d8fb;background:#fff;border-radius:14px;padding:11px 13px;margin-top:8px;font:inherit;cursor:pointer"><span style="font-size:22px">' + ic + '</span><span><b style="display:block;font-size:14.5px;color:#26145e">' + t + '</b><small style="color:#5b6475">' + sm + '</small></span></button>'; }
    var st = { prods: null, phs: null };
    try { var pl = await rpc("pb_my_products", { p_slug: O.slug }); st.prods = (pl || []).length; } catch (e) {}
    try { var ph = await rpc("pb_my_photos", { p_slug: O.slug }); st.phs = (ph || []).length; } catch (e) {}
    if (!HUB || HUB.cur !== s) return;
    var chk = [
      ["products", T("कम से कम 3 products / सेवाएँ", "At least 3 products / services"), st.prods == null ? null : st.prods >= 3],
      ["photos", T("कम से कम 3 Gallery फ़ोटो", "At least 3 gallery photos"), st.phs == null ? null : st.phs >= 3],
      ["svc", T("Services लिखी हैं", "Services written"), !!ln("Services")],
      ["details", T("दुकान का समय भरा है", "Timings filled"), !!ln("Hours")],
      ["numbers", T("Call / WhatsApp नंबर", "Call / WhatsApp number"), !!(n10(ln("Phone2")) || n10(ln("WhatsApp")) || n10(O.phone))]
    ].filter(function (c) { return c[2] !== null; });
    var done = chk.filter(function (c) { return c[2]; }).length, pct = chk.length ? Math.round(done * 100 / chk.length) : 0;
    function home() {
      body.innerHTML = bub("👋 <b>" + T("नमस्ते! मैं आपकी कैसे मदद करूँ?", "Hello! How may I help you?") + "</b><br><small>" + T("आप सिर्फ़ फ़ोटो चुनें या छोटे जवाब दें — बाकी मैं सँभाल लूँगा। आपके देखे बिना कुछ सेव नहीं होगा।", "Just pick photos or give short answers — I will do the rest. Nothing is saved without your approval.") + "</small>") +
        '<div style="margin:6px 0 4px;font-size:13px;color:#5b6475">' + T("आपकी profile कितनी पूरी है", "How complete your profile is") + ': <b style="color:#26145e">' + pct + '%</b></div>' +
        '<div style="height:8px;background:#eee8fb;border-radius:8px;overflow:hidden"><i style="display:block;height:100%;width:' + pct + '%;background:linear-gradient(90deg,#8b5cf6,#1e9e57)"></i></div>' +
        '<div style="margin:8px 0 2px">' + chk.map(function (c) { return '<div data-ai="' + (c[0] === "svc" ? "svc" : c[0]) + '" style="font-size:13px;padding:3px 0;color:' + (c[2] ? "#1e9e57" : "#b3261e") + ';cursor:pointer">' + (c[2] ? "✅ " : "⬜ ") + c[1] + '</div>'; }).join("") + '</div>' +
        btn("products", "📷", T("Product / सेवा की फ़ोटो जोड़ें", "Add product / service photos"), T("फ़ोटो चुनें — नाम, size और खूबियाँ AI भर देगा", "Pick a photo — AI fills name, size and features")) +
        btn("photos", "🖼️", T("Gallery की फ़ोटो", "Gallery photos"), T("दुकान / काम / टीम की फ़ोटो", "Shop, work or team photos")) +
        btn("svc", "✍️", T("अपनी सेवाएँ AI से लिखवाएँ", "Let AI write your services"), T("AI आपके काम के हिसाब से 3 सवाल पूछेगा", "AI asks 3 questions about your work")) +
        btn("details", "🏪", T("समय, पता और बाकी जानकारी", "Timings, address & details"), T("खुलने-बंद होने का समय, छुट्टी, website", "Opening hours, weekly off, website")) +
        btn("numbers", "📞", T("Call / WhatsApp नंबर", "Call / WhatsApp numbers"), T("ग्राहक किस नंबर पर बात करें", "Which numbers customers can use")) +
        btn("self", "✋", T("मैं ख़ुद बदलूँगा", "I will edit myself"), T("पीली ✏️ दबाकर हर हिस्सा बदलें", "Tap the yellow ✏️ on any part"));
    }
    var Q = [];
    async function svc() {
      body.innerHTML = bub("<b>🪄 " + T("AI सोच रहा है…", "AI is thinking…") + "</b>");
      var r = window.PBImg && PBImg.about ? await PBImg.about("ask", I, []) : null;
      if (!r || !r.qs || !r.qs.length) { body.innerHTML = bub(T("अभी AI उपलब्ध नहीं है। आप ‘जानकारी’ टैब में ख़ुद लिख सकते हैं।", "AI is not available right now. You can type it yourself in the ‘Details’ tab.")) + btn("back", "⬅️", T("वापस", "Back"), ""); return; }
      Q = r.qs;
      body.innerHTML = bub("<b>" + T("इन सवालों का छोटा जवाब दें", "Answer these briefly") + "</b>") + Q.map(function (q, k) { return '<label style="display:block;font-size:13.5px;margin-top:10px">' + E(q) + '</label><input class="aiA" data-k="' + k + '" maxlength="200" style="width:100%;box-sizing:border-box;padding:11px;border:1.5px solid #d9cffa;border-radius:12px;font:15px system-ui">'; }).join("") +
        '<button type="button" id="aiGo" style="margin-top:14px;width:100%;border:0;background:#6d3fe0;color:#fff;font:700 15px system-ui;border-radius:12px;padding:13px">✨ ' + T("लिखो", "Write it") + '</button>' + btn("back", "⬅️", T("वापस", "Back"), "");
      body.querySelector("#aiGo").onclick = write;
    }
    async function write() {
      var ans = [].map.call(body.querySelectorAll(".aiA"), function (i) { return { q: Q[+i.dataset.k], a: i.value.trim() }; }).filter(function (a) { return a.a; });
      if (!ans.length) { body.querySelector(".aiA").focus(); return; }
      var g = body.querySelector("#aiGo"); g.disabled = true; g.textContent = "⏳ …";
      var r = await PBImg.about("write", I, ans);
      if (!r || !r.services || !r.services.length) { g.disabled = false; g.textContent = T("AI से नहीं बन पाया — फिर दबाएँ", "AI could not write it — tap again"); return; }
      body.innerHTML = bub("<b>🪄 " + T("AI ने यह लिखा — देख लें", "AI wrote this — please check") + "</b>") + (r.about ? '<p style="font-size:13.5px;color:#4b3a85;margin:6px 0">' + E(r.about) + '</p>' : "") +
        '<textarea id="aiOut" maxlength="500" style="width:100%;box-sizing:border-box;min-height:80px;padding:11px;border:1.5px solid #d9cffa;border-radius:12px;font:15px system-ui">' + E(r.services.join(", ")) + '</textarea><div class="pbe-er" id="aiEr"></div>' +
        '<button type="button" id="aiUse" style="margin-top:8px;width:100%;border:0;background:#1e9e57;color:#fff;font:700 15px system-ui;border-radius:12px;padding:13px">✔ ' + T("यह रखें और Save करें", "Keep this and save") + '</button>' + btn("back", "⬅️", T("रहने दें", "Cancel"), "");
      body.querySelector("#aiUse").onclick = async function () {
        var v = body.querySelector("#aiOut").value.trim().slice(0, 500); if (!v) return; this.disabled = true;
        try { await rpc("pb_owner_set_details", { p_slug: O.slug, p: allLines({ Services: v }) }); HUB.reload = true; body.innerHTML = bub("✅ <b>" + T("Save हो गया!", "Saved!") + "</b><br><small>" + T("आपकी सेवाएँ पेज पर दिखने लगेंगी।", "Your services will show on your page.") + "</small>") + btn("back", "⬅️", T("वापस", "Back"), ""); }
        catch (x) { this.disabled = false; body.querySelector("#aiEr").textContent = T("Save नहीं हुआ। फिर कोशिश करें।", "Could not save. Try again."); }
      };
    }
    body.onclick = function (e) {
      var b = e.target.closest("[data-ai]"); if (!b) return; var k = b.dataset.ai;
      if (k === "svc") return svc(); if (k === "back") return home();
      if (k === "self") return HUB && HUB.close(true);
      go(k);
    };
    home();
  }
  var HUB = null;
  function hubTabs() {
    return [["ai", "🤖 AI", editAI], ["logo", "🖼️ " + T("लोगो", "Logo"), editLogo], ["products", "🛍️ " + T("प्रोडक्ट", "Products"), editProducts], ["photos", "🖼️ " + T("गैलरी", "Gallery"), editPhotos],
      ["details", "🏪 " + T("जानकारी", "Details"), function (arg) { editDetails("", arg || ""); }], ["numbers", "📞 " + T("नंबर", "Numbers"), editNumbers],
      ["link", "🔗 " + T("लिंक", "Link"), editLink], ["visible", "👁️ " + T("क्या दिखे", "Visibility"), editVisible]];
  }
  function hubSheet(title, html, onClose) {
    var h = HUB, o = { el: h.sc, body: h.body, dirty: false, changed: false };
    if (h.cur && h.cur.cleanup) h.cur.cleanup();
    h.body.innerHTML = html; h.body.style.padding = "";
    function onMsg(e) {
      if (e.origin !== location.origin || !e.data) return;
      if (e.data.pbEdit === "saved") { h.gone(); location.reload(); }
      else if (e.data.pbEdit === "dirty") o.dirty = true;
      else if (e.data.pbEdit === "clean") o.dirty = false;
    }
    window.addEventListener("message", onMsg);
    o.cleanup = function () { window.removeEventListener("message", onMsg); };
    o.remove = function () { o.cleanup(); if (h.cur === o) h.body.innerHTML = ""; };
    o.close = function (force) { h.close(force); };
    if (onClose) h.reload = true;
    h.cur = o; return o;
  }
  function openHub(key, arg) {
    var tabs = hubTabs();
    if (HUB && HUB.active) { HUB.go(key, arg); return; }
    var sc = document.createElement("div"); sc.className = "pbe-sc pbe-hub";
    sc.innerHTML = '<div class="pbe-sh"><div class="pbe-hd"><b>✏️ ' + T("अपनी दुकान बदलें", "Edit your shop") + '</b><button type="button" class="pbe-dn">✔ Done</button></div><div class="pbe-tabs">' +
      tabs.map(function (t) { return '<button type="button" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join("") + '</div><div class="pbe-bd"></div></div>';
    var h = HUB = { sc: sc, body: sc.querySelector(".pbe-bd"), active: true, cur: null, reload: false };
    h.gone = function () { if (h.cur && h.cur.cleanup) h.cur.cleanup(); sc.remove(); h.active = false; HUB = null; };
    h.close = function (force) {
      if (!force && h.cur && h.cur.dirty && !confirm(T("बदलाव Save नहीं हुए। फिर भी बंद करें?", "Changes are not saved. Close anyway?"))) return;
      var rl = h.reload; h.gone(); if (rl) location.reload();
    };
    h.go = function (k, a) {
      if (h.cur && h.cur.dirty && !confirm(T("इस टैब के बदलाव Save नहीं हुए। फिर भी दूसरे टैब पर जाएँ?", "This tab has unsaved changes. Switch anyway?"))) return;
      if (h.cur && h.cur.cleanup) h.cur.cleanup(); h.cur = null;
      sc.querySelectorAll(".pbe-tabs button").forEach(function (b) { b.classList.toggle("on", b.dataset.t === k); });
      var on = sc.querySelector('.pbe-tabs button[data-t="' + k + '"]'); if (on && on.scrollIntoView) { try { on.scrollIntoView({ inline: "center", block: "nearest" }); } catch (e) {} }
      h.body.innerHTML = '<p style="color:#5b6475">…</p>'; h.body.style.padding = "";
      var t = tabs.filter(function (x) { return x[0] === k; })[0]; if (t) { try { t[2](a); } catch (e) { h.body.innerHTML = '<p class="pbe-er">' + T("खुल नहीं सका, फिर कोशिश करें।", "Could not open. Try again.") + '</p>'; } }
    };
    sc.querySelector(".pbe-dn").onclick = function () { h.close(); };
    sc.addEventListener("click", function (e) { if (e.target === sc) h.close(); var b = e.target.closest && e.target.closest("[data-t]"); if (b) h.go(b.dataset.t); });
    document.body.appendChild(sc);
    h.go(key, arg);
  }
  var ACT = { link: function () { openHub("link"); }, logo: function () { openHub("logo"); }, products: function () { openHub("products"); }, photos: function () { openHub("photos"); }, details: function () { openHub("details"); }, about: function () { openHub("details", "about"); }, visit: function () { openHub("details", "visit"); }, numbers: function () { openHub("numbers"); }, vacancy: editVacancy, visible: function () { openHub("visible"); }, report: editReport };

  /* ---------- pencils ---------- */
  var MAP = {
    shop: [[".hlogo", "logo"], ["#prods", "products"], ["#photos", "photos"], ["#about", "about"], ["#visit", "visit"], ["#contact", "numbers"], [".qa", "numbers"], ["#vacFlag", "vacancy"]],
    biz: [[".lgw", "logo"], ["#prods", "products"], ["#galM", "photos"], ["#det", "details"], ["#lnkRow", "link"], ["#contact", "numbers"], [".qa3", "numbers"], ["#vacFlag", "vacancy"]]
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
    var b = document.getElementById("pbeBtn"); if (b) b.innerHTML = ON ? "✔ " + T("हो गया", "Done") : '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg> ' + T("Edit", "Edit");
    try { sessionStorage.setItem("pbe-on-" + O.slug, ON ? "1" : ""); } catch (e) {}
    if (ON) pens();
  }
  function start(o) {
    if (O || !o || !o.slug || !o.row) return;
    O = { slug: o.slug, page: o.page, show_phone: o.row.show_phone, phone: o.row.phone || "" };
    var host = o.page === "shop" ? document.querySelector(".top .wrap") : document.querySelector("header .nav");
    var lang = document.getElementById("pbLang");
    var btn = document.createElement("button"); btn.type = "button"; btn.id = "pbeBtn"; btn.className = "pbe-btn"; btn.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg> ' + T("Edit", "Edit");
    btn.onclick = function () { var was = ON; toggle(); if (!was && ON) openHub("ai"); };
    if (host && lang && lang.parentNode === host) host.insertBefore(btn, lang); else if (host) host.appendChild(btn);
    /* नीचे वाली काली पट्टी हटा दी — हर हिस्से की पीली ✏️ से बदलें */
    new MutationObserver(function () { if (ON) pens(); }).observe(document.body, { childList: true, subtree: true });
    var keep = false; try { keep = sessionStorage.getItem("pbe-on-" + O.slug) === "1"; } catch (e) {}
    if (location.hash === "#edit") { keep = true; try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} }
    if (keep) toggle(true);
  }
  window.PBEdit = { start: start, act: function (k) { if (O && ACT[k]) ACT[k](); } };
})();
