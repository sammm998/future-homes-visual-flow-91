import React, { useState, useEffect, useContext, createContext } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  flag: string;
  country: string;
  rate: number; // Rate from EUR
}

export const currencies: Currency[] = [
  { code: 'EUR', symbol: '€', flag: '🇪🇺', country: 'EUR', rate: 1 },
  { code: 'USD', symbol: '$', flag: '🇺🇸', country: 'USA', rate: 1.05 },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', country: 'GBR', rate: 0.85 },
  { code: 'SEK', symbol: 'kr', flag: '🇸🇪', country: 'SWE', rate: 11.19 },
  { code: 'NOK', symbol: 'kr', flag: '🇳🇴', country: 'NOR', rate: 11.45 },
  { code: 'DKK', symbol: 'kr', flag: '🇩🇰', country: 'DNK', rate: 7.45 },
  { code: 'TRY', symbol: '₺', flag: '🇹🇷', country: 'TUR', rate: 47.63 },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', country: 'ARE', rate: 3.85 },
  { code: 'IRR', symbol: '﷼', flag: '🇮🇷', country: 'IRN', rate: 44650 },
  { code: 'RUB', symbol: '₽', flag: '🇷🇺', country: 'RUS', rate: 95.50 },
  { code: 'CHF', symbol: 'Fr', flag: '🇨🇭', country: 'CHE', rate: 0.94 },
  { code: 'CAD', symbol: 'C$', flag: '🇨🇦', country: 'CAN', rate: 1.47 },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', country: 'AUS', rate: 1.65 },
];

// Language to currency mapping
const languageToCurrency: { [key: string]: string } = {
  'en': 'EUR',
  'sv': 'SEK',
  'no': 'NOK',
  'da': 'DKK',
  'tr': 'TRY',
  'ur': 'AED',
  'fa': 'IRR',
  'ar': 'AED',
  'ru': 'RUB',
};

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number, fromCurrency?: string) => number;
  updateCurrencyFromLanguage: (languageCode: string) => void;
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

  const updateCurrencyFromLanguage = (languageCode: string, autoChange: boolean = true) => {
    if (!autoChange) return;
    
    const currencyCode = languageToCurrency[languageCode];
    if (currencyCode) {
      const currency = currencies.find(c => c.code === currencyCode);
      if (currency && currency.code !== selectedCurrency.code) {
        console.log(`Language changed to ${languageCode}, updating currency to ${currencyCode}`);
        setSelectedCurrency(currency);
        localStorage.setItem('currency', currencyCode);
      }
    }
  };

  useEffect(() => {
    // Comprehensive localStorage cleanup - clear all potential currency-related data
    const keysToRemove = ['currency', 'selectedCurrency', 'currencyData', 'currency_cache'];
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Force clear any session storage as well
    sessionStorage.removeItem('currency');
    
    // Always start with EUR as default and force immediate update
    const defaultCurrency = currencies[0]; // EUR
    setSelectedCurrency(defaultCurrency);
    
    // Add logging to debug any issues
    console.log('Currency Context initialized with:', defaultCurrency);
    console.log('Available currencies:', currencies.map(c => c.code));

    const handleStorageChange = () => {
      const storedCurrencyCode = localStorage.getItem('currency');
      if (storedCurrencyCode) {
        const currency = currencies.find(c => c.code === storedCurrencyCode);
        if (currency && currency.code && currency.flag && currency.symbol) {
          console.log('Valid currency found in storage:', currency);
          setSelectedCurrency(currency);
        } else {
          console.warn('Invalid currency in storage, using default:', storedCurrencyCode);
          localStorage.removeItem('currency');
          setSelectedCurrency(currencies[0]);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setSelectedCurrency = (currency: Currency) => {
    // Validate currency object before setting
    if (!currency || !currency.code || !currency.flag || !currency.symbol) {
      console.error('Invalid currency object:', currency);
      return;
    }
    
    // Verify currency exists in our currencies array
    const validCurrency = currencies.find(c => c.code === currency.code);
    if (!validCurrency) {
      console.error('Currency not found in valid currencies:', currency.code);
      return;
    }
    
    console.log('Setting currency to:', validCurrency);
    setSelectedCurrencyState(validCurrency);
    localStorage.setItem('currency', validCurrency.code);
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      setSelectedCurrency,
      formatPrice,
      convertPrice,
      updateCurrencyFromLanguage
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