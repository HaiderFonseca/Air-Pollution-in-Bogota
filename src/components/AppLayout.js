import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * AppLayout Component
 * Main layout combining all dashboard components
 */
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { DashboardHeader } from './DashboardHeader';
import { GeoMap } from './GeoMap';
import { SectorDetailPanel } from './SectorDetailPanel';
import { Legend } from './Legend';
import { SmokeTransition } from './SmokeTransition';
export const AppLayout = ({ sectors, concentrations, selectedPollutant, onPollutantChange, selectedYear, onYearChange, selectedSector, onSectorSelect, onSectorDeselect, onCenterBogota, isTransitioning, }) => {
    const mapRef = useRef(null);
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.5 }, className: "flex flex-col h-screen bg-stone-50", children: [_jsx(SmokeTransition, { isActive: isTransitioning }), _jsx(DashboardHeader, { selectedPollutant: selectedPollutant, onPollutantChange: onPollutantChange, selectedYear: selectedYear, onYearChange: onYearChange, onCenterBogota: onCenterBogota }), _jsx("div", { className: "flex-1 overflow-hidden", children: _jsxs("div", { className: "h-full flex gap-6 p-6 max-w-7xl mx-auto w-full", children: [_jsxs(motion.div, { layout: true, className: "flex-1 flex flex-col", initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5, delay: 0.1 }, children: [_jsx(GeoMap, { ref: mapRef, sectors: sectors, concentrations: concentrations, selectedPollutant: selectedPollutant, selectedYear: selectedYear, selectedSectorId: selectedSector?.setuCcnct || null, onSectorSelect: onSectorSelect }), _jsx(motion.div, { className: "mt-4", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, delay: 0.2 }, children: _jsx(Legend, { pollutant: selectedPollutant }) })] }), _jsx(motion.div, { layout: true, className: "w-96 flex flex-col", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5, delay: 0.2 }, children: _jsx(SectorDetailPanel, { sector: selectedSector, selectedPollutant: selectedPollutant, selectedYear: selectedYear, onClose: selectedSector ? onSectorDeselect : undefined }) })] }) })] }));
};
