import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useWorkspace } from '../core/WorkspaceContext';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { Save, Download, Upload, Settings, Play, Pause, RotateCcw, Maximize, Minimize, Sun, Monitor, Volume2, Wifi, Users, MessageSquare, Share, HelpCircle, FileText, Grid3X3, Eye, EyeOff, Layers, Zap, Activity } from 'lucide-react';
import './TopBar.css';
export function TopBar({ onSave, onExport, onImport, onSettings, onPlay, onPause, onReset, onFullscreen, onMinimize, onHelp, onShare, onChat, onCollaborate }) {
    const { state, dispatch, toggleFeature } = useWorkspace();
    // Handle theme toggle (placeholder - theme not implemented in context yet)
    const handleThemeToggle = () => {
        console.log('Theme toggle - not implemented yet');
    };
    // Handle audio toggle (placeholder - audio not implemented in context yet)
    const handleAudioToggle = () => {
        console.log('Audio toggle - not implemented yet');
    };
    // Handle network toggle (placeholder - network not implemented in context yet)
    const handleNetworkToggle = () => {
        console.log('Network toggle - not implemented yet');
    };
    // Handle performance mode change
    const handlePerformanceModeChange = (mode) => {
        dispatch({ type: 'SET_PERFORMANCE_MODE', payload: mode });
    };
    // Handle rendering quality change
    const handleRenderingQualityChange = (quality) => {
        dispatch({ type: 'SET_RENDERING_QUALITY', payload: quality });
    };
    return (_jsxs("div", { className: "topbar", children: [_jsxs("div", { className: "topbar-section topbar-left", children: [_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "sm", className: "topbar-button", children: [_jsx(FileText, { className: "w-4 h-4" }), "File"] }) }), _jsxs(DropdownMenuContent, { children: [_jsxs(DropdownMenuItem, { onClick: onSave, children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Save Project"] }), _jsxs(DropdownMenuItem, { onClick: onImport, children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), "Import"] }), _jsxs(DropdownMenuItem, { onClick: onExport, children: [_jsx(Download, { className: "w-4 h-4 mr-2" }), "Export"] })] })] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: onSettings, children: [_jsx(Settings, { className: "w-4 h-4" }), "Settings"] })] }), _jsxs("div", { className: "topbar-section topbar-center", children: [_jsxs(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: onReset, children: [_jsx(RotateCcw, { className: "w-4 h-4" }), "Reset"] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: onPlay, children: [_jsx(Play, { className: "w-4 h-4" }), "Play"] }), _jsxs(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: onPause, children: [_jsx(Pause, { className: "w-4 h-4" }), "Pause"] }), _jsxs(Badge, { variant: "outline", className: "performance-badge", children: [_jsx(Activity, { className: "w-3 h-3 mr-1" }), state.performanceMode.toUpperCase()] })] }), _jsxs("div", { className: "topbar-section topbar-right", children: [_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "sm", className: "topbar-button", children: [_jsx(Eye, { className: "w-4 h-4" }), "View"] }) }), _jsxs(DropdownMenuContent, { children: [_jsxs(DropdownMenuItem, { onClick: () => dispatch({ type: 'TOGGLE_PANEL', payload: 'showFloatingToolbar' }), children: [_jsx(Grid3X3, { className: "w-4 h-4 mr-2" }), "Toggle Toolbar"] }), _jsxs(DropdownMenuItem, { onClick: () => dispatch({ type: 'TOGGLE_PANEL', payload: 'leftPanelVisible' }), children: [_jsx(Layers, { className: "w-4 h-4 mr-2" }), "Toggle Left Panel"] }), _jsxs(DropdownMenuItem, { onClick: () => dispatch({ type: 'TOGGLE_PANEL', payload: 'rightPanelVisible' }), children: [_jsx(EyeOff, { className: "w-4 h-4 mr-2" }), "Toggle Right Panel"] })] })] }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "sm", className: "topbar-button", children: [_jsx(Zap, { className: "w-4 h-4" }), "Performance"] }) }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuItem, { onClick: () => handlePerformanceModeChange('low'), children: "Low Performance" }), _jsx(DropdownMenuItem, { onClick: () => handlePerformanceModeChange('medium'), children: "Medium Performance" }), _jsx(DropdownMenuItem, { onClick: () => handlePerformanceModeChange('high'), children: "High Performance" })] })] }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "sm", className: "topbar-button", children: [_jsx(Monitor, { className: "w-4 h-4" }), "Quality"] }) }), _jsxs(DropdownMenuContent, { children: [_jsx(DropdownMenuItem, { onClick: () => handleRenderingQualityChange('low'), children: "Low Quality" }), _jsx(DropdownMenuItem, { onClick: () => handleRenderingQualityChange('medium'), children: "Medium Quality" }), _jsx(DropdownMenuItem, { onClick: () => handleRenderingQualityChange('high'), children: "High Quality" }), _jsx(DropdownMenuItem, { onClick: () => handleRenderingQualityChange('ultra'), children: "Ultra Quality" })] })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: handleAudioToggle, title: "Audio Controls", children: _jsx(Volume2, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: handleNetworkToggle, title: "Network Controls", children: _jsx(Wifi, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: handleThemeToggle, title: "Theme Controls", children: _jsx(Sun, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: onCollaborate, children: _jsx(Users, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: onChat, children: _jsx(MessageSquare, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: onShare, children: _jsx(Share, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: onHelp, children: _jsx(HelpCircle, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: onMinimize, children: _jsx(Minimize, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "topbar-button", onClick: onFullscreen, children: _jsx(Maximize, { className: "w-4 h-4" }) })] })] }));
}
export function FloatingToolbar({ position = { x: 100, y: 100 }, onPositionChange, onClose }) {
    const { state, dispatch } = useWorkspace();
    // Handle drag for repositioning
    const handleMouseDown = (e) => {
        const startX = e.clientX - position.x;
        const startY = e.clientY - position.y;
        const handleMouseMove = (e) => {
            const newX = e.clientX - startX;
            const newY = e.clientY - startY;
            const newPosition = { x: newX, y: newY };
            if (onPositionChange) {
                onPositionChange(newPosition);
            }
        };
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
    // Quick tool access
    const tools = [
        { id: 'move', icon: '⬆️', label: 'Move', active: state.moveActive },
        { id: 'rotate', icon: '🔄', label: 'Rotate', active: state.rotateActive },
        { id: 'scale', icon: '📏', label: 'Scale', active: state.scaleActive },
        { id: 'camera', icon: '📷', label: 'Camera', active: state.cameraActive },
        { id: 'measure', icon: '📐', label: 'Measure', active: state.perspectiveActive },
    ];
    const handleToolClick = (toolId) => {
        const toolMap = {
            move: 'moveActive',
            rotate: 'rotateActive',
            scale: 'scaleActive',
            camera: 'cameraActive',
            measure: 'perspectiveActive',
        };
        const stateKey = toolMap[toolId];
        if (stateKey) {
            dispatch({ type: 'SET_TOOL_ACTIVE', payload: { tool: stateKey, active: !state[stateKey] } });
        }
    };
    return (_jsxs("div", { className: "floating-toolbar", style: {
            left: `${position.x}px`,
            top: `${position.y}px`,
        }, onMouseDown: handleMouseDown, children: [_jsxs("div", { className: "floating-toolbar-header", children: [_jsx("span", { className: "floating-toolbar-title", children: "Quick Tools" }), _jsx(Button, { variant: "ghost", size: "sm", className: "floating-toolbar-close", onClick: onClose, children: "\u2715" })] }), _jsx("div", { className: "floating-toolbar-content", children: tools.map((tool) => (_jsx(Button, { variant: tool.active ? 'default' : 'ghost', size: "sm", className: "floating-tool-button", onClick: () => handleToolClick(tool.id), title: tool.label, children: tool.icon }, tool.id))) })] }));
}
