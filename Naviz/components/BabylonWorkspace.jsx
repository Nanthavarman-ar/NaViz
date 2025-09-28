import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useCallback, useRef, lazy } from "react";
import './BabylonWorkspace.css';
// Core Babylon.js imports only (minimal for initial load)
import { Engine, Scene, ArcRotateCamera, FreeCamera, UniversalCamera, HemisphericLight, Vector3, Color3, Mesh, StandardMaterial, DefaultRenderingPipeline, SSAORenderingPipeline, HighlightLayer, PBRMaterial } from '@babylonjs/core';
// Essential UI Components
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Grid3X3, Eye, BarChart3, Zap, Settings, Palette, Wrench, Mic, Camera, Hand, Droplets, Users, Lightbulb, Music, Wind, MapPin, Cpu, Volume2, Maximize } from 'lucide-react';
// Import proper hooks from hooks directory
import { useFeatureStates } from '../hooks/useFeatureStates';
import { useWorkspaceState } from '../hooks/useWorkspaceState';
import { useUIHandlers } from '../hooks/useUIHandlers';
// Lazy load heavy components
const LeftPanel = lazy(() => import('./LeftPanel'));
const RightPanel = lazy(() => import('./RightPanel'));
const TopBar = lazy(() => import('./TopBar'));
const BottomPanel = lazy(() => import('./BottomPanel'));
const FloatingToolbar = lazy(() => import('./FloatingToolbar'));
const MaterialEditor = lazy(() => import('./MaterialEditor'));
const Minimap = lazy(() => import('./Minimap'));
const MeasureTool = lazy(() => import('./MeasureTool'));
const AutoFurnish = lazy(() => import('./AutoFurnish'));
const AICoDesigner = lazy(() => import('./AICoDesigner'));
const DragDropMaterialHandler = lazy(() => import('./DragDropMaterialHandler').then(module => ({ default: module.DragDropMaterialHandler })));
const BIMIntegration = lazy(() => import('./BIMIntegration'));
const EnergyDashboard = lazy(() => import('./EnergyDashboard'));
const GeoLocationContext = lazy(() => import('./GeoLocationContext'));
const CameraViews = lazy(() => import('./CameraViews'));
const CirculationFlowSimulation = lazy(() => import('./CirculationFlowSimulation'));
const ConstructionOverlay = lazy(() => import('./ConstructionOverlay'));
const FloodSimulation = lazy(() => import('./FloodSimulation'));
const ShadowImpactAnalysis = lazy(() => import('./ShadowImpactAnalysis'));
const TrafficParkingSimulation = lazy(() => import('./TrafficParkingSimulation'));
import { AnalyticsManager } from './AnalyticsManager';
import { FeatureManager } from './FeatureManager';
import { AnimationManager } from './AnimationManager';
import { SyncManager } from './SyncManager';
import { MaterialManager } from './MaterialManager';
import { AudioManager } from './AudioManager';
import { XRManager } from './XRManager';
import { DeviceDetector } from './DeviceDetector';
import { CollabManager } from './CollabManager';
import { IoTManager } from './IoTManager';
import { CloudAnchorManager } from './CloudAnchorManager';
// Lazy load additional components - using existing components
const FeatureButton = lazy(() => import('./FeatureButton').then(module => ({ default: module.FeatureButton })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const CategoryToggles = lazy(() => import('./CategoryToggles').then(module => ({ default: module.CategoryToggles })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const Panels = lazy(() => import('./Panels').then(module => ({ default: module.Panels })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
// Remove missing components - replace with placeholder components
const MoodScenePanel = lazy(() => import('./MoodScenePanel').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const SeasonalDecorPanel = lazy(() => import('./SeasonalDecorPanel').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const ARScalePanel = lazy(() => import('./ARScalePanel').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const ScenarioPanel = lazy(() => import('./ScenarioPanel').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const Annotations = lazy(() => import('./Annotations').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const PathTracing = lazy(() => import('./PathTracing').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const ComprehensiveSimulation = lazy(() => import('./ComprehensiveSimulation').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const FloatingMinimap = lazy(() => import('./FloatingMinimap').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const PrefabModulePreview = lazy(() => import('./PrefabModulePreview').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const TopographyGenerator = lazy(() => import('./TopographyGenerator').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const SoundPrivacySimulation = lazy(() => import('./SoundPrivacySimulation').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const WindTunnelSimulation = lazy(() => import('./WindTunnelSimulation').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const CostEstimator = lazy(() => import('./CostEstimator').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const VoiceChat = lazy(() => import('./VoiceChat').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const MultiUser = lazy(() => import('./MultiUser').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const GPSTransformUtils = lazy(() => import('./GPSTransformUtils').then(module => ({ default: module.default || (() => _jsx(_Fragment, {}) ) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const IoTIntegration = lazy(() => import('./IoTIntegration').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const LightingPresets = lazy(() => import('./LightingPresets').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const LightingMoodBoardsFixed = lazy(() => import('./LightingMoodBoardsFixed').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const HandTracking = lazy(() => import('./HandTracking').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const ARVRFoundation = lazy(() => import('./ARVRFoundation').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const FoodExpiryTracker = lazy(() => import('./FoodExpiryTracker').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const BabylonHealthChecker = lazy(() => import('./BabylonHealthChecker').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const AIStructuralAdvisor = lazy(() => import('./AIStructuralAdvisor').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
const AIVoiceAssistant = lazy(() => import('./AIVoiceAssistant').then(module => ({ default: module.default || (() => _jsx(_Fragment, {})) })).catch(() => ({ default: () => _jsx(_Fragment, {}) })));
// Icons (expanded for features)
// Utils
import { showToast } from './utils/toast';
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
const BabylonWorkspace = ({ workspaceId, isAdmin = false, layoutMode = 'standard', performanceMode = 'medium', enablePhysics = false, enableXR = false, enableSpatialAudio = false, renderingQuality = 'high', onMeshSelect, onAnimationCreate, onMaterialChange }) => {
    // UI-only local state
    const [searchTerm, setSearchTerm] = React.useState('');
    const [canvasError, setCanvasError] = React.useState(null);
    // Example initial values (replace with actual values from your logic)
    const initialFeatureStates = { /* ... */};
    const featuresByCategory = {
      'Core 3D Workspace': [
        { id: 'grid', name: 'Grid', icon: <Grid3X3 />, description: 'Toggle grid visibility', hotkey: 'G' },
        { id: 'wireframe', name: 'Wireframe', icon: <Eye />, description: 'Toggle wireframe mode', hotkey: 'W' },
        { id: 'stats', name: 'Stats', icon: <BarChart3 />, description: 'Toggle performance stats', hotkey: 'S' },
        { id: 'realTime', name: 'Real-Time', icon: <Zap />, description: 'Toggle real-time collaboration', hotkey: 'R' },
      ],
      'UI Panels and Controls': [
        { id: 'leftPanel', name: 'Left Panel', icon: <Settings />, description: 'Toggle left panel', hotkey: 'L' },
        { id: 'rightPanel', name: 'Right Panel', icon: <Settings />, description: 'Toggle right panel', hotkey: 'R' },
        { id: 'bottomPanel', name: 'Bottom Panel', icon: <Settings />, description: 'Toggle bottom panel', hotkey: 'B' },
        { id: 'floatingToolbar', name: 'Floating Toolbar', icon: <Settings />, description: 'Toggle floating toolbar', hotkey: 'T' },
      ],
      'AI and Automation': [
        { id: 'aiCoDesigner', name: 'AI Co-Designer', icon: <Palette />, description: 'AI design assistance', hotkey: 'A' },
        { id: 'aiStructuralAdvisor', name: 'AI Structural Advisor', icon: <Wrench />, description: 'AI structural advice', hotkey: 'S' },
        { id: 'aiVoiceAssistant', name: 'AI Voice Assistant', icon: <Mic />, description: 'Voice AI assistant', hotkey: 'V' },
      ],
      'AR/VR and Spatial': [
        { id: 'arMode', name: 'AR Mode', icon: <Camera />, description: 'Activate AR mode', hotkey: 'A' },
        { id: 'vrMode', name: 'VR Mode', icon: <Hand />, description: 'Activate VR mode', hotkey: 'V' },
        { id: 'handTracking', name: 'Hand Tracking', icon: <Hand />, description: 'Enable hand tracking', hotkey: 'H' },
      ],
      'Simulations and Analysis': [
        { id: 'floodSimulation', name: 'Flood Simulation', icon: <Droplets />, description: 'Run flood simulation', hotkey: 'F' },
        { id: 'energySimulation', name: 'Energy Simulation', icon: <Zap />, description: 'Run energy analysis', hotkey: 'E' },
        { id: 'trafficSimulation', name: 'Traffic Simulation', icon: <Users />, description: 'Run traffic simulation', hotkey: 'T' },
        { id: 'sunlightAnalysis', name: 'Sunlight Analysis', icon: <Lightbulb />, description: 'Analyze sunlight', hotkey: 'S' },
        { id: 'noiseSimulation', name: 'Noise Simulation', icon: <Music />, description: 'Run noise simulation', hotkey: 'N' },
        { id: 'windSimulation', name: 'Wind Simulation', icon: <Wind />, description: 'Run wind simulation', hotkey: 'W' },
      ],
      'Tools and Editors': [
        { id: 'measureTool', name: 'Measure Tool', icon: <Wrench />, description: 'Activate measure tool', hotkey: 'M' },
        { id: 'materialEditor', name: 'Material Editor', icon: <Palette />, description: 'Open material editor', hotkey: 'M' },
        { id: 'bimIntegration', name: 'BIM Integration', icon: <Wrench />, description: 'Integrate BIM data', hotkey: 'B' },
        { id: 'costEstimator', name: 'Cost Estimator', icon: <BarChart3 />, description: 'Estimate costs', hotkey: 'C' },
      ],
      'Analytics and Monitoring': [
        { id: 'analyticsDashboard', name: 'Analytics Dashboard', icon: <BarChart3 />, description: 'View analytics', hotkey: 'A' },
        { id: 'healthChecker', name: 'Health Checker', icon: <Cpu />, description: 'Check system health', hotkey: 'H' },
      ],
      'Audio and Multimedia': [
        { id: 'spatialAudio', name: 'Spatial Audio', icon: <Volume2 />, description: 'Enable spatial audio', hotkey: 'A' },
        { id: 'voiceChat', name: 'Voice Chat', icon: <Mic />, description: 'Start voice chat', hotkey: 'V' },
      ],
      'Collaboration and Multi-User': [
        { id: 'collaboration', name: 'Collaboration', icon: <Users />, description: 'Enable collaboration', hotkey: 'C' },
        { id: 'multiUser', name: 'Multi-User', icon: <Users />, description: 'Multi-user mode', hotkey: 'M' },
      ],
      'Geo and Location': [
        { id: 'geoLocation', name: 'Geo Location', icon: <MapPin />, description: 'Enable geo location', hotkey: 'G' },
        { id: 'gpsTransform', name: 'GPS Transform', icon: <MapPin />, description: 'GPS transformations', hotkey: 'P' },
      ],
      'IoT and Smart Features': [
        { id: 'iotIntegration', name: 'IoT Integration', icon: <Cpu />, description: 'Integrate IoT devices', hotkey: 'I' },
        { id: 'foodTracker', name: 'Food Tracker', icon: <BarChart3 />, description: 'Track food expiry', hotkey: 'F' },
      ],
      'Lighting and Mood': [
        { id: 'lightingPresets', name: 'Lighting Presets', icon: <Lightbulb />, description: 'Apply lighting presets', hotkey: 'L' },
        { id: 'moodBoards', name: 'Mood Boards', icon: <Palette />, description: 'Use mood boards', hotkey: 'M' },
      ],
      'Other': [
        { id: 'floatingMinimap', name: 'Floating Minimap', icon: <MapPin />, description: 'Show floating minimap', hotkey: 'M' },
        { id: 'prefabPreview', name: 'Prefab Preview', icon: <Wrench />, description: 'Preview prefabs', hotkey: 'P' },
        { id: 'scenarioPanel', name: 'Scenario Panel', icon: <Settings />, description: 'Manage scenarios', hotkey: 'S' },
        { id: 'topographyGenerator', name: 'Topography Generator', icon: <MapPin />, description: 'Generate topography', hotkey: 'T' },
      ],
    };
    const initialWorkspaceId = "default";
    // Consolidated feature state and workspace state hooks
    const { featureStates, setFeatureStates, toggleFeature, setFeatureState, enableFeature, disableFeature, activeFeatures, featuresByCategory: rawFeaturesByCategory } = useFeatureStates(initialFeatureStates, featuresByCategory);
    // Workspace state hook
    const { updateState, selectedMesh, setSelectedMesh, selectedWorkspaceId, setSelectedWorkspaceId, realTimeEnabled, setRealTimeEnabled, cameraMode, setCameraMode, gridVisible, setGridVisible, wireframeEnabled, setWireframeEnabled, statsVisible, setStatsVisible, setPerformanceMode, animationManager, handleTourSequenceCreate, handleTourSequencePlay, leftPanelVisible, setLeftPanelVisible, rightPanelVisible, setRightPanelVisible, bottomPanelVisible, setBottomPanelVisible, showFloatingToolbar, setShowFloatingToolbar, moveActive, setMoveActive, rotateActive, setRotateActive, scaleActive, setScaleActive, cameraActive, setCameraActive, perspectiveActive, setPerspectiveActive, categoryPanelVisible, setCategoryPanelVisible } = useWorkspaceState(initialWorkspaceId);
    // UI Handlers hook
    const { handleWorkspaceSelect, handleRealTimeToggle, handleCameraModeChange, handleGridToggle, handleWireframeToggle, handleStatsToggle, handleCategoryPanelToggle, handleCategoryToggle, } = useUIHandlers();
    // Define workspaceState object to group relevant state variables for usage in render functions
    const workspaceState = {
        leftPanelVisible,
        rightPanelVisible,
        bottomPanelVisible,
        selectedMesh,
        moveActive,
        rotateActive,
        scaleActive,
        cameraActive,
        perspectiveActive,
        showFloatingToolbar
    };
    // Memoize feature categories array
    const featureCategoriesArrayMemo = React.useMemo(() => Object.keys(featuresByCategory), [featuresByCategory]);
    // Local state declarations
    const [deviceCapabilities, setDeviceCapabilities] = React.useState(null);
    const [simulationManagerRef, setSimulationManagerRef] = React.useState(null);
    const [currentModelId, setCurrentModelId] = React.useState('default-model');
    const [fps, setFps] = React.useState(60);
    const [workspaces, setWorkspaces] = React.useState([]);
    const [enablePostProcessing, setEnablePostProcessing] = React.useState(true);
    const [enableBloom, setEnableBloom] = React.useState(true);
    const [enableDepthOfField, setEnableDepthOfField] = React.useState(false);
    const [enableMotionBlur, setEnableMotionBlur] = React.useState(false);
    const [enableSSAO, setEnableSSAO] = React.useState(false);
    const [enableGrain, setEnableGrain] = React.useState(false);
    const [enableVignette, setEnableVignette] = React.useState(false);
    const [bloomIntensity, setBloomIntensity] = React.useState(1.0);
    const [depthOfFieldFocusDistance, setDepthOfFieldFocusDistance] = React.useState(10.0);
    const [motionBlurIntensity, setMotionBlurIntensity] = React.useState(1.0);
    const [ssaoIntensity, setSsaoIntensity] = React.useState(1.0);
    const [grainIntensity, setGrainIntensity] = React.useState(0.5);
    const [vignetteIntensity, setVignetteIntensity] = React.useState(0.5);
    // Initialize state
    const [isInitialized, setIsInitialized] = React.useState(false);
    // Local states for FloatingToolbar toggles
    const [isCameraActive, setIsCameraActive] = React.useState(true);
    const [isEyeActive, setIsEyeActive] = React.useState(false);
    const [isMuteActive, setIsMuteActive] = React.useState(false);
    const [isOrbitActive, setIsOrbitActive] = React.useState(true);
    const [isFlyActive, setIsFlyActive] = React.useState(false);
    const [isWalkActive, setIsWalkActive] = React.useState(false);
    const [isGridActive, setIsGridActive] = React.useState(false);
    const [isFloodActive, setIsFloodActive] = React.useState(false);
    const [isAICoDesignerActive, setIsAICoDesignerActive] = React.useState(false);
    // Material state
    const [materials, setMaterials] = React.useState([]);
    const [currentMaterial, setCurrentMaterial] = React.useState(null);

    // Refs
    const canvasRef = React.useRef(null);
    const fileInputRef = React.useRef(null);
    // Babylon.js refs
    const engineRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const pipelineRef = useRef(null);
    const ssaoPipelineRef = useRef(null);
    const highlightLayerRef = useRef(null);
    // AR managers and utils refs
    const arCloudAnchorsRef = useRef(null);
    const cloudAnchorManagerRef = useRef(null);
    const gpsTransformUtilsRef = useRef(null);
    // Analytics and Feature Managers refs
    const analyticsManagerRef = useRef(null);
    const featureManagerRef = useRef(null);
    const animationManagerRef = useRef(null);
    const syncManagerRef = useRef(null);
    const materialManagerRef = useRef(null);
    const audioManagerRef = useRef(null);
    const bimManagerRef = useRef(null);
    const iotManagerRef = useRef(null);
    const geoSyncManagerRef = useRef(null);
    // New specialized component refs
    const cameraViewsRef = useRef(null);
    const circulationFlowSimulationRef = useRef(null);
    const collabManagerRef = useRef(null);
    const comprehensiveSimulationRef = useRef(null);
    const constructionOverlayRef = useRef(null);
    // XR Manager ref
    const xrManagerRef = useRef(null);

    // Define missing handlers
const handleToggleRealTime = useCallback(() => {
    const newEnabled = !realTimeEnabled;
    setRealTimeEnabled(newEnabled);
    if (syncManagerRef.current) {
        if (newEnabled) {
            syncManagerRef.current.start();
            console.log('Real-time collaboration started');
        } else {
            syncManagerRef.current.stop();
            console.log('Real-time collaboration stopped');
        }
    }
}, [realTimeEnabled]);
    const handleToggleGrid = useCallback(() => {
        setGridVisible(!gridVisible);
    }, [gridVisible]);
    const handleToggleWireframe = useCallback(() => {
        setWireframeEnabled(!wireframeEnabled);
    }, [wireframeEnabled]);
    const handleToggleStats = useCallback(() => {
        setStatsVisible(!statsVisible);
    }, [statsVisible]);

    // Centralized feature toggle logic
    const handleFeatureToggle = useCallback((featureId, enabled) => {
        switch (featureId) {
            case 'grid':
                setGridVisible(enabled);
                if (sceneRef.current) {
                    // Toggle grid mesh visibility if exists
                    const gridMesh = sceneRef.current.getMeshByName('grid');
                    if (gridMesh) gridMesh.setEnabled(enabled);
                }
                break;
            case 'wireframe':
                setWireframeEnabled(enabled);
                if (sceneRef.current) {
                    sceneRef.current.meshes.forEach(mesh => {
                        if (mesh.material) mesh.material.wireframe = enabled;
                    });
                }
                break;
            case 'stats':
                setStatsVisible(enabled);
                if (enabled && engineRef.current) {
                    // Enable stats overlay if available
                    console.log('Stats enabled');
                }
                break;
            case 'realTime':
                handleToggleRealTime();
                break;
            case 'leftPanel':
                setLeftPanelVisible(enabled);
                break;
            case 'rightPanel':
                setRightPanelVisible(enabled);
                break;
            case 'bottomPanel':
                setBottomPanelVisible(enabled);
                break;
            case 'floatingToolbar':
                setShowFloatingToolbar(enabled);
                break;
            case 'aiCoDesigner':
                if (enabled) {
                    console.log('AI Co-Designer activated');
                    // Initialize AI if manager available
                } else {
                    console.log('AI Co-Designer deactivated');
                }
                break;
            case 'aiStructuralAdvisor':
                if (enabled) {
                    console.log('AI Structural Advisor activated');
                } else {
                    console.log('AI Structural Advisor deactivated');
                }
                break;
            case 'aiVoiceAssistant':
                if (enabled && audioManagerRef.current) {
                    audioManagerRef.current.enableVoiceAI();
                } else if (audioManagerRef.current) {
                    audioManagerRef.current.disableVoiceAI();
                }
                break;
            case 'arMode':
                if (enabled && xrManagerRef.current) {
                    xrManagerRef.current.startAR();
                } else if (xrManagerRef.current) {
                    xrManagerRef.current.stopAR();
                }
                break;
            case 'vrMode':
                if (enabled && xrManagerRef.current) {
                    xrManagerRef.current.startVR();
                } else if (xrManagerRef.current) {
                    xrManagerRef.current.stopVR();
                }
                break;
            case 'handTracking':
                if (enabled && xrManagerRef.current) {
                    xrManagerRef.current.enableHandTracking();
                } else if (xrManagerRef.current) {
                    xrManagerRef.current.disableHandTracking();
                }
                break;
            case 'floodSimulation':
                if (enabled && simulationManagerRef.current) {
                    simulationManagerRef.current.startFlood();
                } else if (simulationManagerRef.current) {
                    simulationManagerRef.current.stopFlood();
                }
                break;
            case 'energySimulation':
                if (enabled && bimManagerRef.current) {
                    bimManagerRef.current.runEnergyAnalysis();
                }
                break;
            case 'trafficSimulation':
                if (enabled && sceneRef.current) {
                    // Start traffic simulation logic
                    console.log('Traffic simulation started');
                }
                break;
            case 'sunlightAnalysis':
                if (enabled && sceneRef.current) {
                    // Run sunlight analysis
                    console.log('Sunlight analysis started');
                }
                break;
            case 'noiseSimulation':
                if (enabled && audioManagerRef.current) {
                    audioManagerRef.current.startNoiseSim();
                }
                break;
            case 'windSimulation':
                if (enabled && sceneRef.current) {
                    // Wind simulation
                    console.log('Wind simulation started');
                }
                break;
            case 'measureTool':
                if (enabled) {
                    // Activate measure tool
                    console.log('Measure tool activated');
                }
                break;
            case 'materialEditor':
                if (enabled) {
                    // Open material editor
                    console.log('Material editor opened');
                }
                break;
            case 'bimIntegration':
                if (enabled && bimManagerRef.current) {
                    bimManagerRef.current.loadBIMData();
                }
                break;
            case 'costEstimator':
                if (enabled) {
                    // Run cost estimation
                    console.log('Cost estimator activated');
                }
                break;
            case 'analyticsDashboard':
                if (enabled && analyticsManagerRef.current) {
                    analyticsManagerRef.current.showDashboard();
                }
                break;
            case 'healthChecker':
                if (enabled && featureManagerRef.current) {
                    featureManagerRef.current.runHealthCheck();
                }
                break;
            case 'spatialAudio':
                if (enabled && audioManagerRef.current) {
                    audioManagerRef.current.enableSpatial();
                } else if (audioManagerRef.current) {
                    audioManagerRef.current.disableSpatial();
                }
                break;
            case 'voiceChat':
                if (enabled && collabManagerRef.current) {
                    collabManagerRef.current.startVoiceChat();
                } else if (collabManagerRef.current) {
                    collabManagerRef.current.stopVoiceChat();
                }
                break;
            case 'collaboration':
                if (enabled && syncManagerRef.current) {
                    syncManagerRef.current.enableCollab();
                } else if (syncManagerRef.current) {
                    syncManagerRef.current.disableCollab();
                }
                break;
            case 'multiUser':
                if (enabled && collabManagerRef.current) {
                    collabManagerRef.current.enableMultiUser();
                }
                break;
            case 'geoLocation':
                if (enabled && geoSyncManagerRef.current) {
                    geoSyncManagerRef.current.enableGeo();
                }
                break;
            case 'gpsTransform':
                if (enabled && gpsTransformUtilsRef.current) {
                    gpsTransformUtilsRef.current.applyGPS();
                }
                break;
            case 'iotIntegration':
                if (enabled && iotManagerRef.current) {
                    iotManagerRef.current.connectDevices();
                }
                break;
            case 'foodTracker':
                if (enabled) {
                    console.log('Food tracker activated');
                }
                break;
            case 'lightingPresets':
                if (enabled && sceneRef.current) {
                    // Apply lighting preset
                    const light = sceneRef.current.getLightByName('light');
                    if (light) light.intensity = enabled ? 1.5 : 0.7;
                }
                break;
            case 'moodBoards':
                if (enabled) {
                    console.log('Mood boards activated');
                }
                break;
            case 'floatingMinimap':
                if (enabled) {
                    console.log('Floating minimap shown');
                }
                break;
            case 'prefabPreview':
                if (enabled) {
                    console.log('Prefab preview activated');
                }
                break;
            case 'scenarioPanel':
                if (enabled) {
                    console.log('Scenario panel opened');
                }
                break;
            case 'topographyGenerator':
                if (enabled && sceneRef.current) {
                    // Generate topography
                    console.log('Topography generated');
                }
                break;
            default:
                if (enabled) {
                    enableFeature(featureId);
                }
                else {
                    disableFeature(featureId);
                }
                break;
        }
        // Log toggle for debugging
        console.log(`Feature ${featureId} toggled to ${enabled}`);
    }, [setGridVisible, setWireframeEnabled, setStatsVisible, handleToggleRealTime, setLeftPanelVisible, setRightPanelVisible, setBottomPanelVisible, setShowFloatingToolbar, enableFeature, disableFeature, sceneRef, engineRef, xrManagerRef, simulationManagerRef, bimManagerRef, audioManagerRef, collabManagerRef, syncManagerRef, geoSyncManagerRef, gpsTransformUtilsRef, iotManagerRef, analyticsManagerRef, featureManagerRef]);

    // FloatingToolbar handlers
    const onCameraToggle = useCallback(() => {
        const newActive = !isCameraActive;
        setIsCameraActive(newActive);
        if (cameraRef.current && canvasRef.current) {
            cameraRef.current.attachControl(canvasRef.current, newActive);
        }
    }, [isCameraActive]);

    const onEyeToggle = useCallback(() => {
        const newActive = !isEyeActive;
        setIsEyeActive(newActive);
        setWireframeEnabled(newActive);
    }, [isEyeActive, wireframeEnabled]);

    const onMuteToggle = useCallback(() => {
        const newActive = !isMuteActive;
        setIsMuteActive(newActive);
        if (audioManagerRef.current) {
            audioManagerRef.current.mute(newActive);
        }
    }, [isMuteActive]);

    const onOrbitToggle = useCallback(() => {
        setCameraMode('orbit');
        setIsOrbitActive(true);
        setIsFlyActive(false);
        setIsWalkActive(false);
    }, []);

    const onFlyToggle = useCallback(() => {
        setCameraMode('fly');
        setIsOrbitActive(false);
        setIsFlyActive(true);
        setIsWalkActive(false);
    }, []);

    const onWalkToggle = useCallback(() => {
        setCameraMode('walk');
        setIsOrbitActive(false);
        setIsFlyActive(false);
        setIsWalkActive(true);
    }, []);

    const onGridToggle = useCallback(() => {
        const newActive = !isGridActive;
        setIsGridActive(newActive);
        handleFeatureToggle('grid', newActive);
    }, [isGridActive, handleFeatureToggle]);

    const onFloodToggle = useCallback(() => {
        const newActive = !isFloodActive;
        setIsFloodActive(newActive);
        handleFeatureToggle('floodSimulation', newActive);
    }, [isFloodActive, handleFeatureToggle]);

    const onAICoDesignerToggle = useCallback(() => {
        const newActive = !isAICoDesignerActive;
        setIsAICoDesignerActive(newActive);
        handleFeatureToggle('aiCoDesigner', newActive);
    }, [isAICoDesignerActive, handleFeatureToggle]);

    const switchCamera = useCallback((mode) => {
        if (!sceneRef.current || !canvasRef.current) return;
        if (cameraRef.current) {
            cameraRef.current.dispose();
        }
        let newCamera;
        const target = Vector3.Zero();
        if (mode === 'orbit') {
            newCamera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, target, sceneRef.current);
        } else if (mode === 'fly') {
            newCamera = new FreeCamera("camera", new Vector3(0, 5, -10), sceneRef.current);
            newCamera.speed = 0.5;
            newCamera.keysUp = [38];
            newCamera.keysDown = [40];
            newCamera.keysLeft = [37];
            newCamera.keysRight = [39];
        } else if (mode === 'walk') {
            newCamera = new UniversalCamera("camera", new Vector3(0, 1.6, -10), sceneRef.current);
            newCamera.speed = 0.5;
            newCamera.ellipsoid = new Vector3(1, 1, 1);
        }
        newCamera.attachControl(canvasRef.current, isCameraActive);
        cameraRef.current = newCamera;
    }, [isCameraActive]);
    // Create feature categories mapping
    // Use featuresByCategory from useFeatureStates hook for feature categories
    // ...existing code...
    // Initialize Babylon.js scene and managers
    useEffect(() => {
        if (!canvasRef.current)
            return;
        try {
            // Create engine
            const engine = new Engine(canvasRef.current, true);
            engineRef.current = engine;
            // Force initial resize to fit container
            engine.resize();
        }
        catch (error) {
            console.error('Failed to initialize Babylon.js engine:', error);
            showToast.error('Failed to initialize 3D workspace. WebGL may not be supported.');
            return;
        }
        // Create scene
        const scene = new Scene(engineRef.current);
        sceneRef.current = scene;
        // Create camera - use safe fallback for testing
        let cameraTarget;
        try {
            cameraTarget = Vector3.Zero();
        }
        catch (error) {
            // Fallback if Vector3.Zero() is not available
            cameraTarget = new Vector3(0, 0, 0);
        }
        const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, cameraTarget, scene);
        camera.attachControl(canvasRef.current, true);
        cameraRef.current = camera;
        // Create basic lighting
        const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
        light.intensity = 0.7;
        // Create a basic ground plane
        const ground = Mesh.CreateGround("ground", 10, 10, 2, scene);
        const groundMaterial = new StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
        ground.material = groundMaterial;
        // Force resize after scene setup
        engineRef.current.resize();
        // Set up post-processing pipeline
        if (enablePostProcessing) {
            const pipeline = new DefaultRenderingPipeline("defaultPipeline", true, scene, [camera]);
            // Configure bloom
            pipeline.bloomEnabled = enableBloom;
            if (enableBloom) {
                pipeline.bloomThreshold = 0.8;
                pipeline.bloomWeight = bloomIntensity;
                pipeline.bloomKernel = 64;
                pipeline.bloomScale = 0.5;
            }
            // Configure depth of field
            pipeline.depthOfFieldEnabled = enableDepthOfField;
            if (enableDepthOfField) {
                pipeline.depthOfField.focusDistance = depthOfFieldFocusDistance;
                pipeline.depthOfField.fStop = 1.4;
                pipeline.depthOfField.focalLength = 50;
            }
            // Note: Motion blur is not directly supported in DefaultRenderingPipeline
            // To implement motion blur, use MotionBlurPostProcess separately
            // pipeline.addEffect(new MotionBlurPostProcess("motionBlur", scene, 1.0, camera));
            // Configure grain
            pipeline.grainEnabled = enableGrain;
            if (enableGrain) {
                pipeline.grain.intensity = grainIntensity;
            }
            // Configure vignette
            pipeline.imageProcessing.vignetteEnabled = enableVignette;
            if (enableVignette) {
                pipeline.imageProcessing.vignetteWeight = vignetteIntensity;
            }
            pipelineRef.current = pipeline;
        }
        // Set up SSAO if enabled
        if (enableSSAO) {
            const ssao = new SSAORenderingPipeline("ssao", scene, 1.0);
            ssao.totalStrength = ssaoIntensity;
            ssao.base = 0.5;
            ssao.radius = 0.0001;
            ssao.area = 0.0075;
            ssao.fallOff = 0.000001;
            ssaoPipelineRef.current = ssao;
        }
        // Initialize HighlightLayer
        const highlightLayer = new HighlightLayer("highlightLayer", scene);
        highlightLayerRef.current = highlightLayer;
        // Detect device capabilities using DeviceDetector
        const deviceDetector = new DeviceDetector();
        const detectedCapabilities = deviceDetector.detectCapabilities();
        // Handle async device detection
        if (detectedCapabilities instanceof Promise) {
            detectedCapabilities.then(capabilities => {
                setDeviceCapabilities(capabilities);
                const featureManager = new FeatureManager(capabilities);
                featureManagerRef.current = featureManager;
            });
        }
        else {
            setDeviceCapabilities(detectedCapabilities);
            const featureManager = new FeatureManager(detectedCapabilities);
            featureManagerRef.current = featureManager;
        }
        // Create manager instances
        const analyticsManager = new AnalyticsManager(engineRef.current, scene, featureManagerRef.current);
        analyticsManagerRef.current = analyticsManager;
        // Create MaterialManager instance
        const materialManager = new MaterialManager(scene);
        materialManagerRef.current = materialManager;
        // Create SyncManager and AnimationManager instances
        const userId = 'local-user'; // This should be dynamically set based on auth/session
        const syncManager = new SyncManager(null, scene, userId);
        const animationManager = new AnimationManager(scene, syncManager);
        // Store refs
        animationManagerRef.current = animationManager;
        syncManagerRef.current = syncManager;
        // Create AudioManager instance if spatial audio is enabled
        if (enableSpatialAudio) {
            const audioManager = new AudioManager(scene);
            audioManagerRef.current = audioManager;
        }
        // Initialize CloudAnchorManager
        if (sceneRef.current) {
            const cloudAnchorManager = new CloudAnchorManager(sceneRef.current);
            cloudAnchorManagerRef.current = cloudAnchorManager;
            cloudAnchorManager.connect().then((success) => {
                if (success) {
                    console.log("CloudAnchorManager initialized successfully");
                }
                else {
                    console.error("CloudAnchorManager failed to initialize");
                }
            });
        }
        // Initialize CollabManager
        if (scene && featureManagerRef.current) {
            const collabManager = new CollabManager(scene, { userId: 'local-user' });
            collabManagerRef.current = collabManager;
            console.log("CollabManager initialized");
        }
        // Initialize IoTManager
        if (scene && featureManagerRef.current) {
            const iotManager = new IoTManager(scene, {});
            iotManagerRef.current = iotManager;
            console.log("IoTManager initialized");
        }
        // Initialize XRManager
        if (scene && cameraRef.current) {
            const xrManager = new XRManager(scene, cameraRef.current);
            xrManagerRef.current = xrManager;
            // Integrate XRManager with workspace
            xrManager.integrateWithBabylonWorkspace({
                registerXRManager: (xrMgr) => {
                    console.log('XRManager registered:', xrMgr);
                },
                addFeatureButton: (feature) => {
                    console.log('Feature button added:', feature);
                },
                updateXRState: (state) => {
                    // Handle XR state updates here
                    console.log('XR state updated:', state);
                }
            });
            console.log("XRManager initialized");
        }
        // Start render loop
        engineRef.current.runRenderLoop(() => {
            scene.render();
            // Update AudioManager if it exists
            if (audioManagerRef.current) {
                // audioManagerRef.current.update();
            }
            // Update XRManager state
            // if (xrManagerRef.current) {
            //   // Custom update logic if needed
            // }
        });
        // Handle window resize
        const handleResize = () => {
            if (engineRef.current && canvasRef.current) {
                engineRef.current.resize();
            }
        };
        window.addEventListener('resize', handleResize);
        // Force another resize after a short delay to ensure full fit
        setTimeout(() => {
            if (engineRef.current) {
                engineRef.current.resize();
            }
        }, 100);
        // Mark as initialized
        setIsInitialized(true);
        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (analyticsManager && typeof analyticsManager.dispose === 'function') {
                analyticsManager.dispose();
            }
            if (animationManager && typeof animationManager.dispose === 'function') {
                animationManager.dispose();
            }
            if (syncManager && typeof syncManager.dispose === 'function') {
                syncManager.dispose();
            }
            if (cloudAnchorManagerRef.current && typeof cloudAnchorManagerRef.current.dispose === 'function') {
                cloudAnchorManagerRef.current.dispose();
            }
            if (collabManagerRef.current && typeof collabManagerRef.current.dispose === 'function') {
                collabManagerRef.current.dispose();
            }
            // if (xrManagerRef.current && typeof xrManagerRef.current.dispose === 'function') {
            //   xrManagerRef.current.dispose();
            // }
            if (sceneRef.current) {
                sceneRef.current.dispose();
            }
            if (engineRef.current) {
                engineRef.current.dispose();
            }
        };
    }, []);
    // Dynamic resize observer for main workspace container
    useEffect(() => {
        if (!isInitialized || !engineRef.current) return;
        const mainWorkspaceDiv = canvasRef.current?.parentElement?.parentElement; // Navigate to mainWorkspace
        if (!mainWorkspaceDiv) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                    engineRef.current.resize();
                }
            }
        });
        resizeObserver.observe(mainWorkspaceDiv);
        return () => resizeObserver.disconnect();
    }, [isInitialized]);
    // Additional resize on initialization complete
    useEffect(() => {
        if (isInitialized && engineRef.current) {
            // Resize after panels and features load
            const timer = setTimeout(() => {
                engineRef.current.resize();
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [isInitialized]);
    // Handlers
    // ...existing code...
    // Handler for mesh selection
    // ...existing code...
    const handleMeshSelect = useCallback((mesh) => {
        updateState({ selectedMesh: mesh });
        if (onMeshSelect) {
            onMeshSelect(mesh);
        }
    }, [onMeshSelect, updateState]);
    // Material handlers
    const handleMaterialChange = (materialState) => {
        setMaterials(prev => {
            const index = prev.findIndex(m => m.id === materialState.id);
            if (index >= 0) {
                const newMaterials = [...prev];
                newMaterials[index] = materialState;
                return newMaterials;
            }
            else {
                return [...prev, materialState];
            }
        });
        setCurrentMaterial(materialState);
        if (onMaterialChange) {
            onMaterialChange(materialState);
        }
    };
    const handleMaterialApplied = useCallback((mesh, material) => {
        // Apply material to mesh
        mesh.material = material;
        // Update selected mesh if it's the same
        if (selectedMesh === mesh) {
            // setSelectedMesh is already available from workspaceState
            updateState({ selectedMesh: mesh });
        }
        // Call onMaterialChange if needed
        if (onMaterialChange) {
            // Safely access material properties with fallbacks
            const materialId = material.id || String(material.uniqueId) || `material_${Date.now()}`;
            const materialName = material.name || `Material ${materialId}`;
            onMaterialChange({
                id: materialId,
                name: materialName,
                type: material instanceof PBRMaterial ? 'pbr' : 'standard',
                properties: material,
                isActive: true,
                lastModified: Date.now()
            });
        }
    }, [selectedMesh, onMaterialChange, updateState]);

    // File upload handler
    const handleFileUpload = useCallback((e) => {
        console.log('Files selected:', e.target.files);
    }, []);
    // Render helpers
    const getFilteredFeatures = useCallback((features) => {
        if (!searchTerm)
            return features;
        return features.filter(f => f.name && f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);
    const renderFeatureButton = useCallback((feature, size = 'default') => (_jsx(FeatureButton, { feature: feature, active: activeFeatures.has(feature.id), onToggle: handleFeatureToggle, size: size })), [activeFeatures, handleFeatureToggle]);
    const renderCategoryToggles = useCallback(() => (_jsx(CategoryToggles, { featuresByCategory: featuresByCategory, categoryPanelVisible: categoryPanelVisible, handleCategoryToggle: handleCategoryToggle })), [featuresByCategory, categoryPanelVisible, handleCategoryToggle]);
    const renderCategoryPanels = useCallback(() => (_jsx(Panels, {})), []);
    // Render custom panels
    const renderCustomPanels = () => {
        const scene = sceneRef.current;
        const terrainMesh = scene ? scene.getMeshByName('ground') : null;
        return (
            <>
                {activeFeatures.has('floodSimulation') && <FloodSimulation scene={scene} terrainMesh={terrainMesh} onFloodLevelChange={() => {}} />}
                {activeFeatures.has('energySimulation') && <EnergyDashboard bimManager={bimManagerRef.current} simulationManager={simulationManagerRef.current} modelId={currentModelId} />}
                {activeFeatures.has('trafficSimulation') && <TrafficParkingSimulation scene={scene} />}
                {activeFeatures.has('sunlightAnalysis') && <ShadowImpactAnalysis scene={scene} />}
                {activeFeatures.has('noiseSimulation') && <SoundPrivacySimulation scene={scene} />}
                {activeFeatures.has('windSimulation') && <WindTunnelSimulation scene={scene} />}
                {activeFeatures.has('measureTool') && <MeasureTool scene={scene} />}
                {activeFeatures.has('materialEditor') && <MaterialEditor scene={scene} />}
                {activeFeatures.has('bimIntegration') && <BIMIntegration scene={scene} />}
                {activeFeatures.has('costEstimator') && <CostEstimator scene={scene} />}
                {activeFeatures.has('analyticsDashboard') && <AnalyticsDashboard scene={scene} />}
                {activeFeatures.has('healthChecker') && <BabylonHealthChecker scene={scene} />}
                {activeFeatures.has('spatialAudio') && <AudioManager scene={scene} />}
                {activeFeatures.has('voiceChat') && <VoiceChat scene={scene} />}
                {activeFeatures.has('collaboration') && <CollabManager scene={scene} />}
                {activeFeatures.has('multiUser') && <MultiUser scene={scene} />}
                {activeFeatures.has('geoLocation') && <GeoLocationContext scene={scene} />}
                {activeFeatures.has('gpsTransform') && <GPSTransformUtils scene={scene} />}
                {activeFeatures.has('iotIntegration') && <IoTIntegration scene={scene} />}
                {activeFeatures.has('foodTracker') && <FoodExpiryTracker scene={scene} />}
                {activeFeatures.has('lightingPresets') && <LightingPresets scene={scene} />}
                {activeFeatures.has('moodBoards') && <LightingMoodBoardsFixed scene={scene} />}
                {activeFeatures.has('floatingMinimap') && <FloatingMinimap scene={scene} />}
                {activeFeatures.has('prefabPreview') && <PrefabModulePreview scene={scene} />}
                {activeFeatures.has('scenarioPanel') && <ScenarioPanel scene={scene} />}
                {activeFeatures.has('topographyGenerator') && <TopographyGenerator scene={scene} />}
                {activeFeatures.has('aiCoDesigner') && <AICoDesigner scene={scene} />}
                {activeFeatures.has('aiStructuralAdvisor') && <AIStructuralAdvisor scene={scene} />}
                {activeFeatures.has('aiVoiceAssistant') && <AIVoiceAssistant scene={scene} />}
                {activeFeatures.has('arMode') && <ARScalePanel scene={scene} />}
                {activeFeatures.has('vrMode') && <ARVRFoundation scene={scene} />}
                {activeFeatures.has('handTracking') && <HandTracking scene={scene} />}
            </>
        );
    };
    // Render left panel using extracted component
    const renderLeftPanel = () => (_jsx(React.Suspense, { fallback: _jsx("div", { className: "p-4", children: "Loading Left Panel..." }), children: _jsx(LeftPanel, { featureCategories: featuresByCategory, categoryPanelVisible: categoryPanelVisible, searchTerm: searchTerm, activeFeatures: new Set(activeFeatures), currentLayoutMode: layoutMode === 'split' ? 'standard' : layoutMode, onCategoryToggle: handleCategoryPanelToggle, onSearchChange: setSearchTerm, onFeatureToggle: handleFeatureToggle, onClose: () => updateState({ leftPanelVisible: false }) }) }));
    // Render top bar with Enscape-like interface
    const renderTopBar = () => (_jsx(React.Suspense, { fallback: _jsx("div", { className: "p-2", children: "Loading Top Bar..." }), children: _jsx(TopBar, { isGenerating: false, generationProgress: 0, onToggleRealTime: handleToggleRealTime, realTimeEnabled: realTimeEnabled, fps: fps, activeFeatures: activeFeatures.size, cameraMode: cameraMode, onCameraModeChange: handleCameraModeChange, onToggleGrid: handleToggleGrid, gridVisible: gridVisible, onToggleWireframe: handleToggleWireframe, wireframeEnabled: wireframeEnabled, onToggleStats: handleToggleStats, statsVisible: statsVisible }) }));
    // Render right panel
    const renderRightPanel = () => (workspaceState.rightPanelVisible ? (_jsxs("div", { className: "w-80 border-l border-gray-700 bg-gray-900 text-white", children: [_jsxs("div", { className: "p-4 border-b border-gray-700 flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Inspector" }), _jsx(Button, { size: "sm", variant: "ghost", "aria-label": "Close Right Panel", onClick: () => updateState({ rightPanelVisible: false }), children: _jsx(Maximize, { className: "w-4 h-4" }) })] }), _jsxs(Tabs, { defaultValue: "properties", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsx(TabsTrigger, { value: "properties", children: "Properties" }), _jsx(TabsTrigger, { value: "materials", children: "Materials" }), _jsx(TabsTrigger, { value: "features", children: "Features" })] }), _jsx(TabsContent, { value: "properties", className: "p-4", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Object Properties" }) }), _jsx(CardContent, { children: workspaceState.selectedMesh ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("strong", { children: "Name:" }), " ", workspaceState.selectedMesh.name] }), _jsxs("div", { children: [_jsx("strong", { children: "Position:" }), " ", workspaceState.selectedMesh.position.toString()] }), _jsxs("div", { children: [_jsx("strong", { children: "Rotation:" }), " ", workspaceState.selectedMesh.rotation.toString()] }), _jsxs("div", { children: [_jsx("strong", { children: "Scale:" }), " ", workspaceState.selectedMesh.scaling.toString()] })] })) : (_jsx("p", { className: "text-muted-foreground", children: "No object selected" })) })] }) }), _jsx(TabsContent, { value: "features", className: "p-4", children: _jsx("div", { className: "text-muted-foreground", children: "Feature management is handled through the left panel." }) }), _jsx(TabsContent, { value: "energy", className: "p-4", children: bimManagerRef.current && (_jsx(EnergyDashboard, { bimManager: bimManagerRef.current, simulationManager: simulationManagerRef.current, modelId: String(currentModelId) })) })] })] })) : null);
    // Render bottom panel
    const renderBottomPanel = () => (workspaceState.bottomPanelVisible ? (_jsx(React.Suspense, { fallback: _jsx("div", { className: "p-2", children: "Loading Bottom Panel..." }), children: _jsx(BottomPanel, { activeFeatures: Array.from(activeFeatures), performanceMode: performanceMode, selectedMesh: selectedMesh, onFeatureToggle: (featureId) => handleFeatureToggle(featureId, true), onPerformanceModeChange: (mode) => setPerformanceMode(mode), featureStats: { total: 0, active: 0, byCategory: {}, byStatus: {} }, warnings: [], suggestions: [] }) })) : null);
    // Camera mode switch effect
    useEffect(() => {
        if (cameraMode) {
            switchCamera(cameraMode);
        }
    }, [cameraMode, switchCamera]);

    // Render floating toolbar
    const renderFloatingToolbar = () => {
        if (!workspaceState.showFloatingToolbar)
            return null;
        return (_jsx(React.Suspense, { fallback: _jsx("div", { className: "p-2", children: "Loading Toolbar..." }), children: _jsx("div", { className: "fixed top-24 left-6 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3", children: _jsx(FloatingToolbar, { onCameraToggle, onEyeToggle, onMuteToggle, onOrbitToggle, onFlyToggle, onWalkToggle, isCameraActive, isEyeActive, isMuteActive, isOrbitActive, isFlyActive, isWalkActive }) }) }));
    };

    // Render immersive mode bar
    const renderImmersiveBar = () => (
        _jsx("div", { className: "absolute top-4 left-1/2 transform -translate-x-1/2 z-20", children: _jsx(Card, { className: "bg-background", children: _jsxs(CardContent, { className: "p-2 flex items-center gap-2", children: [
            _jsx(Badge, { variant: "outline", children: activeFeatures.size }),
            _jsx(Separator, { orientation: "vertical", className: "h-6" }),
            _jsxs(DropdownMenu, { children: [
                _jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { size: "sm", variant: "ghost", "aria-label": "Feature Categories", children: "\uD83D\uDCC2" }) }),
                _jsx(DropdownMenuContent, { children: Object.keys(featuresByCategory).map(category => (
                    _jsx(DropdownMenuItem, { onClick: () => handleCategoryToggle(category), children: category.charAt(0).toUpperCase() + category.slice(1) }, category)
                )) })
            ] }),
            _jsx(Button, { size: "sm", variant: "ghost", onClick: () => updateState({ leftPanelVisible: !workspaceState.leftPanelVisible }), title: "Toggle Left Panel", children: "\uD83C\uDF9B\uFE0F" }),
            _jsx(Button, { size: "sm", variant: "ghost", onClick: () => updateState({ rightPanelVisible: !workspaceState.rightPanelVisible }), title: "Toggle Right Panel", children: "\u2699\uFE0F" }),
            _jsx(Button, { size: "sm", variant: "ghost", onClick: () => updateState({ leftPanelVisible: true, rightPanelVisible: true, bottomPanelVisible: true }), title: "Exit Immersive Mode", children: "\uD83D\uDD19" })
        ] }) }) })
    );

    // Render loading overlay
    const renderLoadingOverlay = () => !isInitialized && (
        _jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center z-50", children: _jsx(Card, { className: "bg-black/80 text-white border-gray-600", children: _jsxs(CardContent, { className: "p-6 text-center", children: [
            _jsx("div", { className: "animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" }),
            _jsx("p", { children: "Initializing 3D Workspace...." })
        ] }) }) })
    );

    // Render keyboard shortcuts
    const renderShortcuts = () => (
        _jsxs("div", { className: "fixed bottom-4 right-4 z-50", children: [
            _jsx(Button, { size: "sm", variant: "outline", className: "rounded-full w-8 h-8 p-0", title: "Keyboard Shortcuts", children: "?" }),
            _jsxs("div", { className: "absolute bottom-12 right-0 bg-gray-900 text-white p-2 rounded shadow-lg text-xs hidden", children: [
                _jsxs("div", { children: [ _jsx("kbd", { children: "Ctrl+1/2/3" }), " Layout modes" ] }),
                _jsxs("div", { children: [ _jsx("kbd", { children: "Ctrl+H/J/K" }), " Toggle panels" ] }),
                _jsxs("div", { children: [ _jsx("kbd", { children: "W/F/T/N" }), " Simulation features" ] }),
                _jsxs("div", { children: [ _jsx("kbd", { children: "A/U/C/V" }), " AI features" ] }),
                _jsxs("div", { children: [ _jsx("kbd", { children: "X/Z" }), " VR/AR modes" ] })
            ] })
        ] })
    );
    // Layout classes
    const layoutClasses = {
        container: 'flex h-screen bg-gray-800',
        leftPanel: 'flex flex-col w-72 border-r border-gray-700 bg-gray-900 text-white',
        mainWorkspace: 'flex-1 flex flex-col relative',
    };
    // Show error message if canvas is missing
    if (canvasError) {
        return (_jsx("div", { "data-testid": "canvas-error", className: "canvas-error", children: canvasError }));
    }

    return (_jsx(ErrorBoundary, { children: _jsxs("div", { className: layoutClasses.container, children: [
        workspaceState.leftPanelVisible && renderLeftPanel(),
        _jsxs("div", { className: layoutClasses.mainWorkspace, children: [
            layoutMode !== 'immersive' && renderTopBar(),
            _jsxs("div", { className: "flex-1 relative", children: [
                _jsx("canvas", { ref: canvasRef, className: "absolute top-0 left-0 w-full h-full babylon-canvas z-0", role: "img", "aria-label": "Babylon.js 3D Canvas" }),
                _jsx("div", { className: "relative z-10 h-full", children: renderCustomPanels() }),
                renderFloatingToolbar(),
                layoutMode === 'immersive' && renderImmersiveBar()
            ] }),
            layoutMode !== 'immersive' && workspaceState.bottomPanelVisible && renderBottomPanel()
        ] }),
        renderRightPanel(),
        _jsx("label", { htmlFor: "file-upload", className: "hidden", children: "File Upload" }),
        _jsx("input", { id: "file-upload", ref: fileInputRef, type: "file", multiple: true, accept: ".gltf,.glb,.obj,.fbx,.stl", className: "hidden", onChange: handleFileUpload }),
        renderLoadingOverlay(),
        renderShortcuts()
    ] }) }));
};
export default React.memo(BabylonWorkspace);
