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
  LisaBivariateRecord,
  PersistenceData,
  LayerMode,
} from './types/dashboard';
import {
  loadSectors,
  loadConcentrations,
  getSectorData,
  normalizeSectorId,
  loadLisaClusters,
  loadLisaBivariado,
} from './utils/dataUtils';
import { DEFAULT_YEAR } from './data/mockData';

/** Year of bivariate LISA data available per pollutant */
export function getBivariateYear(pollutant: Pollutant): 2023 | 2024 {
  return pollutant === 'eBC' ? 2023 : 2024;
}

export const App: React.FC = () => {
  // ── Data state ──────────────────────────────────────────────────────────────
  const [sectors, setSectors] = useState<SectorFeature[]>([]);
  const [concentrations, setConcentrations] = useState<PollutantConcentration[]>([]);
  const [lisaClusters, setLisaClusters] = useState<LisaRecord[]>([]);
  const [lisaBivariado, setLisaBivariado] = useState<LisaBivariateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [selectedPollutant, setSelectedPollutant] = useState<Pollutant>('PM2.5');
  const [selectedYear, setSelectedYear] = useState<Year>(DEFAULT_YEAR);
  const [selectedSector, setSelectedSector] = useState<SelectedSector | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [centerTrigger, setCenterTrigger] = useState(0);
  const [layerMode, setLayerMode] = useState<LayerMode>('concentracion');

  // ── Data loading ────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [loadedSectors, loadedConcentrations, loadedLisa, loadedBivariado] = await Promise.all([
          loadSectors(),
          loadConcentrations(),
          loadLisaClusters(),
          loadLisaBivariado(),
        ]);
        setSectors(loadedSectors);
        setConcentrations(loadedConcentrations);
        setLisaClusters(loadedLisa);
        setLisaBivariado(loadedBivariado);

        if (import.meta.env.DEV) {
          const sectorIds = new Set(loadedSectors.map(s => s.setuCcnct));
          const concIds = new Set(loadedConcentrations.map(c => c.setuCcnct));
          const matchCount = [...sectorIds].filter(id => concIds.has(id)).length;
          console.log(`[DEV] Sector–concentration matches: ${matchCount} / ${sectorIds.size}`);
          console.log(`[DEV] LISA univariado records: ${loadedLisa.length}`);
          console.log(`[DEV] LISA bivariado records: ${loadedBivariado.length}`);

          // Verify bivariate join quality per pollutant
          const bivPollutants = ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3', 'eBC'] as const;
          bivPollutants.forEach(p => {
            const bivIds = new Set(loadedBivariado.filter(r => r.pollutant === p).map(r => r.setuCcnct));
            const joined = [...bivIds].filter(id => sectorIds.has(id)).length;
            const clusterCounts = loadedBivariado.filter(r => r.pollutant === p)
              .reduce((acc, r) => { acc[r.LISA_bi_clase] = (acc[r.LISA_bi_clase] || 0) + 1; return acc; }, {} as Record<string, number>);
            console.log(`[DEV] Bivariado ${p}: ${bivIds.size} sectors, ${joined} matched with base layer, clusters:`, clusterCounts);
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ── O(1) LISA univariado index: "setuCcnct|pollutant|year" → cluster ────────
  const lisaIndex = useMemo(() => {
    const idx = new Map<string, LisaCluster>();
    lisaClusters.forEach(r => {
      idx.set(`${r.setuCcnct}|${r.pollutant}|${r.year}`, r.cluster);
    });
    return idx;
  }, [lisaClusters]);

  // ── O(1) LISA bivariado index: "setuCcnct|pollutant" → cluster ──────────────
  // (one year per pollutant, so year is implicit)
  const lisaBivIndex = useMemo(() => {
    const idx = new Map<string, LisaCluster>();
    lisaBivariado.forEach(r => {
      idx.set(`${r.setuCcnct}|${r.pollutant}`, r.LISA_bi_clase);
    });
    return idx;
  }, [lisaBivariado]);

  // ── Percentiles p5/p95 for current pollutant+year (concentration layer) ─────
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

  // ── Persistence data: dynamic, based on selected pollutant + active year ────
  // For bivariado, uses getBivariateYear; for univariado, uses selectedYear.
  const persistenceData = useMemo((): Map<string, PersistenceData> => {
    const targetYear = layerMode === 'lisa_bivariado'
      ? getBivariateYear(selectedPollutant)
      : selectedYear;

    // Group records by setuCcnct for current pollutant, year ≤ targetYear
    const bySector = new Map<string, { year: number; cluster: LisaCluster }[]>();
    for (const r of lisaClusters) {
      if (r.pollutant !== selectedPollutant) continue;
      if (r.year > targetYear) continue;
      const arr = bySector.get(r.setuCcnct);
      if (arr) {
        arr.push({ year: r.year, cluster: r.cluster });
      } else {
        bySector.set(r.setuCcnct, [{ year: r.year, cluster: r.cluster }]);
      }
    }

    // Compute raw counts, then find global max
    let maxHH = 0;
    const rawData = new Map<string, { totalYears: number; HHCount: number; HHList: number[] }>();
    for (const [setuCcnct, records] of bySector) {
      const HHList = records.filter(r => r.cluster === 'HH').map(r => r.year).sort((a, b) => a - b);
      rawData.set(setuCcnct, {
        totalYears: records.length,
        HHCount: HHList.length,
        HHList,
      });
      if (HHList.length > maxHH) maxHH = HHList.length;
    }

    // Add intensity relative to global max
    const result = new Map<string, PersistenceData>();
    for (const [setuCcnct, data] of rawData) {
      result.set(setuCcnct, {
        totalYearsAvailable: data.totalYears,
        HHYearsCount: data.HHCount,
        HHYearsList: data.HHList,
        persistenceIntensity: maxHH > 0 ? data.HHCount / maxHH : 0,
        maxHHYearsCount: maxHH,
      });
    }
    return result;
  }, [lisaClusters, selectedPollutant, selectedYear, layerMode]);

  // ── Global max HH (for legend scale) ─────────────────────────────────────────
  const maxHHYearsCount = useMemo(() => {
    for (const d of persistenceData.values()) return d.maxHHYearsCount;
    return 0;
  }, [persistenceData]);

  // ── Whether LISA data exists for current pollutant+year ────────────────────
  const lisaAvailable = useMemo(() => {
    const key = `|${selectedPollutant}|${selectedYear}`;
    for (const k of lisaIndex.keys()) {
      if (k.endsWith(key)) return true;
    }
    return false;
  }, [lisaIndex, selectedPollutant, selectedYear]);

  // ── Whether bivariate data exists for current pollutant ────────────────────
  const lisaBivAvailable = useMemo(() => {
    const prefix = `|${selectedPollutant}`;
    for (const k of lisaBivIndex.keys()) {
      if (k.endsWith(prefix)) return true;
    }
    return false;
  }, [lisaBivIndex, selectedPollutant]);

  // ── Current LISA univariado cluster for selected sector ────────────────────
  const currentLisaCluster: LisaCluster | null = useMemo(() => {
    if (!selectedSector) return null;
    const key = `${selectedSector.setuCcnct}|${selectedPollutant}|${selectedYear}`;
    return lisaIndex.get(key) ?? null;
  }, [selectedSector, selectedPollutant, selectedYear, lisaIndex]);

  // ── Current LISA bivariado cluster for selected sector ─────────────────────
  const currentBivariateCluster: LisaCluster | null = useMemo(() => {
    if (!selectedSector) return null;
    return lisaBivIndex.get(`${selectedSector.setuCcnct}|${selectedPollutant}`) ?? null;
  }, [selectedSector, selectedPollutant, lisaBivIndex]);

  // ── Persistence info for selected sector ────────────────────────────────────
  const currentPersistenceInfo: PersistenceData | null = useMemo(() => {
    if (!selectedSector) return null;
    return persistenceData.get(selectedSector.setuCcnct) ?? null;
  }, [selectedSector, persistenceData]);

  // ── Handlers ────────────────────────────────────────────────────────────────
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

  const handleLayerModeChange = useCallback((mode: LayerMode) => {
    setLayerMode(mode);
  }, []);

  if (loading) return <LoadingState />;

  const bivariateYear = getBivariateYear(selectedPollutant);

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
      layerMode={layerMode}
      onLayerModeChange={handleLayerModeChange}
      lisaIndex={lisaIndex}
      lisaBivIndex={lisaBivIndex}
      persistenceData={persistenceData}
      lisaAvailable={lisaAvailable}
      lisaBivAvailable={lisaBivAvailable}
      currentLisaCluster={currentLisaCluster}
      currentBivariateCluster={currentBivariateCluster}
      currentPersistenceInfo={currentPersistenceInfo}
      maxHHYearsCount={maxHHYearsCount}
      bivariateYear={bivariateYear}
      concP5={concP5}
      concP95={concP95}
    />
  );
};

export default App;
