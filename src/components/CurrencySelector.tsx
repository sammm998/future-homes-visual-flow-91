import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

interface CurrencySelectorProps {
  dark?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ dark = false }) => {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select currency"
        className={`flex min-h-11 min-w-[80px] items-center gap-2 rounded-sm border px-3 text-sm font-medium transition-colors ${dark ? 'border-navy-foreground/20 bg-navy text-navy-foreground hover:border-gold hover:text-gold' : 'border-border/50 text-foreground hover:bg-accent'}`}
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
          <div className={`absolute z-50 w-32 rounded-lg border border-border bg-background text-foreground shadow-lg backdrop-blur-sm ${dark ? 'bottom-0 left-full ml-2' : 'left-0 top-full mt-2'}`}>
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
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
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