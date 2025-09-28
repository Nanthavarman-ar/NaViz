import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { useWorkspace } from '../core/WorkspaceContext';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { ScrollArea } from '../../ui/scroll-area';
import { Vector3, Color3 } from '@babylonjs/core';
import { Sun, Lightbulb, Zap, Moon, Trash2, Copy, RotateCcw, Eye, EyeOff } from 'lucide-react';
import './LightingControls.css';
const LIGHT_PRESETS = {
    directional: {
        name: 'Directional Light',
        icon: Sun,
        description: 'Simulates sunlight or moonlight',
        defaultProperties: {
            intensity: 1.0,
            color: new Color3(1, 1, 1),
            shadowEnabled: true,
            shadowQuality: 'medium'
        }
    },
    point: {
        name: 'Point Light',
        icon: Lightbulb,
        description: 'Emits light in all directions from a point',
        defaultProperties: {
            intensity: 1.0,
            color: new Color3(1, 1, 0.8),
            range: 10,
            shadowEnabled: false,
            shadowQuality: 'low'
        }
    },
    spot: {
        name: 'Spot Light',
        icon: Zap,
        description: 'Emits light in a cone shape',
        defaultProperties: {
            intensity: 1.0,
            color: new Color3(1, 1, 1),
            range: 10,
            angle: Math.PI / 4,
            exponent: 2,
            shadowEnabled: true,
            shadowQuality: 'medium'
        }
    },
    hemispheric: {
        name: 'Hemispheric Light',
        icon: Moon,
        description: 'Simulates ambient lighting from above and below',
        defaultProperties: {
            intensity: 0.5,
            color: new Color3(0.8, 0.9, 1),
            shadowEnabled: false,
            shadowQuality: 'low'
        }
    }
};
export function LightingControls({ onLightAdd, onLightRemove, onLightUpdate, onEnvironmentChange }) {
    const { state } = useWorkspace();
    const [activeTab, setActiveTab] = useState('lights');
    const [selectedLight, setSelectedLight] = useState(null);
    const [lights, setLights] = useState([]);
    const [environment, setEnvironment] = useState({
        skybox: false,
        ground: false,
        fog: false,
        fogColor: new Color3(0.5, 0.5, 0.5),
        fogDensity: 0.01,
        fogStart: 10,
        fogEnd: 100,
        ambientColor: new Color3(0.2, 0.2, 0.2),
        ambientIntensity: 0.3
    });
    // Get lights from scene
    useEffect(() => {
        if (state.scene) {
            const sceneLights = state.scene.lights?.map((light, index) => {
                // Determine light type based on constructor name
                const type = light.constructor.name.toLowerCase().includes('directional') ? 'directional' :
                    light.constructor.name.toLowerCase().includes('point') ? 'point' :
                        light.constructor.name.toLowerCase().includes('spot') ? 'spot' : 'hemispheric';
                return {
                    id: light.name || `light-${index}`,
                    type: type,
                    position: light.position || new Vector3(0, 0, 0),
                    direction: light.direction,
                    intensity: light.intensity || 1,
                    color: light.diffuse || new Color3(1, 1, 1),
                    range: light.range,
                    angle: light.angle,
                    exponent: light.exponent,
                    shadowEnabled: false, // Default for now
                    shadowQuality: 'medium',
                    enabled: light.isEnabled()
                };
            }) || [];
            setLights(sceneLights);
        }
    }, [state.scene]);
    // Handle light type selection
    const handleAddLight = useCallback((lightType) => {
        const preset = LIGHT_PRESETS[lightType];
        const newLight = {
            id: `${lightType}-${Date.now()}`,
            type: lightType,
            position: new Vector3(0, 5, 0),
            intensity: preset.defaultProperties.intensity,
            color: preset.defaultProperties.color,
            shadowEnabled: preset.defaultProperties.shadowEnabled,
            shadowQuality: preset.defaultProperties.shadowQuality,
            enabled: true
        };
        setLights(prev => [...prev, newLight]);
        onLightAdd?.(lightType, newLight.position);
    }, [onLightAdd]);
    // Handle light removal
    const handleRemoveLight = useCallback((lightId) => {
        setLights(prev => prev.filter(l => l.id !== lightId));
        setSelectedLight(null);
        onLightRemove?.(lightId);
    }, [onLightRemove]);
    // Handle light property update
    const handleLightUpdate = useCallback((lightId, properties) => {
        setLights(prev => prev.map(light => light.id === lightId ? { ...light, ...properties } : light));
        onLightUpdate?.(lightId, properties);
    }, [onLightUpdate]);
    // Handle environment settings change
    const handleEnvironmentChange = useCallback((newEnvironment) => {
        const updatedEnvironment = { ...environment, ...newEnvironment };
        setEnvironment(updatedEnvironment);
        onEnvironmentChange?.(updatedEnvironment);
    }, [environment, onEnvironmentChange]);
    // Toggle light visibility
    const toggleLight = useCallback((lightId) => {
        const light = lights.find(l => l.id === lightId);
        if (light) {
            handleLightUpdate(lightId, { enabled: !light.enabled });
        }
    }, [lights, handleLightUpdate]);
    // Duplicate light
    const duplicateLight = useCallback((lightId) => {
        const light = lights.find(l => l.id === lightId);
        if (light) {
            const newLight = {
                ...light,
                id: `${light.type}-${Date.now()}`,
                position: new Vector3(light.position.x + 2, light.position.y, light.position.z + 2)
            };
            setLights(prev => [...prev, newLight]);
        }
    }, [lights]);
    // Reset environment to default
    const resetEnvironment = useCallback(() => {
        setEnvironment({
            skybox: false,
            ground: false,
            fog: false,
            fogColor: new Color3(0.5, 0.5, 0.5),
            fogDensity: 0.01,
            fogStart: 10,
            fogEnd: 100,
            ambientColor: new Color3(0.2, 0.2, 0.2),
            ambientIntensity: 0.3
        });
    }, []);
    const selectedLightData = lights.find(l => l.id === selectedLight);
    return (_jsxs("div", { className: "lighting-controls", children: [_jsxs("div", { className: "lighting-controls-header", children: [_jsx("h3", { className: "lighting-controls-title", children: "Lighting Controls" }), _jsx("div", { className: "lighting-controls-actions", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: resetEnvironment, children: _jsx(RotateCcw, { className: "w-4 h-4" }) }) })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "lighting-controls-tabs", children: [_jsxs(TabsList, { className: "lighting-controls-tabs-list", children: [_jsx(TabsTrigger, { value: "lights", children: "Lights" }), _jsx(TabsTrigger, { value: "environment", children: "Environment" }), _jsx(TabsTrigger, { value: "shadows", children: "Shadows" })] }), _jsx(TabsContent, { value: "lights", className: "lighting-controls-tab-content", children: _jsxs("div", { className: "lights-section", children: [_jsxs("div", { className: "lights-header", children: [_jsx("h4", { className: "section-title", children: "Add Light" }), _jsx("div", { className: "add-light-buttons", children: Object.entries(LIGHT_PRESETS).map(([type, preset]) => {
                                                const IconComponent = preset.icon;
                                                return (_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleAddLight(type), className: "add-light-button", title: preset.description, children: _jsx(IconComponent, { className: "w-4 h-4" }) }, type));
                                            }) })] }), _jsxs("div", { className: "lights-list", children: [_jsxs("h4", { className: "section-title", children: ["Scene Lights (", lights.length, ")"] }), _jsx(ScrollArea, { className: "lights-scroll-area", children: _jsx("div", { className: "lights-grid", children: lights.map((light) => {
                                                    const preset = LIGHT_PRESETS[light.type];
                                                    const IconComponent = preset.icon;
                                                    return (_jsx(Card, { className: `light-card ${selectedLight === light.id ? 'selected' : ''}`, onClick: () => setSelectedLight(light.id), children: _jsxs(CardContent, { className: "light-content", children: [_jsxs("div", { className: "light-header", children: [_jsxs("div", { className: "light-info", children: [_jsx(IconComponent, { className: "w-4 h-4" }), _jsx("span", { className: "light-name", children: light.id })] }), _jsxs("div", { className: "light-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        toggleLight(light.id);
                                                                                    }, children: light.enabled ? _jsx(Eye, { className: "w-3 h-3" }) : _jsx(EyeOff, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        duplicateLight(light.id);
                                                                                    }, children: _jsx(Copy, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        handleRemoveLight(light.id);
                                                                                    }, children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }), _jsxs("div", { className: "light-properties", children: [_jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Intensity" }), _jsx(Input, { type: "number", min: "0", max: "10", step: "0.1", value: light.intensity, onChange: (e) => handleLightUpdate(light.id, { intensity: parseFloat(e.target.value) }), className: "property-input" })] }), _jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Color" }), _jsx("div", { className: "color-picker", children: _jsx("input", { type: "color", value: light.color.toHexString(), onChange: (e) => handleLightUpdate(light.id, { color: Color3.FromHexString(e.target.value) }) }) })] }), light.range && (_jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Range" }), _jsx(Input, { type: "number", min: "0.1", max: "100", step: "0.1", value: light.range, onChange: (e) => handleLightUpdate(light.id, { range: parseFloat(e.target.value) }), className: "property-input" })] })), light.angle && (_jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Angle" }), _jsx(Input, { type: "number", min: "0", max: Math.PI, step: "0.01", value: light.angle, onChange: (e) => handleLightUpdate(light.id, { angle: parseFloat(e.target.value) }), className: "property-input" })] }))] })] }) }, light.id));
                                                }) }) })] })] }) }), _jsx(TabsContent, { value: "environment", className: "lighting-controls-tab-content", children: _jsxs(ScrollArea, { className: "environment-scroll-area", children: [_jsxs("div", { className: "environment-section", children: [_jsx("h4", { className: "section-title", children: "Sky & Ground" }), _jsxs("div", { className: "environment-group", children: [_jsxs("div", { className: "environment-item", children: [_jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: environment.skybox, onChange: (e) => handleEnvironmentChange({ skybox: e.target.checked }) }), "Enable Skybox"] }), environment.skybox && (_jsx(Input, { placeholder: "Skybox texture URL", value: environment.skyboxTexture || '', onChange: (e) => handleEnvironmentChange({ skyboxTexture: e.target.value }) }))] }), _jsxs("div", { className: "environment-item", children: [_jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: environment.ground, onChange: (e) => handleEnvironmentChange({ ground: e.target.checked }) }), "Enable Ground"] }), environment.ground && (_jsx(Input, { placeholder: "Ground texture URL", value: environment.groundTexture || '', onChange: (e) => handleEnvironmentChange({ groundTexture: e.target.value }) }))] })] })] }), _jsxs("div", { className: "environment-section", children: [_jsx("h4", { className: "section-title", children: "Fog Settings" }), _jsxs("div", { className: "environment-group", children: [_jsx("div", { className: "environment-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: environment.fog, onChange: (e) => handleEnvironmentChange({ fog: e.target.checked }) }), "Enable Fog"] }) }), environment.fog && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "environment-item", children: [_jsx("label", { children: "Fog Color" }), _jsx("div", { className: "color-picker", children: _jsx("input", { type: "color", value: environment.fogColor.toHexString(), onChange: (e) => handleEnvironmentChange({ fogColor: Color3.FromHexString(e.target.value) }) }) })] }), _jsxs("div", { className: "environment-item", children: [_jsx("label", { children: "Fog Density" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.001", value: environment.fogDensity, onChange: (e) => handleEnvironmentChange({ fogDensity: parseFloat(e.target.value) }) })] }), _jsxs("div", { className: "environment-item", children: [_jsx("label", { children: "Fog Start" }), _jsx(Input, { type: "number", min: "0", step: "0.1", value: environment.fogStart, onChange: (e) => handleEnvironmentChange({ fogStart: parseFloat(e.target.value) }) })] }), _jsxs("div", { className: "environment-item", children: [_jsx("label", { children: "Fog End" }), _jsx(Input, { type: "number", min: "0", step: "0.1", value: environment.fogEnd, onChange: (e) => handleEnvironmentChange({ fogEnd: parseFloat(e.target.value) }) })] })] }))] })] }), _jsxs("div", { className: "environment-section", children: [_jsx("h4", { className: "section-title", children: "Ambient Lighting" }), _jsxs("div", { className: "environment-group", children: [_jsxs("div", { className: "environment-item", children: [_jsx("label", { children: "Ambient Color" }), _jsx("div", { className: "color-picker", children: _jsx("input", { type: "color", value: environment.ambientColor.toHexString(), onChange: (e) => handleEnvironmentChange({ ambientColor: Color3.FromHexString(e.target.value) }) }) })] }), _jsxs("div", { className: "environment-item", children: [_jsx("label", { children: "Ambient Intensity" }), _jsx(Input, { type: "number", min: "0", max: "2", step: "0.1", value: environment.ambientIntensity, onChange: (e) => handleEnvironmentChange({ ambientIntensity: parseFloat(e.target.value) }) })] })] })] }), _jsxs("div", { className: "environment-section", children: [_jsx("h4", { className: "section-title", children: "Reflection & Refraction" }), _jsxs("div", { className: "environment-group", children: [_jsxs("div", { className: "environment-item", children: [_jsx("label", { children: "Reflection Texture" }), _jsx(Input, { placeholder: "Reflection texture URL", value: environment.reflectionTexture || '', onChange: (e) => handleEnvironmentChange({ reflectionTexture: e.target.value }) })] }), _jsxs("div", { className: "environment-item", children: [_jsx("label", { children: "Refraction Texture" }), _jsx(Input, { placeholder: "Refraction texture URL", value: environment.refractionTexture || '', onChange: (e) => handleEnvironmentChange({ refractionTexture: e.target.value }) })] })] })] })] }) }), _jsx(TabsContent, { value: "shadows", className: "lighting-controls-tab-content", children: _jsxs("div", { className: "shadows-section", children: [_jsx("h4", { className: "section-title", children: "Shadow Settings" }), _jsx("div", { className: "shadows-info", children: _jsx("p", { className: "shadows-description", children: "Configure shadow quality and performance settings for all lights in the scene." }) }), _jsxs("div", { className: "shadows-group", children: [_jsxs("div", { className: "shadows-item", children: [_jsx("label", { className: "shadows-label", children: "Global Shadow Quality" }), _jsxs("div", { className: "shadows-controls", children: [_jsx(Button, { variant: "outline", size: "sm", children: "Low" }), _jsx(Button, { variant: "outline", size: "sm", children: "Medium" }), _jsx(Button, { variant: "default", size: "sm", children: "High" }), _jsx(Button, { variant: "outline", size: "sm", children: "Ultra" })] })] }), _jsxs("div", { className: "shadows-item", children: [_jsx("label", { className: "shadows-label", children: "Shadow Map Size" }), _jsxs("div", { className: "shadows-controls", children: [_jsx(Button, { variant: "outline", size: "sm", children: "512" }), _jsx(Button, { variant: "outline", size: "sm", children: "1024" }), _jsx(Button, { variant: "default", size: "sm", children: "2048" }), _jsx(Button, { variant: "outline", size: "sm", children: "4096" })] })] }), _jsxs("div", { className: "shadows-item", children: [_jsx("label", { className: "shadows-label", children: "Shadow Bias" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.001", defaultValue: "0.001", className: "shadows-input" })] }), _jsxs("div", { className: "shadows-item", children: [_jsx("label", { className: "shadows-label", children: "Shadow Darkness" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.1", defaultValue: "0.5", className: "shadows-input" })] })] }), _jsxs("div", { className: "shadows-presets", children: [_jsx("h5", { className: "shadows-presets-title", children: "Shadow Presets" }), _jsxs("div", { className: "shadows-presets-grid", children: [_jsx(Button, { variant: "outline", size: "sm", className: "shadows-preset", children: "Performance" }), _jsx(Button, { variant: "outline", size: "sm", className: "shadows-preset", children: "Balanced" }), _jsx(Button, { variant: "default", size: "sm", className: "shadows-preset", children: "Quality" }), _jsx(Button, { variant: "outline", size: "sm", className: "shadows-preset", children: "Ultra" })] })] })] }) })] })] }));
}
