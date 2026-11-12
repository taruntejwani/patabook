/* PataBook — 🏆 भरोसे के निशान (sql-50: pb_trust_public)
   दुकान के पेज पर ⭐ रेटिंग वाले डिब्बे (#pbRate) के ठीक ऊपर — कौन-सी जाँच हुई, कौन-सी नहीं।
   कोई "भरोसेमंद" का ठप्पा नहीं; नीचे साफ़ लिखा है कि यह गारंटी नहीं है।
   अपनी दुकान (pb-my-shops में slug) हो तो: जो बाकी है उसे पूरा करने का link। SQL न चली हो → कुछ नहीं दिखता। */
(function () {
  if (window.PBTrust) return;
  var SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
  try { var cf = window.PATABOOK_SUPABASE || {}; if (cf.url) SB = cf.url; if (cf.anonKey) KEY = cf.anonKey; } catch (e) {}
  function EN() { try { if (window.PB && PB.lang) return PB.lang() !== "hi"; return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  var slug = ""; try { slug = new URLSearchParams(location.search).get("slug") || ""; } catch (e) {}
  if (!slug || !/\/(shop|business|brand)(\.html)?$/.test(location.pathname)) return;
  var OWN = false; try { OWN = (JSON.parse(localStorage.getItem("pb-my-shops") || "[]") || []).indexOf(slug) >= 0; } catch (e) {}
  var D = null;
  var CHK = [
    ["phone", "📱", "Mobile number verified by OTP", "मोबाइल नंबर OTP से जाँचा गया"],
    ["photo", "🏪", "Shop photos checked by PataBook", "दुकान की फ़ोटो PataBook ने जाँची"],
    ["gst", "🧾", "GST verified", "GST Verified"],
    ["loc", "📍", "Location confirmed on the map", "नक्शे पर जगह पक्की की गई"],
    ["profile", "📝", "Profile complete (timing, address, photo)", "प्रोफ़ाइल पूरी (समय, पता, फ़ोटो)"]
  ];
  var css = document.createElement("style");
  css.textContent = ".pbtr{border:1px solid #e3e8f2;border-radius:16px;background:#fff;padding:14px 16px;margin:16px 0;font-family:inherit;color:#14161c}" +
    ".pbtr h3{margin:0;font-size:16px;color:#0b2f73}.pbtr .sub{font-size:13px;color:#5b6475;margin:2px 0 8px}.pbtr ul{list-style:none;margin:0;padding:0}" +
    ".pbtr li{display:flex;gap:10px;align-items:center;padding:6px 0;font-size:14px;border-top:1px solid #f1f3f6}.pbtr li:first-child{border-top:0}" +
    ".pbtr li b{flex:none;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:13px}.pbtr li.y b{background:#e6f4ea;color:#1e6b35}.pbtr li.n b{background:#f2f4f7;color:#98a2b3}.pbtr li.n span{color:#667085}" +
    ".pbtr .meta{font-size:13px;color:#344054;margin-top:8px}.pbtr .nt{font-size:12px;color:#667085;margin-top:6px;line-height:1.45}.pbtr a.own{display:inline-block;margin-top:8px;color:#1a73e8;font-weight:700;font-size:14px;text-decoration:none}";
  document.head.appendChild(css);
  function fmtD(d, en) { try { var x = new Date(d + "T00:00:00"); return x.toLocaleDateString(en ? "en-IN" : "hi-IN", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return d; } }
  function fmtM(d, en) { try { var x = new Date(d + "T00:00:00"); return x.toLocaleDateString(en ? "en-IN" : "hi-IN", { month: "short", year: "numeric" }); } catch (e) { return d; } }
  function html() {
    var en = EN(), n = CHK.filter(function (c) { return D[c[0]]; }).length;
    var meta = [];
    if (+D.reviews > 0) meta.push("⭐ " + (+D.rating).toFixed(1) + " (" + D.reviews + (en ? " ratings)" : " रेटिंग)"));
    if (D.updated) meta.push((en ? "Last updated: " : "आख़िरी बदलाव: ") + fmtD(D.updated, en));
    if (D.since) meta.push((en ? "On PataBook since " : "PataBook पर ") + fmtM(D.since, en) + (en ? "" : " से"));
    return '<h3>🏆 ' + esc(en ? "Trust signs" : "भरोसे के निशान") + '</h3><div class="sub">' + esc(en ? n + " of 5 checks done" : "5 में से " + n + " जाँच पूरी") + '</div><ul>' +
      CHK.map(function (c) { var y = !!D[c[0]]; return '<li class="' + (y ? "y" : "n") + '"><b>' + (y ? "✓" : "–") + '</b><span>' + c[1] + " " + esc(en ? c[2] : c[3]) + '</span></li>'; }).join("") + '</ul>' +
      (meta.length ? '<div class="meta">' + esc(meta.join(" · ")) + '</div>' : '') +
      '<div class="nt">' + esc(en ? "These only show which checks were done. PataBook does not guarantee the shop's products or services." : "ये सिर्फ़ बताते हैं कि कौन-सी जाँच हुई है। PataBook दुकान के सामान या काम की गारंटी नहीं देता।") + '</div>' +
      (OWN && n < 5 ? '<a class="own" href="mybusiness.html">' + esc(en ? "Complete the remaining checks in My Shop ›" : "बाकी जाँच My Shop में पूरी करें ›") + '</a>' : '');
  }
  var el = null;
  function place() {
    if (!D) return;
    var anchor = document.getElementById("pbRate");
    if (!anchor) return;
    var host = anchor.closest(".rate, .card, section") || anchor;
    if (!el || !document.body.contains(el)) { el = document.createElement("div"); el.className = "pbtr"; el.setAttribute("data-pbh", "trust"); host.parentNode.insertBefore(el, host); }
    el.innerHTML = html();
  }
  fetch(SB + "/rest/v1/rpc/pb_trust_public", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_slug: slug }) })
    .then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || typeof j !== "object") return; D = j; place();
      var k = 0, mo = new MutationObserver(function () { if (k++ > 300) return mo.disconnect(); if (!el || !document.body.contains(el)) place(); });
      mo.observe(document.body, { childList: true, subtree: true }); setTimeout(function () { mo.disconnect(); }, 20000);
      try { if (window.PB && PB.onChange) PB.onChange(function () { setTimeout(place, 50); }); } catch (e) {}
    }).catch(function () {});
  window.PBTrust = { refresh: place };
})();
