/* PataBook — 💼 नौकरी (Vacancy)
   PBHire.tile(px)            → नारंगी HIRING icon (design B)
   PBHire.top(on, opts)       → ऊपर भाषा वाले button के पास निशान; दबाने पर नौकरी की जानकारी (sql-26)
       opts = { slug, call: "98…", wa: "9198…", own: true/false, onEdit: fn, onContact: fn }
   PBHire.editor(slug, rpc, done) → दुकानदार: नौकरी की जानकारी लिखे / बंद करे
   page का link #hiring हो तो जानकारी अपने-आप खुले (search से आने पर) */
(function () {
  var SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
  var css = document.createElement("style");
  css.textContent =
    ".pbh-t{position:relative;flex:none;display:grid;place-items:center;border-radius:28%;background:radial-gradient(circle at 30% 25%,#ffb36b,#e8590c 72%);" +
    "box-shadow:inset -3px -4px 8px rgba(0,0,0,.18),inset 3px 3px 7px rgba(255,255,255,.5),0 8px 14px -7px #e8590c}" +
    ".pbh-t svg{width:52%;height:52%}" +
    ".pbh-t .rb{position:absolute;bottom:-18%;left:50%;transform:translateX(-50%);background:#12141c;color:#ffd21f;font-weight:900;letter-spacing:.05em;border-radius:999px;white-space:nowrap;border:2px solid #fff;line-height:1.25}" +
    ".pbh-top{flex:none;border:0;background:none;padding:0 0 6px;margin:0 2px;cursor:pointer;-webkit-tap-highlight-color:transparent}" +
    ".pbh-top:active .pbh-t{transform:translateY(-2px)}" +
    ".pbh-sc{position:fixed;inset:0;z-index:9995;background:rgba(10,20,40,.5);display:flex;align-items:flex-end;justify-content:center}" +
    ".pbh-sh{width:100%;max-width:560px;max-height:90vh;overflow:auto;background:#fff;border-radius:22px 22px 0 0;padding:16px 16px calc(18px + env(safe-area-inset-bottom));font-family:inherit;color:#12141c}" +
    "@media(min-width:640px){.pbh-sc{align-items:center}.pbh-sh{border-radius:22px}}" +
    ".pbh-hd{display:flex;align-items:center;gap:12px;margin-bottom:12px}.pbh-hd b{display:block;font-size:18px}.pbh-hd small{display:block;font-size:12.5px;color:#5b6475;margin-top:2px}" +
    ".pbh-hd .x{margin-left:auto;flex:none;width:34px;height:34px;border-radius:50%;border:0;background:#f1f4f9;font-size:15px;cursor:pointer}" +
    ".pbh-rl{font-size:21px;font-weight:900;color:#c2410c;margin:4px 2px 10px}" +
    ".pbh-g{display:grid;grid-template-columns:1fr 1fr;gap:8px}.pbh-g div{background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;padding:10px 12px}" +
    ".pbh-g small{display:block;font-size:12px;color:#9a3412;font-weight:700}.pbh-g b{display:block;font-size:15px;margin-top:2px}" +
    ".pbh-nd{margin-top:10px;background:#f8fafc;border:1px solid #e4eaf5;border-radius:14px;padding:12px;font-size:14.5px;line-height:1.55;white-space:pre-wrap}" +
    ".pbh-nd small{display:block;font-size:12px;color:#5b6475;font-weight:700;margin-bottom:4px;white-space:normal}" +
    ".pbh-bt{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.pbh-bt a,.pbh-bt button{display:flex;align-items:center;justify-content:center;gap:6px;border:0;border-radius:14px;padding:13px;font:inherit;font-weight:800;font-size:15px;text-decoration:none;cursor:pointer}" +
    ".pbh-bt .c{background:#1a73e8;color:#fff}.pbh-bt .w{background:#25a244;color:#fff}.pbh-bt .one{grid-column:1/-1}" +
    ".pbh-ed{width:100%;margin-top:10px;border:1.5px dashed #f59e0b;background:#fffbeb;color:#92400e;border-radius:14px;padding:11px;font:inherit;font-weight:800;cursor:pointer}" +
    ".pbh-f{display:block;font-size:12.5px;font-weight:700;color:#5b6475;margin:11px 2px 5px}" +
    ".pbh-in{width:100%;border:1.5px solid #e4eaf5;border-radius:12px;padding:11px 12px;font:inherit;font-size:15px;background:#fbfcfe;box-sizing:border-box}.pbh-in:focus{outline:0;border-color:#1a73e8;background:#fff}" +
    "textarea.pbh-in{min-height:90px;resize:vertical}.pbh-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}" +
    ".pbh-sv{width:100%;margin-top:14px;border:0;border-radius:14px;padding:14px;font:inherit;font-size:15.5px;font-weight:800;background:#e8590c;color:#fff;cursor:pointer}.pbh-sv:disabled{opacity:.6}" +
    ".pbh-off{width:100%;margin-top:8px;border:0;border-radius:14px;padding:12px;font:inherit;font-weight:800;background:#f1f4f9;color:#5b6475;cursor:pointer}" +
    ".pbh-er{color:#c5221f;font-size:13px;font-weight:700;margin-top:8px}";
  document.head.appendChild(css);
  var BAG = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7.5" width="18" height="12.5" rx="2.2"/><path d="M9 7.5V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2M3 13h18"/></svg>';
  function tile(px) {
    px = px || 64;
    var fs = Math.max(7, Math.round(px * 0.15));
    return '<span class="pbh-t" style="width:' + px + 'px;height:' + px + 'px">' + BAG + '<span class="rb" style="font-size:' + fs + 'px;padding:0 ' + Math.round(fs * 0.7) + 'px">HIRING</span></span>';
  }
  function en() { try { return !!(window.PB && PB.lang && PB.lang() !== "hi"); } catch (e) { return false; } }
  function T(h, e) { return en() ? e : h; }
  function E(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function sheet(html) {
    var sc = document.createElement("div"); sc.className = "pbh-sc";
    sc.innerHTML = '<div class="pbh-sh">' + html + '</div>';
    sc.addEventListener("click", function (e) { if (e.target === sc || e.target.closest(".x")) sc.remove(); });
    document.body.appendChild(sc); return sc;
  }
  var OPTS = null;
  async function job(slug) {
    try {
      var r = await fetch(SB + "/rest/v1/rpc/pb_vacancy_job", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_slug: slug }) });
      return r.ok ? await r.json() : null;
    } catch (e) { return null; }
  }
  async function show(o) {
    o = o || OPTS; if (!o || !o.slug) return;
    var sc = sheet('<div class="pbh-hd">' + tile(54) + '<div><b>' + T("नौकरी खाली है", "We're hiring") + '</b><small>' + E(o.name || "") + '</small></div><button type="button" class="x" aria-label="Close">✕</button></div><p style="color:#5b6475">…</p>');
    var j = await job(o.slug), body = "";
    if (j && j.role) {
      var g = [[T("कितने लोग", "People needed"), j.count ? String(j.count) : ""], [T("पगार", "Salary"), j.salary || ""], [T("समय", "Timing"), j.timing || ""],
               [T("आख़िरी तारीख", "Open till"), j.until ? new Date(j.until).toLocaleDateString(en() ? "en-IN" : "hi-IN", { day: "numeric", month: "short" }) : ""]].filter(function (x) { return x[1]; });
      body = '<div class="pbh-rl">💼 ' + E(j.role) + '</div>' +
        (g.length ? '<div class="pbh-g">' + g.map(function (x) { return '<div><small>' + E(x[0]) + '</small><b>' + E(x[1]) + '</b></div>'; }).join("") + '</div>' : "") +
        (j.need ? '<div class="pbh-nd"><small>' + T("कैसा व्यक्ति चाहिए", "Who we are looking for") + '</small>' + E(j.need) + '</div>' : "");
    } else {
      body = '<p style="font-size:15px;line-height:1.55">' + T("यह दुकान स्टाफ़ ढूँढ रही है। जानकारी के लिए दुकान से संपर्क करें।", "This shop is hiring. Contact the shop for details.") + '</p>';
    }
    var msg = encodeURIComponent(T("नमस्ते, PataBook पर देखा कि आपकी दुकान में नौकरी खाली है", "Hello, I saw on PataBook that you are hiring") + (j && j.role ? " (" + j.role + ")" : "") + T("। मुझे जानकारी चाहिए।", ". I'd like to know more."));
    var bt = (o.call ? '<a class="c' + (o.wa ? "" : " one") + '" href="tel:' + E(o.call) + '">📞 ' + T("Call करें", "Call") + '</a>' : "") +
             (o.wa ? '<a class="w' + (o.call ? "" : " one") + '" href="https://wa.me/' + E(o.wa) + '?text=' + msg + '" target="_blank" rel="noopener">💬 WhatsApp</a>' : "") ||
             (o.onContact ? '<button type="button" class="c one" id="pbhCt">📞 ' + T("दुकान से संपर्क करें", "Contact the shop") + '</button>' : "");
    sc.querySelector(".pbh-sh").innerHTML = '<div class="pbh-hd">' + tile(54) + '<div><b>' + T("नौकरी खाली है", "We're hiring") + '</b><small>' + E(o.name || "") + '</small></div><button type="button" class="x" aria-label="Close">✕</button></div>' +
      body + (bt ? '<div class="pbh-bt">' + bt + '</div>' : "") + ((typeof o.own === "function" ? o.own() : o.own) && o.onEdit ? '<button type="button" class="pbh-ed" id="pbhEd">✏️ ' + T("नौकरी की जानकारी बदलें", "Edit job details") + '</button>' : "");
    var ct = sc.querySelector("#pbhCt"); if (ct) ct.onclick = function () { sc.remove(); o.onContact(); };
    var ed = sc.querySelector("#pbhEd"); if (ed) ed.onclick = function () { sc.remove(); o.onEdit(); };
  }
  function top(on, o) {
    if (o) OPTS = o;
    var b = document.getElementById("pbhTop"), lang = document.getElementById("pbLang");
    if (!on) { if (b) b.remove(); return; }
    if (!lang || !lang.parentNode) return;
    if (!b) {
      b = document.createElement("button"); b.type = "button"; b.id = "pbhTop"; b.className = "pbh-top";
      b.innerHTML = tile(36);
      b.onclick = function () { show(); };
      lang.parentNode.insertBefore(b, lang);
      if (location.hash === "#hiring" && !window.__pbhAuto) { window.__pbhAuto = 1; setTimeout(function () { show(); }, 400); }
    }
    b.setAttribute("aria-label", T("नौकरी खाली है — जानकारी देखें", "Hiring — see job details"));
    b.title = b.getAttribute("aria-label");
  }
  /* दुकानदार: लिखें / बदलें / बंद करें.  rpc(fn,args) पेज का अपना (login वाला) */
  async function editor(slug, rpc, done) {
    var cur = null; try { cur = await rpc("pb_my_vacancy_job", { p_slug: slug }); } catch (e) {}
    cur = cur || {};
    var sc = sheet('<div class="pbh-hd">' + tile(48) + '<div><b>' + T("नौकरी की जानकारी", "Job details") + '</b><small>' + T("ग्राहक ऊपर HIRING निशान दबाकर यह देखेंगे · 30 दिन चालू", "Customers see this from the HIRING icon · on for 30 days") + '</small></div><button type="button" class="x" aria-label="Close">✕</button></div>' +
      '<label class="pbh-f" for="pbhR">' + T("कौन-सा काम? *", "Which job? *") + '</label><input class="pbh-in" id="pbhR" maxlength="60" placeholder="' + T("जैसे: Delivery boy, Salesman, Packing staff", "e.g. Delivery boy, Salesman, Packing staff") + '" value="' + E(cur.role || "") + '">' +
      '<div class="pbh-2"><div><label class="pbh-f" for="pbhC">' + T("कितने लोग", "How many") + '</label><input class="pbh-in" id="pbhC" inputmode="numeric" maxlength="2" placeholder="1" value="' + E(cur.count || "") + '"></div>' +
      '<div><label class="pbh-f" for="pbhS">' + T("पगार", "Salary") + '</label><input class="pbh-in" id="pbhS" maxlength="60" placeholder="₹12,000 / ' + T("महीना", "month") + '" value="' + E(cur.salary || "") + '"></div></div>' +
      '<label class="pbh-f" for="pbhTm">' + T("समय", "Timing") + '</label><input class="pbh-in" id="pbhTm" maxlength="60" placeholder="' + T("जैसे: सुबह 9 से शाम 7", "e.g. 9 AM to 7 PM") + '" value="' + E(cur.timing || "") + '">' +
      '<label class="pbh-f" for="pbhN">' + T("कैसा व्यक्ति चाहिए", "Who are you looking for") + '</label><textarea class="pbh-in" id="pbhN" maxlength="500" placeholder="' + T("जैसे: Bike चलाना आता हो, 10वीं पास, Gandhidham के पास रहता हो", "e.g. Can ride a bike, 10th pass, lives near Gandhidham") + '">' + E(cur.need || "") + '</textarea>' +
      '<div class="pbh-er" id="pbhE"></div><button type="button" class="pbh-sv" id="pbhSv">✔ ' + T("Save करें और चालू करें", "Save & turn on") + '</button>' +
      (cur.open ? '<button type="button" class="pbh-off" id="pbhOff">' + T("नौकरी भर गई — बंद करें", "Job filled — turn off") + '</button>' : ""));
    var q = function (id) { return sc.querySelector("#" + id); };
    q("pbhSv").onclick = async function () {
      var role = q("pbhR").value.trim(); if (role.length < 2) { q("pbhE").textContent = T("कौन-सा काम है, लिखें।", "Write which job it is."); q("pbhR").focus(); return; }
      this.disabled = true; q("pbhE").textContent = "";
      try { await rpc("pb_set_vacancy_job", { p_slug: slug, p: { role: role, count: q("pbhC").value, salary: q("pbhS").value, timing: q("pbhTm").value, need: q("pbhN").value } }); sc.remove(); if (done) done(true); }
      catch (x) {
        if (/could not find|PGRST202|404/i.test(x.message || "")) { try { await rpc("pb_set_vacancy", { p_slug: slug, p_on: true }); sc.remove(); if (done) done(true); return; } catch (y) {} }   /* sql-26 अभी नहीं: सिर्फ़ ON */
        this.disabled = false; q("pbhE").textContent = T("❌ Save नहीं हुआ। फिर कोशिश करें।", "❌ Could not save. Try again."); }
    };
    var off = q("pbhOff"); if (off) off.onclick = async function () { off.disabled = true; try { await rpc("pb_set_vacancy", { p_slug: slug, p_on: false }); sc.remove(); if (done) done(false); } catch (x) { off.disabled = false; } };
  }
  window.PBHire = { tile: tile, top: top, show: show, editor: editor };
})();
