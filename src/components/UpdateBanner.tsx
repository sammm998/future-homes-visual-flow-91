import React, { useState } from 'react';
import { X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UpdateBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-primary-foreground py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary-foreground rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Website Update Notice</span>
          </div>
          <p className="text-sm opacity-90 hidden sm:block">
            Our website is currently being updated. For the latest apartment information, please contact us directly until further notice.
          </p>
          <p className="text-sm opacity-90 block sm:hidden">
            Website updating - Contact us for latest apartment info.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <a 
            href="tel:+905523032750" 
            className="flex items-center gap-1 text-sm hover:text-primary-foreground/80 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call Us</span>
          </a>
          <a 
            href="mailto:info@futurehomesturkey.com" 
            className="flex items-center gap-1 text-sm hover:text-primary-foreground/80 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Email</span>
          </a>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBanner;