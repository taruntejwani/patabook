/* PataBook — 🟢 Shop Live: दुकानदार की लगाई "आज की स्थिति" (sql-49)
   • ग्राहक: दुकान के पेज पर समय वाला chip बदल जाता है (🔴 आज बंद · 🟡 आज जल्दी बंद · 🟢 अभी खुली) + 🚚 / 🏃
   • दुकानदार: PBLive.ownerHTML(b, en) — My Shop → "आज की स्थिति" (सिर्फ़ आज के लिए, रात 12 बजे अपने-आप हट जाती है)
   • SQL न चली हो / नेटवर्क न हो → कुछ नहीं बदलता */
(function () {
  if (window.PBLive) return;
  var SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
  try { var cf = window.PATABOOK_SUPABASE || {}; if (cf.url) SB = cf.url; if (cf.anonKey) KEY = cf.anonKey; } catch (e) {}
  function EN() { try { if (window.PB && PB.lang) return PB.lang() !== "hi"; return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function nowMin() { var d = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })); return d.getHours() * 60 + d.getMinutes(); }
  function hm(t, en) { var p = String(t || "").split(":"), h = +p[0], m = +p[1]; if (!isFinite(h)) return ""; var ap = h >= 12 ? "PM" : "AM", hh = h % 12 || 12, mm = m ? ":" + String(m).padStart(2, "0") : "";
    if (en) return hh + mm + " " + ap; var pt = h >= 4 && h < 12 ? "सुबह" : h < 16 ? "दोपहर" : h < 20 ? "शाम" : "रात"; return pt + " " + hh + mm + " बजे"; }
  /* स्थिति → {open: true/false/null, t: text} */
  function view(lv, en) {
    if (!lv) return null;
    var st = lv.state, o = null, t = "";
    if (st === "closed") { o = false; t = en ? "🔴 Closed today" : "🔴 आज बंद है"; }
    else if (st === "open") { o = true; t = en ? "🟢 Open now" : "🟢 अभी खुली है"; }
    else if (st === "early" && lv.until) {
      var p = lv.until.split(":"), um = +p[0] * 60 + +p[1];
      if (nowMin() >= um) { o = false; t = en ? "🔴 Closed early today" : "🔴 आज जल्दी बंद हो गई"; }
      else { o = true; t = en ? "🟡 Closing early today at " + hm(lv.until, en) : "🟡 आज " + hm(lv.until, en) + " जल्दी बंद होगी"; }
    }
    return { open: o, t: t, delivery: !!lv.delivery, service: !!lv.service };
  }
  function extras(v, en) {
    var a = [];
    if (v.delivery) a.push(en ? "🚚 Home delivery available" : "🚚 होम डिलीवरी उपलब्ध");
    if (v.service) a.push(en ? "🏃 Service available now" : "🏃 अभी सेवा उपलब्ध");
    return a;
  }
  function post(fn, body, tok) {
    var h = { apikey: KEY, Authorization: "Bearer " + (tok || KEY), "Content-Type": "application/json" };
    return fetch(SB + "/rest/v1/rpc/" + fn, { method: "POST", headers: h, body: JSON.stringify(body) }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }

  /* ---------- ग्राहक: दुकान का पेज ---------- */
  var LV = null, applied = false;
  function chipEl() { return document.querySelector('[data-pbh="hours"]') || document.querySelector(".b3 .st, .st.big, span.st"); }
  function paint() {
    if (!LV) return;
    var v = view(LV, EN()); if (!v) return;
    var c = chipEl();
    if (!c) {   /* समय नहीं डाला हो → अपना chip (chips वाली जगह या नाम के नीचे) */
      var host = document.querySelector(".chips") || (document.querySelector("h1") && document.querySelector("h1").parentNode);
      if (!host) return;
      c = document.createElement("span"); c.className = "chip"; c.setAttribute("data-pbh", "hours"); c.setAttribute("data-pblive", "1");
      if (host.classList && host.classList.contains("chips")) host.insertBefore(c, host.firstChild); else host.appendChild(c);
    }
    if (v.t) {
      c.innerHTML = "<i></i>" + esc(v.t);
      if (v.open === true) { c.classList.add("op"); c.classList.remove("cl"); }
      else if (v.open === false) { c.classList.remove("op"); c.classList.add("cl"); }
    }
    var old = document.querySelectorAll("[data-pblx]"); for (var i = 0; i < old.length; i++) old[i].remove();
    extras(v, EN()).reverse().forEach(function (t) {
      var x = document.createElement(c.tagName === "DIV" ? "div" : "span");
      x.className = c.className.replace(/\b(op|cl)\b/g, "").trim(); x.setAttribute("data-pblx", "1");
      x.style.cssText = "background:#eef6ff;color:#0b4db3;border-color:#cfe0ff";
      x.textContent = t; c.parentNode.insertBefore(x, c.nextSibling);
    });
    applied = true;
  }
  function pageSlug() { try { return new URLSearchParams(location.search).get("slug") || ""; } catch (e) { return ""; } }
  function startPage() {
    var slug = pageSlug(); if (!slug || !/\/(shop|business|brand)(\.html)?$/.test(location.pathname)) return;
    post("pb_live_get", { p_slug: slug }).then(function (j) {
      if (!j) return; LV = j; paint();
      /* पेज बाद में बने / भाषा बदले तो फिर से */
      var n = 0, mo = new MutationObserver(function () { if (n++ > 200) return mo.disconnect(); var c = chipEl(); if (c && c.textContent.indexOf(view(LV, EN()).t || "\u0000") < 0) paint(); });
      mo.observe(document.body, { childList: true, subtree: true });
      setTimeout(function () { mo.disconnect(); }, 20000);
      try { if (window.PB && PB.onChange) PB.onChange(function () { setTimeout(paint, 50); }); } catch (e) {}
    }).catch(function () {});
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startPage); else startPage();

  /* ---------- दुकानदार: My Shop → आज की स्थिति ---------- */
  var OPTS = [["auto", "⏱️", "As per my timing", "मेरे समय के हिसाब से"], ["open", "🟢", "Open now", "अभी खुली है"], ["closed", "🔴", "Closed today", "आज बंद है"], ["early", "🟡", "Closing early today", "आज जल्दी बंद होगी"]];
  function ownerHTML(b, en) {
    var s = esc(b.slug);
    setTimeout(function () { ownerLoad(b.slug); }, 0);
    return '<div class="pblv" data-lvslug="' + s + '">' +
      '<p style="margin:0 0 10px;color:#5b6475;font-size:14px;line-height:1.5">' + esc(en ? "Tell customers about today. It shows on your shop page and in search, and is removed automatically at midnight." : "ग्राहकों को आज की बात बताइए। यह आपकी दुकान के पेज और खोज में दिखेगी, और रात 12 बजे अपने-आप हट जाएगी।") + '</p>' +
      OPTS.map(function (o) { return '<label style="display:flex;align-items:center;gap:10px;padding:11px 12px;border:1px solid #e3e8f2;border-radius:12px;margin-bottom:8px;font-size:15px;cursor:pointer"><input type="radio" name="lv_' + s + '" value="' + o[0] + '"' + (o[0] === "auto" ? " checked" : "") + '> <span>' + o[1] + " " + esc(en ? o[2] : o[3]) + '</span></label>'; }).join("") +
      '<div data-lvt hidden style="margin:-2px 0 10px 34px;font-size:14px"><label>' + esc(en ? "Closing at" : "कितने बजे बंद होगी") + ' <input type="time" data-lvtime value="17:00" style="font:inherit;padding:6px 8px;border:1px solid #d0d5dd;border-radius:8px"></label></div>' +
      '<label style="display:flex;align-items:center;gap:10px;padding:8px 2px;font-size:15px"><input type="checkbox" data-lvd> 🚚 ' + esc(en ? "Home delivery available today" : "आज होम डिलीवरी उपलब्ध") + '</label>' +
      '<label style="display:flex;align-items:center;gap:10px;padding:8px 2px;font-size:15px"><input type="checkbox" data-lvs> 🏃 ' + esc(en ? "Service available now" : "अभी सेवा उपलब्ध") + '</label>' +
      '<button type="button" data-lvsave style="margin-top:10px;width:100%;border:0;border-radius:12px;background:#1a73e8;color:#fff;font:inherit;font-weight:700;font-size:15px;padding:13px;cursor:pointer">' + esc(en ? "Save today's status" : "आज की स्थिति सेव करें") + '</button>' +
      '<div data-lvmsg style="margin-top:8px;font-size:14px;min-height:20px"></div></div>';
  }
  function tok() { try { return window.PBA && PBA.current && PBA.current() ? (PBA.token ? PBA.token() : null) : null; } catch (e) { return null; } }
  function call(fn, args) { if (typeof window.rpc === "function") return window.rpc(fn, args); return post(fn, args, tok()); }
  function box(slug) { return document.querySelector('.pblv[data-lvslug="' + (window.CSS && CSS.escape ? CSS.escape(slug) : slug) + '"]'); }
  function sync(el) { var r = el.querySelector('input[type=radio]:checked'); el.querySelector("[data-lvt]").hidden = !(r && r.value === "early"); }
  function ownerLoad(slug) {
    var el = box(slug); if (!el) return;
    call("pb_live_mine", { p_slug: slug }).then(function (j) {
      if (!j) return; el = box(slug); if (!el) return;
      var r = el.querySelector('input[type=radio][value="' + j.state + '"]'); if (r) r.checked = true;
      if (j.until) el.querySelector("[data-lvtime]").value = j.until;
      el.querySelector("[data-lvd]").checked = !!j.delivery; el.querySelector("[data-lvs]").checked = !!j.service; sync(el);
    }).catch(function (e) {
      el = box(slug); if (!el) return;
      if (/404|PGRST202|function/i.test(String(e && e.message))) el.querySelector("[data-lvmsg]").textContent = EN() ? "This feature is being switched on. Please try again later." : "यह सुविधा अभी चालू हो रही है। थोड़ी देर बाद फिर कोशिश करें।";
    });
  }
  document.addEventListener("change", function (e) { var el = e.target.closest && e.target.closest(".pblv"); if (el) sync(el); });
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-lvsave]"); if (!b) return;
    var el = b.closest(".pblv"), slug = el.getAttribute("data-lvslug"), en = EN(), msg = el.querySelector("[data-lvmsg]");
    var r = el.querySelector('input[type=radio]:checked'), st = r ? r.value : "auto", t = el.querySelector("[data-lvtime]").value || "";
    if (st === "early" && !/^\d{2}:\d{2}$/.test(t)) { msg.textContent = en ? "Choose the closing time." : "बंद होने का समय चुनें।"; return; }
    b.disabled = true; msg.style.color = "#5b6475"; msg.textContent = en ? "Saving…" : "सेव हो रहा है…";
    call("pb_live_set", { p_slug: slug, p_state: st, p_until: st === "early" ? t : null, p_delivery: el.querySelector("[data-lvd]").checked, p_service: el.querySelector("[data-lvs]").checked })
      .then(function () { msg.style.color = "#1e8e3e"; msg.textContent = en ? "✅ Saved. Customers will see this today." : "✅ सेव हो गया। ग्राहकों को आज यह दिखेगा।"; })
      .catch(function (er) { msg.style.color = "#b42318"; msg.textContent = /rate/i.test(String(er && er.message)) ? (en ? "Too many changes. Try again after some time." : "बहुत बार बदला। थोड़ी देर बाद फिर कोशिश करें।") : (en ? "Could not save. Please try again." : "सेव नहीं हो पाया। फिर कोशिश करें।"); })
      .then(function () { b.disabled = false; });
  });

  window.PBLive = { view: view, extras: extras, ownerHTML: ownerHTML };
})();
