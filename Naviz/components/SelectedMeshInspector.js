import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Maximize } from 'lucide-react';
const SelectedMeshInspector = React.memo(({ selectedMesh, rightPanelVisible, onClose }) => {
    if (!rightPanelVisible)
        return null;
    return (_jsxs("div", { className: "w-80 border-l border-gray-700 bg-gray-900 text-white", children: [_jsxs("div", { className: "p-4 border-b border-gray-700 flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Inspector" }), _jsx(Button, { size: "sm", variant: "ghost", "aria-label": "Close Right Panel", onClick: onClose, children: _jsx(Maximize, { className: "w-4 h-4" }) })] }), _jsxs(Tabs, { defaultValue: "properties", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsx(TabsTrigger, { value: "properties", children: "Properties" }), _jsx(TabsTrigger, { value: "features", children: "Features" })] }), _jsx(TabsContent, { value: "properties", className: "p-4", children: _jsx("div", { children: selectedMesh ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("strong", { children: "Name:" }), " ", selectedMesh.name] }), _jsxs("div", { children: [_jsx("strong", { children: "Position:" }), " ", selectedMesh.position.toString()] }), _jsxs("div", { children: [_jsx("strong", { children: "Rotation:" }), " ", selectedMesh.rotation.toString()] }), _jsxs("div", { children: [_jsx("strong", { children: "Scale:" }), " ", selectedMesh.scaling.toString()] })] })) : (_jsx("p", { className: "text-muted-foreground", children: "No object selected" })) }) }), _jsx(TabsContent, { value: "features", className: "p-4", children: _jsx("div", { className: "text-muted-foreground", children: "Feature management is handled through the left panel." }) })] })] }));
});
export default SelectedMeshInspector;
