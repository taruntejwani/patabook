/* PataBook — ✨ फ़ोटो का background हटाना (phone पर ही; फ़ोटो किसी बाहरी कंपनी को नहीं जाती)
   AI: BiRefNet-lite (MIT license, कारोबार में मुफ़्त) — Transformers.js (Apache-2.0) से चलता है।
   पहली बार ~115 MB model download होता है, फिर browser में रखा रहता है।
   PBBg.remove(file, onStep) → Promise<File>  (सफ़ेद background वाली फ़ोटो)
   onStep({stage:"load"|"run", pct}) — download / काम की प्रगति दिखाने के लिए */
(function () {
  var TJ = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.2";
  var MID = "onnx-community/BiRefNet_lite-ONNX";
  var MAXS = 1500;   /* बहुत बड़ी फ़ोटो पहले छोटी — phone की memory बचाने के लिए */
  var P = null, STEP = null;

  function prog(e) {
    if (!STEP || !e) return;
    if (e.status === "progress" && /\.onnx/.test(e.file || "")) STEP({ stage: "load", pct: Math.round(e.progress || 0) });
  }
  function load() {
    if (P) return P;
    P = import(TJ).then(async function (T) {
      T.env.allowLocalModels = false;
      var opts = { dtype: "fp16", progress_callback: prog }, model;
      if (navigator.gpu) {
        try { model = await T.AutoModel.from_pretrained(MID, Object.assign({ device: "webgpu" }, opts)); } catch (e) { model = null; }
      }
      if (!model) model = await T.AutoModel.from_pretrained(MID, Object.assign({ device: "wasm" }, opts));
      var proc = await T.AutoProcessor.from_pretrained(MID);
      return { T: T, model: model, proc: proc };
    });
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
      var c = document.createElement("canvas"); c.width = w; c.height = h;
      var g = c.getContext("2d"); g.drawImage(im, 0, 0, w, h);
      var src = await new Promise(function (r) { c.toBlob(r, "image/png"); });
      var m = await load();
      if (STEP) STEP({ stage: "run", pct: 0 });
      var raw = await m.T.RawImage.fromBlob(src);
      var inp = await m.proc(raw);
      var out = await m.model({ input_image: inp.pixel_values });
      var mask = await m.T.RawImage.fromTensor(out.output_image[0].sigmoid().mul(255).to("uint8")).resize(w, h);
      var id = g.getImageData(0, 0, w, h), px = id.data, md = mask.data, ch = mask.channels || 1;
      for (var p = 0, q = 0; p < px.length; p += 4, q += ch) px[p + 3] = md[q];
      g.putImageData(id, 0, 0);
      /* सफ़ेद background पर रखें — online shopping जैसी साफ़ फ़ोटो */
      var o = document.createElement("canvas"); o.width = w; o.height = h;
      var og = o.getContext("2d"); og.fillStyle = "#fff"; og.fillRect(0, 0, w, h); og.drawImage(c, 0, 0);
      var bl = await new Promise(function (r) { o.toBlob(r, "image/webp", .95); });
      if (!bl) bl = await new Promise(function (r) { o.toBlob(r, "image/jpeg", .95); });
      if (!bl) throw new Error("encode");
      return new File([bl], "nobg." + (bl.type === "image/webp" ? "webp" : "jpg"), { type: bl.type });
    } finally { STEP = null; }
  }
  window.PBBg = { remove: remove, ready: function () { return !!P; } };
})();
