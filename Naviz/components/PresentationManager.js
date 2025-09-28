import { Vector3, Color3, Color4, StandardMaterial, TransformNode, DirectionalLight, HemisphericLight, SpotLight, PointLight, Animation, AnimationGroup, Texture, CubeTexture, DynamicTexture, MeshBuilder, ParticleSystem } from '@babylonjs/core';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { ScenarioManager } from './managers/ScenarioManager';
export class PresentationManager {
    constructor(engine, scene, bimManager, featureManager) {
        Object.defineProperty(this, "engine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "bimManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "featureManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scenarioManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Furniture integration
        Object.defineProperty(this, "furnitureCatalog", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "placedFurniture", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "selectedFurniture", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Before/After comparison
        Object.defineProperty(this, "beforeState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "afterState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "comparisonMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "comparisonSlider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.5
        }); // 0 = before, 1 = after
        // AR Scale Mode
        Object.defineProperty(this, "arMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                enabled: false,
                scale: 0.1,
                position: new Vector3(0, 0, 0),
                rotation: new Vector3(0, 0, 0),
                physicalTableSize: { width: 1.2, depth: 0.8 },
                modelBounds: { min: new Vector3(0, 0, 0), max: new Vector3(0, 0, 0) }
            }
        });
        // Lighting and environment
        Object.defineProperty(this, "originalLighting", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "scenarioLights", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "skyboxMaterial", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Animation and transitions
        Object.defineProperty(this, "transitionAnimations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        // ===== MISSING FEATURES IMPLEMENTATION =====
        // Comparative Tours: Side-by-side scene comparison
        Object.defineProperty(this, "comparativeTours", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "currentTour", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Interactive Mood Scenes: Auto-switching lighting presets
        Object.defineProperty(this, "moodScenes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "moodSceneTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Seasonal Auto-Decor: Festival/seasonal setup generation
        Object.defineProperty(this, "seasonalDecorations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        // Mortgage/ROI Calculator: Cost analysis and visualization
        Object.defineProperty(this, "roiCalculator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.engine = engine;
        this.scene = scene;
        this.bimManager = bimManager;
        this.featureManager = featureManager;
        this.scenarioManager = new ScenarioManager(engine, scene);
        this.initializeFurnitureCatalog();
        this.setupEventListeners();
    }
    // Initialize furniture catalog with sample items
    initializeFurnitureCatalog() {
        const ikeaItems = [
            {
                id: 'ikea_chair_1',
                name: 'IKEA Markus Office Chair',
                brand: 'IKEA',
                category: 'chair',
                modelUrl: '/models/furniture/ikea_markus_chair.glb',
                thumbnailUrl: '/thumbnails/furniture/ikea_markus_chair.jpg',
                dimensions: { width: 0.6, height: 0.85, depth: 0.6 },
                price: 149,
                materials: ['fabric', 'metal'],
                tags: ['office', 'ergonomic', 'modern']
            },
            {
                id: 'ikea_table_1',
                name: 'IKEA Linnmon Table',
                brand: 'IKEA',
                category: 'table',
                modelUrl: '/models/furniture/ikea_linnmon_table.glb',
                thumbnailUrl: '/thumbnails/furniture/ikea_linnmon_table.jpg',
                dimensions: { width: 1.2, height: 0.74, depth: 0.6 },
                price: 79,
                materials: ['wood', 'particleboard'],
                tags: ['desk', 'workspace', 'simple']
            }
        ];
        const hermanMillerItems = [
            {
                id: 'hm_chair_1',
                name: 'Herman Miller Aeron Chair',
                brand: 'Herman Miller',
                category: 'chair',
                modelUrl: '/models/furniture/hm_aeron_chair.glb',
                thumbnailUrl: '/thumbnails/furniture/hm_aeron_chair.jpg',
                dimensions: { width: 0.65, height: 0.95, depth: 0.6 },
                price: 1499,
                materials: ['mesh', 'aluminum'],
                tags: ['office', 'premium', 'ergonomic']
            }
        ];
        this.furnitureCatalog.set('IKEA', ikeaItems);
        this.furnitureCatalog.set('Herman Miller', hermanMillerItems);
    }
    // Setup event listeners
    setupEventListeners() {
        // Listen for BIM model changes
        this.scene.onNewMeshAddedObservable.add((mesh) => {
            if (this.arMode.enabled) {
                this.applyARScale(mesh);
            }
        });
    }
    // Scenario Management Methods
    // Apply a presentation scenario
    async applyScenario(scenarioId) {
        try {
            await this.scenarioManager.applyScenario(scenarioId);
            console.log(`Applied presentation scenario: ${scenarioId}`);
        }
        catch (error) {
            console.error('Failed to apply scenario:', error);
            throw error;
        }
    }
    // Save original lighting state
    saveOriginalLighting() {
        this.originalLighting = {
            ambient: this.scene.ambientColor.clone(),
            lights: this.scene.lights.map(light => ({
                type: light.constructor.name,
                position: light.position?.clone(),
                direction: light.direction?.clone(),
                intensity: light.intensity,
                diffuse: light.diffuse?.clone(),
                specular: light.specular?.clone()
            }))
        };
    }
    // Clear scenario lights
    clearScenarioLights() {
        this.scenarioLights.forEach(light => light.dispose());
        this.scenarioLights = [];
    }
    // Apply scenario lighting
    async applyScenarioLighting(scenario) {
        // Set ambient lighting
        this.scene.ambientColor = this.getAmbientColorForScenario(scenario);
        // Create directional light based on time of day
        const directionalLight = new DirectionalLight(`scenario_directional_${scenario.id}`, this.getLightDirectionForTime(scenario.timeOfDay), this.scene);
        directionalLight.intensity = scenario.directionalIntensity;
        directionalLight.diffuse = this.getLightColorForTime(scenario.timeOfDay);
        this.scenarioLights.push(directionalLight);
        // Add additional lights based on preset
        switch (scenario.lightingPreset) {
            case 'warm':
                this.addWarmLighting(scenario);
                break;
            case 'cool':
                this.addCoolLighting(scenario);
                break;
            case 'dramatic':
                this.addDramaticLighting(scenario);
                break;
            case 'studio':
                this.addStudioLighting(scenario);
                break;
        }
    }
    // Get ambient color for scenario
    getAmbientColorForScenario(scenario) {
        const ambientColors = {
            dawn: new Color3(0.8, 0.6, 0.4),
            morning: new Color3(0.9, 0.8, 0.7),
            noon: new Color3(1.0, 1.0, 1.0),
            afternoon: new Color3(0.95, 0.9, 0.8),
            evening: new Color3(0.7, 0.5, 0.3),
            night: new Color3(0.2, 0.2, 0.3),
            midnight: new Color3(0.1, 0.1, 0.15)
        };
        return ambientColors[scenario.timeOfDay] || new Color3(0.5, 0.5, 0.5);
    }
    // Get light direction for time of day
    getLightDirectionForTime(timeOfDay) {
        const directions = {
            dawn: new Vector3(-0.5, -0.8, 0.3),
            morning: new Vector3(-0.3, -0.9, 0.2),
            noon: new Vector3(0, -1, 0),
            afternoon: new Vector3(0.3, -0.9, -0.2),
            evening: new Vector3(0.5, -0.8, -0.3),
            night: new Vector3(0, -0.5, 0),
            midnight: new Vector3(0, -0.3, 0)
        };
        return directions[timeOfDay] || new Vector3(0, -1, 0);
    }
    // Get light color for time of day
    getLightColorForTime(timeOfDay) {
        const colors = {
            dawn: new Color3(1.0, 0.8, 0.6),
            morning: new Color3(1.0, 0.95, 0.9),
            noon: new Color3(1.0, 1.0, 1.0),
            afternoon: new Color3(1.0, 0.95, 0.8),
            evening: new Color3(1.0, 0.6, 0.3),
            night: new Color3(0.5, 0.5, 0.7),
            midnight: new Color3(0.3, 0.3, 0.5)
        };
        return colors[timeOfDay] || new Color3(1, 1, 1);
    }
    // Add warm lighting
    addWarmLighting(scenario) {
        const spotLight = new SpotLight(`scenario_spot_warm_${scenario.id}`, new Vector3(2, 3, 2), new Vector3(-0.5, -1, -0.5), Math.PI / 3, 2, this.scene);
        spotLight.intensity = 0.8;
        spotLight.diffuse = new Color3(1.0, 0.8, 0.6);
        this.scenarioLights.push(spotLight);
    }
    // Add cool lighting
    addCoolLighting(scenario) {
        const pointLight = new PointLight(`scenario_point_cool_${scenario.id}`, new Vector3(-2, 2, -2), this.scene);
        pointLight.intensity = 0.6;
        pointLight.diffuse = new Color3(0.6, 0.8, 1.0);
        this.scenarioLights.push(pointLight);
    }
    // Add dramatic lighting
    addDramaticLighting(scenario) {
        // Rim lighting effect
        const rimLight = new DirectionalLight(`scenario_rim_${scenario.id}`, new Vector3(0.8, -0.2, 0.6), this.scene);
        rimLight.intensity = 0.4;
        rimLight.diffuse = new Color3(0.8, 0.6, 1.0);
        this.scenarioLights.push(rimLight);
    }
    // Add studio lighting
    addStudioLighting(scenario) {
        // Three-point lighting setup
        const keyLight = new SpotLight(`scenario_key_${scenario.id}`, new Vector3(3, 3, 3), new Vector3(-0.6, -0.6, -0.6), Math.PI / 6, 2, this.scene);
        const fillLight = new SpotLight(`scenario_fill_${scenario.id}`, new Vector3(-3, 2, 3), new Vector3(0.6, -0.8, -0.6), Math.PI / 4, 2, this.scene);
        const backLight = new SpotLight(`scenario_back_${scenario.id}`, new Vector3(0, 4, -4), new Vector3(0, -1, 1), Math.PI / 6, 2, this.scene);
        keyLight.intensity = 1.2;
        fillLight.intensity = 0.6;
        backLight.intensity = 0.8;
        this.scenarioLights.push(keyLight, fillLight, backLight);
    }
    // Transition camera to scenario position
    async transitionCamera(scenario) {
        const camera = this.scene.activeCamera;
        if (!camera)
            return;
        // Create smooth camera transition animation
        const positionAnimation = new Animation('cameraPositionTransition', 'position', 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const targetAnimation = new Animation('cameraTargetTransition', 'target', 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const positionKeys = [
            { frame: 0, value: camera.position.clone() },
            { frame: 60, value: scenario.cameraPosition }
        ];
        const targetKeys = [
            { frame: 0, value: camera.target?.clone() || new Vector3(0, 0, 0) },
            { frame: 60, value: scenario.cameraTarget }
        ];
        positionAnimation.setKeys(positionKeys);
        targetAnimation.setKeys(targetKeys);
        const animationGroup = new AnimationGroup('cameraTransition');
        animationGroup.addTargetedAnimation(positionAnimation, camera);
        animationGroup.addTargetedAnimation(targetAnimation, camera);
        this.transitionAnimations.push(animationGroup);
        return new Promise((resolve) => {
            animationGroup.onAnimationGroupEndObservable.add(() => {
                resolve();
            });
            animationGroup.start();
        });
    }
    // Apply environment settings
    async applyEnvironment(scenario) {
        // Apply skybox if specified
        if (scenario.skyboxTexture) {
            const skyboxTexture = CubeTexture.CreateFromPrefilteredData(scenario.skyboxTexture, this.scene);
            this.scene.environmentTexture = skyboxTexture;
        }
        // Apply seasonal effects
        this.applySeasonalEffects(scenario);
    }
    // Apply seasonal effects
    applySeasonalEffects(scenario) {
        // This could include particle effects for weather, color adjustments, etc.
        switch (scenario.season) {
            case 'fall':
                // Warm, golden tint
                this.scene.imageProcessingConfiguration.colorCurvesEnabled = true;
                break;
            case 'winter':
                // Cool, blue tint
                this.scene.imageProcessingConfiguration.colorCurvesEnabled = true;
                break;
            case 'spring':
                // Fresh, green tint
                this.scene.imageProcessingConfiguration.colorCurvesEnabled = true;
                break;
            case 'summer':
                // Bright, vibrant colors
                this.scene.imageProcessingConfiguration.colorCurvesEnabled = true;
                break;
        }
    }
    // Apply time-based effects
    applyTimeEffects(scenario) {
        // Adjust material properties based on time of day
        this.scene.meshes.forEach(mesh => {
            if (mesh.material) {
                const material = mesh.material;
                if (scenario.timeOfDay === 'night' || scenario.timeOfDay === 'midnight') {
                    // Dim materials at night
                    material.emissiveColor = material.diffuseColor.scale(0.1);
                }
                else {
                    material.emissiveColor = Color3.Black();
                }
            }
        });
    }
    // Furniture Integration Methods
    // Load furniture catalog from brand
    async loadFurnitureCatalog(brand) {
        const catalog = this.furnitureCatalog.get(brand);
        if (catalog) {
            return catalog;
        }
        // In a real implementation, this would fetch from an API
        console.log(`Loading furniture catalog for ${brand}...`);
        return [];
    }
    // Place furniture item in scene
    async placeFurnitureItem(item, position, rotation) {
        try {
            const result = await SceneLoader.ImportMeshAsync('', item.modelUrl, '', this.scene);
            const furnitureMesh = new TransformNode(`furniture_${item.id}_${Date.now()}`);
            result.meshes.forEach(mesh => {
                mesh.parent = furnitureMesh;
            });
            furnitureMesh.position = position;
            if (rotation) {
                furnitureMesh.rotation = rotation;
            }
            // Scale to real-world dimensions
            const scale = new Vector3(item.dimensions.width / this.getMeshBounds(result.meshes).width, item.dimensions.height / this.getMeshBounds(result.meshes).height, item.dimensions.depth / this.getMeshBounds(result.meshes).depth);
            furnitureMesh.scaling = scale;
            const furnitureId = furnitureMesh.name;
            this.placedFurniture.set(furnitureId, furnitureMesh);
            console.log(`Placed furniture: ${item.name}`);
            return furnitureId;
        }
        catch (error) {
            console.error('Failed to place furniture:', error);
            throw error;
        }
    }
    // Get mesh bounds
    getMeshBounds(meshes) {
        let min = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        let max = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        meshes.forEach(mesh => {
            const bounds = mesh.getBoundingInfo().boundingBox;
            min = Vector3.Minimize(min, bounds.minimumWorld);
            max = Vector3.Maximize(max, bounds.maximumWorld);
        });
        return {
            width: max.x - min.x,
            height: max.y - min.y,
            depth: max.z - min.z
        };
    }
    // Remove furniture item
    removeFurnitureItem(furnitureId) {
        const furniture = this.placedFurniture.get(furnitureId);
        if (furniture) {
            furniture.dispose();
            this.placedFurniture.delete(furnitureId);
            return true;
        }
        return false;
    }
    // Get all placed furniture
    getPlacedFurniture() {
        return new Map(this.placedFurniture);
    }
    // Before/After Comparison Methods
    // Save current state as "before"
    saveBeforeState(name, description) {
        const currentModel = this.bimManager.getAllModels()[0]; // Get first model for demo
        if (!currentModel)
            return;
        this.beforeState = {
            id: `before_${Date.now()}`,
            name,
            description,
            bimModel: JSON.parse(JSON.stringify(currentModel)), // Deep clone
            materials: new Map(),
            lighting: this.captureCurrentLighting(),
            timestamp: new Date()
        };
        // Capture current materials
        this.scene.meshes.forEach(mesh => {
            if (mesh.material) {
                this.beforeState.materials.set(mesh.name, mesh.material.clone(mesh.name + '_before'));
            }
        });
        console.log(`Saved before state: ${name}`);
    }
    // Save current state as "after"
    saveAfterState(name, description) {
        const currentModel = this.bimManager.getAllModels()[0];
        if (!currentModel)
            return;
        this.afterState = {
            id: `after_${Date.now()}`,
            name,
            description,
            bimModel: JSON.parse(JSON.stringify(currentModel)),
            materials: new Map(),
            lighting: this.captureCurrentLighting(),
            timestamp: new Date()
        };
        // Capture current materials
        this.scene.meshes.forEach(mesh => {
            if (mesh.material) {
                this.afterState.materials.set(mesh.name, mesh.material.clone(mesh.name + '_after'));
            }
        });
        console.log(`Saved after state: ${name}`);
    }
    // Enable comparison mode
    enableComparisonMode() {
        if (!this.beforeState || !this.afterState) {
            console.warn('Both before and after states must be saved before enabling comparison mode');
            return;
        }
        this.comparisonMode = true;
        this.comparisonSlider = 0.5; // Start at middle
        this.applyComparisonBlend();
        console.log('Comparison mode enabled');
    }
    // Disable comparison mode
    disableComparisonMode() {
        this.comparisonMode = false;
        // Restore full after state
        if (this.afterState) {
            this.applyState(this.afterState);
        }
        console.log('Comparison mode disabled');
    }
    // Set comparison slider value (0 = before, 1 = after)
    setComparisonSlider(value) {
        if (!this.comparisonMode)
            return;
        this.comparisonSlider = Math.max(0, Math.min(1, value));
        this.applyComparisonBlend();
    }
    // Apply blended state based on slider
    applyComparisonBlend() {
        if (!this.beforeState || !this.afterState)
            return;
        // Blend materials
        this.scene.meshes.forEach(mesh => {
            const beforeMaterial = this.beforeState.materials.get(mesh.name);
            const afterMaterial = this.afterState.materials.get(mesh.name);
            if (beforeMaterial && afterMaterial) {
                this.blendMaterials(mesh, beforeMaterial, afterMaterial, this.comparisonSlider);
            }
        });
        // Blend lighting
        this.blendLighting(this.beforeState.lighting, this.afterState.lighting, this.comparisonSlider);
    }
    // Blend two materials
    blendMaterials(mesh, material1, material2, blendFactor) {
        if (material1 instanceof StandardMaterial && material2 instanceof StandardMaterial) {
            const blendedMaterial = material1.clone('blended');
            // Blend diffuse colors
            blendedMaterial.diffuseColor = Color3.Lerp(material1.diffuseColor, material2.diffuseColor, blendFactor);
            // Blend other properties
            blendedMaterial.specularColor = Color3.Lerp(material1.specularColor, material2.specularColor, blendFactor);
            blendedMaterial.emissiveColor = Color3.Lerp(material1.emissiveColor, material2.emissiveColor, blendFactor);
            blendedMaterial.ambientColor = Color3.Lerp(material1.ambientColor, material2.ambientColor, blendFactor);
            mesh.material = blendedMaterial;
        }
    }
    // Blend lighting states
    blendLighting(lighting1, lighting2, blendFactor) {
        // Blend ambient color
        this.scene.ambientColor = Color3.Lerp(lighting1.ambient, lighting2.ambient, blendFactor);
        // Blend light intensities
        this.scene.lights.forEach((light, index) => {
            if (lighting1.lights[index] && lighting2.lights[index]) {
                light.intensity = lighting1.lights[index].intensity * (1 - blendFactor) +
                    lighting2.lights[index].intensity * blendFactor;
            }
        });
    }
    // Apply a specific state
    applyState(state) {
        // Apply materials
        state.materials.forEach((material, meshName) => {
            const mesh = this.scene.getMeshByName(meshName);
            if (mesh) {
                mesh.material = material;
            }
        });
        // Apply lighting
        this.applyLightingState(state.lighting);
    }
    // Capture current lighting state
    captureCurrentLighting() {
        return {
            ambient: this.scene.ambientColor.clone(),
            lights: this.scene.lights.map(light => ({
                intensity: light.intensity,
                diffuse: light.diffuse?.clone(),
                specular: light.specular?.clone()
            }))
        };
    }
    // Apply lighting state
    applyLightingState(lighting) {
        this.scene.ambientColor = lighting.ambient;
        this.scene.lights.forEach((light, index) => {
            if (lighting.lights[index]) {
                light.intensity = lighting.lights[index].intensity;
                if (lighting.lights[index].diffuse) {
                    light.diffuse = lighting.lights[index].diffuse;
                }
                if (lighting.lights[index].specular) {
                    light.specular = lighting.lights[index].specular;
                }
            }
        });
    }
    // AR Scale Mode Methods
    // Enable AR scale mode
    enableARScaleMode(tableWidth = 1.2, tableDepth = 0.8) {
        this.arMode.enabled = true;
        this.arMode.physicalTableSize = { width: tableWidth, depth: tableDepth };
        // Calculate model bounds
        this.calculateModelBounds();
        // Calculate optimal scale
        this.calculateOptimalScale();
        // Apply AR transformations
        this.applyARTransformations();
        console.log('AR Scale Mode enabled');
    }
    // Disable AR scale mode
    disableARScaleMode() {
        this.arMode.enabled = false;
        // Reset transformations
        this.resetARTransformations();
        console.log('AR Scale Mode disabled');
    }
    // Calculate model bounds
    calculateModelBounds() {
        let min = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
        let max = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
        this.scene.meshes.forEach(mesh => {
            if (mesh.name !== 'ground' && !mesh.name.includes('light')) {
                const bounds = mesh.getBoundingInfo().boundingBox;
                min = Vector3.Minimize(min, bounds.minimumWorld);
                max = Vector3.Maximize(max, bounds.maximumWorld);
            }
        });
        this.arMode.modelBounds = { min, max };
    }
    // Calculate optimal scale for table
    calculateOptimalScale() {
        const modelSize = this.arMode.modelBounds.max.subtract(this.arMode.modelBounds.min);
        const tableSize = new Vector3(this.arMode.physicalTableSize.width, 1, this.arMode.physicalTableSize.depth);
        // Calculate scale to fit model on table (leaving some margin)
        const scaleX = (tableSize.x * 0.8) / modelSize.x;
        const scaleZ = (tableSize.z * 0.8) / modelSize.z;
        const scale = Math.min(scaleX, scaleZ, 0.5); // Cap at 50% to prevent too small models
        this.arMode.scale = scale;
    }
    // Apply AR transformations
    applyARTransformations() {
        const center = this.arMode.modelBounds.min.add(this.arMode.modelBounds.max.subtract(this.arMode.modelBounds.min).scale(0.5));
        // Create AR root node
        const arRoot = new TransformNode('ar_root');
        arRoot.scaling = new Vector3(this.arMode.scale, this.arMode.scale, this.arMode.scale);
        arRoot.position = new Vector3(0, 0.01, 0); // Slightly above table surface
        // Parent all model meshes to AR root
        this.scene.meshes.forEach(mesh => {
            if (mesh.name !== 'ground' && !mesh.name.includes('light') && !mesh.parent) {
                mesh.parent = arRoot;
                // Center the mesh
                mesh.position = mesh.position.subtract(center);
            }
        });
        // Add table surface indicator
        this.createTableSurface();
    }
    // Reset AR transformations
    resetARTransformations() {
        const arRoot = this.scene.getTransformNodeByName('ar_root');
        if (arRoot) {
            // Unparent all meshes
            arRoot.getChildMeshes().forEach(mesh => {
                mesh.parent = null;
                mesh.scaling = Vector3.One();
            });
            arRoot.dispose();
        }
        // Remove table surface
        const tableSurface = this.scene.getMeshByName('table_surface');
        if (tableSurface) {
            tableSurface.dispose();
        }
    }
    // Create table surface indicator
    createTableSurface() {
        const tableSurface = MeshBuilder.CreateGround('table_surface', { width: this.arMode.physicalTableSize.width, height: this.arMode.physicalTableSize.depth }, this.scene);
        const material = new StandardMaterial('table_material', this.scene);
        material.diffuseColor = new Color3(0.8, 0.8, 0.8);
        material.alpha = 0.3;
        tableSurface.material = material;
        tableSurface.position.y = 0;
    }
    // Apply AR scale to new meshes
    applyARScale(mesh) {
        if (!this.arMode.enabled)
            return;
        const arRoot = this.scene.getTransformNodeByName('ar_root');
        if (arRoot && !mesh.parent) {
            mesh.parent = arRoot;
            mesh.scaling = mesh.scaling.scale(this.arMode.scale);
        }
    }
    // Set AR table size
    setARTableSize(width, depth) {
        this.arMode.physicalTableSize = { width, depth };
        if (this.arMode.enabled) {
            this.calculateOptimalScale();
            this.applyARTransformations();
        }
    }
    // Get current AR mode status
    getARModeStatus() {
        return { ...this.arMode };
    }
    // Get all available scenarios
    getAvailableScenarios() {
        return this.scenarioManager.getAvailableScenarios();
    }
    // Get current scenario
    getCurrentScenario() {
        return this.scenarioManager.getCurrentScenario();
    }
    // Get comparison slider value
    getComparisonSlider() {
        return this.comparisonSlider;
    }
    // Check if comparison mode is enabled
    isComparisonModeEnabled() {
        return this.comparisonMode;
    }
    // Get before/after states
    getBeforeState() {
        return this.beforeState;
    }
    getAfterState() {
        return this.afterState;
    }
    // Reset to original state
    resetToOriginal() {
        if (this.originalLighting) {
            this.applyLightingState(this.originalLighting);
        }
        // Reset currentScenario via scenarioManager if needed
        // this.currentScenario = null; // Removed as currentScenario is from scenarioManager
        this.comparisonMode = false;
        this.disableARScaleMode();
        console.log('Reset to original state');
    }
    // Dispose resources
    dispose() {
        this.clearScenarioLights();
        this.placedFurniture.forEach(mesh => mesh.dispose());
        this.transitionAnimations.forEach(anim => anim.dispose());
        if (this.skyboxMaterial) {
            this.skyboxMaterial.dispose();
        }
        // Clear scenarioManager scenarios if needed
        this.scenarioManager.dispose();
        this.furnitureCatalog.clear();
        this.placedFurniture.clear();
        this.transitionAnimations = [];
        console.log('PresentationManager disposed');
    }
    // ===== LIGHTING PRESETS INTEGRATION =====
    // Apply a lighting preset from LightingPresets component
    applyLightingPreset(preset) {
        try {
            // Clear existing scenario lights to avoid conflicts
            this.clearScenarioLights();
            // Set ambient lighting
            this.scene.ambientColor = preset.skyboxColor.scale(0.5); // Use skybox color as ambient
            // Create directional light (sun) based on preset
            const directionalLight = new DirectionalLight(`preset_directional_${preset.id}`, this.getLightDirectionFromAngle(preset.sunAngle), this.scene);
            directionalLight.intensity = preset.sunIntensity;
            directionalLight.diffuse = new Color3(1.0, 0.95, 0.9); // Warm sunlight color
            this.scenarioLights.push(directionalLight);
            // Create hemispheric light for ambient fill
            const hemisphericLight = new HemisphericLight(`preset_hemispheric_${preset.id}`, new Vector3(0, 1, 0), this.scene);
            hemisphericLight.intensity = preset.ambientIntensity;
            hemisphericLight.groundColor = preset.groundColor;
            this.scenarioLights.push(hemisphericLight);
            // Update current scenario reference for consistency
            // this.currentScenario = null; // Removed as currentScenario is from scenarioManager
            console.log(`Applied lighting preset: ${preset.name}`);
        }
        catch (error) {
            console.error('Failed to apply lighting preset:', error);
        }
    }
    // Helper method to convert angle to light direction
    getLightDirectionFromAngle(angleDegrees) {
        const angleRad = (angleDegrees * Math.PI) / 180;
        return new Vector3(Math.sin(angleRad), -Math.cos(angleRad), 0);
    }
    // ===== COMPARATIVE TOURS IMPLEMENTATION =====
    // Create a comparative tour with two scenes side by side
    createComparativeTour(tourId, leftSceneData, rightSceneData) {
        this.comparativeTours.set(tourId, {
            leftScene: leftSceneData,
            rightScene: rightSceneData,
            splitRatio: 0.5
        });
        console.log(`Created comparative tour: ${tourId}`);
    }
    // Activate a comparative tour
    activateComparativeTour(tourId) {
        const tour = this.comparativeTours.get(tourId);
        if (!tour) {
            console.error(`Comparative tour ${tourId} not found`);
            return;
        }
        this.currentTour = tourId;
        this.applyComparativeTour(tour);
        console.log(`Activated comparative tour: ${tourId}`);
    }
    // Apply comparative tour visualization
    applyComparativeTour(tour) {
        // Create split-screen effect using post-processing
        this.createSplitScreenEffect(tour);
    }
    // Create split-screen effect
    createSplitScreenEffect(tour) {
        // This would typically use Babylon.js post-processing effects
        // For now, we'll implement a simple split using mesh visibility and positioning
        // Create left view
        this.scene.meshes.forEach(mesh => {
            if (mesh.position.x < 0) {
                mesh.setEnabled(true);
            }
            else {
                mesh.setEnabled(false);
            }
        });
        // Apply left scene data
        this.applySceneData(tour.leftScene, 'left');
        // Create right view
        setTimeout(() => {
            this.scene.meshes.forEach(mesh => {
                if (mesh.position.x > 0) {
                    mesh.setEnabled(true);
                }
            });
            // Apply right scene data
            this.applySceneData(tour.rightScene, 'right');
        }, 100);
    }
    // Apply scene data to a side
    applySceneData(sceneData, side) {
        // Apply materials, lighting, etc. for the specific side
        if (sceneData.materials) {
            sceneData.materials.forEach((materialData, meshName) => {
                const mesh = this.scene.getMeshByName(meshName);
                if (mesh) {
                    // Apply material based on side
                    this.applyMaterialForSide(mesh, materialData, side);
                }
            });
        }
        if (sceneData.lighting) {
            this.applyLightingForSide(sceneData.lighting, side);
        }
    }
    // Apply material for a specific side
    applyMaterialForSide(mesh, materialData, side) {
        // Create side-specific material variations
        const baseMaterial = mesh.material;
        if (baseMaterial) {
            const sideMaterial = baseMaterial.clone('side');
            // Apply side-specific modifications
            if (side === 'left') {
                sideMaterial.diffuseColor = sideMaterial.diffuseColor.scale(1.2); // Brighter for left
            }
            else {
                sideMaterial.diffuseColor = sideMaterial.diffuseColor.scale(0.8); // Dimmer for right
            }
            mesh.material = sideMaterial;
        }
    }
    // Apply lighting for a specific side
    applyLightingForSide(lightingData, side) {
        // Apply side-specific lighting adjustments
        const intensityMultiplier = side === 'left' ? 1.1 : 0.9;
        this.scene.lights.forEach(light => {
            light.intensity *= intensityMultiplier;
        });
    }
    // Set split ratio for comparative tour
    setComparativeTourSplitRatio(tourId, ratio) {
        const tour = this.comparativeTours.get(tourId);
        if (tour) {
            tour.splitRatio = Math.max(0.1, Math.min(0.9, ratio));
            this.applyComparativeTour(tour);
        }
    }
    // Deactivate comparative tour
    deactivateComparativeTour() {
        if (this.currentTour) {
            // Restore full scene visibility
            this.scene.meshes.forEach(mesh => {
                mesh.setEnabled(true);
            });
            // Reset materials and lighting
            this.resetToOriginal();
            this.currentTour = null;
            console.log('Deactivated comparative tour');
        }
    }
    // ===== INTERACTIVE MOOD SCENES IMPLEMENTATION =====
    // Create an interactive mood scene with auto-switching presets
    createMoodScene(sceneId, presets, autoSwitch = true, interval = 5000) {
        this.moodScenes.set(sceneId, {
            presets: presets,
            currentIndex: 0,
            autoSwitch: autoSwitch,
            interval: interval
        });
        console.log(`Created mood scene: ${sceneId} with ${presets.length} presets`);
    }
    // Activate mood scene
    activateMoodScene(sceneId) {
        const moodScene = this.moodScenes.get(sceneId);
        if (!moodScene) {
            console.error(`Mood scene ${sceneId} not found`);
            return;
        }
        // Apply initial preset
        this.applyMoodPreset(moodScene.presets[moodScene.currentIndex]);
        // Start auto-switching if enabled
        if (moodScene.autoSwitch) {
            this.startMoodSceneAutoSwitch(sceneId);
        }
        console.log(`Activated mood scene: ${sceneId}`);
    }
    // Apply mood preset
    applyMoodPreset(presetName) {
        const preset = this.getMoodPreset(presetName);
        if (preset) {
            // Apply lighting
            this.scene.ambientColor = preset.ambientColor;
            // Clear existing lights
            this.clearScenarioLights();
            // Apply preset lights
            preset.lights.forEach((lightData) => {
                this.createLightFromPreset(lightData);
            });
            // Apply post-processing effects
            if (preset.postProcess) {
                this.applyPostProcessEffects(preset.postProcess);
            }
            console.log(`Applied mood preset: ${presetName}`);
        }
    }
    // Get mood preset data
    getMoodPreset(presetName) {
        const presets = {
            'romantic': {
                ambientColor: new Color3(0.8, 0.6, 0.7),
                lights: [
                    { type: 'spot', position: new Vector3(2, 3, 2), direction: new Vector3(-0.5, -1, -0.5), intensity: 0.8, color: new Color3(1.0, 0.8, 0.9) },
                    { type: 'point', position: new Vector3(-2, 2, -2), intensity: 0.4, color: new Color3(1.0, 0.9, 0.8) }
                ],
                postProcess: { bloom: true, toneMapping: 'romantic' }
            },
            'energetic': {
                ambientColor: new Color3(1.0, 0.9, 0.8),
                lights: [
                    { type: 'directional', direction: new Vector3(0, -1, 0.5), intensity: 1.2, color: new Color3(1.0, 1.0, 0.9) },
                    { type: 'point', position: new Vector3(0, 4, 0), intensity: 0.6, color: new Color3(0.9, 1.0, 1.0) }
                ],
                postProcess: { bloom: true, toneMapping: 'vibrant' }
            },
            'calm': {
                ambientColor: new Color3(0.7, 0.8, 0.9),
                lights: [
                    { type: 'hemispheric', intensity: 0.6, color: new Color3(0.8, 0.9, 1.0) }
                ],
                postProcess: { toneMapping: 'cool' }
            },
            'dramatic': {
                ambientColor: new Color3(0.3, 0.3, 0.4),
                lights: [
                    { type: 'spot', position: new Vector3(3, 4, 3), direction: new Vector3(-0.7, -0.7, -0.7), intensity: 1.0, color: new Color3(1.0, 0.8, 0.6) },
                    { type: 'directional', direction: new Vector3(0.5, -0.8, 0.3), intensity: 0.3, color: new Color3(0.6, 0.4, 0.8) }
                ],
                postProcess: { bloom: false, toneMapping: 'dramatic' }
            }
        };
        return presets[presetName];
    }
    // Create light from preset data
    createLightFromPreset(lightData) {
        let light;
        switch (lightData.type) {
            case 'directional':
                light = new DirectionalLight(`mood_${Date.now()}`, lightData.direction, this.scene);
                break;
            case 'point':
                light = new PointLight(`mood_${Date.now()}`, lightData.position, this.scene);
                break;
            case 'spot':
                light = new SpotLight(`mood_${Date.now()}`, lightData.position, lightData.direction, Math.PI / 3, 2, this.scene);
                break;
            case 'hemispheric':
                light = new HemisphericLight(`mood_${Date.now()}`, lightData.direction || Vector3.Up(), this.scene);
                break;
            default:
                return;
        }
        light.intensity = lightData.intensity;
        if (lightData.color) {
            light.diffuse = lightData.color;
        }
        this.scenarioLights.push(light);
    }
    // Apply post-processing effects
    applyPostProcessEffects(postProcess) {
        // Apply various post-processing effects based on preset
        if (postProcess.bloom) {
            // Enable bloom effect
            this.scene.imageProcessingConfiguration.exposure = 1.2;
        }
        if (postProcess.toneMapping) {
            // Apply tone mapping
            this.scene.imageProcessingConfiguration.toneMappingEnabled = true;
        }
    }
    // Start auto-switching for mood scene
    startMoodSceneAutoSwitch(sceneId) {
        const moodScene = this.moodScenes.get(sceneId);
        if (!moodScene)
            return;
        this.moodSceneTimer = setInterval(() => {
            moodScene.currentIndex = (moodScene.currentIndex + 1) % moodScene.presets.length;
            this.applyMoodPreset(moodScene.presets[moodScene.currentIndex]);
        }, moodScene.interval);
    }
    // Stop mood scene auto-switching
    stopMoodSceneAutoSwitch() {
        if (this.moodSceneTimer) {
            clearInterval(this.moodSceneTimer);
            this.moodSceneTimer = null;
        }
    }
    // Manually switch to next mood preset
    switchToNextMoodPreset(sceneId) {
        const moodScene = this.moodScenes.get(sceneId);
        if (moodScene) {
            moodScene.currentIndex = (moodScene.currentIndex + 1) % moodScene.presets.length;
            this.applyMoodPreset(moodScene.presets[moodScene.currentIndex]);
        }
    }
    // ===== SEASONAL AUTO-DECOR IMPLEMENTATION =====
    // Create seasonal decoration set
    createSeasonalDecor(seasonId, decorations) {
        this.seasonalDecorations.set(seasonId, {
            decorations: decorations,
            active: false
        });
        console.log(`Created seasonal decor: ${seasonId} with ${decorations.length} decorations`);
    }
    // Activate seasonal decorations
    activateSeasonalDecor(seasonId) {
        const decor = this.seasonalDecorations.get(seasonId);
        if (!decor) {
            console.error(`Seasonal decor ${seasonId} not found`);
            return;
        }
        // Deactivate current decorations
        this.deactivateAllSeasonalDecor();
        // Apply new decorations
        decor.decorations.forEach((decoration) => {
            this.applySeasonalDecoration(decoration);
        });
        decor.active = true;
        console.log(`Activated seasonal decor: ${seasonId}`);
    }
    // Apply individual seasonal decoration
    applySeasonalDecoration(decoration) {
        switch (decoration.type) {
            case 'particles':
                this.createParticleDecoration(decoration);
                break;
            case 'models':
                this.createModelDecoration(decoration);
                break;
            case 'lighting':
                this.createLightingDecoration(decoration);
                break;
            case 'materials':
                this.createMaterialDecoration(decoration);
                break;
        }
    }
    // Create particle-based decoration (e.g., falling leaves, snow)
    createParticleDecoration(decoration) {
        // Create particle system based on decoration config
        const particleSystem = new ParticleSystem(`seasonal_particles_${Date.now()}`, 1000, this.scene);
        // Configure particle system based on decoration type
        switch (decoration.effect) {
            case 'falling_leaves':
                particleSystem.particleTexture = new Texture('/textures/particles/leaf.png', this.scene);
                particleSystem.color1 = new Color4(0.8, 0.6, 0.2, 1.0);
                particleSystem.color2 = new Color4(0.6, 0.4, 0.1, 1.0);
                particleSystem.minSize = 0.1;
                particleSystem.maxSize = 0.3;
                break;
            case 'snow':
                particleSystem.particleTexture = new Texture('/textures/particles/snowflake.png', this.scene);
                particleSystem.color1 = new Color4(1.0, 1.0, 1.0, 1.0);
                particleSystem.color2 = new Color4(0.9, 0.9, 0.9, 1.0);
                particleSystem.minSize = 0.02;
                particleSystem.maxSize = 0.05;
                break;
            case 'fireflies':
                particleSystem.particleTexture = new Texture('/textures/particles/spark.png', this.scene);
                particleSystem.color1 = new Color4(1.0, 1.0, 0.5, 1.0);
                particleSystem.color2 = new Color4(1.0, 0.8, 0.2, 1.0);
                particleSystem.minSize = 0.05;
                particleSystem.maxSize = 0.1;
                break;
        }
        particleSystem.emitter = decoration.position || new Vector3(0, 5, 0);
        particleSystem.start();
    }
    // Create model-based decoration (e.g., Christmas tree, pumpkins)
    async createModelDecoration(decoration) {
        try {
            const result = await SceneLoader.ImportMeshAsync('', decoration.modelUrl, '', this.scene);
            const decorRoot = new TransformNode(`seasonal_model_${Date.now()}`);
            result.meshes.forEach(mesh => {
                mesh.parent = decorRoot;
            });
            decorRoot.position = decoration.position || new Vector3(0, 0, 0);
            decorRoot.scaling = decoration.scale || Vector3.One();
            console.log(`Added seasonal model decoration: ${decoration.name}`);
        }
        catch (error) {
            console.error('Failed to load seasonal model:', error);
        }
    }
    // Create lighting decoration (e.g., string lights, lanterns)
    createLightingDecoration(decoration) {
        decoration.lights.forEach((lightData) => {
            const light = new PointLight(`seasonal_light_${Date.now()}`, lightData.position, this.scene);
            light.intensity = lightData.intensity;
            light.diffuse = lightData.color;
            light.range = lightData.range;
            this.scenarioLights.push(light);
        });
    }
    // Create material decoration (e.g., seasonal color schemes)
    createMaterialDecoration(decoration) {
        this.scene.meshes.forEach(mesh => {
            if (mesh.material && decoration.materialTargets.includes(mesh.name)) {
                const material = mesh.material;
                if (material) {
                    // Apply seasonal material modifications
                    material.diffuseColor = Color3.Lerp(material.diffuseColor, decoration.targetColor, decoration.blendFactor);
                }
            }
        });
    }
    // Deactivate all seasonal decorations
    deactivateAllSeasonalDecor() {
        this.seasonalDecorations.forEach(decor => {
            decor.active = false;
        });
        // Remove seasonal particle systems
        this.scene.particleSystems?.forEach(system => {
            if (system.name.includes('seasonal_particles')) {
                system.stop();
                system.dispose();
            }
        });
        // Remove seasonal models
        this.scene.transformNodes.forEach(node => {
            if (node.name.includes('seasonal_model')) {
                node.dispose();
            }
        });
        // Remove seasonal lights
        this.clearScenarioLights();
    }
    // Get predefined seasonal decoration sets
    getPredefinedSeasonalDecor() {
        return [
            {
                id: 'christmas',
                name: 'Christmas Decorations',
                decorations: [
                    {
                        type: 'models',
                        name: 'Christmas Tree',
                        modelUrl: '/models/seasonal/christmas_tree.glb',
                        position: new Vector3(5, 0, 5),
                        scale: new Vector3(0.5, 0.5, 0.5)
                    },
                    {
                        type: 'lighting',
                        lights: [
                            { position: new Vector3(5, 3, 5), intensity: 0.8, color: new Color3(1.0, 0.2, 0.2), range: 3 },
                            { position: new Vector3(6, 3, 5), intensity: 0.8, color: new Color3(0.2, 1.0, 0.2), range: 3 },
                            { position: new Vector3(7, 3, 5), intensity: 0.8, color: new Color3(0.2, 0.2, 1.0), range: 3 }
                        ]
                    }
                ]
            },
            {
                id: 'halloween',
                name: 'Halloween Decorations',
                decorations: [
                    {
                        type: 'models',
                        name: 'Jack-o-lantern',
                        modelUrl: '/models/seasonal/pumpkin.glb',
                        position: new Vector3(-5, 0, 5),
                        scale: new Vector3(0.3, 0.3, 0.3)
                    },
                    {
                        type: 'particles',
                        effect: 'fireflies',
                        position: new Vector3(0, 2, 0)
                    }
                ]
            },
            {
                id: 'spring',
                name: 'Spring Blossoms',
                decorations: [
                    {
                        type: 'particles',
                        effect: 'falling_leaves',
                        position: new Vector3(0, 8, 0)
                    },
                    {
                        type: 'materials',
                        materialTargets: ['tree_leaves'],
                        targetColor: new Color3(0.2, 0.8, 0.3),
                        blendFactor: 0.7
                    }
                ]
            }
        ];
    }
    // ===== MORTGAGE/ROI CALCULATOR IMPLEMENTATION =====
    // Calculate mortgage payments and ROI
    calculateMortgageROI(propertyValue, downPayment, interestRate, loanTerm) {
        const loanAmount = propertyValue - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;
        // Monthly payment calculation using formula: M = P[r(1+r)^n]/[(1+r)^n-1]
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        const totalCost = monthlyPayment * numberOfPayments + downPayment;
        const totalInterest = totalCost - propertyValue;
        // Simple ROI calculation (this would be more complex in reality)
        const annualRent = propertyValue * 0.08; // Assume 8% annual return
        const annualExpenses = propertyValue * 0.02; // Assume 2% annual expenses
        const netAnnualIncome = annualRent - annualExpenses;
        const roi = (netAnnualIncome / propertyValue) * 100;
        this.roiCalculator = {
            propertyValue,
            mortgageAmount: loanAmount,
            interestRate,
            loanTerm,
            monthlyPayment,
            totalCost,
            roi
        };
        console.log('Calculated mortgage and ROI:', this.roiCalculator);
        return this.roiCalculator;
    }
    // Get current ROI calculation
    getROICalculation() {
        return this.roiCalculator;
    }
    // Visualize ROI data in 3D scene
    visualizeROI() {
        if (!this.roiCalculator) {
            console.warn('No ROI calculation available');
            return;
        }
        // Create 3D visualization of the ROI data
        this.createROIChart();
        this.createPaymentTimeline();
    }
    // Create 3D ROI chart
    createROIChart() {
        const chartRoot = new TransformNode('roi_chart');
        // Create bars for different cost components
        const components = [
            { name: 'Principal', value: this.roiCalculator.mortgageAmount, color: new Color3(0.2, 0.6, 1.0) },
            { name: 'Interest', value: this.roiCalculator.totalCost - this.roiCalculator.propertyValue, color: new Color3(1.0, 0.4, 0.4) },
            { name: 'Down Payment', value: this.roiCalculator.propertyValue - this.roiCalculator.mortgageAmount, color: new Color3(0.4, 1.0, 0.4) }
        ];
        const maxValue = Math.max(...components.map(c => c.value));
        const barWidth = 0.5;
        const barSpacing = 1;
        components.forEach((component, index) => {
            const barHeight = (component.value / maxValue) * 3;
            const bar = MeshBuilder.CreateBox(`roi_bar_${component.name}`, { width: barWidth, height: barHeight, depth: barWidth }, this.scene);
            bar.position = new Vector3(index * barSpacing - barSpacing, barHeight / 2, 0);
            bar.parent = chartRoot;
            const material = new StandardMaterial(`roi_material_${component.name}`, this.scene);
            material.diffuseColor = component.color;
            bar.material = material;
            // Add text label
            this.createTextLabel(component.name, bar.position.add(new Vector3(0, barHeight / 2 + 0.2, 0)));
        });
        chartRoot.position = new Vector3(-5, 0, -5);
    }
    // Create payment timeline visualization
    createPaymentTimeline() {
        const timelineRoot = new TransformNode('payment_timeline');
        const years = this.roiCalculator.loanTerm;
        const monthlyPayment = this.roiCalculator.monthlyPayment;
        for (let year = 0; year < years; year++) {
            const yearPosition = year * 0.8;
            const sphere = MeshBuilder.CreateSphere(`timeline_sphere_${year}`, { diameter: 0.1 }, this.scene);
            sphere.position = new Vector3(yearPosition, 0, 2);
            sphere.parent = timelineRoot;
            // Color based on payment progress
            const material = new StandardMaterial(`timeline_material_${year}`, this.scene);
            const progress = year / years;
            material.diffuseColor = Color3.Lerp(new Color3(0, 1, 0), new Color3(1, 0, 0), progress);
            sphere.material = material;
        }
        timelineRoot.position = new Vector3(-5, 1, -5);
    }
    // Create text label in 3D space
    createTextLabel(text, position) {
        const texture = new DynamicTexture(`label_texture_${text}`, { width: 512, height: 128 }, this.scene);
        const ctx = texture.getContext();
        ctx.font = '48px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(text, 10, 64);
        texture.update();
        const material = new StandardMaterial(`label_material_${text}`, this.scene);
        material.diffuseTexture = texture;
        material.emissiveColor = new Color3(1, 1, 1);
        const plane = MeshBuilder.CreatePlane(`label_plane_${text}`, { width: 2, height: 0.5 }, this.scene);
        plane.position = position;
        plane.material = material;
    }
    // Update ROI calculation with new parameters
    updateROICalculation(updates) {
        if (!this.roiCalculator)
            return null;
        const updatedCalc = { ...this.roiCalculator, ...updates };
        return this.calculateMortgageROI(updatedCalc.propertyValue, updatedCalc.propertyValue - updatedCalc.mortgageAmount, updatedCalc.interestRate, updatedCalc.loanTerm);
    }
    // ===== PUBLIC API METHODS =====
    // Get comparative tours
    getComparativeTours() {
        return Array.from(this.comparativeTours.keys());
    }
    // Get mood scenes
    getMoodScenes() {
        return Array.from(this.moodScenes.keys());
    }
    // Get seasonal decorations
    getSeasonalDecorations() {
        return Array.from(this.seasonalDecorations.keys());
    }
    // Check if comparative tour is active
    isComparativeTourActive() {
        return this.currentTour !== null;
    }
    // Get current mood scene
    getCurrentMoodScene() {
        return Array.from(this.moodScenes.entries()).find(([_, data]) => data.autoSwitch)?.[0] || null;
    }
    // Get active seasonal decoration
    getActiveSeasonalDecor() {
        return Array.from(this.seasonalDecorations.entries()).find(([_, data]) => data.active)?.[0] || null;
    }
}
