/**
 * Color scales for pollutant concentrations
 * These define the color mapping for each pollutant based on concentration values
 */

import { Pollutant, ColorScale } from '../types/dashboard';

/**
 * Get color scale for a given pollutant
 * These ranges are approximate based on Colombian air quality standards
 */
export function getColorScale(pollutant: Pollutant): ColorScale {
  const scales: Record<Pollutant, ColorScale> = {
    'PM2.5': {
      pollutant: 'PM2.5',
      min: 10,
      max: 50,
      breaks: [10, 15, 25, 35, 50],
      unit: 'µg/m³',
      colors: [
        '#e8f5e9', // very light green
        '#c8e6c9', // light green
        '#a5d6a7', // medium-light green
        '#ffd54f', // light yellow
        '#ff9800', // orange
        '#e53935', // red
      ],
    },
    'PM10': {
      pollutant: 'PM10',
      min: 20,
      max: 100,
      breaks: [20, 40, 60, 80, 100],
      unit: 'µg/m³',
      colors: [
        '#e8f5e9', // very light green
        '#c8e6c9', // light green
        '#a5d6a7', // medium-light green
        '#ffd54f', // light yellow
        '#ff9800', // orange
        '#e53935', // red
      ],
    },
    'NO2': {
      pollutant: 'NO2',
      min: 15,
      max: 75,
      breaks: [15, 25, 40, 55, 75],
      unit: 'ppb',
      colors: [
        '#e8f5e9',
        '#c8e6c9',
        '#a5d6a7',
        '#ffd54f',
        '#ff9800',
        '#e53935',
      ],
    },
    'SO₂': {
      pollutant: 'SO₂',
      min: 3,
      max: 20,
      breaks: [3, 7, 12, 16, 20],
      unit: 'ppb',
      colors: [
        '#e8f5e9',
        '#c8e6c9',
        '#a5d6a7',
        '#ffd54f',
        '#ff9800',
        '#e53935',
      ],
    },
    'CO': {
      pollutant: 'CO',
      min: 0.3,
      max: 2.5,
      breaks: [0.3, 0.8, 1.3, 1.8, 2.5],
      unit: 'ppm',
      colors: [
        '#e8f5e9',
        '#c8e6c9',
        '#a5d6a7',
        '#ffd54f',
        '#ff9800',
        '#e53935',
      ],
    },
    'O₃': {
      pollutant: 'O₃',
      min: 25,
      max: 100,
      breaks: [25, 40, 60, 80, 100],
      unit: 'ppb',
      colors: [
        '#e8f5e9',
        '#c8e6c9',
        '#a5d6a7',
        '#ffd54f',
        '#ff9800',
        '#e53935',
      ],
    },
    'Black Carbon': {
      pollutant: 'Black Carbon',
      min: 1,
      max: 8,
      breaks: [1, 2.5, 4, 6, 8],
      unit: 'µg/m³',
      colors: [
        '#e8f5e9',
        '#c8e6c9',
        '#a5d6a7',
        '#ffd54f',
        '#ff9800',
        '#e53935',
      ],
    },
  };

  return scales[pollutant];
}

/**
 * Get color for a specific concentration value based on the pollutant
 */
export function getColorForConcentration(
  pollutant: Pollutant,
  concentration: number | null,
): string {
  if (concentration === null || concentration === undefined) {
    return '#e0e0e0'; // Light gray for missing data
  }

  const scale = getColorScale(pollutant);
  const colors = scale.colors;
  const breaks = scale.breaks;

  // Find which color range the concentration falls into
  for (let i = 0; i < breaks.length; i++) {
    if (concentration <= breaks[i]) {
      return colors[i];
    }
  }

  // If exceeds max, return the last color
  return colors[colors.length - 1];
}

/**
 * Get a classification label for concentration value
 */
export function getConcentrationLabel(
  pollutant: Pollutant,
  concentration: number | null,
): string {
  if (concentration === null || concentration === undefined) {
    return 'Sin dato';
  }

  const scale = getColorScale(pollutant);
  const breaks = scale.breaks;

  if (concentration <= breaks[0]) {
    return 'Muy bajo';
  } else if (concentration <= breaks[1]) {
    return 'Bajo';
  } else if (concentration <= breaks[2]) {
    return 'Moderado';
  } else if (concentration <= breaks[3]) {
    return 'Alto';
  } else {
    return 'Muy alto';
  }
}
