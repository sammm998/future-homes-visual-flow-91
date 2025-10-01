import { motion } from "framer-motion";

export const PageTransitionLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ 
          duration: 0.5,
          ease: [0.43, 0.13, 0.23, 0.96]
        }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.3em] text-foreground/20 mb-4">
          FUTURE HOMES
        </h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            delay: 0.2,
            duration: 0.4
          }}
          className="flex items-center justify-center gap-2"
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75" style={{ animationDelay: '0.15s' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" style={{ animationDelay: '0.3s' }} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
