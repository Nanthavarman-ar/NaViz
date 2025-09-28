import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer } from 'react';
// Initial state
const initialState = {
    engine: null,
    scene: null,
    camera: null,
    leftPanelVisible: true,
    rightPanelVisible: true,
    bottomPanelVisible: true,
    showFloatingToolbar: false,
    moveActive: false,
    rotateActive: false,
    scaleActive: false,
    cameraActive: false,
    perspectiveActive: false,
    selectedWorkspaceId: 'default',
    layoutMode: 'standard',
    performanceMode: 'medium',
    renderingQuality: 'high',
    activeFeatures: new Set(),
    categoryPanelVisible: {},
    selectedMesh: null,
    hoveredMesh: null,
    animationManager: null,
    currentAnimation: null,
    materials: [],
    currentMaterial: null,
    isInitialized: false,
    isLoading: false,
    error: null,
};
// Reducer
function workspaceReducer(state, action) {
    switch (action.type) {
        case 'SET_ENGINE':
            return { ...state, engine: action.payload };
        case 'SET_SCENE':
            return { ...state, scene: action.payload };
        case 'SET_CAMERA':
            return { ...state, camera: action.payload };
        case 'TOGGLE_PANEL':
            return { ...state, [action.payload]: !state[action.payload] };
        case 'SET_TOOL_ACTIVE':
            return { ...state, [action.payload.tool]: action.payload.active };
        case 'SET_WORKSPACE_ID':
            return { ...state, selectedWorkspaceId: action.payload };
        case 'SET_LAYOUT_MODE':
            return { ...state, layoutMode: action.payload };
        case 'SET_PERFORMANCE_MODE':
            return { ...state, performanceMode: action.payload };
        case 'SET_RENDERING_QUALITY':
            return { ...state, renderingQuality: action.payload };
        case 'TOGGLE_FEATURE':
            const newFeatures = new Set(state.activeFeatures);
            if (action.payload.enabled) {
                newFeatures.add(action.payload.featureId);
            }
            else {
                newFeatures.delete(action.payload.featureId);
            }
            return { ...state, activeFeatures: newFeatures };
        case 'TOGGLE_CATEGORY_PANEL':
            return {
                ...state,
                categoryPanelVisible: {
                    ...state.categoryPanelVisible,
                    [action.payload.category]: action.payload.visible
                }
            };
        case 'SET_SELECTED_MESH':
            return { ...state, selectedMesh: action.payload };
        case 'SET_HOVERED_MESH':
            return { ...state, hoveredMesh: action.payload };
        case 'SET_ANIMATION_MANAGER':
            return { ...state, animationManager: action.payload };
        case 'SET_CURRENT_ANIMATION':
            return { ...state, currentAnimation: action.payload };
        case 'ADD_MATERIAL':
            return { ...state, materials: [...state.materials, action.payload] };
        case 'SET_CURRENT_MATERIAL':
            return { ...state, currentMaterial: action.payload };
        case 'SET_INITIALIZED':
            return { ...state, isInitialized: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'RESET_STATE':
            return initialState;
        default:
            return state;
    }
}
const WorkspaceContext = createContext(undefined);
export function WorkspaceProvider({ children, initialWorkspaceId = 'default' }) {
    const [state, dispatch] = useReducer(workspaceReducer, {
        ...initialState,
        selectedWorkspaceId: initialWorkspaceId,
    });
    // Helper functions
    const togglePanel = (panel) => {
        dispatch({ type: 'TOGGLE_PANEL', payload: panel });
    };
    const setToolActive = (tool, active) => {
        dispatch({ type: 'SET_TOOL_ACTIVE', payload: { tool, active } });
    };
    const toggleFeature = (featureId, enabled) => {
        dispatch({ type: 'TOGGLE_FEATURE', payload: { featureId, enabled } });
    };
    const toggleCategoryPanel = (category, visible) => {
        dispatch({ type: 'TOGGLE_CATEGORY_PANEL', payload: { category, visible } });
    };
    const setSelectedMesh = (mesh) => {
        dispatch({ type: 'SET_SELECTED_MESH', payload: mesh });
    };
    const setHoveredMesh = (mesh) => {
        dispatch({ type: 'SET_HOVERED_MESH', payload: mesh });
    };
    const resetState = () => {
        dispatch({ type: 'RESET_STATE' });
    };
    const contextValue = {
        state,
        dispatch,
        togglePanel,
        setToolActive,
        toggleFeature,
        toggleCategoryPanel,
        setSelectedMesh,
        setHoveredMesh,
        resetState,
    };
    return (_jsx(WorkspaceContext.Provider, { value: contextValue, children: children }));
}
// Hook to use the context
export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
}
// Selector hooks for specific state slices
export function useWorkspaceUI() {
    const { state } = useWorkspace();
    return {
        leftPanelVisible: state.leftPanelVisible,
        rightPanelVisible: state.rightPanelVisible,
        bottomPanelVisible: state.bottomPanelVisible,
        showFloatingToolbar: state.showFloatingToolbar,
        layoutMode: state.layoutMode,
        isLoading: state.isLoading,
        error: state.error,
    };
}
export function useWorkspaceTools() {
    const { state, setToolActive } = useWorkspace();
    return {
        moveActive: state.moveActive,
        rotateActive: state.rotateActive,
        scaleActive: state.scaleActive,
        cameraActive: state.cameraActive,
        perspectiveActive: state.perspectiveActive,
        setToolActive,
    };
}
export function useWorkspaceFeatures() {
    const { state, toggleFeature, toggleCategoryPanel } = useWorkspace();
    return {
        activeFeatures: state.activeFeatures,
        categoryPanelVisible: state.categoryPanelVisible,
        toggleFeature,
        toggleCategoryPanel,
    };
}
export function useWorkspaceSelection() {
    const { state, setSelectedMesh, setHoveredMesh } = useWorkspace();
    return {
        selectedMesh: state.selectedMesh,
        hoveredMesh: state.hoveredMesh,
        setSelectedMesh,
        setHoveredMesh,
    };
}
// Export the context for direct use
export { WorkspaceContext };
