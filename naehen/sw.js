const CACHE='naehen-v69';
const CORE=['./','./index.html','./styles.css','./portals.css','./app.js','./manifest.webmanifest','./icon.svg','./config.js','./movie-park-config.js','./walibi-holland-config.js','./walibi-belgium-config.js','./europa-park-config.js','./hansa-park-config.js','./europa-park-images.json','./assets/park-picker-bg.webp','./assets/fly-logo-user.webp','./assets/chiapas-logo-user.webp'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
self.addEventListener('push',e=>{
  let data={title:'🧵 Näh-Alarm',body:'Da wird genäht.'};
  try{data={...data,...e.data.json()}}catch{}
  e.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:'./icon.svg',badge:'./icon.svg',data:data.url||'./'}));
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow(e.notification.data||'./'))});