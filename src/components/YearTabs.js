import { jsx as _jsx } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { AVAILABLE_YEARS } from '../data/mockData';
export const YearTabs = ({ selected, onChange }) => {
    return (_jsx("div", { className: "flex flex-wrap gap-1.5", children: AVAILABLE_YEARS.map((year) => (_jsx(motion.button, { onClick: () => onChange(year), className: `px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2 ${selected === year
                ? 'bg-stone-700 text-white border-stone-700 shadow-md-soft'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'}`, whileHover: { scale: 1.08 }, whileTap: { scale: 0.92 }, children: year }, year))) }));
};
