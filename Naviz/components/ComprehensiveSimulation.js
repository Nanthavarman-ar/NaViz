import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const ComprehensiveSimulation = ({ scene, isActive }) => {
    if (!isActive)
        return null;
    return (_jsxs("div", { className: "fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600", children: [_jsx("h3", { className: "text-white mb-2", children: "Comprehensive Simulation" }), _jsx("p", { className: "text-slate-300 text-sm", children: "Simulation running" })] }));
};
export default ComprehensiveSimulation;
