/**
 * TypeScript type definitions for the Air Pollution Dashboard
 */

export type Pollutant = 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'O3' | 'eBC';

export type LisaCluster = 'HH' | 'LL' | 'HL' | 'LH' | 'NS';

/** Which layer is shown on the map */
export type LayerMode = 'concentracion' | 'lisa_univariado' | 'lisa_bivariado';

export interface LisaRecord {
  setuCcnct: string;
  pollutant: Pollutant;
  year: Year;
  cluster: LisaCluster;
}

/** One LISA bivariate record (one year per pollutant) */
export interface LisaBivariateRecord {
  setuCcnct: string;
  pollutant: Pollutant;
  year: number; // 2024 for most pollutants, 2023 for eBC
  LISA_bi_clase: LisaCluster;
}

/**
 * Persistence data for a single (sector, pollutant, targetYear) combination.
 * Counts how many years up to targetYear had HH classification in LISA univariado.
 */
export interface PersistenceData {
  /** Total years of LISA univariado data available up to targetYear */
  totalYearsAvailable: number;
  /** Number of those years where cluster === 'HH' */
  HHYearsCount: number;
  /** Sorted list of years where cluster === 'HH' */
  HHYearsList: number[];
  /**
   * Intensity relative to the maximum HH count observed across all sectors
   * for this pollutant and targetYear. Range [0, 1].
   */
  persistenceIntensity: number;
  /** The maximum HH count observed (denominator for intensity) */
  maxHHYearsCount: number;
}

export type Year = 2010 | 2011 | 2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024;

/**
 * Census sector with geographic and demographic data
 */
export interface SectorFeature {
  id: string;
  setuCcnct: string; // Main key: SETU_CCNCT
  name: string;
  geometry: GeoJSONGeometry;
  properties: SectorProperties;
}

/**
 * Properties of a census sector
 */
export interface SectorProperties {
  setuCcnct: string;
  areaName: string;
  locality: string;
  demographics: SectorDemographics;
}

/**
 * Demographic data (constant across years)
 */
export interface SectorDemographics {
  totalPopulation: number; // STP27_PERS
  children0_9: number;     // STP34_1_ED
  youth10_19: number;      // STP34_2_ED
  adults20_59: number;     // STP34_3_ED + … + STP34_6_ED
  olderAdults60Plus: number; // STP34_7_ED + … + STP34_9_ED
  majorityStrata: string;  // ESTRATO_MAYORITARIO
  averageIPM: number;      // IPM_PROMEDIO
}

/**
 * Annual pollutant concentration for a sector
 */
export interface PollutantConcentration {
  setuCcnct: string;
  year: Year;
  pollutant: Pollutant;
  concentration: number | null;
  unit?: string;
}

/**
 * Selected sector with current concentration data
 */
export interface SelectedSector {
  setuCcnct: string;
  name: string;
  geometry: GeoJSONGeometry;
  demographics: SectorDemographics;
  concentrations: {
    [key in Pollutant]?: {
      [key in Year]?: number | null;
    };
  };
}

/**
 * GeoJSON geometry types
 */
export interface GeoJSONGeometry {
  type: 'Polygon' | 'MultiPolygon' | 'Point';
  coordinates: any;
}

/**
 * Color scale for pollutant concentrations
 */
export interface ColorScale {
  pollutant: Pollutant;
  min: number;
  max: number;
  colors: string[];
  breaks: number[];
  unit: string;
}

/**
 * Dashboard state
 */
export interface DashboardState {
  selectedPollutant: Pollutant;
  selectedYear: Year;
  selectedSector: SelectedSector | null;
  availableYears: Year[];
  sectors: SectorFeature[];
  concentrations: PollutantConcentration[];
  colorScale: ColorScale | null;
}

/**
 * Map bounds for Bogotá
 */
export interface MapBounds {
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
}
