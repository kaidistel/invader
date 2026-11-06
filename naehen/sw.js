const CACHE='naehen-v153';
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
  const options = {
    body, icon:"./icon.svg",badge:"./icon.svg",tag,renotify:true,
    vibrate:[120,55,150],
    data:{url:message.url||"./",messageId:message.id||null}
  };
  // Large notification images are optional in browsers/operating systems.
  // A signed URL is only shown when it comes from our private Supabase bucket.
  if (typeof message.image === "string" &&
      /^https:\/\/hcnpgqfkeqxuihhxvnwl\.supabase\.co\/storage\/v1\/object\/sign\/naehen-admin-images\//.test(message.image)) {
    options.image = message.image;
  }
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', e=>{
  e.notification.close();
  e.waitUntil((async()=>{
    const detail = e.notification.data;
    const path = typeof detail === "string" ? detail : (detail?.url || "./");
    let url;
    try { url = new URL(path,self.registration.scope); }
    catch (_) { url = new URL("./",self.registration.scope); }
    // Notification content must never navigate outside the installed NÄHEN scope.
    if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) {
      url = new URL("./",self.registration.scope);
    }
    const openInbox = url.searchParams.get("inbox") === "1";
    const messageId = url.searchParams.get("message") ||
      (typeof detail === "object" ? detail?.messageId : null);
    const all = await clients.matchAll({type:"window",includeUncontrolled:true});
    const windowClient = all.find(item=>item.url.startsWith(self.registration.scope));
    if (windowClient) {
      await windowClient.focus();
      if (openInbox) {
        // Avoid reloading a running queue timer. New clients acknowledge
        // in-app routing; old cached app versions fall back to URL navigation.
        let acknowledged = false;
        try {
          const channel = new MessageChannel();
          const reply = new Promise(resolve=>{
            const timeout = setTimeout(()=>resolve(false),1100);
            channel.port1.onmessage = event=>{
              clearTimeout(timeout);
              resolve(event.data?.ok === true);
            };
          });
          windowClient.postMessage({type:"NAEHEN_OPEN_INBOX",messageId},[channel.port2]);
          acknowledged = await reply;
          channel.port1.close();
        } catch (_) { acknowledged = false; }
        if (!acknowledged) {
          try {
            const navigated = await windowClient.navigate(url.href);
            if (navigated) { await navigated.focus(); return; }
          } catch (_) {}
          await clients.openWindow(url.href);
        }
      }
      return;
    }
    const opened = await clients.openWindow(url.href);
    if (opened) await opened.focus();
  })());
});
self.addEventListener('pushsubscriptionchange',e=>{
  e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
    list.forEach(client=>client.postMessage({type:"NAEHEN_PUSH_SUBSCRIPTION_CHANGED"}));
  }));
});
