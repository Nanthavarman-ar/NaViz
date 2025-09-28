import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Vector3, StandardMaterial, Mesh, DynamicTexture } from '@babylonjs/core';
import './UIControls.css';
export const UIControls = ({ engine, scene, featureManager, analyticsManager, marketManager, externalAPIManager, sessionManager }) => {
    const [activePanels, setActivePanels] = useState([
        { id: 'analytics', title: 'Analytics', icon: '📊', isOpen: false, position: { x: 10, y: 10 } },
        { id: 'market', title: 'Market', icon: '🛒', isOpen: false, position: { x: 10, y: 120 } },
        { id: 'external', title: 'External APIs', icon: '🌐', isOpen: false, position: { x: 10, y: 230 } },
        { id: 'session', title: 'Session', icon: '🎮', isOpen: false, position: { x: 10, y: 340 } },
        { id: 'features', title: 'Features', icon: '⚙️', isOpen: false, position: { x: 10, y: 450 } }
    ]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [isVRMode, setIsVRMode] = useState(false);
    const [isARMode, setIsARMode] = useState(false);
    const [showroomActive, setShowroomActive] = useState(false);
    const [mapVisible, setMapVisible] = useState(false);
    const analyticsRef = useRef(null);
    const marketRef = useRef(null);
    const externalRef = useRef(null);
    const sessionRef = useRef(null);
    const featuresRef = useRef(null);
    useEffect(() => {
        // Initialize UI controls
        initializeUIControls();
    }, []);
    const initializeUIControls = () => {
        // Create floating UI panels in 3D space
        createFloatingPanels();
    };
    const createFloatingPanels = () => {
        activePanels.forEach(panel => {
            const panelMesh = Mesh.CreatePlane(`ui_panel_${panel.id}`, 2, scene);
            panelMesh.position = new Vector3(panel.position.x, panel.position.y, 0);
            const material = new StandardMaterial(`ui_panel_material_${panel.id}`, scene);
            const texture = new DynamicTexture(`ui_panel_texture_${panel.id}`, { width: 512, height: 256 }, scene, false);
            material.diffuseTexture = texture;
            material.disableLighting = true;
            panelMesh.material = material;
            // Initially hide panels
            panelMesh.setEnabled(false);
        });
    };
    const togglePanel = (panelId) => {
        setActivePanels(prev => prev.map(panel => panel.id === panelId
            ? { ...panel, isOpen: !panel.isOpen }
            : panel));
        // Update 3D panel visibility
        const panelMesh = scene.getMeshByName(`ui_panel_${panelId}`);
        if (panelMesh) {
            panelMesh.setEnabled(!panelMesh.isEnabled());
        }
    };
    const handleStartVRSession = async () => {
        const success = await sessionManager.startVRSession();
        if (success) {
            setIsVRMode(true);
            console.log('VR session started');
        }
    };
    const handleStartARSession = async () => {
        const success = await sessionManager.startARSession();
        if (success) {
            setIsARMode(true);
            console.log('AR session started');
        }
    };
    const handleEndSession = async () => {
        await sessionManager.endSession();
        setIsVRMode(false);
        setIsARMode(false);
        console.log('Session ended');
    };
    const handleToggleShowroom = () => {
        marketManager.toggleShowroom();
        setShowroomActive(!showroomActive);
    };
    const handleToggleMap = () => {
        externalAPIManager.toggleMapVisualization();
        setMapVisible(!mapVisible);
    };
    const handleSearchLocation = async () => {
        if (!searchLocation.trim())
            return;
        const location = await externalAPIManager.geocodeAddress(searchLocation);
        if (location) {
            // Load map for the location
            await externalAPIManager.loadOpenStreetMap(location);
            // Create a marker
            externalAPIManager.createLocationMarker(location, searchLocation);
            console.log('Location found and marked:', location);
        }
    };
    const handleAddToCart = (productId) => {
        const success = marketManager.addToCart('user_123', productId);
        if (success) {
            console.log('Product added to cart:', productId);
        }
    };
    const handleVirtualTryOn = (productId) => {
        const userPosition = new Vector3(0, 1.6, 0); // Eye level
        const success = marketManager.enableVirtualTryOn(productId, userPosition);
        if (success) {
            console.log('Virtual try-on enabled for:', productId);
        }
    };
    const renderAnalyticsPanel = () => (_jsxs("div", { ref: analyticsRef, className: `ui-panel analytics-panel ${activePanels.find(p => p.id === 'analytics')?.isOpen ? '' : 'hidden'}`, children: [_jsx("h3", { children: "\uD83D\uDCCA Analytics Dashboard" }), _jsxs("div", { className: "analytics-controls", children: [_jsx("button", { className: "ui-button", onClick: () => {
                            const userId = 'user_123';
                            const location = new Vector3(0, 0, 0);
                            analyticsManager.trackEmotion(userId, 'happy', 0.8, location, 'ui_start');
                        }, children: "Start Emotion Tracking" }), _jsx("button", { className: "ui-button", onClick: () => {
                            const userId = 'user_123';
                            const location = new Vector3(0, 0, 0);
                            analyticsManager.trackEmotion(userId, 'neutral', 0.5, location, 'ui_stop');
                        }, children: "Stop Emotion Tracking" }), _jsx("button", { className: "ui-button", onClick: () => analyticsManager.toggleHeatmapVisualization(), children: "Toggle Heatmap" })] }), _jsxs("div", { className: "analytics-metrics", children: [_jsx("h4", { children: "Current Metrics:" }), _jsxs("div", { children: ["Active Users: ", analyticsManager.getClientEngagement().length] }), _jsxs("div", { children: ["Tracked Emotions: ", analyticsManager.getEmotionData().length] }), _jsxs("div", { children: ["Heatmap Points: ", analyticsManager.getUsageHeatmap().length] })] }), _jsx("div", { className: "analytics-export", children: _jsx("button", { className: "ui-button", onClick: () => console.log(analyticsManager.exportAnalytics()), children: "Export Data" }) })] }));
    const renderMarketPanel = () => (_jsxs("div", { ref: marketRef, className: `ui-panel market-panel ${activePanels.find(p => p.id === 'market')?.isOpen ? '' : 'hidden'}`, children: [_jsx("h3", { children: "\uD83D\uDED2 Virtual Marketplace" }), _jsxs("div", { className: "market-controls", children: [_jsxs("button", { onClick: handleToggleShowroom, className: `ui-button ${showroomActive ? 'active' : ''}`, children: [showroomActive ? 'Hide' : 'Show', " Virtual Showroom"] }), _jsxs("div", { className: "product-list", children: [_jsx("h4", { children: "Available Products:" }), marketManager.getProducts().map(product => (_jsxs("div", { className: "product-item", children: [_jsxs("span", { children: [product.name, " - $", product.price] }), _jsx("button", { className: "ui-button", onClick: () => handleAddToCart(product.id), children: "Add to Cart" }), _jsx("button", { className: "ui-button", onClick: () => handleVirtualTryOn(product.id), children: "Try On" })] }, product.id)))] }), _jsxs("div", { className: "cart-info", children: [_jsx("h4", { children: "Shopping Cart:" }), _jsxs("div", { children: ["Items: ", marketManager.getCart('user_123')?.items.length || 0] }), _jsxs("div", { children: ["Total: $", marketManager.getCart('user_123')?.total.toFixed(2) || '0.00'] })] })] })] }));
    const renderExternalPanel = () => (_jsxs("div", { ref: externalRef, className: `ui-panel external-panel ${activePanels.find(p => p.id === 'external')?.isOpen ? '' : 'hidden'}`, children: [_jsx("h3", { children: "\uD83C\uDF10 External APIs" }), _jsxs("div", { className: "external-controls", children: [_jsxs("button", { onClick: handleToggleMap, className: `ui-button ${mapVisible ? 'active' : ''}`, children: [mapVisible ? 'Hide' : 'Show', " Map"] }), _jsxs("div", { className: "location-search", children: [_jsx("input", { type: "text", placeholder: "Search location...", value: searchLocation, onChange: (e) => setSearchLocation(e.target.value), className: "ui-input" }), _jsx("button", { className: "ui-button", onClick: handleSearchLocation, children: "Search" })] }), _jsxs("div", { className: "api-status", children: [_jsx("h4", { children: "API Status:" }), _jsx("div", { children: "OpenStreetMap: \u2705 Enabled" }), _jsxs("div", { children: ["Weather API: ", externalAPIManager.getConfig().weatherApiEnabled ? '✅' : '❌', " Disabled"] }), _jsxs("div", { children: ["Traffic API: ", externalAPIManager.getConfig().trafficApiEnabled ? '✅' : '❌', " Disabled"] })] })] })] }));
    const renderSessionPanel = () => (_jsxs("div", { ref: sessionRef, className: `ui-panel session-panel ${activePanels.find(p => p.id === 'session')?.isOpen ? '' : 'hidden'}`, children: [_jsx("h3", { children: "\uD83C\uDFAE Session Management" }), _jsxs("div", { className: "session-controls", children: [_jsxs("div", { className: "session-buttons", children: [_jsx("button", { onClick: handleStartVRSession, disabled: isVRMode || isARMode, className: `ui-button ${isVRMode ? 'active' : ''}`, children: "Start VR Session" }), _jsx("button", { onClick: handleStartARSession, disabled: isVRMode || isARMode, className: `ui-button ${isARMode ? 'active' : ''}`, children: "Start AR Session" }), _jsx("button", { onClick: handleEndSession, disabled: !isVRMode && !isARMode, className: "ui-button", children: "End Session" })] }), _jsxs("div", { className: "quality-controls", children: [_jsx("h4", { children: "Quality Settings:" }), _jsxs("select", { onChange: (e) => sessionManager.setQualitySettings(e.target.value), className: "ui-select", title: "Select quality settings for the session", "aria-label": "Quality settings selector", children: [_jsx("option", { value: "low", children: "Low" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "high", children: "High" }), _jsx("option", { value: "ultra", children: "Ultra" })] })] })] })] }));
    const renderFeaturesPanel = () => (_jsxs("div", { ref: featuresRef, className: `ui-panel features-panel ${activePanels.find(p => p.id === 'features')?.isOpen ? '' : 'hidden'}`, children: [_jsx("h3", { children: "\u2699\uFE0F Feature Controls" }), _jsxs("div", { className: "feature-toggles", children: [_jsx("h4", { children: "Available Features:" }), featureManager.getAllFeatures().map(feature => (_jsxs("div", { className: "feature-item", children: [_jsx("span", { children: feature.name }), _jsx("button", { onClick: () => {
                                    const isEnabled = featureManager.isFeatureEnabled(feature.id);
                                    featureManager.setFeatureEnabled(feature.id, !isEnabled);
                                }, className: `ui-button ${featureManager.isFeatureEnabled(feature.id) ? 'active' : ''}`, children: featureManager.isFeatureEnabled(feature.id) ? 'ON' : 'OFF' })] }, feature.id)))] }), _jsxs("div", { className: "feature-stats", children: [_jsx("h4", { children: "Feature Usage:" }), _jsxs("div", { children: ["Active Features: ", featureManager.getAllFeatures().filter(f => featureManager.isFeatureEnabled(f.id)).length] }), _jsxs("div", { children: ["Total Features: ", featureManager.getAllFeatures().length] })] })] }));
    return (_jsxs("div", { className: "ui-controls-container", children: [_jsx("div", { className: "control-buttons", children: activePanels.map(panel => (_jsxs("button", { onClick: () => togglePanel(panel.id), className: `control-button ${panel.isOpen ? 'active' : ''}`, children: [panel.icon, " ", panel.title] }, panel.id))) }), renderAnalyticsPanel(), renderMarketPanel(), renderExternalPanel(), renderSessionPanel(), renderFeaturesPanel(), _jsx("div", { className: "status-bar", children: _jsxs("div", { className: "status-bar-content", children: [_jsxs("div", { children: ["FPS: ", engine.getFps().toFixed(1), " | Session: ", sessionManager.getSessionType() || 'Desktop', " | Features: ", featureManager.getAllFeatures().filter(f => featureManager.isFeatureEnabled(f.id)).length] }), _jsxs("div", { children: ["VR: ", isVRMode ? '🟢' : '🔴', " | AR: ", isARMode ? '🟢' : '🔴', " | Map: ", mapVisible ? '🟢' : '🔴'] })] }) })] }));
};
export default UIControls;
