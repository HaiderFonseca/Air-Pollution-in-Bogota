/**
 * YearTabs Component
 * Compact scrollable pill tabs for selecting year (2010-2024)
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
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex gap-1.5 overflow-x-auto pb-1"
      style={{ scrollBehavior: 'smooth', maxWidth: '600px' }}
    >
      {AVAILABLE_YEARS.map((year) => (
        <motion.button
          key={year}
          onClick={() => onChange(year)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all border-2 whitespace-nowrap flex-shrink-0 ${
            selected === year
              ? 'bg-stone-700 text-white border-stone-700 shadow-md'
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

export default YearTabs;
