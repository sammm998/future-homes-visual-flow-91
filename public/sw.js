// Service Worker for performance optimization
const CACHE_NAME = 'property-site-v1';
const STATIC_CACHE_NAME = 'property-static-v1';

// Cache essential resources
const STATIC_RESOURCES = [
  '/',
  '/property-wizard',
  '/antalya',
  '/dubai',
  '/manifest.json',
  '/placeholder.svg'
];

// Cache API responses
const API_CACHE_NAME = 'property-api-v1';
const API_URLS = [
  'https://kiogiyemoqbnuvclneoe.supabase.co'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_RESOURCES);
      }),
      caches.open(API_CACHE_NAME)
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Handle API requests
  if (request.url.includes('supabase.co')) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Serve from cache, update in background
            fetch(request).then((response) => {
              if (response.ok) {
                cache.put(request, response.clone());
              }
            });
            return cachedResponse;
          }
          
          // Not in cache, fetch from network
          return fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }
  
  // Handle static resources
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request).then((response) => {
          // Don't cache non-successful responses
          if (!response.ok) {
            return response;
          }
          
          // Cache the response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          
          return response;
        });
      })
    );
  }
});