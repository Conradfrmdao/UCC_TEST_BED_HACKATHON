const CACHE = 'chinga-public-v3';
const DEVELOPMENT = new URL(self.location.href).searchParams.get('development') === '1';
const OFFLINE = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    if (!DEVELOPMENT) {
      const cache = await caches.open(CACHE);
      await cache.addAll([OFFLINE, '/icon.svg']);
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith('chinga-') && (DEVELOPMENT || key !== CACHE)).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (DEVELOPMENT || request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Never mix HTML with API, React Server Component, script or image responses.
  // Role pages and sensitive data are intentionally not stored in Cache Storage.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => {
      const fallback = await caches.match(OFFLINE);
      return fallback || Response.error();
    }));
    return;
  }

  if (!['/icon.svg', '/images/chinga-family-safety-hero.webp'].includes(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  })());
});
