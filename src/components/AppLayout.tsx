/**
 * AppLayout Component
 * Main layout combining all dashboard components
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

      {/* Header */}
      <DashboardHeader
        selectedPollutant={selectedPollutant}
        onPollutantChange={onPollutantChange}
        selectedYear={selectedYear}
        onYearChange={onYearChange}
        onCenterBogota={onCenterBogota}
      />

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex gap-6 p-6 max-w-7xl mx-auto w-full">
          {/* Map area - Main protagonist */}
          <motion.div
            layout
            className="flex-1 flex flex-col"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
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

            {/* Legend below map */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Legend pollutant={selectedPollutant} />
            </motion.div>
          </motion.div>

          {/* Right sidebar - Detail panel */}
          <motion.div
            layout
            className="w-96 flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SectorDetailPanel
              sector={selectedSector}
              selectedPollutant={selectedPollutant}
              selectedYear={selectedYear}
              onClose={selectedSector ? onSectorDeselect : undefined}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
