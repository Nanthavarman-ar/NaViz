import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { useWorkspace } from '../core/WorkspaceContext';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { ScrollArea } from '../../ui/scroll-area';
import { RotateCcw, Move3D, Trash2, Plus, Save, RotateCw, Orbit, User, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateLeft, RotateRight } from 'lucide-react';
import './CameraControls.css';
const DEFAULT_PRESETS = [
    {
        id: 'default',
        name: 'Default View',
        position: { x: 0, y: 5, z: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        fov: 75,
        type: 'orbit',
        description: 'Standard isometric view'
    },
    {
        id: 'top',
        name: 'Top View',
        position: { x: 0, y: 20, z: 0 },
        rotation: { x: -Math.PI / 2, y: 0, z: 0 },
        fov: 75,
        type: 'orbit',
        description: 'Direct top-down view'
    },
    {
        id: 'front',
        name: 'Front View',
        position: { x: 0, y: 0, z: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        fov: 75,
        type: 'orbit',
        description: 'Front-facing view'
    },
    {
        id: 'side',
        name: 'Side View',
        position: { x: 10, y: 0, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        fov: 75,
        type: 'orbit',
        description: 'Side profile view'
    },
    {
        id: 'isometric',
        name: 'Isometric',
        position: { x: 10, y: 10, z: 10 },
        rotation: { x: -Math.PI / 6, y: Math.PI / 4, z: 0 },
        fov: 75,
        type: 'orbit',
        description: 'Isometric projection view'
    }
];
export function CameraControls({ onCameraChange, onPositionChange, onRotationChange, onSettingsChange }) {
    const { state } = useWorkspace();
    const [activeTab, setActiveTab] = useState('controls');
    const [selectedPreset, setSelectedPreset] = useState('default');
    const [customPresets, setCustomPresets] = useState([]);
    const [settings, setSettings] = useState({
        fov: 75,
        nearClip: 0.1,
        farClip: 1000,
        exposure: 1.0,
        sensitivity: 1.0,
        smoothing: 0.5,
        autoExposure: true,
        hdr: false,
        bloom: false,
        vignette: false,
        chromaticAberration: false,
        filmGrain: false,
        motionBlur: false,
        depthOfField: false
    });
    // Get current camera position and rotation
    const currentPosition = state.scene?.activeCamera?.position || { x: 0, y: 0, z: 0 };
    const currentRotation = state.scene?.activeCamera?.rotation || { x: 0, y: 0, z: 0 };
    // Handle camera type change
    const handleCameraTypeChange = useCallback((type) => {
        onCameraChange?.(type);
    }, [onCameraChange]);
    // Handle position change
    const handlePositionChange = useCallback((axis, value) => {
        const newPosition = { ...currentPosition, [axis]: value };
        onPositionChange?.(newPosition);
    }, [currentPosition, onPositionChange]);
    // Handle rotation change
    const handleRotationChange = useCallback((axis, value) => {
        const newRotation = { ...currentRotation, [axis]: value };
        onRotationChange?.(newRotation);
    }, [currentRotation, onRotationChange]);
    // Handle preset selection
    const handlePresetSelect = useCallback((presetId) => {
        const preset = [...DEFAULT_PRESETS, ...customPresets].find(p => p.id === presetId);
        if (preset) {
            setSelectedPreset(presetId);
            onPositionChange?.(preset.position);
            onRotationChange?.(preset.rotation);
            setSettings(prev => ({ ...prev, fov: preset.fov }));
        }
    }, [customPresets, onPositionChange, onRotationChange]);
    // Handle settings change
    const handleSettingsChange = useCallback((newSettings) => {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        onSettingsChange?.(updatedSettings);
    }, [settings, onSettingsChange]);
    // Save current camera as preset
    const saveCurrentAsPreset = useCallback(() => {
        const newPreset = {
            id: `custom-${Date.now()}`,
            name: `Custom ${customPresets.length + 1}`,
            position: currentPosition,
            rotation: currentRotation,
            fov: settings.fov,
            type: 'orbit', // Default to orbit for now
            description: 'Custom camera preset'
        };
        setCustomPresets(prev => [...prev, newPreset]);
    }, [currentPosition, currentRotation, settings.fov, customPresets.length]);
    // Delete custom preset
    const deletePreset = useCallback((presetId) => {
        setCustomPresets(prev => prev.filter(p => p.id !== presetId));
        if (selectedPreset === presetId) {
            setSelectedPreset('default');
        }
    }, [selectedPreset]);
    // Reset camera to default
    const resetCamera = useCallback(() => {
        handlePresetSelect('default');
    }, [handlePresetSelect]);
    // Quick camera movements
    const moveCamera = useCallback((direction, distance = 1) => {
        const moveVector = { x: 0, y: 0, z: 0 };
        switch (direction) {
            case 'forward':
                moveVector.z = -distance;
                break;
            case 'backward':
                moveVector.z = distance;
                break;
            case 'left':
                moveVector.x = -distance;
                break;
            case 'right':
                moveVector.x = distance;
                break;
            case 'up':
                moveVector.y = distance;
                break;
            case 'down':
                moveVector.y = -distance;
                break;
        }
        onPositionChange?.({
            x: currentPosition.x + moveVector.x,
            y: currentPosition.y + moveVector.y,
            z: currentPosition.z + moveVector.z
        });
    }, [currentPosition, onPositionChange]);
    return (_jsxs("div", { className: "camera-controls", children: [_jsxs("div", { className: "camera-controls-header", children: [_jsx("h3", { className: "camera-controls-title", children: "Camera Controls" }), _jsxs("div", { className: "camera-controls-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: resetCamera, children: _jsx(RotateCcw, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: saveCurrentAsPreset, children: _jsx(Save, { className: "w-4 h-4" }) })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "camera-controls-tabs", children: [_jsxs(TabsList, { className: "camera-controls-tabs-list", children: [_jsx(TabsTrigger, { value: "controls", children: "Controls" }), _jsx(TabsTrigger, { value: "position", children: "Position" }), _jsx(TabsTrigger, { value: "settings", children: "Settings" }), _jsx(TabsTrigger, { value: "presets", children: "Presets" })] }), _jsxs(TabsContent, { value: "controls", className: "camera-controls-tab-content", children: [_jsxs("div", { className: "camera-controls-section", children: [_jsx("h4", { className: "section-title", children: "Camera Type" }), _jsxs("div", { className: "camera-type-buttons", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleCameraTypeChange('orbit'), className: "camera-type-button", children: [_jsx(Orbit, { className: "w-4 h-4 mr-2" }), "Orbit"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleCameraTypeChange('free'), className: "camera-type-button", children: [_jsx(Move3D, { className: "w-4 h-4 mr-2" }), "Free"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleCameraTypeChange('first-person'), className: "camera-type-button", children: [_jsx(User, { className: "w-4 h-4 mr-2" }), "First Person"] })] })] }), _jsxs("div", { className: "camera-controls-section", children: [_jsx("h4", { className: "section-title", children: "Quick Movement" }), _jsxs("div", { className: "movement-controls", children: [_jsx("div", { className: "movement-row", children: _jsx(Button, { variant: "outline", size: "sm", onClick: () => moveCamera('forward'), children: _jsx(ArrowUp, { className: "w-4 h-4" }) }) }), _jsxs("div", { className: "movement-row", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => moveCamera('left'), children: _jsx(ArrowLeft, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => moveCamera('up'), children: _jsx(ArrowUp, { className: "w-4 h-4 rotate-90" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => moveCamera('down'), children: _jsx(ArrowDown, { className: "w-4 h-4 rotate-90" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => moveCamera('right'), children: _jsx(ArrowRight, { className: "w-4 h-4" }) })] }), _jsx("div", { className: "movement-row", children: _jsx(Button, { variant: "outline", size: "sm", onClick: () => moveCamera('backward'), children: _jsx(ArrowDown, { className: "w-4 h-4" }) }) })] })] }), _jsxs("div", { className: "camera-controls-section", children: [_jsx("h4", { className: "section-title", children: "Rotation" }), _jsxs("div", { className: "rotation-controls", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleRotationChange('y', currentRotation.y + 0.1), children: _jsx(RotateLeft, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleRotationChange('x', currentRotation.x + 0.1), children: _jsx(RotateCw, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleRotationChange('y', currentRotation.y - 0.1), children: _jsx(RotateRight, { className: "w-4 h-4" }) })] })] })] }), _jsx(TabsContent, { value: "position", className: "camera-controls-tab-content", children: _jsxs("div", { className: "position-controls", children: [_jsxs("div", { className: "position-group", children: [_jsx("label", { className: "position-label", children: "Position" }), _jsxs("div", { className: "position-inputs", children: [_jsxs("div", { className: "position-input", children: [_jsx("label", { children: "X" }), _jsx(Input, { type: "number", step: "0.1", value: currentPosition.x, onChange: (e) => handlePositionChange('x', parseFloat(e.target.value)) })] }), _jsxs("div", { className: "position-input", children: [_jsx("label", { children: "Y" }), _jsx(Input, { type: "number", step: "0.1", value: currentPosition.y, onChange: (e) => handlePositionChange('y', parseFloat(e.target.value)) })] }), _jsxs("div", { className: "position-input", children: [_jsx("label", { children: "Z" }), _jsx(Input, { type: "number", step: "0.1", value: currentPosition.z, onChange: (e) => handlePositionChange('z', parseFloat(e.target.value)) })] })] })] }), _jsxs("div", { className: "position-group", children: [_jsx("label", { className: "position-label", children: "Rotation" }), _jsxs("div", { className: "position-inputs", children: [_jsxs("div", { className: "position-input", children: [_jsx("label", { children: "X" }), _jsx(Input, { type: "number", step: "0.01", value: currentRotation.x, onChange: (e) => handleRotationChange('x', parseFloat(e.target.value)) })] }), _jsxs("div", { className: "position-input", children: [_jsx("label", { children: "Y" }), _jsx(Input, { type: "number", step: "0.01", value: currentRotation.y, onChange: (e) => handleRotationChange('y', parseFloat(e.target.value)) })] }), _jsxs("div", { className: "position-input", children: [_jsx("label", { children: "Z" }), _jsx(Input, { type: "number", step: "0.01", value: currentRotation.z, onChange: (e) => handleRotationChange('z', parseFloat(e.target.value)) })] })] })] })] }) }), _jsx(TabsContent, { value: "settings", className: "camera-controls-tab-content", children: _jsxs(ScrollArea, { className: "settings-scroll-area", children: [_jsxs("div", { className: "settings-section", children: [_jsx("h4", { className: "section-title", children: "Basic Settings" }), _jsxs("div", { className: "setting-group", children: [_jsxs("div", { className: "setting-item", children: [_jsx("label", { children: "Field of View" }), _jsxs("div", { className: "setting-control", children: [_jsx(Input, { type: "number", min: "1", max: "180", value: settings.fov, onChange: (e) => handleSettingsChange({ fov: parseFloat(e.target.value) }) }), _jsx("span", { className: "setting-unit", children: "\u00B0" })] })] }), _jsxs("div", { className: "setting-item", children: [_jsx("label", { children: "Near Clip" }), _jsxs("div", { className: "setting-control", children: [_jsx(Input, { type: "number", min: "0.01", step: "0.01", value: settings.nearClip, onChange: (e) => handleSettingsChange({ nearClip: parseFloat(e.target.value) }) }), _jsx("span", { className: "setting-unit", children: "m" })] })] }), _jsxs("div", { className: "setting-item", children: [_jsx("label", { children: "Far Clip" }), _jsxs("div", { className: "setting-control", children: [_jsx(Input, { type: "number", min: "1", step: "1", value: settings.farClip, onChange: (e) => handleSettingsChange({ farClip: parseFloat(e.target.value) }) }), _jsx("span", { className: "setting-unit", children: "m" })] })] })] })] }), _jsxs("div", { className: "settings-section", children: [_jsx("h4", { className: "section-title", children: "Advanced Settings" }), _jsxs("div", { className: "setting-group", children: [_jsxs("div", { className: "setting-item", children: [_jsx("label", { children: "Exposure" }), _jsx("div", { className: "setting-control", children: _jsx(Input, { type: "number", min: "0.1", max: "5", step: "0.1", value: settings.exposure, onChange: (e) => handleSettingsChange({ exposure: parseFloat(e.target.value) }) }) })] }), _jsxs("div", { className: "setting-item", children: [_jsx("label", { children: "Sensitivity" }), _jsx("div", { className: "setting-control", children: _jsx(Input, { type: "number", min: "0.1", max: "5", step: "0.1", value: settings.sensitivity, onChange: (e) => handleSettingsChange({ sensitivity: parseFloat(e.target.value) }) }) })] }), _jsxs("div", { className: "setting-item", children: [_jsx("label", { children: "Smoothing" }), _jsx("div", { className: "setting-control", children: _jsx(Input, { type: "number", min: "0", max: "1", step: "0.1", value: settings.smoothing, onChange: (e) => handleSettingsChange({ smoothing: parseFloat(e.target.value) }) }) })] })] })] }), _jsxs("div", { className: "settings-section", children: [_jsx("h4", { className: "section-title", children: "Post Effects" }), _jsxs("div", { className: "setting-group", children: [_jsx("div", { className: "setting-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: settings.autoExposure, onChange: (e) => handleSettingsChange({ autoExposure: e.target.checked }) }), "Auto Exposure"] }) }), _jsx("div", { className: "setting-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: settings.hdr, onChange: (e) => handleSettingsChange({ hdr: e.target.checked }) }), "HDR"] }) }), _jsx("div", { className: "setting-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: settings.bloom, onChange: (e) => handleSettingsChange({ bloom: e.target.checked }) }), "Bloom"] }) }), _jsx("div", { className: "setting-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: settings.vignette, onChange: (e) => handleSettingsChange({ vignette: e.target.checked }) }), "Vignette"] }) }), _jsx("div", { className: "setting-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: settings.chromaticAberration, onChange: (e) => handleSettingsChange({ chromaticAberration: e.target.checked }) }), "Chromatic Aberration"] }) }), _jsx("div", { className: "setting-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: settings.filmGrain, onChange: (e) => handleSettingsChange({ filmGrain: e.target.checked }) }), "Film Grain"] }) }), _jsx("div", { className: "setting-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: settings.motionBlur, onChange: (e) => handleSettingsChange({ motionBlur: e.target.checked }) }), "Motion Blur"] }) }), _jsx("div", { className: "setting-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: settings.depthOfField, onChange: (e) => handleSettingsChange({ depthOfField: e.target.checked }) }), "Depth of Field"] }) })] })] })] }) }), _jsx(TabsContent, { value: "presets", className: "camera-controls-tab-content", children: _jsxs("div", { className: "presets-section", children: [_jsxs("div", { className: "presets-header", children: [_jsx("h4", { className: "section-title", children: "Camera Presets" }), _jsxs(Button, { variant: "outline", size: "sm", onClick: saveCurrentAsPreset, children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Save Current"] })] }), _jsx(ScrollArea, { className: "presets-list", children: _jsxs("div", { className: "presets-grid", children: [DEFAULT_PRESETS.map((preset) => (_jsx(Card, { className: `preset-card ${selectedPreset === preset.id ? 'selected' : ''}`, onClick: () => handlePresetSelect(preset.id), children: _jsxs(CardContent, { className: "preset-content", children: [_jsxs("div", { className: "preset-info", children: [_jsx("h5", { className: "preset-name", children: preset.name }), _jsx("p", { className: "preset-description", children: preset.description }), _jsxs("div", { className: "preset-meta", children: [_jsx(Badge, { variant: "secondary", className: "preset-type", children: preset.type }), _jsxs("span", { className: "preset-fov", children: [preset.fov, "\u00B0"] })] })] }), _jsx("div", { className: "preset-position", children: _jsxs("div", { className: "position-display", children: [_jsxs("span", { children: ["X: ", preset.position.x.toFixed(1)] }), _jsxs("span", { children: ["Y: ", preset.position.y.toFixed(1)] }), _jsxs("span", { children: ["Z: ", preset.position.z.toFixed(1)] })] }) })] }) }, preset.id))), customPresets.map((preset) => (_jsx(Card, { className: `preset-card ${selectedPreset === preset.id ? 'selected' : ''}`, onClick: () => handlePresetSelect(preset.id), children: _jsxs(CardContent, { className: "preset-content", children: [_jsxs("div", { className: "preset-info", children: [_jsx("h5", { className: "preset-name", children: preset.name }), _jsx("p", { className: "preset-description", children: preset.description }), _jsxs("div", { className: "preset-meta", children: [_jsx(Badge, { variant: "secondary", className: "preset-type", children: preset.type }), _jsxs("span", { className: "preset-fov", children: [preset.fov, "\u00B0"] })] })] }), _jsx("div", { className: "preset-actions", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    deletePreset(preset.id);
                                                                }, children: _jsx(Trash2, { className: "w-4 h-4" }) }) })] }) }, preset.id)))] }) })] }) })] })] }));
}
