self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("q-mobile-v1").then(cache => {
      return cache.addAll([
        "/Q-Mobile/",
        "/Q-Mobile/index.html",
        "/Q-Mobile/stylesmapa.css",
        "/Q-Mobile/Mapa.js"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});