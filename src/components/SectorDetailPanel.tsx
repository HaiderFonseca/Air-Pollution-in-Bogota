/**
 * SectorDetailPanel Component
 * Shows detailed information about a selected census sector
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SelectedSector, Pollutant, Year } from '../types/dashboard';
import { EmptyState } from './EmptyState';
import {
  formatNumber,
  formatLargeNumber,
  getStratumName,
  calculateAgePercentage,
  formatIPM,
} from '../utils/formatters';

interface SectorDetailPanelProps {
  sector: SelectedSector | null;
  selectedPollutant: Pollutant;
  selectedYear: Year;
  onClose?: () => void;
}

export const SectorDetailPanel: React.FC<SectorDetailPanelProps> = ({
  sector,
  selectedPollutant,
  selectedYear,
  onClose,
}) => {
  if (!sector) {
    return <EmptyState />;
  }

  const concentration = sector.concentrations[selectedPollutant]?.[selectedYear];
  const demo = sector.demographics;
  const totalPop = demo.totalPopulation;

  const ageGroups = [
    { label: '0-9 años', value: demo.children0_9 },
    { label: '10-19 años', value: demo.youth10_19 },
    { label: '20-59 años', value: demo.adults20_59 },
    { label: '60+ años', value: demo.olderAdults60Plus },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col h-full bg-white rounded-2xl shadow-lg-soft border border-stone-200 overflow-hidden"
      >
        {/* Header with close button */}
        <div className="flex items-start justify-between p-6 border-b border-stone-100">
          <div>
            <h2 className="text-xl font-bold text-stone-900">{sector.name}</h2>
            <p className="text-sm text-stone-500 mt-1">SETU_CCNCT: {sector.setuCcnct}</p>
          </div>
          {onClose && (
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5 text-stone-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          )}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Pollutant Concentration */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
              Concentración de {selectedPollutant}
            </h3>
            <div className="bg-stone-50 rounded-2xl p-4">
              <div className="text-3xl font-bold text-stone-900">
                {concentration === null || concentration === undefined
                  ? 'N/A'
                  : formatNumber(concentration, 2)}
              </div>
              <p className="text-xs text-stone-600 mt-1">
                {selectedPollutant === 'PM2.5'
                  ? 'µg/m³'
                  : selectedPollutant === 'PM10'
                    ? 'µg/m³'
                    : selectedPollutant === 'Black Carbon'
                      ? 'µg/m³'
                      : 'ppb'}
              </p>
              <p className="text-xs text-stone-500 mt-2">Año {selectedYear}</p>
            </div>
          </motion.section>

          {/* Population Overview */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
              Población Total
            </h3>
            <div className="bg-stone-50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-stone-900">
                {formatLargeNumber(totalPop)}
              </div>
              <p className="text-xs text-stone-600 mt-1">habitantes</p>
            </div>
          </motion.section>

          {/* Age Distribution */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
              Distribución por Edad
            </h3>
            <div className="space-y-3">
              {ageGroups.map((group) => {
                const percentage = calculateAgePercentage(group.value, totalPop);
                return (
                  <div key={group.label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm text-stone-700">{group.label}</span>
                      <span className="text-sm font-medium text-stone-900">
                        {formatLargeNumber(group.value)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="h-full bg-stone-600 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Sociodemographic Variables */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3">
              Variables Socioeconómicas
            </h3>
            <div className="space-y-3">
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-xs text-stone-600">Estrato Mayoritario</p>
                <p className="text-sm font-semibold text-stone-900 mt-1">
                  {getStratumName(demo.majorityStrata)}
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-xs text-stone-600">IPM Promedio</p>
                <p className="text-sm font-semibold text-stone-900 mt-1">
                  {formatIPM(demo.averageIPM)}
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
