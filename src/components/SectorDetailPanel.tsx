import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SelectedSector,
  Pollutant,
  Year,
  LisaCluster,
  PersistenceData,
  LayerMode,
} from '../types/dashboard';
import { EmptyState } from './EmptyState';
import { LISA_COLORS, LISA_LABELS, BIVARIATE_LISA_LABELS, BIVARIATE_LISA_DESCRIPTIONS, getPersistenceColor } from '../utils/colorScales';
import {
  formatNumber,
  formatLargeNumber,
  getStratumName,
  calculateAgePercentage,
  formatIPM,
  getIPMQuintile,
} from '../utils/formatters';

interface SectorDetailPanelProps {
  sector: SelectedSector | null;
  selectedPollutant: Pollutant;
  selectedYear: Year;
  layerMode: LayerMode;
  lisaCluster: LisaCluster | null;
  bivariateCluster: LisaCluster | null;
  persistenceInfo: PersistenceData | null;
  bivariateYear: 2023 | 2024;
  onClose?: () => void;
}

const CLUSTER_BG: Record<string, string> = {
  HH: '#fef2f2',
  LL: '#eff6ff',
  HL: '#fff7ed',
  LH: '#f0fdf4',
  NS: '#f9fafb',
};

/** Persistence badge: continuous gradient color swatch + text */
const PersistenceBadge: React.FC<{ intensity: number }> = ({ intensity }) => {
  const color = getPersistenceColor(intensity);
  return (
    <div
      className="w-3 h-3 rounded-sm flex-shrink-0 border border-stone-200"
      style={{ backgroundColor: color }}
    />
  );
};

export const SectorDetailPanel: React.FC<SectorDetailPanelProps> = ({
  sector,
  selectedPollutant,
  selectedYear,
  layerMode,
  lisaCluster,
  bivariateCluster,
  persistenceInfo,
  bivariateYear,
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

  // ── Persistence section helpers ────────────────────────────────────────────
  const targetYear = layerMode === 'lisa_bivariado' ? bivariateYear : selectedYear;

  const renderPersistenceSection = () => {
    if (!persistenceInfo) {
      return (
        <p className="text-sm text-stone-400">
          Sin persistencia HH registrada para este contaminante hasta {targetYear}.
        </p>
      );
    }

    const { HHYearsCount, totalYearsAvailable, HHYearsList, persistenceIntensity, maxHHYearsCount } = persistenceInfo;
    const pctOfMax = maxHHYearsCount > 0 ? Math.round(persistenceIntensity * 100) : 0;
    const isShortSeries = totalYearsAvailable <= 3;

    if (HHYearsCount === 0) {
      return (
        <p className="text-sm text-stone-400">
          Sin persistencia HH registrada para {selectedPollutant} hasta {targetYear}.
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {/* Header row: swatch + count */}
        <div className="flex items-center gap-2">
          <PersistenceBadge intensity={persistenceIntensity} />
          <p className="text-sm font-semibold text-stone-800">
            {HHYearsCount} de {totalYearsAvailable} {totalYearsAvailable === 1 ? 'año' : 'años'} HH
          </p>
        </div>

        {/* Gradient bar */}
        <div className="relative h-2 w-full rounded-full overflow-hidden bg-stone-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pctOfMax}%`,
              backgroundColor: getPersistenceColor(persistenceIntensity),
            }}
          />
        </div>

        {/* Intensity label */}
        <p className="text-xs text-stone-500">
          {pctOfMax}% del máximo observado para {selectedPollutant} hasta {targetYear}
          {isShortSeries && ' · Serie corta, interpretar con cautela'}
        </p>

        {/* Years list */}
        {HHYearsList.length > 0 && (
          <p className="text-xs text-stone-400 leading-tight">
            Años HH: {HHYearsList.join(', ')}
          </p>
        )}
      </div>
    );
  };

  // ── LISA cluster section (univariado or bivariado) ─────────────────────────
  const renderLisaSection = () => {
    if (layerMode === 'concentracion') return null;

    if (layerMode === 'lisa_univariado') {
      const bg = lisaCluster ? CLUSTER_BG[lisaCluster] ?? '#f9fafb' : '#f9fafb';
      return (
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
            LISA univariado · {selectedPollutant} · {selectedYear}
          </h3>
          <div
            className="rounded-xl p-3 flex items-center gap-3"
            style={{ backgroundColor: bg }}
          >
            {lisaCluster && lisaCluster !== 'NS' && (
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: LISA_COLORS[lisaCluster] }} />
            )}
            <p className="text-sm font-semibold text-stone-800">
              {lisaCluster ? LISA_LABELS[lisaCluster] ?? lisaCluster : 'Sin dato LISA'}
            </p>
          </div>
        </motion.section>
      );
    }

    // lisa_bivariado
    const bg = bivariateCluster ? CLUSTER_BG[bivariateCluster] ?? '#f9fafb' : '#f9fafb';
    const description = bivariateCluster ? BIVARIATE_LISA_DESCRIPTIONS[bivariateCluster] : null;
    return (
      <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
          LISA bivariado · {selectedPollutant} × IPM · {bivariateYear}
        </h3>
        <div
          className="rounded-xl p-3 space-y-1"
          style={{ backgroundColor: bg }}
        >
          <div className="flex items-center gap-3">
            {bivariateCluster && bivariateCluster !== 'NS' && (
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: LISA_COLORS[bivariateCluster] }} />
            )}
            <p className="text-sm font-semibold text-stone-800">
              {bivariateCluster ? BIVARIATE_LISA_LABELS[bivariateCluster] ?? bivariateCluster : 'Sin dato bivariado'}
            </p>
          </div>
          {description && (
            <p className="text-xs text-stone-500 leading-tight pl-0">{description}</p>
          )}
        </div>
      </motion.section>
    );
  };

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

          {/* LISA section (univariado or bivariado, hidden in concentration mode) */}
          {renderLisaSection()}

          {/* Persistence HH (shown when LISA layers are active) */}
          {layerMode !== 'concentracion' && (
            <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                Persistencia HH · {selectedPollutant} · hasta {targetYear}
              </h3>
              <div className="bg-stone-50 rounded-xl p-3">
                {renderPersistenceSection()}
              </div>
            </motion.section>
          )}

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
                {demo.averageIPM === null || demo.averageIPM === undefined || demo.averageIPM === 0 ? (
                  <p className="text-sm font-semibold text-stone-800 mt-0.5">IPM no disponible</p>
                ) : (() => {
                  const q = getIPMQuintile(demo.averageIPM);
                  return (
                    <>
                      <p className="text-sm font-semibold text-stone-800 mt-0.5">
                        {formatIPM(demo.averageIPM)}{' '}
                        <span className="font-normal text-stone-500">
                          {q ? `(${q.quintile} · ${q.label})` : '(quintil no clasificado)'}
                        </span>
                      </p>
                      {q && (
                        <p className="text-xs text-stone-400 mt-1 leading-tight">
                          Q1 = menor pobreza · Q5 = mayor pobreza multidimensional
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.section>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
