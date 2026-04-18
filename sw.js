/**
 * Febri Nahdatun Portfolio — Service Worker
 * Strategy:
 *   - HTML (navigation):   network-first, fallback ke cache (selalu fresh saat online)
 *   - Static assets (CDN/img/font): stale-while-revalidate
 *   - Apps Script API:     network-only (jangan di-cache → data harus live)
 */

const VERSION       = 'fnp-v1.0.0';
const STATIC_CACHE  = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => null))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Never cache live API
  if (url.hostname.includes('script.google.com') ||
      url.hostname.includes('script.googleusercontent.com') ||
      url.hostname.includes('data.bmkg.go.id') ||
      url.hostname.includes('groq.com') ||
      url.hostname.includes('generativelanguage.googleapis.com')) {
    return; // let the network handle it
  }

  // HTML / navigation → network-first
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Static assets → stale-while-revalidate
  if (['style', 'script', 'image', 'font'].includes(req.destination) ||
      url.pathname.endsWith('.css') || url.pathname.endsWith('.js') ||
      /\.(?:png|jpg|jpeg|svg|webp|woff2?)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }
});

async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (_) {
    const cached = await caches.match(req);
    return cached || caches.match('./index.html');
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(req);
  const network = fetch(req).then((res) => {
    if (res && res.status === 200) cache.put(req, res.clone());
    return res;
  }).catch(() => cached);
  return cached || network;
}
