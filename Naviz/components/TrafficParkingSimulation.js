import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './TrafficParkingSimulation.css';
const TrafficParkingSimulation = ({ simulationManager, onSimulationComplete }) => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [results, setResults] = useState(null);
    const [simulationDuration, setSimulationDuration] = useState(60); // seconds
    const [trafficDensity, setTrafficDensity] = useState('medium');
    const [showTrafficVisualization, setShowTrafficVisualization] = useState(false);
    const [showParkingVisualization, setShowParkingVisualization] = useState(false);
    const [showCongestionVisualization, setShowCongestionVisualization] = useState(false);
    const [parkingSpaces, setParkingSpaces] = useState([]);
    const [peopleSimulationEnabled, setPeopleSimulationEnabled] = useState(false);
    useEffect(() => {
        // Sync visualization toggles with SimulationManager
        if (showTrafficVisualization) {
            simulationManager.toggleTrafficVisualization();
        }
        if (showParkingVisualization) {
            simulationManager.toggleParkingVisualization();
        }
        if (showCongestionVisualization) {
            simulationManager.toggleCongestionVisualization();
        }
    }, [simulationManager, showTrafficVisualization, showParkingVisualization, showCongestionVisualization]);
    useEffect(() => {
        // Handle people simulation toggle
        if (simulationManager) {
            if (peopleSimulationEnabled) {
                simulationManager.enablePeopleSimulation();
            }
            else {
                simulationManager.disablePeopleSimulation();
            }
        }
    }, [simulationManager, peopleSimulationEnabled]);
    const startTrafficSimulation = async () => {
        setIsSimulating(true);
        try {
            // Run simulation through SimulationManager
            await simulationManager.simulateTrafficFlow(simulationDuration, trafficDensity);
            await simulationManager.simulateParkingSpaces();
            await simulationManager.simulateCongestion();
            // Get results from SimulationManager
            const trafficFlow = simulationManager.getTrafficFlowData();
            const parkingSpaces = simulationManager.getParkingSpaceData();
            const congestionPoints = simulationManager.getCongestionData();
            // Analyze results
            const totalVehicles = trafficFlow.reduce((sum, flow) => sum + Math.round(flow.density), 0);
            const parkingEfficiency = calculateParkingEfficiency(parkingSpaces);
            const recommendations = generateRecommendations(trafficFlow, parkingSpaces, congestionPoints);
            const simulationResult = {
                totalVehicles,
                parkingEfficiency,
                trafficFlow,
                congestionPoints,
                recommendations,
                parkingSpaces
            };
            setResults(simulationResult);
            if (onSimulationComplete) {
                onSimulationComplete(simulationResult);
            }
        }
        catch (error) {
            console.error('Traffic simulation failed:', error);
            alert('Traffic simulation failed. Please check the console for details.');
        }
        finally {
            setIsSimulating(false);
        }
    };
    const calculateParkingEfficiency = (parkingSpaces) => {
        if (parkingSpaces.length === 0)
            return 0;
        const occupiedSpaces = parkingSpaces.filter(space => space.occupied).length;
        const utilization = (occupiedSpaces / parkingSpaces.length) * 100;
        const handicapSpaces = parkingSpaces.filter(space => space.type === 'handicap').length;
        const electricSpaces = parkingSpaces.filter(space => space.type === 'electric').length;
        let efficiency = 80; // Base efficiency
        // Penalize poor handicap access
        if (handicapSpaces < parkingSpaces.length * 0.05) {
            efficiency -= 10;
        }
        // Penalize poor EV charging access
        if (electricSpaces < parkingSpaces.length * 0.1) {
            efficiency -= 5;
        }
        // Penalize over/under utilization
        if (utilization > 95) {
            efficiency -= 15; // Too crowded
        }
        else if (utilization < 60) {
            efficiency -= 10; // Underutilized
        }
        return Math.max(0, efficiency);
    };
    const generateRecommendations = (trafficFlow, parkingSpaces, congestionPoints) => {
        const recommendations = [];
        const highCongestionRoads = trafficFlow.filter(flow => flow.congestionLevel === 'high');
        if (highCongestionRoads.length > 0) {
            recommendations.push(`${highCongestionRoads.length} roads experiencing high congestion. Consider traffic signal optimization or lane additions.`);
        }
        const lowSpeedRoads = trafficFlow.filter(flow => flow.averageSpeed < 30);
        if (lowSpeedRoads.length > 0) {
            recommendations.push(`${lowSpeedRoads.length} roads have low average speeds. Review traffic flow and potential bottlenecks.`);
        }
        if (congestionPoints.length > 3) {
            recommendations.push("Multiple congestion points detected. Consider implementing smart traffic management systems.");
        }
        const occupiedSpaces = parkingSpaces.filter(space => space.occupied).length;
        const utilization = (occupiedSpaces / parkingSpaces.length) * 100;
        if (utilization > 90) {
            recommendations.push("High parking utilization detected. Consider expanding parking facilities.");
        }
        const handicapSpaces = parkingSpaces.filter(space => space.type === 'handicap').length;
        if (handicapSpaces < parkingSpaces.length * 0.05) {
            recommendations.push("Increase handicap parking spaces to meet accessibility requirements.");
        }
        const electricSpaces = parkingSpaces.filter(space => space.type === 'electric').length;
        if (electricSpaces < parkingSpaces.length * 0.1) {
            recommendations.push("Add more electric vehicle charging stations.");
        }
        recommendations.push("Consider peak hour traffic patterns for comprehensive analysis.");
        return recommendations;
    };
    const exportTrafficReport = () => {
        if (!results)
            return;
        const report = {
            simulationDate: new Date().toISOString(),
            duration: simulationDuration,
            density: trafficDensity,
            results
        };
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `traffic-simulation-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };
    return (_jsxs("div", { className: "traffic-parking-simulation", children: [_jsx("h3", { children: "Traffic & Parking Simulation" }), _jsxs("div", { className: "controls-section", children: [_jsx("div", { className: "control-row", children: _jsxs("label", { className: "control-label", children: ["Simulation Duration:", _jsx("input", { type: "range", min: "30", max: "300", value: simulationDuration, onChange: (e) => setSimulationDuration(Number(e.target.value)), className: "duration-input" }), _jsxs("span", { className: "duration-value", children: [simulationDuration, "s"] })] }) }), _jsx("div", { className: "control-row", children: _jsxs("label", { className: "control-label", children: ["Traffic Density:", _jsxs("select", { value: trafficDensity, onChange: (e) => setTrafficDensity(e.target.value), className: "density-select", children: [_jsx("option", { value: "low", children: "Low" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "high", children: "High" })] })] }) }), _jsx("div", { className: "control-row", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: showTrafficVisualization, onChange: (e) => setShowTrafficVisualization(e.target.checked) }), "Show Traffic Visualization"] }) }), _jsx("div", { className: "control-row", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: peopleSimulationEnabled, onChange: (e) => setPeopleSimulationEnabled(e.target.checked) }), "Enable People Simulation"] }) })] }), _jsxs("div", { className: "action-buttons", children: [_jsx("button", { onClick: startTrafficSimulation, disabled: isSimulating, className: "start-button", children: isSimulating ? 'Simulating...' : 'Start Simulation' }), results && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setPeopleSimulationEnabled(!peopleSimulationEnabled), className: "people-simulation-toggle-button", children: peopleSimulationEnabled ? 'Disable People Simulation' : 'Enable People Simulation' }), _jsx("button", { onClick: exportTrafficReport, className: "export-button", children: "Export Report" })] }))] }), results && (_jsxs("div", { className: "results-section", children: [_jsx("h4", { children: "Simulation Results" }), _jsxs("div", { className: "stats-grid", children: [_jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-value total-vehicles", children: results.totalVehicles }), _jsx("div", { className: "stat-label", children: "Total Vehicles" })] }), _jsxs("div", { className: "stat-card", children: [_jsxs("div", { className: "stat-value parking-efficiency", children: [results.parkingEfficiency.toFixed(1), "%"] }), _jsx("div", { className: "stat-label", children: "Parking Efficiency" })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-value road-segments", children: results.trafficFlow.length }), _jsx("div", { className: "stat-label", children: "Road Segments" })] }), _jsxs("div", { className: "stat-card", children: [_jsx("div", { className: "stat-value congestion-points", children: results.congestionPoints.length }), _jsx("div", { className: "stat-label", children: "Congestion Points" })] })] }), _jsxs("div", { className: "traffic-flow-section", children: [_jsx("h5", { children: "Traffic Flow Analysis" }), _jsx("div", { className: "traffic-flow-list", children: results.trafficFlow.map((flow, index) => {
                                    const congestionText = flow.congestionLevel < 0.3 ? 'Low' : flow.congestionLevel < 0.7 ? 'Medium' : 'High';
                                    const congestionClass = flow.congestionLevel < 0.3 ? 'low' : flow.congestionLevel < 0.7 ? 'medium' : 'high';
                                    return (_jsxs("div", { className: "traffic-flow-item", children: [_jsx("div", { className: "road-name", children: flow.roadId }), _jsxs("div", { className: "road-details", children: ["Vehicles: ", Math.round(flow.density), " | Speed: ", flow.speed.toFixed(1), " km/h"] }), _jsxs("div", { className: `congestion-level ${congestionClass}`, children: ["Congestion: ", congestionText] })] }, index));
                                }) })] }), _jsxs("div", { className: "parking-analysis-section", children: [_jsx("h5", { children: "Parking Analysis" }), _jsx("div", { className: "parking-types-grid", children: results.parkingSpaces && Object.entries(results.parkingSpaces.reduce((acc, space) => {
                                    acc[space.type] = (acc[space.type] || 0) + 1;
                                    return acc;
                                }, {})).map(([type, count]) => (_jsxs("div", { className: "parking-type-card", children: [_jsx("div", { className: "parking-count", children: count }), _jsx("div", { className: "parking-type", children: type })] }, type))) })] }), _jsxs("div", { className: "recommendations-section", children: [_jsx("h5", { children: "Recommendations" }), _jsx("ul", { className: "recommendations-list", children: results.recommendations.map((rec, index) => (_jsx("li", { className: "recommendation-item", children: rec.replace(/<[^>]*>/g, '') }, index))) })] })] }))] }));
};
export default TrafficParkingSimulation;
