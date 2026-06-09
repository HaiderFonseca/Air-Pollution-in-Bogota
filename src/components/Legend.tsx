import React from 'react';
import { Pollutant, LayerMode } from '../types/dashboard';
import { getColorScale, LISA_COLORS, LISA_LABELS, BIVARIATE_LISA_LABELS, getPersistenceColor } from '../utils/colorScales';
import { formatNumber } from '../utils/formatters';

interface LegendProps {
  pollutant: Pollutant;
  layerMode: LayerMode;
  concP5: number;
  concP95: number;
  maxHHYearsCount: number;
  bivariateYear: 2023 | 2024;
}

const CLUSTERS = ['HH', 'LL', 'HL', 'LH', 'NS'] as const;

/** Compact persistence gradient bar: 0 → maxHH years */
const PersistenceScale: React.FC<{ maxHH: number }> = ({ maxHH }) => {
  if (maxHH === 0) return null;
  return (
    <div className="mt-3 pt-2.5 border-t border-stone-200">
      <p className="text-xs font-semibold text-stone-600 mb-1.5">
        Persistencia HH acumulada
      </p>
      {/* Gradient bar */}
      <div
        className="h-2.5 w-full rounded-full mb-1"
        style={{
          background: `linear-gradient(to right, ${getPersistenceColor(0)}, ${getPersistenceColor(0.5)}, ${getPersistenceColor(1)})`,
        }}
      />
      <div className="flex justify-between text-xs text-stone-400">
        <span>0 años</span>
        <span>{maxHH} {maxHH === 1 ? 'año' : 'años'}</span>
      </div>
      <p className="text-xs text-stone-400 mt-1 leading-tight">
        El borde oscuro y grueso indica mayor persistencia HH
      </p>
    </div>
  );
};

export const Legend: React.FC<LegendProps> = ({
  pollutant,
  layerMode,
  concP5,
  concP95,
  maxHHYearsCount,
  bivariateYear,
}) => {
  const { unit } = getColorScale(pollutant);

  // ── Concentration layer ─────────────────────────────────────────────────────
  if (layerMode === 'concentracion') {
    return (
      <div style={{ minWidth: '160px' }}>
        <div className="mb-2">
          <p className="font-bold text-stone-800 text-sm">{pollutant}</p>
          <p className="text-xs text-stone-500">{unit}</p>
        </div>
        <div
          className="h-3 w-full rounded-full mb-1"
          style={{ background: 'linear-gradient(to right, #fffde7, #f59e0b, #7c140a)' }}
        />
        <div className="flex justify-between text-xs text-stone-500 mb-2">
          <span>{formatNumber(concP5, 1)}</span>
          <span className="text-stone-400 text-center">p5 – p95</span>
          <span>{formatNumber(concP95, 1)}</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-stone-200">
          <div className="w-4 h-3 rounded-sm bg-zinc-300 border border-stone-300 flex-shrink-0" />
          <span className="text-xs text-stone-500">Sin dato</span>
        </div>
      </div>
    );
  }

  // ── LISA univariado layer ───────────────────────────────────────────────────
  if (layerMode === 'lisa_univariado') {
    return (
      <div style={{ minWidth: '180px' }}>
        <div className="mb-2">
          <p className="font-bold text-stone-800 text-sm">LISA univariado</p>
          <p className="text-xs text-stone-500">{pollutant}</p>
        </div>
        <div className="space-y-1.5">
          {CLUSTERS.map(c => (
            <div key={c} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-sm border border-stone-300 flex-shrink-0"
                style={{ backgroundColor: c === 'NS' ? '#e5e7eb' : LISA_COLORS[c] }}
              />
              <span className="text-xs text-stone-600">{LISA_LABELS[c]}</span>
            </div>
          ))}
        </div>
        <PersistenceScale maxHH={maxHHYearsCount} />
      </div>
    );
  }

  // ── LISA bivariado layer ────────────────────────────────────────────────────
  return (
    <div style={{ minWidth: '200px' }}>
      <div className="mb-2">
        <p className="font-bold text-stone-800 text-sm">LISA bivariado</p>
        <p className="text-xs text-stone-500">
          {pollutant} × IPM · {bivariateYear}
        </p>
      </div>
      <div className="space-y-1.5">
        {CLUSTERS.map(c => (
          <div key={c} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm border border-stone-300 flex-shrink-0"
              style={{ backgroundColor: c === 'NS' ? '#e5e7eb' : LISA_COLORS[c] }}
            />
            <span className="text-xs text-stone-600">{BIVARIATE_LISA_LABELS[c]}</span>
          </div>
        ))}
      </div>
      <PersistenceScale maxHH={maxHHYearsCount} />
      <p className="text-xs text-stone-400 mt-2 pt-2 border-t border-stone-200 leading-tight">
        Persistencia HH corresponde a LISA univariado histórico
      </p>
    </div>
  );
};

export default Legend;
