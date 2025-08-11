
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBuilding, FaTree, FaUmbrellaBeach, FaMountain } from 'react-icons/fa';
import { motion } from 'framer-motion';



const InteractiveSelector = () => {
  const navigate = useNavigate();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState([]);
  
  const options = [
    {
      title: "Antalya",
      description: "Turkish Riviera Paradise",
      propertyCount: "45+ Properties",
      image: "/lovable-uploads/37669c23-a476-4550-84f1-f370ce4333a1.png",
      icon: <FaUmbrellaBeach size={20} className="text-white" />,
      path: "/antalya"
    },
    {
      title: "Dubai",
      description: "Modern Metropolis",
      propertyCount: "38+ Properties",
      image: "/lovable-uploads/122a7bd0-5d6b-4bcf-8db9-bfdbcf1565d5.png",
      icon: <FaBuilding size={20} className="text-white" />,
      path: "/dubai"
    },
    {
      title: "Mersin",
      description: "Mediterranean Coastal",
      propertyCount: "25+ Properties",
      image: "/lovable-uploads/ae81b7b2-74ce-4693-b5bf-43a5e3bb2b97.png",
      icon: <FaUmbrellaBeach size={20} className="text-white" />,
      path: "/mersin"
    },
    {
      title: "Cyprus",
      description: "Island Paradise",
      propertyCount: "32+ Properties",
      image: "/lovable-uploads/760abba9-43a1-433b-83fd-d578ecda1828.png",
      icon: <FaTree size={20} className="text-white" />,
      path: "/cyprus"
    }
  ];

  const handleOptionClick = (index) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    } else {
      // Navigate to the city page when clicking on active option
      navigate(options[index].path);
    }
  };

  useEffect(() => {
    const timers = [];
    
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 150 * i);
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  return (
    <section className="relative min-h-screen py-16 lg:py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground tracking-tight">
              Explore Destinations <span className="text-transparent bg-clip-text bg-gradient-primary"></span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover premium properties in the world's most desirable locations
            </p>
          </motion.div>
        </div>

        {/* Responsive Options Container */}
        <div className="w-full max-w-6xl mx-auto">
          {/* Desktop View */}
          <div className="hidden lg:flex h-[500px] rounded-2xl overflow-hidden shadow-elegant">
            {options.map((option, index) => (
              <motion.div
                key={index}
                className={`
                  relative cursor-pointer transition-all duration-700 ease-out overflow-hidden
                  ${activeIndex === index ? 'flex-[4]' : 'flex-1'}
                `}
                style={{
                  backgroundImage: `url('${option.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: animatedOptions.includes(index) ? 1 : 0,
                  transform: animatedOptions.includes(index) ? 'translateX(0)' : 'translateX(-60px)',
                }}
                onClick={() => handleOptionClick(index)}
                initial={false}
                animate={{
                  opacity: animatedOptions.includes(index) ? 1 : 0,
                  x: animatedOptions.includes(index) ? 0 : -60,
                }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                      {option.icon}
                    </div>
                    {activeIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="text-white"
                        >
                          <h3 className="text-2xl lg:text-3xl font-bold mb-1">{option.title}</h3>
                          <p className="text-white/80 text-sm lg:text-base mb-2">{option.description}</p>
                          <p className="text-primary-glow font-semibold text-sm mb-3">{option.propertyCount}</p>
                          <button 
                            className="bg-primary hover:bg-primary-glow text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(option.path);
                            }}
                          >
                            View Properties
                          </button>
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
                className="relative h-32 sm:h-40 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                style={{
                  backgroundImage: `url('${option.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
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
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 flex-shrink-0">
                      {option.icon}
                    </div>
                    <div className="text-white flex-grow">
                      <h3 className="text-lg sm:text-xl font-bold mb-1">{option.title}</h3>
                      <p className="text-white/80 text-sm mb-1">{option.description}</p>
                      <p className="text-primary-glow font-semibold text-xs sm:text-sm mb-2">{option.propertyCount}</p>
                      <button 
                        className="bg-primary hover:bg-primary-glow text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(option.path);
                        }}
                      >
                        View Properties
                      </button>
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
