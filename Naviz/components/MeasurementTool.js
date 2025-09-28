import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const MeasurementTool = ({ sceneManager, onClose }) => {
    return (_jsxs("div", { className: "absolute top-0 right-0 w-80 h-full bg-gray-900 text-white p-4 z-50", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "Measurement Tool" }), _jsx("p", { children: "Measurement tool UI goes here." }), _jsx("button", { onClick: onClose, className: "mt-4 px-4 py-2 bg-red-600 rounded", children: "Close" })] }));
};
export default MeasurementTool;
