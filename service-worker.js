self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("fetch", event => {
  // NUNCA cache login ou páginas privadas
  if (
    event.request.url.includes("index.html") ||
    event.request.url.includes("Mapa.html") ||
    event.request.url.includes("comprar.html")
  ) {
    event.respondWith(fetch(event.request));
    return;
  }
});
