import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SelectedSector, Pollutant, Year, LisaCluster } from '../types/dashboard';
import { EmptyState } from './EmptyState';
import { LISA_COLORS, LISA_LABELS } from '../utils/colorScales';
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
  lisaCluster: LisaCluster | null;
  onClose?: () => void;
}

const CLUSTER_BG: Record<string, string> = {
  HH: '#fef2f2',
  LL: '#eff6ff',
  HL: '#fff7ed',
  LH: '#f0fdf4',
  NS: '#f9fafb',
};

export const SectorDetailPanel: React.FC<SectorDetailPanelProps> = ({
  sector,
  selectedPollutant,
  selectedYear,
  lisaCluster,
  onClose,
}) => {
  if (!sector) return <EmptyState />;

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
        className="flex flex-col h-full bg-white overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">{sector.name}</h2>
            <p className="text-xs text-stone-500 mt-0.5">SETU_CCNCT: {sector.setuCcnct}</p>
          </div>
          {onClose && (
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 hover:bg-stone-100 rounded-full transition-colors ml-2 flex-shrink-0"
            >
              <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          )}
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* Concentration */}
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              Concentración · {selectedPollutant} · {selectedYear}
            </h3>
            <div className="bg-stone-50 rounded-xl p-3">
              <div className="text-2xl font-bold text-stone-900">
                {concentration === null || concentration === undefined
                  ? 'Sin dato'
                  : formatNumber(concentration, 2)}
              </div>
              {concentration !== null && concentration !== undefined && (
                <p className="text-xs text-stone-500 mt-0.5">µg/m³</p>
              )}
            </div>
          </motion.section>

          {/* LISA Cluster */}
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              Cluster LISA
            </h3>
            <div
              className="rounded-xl p-3 flex items-center gap-3"
              style={{ backgroundColor: lisaCluster ? CLUSTER_BG[lisaCluster] ?? '#f9fafb' : '#f9fafb' }}
            >
              {lisaCluster && lisaCluster !== 'NS' && (
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: LISA_COLORS[lisaCluster] }}
                />
              )}
              <p className="text-sm font-semibold text-stone-800">
                {lisaCluster
                  ? LISA_LABELS[lisaCluster] ?? lisaCluster
                  : 'Sin dato LISA'}
              </p>
            </div>
          </motion.section>

          {/* Population */}
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              Población Total
            </h3>
            <div className="bg-stone-50 rounded-xl p-3">
              <div className="text-xl font-bold text-stone-900">{formatLargeNumber(totalPop)}</div>
              <p className="text-xs text-stone-500 mt-0.5">habitantes</p>
            </div>
          </motion.section>

          {/* Age groups */}
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              Distribución por Edad
            </h3>
            <div className="space-y-2.5">
              {ageGroups.map(group => {
                const pct = calculateAgePercentage(group.value, totalPop);
                return (
                  <div key={group.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-stone-600">{group.label}</span>
                      <span className="text-xs font-medium text-stone-800">
                        {formatLargeNumber(group.value)} ({pct.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-stone-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Socioeconomic */}
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
              Variables Socioeconómicas
            </h3>
            <div className="space-y-2">
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-xs text-stone-500">Estrato Mayoritario</p>
                <p className="text-sm font-semibold text-stone-800 mt-0.5">
                  {getStratumName(demo.majorityStrata) || 'Sin dato'}
                </p>
              </div>
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-xs text-stone-500">IPM Promedio</p>
                <p className="text-sm font-semibold text-stone-800 mt-0.5">
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
