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
      mg.putImageData(md, 0, 0);
      /* असली फ़ोटो × mask (बड़ा करके, smooth) → सफ़ेद background */
      var c = document.createElement("canvas"); c.width = w; c.height = h;
      var g = c.getContext("2d"); g.drawImage(im, 0, 0, w, h);
      g.globalCompositeOperation = "destination-in"; g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high"; g.drawImage(mk, 0, 0, w, h);
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
