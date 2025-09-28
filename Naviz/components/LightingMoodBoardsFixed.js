import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
const LightingMoodBoards = ({ scene, onLightingChange, workspaceArea }) => {
    const [selectedPreset, setSelectedPreset] = useState('neutral');
    const [customIntensity, setCustomIntensity] = useState(1.0);
    const [customTemperature, setCustomTemperature] = useState(5000);
    const [customSunAngle, setCustomSunAngle] = useState(-45);
    const [isActive, setIsActive] = useState(false);
    const [showShadows, setShowShadows] = useState(true);
    const [ambientLevel, setAmbientLevel] = useState(0.3);
    const [realWorldTimeMode, setRealWorldTimeMode] = useState(false);
    const lightRef = useRef(null);
    const shadowGeneratorRef = useRef(null);
    // Lighting presets
    const lightingPresets = {
        warm: {
            name: 'Warm & Cozy',
            intensity: 0.8,
            temperature: 2700, // Warm white
            color: new BABYLON.Color3(1.0, 0.95, 0.8),
            description: 'Perfect for living spaces and bedrooms'
        },
        neutral: {
            name: 'Neutral Daylight',
            intensity: 1.0,
            temperature: 5000, // Daylight
            color: new BABYLON.Color3(1.0, 1.0, 1.0),
            description: 'Balanced lighting for workspaces'
        },
        cool: {
            name: 'Cool & Bright',
            intensity: 1.2,
            temperature: 6500, // Cool white
            color: new BABYLON.Color3(0.9, 0.95, 1.0),
            description: 'Energetic lighting for task areas'
        },
        dramatic: {
            name: 'Dramatic Accent',
            intensity: 0.6,
            temperature: 3000,
            color: new BABYLON.Color3(1.0, 0.7, 0.4),
            description: 'Creates depth and focal points'
        },
        soft: {
            name: 'Soft Ambient',
            intensity: 0.4,
            temperature: 4000,
            color: new BABYLON.Color3(0.95, 0.9, 0.85),
            description: 'Gentle, diffused lighting'
        },
        task: {
            name: 'Task Lighting',
            intensity: 1.5,
            temperature: 4000,
            color: new BABYLON.Color3(1.0, 1.0, 0.95),
            description: 'Focused lighting for work surfaces'
        }
    };
    // Real world time calculations
    const calculateSunAngle = (date, latitude = 40.7128, longitude = -74.0060) => {
        const startOfYear = new Date(date.getFullYear(), 0, 0);
        const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        const solarDeclination = 23.45 * Math.sin((360 / 365) * (284 + dayOfYear) * Math.PI / 180);
        const hourAngle = (date.getHours() - 12) * 15 + longitude;
        const elevation = Math.asin(Math.sin(solarDeclination * Math.PI / 180) * Math.sin(latitude * Math.PI / 180) +
            Math.cos(solarDeclination * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180)) * 180 / Math.PI;
        return Math.max(-90, Math.min(90, elevation));
    };
    const calculateSunIntensity = (sunAngle) => {
        if (sunAngle < -6)
            return 0.05; // Night
        if (sunAngle < 0)
            return 0.1 + (sunAngle + 6) * 0.05; // Dawn/Dusk
        if (sunAngle < 30)
            return 0.4 + sunAngle * 0.02; // Morning/Evening
        if (sunAngle < 60)
            return 0.8 + (sunAngle - 30) * 0.01; // Midday
        return 1.0; // Peak daylight
    };
    const calculateColorTemperature = (sunAngle) => {
        if (sunAngle < -6)
            return 2500; // Night - warm
        if (sunAngle < 0)
            return 3000 + sunAngle * 50; // Dawn/Dusk
        if (sunAngle < 30)
            return 4000 + sunAngle * 50; // Morning
        if (sunAngle < 60)
            return 5000 + (sunAngle - 30) * 50; // Midday
        return 6500; // Peak daylight - cool
    };
    const updateRealWorldLighting = () => {
        if (!isActive || !realWorldTimeMode)
            return;
        const now = new Date();
        const latitude = workspaceArea?.latitude || 40.7128; // Default to NYC
        const longitude = workspaceArea?.longitude || -74.0060;
        const sunAngle = calculateSunAngle(now, latitude, longitude);
        const intensity = calculateSunIntensity(sunAngle);
        const temperature = calculateColorTemperature(sunAngle);
        // Update lighting parameters
        if (lightRef.current) {
            lightRef.current.intensity = intensity;
        }
        // Update directional light
        const directionalLight = scene.lights.find(light => light.name === 'moodboard_directional');
        if (directionalLight) {
            directionalLight.direction = new BABYLON.Vector3(Math.sin((sunAngle * Math.PI) / 180), Math.cos((sunAngle * Math.PI) / 180), 0);
            directionalLight.intensity = intensity * 0.5;
        }
        // Update ambient based on time
        const ambientLevel = Math.max(0.1, intensity * 0.3);
        scene.ambientColor = new BABYLON.Color3(ambientLevel, ambientLevel, ambientLevel);
        // Update color temperature
        updateColorTemperature(temperature);
        const lightingData = {
            preset: 'real-world',
            intensity,
            temperature,
            color: new BABYLON.Color3(1.0, 1.0, 1.0),
            shadows: showShadows,
            ambientLevel,
            sunAngle
        };
        onLightingChange?.(lightingData);
    };
    // Create lighting setup
    const createLightingSetup = (preset) => {
        const presetData = lightingPresets[preset];
        // Remove existing lights
        scene.lights.forEach(light => {
            if (light.name.includes('moodboard')) {
                light.dispose();
            }
        });
        // Create main hemispheric light
        const hemisphericLight = new BABYLON.HemisphericLight('moodboard_hemispheric', new BABYLON.Vector3(0, 1, 0), scene);
        hemisphericLight.intensity = presetData.intensity * customIntensity;
        hemisphericLight.diffuse = presetData.color;
        hemisphericLight.groundColor = presetData.color.scale(0.3);
        lightRef.current = hemisphericLight;
        // Create directional light for shadows
        const directionalLight = new BABYLON.DirectionalLight('moodboard_directional', new BABYLON.Vector3(Math.sin((customSunAngle * Math.PI) / 180), Math.cos((customSunAngle * Math.PI) / 180), 0), scene);
        directionalLight.intensity = presetData.intensity * 0.5 * customIntensity;
        directionalLight.diffuse = presetData.color;
        directionalLight.position = new BABYLON.Vector3(10, 10, 10);
        // Setup shadows if enabled
        if (showShadows) {
            const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);
            shadowGenerator.useBlurExponentialShadowMap = true;
            shadowGenerator.blurKernel = 32;
            shadowGenerator.darkness = 0.4;
            // Apply shadows to all meshes except ground/system meshes
            scene.meshes.forEach(mesh => {
                if (!mesh.name.includes('system') && !mesh.name.includes('camera') &&
                    !mesh.name.includes('sky') && !mesh.name.includes('ground')) {
                    shadowGenerator.addShadowCaster(mesh);
                    mesh.receiveShadows = true;
                }
            });
            shadowGeneratorRef.current = shadowGenerator;
        }
        // Set ambient color
        scene.ambientColor = presetData.color.scale(ambientLevel);
        // Update post-processing for color temperature
        updateColorTemperature(presetData.temperature * (customTemperature / 5000));
        return {
            preset,
            intensity: presetData.intensity * customIntensity,
            temperature: presetData.temperature * (customTemperature / 5000),
            color: presetData.color,
            shadows: showShadows,
            ambientLevel,
            sunAngle: customSunAngle
        };
    };
    // Update color temperature effect
    const updateColorTemperature = (temperature) => {
        // Simple color temperature adjustment
        let r = 1.0, g = 1.0, b = 1.0;
        if (temperature < 5000) {
            // Warmer colors
            r = 1.0;
            g = 0.8 + (temperature / 5000) * 0.2;
            b = 0.6 + (temperature / 5000) * 0.4;
        }
        else {
            // Cooler colors
            r = 0.8 + ((10000 - temperature) / 5000) * 0.2;
            g = 1.0;
            b = 1.0;
        }
        // Apply to scene clear color for overall tint
        scene.clearColor = new BABYLON.Color4(r * 0.1, g * 0.1, b * 0.1, 1.0);
    };
    // Apply lighting preset
    const applyLightingPreset = (preset) => {
        if (!isActive)
            return;
        let lightingData = createLightingSetup(preset);
        // Fix: ensure sunAngle is included in lightingData for type compatibility
        lightingData = {
            ...lightingData,
            sunAngle: customSunAngle
        };
        onLightingChange?.(lightingData);
    };
    // Update lighting parameters
    const updateLightingParameters = () => {
        if (!isActive || !lightRef.current)
            return;
        const presetData = lightingPresets[selectedPreset];
        // Update intensity
        lightRef.current.intensity = presetData.intensity * customIntensity;
        // Update ambient level
        scene.ambientColor = presetData.color.scale(ambientLevel);
        // Update temperature
        updateColorTemperature(presetData.temperature * (customTemperature / 5000));
        // Update directional light direction for sun rotation
        const directionalLight = scene.lights.find(light => light.name === 'moodboard_directional');
        if (directionalLight) {
            directionalLight.direction = new BABYLON.Vector3(Math.sin((customSunAngle * Math.PI) / 180), Math.cos((customSunAngle * Math.PI) / 180), 0);
        }
        const lightingData = {
            preset: selectedPreset,
            intensity: presetData.intensity * customIntensity,
            temperature: presetData.temperature * (customTemperature / 5000),
            color: presetData.color,
            shadows: showShadows,
            ambientLevel,
            sunAngle: customSunAngle
        };
        onLightingChange?.(lightingData);
    };
    // Toggle shadows
    const toggleShadows = (enabled) => {
        setShowShadows(enabled);
        if (enabled && lightRef.current) {
            // Find directional light
            const directionalLight = scene.lights.find(light => light.name === 'moodboard_directional');
            if (directionalLight && !shadowGeneratorRef.current) {
                const shadowGenerator = new BABYLON.ShadowGenerator(1024, directionalLight);
                shadowGenerator.useBlurExponentialShadowMap = true;
                shadowGenerator.blurKernel = 32;
                shadowGenerator.darkness = 0.4;
                scene.meshes.forEach(mesh => {
                    if (!mesh.name.includes('system') && !mesh.name.includes('camera') &&
                        !mesh.name.includes('sky') && !mesh.name.includes('ground')) {
                        shadowGenerator.addShadowCaster(mesh);
                        mesh.receiveShadows = true;
                    }
                });
                shadowGeneratorRef.current = shadowGenerator;
            }
        }
        else if (!enabled && shadowGeneratorRef.current) {
            shadowGeneratorRef.current.dispose();
            shadowGeneratorRef.current = null;
            // Remove shadows from meshes
            scene.meshes.forEach(mesh => {
                mesh.receiveShadows = false;
            });
        }
    };
    // Reset to default lighting
    const resetLighting = () => {
        // Remove custom lights
        scene.lights.forEach(light => {
            if (light.name.includes('moodboard')) {
                light.dispose();
            }
        });
        // Reset ambient color
        scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
        // Remove shadows
        if (shadowGeneratorRef.current) {
            shadowGeneratorRef.current.dispose();
            shadowGeneratorRef.current = null;
        }
        scene.meshes.forEach(mesh => {
            mesh.receiveShadows = false;
        });
        lightRef.current = null;
    };
    // Handle preset change
    useEffect(() => {
        if (isActive) {
            applyLightingPreset(selectedPreset);
        }
    }, [selectedPreset, isActive]);
    // Handle parameter changes
    useEffect(() => {
        if (isActive) {
            updateLightingParameters();
        }
    }, [customIntensity, customTemperature, ambientLevel]);
    // Handle shadow toggle
    useEffect(() => {
        if (isActive) {
            toggleShadows(showShadows);
        }
    }, [showShadows]);
    // Real world time updates
    useEffect(() => {
        if (!realWorldTimeMode || !isActive)
            return;
        // Update immediately
        updateRealWorldLighting();
        // Set up interval for real-time updates
        const interval = setInterval(() => {
            updateRealWorldLighting();
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [realWorldTimeMode, isActive, workspaceArea]);
    // Cleanup
    useEffect(() => {
        return () => {
            resetLighting();
        };
    }, []);
    const currentPreset = lightingPresets[selectedPreset];
    return (_jsxs("div", { style: {
            padding: '16px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f1f5f9'
        }, children: [_jsx("h3", { style: { margin: '0 0 16px 0', fontSize: '16px' }, children: "Lighting Mood Boards" }), _jsx("div", { style: { marginBottom: '16px' }, children: _jsx("button", { onClick: () => {
                        setIsActive(!isActive);
                        if (!isActive) {
                            applyLightingPreset(selectedPreset);
                        }
                        else {
                            resetLighting();
                        }
                    }, style: {
                        padding: '8px 16px',
                        background: isActive ? '#dc2626' : '#10b981',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }, children: isActive ? 'Disable Mood Lighting' : 'Enable Mood Lighting' }) }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 8px 0', fontSize: '14px' }, children: "Lighting Presets" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }, children: Object.entries(lightingPresets).map(([key, preset]) => (_jsxs("button", { onClick: () => setSelectedPreset(key), style: {
                                padding: '8px',
                                background: selectedPreset === key ? '#3b82f6' : '#334155',
                                border: '1px solid #475569',
                                borderRadius: '4px',
                                color: '#f1f5f9',
                                fontSize: '12px',
                                cursor: 'pointer',
                                textAlign: 'left'
                            }, children: [_jsx("div", { style: { fontWeight: 'bold', marginBottom: '2px' }, children: preset.name }), _jsx("div", { style: { fontSize: '10px', opacity: 0.8 }, children: preset.description })] }, key))) })] }), _jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Custom Adjustments" }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: ["Intensity: ", customIntensity.toFixed(1), "x"] }), _jsx("input", { type: "range", min: "0.1", max: "2.0", step: "0.1", value: customIntensity, onChange: (e) => setCustomIntensity(parseFloat(e.target.value)), style: { width: '100%' }, "aria-label": "Lighting Intensity" })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: ["Temperature: ", customTemperature, "K"] }), _jsx("input", { type: "range", min: "2700", max: "6500", step: "100", value: customTemperature, onChange: (e) => setCustomTemperature(parseInt(e.target.value)), style: { width: '100%' }, "aria-label": "Color Temperature" })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: ["Ambient Level: ", (ambientLevel * 100).toFixed(0), "%"] }), _jsx("input", { type: "range", min: "0.0", max: "1.0", step: "0.05", value: ambientLevel, onChange: (e) => setAmbientLevel(parseFloat(e.target.value)), style: { width: '100%' }, "aria-label": "Ambient Lighting Level" })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: ["Sun Angle: ", customSunAngle, "\u00B0"] }), _jsx("input", { type: "range", min: "-90", max: "90", step: "5", value: customSunAngle, onChange: (e) => setCustomSunAngle(parseInt(e.target.value)), style: { width: '100%' }, "aria-label": "Sun Angle" })] }), _jsx("div", { style: { marginBottom: '8px' }, children: _jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: [_jsx("input", { type: "checkbox", checked: showShadows, onChange: (e) => setShowShadows(e.target.checked), "aria-label": "Enable Shadows" }), "Enable Shadows"] }) }), _jsxs("div", { style: { marginBottom: '8px' }, children: [_jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: [_jsx("input", { type: "checkbox", checked: realWorldTimeMode, onChange: (e) => setRealWorldTimeMode(e.target.checked), "aria-label": "Enable Real World Time Lighting" }), "Real World Time Lighting"] }), _jsx("div", { style: { fontSize: '10px', color: '#94a3b8', marginTop: '2px' }, children: "Automatically adjusts lighting based on current time and location" })] })] }), _jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 8px 0', fontSize: '14px' }, children: "Current Settings" }), _jsxs("div", { style: { fontSize: '12px', color: '#94a3b8' }, children: [_jsxs("div", { children: ["Preset: ", currentPreset.name] }), _jsxs("div", { children: ["Intensity: ", (currentPreset.intensity * customIntensity).toFixed(1), "x"] }), _jsxs("div", { children: ["Temperature: ", Math.round(currentPreset.temperature * (customTemperature / 5000)), "K"] }), _jsxs("div", { children: ["Sun Angle: ", customSunAngle, "\u00B0"] }), _jsxs("div", { children: ["Shadows: ", showShadows ? 'Enabled' : 'Disabled'] })] })] }), _jsx("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px' }, children: _jsx("button", { onClick: resetLighting, style: {
                        padding: '8px 16px',
                        background: '#6b7280',
                        border: '1px solid #9ca3af',
                        borderRadius: '4px',
                        color: '#f1f5f9',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }, children: "Reset to Default" }) })] }));
};
export default LightingMoodBoards;
