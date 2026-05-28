/**
 * MOCK DATA for Air Pollution Dashboard
 * This data simulates the structure of real data from:
 * - Bogotá census sectors (shapefiles)
 * - Annual pollutant concentrations (GPKG)
 * - Sociodemographic variables (Excel)
 *
 * Join key: SETU_CCNCT
 *
 * NOTE: This is MOCK DATA for demonstration purposes only.
 * Replace with real converted GeoJSON/JSON/CSV data in production.
 */

import {
  SectorFeature,
  PollutantConcentration,
  Pollutant,
  Year,
} from '../types/dashboard';

/**
 * Mock Bogotá census sectors with polygon geometries
 * In production, these will be loaded from:
 * /public/data/geo/sectores_censales_bogota.geojson
 */
export const MOCK_SECTORS: SectorFeature[] = [
  {
    id: 'sector_1',
    setuCcnct: '110010000100',
    name: 'Sector 1 - Centro Histórico',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-74.0827, 4.7138],
          [-74.0787, 4.7138],
          [-74.0787, 4.7178],
          [-74.0827, 4.7178],
          [-74.0827, 4.7138],
        ],
      ],
    },
    properties: {
      setuCcnct: '110010000100',
      areaName: 'Centro Histórico',
      locality: 'La Candelaria',
      demographics: {
        totalPopulation: 15000,
        children0_9: 1200,
        youth10_19: 1500,
        adults20_59: 9500,
        olderAdults60Plus: 2800,
        majorityStrata: '2',
        averageIPM: 0.45,
      },
    },
  },
  {
    id: 'sector_2',
    setuCcnct: '110010000200',
    name: 'Sector 2 - San Alejo',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-74.0787, 4.7138],
          [-74.0747, 4.7138],
          [-74.0747, 4.7178],
          [-74.0787, 4.7178],
          [-74.0787, 4.7138],
        ],
      ],
    },
    properties: {
      setuCcnct: '110010000200',
      areaName: 'San Alejo',
      locality: 'La Candelaria',
      demographics: {
        totalPopulation: 22500,
        children0_9: 1800,
        youth10_19: 2300,
        adults20_59: 14200,
        olderAdults60Plus: 4200,
        majorityStrata: '3',
        averageIPM: 0.38,
      },
    },
  },
  {
    id: 'sector_3',
    setuCcnct: '110010000300',
    name: 'Sector 3 - Chapinero Alto',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-74.0507, 4.7268],
          [-74.0467, 4.7268],
          [-74.0467, 4.7308],
          [-74.0507, 4.7308],
          [-74.0507, 4.7268],
        ],
      ],
    },
    properties: {
      setuCcnct: '110010000300',
      areaName: 'Chapinero Alto',
      locality: 'Chapinero',
      demographics: {
        totalPopulation: 28000,
        children0_9: 1680,
        youth10_19: 2240,
        adults20_59: 18200,
        olderAdults60Plus: 5880,
        majorityStrata: '5',
        averageIPM: 0.22,
      },
    },
  },
  {
    id: 'sector_4',
    setuCcnct: '110010000400',
    name: 'Sector 4 - Teusaquillo',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-74.0697, 4.7198],
          [-74.0657, 4.7198],
          [-74.0657, 4.7238],
          [-74.0697, 4.7238],
          [-74.0697, 4.7198],
        ],
      ],
    },
    properties: {
      setuCcnct: '110010000400',
      areaName: 'Teusaquillo',
      locality: 'Teusaquillo',
      demographics: {
        totalPopulation: 32500,
        children0_9: 1950,
        youth10_19: 2600,
        adults20_59: 21125,
        olderAdults60Plus: 6825,
        majorityStrata: '4',
        averageIPM: 0.29,
      },
    },
  },
  {
    id: 'sector_5',
    setuCcnct: '110010000500',
    name: 'Sector 5 - Puente Aranda',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-74.1047, 4.6998],
          [-74.1007, 4.6998],
          [-74.1007, 4.7038],
          [-74.1047, 4.7038],
          [-74.1047, 4.6998],
        ],
      ],
    },
    properties: {
      setuCcnct: '110010000500',
      areaName: 'Puente Aranda',
      locality: 'Puente Aranda',
      demographics: {
        totalPopulation: 18500,
        children0_9: 1295,
        youth10_19: 1850,
        adults20_59: 11550,
        olderAdults60Plus: 3805,
        majorityStrata: '2',
        averageIPM: 0.52,
      },
    },
  },
  {
    id: 'sector_6',
    setuCcnct: '110010000600',
    name: 'Sector 6 - Kennedy',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-74.1367, 4.6538],
          [-74.1327, 4.6538],
          [-74.1327, 4.6578],
          [-74.1367, 4.6578],
          [-74.1367, 4.6538],
        ],
      ],
    },
    properties: {
      setuCcnct: '110010000600',
      areaName: 'Kennedy',
      locality: 'Kennedy',
      demographics: {
        totalPopulation: 45000,
        children0_9: 3150,
        youth10_19: 4500,
        adults20_59: 27000,
        olderAdults60Plus: 10350,
        majorityStrata: '3',
        averageIPM: 0.48,
      },
    },
  },
];

/**
 * POLLUTANTS available for visualization
 */
export const AVAILABLE_POLLUTANTS: Pollutant[] = [
  'PM2.5',
  'PM10',
  'NO2',
  'SO₂',
  'CO',
  'O₃',
  'Black Carbon',
];

/**
 * YEARS available in the dataset
 */
export const AVAILABLE_YEARS: Year[] = [
  2010,
  2011,
  2012,
  2013,
  2014,
  2015,
  2016,
  2017,
  2018,
];

/**
 * Default selected year
 * Important: The dashboard must open with 2018 by default
 */
export const DEFAULT_YEAR: Year = 2018;

/**
 * Mock annual pollutant concentrations
 * In production, these will be loaded from:
 * /public/data/geo/concentraciones_sector_censal.geojson or .json
 * or /public/data/tabular/concentraciones_sector_censal.csv
 *
 * Structure: SETU_CCNCT -> Pollutant -> Year -> Concentration value
 */
export function generateMockConcentrations(): PollutantConcentration[] {
  const concentrations: PollutantConcentration[] = [];

  // For each sector, year, and pollutant, generate realistic mock values
  // Values are loosely based on typical air quality ranges for Bogotá

  const concentrationRanges: Record<Pollutant, { min: number; max: number }> =
    {
      'PM2.5': { min: 15, max: 45 },
      'PM10': { min: 30, max: 80 },
      'NO2': { min: 20, max: 60 },
      'SO₂': { min: 5, max: 20 },
      'CO': { min: 0.5, max: 2.5 },
      'O₃': { min: 30, max: 80 },
      'Black Carbon': { min: 2, max: 8 },
    };

  MOCK_SECTORS.forEach((sector) => {
    AVAILABLE_YEARS.forEach((year) => {
      AVAILABLE_POLLUTANTS.forEach((pollutant) => {
        const range = concentrationRanges[pollutant];
        // Add some variation by year and sector
        const yearVariation = (year - 2010) * 0.5;
        const sectorVariation =
          Math.sin(sector.setuCcnct.charCodeAt(0)) * (range.max - range.min) * 0.1;

        let value: number | null =
          range.min + (range.max - range.min) * 0.5 + yearVariation + sectorVariation;
        value = Math.max(range.min, Math.min(range.max, value));

        // Add one missing value for demonstration (2011 PM2.5 for sector 5)
        if (sector.setuCcnct === '110010000500' && year === 2011 && pollutant === 'PM2.5') {
          value = null;
        }

        concentrations.push({
          setuCcnct: sector.setuCcnct,
          year,
          pollutant,
          concentration: value,
          unit: getUnitForPollutant(pollutant),
        });
      });
    });
  });

  return concentrations;
}

/**
 * Helper function to get the unit for each pollutant
 */
function getUnitForPollutant(pollutant: Pollutant): string {
  const units: Record<Pollutant, string> = {
    'PM2.5': 'µg/m³',
    'PM10': 'µg/m³',
    'NO2': 'ppb',
    'SO₂': 'ppb',
    'CO': 'ppm',
    'O₃': 'ppb',
    'Black Carbon': 'µg/m³',
  };
  return units[pollutant];
}

/**
 * Helper function to get concentration value for a specific sector, pollutant, and year
 */
export function getConcentrationValue(
  setuCcnct: string,
  pollutant: Pollutant,
  year: Year,
  allConcentrations: PollutantConcentration[],
): number | null {
  const result = allConcentrations.find(
    (c) => c.setuCcnct === setuCcnct && c.pollutant === pollutant && c.year === year,
  );
  return result?.concentration ?? null;
}

/**
 * Mock data summary:
 *
 * - 6 census sectors (SETU_CCNCT keys)
 * - 9 years (2010-2018)
 * - 7 pollutants
 * - 378 total concentration records
 * - 1 missing value (for demo)
 * - All with geographic coordinates and demographic data
 *
 * PRODUCTION: Replace mock data with:
 * 1. Real shapefiles converted to GeoJSON from BOGOTA_SECTOR_CENSAL folder
 * 2. Real concentrations from MEDIA_ZONAL_SECTOR_CENSAL_2010_2018.gpkg
 * 3. Real sociodemographic from SC_BOGOTA_VARIABLES_SOCIODEMO.xlsx
 *
 * Data loading will happen in src/utils/dataUtils.ts
 */
