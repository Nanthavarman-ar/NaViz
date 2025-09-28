import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
import { calculateRealWorldLighting, temperatureToRGB } from '../utils/lightingUtils';
const LightingPresets = ({ scene, onPresetChange, workspaceArea }) => {
    const [selectedPreset, setSelectedPreset] = useState('day');
    const [customIntensity, setCustomIntensity] = useState(1.0);
    const [customAngle, setCustomAngle] = useState(45);
    const [exposure, setExposure] = useState(1.0);
    const [realWorldTimeMode, setRealWorldTimeMode] = useState(false);
    const presets = [
        {
            id: 'day',
            name: 'Day',
            icon: '☀️',
            description: 'Bright daylight conditions',
            sunIntensity: 1.2,
            sunAngle: 45,
            ambientIntensity: 0.3,
            skyboxColor: new BABYLON.Color3(0.5, 0.7, 1.0),
            groundColor: new BABYLON.Color3(0.2, 0.3, 0.1),
            hdriUrl: 'textures/hdri/day.env' // example path
        },
        {
            id: 'sunset',
            name: 'Sunset',
            icon: '🌅',
            description: 'Warm evening light',
            sunIntensity: 0.8,
            sunAngle: 15,
            ambientIntensity: 0.2,
            skyboxColor: new BABYLON.Color3(1.0, 0.6, 0.3),
            groundColor: new BABYLON.Color3(0.3, 0.2, 0.1),
            hdriUrl: 'textures/hdri/sunset.env'
        },
        {
            id: 'night',
            name: 'Night',
            icon: '🌙',
            description: 'Dark night time',
            sunIntensity: 0.1,
            sunAngle: -30,
            ambientIntensity: 0.05,
            skyboxColor: new BABYLON.Color3(0.1, 0.1, 0.2),
            groundColor: new BABYLON.Color3(0.05, 0.05, 0.05),
            hdriUrl: 'textures/hdri/night.env'
        },
        {
            id: 'studio',
            name: 'Studio',
            icon: '💡',
            description: 'Even studio lighting',
            sunIntensity: 0.6,
            sunAngle: 90,
            ambientIntensity: 0.4,
            skyboxColor: new BABYLON.Color3(0.8, 0.8, 0.9),
            groundColor: new BABYLON.Color3(0.4, 0.4, 0.4),
            hdriUrl: 'textures/hdri/studio.env'
        }
    ];
    // Load HDRI environment texture
    const loadHdriEnvironment = (url) => {
        if (!url)
            return;
        const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(url, scene);
        scene.environmentTexture = hdrTexture;
    };
    const applyPreset = (preset) => {
        if (realWorldTimeMode)
            return; // Don't apply presets when real world time mode is active
        setSelectedPreset(preset.id);
        // Directional light (sun)
        const directionalLight = scene.lights.find(light => light instanceof BABYLON.DirectionalLight);
        if (directionalLight) {
            directionalLight.intensity = preset.sunIntensity;
            const angleRad = (preset.sunAngle * Math.PI) / 180;
            directionalLight.direction = new BABYLON.Vector3(Math.sin(angleRad), -Math.cos(angleRad), 0);
        }
        // Hemispheric light (ambient)
        const hemisphericLight = scene.lights.find(light => light instanceof BABYLON.HemisphericLight);
        if (hemisphericLight) {
            hemisphericLight.intensity = preset.ambientIntensity;
            hemisphericLight.groundColor = preset.groundColor;
        }
        // Load HDRI environment texture
        loadHdriEnvironment(preset.hdriUrl);
        // Update skybox color if applicable
        // (Implementation depends on skybox setup)
        onPresetChange?.(preset);
    };
    const applyCustomSettings = () => {
        if (realWorldTimeMode)
            return; // Don't apply custom settings when real world time mode is active
        // Directional light
        const directionalLight = scene.lights.find(light => light instanceof BABYLON.DirectionalLight);
        if (directionalLight) {
            directionalLight.intensity = customIntensity;
            const angleRad = (customAngle * Math.PI) / 180;
            directionalLight.direction = new BABYLON.Vector3(Math.sin(angleRad), -Math.cos(angleRad), 0);
        }
    };
    // Update real world lighting based on current time and location
    const updateRealWorldLighting = () => {
        if (!scene || !realWorldTimeMode)
            return;
        const now = new Date();
        const latitude = workspaceArea?.latitude || 40.7128;
        const longitude = workspaceArea?.longitude || -74.0060;
        const lightingParams = calculateRealWorldLighting(now, latitude, longitude);
        // Update directional light (sun)
        const directionalLight = scene.lights.find(light => light instanceof BABYLON.DirectionalLight);
        if (directionalLight) {
            directionalLight.intensity = lightingParams.intensity;
            const angleRad = (lightingParams.sunAngle * Math.PI) / 180;
            directionalLight.direction = new BABYLON.Vector3(Math.sin(angleRad), -Math.cos(angleRad), 0);
        }
        // Update hemispheric light (ambient) based on time
        const hemisphericLight = scene.lights.find(light => light instanceof BABYLON.HemisphericLight);
        if (hemisphericLight) {
            // Adjust ambient intensity based on sun angle
            const ambientIntensity = Math.max(0.05, Math.min(0.3, lightingParams.intensity * 0.3));
            hemisphericLight.intensity = ambientIntensity;
            // Adjust ground color based on time
            const tempRGB = temperatureToRGB(lightingParams.temperature);
            hemisphericLight.groundColor = new BABYLON.Color3(tempRGB.r * 0.3, tempRGB.g * 0.3, tempRGB.b * 0.3);
        }
        // Update scene tint based on color temperature
        const tempRGB = temperatureToRGB(lightingParams.temperature);
        // Apply color grading based on temperature (simplified implementation)
        // This would typically use post-processing effects, but for now we'll adjust ambient light
    };
    // Apply exposure to scene and update real world lighting if enabled
    useEffect(() => {
        if (!scene)
            return;
        scene.imageProcessingConfiguration.exposure = exposure;
        if (realWorldTimeMode) {
            updateRealWorldLighting();
            // Update lighting every minute
            const interval = setInterval(() => {
                updateRealWorldLighting();
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [exposure, scene, realWorldTimeMode, workspaceArea]);
    return (_jsxs("div", { style: {
            padding: '16px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f1f5f9'
        }, children: [_jsx("h3", { style: { margin: '0 0 16px 0', fontSize: '16px' }, children: "Lighting Presets" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }, children: presets.map((preset) => (_jsxs("button", { onClick: () => applyPreset(preset), disabled: realWorldTimeMode, style: {
                        padding: '12px',
                        background: realWorldTimeMode ? '#1e293b' : (selectedPreset === preset.id ? '#3b82f6' : '#334155'),
                        border: '1px solid #475569',
                        borderRadius: '6px',
                        color: realWorldTimeMode ? '#64748b' : '#f1f5f9',
                        cursor: realWorldTimeMode ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        fontSize: '14px',
                        opacity: realWorldTimeMode ? 0.6 : 1
                    }, title: realWorldTimeMode ? 'Disabled when Real World Time mode is active' : preset.description, children: [_jsx("div", { style: { fontSize: '20px', marginBottom: '4px' }, children: preset.icon }), _jsx("div", { style: { fontWeight: 'bold' }, children: preset.name })] }, preset.id))) }), _jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }, children: [_jsx("label", { style: { fontSize: '14px', fontWeight: 'bold' }, children: "Real World Time" }), _jsx("button", { onClick: () => setRealWorldTimeMode(!realWorldTimeMode), style: {
                                    padding: '6px 12px',
                                    background: realWorldTimeMode ? '#10b981' : '#334155',
                                    border: '1px solid #475569',
                                    borderRadius: '4px',
                                    color: '#f1f5f9',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    transition: 'all 0.2s ease'
                                }, children: realWorldTimeMode ? 'ON' : 'OFF' })] }), realWorldTimeMode && (_jsx("div", { style: { fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }, children: "Lighting automatically updates based on current time and location" }))] }), _jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Custom Settings" }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: ["Sun Intensity: ", customIntensity.toFixed(2)] }), _jsx("input", { type: "range", min: "0", max: "2", step: "0.1", value: customIntensity, onChange: (e) => setCustomIntensity(parseFloat(e.target.value)), style: { width: '100%' }, title: "Adjust sun intensity", "aria-label": "Sun intensity slider" })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: ["Sun Angle: ", customAngle, "\u00B0"] }), _jsx("input", { type: "range", min: "-90", max: "90", step: "5", value: customAngle, onChange: (e) => setCustomAngle(parseInt(e.target.value)), style: { width: '100%' }, title: "Adjust sun angle", "aria-label": "Sun angle slider" })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: ["Exposure: ", exposure.toFixed(2)] }), _jsx("input", { type: "range", min: "0.1", max: "3", step: "0.1", value: exposure, onChange: (e) => setExposure(parseFloat(e.target.value)), style: { width: '100%' }, title: "Adjust exposure", "aria-label": "Exposure slider" })] }), _jsx("button", { onClick: applyCustomSettings, style: {
                            width: '100%',
                            padding: '8px',
                            background: '#10b981',
                            border: '1px solid #34d399',
                            borderRadius: '4px',
                            color: '#f1f5f9',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }, children: "Apply Custom Settings" })] })] }));
};
export default LightingPresets;
