/* PBPGal — दुकान के पब्लिक पन्ने की Gallery / Products & Services
   • 2-column जाली, हर फ़ोटो 1:1 बक्से में object-fit:contain (पूरा प्रोडक्ट + लेबल दिखे)
   • फ़ोटो के नीचे Product Name (दुकानदार का लिखा caption; न हो तो कुछ नहीं)
   • दबाने पर Full-screen viewer: pinch / double-tap zoom, खिसकाना, ‹ ›, ✕, फ़ोन का Back (PBBack)
   सिर्फ़ पब्लिक पन्नों के लिए — Admin / Owner Dashboard / Database को नहीं छूता। */
(function () {
  if (window.PBPGal) return;
  var css = document.createElement("style");
  css.textContent =
    ".pgal{display:grid;grid-template-columns:1fr;gap:14px;max-width:560px;margin:0 auto}" +
    ".pgal figure{margin:0;min-width:0;background:#fff;border:1px solid #e4eaf5;border-radius:16px;overflow:hidden;box-shadow:0 4px 14px rgba(20,40,90,.07)}" +
    ".pgal figure>button{display:block;width:100%;border:0;padding:0;background:#fff;cursor:zoom-in}" +
    ".pgal img{width:100%;height:auto;display:block;pointer-events:none}" +
    ".pgmore{display:block;width:100%;max-width:560px;margin:14px 0 2px;padding:13px;border:1.5px solid #1a4fb0;border-radius:14px;background:#fff;color:#1a4fb0;font:800 16px system-ui,sans-serif;cursor:pointer}" +
    ".pgp{position:fixed;inset:0;z-index:10000;background:#f4f7fc;overflow-y:auto;-webkit-overflow-scrolling:touch}" +
    ".pgp .hd{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;padding:max(10px,env(safe-area-inset-top)) 12px 10px;background:#fff;border-bottom:1px solid #e4eaf5;font:800 18px system-ui,sans-serif;color:#1c2540}" +
    ".pgp .hd button{border:0;background:#eef2f9;width:40px;height:40px;border-radius:50%;font-size:22px;color:#1c2540;cursor:pointer}" +
    ".pgp .gr{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:8px}" +
    "@media(min-width:700px){.pgp .gr{grid-template-columns:repeat(5,1fr)}}" +
    ".pgp .gr button{border:0;padding:0;aspect-ratio:1/1;background:#fff;border-radius:8px;overflow:hidden;cursor:zoom-in}" +
    ".pgp .gr img{width:100%;height:100%;object-fit:contain;display:block;pointer-events:none}" +
    ".pgal figcaption{padding:9px 11px 11px;font-size:13.5px;font-weight:700;line-height:1.35;color:#1c2540;text-align:center;border-top:1px solid #eef2f9;word-break:break-word;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}" +
    ".pgv{position:fixed;inset:0;z-index:10001;background:rgba(5,10,20,.95);display:flex;align-items:center;justify-content:center;touch-action:none;overflow:hidden;-webkit-user-select:none;user-select:none}" +
    ".pgv img{max-width:100vw;max-height:100vh;object-fit:contain;transform-origin:0 0;will-change:transform;pointer-events:none;-webkit-user-drag:none}" +
    ".pgv button{position:absolute;border:0;background:rgba(255,255,255,.16);color:#fff;width:46px;height:46px;border-radius:50%;font-size:24px;cursor:pointer;z-index:2}" +
    ".pgv .x{top:max(14px,env(safe-area-inset-top));right:14px}.pgv .pv{left:10px;top:50%;margin-top:-23px}.pgv .nx{right:10px;top:50%;margin-top:-23px}" +
    ".pgv .cp{position:absolute;left:0;right:0;bottom:max(16px,env(safe-area-inset-bottom));text-align:center;color:#fff;font:700 14px/1.4 system-ui,sans-serif;padding:0 70px;text-shadow:0 1px 6px #000;z-index:2;pointer-events:none}";
  document.head.appendChild(css);

  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* जाली का HTML: urls = फ़ोटो की list, caps = {url: नाम} */
  var LIM = 5, cur = { urls: [], caps: {} };
  function grid(urls, caps) {
    caps = caps || {}; cur = { urls: urls, caps: caps };
    var h = '<div class="pgal">' + urls.slice(0, LIM).map(function (u, i) {
      var c = caps[u] ? String(caps[u]) : "";
      return '<figure><button type="button" data-g="' + i + '" aria-label="' + esc(c || "Photo " + (i + 1)) + '"><img src="' + esc(u) + '" alt="' + esc(c.slice(0, 80)) + '" loading="lazy" decoding="async"></button>' +
        (c ? '<figcaption>' + esc(c) + '</figcaption>' : '') + '</figure>';
    }).join("") + '</div>';
    if (urls.length > LIM) h += '<button type="button" class="pgmore" data-gm="1">More (' + (urls.length - LIM) + ') ›</button>';
    return h;
  }
  /* पूरा Gallery पन्ना: 3 कॉलम की छोटी फ़ोटो; दबाने पर बड़ी + zoom; Back एक-एक परत बंद करता है */
  function page(urls, caps, hi) {
    caps = caps || {};
    var d = document.createElement("div"); d.className = "pgp";
    d.innerHTML = '<div class="hd"><button type="button" class="bk" aria-label="Back">‹</button><span>' + (hi ? "गैलरी" : "Gallery") + ' (' + urls.length + ')</span></div><div class="gr">' +
      urls.map(function (u, i) { return '<button type="button" data-pg="' + i + '" aria-label="Photo ' + (i + 1) + '"><img src="' + esc(u) + '" alt="" loading="lazy" decoding="async"></button>'; }).join("") + '</div>';
    function close() { if (d.isConnected) d.remove(); document.documentElement.style.overflow = ""; }
    d.addEventListener("click", function (e) {
      if (e.target.closest(".bk")) { if (window.PBBack && PBBack.isOpen()) PBBack.close(); else close(); return; }
      var b = e.target.closest("[data-pg]"); if (b) view(urls, +b.dataset.pg, caps);
    });
    document.body.appendChild(d); document.documentElement.style.overflow = "hidden";
    if (window.PBBack) PBBack.open(close, d);
  }
  document.addEventListener("click", function (e) {
    var m = e.target.closest && e.target.closest("[data-gm]");
    if (m && cur.urls.length) page(cur.urls, cur.caps, !!(window.PB && PB.lang && PB.lang() === "hi"));
  });
  /* सारी फ़ोटो पर नाम लिखा हो तो "Products & Services", वरना "Gallery" */
  function title(urls, caps, hi) {
    var all = urls.length && urls.every(function (u) { return caps && caps[u]; });
    return all ? "Products & Services" : (hi ? "गैलरी" : "Gallery");
  }

  function view(urls, i, caps) {
    caps = caps || {};
    var d = document.createElement("div"); d.className = "pgv";
    var img = document.createElement("img"); d.appendChild(img);
    var S = 1, X = 0, Y = 0, W = 0, H = 0, cur = i;
    var pts = {}, start = null, moved = false, lastTap = 0;
    function apply() { img.style.transform = "translate(" + X + "px," + Y + "px) scale(" + S + ")"; }
    function fit() {   /* फ़ोटो को स्क्रीन में पूरा बिठाओ, बीच में */
      var vw = innerWidth, vh = innerHeight, nw = img.naturalWidth || vw, nh = img.naturalHeight || vh, k = Math.min(vw / nw, vh / nh, 3);
      W = nw * k; H = nh * k; img.style.width = W + "px"; img.style.height = H + "px"; img.style.maxWidth = "none"; img.style.maxHeight = "none";
      S = 1; X = (vw - W) / 2; Y = (vh - H) / 2; apply();
    }
    function clamp() {
      var vw = innerWidth, vh = innerHeight, w = W * S, h = H * S;
      X = w <= vw ? (vw - w) / 2 : Math.min(0, Math.max(vw - w, X));
      Y = h <= vh ? (vh - h) / 2 : Math.min(0, Math.max(vh - h, Y));
    }
    function zoomAt(cx, cy, ns) {
      ns = Math.min(5, Math.max(1, ns));
      var r = ns / S; X = cx - (cx - X) * r; Y = cy - (cy - Y) * r; S = ns; clamp(); apply();
    }
    function ui() {
      var c = caps[urls[cur]] || "";
      var bar = d.querySelector(".cp"); if (bar) bar.textContent = c;
    }
    function load() { img.onload = fit; img.src = urls[cur]; if (img.complete && img.naturalWidth) fit(); ui(); }
    function go(n) { cur = (cur + n + urls.length) % urls.length; S = 1; load(); }
    d.insertAdjacentHTML("beforeend", '<button class="x" type="button" aria-label="Close">✕</button>' +
      (urls.length > 1 ? '<button class="pv" type="button" aria-label="Previous">‹</button><button class="nx" type="button" aria-label="Next">›</button>' : '') + '<div class="cp"></div>');
    function close() { if (d.isConnected) d.remove(); document.removeEventListener("keydown", key); removeEventListener("resize", fit); }
    function key(e) { if (e.key === "Escape") closeBack(); else if (e.key === "ArrowRight" && urls.length > 1) go(1); else if (e.key === "ArrowLeft" && urls.length > 1) go(-1); }
    function closeBack() { if (window.PBBack && PBBack.isOpen()) PBBack.close(); else close(); }
    d.addEventListener("click", function (e) {
      if (e.target.closest(".x")) { closeBack(); return; }
      if (e.target.closest(".pv")) { go(-1); return; }
      if (e.target.closest(".nx")) { go(1); return; }
    });
    d.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button")) return;
      d.setPointerCapture && d.setPointerCapture(e.pointerId);
      pts[e.pointerId] = { x: e.clientX, y: e.clientY }; moved = false;
      var ids = Object.keys(pts);
      start = ids.length === 2 ? { dist: dist(), S: S, X: X, Y: Y, mx: mid().x, my: mid().y } : { x: e.clientX, y: e.clientY, X: X, Y: Y, t: Date.now() };
    });
    function dist() { var a = Object.keys(pts).map(function (k) { return pts[k]; }); return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) || 1; }
    function mid() { var a = Object.keys(pts).map(function (k) { return pts[k]; }); return { x: (a[0].x + a[1].x) / 2, y: (a[0].y + a[1].y) / 2 }; }
    d.addEventListener("pointermove", function (e) {
      if (!pts[e.pointerId]) return; pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (ids.length === 2 && start && start.dist) {
        var m = mid(), ns = Math.min(5, Math.max(1, start.S * dist() / start.dist)), r = ns / start.S;
        X = m.x - (start.mx - start.X) * r; Y = m.y - (start.my - start.Y) * r; S = ns; clamp(); apply(); moved = true;
      } else if (ids.length === 1 && start && start.x != null) {
        var dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
        if (S > 1.02) { X = start.X + dx; Y = start.Y + dy; clamp(); apply(); }
      }
    });
    function up(e) {
      var was = pts[e.pointerId]; delete pts[e.pointerId];
      if (Object.keys(pts).length) { start = null; return; }
      if (!was || !start || start.x == null) { start = null; return; }
      var dx = e.clientX - start.x, dy = e.clientY - start.y, now = Date.now();
      if (S <= 1.02 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4 && urls.length > 1) { go(dx < 0 ? 1 : -1); start = null; return; }
      if (!moved) {   /* टैप: दो बार जल्दी = zoom, एक बार खाली जगह = बंद */
        if (now - lastTap < 320) { lastTap = 0; if (S > 1.02) { S = 1; clamp(); apply(); } else zoomAt(e.clientX, e.clientY, 2.6); }
        else { lastTap = now; var ox = e.clientX, oy = e.clientY, inside = ox >= X && ox <= X + W * S && oy >= Y && oy <= Y + H * S; setTimeout(function () { if (lastTap && Date.now() - lastTap >= 300 && !inside && S <= 1.02) { lastTap = 0; closeBack(); } }, 330); }
      }
      start = null;
    }
    d.addEventListener("pointerup", up); d.addEventListener("pointercancel", function (e) { delete pts[e.pointerId]; start = null; });
    d.addEventListener("wheel", function (e) { e.preventDefault(); zoomAt(e.clientX, e.clientY, S * (e.deltaY < 0 ? 1.2 : 1 / 1.2)); }, { passive: false });
    document.addEventListener("keydown", key); addEventListener("resize", fit);
    document.body.appendChild(d); load();
    if (window.PBBack) PBBack.open(close, d);
  }

  /* जाली के बटन दबाने पर viewer: root के अंदर [data-g] */
  function bind(root, urls, caps) {
    if (!root) return;
    root.addEventListener("click", function (e) { var b = e.target.closest("[data-g]"); if (b && root.contains(b)) view(urls, +b.dataset.g, caps); });
  }
  window.PBPGal = { grid: grid, title: title, view: view, bind: bind, page: page };
})();
