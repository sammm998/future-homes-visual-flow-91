import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors min-w-[80px] border border-border/50"
      >
        <span 
          className="currency-display-wrapper notranslate font-mono text-xs font-bold tracking-wider" 
          lang="en"
          translate="no"
          data-translate="no"
          suppressHydrationWarning
        >
          <span 
            className="currency-display-content"
            data-currency={selectedCurrency.code}
          />
        </span>
        <ChevronDown className="w-3 h-3 ml-auto opacity-60" />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-32 bg-background border border-border rounded-lg shadow-lg z-50 backdrop-blur-sm">
            <div className="p-1 max-h-60 overflow-y-auto scrollbar-hide">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setSelectedCurrency(currency);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 rounded-md text-sm transition-colors text-left flex items-center gap-3 ${
                    selectedCurrency.code === currency.code
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <span 
                    className="currency-display-wrapper notranslate font-mono text-xs font-bold tracking-wider" 
                    lang="en"
                    translate="no"
                    data-translate="no"
                    suppressHydrationWarning
                  >
                    <span 
                      className="currency-display-content"
                      data-currency={currency.code}
                    />
                  </span>
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