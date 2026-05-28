/**
 * Data utilities for loading and processing dashboard data
 *
 * PRODUCTION NOTES:
 * - This file currently loads mock data
 * - To connect real data, replace the mock loading functions with actual GeoJSON/JSON/CSV loading
 * - Keep the same interface structure so component code doesn't need to change
 */
import { MOCK_SECTORS, AVAILABLE_POLLUTANTS, AVAILABLE_YEARS, generateMockConcentrations, getConcentrationValue, } from '../data/mockData';
/**
 * Load census sectors (currently from mock data)
 * PRODUCTION: Load from /public/data/geo/sectores_censales_bogota.geojson
 *
 * @returns Promise<SectorFeature[]>
 */
export async function loadSectors() {
    // For mock data, just return immediately
    // In production, use:
    // const response = await fetch('/data/geo/sectores_censales_bogota.geojson');
    // const geojson = await response.json();
    // return geojson.features.map(convertGeoJSONFeature);
    return Promise.resolve(MOCK_SECTORS);
}
/**
 * Load pollutant concentrations (currently from mock data)
 * PRODUCTION: Load from /public/data/geo/concentraciones_sector_censal.geojson
 * or /public/data/geo/concentraciones_sector_censal.json
 *
 * @returns Promise<PollutantConcentration[]>
 */
export async function loadConcentrations() {
    // For mock data, generate and return
    // In production, use:
    // const response = await fetch('/data/geo/concentraciones_sector_censal.geojson');
    // const data = await response.json();
    // return data.features.map(convertConcentration);
    return Promise.resolve(generateMockConcentrations());
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
export function getSectorData(setuCcnct, sectors, concentrations) {
    const sector = sectors.find((s) => s.setuCcnct === setuCcnct);
    if (!sector) {
        return null;
    }
    // Build concentration data for this sector (join by SETU_CCNCT)
    const sectorConcentrations = {};
    AVAILABLE_POLLUTANTS.forEach((pollutant) => {
        sectorConcentrations[pollutant] = {};
        AVAILABLE_YEARS.forEach((year) => {
            const value = getConcentrationValue(setuCcnct, pollutant, year, concentrations);
            sectorConcentrations[pollutant][year] = value;
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
export function getConcentration(setuCcnct, pollutant, year, concentrations) {
    return getConcentrationValue(setuCcnct, pollutant, year, concentrations);
}
/**
 * Get all concentration values for a specific pollutant and year
 * Used for calculating map color scale ranges
 */
export function getConcentrationRange(pollutant, year, concentrations) {
    const values = concentrations
        .filter((c) => c.pollutant === pollutant && c.year === year && c.concentration !== null)
        .map((c) => c.concentration);
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
export function convertGeoJSONFeature(feature) {
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
                adults20_59: (feature.properties.STP34_3_ED || 0) +
                    (feature.properties.STP34_4_ED || 0) +
                    (feature.properties.STP34_5_ED || 0) +
                    (feature.properties.STP34_6_ED || 0),
                olderAdults60Plus: (feature.properties.STP34_7_ED || 0) +
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
export function convertConcentrationRecord(record) {
    // This is a template for future implementation
    return {
        setuCcnct: record.SETU_CCNCT || record.setuCcnct,
        year: parseInt(record.year || record.YEAR),
        pollutant: record.pollutant,
        concentration: record.concentration || null,
        unit: record.unit,
    };
}
/**
 * Check if a value is missing data
 */
export function isMissingData(value) {
    return value === null || value === undefined;
}
