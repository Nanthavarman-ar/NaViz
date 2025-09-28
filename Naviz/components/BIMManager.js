import { Mesh, Vector3, Color3, StandardMaterial, TransformNode } from '@babylonjs/core';
export class BIMManager {
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
        Object.defineProperty(this, "models", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hiddenDetailGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isInitialized", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "costEstimator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "layers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "clashes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "wallGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "clashHighlightGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Performance optimization: Mesh instancing system
        Object.defineProperty(this, "meshInstances", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "instanceThreshold", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
        }); // Minimum instances before using instancing
        this.engine = engine;
        this.scene = scene;
        this.featureManager = featureManager;
        this.config = {
            showHiddenDetails: false,
            detailLevel: 'medium',
            transparencyMode: false,
            colorCoding: true,
            realTimeUpdates: false,
            wallPeelingMode: false,
            clashDetectionEnabled: false
        };
        this.initializeBIMSystem();
    }
    // Initialize BIM system
    initializeBIMSystem() {
        // Create hidden detail group for organization
        this.hiddenDetailGroup = new TransformNode('bim_hidden_details', this.scene);
        this.hiddenDetailGroup.setEnabled(false); // Initially hidden
        // Create wall group for wall peeling functionality
        this.wallGroup = new TransformNode('bim_walls', this.scene);
        this.wallGroup.setEnabled(true);
        // Create clash highlight group
        this.clashHighlightGroup = new TransformNode('bim_clash_highlights', this.scene);
        this.clashHighlightGroup.setEnabled(false); // Initially hidden
        this.isInitialized = true;
        console.log('BIM system initialized');
    }
    // Import BIM model from file
    async importBIMModel(file, source = 'custom') {
        if (!file) {
            throw new Error('No file provided for BIM model import');
        }
        try {
            const modelId = `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            let model;
            switch (source) {
                case 'revit':
                    model = await this.parseRevitFile(file, modelId);
                    break;
                case 'autocad':
                    model = await this.parseAutoCADFile(file, modelId);
                    break;
                case 'ifc':
                    model = await this.parseIFCFile(file, modelId);
                    break;
                default:
                    model = await this.parseCustomFormat(file, modelId);
            }
            if (!model || !model.elements) {
                throw new Error('Parsed BIM model is invalid or empty');
            }
            this.models.set(modelId, model);
            await this.createBIMMeshes(model);
            console.log(`BIM model imported: ${model.name} (${model.elements.length} elements)`);
            return model;
        }
        catch (error) {
            console.error('Failed to import BIM model:', error);
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`BIM import failed: ${message}`);
        }
    }
    // Parse Revit file (simplified implementation)
    async parseRevitFile(file, modelId) {
        // In a real implementation, this would parse actual Revit (.rvt) files
        // For demo purposes, we'll create a mock BIM model
        return this.createMockBIMModel(modelId, 'Revit Import', 'revit');
    }
    // Parse AutoCAD file (simplified implementation)
    async parseAutoCADFile(file, modelId) {
        // In a real implementation, this would parse actual AutoCAD (.dwg) files
        return this.createMockBIMModel(modelId, 'AutoCAD Import', 'autocad');
    }
    // Parse IFC file (Industry Foundation Classes)
    async parseIFCFile(file, modelId) {
        // IFC parsing would require a proper IFC parser library
        return this.createMockBIMModel(modelId, 'IFC Import', 'ifc');
    }
    // Parse custom format
    async parseCustomFormat(file, modelId) {
        try {
            if (!file) {
                throw new Error('No file provided for custom format parsing');
            }
            const text = await file.text();
            if (!text || text.trim().length === 0) {
                throw new Error('File is empty or contains no data');
            }
            let data;
            try {
                data = JSON.parse(text);
            }
            catch (parseError) {
                throw new Error(`Invalid JSON format in file: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
            }
            if (!data || typeof data !== 'object') {
                throw new Error('Parsed data is not a valid object');
            }
            // Validate required fields
            if (data.elements && !Array.isArray(data.elements)) {
                throw new Error('Elements field must be an array');
            }
            if (data.hiddenDetails && !Array.isArray(data.hiddenDetails)) {
                throw new Error('HiddenDetails field must be an array');
            }
            return {
                id: modelId,
                name: data.name || 'Custom BIM Model',
                source: 'custom',
                elements: data.elements || [],
                hiddenDetails: data.hiddenDetails || [],
                metadata: {
                    author: data.author || 'Unknown',
                    created: new Date(data.created || Date.now()),
                    lastModified: new Date(data.lastModified || Date.now()),
                    units: data.units || 'meters',
                    coordinateSystem: data.coordinateSystem || 'local'
                }
            };
        }
        catch (error) {
            console.error('Failed to parse custom format:', error);
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Custom format parsing failed: ${message}`);
        }
    }
    // Create mock BIM model for demonstration
    createMockBIMModel(modelId, name, source) {
        const elements = [];
        const hiddenDetails = [];
        // Create sample building elements
        const wallPositions = [
            new Vector3(0, 1, 0), new Vector3(5, 1, 0), new Vector3(0, 1, 5), new Vector3(5, 1, 5)
        ];
        wallPositions.forEach((pos, index) => {
            elements.push({
                id: `wall_${index}`,
                name: `Wall ${index + 1}`,
                type: 'wall',
                category: 'Architecture',
                position: pos,
                rotation: new Vector3(0, 0, 0),
                scale: new Vector3(5, 2.5, 0.2),
                material: 'concrete',
                properties: {
                    thickness: 0.2,
                    height: 2.5,
                    fireRating: '1hr'
                },
                visible: true
            });
        });
        // Add floor
        elements.push({
            id: 'floor_1',
            name: 'Ground Floor',
            type: 'floor',
            category: 'Architecture',
            position: new Vector3(2.5, 0, 2.5),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(5, 0.1, 5),
            material: 'concrete',
            properties: {
                thickness: 0.1,
                level: 'Ground',
                finish: 'polished'
            },
            visible: true
        });
        // Add ceiling
        elements.push({
            id: 'ceiling_1',
            name: 'Ceiling',
            type: 'ceiling',
            category: 'Architecture',
            position: new Vector3(2.5, 2.5, 2.5),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(5, 0.1, 5),
            material: 'gypsum',
            properties: {
                thickness: 0.1,
                finish: 'painted'
            },
            visible: true
        });
        // Add hidden details (wiring, plumbing, HVAC)
        const wiringDetails = [
            {
                id: 'wiring_1',
                type: 'wiring',
                position: new Vector3(1, 2.2, 1),
                description: 'Electrical wiring for lighting circuit',
                specifications: {
                    voltage: '120V',
                    amperage: '15A',
                    conductor: 'Copper 12AWG'
                },
                visible: false
            },
            {
                id: 'wiring_2',
                type: 'wiring',
                position: new Vector3(4, 2.2, 1),
                description: 'Data cable for network connection',
                specifications: {
                    type: 'Cat6',
                    length: '10m',
                    termination: 'RJ45'
                },
                visible: false
            }
        ];
        const plumbingDetails = [
            {
                id: 'plumbing_1',
                type: 'plumbing',
                position: new Vector3(3, 1.5, 0.5),
                description: 'Hot water supply line',
                specifications: {
                    diameter: '0.5"',
                    material: 'Copper',
                    pressure: '60psi'
                },
                visible: false
            },
            {
                id: 'plumbing_2',
                type: 'plumbing',
                position: new Vector3(3, 1.2, 0.5),
                description: 'Cold water supply line',
                specifications: {
                    diameter: '0.5"',
                    material: 'Copper',
                    pressure: '60psi'
                },
                visible: false
            }
        ];
        const hvacDetails = [
            {
                id: 'hvac_1',
                type: 'hvac',
                position: new Vector3(2.5, 2.3, 2.5),
                description: 'HVAC duct for air distribution',
                specifications: {
                    diameter: '8"',
                    material: 'Sheet Metal',
                    airflow: '500 CFM'
                },
                visible: false
            }
        ];
        hiddenDetails.push(...wiringDetails, ...plumbingDetails, ...hvacDetails);
        return {
            id: modelId,
            name,
            source,
            elements,
            hiddenDetails,
            metadata: {
                author: 'BIM Import System',
                created: new Date(),
                lastModified: new Date(),
                units: 'meters',
                coordinateSystem: 'local'
            }
        };
    }
    // Create Babylon.js meshes for BIM elements
    async createBIMMeshes(model) {
        if (!model || !model.elements) {
            throw new Error('Invalid BIM model provided for mesh creation');
        }
        try {
            // Create meshes for main elements
            for (const element of model.elements) {
                if (!element || !element.id) {
                    console.warn('Skipping invalid BIM element during mesh creation');
                    continue;
                }
                await this.createElementMesh(element);
            }
            // Create meshes for hidden details
            for (const detail of model.hiddenDetails) {
                if (!detail || !detail.id) {
                    console.warn('Skipping invalid BIM hidden detail during mesh creation');
                    continue;
                }
                await this.createHiddenDetailMesh(detail);
            }
        }
        catch (error) {
            console.error('Failed to create BIM meshes:', error);
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`BIM mesh creation failed: ${message}`);
        }
    }
    // Create mesh for BIM element
    async createElementMesh(element) {
        try {
            if (!element || !element.id) {
                throw new Error('Invalid BIM element provided for mesh creation');
            }
            if (!this.scene) {
                throw new Error('Scene not available for mesh creation');
            }
            let mesh;
            switch (element.type) {
                case 'wall':
                    mesh = Mesh.CreateBox(element.id, 1, this.scene);
                    break;
                case 'floor':
                case 'ceiling':
                    mesh = Mesh.CreateGround(element.id, 1, 1, 1, this.scene);
                    break;
                case 'door':
                    mesh = Mesh.CreateBox(element.id, 1, this.scene);
                    mesh.scaling.y = 0.8; // Door height
                    break;
                case 'window':
                    mesh = Mesh.CreateBox(element.id, 1, this.scene);
                    mesh.scaling.y = 0.6; // Window height
                    break;
                case 'beam':
                case 'column':
                    mesh = Mesh.CreateCylinder(element.id, 1, 0.1, 0.1, 8, 1, this.scene);
                    break;
                default:
                    mesh = Mesh.CreateBox(element.id, 1, this.scene);
            }
            if (!mesh) {
                throw new Error(`Failed to create mesh for element ${element.id}`);
            }
            mesh.position = element.position;
            mesh.rotation = element.rotation;
            mesh.scaling = element.scale;
            // Apply material
            const material = new StandardMaterial(`${element.id}_material`, this.scene);
            if (!material) {
                throw new Error(`Failed to create material for element ${element.id}`);
            }
            material.diffuseColor = this.getElementColor(element);
            mesh.material = material;
            element.mesh = mesh;
            element.visible = true;
            // Add wall elements to wall group for peeling functionality
            if (element.type === 'wall' && this.wallGroup) {
                mesh.parent = this.wallGroup;
            }
        }
        catch (error) {
            console.error(`Failed to create mesh for element ${element.id}:`, error);
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Element mesh creation failed for ${element.id}: ${message}`);
        }
    }
    // Create mesh for hidden detail
    async createHiddenDetailMesh(detail) {
        try {
            if (!detail || !detail.id) {
                throw new Error('Invalid BIM hidden detail provided for mesh creation');
            }
            if (!this.scene) {
                throw new Error('Scene not available for hidden detail mesh creation');
            }
            let mesh;
            switch (detail.type) {
                case 'wiring':
                    mesh = Mesh.CreateCylinder(detail.id, 0.05, 0.01, 0.01, 6, 1, this.scene);
                    mesh.scaling.z = 2; // Extend along wall
                    break;
                case 'plumbing':
                    mesh = Mesh.CreateCylinder(detail.id, 0.05, 0.02, 0.02, 8, 1, this.scene);
                    mesh.scaling.z = 1.5; // Pipe length
                    break;
                case 'hvac':
                    mesh = Mesh.CreateCylinder(detail.id, 0.1, 0.15, 0.15, 8, 1, this.scene);
                    mesh.scaling.z = 3; // Duct length
                    break;
                default:
                    mesh = Mesh.CreateSphere(detail.id, 8, 0.05, this.scene);
            }
            if (!mesh) {
                throw new Error(`Failed to create mesh for hidden detail ${detail.id}`);
            }
            mesh.position = detail.position;
            // Apply material for hidden details
            const material = new StandardMaterial(`${detail.id}_material`, this.scene);
            if (!material) {
                throw new Error(`Failed to create material for hidden detail ${detail.id}`);
            }
            material.diffuseColor = this.getHiddenDetailColor(detail);
            material.alpha = this.config.transparencyMode ? 0.7 : 1.0;
            mesh.material = material;
            // Add to hidden detail group
            if (this.hiddenDetailGroup) {
                mesh.parent = this.hiddenDetailGroup;
            }
            detail.mesh = mesh;
            detail.visible = false;
        }
        catch (error) {
            console.error(`Failed to create mesh for hidden detail ${detail.id}:`, error);
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Hidden detail mesh creation failed for ${detail.id}: ${message}`);
        }
    }
    // Get color for BIM element based on type
    getElementColor(element) {
        if (!this.config.colorCoding) {
            return new Color3(0.8, 0.8, 0.8); // Default gray
        }
        const colorMap = {
            wall: new Color3(0.9, 0.9, 0.9), // Light gray
            floor: new Color3(0.7, 0.7, 0.7), // Medium gray
            ceiling: new Color3(0.95, 0.95, 0.95), // Very light gray
            door: new Color3(0.6, 0.4, 0.2), // Brown
            window: new Color3(0.3, 0.6, 0.9), // Light blue
            beam: new Color3(0.5, 0.5, 0.5), // Gray
            column: new Color3(0.4, 0.4, 0.4), // Dark gray
            duct: new Color3(0.8, 0.6, 0.4), // Tan
            pipe: new Color3(0.2, 0.4, 0.6), // Blue
            cable: new Color3(0.4, 0.4, 0.1), // Yellow
            fixture: new Color3(0.8, 0.8, 0.2) // Yellow
        };
        return colorMap[element.type] || new Color3(0.8, 0.8, 0.8);
    }
    // Get color for hidden detail based on type
    getHiddenDetailColor(detail) {
        const colorMap = {
            wiring: new Color3(1, 1, 0), // Yellow
            plumbing: new Color3(0, 0, 1), // Blue
            hvac: new Color3(1, 0.5, 0), // Orange
            electrical: new Color3(1, 0, 0), // Red
            structural: new Color3(0.5, 0.5, 0.5), // Gray
            insulation: new Color3(1, 0.8, 0.8) // Pink
        };
        return colorMap[detail.type] || new Color3(0.5, 0.5, 0.5);
    }
    // Toggle hidden details visibility
    toggleHiddenDetails() {
        this.config.showHiddenDetails = !this.config.showHiddenDetails;
        if (this.hiddenDetailGroup) {
            this.hiddenDetailGroup.setEnabled(this.config.showHiddenDetails);
        }
        // Update all hidden detail meshes
        this.models.forEach(model => {
            model.hiddenDetails.forEach(detail => {
                if (detail.mesh) {
                    detail.visible = this.config.showHiddenDetails;
                    detail.mesh.setEnabled(this.config.showHiddenDetails);
                }
            });
        });
        console.log(`Hidden details ${this.config.showHiddenDetails ? 'shown' : 'hidden'}`);
    }
    // Set detail level
    setDetailLevel(level) {
        this.config.detailLevel = level;
        // Adjust mesh complexity based on detail level
        this.models.forEach(model => {
            model.elements.forEach(element => {
                if (element.mesh) {
                    this.adjustMeshDetail(element.mesh, level);
                }
            });
        });
        console.log(`Detail level set to: ${level}`);
    }
    // Adjust mesh detail level
    adjustMeshDetail(mesh, level) {
        // In a real implementation, this would switch between different LOD meshes
        // For now, we'll just adjust material properties
        const material = mesh.material;
        if (material) {
            switch (level) {
                case 'low':
                    material.alpha = 0.8;
                    break;
                case 'medium':
                    material.alpha = 0.9;
                    break;
                case 'high':
                    material.alpha = 1.0;
                    break;
            }
        }
    }
    // Toggle transparency mode
    toggleTransparencyMode() {
        this.config.transparencyMode = !this.config.transparencyMode;
        this.models.forEach(model => {
            // Update element transparency
            model.elements.forEach(element => {
                if (element.mesh && element.mesh.material) {
                    const material = element.mesh.material;
                    material.alpha = this.config.transparencyMode ? 0.7 : 1.0;
                }
            });
            // Update hidden detail transparency
            model.hiddenDetails.forEach(detail => {
                if (detail.mesh && detail.mesh.material) {
                    const material = detail.mesh.material;
                    material.alpha = this.config.transparencyMode ? 0.5 : 1.0;
                }
            });
        });
        console.log(`Transparency mode ${this.config.transparencyMode ? 'enabled' : 'disabled'}`);
    }
    // Get BIM element by ID
    getElementById(elementId) {
        for (const model of this.models.values()) {
            const element = model.elements.find(e => e.id === elementId);
            if (element)
                return element;
        }
        return null;
    }
    // Get BIM model by ID
    getModelById(modelId) {
        if (!modelId)
            return null;
        return this.models.get(modelId) || null;
    }
    // Get all BIM models
    getAllModels() {
        return Array.from(this.models.values());
    }
    // Export BIM data
    exportBIMData(modelId) {
        const model = this.models.get(modelId);
        if (!model) {
            throw new Error(`Model ${modelId} not found`);
        }
        return JSON.stringify(model, null, 2);
    }
    // Update BIM configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.applyConfigChanges();
    }
    // Apply configuration changes
    applyConfigChanges() {
        this.toggleHiddenDetails();
        this.setDetailLevel(this.config.detailLevel);
        this.toggleTransparencyMode();
    }
    // Get current configuration
    getConfig() {
        return { ...this.config };
    }
    // Highlight BIM element
    highlightElement(elementId, highlight = true) {
        const element = this.getElementById(elementId);
        if (!element || !element.mesh)
            return;
        const material = element.mesh.material;
        if (highlight) {
            material.emissiveColor = new Color3(0.2, 0.2, 0.2);
        }
        else {
            material.emissiveColor = Color3.Black();
        }
    }
    // Get element information for display
    getElementInfo(elementId) {
        const element = this.getElementById(elementId);
        if (!element)
            return null;
        return {
            id: element.id,
            name: element.name,
            type: element.type,
            category: element.category,
            material: element.material,
            properties: element.properties,
            hiddenDetails: element.hiddenDetails?.length || 0
        };
    }
    // Calculate quantity for BIM element based on its type and dimensions
    calculateElementQuantity(element) {
        const { scale, type, properties } = element;
        switch (type) {
            case 'wall':
                // Calculate wall area (length * height)
                return scale.x * scale.y;
            case 'floor':
            case 'ceiling':
                // Calculate floor/ceiling area (width * depth)
                return scale.x * scale.z;
            case 'door':
                // Calculate door area (width * height)
                return scale.x * scale.y;
            case 'window':
                // Calculate window area (width * height)
                return scale.x * scale.y;
            case 'beam':
                // Calculate beam volume (length * width * height)
                return scale.x * scale.y * scale.z;
            case 'column':
                // Calculate column volume (width * depth * height)
                return scale.x * scale.z * scale.y;
            case 'duct':
            case 'pipe':
                // Calculate linear length
                return scale.x;
            case 'cable':
                // Calculate cable length
                return scale.x;
            case 'fixture':
                // Usually counted as units
                return 1;
            default:
                // Default to volume calculation
                return scale.x * scale.y * scale.z;
        }
    }
    // Set cost estimator for cost calculations
    setCostEstimator(costEstimator) {
        this.costEstimator = costEstimator;
    }
    // Get cost estimate for a specific BIM element
    getElementCostEstimate(elementId, region) {
        if (!this.costEstimator) {
            console.warn('CostEstimator not set');
            return null;
        }
        const element = this.getElementById(elementId);
        if (!element)
            return null;
        const quantity = this.calculateElementQuantity(element);
        return this.costEstimator.calculateElementCost(element, quantity, region);
    }
    // Get cost breakdown for entire BIM model
    getModelCostBreakdown(modelId, region) {
        if (!this.costEstimator) {
            console.warn('CostEstimator not set');
            return null;
        }
        return this.costEstimator.calculateProjectCost(modelId, region || this.costEstimator['defaultRegion']);
    }
    // Compare material costs for a BIM element
    compareElementMaterialCosts(elementId, alternatives, region) {
        if (!this.costEstimator) {
            console.warn('CostEstimator not set');
            return null;
        }
        const element = this.getElementById(elementId);
        if (!element || !element.material)
            return null;
        const quantity = this.calculateElementQuantity(element);
        return this.costEstimator.compareMaterialCosts(element.material, quantity, region, alternatives);
    }
    // Get all available materials from cost estimator
    getAvailableMaterials() {
        if (!this.costEstimator) {
            console.warn('CostEstimator not set');
            return [];
        }
        return this.costEstimator.getAllMaterials();
    }
    // Update material cost in real-time
    updateMaterialCost(materialId, newCost, region) {
        if (!this.costEstimator) {
            console.warn('CostEstimator not set');
            return false;
        }
        return this.costEstimator.updateMaterialCost(materialId, newCost, region);
    }
    // Get cost estimate by ID
    getCostEstimate(estimateId) {
        if (!this.costEstimator) {
            console.warn('CostEstimator not set');
            return null;
        }
        return this.costEstimator.getCostEstimate(estimateId);
    }
    // Get all cost estimates
    getAllCostEstimates() {
        if (!this.costEstimator) {
            console.warn('CostEstimator not set');
            return [];
        }
        return this.costEstimator.getAllCostEstimates();
    }
    // Toggle wall peeling mode
    toggleWallPeeling() {
        this.config.wallPeelingMode = !this.config.wallPeelingMode;
        if (this.wallGroup) {
            if (this.config.wallPeelingMode) {
                // Make walls semi-transparent for peeling effect
                this.wallGroup.getChildMeshes().forEach(mesh => {
                    const material = mesh.material;
                    if (material) {
                        material.alpha = 0.3;
                    }
                });
            }
            else {
                // Restore wall opacity
                this.wallGroup.getChildMeshes().forEach(mesh => {
                    const material = mesh.material;
                    if (material) {
                        material.alpha = 1.0;
                    }
                });
            }
        }
        console.log(`Wall peeling mode ${this.config.wallPeelingMode ? 'enabled' : 'disabled'}`);
    }
    // Enable clash detection
    enableClashDetection() {
        this.config.clashDetectionEnabled = true;
        this.performClashDetection();
        console.log('Clash detection enabled');
    }
    // Disable clash detection
    disableClashDetection() {
        this.config.clashDetectionEnabled = false;
        // Clear existing clash highlights
        if (this.clashHighlightGroup) {
            this.clashHighlightGroup.getChildMeshes().forEach(mesh => {
                mesh.dispose();
            });
        }
        this.clashes = [];
        console.log('Clash detection disabled');
    }
    // Perform clash detection
    performClashDetection() {
        if (!this.config.clashDetectionEnabled)
            return;
        this.clashes = [];
        // Get all meshes from all models
        const allMeshes = [];
        this.models.forEach(model => {
            model.elements.forEach(element => {
                if (element.mesh) {
                    allMeshes.push(element.mesh);
                }
            });
        });
        // Simple clash detection (intersection check)
        for (let i = 0; i < allMeshes.length; i++) {
            for (let j = i + 1; j < allMeshes.length; j++) {
                const mesh1 = allMeshes[i];
                const mesh2 = allMeshes[j];
                // Check for intersection (simplified)
                if (this.checkMeshIntersection(mesh1, mesh2)) {
                    const clash = {
                        id: `clash_${this.clashes.length}`,
                        type: 'intersection',
                        severity: 'critical',
                        elements: [mesh1.id, mesh2.id],
                        description: `Intersection detected between ${mesh1.id} and ${mesh2.id}`,
                        position: mesh1.position.add(mesh2.position).scale(0.5)
                    };
                    this.clashes.push(clash);
                    this.createClashHighlight(clash);
                }
            }
        }
        console.log(`Clash detection complete: ${this.clashes.length} clashes found`);
    }
    // Check if two meshes intersect (simplified bounding box check)
    checkMeshIntersection(mesh1, mesh2) {
        const bounds1 = mesh1.getBoundingInfo().boundingBox;
        const bounds2 = mesh2.getBoundingInfo().boundingBox;
        // Check if bounding boxes intersect
        return bounds1.maximumWorld.x >= bounds2.minimumWorld.x &&
            bounds1.minimumWorld.x <= bounds2.maximumWorld.x &&
            bounds1.maximumWorld.y >= bounds2.minimumWorld.y &&
            bounds1.minimumWorld.y <= bounds2.maximumWorld.y &&
            bounds1.maximumWorld.z >= bounds2.minimumWorld.z &&
            bounds1.minimumWorld.z <= bounds2.maximumWorld.z;
    }
    // Create visual highlight for clash
    createClashHighlight(clash) {
        if (!this.clashHighlightGroup)
            return;
        // Create a sphere to highlight the clash position
        const highlightMesh = Mesh.CreateSphere(`clash_highlight_${clash.id}`, 16, 0.2, this.scene);
        highlightMesh.position = clash.position;
        // Apply red material for clash highlight
        const material = new StandardMaterial(`clash_material_${clash.id}`, this.scene);
        material.diffuseColor = new Color3(1, 0, 0);
        material.emissiveColor = new Color3(0.5, 0, 0);
        highlightMesh.material = material;
        // Add to clash highlight group
        highlightMesh.parent = this.clashHighlightGroup;
    }
    // Get all detected clashes
    getClashes() {
        return [...this.clashes];
    }
    // Get clash by ID
    getClashById(clashId) {
        return this.clashes.find(clash => clash.id === clashId) || null;
    }
    // Performance optimization: Mesh instancing methods
    // Create or get instanced mesh for repeated elements
    createInstancedMesh(element, meshType) {
        const instanceKey = `${meshType}_${element.material || 'default'}`;
        // Check if we already have instances for this type
        if (this.meshInstances.has(instanceKey)) {
            const instanceData = this.meshInstances.get(instanceKey);
            // Create new instance from source mesh
            const newInstance = instanceData.sourceMesh.createInstance(`${element.id}_instance`);
            newInstance.position = element.position;
            newInstance.rotation = element.rotation;
            newInstance.scaling = element.scale;
            // Track the instance
            instanceData.instances.push(newInstance);
            return newInstance;
        }
        // Create source mesh for future instances
        let sourceMesh;
        switch (meshType) {
            case 'wall':
                sourceMesh = Mesh.CreateBox('wall_source', 1, this.scene);
                break;
            case 'door':
                sourceMesh = Mesh.CreateBox('door_source', 1, this.scene);
                sourceMesh.scaling.y = 0.8;
                break;
            case 'window':
                sourceMesh = Mesh.CreateBox('window_source', 1, this.scene);
                sourceMesh.scaling.y = 0.6;
                break;
            case 'beam':
            case 'column':
                sourceMesh = Mesh.CreateCylinder('structural_source', 1, 0.1, 0.1, 8, 1, this.scene);
                break;
            default:
                sourceMesh = Mesh.CreateBox('default_source', 1, this.scene);
        }
        // Apply material to source mesh
        const material = new StandardMaterial(`${instanceKey}_material`, this.scene);
        material.diffuseColor = this.getElementColor(element);
        sourceMesh.material = material;
        // Make source mesh invisible (only instances will be visible)
        sourceMesh.setEnabled(false);
        // Create first instance
        const firstInstance = sourceMesh.createInstance(element.id);
        firstInstance.position = element.position;
        firstInstance.rotation = element.rotation;
        firstInstance.scaling = element.scale;
        // Store instance data
        this.meshInstances.set(instanceKey, {
            sourceMesh,
            instances: [firstInstance]
        });
        return firstInstance;
    }
    // Check if element should use instancing
    shouldUseInstancing(elementType) {
        // Count existing elements of this type
        let count = 0;
        this.models.forEach(model => {
            model.elements.forEach(element => {
                if (element.type === elementType) {
                    count++;
                }
            });
        });
        return count >= this.instanceThreshold;
    }
    // Get mesh creation key for instancing
    getMeshCreationKey(element) {
        return `${element.type}_${element.material || 'default'}_${JSON.stringify(element.scale)}`;
    }
    // Clean up mesh instances
    cleanupMeshInstances() {
        this.meshInstances.forEach((instanceData, key) => {
            // Dispose all instances
            instanceData.instances.forEach(instance => {
                instance.dispose();
            });
            // Dispose source mesh
            instanceData.sourceMesh.dispose();
        });
        this.meshInstances.clear();
    }
    // Update instance threshold
    setInstanceThreshold(threshold) {
        if (threshold < 1) {
            console.warn('Instance threshold must be at least 1');
            return;
        }
        this.instanceThreshold = threshold;
        console.log(`Instance threshold set to: ${threshold}`);
    }
    // Get current instance statistics
    getInstanceStats() {
        let totalInstances = 0;
        let uniqueTypes = this.meshInstances.size;
        this.meshInstances.forEach(instanceData => {
            totalInstances += instanceData.instances.length;
        });
        // Estimate memory savings (rough calculation)
        const estimatedSavings = totalInstances * 0.8; // Assume 80% memory savings per instance
        return {
            totalInstances,
            uniqueTypes,
            memorySavings: `${estimatedSavings.toFixed(1)}MB`
        };
    }
    // Dispose resources
    dispose() {
        // Clean up mesh instances first
        this.cleanupMeshInstances();
        this.models.forEach(model => {
            // Dispose element meshes
            model.elements.forEach(element => {
                if (element.mesh) {
                    element.mesh.dispose();
                }
            });
            // Dispose hidden detail meshes
            model.hiddenDetails.forEach(detail => {
                if (detail.mesh) {
                    detail.mesh.dispose();
                }
            });
        });
        if (this.hiddenDetailGroup) {
            this.hiddenDetailGroup.dispose();
        }
        if (this.wallGroup) {
            this.wallGroup.dispose();
        }
        if (this.clashHighlightGroup) {
            this.clashHighlightGroup.dispose();
        }
        this.models.clear();
        if (this.costEstimator) {
            this.costEstimator.dispose();
        }
    }
}
