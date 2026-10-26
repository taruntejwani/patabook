/* PataBook — 💳 Google Play से Member plan खरीदना (PataBook Android app के अंदर; Digital Goods API + Payment Request)
   PBPlay.inApp()                     → app (Play Billing) में खुला है?
   await PBPlay.products()            → [{product, tier, days, price}]  (+ Play की असली कीमत अगर app में)
   await PBPlay.buy(slug, product)    → {ok, tier, until} | {ok:false, error}
   await PBPlay.recover(slug)         → पहले की अधूरी खरीद (जाँच न हो पाई हो) फिर से जाँचे
   Worker: PB_SITE.payUrl ("patabook-pay") — खाली हो तो खरीदने का बटन नहीं दिखता */
(function () {
  var SB = "https://kkvbpzysktozghnxplxv.supabase.co", KEY = "sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8", PLAY = "https://play.google.com/billing";
  var SVC = null, PRODS = null;
  function payUrl() { return ((window.PB_SITE && PB_SITE.payUrl) || "").replace(/\/$/, ""); }
  function inApp() { return "getDigitalGoodsService" in window && !!window.PaymentRequest; }
  async function svc() { if (SVC) return SVC; if (!inApp()) return null; try { SVC = await window.getDigitalGoodsService(PLAY); } catch (e) { SVC = null; } return SVC; }
  async function products() {
    if (PRODS) return PRODS;
    var L = [];
    try { var r = await fetch(SB + "/rest/v1/rpc/pb_play_products_public", { method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json" }, body: "{}" }); if (r.ok) L = await r.json() || []; } catch (e) {}
    var s = await svc();
    if (s && L.length) { try { var d = await s.getDetails(L.map(function (p) { return p.product; })); (d || []).forEach(function (x) { var p = L.filter(function (y) { return y.product === x.itemId; })[0]; if (p && x.price) p.playPrice = x.price; }); } catch (e) {} }
    PRODS = L; return L;
  }
  async function verify(slug, product, token) {
    var ses = window.PBA ? await PBA.session() : null; if (!ses) return { ok: false, error: "login" };
    var r = await fetch(payUrl() + "/verify", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + ses.access_token }, body: JSON.stringify({ slug: slug, product: product, token: token }) });
    var j = {}; try { j = await r.json(); } catch (e) {}
    return r.ok && j.ok ? j : { ok: false, error: j.error || ("HTTP " + r.status) };
  }
  async function buy(slug, product) {
    if (!payUrl()) return { ok: false, error: "off" };
    if (!(await svc())) return { ok: false, error: "not in app" };
    var req = new PaymentRequest([{ supportedMethods: PLAY, data: { sku: product } }], { total: { label: "Total", amount: { currency: "INR", value: "0" } } });
    var resp;
    try { resp = await req.show(); } catch (e) { return { ok: false, error: "cancelled" }; }
    var token = resp.details && resp.details.purchaseToken;
    if (!token) { try { await resp.complete("fail"); } catch (e) {} return { ok: false, error: "no token" }; }
    var v = await verify(slug, product, token);
    try { await resp.complete(v.ok ? "success" : "fail"); } catch (e) {}
    return v;
  }
  async function recover(slug) {
    var s = await svc(); if (!s || !payUrl() || !s.listPurchases) return [];
    var out = [];
    try { var L = await s.listPurchases() || []; for (var i = 0; i < L.length; i++) { var v = await verify(slug, L[i].itemId, L[i].purchaseToken); if (v.ok) out.push(v); } } catch (e) {}
    return out;
  }
  window.PBPlay = { inApp: inApp, products: products, buy: buy, recover: recover, on: function () { return !!payUrl(); } };
})();
