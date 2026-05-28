/**
 * TypeScript type definitions for the Air Pollution Dashboard
 */

export type Pollutant = 'PM2.5' | 'PM10' | 'NO2' | 'SO₂' | 'CO' | 'O₃' | 'Black Carbon';

export type Year = 2010 | 2011 | 2012 | 2013 | 2014 | 2015 | 2016 | 2017 | 2018;

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
  children0_9: number; // STP34_1_ED
  youth10_19: number; // STP34_2_ED
  adults20_59: number; // STP34_3_ED + STP34_4_ED + STP34_5_ED + STP34_6_ED
  olderAdults60Plus: number; // STP34_7_ED + STP34_8_ED + STP34_9_ED
  majorityStrata: string; // ESTRATO_MAYORITARIO
  averageIPM: number; // IPM_PROMEDIO
}

/**
 * Annual pollutant concentration for a sector
 */
export interface PollutantConcentration {
  setuCcnct: string;
  year: Year;
  pollutant: Pollutant;
  concentration: number | null; // null for missing data
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
 * Map bounds for Bogotá and Colombia
 */
export interface MapBounds {
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
}
