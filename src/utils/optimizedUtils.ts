// Optimized utility functions for better performance

// Fast array deduplication
export const fastUnique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

// Optimized property filtering
export const fastFilter = <T>(
  items: T[],
  predicate: (item: T) => boolean
): T[] => {
  const result: T[] = [];
  for (let i = 0; i < items.length; i++) {
    if (predicate(items[i])) {
      result.push(items[i]);
    }
  }
  return result;
};

// Optimized search function
export const fastSearch = (
  text: string,
  searchTerm: string
): boolean => {
  if (!searchTerm) return true;
  return text.toLowerCase().includes(searchTerm.toLowerCase());
};

// Virtual scrolling helper
export const calculateVisibleItems = (
  scrollTop: number,
  itemHeight: number,
  containerHeight: number,
  totalItems: number
) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    totalItems - 1
  );
  
  return { startIndex, endIndex };
};

// Efficient price comparison
export const comparePrices = (a: string, b: string): number => {
  const numA = parseInt(a.replace(/[^\d]/g, '')) || 0;
  const numB = parseInt(b.replace(/[^\d]/g, '')) || 0;
  return numA - numB;
};

// Bundle size optimization - only load what's needed
export const lazyLoadModule = async <T>(
  moduleLoader: () => Promise<{ default: T }>
): Promise<T> => {
  const module = await moduleLoader();
  return module.default;
};