self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// No offline caching yet — a fetch handler is required for installability.
self.addEventListener("fetch", () => {});
