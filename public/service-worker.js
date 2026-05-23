// public/service-worker.js
// Service worker simple : cache les assets statiques pour usage offline basique

const CACHE_NAME = 'aladj-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/logo-mark-80.png',
  '/logo-mark-128.png',
  '/favicon.ico',
];

// Installation : mise en cache initiale
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch : network-first pour les requêtes API, cache-first pour les assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne jamais cacher : API Firebase, BGG, DeepL, Vercel functions
  if (
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('boardgamegeek.com') ||
    url.hostname.includes('deepl.com') ||
    url.pathname.startsWith('/api/')
  ) {
    return; // laisse passer normalement
  }

  // Pour le reste : cache-first avec fallback network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          // Met en cache les GET réussis seulement
          if (request.method === 'GET' && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback : si pas de réseau, on essaie de servir l'index.html (SPA)
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
