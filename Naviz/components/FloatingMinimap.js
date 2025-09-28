import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { Map, Maximize2, Minimize2, Navigation, Camera as CameraIcon, EyeOff, Settings, Target, Home, CheckCircle } from 'lucide-react';
import { Scene, Vector3, Mesh, PBRMaterial, StandardMaterial, Color3, ArcRotateCamera, FreeCamera, UniversalCamera } from '@babylonjs/core';
const FloatingMinimap = ({ scene, isActive, onClose, onCameraChange, onWaypointAdd, onNavigationStart }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [settings, setSettings] = useState({
        size: 200,
        position: 'top-right',
        opacity: 0.8,
        showLabels: true,
        showGrid: true,
        cameraTracking: true,
        meshHighlighting: true
    });
    const [cameraPresets, setCameraPresets] = useState([]);
    const [waypoints, setWaypoints] = useState([]);
    const [selectedWaypoint, setSelectedWaypoint] = useState(null);
    const [isNavigationMode, setIsNavigationMode] = useState(false);
    const [currentCamera, setCurrentCamera] = useState(null);
    const minimapRef = useRef(null);
    const minimapSceneRef = useRef(null);
    const minimapCameraRef = useRef(null);
    const renderLoopRef = useRef(null);
    // Initialize minimap scene
    useEffect(() => {
        if (!scene || !isActive || !minimapRef.current)
            return;
        // Create minimap scene
        minimapSceneRef.current = new Scene(scene.getEngine());
        // Create orthographic camera for minimap
        minimapCameraRef.current = new ArcRotateCamera('minimap_camera', 0, Math.PI / 2, 50, Vector3.Zero(), minimapSceneRef.current);
        minimapCameraRef.current.mode = 0; // Camera.ORTHOGRAPHIC_CAMERA
        minimapCameraRef.current.orthoTop = 25;
        minimapCameraRef.current.orthoBottom = -25;
        minimapCameraRef.current.orthoLeft = -25;
        minimapCameraRef.current.orthoRight = 25;
        // Set up minimap rendering
        setupMinimapRendering();
        // Start render loop
        const renderLoop = () => {
            if (minimapSceneRef.current?.activeCamera) {
                minimapSceneRef.current.activeCamera = minimapCameraRef.current;
                minimapSceneRef.current.render();
            }
            renderLoopRef.current = requestAnimationFrame(renderLoop);
        };
        renderLoopRef.current = requestAnimationFrame(renderLoop);
        return () => {
            if (renderLoopRef.current) {
                cancelAnimationFrame(renderLoopRef.current);
            }
            if (minimapSceneRef.current) {
                minimapSceneRef.current.dispose();
            }
        };
    }, [scene, isActive]);
    const setupMinimapRendering = useCallback(() => {
        if (!minimapSceneRef.current || !minimapCameraRef.current || !scene)
            return;
        // Copy meshes to minimap scene
        scene.meshes.forEach(mesh => {
            if (mesh.name && !mesh.name.includes('ground') && mesh instanceof Mesh) {
                // Create simplified representation
                if (minimapSceneRef.current) {
                    const minimapMesh = Mesh.CreateBox(`minimap_${mesh.name}`, 1, minimapSceneRef.current);
                    // Position and scale based on original mesh
                    minimapMesh.position = mesh.position.clone();
                    minimapMesh.position.y += 10; // Offset above ground
                    const boundingInfo = mesh.getBoundingInfo();
                    const dimensions = boundingInfo.boundingBox.maximum.subtract(boundingInfo.boundingBox.minimum);
                    const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z);
                    minimapMesh.scaling = new Vector3(Math.max(0.5, dimensions.x / maxDim), Math.max(0.5, dimensions.y / maxDim), Math.max(0.5, dimensions.z / maxDim));
                    // Color based on mesh material
                    const material = new StandardMaterial(`minimap_mat_${mesh.name}`, minimapSceneRef.current);
                    if (mesh.material instanceof PBRMaterial) {
                        material.diffuseColor = mesh.material.albedoColor || new Color3(0.5, 0.5, 0.5);
                    }
                    else if (mesh.material instanceof StandardMaterial) {
                        material.diffuseColor = mesh.material.diffuseColor || new Color3(0.5, 0.5, 0.5);
                    }
                    else {
                        material.diffuseColor = new Color3(0.5, 0.5, 0.5);
                    }
                    minimapMesh.material = material;
                }
            }
        });
        // Add grid
        if (settings.showGrid) {
            createMinimapGrid();
        }
        // Add camera indicator
        createCameraIndicator();
    }, [scene, settings.showGrid]);
    const createMinimapGrid = useCallback(() => {
        if (!minimapSceneRef.current)
            return;
        const gridSize = 50;
        const gridDivisions = 10;
        for (let i = 0; i <= gridDivisions; i++) {
            const position = (i / gridDivisions - 0.5) * gridSize;
            // Horizontal lines
            const hLine = Mesh.CreatePlane(`grid_h_${i}`, gridSize / gridDivisions, minimapSceneRef.current);
            hLine.position = new Vector3(0, 10, position);
            hLine.rotation.x = Math.PI / 2;
            // Vertical lines
            const vLine = Mesh.CreatePlane(`grid_v_${i}`, gridSize / gridDivisions, minimapSceneRef.current);
            vLine.position = new Vector3(position, 10, 0);
            vLine.rotation.x = Math.PI / 2;
            // Style grid lines
            const gridMaterial = new StandardMaterial(`grid_mat_${i}`, minimapSceneRef.current);
            gridMaterial.diffuseColor = new Color3(0.3, 0.3, 0.3);
            gridMaterial.alpha = 0.5;
            hLine.material = gridMaterial;
            vLine.material = gridMaterial;
        }
    }, []);
    const createCameraIndicator = useCallback(() => {
        if (!minimapSceneRef.current)
            return;
        // Create camera indicator (pyramid shape)
        const cameraIndicator = Mesh.CreateCylinder('camera_indicator', 2, 0, 1, 6, 1, minimapSceneRef.current);
        cameraIndicator.position.y = 12;
        const indicatorMaterial = new StandardMaterial('camera_indicator_mat', minimapSceneRef.current);
        indicatorMaterial.diffuseColor = new Color3(1, 0, 0); // Red camera indicator
        cameraIndicator.material = indicatorMaterial;
    }, []);
    // Update minimap camera position based on main camera
    useEffect(() => {
        if (!settings.cameraTracking || !minimapCameraRef.current || !scene?.activeCamera)
            return;
        const updateMinimapCamera = () => {
            if (scene?.activeCamera && minimapCameraRef.current) {
                // Update minimap camera position to match main camera
                const mainCamera = scene.activeCamera;
                if (mainCamera instanceof ArcRotateCamera) {
                    minimapCameraRef.current.alpha = mainCamera.alpha;
                    minimapCameraRef.current.beta = mainCamera.beta;
                    minimapCameraRef.current.radius = mainCamera.radius;
                }
                else if (mainCamera instanceof FreeCamera || mainCamera instanceof UniversalCamera) {
                    // For free cameras, position minimap camera above the scene
                    minimapCameraRef.current.position = mainCamera.position.add(new Vector3(0, 50, 0));
                    minimapCameraRef.current.setTarget(Vector3.Zero());
                }
            }
        };
        const interval = setInterval(updateMinimapCamera, 100); // Update 10 times per second
        return () => clearInterval(interval);
    }, [settings.cameraTracking, scene]);
    // Generate default camera presets
    useEffect(() => {
        if (!scene)
            return;
        const boundingInfo = scene.getWorldExtends();
        const center = boundingInfo.min.add(boundingInfo.max).scale(0.5);
        const size = boundingInfo.max.subtract(boundingInfo.min);
        const maxDim = Math.max(size.x, size.y, size.z);
        const presets = [
            {
                id: 'overview',
                name: 'Overview',
                position: center.add(new Vector3(0, maxDim * 1.5, maxDim)),
                target: center,
                description: 'Full scene overview',
                icon: 'eye'
            },
            {
                id: 'front',
                name: 'Front View',
                position: center.add(new Vector3(0, 0, maxDim)),
                target: center,
                description: 'Front perspective',
                icon: 'camera'
            },
            {
                id: 'side',
                name: 'Side View',
                position: center.add(new Vector3(maxDim, 0, 0)),
                target: center,
                description: 'Side perspective',
                icon: 'rotate-cw'
            },
            {
                id: 'top',
                name: 'Top View',
                position: center.add(new Vector3(0, maxDim, 0)),
                target: center,
                description: 'Top-down view',
                icon: 'grid-3x3'
            }
        ];
        setCameraPresets(presets);
    }, [scene]);
    const applyCameraPreset = useCallback((preset) => {
        if (!scene?.activeCamera)
            return;
        const camera = scene.activeCamera;
        if (camera instanceof ArcRotateCamera) {
            camera.setTarget(preset.target);
            camera.setPosition(preset.position);
        }
        else if (camera instanceof FreeCamera) {
            camera.position = preset.position;
            camera.setTarget(preset.target);
        }
        if (onCameraChange) {
            onCameraChange(camera);
        }
    }, [scene, onCameraChange]);
    const addWaypoint = useCallback(() => {
        if (!scene?.activeCamera)
            return;
        const camera = scene.activeCamera;
        const position = camera instanceof ArcRotateCamera
            ? camera.position
            : camera.position;
        const waypoint = {
            id: `waypoint_${Date.now()}`,
            name: `Waypoint ${waypoints.length + 1}`,
            position: position.clone(),
            description: 'Custom waypoint',
            color: new Color3(Math.random(), Math.random(), Math.random()),
            visited: false
        };
        setWaypoints(prev => [...prev, waypoint]);
        if (onWaypointAdd) {
            onWaypointAdd(waypoint);
        }
    }, [scene, waypoints.length, onWaypointAdd]);
    const navigateToWaypoint = useCallback((waypoint) => {
        if (!scene?.activeCamera)
            return;
        setSelectedWaypoint(waypoint);
        setIsNavigationMode(true);
        // Mark as visited
        setWaypoints(prev => prev.map(w => w.id === waypoint.id ? { ...w, visited: true } : w));
        if (onNavigationStart) {
            onNavigationStart(waypoint.position);
        }
        // Smooth camera transition
        const camera = scene.activeCamera;
        if (camera instanceof ArcRotateCamera) {
            camera.setTarget(waypoint.position);
        }
        else if (camera instanceof FreeCamera) {
            camera.setTarget(waypoint.position);
        }
    }, [scene, onNavigationStart]);
    const resetCamera = useCallback(() => {
        if (!scene?.activeCamera)
            return;
        const camera = scene.activeCamera;
        if (camera instanceof ArcRotateCamera) {
            camera.alpha = 0;
            camera.beta = Math.PI / 2.5;
            camera.radius = 10;
            camera.setTarget(Vector3.Zero());
        }
        else if (camera instanceof FreeCamera) {
            camera.position = new Vector3(10, 5, 10);
            camera.setTarget(Vector3.Zero());
        }
        if (onCameraChange) {
            onCameraChange(camera);
        }
    }, [scene, onCameraChange]);
    const toggleMinimap = useCallback(() => {
        setIsMinimized(prev => !prev);
    }, []);
    const getPositionClasses = () => {
        const baseClasses = 'fixed z-50 transition-all duration-300';
        switch (settings.position) {
            case 'top-right':
                return `${baseClasses} top-4 right-4`;
            case 'top-left':
                return `${baseClasses} top-4 left-4`;
            case 'bottom-right':
                return `${baseClasses} bottom-4 right-4`;
            case 'bottom-left':
                return `${baseClasses} bottom-4 left-4`;
            default:
                return `${baseClasses} top-4 right-4`;
        }
    };
    if (!isActive)
        return null;
    return (_jsx("div", { className: getPositionClasses(), children: _jsxs(Card, { className: "bg-slate-900 border-slate-700 text-white shadow-xl", children: [_jsx(CardHeader, { className: "pb-2", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-sm", children: [_jsx(Map, { className: "w-4 h-4 text-cyan-400" }), "3D Minimap"] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { size: "sm", variant: "ghost", onClick: toggleMinimap, className: "text-xs", children: isMinimized ? _jsx(Maximize2, { className: "w-3 h-3" }) : _jsx(Minimize2, { className: "w-3 h-3" }) }), _jsx(Button, { size: "sm", variant: "ghost", onClick: onClose, children: _jsx(EyeOff, { className: "w-3 h-3" }) })] })] }) }), !isMinimized && (_jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "relative", children: [_jsx("canvas", { ref: minimapRef, width: settings.size, height: settings.size, className: "border border-slate-600 rounded bg-slate-800", style: { opacity: settings.opacity } }), _jsx("div", { className: "absolute inset-0 pointer-events-none", children: _jsx("div", { className: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full" }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs(Button, { size: "sm", variant: "outline", onClick: resetCamera, className: "text-xs", children: [_jsx(Home, { className: "w-3 h-3 mr-1" }), "Reset View"] }), _jsxs(Button, { size: "sm", variant: "outline", onClick: addWaypoint, className: "text-xs", children: [_jsx(Target, { className: "w-3 h-3 mr-1" }), "Add Waypoint"] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-medium", children: "Camera Presets" }), _jsx(Badge, { variant: "outline", className: "text-xs", children: cameraPresets.length })] }), _jsx(ScrollArea, { className: "h-20", children: _jsx("div", { className: "grid grid-cols-2 gap-1", children: cameraPresets.map((preset) => (_jsxs(Button, { size: "sm", variant: "ghost", onClick: () => applyCameraPreset(preset), className: "text-xs justify-start", children: [_jsx(CameraIcon, { className: "w-3 h-3 mr-1" }), preset.name] }, preset.id))) }) })] }), waypoints.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-medium", children: "Waypoints" }), _jsx(Badge, { variant: "outline", className: "text-xs", children: waypoints.length })] }), _jsx(ScrollArea, { className: "h-20", children: _jsx("div", { className: "space-y-1", children: waypoints.map((waypoint) => (_jsxs("div", { className: `flex items-center justify-between p-2 rounded text-xs cursor-pointer transition-colors ${selectedWaypoint?.id === waypoint.id
                                                ? 'bg-slate-700'
                                                : 'bg-slate-800 hover:bg-slate-700'}`, onClick: () => navigateToWaypoint(waypoint), children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full", style: {
                                                                backgroundColor: `rgb(${waypoint.color.r * 255}, ${waypoint.color.g * 255}, ${waypoint.color.b * 255})`
                                                            } }), _jsx("span", { children: waypoint.name })] }), waypoint.visited && (_jsx(CheckCircle, { className: "w-3 h-3 text-green-500" }))] }, waypoint.id))) }) })] })), isNavigationMode && selectedWaypoint && (_jsxs(Alert, { className: "p-2", children: [_jsx(Navigation, { className: "w-4 h-4" }), _jsxs(AlertDescription, { className: "text-xs", children: ["Navigating to ", selectedWaypoint.name] })] })), _jsx("div", { className: "pt-2 border-t border-slate-700", children: _jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { children: "Settings" }), _jsx(Button, { size: "sm", variant: "ghost", className: "text-xs h-6", children: _jsx(Settings, { className: "w-3 h-3" }) })] }) })] }))] }) }));
};
export default FloatingMinimap;
