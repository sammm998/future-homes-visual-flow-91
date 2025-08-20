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
    console.log('Processing status:', status, 'Type:', typeof status);
    
    if (!status) return { color: 'bg-gray-500', text: 'Available' };
    
    const normalizedStatus = status.toLowerCase().trim();
    console.log('Normalized status:', normalizedStatus);
    
    // Handle specific status cases
    if (normalizedStatus.includes('available')) {
      return { color: 'bg-green-500', text: 'Available' };
    }
    if (normalizedStatus.includes('sold')) {
      return { color: 'bg-red-500', text: 'Sold' };
    }
    if (normalizedStatus.includes('under construction')) {
      return { color: 'bg-blue-500', text: 'Under Construction' };
    }
    if (normalizedStatus.includes('reserved')) {
      return { color: 'bg-orange-500', text: 'Reserved' };
    }
    if (normalizedStatus.includes('ready to move')) {
      return { color: 'bg-emerald-500', text: 'Ready To Move' };
    }
    if (normalizedStatus.includes('for residence permit')) {
      return { color: 'bg-purple-500', text: 'For Residence Permit' };
    }
    
    // Default case - capitalize first letter
    const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    console.log('Using default status:', capitalizedStatus);
    return { color: 'bg-gray-500', text: capitalizedStatus };
  }, [status]);
};