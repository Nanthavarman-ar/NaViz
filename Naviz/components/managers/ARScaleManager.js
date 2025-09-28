import { Vector3, TransformNode } from '@babylonjs/core';
/**
 * Manages AR scale mode for accurate physical representation
 */
export class ARScaleManager {
    constructor(scene, bimManager) {
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
        Object.defineProperty(this, "arMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                enabled: false,
                scale: 0.1,
                position: Vector3.Zero(),
                rotation: Vector3.Zero(),
                physicalTableSize: { width: 1.2, depth: 0.8 },
                modelBounds: { min: Vector3.Zero(), max: Vector3.Zero() }
            }
        });
        Object.defineProperty(this, "originalTransforms", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "rootNode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.scene = scene;
        this.bimManager = bimManager;
        this.initializeRootNode();
    }
    /**
     * Initializes the root node for AR scaling
     */
    initializeRootNode() {
        this.rootNode = new TransformNode('ar_scale_root', this.scene);
    }
    /**
     * Enables AR scale mode with specified physical table size
     * @param physicalTableSize - Physical dimensions of the table in meters
     */
    enableARScaleMode(physicalTableSize) {
        try {
            this.arMode.physicalTableSize = physicalTableSize;
            this.arMode.enabled = true;
            // Calculate model bounds
            this.calculateModelBounds();
            // Calculate optimal scale to fit on table
            this.calculateOptimalScale();
            // Save original transforms
            this.saveOriginalTransforms();
            // Apply AR scaling
            this.applyARScaling();
            console.log(`AR scale mode enabled with scale ${this.arMode.scale}`);
        }
        catch (error) {
            console.error('Failed to enable AR scale mode:', error);
            throw error;
        }
    }
    /**
     * Disables AR scale mode and restores original transforms
     */
    disableARScaleMode() {
        try {
            this.arMode.enabled = false;
            // Restore original transforms
            this.restoreOriginalTransforms();
            // Clear saved transforms
            this.originalTransforms.clear();
            console.log('AR scale mode disabled');
        }
        catch (error) {
            console.error('Failed to disable AR scale mode:', error);
            throw error;
        }
    }
    /**
     * Updates the AR scale based on new physical table size
     * @param physicalTableSize - New physical dimensions
     */
    updatePhysicalTableSize(physicalTableSize) {
        if (!this.arMode.enabled)
            return;
        try {
            this.arMode.physicalTableSize = physicalTableSize;
            this.calculateOptimalScale();
            this.applyARScaling();
            console.log(`Updated physical table size to ${physicalTableSize.width}x${physicalTableSize.depth}m`);
        }
        catch (error) {
            console.error('Failed to update physical table size:', error);
            throw error;
        }
    }
    /**
     * Sets the position and rotation for AR display
     * @param position - Position vector
     * @param rotation - Rotation vector (Euler angles)
     */
    setARPosition(position, rotation) {
        if (!this.arMode.enabled)
            return;
        try {
            this.arMode.position = position.clone();
            this.arMode.rotation = rotation.clone();
            if (this.rootNode) {
                this.rootNode.position = this.arMode.position;
                this.rootNode.rotation = this.arMode.rotation;
            }
            console.log(`Set AR position to ${position} with rotation ${rotation}`);
        }
        catch (error) {
            console.error('Failed to set AR position:', error);
            throw error;
        }
    }
    /**
     * Calculates the bounding box of all BIM models
     */
    calculateModelBounds() {
        try {
            let min = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
            let max = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
            // Get all meshes from BIM models
            this.scene.meshes.forEach(mesh => {
                if (mesh.name.startsWith('bim_') || mesh.name.includes('model')) {
                    const bounds = mesh.getBoundingInfo().boundingBox;
                    min = Vector3.Minimize(min, bounds.minimumWorld);
                    max = Vector3.Maximize(max, bounds.maximumWorld);
                }
            });
            this.arMode.modelBounds = { min, max };
        }
        catch (error) {
            console.error('Failed to calculate model bounds:', error);
            // Fallback bounds
            this.arMode.modelBounds = {
                min: new Vector3(-1, -1, -1),
                max: new Vector3(1, 1, 1)
            };
        }
    }
    /**
     * Calculates the optimal scale to fit the model on the physical table
     */
    calculateOptimalScale() {
        try {
            const modelSize = this.arMode.modelBounds.max.subtract(this.arMode.modelBounds.min);
            const tableSize = new Vector3(this.arMode.physicalTableSize.width, Math.max(modelSize.y, 0.1), // Keep height reasonable
            this.arMode.physicalTableSize.depth);
            // Calculate scale factors for width and depth
            const scaleX = tableSize.x / modelSize.x;
            const scaleZ = tableSize.z / modelSize.z;
            // Use the smaller scale to ensure it fits
            this.arMode.scale = Math.min(scaleX, scaleZ) * 0.9; // 90% to leave some margin
            // Ensure minimum and maximum scales
            this.arMode.scale = Math.max(0.01, Math.min(1.0, this.arMode.scale));
        }
        catch (error) {
            console.error('Failed to calculate optimal scale:', error);
            this.arMode.scale = 0.1; // Default scale
        }
    }
    /**
     * Saves the original transforms of all meshes
     */
    saveOriginalTransforms() {
        try {
            this.scene.meshes.forEach(mesh => {
                if (mesh.name.startsWith('bim_') || mesh.name.includes('model')) {
                    this.originalTransforms.set(mesh.name, {
                        position: mesh.position.clone(),
                        scaling: mesh.scaling.clone(),
                        rotation: mesh.rotation.clone()
                    });
                }
            });
        }
        catch (error) {
            console.error('Failed to save original transforms:', error);
        }
    }
    /**
     * Applies AR scaling to all relevant meshes
     */
    applyARScaling() {
        try {
            if (!this.rootNode)
                return;
            // Reset root node
            this.rootNode.position = this.arMode.position;
            this.rootNode.rotation = this.arMode.rotation;
            this.rootNode.scaling = new Vector3(this.arMode.scale, this.arMode.scale, this.arMode.scale);
            // Parent all model meshes to root node
            this.scene.meshes.forEach(mesh => {
                if ((mesh.name.startsWith('bim_') || mesh.name.includes('model')) && mesh.parent !== this.rootNode) {
                    // Calculate relative transform
                    const worldMatrix = mesh.computeWorldMatrix(true);
                    mesh.parent = this.rootNode;
                    // Reset local transform since parent now handles scaling
                    mesh.position = Vector3.Zero();
                    mesh.rotation = Vector3.Zero();
                    mesh.scaling = Vector3.One();
                }
            });
        }
        catch (error) {
            console.error('Failed to apply AR scaling:', error);
        }
    }
    /**
     * Restores the original transforms of all meshes
     */
    restoreOriginalTransforms() {
        try {
            this.originalTransforms.forEach((transform, meshName) => {
                const mesh = this.scene.getMeshByName(meshName);
                if (mesh) {
                    mesh.parent = null;
                    mesh.position = transform.position;
                    mesh.rotation = transform.rotation;
                    mesh.scaling = transform.scaling;
                }
            });
            // Reset root node
            if (this.rootNode) {
                this.rootNode.position = Vector3.Zero();
                this.rootNode.rotation = Vector3.Zero();
                this.rootNode.scaling = Vector3.One();
            }
        }
        catch (error) {
            console.error('Failed to restore original transforms:', error);
        }
    }
    /**
     * Gets the current AR scale mode configuration
     * @returns Current AR mode settings
     */
    getARMode() {
        return { ...this.arMode };
    }
    /**
     * Checks if AR scale mode is currently enabled
     * @returns True if AR mode is active
     */
    isARModeEnabled() {
        return this.arMode.enabled;
    }
    /**
     * Gets the current scale factor
     * @returns Scale factor
     */
    getCurrentScale() {
        return this.arMode.scale;
    }
    /**
     * Disposes of the AR scale manager
     */
    dispose() {
        this.disableARScaleMode();
        if (this.rootNode) {
            this.rootNode.dispose();
            this.rootNode = null;
        }
    }
}
