const CACHE_NAME = 'future-homes-v1';
const STATIC_ASSETS = [
  '/',
  '/fonts/inter.woff2',
  '/lovable-uploads/956541d2-b461-4acd-a29a-463c5a97983e.png',
  '/lovable-uploads/0d7b0c8a-f652-488b-bfca-3a11c1694220.png',
  '/lovable-uploads/6cefa26f-ebbb-490a-ac8c-3e27243dae92.png',
];

// Cache strategy: Cache first, then network
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Cache images and static assets
          if (event.request.destination === 'image' || 
              event.request.url.includes('/assets/') ||
              event.request.url.includes('.woff2')) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          
          return response;
        });
      })
  );
});
