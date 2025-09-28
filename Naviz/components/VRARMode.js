import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Vector3, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
const VRARMode = ({ scene, isActive, xrManager }) => {
    const [xrStatus, setXrStatus] = useState({
        isInXR: false,
        mode: 'none',
        handTrackingActive: false,
        controllersConnected: 0,
        spatialAnchors: 0,
        performance: { fps: 0, frameTime: 0 }
    });
    const [showHandVisualization, setShowHandVisualization] = useState(true);
    const [showControllerVisualization, setShowControllerVisualization] = useState(true);
    const [teleportationEnabled, setTeleportationEnabled] = useState(true);
    // Real-time XR status updates
    useEffect(() => {
        if (!isActive || !xrManager)
            return;
        const updateXRStatus = () => {
            const status = {
                isInXR: xrManager.isInXR(),
                mode: 'none',
                handTrackingActive: xrManager.getHandTrackingData() !== null,
                controllersConnected: xrManager.getControllers().length,
                spatialAnchors: xrManager.getSpatialAnchors().length,
                performance: xrManager.getPerformanceMetrics()
            };
            // Determine mode
            if (status.isInXR) {
                // This is simplified - in real implementation, check XR session type
                status.mode = 'vr'; // or 'ar' based on session
            }
            setXrStatus(status);
        };
        // Update immediately
        updateXRStatus();
        // Set up real-time updates
        const interval = setInterval(updateXRStatus, 100); // 10 FPS updates
        return () => clearInterval(interval);
    }, [isActive, xrManager]);
    // Enter VR mode
    const enterVR = useCallback(async () => {
        if (!xrManager)
            return;
        try {
            const success = await xrManager.enterVR();
            if (success) {
                console.log('Entered VR mode');
            }
            else {
                console.error('Failed to enter VR mode');
            }
        }
        catch (error) {
            console.error('Error entering VR:', error);
        }
    }, [xrManager]);
    // Enter AR mode
    const enterAR = useCallback(async () => {
        if (!xrManager)
            return;
        try {
            const success = await xrManager.enterAR();
            if (success) {
                console.log('Entered AR mode');
            }
            else {
                console.error('Failed to enter AR mode');
            }
        }
        catch (error) {
            console.error('Error entering AR:', error);
        }
    }, [xrManager]);
    // Exit XR mode
    const exitXR = useCallback(async () => {
        if (!xrManager)
            return;
        try {
            await xrManager.exitXR();
            console.log('Exited XR mode');
        }
        catch (error) {
            console.error('Error exiting XR:', error);
        }
    }, [xrManager]);
    // Toggle teleportation
    const toggleTeleportation = useCallback(() => {
        if (!xrManager)
            return;
        const newState = !teleportationEnabled;
        setTeleportationEnabled(newState);
        xrManager.setTeleportationEnabled(newState);
    }, [xrManager, teleportationEnabled]);
    // Create hand visualization
    const createHandVisualization = useCallback(() => {
        if (!xrManager || !showHandVisualization)
            return;
        const handData = xrManager.getHandTrackingData();
        if (!handData)
            return;
        // Clear existing visualizations
        scene.meshes.forEach(mesh => {
            if (mesh.name.startsWith('handJoint_')) {
                mesh.dispose();
            }
        });
        // Create joint visualizations
        const createJointMesh = (position, name, color) => {
            const joint = MeshBuilder.CreateSphere(name, { diameter: 0.02 }, scene);
            joint.position = position;
            const material = new StandardMaterial(`${name}_mat`, scene);
            material.emissiveColor = color;
            joint.material = material;
            return joint;
        };
        // Left hand joints
        if (handData.left.isTracked) {
            handData.left.joints.forEach((position, jointName) => {
                createJointMesh(position, `handJoint_left_${jointName}`, new Color3(0, 1, 0));
            });
        }
        // Right hand joints
        if (handData.right.isTracked) {
            handData.right.joints.forEach((position, jointName) => {
                createJointMesh(position, `handJoint_right_${jointName}`, new Color3(0, 0, 1));
            });
        }
    }, [xrManager, scene, showHandVisualization]);
    // Create controller visualization
    const createControllerVisualization = useCallback(() => {
        if (!xrManager || !showControllerVisualization)
            return;
        const controllers = xrManager.getControllers();
        // Clear existing controller visualizations
        scene.meshes.forEach(mesh => {
            if (mesh.name.startsWith('controller_')) {
                mesh.dispose();
            }
        });
        // Create controller meshes
        controllers.forEach((controller, index) => {
            const controllerMesh = MeshBuilder.CreateBox(`controller_${index}`, { size: 0.1 }, scene);
            controllerMesh.position = controller.position || new Vector3(0, 1, 0);
            const material = new StandardMaterial(`controller_${index}_mat`, scene);
            material.emissiveColor = new Color3(1, 0.5, 0);
            controllerMesh.material = material;
        });
    }, [xrManager, scene, showControllerVisualization]);
    // Real-time visualization updates
    useEffect(() => {
        if (!isActive || !xrManager)
            return;
        const updateVisualizations = () => {
            createHandVisualization();
            createControllerVisualization();
        };
        updateVisualizations();
        const interval = setInterval(updateVisualizations, 50); // 20 FPS
        return () => clearInterval(interval);
    }, [isActive, xrManager, createHandVisualization, createControllerVisualization]);
    if (!isActive)
        return null;
    return (_jsxs("div", { className: "fixed top-4 right-4 bg-slate-800 p-4 rounded-lg border border-slate-600 text-white z-50 min-w-64", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "XR Mode" }), _jsx("div", { className: "mb-4 p-3 bg-slate-700 rounded", children: _jsxs("div", { className: "text-sm space-y-1", children: [_jsxs("div", { children: ["Status: ", _jsx("span", { className: xrStatus.isInXR ? 'text-green-400' : 'text-red-400', children: xrStatus.isInXR ? `${xrStatus.mode.toUpperCase()} Active` : 'Inactive' })] }), _jsxs("div", { children: ["Hand Tracking: ", _jsx("span", { className: xrStatus.handTrackingActive ? 'text-green-400' : 'text-gray-400', children: xrStatus.handTrackingActive ? 'Active' : 'Inactive' })] }), _jsxs("div", { children: ["Controllers: ", _jsx("span", { className: "text-blue-400", children: xrStatus.controllersConnected })] }), _jsxs("div", { children: ["Spatial Anchors: ", _jsx("span", { className: "text-purple-400", children: xrStatus.spatialAnchors })] }), _jsxs("div", { children: ["FPS: ", _jsx("span", { className: "text-yellow-400", children: xrStatus.performance.fps })] })] }) }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsx("button", { onClick: enterVR, disabled: xrStatus.isInXR, className: "w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm font-medium", children: "Enter VR" }), _jsx("button", { onClick: enterAR, disabled: xrStatus.isInXR, className: "w-full px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded text-sm font-medium", children: "Enter AR" }), _jsx("button", { onClick: exitXR, disabled: !xrStatus.isInXR, className: "w-full px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded text-sm font-medium", children: "Exit XR" })] }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "handVis", checked: showHandVisualization, onChange: (e) => setShowHandVisualization(e.target.checked) }), _jsx("label", { htmlFor: "handVis", className: "text-sm", children: "Hand Visualization" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "controllerVis", checked: showControllerVisualization, onChange: (e) => setShowControllerVisualization(e.target.checked) }), _jsx("label", { htmlFor: "controllerVis", className: "text-sm", children: "Controller Visualization" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "teleportation", checked: teleportationEnabled, onChange: toggleTeleportation }), _jsx("label", { htmlFor: "teleportation", className: "text-sm", children: "Teleportation" })] })] }), _jsxs("div", { className: "text-xs text-slate-400", children: ["Frame Time: ", xrStatus.performance.frameTime.toFixed(2), "ms"] })] }));
};
export default VRARMode;
