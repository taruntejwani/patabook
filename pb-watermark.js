/* PataBook — product फ़ोटो के नीचे-दाएँ कोने पर छोटा "PataBook.in" निशान (upload से पहले फ़ोटो में ही लग जाता है)।
   PBWM.mark(blob) → नया blob (WebP, ~150 KB तक)। कुछ गड़बड़ हो तो असली blob ही लौटाता है। */
(function () {
  var PIN = null;
  function pin() {
    if (PIN) return PIN;
    PIN = new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = "pin.png"; });
    return PIN;
  }
  function img(blob) {
    return new Promise(function (res, rej) {
      var u = URL.createObjectURL(blob), i = new Image();
      i.onload = function () { URL.revokeObjectURL(u); res(i); };
      i.onerror = function () { URL.revokeObjectURL(u); rej(new Error("img")); };
      i.src = u;
    });
  }
  function rr(x, X, Y, W, H, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r); x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath(); }
  async function mark(blob) {
    try {
      var im = await img(blob), p = await pin();
      var c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight;
      var x = c.getContext("2d"); x.drawImage(im, 0, 0);
      var s = Math.min(c.width, c.height), h = Math.max(20, Math.round(s * 0.075)), fs = Math.round(h * 0.56), pad = Math.round(h * 0.28), m = Math.round(s * 0.025);
      x.font = "800 " + fs + "px Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";
      var t1 = "Pata", t2 = "Book", t3 = ".in", w1 = x.measureText(t1).width, w2 = x.measureText(t2).width, w3 = x.measureText(t3).width;
      var iw = p ? Math.round(h * 0.62) : 0, gap = p ? Math.round(h * 0.16) : 0, W = Math.round(pad + iw + gap + w1 + w2 + w3 + pad), X = c.width - W - m, Y = c.height - h - m;
      x.save(); x.shadowColor = "rgba(0,0,0,.18)"; x.shadowBlur = Math.round(h * 0.25); x.fillStyle = "rgba(255,255,255,.88)"; rr(x, X, Y, W, h, h / 2); x.fill(); x.restore();
      if (p) { var ih = iw * (p.naturalHeight / p.naturalWidth); x.drawImage(p, X + pad, Y + (h - ih) / 2, iw, ih); }
      var tx = X + pad + iw + gap, ty = Y + h / 2; x.textBaseline = "middle";
      x.fillStyle = "#12141c"; x.fillText(t1, tx, ty); x.fillStyle = "#1a73e8"; x.fillText(t2, tx + w1, ty); x.fillStyle = "#5b6475"; x.fillText(t3, tx + w1 + w2, ty);
      return await new Promise(function (res) {
        function tryQ(q) { c.toBlob(function (b) { if (b && b.size < 150000) return res(b); if (q > 0.4) return tryQ(Math.round((q - 0.1) * 100) / 100); res(b || blob); }, "image/webp", q); }
        tryQ(0.8);
      });
    } catch (e) { return blob; }
  }
  window.PBWM = { mark: mark };
})();
