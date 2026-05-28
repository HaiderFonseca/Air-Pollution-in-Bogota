import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from './EmptyState';
import { formatNumber, formatLargeNumber, getStratumName, calculateAgePercentage, formatIPM, } from '../utils/formatters';
export const SectorDetailPanel = ({ sector, selectedPollutant, selectedYear, onClose, }) => {
    if (!sector) {
        return _jsx(EmptyState, {});
    }
    const concentration = sector.concentrations[selectedPollutant]?.[selectedYear];
    const demo = sector.demographics;
    const totalPop = demo.totalPopulation;
    const ageGroups = [
        { label: '0-9 años', value: demo.children0_9 },
        { label: '10-19 años', value: demo.youth10_19 },
        { label: '20-59 años', value: demo.adults20_59 },
        { label: '60+ años', value: demo.olderAdults60Plus },
    ];
    return (_jsx(AnimatePresence, { children: _jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: { duration: 0.3 }, className: "flex flex-col h-full bg-white rounded-2xl shadow-lg-soft border border-stone-200 overflow-hidden", children: [_jsxs("div", { className: "flex items-start justify-between p-6 border-b border-stone-100", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-stone-900", children: sector.name }), _jsxs("p", { className: "text-sm text-stone-500 mt-1", children: ["SETU_CCNCT: ", sector.setuCcnct] })] }), onClose && (_jsx(motion.button, { onClick: onClose, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "p-2 hover:bg-stone-100 rounded-full transition-colors", children: _jsx("svg", { className: "w-5 h-5 text-stone-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] }), _jsxs("div", { className: "overflow-y-auto flex-1 p-6 space-y-6", children: [_jsxs(motion.section, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, children: [_jsxs("h3", { className: "text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3", children: ["Concentraci\u00F3n de ", selectedPollutant] }), _jsxs("div", { className: "bg-stone-50 rounded-2xl p-4", children: [_jsx("div", { className: "text-3xl font-bold text-stone-900", children: concentration === null
                                                ? 'N/A'
                                                : formatNumber(concentration, 2) }), _jsx("p", { className: "text-xs text-stone-600 mt-1", children: selectedPollutant === 'PM2.5'
                                                ? 'µg/m³'
                                                : selectedPollutant === 'PM10'
                                                    ? 'µg/m³'
                                                    : selectedPollutant === 'Black Carbon'
                                                        ? 'µg/m³'
                                                        : 'ppb' }), _jsxs("p", { className: "text-xs text-stone-500 mt-2", children: ["A\u00F1o ", selectedYear] })] })] }), _jsxs(motion.section, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, children: [_jsx("h3", { className: "text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3", children: "Poblaci\u00F3n Total" }), _jsxs("div", { className: "bg-stone-50 rounded-2xl p-4", children: [_jsx("div", { className: "text-2xl font-bold text-stone-900", children: formatLargeNumber(totalPop) }), _jsx("p", { className: "text-xs text-stone-600 mt-1", children: "habitantes" })] })] }), _jsxs(motion.section, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, children: [_jsx("h3", { className: "text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3", children: "Distribuci\u00F3n por Edad" }), _jsx("div", { className: "space-y-3", children: ageGroups.map((group) => {
                                        const percentage = calculateAgePercentage(group.value, totalPop);
                                        return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between mb-1.5", children: [_jsx("span", { className: "text-sm text-stone-700", children: group.label }), _jsxs("span", { className: "text-sm font-medium text-stone-900", children: [formatLargeNumber(group.value), " (", percentage.toFixed(1), "%)"] })] }), _jsx("div", { className: "w-full bg-stone-200 rounded-full h-2 overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${percentage}%` }, transition: { duration: 0.5, delay: 0.1 }, className: "h-full bg-stone-600 rounded-full" }) })] }, group.label));
                                    }) })] }), _jsxs(motion.section, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, children: [_jsx("h3", { className: "text-sm font-semibold text-stone-700 uppercase tracking-wide mb-3", children: "Variables Socioecon\u00F3micas" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-stone-50 rounded-lg p-3", children: [_jsx("p", { className: "text-xs text-stone-600", children: "Estrato Mayoritario" }), _jsx("p", { className: "text-sm font-semibold text-stone-900 mt-1", children: getStratumName(demo.majorityStrata) })] }), _jsxs("div", { className: "bg-stone-50 rounded-lg p-3", children: [_jsx("p", { className: "text-xs text-stone-600", children: "IPM Promedio" }), _jsx("p", { className: "text-sm font-semibold text-stone-900 mt-1", children: formatIPM(demo.averageIPM) })] })] })] })] })] }) }));
};
