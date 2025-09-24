// Service Worker for Future Homes Turkey - Enhanced Caching Strategy
const CACHE_NAME = 'future-homes-v1';
const STATIC_CACHE_NAME = 'future-homes-static-v1';
const DYNAMIC_CACHE_NAME = 'future-homes-dynamic-v1';

// Critical static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/placeholder.svg',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// API endpoints to cache with network-first strategy
const API_ENDPOINTS = [
  'https://kiogiyemoqbnuvclneoe.supabase.co/rest/v1/'
];

// Install event - cache critical static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle API requests with network-first strategy
  if (API_ENDPOINTS.some(endpoint => request.url.includes(endpoint))) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle image requests with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Handle font requests with cache-first strategy
  if (request.destination === 'font' || url.pathname.includes('font')) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Handle navigation requests with network-first strategy
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }
});

// Network-first strategy with cache fallback
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    
    throw error;
  }
}

// Cache-first strategy with network fallback
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        const cache = caches.open(DYNAMIC_CACHE_NAME);
        cache.then(c => c.put(request, response));
      }
    }).catch(() => {});
    
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return placeholder for failed image requests
    if (request.destination === 'image') {
      return caches.match('/placeholder.svg');
    }
    
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle any offline actions when connection is restored
  console.log('SW: Background sync triggered');
}