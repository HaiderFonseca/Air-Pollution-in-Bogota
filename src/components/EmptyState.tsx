/**
 * EmptyState Component
 * Shows when no census sector is selected
 */

import React from 'react';
import { motion } from 'framer-motion';

export const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full px-8 text-center"
    >
      <div className="mb-6 w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center">
        <svg
          className="w-8 h-8 text-stone-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19.5V6m12 0v13.5M9 19.5H3m18 0h-6M9 5.5h12M3 5.5h6"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-stone-800 mb-2">
        Selecciona un sector censal
      </h3>
      <p className="text-stone-500 text-sm max-w-sm mb-6">
        Haz clic en cualquier sector del mapa para ver los datos de concentración de
        contaminantes y variables sociodemográficas.
      </p>
      <div className="flex gap-2 flex-wrap justify-center">
        <div className="px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-600">
          Mapa interactivo
        </div>
        <div className="px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-600">
          Datos en tiempo real
        </div>
      </div>
    </motion.div>
  );
};
