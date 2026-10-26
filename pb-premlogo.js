/* PataBook — Logo सिर्फ़ उन दुकानों का दिखे जिनके plan में "Logo" ON है (Admin → Plans)
   await PBPL(rows)  →  बाकी दुकानों का logo_url खाली (database में logo रहता है) */
(function () {
  window.PBPL = async function (rows) {
    rows = (rows || []).filter(function (x) { return x && x.slug; });
    if (!window.PBPlan) return {};
    await PBPlan.load(rows.map(function (x) { return x.slug; }));
    rows.forEach(function (x) { if (!PBPlan.has(x.slug, "logo")) x.logo_url = ""; });
    return {};
  };
})();
