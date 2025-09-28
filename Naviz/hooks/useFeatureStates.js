import { useState, useCallback } from 'react';
export const useFeatureStates = (initialFeatureStates = {}, initialFeaturesByCategory = {}) => {
    const [featureStates, setFeatureStates] = useState(initialFeatureStates);
    const [featuresByCategory] = useState(initialFeaturesByCategory);
    const toggleFeature = useCallback((featureId) => {
        setFeatureStates(prev => ({
            ...prev,
            [featureId]: !prev[featureId]
        }));
    }, []);
    const setFeatureState = useCallback((featureId, enabled) => {
        setFeatureStates(prev => ({
            ...prev,
            [featureId]: enabled
        }));
    }, []);
    const enableFeature = useCallback((featureId) => {
        setFeatureState(featureId, true);
    }, [setFeatureState]);
    const disableFeature = useCallback((featureId) => {
        setFeatureState(featureId, false);
    }, [setFeatureState]);
    const activeFeatures = new Set(Object.entries(featureStates)
        .filter(([, enabled]) => enabled)
        .map(([featureId]) => featureId));
    return {
        featureStates,
        setFeatureStates,
        toggleFeature,
        setFeatureState,
        enableFeature,
        disableFeature,
        activeFeatures,
        featuresByCategory
    };
};
