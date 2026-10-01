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
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'tween', duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-0 top-0 z-50 h-full w-[min(38rem,94vw)] overflow-y-auto border-r border-navy-foreground/10 bg-navy text-navy-foreground shadow-[var(--shadow-luxe)]"
        >
          <div className="flex min-h-full flex-col px-6 py-7 sm:px-10 sm:py-10">
            <div className="mb-10 flex items-start justify-between border-b border-navy-foreground/10 pb-8">
              <Link to={withLang('/')} onClick={onClose} className="inline-flex items-center">
                <img src="/favicon-512x512.png" alt="Future Homes International" width={52} height={52} className="h-12 w-12 object-contain" />
                <span className="ml-4 max-w-36 font-serif text-sm font-semibold uppercase leading-5 [letter-spacing:.12em]">Future Homes International</span>
              </Link>
              <button onClick={onClose} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center border border-navy-foreground/20 text-navy-foreground transition-colors hover:border-gold hover:text-gold">
                <X size={24} />
              </button>
            </div>
            
            <div className="grid flex-1 gap-10 sm:grid-cols-[1.05fr_.95fr]">
              <div>
                <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase text-gold [letter-spacing:.22em]"><span className="h-px w-8 bg-gold" />{t('sidebar.properties')}</p>
                <div className="space-y-1">
                  {propertyLocations.map((location) => (
                    <Link
                      key={location.href}
                      to={location.href}
                      className="group flex min-h-12 items-center justify-between border-b border-navy-foreground/10 font-serif text-xl text-navy-foreground/85 transition-colors hover:text-gold"
                      onClick={onClose}
                    >
                      <span>{location.name}</span><ArrowRight className="h-4 w-4 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
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

            <div className="mt-10 grid gap-3 border-t border-navy-foreground/10 pt-7 sm:grid-cols-2">
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
