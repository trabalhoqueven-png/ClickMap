const CACHE_NAME = "qmobile-v2";

self.addEventListener("install", event => {
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
  const url = new URL(event.request.url);

  // 🚫 NUNCA cachear páginas protegidas
  if (
    url.pathname.includes("Mapa.html") ||
    url.pathname.includes("Mapa.js")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 🔓 páginas públicas podem usar cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
