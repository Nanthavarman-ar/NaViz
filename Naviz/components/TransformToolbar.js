import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
const TransformToolbar = ({ selectedMesh, scene }) => {
    const [activeMode, setActiveMode] = useState('select');
    const handleMove = (axis, delta) => {
        if (!selectedMesh)
            return;
        selectedMesh.position[axis] += delta;
    };
    const handleRotate = (axis, delta) => {
        if (!selectedMesh)
            return;
        selectedMesh.rotation[axis] += delta;
    };
    const handleScale = (axis, delta) => {
        if (!selectedMesh)
            return;
        if (axis === 'uniform') {
            selectedMesh.scaling.scaleInPlace(1 + delta);
        }
        else {
            selectedMesh.scaling[axis] += delta;
        }
    };
    const resetTransform = () => {
        if (!selectedMesh)
            return;
        selectedMesh.position.setAll(0);
        selectedMesh.rotation.setAll(0);
        selectedMesh.scaling.setAll(1);
    };
    return (_jsxs("div", { className: "absolute top-4 right-4 bg-slate-800 border border-slate-600 rounded-lg p-3 z-50 text-xs text-white", children: [_jsx("div", { className: "font-bold mb-2", children: "Transform Tools" }), _jsxs("div", { className: "grid grid-cols-4 gap-1 mb-3", children: [_jsx("button", { onClick: () => setActiveMode('select'), className: `p-1 rounded ${activeMode === 'select' ? 'bg-blue-600' : 'bg-slate-700'}`, title: "Select", children: "\uD83D\uDCCD" }), _jsx("button", { onClick: () => setActiveMode('move'), className: `p-1 rounded ${activeMode === 'move' ? 'bg-blue-600' : 'bg-slate-700'}`, title: "Move", children: "\u2194\uFE0F" }), _jsx("button", { onClick: () => setActiveMode('rotate'), className: `p-1 rounded ${activeMode === 'rotate' ? 'bg-blue-600' : 'bg-slate-700'}`, title: "Rotate", children: "\uD83D\uDD04" }), _jsx("button", { onClick: () => setActiveMode('scale'), className: `p-1 rounded ${activeMode === 'scale' ? 'bg-blue-600' : 'bg-slate-700'}`, title: "Scale", children: "\uD83D\uDCCF" })] }), selectedMesh && (_jsxs(_Fragment, { children: [activeMode === 'move' && (_jsxs("div", { className: "mb-3", children: [_jsx("div", { className: "text-gray-400 mb-1", children: "Move" }), _jsxs("div", { className: "grid grid-cols-3 gap-1", children: [_jsx("button", { onClick: () => handleMove('x', -0.1), className: "p-1 bg-red-600 rounded", children: "X-" }), _jsx("button", { onClick: () => handleMove('y', -0.1), className: "p-1 bg-green-600 rounded", children: "Y-" }), _jsx("button", { onClick: () => handleMove('z', -0.1), className: "p-1 bg-blue-600 rounded", children: "Z-" }), _jsx("button", { onClick: () => handleMove('x', 0.1), className: "p-1 bg-red-400 rounded", children: "X+" }), _jsx("button", { onClick: () => handleMove('y', 0.1), className: "p-1 bg-green-400 rounded", children: "Y+" }), _jsx("button", { onClick: () => handleMove('z', 0.1), className: "p-1 bg-blue-400 rounded", children: "Z+" })] })] })), activeMode === 'rotate' && (_jsxs("div", { className: "mb-3", children: [_jsx("div", { className: "text-gray-400 mb-1", children: "Rotate" }), _jsxs("div", { className: "grid grid-cols-3 gap-1", children: [_jsx("button", { onClick: () => handleRotate('x', -0.1), className: "p-1 bg-red-600 rounded", children: "X-" }), _jsx("button", { onClick: () => handleRotate('y', -0.1), className: "p-1 bg-green-600 rounded", children: "Y-" }), _jsx("button", { onClick: () => handleRotate('z', -0.1), className: "p-1 bg-blue-600 rounded", children: "Z-" }), _jsx("button", { onClick: () => handleRotate('x', 0.1), className: "p-1 bg-red-400 rounded", children: "X+" }), _jsx("button", { onClick: () => handleRotate('y', 0.1), className: "p-1 bg-green-400 rounded", children: "Y+" }), _jsx("button", { onClick: () => handleRotate('z', 0.1), className: "p-1 bg-blue-400 rounded", children: "Z+" })] })] })), activeMode === 'scale' && (_jsxs("div", { className: "mb-3", children: [_jsx("div", { className: "text-gray-400 mb-1", children: "Scale" }), _jsxs("div", { className: "grid grid-cols-2 gap-1 mb-1", children: [_jsx("button", { onClick: () => handleScale('uniform', -0.1), className: "p-1 bg-purple-600 rounded", children: "-" }), _jsx("button", { onClick: () => handleScale('uniform', 0.1), className: "p-1 bg-purple-400 rounded", children: "+" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-1", children: [_jsx("button", { onClick: () => handleScale('x', -0.1), className: "p-1 bg-red-600 rounded", children: "X-" }), _jsx("button", { onClick: () => handleScale('y', -0.1), className: "p-1 bg-green-600 rounded", children: "Y-" }), _jsx("button", { onClick: () => handleScale('z', -0.1), className: "p-1 bg-blue-600 rounded", children: "Z-" }), _jsx("button", { onClick: () => handleScale('x', 0.1), className: "p-1 bg-red-400 rounded", children: "X+" }), _jsx("button", { onClick: () => handleScale('y', 0.1), className: "p-1 bg-green-400 rounded", children: "Y+" }), _jsx("button", { onClick: () => handleScale('z', 0.1), className: "p-1 bg-blue-400 rounded", children: "Z+" })] })] })), _jsxs("div", { className: "grid grid-cols-2 gap-1", children: [_jsx("button", { onClick: resetTransform, className: "p-1 bg-gray-600 rounded text-xs", children: "Reset" }), _jsx("button", { onClick: () => selectedMesh.dispose(), className: "p-1 bg-red-600 rounded text-xs", children: "Delete" })] })] })), !selectedMesh && (_jsx("div", { className: "text-gray-400 text-center", children: "Select an object" }))] }));
};
export default TransformToolbar;
