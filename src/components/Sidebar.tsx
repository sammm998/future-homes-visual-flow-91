import React from 'react';
import { Link, useLocation } from '@/lib/router-compat';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Mail, MapPin, MessageCircle, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { whatsappLink } from '@/utils/conversionCopy';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {

  const { t, lang } = useTranslation();
  const location = useLocation();
  const withLang = (href: string) => {
    const params = new URLSearchParams(location.search);
    if (lang && lang !== 'en') params.set('lang', lang);
    else params.delete('lang');
    const search = params.toString();
    return search ? `${href}?${search}` : href;
  };

  const propertyLocations = [
    { name: t('sidebar.antalya'), href: withLang("/antalya") },
    { name: t('sidebar.istanbul'), href: withLang("/istanbul") },
    { name: t('sidebar.mersin'), href: withLang("/mersin") },
    { name: t('sidebar.cyprus'), href: withLang("/cyprus") },
    { name: t('sidebar.dubai'), href: withLang("/dubai") },
    { name: t('sidebar.bali'), href: withLang("/bali") }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
        <motion.button
          type="button"
          aria-label="Close menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 cursor-default bg-navy/65 backdrop-blur-sm"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-0 top-0 z-[100] h-full w-full max-w-[30rem] overflow-x-hidden overflow-y-auto border-l border-navy-foreground/10 bg-navy text-navy-foreground shadow-[var(--shadow-luxe)]"
        >
          <div className="flex min-h-full flex-col px-7 py-8 sm:px-12 sm:py-12">
            <div className="mb-12 flex items-start justify-between border-b border-navy-foreground/10 pb-8 sm:mb-16">
              <Link to={withLang('/')} onClick={onClose} className="inline-flex items-center">
                <img src="/favicon-512x512.png" alt="Future Homes International" width={52} height={52} className="h-12 w-12 object-contain" />
                <span className="ml-4 max-w-40 font-serif text-sm font-semibold uppercase leading-5 [letter-spacing:.12em]">Future Homes International</span>
              </Link>
              <Button onClick={onClose} aria-label="Close menu" variant="ghost" size="icon" className="h-12 w-12 text-navy-foreground transition-transform duration-300 hover:rotate-90 hover:bg-navy-foreground/10 hover:text-gold">
                <X size={24} />
              </Button>
            </div>
            
            <div className="flex-1 space-y-12">
              <div>
                <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase text-gold [letter-spacing:.22em]"><span className="h-px w-8 bg-gold" />{t('sidebar.properties')}</p>
                <div className="space-y-2">
                  {propertyLocations.map((propertyLocation, index) => (
                    <Link
                      key={propertyLocation.href}
                      to={propertyLocation.href}
                      className={`group flex min-h-12 min-w-0 items-center gap-4 border-b border-navy-foreground/10 py-2 font-serif text-xl text-navy-foreground transition-all duration-300 hover:translate-x-2 hover:text-gold sm:gap-5 sm:text-2xl ${location.pathname.includes(propertyLocation.href.split('?')[0]) ? 'text-gold' : ''}`}
                      onClick={onClose}
                    >
                      <span className="text-[9px] font-sans font-bold text-gold">{String(index + 1).padStart(2, '0')}</span>
                      <span className="min-w-0 flex-1 leading-tight">{propertyLocation.name}</span><ArrowRight className="h-4 w-4 shrink-0 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-5">
              <p className="mb-6 text-[10px] font-semibold uppercase text-gold [letter-spacing:.22em]">Explore</p>
              <Link to={withLang("/property-wizard")} onClick={onClose} className="flex min-h-11 items-center text-sm text-navy-foreground/70 transition-colors hover:text-gold">
                {t('sidebar.easy_find')}
              </Link>
              <Link to={withLang("/map-search")} onClick={onClose} className="flex min-h-11 items-center text-sm text-navy-foreground/70 transition-colors hover:text-gold">
                {t('sidebar.map_search')}
              </Link>
              <Link to={withLang("/about-us")} onClick={onClose} className="flex min-h-11 items-center text-sm text-navy-foreground/70 transition-colors hover:text-gold">
                {t('sidebar.about')}
              </Link>
              <Link to={withLang("/testimonials")} onClick={onClose} className="flex min-h-11 items-center text-sm text-navy-foreground/70 transition-colors hover:text-gold">
                {t('sidebar.testimonials')}
              </Link>
              <Link to={withLang("/information")} onClick={onClose} className="flex min-h-11 items-center text-sm text-navy-foreground/70 transition-colors hover:text-gold">
                {t('sidebar.information')}
              </Link>
              <Link to={withLang("/courses")} onClick={onClose} className="flex min-h-11 items-center text-sm text-navy-foreground/70 transition-colors hover:text-gold">
                {t('sidebar.courses')}
              </Link>
              <Link to={withLang("/our-story")} onClick={onClose} className="flex min-h-11 items-center text-sm text-navy-foreground/70 transition-colors hover:text-gold">
                {t('sidebar.our_story')}
              </Link>
              <Link to={withLang("/design-your-home")} onClick={onClose} className="flex min-h-11 items-center text-sm text-navy-foreground/70 transition-colors hover:text-gold">
                {t('sidebar.design_home')}
              </Link>
              <Link to={withLang("/contact-us")} onClick={onClose} className="flex min-h-11 items-center text-sm text-navy-foreground/70 transition-colors hover:text-gold">
                {t('sidebar.contact')}
              </Link>
              </div>
            </div>

             <div className="mt-12 grid gap-3 border-t border-navy-foreground/10 pt-7 sm:grid-cols-2">
              <Button asChild className="h-12 bg-gold text-gold-foreground hover:bg-gold/90"><a href={whatsappLink()} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden="true" /> WhatsApp</a></Button>
              <Button asChild variant="outline" className="h-12 border-navy-foreground/20 bg-transparent text-navy-foreground hover:bg-navy-foreground hover:text-navy"><a href="mailto:info@futurehomesinternational.com"><Mail aria-hidden="true" /> Email</a></Button>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-navy-foreground/45"><MapPin className="h-3.5 w-3.5 text-gold" /> Antalya · Istanbul · Dubai · Cyprus · Bali</p>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
