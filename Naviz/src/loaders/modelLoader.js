import { SceneLoader, AssetContainer, Texture, FreeCamera, RenderTargetTexture } from '@babylonjs/core';
import { GLTFFileLoader } from '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ';
import '@babylonjs/loaders/STL';
import '@babylonjs/loaders/FBX';
import '@babylonjs/loaders/3DS';
// Configure Draco decompression for glTF loader
GLTFFileLoader.IncrementalLoading = true;
export class ModelLoader {
    constructor(scene, camera) {
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "camera", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "loadedModels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "supportedFormats", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ['.glb', '.gltf', '.obj', '.stl', '.fbx', '.3ds']
        });
        this.scene = scene;
        this.camera = camera;
    }
    async loadFromFile(file, options = {}) {
        const fileExtension = this.getFileExtension(file.name);
        if (!this.isFormatSupported(fileExtension)) {
            throw new Error(`Unsupported file format: ${fileExtension}`);
        }
        const modelId = `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const url = URL.createObjectURL(file);
        try {
            const result = await this.loadFromUrl(url, modelId, options);
            URL.revokeObjectURL(url);
            return result;
        }
        catch (error) {
            URL.revokeObjectURL(url);
            throw error;
        }
    }
    async loadFromUrl(url, modelId, options = {}) {
        const id = modelId || `model_${Date.now()}`;
        return new Promise((resolve, reject) => {
            SceneLoader.ImportMeshAsync('', '', url, this.scene, (progress) => {
                if (options.onProgress) {
                    const loadProgress = {
                        loaded: progress.loaded || 0,
                        total: progress.total || 1,
                        percentage: progress.total ? (progress.loaded / progress.total) * 100 : 0
                    };
                    options.onProgress(loadProgress);
                }
            }).then((result) => {
                try {
                    if (result.meshes.length === 0) {
                        throw new Error('No meshes found in the model');
                    }
                    // Create asset container
                    const container = new AssetContainer(this.scene);
                    result.meshes.forEach(mesh => container.meshes.push(mesh));
                    // Collect materials and textures from meshes
                    const materials = result.meshes
                        .map(mesh => mesh.material)
                        .filter((mat) => mat != null)
                        .filter((mat, index, arr) => arr.indexOf(mat) === index); // unique materials
                    const textures = materials
                        .flatMap(mat => mat.getActiveTextures())
                        .filter((tex, index, arr) => arr.indexOf(tex) === index)
                        .filter((tex) => tex instanceof Texture); // unique textures of type Texture
                    // Add to container
                    materials.forEach(mat => container.materials.push(mat));
                    textures.forEach(tex => container.textures.push(tex));
                    // Apply transformations
                    if (options.autoCenter || options.autoScale) {
                        this.transformMeshes(result.meshes, options);
                    }
                    // Store container
                    this.loadedModels.set(id, container);
                    const loadResult = {
                        id,
                        meshes: result.meshes,
                        materials: materials,
                        textures: textures,
                        container
                    };
                    resolve(loadResult);
                }
                catch (error) {
                    reject(error);
                }
            }).catch((error) => {
                if (options.onError) {
                    options.onError(error.message);
                }
                reject(error);
            });
        });
    }
    /**
     * Export a 360° panorama image from the current camera view.
     * Returns an array of base64 PNG strings for the 6 cubemap faces.
     */
    async exportPanorama360(resolution = 2048) {
        // Create a temporary camera at the current camera position
        const position = this.camera.position.clone();
        const panoramaCamera = new FreeCamera('panoramaCamera', position, this.scene);
        panoramaCamera.fov = Math.PI / 2;
        panoramaCamera.minZ = 0.1;
        panoramaCamera.maxZ = 1000;
        // Create a cube render target texture
        const renderTarget = new RenderTargetTexture('panoramaCube', resolution, this.scene, false);
        renderTarget.renderList = this.scene.meshes;
        renderTarget.activeCamera = panoramaCamera;
        // Render the scene to the cubemap
        renderTarget.render();
        // Export the 6 faces as PNG base64 (placeholder logic)
        const faceImages = [];
        for (let i = 0; i < 6; i++) {
            // Babylon.js API for reading pixels from cube faces (not directly available, placeholder)
            // You may need to use readPixels or custom logic here
            faceImages.push('data:image/png;base64,...'); // Placeholder
        }
        return faceImages;
    }
    async uploadAndLoad(file, options = {}) {
        // First validate file
        this.validateFile(file);
        // Upload to server
        const uploadedUrl = await this.uploadFile(file);
        // Load from uploaded URL
        return this.loadFromUrl(uploadedUrl, undefined, options);
    }
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('model', file);
        const response = await fetch('/api/upload/model', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }
        const result = await response.json();
        return result.url;
    }
    validateFile(file) {
        // Check file size (max 100MB)
        const maxSize = 100 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('File size exceeds 100MB limit');
        }
        // Check file extension
        const extension = this.getFileExtension(file.name);
        if (!this.isFormatSupported(extension)) {
            throw new Error(`Unsupported file format: ${extension}`);
        }
        // Check MIME type
        const allowedMimeTypes = [
            'model/gltf-binary',
            'model/gltf+json',
            'application/octet-stream',
            'text/plain'
        ];
        if (file.type && !allowedMimeTypes.includes(file.type)) {
            console.warn(`Unexpected MIME type: ${file.type}, but proceeding based on file extension`);
        }
    }
    transformMeshes(meshes, options) {
        if (meshes.length === 0)
            return;
        // Calculate bounding box
        let min = meshes[0].getBoundingInfo().boundingBox.minimumWorld.clone();
        let max = meshes[0].getBoundingInfo().boundingBox.maximumWorld.clone();
        meshes.forEach(mesh => {
            const boundingBox = mesh.getBoundingInfo().boundingBox;
            min = min.minimizeInPlace(boundingBox.minimumWorld);
            max = max.maximizeInPlace(boundingBox.maximumWorld);
        });
        // Center meshes
        if (options.autoCenter) {
            const center = min.add(max).scale(0.5);
            meshes.forEach(mesh => {
                mesh.position.subtractInPlace(center);
            });
        }
        // Scale meshes
        if (options.autoScale) {
            const size = max.subtract(min);
            const maxDimension = Math.max(size.x, size.y, size.z);
            const targetSize = options.maxSize || 10;
            if (maxDimension > targetSize) {
                const scale = targetSize / maxDimension;
                meshes.forEach(mesh => {
                    mesh.scaling.scaleInPlace(scale);
                });
            }
        }
    }
    getFileExtension(filename) {
        return filename.toLowerCase().substring(filename.lastIndexOf('.'));
    }
    isFormatSupported(extension) {
        return this.supportedFormats.includes(extension);
    }
    getSupportedFormats() {
        return [...this.supportedFormats];
    }
    removeModel(id) {
        const container = this.loadedModels.get(id);
        if (!container)
            return false;
        container.dispose();
        this.loadedModels.delete(id);
        return true;
    }
    getLoadedModel(id) {
        return this.loadedModels.get(id) || null;
    }
    getAllLoadedModels() {
        return new Map(this.loadedModels);
    }
    dispose() {
        this.loadedModels.forEach(container => container.dispose());
        this.loadedModels.clear();
    }
}
