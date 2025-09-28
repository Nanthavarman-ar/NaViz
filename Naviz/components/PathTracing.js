import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const PathTracing = ({ scene, isActive }) => {
    if (!isActive)
        return null;
    return (_jsxs("div", { className: "fixed top-4 left-4 z-50 bg-slate-800 p-4 rounded-lg border border-slate-600", children: [_jsx("h3", { className: "text-white mb-2", children: "Path Tracing" }), _jsx("p", { className: "text-slate-300 text-sm", children: "Path tracing active" })] }));
};
export default PathTracing;
