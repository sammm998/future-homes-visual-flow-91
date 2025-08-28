import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent } from "@/components/ui/navigation-menu";
import { Menu, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { AIHelpChat } from "./AIHelpChat";
import Sidebar from "./Sidebar";
import CurrencySelector from "./CurrencySelector";

import { useCurrency } from '@/contexts/CurrencyContext';


interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAIHelpOpen, setIsAIHelpOpen] = useState(false);
  const { updateCurrencyFromLanguage } = useCurrency();
  


  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-brand-secondary text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-2 sm:mb-0 text-center sm:text-left">
            <a href="tel:+905523032750" className="flex items-center gap-2 hover:text-brand-accent transition-colors">
              <Phone size={14} />
              <span className="text-xs sm:text-sm">+90 552 303 27 50</span>
            </a>
            <a href="mailto:info@futurehomesturkey.com" className="flex items-center gap-2 hover:text-brand-accent transition-colors">
              <Mail size={14} />
              <span className="text-xs sm:text-sm">info@futurehomesturkey.com</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/futurehomesglobal/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
              <Instagram size={16} />
            </a>
            <a href="https://www.facebook.com/futurehomesturkey/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
              <Facebook size={16} />
            </a>
            <a href="https://www.linkedin.com/company/future-homes-1/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
              <Linkedin size={16} />
            </a>
            <a href="https://www.tiktok.com/@futurehomesglobal" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">
              <FaTiktok size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={cn("bg-white shadow-sm border-b sticky top-0 z-50", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <img 
                  src="/lovable-uploads/24d14ac8-45b8-44c2-8fff-159f96b0fee6.png" 
                  alt="Future Homes" 
                  className="h-6 sm:h-8 w-auto"
                />
              </Link>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-3">
              <CurrencySelector />
              <div 
                className="p-2 cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsOpen(true)}
              >
                <Menu size={24} className="text-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onAIHelpOpen={() => setIsAIHelpOpen(true)}
      />

      {/* AI Help Chat */}
      <AIHelpChat isOpen={isAIHelpOpen} onClose={() => setIsAIHelpOpen(false)} />
      
      {/* Hide ElevenLabs widget when mobile menu is open */}
      <style>{`
        ${isOpen ? `
          elevenlabs-convai {
            display: none !important;
          }
        ` : ''}
      `}</style>
    </>
  );
};

export default Navigation;