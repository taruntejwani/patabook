/* PataBook — दुकान-मालिक का ☰ मेन्यू (दुकान के पब्लिक पन्ने पर): Settings + Log out
   सिर्फ़ तब दिखता है जब यही फ़ोन इस दुकान के मालिक का login है (pb-my-shops में slug + pb-session)।
   Preview यहाँ नहीं — मालिक पहले से Preview में है। फ़ोन का Back बटन पहले मेन्यू बंद करता है। */
(function () {
  var slug = ""; try { slug = new URLSearchParams(location.search).get("slug") || ""; } catch (e) {}
  if (!slug) return;
  function mine() {
    try {
      var s = JSON.parse(localStorage.getItem("pb-session") || "null"); if (!(s && s.refresh_token)) return false;
      var a = JSON.parse(localStorage.getItem("pb-my-shops") || "[]"); return Array.isArray(a) && a.indexOf(slug) >= 0;
    } catch (e) { return false; }
  }
  function en() { try { return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  var ov = null, btn = null;
  function glyph(open) { if (btn) btn.textContent = open ? "✕" : "☰"; }
  function kill() { if (ov) { ov.remove(); ov = null; glyph(false); } }
  function close() { if (window.PBBack && PBBack.isOpen()) PBBack.close(); else kill(); }
  function open() {
    if (ov) return;
    var h = !en(), ROW = "display:flex;align-items:center;gap:12px;padding:13px 14px;border-radius:12px;font-weight:700;font-size:15.5px;text-decoration:none;cursor:pointer;";
    ov = document.createElement("div"); ov.style.cssText = "position:fixed;inset:0;z-index:9000;background:rgba(10,20,40,.18)";
    var r = btn.getBoundingClientRect(), pn = document.createElement("div");
    pn.style.cssText = "position:absolute;top:" + Math.round(r.bottom + 8) + "px;right:12px;min-width:220px;max-width:calc(100vw - 24px);background:#fff;border-radius:16px;box-shadow:0 14px 34px rgba(11,47,115,.28);padding:6px;font-family:inherit";
    pn.innerHTML = '<a data-k="set" style="' + ROW + 'color:#0b2f73"><span style="font-size:20px;width:24px;text-align:center">⚙️</span>' + (h ? "सेटिंग" : "Settings") + '</a>' +
      '<a data-k="out" style="' + ROW + 'color:#c5221f;border-top:1px solid #eef1f7;margin-top:4px"><span style="font-size:20px;width:24px;text-align:center">🚪</span>' + (h ? "लॉग आउट" : "Log out") + '</a>';
    ov.appendChild(pn); document.body.appendChild(ov); glyph(true);
    ov.addEventListener("click", function (e) {
      var a = e.target.closest("[data-k]");
      if (!a) { close(); return; }
      if (a.dataset.k === "set") { location.href = "mybusiness.html"; return; }
      if (!confirm(h ? "लॉग आउट करें?" : "Log out?")) return;
      try { localStorage.removeItem("pb-my-shops"); localStorage.removeItem("pb-my-shop-st"); } catch (x) {}
      var go = function () { kill(); location.href = "index.html"; };
      try { (window.PBA && PBA.logout ? PBA.logout() : Promise.resolve()).catch(function () {}).then(go); } catch (x) { go(); }
    });
    if (window.PBBack) PBBack.open(kill);
  }
  function init() {
    if (!mine()) return;
    var nav = document.querySelector("header .nav"); if (!nav || document.getElementById("pbOwnMenu")) return;
    btn = document.createElement("button"); btn.type = "button"; btn.id = "pbOwnMenu";
    btn.setAttribute("aria-label", en() ? "Menu" : "मेन्यू"); btn.setAttribute("aria-haspopup", "true");
    btn.style.cssText = "flex:none;width:40px;height:40px;border-radius:50%;border:0;background:linear-gradient(135deg,#0b2f73,#1a73e8);color:#fff;font-size:19px;line-height:1;cursor:pointer;box-shadow:0 4px 12px rgba(26,115,232,.25)";
    btn.textContent = "☰";
    var lang = document.getElementById("pbLang"); if (lang && lang.parentNode === nav) nav.insertBefore(btn, lang.nextSibling); else nav.appendChild(btn);
    btn.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); if (ov) close(); else open(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
