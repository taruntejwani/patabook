/* अस्थायी जाँच (Back बटन की गड़बड़ ढूँढने के लिए): Home पर बड़े "PataBook" logo को 3 सेकंड में 5 बार छूने से चालू / बंद।
   चालू होने पर हर पेज के नीचे एक छोटी पट्टी: पिछले पेज, history की गिनती, Chrome version — screenshot भेजने के लिए।
   कोई निजी जानकारी नहीं; सब इसी फ़ोन में (sessionStorage / localStorage)। */
(function () {
  try {
    var K = "pb-dbg", on = false;
    try { on = localStorage.getItem(K) === "1"; } catch (e) {}
    function info(tag) {
      var n = null, ty = "?", ent = "?", idx = "?";
      try { n = performance.getEntriesByType("navigation")[0]; ty = n ? n.type : "?"; } catch (e) {}
      try { if (window.navigation) { ent = navigation.entries().length; idx = navigation.currentEntry ? navigation.currentEntry.index : "?"; } } catch (e) {}
      var ref = ""; try { ref = document.referrer ? new URL(document.referrer).pathname : "-"; } catch (e) { ref = "x"; }
      var act = ""; try { act = navigator.userActivation ? (navigator.userActivation.hasBeenActive ? "A" : "a") : ""; } catch (e) {}
      return (new Date()).toTimeString().slice(0, 8) + " " + tag + " " + location.pathname.replace(/\.html$/, "") + " t=" + ty + " r=" + ref + " h=" + history.length + " e=" + ent + " i=" + idx + " " + act;
    }
    function log(tag) { try { var a = JSON.parse(sessionStorage.getItem(K) || "[]"); a.push(info(tag)); sessionStorage.setItem(K, JSON.stringify(a.slice(-8))); } catch (e) {} }
    function show() {
      if (!on || !document.body) return;
      var d = document.getElementById("pbDbg");
      if (!d) { d = document.createElement("div"); d.id = "pbDbg"; d.style.cssText = "position:fixed;left:4px;right:4px;bottom:4px;z-index:2147483647;background:rgba(0,0,0,.82);color:#7f7;font:10px/1.35 monospace;padding:4px 6px;border-radius:6px;pointer-events:none;white-space:pre-wrap;word-break:break-all"; document.body.appendChild(d); }
      var a = []; try { a = JSON.parse(sessionStorage.getItem(K) || "[]"); } catch (e) {}
      var cv = (/Chrome\/(\d+)/.exec(navigator.userAgent) || [])[1] || "?";
      var sa = ""; try { sa = matchMedia("(display-mode: standalone)").matches ? "app" : "tab"; } catch (e) {}
      d.textContent = "Chrome " + cv + " · " + sa + " · CW=" + ("CloseWatcher" in window ? 1 : 0) + "\n" + a.join("\n");
    }
    if (on) {
      log("load");
      addEventListener("pageshow", function (e) { if (e.persisted) log("bfcache"); show(); });
      addEventListener("popstate", function () { log("pop"); show(); });
      if (document.readyState !== "loading") show(); else document.addEventListener("DOMContentLoaded", show);
    }
    /* चालू / बंद: Home का बड़ा logo 5 बार */
    var taps = [];
    document.addEventListener("click", function (e) {
      var t = e.target; if (!t || !t.closest || !t.closest("img.wm")) return;
      var now = Date.now(); taps = taps.filter(function (x) { return now - x < 3000; }); taps.push(now);
      if (taps.length < 5) return; taps = [];
      on = !on; try { if (on) localStorage.setItem(K, "1"); else { localStorage.removeItem(K); sessionStorage.removeItem(K); } } catch (x) {}
      var d = document.getElementById("pbDbg"); if (d && !on) d.remove();
      if (on) { log("on"); show(); }
      var m = document.createElement("div"); m.textContent = "Debug " + (on ? "ON" : "OFF");
      m.style.cssText = "position:fixed;left:50%;top:40%;transform:translateX(-50%);background:#000;color:#fff;font:600 16px system-ui;padding:10px 18px;border-radius:999px;z-index:2147483647";
      document.body.appendChild(m); setTimeout(function () { m.remove(); }, 1500);
    }, true);
  } catch (e) {}
})();
