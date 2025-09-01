import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  // Hard-coded currency display to prevent ANY translation
  const getCurrencyDisplay = (currencyCode: string): string => {
    // Use exact string matching to prevent translation
    switch(currencyCode.toUpperCase()) {
      case 'EUR': return 'EUR';
      case 'USD': return 'USD';
      case 'GBP': return 'GBP';
      case 'SEK': return 'SEK';
      case 'NOK': return 'NOK';
      case 'DKK': return 'DKK';
      case 'TRY': return 'TRY';
      case 'AED': return 'AED';
      case 'IRR': return 'IRR';
      case 'RUB': return 'RUB';
      case 'CHF': return 'CHF';
      case 'CAD': return 'CAD';
      case 'AUD': return 'AUD';
      default: return currencyCode.substring(0, 3).toUpperCase();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-foreground hover:bg-accent transition-colors min-w-[60px]"
      >
        <code
          className="currency-fixed notranslate"
          lang="en"
          translate="no"
          data-translate="no"
          data-testid="currency-code"
          suppressHydrationWarning
          style={{
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'inline-block',
            width: '3ch',
            maxWidth: '3ch',
            overflow: 'hidden',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          {getCurrencyDisplay(selectedCurrency.code)}
        </code>
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
          <div className="absolute top-full left-0 mt-1 w-20 bg-background border border-border rounded-lg shadow-lg z-50">
            <div className="p-1">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setSelectedCurrency(currency);
                    setIsOpen(false);
                  }}
                  className={`w-full px-2 py-1.5 rounded text-sm transition-colors text-left ${
                    selectedCurrency.code === currency.code
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <code
                    className="currency-fixed notranslate"
                    lang="en"
                    translate="no"
                    data-translate="no"
                    data-testid="currency-code"
                    suppressHydrationWarning
                    style={{
                      fontFamily: 'monospace',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'inline-block',
                      width: '3ch',
                      maxWidth: '3ch',
                      overflow: 'hidden',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                  >
                    {getCurrencyDisplay(currency.code)}
                  </code>
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