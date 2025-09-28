import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Move, RotateCw, Scale, Ruler, Sun, Palette, Undo, Redo, Map, Edit, Play, Layers, CloudSnow, Droplet, Wind, Volume2, Car, Sun as SunIcon, Brain, Wand2, Mic, Users, MessageSquare, Share, Eye, Smartphone, Volume, Hand, Presentation, Network, Mountain, Zap, DollarSign, Pencil, Download, Upload, Settings, MapPin } from 'lucide-react';
// Feature categories array from BabylonWorkspace.tsx
const featureCategoriesArray = [
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
    { id: 'weather', name: 'Weather', icon: _jsx(CloudSnow, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'W', description: 'Weather simulation and effects' },
    { id: 'flood', name: 'Flood', icon: _jsx(Droplet, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'F', description: 'Flood simulation' },
    { id: 'wind', name: 'Wind Tunnel', icon: _jsx(Wind, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'T', description: 'Wind tunnel simulation' },
    { id: 'noise', name: 'Noise', icon: _jsx(Volume2, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'N', description: 'Noise simulation' },
    { id: 'traffic', name: 'Traffic', icon: _jsx(Car, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'R', description: 'Traffic simulation' },
    { id: 'shadow', name: 'Shadow Analysis', icon: _jsx(SunIcon, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'H', description: 'Shadow analysis' },
    { id: 'moodScene', name: 'Mood Scenes', icon: _jsx(SunIcon, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'M', description: 'Interactive lighting mood scenes' },
    { id: 'seasonalDecor', name: 'Seasonal Decor', icon: _jsx(CloudSnow, { className: "w-4 h-4" }), category: 'simulation', enabled: true, hotkey: 'D', description: 'Seasonal decoration management' },
    { id: 'aiAdvisor', name: 'AI Advisor', icon: _jsx(Brain, { className: "w-4 h-4" }), category: 'ai', enabled: true, hotkey: 'A', description: 'AI-powered design advisor' },
    { id: 'autoFurnish', name: 'Auto Furnish', icon: _jsx(Wand2, { className: "w-4 h-4" }), category: 'ai', enabled: true, hotkey: 'U', description: 'Automatic furniture placement' },
    { id: 'aiCoDesigner', name: 'Co-Designer', icon: _jsx(Wand2, { className: "w-4 h-4" }), category: 'ai', enabled: true, hotkey: 'C', description: 'AI collaborative design' },
    { id: 'voiceAssistant', name: 'Voice AI', icon: _jsx(Mic, { className: "w-4 h-4" }), category: 'ai', enabled: true, hotkey: 'V', description: 'Voice-controlled assistant' },
    { id: 'ergonomic', name: 'Ergonomic', icon: _jsx(Users, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'E', description: 'Ergonomic analysis' },
    { id: 'energy', name: 'Energy', icon: _jsx(Zap, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'G', description: 'Energy efficiency analysis' },
    { id: 'cost', name: 'Cost Est.', icon: _jsx(DollarSign, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'O', description: 'Cost estimation' },
    { id: 'beforeAfter', name: 'Before/After', icon: _jsx(Layers, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'B', description: 'Compare before and after states' },
    { id: 'comparativeTour', name: 'Comparative Tour', icon: _jsx(Eye, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'C', description: 'Side-by-side comparative tours' },
    { id: 'roiCalculator', name: 'ROI Calculator', icon: _jsx(DollarSign, { className: "w-4 h-4" }), category: 'analysis', enabled: true, hotkey: 'R', description: 'Real estate ROI calculations' },
    { id: 'multiUser', name: 'Multi-User', icon: _jsx(Users, { className: "w-4 h-4" }), category: 'collaboration', enabled: true, hotkey: 'U', description: 'Multi-user collaboration' },
    { id: 'chat', name: 'Chat', icon: _jsx(MessageSquare, { className: "w-4 h-4" }), category: 'collaboration', enabled: true, hotkey: 'C', description: 'Real-time chat' },
    { id: 'annotations', name: 'Annotations', icon: _jsx(Pencil, { className: "w-4 h-4" }), category: 'collaboration', enabled: true, hotkey: 'A', description: 'Add annotations' },
    { id: 'sharing', name: 'Share', icon: _jsx(Share, { className: "w-4 h-4" }), category: 'collaboration', enabled: true, hotkey: 'S', description: 'Share workspace' },
    { id: 'vr', name: 'VR Mode', icon: _jsx(Eye, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'X', description: 'Virtual reality mode' },
    { id: 'ar', name: 'AR Mode', icon: _jsx(Smartphone, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'Z', description: 'Augmented reality mode' },
    { id: 'spatialAudio', name: 'Spatial Audio', icon: _jsx(Volume, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'B', description: '3D spatial audio' },
    { id: 'haptic', name: 'Haptic', icon: _jsx(Hand, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'H', description: 'Haptic feedback' },
    { id: 'arScale', name: 'AR Scale', icon: _jsx(Scale, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'S', description: 'Augmented reality scaling tools' },
    { id: 'scenario', name: 'Scenario', icon: _jsx(Presentation, { className: "w-4 h-4" }), category: 'immersive', enabled: true, hotkey: 'P', description: 'Interactive scenario presentation' },
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
// Create feature categories mapping
const featureCategories = featureCategoriesArray.reduce((acc, feature) => {
    if (!acc[feature.category]) {
        acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
}, {});
const ProjectAssetsPanel = ({ onFeatureToggle }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryPanelVisible, setCategoryPanelVisible] = useState({});
    const [activeFeaturesSet, setActiveFeaturesSet] = useState(new Set());
    const handleCategoryToggle = (category) => {
        setCategoryPanelVisible(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };
    const handleFeatureToggle = (featureId, enabled) => {
        setActiveFeaturesSet(prev => {
            const newSet = new Set(prev);
            if (enabled) {
                newSet.add(featureId);
            }
            else {
                newSet.delete(featureId);
            }
            return newSet;
        });
        if (onFeatureToggle) {
            onFeatureToggle(featureId, enabled);
        }
    };
    const getFilteredFeatures = (features) => {
        if (!searchTerm)
            return features;
        return features.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };
    const renderFeatureButton = (feature) => (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs(Button, { size: "sm", variant: activeFeaturesSet.has(feature.id) ? 'default' : 'outline', onClick: () => handleFeatureToggle(feature.id, !activeFeaturesSet.has(feature.id)), className: `flex items-center gap-2 transition-all duration-200 hover:scale-105 ${feature.category === 'essential'
                            ? 'bg-blue-700 hover:bg-blue-800 text-white border-blue-700 shadow-lg'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`, children: [feature.icon, _jsx("span", { className: "font-semibold", children: feature.name })] }) }), _jsx(TooltipContent, { side: "right", className: "max-w-xs", children: _jsxs("div", { className: "text-sm", children: [_jsx("div", { className: "font-semibold text-blue-500", children: feature.name }), _jsx("div", { className: "text-muted-foreground mt-1", children: feature.description }), _jsxs("div", { className: "text-muted-foreground mt-2 flex items-center gap-1", children: [_jsx("kbd", { className: "px-2 py-1 bg-gray-800 rounded text-xs font-mono", children: feature.hotkey }), _jsx("span", { className: "text-xs", children: "Hotkey" })] })] }) })] }) }, feature.id));
    const renderCategoryToggles = () => (_jsx("div", { className: "flex gap-3 mb-4 flex-wrap", children: Object.keys(featureCategories).map(category => (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs(Button, { size: "sm", variant: categoryPanelVisible[category] ? "default" : "outline", onClick: () => handleCategoryToggle(category), className: "capitalize font-semibold", children: [categoryPanelVisible[category] ? "Hide" : "Show", " ", category] }) }), _jsx(TooltipContent, { children: _jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: "font-semibold capitalize", children: [category, " Features"] }), _jsxs("div", { className: "text-muted-foreground", children: [categoryPanelVisible[category] ? "Hide" : "Show", " ", category, " feature panel"] })] }) })] }) }, category))) }));
    const renderCategoryPanels = () => (_jsx("div", { children: Object.entries(featureCategories).map(([category, features], index) => (categoryPanelVisible[category] && (_jsxs("div", { children: [_jsxs(Card, { className: "mb-4", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "capitalize", children: [category, " Features"] }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid gap-2 grid-cols-1", children: getFilteredFeatures(features).map(feature => renderFeatureButton(feature)) }) })] }), index < Object.entries(featureCategories).filter(([cat]) => categoryPanelVisible[cat]).length - 1 && (_jsx(Separator, { className: "my-4 bg-gray-600" }))] }, category)))) }));
    return (_jsxs("div", { style: { width: 300, backgroundColor: '#222', color: 'white', padding: 10, overflowY: 'auto', height: '100%' }, children: [_jsx("h3", { children: "Project / Assets" }), _jsx(ScrollArea, { className: "flex-1", children: _jsxs("div", { className: "p-5", children: [renderCategoryToggles(), _jsx("div", { className: "mb-6", children: _jsx(Input, { placeholder: "Search features...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full", "aria-label": "Search Features" }) }), renderCategoryPanels()] }) }), _jsx("p", { children: "Drag and drop assets here" })] }));
};
export default ProjectAssetsPanel;
