const CACHE_NAME = "marknrolled-shell-v1";
const APP_SHELL = [
  new URL("./", self.location.href).href,
  new URL("./index.html", self.location.href).href,
  new URL("./manifest.json", self.location.href).href,
  new URL("./icon-192.png", self.location.href).href,
  new URL("./icon-512.png", self.location.href).href,
  new URL("./apple-touch-icon.png", self.location.href).href
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith("marknrolled-shell-") && name !== CACHE_NAME)
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  // This app uses external CDNs for Tailwind, fonts and icons; those need internet access.
  if (requestUrl.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    // Prefer the latest GitHub Pages version, with a cached page as an offline fallback.
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch (error) {
        return (await caches.match(request)) ||
          (await caches.match(new URL("./index.html", self.location.href).href));
      }
    })());
    return;
  }

  // Cache-first for same-origin static files.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    try {
      const response = await fetch(request);
      if (response && response.ok && response.type === "basic") {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (error) {
      return Response.error();
    }
  })());
});
