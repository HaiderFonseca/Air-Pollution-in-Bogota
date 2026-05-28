/**
 * LoadingState Component
 * Shows a loading spinner while data is being fetched
 */

import React from 'react';
import { motion } from 'framer-motion';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-block"
        >
          <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-700 rounded-full"></div>
        </motion.div>
        <p className="mt-4 text-stone-600 font-medium">Cargando datos...</p>
      </motion.div>
    </div>
  );
};
