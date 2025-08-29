import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force component refresh and validate currency data
  useEffect(() => {
    console.log('CurrencySelector mounted with currency:', selectedCurrency);
    
    // Validate current currency
    if (!selectedCurrency || !selectedCurrency.code || !selectedCurrency.flag) {
      console.warn('Invalid currency detected, forcing refresh:', selectedCurrency);
      setForceUpdate(prev => prev + 1);
    }
  }, [selectedCurrency]);

  // Ensure we always have a valid currency
  const displayCurrency = selectedCurrency && selectedCurrency.code ? selectedCurrency : currencies[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-foreground hover:bg-accent transition-colors min-w-[60px]"
      >
        <span className="font-medium text-sm">{displayCurrency.code}</span>
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
                  key={currency.code}
                  onClick={() => {
                    setSelectedCurrency(currency);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left ${
                    displayCurrency.code === currency.code
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <span className="font-medium text-sm">{currency.code}</span>
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