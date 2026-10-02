const CACHE='gr3-family-custom-voice-v5';
const CORE=['./assets/audio/voice-sprite-stephane-v1.mp3'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);if(u.origin!==location.origin)return;
  if(u.pathname.endsWith('/assets/audio/voice-sprite-stephane-v1.mp3')){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{if(resp.ok)caches.open(CACHE).then(c=>c.put(e.request,resp.clone()));return resp;})));return;
  }
  // Keep visuals lean: network first, then cache only successfully fetched static lesson assets.
  e.respondWith(fetch(e.request).then(resp=>{if(resp.ok&&/\.(?:webp|png|jpg|jpeg|css|js)$/i.test(u.pathname)){caches.open(CACHE).then(c=>c.put(e.request,resp.clone()));}return resp;}).catch(()=>caches.match(e.request)));
});
