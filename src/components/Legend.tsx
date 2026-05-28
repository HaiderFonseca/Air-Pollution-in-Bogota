/**
 * Legend Component
 * Shows the color scale for the currently selected pollutant
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Pollutant } from '../types/dashboard';
import { getColorScale } from '../utils/colorScales';

interface LegendProps {
  pollutant: Pollutant;
}

export const Legend: React.FC<LegendProps> = ({ pollutant }) => {
  const scale = getColorScale(pollutant);
  const { colors, breaks, unit } = scale;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-4 shadow-md-soft border border-stone-200"
    >
      {/* Title */}
      <div className="mb-3">
        <h3 className="font-semibold text-stone-800 text-sm">{pollutant}</h3>
        <p className="text-xs text-stone-500">Concentración anual promedio ({unit})</p>
      </div>

      {/* Color scale */}
      <div className="space-y-2">
        {colors.map((color, index) => {
          const breakValue = breaks[index];
          const nextBreak = breaks[index + 1];

          let label = '';
          if (index === 0) {
            label = `≤ ${breakValue}`;
          } else if (index === colors.length - 1) {
            label = `> ${breaks[breaks.length - 1]}`;
          } else {
            label = `${breakValue} - ${nextBreak}`;
          }

          return (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded border border-stone-300"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-stone-600">{label}</span>
            </div>
          );
        })}

        {/* Missing data indicator */}
        <div className="mt-3 pt-3 border-t border-stone-200">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-stone-200 border border-stone-300" />
            <span className="text-xs text-stone-600">Sin dato</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
