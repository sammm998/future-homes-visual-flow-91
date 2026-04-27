import React, { useState, useEffect, useContext, createContext } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  flag: string;
  country: string;
  rate: number; // Rate from EUR
}

// Define currency codes as constants to prevent translation
const CURRENCY_CODES = {
  EUR: 'EUR',
  USD: 'USD', 
  GBP: 'GBP',
  SEK: 'SEK',
  NOK: 'NOK',
  DKK: 'DKK',
  TRY: 'TRY',
  AED: 'AED',
  IRR: 'IRR',
  RUB: 'RUB',
  CHF: 'CHF',
  CAD: 'CAD',
  AUD: 'AUD'
} as const;

export const currencies: Currency[] = [
  { code: CURRENCY_CODES.EUR, symbol: '€', flag: '🇪🇺', country: 'EUR', rate: 1 },
  { code: CURRENCY_CODES.USD, symbol: '$', flag: '🇺🇸', country: 'USD', rate: 1.05 },
  { code: CURRENCY_CODES.GBP, symbol: '£', flag: '🇬🇧', country: 'GBP', rate: 0.85 },
  { code: CURRENCY_CODES.SEK, symbol: 'kr', flag: '🇸🇪', country: 'SEK', rate: 11.19 },
  { code: CURRENCY_CODES.NOK, symbol: 'kr', flag: '🇳🇴', country: 'NOK', rate: 11.45 },
  { code: CURRENCY_CODES.DKK, symbol: 'kr', flag: '🇩🇰', country: 'DKK', rate: 7.45 },
  { code: CURRENCY_CODES.TRY, symbol: '₺', flag: '🇹🇷', country: 'TRY', rate: 47.63 },
  { code: CURRENCY_CODES.AED, symbol: 'د.إ', flag: '🇦🇪', country: 'AED', rate: 3.85 },
  { code: CURRENCY_CODES.IRR, symbol: '﷼', flag: '🇮🇷', country: 'IRR', rate: 44650 },
  { code: CURRENCY_CODES.RUB, symbol: '₽', flag: '🇷🇺', country: 'RUB', rate: 95.50 },
  { code: CURRENCY_CODES.CHF, symbol: 'Fr', flag: '🇨🇭', country: 'CHF', rate: 0.94 },
  { code: CURRENCY_CODES.CAD, symbol: 'C$', flag: '🇨🇦', country: 'CAD', rate: 1.47 },
  { code: CURRENCY_CODES.AUD, symbol: 'A$', flag: '🇦🇺', country: 'AUD', rate: 1.65 },
] as const;


interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number, fromCurrency?: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(currencies[0]); // EUR as default

  const convertPrice = (price: number, fromCurrency: string = 'EUR'): number => {
    if (fromCurrency === 'EUR') {
      return price * selectedCurrency.rate;
    }
    // If converting from another currency, first convert to EUR, then to target
    const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
    if (!fromCurrencyData) return price;
    
    const eurPrice = price / fromCurrencyData.rate;
    return eurPrice * selectedCurrency.rate;
  };

  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    
    // Format number based on currency
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: selectedCurrency.code === 'IRR' ? 0 : 0,
      maximumFractionDigits: selectedCurrency.code === 'IRR' ? 0 : 0,
    });

    const formattedNumber = formatter.format(Math.round(convertedPrice));
    
    // Different positioning for different currencies
    if (selectedCurrency.code === 'USD') {
      return `$${formattedNumber}`;
    } else if (selectedCurrency.code === 'EUR') {
      return `€${formattedNumber}`;
    } else if (selectedCurrency.code === 'NOK' || selectedCurrency.code === 'SEK') {
      return `${formattedNumber} ${selectedCurrency.symbol}`;
    } else {
      return `${selectedCurrency.symbol}${formattedNumber}`;
    }
  };


  useEffect(() => {
    // Force load currency from localStorage on every render
    const loadStoredCurrency = () => {
      const storedCurrencyCode = localStorage.getItem('currency');
      if (storedCurrencyCode) {
        const currency = currencies.find(c => c.code === storedCurrencyCode);
        if (currency && currency.code !== selectedCurrency.code) {
          console.log('Restoring currency from localStorage:', currency.code);
          setSelectedCurrencyState(currency);
        }
      }
    };

    // Load immediately
    loadStoredCurrency();

    // Listen for storage changes to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currency' && e.newValue) {
        const currency = currencies.find(c => c.code === e.newValue);
        if (currency) {
          setSelectedCurrencyState(currency);
        }
      }
    };

    // Also listen for page visibility changes (when user switches tabs)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadStoredCurrency();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // Only run once on mount

  const setSelectedCurrency = (currency: Currency) => {
    if (!currency?.code) return;
    
    const validCurrency = currencies.find(c => c.code === currency.code);
    if (!validCurrency) return;
    
    console.log('Setting currency to:', validCurrency.code);
    setSelectedCurrencyState(validCurrency);
    localStorage.setItem('currency', validCurrency.code);
    
    // Force update the DOM immediately
    setTimeout(() => {
      localStorage.setItem('currency', validCurrency.code);
    }, 0);
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      setSelectedCurrency,
      formatPrice,
      convertPrice
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};