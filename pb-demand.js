/* PataBook — 📈 "लोग क्या ढूँढ रहे हैं" (sql-56: pb_owner_search_demand) — My Shop → 📊 Report के नीचे
   • पिछले 30 दिन: आपकी दुकान / सामान से मिलती खोजें, और जो खोजा गया पर PataBook पर नहीं मिला
   • सिर्फ़ खोज-शब्द और गिनती — किसने खोजा, यह किसी को नहीं दिखता */
(function () {
  if (window.PBDemand) return;
  function EN() { try { if (window.PB && PB.lang) return PB.lang() !== "hi"; return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function box(s) { var a = document.querySelectorAll(".pbdm"); for (var i = 0; i < a.length; i++) if (a[i].getAttribute("data-dmslug") === s) return a[i]; return null; }
  function list(L, en) {
    if (!L || !L.length) return '<p style="margin:4px 0 0;color:#5b6475;font-size:14px">' + esc(en ? "Nothing yet." : "अभी कुछ नहीं।") + '</p>';
    return '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">' + L.map(function (x) {
      return '<span style="border:1px solid #d0d5dd;border-radius:999px;padding:4px 10px;font-size:14px;background:#fff">' + esc(x.q) + ' <b style="color:#1a73e8">' + esc(x.n) + '×</b></span>';
    }).join("") + '</div>';
  }
  function load(s) {
    if (typeof window.rpc !== "function") return;
    window.rpc("pb_owner_search_demand", { p_slug: s }).then(function (j) {
      var el = box(s); if (!el) return; var en = EN();
      el.querySelector("[data-dmb]").innerHTML =
        '<b style="display:block;font-size:14px">' + esc(en ? "🔎 Searches that match your shop" : "🔎 आपकी दुकान से मिलती खोजें") + '</b>' + list(j && j.mine, en) +
        '<b style="display:block;font-size:14px;margin-top:12px">' + esc(en ? "❓ Searched, but nothing was found on PataBook" : "❓ खोजा गया, पर PataBook पर कुछ नहीं मिला") + '</b>' + list(j && j.missing, en) +
        '<p style="margin:10px 0 0;font-size:13px;color:#5b6475">' + esc(en ? "If you sell any of these, add it to your Gallery with a price — customers searching for it will find your shop." : "इनमें से कुछ आप बेचते हैं, तो उसे कीमत के साथ Gallery में डालें — खोजने वालों को आपकी दुकान दिखेगी।") + '</p>';
    }).catch(function (e) {
      var el = box(s); if (!el) return; var en = EN();
      el.querySelector("[data-dmb]").innerHTML = '<p style="color:#5b6475;font-size:14px;margin:0">' + esc(/404|PGRST202|function/i.test(String(e && e.message)) ? (en ? "This feature is being switched on. Please try again later." : "यह सुविधा अभी चालू हो रही है। थोड़ी देर बाद फिर कोशिश करें।") : (en ? "Could not load." : "नहीं खुल पाया।")) + '</p>';
    });
  }
  function ownerHTML(b, en) {
    setTimeout(function () { load(b.slug); }, 0);
    return '<div class="pbdm" data-dmslug="' + esc(b.slug) + '" style="border:1px solid #e3e8f2;border-radius:14px;padding:12px 14px;margin-top:14px;background:#f8fbff">' +
      '<b style="display:block;font-size:16px;margin-bottom:2px">📈 ' + esc(en ? "What people are searching for" : "लोग क्या ढूँढ रहे हैं") + '</b>' +
      '<small style="display:block;color:#5b6475;margin-bottom:8px">' + esc(en ? "Last 30 days · only the words and how many times — not who searched" : "पिछले 30 दिन · सिर्फ़ शब्द और कितनी बार — किसने खोजा, यह नहीं") + '</small>' +
      '<div data-dmb><p style="color:#5b6475;margin:0">…</p></div></div>';
  }
  window.PBDemand = { ownerHTML: ownerHTML };
})();
