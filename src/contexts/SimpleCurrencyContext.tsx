import React, { createContext, useContext, ReactNode } from 'react';

// Simplified Currency Context without useState to avoid multiple React instance issues
interface Currency {
  code: string;
  symbol: string;
  flag: string;
  country: string;
  rate: number;
}

const currencies: Currency[] = [
  { code: 'EUR', symbol: '€', flag: '🇪🇺', country: 'Europe', rate: 1 },
  { code: 'USD', symbol: '$', flag: '🇺🇸', country: 'United States', rate: 1.1 },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', country: 'United Kingdom', rate: 0.85 },
  { code: 'TRY', symbol: '₺', flag: '🇹🇷', country: 'Turkey', rate: 32 },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', country: 'UAE', rate: 4 },
];

interface SimpleCurrencyContextType {
  selectedCurrency: Currency;
  formatPrice: (price: number) => string;
  convertPrice: (price: number, fromCurrency?: string) => number;
}

const SimpleCurrencyContext = createContext<SimpleCurrencyContextType | undefined>(undefined);

interface SimpleCurrencyProviderProps {
  children: ReactNode;
}

export const SimpleCurrencyProvider: React.FC<SimpleCurrencyProviderProps> = ({ children }) => {
  // Use EUR as default for now to avoid useState
  const selectedCurrency = currencies[0]; // EUR

  const convertPrice = (price: number, fromCurrency: string = 'EUR'): number => {
    if (!price || isNaN(price)) return 0;
    
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = selectedCurrency.rate;
    
    const euroPrice = price / fromRate;
    return euroPrice * toRate;
  };

  const formatPrice = (price: number): string => {
    if (!price || isNaN(price)) return `${selectedCurrency.symbol}0`;
    
    const convertedPrice = convertPrice(price);
    
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: selectedCurrency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(convertedPrice);
  };

  const value = {
    selectedCurrency,
    formatPrice,
    convertPrice,
  };

  return (
    <SimpleCurrencyContext.Provider value={value}>
      {children}
    </SimpleCurrencyContext.Provider>
  );
};

export const useSimpleCurrency = (): SimpleCurrencyContextType => {
  const context = useContext(SimpleCurrencyContext);
  if (context === undefined) {
    throw new Error('useSimpleCurrency must be used within a SimpleCurrencyProvider');
  }
  return context;
};