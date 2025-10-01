import { motion } from "framer-motion";

export const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <div className="text-center">
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.6,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="text-5xl md:text-7xl lg:text-8xl font-light tracking-[0.2em] text-white mb-8"
        >
          FUTURE HOMES
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.3,
            duration: 0.5
          }}
          className="space-y-2"
        >
          <p className="text-lg md:text-xl text-gray-400 tracking-wide">
            International Real Estate
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
