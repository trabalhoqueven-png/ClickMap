const CACHE_NAME = "clickmap-v1";

const FILES_TO_CACHE = [
  "/ClickMap/",
  "/ClickMap/index.html",
  "/ClickMap/Mapa.html",
  "/ClickMap/comprar.html",
  "/ClickMap/styles.css",
  "/ClickMap/stylesmapa.css",
  "/ClickMap/Mapa.js",
  "/ClickMap/index.js",
  "/ClickMap/comprar.js",
  "/ClickMap/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
