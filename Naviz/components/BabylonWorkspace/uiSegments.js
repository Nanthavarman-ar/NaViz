import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// BabylonWorkspace major UI segments
// Extracted for modularization
import * as React from "react";
import { Panels as LeftPanel } from "./Panels";
import TopBar from "../TopBar";
import { Button } from "../ui/button";
import { Maximize } from "lucide-react";
export function RenderLeftPanel(props) {
    return (_jsx(React.Suspense, { fallback: _jsx("div", { className: "p-4", children: "Loading Left Panel..." }), children: _jsx(LeftPanel, { ...props }) }));
}
export function RenderTopBar(props) {
    return (_jsx(React.Suspense, { fallback: _jsx("div", { className: "p-2", children: "Loading Top Bar..." }), children: _jsx(TopBar, { ...props }) }));
}
export function RenderRightPanel(props) {
    return (props.rightPanelVisible ? (_jsxs("div", { className: "w-80 border-l border-gray-700 bg-gray-900 text-white", children: [_jsxs("div", { className: "p-4 border-b border-gray-700 flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Inspector" }), _jsx(Button, { size: "sm", variant: "ghost", "aria-label": "Close Right Panel", onClick: props.onClose, children: _jsx(Maximize, { className: "w-4 h-4" }) })] }), props.children] })) : null);
}
