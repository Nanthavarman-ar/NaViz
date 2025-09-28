import { Mesh, Vector3, Color3, StandardMaterial } from '@babylonjs/core';
export class SpaceOptimizerManager {
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
        Object.defineProperty(this, "analyses", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "optimizations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "previewMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "undoStack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "redoStack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.engine = engine;
        this.scene = scene;
        this.featureManager = featureManager;
    }
    // Analyze current space layout
    async analyzeSpace() {
        if (!this.featureManager.isFeatureEnabled('space_optimization')) {
            throw new Error('Space optimization feature is not enabled');
        }
        const analysisId = `analysis_${Date.now()}`;
        const meshes = this.scene.meshes;
        const walls = meshes.filter(mesh => mesh.name.toLowerCase().includes('wall'));
        const furniture = meshes.filter(mesh => this.isFurniture(mesh));
        const lights = this.scene.lights;
        // Calculate room dimensions and area
        const roomBounds = this.calculateRoomBounds(walls);
        const area = this.calculateArea(roomBounds);
        // Detect room type
        const roomType = this.detectRoomType(furniture, area);
        // Analyze space efficiency
        const efficiency = this.calculateEfficiency(walls, furniture, lights, roomBounds);
        // Identify issues
        const issues = await this.identifyIssues(walls, furniture, lights, roomBounds);
        // Generate recommendations
        const recommendations = await this.generateRecommendations(issues, roomType, area);
        const analysis = {
            id: analysisId,
            roomType,
            area,
            efficiency,
            issues,
            recommendations,
            timestamp: Date.now()
        };
        this.analyses.set(analysisId, analysis);
        return analysis;
    }
    // Generate optimization suggestions
    async generateOptimization(analysisId) {
        const analysis = this.analyses.get(analysisId);
        if (!analysis) {
            throw new Error('Analysis not found');
        }
        const optimizationId = `opt_${Date.now()}`;
        // Generate optimized layout
        const optimizedLayout = await this.createOptimizedLayout(analysis);
        // Calculate improvements
        const improvements = this.calculateImprovements(analysis, optimizedLayout);
        // Estimate cost and time savings
        const costSavings = this.estimateCostSavings(improvements);
        const timeSavings = this.estimateTimeSavings(improvements);
        const result = {
            id: optimizationId,
            originalAnalysis: analysis,
            optimizedLayout,
            improvements,
            costSavings,
            timeSavings,
            applied: false
        };
        this.optimizations.set(optimizationId, result);
        return result;
    }
    // Apply optimization to scene
    async applyOptimization(optimizationId) {
        const optimization = this.optimizations.get(optimizationId);
        if (!optimization) {
            throw new Error('Optimization not found');
        }
        // Store current state for undo
        const currentState = await this.captureCurrentState();
        this.undoStack.push(currentState);
        // Apply wall modifications
        for (const wallMod of optimization.optimizedLayout.walls) {
            await this.applyWallModification(wallMod);
        }
        // Apply furniture repositioning
        for (const furniturePlacement of optimization.optimizedLayout.furniture) {
            await this.applyFurniturePlacement(furniturePlacement);
        }
        // Apply lighting optimization
        for (const lightOpt of optimization.optimizedLayout.lighting) {
            await this.applyLightingOptimization(lightOpt);
        }
        optimization.applied = true;
        this.redoStack = []; // Clear redo stack
    }
    // Preview optimization without applying
    async previewOptimization(optimizationId) {
        const optimization = this.optimizations.get(optimizationId);
        if (!optimization) {
            throw new Error('Optimization not found');
        }
        this.previewMode = true;
        // Create preview meshes with transparency
        for (const wallMod of optimization.optimizedLayout.walls) {
            await this.createPreviewWall(wallMod);
        }
        for (const furniturePlacement of optimization.optimizedLayout.furniture) {
            await this.createPreviewFurniture(furniturePlacement);
        }
    }
    // Remove preview
    removePreview() {
        const previewMeshes = this.scene.meshes.filter(mesh => mesh.name.startsWith('preview_'));
        previewMeshes.forEach(mesh => mesh.dispose());
        this.previewMode = false;
    }
    // Undo last optimization
    async undo() {
        if (this.undoStack.length === 0) {
            throw new Error('Nothing to undo');
        }
        const previousState = this.undoStack.pop();
        this.redoStack.push(await this.captureCurrentState());
        await this.restoreState(previousState);
    }
    // Redo last undone optimization
    async redo() {
        if (this.redoStack.length === 0) {
            throw new Error('Nothing to redo');
        }
        const nextState = this.redoStack.pop();
        this.undoStack.push(await this.captureCurrentState());
        await this.restoreState(nextState);
    }
    // Helper methods
    calculateRoomBounds(walls) {
        if (walls.length === 0) {
            return { min: new Vector3(-5, 0, -5), max: new Vector3(5, 3, 5) };
        }
        let min = walls[0].position.clone();
        let max = walls[0].position.clone();
        walls.forEach(wall => {
            min = Vector3.Minimize(min, wall.position);
            max = Vector3.Maximize(max, wall.position);
        });
        return { min, max };
    }
    calculateArea(bounds) {
        const width = bounds.max.x - bounds.min.x;
        const depth = bounds.max.z - bounds.min.z;
        return Math.abs(width * depth);
    }
    detectRoomType(furniture, area) {
        // Simple room type detection based on furniture and area
        const furnitureNames = furniture.map(f => f.name.toLowerCase());
        if (furnitureNames.some(name => name.includes('bed'))) {
            return 'bedroom';
        }
        else if (furnitureNames.some(name => name.includes('sofa') || name.includes('tv'))) {
            return 'living_room';
        }
        else if (furnitureNames.some(name => name.includes('desk') || name.includes('chair'))) {
            return 'office';
        }
        else if (furnitureNames.some(name => name.includes('table') || name.includes('stove'))) {
            return 'kitchen';
        }
        else if (area < 10) {
            return 'bathroom';
        }
        else {
            return 'living_room'; // Default
        }
    }
    calculateEfficiency(walls, furniture, lights, bounds) {
        let score = 50; // Base score
        // Lighting efficiency
        if (lights.length > 0)
            score += 15;
        // Furniture arrangement efficiency
        const furnitureDensity = furniture.length / Math.max(this.calculateArea(bounds), 1);
        if (furnitureDensity > 0.1 && furnitureDensity < 0.5)
            score += 20;
        // Space utilization
        const wallCount = walls.length;
        if (wallCount >= 4)
            score += 15; // Proper room structure
        return Math.min(100, Math.max(0, score));
    }
    async identifyIssues(walls, furniture, lights, bounds) {
        const issues = [];
        // Check for wall obstructions
        walls.forEach((wall, index) => {
            if (wall.scaling.x > 10 || wall.scaling.z > 10) {
                issues.push({
                    type: 'wall_obstruction',
                    severity: 'medium',
                    description: 'Large wall may be blocking natural light or flow',
                    location: wall.position,
                    affectedArea: wall.scaling.x * wall.scaling.z
                });
            }
        });
        // Check furniture placement
        furniture.forEach(furniture => {
            const distanceToWalls = this.calculateDistanceToWalls(furniture, walls);
            if (distanceToWalls < 0.5) {
                issues.push({
                    type: 'poor_flow',
                    severity: 'low',
                    description: 'Furniture too close to walls, may impede movement',
                    location: furniture.position,
                    affectedArea: furniture.scaling.x * furniture.scaling.z
                });
            }
        });
        // Check lighting
        if (lights.length === 0) {
            issues.push({
                type: 'lighting',
                severity: 'high',
                description: 'No artificial lighting detected',
                location: bounds.min,
                affectedArea: this.calculateArea(bounds)
            });
        }
        return issues;
    }
    async generateRecommendations(issues, roomType, area) {
        const recommendations = [];
        // Generate recommendations based on issues
        issues.forEach((issue, index) => {
            switch (issue.type) {
                case 'wall_obstruction':
                    recommendations.push({
                        id: `rec_wall_${index}`,
                        type: 'remove_wall',
                        description: 'Consider removing or modifying obstructing wall to improve space flow',
                        estimatedImprovement: 15,
                        cost: 5000,
                        complexity: 'high'
                    });
                    break;
                case 'poor_flow':
                    recommendations.push({
                        id: `rec_flow_${index}`,
                        type: 'move_furniture',
                        description: 'Reposition furniture to improve traffic flow and accessibility',
                        estimatedImprovement: 10,
                        cost: 500,
                        complexity: 'low'
                    });
                    break;
                case 'lighting':
                    recommendations.push({
                        id: `rec_light_${index}`,
                        type: 'add_window',
                        description: 'Add windows or improve lighting to enhance space quality',
                        estimatedImprovement: 20,
                        cost: 2000,
                        complexity: 'medium'
                    });
                    break;
            }
        });
        // Add room-specific recommendations
        switch (roomType) {
            case 'living_room':
                recommendations.push({
                    id: 'rec_living_layout',
                    type: 'reconfigure_layout',
                    description: 'Optimize living room layout for better conversation areas',
                    estimatedImprovement: 12,
                    cost: 1000,
                    complexity: 'medium'
                });
                break;
            case 'kitchen':
                recommendations.push({
                    id: 'rec_kitchen_workflow',
                    type: 'move_furniture',
                    description: 'Rearrange kitchen for better workflow (work triangle)',
                    estimatedImprovement: 18,
                    cost: 800,
                    complexity: 'medium'
                });
                break;
        }
        return recommendations;
    }
    async createOptimizedLayout(analysis) {
        const walls = [];
        const furniture = [];
        const lighting = [];
        // Optimize wall layout
        analysis.issues.forEach(issue => {
            if (issue.type === 'wall_obstruction') {
                walls.push({
                    wallId: `wall_${Math.random().toString(36).substr(2, 9)}`,
                    action: 'modify',
                    position: issue.location.add(new Vector3(0, 0, 1)),
                    dimensions: { width: 8, height: 3, depth: 0.2 }
                });
            }
        });
        // Optimize furniture placement
        const sceneFurniture = this.scene.meshes.filter(mesh => this.isFurniture(mesh));
        sceneFurniture.forEach(furnitureMesh => {
            const optimizedPosition = this.calculateOptimalFurniturePosition(furnitureMesh, analysis.roomType);
            furniture.push({
                furnitureId: furnitureMesh.id,
                originalPosition: furnitureMesh.position.clone(),
                optimizedPosition,
                rotation: furnitureMesh.rotation.clone(),
                reason: 'Improved space flow and accessibility'
            });
        });
        // Optimize lighting
        this.scene.lights.forEach(light => {
            lighting.push({
                lightId: light.id,
                originalIntensity: light.intensity,
                optimizedIntensity: Math.min(light.intensity * 1.2, 2.0)
            });
        });
        const score = analysis.efficiency + 15; // Assume 15 point improvement
        return { walls, furniture, lighting, score };
    }
    calculateImprovements(original, optimized) {
        return [
            {
                category: 'Space Efficiency',
                metric: 'Overall Score',
                before: original.efficiency,
                after: optimized.score,
                percentageChange: ((optimized.score - original.efficiency) / original.efficiency) * 100
            },
            {
                category: 'Layout',
                metric: 'Issues Resolved',
                before: original.issues.length,
                after: Math.max(0, original.issues.length - optimized.walls.length),
                percentageChange: optimized.walls.length > 0 ? (optimized.walls.length / original.issues.length) * 100 : 0
            },
            {
                category: 'Lighting',
                metric: 'Average Intensity',
                before: this.scene.lights.reduce((sum, light) => sum + light.intensity, 0) / Math.max(this.scene.lights.length, 1),
                after: optimized.lighting.reduce((sum, opt) => sum + opt.optimizedIntensity, 0) / Math.max(optimized.lighting.length, 1),
                percentageChange: optimized.lighting.length > 0 ? 10 : 0 // Assume 10% improvement
            }
        ];
    }
    estimateCostSavings(improvements) {
        // Simple cost estimation based on improvements
        let savings = 0;
        improvements.forEach(improvement => {
            if (improvement.category === 'Space Efficiency') {
                savings += improvement.percentageChange * 100; // $100 per percentage point
            }
        });
        return Math.round(savings);
    }
    estimateTimeSavings(improvements) {
        // Estimate time savings in hours
        let timeSavings = 0;
        improvements.forEach(improvement => {
            if (improvement.category === 'Layout') {
                timeSavings += improvement.percentageChange * 0.5; // 0.5 hours per percentage point
            }
        });
        return Math.round(timeSavings * 10) / 10;
    }
    async applyWallModification(modification) {
        const wallMesh = this.scene.getMeshById(modification.wallId) ||
            this.scene.meshes.find(mesh => mesh.name.toLowerCase().includes('wall'));
        if (wallMesh) {
            if (modification.action === 'remove') {
                wallMesh.dispose();
            }
            else if (modification.action === 'modify') {
                wallMesh.position = modification.position;
                wallMesh.scaling = new Vector3(modification.dimensions.width, modification.dimensions.height, modification.dimensions.depth);
            }
        }
    }
    async applyFurniturePlacement(placement) {
        const furnitureMesh = this.scene.getMeshById(placement.furnitureId);
        if (furnitureMesh) {
            furnitureMesh.position = placement.optimizedPosition;
            furnitureMesh.rotation = placement.rotation;
        }
    }
    async applyLightingOptimization(optimization) {
        const light = this.scene.getLightById(optimization.lightId);
        if (light) {
            light.intensity = optimization.optimizedIntensity;
        }
    }
    async createPreviewWall(modification) {
        const previewMesh = Mesh.CreateBox(`preview_wall_${modification.wallId}`, 1, this.scene);
        previewMesh.position = modification.position;
        previewMesh.scaling = new Vector3(modification.dimensions.width, modification.dimensions.height, modification.dimensions.depth);
        const material = new StandardMaterial(`preview_wall_mat_${modification.wallId}`, this.scene);
        material.diffuseColor = new Color3(0, 1, 0);
        material.alpha = 0.5;
        previewMesh.material = material;
    }
    async createPreviewFurniture(placement) {
        const originalMesh = this.scene.getMeshById(placement.furnitureId);
        if (originalMesh) {
            const previewMesh = originalMesh.clone(`preview_${placement.furnitureId}`, null);
            if (previewMesh) {
                previewMesh.position = placement.optimizedPosition;
                previewMesh.rotation = placement.rotation;
                // Make preview semi-transparent
                if (previewMesh.material) {
                    const material = previewMesh.material.clone(`preview_mat_${placement.furnitureId}`);
                    if (material) {
                        material.alpha = 0.7;
                        previewMesh.material = material;
                    }
                }
            }
        }
    }
    async captureCurrentState() {
        // Capture current mesh positions, rotations, and lighting
        const meshes = this.scene.meshes.map(mesh => ({
            id: mesh.id,
            position: mesh.position.clone(),
            rotation: mesh.rotation.clone(),
            scaling: mesh.scaling.clone()
        }));
        const lights = this.scene.lights.map(light => ({
            id: light.id,
            intensity: light.intensity,
            position: 'position' in light ? light.position?.clone() : undefined,
            type: light.constructor.name
        }));
        return { meshes, lights, timestamp: Date.now() };
    }
    async restoreState(state) {
        // Restore mesh positions and rotations
        state.meshes.forEach((meshState) => {
            const mesh = this.scene.getMeshById(meshState.id);
            if (mesh) {
                mesh.position = meshState.position;
                mesh.rotation = meshState.rotation;
                mesh.scaling = meshState.scaling;
            }
        });
        // Restore lighting
        state.lights.forEach((lightState) => {
            const light = this.scene.getLightById(lightState.id);
            if (light) {
                light.intensity = lightState.intensity;
                if (lightState.position && 'position' in light) {
                    light.position = lightState.position;
                }
            }
        });
    }
    isFurniture(mesh) {
        const furnitureKeywords = ['sofa', 'chair', 'table', 'bed', 'desk', 'cabinet', 'shelf'];
        return furnitureKeywords.some(keyword => mesh.name.toLowerCase().includes(keyword));
    }
    calculateDistanceToWalls(furniture, walls) {
        let minDistance = Infinity;
        walls.forEach(wall => {
            const distance = Vector3.Distance(furniture.position, wall.position);
            minDistance = Math.min(minDistance, distance);
        });
        return minDistance;
    }
    calculateOptimalFurniturePosition(furniture, roomType) {
        // Simple optimization - move furniture slightly away from walls
        const walls = this.scene.meshes.filter(mesh => mesh.name.toLowerCase().includes('wall'));
        const distanceToWalls = this.calculateDistanceToWalls(furniture, walls);
        if (distanceToWalls < 1) {
            // Move furniture toward center of room
            const roomCenter = this.calculateRoomCenter(walls);
            const direction = roomCenter.subtract(furniture.position).normalize();
            return furniture.position.add(direction.scale(0.5));
        }
        return furniture.position;
    }
    calculateRoomCenter(walls) {
        if (walls.length === 0)
            return new Vector3(0, 0, 0);
        let center = new Vector3(0, 0, 0);
        walls.forEach(wall => {
            center = center.add(wall.position);
        });
        return center.scale(1 / walls.length);
    }
    // Public API methods
    getAnalyses() {
        return Array.from(this.analyses.values());
    }
    getOptimizations() {
        return Array.from(this.optimizations.values());
    }
    getAnalysis(analysisId) {
        return this.analyses.get(analysisId);
    }
    getOptimization(optimizationId) {
        return this.optimizations.get(optimizationId);
    }
    canUndo() {
        return this.undoStack.length > 0;
    }
    canRedo() {
        return this.redoStack.length > 0;
    }
    isPreviewMode() {
        return this.previewMode;
    }
    // Dispose resources
    dispose() {
        this.removePreview();
        this.analyses.clear();
        this.optimizations.clear();
        this.undoStack = [];
        this.redoStack = [];
    }
}
