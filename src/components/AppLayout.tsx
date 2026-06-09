import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from './DashboardHeader';
import { GeoMap } from './GeoMap';
import { SectorDetailPanel } from './SectorDetailPanel';
import { Legend } from './Legend';
import { SmokeTransition } from './SmokeTransition';
import {
  SectorFeature,
  Pollutant,
  Year,
  PollutantConcentration,
  SelectedSector,
  LisaCluster,
  PersistenceData,
  LayerMode,
} from '../types/dashboard';

interface AppLayoutProps {
  sectors: SectorFeature[];
  concentrations: PollutantConcentration[];
  selectedPollutant: Pollutant;
  onPollutantChange: (pollutant: Pollutant) => void;
  selectedYear: Year;
  onYearChange: (year: Year) => void;
  selectedSector: SelectedSector | null;
  onSectorSelect: (setuCcnct: string) => void;
  onSectorDeselect: () => void;
  onCenterBogota: () => void;
  isTransitioning: boolean;
  centerTrigger: number;
  layerMode: LayerMode;
  onLayerModeChange: (mode: LayerMode) => void;
  lisaIndex: Map<string, LisaCluster>;
  lisaBivIndex: Map<string, LisaCluster>;
  persistenceData: Map<string, PersistenceData>;
  lisaAvailable: boolean;
  lisaBivAvailable: boolean;
  currentLisaCluster: LisaCluster | null;
  currentBivariateCluster: LisaCluster | null;
  currentPersistenceInfo: PersistenceData | null;
  maxHHYearsCount: number;
  bivariateYear: 2023 | 2024;
  concP5: number;
  concP95: number;
}

const LAYER_OPTIONS: { value: LayerMode; label: string }[] = [
  { value: 'concentracion',    label: 'Concentración' },
  { value: 'lisa_univariado',  label: 'LISA univariado' },
  { value: 'lisa_bivariado',   label: 'LISA bivariado' },
];

export const AppLayout: React.FC<AppLayoutProps> = ({
  sectors,
  concentrations,
  selectedPollutant,
  onPollutantChange,
  selectedYear,
  onYearChange,
  selectedSector,
  onSectorSelect,
  onSectorDeselect,
  onCenterBogota,
  isTransitioning,
  centerTrigger,
  layerMode,
  onLayerModeChange,
  lisaIndex,
  lisaBivIndex,
  persistenceData,
  lisaAvailable,
  lisaBivAvailable,
  currentLisaCluster,
  currentBivariateCluster,
  currentPersistenceInfo,
  maxHHYearsCount,
  bivariateYear,
  concP5,
  concP95,
}) => {
  const [showDetailPanel, setShowDetailPanel] = React.useState(false);

  useEffect(() => {
    if (selectedSector) setShowDetailPanel(true);
  }, [selectedSector?.setuCcnct]);

  // Unavailability notice text
  const unavailableNotice = (() => {
    if (layerMode === 'lisa_univariado' && !lisaAvailable) {
      return 'Sin capa LISA univariado para esta combinación.';
    }
    if (layerMode === 'lisa_bivariado' && !lisaBivAvailable) {
      return `LISA bivariado no disponible (ejecute scripts/convert_lisa_bivariado.py).`;
    }
    return null;
  })();

  // Bivariate year info text
  const bivariateInfo = layerMode === 'lisa_bivariado'
    ? (selectedPollutant === 'eBC'
        ? 'Mostrando LISA bivariado 2023 para eBC'
        : `Mostrando LISA bivariado ${bivariateYear}`)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen bg-stone-50"
    >
      <SmokeTransition isActive={isTransitioning} />

      <div className="bg-white border-b border-stone-200">
        <DashboardHeader
          selectedPollutant={selectedPollutant}
          onPollutantChange={onPollutantChange}
          selectedYear={selectedYear}
          onYearChange={onYearChange}
          onCenterBogota={onCenterBogota}
        />
      </div>

      {/* Map fills the rest of the screen */}
      <div className="flex-1 overflow-hidden relative">
        <GeoMap
          sectors={sectors}
          concentrations={concentrations}
          selectedPollutant={selectedPollutant}
          selectedYear={selectedYear}
          selectedSectorId={selectedSector?.setuCcnct || null}
          onSectorSelect={onSectorSelect}
          centerTrigger={centerTrigger}
          layerMode={layerMode}
          lisaIndex={lisaIndex}
          lisaBivIndex={lisaBivIndex}
          persistenceData={persistenceData}
          bivariateYear={bivariateYear}
          concP5={concP5}
          concP95={concP95}
        />

        {/* Layer selector — top-left segmented control */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5" style={{ zIndex: 1000 }}>
          <div className="flex bg-white/95 backdrop-blur-sm rounded-full shadow border border-stone-200 p-0.5 gap-0.5">
            {LAYER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onLayerModeChange(opt.value)}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium transition-all duration-150
                  ${layerMode === opt.value
                    ? 'bg-stone-800 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100'}
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Bivariate year notice */}
          {bivariateInfo && (
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow border border-stone-200 text-xs text-stone-500">
              {bivariateInfo}
            </div>
          )}

          {/* Unavailability warning */}
          {unavailableNotice && (
            <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow border border-amber-200 text-xs text-amber-700 max-w-[240px]">
              {unavailableNotice}
            </div>
          )}
        </div>

        {/* Floating Legend — bottom-left */}
        <motion.div
          className="absolute bottom-6 left-4"
          style={{ zIndex: 1000 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
            <div className="p-3">
              <Legend
                pollutant={selectedPollutant}
                layerMode={layerMode}
                concP5={concP5}
                concP95={concP95}
                maxHHYearsCount={maxHHYearsCount}
                bivariateYear={bivariateYear}
              />
            </div>
          </div>
        </motion.div>

        {/* Floating Detail Panel — right */}
        {selectedSector && showDetailPanel && (
          <motion.div
            className="absolute top-4 right-4 bottom-4"
            style={{ zIndex: 1000, width: '22rem' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
              <div className="flex-1 overflow-auto">
                <SectorDetailPanel
                  sector={selectedSector}
                  selectedPollutant={selectedPollutant}
                  selectedYear={selectedYear}
                  layerMode={layerMode}
                  lisaCluster={currentLisaCluster}
                  bivariateCluster={currentBivariateCluster}
                  persistenceInfo={currentPersistenceInfo}
                  bivariateYear={bivariateYear}
                  onClose={() => {
                    setShowDetailPanel(false);
                    onSectorDeselect();
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AppLayout;
