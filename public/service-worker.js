const isCodespacesHost = () =>
  location.hostname.includes('github.dev') || location.hostname.includes('app.github.dev');

self.addEventListener('install', (event) => {
  console.log('Service worker installing...');

  if (isCodespacesHost()) {
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    caches.open('authyntic-demo-v1').then((cache) =>
      cache.addAll([
        '/',
        '/index.html',
      ]),
    ),
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (isCodespacesHost()) {
    return;
  }

  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request)),
    );
  }
});
