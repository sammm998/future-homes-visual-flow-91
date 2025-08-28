// Cache management utilities
export const clearAllCaches = async (): Promise<void> => {
  try {
    // Clear all caches
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    
    // Unregister service worker to force refresh
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
    }
    
    // Clear browser storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Force reload to re-register service worker
    window.location.reload();
  } catch (error) {
    console.error('Error clearing caches:', error);
    throw error;
  }
};

export const clearServiceWorkerCaches = async (): Promise<void> => {
  try {
    const cacheNames = await caches.keys();
    const propertyAppCaches = cacheNames.filter(name => 
      name.includes('property-site') || 
      name.includes('property-static') || 
      name.includes('property-api')
    );
    
    await Promise.all(
      propertyAppCaches.map(cacheName => caches.delete(cacheName))
    );
  } catch (error) {
    console.error('Error clearing service worker caches:', error);
    throw error;
  }
};

export const clearBrowserStorage = (): void => {
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear IndexedDB for React Query cache
  if ('indexedDB' in window) {
    indexedDB.deleteDatabase('lovable-cache');
  }
};