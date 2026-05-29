/**
 * DashboardHeader Component
 * Compact header with title, controls, and actions
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
      <div className="max-w-full px-6 py-3">
        {/* Title Row */}
        <div className="mb-3">
          <h1 className="text-xl font-bold text-stone-900">
            Dashboard de Calidad del Aire - Bogotá
          </h1>
        </div>

        {/* Controls Row - More Compact */}
        <div className="flex items-center justify-between gap-6">
          {/* Pollutant Selection */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide whitespace-nowrap">
              Contaminante:
            </label>
            <div className="min-w-max">
              <PollutantTabs selected={selectedPollutant} onChange={onPollutantChange} />
            </div>
          </div>

          {/* Year Selection */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide whitespace-nowrap">
              Año:
            </label>
            <div className="min-w-max">
              <YearTabs selected={selectedYear} onChange={onYearChange} />
            </div>
          </div>

          {/* Center Button */}
          <motion.button
            onClick={onCenterBogota}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="ml-auto px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-sm rounded-full transition-all border border-stone-200 whitespace-nowrap"
          >
            Centrar Bogotá
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default DashboardHeader;
