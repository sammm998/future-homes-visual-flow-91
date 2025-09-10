import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';



interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAIHelpOpen: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onAIHelpOpen }) => {
  

  const propertyLocations = [
    { name: "Property in Antalya", href: "/antalya" },
    { name: "Property in Mersin", href: "/mersin" },
    { name: "Property in Cyprus", href: "/cyprus" },
    { name: "Property in Dubai", href: "/dubai" }
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
            {/* Close button */}
            <div className="flex justify-end mb-6">
              <button onClick={onClose} className="text-foreground hover:text-primary">
                <X size={24} />
              </button>
            </div>
            
            {/* Menu content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-foreground text-lg font-semibold mb-3">Properties</h3>
                <div className="space-y-2 ml-2">
                  {propertyLocations.map((location) => (
                    <Link
                      key={location.name}
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
                Easy Find
              </Link>
              <Link to="/about-us" onClick={onClose} className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1">
                About Us
              </Link>
              <Link to="/gallery" onClick={onClose} className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1">
                Image Gallery
              </Link>
              <Link to="/testimonials" onClick={onClose} className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1">
                Testimonials
              </Link>
              <Link to="/information" onClick={onClose} className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1">
                Information
              </Link>
              <Link to="/contact-us" onClick={onClose} className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1">
                Contact Us
              </Link>
              <button
                onClick={() => { 
                  onAIHelpOpen(); 
                  onClose(); 
                }} 
                className="block text-muted-foreground hover:text-primary text-sm transition-colors py-1 text-left"
              >
                AI Help
              </button>
              
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;