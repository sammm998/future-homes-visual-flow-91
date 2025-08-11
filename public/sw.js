// Service Worker for caching and performance optimization
const CACHE_NAME = 'future-homes-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Resources to cache immediately
const staticAssets = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Add critical CSS and JS files
];

// Cache strategies
const cacheStrategies = {
  images: 'cache-first',
  api: 'network-first',
  pages: 'stale-while-revalidate',
  static: 'cache-first'
};

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(staticAssets);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE &&
                     cacheName !== CACHE_NAME;
            })
            .map(cacheName => caches.delete(cacheName))
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
  } else if (request.mode === 'navigate') {
    event.respondWith(handlePageRequest(request));
  } else {
    event.respondWith(handleStaticRequest(request));
  }
});

// Cache-first strategy for images
async function handleImageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return a placeholder image if available
    return new Response('', { status: 404 });
  }
}

// Network-first strategy for API calls
async function handleApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale-while-revalidate for pages
async function handlePageRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => {
      // Return offline page if available
      return caches.match('/offline.html');
    });
  
  return cachedResponse || fetchPromise;
}

// Cache-first for static assets
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  if (event.tag === 'property-inquiry') {
    event.waitUntil(syncPropertyInquiries());
  }
});

async function syncPropertyInquiries() {
  // Handle offline property inquiries when online
  const inquiries = await getStoredInquiries();
  for (const inquiry of inquiries) {
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry)
      });
      await removeStoredInquiry(inquiry.id);
    } catch (error) {
      console.log('Failed to sync inquiry:', inquiry.id);
    }
  }
}

async function getStoredInquiries() {
  // Implementation would get inquiries from IndexedDB
  return [];
}

async function removeStoredInquiry(id) {
  // Implementation would remove inquiry from IndexedDB
}