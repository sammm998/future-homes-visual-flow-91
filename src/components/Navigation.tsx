import { useState, useEffect } from "react";
import { Link } from "@/lib/router-compat";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Menu, Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { cn } from "@/lib/utils";

import Sidebar from "./Sidebar";
import CurrencySelector from "./CurrencySelector";
import SimpleLanguageSelector from "./SimpleLanguageSelector";

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Contact bar + nav scroll as one sticky header, so the top bar can no
          longer be half-clipped behind the sticky white nav. */}
      <header className="sticky top-0 z-50">
      {/* Fixed height so late-loading webfonts can never reflow the header
          (this was the main source of layout shift on mobile). */}
      <div className="bg-brand-secondary text-white px-4 h-14 sm:h-10 flex items-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-2 sm:mb-0 text-center sm:text-left">
            <a href="mailto:info@futurehomesinternational.com" className="inline-flex items-center gap-2 min-h-11 py-2 hover:text-brand-accent transition-colors">
              <Mail size={14} />
              <span className="text-xs sm:text-sm">info@futurehomesinternational.com</span>
            </a>
          </div>
          <div className="flex items-center gap-1">
            <a href="https://www.instagram.com/futurehomesinternational/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><Instagram size={16} aria-hidden="true" /></a>
            <a href="https://www.facebook.com/futurehomesturkey/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><Facebook size={16} aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/company/future-homes-1/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><Linkedin size={16} aria-hidden="true" /></a>
            <a href="https://www.tiktok.com/@futurehomesglobal" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><FaTiktok size={16} aria-hidden="true" /></a>
          </div>

        </div>
      </div>

      <nav className={cn("bg-white shadow-xs border-b", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" aria-label="Future Homes International – hem" className="flex items-center gap-2">
                <img
                  src="/future-homes-logo-new.webp"
                  alt="Future Homes International"
                  width={220}
                  height={130}
                  className="h-10 sm:h-14 w-auto"
                />
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <SimpleLanguageSelector />
              <CurrencySelector />
              <button
                type="button"
                aria-label="Open menu"
                className="p-2 min-h-11 min-w-11 flex items-center justify-center cursor-pointer hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsOpen(true)}
              >
                <Menu size={24} className="text-foreground" aria-hidden="true" />
              </button>

            </div>
          </div>
        </div>
      </nav>
      </header>

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

    </>
  );
};
export default Navigation;
