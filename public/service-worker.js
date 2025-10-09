self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  // Skip waiting and activate immediately in development
  if (location.hostname.includes('github.dev') || location.hostname.includes('app.github.dev')) {
    self.skipWaiting();
    return;
  }
  
  event.waitUntil(
    caches.open('authyntic-demo-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html'
        // Removed asset caching for GitHub Codespaces compatibility
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Skip caching in GitHub Codespaces environment
  if (location.hostname.includes('github.dev') || location.hostname.includes('app.github.dev')) {
    return;
  }
  
  // Only handle same-origin requests
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
