import React from 'react';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => { 
  return (
    <motion.div className="min-h-screen relative overflow-hidden cursor-pointer">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Title */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring', stiffness: 100 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700 mb-4"
          >
            STELLAR FLOW
          </motion.h1>
          <motion.div
            className="text-2xl md:text-3xl text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Master the cosmic traffic
          </motion.div>
        </motion.div>
        {/* Version info */}
        <motion.div
          className="absolute bottom-4 right-4 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          v2.0.0
        </motion.div>
      </div>
    </motion.div>
  );
};