import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrency, currencies } from '@/contexts/CurrencyContext';

const CurrencySelector: React.FC = () => {
  const { selectedCurrency, setSelectedCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  // Anti-translation currency codes using encoded strings
  const getCurrencyDisplay = (currencyCode: string): string => {
    // Use base64 encoded strings to prevent translation
    const encodedCodes: { [key: string]: string } = {
      'EUR': atob('RVVS'), // EUR
      'USD': atob('VVNE'), // USD
      'GBP': atob('R0JQ'), // GBP
      'SEK': atob('U0VL'), // SEK
      'NOK': atob('Tk9L'), // NOK
      'DKK': atob('REtL'), // DKK
      'TRY': atob('VFJZ'), // TRY
      'AED': atob('QUVE'), // AED
      'IRR': atob('SVJS'), // IRR
      'RUB': atob('UlVC'), // RUB
      'CHF': atob('Q0hG'), // CHF
      'CAD': atob('Q0FE'), // CAD
      'AUD': atob('QVVE')  // AUD
    };
    return encodedCodes[currencyCode] || currencyCode.substring(0, 3).toUpperCase();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded text-sm font-medium text-foreground hover:bg-accent transition-colors min-w-[60px]"
      >
        <span 
          className="currency-code notranslate" 
          lang="en"
          translate="no"
          data-translate="no"
          data-testid="currency-display"
          suppressHydrationWarning
          style={{ 
            fontFamily: 'monospace',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '12px',
            fontWeight: '600',
            userSelect: 'none',
            pointerEvents: 'none',
            direction: 'ltr',
            unicodeBidi: 'bidi-override'
          }}
        >
          {getCurrencyDisplay(selectedCurrency.code)}
        </span>
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
                    className="currency-code notranslate" 
                    lang="en"
                    translate="no"
                    data-translate="no"
                    data-testid="currency-display"
                    suppressHydrationWarning
                    style={{ 
                      fontFamily: 'monospace',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '12px',
                      fontWeight: '600',
                      userSelect: 'none',
                      pointerEvents: 'none',
                      direction: 'ltr',
                      unicodeBidi: 'bidi-override'
                    }}
                  >
                    {getCurrencyDisplay(currency.code)}
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