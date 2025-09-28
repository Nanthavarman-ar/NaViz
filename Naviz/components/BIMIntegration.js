import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, Eye, EyeOff, AlertTriangle, Layers, RotateCcw } from 'lucide-react';
const BIMIntegration = ({ scene, isActive, bimManager, onClose }) => {
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [clashes, setClashes] = useState([]);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showHiddenDetails, setShowHiddenDetails] = useState(false);
    const [transparencyMode, setTransparencyMode] = useState(false);
    const [wallPeelingMode, setWallPeelingMode] = useState(false);
    const [clashDetectionEnabled, setClashDetectionEnabled] = useState(false);
    const [elementFilter, setElementFilter] = useState('all');
    const fileInputRef = useRef(null);
    // Initialize BIM Manager if not provided
    const [localBimManager] = useState(() => {
        if (bimManager)
            return bimManager;
        // This would need proper initialization with FeatureManager
        // For now, return null and show message
        return null;
    });
    const handleFileImport = useCallback(async (event) => {
        const file = event.target.files?.[0];
        if (!file || !localBimManager)
            return;
        setIsImporting(true);
        setImportProgress(0);
        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setImportProgress(prev => Math.min(prev + 10, 90));
            }, 200);
            const importedModel = await localBimManager.importBIMModel(file);
            clearInterval(progressInterval);
            setImportProgress(100);
            setModels(prev => [...prev, importedModel]);
            setSelectedModel(importedModel);
            // Delay to show completion
            setTimeout(() => {
                setIsImporting(false);
                setImportProgress(0);
            }, 500);
        }
        catch (error) {
            console.error('BIM import failed:', error);
            setIsImporting(false);
            setImportProgress(0);
        }
    }, [localBimManager]);
    const handleElementSelect = useCallback((element) => {
        setSelectedElement(element);
        if (localBimManager) {
            localBimManager.highlightElement(element.id, true);
        }
    }, [localBimManager]);
    const toggleHiddenDetails = useCallback(() => {
        if (!localBimManager)
            return;
        localBimManager.toggleHiddenDetails();
        setShowHiddenDetails(!showHiddenDetails);
    }, [localBimManager, showHiddenDetails]);
    const toggleTransparency = useCallback(() => {
        if (!localBimManager)
            return;
        localBimManager.toggleTransparencyMode();
        setTransparencyMode(!transparencyMode);
    }, [localBimManager, transparencyMode]);
    const toggleWallPeeling = useCallback(() => {
        if (!localBimManager)
            return;
        localBimManager.toggleWallPeeling();
        setWallPeelingMode(!wallPeelingMode);
    }, [localBimManager, wallPeelingMode]);
    const toggleClashDetection = useCallback(() => {
        if (!localBimManager)
            return;
        if (!clashDetectionEnabled) {
            localBimManager.enableClashDetection();
            setClashes(localBimManager.getClashes());
        }
        else {
            localBimManager.disableClashDetection();
            setClashes([]);
        }
        setClashDetectionEnabled(!clashDetectionEnabled);
    }, [localBimManager, clashDetectionEnabled]);
    const filteredElements = selectedModel?.elements.filter(element => {
        const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            element.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = elementFilter === 'all' || element.type === elementFilter;
        return matchesSearch && matchesFilter;
    }) || [];
    if (!isActive)
        return null;
    if (!localBimManager) {
        return (_jsx("div", { className: "absolute top-4 left-4 z-50", children: _jsxs(Alert, { className: "w-80", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsx(AlertDescription, { children: "BIM Manager not initialized. Please ensure proper workspace setup." })] }) }));
    }
    return (_jsx("div", { className: "absolute top-4 left-4 z-50 w-96 max-h-96", children: _jsxs(Card, { className: "bg-background/95 backdrop-blur border", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { className: "text-lg", children: "BIM Integration" }), onClose && (_jsx(Button, { size: "sm", variant: "ghost", onClick: onClose, children: _jsx(RotateCcw, { className: "w-4 h-4" }) }))] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs(Tabs, { defaultValue: "models", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsx(TabsTrigger, { value: "models", children: "Models" }), _jsx(TabsTrigger, { value: "elements", children: "Elements" }), _jsx(TabsTrigger, { value: "analysis", children: "Analysis" })] }), _jsxs(TabsContent, { value: "models", className: "space-y-3", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { size: "sm", onClick: () => fileInputRef.current?.click(), disabled: isImporting, className: "flex-1", "aria-label": "Import BIM file", children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), "Import BIM"] }), _jsx("input", { ref: fileInputRef, type: "file", accept: ".json,.ifc,.rvt,.dwg", onChange: handleFileImport, className: "hidden", title: "Import BIM file" })] }), isImporting && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: "Importing..." }), _jsxs("span", { children: [importProgress, "%"] })] }), _jsx(Progress, { value: importProgress })] })), _jsx(ScrollArea, { className: "h-32", children: models.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No BIM models loaded" })) : (_jsx("div", { className: "space-y-2", children: models.map(model => (_jsxs("div", { className: `p-2 rounded border cursor-pointer ${selectedModel?.id === model.id ? 'border-primary bg-primary/10' : 'border-border'}`, onClick: () => setSelectedModel(model), children: [_jsx("div", { className: "font-medium text-sm", children: model.name }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [model.elements.length, " elements \u2022 ", model.source] })] }, model.id))) })) })] }), _jsx(TabsContent, { value: "elements", className: "space-y-3", children: selectedModel ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("div", { className: "flex-1", children: _jsx(Input, { placeholder: "Search elements...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "h-8", title: "Search elements input" }) }), _jsxs(Select, { value: elementFilter, onValueChange: setElementFilter, children: [_jsx(SelectTrigger, { className: "w-24 h-8", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All" }), _jsx(SelectItem, { value: "wall", children: "Walls" }), _jsx(SelectItem, { value: "floor", children: "Floors" }), _jsx(SelectItem, { value: "door", children: "Doors" }), _jsx(SelectItem, { value: "window", children: "Windows" })] })] })] }), _jsx(ScrollArea, { className: "h-32", children: _jsx("div", { className: "space-y-1", children: filteredElements.map(element => (_jsxs("div", { className: `p-2 rounded border cursor-pointer text-sm ${selectedElement?.id === element.id ? 'border-primary bg-primary/10' : 'border-border'}`, onClick: () => handleElementSelect(element), children: [_jsx("div", { className: "font-medium", children: element.name }), _jsxs("div", { className: "text-xs text-muted-foreground capitalize", children: [element.type, " \u2022 ", element.category] })] }, element.id))) }) })] })) : (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Select a BIM model first" })) }), _jsxs(TabsContent, { value: "analysis", className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs(Button, { size: "sm", variant: showHiddenDetails ? "default" : "outline", onClick: toggleHiddenDetails, className: "text-xs", children: [_jsx(Eye, { className: "w-3 h-3 mr-1" }), "Hidden"] }), _jsxs(Button, { size: "sm", variant: transparencyMode ? "default" : "outline", onClick: toggleTransparency, className: "text-xs", children: [_jsx(EyeOff, { className: "w-3 h-3 mr-1" }), "X-Ray"] }), _jsxs(Button, { size: "sm", variant: wallPeelingMode ? "default" : "outline", onClick: toggleWallPeeling, className: "text-xs", children: [_jsx(Layers, { className: "w-3 h-3 mr-1" }), "Peel"] }), _jsxs(Button, { size: "sm", variant: clashDetectionEnabled ? "default" : "outline", onClick: toggleClashDetection, className: "text-xs", children: [_jsx(AlertTriangle, { className: "w-3 h-3 mr-1" }), "Clashes"] })] }), clashes.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "w-4 h-4 text-destructive" }), _jsxs("span", { className: "text-sm font-medium", children: [clashes.length, " clash", clashes.length !== 1 ? 'es' : '', " detected"] })] }), _jsx(ScrollArea, { className: "h-20", children: _jsx("div", { className: "space-y-1", children: clashes.slice(0, 5).map(clash => (_jsx("div", { className: "text-xs p-2 bg-destructive/10 rounded", children: clash.description }, clash.id))) }) })] })), selectedElement && (_jsxs("div", { className: "space-y-2 p-2 bg-muted rounded", children: [_jsx("div", { className: "font-medium text-sm", children: selectedElement.name }), _jsxs("div", { className: "text-xs text-muted-foreground space-y-1", children: [_jsxs("div", { children: ["Type: ", selectedElement.type] }), _jsxs("div", { children: ["Category: ", selectedElement.category] }), selectedElement.material && _jsxs("div", { children: ["Material: ", selectedElement.material] })] })] }))] })] }) })] }) }));
};
export default BIMIntegration;
