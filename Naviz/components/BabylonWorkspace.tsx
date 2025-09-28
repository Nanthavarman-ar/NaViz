import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from "react";
import './BabylonWorkspace.css';

// Core Babylon.js imports only (minimal for initial load)
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color3, Color4, Mesh, StandardMaterial, DefaultRenderingPipeline, SSAORenderingPipeline, HighlightLayer, PBRMaterial, Material, PointerDragBehavior, PointerInfo, PickingInfo, Camera, PointerEventTypes, Space, ParticleSystem, MeshBuilder } from '@babylonjs/core';

// Essential UI Components
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Maximize } from 'lucide-react';

// Import proper hooks from hooks directory
import { useFeatureStates, UseFeatureStatesReturn } from '../hooks/useFeatureStates';
import { useWorkspaceState, WorkspaceState } from '../hooks/useWorkspaceState';
import { useUIHandlers } from '../hooks/useUIHandlers';

// Import extracted modules
import { useMeshSceneHandlers } from './BabylonWorkspace/meshSceneHandlers';
import { LeftPanelSegment, TopBarSegment, BottomPanelSegment, FloatingToolbarSegment, ImmersiveControls, renderLeftPanel, renderTopBar, renderRightPanel, renderBottomPanel, renderFloatingToolbar, renderCustomPanels } from './BabylonWorkspace/uiSegments';

// Interfaces
import * as AnimationInterfaces from './interfaces/AnimationInterfaces';
import * as MaterialInterfaces from './interfaces/MaterialInterfaces';
import type { GeoWorkspaceArea } from './types';
import { featureCategories } from '../config/featureCategories';

// Manager imports
import { AnalyticsManager } from './AnalyticsManager';
import { FeatureManager } from './FeatureManager';
import { AnimationManager } from './AnimationManager';
import { SyncManager } from './SyncManager';
import { MaterialManager } from './MaterialManager';
import { AudioManager } from './AudioManager';
import { BIMManager } from './BIMManager';
import { AIManager } from './AIManager';
import { IoTManager } from './IoTManager';
import { XRManager } from './XRManager';
import { DeviceDetector } from './DeviceDetector';
import { CloudAnchorManager } from './CloudAnchorManager';
import { CollabManager } from './CollabManager';

// UI Component imports
import FeatureButton from './FeatureButton';
import CategoryToggles from './CategoryToggles';

import ComprehensiveSimulation from './ComprehensiveSimulation';

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
const AnimationTimeline = lazy(() => import('./AnimationTimeline').then(module => ({ default: module.AnimationTimeline })));
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

// Utils
import { showToast } from './utils/toast';

// Interfaces
interface SceneConfig {
  enablePhysics?: boolean;
  enablePostProcessing?: boolean;
  enableSSAO?: boolean;
  enableShadows?: boolean;
  shadowMapSize?: number;
  enableOptimization?: boolean;
  targetFPS?: number;
  physicsEngine?: 'cannon' | 'ammo' | 'oimo';
}

interface BabylonWorkspaceProps {
  workspaceId: string;
  isAdmin?: boolean;
  layoutMode?: 'standard' | 'compact' | 'immersive' | 'split';
  performanceMode?: 'low' | 'medium' | 'high';
  enablePhysics?: boolean;
  enableXR?: boolean;
  enableSpatialAudio?: boolean;
  renderingQuality?: 'low' | 'medium' | 'high' | 'ultra';
  onMeshSelect?: (mesh: Mesh) => void;
  onAnimationCreate?: (animation: AnimationInterfaces.AnimationGroup) => void;
  onMaterialChange?: (material: MaterialInterfaces.MaterialState) => void;
}

const ErrorBoundary: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      showToast.error(event.message);
      setError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMsg = `Unhandled promise rejection: ${event.reason}`;
      showToast.error(errorMsg);
      setError(new Error(errorMsg));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (error) {
    return (
      <div data-testid="error-boundary" className="error-boundary">
        <div>Error: {error.message}</div>
        <button
          onClick={resetError}
          className="error-boundary-btn"
        >
          Reset Error
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

const BabylonWorkspace: React.FC<BabylonWorkspaceProps> = ({
  workspaceId,
  isAdmin = false,
  layoutMode = 'immersive',
  performanceMode = 'medium',
  enablePhysics = false,
  enableXR = false,
  enableSpatialAudio = false,
  renderingQuality = 'high',
  onMeshSelect,
  onAnimationCreate,
  onMaterialChange
}) => {
  // UI-only local state
  const [searchTerm, setSearchTerm] = React.useState('');
  const [canvasError, setCanvasError] = React.useState<string | null>(null);

  // Comprehensive initial feature states for all components
  const initialFeatureStates = {
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
    showMovementControlChecker: false,
    showTeleportManager: false,
    showSwimMode: false,
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
    showPathTracing: false,
    showPHashIntegration: false,
    showProgressiveLoader: false,
    showPresentationManager: false,
    showPresenterMode: false,
    showQuantumSimulationInterface: false,
    showWeather: false,
    showWind: false,
    showNoise: false,
    showAIAdvisor: false,
    showVoiceAssistant: false,
    showErgonomic: false,
    showEnergy: false,
    showCost: false,
    showBeforeAfter: false,
    showComparativeTour: false,
    showROICalculator: false,
    showMultiUser: false,
    showChat: false,
    showSharing: false,
    showVR: false,
    showAR: false,
    showSpatialAudio: false,
    showHaptic: false,
    showGeoLocation: false,
    showGeoWorkspaceArea: false,
    showGeoSync: false,
    showCameraViews: false,
    showCollabManager: false,
    showComprehensiveSimulation: false,
  };

  // Consolidated feature state and workspace state hooks
  const {
    featureStates,
    setFeatureStates,
    toggleFeature,
    setFeatureState,
    enableFeature,
    disableFeature,
    activeFeatures,
    featuresByCategory: rawFeaturesByCategory
  } = useFeatureStates(initialFeatureStates);

  // Workspace state hook
  const {
    updateState,
    selectedMesh,
    setSelectedMesh,
    selectedWorkspaceId,
    setSelectedWorkspaceId,
    realTimeEnabled,
    setRealTimeEnabled,
    cameraMode,
    setCameraMode,
    gridVisible,
    setGridVisible,
    wireframeEnabled,
    setWireframeEnabled,
    statsVisible,
    setStatsVisible,
    setPerformanceMode,
    animationManager,
    handleTourSequenceCreate,
    handleTourSequencePlay,
    leftPanelVisible,
    setLeftPanelVisible,
    rightPanelVisible,
    setRightPanelVisible,
    bottomPanelVisible,
    setBottomPanelVisible,
    showFloatingToolbar,
    setShowFloatingToolbar,
    moveActive,
    setMoveActive,
    rotateActive,
    setRotateActive,
    scaleActive,
    setScaleActive,
    cameraActive,
    setCameraActive,
    perspectiveActive,
    setPerspectiveActive,
    categoryPanelVisible,
    setCategoryPanelVisible
  } = useWorkspaceState(workspaceId);

  // UI Handlers hook
  const {
    handleWorkspaceSelect,
    handleRealTimeToggle,
    handleCameraModeChange,
    handleGridToggle,
    handleWireframeToggle,
    handleStatsToggle,
    handleCategoryPanelToggle,
  } = useUIHandlers();

  // Override handleCategoryToggle to also manage features
  const handleCategoryToggle = useCallback((category: string) => {
    const wasVisible = categoryPanelVisible[category];
    const isNowVisible = !wasVisible;

    // Toggle visibility
    setCategoryPanelVisible({
      ...categoryPanelVisible,
      [category]: isNowVisible
    });

    // Get features for this category
    const categoryFeatures = featureCategories[category] || [];
    const featureIds = categoryFeatures.map(f => f.id);

    if (isNowVisible) {
      // Enable all features in category
      featureIds.forEach(id => enableFeature(id));
      console.log(`Category ${category} enabled with features:`, featureIds);
    } else {
      // Disable all features in category
      featureIds.forEach(id => disableFeature(id));
      console.log(`Category ${category} disabled with features:`, featureIds);
    }
  }, [categoryPanelVisible, setCategoryPanelVisible, enableFeature, disableFeature]);

  // Define missing handlers
  const handleToggleRealTime = useCallback(() => {
    setRealTimeEnabled(!realTimeEnabled);
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
  const featureCategoriesArrayMemo = React.useMemo(() => Object.keys(rawFeaturesByCategory), [rawFeaturesByCategory]);

  // Local state declarations
  const [deviceCapabilities, setDeviceCapabilities] = React.useState<any>(null);
  const [simulationManagerRef, setSimulationManagerRef] = React.useState<any>(null);
  const [currentModelId, setCurrentModelId] = React.useState<string>('default-model');
  const [fps, setFps] = React.useState(60);
  const [workspaces, setWorkspaces] = React.useState<GeoWorkspaceArea[]>([]);
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

  // Animation state
  const [animationGroups, setAnimationGroups] = React.useState<AnimationInterfaces.AnimationGroup[]>([]);
  const [currentAnimation, setCurrentAnimation] = React.useState<AnimationInterfaces.AnimationGroup | null>(null);

  // Material state
  const [materials, setMaterials] = React.useState<MaterialInterfaces.MaterialState[]>([]);
  const [currentMaterial, setCurrentMaterial] = React.useState<MaterialInterfaces.MaterialState | null>(null);

  // Refs
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Babylon.js refs
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const pipelineRef = useRef<DefaultRenderingPipeline | null>(null);
  const ssaoPipelineRef = useRef<SSAORenderingPipeline | null>(null);
  const highlightLayerRef = useRef<HighlightLayer | null>(null);

  // Tool behaviors ref
  const moveBehaviorRef = useRef<PointerDragBehavior | null>(null);
  const rotateBehaviorRef = useRef<PointerDragBehavior | null>(null);
  const scaleBehaviorRef = useRef<PointerDragBehavior | null>(null);

  // AR managers and utils refs
  const arCloudAnchorsRef = useRef<any>(null);
  const cloudAnchorManagerRef = useRef<any>(null);
  const gpsTransformUtilsRef = useRef<any>(null);

  // Analytics and Feature Managers refs
  const analyticsManagerRef = useRef<AnalyticsManager | null>(null);
  const featureManagerRef = useRef<FeatureManager | null>(null);
  const animationManagerRef = useRef<AnimationManager | null>(null);
  const syncManagerRef = useRef<SyncManager | null>(null);
  const materialManagerRef = useRef<MaterialManager | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const bimManagerRef = useRef<BIMManager | null>(null);
  const iotManagerRef = useRef<IoTManager | null>(null);
  const geoSyncManagerRef = useRef<any>(null);

  // New specialized component refs
  const cameraViewsRef = useRef<any>(null);
  const circulationFlowSimulationRef = useRef<any>(null);
  const collabManagerRef = useRef<any>(null);
  const comprehensiveSimulationRef = useRef<any>(null);
  const constructionOverlayRef = useRef<any>(null);

  // XR Manager ref
  const xrManagerRef = useRef<XRManager | null>(null);

  // AI Manager ref
  const aiManagerRef = useRef<any>(null);

  // Mesh scene handlers hook
  const { handleMeshSelect } = useMeshSceneHandlers({
    sceneRef,
    cameraRef,
    selectedMesh,
    moveActive,
    rotateActive,
    scaleActive,
    cameraActive,
    perspectiveActive,
    moveBehaviorRef,
    rotateBehaviorRef,
    scaleBehaviorRef,
    highlightLayerRef,
    onMeshSelect,
    updateState
  });

  // Create feature categories mapping
  // Use featuresByCategory from useFeatureStates hook for feature categories
  // ...existing code...





  // Initialize Babylon.js scene and managers
  useEffect(() => {
    if (!canvasRef.current) return;

    let engine: Engine | null = null;
    let scene: Scene | null = null;
    let camera: ArcRotateCamera | null = null;
    let analyticsManager: AnalyticsManager | null = null;
    let materialManager: MaterialManager | null = null;
    let syncManager: SyncManager | null = null;
    let animationManager: AnimationManager | null = null;
    let audioManager: AudioManager | null = null;
    let bimManager: BIMManager | null = null;
    let aiManager: AIManager | null = null;
    let xrManager: XRManager | null = null;
    let collabManager: CollabManager | null = null;
    let iotManager: IoTManager | null = null;
    let cloudAnchorManager: CloudAnchorManager | null = null;

    const initializeScene = async () => {
      try {
        // Create engine with error handling
        engine = new Engine(canvasRef.current!, true);
        engineRef.current = engine;

        // Create scene
        scene = new Scene(engine);
        sceneRef.current = scene;

        // Create camera with safe fallback
        const cameraTarget = Vector3.Zero();
        camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, cameraTarget, scene);
        camera.attachControl(canvasRef.current!, true);
        cameraRef.current = camera;

        // Create basic lighting
        const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
        light.intensity = 0.7;

        // Create a basic ground plane
        const ground = Mesh.CreateGround("ground", 10, 10, 2, scene);
        const groundMaterial = new StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
        ground.material = groundMaterial;

        // Set up post-processing pipeline
        if (enablePostProcessing) {
          const pipeline = new DefaultRenderingPipeline("defaultPipeline", true, scene, [camera]);
          pipeline.bloomEnabled = enableBloom;
          if (enableBloom) {
            pipeline.bloomThreshold = 0.8;
            pipeline.bloomWeight = bloomIntensity;
            pipeline.bloomKernel = 64;
            pipeline.bloomScale = 0.5;
          }
          pipeline.depthOfFieldEnabled = enableDepthOfField;
          if (enableDepthOfField) {
            pipeline.depthOfField.focusDistance = depthOfFieldFocusDistance;
            pipeline.depthOfField.fStop = 1.4;
            pipeline.depthOfField.focalLength = 50;
          }
          pipeline.grainEnabled = enableGrain;
          if (enableGrain) {
            pipeline.grain.intensity = grainIntensity;
          }
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

        // Detect device capabilities
        const deviceDetector = new (DeviceDetector as any)();
        const detectedCapabilities = deviceDetector.detectCapabilities();

        let capabilities: any;
        if (detectedCapabilities instanceof Promise) {
          capabilities = await detectedCapabilities;
        } else {
          capabilities = detectedCapabilities;
        }
        setDeviceCapabilities(capabilities);

        // Initialize FeatureManager
        const featureManager = new FeatureManager(capabilities);
        featureManagerRef.current = featureManager;

        // Initialize managers with comprehensive error handling
        try {
          analyticsManager = new AnalyticsManager(engine, scene, featureManager);
          analyticsManagerRef.current = analyticsManager;
          console.log("AnalyticsManager initialized successfully");
        } catch (error) {
          console.error("Failed to initialize AnalyticsManager:", error);
          showToast.error("Analytics features unavailable");
        }

        try {
          materialManager = new MaterialManager(scene);
          materialManagerRef.current = materialManager;
          console.log("MaterialManager initialized successfully");
        } catch (error) {
          console.error("Failed to initialize MaterialManager:", error);
          showToast.error("Material features unavailable");
        }

        try {
          const userId = 'local-user';
          syncManager = new SyncManager(null, scene, userId);
          animationManager = new AnimationManager(scene, syncManager);
          animationManagerRef.current = animationManager;
          syncManagerRef.current = syncManager;
          console.log("Animation/SyncManager initialized successfully");
        } catch (error) {
          console.error("Failed to initialize Animation/SyncManager:", error);
          showToast.error("Animation features unavailable");
        }

        // Initialize AudioManager if spatial audio is enabled
        if (enableSpatialAudio) {
          try {
            audioManager = new AudioManager(scene);
            audioManagerRef.current = audioManager;
            console.log("AudioManager initialized successfully");
          } catch (error) {
            console.error("Failed to initialize AudioManager:", error);
            showToast.error("Audio features unavailable");
          }
        }

        // Initialize CloudAnchorManager
        try {
          cloudAnchorManager = new CloudAnchorManager(scene);
          cloudAnchorManagerRef.current = cloudAnchorManager;
          const success = await cloudAnchorManager.connect();
          if (success) {
            console.log("CloudAnchorManager initialized successfully");
            // Add event listeners for cloud anchor events
            cloudAnchorManager.addEventListener((event) => {
              switch (event.type) {
                case 'anchor_created':
                  showToast.success(`Cloud anchor "${event.data?.name || event.anchorId}" created`);
                  break;
                case 'anchor_deleted':
                  showToast.info(`Cloud anchor "${event.anchorId}" deleted`);
                  break;
                case 'anchor_updated':
                  console.log(`Cloud anchor "${event.anchorId}" updated`);
                  break;
                case 'sync_completed':
                  showToast.success("Cloud anchors synchronized");
                  break;
              }
            });
          } else {
            console.error("CloudAnchorManager failed to initialize");
            showToast.error("Cloud anchor features unavailable");
          }
        } catch (error) {
          console.error("Failed to initialize CloudAnchorManager:", error);
          showToast.error("Cloud anchor features unavailable");
        }

        // Initialize CollabManager
        try {
          collabManager = new CollabManager(scene, { userId: 'local-user' });
          collabManagerRef.current = collabManager;
          console.log("CollabManager initialized");
          // Add event listeners for collaboration events
          collabManager.addEventListener((event) => {
            switch (event.type) {
              case 'user_joined':
                showToast.success(`User "${event.data?.name || event.userId}" joined the session`);
                break;
              case 'user_left':
                showToast.info(`User "${event.userId}" left the session`);
                break;
              case 'user_moved':
                // Don't show toast for every movement, just log
                console.log(`User "${event.userId}" moved`);
                break;
              case 'object_created':
                showToast.success(`Object "${event.data?.name || event.objectId}" created`);
                break;
              case 'object_updated':
                console.log(`Object "${event.objectId}" updated`);
                break;
              case 'object_deleted':
                showToast.info(`Object "${event.objectId}" deleted`);
                break;
            }
          });
        } catch (error) {
          console.error("Failed to initialize CollabManager:", error);
          showToast.error("Collaboration features unavailable");
        }

        // Initialize IoTManager
        try {
          iotManager = new IoTManager(scene, {});
          iotManagerRef.current = iotManager;
          console.log("IoTManager initialized");
        } catch (error) {
          console.error("Failed to initialize IoTManager:", error);
          showToast.error("IoT features unavailable");
        }

        // Initialize BIMManager
        try {
          bimManager = new BIMManager(engine, scene);
          bimManagerRef.current = bimManager;
          // Load demo model on initialization
          await bimManager.loadDemoModel();
          console.log("BIMManager initialized with demo model");
        } catch (error) {
          console.error("Failed to initialize BIMManager:", error);
          showToast.error("BIM features unavailable");
        }

        // Initialize AIManager
        try {
          aiManager = new AIManager(scene, canvasRef.current!, handleFeatureToggle);
          aiManagerRef.current = aiManager;
          if (featureStates.showVoiceAssistant) {
            aiManager.startVoiceListening();
          }
          console.log("AIManager initialized");
        } catch (error) {
          console.error("Failed to initialize AIManager:", error);
          showToast.error("AI features unavailable");
        }

        // Initialize XRManager
        try {
          xrManager = new XRManager(scene);
          xrManagerRef.current = xrManager;
          console.log("XRManager initialized");
        } catch (error) {
          console.error("Failed to initialize XRManager:", error);
          showToast.error("XR features unavailable");
        }

        // Connect AudioManager to XRManager if both are available
        if (enableSpatialAudio && audioManager && xrManager) {
          xrManager.setAudioManager(audioManager);
        }

        // Initialize GeoLocation if enabled
        if (featureStates.showGeoLocation && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log("GeoLocation initialized:", position);
              if (camera) {
                camera.position = new Vector3(position.coords.longitude * 0.01, position.coords.latitude * 0.01, 10);
              }
            },
            (error) => {
              console.error("GeoLocation error:", error);
              showToast.error("Location services unavailable");
            }
          );
        }

        // Start render loop
        engine.runRenderLoop(() => {
          scene!.render();
          // Update managers that need per-frame updates
          if (audioManager && typeof audioManager.update === 'function') {
            audioManager.update();
          }
          if (xrManager && typeof xrManager.update === 'function') {
            xrManager.update();
          }
          if (collabManager && typeof collabManager.update === 'function') {
            collabManager.update();
          }
          if (iotManager && typeof iotManager.update === 'function') {
            iotManager.update();
          }
        });

        // Handle window resize
        const handleResize = () => {
          if (engine) {
            engine.resize();
          }
        };
        window.addEventListener('resize', handleResize);

        // Mark as initialized
        setIsInitialized(true);

        // Store cleanup function references
        return () => {
          window.removeEventListener('resize', handleResize);
        };

      } catch (error) {
        console.error('Failed to initialize Babylon.js scene:', error);
        showToast.error('Failed to initialize 3D workspace. WebGL may not be supported.');
        setCanvasError('Failed to initialize 3D workspace. WebGL may not be supported.');
      }
    };

    // Initialize and store cleanup
    const cleanupPromise = initializeScene();

    // Cleanup function
    return () => {
      cleanupPromise.then((cleanup) => {
        if (cleanup) cleanup();
      });

      // Dispose all managers and resources
      try {
        if (analyticsManager && typeof analyticsManager.dispose === 'function') {
          analyticsManager.dispose();
        }
        if (animationManager && typeof animationManager.dispose === 'function') {
          animationManager.dispose();
        }
        if (syncManager && typeof syncManager.dispose === 'function') {
          syncManager.dispose();
        }
        if (materialManager && typeof materialManager.dispose === 'function') {
          materialManager.dispose();
        }
        if (audioManager && typeof audioManager.dispose === 'function') {
          audioManager.dispose();
        }
        if (cloudAnchorManager && typeof cloudAnchorManager.dispose === 'function') {
          cloudAnchorManager.dispose();
        }
        if (collabManager && typeof collabManager.dispose === 'function') {
          collabManager.dispose();
        }
        if (iotManager && typeof iotManager.dispose === 'function') {
          iotManager.dispose();
        }
        if (bimManager && typeof bimManager.dispose === 'function') {
          bimManager.dispose();
        }
        if (aiManager && typeof aiManager.dispose === 'function') {
          aiManager.dispose();
        }
        if (xrManager && typeof xrManager.dispose === 'function') {
          xrManager.dispose();
        }
        if (scene) {
          scene.dispose();
        }
        if (engine) {
          engine.dispose();
        }
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    };
  }, [enablePostProcessing, enableBloom, enableDepthOfField, enableSSAO, enableGrain, enableVignette, enableSpatialAudio, featureStates.showVoiceAssistant, featureStates.showGeoLocation]);

  // Handlers
  // ...existing code...





  // Animation handlers
  const handleAnimationCreate = (sequence: any) => {
    // Convert AnimationSequence to AnimationGroup format if needed
    const animationGroup: AnimationInterfaces.AnimationGroup = {
      id: sequence.id,
      name: sequence.name,
      animations: [], // Will be populated by AnimationManager
      targetMeshes: [], // Will be populated by AnimationManager
      speedRatio: 1.0,
      weight: 1.0,
      isPlaying: false,
      isLooping: sequence.loop,
      from: 0,
      to: sequence.duration || 100
    };

    setAnimationGroups((prev: AnimationInterfaces.AnimationGroup[]) => [...prev, animationGroup]);
    setCurrentAnimation(animationGroup);
    if (onAnimationCreate) {
      onAnimationCreate(animationGroup);
    }
  };

  // Animation play handler for AnimationTimeline
  const handleSequencePlay = (sequenceId: string, options?: any) => {
    if (!animationManagerRef.current) return;
    animationManagerRef.current.playAnimation(sequenceId, options);
  };


  // Material handlers
  const handleMaterialChange = (materialState: MaterialInterfaces.MaterialState) => {
    setMaterials(prev => {
      const index = prev.findIndex(m => m.id === materialState.id);
      if (index >= 0) {
        const newMaterials = [...prev];
        newMaterials[index] = materialState;
        return newMaterials;
      } else {
        return [...prev, materialState];
      }
    });
    setCurrentMaterial(materialState);
    if (onMaterialChange) {
      onMaterialChange(materialState);
    }
  };

  const handleMaterialApplied = useCallback((mesh: Mesh, material: Material) => {
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
      const materialId = (material as any).id || String(material.uniqueId) || `material_${Date.now()}`;
      const materialName = (material as any).name || `Material ${materialId}`;

      onMaterialChange({
        id: String(materialId),
        name: String(materialName),
        type: material instanceof PBRMaterial ? 'pbr' : 'standard',
        properties: material,
        isActive: true,
        lastModified: Date.now()
      });
    }
  }, [selectedMesh, onMaterialChange, updateState]);






  // Centralized feature toggle logic
  const handleFeatureToggle = useCallback((featureId: string | number, enabled: boolean) => {
    const id = String(featureId);
    if (enabled) {
      enableFeature(id);
      // Call manager methods for specific features
      try {
        // BIM Features
        if (id === 'showBIMIntegration' && bimManagerRef.current) {
          try {
            bimManagerRef.current.toggleHiddenDetails();
            showToast.success('Hidden details toggled');
          } catch (error) {
            console.error('Error toggling hidden details:', error);
            showToast.error('Failed to toggle hidden details');
          }
          try {
            bimManagerRef.current.enableClashDetection();
            showToast.success('Clash detection enabled');
          } catch (error) {
            console.error('Error enabling clash detection:', error);
            showToast.error('Failed to enable clash detection');
          }
          try {
            bimManagerRef.current.loadDemoModel();
            showToast.success('Demo model loaded');
          } catch (error) {
            console.error('Error loading demo model:', error);
            showToast.error('Failed to load demo model');
          }
        }

        // AI Features
        if (id === 'showVoiceAssistant' && aiManagerRef.current) {
          try {
            aiManagerRef.current.startVoiceListening();
            showToast.success('Voice assistant started');
          } catch (error) {
            console.error('Error starting voice listening:', error);
            showToast.error('Failed to start voice assistant');
          }
        }
        if (id === 'showAICoDesigner' && aiManagerRef.current) {
          try {
            aiManagerRef.current.enableGestureDetection();
            showToast.success('AI co-designer enabled');
          } catch (error) {
            console.error('Error enabling gesture detection:', error);
            showToast.error('Failed to enable AI co-designer');
          }
        }

        // XR Features
        if (id === 'showVR' && xrManagerRef.current) {
          try {
            xrManagerRef.current.enterVR();
            showToast.success('VR mode enabled');
          } catch (error) {
            console.error('Error entering VR:', error);
            showToast.error('Failed to enter VR mode');
          }
        }
        if (id === 'showAR' && xrManagerRef.current) {
          try {
            xrManagerRef.current.enterAR();
            showToast.success('AR mode enabled');
          } catch (error) {
            console.error('Error entering AR:', error);
            showToast.error('Failed to enter AR mode');
          }
        }
        if (id === 'showSpatialAudio' && audioManagerRef.current) {
          try {
            audioManagerRef.current.enableSpatialAudio();
            showToast.success('Spatial audio enabled');
          } catch (error) {
            console.error('Error enabling spatial audio:', error);
            showToast.error('Failed to enable spatial audio');
          }
        }
        if (id === 'showHaptic' && xrManagerRef.current) {
          try {
            xrManagerRef.current.enableHapticFeedback();
            showToast.success('Haptic feedback enabled');
          } catch (error) {
            console.error('Error enabling haptic feedback:', error);
            showToast.error('Failed to enable haptic feedback');
          }
        }

        // Cost and Analysis Features
        if (id === 'showCost' && bimManagerRef.current) {
          try {
            const models = bimManagerRef.current.getAllModels();
            const modelId = models.length > 0 ? models[0].id : 'default-model';
            const result = bimManagerRef.current.getModelCostBreakdown(modelId);
            console.log('Cost breakdown:', result);
          } catch (error) {
            console.error('Error getting cost breakdown:', error);
            showToast.error('Failed to load cost analysis');
          }
        }
        if (id === 'showEnergy' && bimManagerRef.current) {
          try {
            const models = bimManagerRef.current.getAllModels();
            const modelId = models.length > 0 ? models[0].id : 'default-model';
            const result = bimManagerRef.current.getEnergyAnalysis(modelId);
            console.log('Energy analysis:', result);
          } catch (error) {
            console.error('Error getting energy analysis:', error);
            showToast.error('Failed to load energy analysis');
          }
        }

        // Simulation Features
        if (id === 'showFloodSimulation' && sceneRef.current) {
          try {
            // Create functional water mesh for flood simulation
            const water = Mesh.CreateGround('flood-water', 20, 20, 2, sceneRef.current);
            const waterMat = new StandardMaterial('flood-water-mat', sceneRef.current);
            waterMat.diffuseColor = new Color3(0.2, 0.4, 0.8);
            waterMat.alpha = 0.7;
            water.material = waterMat;
            water.position.y = -0.5;
          } catch (error) {
            console.error('Error creating flood simulation:', error);
            showToast.error('Failed to start flood simulation');
          }
        }
        if (id === 'showWindTunnelSimulation' && sceneRef.current) {
          try {
            const particleSystem = new ParticleSystem("windParticles", 2000, sceneRef.current);
            particleSystem.emitter = cameraRef.current ? cameraRef.current.position : Vector3.Zero();
            particleSystem.minEmitBox = new Vector3(-10, -10, -10);
            particleSystem.maxEmitBox = new Vector3(10, 10, 10);
            particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
            particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.5;
            particleSystem.minLifeTime = 0.3;
            particleSystem.maxLifeTime = 1.5;
            particleSystem.emitRate = 1500;
            particleSystem.direction1 = new Vector3(-7, 8, 3);
            particleSystem.direction2 = new Vector3(7, -8, -3);
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;
            particleSystem.minEmitPower = 1;
            particleSystem.maxEmitPower = 3;
            particleSystem.updateSpeed = 0.005;
            particleSystem.start();
            console.log('Wind tunnel simulation enabled with particles');
          } catch (error) {
            console.error('Error enabling wind tunnel simulation:', error);
            showToast.error('Failed to start wind tunnel simulation');
          }
        }
        if (id === 'showSunlightAnalysis' && sceneRef.current) {
          try {
            const light = sceneRef.current.getLightByName('light') as HemisphericLight;
            if (light) {
              light.intensity = 1.5;
              light.direction = new Vector3(1, 1, 0).normalize();
            }
            console.log('Sunlight analysis enabled with light adjustment');
          } catch (error) {
            console.error('Error enabling sunlight analysis:', error);
            showToast.error('Failed to start sunlight analysis');
          }
        }
        if (id === 'showNoiseSimulation' && sceneRef.current) {
          try {
            for (let i = 0; i < 10; i++) {
              const sphere = MeshBuilder.CreateSphere(`noise_${i}`, { diameter: 0.1 }, sceneRef.current);
              sphere.position = new Vector3(
                Math.random() * 10 - 5,
                Math.random() * 5,
                Math.random() * 10 - 5
              );
              const mat = new StandardMaterial(`noise_mat_${i}`, sceneRef.current);
              mat.diffuseColor = new Color3(Math.random(), Math.random(), Math.random());
              sphere.material = mat;
            }
            console.log('Noise simulation enabled with visualization spheres');
          } catch (error) {
            console.error('Error enabling noise simulation:', error);
            showToast.error('Failed to start noise simulation');
          }
        }

        // Navigation Features
        if (id === 'showTeleportManager' && cameraRef.current) {
          try {
            // Enable teleport navigation
            console.log('Teleport navigation enabled');
          } catch (error) {
            console.error('Error enabling teleport navigation:', error);
            showToast.error('Failed to enable teleport navigation');
          }
        }
        if (id === 'showSwimMode' && cameraRef.current) {
          try {
            // Enable swim mode
            console.log('Swim mode enabled');
          } catch (error) {
            console.error('Error enabling swim mode:', error);
            showToast.error('Failed to enable swim mode');
          }
        }

        // Geo Features
        if (id === 'showGeoLocation' && navigator.geolocation) {
          try {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                console.log('GeoLocation enabled:', position.coords);
                if (cameraRef.current) {
                  cameraRef.current.position.x = position.coords.longitude * 0.01;
                  cameraRef.current.position.z = position.coords.latitude * 0.01;
                }
              },
              (error) => {
                console.error('GeoLocation error:', error);
                showToast.error('Location services unavailable');
              }
            );
          } catch (error) {
            console.error('Error enabling geo location:', error);
            showToast.error('Failed to enable geo location');
          }
        }

        // Animation Features
        if (id === 'showAnimationTimeline' && animationManagerRef.current) {
          try {
            // Enable animation timeline
            console.log('Animation timeline enabled');
          } catch (error) {
            console.error('Error enabling animation timeline:', error);
            showToast.error('Failed to enable animation timeline');
          }
        }

        // Material Features
        if (id === 'showMaterialEditor' && materialManagerRef.current) {
          try {
            // Enable material editor
            console.log('Material editor enabled');
          } catch (error) {
            console.error('Error enabling material editor:', error);
            showToast.error('Failed to enable material editor');
          }
        }

        // Collaboration Features
        if (id === 'showMultiUser' && collabManagerRef.current) {
          try {
            collabManagerRef.current.connect();
          } catch (error) {
            console.error('Error connecting to multi-user:', error);
            showToast.error('Failed to connect to multi-user session');
          }
        }
        if (id === 'showCollabManager' && collabManagerRef.current) {
          try {
            collabManagerRef.current.enableSync();
          } catch (error) {
            console.error('Error enabling collaboration sync:', error);
            showToast.error('Failed to enable collaboration sync');
          }
        }

        // IoT Features
        if (id === 'showIoTManager' && iotManagerRef.current) {
          try {
            iotManagerRef.current.connect();
          } catch (error) {
            console.error('Error connecting IoT manager:', error);
            showToast.error('Failed to connect IoT manager');
          }
        }

        // Cloud Features
        if (id === 'showCloudAnchorManager' && cloudAnchorManagerRef.current) {
          try {
            cloudAnchorManagerRef.current.connect();
          } catch (error) {
            console.error('Error connecting cloud anchor manager:', error);
            showToast.error('Failed to connect cloud anchor manager');
          }
        }

        // Performance Features
        if (id === 'showProgressiveLoader') {
          try {
            // Enable progressive loading
            console.log('Progressive loader enabled');
          } catch (error) {
            console.error('Error enabling progressive loader:', error);
            showToast.error('Failed to enable progressive loader');
          }
        }

        // Advanced Features
        if (id === 'showPHashIntegration') {
          try {
            // Enable perceptual hashing
            console.log('PHash integration enabled');
          } catch (error) {
            console.error('Error enabling PHash integration:', error);
            showToast.error('Failed to enable PHash integration');
          }
        }
        if (id === 'showQuantumSimulationInterface') {
          try {
            // Enable quantum simulation
            console.log('Quantum simulation enabled');
          } catch (error) {
            console.error('Error enabling quantum simulation:', error);
            showToast.error('Failed to enable quantum simulation');
          }
        }

      } catch (error) {
        console.error(`Error enabling feature ${id}:`, error);
        showToast.error(`Failed to enable ${id}`);
        disableFeature(id); // Revert on error
      }
    } else {
      disableFeature(id);
      // Cleanup for specific features
      try {
        // AI Features
        if (id === 'showVoiceAssistant' && aiManagerRef.current) {
          aiManagerRef.current.stopVoiceListening();
        }
        if (id === 'showAICoDesigner' && aiManagerRef.current) {
          aiManagerRef.current.disableGestureDetection();
        }

        // XR Features
        if ((id === 'showVR' || id === 'showAR') && xrManagerRef.current) {
          xrManagerRef.current.exitXR();
        }
        if (id === 'showSpatialAudio' && audioManagerRef.current) {
          audioManagerRef.current.disableSpatialAudio();
        }
        if (id === 'showHaptic' && xrManagerRef.current) {
          xrManagerRef.current.disableHapticFeedback();
        }

        // Simulation Features
        if (id === 'showFloodSimulation' && sceneRef.current) {
          const water = sceneRef.current.getMeshByName('flood-water');
          if (water) water.dispose();
        }
        if (id === 'showWindTunnelSimulation' && sceneRef.current) {
          sceneRef.current.particleSystems.forEach((ps) => {
            if (ps.name === 'windParticles') {
              ps.stop();
              ps.dispose();
            }
          });
          console.log('Wind tunnel simulation disabled');
        }
        if (id === 'showSunlightAnalysis' && sceneRef.current) {
          const light = sceneRef.current.getLightByName('light') as HemisphericLight;
          if (light) {
            light.intensity = 0.7;
            light.direction = new Vector3(0, 1, 0);
          }
          console.log('Sunlight analysis disabled');
        }
        if (id === 'showNoiseSimulation' && sceneRef.current) {
          sceneRef.current.meshes.filter(m => m.name.startsWith('noise_')).forEach((m) => m.dispose());
          console.log('Noise simulation disabled');
        }

        // Collaboration Features
        if (id === 'showMultiUser' && collabManagerRef.current) {
          collabManagerRef.current.disconnect();
        }
        if (id === 'showCollabManager' && collabManagerRef.current) {
          collabManagerRef.current.disableSync();
        }

        // IoT Features
        if (id === 'showIoTManager' && iotManagerRef.current) {
          iotManagerRef.current.disconnect();
        }

        // Cloud Features
        if (id === 'showCloudAnchorManager' && cloudAnchorManagerRef.current) {
          cloudAnchorManagerRef.current.disconnect();
        }

      } catch (error) {
        console.error(`Error disabling feature ${id}:`, error);
      }
    }
  }, [enableFeature, disableFeature]);

interface Feature {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  enabled: boolean;
  hotkey?: string;
  description: string;
  performanceImpact?: number;
  dependencies?: string[];
  isEssential?: boolean;
}

// Render helpers
const getFilteredFeatures = useCallback((features: Feature[]) => {
  if (!searchTerm) return features;
  return features.filter(f => f.name && f.name.toLowerCase().includes(searchTerm.toLowerCase()));
}, [searchTerm]);

  const renderFeatureButton = useCallback((feature: Feature, size: "default" | "sm" | "lg" | "icon" = 'default') => (
    <FeatureButton
      feature={feature}
      active={activeFeatures.has(feature.id)}
      onToggle={handleFeatureToggle}
      size={size}
    />
  ), [activeFeatures, handleFeatureToggle]);

const renderCategoryToggles = useCallback(() => {
  // Transform featureCategories to CategoryInfo format
  const categories: Record<string, CategoryInfo> = {};
  Object.entries(featureCategories).forEach(([categoryName, features]) => {
    const activeCount = features.filter(feature =>
      activeFeatures.has(feature.id)
    ).length;

    categories[categoryName] = {
      name: categoryName,
      count: features.length,
      activeCount,
      color: getCategoryColor(categoryName),
      priority: getCategoryPriority(categoryName),
      description: getCategoryDescription(categoryName)
    };
  });

  return (
    <CategoryToggles
      categories={categories}
      visibleCategories={categoryPanelVisible}
      onCategoryToggle={handleCategoryToggle}
      onToggleAll={(visible) => {
        const updated = Object.keys(categoryPanelVisible).reduce((acc, key) => {
          acc[key] = visible;
          return acc;
        }, {} as Record<string, boolean>);
        setCategoryPanelVisible(updated);
      }}
      onFilterByPriority={(priority) => {
        // Filter categories by priority
        const filtered = Object.keys(categories).reduce((acc, key) => {
          acc[key] = categories[key].priority <= priority;
          return acc;
        }, {} as Record<string, boolean>);
        setCategoryPanelVisible(filtered);
      }}
      layout="expanded"
    />
  );
}, [featureCategories, categoryPanelVisible, handleCategoryToggle, activeFeatures, setCategoryPanelVisible]);

// Helper functions for category transformation
const getCategoryColor = (categoryName: string): string => {
  const colorMap: Record<string, string> = {
    "Core Workspace": "blue",
    "UI and Controls": "green",
    "AI and Automation": "purple",
    "AR and Spatial": "orange",
    "Simulations and Analysis": "cyan",
    "Tools and Editors": "teal",
    "Auto Furnish & AR Anchor": "pink",
    "Audio and Multimedia": "gray",
    "Collaboration and Multi-user": "slate",
    "Geo and Location": "indigo",
    "IoT and Smart Features": "yellow",
    "Lighting and Mood": "red",
    "Other": "gray"
  };
  return colorMap[categoryName] || "gray";
};

const getCategoryPriority = (categoryName: string): number => {
  const priorityMap: Record<string, number> = {
    "Core Workspace": 1,
    "UI and Controls": 2,
    "AI and Automation": 3,
    "AR and Spatial": 4,
    "Simulations and Analysis": 5,
    "Tools and Editors": 2,
    "Auto Furnish & AR Anchor": 3,
    "Audio and Multimedia": 4,
    "Collaboration and Multi-user": 3,
    "Geo and Location": 4,
    "IoT and Smart Features": 5,
    "Lighting and Mood": 4,
    "Other": 6
  };
  return priorityMap[categoryName] || 6;
};

const getCategoryDescription = (categoryName: string): string => {
  const descriptionMap: Record<string, string> = {
    "Core Workspace": "Essential workspace tools and controls",
    "UI and Controls": "User interface and application controls",
    "AI and Automation": "Artificial intelligence and automated features",
    "AR and Spatial": "Augmented reality and spatial computing",
    "Simulations and Analysis": "Simulation and analysis tools",
    "Tools and Editors": "Import, export, and editing tools",
    "Auto Furnish & AR Anchor": "Automatic furnishing and AR anchoring",
    "Audio and Multimedia": "Audio and multimedia features",
    "Collaboration and Multi-user": "Multi-user collaboration tools",
    "Geo and Location": "Geographic and location-based features",
    "IoT and Smart Features": "Internet of Things integration",
    "Lighting and Mood": "Lighting and atmospheric controls",
    "Other": "Miscellaneous features"
  };
  return descriptionMap[categoryName] || "";
};

  const renderCategoryPanels = useCallback(() => (
    <div>Category Panels Placeholder</div>
  ), []);





  // Layout classes
  const layoutClasses = {
    container: 'flex h-screen bg-gray-800',
    leftPanel: 'flex flex-col w-72 border-r border-gray-700 bg-gray-900 text-white',
    mainWorkspace: 'flex-1 flex flex-col',
  };

  // Show error message if canvas is missing
  if (canvasError) {
    return (
  <div data-testid="canvas-error" className="canvas-error">
        {canvasError}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={layoutClasses.container}>
  {true && renderLeftPanel({
    featureCategories: rawFeaturesByCategory,
    categoryPanelVisible,
    searchTerm,
    activeFeatures,
    currentLayoutMode: layoutMode,
    onCategoryToggle: handleCategoryToggle,
    onSearchChange: setSearchTerm,
    onFeatureToggle: handleFeatureToggle,
    onClose: () => updateState({ leftPanelVisible: false }),
    aiManagerRef,
    bimManagerRef
  })}
        <div className={layoutClasses.mainWorkspace}>
          {layoutMode !== 'immersive' && renderTopBar({
            fps,
            realTimeEnabled,
            activeFeatures,
            cameraMode,
            gridVisible,
            wireframeEnabled,
            statsVisible,
            handleToggleRealTime,
            handleCameraModeChange,
            handleToggleGrid,
            handleToggleWireframe,
            handleToggleStats
          })}
          <div className="flex-1 relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full babylon-canvas"
              role="img"
              aria-label="Babylon.js 3D Canvas"
            />
            {renderCustomPanels({
              featureStates,
              sceneRef,
              engineRef,
              cameraRef,
              bimManagerRef,
              simulationManagerRef,
              aiManagerRef,
              currentModelId,
              workspaces,
              selectedWorkspaceId,
              handleWorkspaceSelect,
              handleMaterialApplied,
              handleAnimationCreate,
              handleSequencePlay,
              handleTourSequenceCreate,
              handleTourSequencePlay,
              disableFeature,
              workspaceState
            })}
            {renderFloatingToolbar({
              workspaceState,
              updateState
            })}
            {layoutMode === 'immersive' && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                <Card className="bg-background">
                  <CardContent className="p-2 flex items-center gap-2">
                    <Badge variant="outline">{activeFeatures.size.toString()}</Badge>
                    <Separator orientation="vertical" className="h-6" />
                    <Select defaultValue="en-US" onValueChange={(value) => aiManagerRef.current?.setLanguage(value)}>
                      <SelectTrigger className="w-[60px]">
                        <SelectValue placeholder="🌐" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">EN</SelectItem>
                        <SelectItem value="es-ES">ES</SelectItem>
                        <SelectItem value="fr-FR">FR</SelectItem>
                      </SelectContent>
                    </Select>
                    <Separator orientation="vertical" className="h-6" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" aria-label="Feature Categories">
                          📂
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {(Object.keys(featureCategories) as string[]).map((category: string) => (
                          <DropdownMenuItem key={String(category)} onClick={() => handleCategoryToggle(String(category))}>
                            {String(category).charAt(0).toUpperCase() + String(category).slice(1)}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" variant="ghost" onClick={() => updateState({ leftPanelVisible: !workspaceState.leftPanelVisible })} title="Toggle Left Panel">
                      🎛️
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => updateState({ rightPanelVisible: !workspaceState.rightPanelVisible })} title="Toggle Right Panel">
                      ⚙️
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => updateState({ leftPanelVisible: true, rightPanelVisible: true, bottomPanelVisible: true })} title="Exit Immersive Mode">
                      🔙
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          {layoutMode !== 'immersive' && workspaceState.bottomPanelVisible && renderBottomPanel({
            workspaceState,
            activeFeatures,
            performanceMode,
            selectedMesh,
            handleFeatureToggle,
            setPerformanceMode,
            handleTourSequenceCreate,
            handleTourSequencePlay
          })}
        </div>
        {renderRightPanel({
          workspaceState,
          updateState,
          bimManagerRef,
          simulationManagerRef,
          currentModelId
        })}
        {/* Hidden file input */}
        <label htmlFor="file-upload" className="hidden">File Upload</label>
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          multiple
          accept=".gltf,.glb,.obj,.fbx,.stl"
          className="hidden"
          onChange={(e) => {
            // Handle file upload
            console.log('Files selected:', e.target.files);
          }}
        />
        {/* Loading Overlay */}
        {!isInitialized && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-black/80 text-white border-gray-600">
              <CardContent className="p-6 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Initializing 3D Workspace....</p>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Keyboard shortcuts help */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button size="sm" variant="outline" className="rounded-full w-8 h-8 p-0" title="Keyboard Shortcuts">
            ?
          </Button>
          <div className="absolute bottom-12 right-0 bg-gray-900 text-white p-2 rounded shadow-lg text-xs hidden">
            <div><kbd>Ctrl+1/2/3</kbd> Layout modes</div>
            <div><kbd>Ctrl+H/J/K</kbd> Toggle panels</div>
            <div><kbd>W/F/T/N</kbd> Simulation features</div>
            <div><kbd>A/U/C/V</kbd> AI features</div>
            <div><kbd>X/Z</kbd> VR/AR modes</div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default React.memo(BabylonWorkspace);

// TODO: Extract mesh/scene event handlers to BabylonWorkspace/meshSceneHandlers.ts
// TODO: Extract inspector logic to BabylonWorkspace/inspectorLogic.ts
// TODO: Extract major UI segments (e.g., renderLeftPanel, renderTopBar, renderRightPanel) to BabylonWorkspace/uiSegments.tsx
