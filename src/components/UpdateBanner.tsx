import React, { useState } from 'react';
import { X } from 'lucide-react';

const UpdateBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-[#1e3a5f] text-white py-2 px-4 relative">
      <div className="max-w-7xl mx-auto flex justify-center items-center text-sm">
        <span>
          Talk to our AI assistant Emma{' '}
          <a 
            href="https://futurehomesai.one/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline hover:text-brand-accent transition-colors font-medium"
          >
            here
          </a>
        </span>
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute right-4 hover:text-brand-accent transition-colors"
          aria-label="Close banner"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default UpdateBanner;