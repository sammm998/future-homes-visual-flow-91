// Performance monitoring utilities
export const measurePerformance = (name: string, fn: () => void) => {
  if (import.meta.env.DEV) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`Performance [${name}]: ${end - start}ms`);
  } else {
    fn();
  }
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let inThrottle = false;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, delay);
    }
  }) as T;
};

// Preload critical images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Memory cleanup for components
export const createCleanupScheduler = () => {
  const timeouts: NodeJS.Timeout[] = [];
  const intervals: NodeJS.Timeout[] = [];
  
  const addTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay);
    timeouts.push(timeout);
    return timeout;
  };
  
  const addInterval = (callback: () => void, delay: number) => {
    const interval = setInterval(callback, delay);
    intervals.push(interval);
    return interval;
  };
  
  const cleanup = () => {
    timeouts.forEach(clearTimeout);
    intervals.forEach(clearInterval);
  };
  
  return { addTimeout, addInterval, cleanup };
};