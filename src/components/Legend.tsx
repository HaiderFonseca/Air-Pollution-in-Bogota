import React from 'react';
import { Pollutant } from '../types/dashboard';
import { getColorScale, LISA_COLORS, LISA_LABELS } from '../utils/colorScales';
import { formatNumber } from '../utils/formatters';

interface LegendProps {
  pollutant: Pollutant;
  showLisa: boolean;
  concP5: number;
  concP95: number;
}

export const Legend: React.FC<LegendProps> = ({ pollutant, showLisa, concP5, concP95 }) => {
  const { unit } = getColorScale(pollutant);

  if (showLisa) {
    const clusters = ['HH', 'LL', 'HL', 'LH', 'NS'] as const;
    return (
      <div className="space-y-1.5">
        <div className="mb-2">
          <p className="font-bold text-stone-800 text-sm">Clusters LISA</p>
          <p className="text-xs text-stone-500">{pollutant}</p>
        </div>
        {clusters.map(c => (
          <div key={c} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm border border-stone-300 flex-shrink-0"
              style={{
                backgroundColor: c === 'NS' ? '#e5e7eb' : LISA_COLORS[c],
              }}
            />
            <span className="text-xs text-stone-600">{LISA_LABELS[c]}</span>
          </div>
        ))}
      </div>
    );
  }

  // Continuous gradient legend
  const gradientStyle = {
    background: 'linear-gradient(to right, #fffde7, #f59e0b, #7c140a)',
  };

  return (
    <div style={{ minWidth: '160px' }}>
      <div className="mb-2">
        <p className="font-bold text-stone-800 text-sm">{pollutant}</p>
        <p className="text-xs text-stone-500">{unit}</p>
      </div>

      {/* Gradient bar */}
      <div
        className="h-3 w-full rounded-full mb-1"
        style={gradientStyle}
      />

      {/* Min / Max labels */}
      <div className="flex justify-between text-xs text-stone-500 mb-2">
        <span>{formatNumber(concP5, 1)}</span>
        <span className="text-stone-400 text-center">p5 – p95</span>
        <span>{formatNumber(concP95, 1)}</span>
      </div>

      {/* Missing data */}
      <div className="flex items-center gap-2 pt-1 border-t border-stone-200">
        <div className="w-4 h-3 rounded-sm bg-zinc-300 border border-stone-300 flex-shrink-0" />
        <span className="text-xs text-stone-500">Sin dato</span>
      </div>
    </div>
  );
};

export default Legend;
