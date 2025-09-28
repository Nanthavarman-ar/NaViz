import { useState, useCallback, useMemo } from 'react';
const initialState = {
    currentLayoutMode: 'standard',
    leftPanelVisible: true,
    rightPanelVisible: true,
    bottomPanelVisible: true,
    topBarVisible: true,
    moveActive: false,
    rotateActive: false,
    scaleActive: false,
    cameraActive: false,
    perspectiveActive: false,
    performanceMode: 'medium',
    showFloatingToolbar: true,
    toolbarPosition: { x: 20, y: 100 },
    activeTab: 'features',
};
export const useWorkspaceState = () => {
    const [state, setState] = useState(initialState);
    const [selectedMesh, setSelectedMeshState] = useState(null);
    const updateState = useCallback((updates) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);
    // Layout actions
    const setLayoutMode = useCallback((mode) => {
        updateState({ currentLayoutMode: mode });
    }, [updateState]);
    const togglePanel = useCallback((panel) => {
        setState(prev => ({ ...prev, [panel]: !prev[panel] }));
    }, []);
    // Tool actions
    const setActiveTool = useCallback((tool) => {
        setState(prev => ({
            ...prev,
            moveActive: false,
            rotateActive: false,
            scaleActive: false,
            cameraActive: false,
            perspectiveActive: false,
            [tool]: true
        }));
    }, []);
    const deactivateAllTools = useCallback(() => {
        setState(prev => ({
            ...prev,
            moveActive: false,
            rotateActive: false,
            scaleActive: false,
            cameraActive: false,
            perspectiveActive: false
        }));
    }, []);
    // Performance actions
    const setPerformanceMode = useCallback((mode) => {
        updateState({ performanceMode: mode });
    }, [updateState]);
    // Selection actions
    const setSelectedMesh = useCallback((mesh) => {
        setSelectedMeshState(mesh);
    }, []);
    // UI actions
    const setActiveTab = useCallback((tab) => {
        updateState({ activeTab: tab });
    }, [updateState]);
    // Toolbar actions
    const toggleFloatingToolbar = useCallback(() => {
        setState(prev => ({ ...prev, showFloatingToolbar: !prev.showFloatingToolbar }));
    }, []);
    const setToolbarPosition = useCallback((position) => {
        updateState({ toolbarPosition: position });
    }, [updateState]);
    // Reset actions
    const resetToDefaults = useCallback(() => {
        setState(initialState);
        setSelectedMeshState(null);
    }, []);
    // Memoized combined state for backward compatibility
    const combinedState = useMemo(() => ({
        ...state,
        selectedMesh
    }), [state, selectedMesh]);
    // Memoized layout state
    const layoutState = useMemo(() => ({
        currentLayoutMode: state.currentLayoutMode,
        leftPanelVisible: state.leftPanelVisible,
        rightPanelVisible: state.rightPanelVisible,
        bottomPanelVisible: state.bottomPanelVisible,
        topBarVisible: state.topBarVisible,
    }), [state.currentLayoutMode, state.leftPanelVisible, state.rightPanelVisible, state.bottomPanelVisible, state.topBarVisible]);
    // Memoized tool state
    const toolState = useMemo(() => ({
        moveActive: state.moveActive,
        rotateActive: state.rotateActive,
        scaleActive: state.scaleActive,
        cameraActive: state.cameraActive,
        perspectiveActive: state.perspectiveActive,
    }), [state.moveActive, state.rotateActive, state.scaleActive, state.cameraActive, state.perspectiveActive]);
    return {
        state: combinedState,
        layoutState,
        toolState,
        updateState,
        setLayoutMode,
        togglePanel,
        setActiveTool,
        deactivateAllTools,
        setPerformanceMode,
        setSelectedMesh,
        setActiveTab,
        toggleFloatingToolbar,
        setToolbarPosition,
        resetToDefaults
    };
};
