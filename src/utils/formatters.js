/**
 * Formatting utilities for the dashboard
 */
/**
 * Format a number with decimals
 */
export function formatNumber(value, decimals = 1) {
    if (value === null || value === undefined) {
        return 'N/A';
    }
    return value.toFixed(decimals);
}
/**
 * Format a large number with thousand separators
 */
export function formatLargeNumber(value) {
    if (value === null || value === undefined) {
        return 'N/A';
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
/**
 * Format concentration with unit
 */
export function formatConcentrationWithUnit(value, pollutant, decimals = 2) {
    if (value === null || value === undefined) {
        return 'Sin dato';
    }
    const units = {
        'PM2.5': 'µg/m³',
        'PM10': 'µg/m³',
        'NO2': 'ppb',
        'SO₂': 'ppb',
        'CO': 'ppm',
        'O₃': 'ppb',
        'Black Carbon': 'µg/m³',
    };
    return `${value.toFixed(decimals)} ${units[pollutant]}`;
}
/**
 * Format percentage
 */
export function formatPercentage(value) {
    if (value === null || value === undefined) {
        return 'N/A';
    }
    return `${value.toFixed(1)}%`;
}
/**
 * Format IPM (Índice de Pobreza Multidimensional)
 */
export function formatIPM(value) {
    if (value === null || value === undefined) {
        return 'N/A';
    }
    return value.toFixed(3);
}
/**
 * Format sector identification
 */
export function formatSectorId(setuCcnct) {
    // SETU_CCNCT format: 11XXXX (11 is Bogotá code)
    // Could be further formatted if needed
    return setuCcnct;
}
/**
 * Get readable name for stratum
 */
export function getStratumName(stratum) {
    const stratumNames = {
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
export function calculateAgePercentage(ageGroupCount, totalPopulation) {
    if (totalPopulation === 0 || !totalPopulation) {
        return 0;
    }
    return (ageGroupCount / totalPopulation) * 100;
}
