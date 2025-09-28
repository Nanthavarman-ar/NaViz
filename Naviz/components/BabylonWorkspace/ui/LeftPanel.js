import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWorkspace } from '../core/WorkspaceContext';
import { useFeatureManager } from '../core/FeatureManager';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { ScrollArea } from '../../ui/scroll-area';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { featureCategories } from '../../../config/featureCategories';
import { Move, RotateCw, Scale, Ruler, Sun, Palette, Undo, Redo, Map, Edit, Play, Layers, Droplet, Wind, Brain, Mic, Users, Eye, Download, Upload, Settings, MapPin, Mountain, Network, Share, Activity } from 'lucide-react';
import './LeftPanel.css';
export function LeftPanel({ onFeatureToggle, onCategoryToggle, onSearch, onTabChange }) {
    const { state, dispatch } = useWorkspace();
    const { enabledFeatures, disabledFeatures, handleFeatureToggle, handleCategoryToggle } = useFeatureManager();
    // Handle search (placeholder - search not implemented in context yet)
    const handleSearch = (query) => {
        console.log('Search:', query);
        if (onSearch) {
            onSearch(query);
        }
    };
    // Handle tab change (placeholder - tabs not implemented in context yet)
    const handleTabChange = (tab) => {
        console.log('Tab change:', tab);
        if (onTabChange) {
            onTabChange(tab);
        }
    };
    // Handle feature toggle
    const handleFeatureToggleLocal = (featureId, enabled) => {
        handleFeatureToggle(featureId, enabled);
        if (onFeatureToggle) {
            onFeatureToggle(featureId, enabled);
        }
    };
    // Handle category toggle
    const handleCategoryToggleLocal = (category, visible) => {
        handleCategoryToggle(category, visible);
        if (onCategoryToggle) {
            onCategoryToggle(category, visible);
        }
    };
    // Get icon component for feature
    const getFeatureIcon = (featureId) => {
        const iconMap = {
            move: _jsx(Move, { className: "w-4 h-4" }),
            rotate: _jsx(RotateCw, { className: "w-4 h-4" }),
            scale: _jsx(Scale, { className: "w-4 h-4" }),
            measure: _jsx(Ruler, { className: "w-4 h-4" }),
            lighting: _jsx(Sun, { className: "w-4 h-4" }),
            materials: _jsx(Palette, { className: "w-4 h-4" }),
            undo: _jsx(Undo, { className: "w-4 h-4" }),
            redo: _jsx(Redo, { className: "w-4 h-4" }),
            minimap: _jsx(Map, { className: "w-4 h-4" }),
            materialEditor: _jsx(Edit, { className: "w-4 h-4" }),
            gps: _jsx(MapPin, { className: "w-4 h-4" }),
            geoWorkspaceArea: _jsx(Mountain, { className: "w-4 h-4" }),
            geoSync: _jsx(Network, { className: "w-4 h-4" }),
            underwaterMode: _jsx(Droplet, { className: "w-4 h-4" }),
            waterShader: _jsx(Droplet, { className: "w-4 h-4" }),
            voiceChat: _jsx(Mic, { className: "w-4 h-4" }),
            vrarMode: _jsx(Eye, { className: "w-4 h-4" }),
            wetMaterialManager: _jsx(Droplet, { className: "w-4 h-4" }),
            windTunnelSimulation: _jsx(Wind, { className: "w-4 h-4" }),
        };
        return iconMap[featureId] || _jsx(Settings, { className: "w-4 h-4" });
    };
    // Get features by category
    const getFeaturesByCategory = (category) => {
        return Object.values(featureCategories).flat().filter((feature) => feature.category === category);
    };
    return (_jsxs("div", { className: "left-panel", children: [_jsxs("div", { className: "left-panel-header", children: [_jsx("h2", { className: "left-panel-title", children: "Features" }), _jsx(Button, { variant: "ghost", size: "sm", className: "left-panel-close", children: "\u2715" })] }), _jsx("div", { className: "left-panel-search", children: _jsx(Input, { placeholder: "Search features...", onChange: (e) => handleSearch(e.target.value), className: "search-input" }) }), _jsxs(Tabs, { defaultValue: "essential", onValueChange: handleTabChange, className: "left-panel-tabs", children: [_jsxs(TabsList, { className: "left-panel-tabs-list", children: [_jsx(TabsTrigger, { value: "essential", className: "left-panel-tab", children: "Essential" }), _jsx(TabsTrigger, { value: "simulation", className: "left-panel-tab", children: "Simulation" }), _jsx(TabsTrigger, { value: "ai", className: "left-panel-tab", children: "AI" }), _jsx(TabsTrigger, { value: "analysis", className: "left-panel-tab", children: "Analysis" }), _jsx(TabsTrigger, { value: "collaboration", className: "left-panel-tab", children: "Collaboration" }), _jsx(TabsTrigger, { value: "immersive", className: "left-panel-tab", children: "Immersive" })] }), _jsxs(ScrollArea, { className: "left-panel-scroll-area", children: [_jsx(TabsContent, { value: "essential", className: "left-panel-tab-content", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Essential Tools" }) }), _jsx(CardContent, { className: "space-y-2", children: getFeaturesByCategory('essential').map((feature) => (_jsxs(Button, { variant: enabledFeatures.some(f => f.id === feature.id) ? 'default' : 'outline', size: "sm", className: "feature-button", onClick: () => handleFeatureToggleLocal(feature.id, !enabledFeatures.some(f => f.id === feature.id)), title: feature.description, children: [getFeatureIcon(feature.id), _jsx("span", { className: "feature-name", children: feature.name }), _jsx(Badge, { variant: "secondary", className: "feature-badge", children: feature.hotkey })] }, feature.id))) })] }) }), _jsx(TabsContent, { value: "simulation", className: "left-panel-tab-content", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Simulation Tools" }) }), _jsx(CardContent, { className: "space-y-2", children: getFeaturesByCategory('simulation').map((feature) => (_jsxs(Button, { variant: enabledFeatures.some(f => f.id === feature.id) ? 'default' : 'outline', size: "sm", className: "feature-button", onClick: () => handleFeatureToggleLocal(feature.id, !enabledFeatures.some(f => f.id === feature.id)), title: feature.description, children: [getFeatureIcon(feature.id), _jsx("span", { className: "feature-name", children: feature.name }), _jsx(Badge, { variant: "secondary", className: "feature-badge", children: feature.hotkey })] }, feature.id))) })] }) }), _jsx(TabsContent, { value: "ai", className: "left-panel-tab-content", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "AI Tools" }) }), _jsx(CardContent, { className: "space-y-2", children: getFeaturesByCategory('ai').map((feature) => (_jsxs(Button, { variant: enabledFeatures.some(f => f.id === feature.id) ? 'default' : 'outline', size: "sm", className: "feature-button", onClick: () => handleFeatureToggleLocal(feature.id, !enabledFeatures.some(f => f.id === feature.id)), title: feature.description, children: [getFeatureIcon(feature.id), _jsx("span", { className: "feature-name", children: feature.name }), _jsx(Badge, { variant: "secondary", className: "feature-badge", children: feature.hotkey })] }, feature.id))) })] }) }), _jsx(TabsContent, { value: "analysis", className: "left-panel-tab-content", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Analysis Tools" }) }), _jsx(CardContent, { className: "space-y-2", children: getFeaturesByCategory('analysis').map((feature) => (_jsxs(Button, { variant: enabledFeatures.some(f => f.id === feature.id) ? 'default' : 'outline', size: "sm", className: "feature-button", onClick: () => handleFeatureToggleLocal(feature.id, !enabledFeatures.some(f => f.id === feature.id)), title: feature.description, children: [getFeatureIcon(feature.id), _jsx("span", { className: "feature-name", children: feature.name }), _jsx(Badge, { variant: "secondary", className: "feature-badge", children: feature.hotkey })] }, feature.id))) })] }) }), _jsx(TabsContent, { value: "collaboration", className: "left-panel-tab-content", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Collaboration Tools" }) }), _jsx(CardContent, { className: "space-y-2", children: getFeaturesByCategory('collaboration').map((feature) => (_jsxs(Button, { variant: enabledFeatures.some(f => f.id === feature.id) ? 'default' : 'outline', size: "sm", className: "feature-button", onClick: () => handleFeatureToggleLocal(feature.id, !enabledFeatures.some(f => f.id === feature.id)), title: feature.description, children: [getFeatureIcon(feature.id), _jsx("span", { className: "feature-name", children: feature.name }), _jsx(Badge, { variant: "secondary", className: "feature-badge", children: feature.hotkey })] }, feature.id))) })] }) }), _jsx(TabsContent, { value: "immersive", className: "left-panel-tab-content", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Immersive Tools" }) }), _jsx(CardContent, { className: "space-y-2", children: getFeaturesByCategory('immersive').map((feature) => (_jsxs(Button, { variant: enabledFeatures.some(f => f.id === feature.id) ? 'default' : 'outline', size: "sm", className: "feature-button", onClick: () => handleFeatureToggleLocal(feature.id, !enabledFeatures.some(f => f.id === feature.id)), title: feature.description, children: [getFeatureIcon(feature.id), _jsx("span", { className: "feature-name", children: feature.name }), _jsx(Badge, { variant: "secondary", className: "feature-badge", children: feature.hotkey })] }, feature.id))) })] }) })] })] }), _jsxs("div", { className: "left-panel-quick-actions", children: [_jsx(Separator, {}), _jsxs("div", { className: "quick-actions-grid", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "quick-action-button", children: [_jsx(Upload, { className: "w-4 h-4" }), "Import"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "quick-action-button", children: [_jsx(Download, { className: "w-4 h-4" }), "Export"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "quick-action-button", children: [_jsx(Share, { className: "w-4 h-4" }), "Share"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "quick-action-button", children: [_jsx(Settings, { className: "w-4 h-4" }), "Settings"] })] })] })] }));
}
export function CategoryToggle({ category, isVisible, onToggle, featureCount }) {
    const getCategoryIcon = (category) => {
        const iconMap = {
            essential: _jsx(Settings, { className: "w-4 h-4" }),
            simulation: _jsx(Play, { className: "w-4 h-4" }),
            ai: _jsx(Brain, { className: "w-4 h-4" }),
            analysis: _jsx(Activity, { className: "w-4 h-4" }),
            collaboration: _jsx(Users, { className: "w-4 h-4" }),
            immersive: _jsx(Eye, { className: "w-4 h-4" }),
        };
        return iconMap[category] || _jsx(Layers, { className: "w-4 h-4" });
    };
    const getCategoryName = (category) => {
        const nameMap = {
            essential: 'Essential',
            simulation: 'Simulation',
            ai: 'AI',
            analysis: 'Analysis',
            collaboration: 'Collaboration',
            immersive: 'Immersive',
        };
        return nameMap[category] || category;
    };
    return (_jsxs(Button, { variant: isVisible ? 'default' : 'outline', size: "sm", className: "category-toggle", onClick: () => onToggle(category, !isVisible), children: [getCategoryIcon(category), _jsx("span", { className: "category-name", children: getCategoryName(category) }), _jsx(Badge, { variant: "secondary", className: "category-count", children: featureCount })] }));
}
