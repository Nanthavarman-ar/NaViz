import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { AnimationTimeline } from './AnimationTimeline';
import { MaterialPropertyEditor } from './MaterialPropertyEditor';
import { MaterialPresetSelector } from './MaterialPresetSelector';
import { useIsMobile } from './ui/use-mobile';
export const EnhancedControlPanels = ({ scene, engine, selectedObject, selectedMaterial, animationManager, materialManager, onAnimationSequenceCreate, onAnimationSequencePlay, onMaterialPropertyChange, onMaterialPresetApply }) => {
    const [activeTab, setActiveTab] = useState('animations');
    const [panelsVisible, setPanelsVisible] = useState(true);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [isRealTimePreview, setIsRealTimePreview] = useState(true);
    const [isCompactMode, setIsCompactMode] = useState(false);
    const isMobile = useIsMobile();
    // Responsive design: auto-compact on mobile
    useEffect(() => {
        setIsCompactMode(isMobile);
    }, [isMobile]);
    // Keyboard shortcuts handler
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Only handle shortcuts when panels are visible
            if (!panelsVisible)
                return;
            if (event.ctrlKey || event.metaKey) {
                switch (event.key) {
                    case 'z':
                        event.preventDefault();
                        if (event.shiftKey) {
                            redo();
                        }
                        else {
                            undo();
                        }
                        break;
                    case 'y':
                        event.preventDefault();
                        redo();
                        break;
                    case '1':
                        event.preventDefault();
                        setActiveTab('animations');
                        break;
                    case '2':
                        event.preventDefault();
                        setActiveTab('materials');
                        break;
                    case '3':
                        event.preventDefault();
                        setActiveTab('presets');
                        break;
                }
            }
            else {
                switch (event.key) {
                    case ' ':
                        event.preventDefault();
                        // Toggle play/pause for animations
                        if (animationManager && selectedObject) {
                            // This would need to be implemented based on current animation state
                        }
                        break;
                    case 'Escape':
                        event.preventDefault();
                        setPanelsVisible(false);
                        break;
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [panelsVisible, activeTab, animationManager, selectedObject]);
    const togglePanels = () => {
        setPanelsVisible(!panelsVisible);
    };
    // Undo/Redo functionality
    const saveState = useCallback((action, data) => {
        if (!isRealTimePreview)
            return;
        const state = {
            action,
            data,
            timestamp: Date.now(),
            selectedObject: selectedObject?.name,
            selectedMaterial: selectedMaterial?.name
        };
        setUndoStack(prev => [...prev, state]);
        setRedoStack([]); // Clear redo stack when new action is performed
    }, [selectedObject, selectedMaterial, isRealTimePreview]);
    const undo = useCallback(() => {
        if (undoStack.length === 0)
            return;
        const lastState = undoStack[undoStack.length - 1];
        setUndoStack(prev => prev.slice(0, -1));
        setRedoStack(prev => [...prev, lastState]);
        // Restore state based on action type
        switch (lastState.action) {
            case 'materialPropertyChange':
                if (lastState.data.previousValue !== undefined) {
                    onMaterialPropertyChange(lastState.data.property, lastState.data.previousValue);
                }
                break;
            case 'materialPresetApply':
                // This would need more complex logic to revert preset application
                break;
        }
    }, [undoStack, onMaterialPropertyChange]);
    const redo = useCallback(() => {
        if (redoStack.length === 0)
            return;
        const stateToRedo = redoStack[redoStack.length - 1];
        setRedoStack(prev => prev.slice(0, -1));
        setUndoStack(prev => [...prev, stateToRedo]);
        // Reapply state based on action type
        switch (stateToRedo.action) {
            case 'materialPropertyChange':
                onMaterialPropertyChange(stateToRedo.data.property, stateToRedo.data.newValue);
                break;
            case 'materialPresetApply':
                onMaterialPresetApply(stateToRedo.data.preset);
                break;
        }
    }, [redoStack, onMaterialPropertyChange, onMaterialPresetApply]);
    const getObjectInfo = () => {
        if (!selectedObject)
            return null;
        return {
            name: selectedObject.name,
            type: selectedObject.constructor.name,
            position: selectedObject.position,
            rotation: selectedObject.rotation,
            scale: selectedObject.scaling,
            vertices: selectedObject.getTotalVertices(),
            faces: selectedObject.getTotalIndices() / 3
        };
    };
    const getMaterialInfo = () => {
        if (!selectedMaterial)
            return null;
        return {
            name: selectedMaterial.name || 'Unnamed Material',
            type: selectedMaterial.constructor.name,
            id: selectedMaterial.id
        };
    };
    const objectInfo = getObjectInfo();
    const materialInfo = getMaterialInfo();
    return (_jsxs("div", { className: "w-full h-full", children: [_jsx(Button, { onClick: togglePanels, className: "mb-2 shadow-lg w-full", variant: panelsVisible ? "default" : "outline", children: panelsVisible ? 'Hide Controls' : 'Show Controls' }), panelsVisible && (_jsxs(Card, { className: "w-full max-h-[70vh] overflow-hidden shadow-xl", children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsx(CardTitle, { className: "text-lg", children: "Enhanced Control Panels" }), _jsxs("div", { className: "flex flex-wrap gap-2 mt-2", children: [objectInfo && (_jsxs(Badge, { variant: "secondary", className: "text-xs", children: ["Object: ", objectInfo.name] })), materialInfo && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["Material: ", materialInfo.name] }))] })] }), _jsx(CardContent, { className: "p-0", children: _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3 rounded-none border-b", children: [_jsx(TabsTrigger, { value: "animations", className: "text-xs", children: "Animations" }), _jsx(TabsTrigger, { value: "materials", className: "text-xs", children: "Materials" }), _jsx(TabsTrigger, { value: "presets", className: "text-xs", children: "Presets" })] }), _jsxs("div", { className: "max-h-[60vh] overflow-y-auto", children: [_jsx(TabsContent, { value: "animations", className: "p-4 m-0", children: _jsx(AnimationTimeline, { animationManager: animationManager, selectedObject: selectedObject, onSequenceCreate: onAnimationSequenceCreate, onSequencePlay: onAnimationSequencePlay }) }), _jsx(TabsContent, { value: "materials", className: "p-4 m-0", children: _jsx(MaterialPropertyEditor, { material: selectedMaterial, onPropertyChange: onMaterialPropertyChange }) }), _jsx(TabsContent, { value: "presets", className: "p-4 m-0", children: _jsx(MaterialPresetSelector, { material: selectedMaterial, onPresetApply: onMaterialPresetApply }) })] })] }) }), objectInfo && (_jsxs("div", { className: "border-t p-3 bg-gray-50", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", children: "Object Details" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Type:" }), " ", objectInfo.type] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Vertices:" }), " ", objectInfo.vertices] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Faces:" }), " ", objectInfo.faces] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Position:" }), _jsx("br", {}), "X: ", objectInfo.position.x.toFixed(2), _jsx("br", {}), "Y: ", objectInfo.position.y.toFixed(2), _jsx("br", {}), "Z: ", objectInfo.position.z.toFixed(2)] })] })] })), materialInfo && (_jsxs("div", { className: "border-t p-3 bg-blue-50", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", children: "Material Details" }), _jsxs("div", { className: "text-xs", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Type:" }), " ", materialInfo.type] }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "ID:" }), " ", materialInfo.id] })] })] }))] }))] }));
};
