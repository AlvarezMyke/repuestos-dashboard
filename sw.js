const CACHE_NAME = 'repuestos-mj-cache-v11';
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data.js',
  './vehicle-graphics.js',
  './xlsx-importer.js',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/bcv-logo.jpg',
  './assets/pagomovil-banner.jpg',
  './assets/banner-hero-electrico.jpg'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // No interceptar peticiones de la API del BCV
  if (url.origin.includes('dolarapi.com') || url.pathname.includes('/api/')) {
    return;
  }

  // ESTRATEGIA NETWORK-FIRST PARA SCRIPTS Y CÓDIGO (garantiza que cambios en PC y móviles se vean al instante)
  const isCodeAsset = url.pathname.endsWith('.html') ||
                      url.pathname.endsWith('.js') ||
                      url.pathname.endsWith('.css') ||
                      url.pathname.endsWith('.webmanifest') ||
                      url.pathname === '/' ||
                      url.pathname.endsWith('/');

  if (isCodeAsset) {
    e.respondWith(
      fetch(e.request)
        .then((fresh) => {
          if (fresh && fresh.status === 200) {
            const clone = fresh.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }
          return fresh;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first para imágenes pesadas
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
