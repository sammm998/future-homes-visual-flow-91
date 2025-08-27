// Advanced Service Worker for Aggressive Caching
const CACHE_NAME = 'future-homes-v1';
const STATIC_CACHE_NAME = 'future-homes-static-v1';
const DYNAMIC_CACHE_NAME = 'future-homes-dynamic-v1';

// Cache strategy configuration
const CACHE_STRATEGIES = {
  // Static assets - Cache First with long expiration
  static: {
    pattern: /\.(js|css|png|jpg|jpeg|webp|svg|woff2|woff)$/,
    strategy: 'CacheFirst',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  },
  // API calls - Network First with short cache
  api: {
    pattern: /\/api\//,
    strategy: 'NetworkFirst',
    maxAge: 5 * 60 * 1000, // 5 minutes
  },
  // Images - Stale While Revalidate
  images: {
    pattern: /lovable-uploads|cdn\.futurehomesturkey\.com/,
    strategy: 'StaleWhileRevalidate',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  // HTML pages - Network First
  pages: {
    pattern: /\.html$|\/$/,
    strategy: 'NetworkFirst',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
};

// Install event - Cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/fonts/inter.woff2',
          '/assets/ai-avatar-D7A-cWee.jpg',
          '/hero-bg.webp',
          '/antalya-hero.webp',
          '/placeholder.svg'
        ]);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== DYNAMIC_CACHE_NAME;
            })
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - Implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Determine cache strategy based on request URL
  let strategy = 'NetworkFirst';
  let maxAge = 24 * 60 * 60 * 1000;
  let cacheName = DYNAMIC_CACHE_NAME;

  for (const [key, config] of Object.entries(CACHE_STRATEGIES)) {
    if (config.pattern.test(request.url)) {
      strategy = config.strategy;
      maxAge = config.maxAge;
      if (key === 'static') cacheName = STATIC_CACHE_NAME;
      break;
    }
  }

  event.respondWith(handleRequest(request, strategy, cacheName, maxAge));
});

// Cache strategy implementations
async function handleRequest(request, strategy, cacheName, maxAge) {
  const cache = await caches.open(cacheName);

  switch (strategy) {
    case 'CacheFirst':
      return cacheFirst(request, cache, maxAge);
    case 'NetworkFirst':
      return networkFirst(request, cache, maxAge);
    case 'StaleWhileRevalidate':
      return staleWhileRevalidate(request, cache, maxAge);
    default:
      return networkFirst(request, cache, maxAge);
  }
}

async function cacheFirst(request, cache, maxAge) {
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && isResponseFresh(cachedResponse, maxAge)) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Add timestamp for cache freshness check
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('sw-cached-at', Date.now().toString());
      cache.put(request, responseToCache);
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Network error', { status: 503 });
  }
}

async function networkFirst(request, cache, maxAge) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('sw-cached-at', Date.now().toString());
      cache.put(request, responseToCache);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Network error', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cache, maxAge) {
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('sw-cached-at', Date.now().toString());
      cache.put(request, responseToCache);
    }
    return networkResponse;
  }).catch(() => null);

  return cachedResponse || await fetchPromise;
}

function isResponseFresh(response, maxAge) {
  const cachedAt = response.headers.get('sw-cached-at');
  if (!cachedAt) return false;
  
  const age = Date.now() - parseInt(cachedAt);
  return age < maxAge;
}

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any pending offline actions
      console.log('Background sync triggered')
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/lovable-uploads/9b08d909-a9da-4946-942a-c24106cd57f7.png',
      badge: '/lovable-uploads/9b08d909-a9da-4946-942a-c24106cd57f7.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '1'
      }
    };

    event.waitUntil(
      self.registration.showNotification('Future Homes', options)
    );
  }
});