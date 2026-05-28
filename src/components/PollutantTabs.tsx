/**
 * PollutantTabs Component
 * Premium iOS-style pill tabs for selecting pollutants
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Pollutant } from '../types/dashboard';
import { AVAILABLE_POLLUTANTS } from '../data/mockData';

interface PollutantTabsProps {
  selected: Pollutant;
  onChange: (pollutant: Pollutant) => void;
}

export const PollutantTabs: React.FC<PollutantTabsProps> = ({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {AVAILABLE_POLLUTANTS.map((pollutant) => (
        <motion.button
          key={pollutant}
          onClick={() => onChange(pollutant)}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-all border-2 ${
            selected === pollutant
              ? 'bg-stone-800 text-white border-stone-800 shadow-md-soft'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow:
              selected === pollutant
                ? '0 4px 6px rgba(0, 0, 0, 0.07)'
                : '0 1px 3px rgba(0, 0, 0, 0.06)',
          }}
        >
          {pollutant}
        </motion.button>
      ))}
    </div>
  );
};
