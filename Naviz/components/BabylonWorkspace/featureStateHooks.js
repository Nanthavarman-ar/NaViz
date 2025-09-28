import { useState, useMemo } from "react";
export function useFeatureStates(initialStates, featuresByCategory) {
    const [featureStates, setFeatureStates] = useState(initialStates);
    const toggleFeature = (feature) => {
        setFeatureStates(prev => ({
            ...prev,
            [feature]: !prev[feature]
        }));
    };
    const setFeatureState = (feature, enabled) => {
        setFeatureStates(prev => ({
            ...prev,
            [feature]: enabled
        }));
    };
    const enableFeature = (feature) => setFeatureState(feature, true);
    const disableFeature = (feature) => setFeatureState(feature, false);
    const activeFeatures = useMemo(() => {
        return Object.keys(featureStates).filter(f => featureStates[f]);
    }, [featureStates]);
    return {
        featureStates,
        setFeatureStates,
        toggleFeature,
        setFeatureState,
        enableFeature,
        disableFeature,
        activeFeatures,
        featuresByCategory,
    };
}
