import { FreeCamera, RenderTargetTexture, Engine, Scene, ArcRotateCamera, UniversalCamera, DirectionalLight, Vector3, Color3, Color4, Mesh, StandardMaterial, PBRMaterial, ShadowGenerator, DefaultRenderingPipeline, SSAORenderingPipeline, SceneOptimizer, SceneOptimizerOptions, HardwareScalingOptimization, ShadowsOptimization, PostProcessesOptimization, LensFlaresOptimization, ParticlesOptimization, RenderTargetsOptimization, MergeMeshesOptimization, GizmoManager, UtilityLayerRenderer, AssetContainer, SceneLoader, ActionManager, HighlightLayer, Plane } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';
import '@babylonjs/loaders/OBJ';
export class SceneManager {
    /**
     * Record a video of the scene from the canvas and export as a webm/mp4 file.
     * duration: seconds to record
     * mimeType: video format (e.g., 'video/webm')
     */
    async exportVideo(duration = 10, mimeType = 'video/webm') {
        const canvas = this.engine.getRenderingCanvas();
        if (!canvas)
            throw new Error('No rendering canvas found');
        // Set up MediaRecorder
        const stream = canvas.captureStream();
        const recorder = new MediaRecorder(stream, { mimeType });
        const chunks = [];
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0)
                chunks.push(e.data);
        };
        recorder.start();
        // Wait for the specified duration
        await new Promise(resolve => setTimeout(resolve, duration * 1000));
        recorder.stop();
        // Wait for recorder to finish
        await new Promise(resolve => {
            recorder.onstop = resolve;
        });
        // Combine chunks into a single Blob
        return new Blob(chunks, { type: mimeType });
    }
    /**
     * Export a panorama image from the current camera view.
     * Returns a base64 PNG string of the rendered view.
     */
    async exportPanorama360(resolution = 2048) {
        // Create a temporary camera at the current camera position
        const position = this.camera.position.clone();
        const panoramaCamera = new FreeCamera('panoramaCamera', position, this.scene);
        panoramaCamera.fov = Math.PI / 2;
        panoramaCamera.minZ = 0.1;
        panoramaCamera.maxZ = 1000;
        // Create a render target texture
        const renderTarget = new RenderTargetTexture('panorama', resolution, this.scene, false);
        renderTarget.renderList = this.scene.meshes;
        renderTarget.activeCamera = panoramaCamera;
        // Render the scene to the texture
        this.scene.customRenderTargets.push(renderTarget);
        renderTarget.render();
        // Read pixels from the render target
        const data = await renderTarget.readPixels();
        const width = renderTarget.getSize().width;
        const height = renderTarget.getSize().height;
        // Create a canvas and put the pixel data
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        let base64Image = '';
        if (ctx && data) {
            const imageData = ctx.createImageData(width, height);
            // Convert ArrayBufferView to Uint8ClampedArray for canvas
            let pixelArray;
            if (data instanceof Uint8ClampedArray) {
                pixelArray = data;
            }
            else if ('buffer' in data) {
                pixelArray = new Uint8ClampedArray(data.buffer);
            }
            else {
                pixelArray = new Uint8ClampedArray(data);
            }
            imageData.data.set(pixelArray);
            ctx.putImageData(imageData, 0, 0);
            base64Image = canvas.toDataURL('image/png');
        }
        // Remove the temporary render target
        this.scene.customRenderTargets.pop();
        panoramaCamera.dispose();
        return [base64Image];
    }
    constructor(canvas, config) {
        Object.defineProperty(this, "canvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
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
        Object.defineProperty(this, "camera", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shadowGenerator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "renderPipeline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "ssaoPipeline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "gizmoManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "utilityLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "highlightLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // Section planes for model cutting
        Object.defineProperty(this, "sectionPlanes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "sectionPlaneMeshes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "loadedModels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "selectedObjects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "navigationMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'orbit'
        });
        Object.defineProperty(this, "currentLightingPreset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'default'
        });
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                enablePhysics: false,
                enablePostProcessing: true,
                enableSSAO: true,
                enableShadows: true,
                shadowMapSize: 1024,
                enableOptimization: true,
                targetFPS: 60
            }
        });
        this.canvas = canvas;
        this.config = { ...this.config, ...config };
        this.initializeEngine();
        this.initializeScene();
        this.initializeCamera();
        // Removed call to undefined initializeLighting()
        this.initializePostProcessing();
        this.initializeGizmos();
        this.initializeOptimization();
        this.startRenderLoop();
    }
    initializeEngine() {
        this.engine = new Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true,
            alpha: false,
            premultipliedAlpha: false,
            powerPreference: 'high-performance'
        });
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    initializeScene() {
        this.scene = new Scene(this.engine);
        this.scene.actionManager = new ActionManager(this.scene);
        this.scene.clearColor = new Color4(0.1, 0.1, 0.15, 1.0);
        this.scene.ambientColor = new Color3(0.3, 0.3, 0.3);
        this.highlightLayer = new HighlightLayer('highlight', this.scene);
        // Enable clipping planes support
        this.scene.clipPlane = null;
        this.scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.pickInfo?.hit && pointerInfo.pickInfo.pickedMesh) {
                this.handleMeshSelection(pointerInfo.pickInfo);
            }
        });
    }
    initializeCamera() {
        this.camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 20, new Vector3(0, 0, 0), this.scene);
        this.camera.attachControl(this.canvas, true);
        if (this.config.enableShadows) {
            const directionalLight = this.scene.lights.find(light => light instanceof DirectionalLight);
            if (directionalLight) {
                this.shadowGenerator = new ShadowGenerator(this.config.shadowMapSize || 1024, directionalLight);
                this.shadowGenerator.useExponentialShadowMap = true;
                this.shadowGenerator.useKernelBlur = true;
                this.shadowGenerator.blurKernel = 64;
            }
        }
    }
    initializePostProcessing() {
        if (!this.config.enablePostProcessing)
            return;
        this.renderPipeline = new DefaultRenderingPipeline('defaultPipeline', true, this.scene, [this.camera]);
        this.renderPipeline.fxaaEnabled = true;
        this.renderPipeline.bloomEnabled = true;
        this.renderPipeline.bloomThreshold = 0.8;
        this.renderPipeline.bloomWeight = 0.3;
        this.renderPipeline.bloomKernel = 64;
        this.renderPipeline.imageProcessingEnabled = true;
        if (this.renderPipeline.imageProcessing) {
            this.renderPipeline.imageProcessing.toneMappingEnabled = true;
            this.renderPipeline.imageProcessing.exposure = 1.0;
        }
        if (this.config.enableSSAO) {
            this.ssaoPipeline = new SSAORenderingPipeline('ssao', this.scene, 0.75, [this.camera]);
            this.ssaoPipeline.fallOff = 0.000001;
            this.ssaoPipeline.area = 1;
            this.ssaoPipeline.radius = 0.0001;
            this.ssaoPipeline.totalStrength = 1.0;
            this.ssaoPipeline.base = 0.5;
        }
    }
    initializeGizmos() {
        this.utilityLayer = new UtilityLayerRenderer(this.scene);
        this.gizmoManager = new GizmoManager(this.scene, 1, this.utilityLayer);
        this.gizmoManager.positionGizmoEnabled = false;
        this.gizmoManager.rotationGizmoEnabled = false;
        this.gizmoManager.scaleGizmoEnabled = false;
        this.gizmoManager.boundingBoxGizmoEnabled = false;
    }
    initializeOptimization() {
        if (!this.config.enableOptimization)
            return;
        const options = new SceneOptimizerOptions(this.config.targetFPS || 60, 2000);
        options.addOptimization(new HardwareScalingOptimization(0, 1));
        options.addOptimization(new ShadowsOptimization(1));
        options.addOptimization(new PostProcessesOptimization(2));
        options.addOptimization(new LensFlaresOptimization(3));
        options.addOptimization(new ParticlesOptimization(4));
        options.addOptimization(new RenderTargetsOptimization(5));
        options.addOptimization(new MergeMeshesOptimization(6));
        SceneOptimizer.OptimizeAsync(this.scene, options);
    }
    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
    handleMeshSelection(pickInfo) {
        if (!pickInfo.pickedMesh)
            return;
        const mesh = pickInfo.pickedMesh;
        if (this.selectedObjects.has(mesh)) {
            this.selectedObjects.delete(mesh);
            this.removeSelectionOutline(mesh);
        }
        else {
            this.selectedObjects.add(mesh);
            this.addSelectionOutline(mesh);
        }
        if (this.selectedObjects.size === 1) {
            const selectedMesh = Array.from(this.selectedObjects)[0];
            this.gizmoManager.attachToMesh(selectedMesh);
        }
        else {
            this.gizmoManager.attachToMesh(null);
        }
    }
    addSelectionOutline(mesh) {
        if (this.highlightLayer) {
            this.highlightLayer.addMesh(mesh, Color3.Yellow());
        }
    }
    removeSelectionOutline(mesh) {
        if (this.highlightLayer) {
            this.highlightLayer.removeMesh(mesh);
        }
    }
    async loadModel(file) {
        const modelId = `model_${Date.now()}`;
        try {
            let url;
            if (typeof file === 'string') {
                url = file;
            }
            else {
                url = URL.createObjectURL(file);
            }
            const result = await SceneLoader.ImportMeshAsync('', '', url, this.scene);
            if (result.meshes.length === 0) {
                throw new Error('No meshes found in model');
            }
            const container = new AssetContainer(this.scene);
            result.meshes.forEach(mesh => container.meshes.push(mesh));
            // Note: ISceneLoaderAsyncResult doesn't directly expose materials/textures
            // They are managed by the scene automatically
            this.autoCenterAndScale(result.meshes);
            if (this.shadowGenerator) {
                result.meshes.forEach(mesh => {
                    if (mesh instanceof Mesh) {
                        this.shadowGenerator.addShadowCaster(mesh);
                        mesh.receiveShadows = true;
                    }
                });
            }
            this.loadedModels.set(modelId, container);
            if (typeof file !== 'string') {
                URL.revokeObjectURL(url);
            }
            return modelId;
        }
        catch (error) {
            console.error('Failed to load model:', error);
            throw error;
        }
    }
    removeModel(id) {
        const container = this.loadedModels.get(id);
        if (!container)
            return false;
        // Remove section planes related to this model
        this.removeSectionPlanes();
        container.dispose();
        this.loadedModels.delete(id);
        return true;
    }
    selectObject(id) {
        const mesh = this.scene.getMeshById(id);
        if (!mesh)
            return false;
        this.selectedObjects.clear();
        this.selectedObjects.add(mesh);
        this.addSelectionOutline(mesh);
        if (this.gizmoManager) {
            this.gizmoManager.attachToMesh(mesh);
        }
        return true;
    }
    setMaterial(target, materialSpec) {
        const mesh = this.scene.getMeshById(target);
        if (!mesh)
            return false;
        let material;
        if (materialSpec.type === 'pbr') {
            material = new PBRMaterial(`material_${Date.now()}`, this.scene);
            Object.assign(material, materialSpec.properties);
        }
        else {
            material = new StandardMaterial(`material_${Date.now()}`, this.scene);
            Object.assign(material, materialSpec.properties);
        }
        mesh.material = material;
        return true;
    }
    applyLightingPreset(name) {
        const presets = {
            day: {
                name: 'Day',
                ambientColor: new Color3(0.8, 0.8, 0.9),
                directionalLight: {
                    direction: new Vector3(-0.3, -0.8, -0.5),
                    intensity: 1.2,
                    color: new Color3(1, 0.95, 0.8)
                }
            },
            night: {
                name: 'Night',
                ambientColor: new Color3(0.1, 0.1, 0.2),
                directionalLight: {
                    direction: new Vector3(0, -0.5, 0),
                    intensity: 0.3,
                    color: new Color3(0.5, 0.5, 0.7)
                }
            },
            interior: {
                name: 'Interior',
                ambientColor: new Color3(0.4, 0.4, 0.4),
                directionalLight: {
                    direction: new Vector3(0, -1, 0),
                    intensity: 0.8,
                    color: new Color3(1, 1, 1)
                }
            }
        };
        const preset = presets[name];
        if (!preset)
            return false;
        this.scene.ambientColor = preset.ambientColor;
        const directionalLight = this.scene.lights.find(light => light instanceof DirectionalLight);
        if (directionalLight) {
            directionalLight.direction = preset.directionalLight.direction;
            directionalLight.intensity = preset.directionalLight.intensity;
            directionalLight.diffuse = preset.directionalLight.color;
        }
        this.currentLightingPreset = name;
        return true;
    }
    setNavigationMode(mode) {
        if (this.navigationMode === mode)
            return true;
        const currentPosition = this.camera.position.clone();
        const currentTarget = this.camera instanceof ArcRotateCamera
            ? this.camera.target.clone()
            : this.camera.position.add(this.camera.getForwardRay().direction);
        this.camera.dispose();
        switch (mode) {
            case 'orbit':
                this.camera = new ArcRotateCamera('orbitCamera', 0, Math.PI / 4, Vector3.Distance(currentPosition, currentTarget), currentTarget, this.scene);
                this.camera.attachControl(this.canvas, true);
                break;
            case 'walk':
            case 'fly':
                this.camera = new UniversalCamera('walkCamera', currentPosition, this.scene);
                this.camera.setTarget(currentTarget);
                this.camera.attachControl(this.canvas, true);
                if (mode === 'walk') {
                    this.camera.ellipsoid = new Vector3(0.5, 1, 0.5);
                    this.camera.checkCollisions = true;
                    this.camera.applyGravity = true;
                }
                break;
            case 'tabletop':
                this.camera = new ArcRotateCamera('tabletopCamera', 0, Math.PI / 6, 20, Vector3.Zero(), this.scene);
                this.camera.attachControl(this.canvas, true);
                this.camera.lowerBetaLimit = 0;
                this.camera.upperBetaLimit = Math.PI / 2;
                break;
        }
        this.navigationMode = mode;
        return true;
    }
    toggleCategory(category, visible) {
        const meshes = this.scene.meshes.filter(mesh => mesh.metadata?.category === category);
        meshes.forEach(mesh => {
            mesh.setEnabled(visible);
        });
        return meshes.length > 0;
    }
    optimizeScene() {
        const meshesToMerge = this.scene.meshes.filter(mesh => mesh instanceof Mesh && mesh.material && !mesh.skeleton);
        if (meshesToMerge.length > 1) {
            const merged = Mesh.MergeMeshes(meshesToMerge, true, true, undefined, false, true);
            if (merged) {
                console.log(`Merged ${meshesToMerge.length} meshes into 1`);
            }
        }
        this.scene.textures.forEach(texture => {
            if (texture.getSize().width > 1024) {
                texture.updateSamplingMode(1);
            }
        });
        if (this.config.enableOptimization) {
            const options = new SceneOptimizerOptions(this.config.targetFPS || 60, 1000);
            SceneOptimizer.OptimizeAsync(this.scene, options);
        }
    }
    exportState() {
        return {
            models: Array.from(this.loadedModels.keys()),
            navigationMode: this.navigationMode,
            lightingPreset: this.currentLightingPreset,
            cameraPosition: this.camera.position.asArray(),
            cameraTarget: this.camera instanceof ArcRotateCamera
                ? this.camera.target.asArray()
                : [0, 0, 0],
            selectedObjects: Array.from(this.selectedObjects).map(mesh => mesh.id)
        };
    }
    autoCenterAndScale(meshes) {
        if (meshes.length === 0)
            return;
        let min = meshes[0].getBoundingInfo().boundingBox.minimumWorld.clone();
        let max = meshes[0].getBoundingInfo().boundingBox.maximumWorld.clone();
        meshes.forEach(mesh => {
            const boundingBox = mesh.getBoundingInfo().boundingBox;
            min = Vector3.Minimize(min, boundingBox.minimumWorld);
            max = Vector3.Maximize(max, boundingBox.maximumWorld);
        });
        const center = Vector3.Center(min, max);
        meshes.forEach(mesh => {
            mesh.position.subtractInPlace(center);
        });
        const size = max.subtract(min);
        const maxDimension = Math.max(size.x, size.y, size.z);
        if (maxDimension > 10) {
            const scale = 10 / maxDimension;
            meshes.forEach(mesh => {
                mesh.scaling.scaleInPlace(scale);
            });
        }
    }
    enablePositionGizmo(enabled) {
        if (this.gizmoManager) {
            this.gizmoManager.positionGizmoEnabled = enabled;
        }
    }
    enableRotationGizmo(enabled) {
        if (this.gizmoManager) {
            this.gizmoManager.rotationGizmoEnabled = enabled;
        }
    }
    enableScaleGizmo(enabled) {
        if (this.gizmoManager) {
            this.gizmoManager.scaleGizmoEnabled = enabled;
        }
    }
    getEngine() {
        return this.engine;
    }
    getScene() {
        return this.scene;
    }
    getCamera() {
        return this.camera;
    }
    getSelectedObjects() {
        return Array.from(this.selectedObjects);
    }
    getLoadedModels() {
        return Array.from(this.loadedModels.keys());
    }
    dispose() {
        this.loadedModels.forEach(container => container.dispose());
        this.loadedModels.clear();
        this.removeSectionPlanes();
        this.gizmoManager?.dispose();
        this.utilityLayer?.dispose();
        this.renderPipeline?.dispose();
        this.ssaoPipeline?.dispose();
        this.shadowGenerator?.dispose();
        this.highlightLayer?.dispose();
        this.scene.dispose();
        this.engine.dispose();
    }
    /**
     * Export a 360° panorama image from the current camera view.
     * Returns an array of base64 PNG strings for the 6 cubemap faces.
     */
    // ...existing code...
    // Section Cut Methods
    addSectionPlane(normal, point) {
        const plane = Plane.FromPositionAndNormal(point, normal);
        this.sectionPlanes.push(plane);
        // Apply clipping planes to all meshes
        this.updateClippingPlanes();
        // Optional: visualize the plane in the scene
        const planeMesh = Mesh.CreatePlane(`sectionPlane_${this.sectionPlanes.length}`, 10, this.scene, false);
        planeMesh.position = point;
        planeMesh.rotation = new Vector3(Math.acos(normal.y) - Math.PI / 2, Math.atan2(normal.x, normal.z), 0);
        planeMesh.isPickable = false;
        planeMesh.visibility = 0.3;
        planeMesh.material = new StandardMaterial(`sectionPlaneMat_${this.sectionPlanes.length}`, this.scene);
        planeMesh.material.diffuseColor = new Color3(1, 0, 0);
        planeMesh.material.backFaceCulling = false;
        this.sectionPlaneMeshes.push(planeMesh);
    }
    removeSectionPlanes() {
        this.sectionPlanes = [];
        this.updateClippingPlanes();
        this.sectionPlaneMeshes.forEach(mesh => {
            mesh.dispose();
        });
        this.sectionPlaneMeshes = [];
    }
    updateClippingPlanes() {
        // Reset all clip planes on the scene
        this.scene.clipPlane = null;
        this.scene.clipPlane2 = null;
        this.scene.clipPlane3 = null;
        this.scene.clipPlane4 = null;
        this.scene.clipPlane5 = null;
        this.scene.clipPlane6 = null;
        if (this.sectionPlanes.length === 0) {
            return;
        }
        // Babylon.js supports up to 6 clip planes on the scene
        const planesToApply = this.sectionPlanes.slice(0, 6);
        planesToApply.forEach((plane, index) => {
            const clipPlaneProperty = index === 0 ? 'clipPlane' : `clipPlane${index + 1}`;
            this.scene[clipPlaneProperty] = plane;
        });
    }
}
