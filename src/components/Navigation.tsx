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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      {/* Contact bar + nav scroll as one sticky header, so the top bar can no
          longer be half-clipped behind the sticky white nav. */}
      <header className="sticky top-0 z-50">
      {/* Fixed height so late-loading webfonts can never reflow the header
          (this was the main source of layout shift on mobile). */}
      <div className="bg-brand-secondary text-brand-foreground px-4 h-9 flex items-center overflow-hidden border-b border-brand-foreground/10">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center text-left min-w-0">
            <a href="mailto:info@futurehomesinternational.com" className="inline-flex items-center gap-2 min-h-9 hover:text-brand-accent transition-colors truncate">
              <Mail size={14} />
              <span className="text-[11px] sm:text-xs truncate">info@futurehomesinternational.com</span>
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <a href="https://www.instagram.com/futurehomesinternational/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 min-w-9 min-h-9 inline-flex items-center justify-center hover:text-brand-accent transition-all hover:-translate-y-0.5"><Instagram size={14} aria-hidden="true" /></a>
            <a href="https://www.facebook.com/futurehomesturkey/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 min-w-9 min-h-9 inline-flex items-center justify-center hover:text-brand-accent transition-all hover:-translate-y-0.5"><Facebook size={14} aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/company/future-homes-1/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 min-w-9 min-h-9 inline-flex items-center justify-center hover:text-brand-accent transition-all hover:-translate-y-0.5"><Linkedin size={14} aria-hidden="true" /></a>
            <a href="https://www.tiktok.com/@futurehomesglobal" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="p-2 min-w-9 min-h-9 inline-flex items-center justify-center hover:text-brand-accent transition-all hover:-translate-y-0.5"><FaTiktok size={14} aria-hidden="true" /></a>
          </div>

        </div>
      </div>

      <nav className={cn("bg-background/95 backdrop-blur-xl border-b border-border/70 transition-shadow duration-500", isScrolled && "shadow-[0_14px_40px_-28px_hsl(var(--brand-secondary)/0.55)]", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[4.75rem]">
            <div className="flex items-center">
              <Link to="/" aria-label="Future Homes International – hem" className="flex items-center gap-2">
                <img
                  src="/future-homes-logo-new.webp"
                  alt="Future Homes International"
                  width={220}
                  height={130}
                  className="h-12 sm:h-16 w-auto transition-transform duration-500 hover:scale-[1.03]"
                />
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <SimpleLanguageSelector />
              <CurrencySelector />
              <button
                type="button"
                aria-label="Open menu"
                className="p-2 min-h-11 min-w-11 flex items-center justify-center cursor-pointer hover:bg-muted rounded-md transition-all duration-300 hover:rotate-3"
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
