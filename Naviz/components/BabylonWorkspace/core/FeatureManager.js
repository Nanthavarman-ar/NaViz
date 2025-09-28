import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, createContext, useContext } from 'react';
import { featureCategories, featureCategoriesArray, FEATURE_CATEGORIES } from '../../../config/featureCategories';
import { useWorkspace } from './WorkspaceContext';
export function FeatureManager({ onFeatureToggle, onCategoryToggle, children }) {
    const { state, toggleFeature, toggleCategoryPanel } = useWorkspace();
    // Handle feature toggle
    const handleFeatureToggle = useCallback((featureId, enabled) => {
        toggleFeature(featureId, enabled);
        if (onFeatureToggle) {
            onFeatureToggle(featureId, enabled);
        }
    }, [toggleFeature, onFeatureToggle]);
    // Handle category panel toggle
    const handleCategoryToggle = useCallback((category, visible) => {
        toggleCategoryPanel(category, visible);
        if (onCategoryToggle) {
            onCategoryToggle(category, visible);
        }
    }, [toggleCategoryPanel, onCategoryToggle]);
    // Get features by category
    const featuresByCategory = useMemo(() => {
        return Object.entries(featureCategories).reduce((acc, [category, features]) => {
            acc[category] = features.filter((feature) => state.activeFeatures.has(feature.id));
            return acc;
        }, {});
    }, [state.activeFeatures]);
    // Get enabled features
    const enabledFeatures = useMemo(() => {
        return featureCategoriesArray.filter((feature) => state.activeFeatures.has(feature.id));
    }, [state.activeFeatures]);
    // Get disabled features
    const disabledFeatures = useMemo(() => {
        return featureCategoriesArray.filter((feature) => !state.activeFeatures.has(feature.id));
    }, [state.activeFeatures]);
    // Check if feature is enabled
    const isFeatureEnabled = useCallback((featureId) => {
        return state.activeFeatures.has(featureId);
    }, [state.activeFeatures]);
    // Check if category panel is visible
    const isCategoryPanelVisible = useCallback((category) => {
        return state.categoryPanelVisible[category] || false;
    }, [state.categoryPanelVisible]);
    // Get features for a specific category
    const getFeaturesByCategory = useCallback((category) => {
        return featuresByCategory[category] || [];
    }, [featuresByCategory]);
    // Get all categories
    const getCategories = useCallback(() => {
        return Object.keys(featureCategories);
    }, []);
    // Enable all features in a category
    const enableCategory = useCallback((category) => {
        const categoryFeatures = featureCategories[category] || [];
        categoryFeatures.forEach((feature) => {
            toggleFeature(feature.id, true);
        });
    }, [toggleFeature]);
    // Disable all features in a category
    const disableCategory = useCallback((category) => {
        const categoryFeatures = featureCategories[category] || [];
        categoryFeatures.forEach((feature) => {
            toggleFeature(feature.id, false);
        });
    }, [toggleFeature]);
    // Enable all features
    const enableAllFeatures = useCallback(() => {
        featureCategoriesArray.forEach((feature) => {
            toggleFeature(feature.id, true);
        });
    }, [toggleFeature]);
    // Disable all features
    const disableAllFeatures = useCallback(() => {
        featureCategoriesArray.forEach((feature) => {
            toggleFeature(feature.id, false);
        });
    }, [toggleFeature]);
    // Get feature statistics
    const getFeatureStats = useCallback(() => {
        const totalFeatures = featureCategoriesArray.length;
        const enabledCount = state.activeFeatures.size;
        const disabledCount = totalFeatures - enabledCount;
        return {
            total: totalFeatures,
            enabled: enabledCount,
            disabled: disabledCount,
            percentage: totalFeatures > 0 ? Math.round((enabledCount / totalFeatures) * 100) : 0,
        };
    }, [state.activeFeatures.size]);
    // Get category statistics
    const getCategoryStats = useCallback(() => {
        const stats = {};
        Object.entries(featureCategories).forEach(([category, features]) => {
            const enabled = features.filter((f) => state.activeFeatures.has(f.id)).length;
            stats[category] = {
                total: features.length,
                enabled,
                percentage: features.length > 0 ? Math.round((enabled / features.length) * 100) : 0,
            };
        });
        return stats;
    }, [state.activeFeatures]);
    // Context value
    const contextValue = {
        // State
        activeFeatures: state.activeFeatures,
        categoryPanelVisible: state.categoryPanelVisible,
        // Feature data
        featuresByCategory,
        enabledFeatures,
        disabledFeatures,
        featureCategories: Object.keys(featureCategories),
        // Feature checks
        isFeatureEnabled,
        isCategoryPanelVisible,
        // Feature operations
        handleFeatureToggle,
        handleCategoryToggle,
        toggleFeature,
        toggleCategoryPanel,
        // Category operations
        getFeaturesByCategory,
        getCategories,
        enableCategory,
        disableCategory,
        // Bulk operations
        enableAllFeatures,
        disableAllFeatures,
        // Statistics
        getFeatureStats,
        getCategoryStats,
    };
    return (_jsx(FeatureManagerContext.Provider, { value: contextValue, children: children }));
}
const FeatureManagerContext = createContext(undefined);
// Hook to use FeatureManager context
export function useFeatureManager() {
    const context = useContext(FeatureManagerContext);
    if (context === undefined) {
        throw new Error('useFeatureManager must be used within a FeatureManager');
    }
    return context;
}
export function FeatureCategory({ category, title, features, isVisible, onToggle, onFeatureToggle }) {
    if (!isVisible)
        return null;
    return (_jsxs("div", { className: "feature-category", children: [_jsxs("div", { className: "category-header", children: [_jsx("h3", { children: title }), _jsx("button", { onClick: () => onToggle(category, false), children: "Close" })] }), _jsx("div", { className: "category-features", children: features.map((feature) => (_jsx(FeatureItem, { feature: feature, isEnabled: true, onToggle: onFeatureToggle }, feature.id))) })] }));
}
export function FeatureItem({ feature, isEnabled, onToggle }) {
    return (_jsxs("div", { className: `feature-item ${isEnabled ? 'enabled' : 'disabled'}`, children: [_jsx("div", { className: "feature-icon", children: feature.icon }), _jsxs("div", { className: "feature-info", children: [_jsx("div", { className: "feature-name", children: feature.name }), _jsx("div", { className: "feature-description", children: feature.description }), _jsxs("div", { className: "feature-hotkey", children: ["Hotkey: ", feature.hotkey] })] }), _jsx("button", { className: `feature-toggle ${isEnabled ? 'active' : ''}`, onClick: () => onToggle(feature.id, !isEnabled), "aria-label": `Toggle ${feature.name}`, children: isEnabled ? 'On' : 'Off' })] }));
}
export function FeatureToolbar({ onFeatureToggle, onCategoryToggle }) {
    const { enabledFeatures, handleFeatureToggle, handleCategoryToggle } = useFeatureManager();
    const handleFeatureClick = useCallback((feature) => {
        handleFeatureToggle(feature.id, !enabledFeatures.some((f) => f.id === feature.id));
        if (onFeatureToggle) {
            onFeatureToggle(feature.id, !enabledFeatures.some((f) => f.id === feature.id));
        }
    }, [handleFeatureToggle, enabledFeatures, onFeatureToggle]);
    const handleCategoryClick = useCallback((category) => {
        handleCategoryToggle(category, true);
        if (onCategoryToggle) {
            onCategoryToggle(category, true);
        }
    }, [handleCategoryToggle, onCategoryToggle]);
    return (_jsxs("div", { className: "feature-toolbar", children: [_jsxs("div", { className: "toolbar-section", children: [_jsx("h4", { children: "Active Features" }), _jsx("div", { className: "active-features", children: enabledFeatures.slice(0, 10).map((feature) => (_jsx("button", { className: "feature-button active", onClick: () => handleFeatureClick(feature), title: `${feature.name} (${feature.hotkey})`, children: feature.icon }, feature.id))) })] }), _jsxs("div", { className: "toolbar-section", children: [_jsx("h4", { children: "Categories" }), _jsx("div", { className: "feature-categories", children: Object.entries(FEATURE_CATEGORIES).map(([key, category]) => (_jsx("button", { className: "category-button", onClick: () => handleCategoryClick(category), title: `Open ${key.toLowerCase()} features`, children: key.charAt(0) + key.slice(1).toLowerCase() }, category))) })] })] }));
}
