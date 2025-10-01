import { motion } from "framer-motion";

export const PageTransitionLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.8,
        ease: "easeInOut"
      }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#152437' }}
    >
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        transition={{ 
          duration: 0.8,
          ease: "easeInOut"
        }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.2em] text-white mb-4">
          FUTURE HOMES
        </h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            delay: 0.3,
            duration: 0.6,
            ease: "easeInOut"
          }}
          className="text-lg md:text-xl text-gray-400 tracking-wide"
        >
          International Real Estate
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
