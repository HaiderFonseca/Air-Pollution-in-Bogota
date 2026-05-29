/**
 * Data utilities for loading and processing dashboard data
 *
 * PRODUCTION NOTES:
 * - This file currently loads mock data
 * - To connect real data, replace the mock loading functions with actual GeoJSON/JSON/CSV loading
 * - Keep the same interface structure so component code doesn't need to change
 */

import {
  SectorFeature,
  PollutantConcentration,
  SelectedSector,
  Pollutant,
  Year,
} from '../types/dashboard';
import {
  MOCK_SECTORS,
  AVAILABLE_POLLUTANTS,
  AVAILABLE_YEARS,
  generateMockConcentrations,
  getConcentrationValue,
} from '../data/mockData';

/**
 * Load census sectors from real data or mock
 * PRODUCTION: Loads from /public/data/geo/sectores_censales_bogota.geojson
 * FALLBACK: Uses mock data if real file not found
 *
 * @returns Promise<SectorFeature[]>
 */
export async function loadSectors(): Promise<SectorFeature[]> {
  try {
    // Try to load real GeoJSON data
    const response = await fetch('/data/geo/sectores_censales_bogota.geojson');
    
    if (!response.ok) {
      console.warn('Real sector data not found, using mock data');
      return Promise.resolve(MOCK_SECTORS);
    }
    
    const geojson = await response.json();
    
    if (!geojson.features || !Array.isArray(geojson.features)) {
      console.warn('Invalid GeoJSON structure, using mock data');
      return Promise.resolve(MOCK_SECTORS);
    }
    
    console.log(`Loaded ${geojson.features.length} real census sectors`);
    return geojson.features.map(convertGeoJSONFeature);
    
  } catch (error) {
    console.warn('Error loading real sector data, using mock data:', error);
    return Promise.resolve(MOCK_SECTORS);
  }
}

/**
 * Load pollutant concentrations from real data or mock
 * PRODUCTION: Loads from /public/data/geo/concentraciones_sector_censal.json
 * FALLBACK: Uses mock data if real file not found
 *
 * @returns Promise<PollutantConcentration[]>
 */
export async function loadConcentrations(): Promise<PollutantConcentration[]> {
  try {
    // Try to load real JSON data (long format)
    const response = await fetch('/data/geo/concentraciones_sector_censal.json');
    
    if (!response.ok) {
      console.warn('Real concentration data not found, using mock data');
      return Promise.resolve(generateMockConcentrations());
    }
    
    const records = await response.json();
    
    if (!Array.isArray(records)) {
      console.warn('Invalid concentration data structure, using mock data');
      return Promise.resolve(generateMockConcentrations());
    }
    
    // Convert pollutant names from GPKG format to app format
    // GPKG has: CO, NO2, OZONO, PM10, PM2.5, SO2, eBC
    // App expects: CO, NO2, O3, PM10, PM2.5, SO2, eBC
    const converted = records.map(record => ({
      ...record,
      pollutant: normalizePollutantName(record.pollutant)
    }));
    
    console.log(`Loaded ${converted.length} real concentration records`);
    return converted.filter(c => c.concentration !== null && c.concentration !== undefined);
    
  } catch (error) {
    console.warn('Error loading real concentration data, using mock data:', error);
    return Promise.resolve(generateMockConcentrations());
  }
}

/**
 * Normalize pollutant names from different data sources
 * Converts GPKG names to app names
 */
function normalizePollutantName(name: string): Pollutant {
  const normalize: Record<string, Pollutant> = {
    'CO': 'CO',
    'NO2': 'NO2',
    'OZONO': 'O3',
    'O3': 'O3',
    'O₃': 'O3',
    'PM10': 'PM10',
    'PM2.5': 'PM2.5',
    'SO2': 'SO2',
    'SO₂': 'SO2',
    'eBC': 'eBC',
    'Black Carbon': 'eBC',
  };
  
  const normalized = normalize[name];
  if (!normalized) {
    console.warn(`Unknown pollutant name: ${name}, defaulting to PM2.5`);
    return 'PM2.5';
  }
  
  return normalized;
}

/**
 * Get a selected sector with all its data
 * IMPORTANT: Uses SETU_CCNCT as the join key
 *
 * @param setuCcnct - Census sector identifier
 * @param sectors - All sectors
 * @param concentrations - All concentration records
 * @returns SelectedSector | null
 */
export function getSectorData(
  setuCcnct: string,
  sectors: SectorFeature[],
  concentrations: PollutantConcentration[],
): SelectedSector | null {
  const sector = sectors.find((s) => s.setuCcnct === setuCcnct);

  if (!sector) {
    return null;
  }

  // Build concentration data for this sector (join by SETU_CCNCT)
  const sectorConcentrations: SelectedSector['concentrations'] = {};

  AVAILABLE_POLLUTANTS.forEach((pollutant) => {
    sectorConcentrations[pollutant] = {};
    AVAILABLE_YEARS.forEach((year) => {
      const value = getConcentrationValue(setuCcnct, pollutant, year, concentrations);
      sectorConcentrations[pollutant]![year] = value;
    });
  });

  return {
    setuCcnct: sector.setuCcnct,
    name: sector.name,
    geometry: sector.geometry,
    demographics: sector.properties.demographics,
    concentrations: sectorConcentrations,
  };
}

/**
 * Get concentration value for a specific sector, pollutant, and year
 * Returns null if not found or missing data
 */
export function getConcentration(
  setuCcnct: string,
  pollutant: Pollutant,
  year: Year,
  concentrations: PollutantConcentration[],
): number | null {
  return getConcentrationValue(setuCcnct, pollutant, year, concentrations);
}

/**
 * Get all concentration values for a specific pollutant and year
 * Used for calculating map color scale ranges
 */
export function getConcentrationRange(
  pollutant: Pollutant,
  year: Year,
  concentrations: PollutantConcentration[],
): { min: number; max: number; hasData: boolean } {
  const values = concentrations
    .filter((c) => c.pollutant === pollutant && c.year === year && c.concentration !== null)
    .map((c) => c.concentration as number);

  if (values.length === 0) {
    return { min: 0, max: 0, hasData: false };
  }

  return {
    min: Math.min(...values),
    max: Math.max(...values),
    hasData: true,
  };
}

/**
 * Helper: Convert GeoJSON feature to SectorFeature (for future real data loading)
 * PRODUCTION: Use this when loading real GeoJSON
 */
export function convertGeoJSONFeature(feature: any): SectorFeature {
  // This is a template for future implementation
  return {
    id: feature.properties.SETU_CCNCT,
    setuCcnct: feature.properties.SETU_CCNCT,
    name: feature.properties.name || 'Sector',
    geometry: feature.geometry,
    properties: {
      setuCcnct: feature.properties.SETU_CCNCT,
      areaName: feature.properties.areaName || '',
      locality: feature.properties.locality || '',
      demographics: {
        totalPopulation: feature.properties.STP27_PERS || 0,
        children0_9: feature.properties.STP34_1_ED || 0,
        youth10_19: feature.properties.STP34_2_ED || 0,
        adults20_59:
          (feature.properties.STP34_3_ED || 0) +
          (feature.properties.STP34_4_ED || 0) +
          (feature.properties.STP34_5_ED || 0) +
          (feature.properties.STP34_6_ED || 0),
        olderAdults60Plus:
          (feature.properties.STP34_7_ED || 0) +
          (feature.properties.STP34_8_ED || 0) +
          (feature.properties.STP34_9_ED || 0),
        majorityStrata: feature.properties.ESTRATO_MAYORITARIO || '3',
        averageIPM: feature.properties.IPM_PROMEDIO || 0,
      },
    },
  };
}

/**
 * Helper: Convert concentration record from real data format
 * PRODUCTION: Use this when loading real concentration data
 */
export function convertConcentrationRecord(record: any): PollutantConcentration {
  // This is a template for future implementation
  return {
    setuCcnct: record.SETU_CCNCT || record.setuCcnct,
    year: parseInt(record.year || record.YEAR) as Year,
    pollutant: record.pollutant as Pollutant,
    concentration: record.concentration || null,
    unit: record.unit,
  };
}

/**
 * Check if a value is missing data
 */
export function isMissingData(value: number | null): boolean {
  return value === null || value === undefined;
}
