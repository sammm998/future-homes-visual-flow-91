import { useMemo } from 'react';

// Memoization utility for expensive calculations
export const useMemoizedCalculation = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(factory, deps);
};

// Memoized property price formatting
export const useMemoizedPrice = (price: string, formatPrice: (value: number) => string) => {
  return useMemo(() => {
    const numericValue = parseInt(price.replace(/[€$£,₺₽₨﷼kr]/g, '')) || 0;
    if (numericValue === 0) return price;
    return formatPrice(numericValue);
  }, [price, formatPrice]);
};

// Memoized status calculation
export const useMemoizedStatus = (status: string) => {
  return useMemo(() => {
    const statuses = status.split(',').map(s => s.trim());
    
    if (statuses.some(s => s.includes('Under Construction'))) {
      return { color: 'bg-blue-500', text: 'Under Construction' };
    }
    if (statuses.some(s => s.includes('Ready to Move'))) {
      return { color: 'bg-green-500', text: 'Ready To Move' };
    }
    if (statuses.some(s => s.includes('For Residence Permit'))) {
      return { color: 'bg-purple-500', text: 'For Residence Permit' };
    }
    
    return { color: 'bg-gray-500', text: statuses[0] || status };
  }, [status]);
};