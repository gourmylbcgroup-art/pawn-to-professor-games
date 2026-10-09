const CACHE="unit4-colors-v3";
const STATIC_RE=/\.(?:mp3|webp|png|jpg|jpeg|svg|woff2?)$/i;
self.addEventListener("install",e=>{self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const u=new URL(e.request.url);
 if(u.origin!==location.origin)return;
 if(STATIC_RE.test(u.pathname)){
   e.respondWith((async()=>{const c=await caches.open(CACHE),hit=await c.match(e.request);if(hit)return hit;const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r})());
 }
});
