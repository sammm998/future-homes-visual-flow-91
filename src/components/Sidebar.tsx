import React from 'react';
import { Link, useLocation } from '@/lib/router-compat';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

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
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed right-0 top-0 z-50 h-full w-[min(20rem,88vw)] overflow-y-auto border-l bg-background shadow-xl"
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-end mb-6">
              <button onClick={onClose} aria-label="Close menu" className="flex h-11 w-11 items-center justify-center rounded-md text-foreground hover:bg-muted hover:text-primary">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-foreground text-lg font-semibold mb-3">{t('sidebar.properties')}</h3>
                <div className="space-y-2 ml-2">
                  {propertyLocations.map((location) => (
                    <Link
                      key={location.href}
                      to={location.href}
                      className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary"
                      onClick={onClose}
                    >
                      {location.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-border/40 my-2" />



              <Link to={withLang("/property-wizard")} onClick={onClose} className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('sidebar.easy_find')}
              </Link>
              <Link to={withLang("/map-search")} onClick={onClose} className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('sidebar.map_search')}
              </Link>
              <Link to={withLang("/about-us")} onClick={onClose} className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('sidebar.about')}
              </Link>
              <Link to={withLang("/testimonials")} onClick={onClose} className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('sidebar.testimonials')}
              </Link>
              <Link to={withLang("/information")} onClick={onClose} className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('sidebar.information')}
              </Link>
              <Link to={withLang("/courses")} onClick={onClose} className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('sidebar.courses')}
              </Link>
              <Link to={withLang("/our-story")} onClick={onClose} className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('sidebar.our_story')}
              </Link>
              <Link to={withLang("/design-your-home")} onClick={onClose} className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('sidebar.design_home')}
              </Link>
              <Link to={withLang("/contact-us")} onClick={onClose} className="flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-primary">
                {t('sidebar.contact')}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
