import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppLayout } from './components/AppLayout';
import { LoadingState } from './components/LoadingState';
import {
  SectorFeature,
  Pollutant,
  Year,
  PollutantConcentration,
  SelectedSector,
  LisaRecord,
  LisaCluster,
} from './types/dashboard';
import {
  loadSectors,
  loadConcentrations,
  getSectorData,
  normalizeSectorId,
  loadLisaClusters,
} from './utils/dataUtils';
import { DEFAULT_YEAR } from './data/mockData';

export const App: React.FC = () => {
  const [sectors, setSectors] = useState<SectorFeature[]>([]);
  const [concentrations, setConcentrations] = useState<PollutantConcentration[]>([]);
  const [lisaClusters, setLisaClusters] = useState<LisaRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPollutant, setSelectedPollutant] = useState<Pollutant>('PM2.5');
  const [selectedYear, setSelectedYear] = useState<Year>(DEFAULT_YEAR);
  const [selectedSector, setSelectedSector] = useState<SelectedSector | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [centerTrigger, setCenterTrigger] = useState(0);
  const [showLisa, setShowLisa] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [loadedSectors, loadedConcentrations, loadedLisa] = await Promise.all([
          loadSectors(),
          loadConcentrations(),
          loadLisaClusters(),
        ]);
        setSectors(loadedSectors);
        setConcentrations(loadedConcentrations);
        setLisaClusters(loadedLisa);

        if (import.meta.env.DEV) {
          const sectorIds = new Set(loadedSectors.map(s => s.setuCcnct));
          const concIds = new Set(loadedConcentrations.map(c => c.setuCcnct));
          const matchCount = [...sectorIds].filter(id => concIds.has(id)).length;
          console.log(`[DEV] Sector–concentration matches: ${matchCount} / ${sectorIds.size}`);
          console.log(`[DEV] LISA records loaded: ${loadedLisa.length}`);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // O(1) LISA lookup index
  const lisaIndex = useMemo(() => {
    const idx = new Map<string, LisaCluster>();
    lisaClusters.forEach(r => {
      idx.set(`${r.setuCcnct}|${r.pollutant}|${r.year}`, r.cluster);
    });
    return idx;
  }, [lisaClusters]);

  // Percentiles p5/p95 for current pollutant+year (continuous color scale)
  const { concP5, concP95 } = useMemo(() => {
    const vals = concentrations
      .filter(c => c.pollutant === selectedPollutant && c.year === selectedYear && c.concentration !== null)
      .map(c => c.concentration as number)
      .sort((a, b) => a - b);
    if (vals.length === 0) return { concP5: 0, concP95: 0 };
    return {
      concP5: vals[Math.max(0, Math.floor(vals.length * 0.05))],
      concP95: vals[Math.min(vals.length - 1, Math.floor(vals.length * 0.95))],
    };
  }, [concentrations, selectedPollutant, selectedYear]);

  // Current LISA cluster for selected sector
  const currentLisaCluster: LisaCluster | null = useMemo(() => {
    if (!selectedSector) return null;
    const key = `${selectedSector.setuCcnct}|${selectedPollutant}|${selectedYear}`;
    return lisaIndex.get(key) ?? null;
  }, [selectedSector, selectedPollutant, selectedYear, lisaIndex]);

  // Whether LISA data exists for current pollutant+year
  const lisaAvailable = useMemo(() => {
    const key = `|${selectedPollutant}|${selectedYear}`;
    for (const k of lisaIndex.keys()) {
      if (k.endsWith(key)) return true;
    }
    return false;
  }, [lisaIndex, selectedPollutant, selectedYear]);

  const handlePollutantChange = useCallback((pollutant: Pollutant) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedPollutant(pollutant);
      setIsTransitioning(false);
    }, 800);
  }, []);

  const handleYearChange = useCallback((year: Year) => {
    setSelectedYear(year);
  }, []);

  const handleSectorSelect = useCallback(
    (setuCcnct: string) => {
      const normalizedId = normalizeSectorId(setuCcnct);
      if (import.meta.env.DEV) {
        console.log(`[DEV] Sector clicked: ${normalizedId}`);
      }
      setSelectedSector(getSectorData(normalizedId, sectors, concentrations));
    },
    [sectors, concentrations],
  );

  const handleSectorDeselect = useCallback(() => {
    setSelectedSector(null);
  }, []);

  const handleCenterBogota = useCallback(() => {
    setCenterTrigger(t => t + 1);
  }, []);

  const handleToggleLisa = useCallback(() => {
    setShowLisa(v => !v);
  }, []);

  if (loading) return <LoadingState />;

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
      centerTrigger={centerTrigger}
      showLisa={showLisa}
      onToggleLisa={handleToggleLisa}
      lisaIndex={lisaIndex}
      lisaAvailable={lisaAvailable}
      currentLisaCluster={currentLisaCluster}
      concP5={concP5}
      concP95={concP95}
    />
  );
};

export default App;
