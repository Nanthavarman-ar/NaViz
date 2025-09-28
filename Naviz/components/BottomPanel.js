import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { AlertTriangle, CheckCircle, Clock, Info, Play, Pause } from 'lucide-react';

const BottomPanel = ({ activeFeatures, performanceMode, selectedMesh, onFeatureToggle, onPerformanceModeChange, featureStats, warnings, suggestions }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return _jsx(Play, { className: "w-3 h-3 text-green-500" });
            case 'inactive': return _jsx(Pause, { className: "w-3 h-3 text-gray-500" });
            case 'error': return _jsx(AlertTriangle, { className: "w-3 h-3 text-red-500" });
            default: return _jsx(Clock, { className: "w-3 h-3 text-blue-500" });
        }
    };

    // Export state
    const [exportFormat, setExportFormat] = useState('gltf');
    const [exportQuality, setExportQuality] = useState('high');
    const [exportProgress, setExportProgress] = useState(0);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        setExportProgress(0);
        // Simulate export progress
        const interval = setInterval(() => {
            setExportProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsExporting(false);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    return (_jsx("div", { className: "bg-background border-t border-gray-600", style: { height: '16rem', resize: 'vertical', minHeight: '12rem', maxHeight: '50vh', overflow: 'hidden' }, children: _jsxs(Tabs, { defaultValue: "performance", className: "h-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [_jsx(TabsTrigger, { value: "performance", children: "Performance" }), _jsx(TabsTrigger, { value: "features", children: "Features" }), _jsx(TabsTrigger, { value: "export", children: "Export" }), _jsx(TabsTrigger, { value: "selected", children: "Selected Object" })] }), _jsx(TabsContent, { value: "performance", className: "p-4 h-full", children: _jsx(ScrollArea, { className: "h-full", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Performance Mode" }), _jsx("div", { className: "flex gap-2", children: ['low', 'medium', 'high'].map((mode) => (_jsx(Button, { size: "sm", variant: performanceMode === mode ? 'default' : 'outline', onClick: () => onPerformanceModeChange(mode), className: "capitalize", children: mode }, mode))) })] }), _jsx(Separator, {}), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Feature Statistics" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { children: "Total Features" }), _jsx(Badge, { variant: "secondary", children: featureStats.total })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { children: "Active Features" }), _jsx(Badge, { variant: "secondary", children: featureStats.active })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-xs font-medium", children: "By Category" }), Object.entries(featureStats.byCategory).slice(0, 3).map(([category, count]) => (_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "capitalize", children: category }), _jsx(Badge, { variant: "outline", className: "text-xs", children: count })] }, category)))] })] })] }), warnings.length > 0 && (_jsxs("div", { className: "p-3 bg-yellow-500/10 border border-yellow-500/20 rounded", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(AlertTriangle, { className: "w-4 h-4 text-yellow-500" }), _jsx("span", { className: "text-sm font-medium", children: "Warnings" })] }), _jsx("ul", { className: "text-xs space-y-1", children: warnings.map((warning, index) => (_jsxs("li", { children: ["\u2022 ", warning] }, index))) })] })), suggestions.length > 0 && (_jsxs("div", { className: "p-3 bg-blue-500/10 border border-blue-500/20 rounded", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Info, { className: "w-4 h-4 text-blue-500" }), _jsx("span", { className: "text-sm font-medium", children: "Suggestions" })] }), _jsx("ul", { className: "text-xs space-y-1", children: suggestions.map((suggestion, index) => (_jsxs("li", { children: ["\u2022 ", suggestion] }, index))) })] }))] }) }) }), _jsx(TabsContent, { value: "features", className: "p-4 h-full", children: _jsx(ScrollArea, { className: "h-full", children: _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Active Features" }), activeFeatures.length === 0 ? (_jsx("p", { className: "text-xs text-muted-foreground", children: "No features active" })) : (_jsx("div", { className: "grid grid-cols-2 gap-2", children: activeFeatures.map((featureId) => (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsxs(Button, { size: "sm", variant: "outline", className: "justify-start text-xs", onClick: () => onFeatureToggle(featureId), children: [_jsx(CheckCircle, { className: "w-3 h-3 mr-1 text-green-500" }), featureId] }) }), _jsx(TooltipContent, { children: "Click to deactivate" })] }) }, featureId))) }))] }) }) }), _jsx(TabsContent, { value: "export", className: "p-4 h-full", children: _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Export Scene" }), _jsxs(Select, { value: exportFormat, onValueChange: setExportFormat, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select format" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "gltf", children: "GLTF" }), _jsx(SelectItem, { value: "png", children: "PNG" }), _jsx(SelectItem, { value: "video", children: "Video" })] })] }), _jsx(Label, { className: "mt-4", children: "Quality" }), _jsxs(Select, { value: exportQuality, onValueChange: setExportQuality, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select quality" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "low", children: "Low" }), _jsx(SelectItem, { value: "medium", children: "Medium" }), _jsx(SelectItem, { value: "high", children: "High" })] })] }), _jsx(Button, { className: "mt-4", onClick: handleExport, disabled: isExporting, children: isExporting ? "Exporting..." : "Export" }), isExporting && (_jsx(Progress, { value: exportProgress, className: "mt-2" }))] }) }), _jsx(TabsContent, { value: "selected", className: "p-4 h-full", children: _jsx(ScrollArea, { className: "h-full", children: selectedMesh ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Object Properties" }), _jsxs("div", { className: "space-y-2 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Name:" }), _jsx("span", { className: "font-mono", children: selectedMesh.name })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "ID:" }), _jsx("span", { className: "font-mono", children: selectedMesh.id })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Position:" }), _jsxs("span", { className: "font-mono", children: ["(", selectedMesh.position.x.toFixed(2), ", ", selectedMesh.position.y.toFixed(2), ", ", selectedMesh.position.z.toFixed(2), ")"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Visible:" }), _jsx(Badge, { variant: selectedMesh.isVisible ? 'default' : 'secondary', children: selectedMesh.isVisible ? 'Yes' : 'No' })] })] })] }), _jsx(Separator, {}), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium mb-2", children: "Material" }), selectedMesh.material ? (_jsx("div", { className: "text-xs", children: _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Type:" }), _jsx("span", { className: "font-mono", children: selectedMesh.material.getClassName() })] }) })) : (_jsx("p", { className: "text-xs text-muted-foreground", children: "No material assigned" }))] })] })) : (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "No object selected" }) })) }) })] }) }));
};

export default BottomPanel;
