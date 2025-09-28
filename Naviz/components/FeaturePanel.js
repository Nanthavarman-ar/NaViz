import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { Maximize } from 'lucide-react';
const FeaturePanel = ({ featureCategories, categoryPanelVisible, searchTerm, activeFeatures, currentLayoutMode, onCategoryToggle, onSearchChange, onFeatureToggle, onClose }) => {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    const getFilteredFeatures = (features) => {
        const term = localSearchTerm || searchTerm;
        if (!term)
            return features;
        return features.filter(f => f.name.toLowerCase().includes(term.toLowerCase()));
    };
    const renderFeatureButton = (feature, size) => (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs(Button, { size: size, variant: activeFeatures.has(feature.id) ? 'default' : 'outline', onClick: () => onFeatureToggle(feature.id, !activeFeatures.has(feature.id)), className: "flex items-center gap-2 transition-all duration-200 hover:scale-105", children: [feature.icon, _jsx("span", { className: "font-semibold", children: feature.name }), activeFeatures.has(feature.id) && (_jsx(Badge, { variant: "secondary", className: "ml-1 text-xs", children: "ON" }))] }) }), _jsx(TooltipContent, { side: "right", className: "max-w-xs", children: _jsxs("div", { className: "text-sm", children: [_jsx("div", { className: "font-semibold text-blue-500", children: feature.name }), _jsx("div", { className: "text-muted-foreground mt-1", children: feature.description }), _jsxs("div", { className: "text-muted-foreground mt-2 flex items-center gap-1", children: [_jsx("kbd", { className: "px-2 py-1 bg-gray-800 rounded text-xs font-mono", children: feature.hotkey }), _jsx("span", { className: "text-xs", children: "Hotkey" })] })] }) })] }) }, feature.id));
    const renderCategoryToggles = () => (_jsx("div", { className: "flex gap-3 mb-4 flex-wrap", children: Object.keys(featureCategories).map(category => (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs(Button, { size: "default", variant: categoryPanelVisible[category] ? "default" : "outline", onClick: () => onCategoryToggle(category), className: "capitalize font-semibold", children: [categoryPanelVisible[category] ? "Hide" : "Show", " ", category, _jsx(Badge, { variant: "outline", className: "ml-2", children: featureCategories[category]?.length || 0 })] }) }), _jsx(TooltipContent, { children: _jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: "font-semibold capitalize", children: [category, " Features"] }), _jsxs("div", { className: "text-muted-foreground", children: [categoryPanelVisible[category] ? "Hide" : "Show", " ", category, " feature panel"] })] }) })] }) }, category))) }));
    const renderCategoryPanels = () => (_jsx("div", { children: Object.entries(featureCategories).map(([category, features], index) => (categoryPanelVisible[category] && (_jsxs("div", { children: [_jsxs(Card, { className: "mb-4", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "capitalize flex items-center justify-between", children: [category, " Features", _jsxs(Badge, { variant: "secondary", children: [features.filter(f => activeFeatures.has(f.id)).length, "/", features.length, " Active"] })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2", children: getFilteredFeatures(features).map(feature => renderFeatureButton(feature, (currentLayoutMode === 'standard' ? 'sm' : 'default'))) }) })] }), index < Object.entries(featureCategories).filter(([cat]) => categoryPanelVisible[cat]).length - 1 && (_jsx(Separator, { className: "my-4 bg-gray-600" }))] }, category)))) }));
    const handleSearchChange = (value) => {
        setLocalSearchTerm(value);
        onSearchChange(value);
    };
    const activeFeatureCount = Object.values(featureCategories).flat().filter(f => activeFeatures.has(f.id)).length;
    const totalFeatureCount = Object.values(featureCategories).flat().length;
    return (_jsxs("div", { className: "flex flex-col w-72 border-r border-gray-700 bg-gray-900 text-white", children: [_jsxs("div", { className: "p-4 border-b border-gray-700 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Features" }), _jsxs(Badge, { variant: "outline", className: "text-xs", children: [activeFeatureCount, "/", totalFeatureCount] })] }), _jsx(Button, { size: "sm", variant: "ghost", onClick: onClose, children: _jsx(Maximize, { className: "w-4 h-4" }) })] }), _jsx(ScrollArea, { className: "flex-1", children: _jsxs("div", { className: "p-4", children: [renderCategoryToggles(), _jsx("div", { className: "mb-4", children: _jsx(Input, { placeholder: "Search features...", value: localSearchTerm || searchTerm, onChange: (e) => handleSearchChange(e.target.value), className: "w-full" }) }), renderCategoryPanels()] }) })] }));
};
export default FeaturePanel;
