import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force component refresh and validate currency data + clear any DOM cache
  useEffect(() => {
    console.log('CurrencySelector mounted with currency:', selectedCurrency);
    
    // Clear any potential DOM text cache by forcing element recreation
    setForceUpdate(prev => prev + 1);
    
    // Validate current currency
    if (!selectedCurrency || !selectedCurrency.code || !selectedCurrency.flag) {
      console.warn('Invalid currency detected, forcing refresh:', selectedCurrency);
      setForceUpdate(prev => prev + 1);
    }
    
    // Force clear browser cache for this component
    if (typeof window !== 'undefined') {
      // Clear any cached DOM elements that might have old values
      const currencyElements = document.querySelectorAll('[data-currency-code]');
      currencyElements.forEach(el => el.remove());
    }
  }, [selectedCurrency]);

  // Ensure we always have a valid currency with forced validation
  const displayCurrency = selectedCurrency && selectedCurrency.code && selectedCurrency.flag ? selectedCurrency : currencies[0];
  
  // Add validation to ensure we never show corrupted data
  if (!displayCurrency || !displayCurrency.code || !displayCurrency.flag) {
    console.error('Critical: No valid display currency available');
    return null;
  }

  return (
    <div className="relative" key={`currency-selector-${forceUpdate}-${displayCurrency.code}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-foreground hover:bg-accent transition-colors min-w-[60px]"
        data-currency-code={displayCurrency.code}
      >
        <span className="text-xs font-medium" data-currency-flag>{displayCurrency.country}</span>
        <span className="font-medium text-xs" data-currency-text>{displayCurrency.code}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-36 bg-background border border-border rounded-lg shadow-lg z-50">
            <div className="p-1">
              {currencies.map((currency) => (
                <button
                  key={`${currency.code}-${forceUpdate}`}
                  onClick={() => {
                    console.log('Currency clicked:', currency);
                    setSelectedCurrency(currency);
                    setIsOpen(false);
                    setForceUpdate(prev => prev + 1);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left ${
                    displayCurrency.code === currency.code
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                  data-currency-option={currency.code}
                >
                  <span className="text-xs font-medium" data-option-flag>{currency.country}</span>
                  <span className="font-medium text-xs" data-option-code>{currency.code}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CurrencySelector;