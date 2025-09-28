import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
const Minimap = ({ scene, camera, workspaces = [], selectedWorkspaceId, onWorkspaceSelect, onCameraMove }) => {
    const canvasRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);
    const [zoom, setZoom] = useState(1);
    const [objects, setObjects] = useState([]);
    const [sceneBounds, setSceneBounds] = useState({
        min: new BABYLON.Vector3(-50, -50, -50),
        max: new BABYLON.Vector3(50, 50, 50)
    });
    const [tourWaypoints, setTourWaypoints] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [tourName, setTourName] = useState('My Tour');
    const [selectedWaypoint, setSelectedWaypoint] = useState(null);
    // Add waypoint at current camera position
    const addWaypoint = (position) => {
        setTourWaypoints(prev => [...prev, position.clone()]);
    };
    // Remove selected waypoint
    const removeWaypoint = () => {
        if (selectedWaypoint !== null) {
            setTourWaypoints(tourWaypoints.filter((_, idx) => idx !== selectedWaypoint));
            setSelectedWaypoint(null);
        }
    };
    // Move camera to selected waypoint
    const goToWaypoint = (idx) => {
        if (tourWaypoints[idx]) {
            camera.position.copyFrom(tourWaypoints[idx]);
            if (onCameraMove)
                onCameraMove(tourWaypoints[idx]);
        }
    };
    // Play tour (simple sequential movement)
    const playTour = async () => {
        if (tourWaypoints.length === 0 || !camera)
            return;
        for (let i = 0; i < tourWaypoints.length; i++) {
            camera.position.copyFrom(tourWaypoints[i]);
            if (onCameraMove)
                onCameraMove(tourWaypoints[i]);
            await new Promise(res => setTimeout(res, 700));
        }
    };
    const startRecordingTour = () => {
        setTourWaypoints([]);
        setIsRecording(true);
    };
    const stopRecordingTour = () => setIsRecording(false);
    const clearTour = () => setTourWaypoints([]);
    // Canvas click handler
    const handleCanvasClick = (event) => {
        if (!canvasRef.current)
            return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const boundsWidth = sceneBounds.max.x - sceneBounds.min.x;
        const boundsHeight = sceneBounds.max.z - sceneBounds.min.z;
        const scaleX = (canvas.width - 20) / boundsWidth;
        const scaleZ = (canvas.height - 20) / boundsHeight;
        const scale = Math.min(scaleX, scaleZ) * zoom;
        const offsetX = (canvas.width - boundsWidth * scale) / 2;
        const offsetY = (canvas.height - boundsHeight * scale) / 2;
        const worldX = sceneBounds.min.x + (x - offsetX) / scale;
        const worldZ = sceneBounds.min.z + (y - offsetY) / scale;
        // Check if click is inside any workspace bounds
        for (const workspace of workspaces) {
            const b = workspace.bounds;
            if (worldX >= b.minLng && worldX <= b.maxLng && worldZ >= b.minLat && worldZ <= b.maxLat) {
                onWorkspaceSelect?.(workspace.id);
                return;
            }
        }
        // If no workspace selected, move camera
        if (onCameraMove) {
            const newPosition = new BABYLON.Vector3(worldX, camera.position.y, worldZ);
            onCameraMove(newPosition);
        }
        // If recording, add waypoint
        if (isRecording) {
            addWaypoint(new BABYLON.Vector3(worldX, camera.position.y, worldZ));
            return;
        }
    };
    return (_jsxs("div", { className: "minimap-container", children: [_jsxs("div", { className: "minimap-header", children: [_jsx("h3", { className: "minimap-title", children: "Minimap" }), _jsxs("div", { className: "minimap-controls", children: [_jsx("button", { className: "minimap-button", onClick: () => setZoom(Math.max(0.5, zoom - 0.2)), title: "Zoom Out", children: "-" }), _jsxs("span", { className: "minimap-button", children: [Math.round(zoom * 100), "%"] }), _jsx("button", { className: "minimap-button", onClick: () => setZoom(Math.min(3, zoom + 0.2)), title: "Zoom In", children: "+" }), _jsx("button", { className: `minimap-button ${isVisible ? 'minimap-button-hide' : 'minimap-button-show'}`, onClick: () => setIsVisible(!isVisible), children: isVisible ? 'Hide' : 'Show' })] })] }), isVisible && (_jsxs("div", { style: { position: 'relative' }, children: [_jsx("canvas", { ref: canvasRef, width: 200, height: 200, onClick: handleCanvasClick, style: {
                            border: '1px solid #475569',
                            borderRadius: '4px',
                            cursor: 'crosshair',
                            background: '#0f172a'
                        }, title: "Click to move camera" }), _jsxs("div", { style: {
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(15, 23, 42, 0.9)',
                            padding: '4px',
                            borderRadius: '4px',
                            fontSize: '10px'
                        }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }, children: [_jsx("div", { style: { width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' } }), _jsx("span", { children: "Camera" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }, children: [_jsx("div", { style: { width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' } }), _jsx("span", { children: "Objects" })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '4px' }, children: [_jsx("div", { style: { width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' } }), _jsx("span", { children: "Lights" })] })] })] })), _jsxs("div", { style: {
                    marginTop: '12px',
                    fontSize: '12px',
                    color: '#94a3b8'
                }, children: [_jsxs("div", { children: ["Objects: ", objects.filter(obj => obj.type !== 'camera').length] }), _jsxs("div", { children: ["Bounds: ", sceneBounds.min.x.toFixed(1), " to ", sceneBounds.max.x.toFixed(1)] })] }), _jsxs("div", { style: {
                    marginTop: '16px',
                    padding: '8px',
                    background: '#0f172a',
                    borderRadius: '6px',
                    color: '#f1f5f9'
                }, children: [_jsx("h4", { style: { marginBottom: '8px', fontSize: '14px' }, children: "Tour Composer" }), _jsxs("div", { style: { display: 'flex', gap: '8px', marginBottom: '8px' }, children: [_jsx("input", { type: "text", value: tourName, onChange: e => setTourName(e.target.value), style: { background: '#18181b', color: '#fff', borderRadius: '4px', border: '1px solid #334155', fontSize: '12px', padding: '2px 6px', width: '100px' }, placeholder: "Tour Name" }), _jsx("button", { onClick: () => addWaypoint(camera.position), disabled: isRecording, children: "Add Waypoint" }), _jsx("button", { onClick: startRecordingTour, disabled: isRecording, children: "Record" }), _jsx("button", { onClick: stopRecordingTour, disabled: !isRecording, children: "Stop" }), _jsx("button", { onClick: playTour, disabled: tourWaypoints.length === 0, children: "Play" }), _jsx("button", { onClick: clearTour, disabled: tourWaypoints.length === 0, children: "Clear" })] }), _jsxs("div", { children: [_jsxs("span", { children: ["Waypoints: ", tourWaypoints.length] }), _jsx("ul", { style: { maxHeight: '60px', overflowY: 'auto', margin: 0, padding: 0 }, children: tourWaypoints.map((wp, idx) => (_jsxs("li", { style: {
                                        background: selectedWaypoint === idx ? '#f43f5e' : 'transparent',
                                        color: selectedWaypoint === idx ? '#fff' : '#f1f5f9',
                                        padding: '2px 4px',
                                        borderRadius: '3px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        cursor: 'pointer'
                                    }, onClick: () => setSelectedWaypoint(idx), children: [_jsxs("span", { style: { fontFamily: 'monospace', fontSize: '11px' }, children: ["(", wp.x.toFixed(1), ", ", wp.z.toFixed(1), ")"] }), _jsx("button", { style: { fontSize: '10px', background: '#334155', color: '#fff', borderRadius: '2px', border: 'none', padding: '1px 4px', cursor: 'pointer' }, onClick: e => { e.stopPropagation(); goToWaypoint(idx); }, children: "Go" }), _jsx("button", { style: { fontSize: '10px', background: '#ef4444', color: '#fff', borderRadius: '2px', border: 'none', padding: '1px 4px', cursor: 'pointer' }, onClick: e => { e.stopPropagation(); setTourWaypoints(tourWaypoints.filter((_, i) => i !== idx)); if (selectedWaypoint === idx)
                                                setSelectedWaypoint(null); }, children: "Remove" })] }, idx))) })] })] })] }));
};
export default Minimap;
