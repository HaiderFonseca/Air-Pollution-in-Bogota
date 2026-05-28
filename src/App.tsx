/**
 * Main App Component
 * Manages all dashboard state and orchestrates data loading
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AppLayout } from './components/AppLayout';
import { LoadingState } from './components/LoadingState';
import { SectorFeature, Pollutant, Year, PollutantConcentration, SelectedSector } from './types/dashboard';
import { loadSectors, loadConcentrations, getSectorData } from './utils/dataUtils';
import { DEFAULT_YEAR } from './data/mockData';

export const App: React.FC = () => {
  // Data state
  const [sectors, setSectors] = useState<SectorFeature[]>([]);
  const [concentrations, setConcentrations] = useState<PollutantConcentration[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [selectedPollutant, setSelectedPollutant] = useState<Pollutant>('PM2.5');
  const [selectedYear, setSelectedYear] = useState<Year>(DEFAULT_YEAR);
  const [selectedSector, setSelectedSector] = useState<SelectedSector | null>(null);
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
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle pollutant change with transition
  const handlePollutantChange = useCallback((pollutant: Pollutant) => {
    setIsTransitioning(true);
    // Simulate smooth transition
    setTimeout(() => {
      setSelectedPollutant(pollutant);
      setIsTransitioning(false);
    }, 800);
  }, []);

  // Handle year change
  const handleYearChange = useCallback((year: Year) => {
    setSelectedYear(year);
  }, []);

  // Handle sector selection
  const handleSectorSelect = useCallback(
    (setuCcnct: string) => {
      const sectorData = getSectorData(setuCcnct, sectors, concentrations);
      setSelectedSector(sectorData);
    },
    [sectors, concentrations],
  );

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
    return <LoadingState />;
  }

  return (
    <AppLayout
      sectors={sectors}
      concentrations={concentrations}
      selectedPollutant={selectedPollutant}
      onPollutantChange={handlePollutantChange}
      selectedYear={selectedYear}
      onYearChange={handleYearChange}
      selectedSector={selectedSector}
      onSectorSelect={handleSectorSelect}
      onSectorDeselect={handleSectorDeselect}
      onCenterBogota={handleCenterBogota}
      isTransitioning={isTransitioning}
    />
  );
};

export default App;
