import { DirectionalLight, SpotLight, PointLight, Animation, AnimationGroup, CubeTexture, Color3, Vector3 } from '@babylonjs/core';
import { logger } from '../utils/Logger';
/**
 * Manages presentation scenarios including lighting, camera transitions, and environmental effects
 */
export class ScenarioManager {
    constructor(engine, scene) {
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
        Object.defineProperty(this, "scenarios", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "currentScenario", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "scenarioTransitioning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
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
        Object.defineProperty(this, "transitionAnimations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.engine = engine;
        this.scene = scene;
        this.initializeDefaultScenarios();
        logger.info('ScenarioManager initialized');
    }
    /**
     * Initialize default presentation scenarios
     */
    initializeDefaultScenarios() {
        const defaultScenarios = [
            {
                id: 'work_hours',
                name: 'Work Hours',
                description: 'Bright, productive office environment during work hours',
                timeOfDay: 'morning',
                weather: 'clear',
                season: 'summer',
                lightingPreset: 'natural',
                cameraPosition: new Vector3(5, 3, 5),
                cameraTarget: new Vector3(0, 1, 0),
                ambientIntensity: 0.6,
                directionalIntensity: 1.2,
                particleEffects: false
            },
            {
                id: 'family_dinner',
                name: 'Family Dinner',
                description: 'Warm, cozy evening setting for family gatherings',
                timeOfDay: 'evening',
                weather: 'clear',
                season: 'fall',
                lightingPreset: 'warm',
                cameraPosition: new Vector3(3, 2, 4),
                cameraTarget: new Vector3(0, 1, 0),
                ambientIntensity: 0.4,
                directionalIntensity: 0.8,
                particleEffects: false
            },
            {
                id: 'night_mode',
                name: 'Night Mode',
                description: 'Dim, atmospheric night time illumination',
                timeOfDay: 'night',
                weather: 'clear',
                season: 'summer',
                lightingPreset: 'dramatic',
                cameraPosition: new Vector3(4, 2, 6),
                cameraTarget: new Vector3(0, 1, 0),
                ambientIntensity: 0.2,
                directionalIntensity: 0.3,
                particleEffects: true
            },
            {
                id: 'presentation_mode',
                name: 'Presentation Mode',
                description: 'Professional presentation lighting and camera setup',
                timeOfDay: 'noon',
                weather: 'clear',
                season: 'spring',
                lightingPreset: 'studio',
                cameraPosition: new Vector3(8, 4, 0),
                cameraTarget: new Vector3(0, 1, 0),
                ambientIntensity: 0.8,
                directionalIntensity: 1.0,
                particleEffects: false
            }
        ];
        defaultScenarios.forEach(scenario => {
            this.scenarios.set(scenario.id, scenario);
        });
        logger.info(`Initialized ${defaultScenarios.length} default scenarios`);
    }
    /**
     * Apply a presentation scenario
     * @param scenarioId The ID of the scenario to apply
     * @returns Promise that resolves when the scenario is applied
     */
    async applyScenario(scenarioId) {
        if (this.scenarioTransitioning) {
            logger.warn('Scenario transition already in progress, ignoring request');
            return;
        }
        const scenario = this.scenarios.get(scenarioId);
        if (!scenario) {
            const error = new Error(`Scenario ${scenarioId} not found`);
            logger.error('Failed to apply scenario', error);
            throw error;
        }
        this.scenarioTransitioning = true;
        this.currentScenario = scenario;
        try {
            // Save original lighting state
            if (!this.originalLighting) {
                this.saveOriginalLighting();
            }
            // Clear existing scenario lights
            this.clearScenarioLights();
            // Apply lighting
            await this.applyScenarioLighting(scenario);
            // Apply camera position
            await this.transitionCamera(scenario);
            // Apply environment
            await this.applyEnvironment(scenario);
            // Apply time-based effects
            this.applyTimeEffects(scenario);
            logger.info(`Applied presentation scenario: ${scenario.name}`);
        }
        catch (error) {
            logger.error('Failed to apply scenario', error);
            throw error;
        }
        finally {
            this.scenarioTransitioning = false;
        }
    }
    /**
     * Save original lighting state
     */
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
        logger.debug('Saved original lighting state');
    }
    /**
     * Clear scenario lights
     */
    clearScenarioLights() {
        this.scenarioLights.forEach(light => {
            light.dispose();
        });
        this.scenarioLights = [];
        logger.debug('Cleared scenario lights');
    }
    /**
     * Apply scenario lighting
     * @param scenario The scenario to apply lighting for
     */
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
        logger.debug(`Applied lighting for scenario: ${scenario.name}`);
    }
    /**
     * Get ambient color for scenario
     * @param scenario The scenario
     * @returns The ambient color
     */
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
    /**
     * Get light direction for time of day
     * @param timeOfDay The time of day
     * @returns The light direction vector
     */
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
    /**
     * Get light color for time of day
     * @param timeOfDay The time of day
     * @returns The light color
     */
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
    /**
     * Add warm lighting
     * @param scenario The scenario
     */
    addWarmLighting(scenario) {
        const spotLight = new SpotLight(`scenario_spot_warm_${scenario.id}`, new Vector3(2, 3, 2), new Vector3(-0.5, -1, -0.5), Math.PI / 3, 2, this.scene);
        spotLight.intensity = 0.8;
        spotLight.diffuse = new Color3(1.0, 0.8, 0.6);
        this.scenarioLights.push(spotLight);
    }
    /**
     * Add cool lighting
     * @param scenario The scenario
     */
    addCoolLighting(scenario) {
        const pointLight = new PointLight(`scenario_point_cool_${scenario.id}`, new Vector3(-2, 2, -2), this.scene);
        pointLight.intensity = 0.6;
        pointLight.diffuse = new Color3(0.6, 0.8, 1.0);
        this.scenarioLights.push(pointLight);
    }
    /**
     * Add dramatic lighting
     * @param scenario The scenario
     */
    addDramaticLighting(scenario) {
        // Rim lighting effect
        const rimLight = new DirectionalLight(`scenario_rim_${scenario.id}`, new Vector3(0.8, -0.2, 0.6), this.scene);
        rimLight.intensity = 0.4;
        rimLight.diffuse = new Color3(0.8, 0.6, 1.0);
        this.scenarioLights.push(rimLight);
    }
    /**
     * Add studio lighting
     * @param scenario The scenario
     */
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
    /**
     * Transition camera to scenario position
     * @param scenario The scenario
     * @returns Promise that resolves when transition is complete
     */
    async transitionCamera(scenario) {
        const camera = this.scene.activeCamera;
        if (!camera) {
            logger.warn('No active camera found for transition');
            return;
        }
        // Create smooth camera transition animation
        const positionAnimation = new Animation('cameraPositionTransition', 'position', 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const targetAnimation = new Animation('cameraTargetTransition', 'target', 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const positionKeys = [
            { frame: 0, value: camera.position.clone() },
            { frame: 60, value: scenario.cameraPosition }
        ];
        const targetKeys = [
            { frame: 0, value: camera.target?.clone() || Vector3.Zero() },
            { frame: 60, value: scenario.cameraTarget }
        ];
        positionAnimation.setKeys(positionKeys);
        targetAnimation.setKeys(targetKeys);
        const animationGroup = new AnimationGroup('cameraTransition');
        animationGroup.addTargetedAnimation(positionAnimation, camera);
        animationGroup.addTargetedAnimation(targetAnimation, camera);
        this.transitionAnimations.push(animationGroup);
        return new Promise((resolve) => {
            let resolved = false;
            animationGroup.onAnimationGroupEndObservable.add(() => {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            });
            animationGroup.start();
            // Fallback timeout in case animation doesn't end (e.g., in test environment)
            setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    resolve();
                }
            }, 100);
        });
    }
    /**
     * Apply environment settings
     * @param scenario The scenario
     */
    async applyEnvironment(scenario) {
        // Apply skybox if specified
        if (scenario.skyboxTexture) {
            const skyboxTexture = CubeTexture.CreateFromPrefilteredData(scenario.skyboxTexture, this.scene);
            this.scene.environmentTexture = skyboxTexture;
        }
        // Apply seasonal effects
        this.applySeasonalEffects(scenario);
    }
    /**
     * Apply seasonal effects
     * @param scenario The scenario
     */
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
        logger.debug(`Applied seasonal effects for: ${scenario.season}`);
    }
    /**
     * Apply time-based effects
     * @param scenario The scenario
     */
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
        logger.debug(`Applied time effects for: ${scenario.timeOfDay}`);
    }
    /**
     * Get all available scenarios
     * @returns Array of available scenarios
     */
    getAvailableScenarios() {
        return Array.from(this.scenarios.values());
    }
    /**
     * Get current scenario
     * @returns The current scenario or null
     */
    getCurrentScenario() {
        return this.currentScenario;
    }
    /**
     * Reset to original state
     */
    resetToOriginal() {
        if (this.originalLighting) {
            this.applyLightingState(this.originalLighting);
        }
        this.currentScenario = null;
        logger.info('Reset to original state');
    }
    /**
     * Apply lighting state
     * @param lighting The lighting state to apply
     */
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
    /**
     * Dispose resources
     */
    dispose() {
        this.clearScenarioLights();
        this.transitionAnimations.forEach(anim => anim.dispose());
        this.scenarios.clear();
        this.transitionAnimations = [];
        logger.info('ScenarioManager disposed');
    }
}
