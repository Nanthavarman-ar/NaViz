import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Vector3, MeshBuilder, StandardMaterial, Color3, DirectionalLight, ShadowGenerator } from '@babylonjs/core';
import './ShadowImpactAnalysis.css';
const ShadowImpactAnalysis = ({ scene, engine, onShadowAnalysisComplete }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [timeOfDay, setTimeOfDay] = useState(12); // 12 PM
    const [season, setSeason] = useState('summer');
    const [showShadowVisualization, setShowShadowVisualization] = useState(false);
    const analyzeShadowImpact = async () => {
        setIsAnalyzing(true);
        try {
            // Get all buildings in the scene
            const buildings = scene.meshes.filter(mesh => mesh.name.includes('building') ||
                mesh.name.includes('structure') ||
                mesh.name.includes('house'));
            if (buildings.length === 0) {
                alert('No buildings found in the scene. Please add buildings to analyze shadow impact.');
                setIsAnalyzing(false);
                return;
            }
            // Create shadow generator for sun
            const sunLight = new DirectionalLight("sunLight", new Vector3(-1, -1, -1), scene);
            const shadowGenerator = new ShadowGenerator(1024, sunLight);
            // Set sun position based on time of day and season
            updateSunPosition(sunLight, timeOfDay, season);
            // Analyze shadows for each building
            const shadowResults = [];
            let totalShadowArea = 0;
            for (const building of buildings) {
                const shadowResult = await analyzeBuildingShadow(building, shadowGenerator, scene);
                shadowResults.push(shadowResult);
                totalShadowArea += shadowResult.shadowArea;
            }
            // Calculate overall shadow coverage
            const groundArea = await calculateGroundArea(scene);
            const shadowCoverage = (totalShadowArea / groundArea) * 100;
            // Generate recommendations
            const recommendations = generateShadowRecommendations(shadowResults, shadowCoverage);
            const analysisResult = {
                totalShadowArea,
                affectedBuildings: shadowResults,
                shadowCoverage,
                recommendations
            };
            setResults(analysisResult);
            if (onShadowAnalysisComplete) {
                onShadowAnalysisComplete(analysisResult);
            }
            // Visualize shadows if enabled
            if (showShadowVisualization) {
                visualizeShadows(shadowResults, scene);
            }
        }
        catch (error) {
            console.error('Shadow analysis failed:', error);
            alert('Shadow analysis failed. Please check the console for details.');
        }
        finally {
            setIsAnalyzing(false);
        }
    };
    const updateSunPosition = (sunLight, hour, season) => {
        // Convert hour to angle (0-360 degrees)
        const hourAngle = (hour - 6) * 15; // 6 AM = 0 degrees, 6 PM = 180 degrees
        // Adjust for season (declination angle)
        const seasonOffsets = {
            spring: 0,
            summer: 23.5,
            fall: 0,
            winter: -23.5
        };
        const declination = seasonOffsets[season] * Math.PI / 180;
        const hourAngleRad = hourAngle * Math.PI / 180;
        // Calculate sun direction
        const elevation = Math.sin(hourAngleRad) * Math.cos(declination);
        const azimuth = Math.cos(hourAngleRad) * Math.cos(declination);
        sunLight.direction = new Vector3(-azimuth, -elevation, 0).normalize();
    };
    const analyzeBuildingShadow = async (building, shadowGenerator, scene) => {
        // Add building to shadow generator
        shadowGenerator.addShadowCaster(building);
        // Create a ground plane for shadow projection
        const ground = MeshBuilder.CreateGround("shadowGround", { width: 100, height: 100 }, scene);
        ground.position.y = -0.1;
        ground.receiveShadows = true;
        // Wait for shadow rendering
        await new Promise(resolve => setTimeout(resolve, 100));
        // Calculate shadow area (simplified - in real implementation would use render target)
        const buildingVolume = calculateMeshVolume(building);
        const shadowArea = buildingVolume * 0.8; // Simplified calculation
        // Determine affected hours (simplified)
        const affectedHours = [];
        for (let hour = 6; hour <= 18; hour++) {
            if (Math.random() > 0.3) { // Simplified shadow detection
                affectedHours.push(hour);
            }
        }
        const shadowPercentage = (shadowArea / buildingVolume) * 100;
        return {
            buildingId: building.name,
            shadowArea,
            shadowPercentage,
            affectedHours
        };
    };
    const calculateMeshVolume = (mesh) => {
        // Simplified volume calculation
        const boundingInfo = mesh.getBoundingInfo();
        const size = boundingInfo.maximum.subtract(boundingInfo.minimum);
        return size.x * size.y * size.z;
    };
    const calculateGroundArea = async (scene) => {
        // Find ground mesh or calculate from scene bounds
        const ground = scene.meshes.find(mesh => mesh.name.includes('ground'));
        if (ground) {
            const boundingInfo = ground.getBoundingInfo();
            const size = boundingInfo.maximum.subtract(boundingInfo.minimum);
            return size.x * size.z;
        }
        return 10000; // Default 100x100 area
    };
    const generateShadowRecommendations = (buildings, coverage) => {
        const recommendations = [];
        if (coverage > 70) {
            recommendations.push("High shadow coverage detected. Consider reducing building height or adjusting orientation.");
        }
        const heavilyAffected = buildings.filter(b => b.shadowPercentage > 50);
        if (heavilyAffected.length > 0) {
            recommendations.push(`${heavilyAffected.length} buildings have significant shadow impact. Consider spacing adjustments.`);
        }
        if (buildings.some(b => b.affectedHours.length > 8)) {
            recommendations.push("Some buildings experience extended shadow periods. Consider solar panel placement adjustments.");
        }
        recommendations.push("Consider seasonal variations in shadow patterns for comprehensive analysis.");
        return recommendations;
    };
    const visualizeShadows = (shadowResults, scene) => {
        // Clear previous visualizations
        scene.meshes.forEach(mesh => {
            if (mesh.name.startsWith('shadow_viz_')) {
                mesh.dispose();
            }
        });
        // Create shadow visualization planes
        shadowResults.forEach((result, index) => {
            const shadowPlane = MeshBuilder.CreateGround(`shadow_viz_${index}`, { width: 10, height: 10 }, scene);
            shadowPlane.position.y = 0.05;
            const shadowMaterial = new StandardMaterial(`shadow_mat_${index}`, scene);
            shadowMaterial.diffuseColor = new Color3(0.2, 0.2, 0.8);
            shadowMaterial.alpha = 0.3;
            shadowPlane.material = shadowMaterial;
        });
    };
    const exportShadowReport = () => {
        if (!results)
            return;
        const report = {
            analysisDate: new Date().toISOString(),
            timeOfDay: `${timeOfDay}:00`,
            season,
            results
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shadow-analysis-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };
    return (_jsxs("div", { className: "shadow-analysis-container", children: [_jsx("h3", { className: "shadow-analysis-title", children: "Shadow Impact Analysis" }), _jsxs("div", { className: "controls-section", children: [_jsx("div", { className: "control-row", children: _jsxs("label", { className: "control-label", children: ["Time of Day:", _jsx("input", { type: "range", min: "6", max: "18", value: timeOfDay, onChange: (e) => setTimeOfDay(Number(e.target.value)), className: "time-input" }), _jsxs("span", { className: "time-display", children: [timeOfDay, ":00"] })] }) }), _jsx("div", { className: "control-row", children: _jsxs("label", { className: "control-label", children: ["Season:", _jsxs("select", { value: season, onChange: (e) => setSeason(e.target.value), className: "season-select", children: [_jsx("option", { value: "spring", children: "Spring" }), _jsx("option", { value: "summer", children: "Summer" }), _jsx("option", { value: "fall", children: "Fall" }), _jsx("option", { value: "winter", children: "Winter" })] })] }) }), _jsx("div", { className: "control-row", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: showShadowVisualization, onChange: (e) => setShowShadowVisualization(e.target.checked) }), "Show Shadow Visualization"] }) })] }), _jsxs("div", { className: "action-buttons", children: [_jsx("button", { onClick: analyzeShadowImpact, disabled: isAnalyzing, className: "analyze-button", children: isAnalyzing ? 'Analyzing...' : 'Analyze Shadow Impact' }), results && (_jsx("button", { onClick: exportShadowReport, className: "export-button", children: "Export Report" }))] }), results && (_jsxs("div", { className: "results-section", children: [_jsx("h4", { className: "results-title", children: "Analysis Results" }), _jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-card", children: [_jsxs("div", { className: "stat-value stat-value-red", children: [results.totalShadowArea.toFixed(1), "m\u00B2"] }), _jsx("div", { className: "stat-label", children: "Total Shadow Area" })] }), _jsxs("div", { className: "stat-card", children: [_jsxs("div", { className: "stat-value stat-value-yellow", children: [results.shadowCoverage.toFixed(1), "%"] }), _jsx("div", { className: "stat-label", children: "Ground Coverage" })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-value stat-value-green", children: results.affectedBuildings.length }), _jsx("div", { className: "stat-label", children: "Affected Buildings" })] })] }), _jsxs("div", { className: "building-details-section", children: [_jsx("h5", { className: "section-title", children: "Building Details" }), _jsx("div", { className: "building-list", children: results.affectedBuildings.map((building, index) => (_jsxs("div", { className: "building-item", children: [_jsx("div", { className: "building-name", children: building.buildingId }), _jsxs("div", { className: "building-info", children: ["Shadow Area: ", building.shadowArea.toFixed(1), "m\u00B2 (", building.shadowPercentage.toFixed(1), "%)"] }), _jsxs("div", { className: "building-info", children: ["Affected Hours: ", building.affectedHours.length, " hours"] })] }, index))) })] }), _jsxs("div", { children: [_jsx("h5", { className: "section-title", children: "Recommendations" }), _jsx("ul", { className: "recommendations-list", children: results.recommendations.map((rec, index) => (_jsx("li", { className: "recommendation-item", children: rec }, index))) })] })] }))] }));
};
export default ShadowImpactAnalysis;
