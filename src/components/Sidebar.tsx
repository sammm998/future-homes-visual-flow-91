import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAIHelpOpen: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onAIHelpOpen }) => {
  const { t } = useTranslation();

  const propertyLocations = [
    { name: t('sidebar.antalya'), href: "/antalya" },
    { name: t('sidebar.istanbul'), href: "/istanbul" },
    { name: t('sidebar.mersin'), href: "/mersin" },
    { name: t('sidebar.cyprus'), href: "/cyprus" },
    { name: t('sidebar.dubai'), href: "/dubai" },
    { name: t('sidebar.bali'), href: "/bali" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed top-0 right-0 h-full w-80 bg-background border-l shadow-xl z-50 overflow-y-auto"
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-end mb-6">
              <button onClick={onClose} className="text-foreground hover:text-primary">
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
                      className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1"
                      onClick={onClose}
                    >
                      {location.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link to="/property-wizard" onClick={onClose} className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1">
                {t('sidebar.easy_find')}
              </Link>
              <Link to="/map-search" onClick={onClose} className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1">
                {t('sidebar.map_search')}
              </Link>
              <Link to="/about-us" onClick={onClose} className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1">
                {t('sidebar.about')}
              </Link>
              <Link to="/testimonials" onClick={onClose} className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1">
                {t('sidebar.testimonials')}
              </Link>
              <Link to="/information" onClick={onClose} className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1">
                {t('sidebar.information')}
              </Link>
              <Link to="/contact-us" onClick={onClose} className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1">
                {t('sidebar.contact')}
              </Link>
              <a
                href="https://futurehomesai.one/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1 text-left"
              >
                {t('sidebar.ai_help')}
              </a>
              
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
