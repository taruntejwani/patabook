/* ✏️ PBSpell — product नाम / विवरण की English spelling अपने-आप सुधारना (बिना internet AI के)
   • शब्द-सूची pb-words.txt (SCOWL) — पहली बार ज़रूरत पड़ने पर ही load होती है
   • सिर्फ़ 1 अक्षर की गलती (उलटे / गलत / छूटा / ज़्यादा अक्षर) सुधरती है, सिर्फ़ दुकान वाले आम शब्दों (* वाले) में, और तभी जब सही शब्द एक ही हो
   • नहीं छूते: छोटे शब्द, अंक वाले (5Ltr), सब बड़े अक्षर (PVC), बीच में बड़ा अक्षर (PataBook), हिंदी
   PBSpell.fix(text) → Promise<{ text, ch: [[गलत, सही], ...] }> */
(function () {
  if (window.PBSpell) return;
  var DICT = null, PRIO = null, LOADING = null;
  function load() {
    if (DICT) return Promise.resolve();
    if (LOADING) return LOADING;
    LOADING = fetch("pb-words.txt?v=1").then(function (r) { if (!r.ok) throw new Error("words"); return r.text(); }).then(function (t) {
      var d = new Set(), p = new Set();
      t.split("\n").forEach(function (w) { if (!w || w.charAt(0) === "#") return; if (w.charAt(0) === "*") { w = w.slice(1); p.add(w); } d.add(w); });
      DICT = d; PRIO = p;
    }).catch(function (e) { LOADING = null; throw e; });
    return LOADING;
  }
  var AB = "abcdefghijklmnopqrstuvwxyz";
  function cands(w) {
    var n = w.length, out = { swap: [], sub: [], ins: [], del: [] }, i, c, x;
    for (i = 0; i < n - 1; i++) { x = w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2); if (x !== w && DICT.has(x)) out.swap.push(x); }
    if (n >= 5) for (i = 0; i < n; i++) for (c = 0; c < 26; c++) { if (AB[c] === w[i]) continue; x = w.slice(0, i) + AB[c] + w.slice(i + 1); if (DICT.has(x)) out.sub.push(x); }
    if (n >= 5) for (i = 0; i <= n; i++) for (c = 0; c < 26; c++) { x = w.slice(0, i) + AB[c] + w.slice(i); if (DICT.has(x)) out.ins.push(x); }
    if (n >= 6) for (i = 0; i < n; i++) { x = w.slice(0, i) + w.slice(i + 1); if (DICT.has(x)) out.del.push(x); }
    return out;
  }
  function uniq(a) { return a.filter(function (v, i) { return a.indexOf(v) === i; }); }
  function best(w) {
    var c = cands(w), all = uniq(c.swap.concat(c.sub, c.ins, c.del)), pr = all.filter(function (x) { return PRIO.has(x); });
    return pr.length === 1 ? pr[0] : null;   /* सिर्फ़ दुकान वाले आम शब्दों (*) में ही सुधार — नाम / हिंग्लिश शब्द नहीं बदलते */
  }
  function word(tok, before, after) {
    if (tok.length < 4 || /\d/.test(before) || /\d/.test(after)) return null;
    if (tok === tok.toUpperCase()) return null;                    /* PVC, LED */
    if (/[A-Z]/.test(tok.slice(1))) return null;                    /* PataBook, iPhone */
    var lw = tok.toLowerCase();
    if (DICT.has(lw)) return null;
    var b = best(lw); if (!b) return null;
    return tok[0] === tok[0].toUpperCase() ? b[0].toUpperCase() + b.slice(1) : b;
  }
  function fixNow(t) {
    var ch = [];
    var out = String(t).replace(/[A-Za-z]+/g, function (tok, off, all) {
      var r = word(tok, all.charAt(off - 1), all.charAt(off + tok.length));
      if (r && r !== tok) { ch.push([tok, r]); return r; }
      return tok;
    });
    return { text: out, ch: ch };
  }
  window.PBSpell = {
    fix: function (t) {
      if (!t || !/[A-Za-z]{4,}/.test(t)) return Promise.resolve({ text: t || "", ch: [] });
      return load().then(function () { return fixNow(t); }, function () { return { text: t, ch: [] }; });
    }
  };
})();
