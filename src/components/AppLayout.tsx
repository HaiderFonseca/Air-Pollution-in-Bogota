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
  showLisa: boolean;
  onToggleLisa: () => void;
  lisaIndex: Map<string, LisaCluster>;
  lisaAvailable: boolean;
  currentLisaCluster: LisaCluster | null;
  concP5: number;
  concP95: number;
}

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
  showLisa,
  onToggleLisa,
  lisaIndex,
  lisaAvailable,
  currentLisaCluster,
  concP5,
  concP95,
}) => {
  const [showDetailPanel, setShowDetailPanel] = React.useState(false);

  useEffect(() => {
    if (selectedSector) setShowDetailPanel(true);
  }, [selectedSector?.setuCcnct]);

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
          showLisa={showLisa}
          lisaIndex={lisaIndex}
          concP5={concP5}
          concP95={concP95}
        />

        {/* LISA toggle — top-left pill */}
        <div className="absolute top-4 left-4" style={{ zIndex: 1000 }}>
          <button
            onClick={onToggleLisa}
            className={`
              px-4 py-1.5 rounded-full text-sm font-semibold shadow-md
              border transition-all duration-200
              ${showLisa
                ? 'bg-stone-800 text-white border-stone-900'
                : 'bg-white/90 text-stone-700 border-stone-300 hover:bg-stone-100'}
            `}
          >
            Clusters LISA
          </button>
          {showLisa && !lisaAvailable && (
            <div className="mt-2 bg-white/95 rounded-lg px-3 py-2 shadow text-xs text-stone-500 max-w-[200px]">
              No hay capa LISA disponible para esta combinación
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
                showLisa={showLisa}
                concP5={concP5}
                concP95={concP95}
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
                  lisaCluster={currentLisaCluster}
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
