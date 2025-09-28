import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useCallback, useRef } from "react";
import './BabylonWorkspace.css';
// Babylon.js imports
import { Engine, Scene, ArcRotateCamera, HemisphericLight, DirectionalLight, Vector3, Color3, Mesh, StandardMaterial } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ';
// UI Components
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
// Extracted Feature Components
import { CameraControls } from './features/CameraControlsFinal';
import { LightingControls } from './features/LightingControlsFinal';
import { PhysicsControls } from './features/PhysicsControlsFixed';
import { AnimationControls } from './features/AnimationControlsFixed';
// Core Components
import { WorkspaceContext } from './core/WorkspaceContextFixed';
import { FeatureManager } from './core/FeatureManager';
// UI Components
import { WorkspaceLayout } from './ui/WorkspaceLayout';
import { TopBar } from './ui/TopBar';
import { BottomPanel } from './ui/BottomPanel';
// Additional UI Components
import MaterialEditor from '../MaterialEditor';
import Minimap from '../Minimap';
import MeasureTool from '../MeasureTool';
import AutoFurnish from '../AutoFurnish';
import AICoDesigner from '../AICoDesigner';
import MoodScenePanel from '../MoodScenePanel';
import SeasonalDecorPanel from '../SeasonalDecorPanel';
import ARScalePanel from '../ARScalePanel';
import Annotations from '../Annotations';
import ScenarioPanel from '../ScenarioPanel';
import { AnimationTimeline } from '../AnimationTimeline';
import { AnalyticsManager } from '../AnalyticsManager';
// Additional Manager Components for Integration
import { AnimationManager } from '../AnimationManager';
import { SyncManager } from '../SyncManager';
import { MaterialManager } from '../MaterialManager';
import { AudioManager } from '../AudioManager';
import { XRManager } from '../XRManager';
import BIMIntegration from '../BIMIntegration';
// Device and Feature Enhancement Components
import { DeviceDetector } from '../DeviceDetector';
import { showToast } from '../utils/toast';
const ErrorBoundary = ({ children }) => {
    const [error, setError] = React.useState(null);
    const resetError = React.useCallback(() => {
        setError(null);
    }, []);
    React.useEffect(() => {
        const handleError = (event) => {
            setError(new Error(event.message));
        };
        const handleUnhandledRejection = (event) => {
            setError(new Error(`Unhandled promise rejection: ${event.reason}`));
        };
        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleUnhandledRejection);
        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        };
    }, []);
    if (error) {
        return (_jsxs("div", { "data-testid": "error-boundary", className: "error-boundary", children: [_jsxs("div", { children: ["Error: ", error.message] }), _jsx("button", { onClick: resetError, className: "error-boundary-btn", children: "Reset Error" })] }));
    }
    return _jsx(_Fragment, { children: children });
};
const RefactoredBabylonWorkspace = ({ workspaceId, isAdmin = false, layoutMode = 'standard', performanceMode = 'medium', enablePhysics = false, enableXR = false, enableSpatialAudio = false, renderingQuality = 'high', onMeshSelect, onAnimationCreate, onMaterialChange }) => {
    // Core state management
    const [workspaceState, setWorkspaceState] = useState({
        selectedMesh: null,
        leftPanelVisible: true,
        rightPanelVisible: true,
        bottomPanelVisible: true,
        moveActive: false,
        rotateActive: false,
        scaleActive: false,
        cameraActive: false,
        perspectiveActive: false,
        showFloatingToolbar: true,
        categoryPanelVisible: false,
        realTimeEnabled: false,
        cameraMode: 'orbit',
        gridVisible: true,
        wireframeEnabled: false,
        statsVisible: false,
        selectedWorkspaceId: workspaceId
    });
    // Feature state management
    const [featureStates, setFeatureStates] = useState({
        // Core Features
        showMaterialEditor: false,
        showMinimap: false,
        showMeasurementTool: false,
        showAutoFurnish: false,
        showAICoDesigner: false,
        showScanAnimal: false,
        showMoodScene: false,
        showSeasonalDecor: false,
        showARScale: false,
        showScenario: false,
        showAnnotations: false,
        showBIMIntegration: false,
        // Navigation & Controls
        showMovementControlChecker: false,
        showTeleportManager: false,
        showSwimMode: false,
        // Analysis & Simulation
        showMultiSensoryPreview: false,
        showNoiseSimulation: false,
        showPropertyInspector: false,
        showSceneBrowser: false,
        showSiteContextGenerator: false,
        showSmartAlternatives: false,
        showSoundPrivacySimulation: false,
        showSunlightAnalysis: false,
        showSustainabilityCompliancePanel: false,
        showWindTunnelSimulation: false,
        // Advanced Features
        showPathTracing: false,
        showPHashIntegration: false,
        showProgressiveLoader: false,
        showPresentationManager: false,
        showPresenterMode: false,
        showQuantumSimulationInterface: false,
        // Additional Simulations
        showWeather: false,
        showWind: false,
        showNoise: false,
        // AI Features
        showAIAdvisor: false,
        showVoiceAssistant: false,
        // Analysis Features
        showErgonomic: false,
        showEnergy: false,
        showCost: false,
        showBeforeAfter: false,
        showComparativeTour: false,
        showROICalculator: false,
        // Collaboration Features
        showMultiUser: false,
        showChat: false,
        showSharing: false,
        // Immersive Features
        showVR: false,
        showAR: false,
        showSpatialAudio: false,
        showHaptic: false,
        // Geo-Location Features
        showGeoLocation: false,
        showGeoWorkspaceArea: false,
        showGeoSync: false,
        // Specialized Components
        showCameraViews: false,
        showCirculationFlowSimulation: false,
        showCollabManager: false,
        showComprehensiveSimulation: false,
        showConstructionOverlay: false,
        showFloodSimulation: false,
        showShadowImpactAnalysis: false,
        showTrafficParkingSimulation: false
    });
    // Scene and engine refs
    const canvasRef = useRef(null);
    const engineRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    // Manager refs
    const featureManagerRef = useRef(null);
    const animationManagerRef = useRef(null);
    const syncManagerRef = useRef(null);
    const materialManagerRef = useRef(null);
    const audioManagerRef = useRef(null);
    const bimManagerRef = useRef(null);
    const iotManagerRef = useRef(null);
    const xrManagerRef = useRef(null);
    // AR refs
    const arCloudAnchorsRef = useRef(null);
    const cloudAnchorManagerRef = useRef(null);
    const gpsTransformUtilsRef = useRef(null);
    // Specialized component refs
    const cameraViewsRef = useRef(null);
    const circulationFlowSimulationRef = useRef(null);
    const collabManagerRef = useRef(null);
    const comprehensiveSimulationRef = useRef(null);
    const constructionOverlayRef = useRef(null);
    // State for UI
    const [searchTerm, setSearchTerm] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [fps, setFps] = useState(60);
    const [workspaces, setWorkspaces] = useState([]);
    // Initialize Babylon.js scene
    useEffect(() => {
        if (!canvasRef.current)
            return;
        try {
            // Create engine
            const engine = new Engine(canvasRef.current, true);
            engineRef.current = engine;
            // Create scene
            const scene = new Scene(engine);
            sceneRef.current = scene;
            // Create camera
            const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene);
            camera.attachControl(canvasRef.current, true);
            cameraRef.current = camera;
            // Create basic lighting
            const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
            light.intensity = 0.7;
            // Create ground plane
            const ground = Mesh.CreateGround("ground", 10, 10, 2, scene);
            const groundMaterial = new StandardMaterial("groundMaterial", scene);
            groundMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
            ground.material = groundMaterial;
            // Initialize managers
            const deviceDetector = DeviceDetector.getInstance();
            const capabilities = deviceDetector.detectCapabilities();
            const featureManager = new FeatureManager({});
            featureManagerRef.current = featureManager;
            const analyticsManager = new AnalyticsManager(engine, scene, featureManager);
            const materialManager = new MaterialManager(scene);
            materialManagerRef.current = materialManager;
            const userId = 'local-user';
            const syncManager = new SyncManager(null, scene, userId);
            const animationManager = new AnimationManager(scene, syncManager);
            animationManagerRef.current = animationManager;
            syncManagerRef.current = syncManager;
            if (enableSpatialAudio) {
                const audioManager = new AudioManager(scene);
                audioManagerRef.current = audioManager;
            }
            if (enableXR) {
                const xrManager = new XRManager(scene, camera);
                xrManagerRef.current = xrManager;
            }
            // Start render loop
            engine.runRenderLoop(() => {
                scene.render();
                if (audioManagerRef.current) {
                    // audioManagerRef.current.update();
                }
            });
            // Handle window resize
            const handleResize = () => engine.resize();
            window.addEventListener('resize', handleResize);
            setIsInitialized(true);
            // Cleanup
            return () => {
                window.removeEventListener('resize', handleResize);
                analyticsManager.dispose();
                animationManager.dispose();
                syncManager.dispose();
                if (cloudAnchorManagerRef.current) {
                    cloudAnchorManagerRef.current.dispose();
                }
                if (collabManagerRef.current) {
                    collabManagerRef.current.dispose();
                }
                scene.dispose();
                engine.dispose();
            };
        }
        catch (error) {
            console.error('Failed to initialize Babylon.js engine:', error);
            showToast.error('Failed to initialize 3D workspace. WebGL may not be supported.');
        }
    }, []);
    // Feature toggle handlers
    const toggleFeature = useCallback((featureId, enabled) => {
        setFeatureStates(prev => ({
            ...prev,
            [featureId]: enabled
        }));
    }, []);
    const enableFeature = useCallback((featureId) => {
        toggleFeature(featureId, true);
    }, [toggleFeature]);
    const disableFeature = useCallback((featureId) => {
        toggleFeature(featureId, false);
    }, [toggleFeature]);
    // Workspace state handlers
    const updateState = useCallback((updates) => {
        setWorkspaceState(prev => ({ ...prev, ...updates }));
    }, []);
    // Event handlers
    const handleMeshSelect = useCallback((mesh) => {
        updateState({ selectedMesh: mesh });
        if (onMeshSelect) {
            onMeshSelect(mesh);
        }
    }, [onMeshSelect, updateState]);
    const handleAnimationCreate = useCallback((animation) => {
        if (onAnimationCreate) {
            onAnimationCreate(animation);
        }
    }, [onAnimationCreate]);
    const handleMaterialChange = useCallback((material) => {
        if (onMaterialChange) {
            onMaterialChange(material);
        }
    }, [onMaterialChange]);
    // Camera handlers
    const handleCameraChange = useCallback((cameraType) => {
        updateState({ cameraMode: cameraType });
    }, [updateState]);
    const handlePositionChange = useCallback((position) => {
        if (cameraRef.current) {
            cameraRef.current.position = position;
        }
    }, []);
    const handleRotationChange = useCallback((rotation) => {
        if (cameraRef.current) {
            cameraRef.current.rotation = rotation;
        }
    }, []);
    const handleSettingsChange = useCallback((settings) => {
        // Handle camera settings changes
        console.log('Camera settings changed:', settings);
    }, []);
    // Lighting handlers
    const handleLightAdd = useCallback((lightType, position) => {
        if (!sceneRef.current)
            return;
        let light;
        switch (lightType) {
            case 'directional':
                light = new DirectionalLight('directionalLight', position, sceneRef.current);
                break;
            case 'point':
                light = new DirectionalLight('pointLight', position, sceneRef.current);
                break;
            case 'spot':
                light = new DirectionalLight('spotLight', position, sceneRef.current);
                break;
            case 'hemispheric':
                light = new HemisphericLight('hemisphericLight', position, sceneRef.current);
                break;
        }
        if (light) {
            sceneRef.current.addLight(light);
        }
    }, []);
    const handleLightRemove = useCallback((lightId) => {
        if (!sceneRef.current)
            return;
        const light = sceneRef.current.lights.find(l => l.name === lightId);
        if (light) {
            sceneRef.current.removeLight(light);
            light.dispose();
        }
    }, []);
    const handleLightUpdate = useCallback((lightId, properties) => {
        if (!sceneRef.current)
            return;
        const light = sceneRef.current.lights.find(l => l.name === lightId);
        if (light) {
            Object.assign(light, properties);
        }
    }, []);
    const handleEnvironmentChange = useCallback((environment) => {
        // Handle environment settings changes
        console.log('Environment changed:', environment);
    }, []);
    // Physics handlers
    const handlePhysicsCreate = useCallback((physicsType, targetId) => {
        // Handle physics creation
        console.log('Physics created:', physicsType, targetId);
    }, []);
    const handlePhysicsRemove = useCallback((physicsId) => {
        // Handle physics removal
        console.log('Physics removed:', physicsId);
    }, []);
    const handlePhysicsUpdate = useCallback((physicsId, properties) => {
        // Handle physics update
        console.log('Physics updated:', physicsId, properties);
    }, []);
    const handlePhysicsPlay = useCallback((physicsId) => {
        // Handle physics play
        console.log('Physics play:', physicsId);
    }, []);
    const handlePhysicsPause = useCallback((physicsId) => {
        // Handle physics pause
        console.log('Physics pause:', physicsId);
    }, []);
    const handlePhysicsStop = useCallback((physicsId) => {
        // Handle physics stop
        console.log('Physics stop:', physicsId);
    }, []);
    // Context value
    const contextValue = {
        state: {
            scene: sceneRef.current,
            engine: engineRef.current,
            camera: cameraRef.current,
            selectedMesh: workspaceState.selectedMesh,
            ...workspaceState
        },
        updateState,
        setSelectedMesh: (mesh) => updateState({ selectedMesh: mesh }),
        setLeftPanelVisible: (visible) => updateState({ leftPanelVisible: visible }),
        setRightPanelVisible: (visible) => updateState({ rightPanelVisible: visible }),
        setBottomPanelVisible: (visible) => updateState({ bottomPanelVisible: visible }),
        setMoveActive: (active) => updateState({ moveActive: active }),
        setRotateActive: (active) => updateState({ rotateActive: active }),
        setScaleActive: (active) => updateState({ scaleActive: active }),
        setCameraActive: (active) => updateState({ cameraActive: active }),
        setPerspectiveActive: (active) => updateState({ perspectiveActive: active }),
        setShowFloatingToolbar: (show) => updateState({ showFloatingToolbar: show }),
        setCategoryPanelVisible: (visible) => updateState({ categoryPanelVisible: visible }),
        setRealTimeEnabled: (enabled) => updateState({ realTimeEnabled: enabled }),
        setCameraMode: (mode) => updateState({ cameraMode: mode }),
        setGridVisible: (visible) => updateState({ gridVisible: visible }),
        setWireframeEnabled: (enabled) => updateState({ wireframeEnabled: enabled }),
        setStatsVisible: (visible) => updateState({ statsVisible: visible }),
        setSelectedWorkspaceId: (id) => updateState({ selectedWorkspaceId: id })
    };
    // Render feature panels
    const renderFeaturePanels = () => {
        const sceneManager = sceneRef.current ? { scene: sceneRef.current } : null;
        return (_jsxs(_Fragment, { children: [featureStates.showMaterialEditor && sceneManager && (_jsx(MaterialEditor, { sceneManager: sceneManager, onClose: () => disableFeature('showMaterialEditor'), onMaterialChange: handleMaterialChange })), featureStates.showMinimap && sceneRef.current && cameraRef.current && (_jsx(Minimap, { scene: sceneRef.current, camera: cameraRef.current, onCameraMove: () => { }, workspaces: workspaces, selectedWorkspaceId: workspaceState.selectedWorkspaceId, onWorkspaceSelect: (id) => updateState({ selectedWorkspaceId: id }) })), featureStates.showMeasurementTool && sceneRef.current && engineRef.current && (_jsx(MeasureTool, { scene: sceneRef.current, engine: engineRef.current, isActive: featureStates.showMeasurementTool, onMeasurementComplete: (measurement) => console.log('Measurement completed:', measurement) })), featureStates.showAutoFurnish && sceneManager && (_jsx(AutoFurnish, { sceneManager: sceneManager, onClose: () => disableFeature('showAutoFurnish') })), featureStates.showAICoDesigner && sceneManager && (_jsx(AICoDesigner, { sceneManager: sceneManager, onClose: () => disableFeature('showAICoDesigner') })), featureStates.showMoodScene && sceneManager && (_jsx(MoodScenePanel, { sceneManager: sceneManager, onClose: () => disableFeature('showMoodScene') })), featureStates.showSeasonalDecor && sceneManager && (_jsx(SeasonalDecorPanel, { sceneManager: sceneManager, onClose: () => disableFeature('showSeasonalDecor') })), featureStates.showARScale && sceneManager && (_jsx(ARScalePanel, { sceneManager: sceneManager, onClose: () => disableFeature('showARScale') })), featureStates.showScenario && sceneManager && (_jsx(ScenarioPanel, { sceneManager: sceneManager, onClose: () => disableFeature('showScenario') })), featureStates.showAnnotations && sceneManager && (_jsx(Annotations, { scene: sceneManager.scene, isActive: featureStates.showAnnotations })), featureStates.showBIMIntegration && sceneManager && (_jsx(BIMIntegration, { scene: sceneManager.scene, isActive: featureStates.showBIMIntegration, bimManager: bimManagerRef.current ?? undefined, onClose: () => disableFeature('showBIMIntegration') })), sceneRef.current && animationManagerRef.current && (_jsx(AnimationTimeline, { animationManager: animationManagerRef.current, selectedObject: workspaceState.selectedMesh, onSequenceCreate: handleAnimationCreate, onSequencePlay: (sequenceId) => {
                        if (animationManagerRef.current) {
                            animationManagerRef.current.playAnimation(sequenceId);
                        }
                    } })), _jsx("div", { className: "fixed top-4 right-4 z-50 space-y-2", children: workspaceState.rightPanelVisible && (_jsx("div", { className: "bg-gray-900 border border-gray-700 rounded-lg p-4 w-80", children: _jsxs(Tabs, { defaultValue: "camera", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [_jsx(TabsTrigger, { value: "camera", children: "Camera" }), _jsx(TabsTrigger, { value: "lighting", children: "Lighting" }), _jsx(TabsTrigger, { value: "physics", children: "Physics" }), _jsx(TabsTrigger, { value: "animation", children: "Animation" })] }), _jsx(TabsContent, { value: "camera", className: "mt-4", children: _jsx(CameraControls, { onCameraChange: handleCameraChange, onPositionChange: handlePositionChange, onRotationChange: handleRotationChange, onSettingsChange: handleSettingsChange }) }), _jsx(TabsContent, { value: "lighting", className: "mt-4", children: _jsx(LightingControls, { onLightAdd: handleLightAdd, onLightRemove: handleLightRemove, onLightUpdate: handleLightUpdate, onEnvironmentChange: handleEnvironmentChange }) }), _jsx(TabsContent, { value: "physics", className: "mt-4", children: _jsx(PhysicsControls, { onPhysicsCreate: handlePhysicsCreate, onPhysicsRemove: handlePhysicsRemove, onPhysicsUpdate: handlePhysicsUpdate, onPhysicsPlay: handlePhysicsPlay, onPhysicsPause: handlePhysicsPause, onPhysicsStop: handlePhysicsStop }) }), _jsx(TabsContent, { value: "animation", className: "mt-4", children: _jsx(AnimationControls, {}) })] }) })) })] }));
    };
    return (_jsx(ErrorBoundary, { children: _jsx(WorkspaceContext.Provider, { value: contextValue, children: _jsxs(WorkspaceLayout, { layoutMode: layoutMode, children: [_jsx(TopBar, { onSave: () => console.log('Save clicked'), onExport: () => console.log('Export clicked'), onImport: () => console.log('Import clicked'), onSettings: () => console.log('Settings clicked'), onPlay: () => console.log('Play clicked'), onPause: () => console.log('Pause clicked'), onReset: () => console.log('Reset clicked'), onFullscreen: () => console.log('Fullscreen clicked'), onMinimize: () => console.log('Minimize clicked'), onHelp: () => console.log('Help clicked'), onShare: () => console.log('Share clicked'), onChat: () => console.log('Chat clicked'), onCollaborate: () => console.log('Collaborate clicked') }), _jsxs("div", { className: "flex-1 relative", children: [_jsx("canvas", { ref: canvasRef, className: "w-full h-full babylon-canvas", role: "img", "aria-label": "Babylon.js 3D Canvas" }), renderFeaturePanels(), !isInitialized && (_jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center z-50", children: _jsx(Card, { className: "bg-black/80 text-white border-gray-600", children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx("div", { className: "animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { children: "Initializing 3D Workspace..." })] }) }) }))] }), workspaceState.bottomPanelVisible && (_jsx(BottomPanel, { onToggleStats: () => console.log('Toggle stats clicked'), onToggleConsole: () => console.log('Toggle console clicked'), onToggleTimeline: () => console.log('Toggle timeline clicked'), onExportStats: () => console.log('Export stats clicked'), onClearStats: () => console.log('Clear stats clicked') }))] }) }) }));
};
export default React.memo(RefactoredBabylonWorkspace);
