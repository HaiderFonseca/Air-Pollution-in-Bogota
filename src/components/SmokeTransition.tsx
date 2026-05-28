/**
 * SmokeTransition Component
 * Shows a subtle smoke/blur transition when changing pollutants
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmokeTransitionProps {
  isActive: boolean;
}

export const SmokeTransition: React.FC<SmokeTransitionProps> = ({ isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 pointer-events-none z-40"
        >
          {/* Main smoke overlay with blur effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-gradient-to-br from-stone-200/30 via-stone-100/20 to-stone-200/30 backdrop-blur-sm"
          />

          {/* Floating mist particles */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              y: [0, -40, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.5, 1],
            }}
            className="absolute top-1/4 left-1/4 w-40 h-40 bg-stone-300/20 rounded-full blur-3xl"
          />

          <motion.div
            animate={{
              opacity: [0.2, 0.5, 0.2],
              y: [0, 50, 0],
              x: [0, -30, 0],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
              times: [0, 0.5, 1],
            }}
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-stone-400/15 rounded-full blur-3xl"
          />

          {/* Center emphasis */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              stiffness: 200,
              damping: 20,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-1 h-1 bg-white rounded-full shadow-lg"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
