import * as React from 'react';
import { useState, useEffect, useContext, createContext } from 'react';

export interface Currency {
  code: string;
  symbol: string;
  flag: string;
  country: string;
  rate: number; // Rate from EUR
}

export const currencies: Currency[] = [
  { code: 'EUR', symbol: '€', flag: '🇪🇺', country: 'EUR', rate: 1 },
  { code: 'USD', symbol: '$', flag: '🇺🇸', country: 'USD', rate: 1.05 },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', country: 'GBP', rate: 0.85 },
  { code: 'SEK', symbol: 'kr', flag: '🇸🇪', country: 'SEK', rate: 11.19 },
  { code: 'NOK', symbol: 'kr', flag: '🇳🇴', country: 'NOK', rate: 11.45 },
  { code: 'DKK', symbol: 'kr', flag: '🇩🇰', country: 'DKK', rate: 7.45 },
  { code: 'TRY', symbol: '₺', flag: '🇹🇷', country: 'TRY', rate: 47.63 },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', country: 'AED', rate: 3.85 },
  { code: 'IRR', symbol: '﷼', flag: '🇮🇷', country: 'IRR', rate: 44650 },
  { code: 'RUB', symbol: '₽', flag: '🇷🇺', country: 'RUB', rate: 95.50 },
  { code: 'CHF', symbol: 'Fr', flag: '🇨🇭', country: 'CHF', rate: 0.94 },
  { code: 'CAD', symbol: 'C$', flag: '🇨🇦', country: 'CAD', rate: 1.47 },
  { code: 'AUD', symbol: 'A$', flag: '🇦🇺', country: 'AUD', rate: 1.65 },
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
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]); // EUR as default

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
    const handleStorageChange = () => {
      const storedCurrencyCode = localStorage.getItem('currency');
      if (storedCurrencyCode && storedCurrencyCode !== selectedCurrency.code) {
        const currency = currencies.find(c => c.code === storedCurrencyCode);
        if (currency) {
          setSelectedCurrency(currency);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedCurrency.code]);

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