/* PataBook — 4 plan: Free · Silver · Gold · Platinum (sql-30)
   await PBPlan.load([slug,...])   → plan की settings + इन दुकानों का plan
   PBPlan.tier(slug) → "free" | "silver" | "gold" | "platinum"
   PBPlan.has(slug, "logo")  — features: logo products photos hiring card report top strip banner social
   PBPlan.lim(slug, "photos" | "products")
   sql-30 न चली हो तो पुराना तरीका: Premium = सब सुविधाएँ (8 फ़ोटो, 20 products), Free = कुछ नहीं */
(function () {
  var SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
  var ALL = { logo: true, products: true, photos: true, hiring: true, card: true, report: true, top: true, strip: true, banner: false, social: true };
  var CFG = null, SH = {}, ASKED = {}, OLD = false;
  var DEF = { free: { feats: { social: true }, photos: 0, products: 0 }, silver: { feats: ALL, photos: 8, products: 20 }, gold: { feats: ALL, photos: 8, products: 20 }, platinum: { feats: ALL, photos: 8, products: 20 } };
  var NAME = { free: ["Free", "Free"], silver: ["Silver", "सिल्वर"], gold: ["Gold", "गोल्ड"], platinum: ["Platinum", "प्लैटिनम"] };
  function post(fn, body) { return fetch(SB + "/rest/v1/rpc/" + fn, { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) }); }
  async function load(slugs) {
    var need = (slugs || []).filter(function (s) { return s && !ASKED[s]; }).slice(0, 300);
    if (!need.length && CFG) return;
    need.forEach(function (s) { ASKED[s] = 1; });
    if (!OLD) {
      try {
        var r = await post("pb_plan_public", { p_slugs: need });
        var j = r.ok ? await r.json() : null;
        if (j && j.cfg && Object.keys(j.cfg).length) { CFG = j.cfg; Object.assign(SH, j.shops || {}); return; }
        if (r.ok || r.status === 404) OLD = true; else return;   /* sql-30 अभी नहीं चली */
      } catch (e) { return; }
    }
    try { var r2 = await post("pb_premium_status", { p_slugs: need }); if (r2.ok) { var j2 = await r2.json() || {}; Object.keys(j2).forEach(function (s) { if (j2[s]) SH[s] = "platinum"; }); } } catch (e) {}
  }
  function cfgOf(t) { return (CFG && CFG[t]) || DEF[t] || DEF.free; }
  function tier(s) { return SH[s] || "free"; }
  window.PBPlan = {
    load: load, tier: tier,
    paid: function (s) { return tier(s) !== "free"; },
    has: function (s, f) { var c = cfgOf(tier(s)); return !!(c.feats && c.feats[f]); },
    hasT: function (t, f) { var c = cfgOf(t || "free"); return !!(c.feats && c.feats[f]); },
    lim: function (s, k) { var c = cfgOf(tier(s)); return +c[k] || 0; },
    limT: function (t, k) { var c = cfgOf(t || "free"); return +c[k] || 0; },
    name: function (t, en) { var n = NAME[t] || NAME.free; return en ? n[0] : n[1]; },
    set: function (s, t) { if (s) { SH[s] = t || "free"; ASKED[s] = 1; } }
  };
})();
