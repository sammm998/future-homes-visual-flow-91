import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  // Use Unicode characters to prevent translation
  const getCurrencyDisplay = (currencyCode: string): string => {
    const unicodeMap: { [key: string]: string } = {
      'EUR': '\u0045\u0055\u0052', // E-U-R
      'USD': '\u0055\u0053\u0044', // U-S-D
      'GBP': '\u0047\u0042\u0050', // G-B-P
      'SEK': '\u0053\u0045\u004B', // S-E-K
      'NOK': '\u004E\u004F\u004B', // N-O-K
      'DKK': '\u0044\u004B\u004B', // D-K-K
      'TRY': '\u0054\u0052\u0059', // T-R-Y
      'AED': '\u0041\u0045\u0044', // A-E-D
      'IRR': '\u0049\u0052\u0052', // I-R-R
      'RUB': '\u0052\u0055\u0042', // R-U-B
      'CHF': '\u0043\u0048\u0046', // C-H-F
      'CAD': '\u0043\u0041\u0044', // C-A-D
      'AUD': '\u0041\u0055\u0044'  // A-U-D
    };
    return unicodeMap[currencyCode] || currencyCode;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-foreground hover:bg-accent transition-colors min-w-[60px]"
      >
        <span 
          className="font-bold text-xs notranslate" 
          style={{ 
            fontFamily: 'monospace',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
          dangerouslySetInnerHTML={{
            __html: getCurrencyDisplay(selectedCurrency.code)
          }}
        />
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
                  <span 
                    className="font-bold text-xs notranslate" 
                    style={{ 
                      fontFamily: 'monospace',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: getCurrencyDisplay(currency.code)
                    }}
                  />
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