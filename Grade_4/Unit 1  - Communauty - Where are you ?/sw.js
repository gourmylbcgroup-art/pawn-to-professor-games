const CACHE = 'ptp-grad4-where-are-you-fast-v3';
const CORE = [
  './style.css','./app.js','./assets/menu.webp',
  './games/where-are-you-game/sounds/where_are_you.mp3',
  './games/where-are-you-game/sounds/hospital.mp3',
  './games/where-are-you-game/sounds/park.mp3',
  './games/where-are-you-game/sounds/library.mp3',
  './games/where-are-you-game/sounds/bank.mp3',
  './games/where-are-you-game/sounds/school.mp3',
  './games/where-are-you-game/sounds/supermarket.mp3',
  './games/where-are-you-game/sounds/store.mp3',
  './games/where-are-you-game/sounds/night_market.mp3',
  './games/where-are-you-game/sounds/tea_shop.mp3',
  './games/where-are-you-game/sounds/cafe.mp3'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('ptp-grad4-where-are-you-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;
  const isStatic = /\.(?:mp3|webp|jpg|jpeg|png|css|js)$/i.test(url.pathname);
  if(!isStatic) return;
  event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if(res && res.ok){ const copy=res.clone(); caches.open(CACHE).then(c => c.put(req,copy)); }
    return res;
  })));
});
