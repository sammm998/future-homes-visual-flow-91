import React, { useState, useEffect } from 'react';
import { useNavigate } from '@/lib/router-compat';
import { FaBuilding, FaTree, FaUmbrellaBeach, FaMountain, FaMosque } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import baliImage from '@/assets/bali-destination.webp';
import istanbulImage from '@/assets/istanbul-destination.webp';
import { useTranslation } from '@/hooks/useTranslation';

const InteractiveSelector = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  const options = [
    { title: "Antalya", description: t('dest.antalya_desc'), propertyCount: `80+ ${t('dest.properties')}`, image: "/lovable-uploads/37669c23-a476-4550-84f1-f370ce4333a1.webp", icon: <FaUmbrellaBeach size={20} className="text-white" />, path: "/antalya" },
    { title: "Istanbul", description: t('dest.istanbul_desc'), propertyCount: `45+ ${t('dest.properties')}`, image: istanbulImage, icon: <FaMosque size={20} className="text-white" />, path: "/istanbul" },
    { title: "Dubai", description: t('dest.dubai_desc'), propertyCount: `38+ ${t('dest.properties')}`, image: "/lovable-uploads/122a7bd0-5d6b-4bcf-8db9-bfdbcf1565d5.webp", icon: <FaBuilding size={20} className="text-white" />, path: "/dubai" },
    { title: "Mersin", description: t('dest.mersin_desc'), propertyCount: `25+ ${t('dest.properties')}`, image: "/lovable-uploads/ae81b7b2-74ce-4693-b5bf-43a5e3bb2b97.webp", icon: <FaUmbrellaBeach size={20} className="text-white" />, path: "/mersin" },
    { title: "Cyprus", description: t('dest.cyprus_desc'), propertyCount: `32+ ${t('dest.properties')}`, image: "/lovable-uploads/760abba9-43a1-433b-83fd-d578ecda1828.webp", icon: <FaTree size={20} className="text-white" />, path: "/cyprus" },
    { title: "Bali", description: t('dest.bali_desc'), propertyCount: `15+ ${t('dest.properties')}`, image: baliImage, icon: <FaMountain size={20} className="text-white" />, path: "/bali" },
  ];

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    } else {
      navigate(options[index].path);
    }
  };

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 150 * i);
      timers.push(timer);
    });
    return () => { timers.forEach(timer => clearTimeout(timer)); };
  }, []);

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-brand-secondary text-brand-foreground cinematic-section">
      <div className="absolute inset-0 bg-noise opacity-[0.025]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="space-y-6">
            <span className="section-kicker cinematic-rule text-brand-accent">Future Homes</span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-brand-foreground tracking-tight">
              {t('home.explore_destinations')}
            </h2>
            <p className="text-lg sm:text-xl text-brand-foreground/70 max-w-3xl mx-auto leading-relaxed">
              {t('home.explore_subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          {/* Desktop View */}
          <div className="hidden lg:flex h-[540px] rounded-md overflow-hidden shadow-2xl border border-brand-foreground/10">
            {options.map((option, index) => (
              <motion.div
                key={index}
                className={`relative cursor-pointer transition-all duration-700 ease-out overflow-hidden ${activeIndex === index ? 'flex-[4]' : 'flex-1'}`}
                style={{ backgroundImage: `url('${option.image}')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: animatedOptions.includes(index) ? 1 : 0, transform: animatedOptions.includes(index) ? 'translateX(0)' : 'translateX(-60px)' }}
                onClick={() => handleOptionClick(index)}
                initial={false}
                animate={{ opacity: animatedOptions.includes(index) ? 1 : 0, x: animatedOptions.includes(index) ? 0 : -60 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-4">
                     <div className="w-12 h-12 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-brand-foreground/20">
                      {option.icon}
                    </div>
                    {activeIndex === index && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-white">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-1">{option.title}</h3>
                        <p className="text-white/80 text-sm lg:text-base mb-2">{option.description}</p>
                        <p className="font-semibold text-sm mb-3 text-slate-50">{option.propertyCount}</p>
                         <Button className="bg-primary hover:bg-primary-glow text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold transition-all hover:-translate-y-0.5" onClick={(e) => { e.stopPropagation(); navigate(option.path); }}>
                          {t('home.view_properties')}
                         </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile/Tablet View */}
          <div className="lg:hidden space-y-4">
            {options.map((option, index) => (
              <motion.div
                key={index}
                className="relative h-40 sm:h-48 rounded-md overflow-hidden shadow-lg cursor-pointer border border-brand-foreground/10"
                style={{ backgroundImage: `url('${option.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                onClick={() => handleOptionClick(index)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
                <div className="relative h-full flex items-center p-4 sm:p-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-brand-foreground/20 flex-shrink-0">
                      {option.icon}
                    </div>
                    <div className="text-white flex-grow">
                      <h3 className="text-lg sm:text-xl font-bold mb-1">{option.title}</h3>
                      <p className="text-white/80 text-sm mb-1">{option.description}</p>
                      <p className="font-semibold text-xs sm:text-sm mb-2 text-slate-50">{option.propertyCount}</p>
                       <Button className="bg-primary hover:bg-primary-glow text-primary-foreground px-3 py-1 rounded-sm text-xs font-semibold transition-colors" onClick={(e) => { e.stopPropagation(); navigate(option.path); }}>
                        {t('home.view_properties')}
                       </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default InteractiveSelector;
