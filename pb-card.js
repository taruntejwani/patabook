/* PataBook — मुफ़्त डिजिटल विज़िटिंग कार्ड (फ़ोन में ही बनता है, कोई server नहीं)
   PBCard.open({slug,name,category,sub,owner,address,city,phone,code})
   - phone सिर्फ़ तब दें जब वह सबको दिखाने लायक हो (दुकानदार ने नंबर ON रखा हो) */
(function () {
  /* ---------- QR code (byte mode, level M, version 1–10) ---------- */
  var ECC = [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26], NB = [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5];
  function rawm(v) { var r = (16 * v + 128) * v + 64; if (v >= 2) { var n = (v / 7 | 0) + 2; r -= (25 * n - 10) * n - 55; if (v >= 7) r -= 36; } return r; }
  function dcw(v) { return (rawm(v) >> 3) - ECC[v] * NB[v]; }
  function gm(x, y) { var z = 0; for (var i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 255; }
  function rsDiv(d) { var r = []; for (var i = 0; i < d - 1; i++) r.push(0); r.push(1); var root = 1;
    for (var k = 0; k < d; k++) { for (var j = 0; j < d; j++) { r[j] = gm(r[j], root); if (j + 1 < d) r[j] ^= r[j + 1]; } root = gm(root, 2); } return r; }
  function rsRem(data, dv) { var res = dv.map(function () { return 0; });
    data.forEach(function (b) { var f = b ^ res.shift(); res.push(0); dv.forEach(function (c, i) { res[i] ^= gm(c, f); }); }); return res; }
  function alignPos(v) { if (v === 1) return []; var n = (v / 7 | 0) + 2, step = ((v * 8 + n * 3 + 5) / (n * 4 - 4) | 0) * 2, r = [6];
    for (var i = 0; i < n - 1; i++) r.splice(1, 0, v * 4 + 10 - i * step); return r; }
  function qr(text) {
    var data = Array.from(new TextEncoder().encode(text)), v, cc;
    for (v = 1; v <= 10; v++) { cc = v < 10 ? 8 : 16; if (4 + cc + 8 * data.length <= dcw(v) * 8) break; }
    if (v > 10) throw new Error('qr too long');
    var bits = []; function app(val, n) { for (var i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); }
    app(4, 4); app(data.length, cc); data.forEach(function (b) { app(b, 8); });
    var cap = dcw(v) * 8; app(0, Math.min(4, cap - bits.length)); app(0, (8 - bits.length % 8) % 8);
    for (var pad = 0xEC; bits.length < cap; pad ^= 0xEC ^ 0x11) app(pad, 8);
    var cw = []; for (var i = 0; i < bits.length; i += 8) { var x = 0; for (var j = 0; j < 8; j++) x = x << 1 | bits[i + j]; cw.push(x); }
    var nb = NB[v], ecl = ECC[v], raw = rawm(v) >> 3, nshort = nb - raw % nb, slen = (raw / nb | 0), dv = rsDiv(ecl), blocks = [], k = 0;
    for (i = 0; i < nb; i++) { var dl = slen - ecl + (i < nshort ? 0 : 1), d = cw.slice(k, k + dl); k += dl; var e = rsRem(d, dv); if (i < nshort) d.push(null); blocks.push(d.concat(e)); }
    var fin = []; for (i = 0; i < blocks[0].length; i++) blocks.forEach(function (b, j) { if (i !== slen - ecl || j >= nshort) fin.push(b[i]); });
    var S = v * 4 + 17, M = [], F = [];
    for (i = 0; i < S; i++) { M.push(new Array(S).fill(0)); F.push(new Array(S).fill(false)); }
    function sf(x, y, dk) { M[y][x] = dk ? 1 : 0; F[y][x] = true; }
    for (i = 0; i < S; i++) { sf(6, i, i % 2 === 0); sf(i, 6, i % 2 === 0); }
    function finder(cx, cy) { for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) { var dd = Math.max(Math.abs(dx), Math.abs(dy)), xx = cx + dx, yy = cy + dy; if (xx >= 0 && xx < S && yy >= 0 && yy < S) sf(xx, yy, dd !== 2 && dd !== 4); } }
    finder(3, 3); finder(S - 4, 3); finder(3, S - 4);
    var ap = alignPos(v), n = ap.length;
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) { if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue;
      for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) sf(ap[i] + dx, ap[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }
    function fmt(mask) { var dt = mask, rem = dt; for (var q = 0; q < 10; q++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      var b = ((dt << 10) | rem) ^ 0x5412;
      for (q = 0; q < 6; q++) sf(8, q, (b >>> q) & 1); sf(8, 7, (b >>> 6) & 1); sf(8, 8, (b >>> 7) & 1); sf(7, 8, (b >>> 8) & 1);
      for (q = 9; q < 15; q++) sf(14 - q, 8, (b >>> q) & 1); for (q = 0; q < 8; q++) sf(S - 1 - q, 8, (b >>> q) & 1);
      for (q = 8; q < 15; q++) sf(8, S - 15 + q, (b >>> q) & 1); sf(8, S - 8, 1); }
    fmt(0);
    if (v >= 7) { var rm = v; for (i = 0; i < 12; i++) rm = (rm << 1) ^ ((rm >>> 11) * 0x1F25); var vb = v << 12 | rm;
      for (i = 0; i < 18; i++) { var bt = (vb >>> i) & 1, a = S - 11 + i % 3, c = i / 3 | 0; sf(a, c, bt); sf(c, a, bt); } }
    var all = []; fin.forEach(function (byte) { for (var q = 7; q >= 0; q--) all.push((byte >>> q) & 1); });
    var bi = 0;
    for (var right = S - 1; right >= 1; right -= 2) { if (right === 6) right = 5;
      for (var vert = 0; vert < S; vert++) for (j = 0; j < 2; j++) { var xx = right - j, up = ((right + 1) & 2) === 0, yy = up ? S - 1 - vert : vert;
        if (!F[yy][xx] && bi < all.length) M[yy][xx] = all[bi++]; } }
    function masked(mask) { var G = M.map(function (r) { return r.slice(); });
      for (var y = 0; y < S; y++) for (var x = 0; x < S; x++) { if (F[y][x]) continue; var c;
        switch (mask) { case 0: c = (x + y) % 2 === 0; break; case 1: c = y % 2 === 0; break; case 2: c = x % 3 === 0; break; case 3: c = (x + y) % 3 === 0; break;
          case 4: c = ((x / 3 | 0) + (y / 2 | 0)) % 2 === 0; break; case 5: c = x * y % 2 + x * y % 3 === 0; break; case 6: c = (x * y % 2 + x * y % 3) % 2 === 0; break; default: c = ((x + y) % 2 + x * y % 3) % 2 === 0; }
        if (c) G[y][x] ^= 1; } return G; }
    function pen(G) { var p = 0, T = G[0].map(function (_, c) { return G.map(function (r) { return r[c]; }); });
      [G, T].forEach(function (rows) { rows.forEach(function (r) { var run = 1; for (var q = 1; q < S; q++) { if (r[q] === r[q - 1]) run++; else { if (run >= 5) p += run - 2; run = 1; } } if (run >= 5) p += run - 2;
        var s = r.join(''); p += 40 * ((s.split('10111010000').length - 1) + (s.split('00001011101').length - 1)); }); });
      for (var y = 0; y < S - 1; y++) for (var x = 0; x < S - 1; x++) if (G[y][x] === G[y][x + 1] && G[y][x] === G[y + 1][x] && G[y][x] === G[y + 1][x + 1]) p += 3;
      var dark = 0; G.forEach(function (r) { r.forEach(function (c) { dark += c; }); }); p += Math.floor(Math.abs(dark * 20 - S * S * 10) / (S * S)) * 10; return p; }
    var best = null; for (var m = 0; m < 8; m++) { fmt(m); var G = masked(m), pp = pen(G); if (!best || pp < best[0]) best = [pp, m]; }
    fmt(best[1]); return masked(best[1]);
  }

  /* ---------- कार्ड ---------- */
  var THEMES = [
    ['food|restaurant|cafe|sweet|bakery|nashta|tea|chai|dhaba|catering|tiffin', '🍽️', ['#1fae6b', '#0d7a4b', '#06402a']],
    ['auto|car|bike|tyre|garage|vehicle', '🚗', ['#2f86ff', '#1257d6', '#0a2f73']],
    ['health|doctor|hospital|medical|dental|clinic|diagnostic|pharma|chemist', '🏥', ['#27b5c9', '#0f7d9a', '#063e52']],
    ['school|college|tuition|coaching|education|class|academy', '🎓', ['#9a5bf0', '#6a2cc0', '#33115f']],
    ['salon|beauty|spa|parlour|parlor', '💇', ['#f06292', '#c2185b', '#5e0b2d']],
    ['hotel|guest|resort|stay|lodge', '🏨', ['#5c6bf2', '#3442c0', '#141c5c']],
    ['electric|plumb|carpenter|painter|ac service|repair|cleaning|appliance|home|construction|hardware|building', '🛠️', ['#ffad33', '#e07800', '#6e3500']],
    ['mobile|electronic|computer|telecom|internet', '📱', ['#3fa0ff', '#1565c0', '#0b2f6b']],
    ['cloth|footwear|fashion|garment|boutique|tailor', '👗', ['#ff7a59', '#d8431d', '#661c08']],
    ['grocery|kirana|general store|supermarket', '🛒', ['#5fbf3f', '#2e8b1f', '#11400b']],
    ['shop|shopping|store|retail|wholesale|supplier|distributor|manufactur|factory', '🏬', ['#ff8f3d', '#e0601b', '#6b2a07']],
    ['travel|taxi|transport|courier|truck|logistic|shipping', '🚚', ['#2bb3a3', '#127d72', '#063b36']],
    ['lawyer|advocate|legal|ca |chartered|architect|interior|marketing|professional|consult', '💼', ['#4a6fa5', '#2c4a7c', '#111f3b']],
    ['real estate|property|builder', '🏘️', ['#26a69a', '#00796b', '#003d36']],
    ['bank|insurance|loan|finance', '🏦', ['#3d7bd9', '#1f4fa6', '#0d2554']],
    ['wedding|event|photo|decor|tent', '📸', ['#e65aa0', '#a8246b', '#4d0b2f']],
    ['agri|farm|seed|fertil|dairy|milk', '🌾', ['#8bc34a', '#558b2f', '#233d10']],
    ['pet|animal|veterin', '🐾', ['#a1887f', '#6d4c41', '#2e1d17']]
  ];
  function theme(cat) { cat = ' ' + String(cat || '').toLowerCase() + ' ';
    for (var i = 0; i < THEMES.length; i++) if (new RegExp(THEMES[i][0]).test(cat)) return THEMES[i]; return ['', '🏪', ['#2f86ff', '#1257d6', '#0a2f73']]; }
  var FONT = '"Inter","Noto Sans Devanagari","Segoe UI",Roboto,system-ui,sans-serif';
  var IMG = {};
  function img(src) { if (IMG[src]) return IMG[src]; IMG[src] = new Promise(function (ok) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = src; }); return IMG[src]; }
  function X(h, e) { return (window.PB && PB.lang && PB.lang() !== 'hi') ? e : h; }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function fit(c, t, max, size, weight) { var s = size; do { c.font = weight + ' ' + s + 'px ' + FONT; if (c.measureText(t).width <= max) break; s -= 2; } while (s > size * 0.5); return s; }
  function wrap(c, t, max, lines) { var w = String(t || '').split(/\s+/), out = [], cur = '';
    w.forEach(function (x) { var tt = cur ? cur + ' ' + x : x; if (c.measureText(tt).width > max && cur) { out.push(cur); cur = x; } else cur = tt; }); if (cur) out.push(cur);
    if (out.length > lines) { out = out.slice(0, lines); out[lines - 1] = out[lines - 1].replace(/.{0,3}$/, '…'); } return out; }
  var ICO = {
    pin: function (c, x, y, s) { c.fillStyle = '#e53935'; c.beginPath(); c.arc(x, y - s * .12, s * .3, Math.PI, 0); c.lineTo(x, y + s * .42); c.closePath(); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y - s * .12, s * .12, 0, 7); c.fill(); },
    phone: function (c, x, y, s) { c.font = (s * .62) + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('📞', x, y + 2); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; },
    ig: function (c, x, y, s) { var g = c.createLinearGradient(x - s * .34, y + s * .34, x + s * .34, y - s * .34); g.addColorStop(0, '#feda75'); g.addColorStop(.5, '#d62976'); g.addColorStop(1, '#4f5bd5'); c.fillStyle = g; rr(c, x - s * .34, y - s * .34, s * .68, s * .68, s * .18); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = Math.max(2, s * .06); rr(c, x - s * .2, y - s * .2, s * .4, s * .4, s * .12); c.stroke(); c.beginPath(); c.arc(x, y, s * .09, 0, 7); c.stroke(); },
    fb: function (c, x, y, s) { c.fillStyle = '#1877f2'; c.beginPath(); c.arc(x, y, s * .34, 0, 7); c.fill(); c.fillStyle = '#fff'; c.font = '800 ' + (s * .5) + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('f', x + s * .02, y + s * .04); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; },
    wa: function (c, x, y, s) { c.fillStyle = '#25d366'; c.beginPath(); c.arc(x, y, s * .34, 0, 7); c.fill(); c.beginPath(); c.moveTo(x - s * .26, y + s * .22); c.lineTo(x - s * .34, y + s * .38); c.lineTo(x - s * .12, y + s * .3); c.fill();
      c.fillStyle = '#fff'; c.font = '700 ' + (s * .34) + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('✆', x, y + 1); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; }
  };
  async function draw(d, portrait) {
    var W = portrait ? 1080 : 1200, H = portrait ? 1920 : 690, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var c = cv.getContext('2d'), th = theme((d.sub || '') + ' ' + (d.category || '')), col = th[2];
    var g = c.createRadialGradient(W * .15, 0, 10, W * .3, H * .2, Math.max(W, H) * 1.05); g.addColorStop(0, col[0]); g.addColorStop(.45, col[1]); g.addColorStop(1, col[2]);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.save(); c.globalAlpha = .09; c.strokeStyle = '#fff'; c.lineWidth = 2; c.translate(W / 2, H / 2); c.rotate(-0.14); for (var gx = -W * 1.5; gx < W * 1.5; gx += 60) { c.beginPath(); c.moveTo(gx, -H * 1.5); c.lineTo(gx, H * 1.5); c.stroke(); } for (var gy = -H * 1.5; gy < H * 1.5; gy += 60) { c.beginPath(); c.moveTo(-W * 1.5, gy); c.lineTo(W * 1.5, gy); c.stroke(); } c.restore();
    var pin = await img('pin.png'), logo = await img('card-logo.png');
    var url = d.link ? 'https://patabook.in/' + d.link : location.origin.replace(/^http:\/\/localhost[^/]*/, 'https://patabook.in') + '/business.html?slug=' + encodeURIComponent(d.slug || '');
    var Q = qr(url), qs = Q.length;
    function badge(x, y, sc) { c.font = '800 ' + (21 * sc) + 'px ' + FONT; var t = 'Listed on PataBook', tw = c.measureText(t).width, w = tw + 92 * sc, h = 48 * sc;
      c.save(); c.shadowColor = 'rgba(0,0,0,.2)'; c.shadowBlur = 18; c.shadowOffsetY = 6; c.fillStyle = '#fff'; rr(c, x, y, w, h, h / 2); c.fill(); c.restore();
      if (pin) c.drawImage(pin, x + 10 * sc, y + 8 * sc, 26 * sc, 32 * sc);
      c.fillStyle = '#0b2f73'; c.textBaseline = 'middle'; c.fillText(t, x + 44 * sc, y + h / 2 + 1); c.fillStyle = '#12a150'; c.beginPath(); c.arc(x + w - 24 * sc, y + h / 2, 12 * sc, 0, 7); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = 3 * sc; c.beginPath(); c.moveTo(x + w - 30 * sc, y + h / 2); c.lineTo(x + w - 25 * sc, y + h / 2 + 5 * sc); c.lineTo(x + w - 17 * sc, y + h / 2 - 5 * sc); c.stroke(); c.textBaseline = 'alphabetic'; return w; }
    function qrBox(x, y, s) { c.save(); c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 36; c.shadowOffsetY = 16; c.fillStyle = '#fff'; rr(c, x, y, s, s, 26); c.fill(); c.restore();
      var pad = 20, m = (s - 2 * pad) / (qs + 4), ox = x + pad + 2 * m, oy = y + pad + 2 * m; c.fillStyle = '#0b2f73';
      for (var yy = 0; yy < qs; yy++) for (var xx = 0; xx < qs; xx++) if (Q[yy][xx]) c.fillRect(Math.floor(ox + xx * m), Math.floor(oy + yy * m), Math.ceil(m), Math.ceil(m)); }
    function row(x, y, kind, text, size, maxw, lines) { lines = lines || 1; var b = size * 1.7; c.fillStyle = '#fff'; rr(c, x, y - b / 2, b, b, b * .26); c.fill(); ICO[kind](c, x + b / 2, y, b); c.fillStyle = '#fff';
      c.font = '600 ' + size + 'px ' + FONT; c.textBaseline = 'middle'; var L = wrap(c, text, maxw, lines); L.forEach(function (t, k) { c.fillText(t, x + b + 16, y + 1 + k * size * 1.3); }); c.textBaseline = 'alphabetic'; return L.length; }
    function ownerPill(x, cyy, size, mid) { var t = '👤  ' + X('मालिक: ', 'Owner: ') + d.owner; c.font = '700 ' + size + 'px ' + FONT; var w = c.measureText(t).width + 44, h = size * 1.9, bx = mid ? x - w / 2 : x;
      c.fillStyle = 'rgba(255,255,255,.18)'; rr(c, bx, cyy - h / 2, w, h, h / 2); c.fill(); c.strokeStyle = 'rgba(255,255,255,.38)'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#fff'; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(t, bx + 22, cyy + 1); c.textBaseline = 'alphabetic'; }
    function linkPill(cx, cyy, size) { if (!d.link) return; var t = '🔗 patabook.in/' + d.link, s2 = size; c.font = '800 ' + s2 + 'px ' + FONT; while (c.measureText(t).width > W - 220 && s2 > 16) { s2 -= 2; c.font = '800 ' + s2 + 'px ' + FONT; }
      var w = c.measureText(t).width + 56, h = s2 * 2; c.fillStyle = 'rgba(255,255,255,.16)'; rr(c, cx - w / 2, cyy - h / 2, w, h, h / 2); c.fill(); c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 2; c.stroke();
      c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, cx, cyy + 1); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; }
    function foot(h, sc) { c.fillStyle = '#fff'; c.fillRect(0, H - h, W, h); var y = H - h / 2;
      if (logo) c.drawImage(logo, 56 * sc, y - 29 * sc, 58 * sc, 58 * sc);
      c.textBaseline = 'middle'; c.font = '900 ' + (32 * sc) + 'px ' + FONT; c.fillStyle = '#12141c'; c.fillText('Pata', 130 * sc, y - 10 * sc); c.fillStyle = '#1a73e8'; c.fillText('Book', 130 * sc + c.measureText('Pata').width, y - 10 * sc);
      c.font = '700 ' + ((sc > 1.2 ? 10.5 : 13) * sc) + 'px ' + FONT; c.fillStyle = '#0b2f73'; c.fillText('D I G I T A L   B U S I N E S S   D I R E C T O R Y', 130 * sc, y + 20 * sc);
      c.textAlign = 'right'; c.font = '800 ' + (26 * sc) + 'px ' + FONT; c.fillStyle = '#1a73e8'; c.fillText('patabook.in', W - 56 * sc, y - 10 * sc);
      c.font = '600 ' + (15 * sc) + 'px ' + FONT; c.fillStyle = '#667085'; c.fillText('Free Digital Visiting Card', W - 56 * sc, y + 18 * sc); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; }
    var catTxt = [d.category, d.sub].filter(Boolean).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(' · ');
    var addrT = [d.address, d.city].filter(Boolean).filter(function (x, i, a) { return i === 0 || String(a[0]).toLowerCase().indexOf(String(x).toLowerCase()) < 0; }).join(', '), rows = [];
    function fmt(n) { var q = String(n).replace(/\D/g, '').slice(-10); return '+91 ' + q.slice(0, 5) + ' ' + q.slice(5); }
    if (addrT) rows.push(['pin', addrT]);
    if (d.phone) { rows.push(['phone', fmt(d.phone)]); rows.push(['wa', 'WhatsApp  ' + fmt(d.wa || d.phone)]); }
    else rows.push(['phone', X('नंबर PataBook पर देखें', 'See number on PataBook')]);
    function soc(u, ig) { var m = String(u || '').match(/^https?:\/\/(?:www\.)?(?:instagram|facebook)\.com\/([^?#\/]+)/i); return m ? (ig ? '@' + m[1].replace(/^@/, '') : 'facebook.com/' + m[1]) : ''; }
    if (soc(d.insta, 1)) rows.push(['ig', soc(d.insta, 1)]);
    if (soc(d.fb, 0)) rows.push(['fb', soc(d.fb, 0)]);
    if (!portrait) {
      var ns = fit(c, d.name, 690, 70, 900); c.fillStyle = '#fff'; c.textBaseline = 'alphabetic'; c.fillText(d.name, 64, 64 + ns * .82);
      var cy = 64 + ns + 46;
      c.fillStyle = 'rgba(255,255,255,.14)'; rr(c, 64, cy - 29, 58, 58, 16); c.fill(); c.fillStyle = '#fff'; c.font = '32px ' + FONT; c.textBaseline = 'middle'; c.fillText(th[1], 74, cy);
      c.fillStyle = 'rgba(255,255,255,.9)'; c.font = '700 27px ' + FONT; c.fillText(catTxt || 'Business', 138, cy); c.textBaseline = 'alphabetic';
      var y0 = cy + 54; if (d.owner) { ownerPill(64, y0 + 8, 23, false); y0 += 52; }
      y0 += 22; var yl = y0, dense = rows.length > 3, fs = dense ? 25 : 27, st = rows.length > 4 ? 50 : dense ? 56 : 62; rows.forEach(function (r) { var n = row(64, yl, r[0], r[1], fs, 640, r[0] === 'pin' ? 2 : 1); yl += st + (n - 1) * 33; });
      qrBox(814, 56, 330);
      c.fillStyle = '#e8f0ff'; c.textAlign = 'center'; c.font = '700 21px ' + FONT; c.fillText(X('📱 Scan करें — दुकान', '📱 Scan to view this'), 979, 418); c.fillText(X('PataBook पर देखें', 'shop on PataBook'), 979, 446);
      if (d.code) { c.font = '800 22px ui-monospace,Menlo,monospace'; var cw2 = c.measureText(d.code).width + 32; c.fillStyle = 'rgba(255,255,255,.14)'; rr(c, 979 - cw2 / 2, 474, cw2, 42, 12); c.fill(); c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = 2; c.stroke(); c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(d.code, 979, 496); c.textBaseline = 'alphabetic'; }
      linkPill(W / 2, H - 86 - 30, 22);
      c.textAlign = 'left'; foot(86, 1);
    } else {
      var ps = fit(c, d.name, 960, 104, 900); c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(d.name, W / 2, 330);
      var cy2 = 330 + ps * .5 + 58; c.fillStyle = 'rgba(255,255,255,.9)'; c.font = '700 40px ' + FONT; c.fillText(th[1] + '  ' + (catTxt || 'Business'), W / 2, cy2);
      var yy0 = cy2 + 56; if (d.owner) { ownerPill(W / 2, yy0 + 14, 34, true); yy0 += 70; }
      c.textAlign = 'left'; c.textBaseline = 'alphabetic'; yy0 += 80;
      var yp = yy0; rows.slice(0, 5).forEach(function (r) { var n = row(130, yp, r[0], r[1], 38, 760, r[0] === 'pin' ? 2 : 1); yp += (rows.length > 3 ? 78 : 90) + (n - 1) * 50; });
      var qy = yp + 20; qrBox(W / 2 - 220, qy, 440);
      c.textAlign = 'center'; c.fillStyle = '#e8f0ff'; c.font = '700 32px ' + FONT; c.fillText(X('📱 Scan करें — दुकान PataBook पर देखें', '📱 Scan to view this shop on PataBook'), W / 2, qy + 500);
      if (d.code) { c.font = '800 30px ui-monospace,Menlo,monospace'; var cw3 = c.measureText(d.code).width + 40; c.fillStyle = 'rgba(255,255,255,.14)'; rr(c, W / 2 - cw3 / 2, qy + 536, cw3, 56, 14); c.fill(); c.fillStyle = '#fff'; c.textBaseline = 'middle'; c.fillText(d.code, W / 2, qy + 565); c.textBaseline = 'alphabetic'; }
      linkPill(W / 2, H - 150 - 64, 38);
      c.textAlign = 'left'; foot(150, 1.65);
    }
    return cv;
  }

  /* ---------- त्योहार की शुभकामना poster ----------
     • हर त्योहार के 5 अलग डिज़ाइन — poster के दोनों तरफ़ ‹ › तीर (या उँगली से swipe) से बदलें
     • "आने वाले" त्योहारों के tab अपने-आप दिखते हैं (त्योहार से 45 दिन पहले से, बीतने तक)
     • हर साल नई तारीखें यहाँ जोड़ें (IST, YYYY-MM-DD). from–to = वह समय जब वह "अभी का त्योहार" माना जाए
     • pal = 5 रंग-जोड़ियाँ, art = 5 चित्र-शैलियाँ (हर डिज़ाइन = pal[i] + art[i]) */
  var NV = 5, TOR = [1, 0, 1, 0, 1], FRM = ['gold', 'none', 'double', 'dots', 'gold'];
  var FEST = [
    { id: 'navratri', from: '2026-10-09', to: '2026-10-19', ic: '🙏', n: { hi: 'नवरात्रि', gu: 'નવરાત્રી', en: 'Navratri' },
      pal: [['#ff6a00', '#d1145a', '#5b0a6b'], ['#e53935', '#ad1457', '#3a0f5c'], ['#ff8f00', '#c2185b', '#311b92'], ['#ff5722', '#b71c1c', '#3e0a1a'], ['#0d47a1', '#7b1fa2', '#3a0a4a']],
      art: ['mandala', 'diyaring', 'rangoli', 'bokeh', 'rays'],
      t: { hi: ['शुभ नवरात्रि', 'माँ अम्बे आप सबको सुख, समृद्धि और खुशियाँ दें'], gu: ['શુભ નવરાત્રી', 'માં અંબે આપ સૌને સુખ, સમૃદ્ધિ અને ખુશીઓ આપે'], en: ['Happy Navratri', 'May Maa Ambe bless you with joy and prosperity'] } },
    { id: 'dussehra', from: '2026-10-15', to: '2026-10-21', ic: '🏹', n: { hi: 'दशहरा', gu: 'દશેરા', en: 'Dussehra' },
      pal: [['#ffb300', '#e64a19', '#7a1a0a'], ['#ff7043', '#bf360c', '#3e1005'], ['#ffa000', '#6d1b1b', '#1a0505'], ['#1a237e', '#b71c1c', '#3e0a0a'], ['#f57c00', '#8e2400', '#2b0a00']],
      art: ['bow', 'rays', 'fireworks', 'diyaring', 'bokeh'],
      t: { hi: ['विजयादशमी की शुभकामनाएँ', 'बुराई पर अच्छाई की जीत का पर्व मंगलमय हो'], gu: ['વિજયાદશમીની શુભકામના', 'અસત્ય પર સત્યના વિજયનું પર્વ મંગલમય હો'], en: ['Happy Dussehra', 'May good always win over evil'] } },
    { id: 'karwa', from: '2026-10-26', to: '2026-10-29', ic: '🌙', n: { hi: 'करवा चौथ', gu: 'કરવા ચોથ', en: 'Karwa Chauth' },
      pal: [['#d81b60', '#880e4f', '#2a0518'], ['#1a237e', '#4a148c', '#0a0620'], ['#e53935', '#7f0000', '#240000'], ['#ff7043', '#ad1457', '#30082a'], ['#512da8', '#880e4f', '#1a0a2a']],
      art: ['moon', 'bokeh', 'rangoli', 'diyaring', 'mandala'],
      t: { hi: ['करवा चौथ की शुभकामनाएँ', 'आपका साथ और प्यार सदा बना रहे'], gu: ['કરવા ચોથની શુભકામના', 'આપનો સાથ અને પ્રેમ સદા અખંડ રહે'], en: ['Happy Karwa Chauth', 'May your bond of love shine forever'] } },
    { id: 'dhanteras', from: '2026-11-01', to: '2026-11-08', ic: '💰', n: { hi: 'धनतेरस', gu: 'ધનતેરસ', en: 'Dhanteras' },
      pal: [['#ffd54f', '#c77800', '#5d2a00'], ['#ffb300', '#8d3b00', '#2e1100'], ['#880e4f', '#5d0a3a', '#1f0415'], ['#00695c', '#004d40', '#00201b'], ['#ff8f00', '#6a1b00', '#1a0a00']],
      art: ['coins', 'lotus', 'rangoli', 'diyaring', 'bokeh'],
      t: { hi: ['शुभ धनतेरस', 'माँ लक्ष्मी आपके घर-व्यापार में धन-धान्य भरें'], gu: ['શુભ ધનતેરસ', 'માં લક્ષ્મી આપના ઘર-વેપારમાં ધન-ધાન્ય ભરે'], en: ['Happy Dhanteras', 'May Goddess Lakshmi bless your home and business'] } },
    { id: 'diwali', from: '2026-11-01', to: '2026-11-09', ic: '🪔', n: { hi: 'दीपावली', gu: 'દીપાવલી', en: 'Diwali' },
      pal: [['#2b1a6b', '#130d3d', '#05051a'], ['#ff8f00', '#b71c1c', '#2a0808'], ['#4a148c', '#880e4f', '#1a0520'], ['#0d47a1', '#1a237e', '#050a2a'], ['#ffb300', '#e65100', '#3e1500']],
      art: ['fireworks', 'diyaring', 'rangoli', 'lotus', 'bokeh'],
      t: { hi: ['शुभ दीपावली', 'दीपों का यह पर्व आपके जीवन में खुशियों का उजाला लाए'], gu: ['શુભ દીપાવલી', 'દીવાઓનો આ તહેવાર આપના જીવનમાં ખુશીઓનો પ્રકાશ લાવે'], en: ['Happy Diwali', 'May this festival of lights fill your life with joy'] } },
    { id: 'newyear', from: '2026-11-08', to: '2026-11-12', ic: '🎊', n: { hi: 'नूतन वर्ष', gu: 'નૂતન વર્ષ', en: 'New Year' },
      pal: [['#00c6a7', '#1e6fd9', '#1a237e'], ['#ff6f00', '#d81b60', '#311b92'], ['#7c4dff', '#3949ab', '#0d1442'], ['#ffca28', '#f4511e', '#4a1a0a'], ['#00897b', '#0277bd', '#0b1f4a']],
      art: ['fireworks', 'bokeh', 'rays', 'rangoli', 'mandala'],
      t: { hi: ['नूतन वर्षाभिनंदन', 'नया साल आपके व्यापार में नई ऊँचाइयाँ लाए'], gu: ['નૂતન વર્ષાભિનંદન', 'નવું વર્ષ આપના વેપારમાં નવી ઊંચાઈઓ લાવે'], en: ['Happy New Year', 'May the new year bring new heights to your business'] } },
    { id: 'bhaibij', from: '2026-11-10', to: '2026-11-12', ic: '👫', n: { hi: 'भाई दूज', gu: 'ભાઈબીજ', en: 'Bhai Dooj' },
      pal: [['#ff8a65', '#d81b60', '#4a0d3a'], ['#f06292', '#8e24aa', '#2a0a4a'], ['#ffb74d', '#e91e63', '#4a0d2a'], ['#4db6ac', '#00796b', '#06302b'], ['#ba68c8', '#6a1b9a', '#240a3a']],
      art: ['lotus', 'mandala', 'bokeh', 'rangoli', 'diyaring'],
      t: { hi: ['भाई दूज की शुभकामनाएँ', 'भाई-बहन का प्यार हमेशा बना रहे'], gu: ['ભાઈબીજની શુભકામના', 'ભાઈ-બહેનનો પ્રેમ હંમેશા અખંડ રહે'], en: ['Happy Bhai Dooj', 'May the bond of love always stay strong'] } },
    { id: 'chhath', from: '2026-11-13', to: '2026-11-16', ic: '☀️', n: { hi: 'छठ पूजा', gu: 'છઠ પૂજા', en: 'Chhath Puja' },
      pal: [['#ff9800', '#e65100', '#4e1a00'], ['#ffca28', '#ef6c00', '#5d2a00'], ['#ff7043', '#bf360c', '#3e1005'], ['#00838f', '#ff8f00', '#4e2000'], ['#ffb74d', '#d84315', '#3a1000']],
      art: ['rays', 'lotus', 'bokeh', 'mandala', 'diyaring'],
      t: { hi: ['छठ पूजा की शुभकामनाएँ', 'सूर्य देव आपके जीवन को प्रकाश और सुख से भरें'], gu: ['છઠ પૂજાની શુભકામના', 'સૂર્યદેવ આપના જીવનને પ્રકાશ અને સુખથી ભરે'], en: ['Happy Chhath Puja', 'May Surya Dev fill your life with light and joy'] } },
    { id: 'gurunanak', from: '2026-11-22', to: '2026-11-24', ic: '🙏', n: { hi: 'गुरु नानक जयंती', gu: 'ગુરુ નાનક જયંતી', en: 'Guru Nanak Jayanti' },
      pal: [['#1a73e8', '#0b2f73', '#061a40'], ['#ffa000', '#e65100', '#4e1a00'], ['#283593', '#1a237e', '#0a0d3a'], ['#00897b', '#00695c', '#00251f'], ['#f57f17', '#bf360c', '#3b0f00']],
      art: ['rays', 'bokeh', 'mandala', 'rangoli', 'lotus'],
      t: { hi: ['गुरु नानक जयंती की शुभकामनाएँ', 'वाहेगुरु आप सबको सुख और शांति दें'], gu: ['ગુરુ નાનક જયંતીની શુભકામના', 'વાહેગુરુ આપ સૌને સુખ અને શાંતિ આપે'], en: ['Happy Guru Nanak Jayanti', 'May Waheguru bless you with peace and joy'] } }
  ];
  var GEN = { id: 'shop', ic: '🛍️', pal: [['#1a73e8', '#0b2f73', '#061a40']], art: ['bokeh'],
    t: { hi: ['आपकी सेवा में', 'भरोसेमंद सेवा, सही दाम — ज़रूर पधारें'], gu: ['આપની સેવામાં', 'વિશ્વસનીય સેવા, યોગ્ય ભાવ — જરૂર પધારો'], en: ['At Your Service', 'Trusted service, fair prices — do visit us'] },
    fr: { hi: ['', 'अब PataBook पर भी मिलें'], gu: ['', 'હવે PataBook પર પણ મળો'], en: ['', 'Now also on PataBook'] } };
  function istDay() { var d = new Date(Date.now() + 5.5 * 3600e3); return d.toISOString().slice(0, 10); }
  function dayN(s) { return Date.parse(s + 'T00:00:00Z') / 864e5; }
  function forced() { try { return new URLSearchParams(location.search).get('fest'); } catch (e) { return null; } }
  function activeFests() {              // "अभी का" त्योहार (from–to के बीच)
    var force = forced(), today = istDay();
    return FEST.filter(function (f) { return force ? f.id === force : (today >= f.from && today <= f.to); });
  }
  function upcomingFests() {            // tab में दिखने वाले: बीते नहीं + 45 दिन के अंदर आने वाले
    var force = forced(), today = istDay();
    if (force) return FEST.filter(function (f) { return f.id === force; });
    return FEST.filter(function (f) { return today <= f.to && dayN(f.from) - dayN(today) <= 45; }).sort(function (a, b) { return a.from < b.from ? -1 : a.from > b.from ? 1 : 0; });
  }
  function fLang() { var l = (window.PB && PB.lang && PB.lang()) || 'hi'; return l === 'gu' || l === 'en' ? l : 'hi'; }
  var FROM = { hi: ['की ओर से', 'आपको और आपके परिवार को हार्दिक शुभकामनाएँ'], gu: ['તરફથી', 'આપને અને આપના પરિવારને હાર્દિક શુભેચ્છાઓ'], en: ['Warm wishes from', 'to you and your family'] };

  /* ----- चित्र बनाने वाले छोटे औज़ार ----- */
  function rng(s) { return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function sparkle(c, x, y, r, a) { c.save(); c.globalAlpha = a; c.fillStyle = '#fff'; c.beginPath(); c.moveTo(x, y - r); c.quadraticCurveTo(x, y, x + r, y); c.quadraticCurveTo(x, y, x, y + r); c.quadraticCurveTo(x, y, x - r, y); c.quadraticCurveTo(x, y, x, y - r); c.fill(); c.restore(); }
  function glow(c, x, y, r, col) { var g = c.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,230,160,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  function emblem(c, ic, x, y, r) { c.save(); var g = c.createRadialGradient(x, y, r * .2, x, y, r); g.addColorStop(0, '#fff6c8'); g.addColorStop(1, '#ffc533');
    c.fillStyle = g; c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 24; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.shadowBlur = 0;
    c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 4; c.beginPath(); c.arc(x, y, r + 8, 0, 7); c.stroke();
    c.font = (r * 1.1) + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000'; c.fillText(ic, x, y + r * .06); c.restore(); }
  function diyaShape(c, x, y, s) {      // जलता हुआ छोटा दीया (s = चौड़ाई)
    c.fillStyle = '#8d3b12'; c.beginPath(); c.ellipse(x, y, s * .5, s * .22, 0, 0, Math.PI); c.fill();
    var g = c.createRadialGradient(x, y - s * .38, 1, x, y - s * .34, s * .5); g.addColorStop(0, 'rgba(255,240,150,1)'); g.addColorStop(.4, 'rgba(255,170,0,.8)'); g.addColorStop(1, 'rgba(255,120,0,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y - s * .34, s * .5, 0, 7); c.fill();
    c.fillStyle = '#fff59d'; c.beginPath(); c.ellipse(x, y - s * .3, s * .1, s * .22, 0, 0, 7); c.fill(); }
  function diyas(c, W, H) { for (var i = 0; i < 7; i++) diyaShape(c, W * (i + .5) / 7, H - 250, 92); }
  function toran(c, W) {                // ऊपर बंदनवार
    var cols = ['#ffeb3b', '#ff9800', '#e91e63', '#4caf50', '#03a9f4', '#ffffff'];
    c.save(); c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 40); c.quadraticCurveTo(W / 2, 110, W, 40); c.stroke();
    for (var i = 0; i <= 18; i++) { var x = i * W / 18, y = 40 + (1 - Math.pow((x - W / 2) / (W / 2), 2)) * 35;
      c.fillStyle = cols[i % cols.length]; c.beginPath(); c.moveTo(x - 22, y); c.lineTo(x + 22, y); c.lineTo(x, y + 52); c.closePath(); c.fill(); }
    c.restore(); }
  var ART = {
    mandala: function (c, k) { var cx = k.cx, cy = k.cy; c.save(); c.translate(cx, cy);
      for (var ring = 0; ring < 4; ring++) { var n = 12 + ring * 6, r = 64 + ring * 54;
        for (var i = 0; i < n; i++) { c.save(); c.rotate(i / n * Math.PI * 2); c.fillStyle = k.cols[(i + ring) % k.cols.length]; c.globalAlpha = .6 + .1 * ring; c.beginPath(); c.ellipse(0, -r, 13 + ring * 3, 32 + ring * 4, 0, 0, 7); c.fill(); c.restore(); } }
      c.restore(); emblem(c, k.ic, cx, cy, 52);
      if (k.f.id === 'navratri') [[-1, '#ffeb3b'], [1, '#ff4081']].forEach(function (s) { c.save(); c.translate(cx + s[0] * 330, cy); c.rotate(s[0] * .5); c.fillStyle = s[1]; rr(c, -9, -150, 18, 300, 9); c.fill(); c.fillStyle = '#fff'; for (var q = -120; q <= 120; q += 40) c.fillRect(-9, q, 18, 8); c.restore(); }); },
    rays: function (c, k) { var cx = k.cx, cy = k.cy; c.save(); c.translate(cx, cy);
      var g = c.createRadialGradient(0, 0, 60, 0, 0, 340); g.addColorStop(0, 'rgba(255,240,180,.55)'); g.addColorStop(1, 'rgba(255,240,180,0)'); c.fillStyle = g;
      for (var i = 0; i < 28; i++) { c.rotate(Math.PI * 2 / 28); if (i % 2) { c.beginPath(); c.moveTo(0, 0); c.lineTo(-26, -340); c.lineTo(26, -340); c.closePath(); c.fill(); } }
      c.restore(); c.save(); c.strokeStyle = 'rgba(255,224,130,.7)'; c.lineWidth = 3; [120, 160].forEach(function (r) { c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke(); });
      c.setLineDash([2, 16]); c.lineCap = 'round'; c.lineWidth = 7; c.beginPath(); c.arc(cx, cy, 205, 0, 7); c.stroke(); c.restore();
      emblem(c, k.ic, cx, cy, 96); },
    fireworks: function (c, k) { var rnd = k.rnd, W = k.W;
      for (var i = 0; i < 60; i++) { c.fillStyle = 'rgba(255,255,255,' + (.2 + rnd() * .6) + ')'; c.beginPath(); c.arc(rnd() * W, 130 + rnd() * 520, rnd() * 2.2 + .5, 0, 7); c.fill(); }
      [[k.cx, 400, '#ffd54f', 170], [W * .17, 300, '#ff80ab', 105], [W * .83, 250, '#80d8ff', 105], [W * .3, 560, '#b9f6ca', 70], [W * .72, 540, '#ffab40', 80]].forEach(function (b) {
        for (var j = 0; j < 36; j++) { var a = j / 36 * Math.PI * 2, r1 = b[3] * .25, r2 = b[3] * (.75 + rnd() * .25);
          c.strokeStyle = b[2]; c.globalAlpha = .9; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(b[0] + Math.cos(a) * r1, b[1] + Math.sin(a) * r1); c.lineTo(b[0] + Math.cos(a) * r2, b[1] + Math.sin(a) * r2); c.stroke();
          c.fillStyle = '#fff'; c.beginPath(); c.arc(b[0] + Math.cos(a) * r2, b[1] + Math.sin(a) * r2, 4, 0, 7); c.fill(); }
        c.globalAlpha = 1; }); },
    coins: function (c, k) { var rnd = k.rnd, W = k.W; glow(c, k.cx, k.cy, 330, 'rgba(255,236,150,.55)');
      for (var i = 0; i < 30; i++) { var x = rnd() * W, y = 150 + rnd() * 500, r = 20 + rnd() * 26;
        c.fillStyle = '#ffd54f'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.strokeStyle = '#b8860b'; c.lineWidth = 4; c.stroke();
        c.fillStyle = '#b8860b'; c.font = '700 ' + (r * 1.1) + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('₹', x, y + 2); }
      emblem(c, k.ic, k.cx, k.cy, 84); },
    lotus: function (c, k) { var cx = k.cx, cy = k.cy; glow(c, cx, cy, 330, 'rgba(255,230,180,.5)');
      [[12, 270, 70, 'rgba(255,171,196,.85)', 0], [10, 215, 58, 'rgba(255,128,171,.92)', .31], [8, 160, 46, 'rgba(255,224,235,.97)', 0]].forEach(function (L) {
        for (var i = 0; i < L[0]; i++) { c.save(); c.translate(cx, cy); c.rotate(i / L[0] * Math.PI * 2 + L[4]); c.beginPath(); c.moveTo(0, 0);
          c.bezierCurveTo(L[2], -L[1] * .3, L[2] * .8, -L[1] * .8, 0, -L[1]); c.bezierCurveTo(-L[2] * .8, -L[1] * .8, -L[2], -L[1] * .3, 0, 0);
          c.fillStyle = L[3]; c.fill(); c.strokeStyle = 'rgba(255,255,255,.65)'; c.lineWidth = 2; c.stroke(); c.restore(); } });
      emblem(c, k.ic, cx, cy, 58); },
    rangoli: function (c, k) { var cx = k.cx, cy = k.cy;
      for (var ring = 0; ring < 5; ring++) { var n = 8 + ring * 4, r = 70 + ring * 48;
        c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke();
        for (var i = 0; i < n; i++) { var a = i / n * Math.PI * 2, s = 11 + ring * 2.5;
          c.save(); c.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r); c.rotate(a + Math.PI / 4); c.fillStyle = k.cols[(i + ring) % k.cols.length]; c.globalAlpha = .92; c.fillRect(-s, -s, s * 2, s * 2); c.restore();
          var a2 = a + Math.PI / n; c.fillStyle = '#fff'; c.globalAlpha = .85; c.beginPath(); c.arc(cx + Math.cos(a2) * (r + 26), cy + Math.sin(a2) * (r + 26), 4, 0, 7); c.fill(); c.globalAlpha = 1; } }
      emblem(c, k.ic, cx, cy, 52); },
    bokeh: function (c, k) { var rnd = k.rnd, W = k.W;
      for (var i = 0; i < 34; i++) { var x = rnd() * W, y = 80 + rnd() * 600, r = 24 + rnd() * 80, g = c.createRadialGradient(x, y, 1, x, y, r);
        g.addColorStop(0, 'rgba(255,255,255,.5)'); g.addColorStop(.6, k.cols[i % k.cols.length] + '66'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 3; [150, 195].forEach(function (r) { c.beginPath(); c.arc(k.cx, k.cy, r, 0, 7); c.stroke(); });
      emblem(c, k.ic, k.cx, k.cy, 104); },
    diyaring: function (c, k) { var cx = k.cx, cy = k.cy; glow(c, cx, cy, 340, 'rgba(255,200,90,.45)');
      c.strokeStyle = 'rgba(255,224,130,.5)'; c.lineWidth = 3; [150, 235].forEach(function (r) { c.beginPath(); c.arc(cx, cy, r, 0, 7); c.stroke(); });
      for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2 - Math.PI / 2; diyaShape(c, cx + Math.cos(a) * 235, cy + Math.sin(a) * 235 + 18, 78); }
      for (i = 0; i < 8; i++) { var b = i / 8 * Math.PI * 2; sparkle(c, cx + Math.cos(b) * 150, cy + Math.sin(b) * 150, 14, .9); }
      emblem(c, k.ic, cx, cy, 84); },
    moon: function (c, k) { var cx = k.cx, cy = k.cy; c.save(); var g = c.createLinearGradient(cx - 150, cy - 150, cx + 150, cy + 150); g.addColorStop(0, '#fff6c8'); g.addColorStop(1, '#ffc533');
      c.fillStyle = g; c.beginPath(); c.arc(cx - 20, cy, 170, 0, 7); c.fill(); c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.arc(cx + 70, cy - 45, 150, 0, 7); c.fill();
      c.globalCompositeOperation = 'destination-over'; glow(c, cx, cy, 340, 'rgba(255,224,130,.5)'); c.restore();
      for (var i = 0; i < 24; i++) sparkle(c, k.rnd() * k.W, 120 + k.rnd() * 540, 6 + k.rnd() * 12, .5 + k.rnd() * .5);
      var sx = cx + 215, sy = cy + 170; c.save(); c.beginPath(); c.arc(sx, sy, 70, 0, 7); c.clip(); c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(sx - 70, sy - 70, 140, 140);
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2; for (var q = -70; q <= 70; q += 14) { c.beginPath(); c.moveTo(sx + q, sy - 70); c.lineTo(sx + q, sy + 70); c.moveTo(sx - 70, sy + q); c.lineTo(sx + 70, sy + q); c.stroke(); }
      c.restore(); c.strokeStyle = '#ffd54f'; c.lineWidth = 9; c.beginPath(); c.arc(sx, sy, 70, 0, 7); c.stroke(); },
    bow: function (c, k) { var cx = k.cx, cy = k.cy; var g = c.createRadialGradient(cx, cy, 20, cx, cy, 240); g.addColorStop(0, 'rgba(255,243,176,.95)'); g.addColorStop(.55, 'rgba(255,179,0,.7)'); g.addColorStop(1, 'rgba(255,179,0,0)');
      c.fillStyle = g; c.beginPath(); c.arc(cx, cy, 240, 0, 7); c.fill(); c.lineCap = 'round';
      var bx = cx - 110, R = 230, a0 = .42 * Math.PI, tx = bx + Math.cos(a0) * R, ty = Math.sin(a0) * R;
      c.strokeStyle = '#5d2a00'; c.lineWidth = 20; c.beginPath(); c.arc(bx, cy, R, -a0, a0); c.stroke(); c.strokeStyle = '#ffd54f'; c.lineWidth = 6; c.beginPath(); c.arc(bx, cy, R, -a0, a0); c.stroke();
      c.strokeStyle = '#fff'; c.lineWidth = 4; c.beginPath(); c.moveTo(tx, cy - ty); c.lineTo(cx - 200, cy); c.lineTo(tx, cy + ty); c.stroke();
      c.strokeStyle = '#3e1a05'; c.lineWidth = 10; c.beginPath(); c.moveTo(cx - 200, cy); c.lineTo(cx + 230, cy); c.stroke();
      c.fillStyle = '#eceff1'; c.beginPath(); c.moveTo(cx + 275, cy); c.lineTo(cx + 222, cy - 28); c.lineTo(cx + 222, cy + 28); c.closePath(); c.fill();
      c.fillStyle = '#e53935'; [-1, 1].forEach(function (s) { c.beginPath(); c.moveTo(cx - 200, cy); c.lineTo(cx - 150, cy + s * 30); c.lineTo(cx - 130, cy + s * 30); c.lineTo(cx - 150, cy); c.closePath(); c.fill(); }); }
  };
  function artLayer(f, v, W) {          // चित्र अलग परत पर — नीचे के लिखे हिस्से के पीछे कुछ नहीं आता
    var A = document.createElement('canvas'); A.width = W; A.height = 760; var c = A.getContext('2d'), art = f.art[v % f.art.length];
    var k = { cx: W / 2, cy: 400, W: W, ic: f.ic, f: f, rnd: rng(7 + v * 13 + String(f.id).length * 3), cols: ['#ffeb3b', '#ff9800', '#e91e63', '#4caf50', '#03a9f4', '#ffffff'] };
    ART[art](c, k);
    for (var i = 0; i < 14; i++) sparkle(c, k.rnd() * W, 140 + k.rnd() * 500, 8 + k.rnd() * 10, .45 + k.rnd() * .4);
    c.globalCompositeOperation = 'destination-in'; var m = c.createLinearGradient(0, 610, 0, 740); m.addColorStop(0, '#000'); m.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = m; c.fillRect(0, 0, W, 760);
    return A; }

  /* ----- लिखा हुआ हिस्सा: हर पंक्ति नापकर ऊपर से नीचे रखी जाती है, इसलिए कुछ भी एक-दूसरे पर नहीं चढ़ता ----- */
  function wrapAll(c, t, maxW) { var out = [], cur = ''; String(t).split(/\s+/).forEach(function (x) { var tt = cur ? cur + ' ' + x : x; if (cur && c.measureText(tt).width > maxW) { out.push(cur); cur = x; } else cur = tt; }); if (cur) out.push(cur); return out; }
  function trimTo(c, t, maxW) { if (c.measureText(t).width <= maxW) return t; t = t.replace(/…$/, ''); while (t.length > 1 && c.measureText(t + '…').width > maxW) t = t.slice(0, -1); return t + '…'; }
  function fitText(c, t, maxW, size, min1, wt, maxL) {   // पहले एक पंक्ति में (छोटा करके), फिर 2 पंक्तियों में
    var s, ln, f = function (z) { c.font = wt + ' ' + z + 'px ' + FONT; };
    for (s = size; s >= min1; s -= 2) { f(s); if (c.measureText(t).width <= maxW) return { s: s, lines: [t] }; }
    if (maxL > 1) for (s = Math.round(size * .92); s >= Math.round(size * .5); s -= 2) { f(s); ln = wrapAll(c, t, maxW); if (ln.length <= maxL && ln.every(function (x) { return c.measureText(x).width <= maxW; })) return { s: s, lines: ln }; }
    s = Math.round(size * .5); f(s); ln = wrapAll(c, t, maxW).slice(0, maxL).map(function (x) { return trimTo(c, x, maxW); }); return { s: s, lines: ln }; }

  async function drawFest(d, f, bg, v) {
    v = v || 0; var W = 1080, H = 1920, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    var c = cv.getContext('2d'), L = fLang(), T = f.t[L], FR = (f.fr || FROM)[L], P = f.pal[v % f.pal.length], isEn = L === 'en';
    var g = c.createLinearGradient(0, 0, W * .3, H); g.addColorStop(0, P[0]); g.addColorStop(.5, P[1]); g.addColorStop(1, P[2]); c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (bg) {                           // AI वाली तस्वीर: पीछे धुंधली पूरी, ऊपर साफ़ चौकोर
      var bs = Math.max(W / bg.width, H / bg.height);
      c.save(); try { c.filter = 'blur(28px) brightness(.7)'; } catch (e) {}
      c.drawImage(bg, (W - bg.width * bs) / 2, (H - bg.height * bs) / 2, bg.width * bs, bg.height * bs); c.restore();
      if (!('filter' in c) || c.filter === 'none') { c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(0, 0, W, H); }
      var bh2 = W * bg.height / bg.width, t = document.createElement('canvas'); t.width = W; t.height = bh2; var tc = t.getContext('2d');
      tc.drawImage(bg, 0, 0, W, bh2); tc.globalCompositeOperation = 'destination-in';
      var fd = tc.createLinearGradient(0, bh2 * .72, 0, bh2); fd.addColorStop(0, '#000'); fd.addColorStop(1, 'rgba(0,0,0,0)'); tc.fillStyle = fd; tc.fillRect(0, 0, W, bh2);
      c.drawImage(t, 0, 0);
    } else { c.drawImage(artLayer(f, v, W), 0, 0); if (TOR[v % NV]) toran(c, W); }
    var sh = c.createLinearGradient(0, 600, 0, H); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(.12, 'rgba(0,0,0,.3)'); sh.addColorStop(1, 'rgba(0,0,0,.42)'); c.fillStyle = sh; c.fillRect(0, 600, W, H - 600);
    // किनारे की सजावट
    var fm = FRM[v % NV]; if (!bg && fm !== 'none') { c.save(); c.strokeStyle = '#ffe082';
      if (fm === 'dots') { c.setLineDash([1, 18]); c.lineCap = 'round'; c.lineWidth = 7; c.globalAlpha = .85; rr(c, 34, 34, W - 68, H - 190, 34); c.stroke(); }
      else { c.lineWidth = 4; c.globalAlpha = .8; rr(c, 30, 30, W - 60, H - 180, 34); c.stroke(); if (fm === 'double') { c.lineWidth = 2; c.globalAlpha = .5; rr(c, 48, 48, W - 96, H - 216, 24); c.stroke(); } }
      c.restore(); if (TOR[v % NV]) toran(c, W); }
    var logo = await img('card-logo.png'), url = 'https://patabook.in/business.html?slug=' + encodeURIComponent(d.slug || ''), Q = qr(url), qs = Q.length;
    var nm = String(d.name || '').replace(/\s+/g, ' ').trim() || 'PataBook';

    // ---- लिखा हुआ हिस्सा (सब नापकर) ----
    var TOP = 705, BOT = 1385, QY = 1405, sc = 1, items, tot;
    function build(z) { var it = [], r;
      r = fitText(c, T[0], 980, 108 * z, 70 * z, '900', 2); it.push({ r: r, wt: '900', col: '#fff3c4', lh: 1.25, gap: 0 });
      r = fitText(c, T[1], 920, 38 * z, 30 * z, '600', 2); it.push({ r: r, wt: '600', col: '#fff', lh: 1.38, gap: 16 * z });
      if (FR[0] && isEn) { r = fitText(c, FR[0], 900, 36 * z, 28 * z, '700', 1); it.push({ r: r, wt: '700', col: '#ffe9b0', lh: 1.3, gap: 40 * z }); }
      r = fitText(c, nm, 940, 112 * z, 76 * z, '900', 2); it.push({ r: r, wt: '900', col: '#fff', lh: 1.2, gap: isEn ? 6 * z : 40 * z });
      if (FR[0] && !isEn) { r = fitText(c, FR[0], 900, 36 * z, 28 * z, '700', 1); it.push({ r: r, wt: '700', col: '#ffe9b0', lh: 1.3, gap: 8 * z }); }
      it.push({ orn: 1, h: 30 * z, gap: 22 * z });
      r = fitText(c, FR[1], 900, 34 * z, 28 * z, '600', 2); it.push({ r: r, wt: '600', col: '#fff', lh: 1.4, gap: 14 * z });
      var ownL = L === 'en' ? 'Owner: ' : L === 'gu' ? 'માલિક: ' : 'मालिक: ';
      if (d.owner) { r = fitText(c, ownL + String(d.owner).trim(), 900, 30 * z, 22 * z, '600', 1); it.push({ r: r, wt: '600', col: '#ffe9b0', lh: 1.4, gap: 16 * z }); }
      var ct = [d.category, d.city].filter(Boolean).join(' · '); if (ct) { r = fitText(c, ct, 900, 30 * z, 22 * z, '600', 1); it.push({ r: r, wt: '600', col: '#ffe9b0', lh: 1.4, gap: 4 * z }); }
      var h = 0; it.forEach(function (o) { h += o.gap + (o.orn ? o.h : o.r.lines.length * o.r.s * o.lh); }); return { it: it, h: h }; }
    var B = build(1); while (B.h > BOT - TOP && sc > .6) { sc -= .05; B = build(sc); }
    items = B.it; tot = B.h;
    var y = TOP + Math.max(0, (BOT - TOP - tot)) * .4;
    c.save(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = 'rgba(0,0,0,.42)'; c.shadowBlur = 12; c.shadowOffsetY = 3;
    items.forEach(function (o) { y += o.gap;
      if (o.orn) { var gl = c.createLinearGradient(W / 2 - 280, 0, W / 2 + 280, 0); gl.addColorStop(0, 'rgba(255,224,130,0)'); gl.addColorStop(.5, 'rgba(255,224,130,1)'); gl.addColorStop(1, 'rgba(255,224,130,0)');
        var oy = y + o.h / 2; c.fillStyle = gl; c.fillRect(W / 2 - 280, oy - 2, 560, 4); c.fillStyle = '#ffe082'; c.beginPath(); c.moveTo(W / 2, oy - 12); c.lineTo(W / 2 + 14, oy); c.lineTo(W / 2, oy + 12); c.lineTo(W / 2 - 14, oy); c.closePath(); c.fill(); y += o.h; return; }
      c.font = o.wt + ' ' + o.r.s + 'px ' + FONT; c.fillStyle = o.col; var lh = o.r.s * o.lh;
      o.r.lines.forEach(function (ln, i) { c.fillText(ln, W / 2, y + lh * (i + .5)); }); y += lh * o.r.lines.length; });
    c.restore();
    // QR (छोटा बैज) + पहचान — बीच में
    var qsz = 150, m = qsz / (qs + 2), label = L === 'gu' ? 'Scan કરો — દુકાન PataBook પર' : L === 'en' ? 'Scan — see this shop on PataBook' : 'Scan करें — दुकान PataBook पर';
    var lr = fitText(c, label, 600, 28, 20, '700', 1); c.font = '800 26px ui-monospace,Menlo,monospace'; var cwid = d.code ? c.measureText(d.code).width : 0; c.font = '700 ' + lr.s + 'px ' + FONT;
    var tw = Math.max(c.measureText(lr.lines[0]).width, cwid), gw = qsz + 24 + 36 + tw, qx = Math.round((W - gw) / 2) + 12, tx = qx + qsz + 36, qy = QY;
    c.save(); c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 18; c.fillStyle = '#fff'; rr(c, qx - 12, qy - 12, qsz + 24, qsz + 24, 18); c.fill(); c.restore();
    c.fillStyle = '#3e2723';
    for (var yy = 0; yy < qs; yy++) for (var xx = 0; xx < qs; xx++) if (Q[yy][xx]) c.fillRect(Math.floor(qx + (xx + 1) * m), Math.floor(qy + (yy + 1) * m), Math.ceil(m), Math.ceil(m));
    c.save(); c.textAlign = 'left'; c.textBaseline = 'middle'; c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 8; c.font = '700 ' + lr.s + 'px ' + FONT; c.fillStyle = '#fff'; c.fillText(lr.lines[0], tx, qy + (d.code ? 56 : 75));
    if (d.code) { c.font = '800 26px ui-monospace,Menlo,monospace'; c.fillStyle = '#ffe082'; c.fillText(d.code, tx, qy + 102); }
    c.restore(); diyas(c, W, H);
    // footer
    c.textAlign = 'left'; c.fillStyle = '#fff'; c.fillRect(0, H - 130, W, 130); var fy = H - 65;
    if (logo) c.drawImage(logo, 60, fy - 44, 88, 88);
    c.textBaseline = 'middle'; c.font = '900 50px ' + FONT; c.fillStyle = '#12141c'; c.fillText('Pata', 170, fy - 12); c.fillStyle = '#1a73e8'; c.fillText('Book', 170 + c.measureText('Pata').width, fy - 12);
    c.font = '700 20px ' + FONT; c.fillStyle = '#0b2f73'; c.fillText('B U S I N E S S   D I R E C T O R Y', 172, fy + 30);
    c.textAlign = 'right'; c.font = '800 38px ' + FONT; c.fillStyle = '#1a73e8'; c.fillText('patabook.in', W - 60, fy - 12);
    c.font = '600 21px ' + FONT; c.fillStyle = '#667085'; c.fillText(L === 'en' ? 'Free festival poster for your shop' : L === 'gu' ? 'તમારી દુકાનનું FREE poster બનાવો' : 'अपनी दुकान का FREE poster बनाएँ', W - 60, fy + 26);
    c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    return cv;
  }

  /* ---------- शेयर वाली खिड़की ---------- */
  var css = '.pbc-o{position:fixed;inset:0;z-index:90;background:rgba(8,20,48,.62);display:flex;align-items:flex-end;justify-content:center}' +
    '.pbc-b{background:#fff;width:100%;max-width:560px;max-height:94vh;overflow-y:auto;border-radius:22px 22px 0 0;padding:16px 16px calc(18px + env(safe-area-inset-bottom));font-family:inherit}' +
    '.pbc-h{display:flex;align-items:center;gap:8px;margin-bottom:10px}.pbc-h b{font-size:18px;color:#0b2f73;flex:1}.pbc-x{border:0;background:#eef2f8;border-radius:50%;width:36px;height:36px;font-size:18px;cursor:pointer}' +
    '.pbc-t{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}.pbc-t button{flex:1 1 28%;white-space:nowrap;border:1px solid #d0d5dd;background:#fff;border-radius:999px;padding:8px;font:inherit;font-weight:700;font-size:13.5px;cursor:pointer}.pbc-t button.on{background:#0b2f73!important;color:#fff;border-color:#0b2f73!important}' +
    '.pbc-t.pbc-f{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;padding-bottom:2px;margin-bottom:10px}.pbc-t.pbc-f::-webkit-scrollbar{display:none}.pbc-t.pbc-f button{flex:0 0 auto;padding:8px 14px}' +
    '.pbc-p{background:#f2f5fa;border-radius:14px;padding:10px;text-align:center;touch-action:pan-y}.pbc-w{position:relative;display:inline-block;max-width:100%}.pbc-p img{display:block;max-width:100%;max-height:52vh;border-radius:10px;box-shadow:0 6px 20px rgba(11,47,115,.2)}' +
    '.pbc-ar{position:absolute;top:50%;transform:translateY(-50%);width:42px;height:42px;border-radius:50%;border:0;background:rgba(255,255,255,.93);box-shadow:0 2px 10px rgba(0,0,0,.32);font-size:28px;line-height:1;padding:0 0 3px;color:#0b2f73;cursor:pointer}.pbc-ar.l{left:6px}.pbc-ar.r{right:6px}' +
    '.pbc-d{margin-top:10px;display:flex;justify-content:center;align-items:center;gap:7px}.pbc-d i{display:block;width:9px;height:9px;border-radius:5px;background:#c5cce0;cursor:pointer;transition:width .15s}.pbc-d i.on{background:#0b2f73;width:22px}.pbc-d small{margin-left:6px;color:#667085;font-size:12px}' +
    '.pbc-a{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.pbc-a button{border:0;border-radius:14px;padding:14px 10px;font:inherit;font-weight:800;font-size:15px;cursor:pointer}' +
    '.pbc-a .wa{grid-column:1/-1;background:#25d366;color:#fff;font-size:16.5px}.pbc-a .dl{background:#1a73e8;color:#fff}.pbc-a .cp{background:#eef2f8;color:#0b2f73}' +
    '.pbc-re{display:block;margin:10px auto 0;border:0;border-radius:999px;padding:11px 22px;font:inherit;font-weight:800;font-size:15px;background:linear-gradient(90deg,#7b2ff7,#f107a3);color:#fff;cursor:pointer}.pbc-an{display:block;margin-top:8px;color:#667085;font-size:12.5px}' +
    '.pbc-n{font-size:12.5px;color:#667085;text-align:center;margin-top:10px;line-height:1.5}';
  var D = null, mode = 'L', blobs = {}, aiMsg = '', vi = {}, lastF = null;
  function aiUrl() { return (window.PB_SITE && PB_SITE.aiUrl) || ''; }
  function festOf(m) { return FEST.filter(function (x) { return x.id === m; })[0]; }
  function aiFest() { return lastF || activeFests()[0] || GEN; }
  function key(m) { m = m || mode; return festOf(m) ? m + '#' + (vi[m] || 0) : m; }
  async function aiPoster() {
    var f = aiFest(), r; try { r = await fetch(aiUrl(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fest: f.id, cat: D.category || '' }) }); } catch (e) { throw new Error('ai|net'); }
    if (r.status === 429) throw new Error('limit');
    if (!r.ok || !/image/.test(r.headers.get('Content-Type') || '')) { var dj = {}; try { dj = await r.clone().json(); } catch (e2) {} throw new Error('ai|' + r.status + (dj.detail ? ' ' + dj.detail : '')); }
    var left = r.headers.get('X-Left'), b = await r.blob(), u = URL.createObjectURL(b);
    var im = await new Promise(function (ok, no) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = no; i.src = u; });
    aiMsg = left !== null ? 'आज ' + left + ' और AI डिज़ाइन बना सकते हैं।' : '';
    return drawFest(D, f, im, 0);
  }
  function el(h) { var t = document.createElement('div'); t.innerHTML = h; return t.firstChild; }
  function close() { var o = document.querySelector('.pbc-o'); if (o) o.remove(); }
  function fname() { var ff = festOf(mode); return 'PataBook_' + String(D.name || 'card').replace(/[^\wऀ-ॿ]+/g, '_').slice(0, 40) + (mode === 'P' ? '_Status' : mode === 'L' ? '_Card' : mode === 'AI' ? '_AI_' + Date.now() % 100000 : '_' + mode + '_' + ((vi[mode] || 0) + 1)) + '.png'; }
  function shopUrl() { return D.link ? 'https://patabook.in/' + D.link : 'https://patabook.in/business.html?slug=' + encodeURIComponent(D.slug || ''); }
  function shareText() { var ff = mode === 'AI' ? aiFest() : festOf(mode);
    if (ff) return ff.ic + ' ' + ff.t[fLang()][0] + ' — ' + D.name + '\n' + shopUrl() + '\n\n' + X('अपनी दुकान का FREE त्योहार poster बनाएँ', 'Make a FREE festival poster for your shop') + ' — patabook.in';
    return '📇 ' + D.name + X(' — PataBook पर देखें:', ' — view on PataBook:') + '\n' + shopUrl() + '\n\n' + X('अपनी दुकान का भी FREE डिजिटल विज़िटिंग कार्ड बनाएँ', 'Get your own FREE digital visiting card') + ' — patabook.in'; }
  async function render() {
    var p = document.querySelector('.pbc-p'); if (!p) return; p.innerHTML = '<p style="padding:40px;color:#667085">' + X('कार्ड बन रहा है…', 'Making your card…') + '</p>';
    var m = mode, kk = key(), ai = m === 'AI', ff = festOf(m), note = '';
    if (ai) p.innerHTML = '<p style="padding:40px 16px;color:#667085">✨ AI आपकी दुकान का नया poster बना रहा है…<br><small>10–20 सेकंड लग सकते हैं</small></p>';
    if (!blobs[kk]) { var cv;
      if (ai) { try { cv = await aiPoster(); note = aiMsg; } catch (e) { cv = await drawFest(D, aiFest(), null, 0); note = e && e.message === 'limit' ? 'आज के AI poster पूरे हो गए — कल फिर बनाएँ। अभी सादा poster दिखाया है।' : 'AI अभी व्यस्त है — सादा poster दिखाया है। थोड़ी देर बाद “दूसरा डिज़ाइन” दबाएँ।' + (e && /^ai\|/.test(e.message) ? ' (कोड: ' + e.message.slice(3) + ')' : ''); } }
      else cv = ff ? await drawFest(D, ff, null, vi[m] || 0) : await draw(D, m === 'P');
      var bl = await new Promise(function (ok) { cv.toBlob(ok, 'image/png'); }); if (key() !== kk) return; blobs[kk] = bl; blobs[kk + '_n'] = note; blobs[kk + '_x'] = /पूरे/.test(note); }
    var nav = '', dots = '';
    if (ff) { var cur = vi[m] || 0; nav = 1; for (var i = 0; i < NV; i++) dots += '<i data-v="' + i + '"' + (i === cur ? ' class="on"' : '') + '></i>'; dots = '<div class="pbc-d">' + dots + '<small>' + (cur + 1) + '/' + NV + '</small></div>'; }
    p.innerHTML = '<div class="pbc-w">' + (nav ? '<button class="pbc-ar l" aria-label="पिछला डिज़ाइन">‹</button>' : '') + '<img alt="Poster" src="' + URL.createObjectURL(blobs[kk]) + '">' + (nav ? '<button class="pbc-ar r" aria-label="अगला डिज़ाइन">›</button>' : '') + '</div>' + dots +
      (ai ? (blobs[kk + '_x'] ? '' : '<button class="pbc-re">🔄 ' + X('दूसरा डिज़ाइन', 'Another design') + '</button>') + (blobs[kk + '_n'] ? '<small class="pbc-an">' + blobs[kk + '_n'] + '</small>' : '') : '');
    if (ff) { var nx = ((vi[m] || 0) + 1) % NV, nk = m + '#' + nx; if (!blobs[nk]) setTimeout(function () { if (mode !== m || blobs[nk]) return; drawFest(D, ff, null, nx).then(function (c2) { c2.toBlob(function (b2) { if (b2 && !blobs[nk]) blobs[nk] = b2; }, 'image/png'); }); }, 250); }
  }
  function step(dv) { var ff = festOf(mode); if (!ff) return; vi[mode] = ((vi[mode] || 0) + dv + NV) % NV; render(); }
  function track() { try { if (window.PBT) PBT.ev('card', D.slug); } catch (e) {} }
  function download() { var a = document.createElement('a'); a.href = URL.createObjectURL(blobs[key()]); a.download = fname(); document.body.appendChild(a); a.click(); a.remove(); }
  async function shareWA() {
    track(); var f = new File([blobs[key()]], fname(), { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], text: shareText() }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    download(); window.open('https://wa.me/?text=' + encodeURIComponent(shareText()), '_blank');
  }
  window.PBCard = {
    qr: qr, draw: draw, drawFest: drawFest, fests: activeFests, upcoming: upcomingFests, festLabel: function () { var f = activeFests()[0]; return f ? f.ic + ' ' + f.t[fLang()][0] : ''; },
    open: function (d) {
      D = d; blobs = {}; vi = {}; var af = activeFests(), up = upcomingFests(); lastF = af[0] || null; mode = d.fest && af.length ? af[0].id : 'L'; close();
      if (!document.getElementById('pbc-css')) { var s = document.createElement('style'); s.id = 'pbc-css'; s.textContent = css; document.head.appendChild(s); }
      var o = el('<div class="pbc-o" role="dialog" aria-modal="true"><div class="pbc-b"><div class="pbc-h"><b>' + (d.visitor ? X('📤 यह दुकान शेयर करें', '📤 Share this shop') : X('📇 आपका डिजिटल विज़िटिंग कार्ड', '📇 Your digital visiting card')) + '</b><button class="pbc-x" aria-label="Close">✕</button></div>' +
        '<div class="pbc-t"><button data-m="L"' + (mode === 'L' ? ' class="on"' : '') + '>🪪 ' + X('कार्ड', 'Card') + '</button><button data-m="P">📱 Status</button>' + (aiUrl() ? '<button data-m="AI" style="background:#f6efff;border-color:#b388ff">✨ AI Poster</button>' : '') + '</div>' +
        (up.length ? '<div class="pbc-t pbc-f">' + up.map(function (f) { return '<button data-m="' + f.id + '"' + (mode === f.id ? ' class="on"' : '') + ' style="background:#fff4e0;border-color:#ffb74d">' + f.ic + ' ' + f.n[fLang()] + '</button>'; }).join('') + '</div>' : '') +
        '<div class="pbc-p"></div>' +
        '<div class="pbc-a"><button class="wa">' + X('WhatsApp पर भेजें', 'Send on WhatsApp') + '</button><button class="dl">⬇ Download</button><button class="cp">🔗 Link copy</button></div>' +
        '<p class="pbc-n">' + (d.visitor ? X('QR scan करने पर यह दुकान PataBook पर खुलेगी, वहीं नंबर भी मिलेगा।', 'Scanning the QR opens this shop on PataBook, where the number is shown too.') : X('यह कार्ड मुफ़्त है — QR scan करने पर आपकी दुकान PataBook पर खुलेगी।', 'This card is free — scanning the QR opens your shop on PataBook.') + (d.phone ? '' : X('<br>नंबर कार्ड पर नहीं छपा है।', '<br>The number is not printed on the card.'))) + '</p></div></div>');
      document.body.appendChild(o);
      var pv = o.querySelector('.pbc-p'), sx = null; pv.addEventListener('touchstart', function (e) { sx = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
      pv.addEventListener('touchend', function (e) { if (sx === null || !festOf(mode)) return; var dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }, { passive: true });
      o.addEventListener('click', async function (e) {
        if (e.target === o || e.target.closest('.pbc-x')) return close();
        var t = e.target.closest('[data-m]'); if (t) { mode = t.dataset.m; if (festOf(mode)) lastF = festOf(mode); o.querySelectorAll('[data-m]').forEach(function (x) { x.classList.toggle('on', x === t); }); if (t.scrollIntoView && t.closest('.pbc-f')) try { t.scrollIntoView({ inline: 'center', block: 'nearest' }); } catch (e3) {} return render(); }
        if (e.target.closest('.pbc-ar')) return step(e.target.closest('.pbc-ar').classList.contains('l') ? -1 : 1);
        var dt = e.target.closest('[data-v]'); if (dt) { vi[mode] = +dt.dataset.v; return render(); }
        if (e.target.closest('.pbc-re')) { var k0 = key(); if (!blobs[k0]) return; delete blobs[k0]; return render(); }
        if (!blobs[key()]) return;
        if (e.target.closest('.wa')) return shareWA();
        if (e.target.closest('.dl')) { track(); return download(); }
        if (e.target.closest('.cp')) { track(); try { await navigator.clipboard.writeText(shopUrl()); e.target.textContent = '✅ Copied'; } catch (x) { prompt('Link:', shopUrl()); } }
      });
      render();
    }
  };
})();
