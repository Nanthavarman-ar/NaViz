import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
const MultiSensoryPreview = ({ scene, onSensoryUpdate }) => {
    const [isActive, setIsActive] = useState(false);
    const [selectedLayer, setSelectedLayer] = useState('combined');
    const [showComfortMap, setShowComfortMap] = useState(true);
    const [showZones, setShowZones] = useState(true);
    const [comfortThreshold, setComfortThreshold] = useState(70); // Overall comfort percentage
    const comfortMeshesRef = useRef([]);
    const zoneMeshesRef = useRef([]);
    const analysisIntervalRef = useRef(null);
    // Analyze visual comfort
    const analyzeVisualComfort = () => {
        const visualZones = [];
        // Sample points throughout the space
        for (let x = -10; x <= 10; x += 2) {
            for (let z = -10; z <= 10; z += 2) {
                const position = new BABYLON.Vector3(x, 1.5, z); // Eye level
                // Check for windows/light sources
                const lightSources = scene.lights.filter(light => {
                    if (light.name.includes('window') || light.name.includes('sun')) {
                        return true;
                    }
                    // Check if light has position property (directional lights don't have position)
                    if ('position' in light && light.position) {
                        return BABYLON.Vector3.Distance(light.position, position) < 5;
                    }
                    return false;
                });
                // Calculate daylight factor (simplified)
                const daylightFactor = Math.min(100, lightSources.length * 20 + Math.random() * 30);
                // Calculate glare risk
                const glareRisk = daylightFactor > 80 ? 'high' :
                    daylightFactor > 50 ? 'medium' : 'low';
                visualZones.push({
                    position,
                    daylightFactor,
                    glareRisk
                });
            }
        }
        const avgDaylightFactor = visualZones.reduce((sum, zone) => sum + zone.daylightFactor, 0) / visualZones.length;
        const glareIndex = visualZones.filter(zone => zone.glareRisk === 'high').length / visualZones.length * 100;
        return {
            daylightFactor: avgDaylightFactor,
            glareIndex,
            colorRendering: 85 + Math.random() * 10, // Simplified
            visualZones
        };
    };
    // Rest of the component remains the same...
    // Create comfort visualization
    const createComfortVisualization = (comfortMap) => {
        // Clear existing meshes
        comfortMeshesRef.current.forEach(mesh => mesh.dispose());
        comfortMeshesRef.current = [];
        comfortMap.forEach(point => {
            const sphere = BABYLON.MeshBuilder.CreateSphere(`comfort_${point.position.x}_${point.position.z}`, {
                diameter: 0.3
            }, scene);
            sphere.position = point.position;
            const material = new BABYLON.StandardMaterial(`comfortMat_${point.position.x}_${point.position.z}`, scene);
            // Color based on comfort score and selected layer
            switch (selectedLayer) {
                case 'visual':
                    material.diffuseColor = getComfortColor(point.visualScore);
                    break;
                case 'acoustic':
                    material.diffuseColor = getComfortColor(point.acousticScore);
                    break;
                case 'thermal':
                    material.diffuseColor = getComfortColor(point.thermalScore);
                    break;
                case 'combined':
                    material.diffuseColor = getComfortColor(point.overallScore);
                    break;
            }
            material.emissiveColor = material.diffuseColor.scale(0.3);
            sphere.material = material;
            comfortMeshesRef.current.push(sphere);
        });
    };
    // Get color based on comfort score
    const getComfortColor = (score) => {
        if (score >= 80)
            return new BABYLON.Color3(0.0, 1.0, 0.0); // Green - excellent
        if (score >= 60)
            return new BABYLON.Color3(0.8, 1.0, 0.0); // Yellow-green - good
        if (score >= 40)
            return new BABYLON.Color3(1.0, 1.0, 0.0); // Yellow - moderate
        if (score >= 20)
            return new BABYLON.Color3(1.0, 0.5, 0.0); // Orange - poor
        return new BABYLON.Color3(1.0, 0.0, 0.0); // Red - critical
    };
    // Create zone visualizations
    const createZoneVisualization = (zones) => {
        // Clear existing zones
        zoneMeshesRef.current.forEach(mesh => mesh.dispose());
        zoneMeshesRef.current = [];
        zones.forEach((zone, index) => {
            const box = BABYLON.MeshBuilder.CreateBox(`zone_${index}`, {
                width: 1,
                height: 0.1,
                depth: 1
            }, scene);
            box.position = zone.position;
            const material = new BABYLON.StandardMaterial(`zoneMat_${index}`, scene);
            // Color based on zone type and selected layer
            if (selectedLayer === 'visual' && 'daylightFactor' in zone) {
                const visualZone = zone;
                material.diffuseColor = getComfortColor(visualZone.daylightFactor);
            }
            else if (selectedLayer === 'acoustic' && 'soundLevel' in zone) {
                const acousticZone = zone;
                material.diffuseColor = getComfortColor(acousticZone.intelligibility * 100);
            }
            else if (selectedLayer === 'thermal' && 'temperature' in zone) {
                const thermalZone = zone;
                material.diffuseColor = getComfortColor(thermalZone.temperature > 20 && thermalZone.temperature < 26 ? 100 : 50);
            }
            else {
                material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            }
            material.alpha = 0.7;
            box.material = material;
            zoneMeshesRef.current.push(box);
        });
    };
    // Analyze acoustic comfort
    const analyzeAcousticComfort = () => {
        const acousticZones = [];
        // Sample points for acoustic analysis
        for (let x = -8; x <= 8; x += 3) {
            for (let z = -8; z <= 8; z += 3) {
                const position = new BABYLON.Vector3(x, 1.5, z);
                // Calculate sound pressure level (simplified)
                const soundLevel = 30 + Math.random() * 40; // 30-70 dB range
                // Calculate reverberation time based on room size
                const roomVolume = 200; // m³ (simplified)
                const surfaceArea = 150; // m² (simplified)
                const reverberation = (0.161 * roomVolume) / surfaceArea;
                // Speech intelligibility (simplified calculation)
                const intelligibility = Math.max(0, Math.min(1, 1 - (reverberation - 0.5) / 1.5));
                acousticZones.push({
                    position,
                    soundLevel,
                    reverberation,
                    intelligibility
                });
            }
        }
        const avgSoundLevel = acousticZones.reduce((sum, zone) => sum + zone.soundLevel, 0) / acousticZones.length;
        const avgReverberation = acousticZones.reduce((sum, zone) => sum + zone.reverberation, 0) / acousticZones.length;
        const avgIntelligibility = acousticZones.reduce((sum, zone) => sum + zone.intelligibility, 0) / acousticZones.length;
        return {
            reverberationTime: avgReverberation,
            soundPressureLevel: avgSoundLevel,
            speechIntelligibility: avgIntelligibility * 100,
            acousticZones
        };
    };
    // Analyze thermal comfort
    const analyzeThermalComfort = () => {
        const thermalZones = [];
        // Sample points for thermal analysis
        for (let x = -6; x <= 6; x += 2) {
            for (let z = -6; z <= 6; z += 2) {
                const position = new BABYLON.Vector3(x, 1.5, z);
                // Calculate temperature (simplified)
                const baseTemp = 22; // Base temperature
                const variation = (Math.sin(x * 0.1) + Math.cos(z * 0.1)) * 2;
                const temperature = baseTemp + variation;
                // Calculate humidity
                const humidity = 45 + Math.random() * 20; // 45-65% range
                // Determine comfort level
                const comfortLevel = temperature < 20 ? 'cold' :
                    temperature > 26 ? 'hot' : 'comfortable';
                thermalZones.push({
                    position,
                    temperature,
                    humidity,
                    comfortLevel
                });
            }
        }
        const avgTemperature = thermalZones.reduce((sum, zone) => sum + zone.temperature, 0) / thermalZones.length;
        const avgHumidity = thermalZones.reduce((sum, zone) => sum + zone.humidity, 0) / thermalZones.length;
        return {
            temperature: avgTemperature,
            humidity: avgHumidity,
            airVelocity: 0.1 + Math.random() * 0.2, // m/s
            radiantTemperature: avgTemperature + 1,
            thermalZones
        };
    };
    // Create comfort map
    const createComfortMap = (visualData, acousticData, thermalData) => {
        const comfortMap = [];
        // Combine all sampling points
        const allPositions = new Set();
        visualData.visualZones.forEach(zone => {
            allPositions.add(`${zone.position.x},${zone.position.z}`);
        });
        acousticData.acousticZones.forEach(zone => {
            allPositions.add(`${zone.position.x},${zone.position.z}`);
        });
        thermalData.thermalZones.forEach(zone => {
            allPositions.add(`${zone.position.x},${zone.position.z}`);
        });
        // Create comfort map points
        allPositions.forEach(posKey => {
            const [x, z] = posKey.split(',').map(Number);
            const position = new BABYLON.Vector3(x, 1.5, z);
            // Find corresponding data points
            const visualZone = visualData.visualZones.find(zone => Math.abs(zone.position.x - x) < 1 && Math.abs(zone.position.z - z) < 1);
            const acousticZone = acousticData.acousticZones.find(zone => Math.abs(zone.position.x - x) < 1 && Math.abs(zone.position.z - z) < 1);
            const thermalZone = thermalData.thermalZones.find(zone => Math.abs(zone.position.x - x) < 1 && Math.abs(zone.position.z - z) < 1);
            // Calculate scores
            const visualScore = visualZone ? visualZone.daylightFactor : 50;
            const acousticScore = acousticZone ? acousticZone.intelligibility * 100 : 50;
            const thermalScore = thermalZone ?
                (thermalZone.comfortLevel === 'comfortable' ? 100 :
                    thermalZone.comfortLevel === 'cold' || thermalZone.comfortLevel === 'hot' ? 30 : 70) : 50;
            const overallScore = (visualScore + acousticScore + thermalScore) / 3;
            comfortMap.push({
                position,
                visualScore,
                acousticScore,
                thermalScore,
                overallScore
            });
        });
        return comfortMap;
    };
    // Generate recommendations
    const generateRecommendations = (visualData, acousticData, thermalData, comfortMap) => {
        const recommendations = [];
        // Visual recommendations
        if (visualData.daylightFactor < 30) {
            recommendations.push('Increase natural light penetration. Consider larger windows or skylights.');
        }
        if (visualData.glareIndex > 50) {
            recommendations.push('High glare risk detected. Install glare-reducing treatments or adjust window orientation.');
        }
        // Acoustic recommendations
        if (acousticData.reverberationTime > 1.5) {
            recommendations.push('Long reverberation time. Add sound-absorbing materials to improve acoustics.');
        }
        if (acousticData.speechIntelligibility < 70) {
            recommendations.push('Poor speech intelligibility. Consider acoustic paneling or room layout adjustments.');
        }
        // Thermal recommendations
        if (thermalData.temperature < 20 || thermalData.temperature > 26) {
            recommendations.push('Temperature outside comfort range. Review HVAC system design.');
        }
        if (thermalData.humidity < 40 || thermalData.humidity > 60) {
            recommendations.push('Humidity levels suboptimal. Consider humidity control systems.');
        }
        // Overall comfort
        const poorComfortPoints = comfortMap.filter(point => point.overallScore < comfortThreshold);
        if (poorComfortPoints.length > comfortMap.length * 0.3) {
            recommendations.push(`${poorComfortPoints.length} areas have poor overall comfort. Multi-disciplinary design review recommended.`);
        }
        if (recommendations.length === 0) {
            recommendations.push('All sensory comfort parameters within acceptable ranges.');
        }
        return recommendations;
    };
    // Run analysis
    const runAnalysis = () => {
        if (!isActive)
            return;
        const visualData = analyzeVisualComfort();
        const acousticData = analyzeAcousticComfort();
        const thermalData = analyzeThermalComfort();
        const comfortMap = createComfortMap(visualData, acousticData, thermalData);
        if (showComfortMap) {
            createComfortVisualization(comfortMap);
        }
        if (showZones) {
            let zonesToShow = [];
            switch (selectedLayer) {
                case 'visual':
                    zonesToShow = visualData.visualZones;
                    break;
                case 'acoustic':
                    zonesToShow = acousticData.acousticZones;
                    break;
                case 'thermal':
                    zonesToShow = thermalData.thermalZones;
                    break;
                case 'combined':
                    zonesToShow = [...visualData.visualZones, ...acousticData.acousticZones, ...thermalData.thermalZones];
                    break;
            }
            createZoneVisualization(zonesToShow);
        }
        const overallComfort = comfortMap.reduce((sum, point) => sum + point.overallScore, 0) / comfortMap.length;
        const recommendations = generateRecommendations(visualData, acousticData, thermalData, comfortMap);
        const sensoryData = {
            visualComfort: visualData,
            acousticComfort: acousticData,
            thermalComfort: thermalData,
            overallComfort,
            comfortMap,
            recommendations
        };
        onSensoryUpdate?.(sensoryData);
    };
    // Toggle analysis
    const toggleAnalysis = () => {
        setIsActive(!isActive);
        if (!isActive) {
            runAnalysis();
        }
        else {
            // Clear visualizations
            comfortMeshesRef.current.forEach(mesh => mesh.dispose());
            zoneMeshesRef.current.forEach(mesh => mesh.dispose());
            comfortMeshesRef.current = [];
            zoneMeshesRef.current = [];
        }
    };
    // Update analysis when parameters change
    useEffect(() => {
        if (isActive) {
            runAnalysis();
        }
    }, [selectedLayer, showComfortMap, showZones, comfortThreshold, isActive]);
    // Auto-update analysis
    useEffect(() => {
        if (isActive) {
            analysisIntervalRef.current = setInterval(runAnalysis, 5000); // Update every 5 seconds
        }
        else {
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
                analysisIntervalRef.current = null;
            }
        }
        return () => {
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
            }
        };
    }, [isActive]);
    // Cleanup
    useEffect(() => {
        return () => {
            comfortMeshesRef.current.forEach(mesh => mesh.dispose());
            zoneMeshesRef.current.forEach(mesh => mesh.dispose());
        };
    }, []);
    return (_jsxs("div", { style: {
            padding: '16px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f1f5f9'
        }, children: [_jsx("h3", { style: { margin: '0 0 16px 0', fontSize: '16px' }, children: "Multi-Sensory Preview" }), _jsx("div", { style: { marginBottom: '16px' }, children: _jsx("button", { onClick: toggleAnalysis, style: {
                        padding: '8px 16px',
                        background: isActive ? '#dc2626' : '#10b981',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }, children: isActive ? 'Stop Analysis' : 'Start Analysis' }) }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 8px 0', fontSize: '14px' }, children: "Analysis Layer" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }, children: ['visual', 'acoustic', 'thermal', 'combined'].map((layer) => (_jsx("button", { onClick: () => setSelectedLayer(layer), style: {
                                padding: '6px',
                                background: selectedLayer === layer ? '#3b82f6' : '#334155',
                                border: '1px solid #475569',
                                borderRadius: '4px',
                                color: '#f1f5f9',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }, children: layer.charAt(0).toUpperCase() + layer.slice(1) }, layer))) })] }), _jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Visualization" }), _jsx("div", { style: { marginBottom: '8px' }, children: _jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: [_jsx("input", { type: "checkbox", checked: showComfortMap, onChange: (e) => setShowComfortMap(e.target.checked) }), "Show Comfort Map"] }) }), _jsx("div", { style: { marginBottom: '8px' }, children: _jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: [_jsx("input", { type: "checkbox", checked: showZones, onChange: (e) => setShowZones(e.target.checked) }), "Show Analysis Zones"] }) }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: ["Comfort Threshold: ", comfortThreshold, "%"] }), _jsx("input", { type: "range", min: "50", max: "90", step: "5", value: comfortThreshold, onChange: (e) => setComfortThreshold(parseInt(e.target.value)), style: { width: '100%' }, "aria-label": "Comfort Threshold" })] })] }), _jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 8px 0', fontSize: '14px' }, children: "Comfort Scale" }), _jsxs("div", { style: { fontSize: '12px', color: '#94a3b8' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: '4px' }, children: [_jsx("div", { style: { width: '12px', height: '12px', background: '#00ff00', marginRight: '8px', borderRadius: '2px' } }), "Excellent (80-100%)"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: '4px' }, children: [_jsx("div", { style: { width: '12px', height: '12px', background: '#80ff00', marginRight: '8px', borderRadius: '2px' } }), "Good (60-80%)"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: '4px' }, children: [_jsx("div", { style: { width: '12px', height: '12px', background: '#ffff00', marginRight: '8px', borderRadius: '2px' } }), "Moderate (40-60%)"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', marginBottom: '4px' }, children: [_jsx("div", { style: { width: '12px', height: '12px', background: '#ff8000', marginRight: '8px', borderRadius: '2px' } }), "Poor (20-40%)"] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center' }, children: [_jsx("div", { style: { width: '12px', height: '12px', background: '#ff0000', marginRight: '8px', borderRadius: '2px' } }), "Critical (0-20%)"] })] })] }), _jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 8px 0', fontSize: '14px' }, children: "Analysis Overview" }), _jsx("div", { style: { fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }, children: isActive ? 'Multi-sensory comfort analysis in progress.' : 'Start analysis to evaluate visual, acoustic, and thermal comfort.' }), _jsx("div", { style: { fontSize: '12px', color: '#94a3b8' }, children: "Combines daylight analysis, acoustic modeling, and thermal comfort calculations for comprehensive environmental assessment." })] })] }));
};
export default MultiSensoryPreview;
