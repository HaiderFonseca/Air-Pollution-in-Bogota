import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Main App Component
 * Manages all dashboard state and orchestrates data loading
 */
import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from './components/AppLayout';
import { LoadingState } from './components/LoadingState';
import { loadSectors, loadConcentrations, getSectorData } from './utils/dataUtils';
import { DEFAULT_YEAR } from './data/mockData';
export const App = () => {
    // Data state
    const [sectors, setSectors] = useState([]);
    const [concentrations, setConcentrations] = useState([]);
    const [loading, setLoading] = useState(true);
    // UI state
    const [selectedPollutant, setSelectedPollutant] = useState('PM2.5');
    const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR);
    const [selectedSector, setSelectedSector] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [loadedSectors, loadedConcentrations] = await Promise.all([
                    loadSectors(),
                    loadConcentrations(),
                ]);
                setSectors(loadedSectors);
                setConcentrations(loadedConcentrations);
            }
            catch (error) {
                console.error('Error loading data:', error);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    // Handle pollutant change with transition
    const handlePollutantChange = useCallback((pollutant) => {
        setIsTransitioning(true);
        // Simulate smooth transition
        setTimeout(() => {
            setSelectedPollutant(pollutant);
            setIsTransitioning(false);
        }, 800);
    }, []);
    // Handle year change
    const handleYearChange = useCallback((year) => {
        setSelectedYear(year);
    }, []);
    // Handle sector selection
    const handleSectorSelect = useCallback((setuCcnct) => {
        const sectorData = getSectorData(setuCcnct, sectors, concentrations);
        setSelectedSector(sectorData);
    }, [sectors, concentrations]);
    // Handle sector deselection
    const handleSectorDeselect = useCallback(() => {
        setSelectedSector(null);
    }, []);
    // Handle center Bogotá button
    const handleCenterBogota = useCallback(() => {
        // Map will be centered via MapCenterController component
        console.log('Centering map to Bogotá');
    }, []);
    if (loading) {
        return _jsx(LoadingState, {});
    }
    return (_jsx(AppLayout, { sectors: sectors, concentrations: concentrations, selectedPollutant: selectedPollutant, onPollutantChange: handlePollutantChange, selectedYear: selectedYear, onYearChange: handleYearChange, selectedSector: selectedSector, onSectorSelect: handleSectorSelect, onSectorDeselect: handleSectorDeselect, onCenterBogota: handleCenterBogota, isTransitioning: isTransitioning }));
};
export default App;
