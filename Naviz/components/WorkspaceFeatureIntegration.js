import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
// Complete feature configuration - moved outside component to prevent recreation
const features = [
    // Simulation Features
    { id: 'weather', name: 'Weather System', icon: '☀️', category: 'simulation', description: 'Real-time weather simulation with dynamic lighting', performance: 'medium', hotkey: 'W' },
    { id: 'flood', name: 'Flood Simulation', icon: '🌊', category: 'simulation', description: 'Water level simulation and flood analysis', performance: 'high', hotkey: 'F' },
    { id: 'enhancedFlood', name: 'Enhanced Flood', icon: '🌊+', category: 'simulation', description: 'Advanced flood simulation with particle effects', performance: 'high', dependencies: ['flood'], premium: true },
    { id: 'wind', name: 'Wind Tunnel', icon: '💨', category: 'simulation', description: 'Aerodynamic analysis and wind flow visualization', performance: 'high', hotkey: 'T' },
    { id: 'noise', name: 'Noise Simulation', icon: '🔊', category: 'simulation', description: 'Acoustic analysis and sound propagation', performance: 'medium', hotkey: 'N' },
    { id: 'traffic', name: 'Traffic & Parking', icon: '🚗', category: 'simulation', description: 'Traffic flow and parking optimization', performance: 'medium', hotkey: 'R' },
    { id: 'shadow', name: 'Shadow Analysis', icon: '🌑', category: 'simulation', description: 'Sun path and shadow impact analysis', performance: 'low', hotkey: 'S' },
    { id: 'circulation', name: 'Circulation Flow', icon: '🔄', category: 'simulation', description: 'Pedestrian flow and circulation patterns', performance: 'medium' },
    // AI Features
    { id: 'aiAdvisor', name: 'AI Structural Advisor', icon: '🤖', category: 'ai', description: 'AI-powered structural analysis and recommendations', performance: 'low', hotkey: 'A', premium: true },
    { id: 'autoFurnish', name: 'Auto-Furnish', icon: '🏠', category: 'ai', description: 'Automatic furniture placement and room optimization', performance: 'medium', hotkey: 'U', premium: true },
    { id: 'aiCoDesigner', name: 'AI Co-Designer', icon: '🎨', category: 'ai', description: 'Collaborative AI design assistant', performance: 'low', hotkey: 'C', premium: true },
    { id: 'voiceAssistant', name: 'Voice Assistant', icon: '🎤', category: 'ai', description: 'Voice-controlled workspace navigation', performance: 'low', hotkey: 'V' },
    // Analysis Features
    { id: 'measure', name: 'Measure Tool', icon: '📐', category: 'analysis', description: 'Precision measurement and dimensioning', performance: 'low', hotkey: 'M' },
    { id: 'ergonomic', name: 'Ergonomic Testing', icon: '👤', category: 'analysis', description: 'Human factors and ergonomic analysis', performance: 'medium', hotkey: 'E' },
    { id: 'energy', name: 'Energy Analysis', icon: '⚡', category: 'analysis', description: 'Energy efficiency and consumption analysis', performance: 'medium', hotkey: 'G' },
    { id: 'cost', name: 'Cost Estimator', icon: '💰', category: 'analysis', description: 'Real-time cost estimation and budgeting', performance: 'low', hotkey: 'O' },
    { id: 'soundPrivacy', name: 'Sound Privacy', icon: '🔇', category: 'analysis', description: 'Acoustic privacy and sound isolation analysis', performance: 'medium' },
    { id: 'furniture', name: 'Furniture Clearance', icon: '🪑', category: 'analysis', description: 'Furniture placement and clearance checking', performance: 'low' },
    // Collaboration Features
    { id: 'multiUser', name: 'Multi-User', icon: '👥', category: 'collaboration', description: 'Real-time collaborative workspace', performance: 'medium', hotkey: 'L', premium: true },
    { id: 'voiceChat', name: 'Voice Chat', icon: '🎙️', category: 'collaboration', description: 'Integrated voice communication', performance: 'low', hotkey: 'H', dependencies: ['multiUser'] },
    { id: 'annotations', name: 'Annotations', icon: '📝', category: 'collaboration', description: '3D annotations and markup tools', performance: 'low', hotkey: 'P' },
    { id: 'presenter', name: 'Presenter Mode', icon: '📺', category: 'collaboration', description: 'Presentation and walkthrough mode', performance: 'low', hotkey: 'I' },
    // Immersive Features
    { id: 'vr', name: 'VR Mode', icon: '🥽', category: 'immersive', description: 'Virtual reality workspace experience', performance: 'high', hotkey: 'X', conflicts: ['ar'], premium: true },
    { id: 'ar', name: 'AR Mode', icon: '📱', category: 'immersive', description: 'Augmented reality overlay', performance: 'high', hotkey: 'Z', conflicts: ['vr'], premium: true },
    { id: 'handTracking', name: 'Hand Tracking', icon: '✋', category: 'immersive', description: 'Gesture-based interaction', performance: 'medium', hotkey: 'K', dependencies: ['vr', 'ar'] },
    { id: 'multiSensory', name: 'Multi-Sensory', icon: '👁️', category: 'immersive', description: 'Multi-sensory feedback and haptics', performance: 'medium', hotkey: 'J', premium: true },
    // Environment Features
    { id: 'siteContext', name: 'Site Context', icon: '🌍', category: 'environment', description: 'Real-world site context integration', performance: 'medium' },
    { id: 'topography', name: 'Topography', icon: '🏔️', category: 'environment', description: 'Terrain generation and modification', performance: 'medium' },
    { id: 'lighting', name: 'Lighting Moods', icon: '💡', category: 'environment', description: 'Dynamic lighting and mood presets', performance: 'low' },
    { id: 'geoLocation', name: 'Geo Location', icon: '📍', category: 'environment', description: 'GPS-based positioning and mapping', performance: 'low' },
    // Construction Features
    { id: 'construction', name: 'Construction Overlay', icon: '🏗️', category: 'construction', description: 'Construction phase visualization', performance: 'medium' },
    { id: 'bim', name: 'BIM Integration', icon: '📋', category: 'construction', description: 'Building Information Modeling integration', performance: 'medium', premium: true },
    { id: 'materials', name: 'Material Manager', icon: '🧱', category: 'construction', description: 'Advanced material editing and management', performance: 'low' },
    // Utilities
    { id: 'sceneBrowser', name: 'Scene Browser', icon: '📂', category: 'utilities', description: 'Hierarchical scene object browser', performance: 'low' },
    { id: 'propertyInspector', name: 'Property Inspector', icon: '🔍', category: 'utilities', description: 'Object property editor', performance: 'low' },
    { id: 'pathTracing', name: 'Path Tracing', icon: '✨', category: 'utilities', description: 'Photorealistic ray-traced rendering', performance: 'high', premium: true },
    { id: 'iot', name: 'IoT Integration', icon: '📡', category: 'utilities', description: 'Internet of Things device integration', performance: 'low', premium: true }
];
const WorkspaceFeatureIntegration = ({ activeFeatures, onFeatureToggle, performanceMode }) => {
    const [performanceScore, setPerformanceScore] = useState(100);
    const [warnings, setWarnings] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    // Calculate performance impact
    useEffect(() => {
        let totalImpact = 0;
        const activeFeatureList = Array.from(activeFeatures);
        activeFeatureList.forEach(featureId => {
            const feature = features.find(f => f.id === featureId);
            if (feature) {
                switch (feature.performance) {
                    case 'low':
                        totalImpact += 5;
                        break;
                    case 'medium':
                        totalImpact += 15;
                        break;
                    case 'high':
                        totalImpact += 30;
                        break;
                }
            }
        });
        // Performance mode adjustments
        const performanceMultiplier = {
            performance: 0.7,
            balanced: 1.0,
            quality: 1.3
        }[performanceMode];
        const adjustedImpact = totalImpact * performanceMultiplier;
        const score = Math.max(0, 100 - adjustedImpact);
        setPerformanceScore(score);
        // Generate warnings and suggestions
        const newWarnings = [];
        const newSuggestions = [];
        if (score < 30) {
            newWarnings.push('Performance critically low - consider disabling some features');
        }
        else if (score < 60) {
            newWarnings.push('Performance impact detected - monitor frame rate');
        }
        // Check for conflicts
        activeFeatureList.forEach(featureId => {
            const feature = features.find(f => f.id === featureId);
            if (feature?.conflicts) {
                feature.conflicts.forEach(conflictId => {
                    if (activeFeatures.has(conflictId)) {
                        newWarnings.push(`${feature.name} conflicts with ${features.find(f => f.id === conflictId)?.name}`);
                    }
                });
            }
        });
        // Check for missing dependencies
        activeFeatureList.forEach(featureId => {
            const feature = features.find(f => f.id === featureId);
            if (feature?.dependencies) {
                feature.dependencies.forEach(depId => {
                    if (!activeFeatures.has(depId)) {
                        newSuggestions.push(`${feature.name} works better with ${features.find(f => f.id === depId)?.name}`);
                    }
                });
            }
        });
        // Performance suggestions
        if (performanceMode === 'performance' && activeFeatureList.length > 5) {
            newSuggestions.push('Consider using fewer features in performance mode');
        }
        if (performanceMode === 'quality' && score > 80) {
            newSuggestions.push('You can enable more features in quality mode');
        }
        setWarnings(newWarnings);
        setSuggestions(newSuggestions);
    }, [activeFeatures, performanceMode]);
    const getFeaturesByCategory = () => {
        const categories = {};
        features.forEach(feature => {
            if (!categories[feature.category]) {
                categories[feature.category] = [];
            }
            categories[feature.category].push(feature);
        });
        return categories;
    };
    const handleFeatureToggle = (feature) => {
        const isActive = activeFeatures.has(feature.id);
        if (!isActive) {
            // Check dependencies
            if (feature.dependencies) {
                const missingDeps = feature.dependencies.filter(dep => !activeFeatures.has(dep));
                if (missingDeps.length > 0) {
                    // Auto-enable dependencies
                    missingDeps.forEach(dep => onFeatureToggle(dep, true));
                }
            }
            // Check conflicts
            if (feature.conflicts) {
                feature.conflicts.forEach(conflict => {
                    if (activeFeatures.has(conflict)) {
                        onFeatureToggle(conflict, false);
                    }
                });
            }
        }
        onFeatureToggle(feature.id, !isActive);
    };
    const getPerformanceColor = () => {
        if (performanceScore >= 80)
            return 'text-green-600';
        if (performanceScore >= 60)
            return 'text-yellow-600';
        if (performanceScore >= 30)
            return 'text-orange-600';
        return 'text-red-600';
    };
    const categorizedFeatures = getFeaturesByCategory();
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs(CardTitle, { className: "text-sm flex items-center justify-between", children: ["Performance Impact", _jsxs(Badge, { variant: "outline", className: getPerformanceColor(), children: [performanceScore, "%"] })] }) }), _jsxs(CardContent, { children: [_jsx(Progress, { value: performanceScore, className: "mb-2" }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [activeFeatures.size, " features active \u2022 ", performanceMode, " mode"] })] })] }), warnings.length > 0 && (_jsx(Alert, { variant: "destructive", children: _jsx(AlertDescription, { children: _jsx("ul", { className: "list-disc list-inside space-y-1", children: warnings.map((warning, index) => (_jsx("li", { className: "text-xs", children: warning }, index))) }) }) })), suggestions.length > 0 && (_jsx(Alert, { children: _jsx(AlertDescription, { children: _jsx("ul", { className: "list-disc list-inside space-y-1", children: suggestions.map((suggestion, index) => (_jsx("li", { className: "text-xs", children: suggestion }, index))) }) }) })), Object.entries(categorizedFeatures).map(([category, categoryFeatures]) => (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs(CardTitle, { className: "text-sm capitalize flex items-center justify-between", children: [category, " Features", _jsxs(Badge, { variant: "secondary", children: [categoryFeatures.filter(f => activeFeatures.has(f.id)).length, "/", categoryFeatures.length] })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-2 gap-2", children: categoryFeatures.map(feature => {
                                const isActive = activeFeatures.has(feature.id);
                                const hasConflicts = feature.conflicts?.some(c => activeFeatures.has(c));
                                const missingDeps = feature.dependencies?.filter(d => !activeFeatures.has(d)) || [];
                                return (_jsxs(Button, { variant: isActive ? "default" : "outline", size: "sm", onClick: () => handleFeatureToggle(feature), className: `h-auto p-2 flex flex-col items-start text-left relative ${hasConflicts ? 'border-red-500' : ''} ${missingDeps.length > 0 && isActive ? 'border-yellow-500' : ''}`, disabled: hasConflicts, children: [_jsxs("div", { className: "flex items-center gap-2 w-full", children: [_jsx("span", { children: feature.icon }), _jsx("span", { className: "text-xs font-medium truncate flex-1", children: feature.name }), feature.premium && (_jsx(Badge, { variant: "secondary", className: "text-xs px-1 py-0 h-4", children: "Pro" }))] }), _jsx("div", { className: "text-xs text-muted-foreground mt-1 line-clamp-2", children: feature.description }), _jsxs("div", { className: "flex items-center justify-between w-full mt-1", children: [_jsx(Badge, { variant: "outline", className: `text-xs px-1 py-0 h-4 ${feature.performance === 'high' ? 'text-red-600' :
                                                        feature.performance === 'medium' ? 'text-yellow-600' :
                                                            'text-green-600'}`, children: feature.performance }), feature.hotkey && (_jsx(Badge, { variant: "secondary", className: "text-xs px-1 py-0 h-4", children: feature.hotkey }))] })] }, feature.id));
                            }) }) })] }, category))), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm", children: "Quick Actions" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => {
                                        // Enable essential features
                                        ['measure', 'lighting', 'materials', 'sceneBrowser'].forEach(id => onFeatureToggle(id, true));
                                    }, children: "Enable Essentials" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => {
                                        // Enable simulation suite
                                        ['weather', 'shadow', 'energy'].forEach(id => onFeatureToggle(id, true));
                                    }, children: "Simulation Suite" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => {
                                        // Enable AI features
                                        ['aiAdvisor', 'voiceAssistant'].forEach(id => onFeatureToggle(id, true));
                                    }, children: "AI Assistant" }), _jsx(Button, { size: "sm", variant: "destructive", onClick: () => {
                                        // Disable all features
                                        activeFeatures.forEach(id => onFeatureToggle(id, false));
                                    }, children: "Clear All" })] }) })] })] }));
};
export default WorkspaceFeatureIntegration;
