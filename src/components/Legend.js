import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { getColorScale } from '../utils/colorScales';
export const Legend = ({ pollutant }) => {
    const scale = getColorScale(pollutant);
    const { colors, breaks, unit } = scale;
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, transition: { duration: 0.3 }, className: "bg-white rounded-2xl p-4 shadow-md-soft border border-stone-200", children: [_jsxs("div", { className: "mb-3", children: [_jsx("h3", { className: "font-semibold text-stone-800 text-sm", children: pollutant }), _jsxs("p", { className: "text-xs text-stone-500", children: ["Concentraci\u00F3n anual promedio (", unit, ")"] })] }), _jsxs("div", { className: "space-y-2", children: [colors.map((color, index) => {
                        const breakValue = breaks[index];
                        const nextBreak = breaks[index + 1];
                        let label = '';
                        if (index === 0) {
                            label = `≤ ${breakValue}`;
                        }
                        else if (index === colors.length - 1) {
                            label = `> ${breaks[breaks.length - 1]}`;
                        }
                        else {
                            label = `${breakValue} - ${nextBreak}`;
                        }
                        return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-5 h-5 rounded border border-stone-300", style: { backgroundColor: color } }), _jsx("span", { className: "text-xs text-stone-600", children: label })] }, `legend-${index}`));
                    }), _jsx("div", { className: "mt-3 pt-3 border-t border-stone-200", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-5 h-5 rounded bg-stone-200 border border-stone-300" }), _jsx("span", { className: "text-xs text-stone-600", children: "Sin dato" })] }) })] })] }));
};
