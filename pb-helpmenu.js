/* PataBook — स्टाफ़ का काम (Staff access) सब ☰ मेन्यू में: होम · दुकान का पब्लिक पन्ना · डैशबोर्ड/सेटिंग.
   जिस दुकान ने इस login को स्टाफ़ बनाया है, उसका नाम मेन्यू में आता है; दबाने पर helper.html (सिर्फ़ फ़ोटो का काम).
   सूची localStorage "pb-helper-shops" में रहती है; login होने पर अपने-आप ताज़ा होती है। */
(function () {
  var K = "pb-helper-shops", SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8", T0 = "pb-helper-t";
  function en() { try { return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function list() { try { var a = JSON.parse(localStorage.getItem(K) || "[]"); return Array.isArray(a) ? a.filter(function (x) { return x && x.slug; }) : []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(K, JSON.stringify(a || [])); } catch (e) {} }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  async function refresh(force) {
    try {
      var s = JSON.parse(localStorage.getItem("pb-session") || "null");
      if (!(s && s.refresh_token)) { save([]); return []; }
      var t = +localStorage.getItem(T0) || 0;
      if (!force && Date.now() - t < 300000) return list();
      var ss = window.PBA && PBA.session ? await PBA.session() : null;
      if (!(ss && ss.access_token)) return list();
      var r = await fetch(SB + "/rest/v1/rpc/pb_my_helper_shops", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + ss.access_token, "Content-Type": "application/json" }, body: "{}" });
      if (!r.ok) return list();
      var j = await r.json();
      if (Array.isArray(j)) { save(j.filter(function (x) { return x && x.slug; }).map(function (x) { return { slug: x.slug, name: x.name || x.slug, perms: x.perms || null }; })); try { localStorage.setItem(T0, String(Date.now())); } catch (e) {} try { window.dispatchEvent(new Event("pbhelp")); } catch (e) {} }
    } catch (e) {}
    return list();
  }
  function url(slug) { return "helper.html?s=" + encodeURIComponent(slug); }
  /* मेन्यू की पंक्तियाँ (data-k="hs" data-s=slug) — ROW = उस मेन्यू की पंक्ति का style */
  function rows(ROW) {
    var h = !en();
    return list().map(function (s) {
      return '<a data-k="hs" data-s="' + esc(s.slug) + '" href="' + url(s.slug) + '" style="' + ROW + 'color:#0b2f73"><span style="font-size:20px;width:24px;text-align:center">👥</span><span style="min-width:0">' + esc(s.name) + '<small style="display:block;font-weight:600;color:#5b6475;font-size:12px">' + (h ? "स्टाफ़ का काम" : "Staff work") + '</small></span></a>';
    }).join("");
  }
  window.PBHelp = { list: list, save: save, refresh: refresh, rows: rows, url: url };
  try { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(refresh, 400); }); else setTimeout(refresh, 400); } catch (e) {}
})();
