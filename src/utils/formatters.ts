/**
 * Formatting utilities for the dashboard
 */

import { Pollutant } from '../types/dashboard';

/**
 * Format a number with decimals
 */
export function formatNumber(value: number | null, decimals: number = 1): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return value.toFixed(decimals);
}

/**
 * Format a large number with thousand separators
 */
export function formatLargeNumber(value: number | null): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format concentration with unit
 */
export function formatConcentrationWithUnit(
  value: number | null,
  pollutant: Pollutant,
  decimals: number = 2,
): string {
  if (value === null || value === undefined) {
    return 'Sin dato';
  }

  const units: Record<Pollutant, string> = {
    'PM2.5': 'µg/m³',
    'PM10': 'µg/m³',
    'NO2': 'ppb',
    'SO2': 'ppb',
    'CO': 'µg/m³',
    'O3': 'µg/m³',
    'eBC': 'µg/m³',
  };

  return `${value.toFixed(decimals)} ${units[pollutant]}`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | null): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return `${value.toFixed(1)}%`;
}

/**
 * Format IPM (Índice de Pobreza Multidimensional)
 */
export function formatIPM(value: number | null): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  return value.toFixed(3);
}

interface IPMQuintileResult {
  quintile: string;   // 'Q1' … 'Q5'
  label: string;      // human-readable description
}

/**
 * Classify an IPM value into the quintile brackets defined in the thesis
 * sociodemographic analysis for Bogotá census sectors.
 *
 * Q1: 0.000 – 0.042  (menor pobreza multidimensional)
 * Q2: 0.043 – 0.067  (baja pobreza multidimensional)
 * Q3: 0.068 – 0.099  (pobreza intermedia)
 * Q4: 0.100 – 0.152  (pobreza media-alta)
 * Q5: 0.153 – 0.860  (mayor pobreza multidimensional)
 */
export function getIPMQuintile(value: number | null): IPMQuintileResult | null {
  if (value === null || value === undefined || isNaN(value)) return null;

  if (value <= 0.042) return { quintile: 'Q1', label: 'menor pobreza multidimensional' };
  if (value <= 0.067) return { quintile: 'Q2', label: 'baja pobreza multidimensional' };
  if (value <= 0.099) return { quintile: 'Q3', label: 'pobreza intermedia' };
  if (value <= 0.152) return { quintile: 'Q4', label: 'pobreza media-alta' };
  if (value <= 0.860) return { quintile: 'Q5', label: 'mayor pobreza multidimensional' };

  return null; // fuera del rango esperado
}

/**
 * Format sector identification
 */
export function formatSectorId(setuCcnct: string): string {
  // SETU_CCNCT format: 11XXXX (11 is Bogotá code)
  // Could be further formatted if needed
  return setuCcnct;
}

/**
 * Get readable name for stratum
 */
export function getStratumName(stratum: string): string {
  const stratumNames: Record<string, string> = {
    '1': 'Estrato 1 (Muy bajo)',
    '2': 'Estrato 2 (Bajo)',
    '3': 'Estrato 3 (Medio-bajo)',
    '4': 'Estrato 4 (Medio)',
    '5': 'Estrato 5 (Medio-alto)',
    '6': 'Estrato 6 (Alto)',
  };
  return stratumNames[stratum] || `Estrato ${stratum}`;
}

/**
 * Format age group percentage for display
 */
export function calculateAgePercentage(
  ageGroupCount: number,
  totalPopulation: number,
): number {
  if (totalPopulation === 0 || !totalPopulation) {
    return 0;
  }
  return (ageGroupCount / totalPopulation) * 100;
}
