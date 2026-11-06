const CACHE='naehen-v148';
const CORE=['./','./index.html','./styles.css','./portals.css','./app.js','./manifest.webmanifest','./icon.svg','./config.js','./movie-park-config.js','./walibi-holland-config.js','./walibi-belgium-config.js','./europa-park-config.js','./hansa-park-config.js','./soest-allerheiligenkirmes-2026-config.js','./bocholt-kirmes-2026-config.js','./assets/salzbergen-photo-preview.jpg','./salzbergen-herbstkirmes-2026-config.js','./rheine-herbstkirmes-2026-config.js','./muenster-herbstsend-2026-config.js','./gallimarkt-leer-2026-config.js','./hamburg-winterdom-2026-config.js','./bremer-freimarkt-2026-config.js','./nordhorn-herbstkirmes-2026-config.js','./hochheimer-markt-2026-config.js','./cranger-weihnachtszauber-2026-config.js','./meppen-herbstkirmes-2026-config.js','./koeln-deutz-herbstvolksfest-2026-config.js','./osnabrueck-herbstjahrmarkt-2026-config.js','./assets/osnabrueck26-racing-cars-fallback.svg','./assets/osnabrueck26-super-cars-fallback.svg','./assets/osnabrueck26-musik-express-fallback.svg','./assets/osnabrueck26-power-express-fallback.svg','./assets/osnabrueck26-lounge-360-fallback.svg','./assets/osnabrueck26-break-dance-fallback.svg','./assets/osnabrueck26-willy-der-wurm-fallback.svg','./assets/osnabrueck26-phantom-fallback.svg','./assets/osnabrueck26-symphonica-tower-fallback.svg','./assets/osnabrueck26-caribbean-star-fallback.svg','./assets/osnabrueck26-phantastische-reise-fallback.svg','./assets/osnabrueck26-looping-star-fallback.svg','./assets/osnabrueck26-ghost-villa-fallback.svg','./assets/osnabrueck26-heroes-city-xxl-fallback.svg','./assets/osnabrueck26-kristallpalast-fallback.svg','./assets/koeln-deutz-herbst-2026-background.webp','./assets/koeln-deutz-herbst-2026-mr-gravity.webp','./assets/bremer-freimarkt-2026-happy-traveller.webp','./assets/bremer-freimarkt-2026-map.png','./assets/muenster-herbstsend-2026.svg','./assets/mayday-the-ultimate-thrill.webp','./assets/rheine-herbstkirmes-2026.svg','./europa-park-images.json','./assets/park-picker-bg.webp','./assets/fly-logo-user.webp','./assets/chiapas-logo-user.webp','./assets/soest-allerheiligenkirmes-2026-lageplan.png','./assets/soest-big-bamboo.webp','./assets/soest-number-1.webp','./assets/soest-background.jpg','./assets/bocholt-kirmes-2026-plan.webp','./assets/bocholt-kirmes-2026-background.webp'];
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const cache = await caches.open(CACHE);
  // Install the essential application shell first. Delaying activation until
  // dozens of fair images and optional files download can strand an old push
  // handler indefinitely, especially on unstable mobile connections.
  await cache.addAll(['./','./index.html','./app.js','./styles.css',
    './portals.css','./config.js','./icon.svg','./manifest.webmanifest']);
  // Other files are automatically cached by our network-first fetch handler.
  await self.skipWaiting();
})()));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request, {cache:'no-store'}).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return r}).catch(()=>caches.match(e.request).then(r=>r||Response.error())));
});
// This handler is invoked by the OS/browser even when no NÄHEN window is open.
self.addEventListener('push', e=>{
  let message = {};
  try { message = e.data ? e.data.json() : {}; }
  catch (_) {
    try { message = { body: e.data?.text() || "Eine neue Durchsage ist da." }; }
    catch (_) { message = {}; }
  }
  const title = String(message.title || "🧵 NÄHEN-Durchsage").slice(0,80);
  const body = String(message.body || "Es gibt eine neue Nachricht.").slice(0,500);
  const tag = "naehen-push-" + (message.id || Date.now() + "-" + Math.random().toString(36).slice(2,8));
  e.waitUntil(self.registration.showNotification(title,{
    body, icon:"./icon.svg",badge:"./icon.svg",tag,renotify:true,
    vibrate:[120,55,150],
    data:{url:message.url||"./",messageId:message.id||null}
  }));
});
self.addEventListener('notificationclick', e=>{
  e.notification.close();
  e.waitUntil((async()=>{
    const detail = e.notification.data;
    const path = typeof detail === "string" ? detail : (detail?.url || "./");
    let url;
    try { url = new URL(path,self.registration.scope); }
    catch (_) { url = new URL("./",self.registration.scope); }
    if (url.origin !== self.location.origin) url = new URL("./",self.registration.scope);
    const all = await clients.matchAll({type:"window",includeUncontrolled:true});
    const windowClient = all.find(item=>item.url.startsWith(self.registration.scope));
    if (windowClient) { await windowClient.focus(); return; }
    await clients.openWindow(url.href);
  })());
});
self.addEventListener('pushsubscriptionchange',e=>{
  e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
    list.forEach(client=>client.postMessage({type:"NAEHEN_PUSH_SUBSCRIPTION_CHANGED"}));
  }));
});
