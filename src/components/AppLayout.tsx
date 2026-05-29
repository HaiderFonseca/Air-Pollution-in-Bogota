/**
 * AppLayout Component
 * Map-first layout with floating panels
 */

import React from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from './DashboardHeader';
import { GeoMap } from './GeoMap';
import { SectorDetailPanel } from './SectorDetailPanel';
import { Legend } from './Legend';
import { SmokeTransition } from './SmokeTransition';
import { SectorFeature, Pollutant, Year, PollutantConcentration, SelectedSector } from '../types/dashboard';

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
}) => {
  const [showDetailPanel, setShowDetailPanel] = React.useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-screen bg-stone-50"
    >
      {/* Smoke transition overlay */}
      <SmokeTransition isActive={isTransitioning} />

      {/* Compact Header */}
      <div className="bg-white border-b border-stone-200">
        <DashboardHeader
          selectedPollutant={selectedPollutant}
          onPollutantChange={onPollutantChange}
          selectedYear={selectedYear}
          onYearChange={onYearChange}
          onCenterBogota={onCenterBogota}
        />
      </div>

      {/* Map area - Main protagonist (takes most of the screen) */}
      <motion.div
        layout
        className="flex-1 overflow-hidden relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <GeoMap
          sectors={sectors}
          concentrations={concentrations}
          selectedPollutant={selectedPollutant}
          selectedYear={selectedYear}
          selectedSectorId={selectedSector?.setuCcnct || null}
          onSectorSelect={onSectorSelect}
        />

        {/* Floating Legend Panel - Lower left corner */}
        <motion.div
          className="absolute bottom-6 left-6 z-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden">
            <div className="p-4">
              <Legend pollutant={selectedPollutant} />
            </div>
          </div>
        </motion.div>

        {/* Floating Detail Panel - Right side */}
        {selectedSector && showDetailPanel && (
          <motion.div
            className="absolute top-6 right-6 bottom-6 z-40 w-96 overflow-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
              {/* Close button */}
              <div className="flex justify-end p-4 border-b border-stone-100">
                <button
                  onClick={() => {
                    setShowDetailPanel(false);
                    onSectorDeselect();
                  }}
                  className="text-stone-400 hover:text-stone-600 transition-colors"
                  aria-label="Close detail panel"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              
              {/* Detail panel content */}
              <div className="flex-1 overflow-auto">
                <SectorDetailPanel
                  sector={selectedSector}
                  selectedPollutant={selectedPollutant}
                  selectedYear={selectedYear}
                  onClose={() => {
                    setShowDetailPanel(false);
                    onSectorDeselect();
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AppLayout;
