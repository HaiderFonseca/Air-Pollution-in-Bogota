import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export const LoadingState = () => {
    return (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, className: "text-center", children: [_jsx(motion.div, { animate: { rotate: 360 }, transition: { duration: 2, repeat: Infinity, ease: 'linear' }, className: "inline-block", children: _jsx("div", { className: "w-12 h-12 border-4 border-stone-200 border-t-stone-700 rounded-full" }) }), _jsx("p", { className: "mt-4 text-stone-600 font-medium", children: "Cargando datos..." })] }) }));
};
