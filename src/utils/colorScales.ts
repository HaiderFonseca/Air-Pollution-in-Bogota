import { Pollutant, ColorScale } from '../types/dashboard';

// ── Continuous color scale ────────────────────────────────────────────────────
// 3-stop palette: cream → warm orange → deep burgundy
const CONT_STOPS = [
  { t: 0,    r: 255, g: 253, b: 231 }, // #fffde7  cream/light-yellow
  { t: 0.45, r: 245, g: 158, b: 11  }, // #f59e0b  amber
  { t: 1,    r: 124, g: 20,  b: 10  }, // #7c140a  deep burgundy
];

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

export function getContinuousColor(
  concentration: number | null,
  p5: number,
  p95: number,
): string {
  if (concentration === null || concentration === undefined) {
    return '#d4d4d8'; // zinc-300 for missing data
  }
  const range = p95 - p5;
  const t = range <= 0 ? 0.5 : Math.max(0, Math.min(1, (concentration - p5) / range));

  for (let i = 0; i < CONT_STOPS.length - 1; i++) {
    const s0 = CONT_STOPS[i];
    const s1 = CONT_STOPS[i + 1];
    if (t <= s1.t) {
      const segT = (t - s0.t) / (s1.t - s0.t);
      return `rgb(${lerp(s0.r, s1.r, segT)},${lerp(s0.g, s1.g, segT)},${lerp(s0.b, s1.b, segT)})`;
    }
  }
  const last = CONT_STOPS[CONT_STOPS.length - 1];
  return `rgb(${last.r},${last.g},${last.b})`;
}

// ── LISA cluster colors ───────────────────────────────────────────────────────
// Same palette used for univariado and bivariado
export const LISA_COLORS: Record<string, string> = {
  HH: '#9b1b1b',  // deep burgundy/wine
  LL: '#1e3f6e',  // deep navy blue
  HL: '#b85c1a',  // warm terracotta
  LH: '#1a6b5c',  // teal
  NS: '#e5e7eb',  // light gray (fill handled separately in GeoMap)
};

/** Labels for LISA univariado */
export const LISA_LABELS: Record<string, string> = {
  HH: 'Alto-Alto (HH)',
  LL: 'Bajo-Bajo (LL)',
  HL: 'Alto-Bajo (HL)',
  LH: 'Bajo-Alto (LH)',
  NS: 'No significativo',
};

/** Labels for LISA bivariado (contaminante × IPM) */
export const BIVARIATE_LISA_LABELS: Record<string, string> = {
  HH: 'Alta concentración + Alto IPM (HH)',
  LL: 'Baja concentración + Bajo IPM (LL)',
  HL: 'Alta concentración + Bajo IPM (HL)',
  LH: 'Baja concentración + Alto IPM (LH)',
  NS: 'Sin asociación local significativa',
};

/** Short description for the sector detail panel (bivariado) */
export const BIVARIATE_LISA_DESCRIPTIONS: Record<string, string> = {
  HH: 'Superposición territorial entre alta concentración y alto IPM.',
  LL: 'Superposición territorial entre baja concentración y bajo IPM.',
  HL: 'Alta concentración en zona de bajo IPM.',
  LH: 'Baja concentración en zona de alto IPM.',
  NS: 'Sin patrón local bivariado significativo para este sector.',
};

/**
 * Compute a sobrio persistence color on a continuous gradient.
 * 0 → stone-200 (gris claro)
 * 0.5 → ámbar muy suave
 * 1 → vinotinto suave
 */
export function getPersistenceColor(intensity: number): string {
  const stops = [
    { t: 0,    r: 229, g: 225, b: 218 }, // stone-200
    { t: 0.3,  r: 245, g: 230, b: 200 }, // beige/ámbar muy suave
    { t: 0.6,  r: 230, g: 175, b: 110 }, // ámbar suave
    { t: 1,    r: 155, g: 40,  b: 40  }, // vinotinto suave
  ];
  const t = Math.max(0, Math.min(1, intensity));
  for (let i = 0; i < stops.length - 1; i++) {
    const s0 = stops[i];
    const s1 = stops[i + 1];
    if (t <= s1.t) {
      const segT = (t - s0.t) / (s1.t - s0.t);
      return `rgb(${lerp(s0.r, s1.r, segT)},${lerp(s0.g, s1.g, segT)},${lerp(s0.b, s1.b, segT)})`;
    }
  }
  const last = stops[stops.length - 1];
  return `rgb(${last.r},${last.g},${last.b})`;
}

// ── Legacy discrete scale (used for popup labels / getConcentrationLabel) ──────
export function getColorScale(pollutant: Pollutant): ColorScale {
  const scales: Record<Pollutant, ColorScale> = {
    'PM2.5': {
      pollutant: 'PM2.5', min: 7, max: 36,
      breaks: [10, 15, 20, 25, 35], unit: 'µg/m³',
      colors: ['#fffde7', '#ffe082', '#ffb300', '#e65100', '#7c140a', '#4a0000'],
    },
    'PM10': {
      pollutant: 'PM10', min: 20, max: 90,
      breaks: [25, 40, 55, 70, 88], unit: 'µg/m³',
      colors: ['#fffde7', '#ffe082', '#ffb300', '#e65100', '#7c140a', '#4a0000'],
    },
    'NO2': {
      pollutant: 'NO2', min: 11, max: 49,
      breaks: [15, 25, 35, 42, 49], unit: 'µg/m³',
      colors: ['#fffde7', '#ffe082', '#ffb300', '#e65100', '#7c140a', '#4a0000'],
    },
    'SO2': {
      pollutant: 'SO2', min: 1, max: 22,
      breaks: [3, 6, 10, 15, 22], unit: 'µg/m³',
      colors: ['#fffde7', '#ffe082', '#ffb300', '#e65100', '#7c140a', '#4a0000'],
    },
    'CO': {
      pollutant: 'CO', min: 300, max: 1900,
      breaks: [500, 750, 1000, 1300, 1700], unit: 'µg/m³',
      colors: ['#fffde7', '#ffe082', '#ffb300', '#e65100', '#7c140a', '#4a0000'],
    },
    'O3': {
      pollutant: 'O3', min: 35, max: 129,
      breaks: [45, 65, 85, 100, 120], unit: 'µg/m³',
      colors: ['#fffde7', '#ffe082', '#ffb300', '#e65100', '#7c140a', '#4a0000'],
    },
    'eBC': {
      pollutant: 'eBC', min: 2, max: 7,
      breaks: [2.5, 3.5, 4.5, 5.5, 6.5], unit: 'µg/m³',
      colors: ['#fffde7', '#ffe082', '#ffb300', '#e65100', '#7c140a', '#4a0000'],
    },
  };
  return scales[pollutant];
}

export function getConcentrationLabel(
  pollutant: Pollutant,
  concentration: number | null,
): string {
  if (concentration === null || concentration === undefined) return 'Sin dato';
  const { breaks } = getColorScale(pollutant);
  if (concentration <= breaks[0]) return 'Muy bajo';
  if (concentration <= breaks[1]) return 'Bajo';
  if (concentration <= breaks[2]) return 'Moderado';
  if (concentration <= breaks[3]) return 'Alto';
  return 'Muy alto';
}
