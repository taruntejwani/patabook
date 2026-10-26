/* PataBook — Logo सिर्फ़ Premium दुकानों का दिखे (Free plan में logo नहीं)
   await PBPL(rows)  →  जो दुकान Premium नहीं, उसका logo_url खाली कर देता है (database में logo रहता है; Premium लेते ही फिर दिखेगा) */
(function () {
  var SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8", C = {};
  window.PBPL = async function (rows) {
    rows = (rows || []).filter(function (x) { return x && x.slug; });
    var need = rows.map(function (x) { return x.slug; }).filter(function (s) { return !(s in C); }).slice(0, 300);
    if (need.length) {
      try {
        var r = await fetch(SB + "/rest/v1/rpc/pb_premium_status", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_slugs: need }) });
        var j = r.ok ? (await r.json()) || {} : null;
        need.forEach(function (s) { C[s] = j ? !!j[s] : false; });
      } catch (e) { need.forEach(function (s) { C[s] = false; }); }
    }
    rows.forEach(function (x) { if (!C[x.slug]) x.logo_url = ""; });
    return C;
  };
})();
