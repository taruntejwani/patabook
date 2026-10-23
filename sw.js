/* PataBook service worker: app install ke liye. Hamesha naya version internet se, net na ho to purana. */
const C="pb-v1";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{
  const r=e.request;
  if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
});
/* Admin push notification (सिर्फ admin ने "🔔 Notification चालू करें" दबाया हो तब आता है) */
self.addEventListener("push",e=>{
  let d={};try{d=e.data?e.data.json():{};}catch(_){d={body:e.data?e.data.text():""};}
  e.waitUntil(self.registration.showNotification(d.title||"PataBook",{
    body:d.body||"",icon:"icon-192.png",badge:"badge-96.png",tag:d.tag||"pb",renotify:true,
    vibrate:[200,100,200],data:{url:d.url||"/admin.html"}
  }));
});
self.addEventListener("notificationclick",e=>{
  e.notification.close();
  const u=new URL((e.notification.data&&e.notification.data.url)||"/admin.html",self.location.origin).href;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{
    for(const c of cs){if(c.url.split("#")[0]===u.split("#")[0]&&"focus" in c){c.navigate(u).catch(()=>{});return c.focus();}}
    return self.clients.openWindow(u);
  }));
});
