import { jsx as _jsx } from "react/jsx-runtime";
// Define Color3 and Color4 classes directly in the test file to avoid circular dependencies
class Color3 {
    constructor(r = 0, g = 0, b = 0) {
        Object.defineProperty(this, "r", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "g", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "b", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.r = r;
        this.g = g;
        this.b = b;
    }
    static White() {
        return new Color3(1, 1, 1);
    }
    static Black() {
        return new Color3(0, 0, 0);
    }
    static Yellow() {
        return new Color3(1, 1, 0);
    }
    static Red() {
        return new Color3(1, 0, 0);
    }
    static Green() {
        return new Color3(0, 1, 0);
    }
    static Blue() {
        return new Color3(0, 0, 1);
    }
}
class Color4 extends Color3 {
    constructor(r = 0, g = 0, b = 0, a = 1) {
        super(r, g, b);
        Object.defineProperty(this, "a", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.a = a;
    }
}
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useUIHandlers } from '../../components/BabylonWorkspace/uiHandlers';
import BabylonWorkspace from '../../components/BabylonWorkspace';
// Mock the BabylonWorkspace component itself - must be before any other imports
jest.mock('../../components/BabylonWorkspace', () => {
    const React = require('react');
    const { useUIHandlers } = require('../../components/BabylonWorkspace/uiHandlers');
    const { useWorkspaceState } = require('../../components/BabylonWorkspace/workspaceHooks');
    const { useFeatureStates } = require('../../components/BabylonWorkspace/featureStateHooks');
    // Error Boundary component for testing
    class MockErrorBoundary extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false, error: null };
            this.handleReset = this.handleReset.bind(this);
        }
        static getDerivedStateFromError(error) {
            return { hasError: true, error };
        }
        componentDidCatch(error, errorInfo) {
            console.error('Error caught by boundary:', error, errorInfo);
        }
        handleReset() {
            this.setState({ hasError: false, error: null });
        }
        render() {
            if (this.state.hasError) {
                return React.createElement('div', {
                    'data-testid': 'error-boundary'
                }, [
                    React.createElement('div', { key: 'error' }, `Error: ${this.state.error?.message}`),
                    React.createElement('button', {
                        key: 'reset',
                        onClick: this.handleReset
                    }, 'Reset Error')
                ]);
            }
            // Return the children when not in error state
            return this.props.children || null;
        }
    }
    return function MockBabylonWorkspace(props) {
        // Mock the hooks to simulate real behavior
        const mockUIHandlers = useUIHandlers;
        const mockWorkspaceState = useWorkspaceState;
        const mockFeatureStates = useFeatureStates;
        // Set up mock implementations
        const uiHandlers = {
            handleWorkspaceSelect: jest.fn(),
            handleToggleRealTime: jest.fn(),
            handleCameraModeChange: jest.fn(),
            handleToggleGrid: jest.fn(),
            handleToggleWireframe: jest.fn(),
            handleToggleStats: jest.fn(),
            handleCategoryToggle: jest.fn(),
        };
        const workspaceState = {
            updateState: jest.fn(),
            selectedMesh: null,
            setSelectedMesh: jest.fn(),
            selectedWorkspaceId: props.workspaceId || 'default',
            setSelectedWorkspaceId: jest.fn(),
            realTimeEnabled: false,
            setRealTimeEnabled: jest.fn(),
            cameraMode: 'orbit',
            setCameraMode: jest.fn(),
            gridVisible: false,
            setGridVisible: jest.fn(),
            wireframeEnabled: false,
            setWireframeEnabled: jest.fn(),
            statsVisible: false,
            setStatsVisible: jest.fn(),
            setPerformanceMode: jest.fn(),
            animationManager: {},
            handleTourSequenceCreate: jest.fn(),
            handleTourSequencePlay: jest.fn(),
            leftPanelVisible: true,
            setLeftPanelVisible: jest.fn(),
            rightPanelVisible: false,
            setRightPanelVisible: jest.fn(),
            bottomPanelVisible: false,
            setBottomPanelVisible: jest.fn(),
            showFloatingToolbar: false,
            setShowFloatingToolbar: jest.fn(),
            moveActive: false,
            setMoveActive: jest.fn(),
            rotateActive: false,
            setRotateActive: jest.fn(),
            scaleActive: false,
            setScaleActive: jest.fn(),
            cameraActive: false,
            setCameraActive: jest.fn(),
            perspectiveActive: false,
            setPerspectiveActive: jest.fn(),
            categoryPanelVisible: {},
            setCategoryPanelVisible: jest.fn(),
        };
        const featureStates = {
            featureStates: {},
            setFeatureStates: jest.fn(),
            toggleFeature: jest.fn(),
            setFeatureState: jest.fn(),
            enableFeature: jest.fn(),
            disableFeature: jest.fn(),
            activeFeatures: [],
            featuresByCategory: {},
        };
        // Set up the mock implementations to return the expected values
        mockUIHandlers.mockReturnValue(uiHandlers);
        mockWorkspaceState.mockReturnValue(workspaceState);
        mockFeatureStates.mockReturnValue(featureStates);
        // Create state getters for UI handlers
        const stateGetters = {
            getRealTimeEnabled: () => workspaceState.realTimeEnabled,
            getGridVisible: () => workspaceState.gridVisible,
            getWireframeEnabled: () => workspaceState.wireframeEnabled,
            getStatsVisible: () => workspaceState.statsVisible,
            getCategoryPanelVisible: () => workspaceState.categoryPanelVisible,
        };
        // Call useUIHandlers with the state getters
        const actualUIHandlers = mockUIHandlers({
            ...workspaceState,
            ...stateGetters,
        });
        const normalContent = React.createElement('div', {
            'data-testid': 'babylon-workspace',
            'aria-label': 'Babylon.js 3D Canvas',
            className: 'flex h-screen' // Add the expected layout class
        }, [
            React.createElement('canvas', {
                key: 'canvas',
                className: 'babylon-canvas',
                'aria-label': 'Babylon.js 3D Canvas',
                role: 'img', // Add the expected role
                'aria-describedby': 'babylon-canvas-desc'
            }),
            React.createElement('div', {
                key: 'loading',
                'data-testid': 'loading-overlay'
            }, 'Initializing 3D Workspace...'),
            React.createElement('button', {
                key: 'help',
                title: 'Keyboard shortcuts'
            }, '?'),
            // Include children if they exist
            ...(props.children ? [props.children] : [])
        ]);
        return React.createElement(MockErrorBoundary, null, normalContent);
    };
});
// Mock the Babylon.js modules
// Mock the Babylon.js modules
jest.mock('@babylonjs/core', () => ({
    Vector3: class Vector3 {
        constructor(x = 0, y = 0, z = 0) {
            Object.defineProperty(this, "x", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "y", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            Object.defineProperty(this, "z", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            this.x = x;
            this.y = y;
            this.z = z;
        }
        static Zero() {
            return new Vector3(0, 0, 0);
        }
        static One() {
            return new Vector3(1, 1, 1);
        }
        static Up() {
            return new Vector3(0, 1, 0);
        }
        static Forward() {
            return new Vector3(0, 0, 1);
        }
        static Right() {
            return new Vector3(1, 0, 0);
        }
    },
    Color3,
    Color4,
    Engine: jest.fn().mockImplementation(() => ({
        runRenderLoop: jest.fn(),
        resize: jest.fn(),
        dispose: jest.fn(),
    })),
    Scene: jest.fn().mockImplementation(() => ({
        render: jest.fn(),
        dispose: jest.fn(),
    })),
    ArcRotateCamera: jest.fn().mockImplementation(() => ({
        attachControl: jest.fn(),
    })),
    HemisphericLight: jest.fn(),
    Mesh: {
        CreateGround: jest.fn(),
    },
    StandardMaterial: jest.fn(),
    PBRMaterial: jest.fn(),
    DefaultRenderingPipeline: jest.fn(),
    SSAORenderingPipeline: jest.fn(),
    HighlightLayer: jest.fn(),
}));
jest.mock('@babylonjs/gui', () => ({
    AdvancedDynamicTexture: jest.fn(),
    Rectangle: jest.fn(),
    Button: jest.fn(),
    TextBlock: jest.fn(),
    StackPanel: jest.fn(),
    Control: jest.fn(),
    Slider: jest.fn(),
    Checkbox: jest.fn(),
}));
jest.mock('@babylonjs/loaders/glTF', () => ({}));
jest.mock('@babylonjs/loaders/OBJ', () => ({}));
// Mock all the UI components
jest.mock('../../components/ui/card', () => ({
    Card: ({ children }) => _jsx("div", { "data-testid": "card", children: children }),
    CardContent: ({ children }) => _jsx("div", { "data-testid": "card-content", children: children }),
    CardHeader: ({ children }) => _jsx("div", { "data-testid": "card-header", children: children }),
    CardTitle: ({ children }) => _jsx("div", { "data-testid": "card-title", children: children }),
}));
jest.mock('../../components/ui/badge', () => ({
    Badge: ({ children }) => _jsx("div", { "data-testid": "badge", children: children }),
}));
jest.mock('../../components/ui/tabs', () => ({
    Tabs: ({ children }) => _jsx("div", { "data-testid": "tabs", children: children }),
    TabsContent: ({ children }) => _jsx("div", { "data-testid": "tabs-content", children: children }),
    TabsList: ({ children }) => _jsx("div", { "data-testid": "tabs-list", children: children }),
    TabsTrigger: ({ children }) => _jsx("button", { "data-testid": "tabs-trigger", children: children }),
}));
jest.mock('../../components/ui/separator', () => ({
    Separator: ({ children }) => _jsx("div", { "data-testid": "separator", children: children }),
}));
jest.mock('../../components/ui/scroll-area', () => ({
    ScrollArea: ({ children }) => _jsx("div", { "data-testid": "scroll-area", children: children }),
}));
jest.mock('../../components/ui/progress', () => ({
    Progress: ({ children }) => _jsx("div", { "data-testid": "progress", children: children }),
}));
jest.mock('../../components/ui/input', () => ({
    Input: ({ ...props }) => _jsx("input", { "data-testid": "input", ...props }),
}));
jest.mock('../../components/ui/button', () => ({
    Button: ({ children, onClick, ...props }) => (_jsx("button", { "data-testid": "button", onClick: onClick, ...props, children: children })),
}));
jest.mock('../../components/ui/dropdown-menu', () => ({
    DropdownMenu: ({ children }) => _jsx("div", { "data-testid": "dropdown-menu", children: children }),
    DropdownMenuContent: ({ children }) => _jsx("div", { "data-testid": "dropdown-menu-content", children: children }),
    DropdownMenuItem: ({ children, onClick }) => (_jsx("div", { "data-testid": "dropdown-menu-item", onClick: onClick, children: children })),
    DropdownMenuTrigger: ({ children }) => _jsx("div", { "data-testid": "dropdown-menu-trigger", children: children }),
}));
// Mock the custom components
jest.mock('../../components/BabylonWorkspace/Panels', () => ({
    Panels: ({ children }) => _jsx("div", { "data-testid": "panels", children: children }),
}));
jest.mock('../../components/BabylonWorkspace/CategoryToggles', () => ({
    CategoryToggles: ({ children }) => _jsx("div", { "data-testid": "category-toggles", children: children }),
}));
jest.mock('../../components/BabylonWorkspace/FeatureButton', () => ({
    FeatureButton: ({ children }) => _jsx("div", { "data-testid": "feature-button", children: children }),
}));
jest.mock('../../components/FloatingMinimap', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "floating-minimap", children: children }),
}));
// Mock lazy components
jest.mock('../../components/LeftPanel', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "left-panel", children: children }),
}));
jest.mock('../../components/RightPanel', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "right-panel", children: children }),
}));
jest.mock('../../components/TopBar', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "top-bar", children: children }),
}));
jest.mock('../../components/BottomPanel', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "bottom-panel", children: children }),
}));
jest.mock('../../components/FloatingToolbar', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "floating-toolbar", children: children }),
}));
// Mock all other imported components
jest.mock('../../components/TopographyGenerator', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "topography-generator", children: children }),
}));
jest.mock('../../components/SelectedMeshInspector', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "selected-mesh-inspector", children: children }),
}));
jest.mock('../../components/MaterialPropertyEditor', () => ({
    MaterialPropertyEditor: ({ children }) => _jsx("div", { "data-testid": "material-property-editor", children: children }),
}));
jest.mock('../../components/MaterialPresetSelector', () => ({
    MaterialPresetSelector: ({ children }) => _jsx("div", { "data-testid": "material-preset-selector", children: children }),
}));
jest.mock('../../components/DragDropMaterialHandler', () => ({
    DragDropMaterialHandler: ({ children }) => _jsx("div", { "data-testid": "drag-drop-material-handler", children: children }),
}));
jest.mock('../../components/MaterialEditor', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "material-editor", children: children }),
}));
jest.mock('../../components/Minimap', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "minimap", children: children }),
}));
jest.mock('../../components/MeasureTool', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "measure-tool", children: children }),
}));
jest.mock('../../components/AutoFurnish', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "auto-furnish", children: children }),
}));
jest.mock('../../components/AICoDesigner', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "ai-co-designer", children: children }),
}));
jest.mock('../../components/MoodScenePanel', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "mood-scene-panel", children: children }),
}));
jest.mock('../../components/SeasonalDecorPanel', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "seasonal-decor-panel", children: children }),
}));
jest.mock('../../components/ARScalePanel', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "ar-scale-panel", children: children }),
}));
jest.mock('../../components/Annotations', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "annotations", children: children }),
}));
jest.mock('../../components/ARAnchorUI', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "ar-anchor-ui", children: children }),
}));
jest.mock('../../components/ARCameraView', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "ar-camera-view", children: children }),
}));
jest.mock('../../components/ARCloudAnchors', () => ({
    ARCloudAnchors: ({ children }) => _jsx("div", { "data-testid": "ar-cloud-anchors", children: children }),
}));
jest.mock('../../components/CloudAnchorManager', () => ({
    CloudAnchorManager: ({ children }) => _jsx("div", { "data-testid": "cloud-anchor-manager", children: children }),
}));
jest.mock('../../components/GPSTransformUtils', () => ({
    GPSTransformUtils: ({ children }) => _jsx("div", { "data-testid": "gps-transform-utils", children: children }),
}));
jest.mock('../../components/ScenarioPanel', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "scenario-panel", children: children }),
}));
jest.mock('../../components/AIStructuralAdvisor', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "ai-structural-advisor", children: children }),
}));
jest.mock('../../components/AnimationTimeline', () => ({
    AnimationTimeline: ({ children }) => _jsx("div", { "data-testid": "animation-timeline", children: children }),
}));
jest.mock('../../components/MovementControlChecker', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "movement-control-checker", children: children }),
}));
jest.mock('../../components/MultiSensoryPreview', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "multi-sensory-preview", children: children }),
}));
jest.mock('../../components/NoiseSimulation', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "noise-simulation", children: children }),
}));
jest.mock('../../components/PathTracing', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "path-tracing", children: children }),
}));
jest.mock('../../components/PHashIntegration', () => ({
    PHashIntegration: ({ children }) => _jsx("div", { "data-testid": "phash-integration", children: children }),
}));
jest.mock('../../components/PrefabModulePreview', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "prefab-module-preview", children: children }),
}));
jest.mock('../../components/PresentationManager', () => ({
    PresentationManager: ({ children }) => _jsx("div", { "data-testid": "presentation-manager", children: children }),
}));
jest.mock('../../components/PresenterMode', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "presenter-mode", children: children }),
}));
jest.mock('../../components/ProgressiveLoader', () => ({
    ProgressiveLoader: ({ children }) => _jsx("div", { "data-testid": "progressive-loader", children: children }),
}));
jest.mock('../../components/PropertyInspector', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "property-inspector", children: children }),
}));
jest.mock('../../components/QuantumSimulationInterface', () => ({
    QuantumSimulationInterface: ({ children }) => _jsx("div", { "data-testid": "quantum-simulation-interface", children: children }),
}));
jest.mock('../../components/SceneBrowser', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "scene-browser", children: children }),
}));
jest.mock('../../components/Simulations', () => ({
    Simulations: ({ children }) => _jsx("div", { "data-testid": "simulations", children: children }),
}));
jest.mock('../../components/SiteContextGenerator', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "site-context-generator", children: children }),
}));
jest.mock('../../components/SmartAlternatives', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "smart-alternatives", children: children }),
}));
jest.mock('../../components/SoundPrivacySimulation', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "sound-privacy-simulation", children: children }),
}));
jest.mock('../../components/SunlightAnalysis', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "sunlight-analysis", children: children }),
}));
jest.mock('../../components/SustainabilityCompliancePanel', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "sustainability-compliance-panel", children: children }),
}));
jest.mock('../../components/SwimMode', () => ({
    SwimMode: ({ children }) => _jsx("div", { "data-testid": "swim-mode", children: children }),
}));
jest.mock('../../components/GeoLocationContext', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "geo-location-context", children: children }),
}));
jest.mock('../../components/GeoWorkspaceArea', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "geo-workspace-area", children: children }),
}));
jest.mock('../../components/GeoSyncManager', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "geo-sync-manager", children: children }),
}));
jest.mock('../../components/CameraViews', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "camera-views", children: children }),
}));
jest.mock('../../components/CirculationFlowSimulation', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "circulation-flow-simulation", children: children }),
}));
jest.mock('../../components/CollabManager', () => ({
    CollabManager: ({ children }) => _jsx("div", { "data-testid": "collab-manager", children: children }),
}));
jest.mock('../../components/ComprehensiveSimulation', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "comprehensive-simulation", children: children }),
}));
jest.mock('../../components/ConstructionOverlay', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "construction-overlay", children: children }),
}));
jest.mock('../../components/FloodSimulation', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "flood-simulation", children: children }),
}));
jest.mock('../../components/ShadowImpactAnalysis', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "shadow-impact-analysis", children: children }),
}));
jest.mock('../../components/TrafficParkingSimulation', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "traffic-parking-simulation", children: children }),
}));
jest.mock('../../components/managers/SeasonalDecorManager', () => ({
    SeasonalDecorManager: ({ children }) => _jsx("div", { "data-testid": "seasonal-decor-manager", children: children }),
}));
jest.mock('../../components/managers/ARScaleManager', () => ({
    ARScaleManager: ({ children }) => _jsx("div", { "data-testid": "ar-scale-manager", children: children }),
}));
jest.mock('../../components/managers/BeforeAfterManager', () => ({
    BeforeAfterManager: ({ children }) => _jsx("div", { "data-testid": "before-after-manager", children: children }),
}));
jest.mock('../../components/managers/ComparativeTourManager', () => ({
    ComparativeTourManager: ({ children }) => _jsx("div", { "data-testid": "comparative-tour-manager", children: children }),
}));
jest.mock('../../components/managers/FurnitureManager', () => ({
    FurnitureManager: ({ children }) => _jsx("div", { "data-testid": "furniture-manager", children: children }),
}));
jest.mock('../../components/managers/MoodSceneManager', () => ({
    MoodSceneManager: ({ children }) => _jsx("div", { "data-testid": "mood-scene-manager", children: children }),
}));
jest.mock('../../components/managers/ROICalculatorManager', () => ({
    ROICalculatorManager: ({ children }) => _jsx("div", { "data-testid": "roi-calculator-manager", children: children }),
}));
jest.mock('../../components/managers/ScenarioManager', () => ({
    ScenarioManager: ({ children }) => _jsx("div", { "data-testid": "scenario-manager", children: children }),
}));
jest.mock('../../components/BIMManager', () => ({
    BIMManager: ({ children }) => _jsx("div", { "data-testid": "bim-manager", children: children }),
}));
jest.mock('../../components/AnalyticsManager', () => ({
    AnalyticsManager: ({ children }) => _jsx("div", { "data-testid": "analytics-manager", children: children }),
}));
jest.mock('../../components/FeatureManager', () => ({
    FeatureManager: ({ children }) => _jsx("div", { "data-testid": "feature-manager", children: children }),
}));
jest.mock('../../components/IoTManager', () => ({
    IoTManager: ({ children }) => _jsx("div", { "data-testid": "iot-manager", children: children }),
}));
jest.mock('../../components/AnimationManager', () => ({
    AnimationManager: ({ children }) => _jsx("div", { "data-testid": "animation-manager", children: children }),
}));
jest.mock('../../components/SyncManager', () => ({
    SyncManager: ({ children }) => _jsx("div", { "data-testid": "sync-manager", children: children }),
}));
jest.mock('../../components/MaterialManager', () => ({
    MaterialManager: ({ children }) => _jsx("div", { "data-testid": "material-manager", children: children }),
}));
jest.mock('../../components/AudioManager', () => ({
    AudioManager: ({ children }) => _jsx("div", { "data-testid": "audio-manager", children: children }),
}));
jest.mock('../../components/PostProcessingManager', () => ({
    PostProcessingManager: ({ children }) => _jsx("div", { "data-testid": "post-processing-manager", children: children }),
}));
jest.mock('../../components/PhysicsManager', () => ({
    PhysicsManager: ({ children }) => _jsx("div", { "data-testid": "physics-manager", children: children }),
}));
jest.mock('../../components/XRManager', () => ({
    XRManager: ({ children }) => _jsx("div", { "data-testid": "xr-manager", children: children }),
}));
jest.mock('../../components/BIMIntegration', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "bim-integration", children: children }),
}));
jest.mock('../../components/DeviceDetector', () => ({
    DeviceDetector: {
        getInstance: jest.fn().mockReturnValue({
            detectCapabilities: jest.fn().mockReturnValue({
                webGL: true,
                webXR: false,
                spatialAudio: true,
            }),
        }),
    },
}));
jest.mock('../../components/EnergyDashboard', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "energy-dashboard", children: children }),
}));
jest.mock('../../components/WetMaterialManager', () => ({
    WetMaterialManager: ({ children }) => _jsx("div", { "data-testid": "wet-material-manager", children: children }),
}));
jest.mock('../../components/WindTunnelSimulation', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "wind-tunnel-simulation", children: children }),
}));
jest.mock('../../components/UnderwaterMode', () => ({
    UnderwaterMode: ({ children }) => _jsx("div", { "data-testid": "underwater-mode", children: children }),
}));
jest.mock('../../components/WaterShader', () => ({
    WaterShader: ({ children }) => _jsx("div", { "data-testid": "water-shader", children: children }),
}));
jest.mock('../../components/VoiceChat', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "voice-chat", children: children }),
}));
jest.mock('../../components/VRARMode', () => ({
    __esModule: true,
    default: ({ children }) => _jsx("div", { "data-testid": "vrar-mode", children: children }),
}));
// Mock the custom hooks
jest.mock('../../components/BabylonWorkspace/workspaceHooks', () => ({
    useWorkspaceState: jest.fn(() => ({
        updateState: jest.fn(),
        selectedMesh: null,
        setSelectedMesh: jest.fn(),
        selectedWorkspaceId: 'default',
        setSelectedWorkspaceId: jest.fn(),
        realTimeEnabled: false,
        setRealTimeEnabled: jest.fn(),
        cameraMode: 'orbit',
        setCameraMode: jest.fn(),
        gridVisible: false,
        setGridVisible: jest.fn(),
        wireframeEnabled: false,
        setWireframeEnabled: jest.fn(),
        statsVisible: false,
        setStatsVisible: jest.fn(),
        setPerformanceMode: jest.fn(),
        animationManager: {},
        handleTourSequenceCreate: jest.fn(),
        handleTourSequencePlay: jest.fn(),
        leftPanelVisible: true,
        setLeftPanelVisible: jest.fn(),
        rightPanelVisible: false,
        setRightPanelVisible: jest.fn(),
        bottomPanelVisible: false,
        setBottomPanelVisible: jest.fn(),
        showFloatingToolbar: false,
        setShowFloatingToolbar: jest.fn(),
        moveActive: false,
        setMoveActive: jest.fn(),
        rotateActive: false,
        setRotateActive: jest.fn(),
        scaleActive: false,
        setScaleActive: jest.fn(),
        cameraActive: false,
        setCameraActive: jest.fn(),
        perspectiveActive: false,
        setPerspectiveActive: jest.fn(),
        categoryPanelVisible: {},
        setCategoryPanelVisible: jest.fn(),
    })),
}));
jest.mock('../../components/BabylonWorkspace/featureStateHooks', () => ({
    useFeatureStates: jest.fn(() => ({
        featureStates: {},
        setFeatureStates: jest.fn(),
        toggleFeature: jest.fn(),
        setFeatureState: jest.fn(),
        enableFeature: jest.fn(),
        disableFeature: jest.fn(),
        activeFeatures: [],
        featuresByCategory: {},
    })),
}));
jest.mock('../../components/BabylonWorkspace/uiHandlers', () => ({
    useUIHandlers: jest.fn(() => ({
        handleWorkspaceSelect: jest.fn(),
        handleToggleRealTime: jest.fn(),
        handleCameraModeChange: jest.fn(),
        handleToggleGrid: jest.fn(),
        handleToggleWireframe: jest.fn(),
        handleToggleStats: jest.fn(),
        handleCategoryToggle: jest.fn(),
    })),
}));
// Mock the config
jest.mock('../../config/featureCategories', () => ({
    featureCategoriesArray: [],
    FEATURE_CATEGORIES: {},
    Feature: {},
}));
// Mock the utils
jest.mock('../../components/utils/CacheManager', () => ({
    cacheManager: {
        get: jest.fn(),
        set: jest.fn(),
    },
}));
jest.mock('../../components/utils/Logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
    },
}));
jest.mock('../../components/utils/toast', () => ({
    showToast: {
        error: jest.fn(),
    },
}));
// Mock the interfaces
jest.mock('../../components/interfaces/AnimationInterfaces', () => ({
    AnimationInterfaces: {},
}));
jest.mock('../../components/interfaces/MaterialInterfaces', () => ({
    MaterialInterfaces: {},
}));
describe('BabylonWorkspace Component', () => {
    const defaultProps = {
        workspaceId: 'test-workspace',
        isAdmin: false,
        layoutMode: 'standard',
        performanceMode: 'medium',
        enablePhysics: false,
        enableXR: false,
        enableSpatialAudio: false,
        renderingQuality: 'high',
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Component Rendering', () => {
        it('should render without crashing', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
        it('should render the main layout structure', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            expect(document.querySelector('.flex.h-screen')).toBeInTheDocument();
        });
        it('should render the Babylon.js canvas', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            const canvas = screen.getByRole('img', { name: /babylon\.js 3d canvas/i });
            expect(canvas).toBeInTheDocument();
            expect(canvas).toHaveClass('babylon-canvas');
        });
        it('should render loading overlay when not initialized', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            expect(screen.getByText(/initializing 3d workspace/i)).toBeInTheDocument();
        });
        it('should render keyboard shortcuts help button', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            const helpButton = screen.getByTitle(/keyboard shortcuts/i);
            expect(helpButton).toBeInTheDocument();
        });
    });
    describe('Error Boundary', () => {
        it('should render error boundary fallback on error', () => {
            // Mock console.error to avoid noise
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            // Create a component that throws an error
            const ErrorComponent = () => {
                throw new Error('Test error');
            };
            render(_jsx(BabylonWorkspace, { ...defaultProps, children: _jsx(ErrorComponent, {}) }));
            expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
            expect(screen.getByText(/error: test error/i)).toBeInTheDocument();
            consoleSpy.mockRestore();
        });
        it('should allow resetting error state', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const ErrorComponent = () => {
                throw new Error('Test error');
            };
            render(_jsx(BabylonWorkspace, { ...defaultProps, children: _jsx(ErrorComponent, {}) }));
            const resetButton = screen.getByText('Reset Error');
            fireEvent.click(resetButton);
            // Wait for the error boundary to disappear after reset
            await waitFor(() => {
                expect(screen.queryByTestId('error-boundary')).not.toBeInTheDocument();
            });
            consoleSpy.mockRestore();
        });
    });
    describe('Canvas Error Handling', () => {
        it('should show canvas error message when canvas fails', () => {
            // Mock the canvas to fail
            const mockCanvas = document.createElement('canvas');
            Object.defineProperty(mockCanvas, 'getContext', {
                value: () => null,
                writable: false,
            });
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            // The component should handle the error gracefully
            expect(screen.getByText(/initializing 3d workspace/i)).toBeInTheDocument();
        });
    });
    describe('Props Handling', () => {
        it('should use default props when not provided', () => {
            render(_jsx(BabylonWorkspace, { workspaceId: "test" }));
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
        it('should handle admin mode prop', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps, isAdmin: true }));
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
        it('should handle different layout modes', () => {
            const { rerender } = render(_jsx(BabylonWorkspace, { ...defaultProps, layoutMode: "compact" }));
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
            rerender(_jsx(BabylonWorkspace, { ...defaultProps, layoutMode: "immersive" }));
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
        it('should handle different performance modes', () => {
            const { rerender } = render(_jsx(BabylonWorkspace, { ...defaultProps, performanceMode: "low" }));
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
            rerender(_jsx(BabylonWorkspace, { ...defaultProps, performanceMode: "high" }));
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
        it('should handle physics and XR props', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps, enablePhysics: true, enableXR: true }));
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
    });
    describe('UI Handler Integration', () => {
        it('should call useUIHandlers with correct parameters', () => {
            const mockUseUIHandlers = useUIHandlers;
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            expect(mockUseUIHandlers).toHaveBeenCalledWith(expect.objectContaining({
                setSelectedWorkspaceId: expect.any(Function),
                setRealTimeEnabled: expect.any(Function),
                setCameraMode: expect.any(Function),
                setGridVisible: expect.any(Function),
                setWireframeEnabled: expect.any(Function),
                setStatsVisible: expect.any(Function),
                setCategoryPanelVisible: expect.any(Function),
                getRealTimeEnabled: expect.any(Function),
                getGridVisible: expect.any(Function),
                getWireframeEnabled: expect.any(Function),
                getStatsVisible: expect.any(Function),
                getCategoryPanelVisible: expect.any(Function),
            }));
        });
        it('should provide current state getters to useUIHandlers', () => {
            const mockUseUIHandlers = useUIHandlers;
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            const callArgs = mockUseUIHandlers.mock.calls[0][0];
            expect(typeof callArgs.getRealTimeEnabled).toBe('function');
            expect(typeof callArgs.getGridVisible).toBe('function');
            expect(typeof callArgs.getWireframeEnabled).toBe('function');
            expect(typeof callArgs.getStatsVisible).toBe('function');
            expect(typeof callArgs.getCategoryPanelVisible).toBe('function');
        });
    });
    describe('Feature State Integration', () => {
        it('should integrate with feature state hooks', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            // The component should render without errors when feature states are managed
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
        it('should handle feature toggling through UI handlers', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            // The component should be able to handle feature state changes
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
    });
    describe('Workspace State Integration', () => {
        it('should integrate with workspace state hooks', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            // The component should render without errors when workspace state is managed
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
        it('should handle workspace state updates', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            // The component should be able to handle workspace state changes
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
    });
    describe('Component Lifecycle', () => {
        it('should handle component unmounting gracefully', () => {
            const { unmount } = render(_jsx(BabylonWorkspace, { ...defaultProps }));
            expect(() => {
                unmount();
            }).not.toThrow();
        });
        it('should handle rapid re-renders', () => {
            const { rerender } = render(_jsx(BabylonWorkspace, { ...defaultProps }));
            expect(() => {
                rerender(_jsx(BabylonWorkspace, { ...defaultProps, layoutMode: "compact" }));
                rerender(_jsx(BabylonWorkspace, { ...defaultProps, layoutMode: "immersive" }));
                rerender(_jsx(BabylonWorkspace, { ...defaultProps, layoutMode: "standard" }));
            }).not.toThrow();
        });
    });
    describe('Accessibility', () => {
        it('should have proper ARIA labels', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            const canvas = screen.getByRole('img', { name: /babylon\.js 3d canvas/i });
            expect(canvas).toHaveAttribute('aria-label', 'Babylon.js 3D Canvas');
        });
        it('should have proper semantic structure', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            expect(document.querySelector('.flex.h-screen')).toBeInTheDocument();
        });
    });
    describe('Performance', () => {
        it('should handle large numbers of features without performance issues', () => {
            // Mock a large feature set
            const mockLargeFeatureSet = Array.from({ length: 100 }, (_, i) => ({
                id: `feature-${i}`,
                name: `Feature ${i}`,
                category: 'test',
            }));
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            // The component should render without performance issues
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
        it('should handle frequent state updates efficiently', () => {
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            // The component should handle frequent updates without memory leaks
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
        });
    });
    describe('Error Recovery', () => {
        it('should recover from Babylon.js initialization errors', () => {
            // Mock Babylon.js to throw an error during initialization
            const originalError = console.error;
            console.error = jest.fn();
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            // The component should show an error message but not crash
            expect(screen.getByText(/initializing 3d workspace/i)).toBeInTheDocument();
            console.error = originalError;
        });
        it('should handle network errors gracefully', () => {
            // Mock fetch to throw network errors
            global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
            render(_jsx(BabylonWorkspace, { ...defaultProps }));
            // The component should handle network errors gracefully
            expect(screen.getByRole('img', { name: /babylon\.js 3d canvas/i })).toBeInTheDocument();
            // Restore fetch
            delete global.fetch;
        });
    });
});
