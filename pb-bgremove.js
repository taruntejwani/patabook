/* PataBook — ✨ फ़ोटो का background हटाना (phone पर ही; फ़ोटो किसी बाहरी कंपनी को नहीं जाती)
   AI: U²-Net-p (u2netp, Apache-2.0 — कारोबार में मुफ़्त), सिर्फ़ ~4.5 MB, हमारी अपनी साइट से (/ai/u2netp.onnx)।
   चलाने वाला: ONNX Runtime Web (MIT)। पहले वाला बड़ा AI (115 MB) phone की memory में नहीं समाता था — page crash होता था।
   PBBg.remove(file, onStep) → Promise<File>  (सफ़ेद background वाली फ़ोटो)
   onStep({stage:"load"|"run", pct}) — download / काम की प्रगति */
(function () {
  var ORTV = "1.20.1", ORT = "https://cdn.jsdelivr.net/npm/onnxruntime-web@" + ORTV + "/dist/";
  var MODEL = "ai/u2netp.onnx?v=1", S = 320, MAXS = 1600;
  var P = null, STEP = null;

  function script(src) {
    return new Promise(function (res, rej) {
      if (window.ort) return res();
      var s = document.createElement("script"); s.src = src; s.async = true;
      s.onload = function () { res(); }; s.onerror = function () { rej(new Error("ort")); };
      document.head.appendChild(s);
    });
  }
  async function fetchModel() {
    var r = await fetch(MODEL); if (!r.ok) throw new Error("model");
    var tot = +r.headers.get("content-length") || 4574861;
    if (!r.body || !r.body.getReader) return new Uint8Array(await r.arrayBuffer());
    var rd = r.body.getReader(), parts = [], got = 0;
    for (;;) {
      var c = await rd.read(); if (c.done) break;
      parts.push(c.value); got += c.value.length;
      if (STEP) STEP({ stage: "load", pct: Math.min(99, Math.round(got / tot * 100)) });
    }
    var buf = new Uint8Array(got), o = 0; parts.forEach(function (p) { buf.set(p, o); o += p.length; });
    return buf;
  }
  function load() {
    if (P) return P;
    P = (async function () {
      await script(ORT + "ort.min.js");
      ort.env.wasm.wasmPaths = ORT;
      ort.env.wasm.numThreads = 1;   /* कम memory, हर phone पर चले */
      var buf = await fetchModel();
      return await ort.InferenceSession.create(buf, { executionProviders: ["wasm"], graphOptimizationLevel: "all" });
    })();
    P.catch(function () { P = null; });   /* fail हुआ तो अगली बार फिर कोशिश */
    return P;
  }
  function bitmap(file) {
    return new Promise(function (res, rej) {
      var u = URL.createObjectURL(file), im = new Image();
      im.onload = function () { URL.revokeObjectURL(u); res(im); };
      im.onerror = function () { URL.revokeObjectURL(u); rej(new Error("image")); };
      im.src = u;
    });
  }
  /* background एक ही सादे रंग का हो (studio / सादी दीवार) तो product के अंदर बंद उसी रंग के टुकड़े भी हटाएँ —
     जैसे जार के हैंडल का छेद। अलग-अलग रंग वाला background (असली दुकान की फ़ोटो) हो तो कुछ नहीं करता। */
  function holes(px, al) {
    var n = S * S, r = 0, g = 0, b = 0, c = 0, i;
    for (i = 0; i < n; i++) if (al[i * 4 + 3] < 25) { r += px[i * 4]; g += px[i * 4 + 1]; b += px[i * 4 + 2]; c++; }
    if (c < n * .05) return;
    r /= c; g /= c; b /= c;
    var dv = 0; for (i = 0; i < n; i++) if (al[i * 4 + 3] < 25) { var e = Math.abs(px[i * 4] - r) + Math.abs(px[i * 4 + 1] - g) + Math.abs(px[i * 4 + 2] - b); dv += e; }
    if (dv / c > 24) return;   /* background सादा नहीं */
    var near = new Uint8Array(n), seen = new Uint8Array(n), st = new Int32Array(n), comp = new Int32Array(n);
    for (i = 0; i < n; i++) near[i] = (Math.abs(px[i * 4] - r) + Math.abs(px[i * 4 + 1] - g) + Math.abs(px[i * 4 + 2] - b)) < 14 ? 1 : 0;
    for (i = 0; i < n; i++) {
      if (!near[i] || seen[i] || al[i * 4 + 3] < 25) continue;
      var sp = 0, cn = 0; st[sp++] = i; seen[i] = 1;
      while (sp) {
        var q = st[--sp]; comp[cn++] = q; var x = q % S, y = (q / S) | 0;
        if (x > 0 && near[q - 1] && !seen[q - 1]) { seen[q - 1] = 1; st[sp++] = q - 1; }
        if (x < S - 1 && near[q + 1] && !seen[q + 1]) { seen[q + 1] = 1; st[sp++] = q + 1; }
        if (y > 0 && near[q - S] && !seen[q - S]) { seen[q - S] = 1; st[sp++] = q - S; }
        if (y < S - 1 && near[q + S] && !seen[q + S]) { seen[q + S] = 1; st[sp++] = q + S; }
      }
      if (cn >= n * .008) for (var k = 0; k < cn; k++) al[comp[k] * 4 + 3] = 0;   /* छोटे धब्बे (अक्षर, बिंदु) नहीं छूते */
    }
  }
  /* alpha को r pixel अंदर सिकोड़ें (min filter: पहले आड़ा, फिर खड़ा) — बोतल का आकार वही, बस किनारे की काली लकीर कटे */
  function erode(g, w, h, r) {
    var id = g.getImageData(0, 0, w, h), d = id.data, n = w * h, A = new Uint8Array(n), B = new Uint8Array(n), x, y, k, m;
    for (k = 0; k < n; k++) A[k] = d[k * 4 + 3];
    for (y = 0; y < h; y++) for (x = 0; x < w; x++) { m = 255; for (k = Math.max(0, x - r); k <= Math.min(w - 1, x + r); k++) { var v = A[y * w + k]; if (v < m) m = v; } B[y * w + x] = m; }
    for (x = 0; x < w; x++) for (y = 0; y < h; y++) { m = 255; for (k = Math.max(0, y - r); k <= Math.min(h - 1, y + r); k++) { var v2 = B[k * w + x]; if (v2 < m) m = v2; } A[y * w + x] = m; }
    for (k = 0; k < n; k++) d[k * 4 + 3] = A[k];
    g.putImageData(id, 0, 0);
  }
  async function remove(file, onStep) {
    STEP = onStep || null;
    try {
      var im = await bitmap(file), sc = Math.min(1, MAXS / Math.max(im.naturalWidth, im.naturalHeight));
      var w = Math.max(1, Math.round(im.naturalWidth * sc)), h = Math.max(1, Math.round(im.naturalHeight * sc));
      var sess = await load();
      if (STEP) STEP({ stage: "run", pct: 0 });
      /* AI को 320×320 की फ़ोटो: ImageNet mean/std, सबसे चमकीले pixel से भाग (rembg जैसा) */
      var a = document.createElement("canvas"); a.width = S; a.height = S;
      var ag = a.getContext("2d"); ag.drawImage(im, 0, 0, S, S);
      var px = ag.getImageData(0, 0, S, S).data, n = S * S, mx = 1;
      for (var i = 0; i < px.length; i += 4) { if (px[i] > mx) mx = px[i]; if (px[i + 1] > mx) mx = px[i + 1]; if (px[i + 2] > mx) mx = px[i + 2]; }
      var inp = new Float32Array(3 * n), M = [.485, .456, .406], SD = [.229, .224, .225];
      for (var k = 0; k < n; k++) for (var ch = 0; ch < 3; ch++) inp[ch * n + k] = (px[k * 4 + ch] / mx - M[ch]) / SD[ch];
      var feeds = {}; feeds[sess.inputNames[0]] = new ort.Tensor("float32", inp, [1, 3, S, S]);
      var out = await sess.run(feeds), d = out[sess.outputNames[0]].data, lo = Infinity, hi = -Infinity;
      for (var j = 0; j < n; j++) { if (d[j] < lo) lo = d[j]; if (d[j] > hi) hi = d[j]; }
      var rg = hi - lo || 1, mk = document.createElement("canvas"); mk.width = S; mk.height = S;
      var mg = mk.getContext("2d"), md = mg.createImageData(S, S);
      for (var q = 0; q < n; q++) { var v = ((d[q] - lo) / rg - .25) / .5; md.data[q * 4 + 3] = Math.round(Math.max(0, Math.min(1, v)) * 255); }   /* किनारे साफ़: धुंधली परछाईं कम */
      holes(px, md.data);   /* हैंडल के छेद जैसी अंदर की खाली जगह */
      mg.putImageData(md, 0, 0);
      /* असली फ़ोटो × mask (बड़ा करके, smooth) → सफ़ेद background */
      var c = document.createElement("canvas"); c.width = w; c.height = h;
      var g = c.getContext("2d"); g.drawImage(im, 0, 0, w, h);
      g.globalCompositeOperation = "destination-in"; g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high"; g.drawImage(mk, 0, 0, w, h);
      erode(g, w, h, Math.max(1, Math.round(Math.max(w, h) / 700)));   /* किनारे की पतली परछाईं (पुराने background की लकीर) हटाएँ */
      var o = document.createElement("canvas"); o.width = w; o.height = h;
      var og = o.getContext("2d"); og.fillStyle = "#fff"; og.fillRect(0, 0, w, h); og.drawImage(c, 0, 0);
      var bl = await new Promise(function (r) { o.toBlob(r, "image/webp", .95); });
      if (!bl || bl.type !== "image/webp") bl = await new Promise(function (r) { o.toBlob(r, "image/jpeg", .95); });
      if (!bl) throw new Error("encode");
      return new File([bl], "nobg." + (bl.type === "image/webp" ? "webp" : "jpg"), { type: bl.type });
    } finally { STEP = null; }
  }
  window.PBBg = { remove: remove, ready: function () { return !!P; } };
})();
