import { featureCategoriesArray } from '../../../config/featureCategories';
export class FeatureManager {
    constructor(capabilities) {
        Object.defineProperty(this, "capabilities", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "engine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "features", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.capabilities = capabilities;
        this.initializeFeatures();
    }
    initializeFeatures() {
        featureCategoriesArray.forEach(feature => {
            this.features.set(feature.id, feature);
        });
    }
    setEngine(engine) {
        this.engine = engine;
    }
    setScene(scene) {
        this.scene = scene;
    }
    getCapabilities() {
        return this.capabilities;
    }
    isFeatureEnabled(featureId) {
        const feature = this.features.get(featureId);
        if (!feature)
            return false;
        return feature.enabled;
    }
    getAvailableFeatures() {
        return Array.from(this.features.values()).filter(feature => feature.enabled);
    }
    getFeaturesByCategory(category) {
        return featureCategoriesArray.filter(feature => feature.category === category && feature.enabled);
    }
    getFeatureById(featureId) {
        return this.features.get(featureId);
    }
    updateCapabilities(newCapabilities) {
        this.capabilities = { ...this.capabilities, ...newCapabilities };
    }
    getEngine() {
        return this.engine;
    }
    getScene() {
        return this.scene;
    }
}
