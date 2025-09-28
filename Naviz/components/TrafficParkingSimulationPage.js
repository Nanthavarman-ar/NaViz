import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useApp } from '../contexts/AppContext';
import TrafficParkingSimulation from './TrafficParkingSimulation';
import { ArrowLeft } from 'lucide-react';
const TrafficParkingSimulationPage = () => {
    const { setCurrentPage } = useApp();
    const [simulationManager, setSimulationManager] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    useEffect(() => {
        // Initialize simulation manager with minimal Babylon.js setup
        const initializeSimulation = async () => {
            try {
                // For standalone page, we'll create a minimal Babylon.js scene
                const canvas = document.createElement('canvas');
                canvas.style.display = 'none'; // Hide the canvas since we're not rendering
                document.body.appendChild(canvas);
                const engine = new (await import('@babylonjs/core')).Engine(canvas, true);
                const scene = new (await import('@babylonjs/core')).Scene(engine);
                // Create a minimal FeatureManager mock
                const featureManager = {
                    features: [],
                    featureStates: new Map(),
                    deviceCapabilities: {},
                    userPreferences: {},
                    registerFeature: () => { },
                    unregisterFeature: () => { },
                    enableFeature: () => { },
                    disableFeature: () => { },
                    isFeatureEnabled: () => false,
                    getFeatureState: () => null,
                    setFeatureState: () => { },
                    getDeviceCapabilities: () => ({}),
                    setUserPreference: () => { },
                    getUserPreference: () => null,
                    initialize: () => Promise.resolve(),
                    dispose: () => { }
                };
                const manager = new (await import('./SimulationManager')).SimulationManager(engine, scene, featureManager);
                setSimulationManager(manager);
                setIsInitialized(true);
            }
            catch (error) {
                console.error('Failed to initialize simulation:', error);
                setIsInitialized(true); // Still set to true to show the UI
            }
        };
        initializeSimulation();
    }, []);
    const handleSimulationComplete = (results) => {
        console.log('Simulation completed:', results);
        // Handle results - could show toast or update UI
    };
    if (!isInitialized || !simulationManager) {
        return (_jsx("div", { className: "min-h-screen bg-slate-900 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { className: "text-white text-lg", children: "Initializing Traffic Simulation..." })] }) }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-slate-900 text-white", children: [_jsx("header", { className: "bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { onClick: () => setCurrentPage('tools-features'), variant: "outline", className: "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back to Tools"] }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Traffic & Parking Simulation" }), _jsx("p", { className: "text-gray-400", children: "Analyze traffic flow and parking efficiency" })] })] }) }) }), _jsx("main", { className: "p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs(Card, { className: "bg-slate-800/50 border-slate-700 mb-6", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-cyan-400", children: "About This Tool" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-300", children: "This simulation tool analyzes traffic patterns and parking efficiency in urban environments. Configure simulation parameters, run the analysis, and get detailed reports on congestion, parking utilization, and recommendations for improvement." }) })] }), _jsx("div", { className: "bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700 p-6", children: _jsx(TrafficParkingSimulation, { simulationManager: simulationManager, onSimulationComplete: handleSimulationComplete }) })] }) })] }));
};
export default TrafficParkingSimulationPage;
