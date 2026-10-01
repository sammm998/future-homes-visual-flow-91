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
import { Menu, Mail, Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/utils/conversionCopy";

import Sidebar from "./Sidebar";
import CurrencySelector from "./CurrencySelector";
import SimpleLanguageSelector from "./SimpleLanguageSelector";

interface NavigationProps {
  className?: string;
  gallery?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ className, gallery = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (gallery) {
    return (
      <>
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-24 flex-col items-center border-r border-navy-foreground/10 bg-navy text-navy-foreground lg:flex">
          <Link to="/" aria-label="Future Homes International – hem" className="flex h-28 w-full items-center justify-center border-b border-navy-foreground/10">
            <img src="/favicon-512x512.png" alt="Future Homes International" width={52} height={52} className="h-12 w-12 object-contain" />
          </Link>
          <div className="flex flex-1 flex-col items-center justify-center gap-12">
            <button type="button" aria-label="Open menu" onClick={() => setIsOpen(true)} className="group flex h-12 w-12 items-center justify-center border border-navy-foreground/20 transition-colors hover:border-gold hover:text-gold">
              <Menu size={21} aria-hidden="true" />
            </button>
            <span className="font-serif text-[10px] font-semibold uppercase text-navy-foreground/60 [letter-spacing:.22em] [writing-mode:vertical-rl]">Future Homes International</span>
          </div>
          <div className="flex w-full flex-col items-center gap-3 border-t border-navy-foreground/10 py-5">
            <SimpleLanguageSelector />
            <CurrencySelector />
          </div>
        </aside>

        <header className="absolute inset-x-0 top-0 z-40 lg:left-24">
          <nav className={cn("mx-auto flex h-20 max-w-[1840px] items-center justify-between px-4 sm:px-8 lg:h-24 lg:px-12", className)}>
            <Link to="/" aria-label="Future Homes International – hem" className="inline-flex items-center">
              <img src="/favicon-512x512.png" alt="Future Homes International" width={52} height={52} className="h-12 w-12 object-contain sm:h-14 sm:w-14" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-sm border border-navy-foreground/20 bg-navy/25 p-1 backdrop-blur-md sm:flex lg:hidden">
                <SimpleLanguageSelector />
                <CurrencySelector />
              </div>
              <Button asChild variant="outline" className="hidden h-11 border-navy-foreground/30 bg-navy/20 text-navy-foreground backdrop-blur-md hover:bg-navy-foreground hover:text-navy sm:inline-flex">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /> WhatsApp</a>
              </Button>
              <Button type="button" size="icon" variant="outline" aria-label="Open menu" onClick={() => setIsOpen(true)} className="h-11 w-11 border-navy-foreground/30 bg-navy/20 text-navy-foreground backdrop-blur-md hover:bg-navy-foreground hover:text-navy lg:hidden">
                <Menu size={21} aria-hidden="true" />
              </Button>
            </div>
          </nav>
        </header>
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  }

  return (
    <>
      {/* Contact bar + nav scroll as one sticky header, so the top bar can no
          longer be half-clipped behind the sticky white nav. */}
      <header className="sticky top-0 z-50">
      {/* Fixed height so late-loading webfonts can never reflow the header
          (this was the main source of layout shift on mobile). */}
      <div className="flex h-10 items-center overflow-hidden bg-brand-secondary px-4 text-primary-foreground">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center text-xs sm:justify-between sm:text-sm">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <a href="mailto:info@futurehomesinternational.com" className="inline-flex items-center gap-2 min-h-10 hover:text-brand-accent transition-colors">
              <Mail size={14} className="shrink-0" />
              <span className="truncate text-xs sm:text-sm">info@futurehomesinternational.com</span>
            </a>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <a href="https://www.instagram.com/futurehomesinternational/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><Instagram size={16} aria-hidden="true" /></a>
            <a href="https://www.facebook.com/futurehomesturkey/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><Facebook size={16} aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/company/future-homes-1/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><Linkedin size={16} aria-hidden="true" /></a>
            <a href="https://www.tiktok.com/@futurehomesglobal" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="p-2 min-w-11 min-h-11 inline-flex items-center justify-center hover:text-brand-accent transition-colors"><FaTiktok size={16} aria-hidden="true" /></a>
          </div>

        </div>
      </div>

      <nav className={cn("bg-white shadow-xs border-b", className)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <div className="flex min-w-0 items-center">
              <Link to="/" aria-label="Future Homes International – hem" className="flex items-center gap-2">
                <img
                  src="/future-homes-logo-new.webp"
                  alt="Future Homes International"
                  width={220}
                  height={130}
                  className="h-9 w-auto sm:h-14"
                />
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
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
