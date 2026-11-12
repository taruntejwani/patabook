/* PataBook — 🎁 दुकानों के ऑफ़र (sql-52)
   • दुकान के पेज: चालू ऑफ़र का card (⭐ रेटिंग वाले डिब्बे के ऊपर) + 🚩 Report
   • PBOffers.ownerHTML(b, en) — My Shop → "🎁 ऑफ़र" (3 तक चालू, 30 दिन तक)
   • PBOffers.list(el, rows, opts) — offers.html और favourites.html की सूची
   SQL न चली हो → कुछ नहीं दिखता */
(function () {
  if (window.PBOffers) return;
  var SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
  try { var cf = window.PATABOOK_SUPABASE || {}; if (cf.url) SB = cf.url; if (cf.anonKey) KEY = cf.anonKey; } catch (e) {}
  function EN() { try { if (window.PB && PB.lang) return PB.lang() !== "hi"; return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function L(en, hi) { return EN() ? en : hi; }
  function day(d) { try { return new Date(d + "T00:00:00").toLocaleDateString(EN() ? "en-IN" : "hi-IN", { day: "numeric", month: "short" }); } catch (e) { return d || ""; } }
  function post(fn, body, tok) {
    return fetch(SB + "/rest/v1/rpc/" + fn, { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + (tok || KEY), "Content-Type": "application/json" }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.text().then(function (t) { var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {} if (!r.ok) { var er = new Error((j && (j.message || j.hint)) || ("HTTP " + r.status)); er.status = r.status; throw er; } return j; }); });
  }
  async function session() { try { var s = window.PBA ? await PBA.session() : null; if (s && PBA.isGuest && PBA.isGuest(s)) return null; return s; } catch (e) { return null; } }
  var css = document.createElement("style");
  css.textContent = ".pbof{border:1.5px solid #ffd8a8;border-radius:16px;background:#fffaf2;padding:14px 16px;margin:16px 0;color:#14161c;font-family:inherit}" +
    ".pbof h3{margin:0 0 6px;font-size:16px;color:#a35200}.pbof .it,.pbol .it{padding:9px 0;border-top:1px solid #ffe8cc}.pbof .it:first-of-type{border-top:0}" +
    ".pbof b,.pbol b{display:block;font-size:15px}.pbof p,.pbol p{margin:3px 0 0;font-size:14px;color:#344054;white-space:pre-line;line-height:1.45}" +
    ".pbof small,.pbol small{display:block;font-size:12px;color:#7a5a2b;margin-top:4px}.pbof .rp,.pbol .rp{border:0;background:none;color:#98a2b3;font:inherit;font-size:12px;cursor:pointer;padding:2px 0;margin-left:8px}" +
    ".pbol .it{display:block;background:#fff;border:1px solid #ffe0b2;border-radius:14px;padding:12px 14px;margin:0 0 10px;text-decoration:none;color:#14161c}.pbol .sh{font-size:13px;color:#0b4db3;font-weight:700;margin-bottom:4px}";
  document.head.appendChild(css);

  /* 🚩 Report (login के बाद) */
  document.addEventListener("click", async function (e) {
    var b = e.target.closest && e.target.closest("[data-ofrep]"); if (!b) return;
    e.preventDefault(); e.stopPropagation();
    if (b.dataset.armed !== "1") { b.dataset.armed = "1"; b.textContent = L("Tap again to report", "Report करने के लिए फिर दबाएँ"); setTimeout(function () { if (b.isConnected && b.dataset.armed === "1") { b.dataset.armed = ""; b.textContent = "🚩 Report"; } }, 4000); return; }
    var s = await session();
    if (!s) { location.href = window.PBA && PBA.loginUrl ? PBA.loginUrl(location.pathname + location.search) : "login.html"; return; }
    b.disabled = true;
    post("pb_offer_report", { p_id: +b.dataset.ofrep }, s.access_token).then(function () { b.textContent = L("Reported. Thank you.", "Report हो गया, धन्यवाद।"); })
      .catch(function (er) { b.disabled = false; b.dataset.armed = ""; b.textContent = /rate/i.test(er.message) ? L("Try again tomorrow", "कल फिर कोशिश करें") : "🚩 Report"; });
  }, true);

  function item(o, withShop) {
    return (withShop ? '<div class="sh">🏪 ' + esc(o.shop) + '</div>' : '') + '<b>🎁 ' + esc(o.title) + '</b>' + (o.body ? '<p>' + esc(o.body) + '</p>' : '') +
      '<small>' + esc(L("Valid till ", "") + day(o.ends) + L("", " तक")) + '<button type="button" class="rp" data-ofrep="' + (+o.id) + '">🚩 Report</button></small>';
  }

  /* ---------- दुकान का पेज ---------- */
  var slug = ""; try { slug = new URLSearchParams(location.search).get("slug") || ""; } catch (e) {}
  if (slug && /\/(shop|business|brand)(\.html)?$/.test(location.pathname)) {
    var OF = null, el = null;
    var place = function () {
      if (!OF || !OF.length) return;
      var anchor = document.getElementById("pbRate"); if (!anchor) return;
      var host = anchor.closest(".rate, .card, section") || anchor, tr = document.querySelector(".pbtr");
      var before = tr && tr.parentNode === host.parentNode ? tr : host;
      if (!el || !document.body.contains(el)) { el = document.createElement("div"); el.className = "pbof"; el.setAttribute("data-pbh", "offers"); before.parentNode.insertBefore(el, before); }
      el.innerHTML = '<h3>🎁 ' + esc(L("Offers", "ऑफ़र")) + '</h3>' + OF.map(function (o) { return '<div class="it">' + item(o, false) + '</div>'; }).join("");
    };
    post("pb_offers_public", { p_slug: slug }).then(function (j) {
      if (!Array.isArray(j) || !j.length) return; OF = j; place();
      var k = 0, mo = new MutationObserver(function () { if (k++ > 300) return mo.disconnect(); if (!el || !document.body.contains(el)) place(); });
      mo.observe(document.body, { childList: true, subtree: true }); setTimeout(function () { mo.disconnect(); }, 20000);
      try { if (window.PB && PB.onChange) PB.onChange(function () { setTimeout(place, 50); }); } catch (e) {}
    }).catch(function () {});
  }

  /* ---------- सूची (offers.html / favourites.html) ---------- */
  function list(box, rows, opts) {
    opts = opts || {};
    if (!rows || !rows.length) { box.innerHTML = opts.empty ? '<p style="color:#5b6475;font-size:14px">' + esc(opts.empty) + '</p>' : ''; return; }
    box.classList.add("pbol");
    box.innerHTML = rows.map(function (o) {
      return '<a class="it" href="business.html?slug=' + encodeURIComponent(o.slug) + '">' + item(o, true) + (o.addr ? '<small>📍 ' + esc(o.addr) + '</small>' : '') + '</a>';
    }).join("");
  }

  /* ---------- दुकानदार: My Shop → 🎁 ऑफ़र ---------- */
  function call(fn, args) { if (typeof window.rpc === "function") return window.rpc(fn, args); return session().then(function (s) { return post(fn, args, s && s.access_token); }); }
  function todayISO(add) { var d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })); d.setDate(d.getDate() + (add || 0)); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function ownerHTML(b, en) {
    var s = esc(b.slug);
    setTimeout(function () { ownerLoad(b.slug); }, 0);
    return '<div class="pbofo" data-ofslug="' + s + '">' +
      '<p style="margin:0 0 10px;color:#5b6475;font-size:14px;line-height:1.5">' + esc(en ? "Offers show on your shop page, on the Offers page of your city and to customers who added your shop to Favourites. Up to 3 offers at a time, each up to 30 days." : "ऑफ़र आपकी दुकान के पेज, आपके शहर के Offers पेज और जिन ग्राहकों ने आपकी दुकान 💫 फ़ेवरेट की है, उन्हें दिखते हैं। एक समय में 3 ऑफ़र, हर ऑफ़र 30 दिन तक।") + '</p>' +
      '<div data-oflist><p style="color:#5b6475">…</p></div>' +
      '<div style="border:1px solid #e3e8f2;border-radius:14px;padding:12px;margin-top:10px"><b data-ofhd style="display:block;margin-bottom:8px">' + esc(en ? "➕ New offer" : "➕ नया ऑफ़र") + '</b>' +
      '<input data-oft maxlength="80" placeholder="' + esc(en ? "Title (e.g. 10% off on car shampoo)" : "शीर्षक (जैसे कार शैम्पू पर 10% छूट)") + '" style="width:100%;font:inherit;font-size:15px;padding:10px;border:1px solid #d0d5dd;border-radius:10px;margin-bottom:8px">' +
      '<textarea data-ofb maxlength="300" rows="3" placeholder="' + esc(en ? "Details (optional)" : "विवरण (ज़रूरी नहीं)") + '" style="width:100%;font:inherit;font-size:15px;padding:10px;border:1px solid #d0d5dd;border-radius:10px;resize:vertical"></textarea>' +
      '<label style="display:flex;align-items:center;gap:8px;margin:8px 0;font-size:14px">' + esc(en ? "Valid till" : "कब तक") + ' <input type="date" data-ofe min="' + todayISO(0) + '" max="' + todayISO(30) + '" value="' + todayISO(7) + '" style="font:inherit;padding:6px 8px;border:1px solid #d0d5dd;border-radius:8px"></label>' +
      '<div style="display:flex;gap:8px"><button type="button" data-ofsave style="flex:1;border:0;border-radius:12px;background:#f08c00;color:#fff;font:inherit;font-weight:700;font-size:15px;padding:12px;cursor:pointer">' + esc(en ? "Save offer" : "ऑफ़र सेव करें") + '</button><button type="button" data-ofcancel hidden style="border:1px solid #d0d5dd;border-radius:12px;background:#fff;font:inherit;font-weight:700;padding:12px 14px;cursor:pointer">' + esc(en ? "Cancel" : "रद्द करें") + '</button></div>' +
      '<div data-ofmsg style="margin-top:8px;font-size:14px;min-height:20px"></div></div></div>';
  }
  var MINE = {};
  function obox(slug) { var a = document.querySelectorAll(".pbofo"); for (var i = 0; i < a.length; i++) if (a[i].getAttribute("data-ofslug") === slug) return a[i]; return null; }
  function ownerLoad(slug) {
    var el = obox(slug); if (!el) return;
    call("pb_offers_mine", { p_slug: slug }).then(function (rows) {
      el = obox(slug); if (!el) return; MINE[slug] = rows || []; var en = EN();
      el.querySelector("[data-oflist]").innerHTML = !MINE[slug].length ? '<p style="color:#5b6475;font-size:14px">' + esc(en ? "No offers yet." : "अभी कोई ऑफ़र नहीं।") + '</p>' :
        MINE[slug].map(function (o) {
          var st = o.hidden ? (en ? "🚫 Hidden after reports" : "🚫 Report के बाद छिपा") : o.live ? (en ? "🟢 Live till " : "🟢 चालू — ") + day(o.ends) + (en ? "" : " तक") : (en ? "⌛ Ended" : "⌛ ख़त्म");
          return '<div style="border:1px solid #ffe0b2;background:#fffaf2;border-radius:12px;padding:10px 12px;margin-bottom:8px"><b style="display:block">🎁 ' + esc(o.title) + '</b>' + (o.body ? '<p style="margin:3px 0 0;font-size:14px;white-space:pre-line">' + esc(o.body) + '</p>' : '') +
            '<small style="display:block;margin-top:4px;color:#7a5a2b">' + esc(st) + '</small><div style="display:flex;gap:8px;margin-top:6px">' +
            (o.hidden ? '' : '<button type="button" data-ofedit="' + o.id + '" style="border:1px solid #d0d5dd;border-radius:9px;background:#fff;padding:6px 10px;font:inherit;font-size:13px;cursor:pointer">✏️ ' + esc(en ? "Edit" : "बदलें") + '</button>') +
            '<button type="button" data-ofdel="' + o.id + '" style="border:1px solid #f3c2bd;border-radius:9px;background:#fff;color:#b42318;padding:6px 10px;font:inherit;font-size:13px;cursor:pointer">🗑 ' + esc(en ? "Delete" : "हटाएँ") + '</button></div></div>';
        }).join("");
    }).catch(function (e) {
      el = obox(slug); if (!el) return;
      el.querySelector("[data-oflist]").innerHTML = '<p style="color:#b42318;font-size:14px">' + esc(/404|PGRST202|function/i.test(String(e && e.message)) ? L("This feature is being switched on. Please try again later.", "यह सुविधा अभी चालू हो रही है। थोड़ी देर बाद फिर कोशिश करें।") : L("Could not load offers.", "ऑफ़र नहीं खुल पाए।")) + '</p>';
    });
  }
  function form(el, o) {
    var en = EN();
    el.dataset.editing = o ? o.id : "";
    el.querySelector("[data-ofhd]").textContent = o ? (en ? "✏️ Edit offer" : "✏️ ऑफ़र बदलें") : (en ? "➕ New offer" : "➕ नया ऑफ़र");
    el.querySelector("[data-oft]").value = o ? o.title : ""; el.querySelector("[data-ofb]").value = o ? o.body : "";
    el.querySelector("[data-ofe]").value = o && o.ends >= todayISO(0) ? o.ends : todayISO(7);
    el.querySelector("[data-ofcancel]").hidden = !o; el.querySelector("[data-ofmsg]").textContent = "";
    if (o) el.querySelector("[data-oft]").focus();
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("[data-ofsave],[data-ofedit],[data-ofdel],[data-ofcancel]"); if (!t) return;
    var el = t.closest(".pbofo"); if (!el) return;
    var slug = el.getAttribute("data-ofslug"), en = EN(), msg = el.querySelector("[data-ofmsg]");
    if (t.hasAttribute("data-ofcancel")) return form(el, null);
    if (t.hasAttribute("data-ofedit")) { var o = (MINE[slug] || []).filter(function (x) { return String(x.id) === t.dataset.ofedit; })[0]; return form(el, o || null); }
    if (t.hasAttribute("data-ofdel")) {
      if (t.dataset.armed !== "1") { t.dataset.armed = "1"; t.textContent = en ? "Tap again to delete" : "हटाने के लिए फिर दबाएँ"; return; }
      t.disabled = true;
      call("pb_offer_delete", { p_slug: slug, p_id: +t.dataset.ofdel }).then(function () { ownerLoad(slug); }).catch(function () { t.disabled = false; });
      return;
    }
    var ti = el.querySelector("[data-oft]").value.trim(), bo = el.querySelector("[data-ofb]").value.trim(), ends = el.querySelector("[data-ofe]").value;
    if (ti.length < 3) { msg.style.color = "#b42318"; msg.textContent = en ? "Write a title (at least 3 letters)." : "शीर्षक लिखें (कम से कम 3 अक्षर)।"; return; }
    if (!ends) { msg.style.color = "#b42318"; msg.textContent = en ? "Choose the last date." : "आख़िरी तारीख चुनें।"; return; }
    t.disabled = true; msg.style.color = "#5b6475"; msg.textContent = en ? "Saving…" : "सेव हो रहा है…";
    call("pb_offer_save", { p_slug: slug, p_id: el.dataset.editing ? +el.dataset.editing : null, p_title: ti, p_body: bo, p_ends: ends })
      .then(function () { form(el, null); msg.style.color = "#1e8e3e"; msg.textContent = en ? "✅ Saved. Customers can see it now." : "✅ सेव हो गया। ग्राहकों को अब दिखेगा।"; ownerLoad(slug); })
      .catch(function (er) {
        var m = String(er && er.message);
        msg.style.color = "#b42318";
        msg.textContent = /max 3/.test(m) ? (en ? "You already have 3 live offers. Delete one first." : "पहले से 3 चालू ऑफ़र हैं। पहले एक हटाएँ।") :
          /bad date/.test(m) ? (en ? "The date must be within the next 30 days." : "तारीख आज से 30 दिन के अंदर होनी चाहिए।") :
          /rate/.test(m) ? (en ? "Too many changes today. Try tomorrow." : "आज बहुत बार बदला। कल कोशिश करें।") :
          /too long/.test(m) ? (en ? "Details are too long (300 letters max)." : "विवरण बहुत लंबा है (300 अक्षर तक)।") : (en ? "Could not save. Please try again." : "सेव नहीं हो पाया। फिर कोशिश करें।");
      }).then(function () { t.disabled = false; });
  });

  window.PBOffers = { ownerHTML: ownerHTML, list: list, post: post, session: session };
})();
