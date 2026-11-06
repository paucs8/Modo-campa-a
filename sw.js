// Guarda la app en el móvil para que abra rápido y funcione sin conexión.
// Al cambiar cualquier archivo, sube VERSION para que los móviles descarguen la nueva.
const VERSION = 'v1';
const CACHE = `modo-campana-${VERSION}`;
const SHELL = [
  './', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/favicon.png',
  'assets/hero.png', 'assets/face.png', 'assets/logo.webp',
  'assets/llavero.png', 'assets/movil.png', 'assets/auriculares.png', 'assets/spray.png',
  'assets/mechero.png', 'assets/handycam.png', 'assets/skate.png',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero la red (para recibir cambios), y si no hay conexión, lo guardado.
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok && (request.url.startsWith(self.location.origin) || request.url.includes('fonts.g'))) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then(hit => hit || caches.match('index.html')))
  );
});
