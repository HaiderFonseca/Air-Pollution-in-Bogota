/**
 * YearTabs Component
 * Compact pill tabs for selecting year
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Year } from '../types/dashboard';
import { AVAILABLE_YEARS } from '../data/mockData';

interface YearTabsProps {
  selected: Year;
  onChange: (year: Year) => void;
}

export const YearTabs: React.FC<YearTabsProps> = ({ selected, onChange }) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {AVAILABLE_YEARS.map((year) => (
        <motion.button
          key={year}
          onClick={() => onChange(year)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2 ${
            selected === year
              ? 'bg-stone-700 text-white border-stone-700 shadow-md-soft'
              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
          }`}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          {year}
        </motion.button>
      ))}
    </div>
  );
};
