import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useCallback } from 'react';
import { WorkspaceProvider, useWorkspace } from './core/WorkspaceContext';
import { BabylonSceneManager, useBabylonScene } from './core/BabylonSceneManager';
import { FeatureManager, useFeatureManager } from './core/FeatureManager';
import './BabylonWorkspace.css';
// Main workspace component that uses the refactored architecture
function RefactoredBabylonWorkspaceContent({ workspaceId, isAdmin = false, layoutMode = 'standard', performanceMode = 'medium', enablePhysics = false, enableXR = false, enableSpatialAudio = false, renderingQuality = 'high', onMeshSelect, onAnimationCreate, onMaterialChange }) {
    const canvasRef = useRef(null);
    const { state, dispatch } = useWorkspace();
    const { isFeatureEnabled, handleFeatureToggle } = useFeatureManager();
    const { loadModel, createMaterial } = useBabylonScene();
    // Handle mesh selection
    const handleMeshSelect = useCallback((mesh) => {
        dispatch({ type: 'SET_SELECTED_MESH', payload: mesh });
        if (onMeshSelect) {
            onMeshSelect(mesh);
        }
    }, [dispatch, onMeshSelect]);
    // Handle scene ready callback
    const handleSceneReady = useCallback((scene, engine, camera) => {
        dispatch({ type: 'SET_INITIALIZED', payload: true });
        console.log('Scene initialized successfully');
    }, [dispatch]);
    // Scene configuration based on props
    const sceneConfig = {
        enablePhysics,
        enablePostProcessing: renderingQuality !== 'low',
        enableSSAO: renderingQuality === 'high' || renderingQuality === 'ultra',
        enableShadows: renderingQuality !== 'low',
        shadowMapSize: renderingQuality === 'ultra' ? 4096 : 2048,
        enableOptimization: performanceMode !== 'low',
        targetFPS: performanceMode === 'low' ? 30 : performanceMode === 'medium' ? 45 : 60,
        physicsEngine: 'cannon'
    };
    // Handle feature toggles
    const handleFeatureToggleCallback = useCallback((featureId, enabled) => {
        handleFeatureToggle(featureId, enabled);
    }, [handleFeatureToggle]);
    return (_jsxs("div", { className: "babylon-workspace-container", children: [_jsx("canvas", { ref: canvasRef, className: "babylon-canvas", style: { width: '100%', height: '100%' } }), _jsx(BabylonSceneManager, { canvasRef: canvasRef, config: sceneConfig, onMeshSelect: handleMeshSelect, onSceneReady: handleSceneReady }), _jsx(FeatureManager, { onFeatureToggle: handleFeatureToggleCallback, children: _jsxs("div", { className: "workspace-ui", children: [_jsxs("div", { className: "workspace-status", children: [_jsxs("div", { className: "status-item", children: [_jsx("span", { children: "Status:" }), _jsx("span", { className: state.isInitialized ? 'text-green-500' : 'text-yellow-500', children: state.isInitialized ? 'Ready' : 'Initializing...' })] }), _jsxs("div", { className: "status-item", children: [_jsx("span", { children: "Loading:" }), _jsx("span", { className: state.isLoading ? 'text-yellow-500' : 'text-green-500', children: state.isLoading ? 'Yes' : 'No' })] }), state.error && (_jsxs("div", { className: "status-item error", children: [_jsx("span", { children: "Error:" }), _jsx("span", { className: "text-red-500", children: state.error })] }))] }), state.selectedMesh && (_jsxs("div", { className: "selected-mesh-info", children: [_jsxs("h3", { children: ["Selected: ", state.selectedMesh.name] }), _jsxs("p", { children: ["Position: ", state.selectedMesh.position.toString()] }), _jsxs("p", { children: ["Rotation: ", state.selectedMesh.rotation.toString()] }), _jsxs("p", { children: ["Scale: ", state.selectedMesh.scaling.toString()] })] })), _jsxs("div", { className: "feature-controls", children: [_jsx("h3", { children: "Features" }), _jsxs("div", { className: "feature-buttons", children: [_jsx("button", { onClick: () => handleFeatureToggleCallback('showMaterialEditor', !isFeatureEnabled('showMaterialEditor')), className: isFeatureEnabled('showMaterialEditor') ? 'active' : '', children: "Material Editor" }), _jsx("button", { onClick: () => handleFeatureToggleCallback('showMinimap', !isFeatureEnabled('showMinimap')), className: isFeatureEnabled('showMinimap') ? 'active' : '', children: "Minimap" }), _jsx("button", { onClick: () => handleFeatureToggleCallback('showMeasurementTool', !isFeatureEnabled('showMeasurementTool')), className: isFeatureEnabled('showMeasurementTool') ? 'active' : '', children: "Measure Tool" })] })] })] }) })] }));
}
// Main exported component with provider
export function RefactoredBabylonWorkspace(props) {
    return (_jsx(WorkspaceProvider, { children: _jsx(RefactoredBabylonWorkspaceContent, { ...props }) }));
}
export default RefactoredBabylonWorkspace;
