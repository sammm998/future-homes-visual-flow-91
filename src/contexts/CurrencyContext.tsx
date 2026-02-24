import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';

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

// Fallback rates (used only if API fails)
const FALLBACK_RATES: Record<string, number> = {
  EUR: 1,
  USD: 1.05,
  GBP: 0.85,
  SEK: 11.19,
  NOK: 11.45,
  DKK: 7.45,
  TRY: 47.63,
  AED: 3.85,
  IRR: 44650,
  RUB: 95.50,
  CHF: 0.94,
  CAD: 1.47,
  AUD: 1.65,
};

const CURRENCY_META: Omit<Currency, 'rate'>[] = [
  { code: CURRENCY_CODES.EUR, symbol: '€', flag: '🇪🇺', country: 'EUR' },
  { code: CURRENCY_CODES.USD, symbol: '$', flag: '🇺🇸', country: 'USD' },
  { code: CURRENCY_CODES.GBP, symbol: '£', flag: '🇬🇧', country: 'GBP' },
  { code: CURRENCY_CODES.SEK, symbol: 'kr', flag: '🇸🇪', country: 'SEK' },
  { code: CURRENCY_CODES.NOK, symbol: 'kr', flag: '🇳🇴', country: 'NOK' },
  { code: CURRENCY_CODES.DKK, symbol: 'kr', flag: '🇩🇰', country: 'DKK' },
  { code: CURRENCY_CODES.TRY, symbol: '₺', flag: '🇹🇷', country: 'TRY' },
  { code: CURRENCY_CODES.AED, symbol: 'د.إ', flag: '🇦🇪', country: 'AED' },
  { code: CURRENCY_CODES.IRR, symbol: '﷼', flag: '🇮🇷', country: 'IRR' },
  { code: CURRENCY_CODES.RUB, symbol: '₽', flag: '🇷🇺', country: 'RUB' },
  { code: CURRENCY_CODES.CHF, symbol: 'Fr', flag: '🇨🇭', country: 'CHF' },
  { code: CURRENCY_CODES.CAD, symbol: 'C$', flag: '🇨🇦', country: 'CAD' },
  { code: CURRENCY_CODES.AUD, symbol: 'A$', flag: '🇦🇺', country: 'AUD' },
];

const buildCurrencies = (rates: Record<string, number>): Currency[] =>
  CURRENCY_META.map(meta => ({
    ...meta,
    rate: rates[meta.code] ?? FALLBACK_RATES[meta.code] ?? 1,
  }));

// Initial currencies with fallback rates
export let currencies: Currency[] = buildCurrencies(FALLBACK_RATES);

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

interface CurrencyContextType {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number, fromCurrency?: string) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const fetchLiveRates = async (): Promise<Record<string, number> | null> => {
  // Check cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { rates, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return rates;
      }
    }
  } catch {}

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/EUR');
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    if (data.result === 'success' && data.rates) {
      const rates: Record<string, number> = {};
      for (const code of Object.keys(FALLBACK_RATES)) {
        rates[code] = data.rates[code] ?? FALLBACK_RATES[code];
      }
      // Cache the rates
      localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, timestamp: Date.now() }));
      console.log('Live exchange rates loaded successfully');
      return rates;
    }
  } catch (err) {
    console.warn('Failed to fetch live exchange rates, using fallback:', err);
  }
  return null;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [liveRates, setLiveRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [selectedCurrency, setSelectedCurrencyState] = useState<Currency>(
    () => buildCurrencies(FALLBACK_RATES)[0]
  );

  // Fetch live rates on mount
  useEffect(() => {
    fetchLiveRates().then(rates => {
      if (rates) {
        setLiveRates(rates);
        currencies = buildCurrencies(rates);
        // Update selected currency with new rate
        setSelectedCurrencyState(prev => {
          const updated = currencies.find(c => c.code === prev.code);
          return updated || prev;
        });
      }
    });
  }, []);

  const convertPrice = useCallback((price: number, fromCurrency: string = 'EUR'): number => {
    if (fromCurrency === 'EUR') {
      return price * selectedCurrency.rate;
    }
    const fromRate = liveRates[fromCurrency] ?? FALLBACK_RATES[fromCurrency] ?? 1;
    const eurPrice = price / fromRate;
    return eurPrice * selectedCurrency.rate;
  }, [selectedCurrency.rate, liveRates]);

  const formatPrice = useCallback((price: number): string => {
    const convertedPrice = convertPrice(price);
    
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const formattedNumber = formatter.format(Math.round(convertedPrice));
    
    if (selectedCurrency.code === 'USD') {
      return `$${formattedNumber}`;
    } else if (selectedCurrency.code === 'EUR') {
      return `€${formattedNumber}`;
    } else if (selectedCurrency.code === 'NOK' || selectedCurrency.code === 'SEK') {
      return `${formattedNumber} ${selectedCurrency.symbol}`;
    } else {
      return `${selectedCurrency.symbol}${formattedNumber}`;
    }
  }, [convertPrice, selectedCurrency.code, selectedCurrency.symbol]);

  useEffect(() => {
    const loadStoredCurrency = () => {
      const storedCurrencyCode = localStorage.getItem('currency');
      if (storedCurrencyCode) {
        const currency = currencies.find(c => c.code === storedCurrencyCode);
        if (currency && currency.code !== selectedCurrency.code) {
          setSelectedCurrencyState(currency);
        }
      }
    };

    loadStoredCurrency();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currency' && e.newValue) {
        const currency = currencies.find(c => c.code === e.newValue);
        if (currency) {
          setSelectedCurrencyState(currency);
        }
      }
    };

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
  }, []);

  const setSelectedCurrency = (currency: Currency) => {
    if (!currency?.code) return;
    
    const validCurrency = currencies.find(c => c.code === currency.code);
    if (!validCurrency) return;
    
    setSelectedCurrencyState(validCurrency);
    localStorage.setItem('currency', validCurrency.code);
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
