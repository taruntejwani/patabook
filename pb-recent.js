/* PataBook — 🕘 पिछली खोजें (आख़िरी 5) + 🔥 लोकप्रिय खोजें
   • सिर्फ़ इसी फ़ोन/ब्राउज़र में (localStorage "pb-recent") — server पर कुछ नहीं जाता
   • search box खाली हो और छुआ जाए → नीचे सूची; ✕ से एक हटाएँ, "सब हटाएँ" से सारी
   • PBRecent.attach(input, onPick?)  — onPick न दें तो search.html?q=… खुलता है
   • PBRecent.add(text)               — खोज होने पर (search.html) */
(function () {
  if (window.PBRecent) return;
  var KEY = "pb-recent", MAX = 5;
  function en() { try { if (window.PB && PB.lang) return PB.lang() !== "hi"; return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function get() { try { var a = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(a) ? a.filter(function (x) { return typeof x === "string" && x; }).slice(0, MAX) : []; } catch (e) { return []; } }
  function put(a) { try { if (a.length) localStorage.setItem(KEY, JSON.stringify(a.slice(0, MAX))); else localStorage.removeItem(KEY); } catch (e) {} }
  function add(t) {
    t = String(t || "").replace(/\s+/g, " ").trim().slice(0, 60); if (t.length < 2) return;
    var k = t.toLowerCase(); put([t].concat(get().filter(function (x) { return x.toLowerCase() !== k; })));
  }
  /* 🔥 लोकप्रिय खोजें (sql-47: pb_popular_searches) — पिछले 30 दिन, जिन पर दुकान मिली; 1 घंटे के लिए याद */
  var POP = null, popBusy = false;
  function loadPop(cb) {
    if (POP) return cb();
    try { var c = JSON.parse(sessionStorage.getItem("pb-pop") || "null"); if (c && c.t > Date.now() - 3600e3 && Array.isArray(c.a)) { POP = c.a; return cb(); } } catch (e) {}
    if (popBusy) return; popBusy = true;
    var cfg = window.PATABOOK_SUPABASE || {}, SB = cfg.url || "https://kkvbpzysktozghnxplxv.supabase.co", K = cfg.anonKey || "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
    fetch(SB + "/rest/v1/rpc/pb_popular_searches", { method: "POST", headers: { apikey: K, Authorization: "Bearer " + K, "Content-Type": "application/json" }, body: JSON.stringify({ p_limit: 8 }) })
      .then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; })
      .then(function (a) { POP = (Array.isArray(a) ? a : []).filter(function (x) { return typeof x === "string" && x; }).slice(0, 8); try { sessionStorage.setItem("pb-pop", JSON.stringify({ t: Date.now(), a: POP })); } catch (e) {} popBusy = false; cb(); });
  }
  var css = document.createElement("style");
  css.textContent =
    ".pbrc{position:fixed;z-index:9995;background:#fff;border:1px solid #e3e6ea;border-radius:16px;box-shadow:0 10px 30px rgba(20,30,60,.18);overflow:hidden;font-family:var(--pbf,system-ui,sans-serif);display:none}" +
    ".pbrc.on{display:block}.pbrc .h{display:flex;align-items:center;justify-content:space-between;padding:9px 14px;background:#f4f7ff;font-size:12.5px;font-weight:700;color:#5b6475}" +
    ".pbrc .h button{border:0;background:none;color:#1a73e8;font:700 13px inherit;font-family:inherit;padding:4px 2px;cursor:pointer}" +
    ".pbrc .r{display:flex;align-items:center;border-top:1px solid #f1f3f4}.pbrc .r>button{border:0;background:none;font:inherit;cursor:pointer;color:#14161c}" +
    ".pbrc .r .q{flex:1;min-width:0;display:flex;align-items:center;gap:10px;text-align:left;padding:12px 14px;font-size:16px;touch-action:manipulation}.pbrc .r .q span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".pbrc .pp{display:flex;flex-wrap:wrap;gap:8px;padding:10px 12px 12px;border-top:1px solid #f1f3f4}.pbrc .pp button{border:1px solid #dbe4f5;background:#f8fbff;color:#0b2f73;border-radius:999px;padding:7px 12px;font:600 14px inherit;font-family:inherit;cursor:pointer;touch-action:manipulation}" +
    ".pbrc .r .q:active,.pbrc .r .q:hover{background:#f1f6ff}.pbrc .r .x{flex:none;width:44px;height:44px;color:#8a93a6;font-size:16px}";
  document.head.appendChild(css);

  function attach(inp, onPick) {
    if (!inp || inp.__pbrc) return; inp.__pbrc = 1;
    var box = document.createElement("div"); box.className = "pbrc"; box.setAttribute("role", "listbox"); document.body.appendChild(box);
    var anchor = inp.closest(".search,.hsb,form") || inp;
    function place() {
      var r = anchor.getBoundingClientRect(), w = Math.min(r.width, window.innerWidth - 20), l = Math.max(10, Math.min(r.left, window.innerWidth - w - 10));
      box.style.left = l + "px"; box.style.width = w + "px"; box.style.top = Math.round(r.bottom + 6) + "px";
    }
    function hide() { box.classList.remove("on"); }
    function show() {
      var a = get(), pop = (POP || []).filter(function (p) { return !a.some(function (x) { return x.toLowerCase() === p.toLowerCase(); }); });
      if (!POP) loadPop(function () { if (document.activeElement === inp && !inp.value.trim()) show(); });
      if (inp.value.trim() || (!a.length && !pop.length)) return hide();
      var E = en();
      box.innerHTML = (a.length ? '<div class="h"><span>🕘 ' + (E ? "Recent searches" : "पिछली खोजें") + '</span><button type="button" data-clr>' + (E ? "Clear all" : "सब हटाएँ") + '</button></div>' : '') +
        a.map(function (t, i) { return '<div class="r"><button type="button" class="q" data-i="' + i + '"><i aria-hidden="true">🕘</i><span>' + esc(t) + '</span></button><button type="button" class="x" data-x="' + i + '" aria-label="' + esc((E ? "Remove " : "हटाएँ: ") + t) + '">✕</button></div>'; }).join("") +
        (pop.length ? '<div class="h"><span>🔥 ' + (E ? "Popular searches" : "लोकप्रिय खोजें") + '</span></div><div class="pp">' + pop.map(function (t) { return '<button type="button" data-p="' + esc(t) + '">' + esc(t) + '</button>'; }).join("") + '</div>' : '');
      place(); box.classList.add("on");
    }
    /* box को छूने से input का focus / keyboard न छूटे */
    box.addEventListener("mousedown", function (e) { e.preventDefault(); });
    box.addEventListener("click", function (e) {
      var a = get(), b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-clr")) { put([]); show(); return; }
      if (b.dataset.p != null) { var tp = b.dataset.p; hide(); if (onPick) onPick(tp); else location.href = "search.html?q=" + encodeURIComponent(tp); return; }
      if (b.dataset.x != null) { a.splice(+b.dataset.x, 1); put(a); show(); inp.focus(); return; }
      if (b.dataset.i != null) { var t = a[+b.dataset.i]; hide(); if (!t) return; if (onPick) onPick(t); else location.href = "search.html?q=" + encodeURIComponent(t); }
    });
    inp.addEventListener("focus", show);
    inp.addEventListener("click", show);
    inp.addEventListener("input", function () { if (inp.value.trim()) hide(); else show(); });
    inp.addEventListener("blur", function () { setTimeout(hide, 120); });
    inp.addEventListener("keydown", function (e) { if (e.key === "Escape") hide(); });
    addEventListener("resize", function () { if (box.classList.contains("on")) place(); });
    addEventListener("scroll", function () { if (box.classList.contains("on")) place(); }, { passive: true });
  }
  window.PBRecent = { attach: attach, add: add, list: get };
})();
