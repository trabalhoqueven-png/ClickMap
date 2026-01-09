const CACHE_NAME = "q-mobile-v2";

// 📦 Arquivos estáticos (SEM JS)
const STATIC_ASSETS = [
  "/Q-Mobile/",
  "/Q-Mobile/index.html",
  "/Q-Mobile/stylesmapa.css",
  "/Q-Mobile/Mapa.html"
];

// 🔧 INSTALL
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// 🔄 ACTIVATE
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

// 🌐 FETCH
self.addEventListener("fetch", event => {

  // 🔥 JS SEMPRE DA INTERNET (Firebase depende disso)
  if (event.request.destination === "script") {
    event.respondWith(fetch(event.request));
    return;
  }

  // 📄 HTML sempre atualizado
  if (event.request.destination === "document") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // 🎨 CSS / imagens do cache
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
