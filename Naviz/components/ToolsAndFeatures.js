import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useApp } from '../contexts/AppContext';
import { Activity, Calculator, Brain, MapPin, Construction, Smartphone, Settings } from 'lucide-react';
const ToolsAndFeatures = () => {
    const { setCurrentPage } = useApp();
    const categories = [
        {
            id: 'simulations',
            title: 'Simulations',
            description: 'Run various environmental and traffic simulations',
            icon: _jsx(Activity, { className: "w-6 h-6" }),
            tools: [
                { id: 'flood', name: 'Flood Simulation', description: 'Analyze flood impact and water flow', page: 'flood-simulation', available: true },
                { id: 'traffic', name: 'Traffic & Parking', description: 'Simulate traffic flow and parking efficiency', page: 'traffic-parking-simulation', available: true },
                { id: 'wind', name: 'Wind Tunnel', description: 'Test wind effects on structures', page: 'wind-tunnel-simulation', available: true },
                { id: 'noise', name: 'Noise Simulation', description: 'Analyze sound propagation and privacy', page: 'noise-simulation', available: true },
                { id: 'circulation', name: 'Circulation Flow', description: 'Model people movement patterns', page: 'circulation-flow-simulation', available: true }
            ]
        },
        {
            id: 'analysis',
            title: 'Analysis Tools',
            description: 'Professional analysis and measurement tools',
            icon: _jsx(Calculator, { className: "w-6 h-6" }),
            tools: [
                { id: 'cost', name: 'Cost Estimator', description: 'Calculate material and labor costs', page: 'cost-estimator', available: true },
                { id: 'measure', name: 'Measure Tool', description: 'Precise measurement and dimensioning', page: 'measure-tool', available: true },
                { id: 'energy', name: 'Energy Analysis', description: 'Analyze energy efficiency and consumption', page: 'energy-analysis', available: true },
                { id: 'sunlight', name: 'Sunlight Analysis', description: 'Study natural lighting and shadows', page: 'sunlight-analysis', available: true },
                { id: 'shadow', name: 'Shadow Impact', description: 'Analyze shadow casting and light blocking', page: 'shadow-impact-analysis', available: true },
                { id: 'ergonomic', name: 'Ergonomic Testing', description: 'Test workspace ergonomics and comfort', page: 'ergonomic-testing', available: true }
            ]
        },
        {
            id: 'ai',
            title: 'AI Features',
            description: 'Artificial intelligence powered tools',
            icon: _jsx(Brain, { className: "w-6 h-6" }),
            tools: [
                { id: 'structural', name: 'AI Structural Advisor', description: 'Get AI recommendations for structural design', page: 'ai-structural-advisor', available: true },
                { id: 'codesigner', name: 'AI Co-Designer', description: 'Collaborate with AI for design decisions', page: 'ai-co-designer', available: true },
                { id: 'voice', name: 'AI Voice Assistant', description: 'Voice-controlled design assistance', page: 'ai-voice-assistant', available: true },
                { id: 'autofurnish', name: 'Auto-Furnish', description: 'AI-powered furniture placement', page: 'auto-furnish', available: true }
            ]
        },
        {
            id: 'environment',
            title: 'Environment',
            description: 'Environmental context and terrain tools',
            icon: _jsx(MapPin, { className: "w-6 h-6" }),
            tools: [
                { id: 'weather', name: 'Weather System', description: 'Simulate weather conditions and effects', page: 'weather-system', available: true },
                { id: 'site-context', name: 'Site Context', description: 'Generate and analyze site surroundings', page: 'site-context-generator', available: true },
                { id: 'topography', name: 'Topography', description: 'Create and modify terrain features', page: 'topography-generator', available: true },
                { id: 'geolocation', name: 'Geo Location', description: 'GPS-based location and mapping', page: 'geo-location-context', available: true }
            ]
        },
        {
            id: 'construction',
            title: 'Construction',
            description: 'Construction planning and BIM tools',
            icon: _jsx(Construction, { className: "w-6 h-6" }),
            tools: [
                { id: 'overlay', name: 'Construction Overlay', description: 'Visualize construction phases', page: 'construction-overlay', available: true },
                { id: 'bim', name: 'BIM Integration', description: 'Building Information Modeling', page: 'bim-integration', available: true },
                { id: 'materials', name: 'Material Manager', description: 'Manage construction materials', page: 'material-manager', available: true }
            ]
        },
        {
            id: 'interaction',
            title: 'Interaction',
            description: 'Advanced interaction and collaboration tools',
            icon: _jsx(Smartphone, { className: "w-6 h-6" }),
            tools: [
                { id: 'vrar', name: 'VR/AR Mode', description: 'Virtual and Augmented Reality experience', page: 'vr-ar-mode', available: true },
                { id: 'hand-tracking', name: 'Hand Tracking', description: 'Gesture-based interaction', page: 'hand-tracking', available: true },
                { id: 'multi-user', name: 'Multi-User', description: 'Collaborative design sessions', page: 'multi-user', available: true },
                { id: 'voice-chat', name: 'Voice Chat', description: 'Real-time voice communication', page: 'voice-chat', available: true },
                { id: 'presenter', name: 'Presenter Mode', description: 'Professional presentation tools', page: 'presenter-mode', available: true },
                { id: 'annotations', name: 'Annotations', description: 'Add notes and markup to designs', page: 'annotations', available: true }
            ]
        },
        {
            id: 'utilities',
            title: 'Utilities',
            description: 'Essential design and inspection tools',
            icon: _jsx(Settings, { className: "w-6 h-6" }),
            tools: [
                { id: 'inspector', name: 'Property Inspector', description: 'Detailed object property analysis', page: 'property-inspector', available: true },
                { id: 'browser', name: 'Scene Browser', description: 'Navigate and manage scene objects', page: 'scene-browser', available: true },
                { id: 'minimap', name: 'Minimap', description: 'Overview navigation aid', page: 'minimap', available: true },
                { id: 'material-editor', name: 'Material Editor', description: 'Edit material properties', page: 'material-editor', available: true },
                { id: 'lighting', name: 'Lighting Controls', description: 'Manage lighting presets', page: 'lighting-presets', available: true },
                { id: 'export', name: 'Export Tool', description: 'Export designs and reports', page: 'export-tool', available: true }
            ]
        }
    ];
    const handleToolClick = (page) => {
        setCurrentPage(page);
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-900 text-white", children: [_jsx("header", { className: "bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Tools & Features" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Explore all available design and analysis tools" })] }), _jsx(Button, { onClick: () => setCurrentPage('home'), variant: "outline", className: "border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black", children: "\u2190 Back to Home" })] }) }) }), _jsx("main", { className: "max-w-7xl mx-auto px-6 py-8", children: _jsx("div", { className: "space-y-8", children: categories.map((category) => (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "text-cyan-400", children: category.icon }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-white", children: category.title }), _jsx("p", { className: "text-gray-400", children: category.description })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: category.tools.map((tool) => (_jsxs(Card, { className: `bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 ${!tool.available ? 'opacity-50' : 'cursor-pointer hover:scale-105'}`, onClick: () => tool.available && handleToolClick(tool.page), children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsx(CardTitle, { className: "text-white text-lg", children: tool.name }), _jsx(CardDescription, { className: "text-gray-400", children: tool.description })] }), _jsx(CardContent, { children: _jsx(Button, { className: `w-full ${tool.available
                                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
                                                    : 'bg-gray-600 cursor-not-allowed'}`, disabled: !tool.available, onClick: (e) => {
                                                    e.stopPropagation();
                                                    tool.available && handleToolClick(tool.page);
                                                }, children: tool.available ? 'Open Tool' : 'Coming Soon' }) })] }, tool.id))) })] }, category.id))) }) })] }));
};
export default ToolsAndFeatures;
