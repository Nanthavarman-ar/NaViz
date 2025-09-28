import { jsx as _jsx } from "react/jsx-runtime";
import { Move, RotateCw, Scale, Ruler, Sun, Palette, Undo, Redo, Map, Edit, Play, Layers, CloudSnow, Droplet, Wind, Volume2, Car, Brain, Sofa, Wand2, Mic, Users, Zap, DollarSign, Eye, Smartphone, Volume, Hand, Download, Upload, Settings, MapPin, Mountain, Network, MessageSquare, Pencil, Share, Presentation, Camera } from 'lucide-react';
export const featureCategoriesArray = [
    // Essential Features
    { id: 'move', name: 'Move', icon: _jsx(Move, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'M', description: 'Move objects in 3D space' },
    { id: 'rotate', name: 'Rotate', icon: _jsx(RotateCw, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'R', description: 'Rotate objects' },
    { id: 'scale', name: 'Scale', icon: _jsx(Scale, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'S', description: 'Scale objects' },
    { id: 'measure', name: 'Measure', icon: _jsx(Ruler, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'T', description: 'Measure distances and dimensions' },
    { id: 'lighting', name: 'Lighting', icon: _jsx(Sun, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'L', description: 'Control scene lighting' },
    { id: 'materials', name: 'Materials', icon: _jsx(Palette, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'P', description: 'Manage materials and textures' },
    { id: 'undo', name: 'Undo', icon: _jsx(Undo, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'Ctrl+Z', description: 'Undo last action' },
    { id: 'redo', name: 'Redo', icon: _jsx(Redo, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'Ctrl+Y', description: 'Redo last undone action' },
    { id: 'minimap', name: 'Minimap', icon: _jsx(Map, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'N', description: 'Show minimap' },
    { id: 'materialEditor', name: 'Material Editor', icon: _jsx(Edit, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'E', description: 'Edit materials' },
    { id: 'animationTimeline', name: 'Animation Timeline', icon: _jsx(Play, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'A', description: 'Control and manage animations' },
    { id: 'bimIntegration', name: 'BIM Integration', icon: _jsx(Layers, { className: "w-4 h-4" }), category: 'essential', enabled: true, hotkey: 'B', description: 'Building Information Modeling' },
    // Simulation Features
    { id: 'weather', name: 'Weather', icon: _jsx(CloudSnow, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'W', description: 'Weather simulation and effects' },
    { id: 'flood', name: 'Flood', icon: _jsx(Droplet, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'F', description: 'Flood simulation' },
    { id: 'wind', name: 'Wind Tunnel', icon: _jsx(Wind, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'T', description: 'Wind tunnel simulation' },
    { id: 'noise', name: 'Noise', icon: _jsx(Volume2, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'N', description: 'Noise simulation' },
    { id: 'traffic', name: 'Traffic', icon: _jsx(Car, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'R', description: 'Traffic simulation' },
    { id: 'shadow', name: 'Shadow Analysis', icon: _jsx(Sun, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'H', description: 'Shadow analysis' },
    { id: 'moodScene', name: 'Mood Scenes', icon: _jsx(Sun, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'M', description: 'Interactive lighting mood scenes' },
    { id: 'seasonalDecor', name: 'Seasonal Decor', icon: _jsx(CloudSnow, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'D', description: 'Seasonal decoration management' },
    // AI Features
    { id: 'aiAdvisor', name: 'AI Advisor', icon: _jsx(Brain, { className: "w-4 h-4" }), category: 'ai', enabled: true, hotkey: 'A', description: 'AI-powered design advisor' },
    { id: 'autoFurnish', name: 'Auto Furnish', icon: _jsx(Sofa, { className: "w-4 h-4" }), category: 'ai', enabled: true, hotkey: 'U', description: 'Automatic furniture placement' },
    { id: 'aiCoDesigner', name: 'Co-Designer', icon: _jsx(Wand2, { className: "w-4 h-4" }), category: 'ai', enabled: true, hotkey: 'C', description: 'AI collaborative design' },
    { id: 'voiceAssistant', name: 'Voice AI', icon: _jsx(Mic, { className: "w-4 h-4" }), category: 'ai', enabled: true, hotkey: 'V', description: 'Voice-controlled assistant' },
    { id: 'scanAnimal', name: 'Scan Animal', icon: _jsx(Camera, { className: "w-4 h-4" }), category: 'ai', enabled: true, hotkey: 'A', description: 'AI-powered animal scanning and detection' },
    // Analysis Features
    { id: 'ergonomic', name: 'Ergonomic', icon: _jsx(Users, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'E', description: 'Ergonomic analysis' },
    { id: 'energy', name: 'Energy', icon: _jsx(Zap, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'G', description: 'Energy efficiency analysis' },
    { id: 'energyDashboard', name: 'Energy Dashboard', icon: _jsx(Zap, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'Y', description: 'Real-time energy analysis dashboard' },
    { id: 'cost', name: 'Cost Est.', icon: _jsx(DollarSign, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'O', description: 'Cost estimation' },
    { id: 'beforeAfter', name: 'Before/After', icon: _jsx(Layers, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'B', description: 'Compare before and after states' },
    { id: 'comparativeTour', name: 'Comparative Tour', icon: _jsx(Eye, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'C', description: 'Side-by-side comparative tours' },
    { id: 'roiCalculator', name: 'ROI Calculator', icon: _jsx(DollarSign, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'R', description: 'Real estate ROI calculations' },
    // Collaboration Features
    { id: 'multiUser', name: 'Multi-User', icon: _jsx(Users, { className: "w-4 h-4" }), category: 'collaboration', enabled: true, hotkey: 'U', description: 'Multi-user collaboration' },
    { id: 'chat', name: 'Chat', icon: _jsx(MessageSquare, { className: "w-4 h-4" }), category: 'collaboration', enabled: true, hotkey: 'C', description: 'Real-time chat' },
    { id: 'annotations', name: 'Annotations', icon: _jsx(Pencil, { className: "w-4 h-4" }), category: 'collaboration', enabled: true, hotkey: 'A', description: 'Add annotations' },
    { id: 'sharing', name: 'Share', icon: _jsx(Share, { className: "w-4 h-4" }), category: 'collaboration', enabled: true, hotkey: 'S', description: 'Share workspace' },
    // Immersive Features
    { id: 'vr', name: 'VR Mode', icon: _jsx(Eye, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'X', description: 'Virtual reality mode' },
    { id: 'ar', name: 'AR Mode', icon: _jsx(Smartphone, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'Z', description: 'Augmented reality mode' },
    { id: 'spatialAudio', name: 'Spatial Audio', icon: _jsx(Volume, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'B', description: '3D spatial audio' },
    { id: 'haptic', name: 'Haptic', icon: _jsx(Hand, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'H', description: 'Haptic feedback' },
    { id: 'arScale', name: 'AR Scale', icon: _jsx(Scale, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'S', description: 'Augmented reality scaling tools' },
    { id: 'scenario', name: 'Scenario', icon: _jsx(Presentation, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'P', description: 'Interactive scenario presentation' },
    // Utilities
    { id: 'export', name: 'Export', icon: _jsx(Download, { className: "w-4 h-4" }), category: 'utilities', enabled: true, hotkey: 'E', description: 'Export scene' },
    { id: 'import', name: 'Import', icon: _jsx(Upload, { className: "w-4 h-4" }), category: 'utilities', enabled: true, hotkey: 'I', description: 'Import models' },
    { id: 'settings', name: 'Settings', icon: _jsx(Settings, { className: "w-4 h-4" }), category: 'utilities', enabled: true, hotkey: 'S', description: 'Workspace settings' },
    // Geo-Location Features
    { id: 'geoLocation', name: 'Geo Location', icon: _jsx(MapPin, { className: "w-4 h-4" }), category: 'location', enabled: true, hotkey: 'G', description: 'GPS-based location services' },
    { id: 'geoWorkspaceArea', name: 'Geo Workspace Area', icon: _jsx(Mountain, { className: "w-4 h-4" }), category: 'location', enabled: true, hotkey: 'W', description: 'Define workspace area with geo-coordinates' },
    { id: 'geoSync', name: 'Geo Sync', icon: _jsx(Network, { className: "w-4 h-4" }), category: 'location', enabled: true, hotkey: 'Y', description: 'Synchronize with geo-location data' },
    // Enhanced Real-Time Components
    { id: 'underwaterMode', name: 'Underwater Mode', icon: _jsx(Droplet, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'U', description: 'Underwater exploration mode' },
    { id: 'waterShader', name: 'Water Shader', icon: _jsx(Droplet, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'W', description: 'Advanced water shader effects' },
    { id: 'voiceChat', name: 'Voice Chat', icon: _jsx(Mic, { className: "w-4 h-4" }), category: 'collaboration', enabled: true, hotkey: 'V', description: 'Voice communication' },
    { id: 'vrarMode', name: 'VR/AR Mode', icon: _jsx(Eye, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'X', description: 'Virtual and augmented reality mode' },
    { id: 'wetMaterialManager', name: 'Wet Material Manager', icon: _jsx(Droplet, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'M', description: 'Wet material effects' },
    { id: 'windTunnelSimulation', name: 'Wind Tunnel Simulation', icon: _jsx(Wind, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'T', description: 'Wind tunnel simulation' },
];
// Helper function to create feature categories mapping
export const createFeatureCategories = (features) => {
    return features.reduce((acc, feature) => {
        if (!acc[feature.category]) {
            acc[feature.category] = [];
        }
        acc[feature.category].push(feature);
        return acc;
    }, {});
};
// Create the feature categories mapping
export const featureCategories = createFeatureCategories(featureCategoriesArray);
// Feature categories for easy access
export const FEATURE_CATEGORIES = {
    ESSENTIAL: 'essential',
    SIMULATION: 'simulation',
    AI: 'ai',
    ANALYSIS: 'analysis',
    COLLABORATION: 'collaboration',
    IMMERSIVE: 'immersive',
    UTILITIES: 'utilities',
    LOCATION: 'location'
};
