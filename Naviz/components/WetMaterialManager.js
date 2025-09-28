import * as BABYLON from "@babylonjs/core";
export class WetMaterialManager {
    constructor(scene) {
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "waterLevel", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "transitionDistance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 2.0
        });
        Object.defineProperty(this, "transitionSpeed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1.0
        });
        Object.defineProperty(this, "wetnessMultiplier", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1.0
        });
        Object.defineProperty(this, "wetMaterials", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "materialStates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "updateInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        }); // ms
        Object.defineProperty(this, "lastUpdateTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "waterLevelSimulation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                enabled: false,
                amplitude: 0.5,
                frequency: 1.0,
                baseLevel: 0,
                waveType: 'sine',
                speed: 1.0
            }
        });
        this.scene = scene;
        this.setupUpdateLoop();
    }
    /**
     * Register a material pair for wet/dry transitions
     */
    registerWetMaterial(mesh, options) {
        const meshId = mesh.id;
        // Store the original material if not already stored
        if (!this.wetMaterials.has(meshId)) {
            this.wetMaterials.set(meshId, options);
            // Initialize material state
            this.materialStates.set(meshId, {
                meshId,
                wetnessLevel: 0,
                isTransitioning: false,
                lastUpdateTime: Date.now()
            });
            // Set initial material
            mesh.material = options.dryMaterial;
        }
    }
    /**
     * Update water level for all registered materials
     */
    setWaterLevel(level) {
        this.waterLevel = level;
    }
    /**
     * Enable or disable real-time water level simulation
     */
    enableWaterLevelSimulation(enabled) {
        this.waterLevelSimulation.enabled = enabled;
        if (!enabled) {
            this.waterLevel = this.waterLevelSimulation.baseLevel;
        }
    }
    /**
     * Set parameters for water level simulation
     */
    setWaterLevelSimulationParams(params) {
        this.waterLevelSimulation = { ...this.waterLevelSimulation, ...params };
    }
    /**
     * Update water level based on simulation
     */
    updateWaterLevelSimulation(deltaTime) {
        if (!this.waterLevelSimulation.enabled)
            return;
        const sim = this.waterLevelSimulation;
        const time = (Date.now() / 1000) * sim.speed;
        let waveValue = 0;
        switch (sim.waveType) {
            case 'sine':
                waveValue = Math.sin(2 * Math.PI * sim.frequency * time);
                break;
            case 'triangle':
                waveValue = 2 * Math.abs(2 * (time * sim.frequency - Math.floor(time * sim.frequency + 0.5))) - 1;
                break;
            case 'square':
                waveValue = Math.sign(Math.sin(2 * Math.PI * sim.frequency * time));
                break;
        }
        this.waterLevel = sim.baseLevel + sim.amplitude * waveValue;
    }
    /**
     * Update transition parameters
     */
    setTransitionParameters(distance, speed, multiplier = 1.0) {
        this.transitionDistance = distance;
        this.transitionSpeed = speed;
        this.wetnessMultiplier = multiplier;
    }
    /**
     * Calculate wetness level based on mesh position relative to water
     */
    calculateWetnessLevel(mesh) {
        const meshPosition = mesh.getAbsolutePosition();
        const distanceToWater = Math.abs(meshPosition.y - this.waterLevel);
        if (distanceToWater <= 0) {
            // Mesh is underwater
            return 1.0 * this.wetnessMultiplier;
        }
        else if (distanceToWater <= this.transitionDistance) {
            // Mesh is in transition zone
            const normalizedDistance = distanceToWater / this.transitionDistance;
            return (1.0 - normalizedDistance) * this.wetnessMultiplier;
        }
        else {
            // Mesh is dry
            return 0.0;
        }
    }
    /**
     * Interpolate between dry and wet materials
     */
    interpolateMaterials(dryMat, wetMat, wetness) {
        // For PBR materials, interpolate properties
        if (dryMat instanceof BABYLON.PBRMaterial && wetMat instanceof BABYLON.PBRMaterial) {
            const interpolatedMat = dryMat.clone(`wet_${dryMat.name}_${wetness.toFixed(2)}`);
            // Interpolate albedo color
            const dryColor = dryMat.albedoColor || new BABYLON.Color3(1, 1, 1);
            const wetColor = wetMat.albedoColor || new BABYLON.Color3(1, 1, 1);
            interpolatedMat.albedoColor = BABYLON.Color3.Lerp(dryColor, wetColor, wetness);
            // Interpolate metallic and roughness
            interpolatedMat.metallic = BABYLON.Scalar.Lerp(dryMat.metallic || 0, wetMat.metallic || 0, wetness);
            interpolatedMat.roughness = BABYLON.Scalar.Lerp(dryMat.roughness || 1, wetMat.roughness || 1, wetness);
            // Adjust reflectivity based on wetness
            // PBRMaterial does not have reflectivity property, use reflectivityColor or reflectivityTexture if needed
            // For now, skip reflectivity interpolation or use reflectivityColor if available
            if (dryMat.reflectivityColor && wetMat.reflectivityColor) {
                interpolatedMat.reflectivityColor = BABYLON.Color3.Lerp(dryMat.reflectivityColor, wetMat.reflectivityColor, wetness);
            }
            return interpolatedMat;
        }
        // For standard materials
        if (dryMat instanceof BABYLON.StandardMaterial && wetMat instanceof BABYLON.StandardMaterial) {
            const interpolatedMat = dryMat.clone(`wet_${dryMat.name}_${wetness.toFixed(2)}`);
            // Interpolate diffuse color
            const dryColor = dryMat.diffuseColor;
            const wetColor = wetMat.diffuseColor;
            interpolatedMat.diffuseColor = BABYLON.Color3.Lerp(dryColor, wetColor, wetness);
            // Interpolate specular properties
            interpolatedMat.specularColor = BABYLON.Color3.Lerp(dryMat.specularColor, wetMat.specularColor, wetness);
            return interpolatedMat;
        }
        // Fallback: return wet material if wetness > 0.5, otherwise dry
        return wetness > 0.5 ? wetMat : dryMat;
    }
    /**
     * Update material for a specific mesh
     */
    updateMeshMaterial(mesh) {
        const meshId = mesh.id;
        const options = this.wetMaterials.get(meshId);
        const state = this.materialStates.get(meshId);
        if (!options || !state)
            return;
        const currentWetness = this.calculateWetnessLevel(mesh);
        const targetWetness = Math.max(0, Math.min(1, currentWetness));
        // Check if transition is needed
        if (Math.abs(state.wetnessLevel - targetWetness) > 0.01) {
            state.isTransitioning = true;
            // Smooth transition
            const deltaTime = (Date.now() - state.lastUpdateTime) / 1000;
            const transitionAmount = this.transitionSpeed * deltaTime;
            if (state.wetnessLevel < targetWetness) {
                state.wetnessLevel = Math.min(targetWetness, state.wetnessLevel + transitionAmount);
            }
            else {
                state.wetnessLevel = Math.max(targetWetness, state.wetnessLevel - transitionAmount);
            }
            // Update material
            const interpolatedMaterial = this.interpolateMaterials(options.dryMaterial, options.wetMaterial, state.wetnessLevel);
            mesh.material = interpolatedMaterial;
            state.lastUpdateTime = Date.now();
        }
        else {
            state.isTransitioning = false;
        }
    }
    /**
     * Setup update loop for material transitions
     */
    setupUpdateLoop() {
        this.scene.onBeforeRenderObservable.add(() => {
            const currentTime = Date.now();
            if (currentTime - this.lastUpdateTime >= this.updateInterval) {
                const deltaTime = (currentTime - this.lastUpdateTime) / 1000;
                this.updateWaterLevelSimulation(deltaTime);
                this.updateAllMaterials();
                this.lastUpdateTime = currentTime;
            }
        });
    }
    /**
     * Update all registered materials
     */
    updateAllMaterials() {
        this.scene.meshes.forEach(mesh => {
            if (this.wetMaterials.has(mesh.id)) {
                this.updateMeshMaterial(mesh);
            }
        });
    }
    /**
     * Get current wetness level for a mesh
     */
    getWetnessLevel(meshId) {
        const state = this.materialStates.get(meshId);
        return state ? state.wetnessLevel : 0;
    }
    /**
     * Force update all materials immediately
     */
    forceUpdate() {
        this.updateAllMaterials();
    }
    /**
     * Remove a mesh from wet material management
     */
    removeWetMaterial(meshId) {
        this.wetMaterials.delete(meshId);
        this.materialStates.delete(meshId);
    }
    /**
     * Get all registered wet materials
     */
    getRegisteredMaterials() {
        return Array.from(this.wetMaterials.keys());
    }
    /**
     * Dispose resources
     */
    dispose() {
        this.wetMaterials.clear();
        this.materialStates.clear();
    }
}
