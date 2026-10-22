/* PataBook — traffic की गिनती (सिर्फ़ गिनती: कोई नाम / नंबर / IP नहीं)।
   हर फ़ोन को एक random नंबर मिलता है ताकि एक आदमी दो बार न गिने।
   Admin अपने फ़ोन पर admin पेज खोलता है तो उसका फ़ोन गिनती से बाहर हो जाता है। */
(function () {
  var SB = 'https://kkvbpzysktozghnxplxv.supabase.co', KEY = 'sb_publishable_MnvGh8-r8s_XhrtbqFztFQ_jbCp71x8';
  var Q = [], sent = {}, timer = null, first = true, off = false;
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  if (ls('pb-notrack') === '1' || /bot|crawl|spider|slurp|preview|lighthouse|facebookexternalhit|whatsapp\/|headless/i.test(navigator.userAgent || '') && ls('pb-tracktest') !== '1') off = true;

  var vid = ls('pb-vid'), isNew = false;
  if (!vid || !/^[a-z0-9]{8,32}$/.test(vid)) {
    vid = ''; var a = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 20; i++) vid += a.charAt(Math.floor(Math.random() * a.length));
    ls('pb-vid', vid); isNew = true;
  }
  function page() {
    var p = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '');
    return p === '' || p === 'index' ? 'home' : p;
  }
  function source() {
    var u = new URLSearchParams(location.search).get('utm_source');
    if (u) return u.toLowerCase().slice(0, 30);
    var r = document.referrer || '', h = '';
    try { h = r ? new URL(r).hostname : ''; } catch (e) {}
    if (h && h === location.hostname) return 'site';
    if (/whatsapp|wa\.me/i.test(r) || /WhatsApp/i.test(navigator.userAgent)) return 'whatsapp';
    if (/google\./i.test(h) || /com\.google/i.test(r)) return 'google';
    if (/instagram/i.test(r) || /Instagram/i.test(navigator.userAgent)) return 'instagram';
    if (/facebook|fb\.|messenger/i.test(r) || /FBAN|FBAV/i.test(navigator.userAgent)) return 'facebook';
    if (/youtube|youtu\.be/i.test(r)) return 'youtube';
    if (/bing\.|yahoo\.|duckduckgo/i.test(h)) return 'other search';
    if (h) return h.replace(/^www\./, '').slice(0, 30);
    return 'direct';
  }
  function device() {
    var u = navigator.userAgent || '';
    if (/iPad|Tablet/i.test(u) || (/Android/i.test(u) && !/Mobile/i.test(u))) return 'tablet';
    return /Mobi|Android|iPhone/i.test(u) ? 'mobile' : 'computer';
  }
  function flush() {
    timer = null;
    if (off || !Q.length) return;
    var body = { vid: vid, ev: Q.splice(0, 12) };
    if (first) { body.isnew = isNew; body.src = source(); body.dev = device(); body.city = ls('pb-city') || ''; first = false; }
    try {
      fetch(SB + '/rest/v1/rpc/pb_track', { method: 'POST', keepalive: true,
        headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p: body }) }).catch(function () {});
    } catch (e) {}
    if (Q.length) timer = setTimeout(flush, 300);
  }
  function ev(kind, key, once) {
    if (off || !kind || key == null || key === '') return;
    key = String(key).slice(0, 60);
    if (once) { if (sent[kind + '|' + key]) return; sent[kind + '|' + key] = 1; }
    Q.push([kind, key]);
    if (!timer) timer = setTimeout(flush, first ? 1800 : 600);
  }
  window.PBT = { ev: ev, once: function (k, v) { ev(k, v, true); } };

  ev('pv', page());
  var slug = new URLSearchParams(location.search).get('slug');
  if (page() === 'business' && slug) ev('shop', slug, true);

  /* Call / WhatsApp / रास्ता — कौन-सी दुकान का */
  function slugNear(a) {
    if (page() === 'business' && slug) return slug;
    var c = a.closest('[data-slug]'); if (c) return c.getAttribute('data-slug');
    var box = a.closest('article,.card,li,.item,.popup,.maplibregl-popup-content,.mapboxgl-popup-content');
    var l = box && box.querySelector('a[href*="business.html?slug="]');
    if (l) { try { return new URL(l.href, location.href).searchParams.get('slug'); } catch (e) {} }
    return '';
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
    var h = a.getAttribute('href') || '', k = '';
    if (/^tel:/i.test(h)) k = 'call';
    else if (/wa\.me\/\+?\d|api\.whatsapp\.com\/send\?phone=\d/i.test(h)) k = 'wa';   /* share वाले link नहीं */
    else if (/map\.html\?(to|q)=/i.test(h)) k = 'dir';
    if (!k) return;
    var s = slugNear(a); if (s) { ev(k, s); flush(); }
  }, true);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && Q.length) flush(); });
})();
