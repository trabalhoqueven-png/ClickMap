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
  if (event.request.destination === "script") {
    event.respondWith(fetch(event.request));
    return;
    })
  );
});

