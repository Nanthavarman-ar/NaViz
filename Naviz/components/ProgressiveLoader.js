import * as BABYLON from "@babylonjs/core";
export class ProgressiveLoader {
    constructor(scene, qualitySettings) {
        Object.defineProperty(this, "assetManager", {
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
        Object.defineProperty(this, "loadingStates", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "assetQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "activeLoads", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "maxConcurrentLoads", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3
        });
        Object.defineProperty(this, "qualitySettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "memoryManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        this.scene = scene;
        this.assetManager = new BABYLON.AssetsManager(scene);
        this.qualitySettings = qualitySettings;
        this.memoryManager = new MemoryManager();
        this.setupAssetManager();
    }
    // Setup asset manager with progress tracking
    setupAssetManager() {
        this.assetManager.onProgress = (remainingCount, totalCount, task) => {
            const progress = ((totalCount - remainingCount) / totalCount) * 100;
            this.updateLoadingState(task.name, progress, 'loading');
        };
        this.assetManager.onTaskSuccess = (task) => {
            this.updateLoadingState(task.name, 100, 'completed');
        };
        this.assetManager.onTaskError = (task) => {
            this.updateLoadingState(task.name, 0, 'failed', task.errorObject?.message);
        };
    }
    // Add asset to loading queue
    addAsset(asset) {
        // Check if asset is already loaded or loading
        if (this.loadingStates.has(asset.id)) {
            return;
        }
        // Initialize loading state
        this.loadingStates.set(asset.id, {
            id: asset.id,
            progress: 0,
            status: 'pending'
        });
        // Add to queue based on priority
        this.assetQueue.push(asset);
        this.assetQueue.sort((a, b) => this.getPriorityWeight(b) - this.getPriorityWeight(a));
        // Start loading if possible
        this.processQueue();
    }
    // Get priority weight for sorting
    getPriorityWeight(asset) {
        const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityWeights[asset.priority];
    }
    // Process loading queue
    processQueue() {
        if (this.activeLoads >= this.maxConcurrentLoads || this.assetQueue.length === 0) {
            return;
        }
        const asset = this.assetQueue.shift();
        if (!asset)
            return;
        this.activeLoads++;
        this.loadAsset(asset).finally(() => {
            this.activeLoads--;
            this.processQueue();
        });
    }
    // Load individual asset
    async loadAsset(asset) {
        const state = this.loadingStates.get(asset.id);
        if (!state)
            return;
        state.status = 'loading';
        state.startTime = Date.now();
        this.notifyListeners(asset.id, state);
        try {
            switch (asset.type) {
                case 'model':
                    await this.loadModel(asset);
                    break;
                case 'texture':
                    await this.loadTexture(asset);
                    break;
                case 'audio':
                    await this.loadAudio(asset);
                    break;
                case 'data':
                    await this.loadData(asset);
                    break;
            }
            state.status = 'completed';
            state.progress = 100;
            state.endTime = Date.now();
        }
        catch (error) {
            state.status = 'failed';
            state.error = error instanceof Error ? error.message : 'Unknown error';
            console.error(`Failed to load asset ${asset.id}:`, error);
        }
        this.notifyListeners(asset.id, state);
    }
    // Load 3D model with LOD support
    async loadModel(asset) {
        const lod = asset.lod || this.qualitySettings.modelLod;
        const url = this.getLodUrl(asset.url, lod);
        return new Promise((resolve, reject) => {
            const task = this.assetManager.addMeshTask(asset.id, '', '', url);
            task.onSuccess = (task) => {
                // Apply quality settings to loaded meshes
                task.loadedMeshes.forEach(mesh => {
                    this.optimizeMesh(mesh, lod);
                });
                resolve();
            };
            task.onError = (task, message) => {
                reject(new Error(message));
            };
            this.assetManager.load();
        });
    }
    // Load texture with quality settings
    async loadTexture(asset) {
        const maxSize = this.qualitySettings.textureSize;
        const url = this.getQualityUrl(asset.url, maxSize);
        return new Promise((resolve, reject) => {
            const samplingMode = this.qualitySettings.textureSize <= 512 ?
                BABYLON.Texture.NEAREST_SAMPLINGMODE :
                BABYLON.Texture.TRILINEAR_SAMPLINGMODE;
            const texture = new BABYLON.Texture(url, this.scene, false, false, samplingMode);
            // Use onLoadObservable which exists in Babylon.js
            texture.onLoadObservable.add(() => {
                // Apply texture optimizations
                this.optimizeTexture(texture);
                resolve();
            });
            // Check for loading errors after a timeout
            setTimeout(() => {
                if (!texture.isReady()) {
                    reject(new Error(`Texture failed to load: ${url}`));
                }
            }, 10000); // 10 second timeout
        });
    }
    // Load audio file
    async loadAudio(asset) {
        // Audio loading implementation
        console.log('Loading audio:', asset.url);
        // Placeholder for audio loading logic
    }
    // Load data file
    async loadData(asset) {
        const response = await fetch(asset.url);
        if (!response.ok) {
            throw new Error(`Failed to load data: ${response.statusText}`);
        }
        await response.json(); // or text(), depending on data type
    }
    // Get LOD-appropriate URL
    getLodUrl(baseUrl, lod) {
        // Example: model.glb -> model_low.glb, model_medium.glb, model_high.glb
        const extension = baseUrl.split('.').pop();
        const baseName = baseUrl.replace('.' + extension, '');
        return `${baseName}_${lod}.${extension}`;
    }
    // Get quality-appropriate URL
    getQualityUrl(baseUrl, maxSize) {
        // Example: texture.jpg -> texture_512.jpg, texture_1024.jpg, etc.
        const extension = baseUrl.split('.').pop();
        const baseName = baseUrl.replace('.' + extension, '');
        return `${baseName}_${maxSize}.${extension}`;
    }
    // Optimize loaded mesh based on quality settings
    optimizeMesh(mesh, lod) {
        if (lod === 'low' && mesh instanceof BABYLON.Mesh) {
            // Apply low-quality optimizations using mesh simplification
            // Note: This is a simplified version - actual simplification would require additional setup
            console.log('Applying low-quality optimizations to mesh:', mesh.name);
        }
        // Set LOD distances
        if (mesh instanceof BABYLON.Mesh) {
            mesh.addLODLevel(100, null); // Remove mesh at distance 100
        }
        // Add to memory manager
        this.memoryManager.trackMesh(mesh);
    }
    // Optimize loaded texture
    optimizeTexture(texture) {
        // Sampling mode is already set during texture creation
        // Add to memory manager
        this.memoryManager.trackTexture(texture);
    }
    // Update loading state
    updateLoadingState(id, progress, status, error) {
        const state = this.loadingStates.get(id);
        if (state) {
            state.progress = progress;
            state.status = status;
            if (error)
                state.error = error;
            this.notifyListeners(id, state);
        }
    }
    // Notify listeners of state changes
    notifyListeners(id, state) {
        const listeners = this.listeners.get(id);
        if (listeners) {
            listeners.forEach(callback => {
                try {
                    callback(state);
                }
                catch (error) {
                    console.error('Error in loading listener:', error);
                }
            });
        }
    }
    // Add loading progress listener
    addLoadingListener(assetId, callback) {
        if (!this.listeners.has(assetId)) {
            this.listeners.set(assetId, []);
        }
        this.listeners.get(assetId).push(callback);
    }
    // Remove loading progress listener
    removeLoadingListener(assetId, callback) {
        const listeners = this.listeners.get(assetId);
        if (listeners) {
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    // Get loading state
    getLoadingState(assetId) {
        return this.loadingStates.get(assetId) || null;
    }
    // Get all loading states
    getAllLoadingStates() {
        return Array.from(this.loadingStates.values());
    }
    // Get overall loading progress
    getOverallProgress() {
        const states = Array.from(this.loadingStates.values());
        if (states.length === 0)
            return 100;
        const totalProgress = states.reduce((sum, state) => sum + state.progress, 0);
        return totalProgress / states.length;
    }
    // Check if all critical assets are loaded
    areCriticalAssetsLoaded() {
        return this.assetQueue.every(asset => asset.priority !== 'critical') &&
            Array.from(this.loadingStates.values())
                .filter(state => this.assetQueue.find(a => a.id === state.id)?.priority === 'critical')
                .every(state => state.status === 'completed');
    }
    // Update quality settings and reload affected assets
    updateQualitySettings(settings) {
        this.qualitySettings = { ...this.qualitySettings, ...settings };
        // Reload assets that might be affected by quality changes
        // This is a simplified implementation
        console.log('Quality settings updated:', settings);
    }
    // Preload assets based on predicted user behavior
    preloadPredictedAssets(predictions) {
        predictions.forEach(asset => {
            if (!this.loadingStates.has(asset.id)) {
                asset.priority = 'low'; // Predicted assets get low priority
                this.addAsset(asset);
            }
        });
    }
    // Cancel loading of specific asset
    cancelLoading(assetId) {
        const state = this.loadingStates.get(assetId);
        if (state && state.status === 'loading') {
            // Find and remove from asset manager tasks
            // This is simplified - in practice, you'd need to track tasks
            state.status = 'pending';
            this.notifyListeners(assetId, state);
        }
    }
    // Clear completed assets from memory if needed
    clearCompletedAssets() {
        this.memoryManager.cleanup();
    }
    // Dispose and cleanup
    dispose() {
        // AssetsManager doesn't have a dispose method, just clear our references
        this.loadingStates.clear();
        this.assetQueue.length = 0;
        this.listeners.clear();
        this.memoryManager.dispose();
    }
}
// Memory management helper class
class MemoryManager {
    constructor() {
        Object.defineProperty(this, "trackedMeshes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "trackedTextures", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "memoryPressureThreshold", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.8
        }); // 80% memory usage
    }
    trackMesh(mesh) {
        this.trackedMeshes.add(mesh);
    }
    trackTexture(texture) {
        this.trackedTextures.add(texture);
    }
    // Check memory pressure and cleanup if needed
    checkMemoryPressure() {
        // Simplified memory pressure detection
        // In practice, you'd use performance.memory if available
        const meshCount = this.trackedMeshes.size;
        const textureCount = this.trackedTextures.size;
        return meshCount > 100 || textureCount > 50; // Arbitrary thresholds
    }
    // Cleanup unused assets
    cleanup() {
        if (!this.checkMemoryPressure())
            return;
        // Dispose of meshes that are far from camera
        const camera = BABYLON.Camera; // Would need actual camera reference
        // Implementation would dispose distant meshes
        // Dispose of unused textures
        this.trackedTextures.forEach(texture => {
            if (texture.getClassName() === 'Texture' && !texture.hasAlpha) {
                // Dispose texture if not recently used
                // This is simplified - you'd need usage tracking
            }
        });
        console.log('Memory cleanup performed');
    }
    dispose() {
        this.trackedMeshes.clear();
        this.trackedTextures.clear();
    }
}
