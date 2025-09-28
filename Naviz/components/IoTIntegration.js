import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const IoTIntegration = ({ scene, isActive = true }) => {
    if (!isActive)
        return null;
    return (_jsxs("div", { className: "absolute top-15 right-2.5 w-72 bg-black bg-opacity-90 rounded-lg p-4 text-white text-xs z-[1000]", children: [_jsx("h3", { className: "m-0 mb-4 text-lime-400", children: "\uD83D\uDCE1 IoT Integration" }), _jsx("p", { children: "This feature enables Internet of Things device integration." }), _jsx("p", { children: "Feature coming soon." })] }));
};
export default IoTIntegration;
