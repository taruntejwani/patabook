/* 👍 पसंद / 👎 नापसंद / 💫 फ़ेवरेट — दुकान के page पर, ⭐ रेटिंग (#pbRate) के ठीक ऊपर
   • login (असली, guest नहीं) के बाद ही; बिना login दबाने पर login page
   • गिनती public को नहीं दिखती — सिर्फ़ दुकानदार को (मेरी दुकान → ग्राहक रेटिंग)
   • SQL 44: pb_my_shop_react, pb_vote_set, pb_fav_set */
(function () {
  if (window.PBReact) return;
  var slug = new URLSearchParams(location.search).get("slug") || "", ST = { vote: 0, fav: false }, LOADED = false, BUSY = false, MSG = "", CSS = false;
  function en() { if (window.PB && PB.lang) return PB.lang() !== "hi"; try { return (localStorage.getItem("pb-lang") || "en") !== "hi"; } catch (e) { return true; } }
  function T(h, e) { return en() ? e : h; }
  function cfg() { try { return { u: SB, k: KEY }; } catch (e) { return null; } }
  async function call(fn, args, tok) {
    var c = cfg(); if (!c) throw new Error("no sb");
    var r = await fetch(c.u + "/rest/v1/rpc/" + fn, { method: "POST", headers: { apikey: c.k, Authorization: "Bearer " + tok, "Content-Type": "application/json" }, body: JSON.stringify(args) });
    var j = null; try { j = await r.json(); } catch (e) {}
    if (!r.ok) { var x = new Error((j && (j.message || j.msg)) || ("HTTP " + r.status)); x.status = r.status; throw x; }
    return j;
  }
  async function sess() { try { var s = window.PBA ? await PBA.session() : null; if (s && PBA.isGuest && PBA.isGuest(s)) return null; return s; } catch (e) { return null; } }
  async function loadMine() {
    if (LOADED) return; LOADED = true; var s = await sess(); if (!s) return;
    try { var j = await call("pb_my_shop_react", { p_slug: slug }, s.access_token); if (j) { ST.vote = j.vote || 0; ST.fav = !!j.fav; } } catch (e) {}
    paint();
  }
  function css() {
    if (CSS) return; CSS = true; var st = document.createElement("style");
    st.textContent = ".pbrx{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 0}.pbrx button{flex:1;min-width:92px;display:flex;align-items:center;justify-content:center;gap:6px;border:1.5px solid #dbe2ef;background:#fff;color:#1c2540;border-radius:12px;padding:10px 8px;font:inherit;font-weight:700;font-size:14px;cursor:pointer}" +
      ".pbrx button span{font-size:18px;line-height:1}.pbrx button.on{border-color:#1a4fb0;background:#eef4ff;color:#0b2f73}.pbrx button.on.dn{border-color:#b42318;background:#fff1f0;color:#8a1c12}.pbrx button.on.fv{border-color:#b7791f;background:#fff8e6;color:#7a4b00}" +
      ".pbrxm{flex-basis:100%;font-size:13px;color:#5b6475;margin-top:2px}.pbrxm a{color:#1a4fb0;font-weight:700}";
    document.head.appendChild(st);
  }
  function el() {
    var r = document.getElementById("pbRate"); if (!r || !r.parentNode) return null;
    var x = document.getElementById("pbReact");
    if (!x) { x = document.createElement("div"); x.id = "pbReact"; r.parentNode.insertBefore(x, r); }
    return x;
  }
  function paint() {
    var x = el(); if (!x) return; css();
    x.className = "pbrx";
    x.innerHTML =
      '<button type="button" data-rx="up" class="' + (ST.vote === 1 ? "on" : "") + '" aria-pressed="' + (ST.vote === 1) + '"><span>👍</span>' + T("पसंद", "Like") + '</button>' +
      '<button type="button" data-rx="down" class="dn' + (ST.vote === -1 ? " on" : "") + '" aria-pressed="' + (ST.vote === -1) + '"><span>👎</span>' + T("नापसंद", "Dislike") + '</button>' +
      '<button type="button" data-rx="fav" class="fv' + (ST.fav ? " on" : "") + '" aria-pressed="' + ST.fav + '"><span>💫</span>' + (ST.fav ? T("फ़ेवरेट में है", "In favourites") : T("फ़ेवरेट", "Favourite")) + '</button>' +
      (MSG ? '<div class="pbrxm">' + MSG + '</div>' : '');
  }
  async function act(k) {
    if (BUSY) return;
    var s = await sess(); if (!s) { location.href = window.PBA && PBA.loginUrl ? PBA.loginUrl() : "login.html"; return; }
    BUSY = true; var old = { vote: ST.vote, fav: ST.fav };
    try {
      if (k === "fav") {
        ST.fav = !ST.fav; MSG = ""; paint();
        await call("pb_fav_set", { p_slug: slug, p_on: ST.fav }, s.access_token);
        MSG = ST.fav ? T("💫 फ़ेवरेट में जुड़ गई। सारी फ़ेवरेट दुकानें: ", "💫 Added to favourites. All your favourites: ") + '<a href="favourites.html">' + T("मेरी फ़ेवरेट दुकानें ›", "My favourite shops ›") + '</a>' : T("फ़ेवरेट से हटा दी।", "Removed from favourites.");
      } else {
        var v = k === "up" ? 1 : -1; if (ST.vote === v) v = 0;   /* दोबारा दबाया = हटाओ */
        ST.vote = v; MSG = ""; paint();
        await call("pb_vote_set", { p_slug: slug, p_vote: v }, s.access_token);
        MSG = v === 1 ? T("धन्यवाद! आपको यह दुकान पसंद है।", "Thanks! You like this shop.") : v === -1 ? T("धन्यवाद, आपकी राय सेव हो गई।", "Thanks, your feedback is saved.") : "";
      }
    } catch (e) {
      ST.vote = old.vote; ST.fav = old.fav;
      var m = String(e && e.message || "");
      MSG = /own shop/i.test(m) ? T("अपनी ही दुकान को पसंद / नापसंद नहीं कर सकते।", "You cannot like or dislike your own shop.")
        : /login|JWT|expired/i.test(m) ? T("दोबारा लॉगिन करें।", "Please log in again.")
        : /rate limit/i.test(m) ? T("बहुत जल्दी-जल्दी हो रहा है, थोड़ी देर बाद कोशिश करें।", "Too fast — please try again in a while.")
        : /too many/i.test(m) ? T("फ़ेवरेट में 200 से ज़्यादा दुकानें नहीं रख सकते।", "You can keep up to 200 favourite shops.")
        : T("अभी सेव नहीं हो सका।", "Could not save right now.");
    }
    BUSY = false; paint();
  }
  document.addEventListener("click", function (e) { var b = e.target.closest && e.target.closest("#pbReact [data-rx]"); if (b) act(b.dataset.rx); });
  function tick() { var r = document.getElementById("pbRate"); if (r && !document.getElementById("pbReact")) { paint(); loadMine(); } }
  new MutationObserver(tick).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", tick);
  window.PBReact = { paint: paint };
})();
