/* 🎁 PataBook "दोस्त को share" (sql-34): link में ?ref=<दुकान> हो तो
   1) इस फ़ोन की एक random पहचान बनाओ (कोई निजी जानकारी नहीं)  2) सर्वर को बताओ "link खुला"  3) ref याद रखो —
   बाद में यही फ़ोन अपनी दुकान जोड़े तो "मेरी दुकान" खुलते ही वह दोस्त की गिनती में जुड़ जाती है। */
(function () {
  var SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8";
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function dev() {
    var d = get("pb-dev");
    if (!d || !/^[a-z0-9-]{16,64}$/.test(d)) {
      d = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : ("d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12));
      d = d.toLowerCase().replace(/[^a-z0-9-]/g, ""); set("pb-dev", d);
    }
    return d;
  }
  window.PBRef = { dev: dev, ref: function () { try { var r = JSON.parse(get("pb-ref") || "null"); return r && r.s ? r.s : ""; } catch (e) { return ""; } } };
  var m = /[?&]ref=([a-z0-9][a-z0-9-]{1,119})(?:&|#|$)/i.exec(location.search);
  if (!m) return;
  var ref = m[1].toLowerCase();
  /* अपनी ही दुकान का link खुद खोला: गिनती नहीं */
  try { var mine = JSON.parse(get("pb-my-shops") || "[]"); if (Array.isArray(mine) && mine.indexOf(ref) >= 0) return; } catch (e) {}
  set("pb-ref", JSON.stringify({ s: ref, t: Date.now() }));
  var once = "pb-refv-" + ref; if (get(once)) return;
  fetch(SB + "/rest/v1/rpc/pb_ref_visit", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_ref: ref, p_device: dev() }) })
    .then(function (r) { if (r.ok) set(once, "1"); }).catch(function () {});
})();
