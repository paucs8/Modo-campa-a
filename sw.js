// Guarda la app en el móvil para que abra rápido y funcione sin conexión.
// Al cambiar cualquier archivo, sube VERSION para que los móviles descarguen la nueva.
const VERSION = 'v18';
const CACHE = `modo-campana-${VERSION}`;
const SHELL = [
  './', 'index.html', 'styles.css', 'app.js', 'config.js', 'character.js', 'scene.js', 'manifest.webmanifest',
  'icons/icon-192-cofre.png', 'icons/icon-512-cofre.png', 'icons/apple-touch-icon-cofre.png', 'icons/favicon-cofre.png',
  'assets/cofre.png', 'assets/cofre-abierto.png', 'assets/moneda.png', 'assets/jefe.png',
  'assets/items/llavero.png', 'assets/items/botella.png', 'assets/items/auriculares.png', 'assets/items/movil.png',
  'assets/items/mancuerna.png', 'assets/items/handycam.png', 'assets/items/skate.png',
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
        if (response.ok && (request.url.startsWith(self.location.origin) || request.url.includes('fonts.g') || request.url.includes('cdn.jsdelivr.net'))) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then(hit => hit || (request.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
