import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useWorkspace } from '../core/WorkspaceContext';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Activity, Zap, Monitor, Clock, AlertTriangle, CheckCircle, XCircle, Info, RotateCcw, Settings, Download, Upload, Save, FileText, BarChart3, Grid3X3, Layers, Camera, Lightbulb, Move3D, Scale, RotateCw, Ruler, Trash2 } from 'lucide-react';
import './BottomPanel.css';
export function BottomPanel({ onToggleStats, onToggleConsole, onToggleTimeline, onExportStats, onClearStats }) {
    const { state } = useWorkspace();
    // Get real-time performance data
    const performanceData = {
        fps: 60, // Would get from Babylon.js engine
        frameTime: 16.67,
        drawCalls: 150,
        triangles: 50000,
        memoryUsage: '256 MB',
        gpuMemory: '128 MB',
        cpuUsage: 45,
        gpuTemp: 65,
    };
    // Get system information
    const systemInfo = {
        platform: 'Windows 11',
        browser: 'Chrome 120',
        webgl: 'WebGL 2.0',
        babylonVersion: '8.28.1',
        renderMode: 'Forward',
        antialiasing: 'FXAA',
    };
    // Get scene statistics
    const sceneStats = {
        meshes: state.scene?.meshes?.length || 0,
        materials: state.materials?.length || 0,
        lights: state.scene?.lights?.length || 0,
        cameras: state.scene?.cameras?.length || 0,
        textures: state.scene?.textures?.length || 0,
        particleSystems: state.scene?.particleSystems?.length || 0,
        skeletons: state.scene?.skeletons?.length || 0,
        animations: state.scene?.animations?.length || 0,
    };
    // Get tool states
    const toolStates = {
        move: state.moveActive,
        rotate: state.rotateActive,
        scale: state.scaleActive,
        camera: state.cameraActive,
        measure: state.perspectiveActive,
    };
    return (_jsxs("div", { className: "bottom-panel", children: [_jsxs("div", { className: "bottom-panel-header", children: [_jsx("h3", { className: "bottom-panel-title", children: "Performance & Stats" }), _jsxs("div", { className: "bottom-panel-controls", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: onToggleStats, children: _jsx(BarChart3, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onToggleConsole, children: _jsx(FileText, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onToggleTimeline, children: _jsx(Clock, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onExportStats, children: _jsx(Download, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onClearStats, children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "bottom-panel-content", children: [_jsxs(Card, { className: "performance-card", children: [_jsx(CardHeader, { className: "performance-header", children: _jsxs(CardTitle, { className: "text-sm flex items-center", children: [_jsx(Activity, { className: "w-4 h-4 mr-2" }), "Real-time Performance"] }) }), _jsx(CardContent, { className: "performance-content", children: _jsxs("div", { className: "metrics-grid", children: [_jsxs("div", { className: "metric-item", children: [_jsx("div", { className: "metric-label", children: "FPS" }), _jsx("div", { className: "metric-value fps-value", "data-quality": performanceData.fps >= 50 ? 'good' : performanceData.fps >= 30 ? 'medium' : 'poor', children: performanceData.fps }), _jsx(Progress, { value: (performanceData.fps / 60) * 100, className: "metric-progress" })] }), _jsxs("div", { className: "metric-item", children: [_jsx("div", { className: "metric-label", children: "Frame Time" }), _jsxs("div", { className: "metric-value", children: [performanceData.frameTime.toFixed(1), "ms"] }), _jsx(Progress, { value: Math.min((performanceData.frameTime / 33.33) * 100, 100), className: "metric-progress" })] }), _jsxs("div", { className: "metric-item", children: [_jsx("div", { className: "metric-label", children: "Draw Calls" }), _jsx("div", { className: "metric-value", children: performanceData.drawCalls }), _jsx(Progress, { value: Math.min((performanceData.drawCalls / 1000) * 100, 100), className: "metric-progress" })] }), _jsxs("div", { className: "metric-item", children: [_jsx("div", { className: "metric-label", children: "Triangles" }), _jsx("div", { className: "metric-value", children: performanceData.triangles.toLocaleString() }), _jsx(Progress, { value: Math.min((performanceData.triangles / 100000) * 100, 100), className: "metric-progress" })] })] }) })] }), _jsxs(Card, { className: "system-card", children: [_jsx(CardHeader, { className: "system-header", children: _jsxs(CardTitle, { className: "text-sm flex items-center", children: [_jsx(Monitor, { className: "w-4 h-4 mr-2" }), "System Information"] }) }), _jsx(CardContent, { className: "system-content", children: _jsxs("div", { className: "system-grid", children: [_jsxs("div", { className: "system-item", children: [_jsx("div", { className: "system-label", children: "Platform" }), _jsx("div", { className: "system-value", children: systemInfo.platform })] }), _jsxs("div", { className: "system-item", children: [_jsx("div", { className: "system-label", children: "Browser" }), _jsx("div", { className: "system-value", children: systemInfo.browser })] }), _jsxs("div", { className: "system-item", children: [_jsx("div", { className: "system-label", children: "WebGL" }), _jsx("div", { className: "system-value", children: systemInfo.webgl })] }), _jsxs("div", { className: "system-item", children: [_jsx("div", { className: "system-label", children: "Babylon.js" }), _jsx("div", { className: "system-value", children: systemInfo.babylonVersion })] }), _jsxs("div", { className: "system-item", children: [_jsx("div", { className: "system-label", children: "Render Mode" }), _jsx("div", { className: "system-value", children: systemInfo.renderMode })] }), _jsxs("div", { className: "system-item", children: [_jsx("div", { className: "system-label", children: "Antialiasing" }), _jsx("div", { className: "system-value", children: systemInfo.antialiasing })] })] }) })] }), _jsxs(Card, { className: "scene-card", children: [_jsx(CardHeader, { className: "scene-header", children: _jsxs(CardTitle, { className: "text-sm flex items-center", children: [_jsx(Layers, { className: "w-4 h-4 mr-2" }), "Scene Statistics"] }) }), _jsx(CardContent, { className: "scene-content", children: _jsxs("div", { className: "scene-stats", children: [_jsxs("div", { className: "stat-item", children: [_jsx("div", { className: "stat-label", children: "Meshes" }), _jsx(Badge, { variant: "secondary", children: sceneStats.meshes })] }), _jsxs("div", { className: "stat-item", children: [_jsx("div", { className: "stat-label", children: "Materials" }), _jsx(Badge, { variant: "secondary", children: sceneStats.materials })] }), _jsxs("div", { className: "stat-item", children: [_jsx("div", { className: "stat-label", children: "Lights" }), _jsx(Badge, { variant: "secondary", children: sceneStats.lights })] }), _jsxs("div", { className: "stat-item", children: [_jsx("div", { className: "stat-label", children: "Cameras" }), _jsx(Badge, { variant: "secondary", children: sceneStats.cameras })] }), _jsxs("div", { className: "stat-item", children: [_jsx("div", { className: "stat-label", children: "Textures" }), _jsx(Badge, { variant: "secondary", children: sceneStats.textures })] }), _jsxs("div", { className: "stat-item", children: [_jsx("div", { className: "stat-label", children: "Particles" }), _jsx(Badge, { variant: "secondary", children: sceneStats.particleSystems })] })] }) })] }), _jsxs(Card, { className: "tools-card", children: [_jsx(CardHeader, { className: "tools-header", children: _jsxs(CardTitle, { className: "text-sm flex items-center", children: [_jsx(Settings, { className: "w-4 h-4 mr-2" }), "Active Tools"] }) }), _jsx(CardContent, { className: "tools-content", children: _jsxs("div", { className: "tools-status", children: [_jsxs("div", { className: `tool-item ${toolStates.move ? 'active' : ''}`, children: [_jsx(Move3D, { className: "w-4 h-4" }), _jsx("span", { children: "Move" }), toolStates.move && _jsx(CheckCircle, { className: "w-3 h-3 text-green-500" })] }), _jsxs("div", { className: `tool-item ${toolStates.rotate ? 'active' : ''}`, children: [_jsx(RotateCw, { className: "w-4 h-4" }), _jsx("span", { children: "Rotate" }), toolStates.rotate && _jsx(CheckCircle, { className: "w-3 h-3 text-green-500" })] }), _jsxs("div", { className: `tool-item ${toolStates.scale ? 'active' : ''}`, children: [_jsx(Scale, { className: "w-4 h-4" }), _jsx("span", { children: "Scale" }), toolStates.scale && _jsx(CheckCircle, { className: "w-3 h-3 text-green-500" })] }), _jsxs("div", { className: `tool-item ${toolStates.camera ? 'active' : ''}`, children: [_jsx(Camera, { className: "w-4 h-4" }), _jsx("span", { children: "Camera" }), toolStates.camera && _jsx(CheckCircle, { className: "w-3 h-3 text-green-500" })] }), _jsxs("div", { className: `tool-item ${toolStates.measure ? 'active' : ''}`, children: [_jsx(Ruler, { className: "w-4 h-4" }), _jsx("span", { children: "Measure" }), toolStates.measure && _jsx(CheckCircle, { className: "w-3 h-3 text-green-500" })] })] }) })] }), _jsxs(Card, { className: "actions-card", children: [_jsx(CardHeader, { className: "actions-header", children: _jsxs(CardTitle, { className: "text-sm flex items-center", children: [_jsx(Zap, { className: "w-4 h-4 mr-2" }), "Quick Actions"] }) }), _jsx(CardContent, { className: "actions-content", children: _jsxs("div", { className: "quick-actions", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "quick-action", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Save Scene"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "quick-action", children: [_jsx(Upload, { className: "w-4 h-4 mr-2" }), "Import"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "quick-action", children: [_jsx(Download, { className: "w-4 h-4 mr-2" }), "Export"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "quick-action", children: [_jsx(RotateCcw, { className: "w-4 h-4 mr-2" }), "Reset View"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "quick-action", children: [_jsx(Grid3X3, { className: "w-4 h-4 mr-2" }), "Toggle Grid"] }), _jsxs(Button, { variant: "outline", size: "sm", className: "quick-action", children: [_jsx(Lightbulb, { className: "w-4 h-4 mr-2" }), "Toggle Lights"] })] }) })] })] }), _jsxs("div", { className: "status-bar", children: [_jsxs("div", { className: "status-left", children: [_jsxs("div", { className: "status-item", children: [_jsx("div", { className: "status-label", children: "Memory:" }), _jsx("div", { className: "status-value", children: performanceData.memoryUsage })] }), _jsxs("div", { className: "status-item", children: [_jsx("div", { className: "status-label", children: "GPU:" }), _jsx("div", { className: "status-value", children: performanceData.gpuMemory })] }), _jsxs("div", { className: "status-item", children: [_jsx("div", { className: "status-label", children: "CPU:" }), _jsxs("div", { className: "status-value", children: [performanceData.cpuUsage, "%"] })] })] }), _jsx("div", { className: "status-center", children: _jsxs("div", { className: "status-item", children: [_jsx("div", { className: "status-label", children: "Performance:" }), _jsx(Badge, { variant: performanceData.fps >= 50 ? 'default' : performanceData.fps >= 30 ? 'secondary' : 'destructive', children: performanceData.fps >= 50 ? 'Good' : performanceData.fps >= 30 ? 'Medium' : 'Poor' })] }) }), _jsxs("div", { className: "status-right", children: [_jsxs("div", { className: "status-item", children: [_jsx("div", { className: "status-label", children: "Mode:" }), _jsx("div", { className: "status-value", children: state.performanceMode })] }), _jsxs("div", { className: "status-item", children: [_jsx("div", { className: "status-label", children: "Quality:" }), _jsx("div", { className: "status-value", children: state.renderingQuality })] })] })] })] }));
}
export function PerformanceMonitor({ isVisible, onClose }) {
    const [history, setHistory] = React.useState([]);
    React.useEffect(() => {
        if (!isVisible)
            return;
        const interval = setInterval(() => {
            // Simulate performance data collection
            const fps = 60 + Math.random() * 10 - 5; // 55-65 FPS
            const frameTime = 1000 / fps;
            setHistory(prev => {
                const newHistory = [...prev, { fps, frameTime, timestamp: Date.now() }];
                return newHistory.slice(-100); // Keep last 100 entries
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isVisible]);
    if (!isVisible)
        return null;
    const avgFps = history.length > 0 ? history.reduce((sum, h) => sum + h.fps, 0) / history.length : 0;
    const avgFrameTime = history.length > 0 ? history.reduce((sum, h) => sum + h.frameTime, 0) / history.length : 0;
    return (_jsxs("div", { className: "performance-monitor", children: [_jsxs("div", { className: "monitor-header", children: [_jsx("h3", { children: "Performance Monitor" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, children: _jsx(XCircle, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "monitor-content", children: [_jsxs("div", { className: "monitor-stats", children: [_jsxs("div", { className: "stat", children: [_jsx("div", { className: "stat-label", children: "Average FPS" }), _jsx("div", { className: "stat-value", children: avgFps.toFixed(1) })] }), _jsxs("div", { className: "stat", children: [_jsx("div", { className: "stat-label", children: "Average Frame Time" }), _jsxs("div", { className: "stat-value", children: [avgFrameTime.toFixed(1), "ms"] })] }), _jsxs("div", { className: "stat", children: [_jsx("div", { className: "stat-label", children: "Samples" }), _jsx("div", { className: "stat-value", children: history.length })] })] }), _jsxs("div", { className: "monitor-chart", children: [_jsx("div", { className: "chart-title", children: "FPS History" }), _jsx("div", { className: "chart-container", children: history.slice(-50).map((entry, index) => (_jsx("div", { className: "chart-bar", style: {
                                        height: `${(entry.fps / 70) * 100}%`,
                                        backgroundColor: entry.fps >= 50 ? '#10b981' : entry.fps >= 30 ? '#f59e0b' : '#ef4444'
                                    }, title: `FPS: ${entry.fps.toFixed(1)}` }, index))) })] })] })] }));
}
export function Console({ isVisible, onClose }) {
    const [logs, setLogs] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    React.useEffect(() => {
        if (!isVisible)
            return;
        // Simulate console logging
        const interval = setInterval(() => {
            const messages = [
                'Scene loaded successfully',
                'Material compiled',
                'Texture loaded',
                'Animation started',
                'Camera updated',
                'Light enabled',
                'Mesh rendered',
                'Physics calculated',
            ];
            const levels = ['info', 'info', 'info', 'warn', 'error'];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            const randomLevel = levels[Math.floor(Math.random() * levels.length)];
            setLogs(prev => {
                const newLogs = [...prev, {
                        level: randomLevel,
                        message: randomMessage,
                        timestamp: Date.now()
                    }];
                return newLogs.slice(-100); // Keep last 100 logs
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [isVisible]);
    if (!isVisible)
        return null;
    const filteredLogs = logs.filter(log => filter === 'all' || log.level === filter);
    const getLogIcon = (level) => {
        switch (level) {
            case 'error': return _jsx(XCircle, { className: "w-4 h-4 text-red-500" });
            case 'warn': return _jsx(AlertTriangle, { className: "w-4 h-4 text-yellow-500" });
            default: return _jsx(Info, { className: "w-4 h-4 text-blue-500" });
        }
    };
    const getLogClass = (level) => {
        switch (level) {
            case 'error': return 'log-error';
            case 'warn': return 'log-warn';
            default: return 'log-info';
        }
    };
    return (_jsxs("div", { className: "console-panel", children: [_jsxs("div", { className: "console-header", children: [_jsx("h3", { children: "Console" }), _jsxs("div", { className: "console-controls", children: [_jsxs("select", { value: filter, onChange: (e) => setFilter(e.target.value), className: "console-filter", title: "Filter logs by level", children: [_jsx("option", { value: "all", children: "All" }), _jsx("option", { value: "info", children: "Info" }), _jsx("option", { value: "warn", children: "Warnings" }), _jsx("option", { value: "error", children: "Errors" })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setLogs([]), children: "Clear" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, children: _jsx(XCircle, { className: "w-4 h-4" }) })] })] }), _jsx("div", { className: "console-content", children: _jsx("div", { className: "console-logs", children: filteredLogs.map((log, index) => (_jsxs("div", { className: `console-log ${getLogClass(log.level)}`, children: [_jsx("div", { className: "log-icon", children: getLogIcon(log.level) }), _jsxs("div", { className: "log-content", children: [_jsx("div", { className: "log-message", children: log.message }), _jsx("div", { className: "log-time", children: new Date(log.timestamp).toLocaleTimeString() })] })] }, index))) }) })] }));
}
