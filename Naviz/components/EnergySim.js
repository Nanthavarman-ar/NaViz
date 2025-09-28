import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const EnergySim = ({ scene, isActive = true }) => {
    if (!isActive)
        return null;
    return (_jsxs("div", { className: "absolute top-15 right-2.5 w-72 bg-black bg-opacity-90 rounded-lg p-4 text-white text-xs z-[1000]", children: [_jsx("h3", { className: "m-0 mb-4 text-yellow-500", children: "\u26A1 Energy Simulation" }), _jsx("p", { children: "This feature enables energy efficiency and consumption analysis." }), _jsx("p", { children: "Feature coming soon." })] }));
};
export default EnergySim;
