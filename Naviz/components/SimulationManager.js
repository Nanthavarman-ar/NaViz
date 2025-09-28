import { Mesh, Vector3, Color3, StandardMaterial, TransformNode, ParticleSystem, Texture, Color4 } from '@babylonjs/core';
export class SimulationManager {
    constructor(engine, scene, featureManager) {
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
        Object.defineProperty(this, "featureManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "updateIntervalId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "maintenanceIssues", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "materials", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "maintenanceGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "materialGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "simulationTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "costEstimator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Design validation simulation data
        Object.defineProperty(this, "structuralStressData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "windFlowData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "daylightData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "thermalComfortData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "structuralGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "windGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "daylightGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "thermalGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // New Geo-Context Simulation Data
        Object.defineProperty(this, "shadowAnalysisData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "floodSimulationData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "geoClimateData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "shadowGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "floodGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "geoClimateGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Traffic & Parking Simulation Data
        Object.defineProperty(this, "trafficFlowData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "parkingSpaceData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "congestionData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "trafficParkingGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Weather Simulation Data
        Object.defineProperty(this, "snowData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "rainData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "snowGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "rainGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Weather Enhancement Data
        Object.defineProperty(this, "rainSplashSystem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "snowAccumulationMeshes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "weatherLighting", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "windDirection", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Vector3(0.5, 0, 0.5)
        });
        Object.defineProperty(this, "windStrength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.1
        });
        Object.defineProperty(this, "weatherTransitionTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "isWeatherTransitioning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.engine = engine;
        this.scene = scene;
        this.featureManager = featureManager;
        this.config = {
            environmentalSimulationEnabled: false,
            energySimulationEnabled: false,
            predictiveMaintenanceEnabled: false,
            materialLifecycleEnabled: false,
            updateInterval: 5000,
            structuralStressEnabled: false,
            windFlowEnabled: false,
            daylightAutonomyEnabled: false,
            thermalComfortEnabled: false,
            // New geo-context simulation flags
            shadowAnalysisEnabled: false,
            windTunnelEnabled: false,
            floodSimulationEnabled: false,
            geoClimateEnabled: false,
        };
        this.initializeSimulationGroups();
        this.initializeDefaultMaterials();
    }
    // Initialize simulation groups for organization
    initializeSimulationGroups() {
        this.maintenanceGroup = new TransformNode('maintenance_issues', this.scene);
        this.maintenanceGroup.setEnabled(false);
        this.materialGroup = new TransformNode('material_analysis', this.scene);
        this.materialGroup.setEnabled(false);
        // Design validation simulation groups
        this.structuralGroup = new TransformNode('structural_stress', this.scene);
        this.structuralGroup.setEnabled(false);
        this.windGroup = new TransformNode('wind_flow', this.scene);
        this.windGroup.setEnabled(false);
        this.daylightGroup = new TransformNode('daylight_analysis', this.scene);
        this.daylightGroup.setEnabled(false);
        this.thermalGroup = new TransformNode('thermal_comfort', this.scene);
        this.thermalGroup.setEnabled(false);
        // Traffic & Parking simulation group
        this.trafficParkingGroup = new TransformNode('traffic_parking', this.scene);
        this.trafficParkingGroup.setEnabled(false);
        // Weather simulation groups
        this.snowGroup = new TransformNode('snow_simulation', this.scene);
        this.snowGroup.setEnabled(false);
        this.rainGroup = new TransformNode('rain_simulation', this.scene);
        this.rainGroup.setEnabled(false);
    }
    // Initialize default materials database
    initializeDefaultMaterials() {
        this.materials = [
            {
                id: 'concrete_standard',
                name: 'Standard Concrete',
                type: 'concrete',
                carbonFootprint: 0.25, // kg CO2 per kg
                durability: 50,
                maintenanceCost: 10,
                environmentalImpact: 60,
                recycled: false,
                renewable: false,
                location: Vector3.Zero(),
                volume: 100
            },
            {
                id: 'concrete_recycled',
                name: 'Recycled Concrete',
                type: 'concrete',
                carbonFootprint: 0.15,
                durability: 45,
                maintenanceCost: 12,
                environmentalImpact: 75,
                recycled: true,
                renewable: false,
                location: Vector3.Zero(),
                volume: 100
            },
            {
                id: 'steel_standard',
                name: 'Standard Steel',
                type: 'steel',
                carbonFootprint: 2.5,
                durability: 80,
                maintenanceCost: 5,
                environmentalImpact: 40,
                recycled: false,
                renewable: false,
                location: Vector3.Zero(),
                volume: 50
            },
            {
                id: 'steel_recycled',
                name: 'Recycled Steel',
                type: 'steel',
                carbonFootprint: 1.2,
                durability: 75,
                maintenanceCost: 6,
                environmentalImpact: 80,
                recycled: true,
                renewable: false,
                location: Vector3.Zero(),
                volume: 50
            },
            {
                id: 'wood_sustainable',
                name: 'Sustainable Wood',
                type: 'wood',
                carbonFootprint: -0.5, // Negative due to carbon sequestration
                durability: 30,
                maintenanceCost: 15,
                environmentalImpact: 90,
                recycled: false,
                renewable: true,
                location: Vector3.Zero(),
                volume: 20
            },
            {
                id: 'glass_standard',
                name: 'Standard Glass',
                type: 'glass',
                carbonFootprint: 1.8,
                durability: 25,
                maintenanceCost: 8,
                environmentalImpact: 55,
                recycled: false,
                renewable: false,
                location: Vector3.Zero(),
                volume: 10
            },
            {
                id: 'insulation_fiberglass',
                name: 'Fiberglass Insulation',
                type: 'insulation',
                carbonFootprint: 3.2,
                durability: 20,
                maintenanceCost: 3,
                environmentalImpact: 45,
                recycled: false,
                renewable: false,
                location: Vector3.Zero(),
                volume: 5
            }
        ];
    }
    startSimulation() {
        if (this.updateIntervalId !== null) {
            return; // Already running
        }
        this.updateIntervalId = window.setInterval(() => {
            this.runSimulationStep();
        }, this.config.updateInterval);
    }
    stopSimulation() {
        if (this.updateIntervalId !== null) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
        }
    }
    runSimulationStep() {
        this.simulationTime += this.config.updateInterval / 1000; // Convert to seconds
        if (this.config.environmentalSimulationEnabled) {
            this.simulateEnvironment();
        }
        if (this.config.energySimulationEnabled) {
            this.simulateEnergy();
        }
        if (this.config.predictiveMaintenanceEnabled) {
            this.simulatePredictiveMaintenance();
        }
        if (this.config.materialLifecycleEnabled) {
            this.simulateMaterialLifecycle();
        }
        // Design validation simulations
        if (this.config.structuralStressEnabled) {
            this.simulateStructuralStress();
        }
        if (this.config.windFlowEnabled) {
            this.simulateWindFlow();
        }
        if (this.config.daylightAutonomyEnabled) {
            this.simulateDaylightAutonomy();
        }
        if (this.config.thermalComfortEnabled) {
            this.simulateThermalComfort();
        }
        // Traffic & Parking simulations
        if (this.config.trafficParkingEnabled) {
            this.simulateTrafficParking();
        }
        // Weather simulations
        if (this.config.snowSimulationEnabled) {
            this.simulateSnow();
        }
        if (this.config.rainSimulationEnabled) {
            this.simulateRain();
        }
    }
    simulateEnvironment() {
        // Enhanced environmental simulation
        console.log('Running environmental simulation step...');
        // Simulate weather effects on materials
        this.materials.forEach(material => {
            this.simulateWeatherEffects(material);
        });
    }
    simulateEnergy() {
        // Enhanced energy simulation
        console.log('Running energy simulation step...');
        // Simulate energy consumption patterns
        const energyConsumption = this.calculateEnergyConsumption();
        console.log(`Current energy consumption: ${energyConsumption} kWh`);
    }
    simulatePredictiveMaintenance() {
        // Enhanced predictive maintenance simulation
        console.log('Running predictive maintenance simulation step...');
        // Generate new maintenance issues
        this.generateMaintenanceIssues();
        // Update existing issues
        this.updateMaintenanceIssues();
        // Remove resolved issues
        this.cleanupResolvedIssues();
    }
    simulateMaterialLifecycle() {
        // Material lifecycle simulation
        console.log('Running material lifecycle simulation step...');
        // Update material degradation
        this.updateMaterialDegradation();
        // Calculate lifecycle costs
        this.updateLifecycleCosts();
    }
    // Design validation simulation methods
    simulateStructuralStress() {
        console.log('Running structural stress simulation step...');
        // Generate structural stress data for building elements
        this.generateStructuralStressData();
        // Update visual representations
        this.updateStructuralStressVisualization();
    }
    simulateWindFlow() {
        console.log('Running wind flow simulation step...');
        // Generate wind flow data
        this.generateWindFlowData();
        // Update particle systems and visualizations
        this.updateWindFlowVisualization();
    }
    simulateDaylightAutonomy() {
        console.log('Running daylight autonomy simulation step...');
        // Generate daylight data for rooms
        this.generateDaylightData();
        // Update visual representations
        this.updateDaylightVisualization();
    }
    simulateThermalComfort() {
        console.log('Running thermal comfort simulation step...');
        // Generate thermal comfort data for zones
        this.generateThermalComfortData();
        // Update visual representations
        this.updateThermalComfortVisualization();
    }
    // Traffic & Parking simulation methods
    simulateTrafficParking() {
        console.log('Running traffic & parking simulation step...');
        // Generate traffic flow data
        this.generateTrafficFlowData();
        // Generate parking space data
        this.generateParkingSpaceData();
        // Generate congestion data
        this.generateCongestionData();
        // Update visual representations
        this.updateTrafficParkingVisualization();
    }
    // Weather simulation methods
    simulateSnow() {
        console.log('Running snow simulation step...');
        // Generate snow data
        this.generateSnowData();
        // Update visual representations
        this.updateSnowVisualization();
    }
    // Set snow intensity for particle system
    setSnowIntensity(intensity) {
        if (this.snowParticleSystem) {
            const baseEmitRate = 500;
            this.snowParticleSystem.emitRate = baseEmitRate * intensity;
            console.log(`Snow intensity set to ${intensity}`);
        }
    }
    simulateRain() {
        console.log('Running rain simulation step...');
        // Generate rain data
        this.generateRainData();
        // Update visual representations
        this.updateRainVisualization();
    }
    // Set rain intensity for particle system
    setRainIntensity(intensity) {
        if (this.rainParticleSystem) {
            const baseEmitRate = 500;
            this.rainParticleSystem.emitRate = baseEmitRate * intensity;
            console.log(`Rain intensity set to ${intensity}`);
        }
    }
    // Weather simulation data generation methods
    generateSnowData() {
        // Clear existing data
        this.snowData = [];
        // Create particle system for snow
        this.createSnowParticleSystem();
        // Generate snow accumulation data
        for (let i = 0; i < 25; i++) {
            const position = new Vector3((Math.random() - 0.5) * 60, 8 + Math.random() * 4, // Higher starting position for falling effect
            (Math.random() - 0.5) * 60);
            const snowDepth = Math.random() * 0.3; // meters
            const accumulationRate = 0.005 + Math.random() * 0.01; // m/hour
            const meltingRate = Math.random() * 0.002; // m/hour
            const fallSpeed = 0.5 + Math.random() * 1.5; // m/s
            const snowData = {
                id: `snow_${i}`,
                position,
                snowDepth,
                accumulationRate,
                meltingRate,
                fallSpeed,
                visible: false,
                particleSystem: null
            };
            this.snowData.push(snowData);
            this.createSnowMesh(snowData);
        }
        // Update ground wetness for snow
        this.updateGroundForSnow();
    }
    createSnowParticleSystem() {
        // Create enhanced particle system for falling snow with improved effects
        const particleSystem = new ParticleSystem("snowParticles", 6000, this.scene);
        // Create improved snow texture with soft edges and slight sparkle
        const snowTexture = new Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", this.scene);
        particleSystem.particleTexture = snowTexture;
        // Set emitter to cover the entire scene area with better distribution
        particleSystem.emitter = new Vector3(0, 25, 0); // Emit from higher above the scene
        particleSystem.minEmitBox = new Vector3(-50, 0, -50);
        particleSystem.maxEmitBox = new Vector3(50, 0, 50);
        // Enhanced particle appearance with more realistic snow colors and sparkle
        particleSystem.color1 = new Color4(0.98, 0.98, 1.0, 0.95); // Very light blue-white with high opacity
        particleSystem.color2 = new Color4(1.0, 1.0, 1.0, 0.8); // Pure white with good transparency
        particleSystem.colorDead = new Color4(0.9, 0.9, 0.98, 0.0); // Fade to light blue transparent
        // More varied particle sizes for realistic snow distribution
        particleSystem.minSize = 0.008;
        particleSystem.maxSize = 0.15;
        // Longer lifetime for slower falling snow with variation
        particleSystem.minLifeTime = 12.0;
        particleSystem.maxLifeTime = 18.0;
        // Base emission rate (will be scaled by intensity)
        particleSystem.emitRate = 400;
        // Particle direction with enhanced wind influence
        const windInfluence = this.windDirection.scale(this.windStrength * 0.5);
        particleSystem.direction1 = new Vector3(-0.2, -1, -0.2).add(windInfluence);
        particleSystem.direction2 = new Vector3(0.2, -1, 0.2).add(windInfluence);
        // Varied particle speeds with more realistic range
        particleSystem.minEmitPower = 0.5;
        particleSystem.maxEmitPower = 3.0;
        // Gravity effect with wind resistance simulation
        particleSystem.gravity = new Vector3(this.windDirection.x * this.windStrength * 0.1, -1.2, this.windDirection.z * this.windStrength * 0.1);
        // Update speed for smooth animation
        particleSystem.updateSpeed = 0.02;
        // Blend mode for transparency
        particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
        // Add particle system to scene and start
        particleSystem.start();
        // Store reference for intensity control
        this.snowParticleSystem = particleSystem;
        // Add to snow group for organization
        if (this.snowGroup) {
            // Note: Particle systems don't have a parent property, but we can track them separately
        }
        console.log('Enhanced snow particle system created and started with improved textures and animations');
    }
    createRainParticleSystem() {
        // Create enhanced particle system for falling rain
        const particleSystem = new ParticleSystem("rainParticles", 2000, this.scene);
        // Create texture for rain particles (simple transparent line)
        const rainTexture = new Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", this.scene);
        particleSystem.particleTexture = rainTexture;
        // Set emitter to cover the entire scene area
        particleSystem.emitter = new Vector3(0, 20, 0); // Emit from higher above the scene
        particleSystem.minEmitBox = new Vector3(-40, 0, -40);
        particleSystem.maxEmitBox = new Vector3(40, 0, 40);
        // Particle appearance - rain-like (blue, transparent)
        particleSystem.color1 = new Color4(0.6, 0.8, 1.0, 0.4); // Light blue-transparent
        particleSystem.color2 = new Color4(0.7, 0.9, 1.0, 0.2); // Lighter blue-more transparent
        particleSystem.colorDead = new Color4(0.8, 0.9, 1.0, 0.0); // Fade to transparent
        // Particle size - rain drops are thin and elongated
        particleSystem.minSize = 0.01;
        particleSystem.maxSize = 0.05;
        // Particle lifetime - rain falls faster
        particleSystem.minLifeTime = 2.0;
        particleSystem.maxLifeTime = 4.0;
        // Emission rate - more particles for rain
        particleSystem.emitRate = 1000;
        // Particle direction - straight down for rain
        particleSystem.direction1 = new Vector3(-0.1, -1, -0.1);
        particleSystem.direction2 = new Vector3(0.1, -1, 0.1);
        // Particle speed - faster than snow
        particleSystem.minEmitPower = 8;
        particleSystem.maxEmitPower = 15;
        // Gravity effect - stronger for rain
        particleSystem.gravity = new Vector3(0, -4, 0);
        // Update speed
        particleSystem.updateSpeed = 0.02;
        // Blend mode for transparency
        particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
        // Start the particle system
        particleSystem.start();
        // Store reference for intensity control
        this.rainParticleSystem = particleSystem;
        // Add to rain group for organization
        if (this.rainGroup) {
            // Note: Particle systems don't have a parent property, but we can track them separately
        }
        console.log('Rain particle system created and started');
    }
    updateGroundForSnow() {
        // Find ground meshes and apply wetness effect
        this.scene.meshes.forEach(mesh => {
            if (mesh.name.toLowerCase().includes('ground') || mesh.name.toLowerCase().includes('floor')) {
                const material = mesh.material;
                if (material) {
                    // Apply snow-covered ground effect
                    material.diffuseColor = new Color3(0.8, 0.8, 0.9); // Light blue-gray for snow-covered ground
                    material.specularColor = new Color3(0.1, 0.1, 0.2);
                    material.specularPower = 64;
                }
            }
        });
    }
    updateGroundForRain() {
        // Find ground meshes and apply wetness effect for rain
        this.scene.meshes.forEach(mesh => {
            if (mesh.name.toLowerCase().includes('ground') || mesh.name.toLowerCase().includes('floor')) {
                const material = mesh.material;
                if (material) {
                    // Apply wet ground effect for rain
                    material.diffuseColor = new Color3(0.6, 0.6, 0.7); // Darker, wetter appearance
                    material.specularColor = new Color3(0.3, 0.3, 0.4);
                    material.specularPower = 128; // More reflective for wet surface
                }
            }
        });
    }
    generateRainData() {
        // Clear existing data
        this.rainData = [];
        // Create particle system for rain
        this.createRainParticleSystem();
        // Generate rain intensity data
        for (let i = 0; i < 20; i++) {
            const position = new Vector3((Math.random() - 0.5) * 50, 5 + Math.random() * 10, // Above ground level
            (Math.random() - 0.5) * 50);
            const intensity = Math.random() * 10; // mm/hour
            const direction = new Vector3(Math.random() - 0.5, -1, // Downward
            Math.random() - 0.5).normalize();
            const rainData = {
                id: `rain_${i}`,
                position,
                intensity,
                direction,
                visible: false
            };
            this.rainData.push(rainData);
            this.createRainMesh(rainData);
        }
        // Update ground wetness for rain
        this.updateGroundForRain();
    }
    // Weather visualization update methods
    updateSnowVisualization() {
        this.snowData.forEach(data => {
            if (data.mesh) {
                this.updateSnowMesh(data);
            }
        });
    }
    updateRainVisualization() {
        this.rainData.forEach(data => {
            if (data.mesh) {
                this.updateRainMesh(data);
            }
        });
    }
    // Weather mesh creation methods
    createSnowMesh(data) {
        const mesh = Mesh.CreateCylinder(`${data.id}_snow`, data.snowDepth, 0.5, 0.5, 8, 1, this.scene);
        mesh.position = data.position;
        const material = new StandardMaterial(`${data.id}_snow_material`, this.scene);
        material.diffuseColor = new Color3(0.9, 0.9, 1.0); // Light blue-white
        material.emissiveColor = new Color3(0.1, 0.1, 0.2);
        mesh.material = material;
        if (this.snowGroup) {
            mesh.parent = this.snowGroup;
        }
        data.mesh = mesh;
        data.visible = false;
    }
    createRainMesh(data) {
        const mesh = Mesh.CreateCylinder(`${data.id}_rain`, 2, 0.02, 0.02, 6, 1, this.scene);
        mesh.position = data.position;
        const material = new StandardMaterial(`${data.id}_rain_material`, this.scene);
        material.diffuseColor = new Color3(0.7, 0.8, 1.0); // Light blue
        material.emissiveColor = new Color3(0.2, 0.3, 0.5);
        mesh.material = material;
        if (this.rainGroup) {
            mesh.parent = this.rainGroup;
        }
        data.mesh = mesh;
        data.visible = false;
    }
    // Weather mesh update methods
    updateSnowMesh(data) {
        if (!data.mesh)
            return;
        const material = data.mesh.material;
        if (!material)
            return;
        // Update snow depth based on accumulation/melting
        data.snowDepth += (data.accumulationRate - data.meltingRate) * (this.config.updateInterval / 3600000); // Convert to hours
        data.snowDepth = Math.max(0, data.snowDepth);
        // Update mesh scale
        const scale = Math.max(0.1, data.snowDepth * 2);
        data.mesh.scaling = new Vector3(scale, data.snowDepth, scale);
        // Update color based on depth
        const whiteness = Math.min(1, data.snowDepth / 0.3);
        material.diffuseColor = new Color3(0.9 - whiteness * 0.1, 0.9 - whiteness * 0.1, 1.0);
    }
    updateRainMesh(data) {
        if (!data.mesh)
            return;
        const material = data.mesh.material;
        if (!material)
            return;
        // Update rain intensity visualization
        const intensity = data.intensity / 10; // Normalize
        material.emissiveColor = new Color3(0.2 * intensity, 0.3 * intensity, 0.5 * intensity);
        // Animate rain drops
        data.mesh.position.y -= 0.1;
        if (data.mesh.position.y < 0) {
            data.mesh.position.y = 5 + Math.random() * 10;
        }
    }
    generateTrafficFlowData() {
        this.trafficFlowData = [];
        for (let i = 0; i < 20; i++) {
            const position = new Vector3((Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 50);
            const direction = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
            const speed = 10 + Math.random() * 40; // km/h
            const density = Math.random() * 100; // vehicles per km
            const congestionLevel = Math.min(1, density / 100);
            const flowRate = speed * density;
            const trafficFlow = {
                roadId: `road_${i}`,
                position,
                direction,
                speed,
                density,
                congestionLevel,
                flowRate,
                visible: false
            };
            this.trafficFlowData.push(trafficFlow);
            this.createTrafficFlowMesh(trafficFlow);
        }
    }
    generateParkingSpaceData() {
        this.parkingSpaceData = [];
        const types = ['surface', 'underground', 'covered', 'street'];
        for (let i = 0; i < 30; i++) {
            const position = new Vector3((Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 50);
            const type = types[Math.floor(Math.random() * types.length)];
            const occupied = Math.random() < 0.7;
            const occupancyRate = occupied ? 1 : 0;
            const utilizationScore = occupancyRate * 100;
            const accessibilityScore = 50 + Math.random() * 50;
            const parkingSpace = {
                spaceId: `space_${i}`,
                position,
                type,
                occupied,
                occupancyRate,
                utilizationScore,
                accessibilityScore,
                visible: false
            };
            this.parkingSpaceData.push(parkingSpace);
            this.createParkingSpaceMesh(parkingSpace);
        }
    }
    generateCongestionData() {
        this.congestionData = [];
        for (let i = 0; i < 10; i++) {
            const position = new Vector3((Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 50);
            const congestionLevel = Math.random();
            const affectedRoads = [`road_${Math.floor(Math.random() * 20)}`, `road_${Math.floor(Math.random() * 20)}`];
            const peakHours = ['8-9am', '5-6pm'];
            const averageDelay = congestionLevel * 30; // minutes
            const congestion = {
                zoneId: `zone_${i}`,
                position,
                congestionLevel,
                affectedRoads,
                peakHours,
                averageDelay,
                visible: false
            };
            this.congestionData.push(congestion);
            this.createCongestionMesh(congestion);
        }
    }
    updateTrafficParkingVisualization() {
        this.trafficFlowData.forEach(data => {
            if (data.mesh) {
                this.updateTrafficFlowMesh(data);
            }
        });
        this.parkingSpaceData.forEach(data => {
            if (data.mesh) {
                this.updateParkingSpaceMesh(data);
            }
        });
        this.congestionData.forEach(data => {
            if (data.mesh) {
                this.updateCongestionMesh(data);
            }
        });
    }
    createTrafficFlowMesh(data) {
        const mesh = Mesh.CreateBox(`${data.roadId}_trafficFlow`, 0.2, this.scene);
        mesh.position = data.position;
        const material = new StandardMaterial(`${data.roadId}_trafficFlow_material`, this.scene);
        material.diffuseColor = this.getTrafficFlowColor(data.congestionLevel);
        material.emissiveColor = this.getTrafficFlowEmissiveColor(data.congestionLevel);
        mesh.material = material;
        if (this.trafficParkingGroup) {
            mesh.parent = this.trafficParkingGroup;
        }
        data.mesh = mesh;
        data.visible = false;
    }
    updateTrafficFlowMesh(data) {
        if (!data.mesh)
            return;
        const material = data.mesh.material;
        if (!material)
            return;
        material.diffuseColor = this.getTrafficFlowColor(data.congestionLevel);
        material.emissiveColor = this.getTrafficFlowEmissiveColor(data.congestionLevel);
        const scale = 0.5 + data.congestionLevel * 1.5;
        data.mesh.scaling = new Vector3(scale, 0.1, scale);
    }
    createParkingSpaceMesh(data) {
        const mesh = Mesh.CreateBox(`${data.spaceId}_parkingSpace`, 0.3, this.scene);
        mesh.position = data.position;
        const material = new StandardMaterial(`${data.spaceId}_parkingSpace_material`, this.scene);
        material.diffuseColor = data.occupied ? new Color3(1, 0, 0) : new Color3(0, 1, 0);
        material.emissiveColor = data.occupied ? new Color3(0.5, 0, 0) : new Color3(0, 0.5, 0);
        mesh.material = material;
        if (this.trafficParkingGroup) {
            mesh.parent = this.trafficParkingGroup;
        }
        data.mesh = mesh;
        data.visible = false;
    }
    updateParkingSpaceMesh(data) {
        if (!data.mesh)
            return;
        const material = data.mesh.material;
        if (!material)
            return;
        material.diffuseColor = data.occupied ? new Color3(1, 0, 0) : new Color3(0, 1, 0);
        material.emissiveColor = data.occupied ? new Color3(0.5, 0, 0) : new Color3(0, 0.5, 0);
    }
    createCongestionMesh(data) {
        const mesh = Mesh.CreateSphere(`${data.zoneId}_congestion`, 0.4, 8, this.scene);
        mesh.position = data.position;
        const material = new StandardMaterial(`${data.zoneId}_congestion_material`, this.scene);
        material.diffuseColor = this.getCongestionColor(data.congestionLevel);
        material.emissiveColor = this.getCongestionEmissiveColor(data.congestionLevel);
        mesh.material = material;
        if (this.trafficParkingGroup) {
            mesh.parent = this.trafficParkingGroup;
        }
        data.mesh = mesh;
        data.visible = false;
    }
    updateCongestionMesh(data) {
        if (!data.mesh)
            return;
        const material = data.mesh.material;
        if (!material)
            return;
        material.diffuseColor = this.getCongestionColor(data.congestionLevel);
        material.emissiveColor = this.getCongestionEmissiveColor(data.congestionLevel);
        const scale = 0.5 + data.congestionLevel * 1.5;
        data.mesh.scaling = new Vector3(scale, scale, scale);
    }
    getTrafficFlowColor(congestionLevel) {
        if (congestionLevel < 0.3)
            return new Color3(0, 1, 0); // Green - low congestion
        if (congestionLevel < 0.7)
            return new Color3(1, 1, 0); // Yellow - medium congestion
        return new Color3(1, 0, 0); // Red - high congestion
    }
    getTrafficFlowEmissiveColor(congestionLevel) {
        return this.getTrafficFlowColor(congestionLevel).scale(0.3);
    }
    getCongestionColor(congestionLevel) {
        if (congestionLevel < 0.3)
            return new Color3(0, 1, 0);
        if (congestionLevel < 0.7)
            return new Color3(1, 0.5, 0);
        return new Color3(1, 0, 0);
    }
    getCongestionEmissiveColor(congestionLevel) {
        return this.getCongestionColor(congestionLevel).scale(0.4);
    }
    // Generate maintenance issues based on simulation
    generateMaintenanceIssues() {
        // Probability-based issue generation
        const issueTypes = ['leak', 'wear', 'corrosion', 'crack', 'electrical', 'hvac', 'plumbing'];
        const severities = ['low', 'medium', 'high', 'critical'];
        // 5% chance to generate a new issue each simulation step
        if (Math.random() < 0.05) {
            const type = issueTypes[Math.floor(Math.random() * issueTypes.length)];
            const severity = severities[Math.floor(Math.random() * severities.length)];
            const issue = {
                id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type,
                severity,
                location: new Vector3((Math.random() - 0.5) * 20, Math.random() * 3, (Math.random() - 0.5) * 20),
                description: this.generateIssueDescription(type, severity),
                estimatedCost: this.calculateIssueCost(type, severity),
                timeToFailure: Math.random() * 365, // 0-365 days
                affectedSystems: this.getAffectedSystems(type),
                visible: false
            };
            this.maintenanceIssues.push(issue);
            this.createMaintenanceMesh(issue);
            console.log(`New maintenance issue generated: ${issue.description}`);
        }
    }
    // Update existing maintenance issues
    updateMaintenanceIssues() {
        this.maintenanceIssues.forEach(issue => {
            // Reduce time to failure
            issue.timeToFailure -= this.config.updateInterval / (1000 * 60 * 60 * 24); // Convert to days
            // Update visual representation based on urgency
            if (issue.mesh) {
                this.updateMaintenanceVisual(issue);
            }
            // Critical issues become more visible
            if (issue.timeToFailure < 7 && issue.severity !== 'critical') {
                issue.severity = 'critical';
                console.warn(`Issue ${issue.id} escalated to critical!`);
            }
        });
    }
    // Create visual mesh for maintenance issue
    createMaintenanceMesh(issue) {
        let mesh;
        switch (issue.type) {
            case 'leak':
                mesh = Mesh.CreateCylinder(issue.id, 0.1, 0.05, 0.05, 8, 1, this.scene);
                break;
            case 'crack':
                mesh = Mesh.CreateBox(issue.id, 0.1, this.scene);
                mesh.scaling = new Vector3(0.5, 0.02, 0.1);
                break;
            case 'wear':
                mesh = Mesh.CreateSphere(issue.id, 8, 0.08, this.scene);
                break;
            default:
                mesh = Mesh.CreateSphere(issue.id, 8, 0.1, this.scene);
        }
        mesh.position = issue.location;
        const material = new StandardMaterial(`${issue.id}_material`, this.scene);
        material.diffuseColor = this.getIssueColor(issue.severity);
        material.emissiveColor = this.getIssueEmissiveColor(issue.severity);
        mesh.material = material;
        if (this.maintenanceGroup) {
            mesh.parent = this.maintenanceGroup;
        }
        issue.mesh = mesh;
        issue.visible = false;
    }
    // Update maintenance issue visual
    updateMaintenanceVisual(issue) {
        if (!issue.mesh)
            return;
        const material = issue.mesh.material;
        if (!material)
            return;
        material.diffuseColor = this.getIssueColor(issue.severity);
        material.emissiveColor = this.getIssueEmissiveColor(issue.severity);
        // Pulse effect for critical issues
        if (issue.severity === 'critical') {
            const pulseIntensity = (Math.sin(this.simulationTime * 5) + 1) / 2; // 0-1
            material.emissiveColor = material.emissiveColor.scale(pulseIntensity);
        }
    }
    // Get color based on issue severity
    getIssueColor(severity) {
        const colorMap = {
            low: new Color3(1, 1, 0), // Yellow
            medium: new Color3(1, 0.5, 0), // Orange
            high: new Color3(1, 0, 0), // Red
            critical: new Color3(0.5, 0, 0) // Dark red
        };
        return colorMap[severity];
    }
    // Get emissive color for issue
    getIssueEmissiveColor(severity) {
        const emissiveMap = {
            low: new Color3(0.2, 0.2, 0),
            medium: new Color3(0.3, 0.1, 0),
            high: new Color3(0.3, 0, 0),
            critical: new Color3(0.2, 0, 0)
        };
        return emissiveMap[severity];
    }
    // Generate issue description
    generateIssueDescription(type, severity) {
        const descriptions = {
            leak: `${severity} water leak detected`,
            wear: `${severity} material wear detected`,
            corrosion: `${severity} corrosion detected`,
            crack: `${severity} structural crack detected`,
            electrical: `${severity} electrical issue detected`,
            hvac: `${severity} HVAC system issue detected`,
            plumbing: `${severity} plumbing issue detected`
        };
        return descriptions[type];
    }
    // Calculate issue cost
    calculateIssueCost(type, severity) {
        const baseCosts = {
            leak: 500,
            wear: 200,
            corrosion: 800,
            crack: 1500,
            electrical: 300,
            hvac: 600,
            plumbing: 400
        };
        const severityMultiplier = {
            low: 0.5,
            medium: 1.0,
            high: 2.0,
            critical: 3.0
        };
        return Math.round(baseCosts[type] * severityMultiplier[severity]);
    }
    // Get affected systems
    getAffectedSystems(type) {
        const systemMap = {
            leak: ['plumbing', 'structure'],
            wear: ['finishes', 'structure'],
            corrosion: ['structure', 'mechanical'],
            crack: ['structure', 'safety'],
            electrical: ['electrical', 'lighting'],
            hvac: ['mechanical', 'comfort'],
            plumbing: ['plumbing', 'water']
        };
        return systemMap[type];
    }
    // Simulate weather effects on materials
    simulateWeatherEffects(material) {
        // Weather effects reduce durability over time
        const weatherFactor = 0.001; // Small degradation per simulation step
        material.durability -= weatherFactor;
        // Update environmental impact based on degradation
        if (material.durability < material.durability * 0.8) {
            material.environmentalImpact -= 5;
        }
    }
    // Update material degradation
    updateMaterialDegradation() {
        this.materials.forEach(material => {
            // Age-based degradation
            const ageFactor = 0.0001;
            material.durability -= ageFactor;
            // Usage-based degradation (simplified)
            const usageFactor = 0.00005;
            material.durability -= usageFactor;
            // Update visual representation
            if (material.mesh) {
                this.updateMaterialVisual(material);
            }
        });
    }
    // Update material visual representation
    updateMaterialVisual(material) {
        if (!material.mesh)
            return;
        const materialObj = material.mesh.material;
        if (!materialObj)
            return;
        // Change color based on degradation
        const degradationRatio = material.durability / 50; // Assuming 50 years initial durability
        if (degradationRatio < 0.8) {
            materialObj.diffuseColor = new Color3(0.6, 0.6, 0.6); // Gray out degraded materials
        }
    }
    // Update lifecycle costs
    updateLifecycleCosts() {
        this.materials.forEach(material => {
            // Calculate current lifecycle cost
            const yearsPassed = (50 - material.durability); // Assuming started at 50 years
            material.maintenanceCost = material.maintenanceCost * (1 + yearsPassed * 0.02); // 2% annual increase
        });
    }
    // Calculate energy consumption
    calculateEnergyConsumption() {
        // Simplified energy calculation based on materials and systems
        let consumption = 0;
        this.materials.forEach(material => {
            // Different materials have different energy implications
            switch (material.type) {
                case 'concrete':
                    consumption += material.volume * 0.1;
                    break;
                case 'steel':
                    consumption += material.volume * 0.2;
                    break;
                case 'wood':
                    consumption += material.volume * 0.05;
                    break;
                case 'glass':
                    consumption += material.volume * 0.15;
                    break;
                case 'insulation':
                    consumption -= material.volume * 0.1; // Insulation reduces consumption
                    break;
            }
        });
        return Math.max(0, consumption);
    }
    // Clean up resolved issues
    cleanupResolvedIssues() {
        this.maintenanceIssues = this.maintenanceIssues.filter(issue => {
            if (issue.timeToFailure <= 0) {
                // Remove resolved issue
                if (issue.mesh) {
                    issue.mesh.dispose();
                }
                return false;
            }
            return true;
        });
    }
    // Public methods for maintenance simulation
    toggleMaintenanceVisualization() {
        if (this.maintenanceGroup) {
            const isVisible = this.maintenanceGroup.isEnabled();
            this.maintenanceGroup.setEnabled(!isVisible);
            this.maintenanceIssues.forEach(issue => {
                issue.visible = !isVisible;
            });
            console.log(`Maintenance visualization ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    getMaintenanceIssues() {
        return [...this.maintenanceIssues];
    }
    resolveMaintenanceIssue(issueId) {
        const issue = this.maintenanceIssues.find(i => i.id === issueId);
        if (issue) {
            if (issue.mesh) {
                issue.mesh.dispose();
            }
            this.maintenanceIssues = this.maintenanceIssues.filter(i => i.id !== issueId);
            return true;
        }
        return false;
    }
    // Public methods for material lifecycle
    toggleMaterialVisualization() {
        if (this.materialGroup) {
            const isVisible = this.materialGroup.isEnabled();
            this.materialGroup.setEnabled(!isVisible);
            console.log(`Material visualization ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    getMaterials() {
        return [...this.materials];
    }
    analyzeMaterialLifecycle(materialId) {
        const material = this.materials.find(m => m.id === materialId);
        if (!material)
            return null;
        const totalCarbonFootprint = material.carbonFootprint * material.volume * 1000; // Convert to kg
        const lifecycleCost = material.maintenanceCost * (50 - material.durability); // Cost over remaining life
        const recommendations = this.generateMaterialRecommendations(material);
        return {
            materialId,
            totalCarbonFootprint,
            lifecycleCost,
            environmentalScore: material.environmentalImpact,
            durabilityScore: (material.durability / 50) * 100, // Percentage of original durability
            recommendations
        };
    }
    // Generate material recommendations
    generateMaterialRecommendations(material) {
        const recommendations = [];
        if (material.carbonFootprint > 2.0) {
            recommendations.push('Consider low-carbon alternatives');
        }
        if (material.durability < 30) {
            recommendations.push('Material nearing end of life - plan replacement');
        }
        if (!material.recycled && material.environmentalImpact < 60) {
            recommendations.push('Consider recycled material options');
        }
        if (material.maintenanceCost > 20) {
            recommendations.push('High maintenance cost - evaluate alternatives');
        }
        return recommendations;
    }
    // Add custom material
    addMaterial(material) {
        this.materials.push(material);
        this.createMaterialMesh(material);
    }
    // Create visual mesh for material
    createMaterialMesh(material) {
        // Create a small indicator mesh for the material
        const mesh = Mesh.CreateBox(`${material.id}_indicator`, 0.1, this.scene);
        mesh.position = material.location;
        const materialObj = new StandardMaterial(`${material.id}_material`, this.scene);
        materialObj.diffuseColor = this.getMaterialColor(material.type);
        mesh.material = materialObj;
        if (this.materialGroup) {
            mesh.parent = this.materialGroup;
        }
        material.mesh = mesh;
    }
    // Get color for material type
    getMaterialColor(type) {
        const colorMap = {
            concrete: new Color3(0.7, 0.7, 0.7),
            steel: new Color3(0.5, 0.5, 0.6),
            wood: new Color3(0.6, 0.4, 0.2),
            glass: new Color3(0.8, 0.9, 1.0),
            insulation: new Color3(1.0, 0.8, 0.8),
            finish: new Color3(0.9, 0.9, 0.9)
        };
        return colorMap[type] || new Color3(0.5, 0.5, 0.5);
    }
    // CostEstimator integration methods
    setCostEstimator(costEstimator) {
        this.costEstimator = costEstimator;
        console.log('CostEstimator integrated with SimulationManager');
    }
    getCostEstimator() {
        return this.costEstimator;
    }
    // Estimate costs for maintenance issues
    estimateMaintenanceCosts() {
        if (!this.costEstimator) {
            console.warn('CostEstimator not available for maintenance cost estimation');
            return null;
        }
        const costEstimator = this.costEstimator;
        const costBreakdown = {
            totalEstimatedCost: 0,
            bySeverity: {
                low: 0,
                medium: 0,
                high: 0,
                critical: 0
            },
            byType: {
                leak: 0,
                wear: 0,
                corrosion: 0,
                crack: 0,
                electrical: 0,
                hvac: 0,
                plumbing: 0
            },
            urgentIssues: []
        };
        this.maintenanceIssues.forEach(issue => {
            // Use CostEstimator for more accurate cost estimation
            const estimatedCost = costEstimator.estimateIssueCost(issue);
            costBreakdown.totalEstimatedCost += estimatedCost;
            costBreakdown.bySeverity[issue.severity] += estimatedCost;
            costBreakdown.byType[issue.type] += estimatedCost;
            // Track urgent issues (critical or time to failure < 30 days)
            if (issue.severity === 'critical' || issue.timeToFailure < 30) {
                costBreakdown.urgentIssues.push(issue);
            }
        });
        return costBreakdown;
    }
    // Estimate material lifecycle costs
    estimateMaterialCosts() {
        if (!this.costEstimator) {
            console.warn('CostEstimator not available for material cost estimation');
            return null;
        }
        const costEstimator = this.costEstimator;
        const costAnalysis = {
            totalLifecycleCost: 0,
            byMaterialType: {},
            replacementSchedule: [],
            costSavings: {
                recycled: 0,
                renewable: 0,
                efficient: 0
            }
        };
        this.materials.forEach(material => {
            const lifecycleCost = costEstimator.estimateMaterialLifecycleCost(material);
            costAnalysis.totalLifecycleCost += lifecycleCost;
            if (!costAnalysis.byMaterialType[material.type]) {
                costAnalysis.byMaterialType[material.type] = 0;
            }
            costAnalysis.byMaterialType[material.type] += lifecycleCost;
            // Track replacement schedule
            if (material.durability < 25) {
                costAnalysis.replacementSchedule.push({
                    materialId: material.id,
                    type: material.type,
                    estimatedCost: lifecycleCost,
                    priority: material.durability < 10 ? 'high' : 'medium'
                });
            }
            // Calculate cost savings
            if (material.recycled) {
                costAnalysis.costSavings.recycled += lifecycleCost * 0.2; // Assume 20% savings
            }
            if (material.renewable) {
                costAnalysis.costSavings.renewable += lifecycleCost * 0.15; // Assume 15% savings
            }
            if (material.environmentalImpact > 80) {
                costAnalysis.costSavings.efficient += lifecycleCost * 0.1; // Assume 10% savings
            }
        });
        return costAnalysis;
    }
    // Get comprehensive cost analysis
    getCostAnalysis() {
        if (!this.costEstimator) {
            console.warn('CostEstimator not available for comprehensive cost analysis');
            return null;
        }
        const maintenanceCosts = this.estimateMaintenanceCosts();
        const materialCosts = this.estimateMaterialCosts();
        if (!maintenanceCosts || !materialCosts) {
            return null;
        }
        const totalCost = maintenanceCosts.totalEstimatedCost + materialCosts.totalLifecycleCost;
        return {
            totalEstimatedCost: totalCost,
            maintenanceCosts,
            materialCosts,
            costEfficiency: {
                score: this.calculateCostEfficiency(totalCost),
                recommendations: this.generateCostRecommendations(maintenanceCosts, materialCosts)
            },
            simulationTime: this.simulationTime
        };
    }
    // Calculate cost efficiency score
    calculateCostEfficiency(totalCost) {
        // Simplified cost efficiency calculation
        const baseEfficiency = 100;
        const costPenalty = Math.min(totalCost / 10000, 50); // Max 50 point penalty
        return Math.max(0, baseEfficiency - costPenalty);
    }
    // Generate cost optimization recommendations
    generateCostRecommendations(maintenanceCosts, materialCosts) {
        const recommendations = [];
        // Maintenance recommendations
        if (maintenanceCosts.urgentIssues.length > 3) {
            recommendations.push('High number of urgent maintenance issues - prioritize preventive maintenance');
        }
        if (maintenanceCosts.bySeverity.critical > maintenanceCosts.totalEstimatedCost * 0.5) {
            recommendations.push('Critical issues represent majority of costs - immediate attention required');
        }
        // Material recommendations
        if (materialCosts.replacementSchedule.length > 2) {
            recommendations.push('Multiple materials nearing end of life - plan replacement schedule');
        }
        const totalSavings = materialCosts.costSavings.recycled +
            materialCosts.costSavings.renewable +
            materialCosts.costSavings.efficient;
        if (totalSavings > materialCosts.totalLifecycleCost * 0.1) {
            recommendations.push('Significant cost savings available through sustainable material choices');
        }
        return recommendations;
    }
    // Get overall building analysis
    getBuildingAnalysis() {
        const totalMaterials = this.materials.length;
        const totalIssues = this.maintenanceIssues.length;
        const criticalIssues = this.maintenanceIssues.filter(i => i.severity === 'critical').length;
        const totalCarbonFootprint = this.materials.reduce((sum, material) => sum + (material.carbonFootprint * material.volume * 1000), 0);
        const averageEnvironmentalScore = this.materials.reduce((sum, material) => sum + material.environmentalImpact, 0) / totalMaterials;
        const costAnalysis = this.getCostAnalysis();
        return {
            totalMaterials,
            totalIssues,
            criticalIssues,
            totalCarbonFootprint,
            averageEnvironmentalScore,
            maintenanceCost: this.maintenanceIssues.reduce((sum, issue) => sum + issue.estimatedCost, 0),
            costAnalysis: costAnalysis ? {
                totalEstimatedCost: costAnalysis.totalEstimatedCost,
                costEfficiency: costAnalysis.costEfficiency.score
            } : null,
            simulationTime: this.simulationTime
        };
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        if (this.updateIntervalId !== null) {
            this.stopSimulation();
            this.startSimulation();
        }
    }
    enablePeopleSimulation() {
        if (!this.config.trafficParkingEnabled) {
            this.config.trafficParkingEnabled = true;
            console.log('People simulation enabled');
            if (this.updateIntervalId !== null) {
                this.stopSimulation();
                this.startSimulation();
            }
        }
    }
    disablePeopleSimulation() {
        if (this.config.trafficParkingEnabled) {
            this.config.trafficParkingEnabled = false;
            console.log('People simulation disabled');
            if (this.updateIntervalId !== null) {
                this.stopSimulation();
                this.startSimulation();
            }
        }
    }
    getConfig() {
        return this.config;
    }
    // Design validation simulation data generation methods
    generateStructuralStressData() {
        // Clear existing data
        this.structuralStressData = [];
        // Generate structural stress data for building elements
        const loadTypes = ['dead', 'live', 'wind', 'seismic', 'thermal'];
        // Simulate structural elements (beams, columns, etc.)
        for (let i = 0; i < 10; i++) {
            const loadType = loadTypes[Math.floor(Math.random() * loadTypes.length)];
            const stressLevel = Math.random(); // 0-1 normalized stress level
            const maxStress = 200 + Math.random() * 100; // MPa
            const safetyFactor = 1.5 + Math.random() * 0.5; // Safety factor
            const stressData = {
                elementId: `element_${i}`,
                stressLevel,
                loadType,
                criticalPoints: [
                    new Vector3((Math.random() - 0.5) * 20, Math.random() * 5, (Math.random() - 0.5) * 20)
                ],
                maxStress,
                safetyFactor,
                visible: false
            };
            this.structuralStressData.push(stressData);
            this.createStructuralStressMesh(stressData);
        }
    }
    generateWindFlowData() {
        // Clear existing data
        this.windFlowData = [];
        // Generate wind flow data points
        for (let i = 0; i < 20; i++) {
            const position = new Vector3((Math.random() - 0.5) * 30, Math.random() * 10, (Math.random() - 0.5) * 30);
            const windSpeed = 5 + Math.random() * 15; // m/s
            const direction = new Vector3(Math.random() - 0.5, Math.random() * 0.2, Math.random() - 0.5).normalize();
            const windData = {
                position,
                velocity: direction.scale(windSpeed),
                pressure: 0.5 + Math.random() * 2, // kPa
                direction,
                turbulence: Math.random() * 0.5,
                visible: false
            };
            this.windFlowData.push(windData);
        }
    }
    generateDaylightData() {
        // Clear existing data
        this.daylightData = [];
        // Generate daylight data for rooms
        const roomIds = ['room_1', 'room_2', 'room_3', 'room_4', 'room_5'];
        roomIds.forEach(roomId => {
            const position = new Vector3((Math.random() - 0.5) * 15, 1.5, // Typical working height
            (Math.random() - 0.5) * 15);
            const illuminance = 100 + Math.random() * 900; // lux
            const daylightAutonomy = Math.random() * 100; // percentage
            const usefulDaylightIlluminance = Math.random() * 100; // percentage
            const glareIndex = Math.random() * 30; // DGI
            const daylightData = {
                roomId,
                position,
                illuminance,
                daylightAutonomy,
                usefulDaylightIlluminance,
                glareIndex,
                skyComponent: illuminance * 0.6,
                externallyReflectedComponent: illuminance * 0.3,
                internallyReflectedComponent: illuminance * 0.1,
                visible: false
            };
            this.daylightData.push(daylightData);
            this.createDaylightMesh(daylightData);
        });
    }
    generateThermalComfortData() {
        // Clear existing data
        this.thermalComfortData = [];
        // Generate thermal comfort data for zones
        const zoneIds = ['zone_1', 'zone_2', 'zone_3', 'zone_4'];
        zoneIds.forEach(zoneId => {
            const position = new Vector3((Math.random() - 0.5) * 20, 1.5, (Math.random() - 0.5) * 20);
            const temperature = 18 + Math.random() * 12; // 18-30°C
            const humidity = 30 + Math.random() * 40; // 30-70%
            const airVelocity = 0.1 + Math.random() * 0.4; // m/s
            const meanRadiantTemperature = temperature + (Math.random() - 0.5) * 4;
            // Calculate PMV using simplified formula
            const pmv = (temperature - 24) * 0.1 + (humidity - 50) * 0.01;
            const ppd = Math.min(100, Math.abs(pmv) * 20);
            let comfortCategory;
            if (Math.abs(pmv) < 0.5)
                comfortCategory = 'neutral';
            else if (pmv < -0.5)
                comfortCategory = pmv < -1.5 ? 'cold' : 'cool';
            else
                comfortCategory = pmv > 1.5 ? 'hot' : 'warm';
            const thermalData = {
                zoneId,
                position,
                temperature,
                humidity,
                airVelocity,
                meanRadiantTemperature,
                predictedMeanVote: pmv,
                predictedPercentageDissatisfied: ppd,
                comfortCategory,
                visible: false
            };
            this.thermalComfortData.push(thermalData);
            this.createThermalComfortMesh(thermalData);
        });
    }
    // Visualization update methods
    updateStructuralStressVisualization() {
        this.structuralStressData.forEach(data => {
            if (data.mesh) {
                this.updateStructuralStressMesh(data);
            }
        });
    }
    updateWindFlowVisualization() {
        // Update wind flow particle systems
        this.windFlowData.forEach(data => {
            if (data.particleSystem) {
                // Update particle system properties based on wind data
                // This would typically update particle velocity, direction, etc.
            }
        });
    }
    updateDaylightVisualization() {
        this.daylightData.forEach(data => {
            if (data.mesh) {
                this.updateDaylightMesh(data);
            }
        });
    }
    updateThermalComfortVisualization() {
        this.thermalComfortData.forEach(data => {
            if (data.mesh) {
                this.updateThermalComfortMesh(data);
            }
        });
    }
    // Mesh creation methods
    createStructuralStressMesh(data) {
        const mesh = Mesh.CreateBox(`${data.elementId}_stress`, 0.2, this.scene);
        mesh.position = data.criticalPoints[0];
        const material = new StandardMaterial(`${data.elementId}_stress_material`, this.scene);
        material.diffuseColor = this.getStressColor(data.stressLevel);
        material.emissiveColor = this.getStressEmissiveColor(data.stressLevel);
        mesh.material = material;
        if (this.structuralGroup) {
            mesh.parent = this.structuralGroup;
        }
        data.mesh = mesh;
        data.visible = false;
    }
    createDaylightMesh(data) {
        const mesh = Mesh.CreateSphere(`${data.roomId}_daylight`, 0.1, 8, this.scene);
        mesh.position = data.position;
        const material = new StandardMaterial(`${data.roomId}_daylight_material`, this.scene);
        material.diffuseColor = this.getDaylightColor(data.daylightAutonomy);
        material.emissiveColor = this.getDaylightEmissiveColor(data.daylightAutonomy);
        mesh.material = material;
        if (this.daylightGroup) {
            mesh.parent = this.daylightGroup;
        }
        data.mesh = mesh;
        data.visible = false;
    }
    createThermalComfortMesh(data) {
        const mesh = Mesh.CreateCylinder(`${data.zoneId}_thermal`, 0.1, 0.05, 0.05, 8, 1, this.scene);
        mesh.position = data.position;
        const material = new StandardMaterial(`${data.zoneId}_thermal_material`, this.scene);
        material.diffuseColor = this.getThermalComfortColor(data.comfortCategory);
        material.emissiveColor = this.getThermalComfortEmissiveColor(data.comfortCategory);
        mesh.material = material;
        if (this.thermalGroup) {
            mesh.parent = this.thermalGroup;
        }
        data.mesh = mesh;
        data.visible = false;
    }
    // Mesh update methods
    updateStructuralStressMesh(data) {
        if (!data.mesh)
            return;
        const material = data.mesh.material;
        if (!material)
            return;
        material.diffuseColor = this.getStressColor(data.stressLevel);
        material.emissiveColor = this.getStressEmissiveColor(data.stressLevel);
        // Scale based on stress level
        const scale = 0.5 + data.stressLevel * 0.5;
        data.mesh.scaling = new Vector3(scale, scale, scale);
    }
    updateDaylightMesh(data) {
        if (!data.mesh)
            return;
        const material = data.mesh.material;
        if (!material)
            return;
        material.diffuseColor = this.getDaylightColor(data.daylightAutonomy);
        material.emissiveColor = this.getDaylightEmissiveColor(data.daylightAutonomy);
        // Scale based on illuminance
        const scale = 0.5 + (data.illuminance / 1000) * 2;
        data.mesh.scaling = new Vector3(scale, scale, scale);
    }
    updateThermalComfortMesh(data) {
        if (!data.mesh)
            return;
        const material = data.mesh.material;
        if (!material)
            return;
        material.diffuseColor = this.getThermalComfortColor(data.comfortCategory);
        material.emissiveColor = this.getThermalComfortEmissiveColor(data.comfortCategory);
        // Pulse effect for uncomfortable conditions
        if (data.comfortCategory !== 'neutral') {
            const pulseIntensity = (Math.sin(this.simulationTime * 3) + 1) / 2;
            material.emissiveColor = material.emissiveColor.scale(pulseIntensity);
        }
    }
    // Color helper methods
    getStressColor(stressLevel) {
        if (stressLevel < 0.3)
            return new Color3(0, 1, 0); // Green - low stress
        if (stressLevel < 0.7)
            return new Color3(1, 1, 0); // Yellow - medium stress
        return new Color3(1, 0, 0); // Red - high stress
    }
    getStressEmissiveColor(stressLevel) {
        return this.getStressColor(stressLevel).scale(0.3);
    }
    getDaylightColor(daylightAutonomy) {
        if (daylightAutonomy > 75)
            return new Color3(0, 1, 0); // Green - good daylight
        if (daylightAutonomy > 50)
            return new Color3(1, 1, 0); // Yellow - moderate daylight
        return new Color3(1, 0.5, 0); // Orange - poor daylight
    }
    getDaylightEmissiveColor(daylightAutonomy) {
        return this.getDaylightColor(daylightAutonomy).scale(0.4);
    }
    getThermalComfortColor(category) {
        const colorMap = {
            'cold': new Color3(0, 0, 1), // Blue
            'cool': new Color3(0.5, 0.5, 1), // Light blue
            'slightly cool': new Color3(0.7, 0.7, 1), // Very light blue
            'neutral': new Color3(0, 1, 0), // Green
            'slightly warm': new Color3(1, 0.7, 0.7), // Light red
            'warm': new Color3(1, 0.5, 0.5), // Red
            'hot': new Color3(1, 0, 0) // Dark red
        };
        return colorMap[category];
    }
    getThermalComfortEmissiveColor(category) {
        return this.getThermalComfortColor(category).scale(0.3);
    }
    // Public methods for design validation simulations
    toggleStructuralStressVisualization() {
        if (this.structuralGroup) {
            const isVisible = this.structuralGroup.isEnabled();
            this.structuralGroup.setEnabled(!isVisible);
            this.structuralStressData.forEach(data => {
                data.visible = !isVisible;
            });
            console.log(`Structural stress visualization ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    toggleWindFlowVisualization() {
        if (this.windGroup) {
            const isVisible = this.windGroup.isEnabled();
            this.windGroup.setEnabled(!isVisible);
            this.windFlowData.forEach(data => {
                data.visible = !isVisible;
            });
            console.log(`Wind flow visualization ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    toggleDaylightVisualization() {
        if (this.daylightGroup) {
            const isVisible = this.daylightGroup.isEnabled();
            this.daylightGroup.setEnabled(!isVisible);
            this.daylightData.forEach(data => {
                data.visible = !isVisible;
            });
            console.log(`Daylight visualization ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    toggleThermalComfortVisualization() {
        if (this.thermalGroup) {
            const isVisible = this.thermalGroup.isEnabled();
            this.thermalGroup.setEnabled(!isVisible);
            this.thermalComfortData.forEach(data => {
                data.visible = !isVisible;
            });
            console.log(`Thermal comfort visualization ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    // Getters for design validation data
    getStructuralStressData() {
        return [...this.structuralStressData];
    }
    getWindFlowData() {
        return [...this.windFlowData];
    }
    getDaylightData() {
        return [...this.daylightData];
    }
    getThermalComfortData() {
        return [...this.thermalComfortData];
    }
    // Sustainability-related methods
    calculateEnergyEfficiency(modelId) {
        if (!modelId)
            return 0.7; // Default efficiency
        // Calculate energy efficiency based on materials, insulation, and systems
        let efficiency = 0.5; // Base efficiency
        // Factor in insulation materials
        const insulationMaterials = this.materials.filter(m => m.type === 'insulation');
        if (insulationMaterials.length > 0) {
            efficiency += 0.2; // Insulation improves efficiency
        }
        // Factor in energy-efficient materials
        const efficientMaterials = this.materials.filter(m => m.environmentalImpact > 80);
        efficiency += (efficientMaterials.length / this.materials.length) * 0.3;
        return Math.min(efficiency, 1.0);
    }
    calculateWaterEfficiency(modelId) {
        // Calculate water efficiency based on fixtures and systems
        // This is a placeholder - would need actual water fixture data
        return 0.8; // Assume 80% efficiency for now
    }
    getRenewableEnergyUsage(modelId) {
        // Calculate renewable energy usage percentage
        // This would integrate with solar panel calculations, etc.
        return 0.25; // Assume 25% renewable energy usage
    }
    calculateEnergyUsage(modelId) {
        // Calculate total energy usage in kWh/year
        let totalUsage = 0;
        // Base energy usage from building size and systems
        const buildingVolume = 10000; // cubic meters - would come from BIM model
        const energyIntensity = 150; // kWh/m³/year - typical office building
        totalUsage += buildingVolume * energyIntensity;
        // Add energy usage from materials
        this.materials.forEach(material => {
            switch (material.type) {
                case 'concrete':
                    totalUsage += material.volume * 50; // kWh/m³ for concrete production
                    break;
                case 'steel':
                    totalUsage += material.volume * 100; // kWh/m³ for steel production
                    break;
                case 'glass':
                    totalUsage += material.volume * 80; // kWh/m³ for glass production
                    break;
                case 'insulation':
                    totalUsage -= material.volume * 20; // Insulation reduces energy usage
                    break;
            }
        });
        return Math.max(0, totalUsage);
    }
    calculateEnergyCarbonFootprint(modelId) {
        // Calculate carbon footprint from energy usage in kg CO2
        const energyUsage = this.calculateEnergyUsage(modelId);
        const carbonIntensity = 0.4; // kg CO2/kWh - average grid carbon intensity
        return energyUsage * carbonIntensity;
    }
    calculateWaterUsage(modelId) {
        // Calculate total water usage in liters/year
        let totalUsage = 0;
        // Base water usage for typical building
        const occupantCount = 100; // Would come from BIM model
        const waterPerOccupant = 150; // liters/day per person
        totalUsage += occupantCount * waterPerOccupant * 365;
        // Add water usage from materials (embedded water)
        this.materials.forEach(material => {
            switch (material.type) {
                case 'concrete':
                    totalUsage += material.volume * 200; // liters/m³ embedded water in concrete
                    break;
                case 'steel':
                    totalUsage += material.volume * 50; // liters/m³ embedded water in steel
                    break;
                case 'wood':
                    totalUsage += material.volume * 10; // liters/m³ embedded water in wood
                    break;
            }
        });
        return totalUsage;
    }
    // Traffic & Parking simulation public methods
    simulateTrafficFlow(duration, density) {
        // Update traffic flow data based on parameters
        this.trafficFlowData.forEach(flow => {
            const densityMultiplier = density === 'low' ? 0.5 : density === 'high' ? 2 : 1;
            flow.density = Math.random() * 100 * densityMultiplier;
            flow.congestionLevel = Math.min(1, flow.density / 100);
            flow.speed = 10 + Math.random() * 40 * (1 - flow.congestionLevel);
            flow.flowRate = flow.speed * flow.density;
        });
    }
    simulateParkingSpaces() {
        // Update parking space occupancy
        this.parkingSpaceData.forEach(space => {
            space.occupied = Math.random() < 0.7; // 70% occupancy
            space.occupancyRate = space.occupied ? 1 : 0;
            space.utilizationScore = space.occupancyRate * 100;
        });
    }
    simulateCongestion() {
        // Update congestion data
        this.congestionData.forEach(congestion => {
            congestion.congestionLevel = Math.random();
            congestion.averageDelay = congestion.congestionLevel * 30;
        });
    }
    toggleTrafficVisualization() {
        if (this.trafficParkingGroup) {
            const isVisible = this.trafficParkingGroup.isEnabled();
            this.trafficParkingGroup.setEnabled(!isVisible);
            this.trafficFlowData.forEach(data => {
                data.visible = !isVisible;
            });
            console.log(`Traffic visualization ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    toggleParkingVisualization() {
        if (this.trafficParkingGroup) {
            const isVisible = this.trafficParkingGroup.isEnabled();
            this.trafficParkingGroup.setEnabled(!isVisible);
            this.parkingSpaceData.forEach(data => {
                data.visible = !isVisible;
            });
            console.log(`Parking visualization ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    toggleCongestionVisualization() {
        if (this.trafficParkingGroup) {
            const isVisible = this.trafficParkingGroup.isEnabled();
            this.trafficParkingGroup.setEnabled(!isVisible);
            this.congestionData.forEach(data => {
                data.visible = !isVisible;
            });
            console.log(`Congestion visualization ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    // Weather simulation visualization toggles
    toggleSnowVisualization() {
        if (this.snowGroup) {
            const isVisible = this.snowGroup.isEnabled();
            this.snowGroup.setEnabled(!isVisible);
            this.snowData.forEach(data => {
                data.visible = !isVisible;
            });
            console.log(`Snow visualization ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    toggleRainVisualization() {
        if (this.rainGroup) {
            const isVisible = this.rainGroup.isEnabled();
            this.rainGroup.setEnabled(!isVisible);
            this.rainData.forEach(data => {
                data.visible = !isVisible;
            });
            console.log(`Rain visualization ${!isVisible ? 'enabled' : 'disabled'}`);
        }
    }
    getTrafficFlowData() {
        return [...this.trafficFlowData];
    }
    getParkingSpaceData() {
        return [...this.parkingSpaceData];
    }
    getCongestionData() {
        return [...this.congestionData];
    }
    dispose() {
        this.stopSimulation();
        // Dispose maintenance meshes
        this.maintenanceIssues.forEach(issue => {
            issue.mesh?.dispose();
        });
        // Dispose material meshes
        this.materials.forEach(material => {
            material.mesh?.dispose();
        });
        // Dispose design validation meshes
        this.structuralStressData.forEach(data => {
            if (data.mesh) {
                data.mesh.dispose();
            }
        });
        this.daylightData.forEach(data => {
            if (data.mesh) {
                data.mesh.dispose();
            }
        });
        this.thermalComfortData.forEach(data => {
            if (data.mesh) {
                data.mesh.dispose();
            }
        });
        // Dispose traffic & parking meshes
        this.trafficFlowData.forEach(data => {
            if (data.mesh) {
                data.mesh.dispose();
            }
        });
        this.parkingSpaceData.forEach(data => {
            if (data.mesh) {
                data.mesh.dispose();
            }
        });
        this.congestionData.forEach(data => {
            if (data.mesh) {
                data.mesh.dispose();
            }
        });
        if (this.maintenanceGroup) {
            this.maintenanceGroup.dispose();
        }
        if (this.materialGroup) {
            this.materialGroup.dispose();
        }
        if (this.structuralGroup) {
            this.structuralGroup.dispose();
        }
        if (this.windGroup) {
            this.windGroup.dispose();
        }
        if (this.daylightGroup) {
            this.daylightGroup.dispose();
        }
        if (this.thermalGroup) {
            this.thermalGroup.dispose();
        }
        if (this.trafficParkingGroup) {
            this.trafficParkingGroup.dispose();
        }
        this.maintenanceIssues = [];
        this.materials = [];
        this.structuralStressData = [];
        this.windFlowData = [];
        this.daylightData = [];
        this.thermalComfortData = [];
        this.trafficFlowData = [];
        this.parkingSpaceData = [];
        this.congestionData = [];
    }
}
