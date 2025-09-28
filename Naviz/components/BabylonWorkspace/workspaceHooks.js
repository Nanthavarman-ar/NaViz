import { useState } from "react";
export function useWorkspaceState(initialWorkspaceId) {
    const [moveActive, setMoveActive] = useState(false);
    const [rotateActive, setRotateActive] = useState(false);
    const [scaleActive, setScaleActive] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [perspectiveActive, setPerspectiveActive] = useState(false);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(initialWorkspaceId);
    const [realTimeEnabled, setRealTimeEnabled] = useState(false);
    const [cameraMode, setCameraMode] = useState('orbit');
    const [gridVisible, setGridVisible] = useState(true);
    const [wireframeEnabled, setWireframeEnabled] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const [categoryPanelVisible, setCategoryPanelVisible] = useState({});
    // Additional workspace state
    const [layoutMode, setLayoutMode] = useState("default");
    const [currentLayoutMode, setCurrentLayoutMode] = useState("default");
    const [activeTool, setActiveTool] = useState(null);
    const [performanceMode, setPerformanceMode] = useState('medium');
    const [activeTab, setActiveTab] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [floatingToolbarVisible, setFloatingToolbarVisible] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
    // Panel visibility states
    const [leftPanelVisible, setLeftPanelVisible] = useState(true);
    const [rightPanelVisible, setRightPanelVisible] = useState(true);
    const [bottomPanelVisible, setBottomPanelVisible] = useState(true);
    // Floating toolbar states
    const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
    // Mesh selection
    const [selectedMesh, setSelectedMesh] = useState(null);
    // Animation and tour functionality
    const [animationManager, setAnimationManager] = useState(null);
    const handleTourSequenceCreate = (sequence) => {
        // Implementation for tour sequence creation
        // For example, log and handle animation group creation
        console.log('Tour sequence created:', sequence);
        // You can add more logic here as needed
    };
    const handleTourSequencePlay = (sequenceId) => {
        // Implementation for tour sequence play
        console.log('Play tour sequence:', sequenceId);
        // You can add more logic here as needed
    };
    // Logic for updating state
    const updateState = (updates) => {
        Object.entries(updates).forEach(([key, value]) => {
            switch (key) {
                case "selectedWorkspaceId":
                    setSelectedWorkspaceId(value);
                    break;
                case "realTimeEnabled":
                    setRealTimeEnabled(value);
                    break;
                case "cameraMode":
                    setCameraMode(value);
                    break;
                case "gridVisible":
                    if (typeof value === 'function') {
                        setGridVisible(value);
                    }
                    else {
                        setGridVisible(value);
                    }
                    break;
                case "wireframeEnabled":
                    if (typeof value === 'function') {
                        setWireframeEnabled(value);
                    }
                    else {
                        setWireframeEnabled(value);
                    }
                    break;
                case "statsVisible":
                    if (typeof value === 'function') {
                        setStatsVisible(value);
                    }
                    else {
                        setStatsVisible(value);
                    }
                    break;
                case "categoryPanelVisible":
                    setCategoryPanelVisible(value);
                    break;
                case "layoutMode":
                    setLayoutMode(value);
                    break;
                case "currentLayoutMode":
                    setCurrentLayoutMode(value);
                    break;
                case "activeTool":
                    setActiveTool(value);
                    break;
                case "performanceMode":
                    setPerformanceMode(value);
                    break;
                case "activeTab":
                    setActiveTab(value);
                    break;
                case "searchQuery":
                    setSearchQuery(value);
                    break;
                case "selectedCategory":
                    setSelectedCategory(value);
                    break;
                case "floatingToolbarVisible":
                    setFloatingToolbarVisible(value);
                    break;
                case "toolbarPosition":
                    setToolbarPosition(value);
                    break;
                case "leftPanelVisible":
                    setLeftPanelVisible(value);
                    break;
                case "rightPanelVisible":
                    setRightPanelVisible(value);
                    break;
                case "bottomPanelVisible":
                    setBottomPanelVisible(value);
                    break;
                case "showFloatingToolbar":
                    setShowFloatingToolbar(value);
                    break;
                case "selectedMesh":
                    setSelectedMesh(value);
                    break;
                case "animationManager":
                    setAnimationManager(value);
                    break;
                default: break;
            }
        });
    };
    const togglePanel = (panel) => {
        setCategoryPanelVisible(prev => ({ ...prev, [panel]: !prev[panel] }));
    };
    const deactivateAllTools = () => setActiveTool(null);
    const resetToDefaults = () => {
        setLayoutMode("default");
        setCurrentLayoutMode("default");
        setActiveTool(null);
        setPerformanceMode('medium');
        setActiveTab("");
        setSearchQuery("");
        setSelectedCategory("");
        setFloatingToolbarVisible(false);
        setToolbarPosition({ x: 0, y: 0 });
        setLeftPanelVisible(true);
        setRightPanelVisible(true);
        setBottomPanelVisible(true);
        setShowFloatingToolbar(false);
        setSelectedMesh(null);
        setAnimationManager(null);
    };
    return {
        // Tool states
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
        // Workspace selection
        selectedWorkspaceId,
        setSelectedWorkspaceId,
        // UI states
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
        // Panel visibility states
        leftPanelVisible,
        setLeftPanelVisible,
        rightPanelVisible,
        setRightPanelVisible,
        bottomPanelVisible,
        setBottomPanelVisible,
        // Category panel states
        categoryPanelVisible,
        setCategoryPanelVisible,
        // Layout and navigation
        layoutMode,
        setLayoutMode,
        currentLayoutMode,
        setCurrentLayoutMode,
        // Tool and feature states
        activeTool,
        setActiveTool,
        performanceMode,
        setPerformanceMode,
        // Search and filtering
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        // Floating toolbar
        showFloatingToolbar,
        setShowFloatingToolbar,
        floatingToolbarVisible,
        setFloatingToolbarVisible,
        toolbarPosition,
        setToolbarPosition,
        // Mesh selection
        selectedMesh,
        setSelectedMesh,
        // Animation and tour functionality
        animationManager,
        setAnimationManager,
        handleTourSequenceCreate,
        handleTourSequencePlay,
        // State management
        updateState,
        togglePanel,
        deactivateAllTools,
        resetToDefaults,
    };
}
