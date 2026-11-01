/* PataBook — दुकानदार डैशबोर्ड (अभी सिर्फ़ Tejwani Detergent And Chemical के लिए)
   mybusiness.html "मेरी दुकान" में पुराने कार्ड के ऊपर दिखता है। असली डेटा; English default.
   PBTejDash.SLUG        — जिस दुकान के लिए चालू है
   PBTejDash.html(ctx)   — ctx = {en,b,i,tier,until,pct,status,ph:{feature:bool}}
   PBTejDash.load(slug,cb) — रेटिंग/ID/Verified एक बार लाकर cb() बुलाता है */
(function () {
  var SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
  var SLUG = "tejwani-detergent-and-chemical-gandhidham-31oyn";
  var X = null, ASKED = false;
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function css() {
    if (document.getElementById("tdCss")) return;
    var s = document.createElement("style"); s.id = "tdCss";
    s.textContent =
      ".td{margin:0 0 22px;color:#172033}.td *{box-sizing:border-box}" +
      ".td-eb{color:#2563eb;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}" +
      ".td-h{font-size:22px;font-weight:800;margin:2px 0 4px}.td-sub{color:#687386;font-size:13px;margin-bottom:14px}" +
      ".td-shop{background:linear-gradient(120deg,#14264b,#1e4786);color:#fff;border-radius:20px;padding:20px;margin-bottom:14px}" +
      ".td-sh{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}" +
      ".td-shop h2{margin:0;font-size:19px}.td-shop p{margin:4px 0 0;font-size:13px;opacity:.85}" +
      ".td-pill{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.35);border-radius:999px;padding:6px 12px;font-size:12px;font-weight:800;white-space:nowrap}" +
      ".td-meta{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:14px;font-size:12.5px;opacity:.92}" +
      ".td-st{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}" +
      ".td-s{background:#fff;border:1px solid #e7ebf2;border-radius:14px;padding:13px}.td-s small{display:block;color:#687386;font-size:12px}" +
      ".td-s strong{display:block;font-size:20px;margin:3px 0}.td-s em{font-style:normal;color:#687386;font-size:11.5px}" +
      ".td-sec{margin:20px 0 10px}.td-sec h3{margin:0;font-size:17px}.td-sec p{margin:3px 0 0;color:#687386;font-size:12px}" +
      ".td-g{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}" +
      ".td-t{background:#fff;border:1px solid #e7ebf2;border-radius:15px;padding:14px;display:flex;gap:12px;align-items:flex-start;min-width:0}" +
      ".td-i{width:40px;height:40px;border-radius:12px;background:#eef3ff;display:flex;align-items:center;justify-content:center;font-size:20px;flex:none}" +
      ".td-t h4{margin:0 0 3px;font-size:14px}.td-t p{margin:0 0 6px;color:#687386;font-size:12px;line-height:1.35}" +
      ".td-tag{display:inline-block;font-size:11px;font-weight:800;border-radius:999px;padding:3px 9px;background:#e3f7ea;color:#13845b}" +
      ".td-tag.off{background:#f1f3f7;color:#687386}" +
      ".td-m{background:#fff;border:1px solid #e7ebf2;border-radius:18px;overflow:hidden}" +
      ".td-mt{padding:15px 16px;display:flex;justify-content:space-between;gap:12px;align-items:center;border-bottom:1px solid #e7ebf2}" +
      ".td-mt h3{margin:0;font-size:16px}.td-mt p{margin:3px 0 0;color:#687386;font-size:12px}" +
      ".td-pl{display:grid;grid-template-columns:repeat(3,1fr)}" +
      ".td-p{padding:15px;border-inline-end:1px solid #e7ebf2;position:relative}.td-p:last-child{border-inline-end:0}" +
      ".td-p.cur{background:#f3f7ff;box-shadow:inset 0 0 0 2px #2563eb}" +
      ".td-p h4{margin:0 0 4px;font-size:14px}.td-p ul{margin:8px 0 0;padding-inline-start:16px;font-size:12px;color:#44506a;line-height:1.55}" +
      ".td-cl{display:inline-block;background:#2563eb;color:#fff;font-size:10.5px;font-weight:800;border-radius:999px;padding:2px 8px;margin-bottom:6px}" +
      ".td-b{display:inline-flex;align-items:center;gap:6px;background:#2563eb;color:#fff;font-weight:700;font-size:13px;border-radius:10px;padding:9px 14px}" +
      ".td-b.lt{background:#eef3ff;color:#1d4ed8}" +
      ".td-ft{padding:11px 16px;color:#687386;font-size:11.5px;border-top:1px solid #e7ebf2}" +
      "@media(max-width:700px){.td-st{grid-template-columns:repeat(2,1fr)}.td-g{grid-template-columns:1fr}.td-pl{grid-template-columns:1fr}.td-p{border-inline-end:0;border-bottom:1px solid #e7ebf2}.td-p:last-child{border-bottom:0}.td-h{font-size:19px}}";
    document.head.appendChild(s);
  }
  function load(slug, cb) {
    if (ASKED) return; ASKED = true;
    function ok(j) { X = j || {}; try { cb && cb(); } catch (e) {} }
    fetch(SB + "/rest/v1/businesses?select=rating,review_count,is_verified,home_service,business_code,category,address&slug=eq." + encodeURIComponent(slug), { headers: { apikey: KEY, Authorization: "Bearer " + KEY } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (a) {
        if (a && a[0]) return ok(a[0]);
        return fetch(SB + "/rest/v1/businesses?select=business_code,category&slug=eq." + encodeURIComponent(slug), { headers: { apikey: KEY, Authorization: "Bearer " + KEY } })
          .then(function (r) { return r.ok ? r.json() : null; }).then(function (a2) { ok(a2 && a2[0]); });
      }).catch(function () { X = {}; });
  }
  function fmtDate(u, en) {
    try { var d = new Date(u); if (isNaN(d)) return ""; return d.toLocaleDateString(en ? "en-IN" : "hi-IN", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return ""; }
  }
  function html(c) {
    css();
    var en = c.en, b = c.b, T = function (e, h) { return esc(en ? e : h); }, x = X || {};
    var tn = (window.PBPlan ? PBPlan.name(c.tier, en) : c.tier), TN = String(tn).toUpperCase();
    var paid = c.tier !== "free";
    var stTxt = c.status === "live" ? (en ? "Live" : "लाइव") : c.status === "pend" ? (en ? "Pending" : "मंज़ूरी बाकी") : (en ? "Offline" : "ऑफ़लाइन");
    var stSub = c.status === "live" ? (en ? "✓ Visible to the public" : "✓ सबको दिख रही है") : c.status === "pend" ? (en ? "PataBook is checking" : "PataBook जाँच रहा है") : (en ? "Only you can see it" : "सिर्फ़ आपको दिखती है");
    var until = paid && c.until ? fmtDate(c.until, en) : "";
    var rat = x.rating ? "★ " + esc(x.rating) : (en ? "—" : "—");
    var ratSub = x.rating ? (x.review_count ? esc(x.review_count) + (en ? " reviews" : " समीक्षाएँ") : "") : (en ? "No rating yet" : "अभी कोई रेटिंग नहीं");
    var ph = c.ph || {};
    function tileX(ic, e1, h1, e2, h2, on, onE, onH, offE, offH) {
      return '<article class="td-t"><div class="td-i">' + ic + '</div><div><h4>' + T(e1, h1) + '</h4><p>' + T(e2, h2) + '</p><span class="td-tag' + (on ? '' : ' off') + '">' + T(on ? onE : offE, on ? onH : offH) + '</span></div></article>';
    }
    var st = c.status, canSw = st === "live" || st === "off", pct = c.pct, done = pct == null || pct >= 100;
    var box = function (ic, h, body) { return '<article class="td-t"><div class="td-i">' + ic + '</div><div style="min-width:0;flex:1"><h4>' + h + '</h4>' + body + '</div></article>'; };
    var swBox = box("🟢", T("Online / Offline", "ऑनलाइन / ऑफ़लाइन"),
      canSw ? '<p>' + T(st === "live" ? "Customers can see your shop." : "Hidden from customers.", st === "live" ? "ग्राहकों को आपकी दुकान दिख रही है।" : "ग्राहकों से छिपी है।") + '</p><div style="display:flex;align-items:center;gap:10px"><button type="button" class="tsw" role="switch" aria-checked="' + (st === "live") + '" aria-label="Online / Offline" data-tsw="' + c.i + '"></button><b style="font-size:13px">' + T(st === "live" ? "Online" : "Offline", st === "live" ? "ऑनलाइन" : "ऑफ़लाइन") + '</b></div><div class="err" id="sub' + c.i + '" style="font-size:11.5px"></div>'
        : st === "pend" ? '<p>' + T("PataBook is checking your shop.", "PataBook आपकी दुकान जाँच रहा है।") + '</p><span class="td-tag off">⏳ ' + T("Waiting for approval", "मंज़ूरी का इंतज़ार") + '</span>'
        : '<p>' + T("Your shop is not live yet.", "आपकी दुकान अभी लाइव नहीं है।") + '</p><span class="td-tag off">🔴 Offline</span>');
    var lkBox = box("🔗", T("Your shop link", "आपकी दुकान का लिंक"),
      '<p>' + (c.link ? '<b>patabook.in/' + esc(c.link) + '</b>' : T("No custom link yet.", "अभी अपना लिंक नहीं बना।")) + '</p><button type="button" class="td-b lt" data-lk="' + c.i + '">✏️ ' + T(c.link ? "Change link" : "Create link", c.link ? "लिंक बदलें" : "लिंक बनाएँ") + '</button>');
    var lgBox = box("🖼️", T("Shop logo", "दुकान का लोगो"),
      ph.logo ? '<p>' + (c.logo ? '<img src="' + esc(c.logo) + '" alt="" style="width:44px;height:44px;border-radius:10px;object-fit:cover;vertical-align:middle;margin-inline-end:8px">' : '') + T(c.logo ? "Your logo is set." : "No logo added yet.", c.logo ? "आपका लोगो लगा है।" : "अभी लोगो नहीं लगाया।") + '</p><a class="td-b lt" href="business.html?slug=' + encodeURIComponent(b.slug) + '#edit">' + T(c.logo ? "Change logo ›" : "Add logo ›", c.logo ? "लोगो बदलें ›" : "लोगो जोड़ें ›") + '</a>'
        : '<p>' + T("Logo is not in your plan.", "लोगो आपके प्लान में नहीं है।") + '</p><span class="td-tag off">' + T("Not in your plan", "प्लान में नहीं") + '</span>');
    var apBox = box("📋", T("Profile & approval", "प्रोफ़ाइल और मंज़ूरी"),
      '<p>' + T("Profile ", "प्रोफ़ाइल ") + (pct == null ? "—" : pct + "%") + T(" complete", " पूरी") + '</p>' +
      (!done ? '<button type="button" class="td-b" data-setprof="' + c.i + '">' + T("Complete profile ›", "प्रोफ़ाइल पूरी करें ›") + '</button>'
        : st === "live" ? '<span class="td-tag">✓ ' + T("Approved & live", "मंज़ूर और लाइव") + '</span>'
        : st === "pend" ? '<span class="td-tag off">⏳ ' + T("Sent for approval", "मंज़ूरी के लिए भेजी") + '</span>'
        : st === "draft" ? '<button type="button" class="td-b" data-submit="' + c.i + '">📤 ' + T("Send for approval", "मंज़ूरी के लिए भेजें") + '</button>'
        : '<span class="td-tag off">' + T("Profile complete", "प्रोफ़ाइल पूरी") + '</span>'));
    var ctl = '<div class="td-sec"><h3>' + T("Shop controls", "दुकान कंट्रोल") + '</h3><p>' + T("Your logo and approval.", "आपका लोगो और मंज़ूरी।") + '</p></div><div class="td-g">' + lgBox + apBox + '</div>';
    var feats = [
      tileX("📞", "Call & WhatsApp", "कॉल और WhatsApp", "Customers can call or message you directly.", "ग्राहक सीधे फ़ोन या WhatsApp कर सकते हैं।", !!b.phone, "Active", "चालू है", "Add a number", "नंबर जोड़ें"),
      tileX("🖼️", "Business Photos", "दुकान की फ़ोटो", "Show your shop and products.", "दुकान और प्रोडक्ट की फ़ोटो दिखाएँ।", !!ph.photos, "Active", "चालू है", "Not in your plan", "प्लान में नहीं"),
      tileX("🏷️", "Logo", "लोगो", "Your logo on your public profile.", "आपके प्रोफ़ाइल पर आपका लोगो।", !!ph.logo, "Active", "चालू है", "Not in your plan", "प्लान में नहीं"),
      tileX("📦", "Products", "प्रोडक्ट्स", "List what you sell.", "जो बेचते हैं उसकी सूची।", !!ph.products, "Active", "चालू है", "Not in your plan", "प्लान में नहीं"),
      tileX("🌐", "Website & Social Links", "वेबसाइट और सोशल लिंक", "Add your website and Instagram.", "वेबसाइट और Instagram जोड़ें।", !!ph.social, "Active", "चालू है", "Not in your plan", "प्लान में नहीं"),
      tileX("🛡️", "Verified", "वेरिफ़ाइड", "A trust badge on your profile.", "प्रोफ़ाइल पर भरोसे का निशान।", !!x.is_verified, "Verified", "वेरिफ़ाइड", "Not verified yet", "अभी वेरिफ़ाइड नहीं"),
      tileX("👥", "Hiring", "भर्ती", "Post job openings.", "नौकरी की जगहें डालें।", !!ph.hiring, "Active", "चालू है", "Not in your plan", "प्लान में नहीं"),
      tileX("📊", "Reports", "रिपोर्ट", "Views, calls and enquiries.", "Views, कॉल और enquiries देखें।", !!ph.report, "Active", "चालू है", "Not in your plan", "प्लान में नहीं")
    ].join("");
    function lim(t, k) { return window.PBPlan ? PBPlan.limT(t, k) : 0; }
    function has(t, f) { return window.PBPlan ? PBPlan.hasT(t, f) : false; }
    function plan(t) {
      var cur = t === c.tier, li = [];
      li.push(en ? "Business listing" : "बिज़नेस लिस्टिंग");
      if (lim(t, "photos")) li.push((en ? "Up to " : "अधिकतम ") + lim(t, "photos") + (en ? " photos" : " फ़ोटो"));
      if (lim(t, "products")) li.push((en ? "Up to " : "अधिकतम ") + lim(t, "products") + (en ? " products" : " प्रोडक्ट"));
      if (has(t, "logo")) li.push(en ? "Logo" : "लोगो");
      if (has(t, "hiring")) li.push(en ? "Hiring posts" : "भर्ती पोस्ट");
      if (has(t, "report")) li.push(en ? "Reports" : "रिपोर्ट");
      if (has(t, "banner")) li.push(en ? "Banner" : "बैनर");
      return '<div class="td-p' + (cur ? ' cur' : '') + '">' + (cur ? '<span class="td-cl">' + T("Your plan", "आपका प्लान") + '</span>' : '') + '<h4>' + esc(PBPlan.name(t, en).toUpperCase()) + '</h4><ul>' + li.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + '</ul></div>';
    }
    var plans = window.PBPlan ? ["free", "gold", "platinum"].map(plan).join("") : "";
    var city = ""; try { city = (x.address || b.address || "").split(",").slice(-1)[0].trim(); } catch (e) {}
    return '<section class="td" aria-label="' + T("Shop dashboard", "दुकान डैशबोर्ड") + '">' +
      '<div class="td-g" style="margin-bottom:14px">' + swBox + lkBox + '</div>' +
      '<div class="td-shop"><div class="td-sh"><div><h2>' + esc(b.name) + '</h2><p>' + esc([x.category || b.category, city].filter(Boolean).join(" · ")) + '</p></div>' +
      '<div class="td-pill">' + (c.tier === "platinum" ? "💎 " : c.tier === "gold" ? "👑 " : "") + esc(TN) + (paid ? " " + T("MEMBER", "सदस्य") : "") + '</div></div>' +
      '<div class="td-meta">' + (x.business_code ? '<span>🆔 ' + esc(x.business_code) + '</span>' : '') + (b.phone ? '<span>📱 +91 ' + esc(String(b.phone).replace(/\D/g, "").slice(-10)) + '</span>' : '') +
      (c.pct != null ? '<span>✓ ' + T("Profile ", "प्रोफ़ाइल ") + c.pct + '%' + T(" complete", " पूरी") + '</span>' : '') + '</div></div>' +
      '<div class="td-st">' +
      '<div class="td-s"><small>' + T("Profile complete", "प्रोफ़ाइल पूरी") + '</small><strong>' + (c.pct != null ? c.pct + '%' : '—') + '</strong><em>' + T(c.pct >= 100 ? "✓ All details filled" : "Add the missing details", c.pct >= 100 ? "✓ सारी जानकारी भरी है" : "बाकी जानकारी भरें") + '</em></div>' +
      '<div class="td-s"><small>' + T("Membership", "सदस्यता") + '</small><strong>' + esc(TN) + '</strong><em>' + (until ? T("Till ", "") + esc(until) + T("", " तक") : T("Free forever", "हमेशा मुफ़्त")) + '</em></div>' +
      '<div class="td-s"><small>' + T("Shop status", "दुकान की स्थिति") + '</small><strong>' + esc(stTxt) + '</strong><em>' + esc(stSub) + '</em></div>' +
      '<div class="td-s"><small>' + T("Customer rating", "ग्राहक रेटिंग") + '</small><strong>' + rat + '</strong><em>' + ratSub + '</em></div></div>' +
      ctl + '<div class="td-sec"><h3>' + T("Your shop features", "आपकी दुकान की सुविधाएँ") + '</h3><p>' + T("Features included in your plan.", "आपके प्लान में मिलने वाली सुविधाएँ।") + '</p></div>' +
      '<div class="td-g">' + feats + '</div>' +
      (plans ? '<div class="td-sec"><h3>' + T("Membership & premium features", "सदस्यता और प्रीमियम सुविधाएँ") + '</h3><p>' + T("See what each plan includes.", "देखें हर प्लान में क्या मिलता है।") + '</p></div>' +
        '<div class="td-m"><div class="td-mt"><div><h3>' + T("Your ", "आपका ") + esc(TN) + T(" plan", " प्लान") + '</h3><p>' + (until ? T("Valid till ", "समाप्ति: ") + esc(until) : T("No expiry", "कोई समाप्ति नहीं")) + '</p></div>' +
        (paid ? '<span class="td-pill" style="background:#e3f7ea;color:#13845b;border-color:#bfe8cf">' + T("ACTIVE", "चालू") + '</span>' : '') + '</div><div class="td-pl">' + plans + '</div></div>' : '') +
      '<div class="td-sec"><h3>' + T("Manage your shop", "दुकान मैनेज करें") + '</h3><p>' + T("Keep your shop details up to date.", "अपनी दुकान की जानकारी अपडेट रखें।") + '</p></div>' +
      '<div class="td-g">' +
      '<article class="td-t"><div class="td-i">✏️</div><div><h4>' + T("Edit profile", "प्रोफ़ाइल बदलें") + '</h4><p>' + T("Change address, timings, services and photos.", "पता, समय, सेवाएँ और फ़ोटो बदलें।") + '</p><a class="td-b" href="edit.html?slug=' + encodeURIComponent(b.slug) + '">' + T("Edit ›", "बदलें ›") + '</a></div></article>' +
      '<article class="td-t"><div class="td-i">👁️</div><div><h4>' + T("Preview public profile", "पब्लिक प्रोफ़ाइल देखें") + '</h4><p>' + T("See what customers see.", "ग्राहकों को जो दिखता है वह देखें।") + '</p><a class="td-b lt" href="business.html?slug=' + encodeURIComponent(b.slug) + '">' + T("Preview ›", "देखें ›") + '</a></div></article>' +
      (ph.report ? '<article class="td-t"><div class="td-i">📊</div><div><h4>' + T("Shop performance", "दुकान की Performance") + '</h4><p>' + T("Views, calls and WhatsApp enquiries.", "Views, कॉल और WhatsApp enquiries।") + '</p><button type="button" class="td-b lt" data-tdgo="rep" data-tdi="' + c.i + '">' + T("Open report ›", "रिपोर्ट खोलें ›") + '</button></div></article>' : '') +
      '<article class="td-t"><div class="td-i">⚙️</div><div><h4>' + T("All settings", "सारी सेटिंग") + '</h4><p>' + T("Photos, numbers, notifications and more.", "फ़ोटो, नंबर, नोटिफ़िकेशन और बहुत कुछ।") + '</p><button type="button" class="td-b lt" data-tdgo="" data-tdi="' + c.i + '">' + T("Open ›", "खोलें ›") + '</button></div></article>' +
      '</div></section>';
  }
  window.PBTejDash = { SLUG: SLUG, html: html, load: load, ready: function () { return !!X; } };
})();
