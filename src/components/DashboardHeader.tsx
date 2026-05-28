/**
 * DashboardHeader Component
 * Main header with title, controls, and actions
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Pollutant, Year } from '../types/dashboard';
import { PollutantTabs } from './PollutantTabs';
import { YearTabs } from './YearTabs';

interface DashboardHeaderProps {
  selectedPollutant: Pollutant;
  onPollutantChange: (pollutant: Pollutant) => void;
  selectedYear: Year;
  onYearChange: (year: Year) => void;
  onCenterBogota: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedPollutant,
  onPollutantChange,
  selectedYear,
  onYearChange,
  onCenterBogota,
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-stone-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Title and Description */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-stone-900 mb-1">
            Dashboard Geoespacial de Calidad del Aire en Bogotá
          </h1>
          <p className="text-stone-600 text-sm">
            Concentraciones anuales por sector censal y variables sociodemográficas
          </p>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pollutant Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-3 uppercase tracking-wide">
              Contaminante
            </label>
            <PollutantTabs selected={selectedPollutant} onChange={onPollutantChange} />
          </div>

          {/* Year Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-3 uppercase tracking-wide">
              Año
            </label>
            <YearTabs selected={selectedYear} onChange={onYearChange} />
          </div>

          {/* Actions */}
          <div className="flex items-end">
            <motion.button
              onClick={onCenterBogota}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium rounded-full transition-all border border-stone-200"
            >
              Centrar Bogotá
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
