// Helper function to get all feature IDs
export const getAllFeatureIds = (featureState) => {
    const features = [];
    Object.entries(featureState).forEach(([category, categoryFeatures]) => {
        Object.keys(categoryFeatures).forEach(featureId => {
            features.push(featureId);
        });
    });
    return features;
};
// Helper function to check if a feature is enabled
export const isFeatureEnabled = (featureState, category, featureId) => {
    return featureState[category]?.[featureId] || false;
};
// Helper function to toggle a feature
export const toggleFeature = (featureState, category, featureId) => {
    const newState = { ...featureState };
    const currentValue = isFeatureEnabled(featureState, category, featureId);
    if (newState[category] && featureId in newState[category]) {
        newState[category][featureId] = !currentValue;
    }
    return newState;
};
// Helper function to enable a feature
export const enableFeature = (featureState, category, featureId) => {
    const newState = { ...featureState };
    if (newState[category] && featureId in newState[category]) {
        newState[category][featureId] = true;
    }
    return newState;
};
// Helper function to disable a feature
export const disableFeature = (featureState, category, featureId) => {
    const newState = { ...featureState };
    if (newState[category] && featureId in newState[category]) {
        newState[category][featureId] = false;
    }
    return newState;
};
// Default feature state
export const defaultFeatureState = {
    essential: {
        materialEditor: false,
        minimap: false,
        measure: false,
        autoFurnish: false,
        aiCoDesigner: false,
        moodScene: false,
        seasonalDecor: false,
        arScale: false,
        scenario: false,
        animationTimeline: false,
        bimIntegration: false,
        propertyInspector: false,
        sceneBrowser: false,
        materialManager: false,
        lightingPresets: false,
    },
    simulation: {
        weather: false,
        flood: false,
        enhancedFlood: false,
        wind: false,
        noise: false,
        traffic: false,
        circulation: false,
        shadow: false,
        sunlight: false,
        windTunnel: false,
    },
    analysis: {
        ergonomic: false,
        energy: false,
        cost: false,
        beforeAfter: false,
        comparativeTour: false,
        roiCalculator: false,
        soundPrivacy: false,
        furniture: false,
    },
    ai: {
        aiAdvisor: false,
        voiceAssistant: false,
    },
    environment: {
        siteContext: false,
        topography: false,
        geoLocation: false,
        construction: false,
        lighting: false,
    },
    collaboration: {
        multiUser: false,
        chat: false,
        sharing: false,
        annotations: false,
        presenter: false,
    },
    immersive: {
        vr: false,
        ar: false,
        spatialAudio: false,
        haptic: false,
        xr: false,
        handTracking: false,
        multiSensory: false,
    },
    navigation: {
        movementControlChecker: false,
        teleportManager: false,
        swimMode: false,
    },
    advanced: {
        pathTracing: false,
        pHashIntegration: false,
        progressiveLoader: false,
        presentationManager: false,
        presenterMode: false,
        quantumSimulationInterface: false,
    },
    utilities: {
        export: false,
        import: false,
        settings: false,
    },
};
