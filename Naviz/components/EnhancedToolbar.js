import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Box, Download, Camera, Undo, Redo, Play, Pause, Square, ZoomIn, ZoomOut, RotateCw, Move, Scale, Sun, Eye, EyeOff, Layers, Settings, Wind, Mountain, Droplet, Volume2, Cloud, Car, Activity, Ruler, Zap, DollarSign, Shield, Sofa, Brain, Wand2, Mic, MapPin, Palette, Construction, Smartphone, Hand, Presentation, MessageSquare, Search, Network, Users, ChevronDown, ChevronUp } from 'lucide-react';
const EnhancedToolbar = ({ activeFeatures, onFeatureToggle, onUndo, onRedo, onPlay, onPause, onStop, isPlaying = false, isVisible = true, lightingEnabled = true }) => {
    const [collapsedSections, setCollapsedSections] = useState(new Set());
    const toggleSection = (sectionId) => {
        const newCollapsed = new Set(collapsedSections);
        if (newCollapsed.has(sectionId)) {
            newCollapsed.delete(sectionId);
        }
        else {
            newCollapsed.add(sectionId);
        }
        setCollapsedSections(newCollapsed);
    };
    const createButton = (id, label, icon, tooltip, hotkey, category) => ({
        id,
        label,
        icon,
        onClick: () => onFeatureToggle(id, !activeFeatures.has(id)),
        active: activeFeatures.has(id),
        hotkey,
        tooltip,
        category
    });
    const toolbarSections = [
        {
            id: 'file',
            title: 'File',
            collapsed: false,
            buttons: [
                {
                    id: 'addCube',
                    label: 'Add',
                    icon: _jsx(Box, { className: "w-4 h-4" }),
                    onClick: () => console.log('Add cube'),
                    tooltip: 'Add primitive objects',
                    hotkey: 'Ctrl+A'
                },
                {
                    id: 'export',
                    label: 'Export',
                    icon: _jsx(Download, { className: "w-4 h-4" }),
                    onClick: () => onFeatureToggle('export', !activeFeatures.has('export')),
                    active: activeFeatures.has('export'),
                    tooltip: 'Export scene',
                    hotkey: 'Ctrl+E'
                },
                {
                    id: 'screenshot',
                    label: 'Capture',
                    icon: _jsx(Camera, { className: "w-4 h-4" }),
                    onClick: () => console.log('Screenshot'),
                    tooltip: 'Take screenshot',
                    hotkey: 'F12'
                }
            ]
        },
        {
            id: 'edit',
            title: 'Edit',
            collapsed: false,
            buttons: [
                {
                    id: 'undo',
                    label: 'Undo',
                    icon: _jsx(Undo, { className: "w-4 h-4" }),
                    onClick: onUndo || (() => { }),
                    tooltip: 'Undo last action',
                    hotkey: 'Ctrl+Z'
                },
                {
                    id: 'redo',
                    label: 'Redo',
                    icon: _jsx(Redo, { className: "w-4 h-4" }),
                    onClick: onRedo || (() => { }),
                    tooltip: 'Redo last action',
                    hotkey: 'Ctrl+Y'
                }
            ]
        },
        {
            id: 'animation',
            title: 'Animation',
            collapsed: false,
            buttons: [
                {
                    id: 'play',
                    label: isPlaying ? 'Pause' : 'Play',
                    icon: isPlaying ? _jsx(Pause, { className: "w-4 h-4" }) : _jsx(Play, { className: "w-4 h-4" }),
                    onClick: isPlaying ? (onPause || (() => { })) : (onPlay || (() => { })),
                    active: isPlaying,
                    tooltip: isPlaying ? 'Pause animation' : 'Play animation',
                    hotkey: 'Space'
                },
                {
                    id: 'stop',
                    label: 'Stop',
                    icon: _jsx(Square, { className: "w-4 h-4" }),
                    onClick: onStop || (() => { }),
                    tooltip: 'Stop animation',
                    hotkey: 'Esc'
                }
            ]
        },
        {
            id: 'view',
            title: 'View',
            collapsed: false,
            buttons: [
                {
                    id: 'zoomIn',
                    label: 'Zoom+',
                    icon: _jsx(ZoomIn, { className: "w-4 h-4" }),
                    onClick: () => console.log('Zoom in'),
                    tooltip: 'Zoom in',
                    hotkey: '+'
                },
                {
                    id: 'zoomOut',
                    label: 'Zoom-',
                    icon: _jsx(ZoomOut, { className: "w-4 h-4" }),
                    onClick: () => console.log('Zoom out'),
                    tooltip: 'Zoom out',
                    hotkey: '-'
                },
                createButton('minimap', 'Minimap', _jsx(MapPin, { className: "w-4 h-4" }), 'Toggle minimap', 'M')
            ]
        },
        {
            id: 'transform',
            title: 'Transform',
            collapsed: false,
            buttons: [
                createButton('move', 'Move', _jsx(Move, { className: "w-4 h-4" }), 'Move tool', 'G'),
                createButton('rotate', 'Rotate', _jsx(RotateCw, { className: "w-4 h-4" }), 'Rotate tool', 'R'),
                createButton('scale', 'Scale', _jsx(Scale, { className: "w-4 h-4" }), 'Scale tool', 'S'),
                createButton('measure', 'Measure', _jsx(Ruler, { className: "w-4 h-4" }), 'Measure tool', 'T')
            ]
        },
        {
            id: 'display',
            title: 'Display',
            collapsed: false,
            buttons: [
                {
                    id: 'lighting',
                    label: 'Lighting',
                    icon: _jsx(Sun, { className: "w-4 h-4" }),
                    onClick: () => onFeatureToggle('lighting', !lightingEnabled),
                    active: lightingEnabled,
                    tooltip: 'Toggle lighting',
                    hotkey: 'L'
                },
                {
                    id: 'visibility',
                    label: 'Visibility',
                    icon: isVisible ? _jsx(Eye, { className: "w-4 h-4" }) : _jsx(EyeOff, { className: "w-4 h-4" }),
                    onClick: () => onFeatureToggle('visibility', !isVisible),
                    active: isVisible,
                    tooltip: 'Toggle visibility',
                    hotkey: 'H'
                },
                createButton('layers', 'Layers', _jsx(Layers, { className: "w-4 h-4" }), 'Layer manager', 'Shift+L'),
                createButton('materials', 'Materials', _jsx(Palette, { className: "w-4 h-4" }), 'Material editor', 'Shift+M')
            ]
        },
        {
            id: 'simulation',
            title: 'Simulation',
            collapsed: true,
            buttons: [
                createButton('weather', 'Weather', _jsx(Cloud, { className: "w-4 h-4" }), 'Weather system', 'W'),
                createButton('flood', 'Flood', _jsx(Droplet, { className: "w-4 h-4" }), 'Flood simulation', 'F'),
                createButton('wind', 'Wind', _jsx(Wind, { className: "w-4 h-4" }), 'Wind tunnel', 'Shift+W'),
                createButton('noise', 'Noise', _jsx(Volume2, { className: "w-4 h-4" }), 'Noise simulation', 'N'),
                createButton('traffic', 'Traffic', _jsx(Car, { className: "w-4 h-4" }), 'Traffic simulation', 'Shift+T'),
                createButton('energy', 'Energy', _jsx(Zap, { className: "w-4 h-4" }), 'Energy analysis', 'E')
            ]
        },
        {
            id: 'ai',
            title: 'AI Tools',
            collapsed: true,
            buttons: [
                createButton('aiAdvisor', 'AI Advisor', _jsx(Brain, { className: "w-4 h-4" }), 'AI structural advisor', 'A'),
                createButton('autoFurnish', 'Auto-Furnish', _jsx(Wand2, { className: "w-4 h-4" }), 'AI furniture placement', 'U'),
                createButton('voiceAssistant', 'Voice AI', _jsx(Mic, { className: "w-4 h-4" }), 'Voice assistant', 'V'),
                createButton('aiCoDesigner', 'Co-Designer', _jsx(Palette, { className: "w-4 h-4" }), 'AI co-designer', 'C')
            ]
        },
        {
            id: 'analysis',
            title: 'Analysis',
            collapsed: true,
            buttons: [
                createButton('cost', 'Cost', _jsx(DollarSign, { className: "w-4 h-4" }), 'Cost estimator', 'O'),
                createButton('sunlight', 'Sunlight', _jsx(Sun, { className: "w-4 h-4" }), 'Sunlight analysis', 'Y'),
                createButton('shadow', 'Shadow', _jsx(Eye, { className: "w-4 h-4" }), 'Shadow analysis', 'Shift+S'),
                createButton('ergonomic', 'Ergonomic', _jsx(Users, { className: "w-4 h-4" }), 'Ergonomic testing', 'Shift+E'),
                createButton('soundPrivacy', 'Sound Privacy', _jsx(Shield, { className: "w-4 h-4" }), 'Sound privacy', 'P'),
                createButton('furniture', 'Furniture', _jsx(Sofa, { className: "w-4 h-4" }), 'Furniture clearance', 'Shift+F')
            ]
        },
        {
            id: 'environment',
            title: 'Environment',
            collapsed: true,
            buttons: [
                createButton('siteContext', 'Site Context', _jsx(MapPin, { className: "w-4 h-4" }), 'Site context', 'Shift+C'),
                createButton('topography', 'Topography', _jsx(Mountain, { className: "w-4 h-4" }), 'Terrain generation', 'Shift+G'),
                createButton('geoLocation', 'Geo Location', _jsx(MapPin, { className: "w-4 h-4" }), 'GPS location', 'Shift+L'),
                createButton('construction', 'Construction', _jsx(Construction, { className: "w-4 h-4" }), 'Construction overlay', 'Shift+O')
            ]
        },
        {
            id: 'collaboration',
            title: 'Collaboration',
            collapsed: true,
            buttons: [
                createButton('multiUser', 'Multi-User', _jsx(Users, { className: "w-4 h-4" }), 'Multi-user mode', 'J'),
                createButton('voiceChat', 'Voice Chat', _jsx(Mic, { className: "w-4 h-4" }), 'Voice chat', 'Shift+V'),
                createButton('annotations', 'Annotations', _jsx(MessageSquare, { className: "w-4 h-4" }), '3D annotations', 'Shift+A'),
                createButton('presenter', 'Presenter', _jsx(Presentation, { className: "w-4 h-4" }), 'Presentation mode', 'I')
            ]
        },
        {
            id: 'immersive',
            title: 'Immersive',
            collapsed: true,
            buttons: [
                createButton('vr', 'VR Mode', _jsx(Smartphone, { className: "w-4 h-4" }), 'Virtual reality', 'X'),
                createButton('ar', 'AR Mode', _jsx(Smartphone, { className: "w-4 h-4" }), 'Augmented reality', 'Z'),
                createButton('handTracking', 'Hand Track', _jsx(Hand, { className: "w-4 h-4" }), 'Hand tracking', 'K'),
                createButton('multiSensory', 'Multi-Sensory', _jsx(Eye, { className: "w-4 h-4" }), 'Multi-sensory feedback', 'Shift+K')
            ]
        },
        {
            id: 'utilities',
            title: 'Utilities',
            collapsed: true,
            buttons: [
                createButton('propertyInspector', 'Inspector', _jsx(Search, { className: "w-4 h-4" }), 'Property inspector', 'Shift+I'),
                createButton('sceneBrowser', 'Scene Browser', _jsx(Layers, { className: "w-4 h-4" }), 'Scene browser', 'B'),
                createButton('pathTracing', 'Path Tracing', _jsx(Activity, { className: "w-4 h-4" }), 'Ray tracing', 'Shift+R'),
                createButton('iot', 'IoT', _jsx(Network, { className: "w-4 h-4" }), 'IoT integration', 'Shift+N')
            ]
        }
    ];
    const renderButton = (button) => (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: button.active ? "default" : "ghost", size: "sm", onClick: button.onClick, className: `w-12 h-12 p-0 ${button.active ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-slate-700'}`, children: button.icon }) }), _jsxs(TooltipContent, { side: "right", className: "flex flex-col items-start", children: [_jsx("span", { className: "font-medium", children: button.label }), _jsx("span", { className: "text-xs text-muted-foreground", children: button.tooltip }), button.hotkey && (_jsx(Badge, { variant: "secondary", className: "text-xs mt-1", children: button.hotkey }))] })] }) }, button.id));
    const renderSection = (section) => {
        const isCollapsed = collapsedSections.has(section.id);
        const activeCount = section.buttons.filter(b => b.active).length;
        return (_jsxs("div", { className: "border-b border-slate-600", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => toggleSection(section.id), className: "w-full h-8 px-2 flex items-center justify-between text-xs text-slate-400 hover:text-white", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { children: section.title }), activeCount > 0 && (_jsx(Badge, { variant: "secondary", className: "text-xs px-1 py-0 h-4", children: activeCount }))] }), isCollapsed ? _jsx(ChevronDown, { className: "w-3 h-3" }) : _jsx(ChevronUp, { className: "w-3 h-3" })] }), !isCollapsed && (_jsx("div", { className: "p-2 grid grid-cols-1 gap-1", children: section.buttons.map(renderButton) }))] }, section.id));
    };
    return (_jsxs("div", { className: "w-16 bg-slate-800 border-r border-slate-700 flex flex-col h-full overflow-y-auto", children: [_jsxs("div", { className: "p-2 border-b border-slate-600", children: [_jsx("div", { className: "text-xs text-slate-400 text-center mb-1", children: "Tools" }), _jsx("div", { className: "text-xs text-center", children: _jsx(Badge, { variant: "outline", className: "text-xs", children: activeFeatures.size }) })] }), _jsx("div", { className: "flex-1", children: toolbarSections.map(renderSection) }), _jsx("div", { className: "p-2 border-t border-slate-600", children: _jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", className: "w-12 h-12 p-0", children: _jsx(Settings, { className: "w-4 h-4" }) }) }), _jsx(TooltipContent, { side: "right", children: _jsx("span", { children: "Settings" }) })] }) }) })] }));
};
export default EnhancedToolbar;
