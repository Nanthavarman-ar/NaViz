import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Babylon.js GUI imports
import { AdvancedDynamicTexture, Rectangle, Button, TextBlock, StackPanel, Control, Slider, Checkbox } from '@babylonjs/gui';
import { useRef, useEffect, useState, useCallback } from 'react';
import '../../components/BabylonWorkspaceAnnotations.css';
import { Engine, Scene, ArcRotateCamera, UniversalCamera, HemisphericLight, DirectionalLight, Vector3, Color3, Color4, Mesh, StandardMaterial, PBRMaterial, ShadowGenerator, DefaultRenderingPipeline, SSAORenderingPipeline, SceneOptimizer, SceneOptimizerOptions, HardwareScalingOptimization, ShadowsOptimization, PostProcessesOptimization, LensFlaresOptimization, ParticlesOptimization, RenderTargetsOptimization, MergeMeshesOptimization, GizmoManager, UtilityLayerRenderer, AssetContainer } from '@babylonjs/core';
import { HighlightLayer } from '@babylonjs/core/Layers/highlightLayer';
import { Plane } from '@babylonjs/core/Maths/math.plane';
import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { WebXRState } from '@babylonjs/core/XR/webXRTypes';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { QRCodeTour } from './QRCodeTour';
// Integrated Scene Manager Class
class IntegratedSceneManager {
    static async create(canvas, workspaceId, config) {
        return new IntegratedSceneManager(canvas, config);
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
        // LOD and texture streaming
        Object.defineProperty(this, "lodLevels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [0, 0.5, 1]
        }); // Example distances for LOD
        Object.defineProperty(this, "enableTextureStreaming", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
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
        // FPS tracking
        Object.defineProperty(this, "frameTimes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "lastFpsCheck", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: performance.now()
        });
        Object.defineProperty(this, "currentFps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 60
        });
        this.canvas = canvas;
        this.config = { ...this.config, ...config };
        this.initializeEngine();
        this.initializeScene();
        this.initializeCamera();
        this.initializeLighting();
        this.initializePostProcessing();
        this.initializeGizmos();
        this.initializeOptimization();
        this.initializeAssetLoaders();
        this.startRenderLoop();
    }
    // Configure Babylon.js loaders for Draco and Basis
    initializeAssetLoaders() {
        // Draco compression
        if (window.BABYLON && window.BABYLON.DracoCompression) {
            window.BABYLON.DracoCompression.Configuration = {
                decoder: {
                    wasmUrl: '/draco/draco_wasm_wrapper.js',
                    wasmBinaryUrl: '/draco/draco_decoder.wasm',
                    fallbackUrl: '/draco/draco_decoder.js'
                }
            };
        }
        // Basis texture loader
        if (window.BABYLON && window.BABYLON.BasisTextureLoader) {
            window.BABYLON.BasisTextureLoader.GetTranscoderUrl = () => '/basis/basis_transcoder.js';
        }
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
        this.camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 10, Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.setTarget(Vector3.Zero());
        this.camera.lowerRadiusLimit = 1;
        this.camera.upperRadiusLimit = 100;
        this.camera.lowerBetaLimit = 0.1;
        this.camera.upperBetaLimit = Math.PI - 0.1;
    }
    initializeLighting() {
        const hemisphericLight = new HemisphericLight('hemisphericLight', new Vector3(0, 1, 0), this.scene);
        hemisphericLight.intensity = 0.6;
        hemisphericLight.diffuse = new Color3(1, 1, 1);
        hemisphericLight.specular = new Color3(0.2, 0.2, 0.2);
        const directionalLight = new DirectionalLight('directionalLight', new Vector3(-1, -1, -1), this.scene);
        directionalLight.intensity = 1.0;
        directionalLight.diffuse = new Color3(1, 1, 1);
        directionalLight.specular = new Color3(1, 1, 1);
        if (this.config.enableShadows) {
            this.shadowGenerator = new ShadowGenerator(this.config.shadowMapSize || 1024, directionalLight);
            this.shadowGenerator.useExponentialShadowMap = true;
            this.shadowGenerator.useKernelBlur = true;
            this.shadowGenerator.blurKernel = 64;
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
            const start = performance.now();
            this.scene.render();
            const end = performance.now();
            this.frameTimes.push(end - start);
            // Calculate FPS every second
            if (end - this.lastFpsCheck > 1000) {
                const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
                this.currentFps = Math.round(1000 / avgFrameTime);
                this.frameTimes = [];
                this.lastFpsCheck = end;
                // Adaptive optimization: if FPS < target, scale hardware and disable effects
                if (this.currentFps < (this.config.targetFPS || 60)) {
                    this.engine.setHardwareScalingLevel(Math.min(this.engine.getHardwareScalingLevel() + 0.1, 2));
                    if (this.renderPipeline) {
                        this.renderPipeline.bloomEnabled = false;
                        this.renderPipeline.fxaaEnabled = false;
                    }
                    if (this.ssaoPipeline) {
                        this.ssaoPipeline.dispose();
                        this.ssaoPipeline = null;
                    }
                }
                else {
                    this.engine.setHardwareScalingLevel(Math.max(this.engine.getHardwareScalingLevel() - 0.05, 1));
                    if (this.renderPipeline) {
                        this.renderPipeline.bloomEnabled = true;
                        this.renderPipeline.fxaaEnabled = true;
                    }
                    if (!this.ssaoPipeline && this.config.enableSSAO) {
                        this.ssaoPipeline = new SSAORenderingPipeline('ssao', this.scene, 0.75, [this.camera]);
                        this.ssaoPipeline.fallOff = 0.000001;
                        this.ssaoPipeline.area = 1;
                        this.ssaoPipeline.radius = 0.0001;
                        this.ssaoPipeline.totalStrength = 1.0;
                        this.ssaoPipeline.base = 0.5;
                    }
                }
            }
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
            this.autoCenterAndScale(result.meshes);
            // Add LOD support to loaded meshes
            result.meshes.forEach(mesh => {
                if (mesh instanceof Mesh) {
                    this.setupLOD(mesh);
                    if (this.enableTextureStreaming) {
                        this.setupTextureStreaming(mesh);
                    }
                }
            });
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
    // Setup LOD for a mesh
    setupLOD(mesh) {
        // Example: Add LOD levels with decreasing detail
        // In production, replace with actual lower-detail meshes
        this.lodLevels.forEach((distance, i) => {
            if (i === 0)
                return; // Skip base mesh
            const lodMesh = mesh.clone(`${mesh.name}_lod${i}`);
            if (lodMesh) {
                lodMesh.setEnabled(false);
                mesh.addLODLevel(distance * 20, lodMesh); // Example: scale distances
            }
        });
        mesh.addLODLevel(100, null); // Remove mesh after 100 units
    }
    // Setup texture streaming for a mesh
    setupTextureStreaming(mesh) {
        if (mesh.material && mesh.material instanceof StandardMaterial) {
            const mat = mesh.material;
            if (mat.diffuseTexture) {
                mat.diffuseTexture.updateSamplingMode(1); // Trilinear
                // Babylon.js texture streaming is automatic for WebGL2, so no manual streaming needed here
            }
        }
        if (mesh.material && mesh.material instanceof PBRMaterial) {
            const mat = mesh.material;
            if (mat.albedoTexture) {
                mat.albedoTexture.updateSamplingMode(1);
                // Babylon.js texture streaming is automatic for WebGL2, so no manual streaming needed here
            }
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
}
// Integrated GUI Class
class IntegratedBabylonGUI {
    constructor(scene, config = {}, callbacks = {}) {
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "advancedTexture", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "panels", {
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
        Object.defineProperty(this, "callbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.scene = scene;
        this.config = {
            showNavigation: true,
            showLighting: true,
            showMaterials: true,
            showObjects: true,
            showEffects: true,
            showAdmin: false,
            showSectionCut: true,
            ...config
        };
        this.callbacks = callbacks;
        this.initializeGUI();
        this.createPanels();
    }
    initializeGUI() {
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');
        this.advancedTexture.idealWidth = 1920;
        this.advancedTexture.idealHeight = 1080;
    }
    createPanels() {
        if (this.config.showNavigation) {
            this.createNavigationPanel();
        }
        if (this.config.showLighting) {
            this.createLightingPanel();
        }
        if (this.config.showMaterials) {
            this.createMaterialsPanel();
        }
        if (this.config.showObjects) {
            this.createObjectsPanel();
        }
        if (this.config.showEffects) {
            this.createEffectsPanel();
        }
        if (this.config.showSectionCut) {
            this.createSectionCutPanel();
        }
        if (this.config.showAdmin) {
            this.createAdminPanel();
        }
    }
    createSectionCutPanel() {
        const panel = new Rectangle('sectionCutPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 180;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 1140;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 10;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Section Cut';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Add Section Cut button
        const addButton = Button.CreateSimpleButton('addSectionCut', 'Add Section Cut');
        addButton.widthInPixels = 160;
        addButton.heightInPixels = 40;
        addButton.color = 'white';
        addButton.cornerRadius = 5;
        addButton.background = 'rgba(200, 0, 0, 0.8)';
        addButton.onPointerUpObservable.add(() => {
            if (this.callbacks.onSectionCutAdd) {
                // Example: add a horizontal cut plane at origin
                this.callbacks.onSectionCutAdd({ x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 0 });
            }
        });
        stackPanel.addControl(addButton);
        // Remove Section Cut button
        const removeButton = Button.CreateSimpleButton('removeSectionCut', 'Remove Section Cuts');
        removeButton.widthInPixels = 160;
        removeButton.heightInPixels = 40;
        removeButton.color = 'white';
        removeButton.cornerRadius = 5;
        removeButton.background = 'rgba(100, 0, 0, 0.8)';
        removeButton.onPointerUpObservable.add(() => {
            if (this.callbacks.onSectionCutRemove) {
                this.callbacks.onSectionCutRemove();
            }
        });
        stackPanel.addControl(removeButton);
        this.advancedTexture.addControl(panel);
        this.panels.set('sectionCut', panel);
    }
    createNavigationPanel() {
        const panel = new Rectangle('navigationPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 300;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 20;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 10;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Navigation';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Navigation mode buttons
        const modes = [
            { name: 'Orbit', value: 'orbit' },
            { name: 'Walk', value: 'walk' },
            { name: 'Tabletop', value: 'tabletop' },
            { name: 'Fly', value: 'fly' }
        ];
        modes.forEach(mode => {
            const button = Button.CreateSimpleButton(`nav_${mode.value}`, mode.name);
            button.widthInPixels = 160;
            button.heightInPixels = 40;
            button.color = 'white';
            button.cornerRadius = 5;
            button.background = 'rgba(0, 100, 200, 0.8)';
            button.onPointerUpObservable.add(() => {
                if (this.callbacks.onNavigationModeChange) {
                    this.callbacks.onNavigationModeChange(mode.value);
                }
            });
            stackPanel.addControl(button);
        });
        // Reset view button
        const resetButton = Button.CreateSimpleButton('resetView', 'Reset View');
        resetButton.widthInPixels = 160;
        resetButton.heightInPixels = 40;
        resetButton.color = 'white';
        resetButton.cornerRadius = 5;
        resetButton.background = 'rgba(200, 100, 0, 0.8)';
        stackPanel.addControl(resetButton);
        this.advancedTexture.addControl(panel);
        this.panels.set('navigation', panel);
    }
    createLightingPanel() {
        const panel = new Rectangle('lightingPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 250;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 240;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 10;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Lighting';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Lighting presets
        const presets = ['Day', 'Night', 'Interior', 'HDRI'];
        presets.forEach(preset => {
            const button = Button.CreateSimpleButton(`light_${preset.toLowerCase()}`, preset);
            button.widthInPixels = 160;
            button.heightInPixels = 35;
            button.color = 'white';
            button.cornerRadius = 5;
            button.background = 'rgba(200, 150, 0, 0.8)';
            button.onPointerUpObservable.add(() => {
                if (this.callbacks.onLightingPresetChange) {
                    this.callbacks.onLightingPresetChange(preset.toLowerCase());
                }
            });
            stackPanel.addControl(button);
        });
        this.advancedTexture.addControl(panel);
        this.panels.set('lighting', panel);
    }
    createMaterialsPanel() {
        const panel = new Rectangle('materialsPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 300;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 460;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 8;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Materials';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Material categories
        const materials = [
            { name: 'Metal', category: 'metal' },
            { name: 'Wood', category: 'wood' },
            { name: 'Glass', category: 'glass' },
            { name: 'Fabric', category: 'fabric' },
            { name: 'Stone', category: 'stone' },
            { name: 'Plastic', category: 'plastic' }
        ];
        materials.forEach(material => {
            const button = Button.CreateSimpleButton(`mat_${material.category}`, material.name);
            button.widthInPixels = 160;
            button.heightInPixels = 35;
            button.color = 'white';
            button.cornerRadius = 5;
            button.background = 'rgba(100, 200, 100, 0.8)';
            button.onPointerUpObservable.add(() => {
                if (this.callbacks.onMaterialChange) {
                    this.callbacks.onMaterialChange(material.category);
                }
            });
            stackPanel.addControl(button);
        });
        this.advancedTexture.addControl(panel);
        this.panels.set('materials', panel);
    }
    createObjectsPanel() {
        const panel = new Rectangle('objectsPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 280;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 680;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 8;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Objects';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Object categories with checkboxes
        const categories = [
            'Furniture',
            'Lighting',
            'Decoration',
            'Structure',
            'Landscape'
        ];
        categories.forEach(category => {
            const container = new Rectangle();
            container.widthInPixels = 160;
            container.heightInPixels = 30;
            container.thickness = 0;
            const checkbox = new Checkbox();
            checkbox.widthInPixels = 20;
            checkbox.heightInPixels = 20;
            checkbox.isChecked = true;
            checkbox.color = 'white';
            checkbox.background = 'rgba(100, 100, 100, 0.8)';
            checkbox.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            checkbox.leftInPixels = 10;
            const label = new TextBlock();
            label.text = category;
            label.color = 'white';
            label.fontSize = 14;
            label.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            label.leftInPixels = 40;
            checkbox.onIsCheckedChangedObservable.add((value) => {
                if (this.callbacks.onObjectToggle) {
                    this.callbacks.onObjectToggle(category.toLowerCase(), value);
                }
            });
            container.addControl(checkbox);
            container.addControl(label);
            stackPanel.addControl(container);
        });
        this.advancedTexture.addControl(panel);
        this.panels.set('objects', panel);
    }
    createEffectsPanel() {
        const panel = new Rectangle('effectsPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 320;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 700;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 8;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Effects';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Effects toggles
        const effects = [
            { name: 'Fog', key: 'fog' },
            { name: 'Bloom', key: 'bloom' },
            { name: 'SSAO', key: 'ssao' },
            { name: 'Shadows', key: 'shadows' }
        ];
        effects.forEach(effect => {
            const container = new Rectangle();
            container.widthInPixels = 160;
            container.heightInPixels = 30;
            container.thickness = 0;
            const checkbox = new Checkbox();
            checkbox.widthInPixels = 20;
            checkbox.heightInPixels = 20;
            checkbox.isChecked = true;
            checkbox.color = 'white';
            checkbox.background = 'rgba(100, 100, 100, 0.8)';
            checkbox.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            checkbox.leftInPixels = 10;
            const label = new TextBlock();
            label.text = effect.name;
            label.color = 'white';
            label.fontSize = 14;
            label.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            label.leftInPixels = 40;
            checkbox.onIsCheckedChangedObservable.add((value) => {
                if (this.callbacks.onEffectToggle) {
                    this.callbacks.onEffectToggle(effect.key, value);
                }
            });
            container.addControl(checkbox);
            container.addControl(label);
            stackPanel.addControl(container);
        });
        // Sliders for effect intensity
        const bloomSlider = new Slider();
        bloomSlider.minimum = 0;
        bloomSlider.maximum = 2;
        bloomSlider.value = 0.3;
        bloomSlider.widthInPixels = 160;
        bloomSlider.heightInPixels = 20;
        bloomSlider.color = 'white';
        bloomSlider.background = 'rgba(100, 100, 100, 0.8)';
        const bloomLabel = new TextBlock();
        bloomLabel.text = 'Bloom Strength';
        bloomLabel.color = 'white';
        bloomLabel.fontSize = 12;
        bloomLabel.heightInPixels = 20;
        stackPanel.addControl(bloomLabel);
        stackPanel.addControl(bloomSlider);
        // Exposure slider
        const exposureSlider = new Slider();
        exposureSlider.minimum = 0.1;
        exposureSlider.maximum = 3;
        exposureSlider.value = 1;
        exposureSlider.widthInPixels = 160;
        exposureSlider.heightInPixels = 20;
        exposureSlider.color = 'white';
        exposureSlider.background = 'rgba(100, 100, 100, 0.8)';
        const exposureLabel = new TextBlock();
        exposureLabel.text = 'Exposure';
        exposureLabel.color = 'white';
        exposureLabel.fontSize = 12;
        exposureLabel.heightInPixels = 20;
        stackPanel.addControl(exposureLabel);
        stackPanel.addControl(exposureSlider);
        this.advancedTexture.addControl(panel);
        this.panels.set('effects', panel);
    }
    createAdminPanel() {
        const panel = new Rectangle('adminPanel');
        panel.widthInPixels = 200;
        panel.heightInPixels = 200;
        panel.cornerRadius = 10;
        panel.color = 'white';
        panel.thickness = 2;
        panel.background = 'rgba(0, 0, 0, 0.8)';
        panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        panel.leftInPixels = 920;
        panel.topInPixels = 20;
        const stackPanel = new StackPanel();
        stackPanel.isVertical = true;
        stackPanel.spacing = 10;
        panel.addControl(stackPanel);
        // Title
        const title = new TextBlock();
        title.text = 'Admin';
        title.color = 'white';
        title.fontSize = 18;
        title.fontWeight = 'bold';
        title.heightInPixels = 30;
        stackPanel.addControl(title);
        // Upload button
        const uploadButton = Button.CreateSimpleButton('uploadModel', 'Upload Model');
        uploadButton.widthInPixels = 160;
        uploadButton.heightInPixels = 40;
        uploadButton.color = 'white';
        uploadButton.cornerRadius = 5;
        uploadButton.background = 'rgba(200, 0, 100, 0.8)';
        uploadButton.onPointerUpObservable.add(() => {
            if (this.callbacks.onUploadModel) {
                this.callbacks.onUploadModel();
            }
        });
        stackPanel.addControl(uploadButton);
        // Manage models button
        const manageButton = Button.CreateSimpleButton('manageModels', 'Manage Models');
        manageButton.widthInPixels = 160;
        manageButton.heightInPixels = 40;
        manageButton.color = 'white';
        manageButton.cornerRadius = 5;
        manageButton.background = 'rgba(100, 0, 200, 0.8)';
        stackPanel.addControl(manageButton);
        // Tour QR Code sharing (React component rendered in admin panel area)
        // This is a placeholder for where the QRCodeTour component should be rendered in the React admin panel
        this.advancedTexture.addControl(panel);
        this.panels.set('admin', panel);
    }
    showPanel(panelName) {
        const panel = this.panels.get(panelName);
        if (panel) {
            panel.isVisible = true;
        }
    }
    hidePanel(panelName) {
        const panel = this.panels.get(panelName);
        if (panel) {
            panel.isVisible = false;
        }
    }
    togglePanel(panelName) {
        const panel = this.panels.get(panelName);
        if (panel) {
            panel.isVisible = !panel.isVisible;
        }
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.recreatePanels();
    }
    recreatePanels() {
        // Clear existing panels
        this.panels.forEach(panel => {
            this.advancedTexture.removeControl(panel);
        });
        this.panels.clear();
        // Recreate panels based on new config
        this.createPanels();
    }
    dispose() {
        this.panels.forEach(panel => {
            this.advancedTexture.removeControl(panel);
        });
        this.panels.clear();
        this.advancedTexture.dispose();
    }
}
const BabylonWorkspace = (props) => {
    const { workspaceId, isAdmin = false, layoutMode = 'standard', enableXR = false, xrOptions = {}, enablePhysics, renderingQuality, performanceMode: propPerformanceMode } = props;
    // --- Refs ---
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const xrHelperRef = useRef(null);
    // --- State ---
    const [sceneManager, setSceneManager] = useState(null);
    const [babylonGUI, setBabylonGUI] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [loadedModels, setLoadedModels] = useState([]);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [navigationMode, setNavigationMode] = useState('orbit');
    const [lightingPreset, setLightingPreset] = useState('day');
    const [uploadProgress, setUploadProgress] = useState([]);
    const [performanceMode, setPerformanceMode] = useState('balanced');
    const [splitPanelSizes, setSplitPanelSizes] = useState([50, 50]);
    const [activeSplitView, setActiveSplitView] = useState('scene');
    const [fps, setFps] = useState(60);
    const [renderTime, setRenderTime] = useState(0);
    const [xrSessionActive, setXRSessionActive] = useState(false);
    // --- Collaboration WebSocket ---
    const [ws, setWs] = useState(null);
    const [collabUsers, setCollabUsers] = useState([]);
    const [collabStatus, setCollabStatus] = useState('disconnected');
    // --- Annotation & Markup State ---
    const [annotations, setAnnotations] = useState([]);
    const [activeAnnotation, setActiveAnnotation] = useState(null);
    const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
    // --- Annotation Handlers ---
    const handleAddAnnotation = useCallback((position) => {
        const newAnnotation = {
            id: `annotation_${Date.now()}`,
            position,
            color: '#FFD700',
            text: ''
        };
        setAnnotations(prev => [...prev, newAnnotation]);
        setActiveAnnotation(newAnnotation);
        setShowAnnotationPanel(true);
    }, []);
    const handleSaveAnnotation = useCallback((text) => {
        if (activeAnnotation) {
            setAnnotations(prev => prev.map(a => a.id === activeAnnotation.id ? { ...a, text } : a));
            setActiveAnnotation(null);
            setShowAnnotationPanel(false);
        }
    }, [activeAnnotation]);
    const handleNavigationModeChange = useCallback((mode) => {
        if (sceneManager) {
            sceneManager.setNavigationMode(mode);
            setNavigationMode(mode);
        }
    }, [sceneManager]);
    const setupVRCameraControls = useCallback((xrHelper) => {
        // Setup VR camera controls
        console.log('VR camera controls setup');
    }, []);
    const setupWebXRUIOverlays = useCallback((xrHelper) => {
        // Setup WebXR UI overlays
        console.log('WebXR UI overlays setup');
    }, []);
    const setupPerformanceMonitoring = useCallback((manager) => {
        // Setup performance monitoring
        const updatePerformance = () => {
            setFps(manager.getEngine().getFps());
            setRenderTime(1000 / manager.getEngine().getFps());
            requestAnimationFrame(updatePerformance);
        };
        updatePerformance();
    }, []);
    // Firebase functions
    async function saveTour(tour) {
        try {
            await addDoc(collection(db, 'tours'), tour);
        }
        catch (error) {
            console.error('Error saving tour:', error);
        }
    }
    // Example: Load tours from Firestore
    async function loadTours() {
        try {
            const querySnapshot = await getDocs(collection(db, 'tours'));
            return querySnapshot.docs.map(doc => doc.data());
        }
        catch (error) {
            console.error('Error loading tours:', error);
            return [];
        }
    }
    // --- Collaboration Handlers ---
    useEffect(() => {
        const url = `wss://your-collab-server.example/ws/${workspaceId}`;
        setCollabStatus('connecting');
        const socket = new WebSocket(url);
        socket.onopen = () => {
            setCollabStatus('connected');
            socket.send(JSON.stringify({ type: 'join', workspaceId, user: { name: 'User_' + Math.floor(Math.random() * 1000) } }));
        };
        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'users') {
                setCollabUsers(msg.users);
            }
            // Add scene sync logic here if needed
        };
        socket.onclose = () => setCollabStatus('disconnected');
        setWs(socket);
        return () => {
            socket.close();
        };
    }, [workspaceId]);
    const broadcastSceneUpdate = useCallback((state) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'scene-update', workspaceId, state }));
        }
    }, [ws, workspaceId]);
    // --- Annotation Double-Click Effect ---
    useEffect(() => {
        if (!sceneManager)
            return;
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const handleDblClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
            const cam = sceneManager.getCamera();
            const pos = cam.position;
            handleAddAnnotation({ x: pos.x, y: pos.y, z: pos.z });
        };
        canvas.addEventListener('dblclick', handleDblClick);
        return () => canvas.removeEventListener('dblclick', handleDblClick);
    }, [sceneManager, handleAddAnnotation]);
    useEffect(() => {
        let disposed = false;
        const initializeScene = async () => {
            try {
                // Integrated Scene Manager
                const manager = await IntegratedSceneManager.create(canvasRef.current, workspaceId, {
                    enablePhysics,
                    renderingQuality,
                    performanceMode
                });
                // Setup GUI
                const uiConfig = {
                    showNavigation: true,
                    showLighting: true,
                    showMaterials: true,
                    showObjects: true,
                    showEffects: true,
                    showSectionCut: true,
                    showAdmin: isAdmin
                };
                const uiCallbacks = {
                    onNavigationModeChange: handleNavigationModeChange,
                    onLightingPresetChange: handleLightingPresetChange,
                    onMaterialChange: handleMaterialChange,
                    onObjectToggle: handleObjectToggle,
                    onEffectToggle: handleEffectToggle,
                    onSectionCutAdd: handleSectionCutAdd,
                    onSectionCutRemove: handleSectionCutRemove,
                    onUploadModel: handleUploadModel,
                    onDeleteModel: handleDeleteModel
                };
                const gui = new IntegratedBabylonGUI(manager.getScene(), uiConfig, uiCallbacks);
                setSceneManager(manager);
                setBabylonGUI(gui);
                setIsInitialized(true);
                // WebXR session management
                if (enableXR && manager.getScene().createDefaultXRExperienceAsync) {
                    const xrHelper = await manager.getScene().createDefaultXRExperienceAsync({
                        uiOptions: { sessionMode: xrOptions.immersive ? 'immersive-vr' : 'inline' }
                    });
                    xrHelperRef.current = xrHelper;
                    xrHelper.baseExperience.onStateChangedObservable.add((state) => {
                        if (state === WebXRState.ENTERING_XR) {
                            setXRSessionActive(true);
                            xrOptions.onSessionStart && xrOptions.onSessionStart();
                            setupVRCameraControls(xrHelper);
                            setupWebXRUIOverlays(xrHelper);
                        }
                        if (state === WebXRState.EXITING_XR) {
                            setXRSessionActive(false);
                            xrOptions.onSessionEnd && xrOptions.onSessionEnd();
                        }
                    });
                }
                // Setup performance monitoring
                setupPerformanceMonitoring(manager);
                console.log('3D workspace initialized successfully');
            }
            catch (error) {
                console.error('Failed to initialize Babylon.js scene:', error);
            }
        };
        initializeScene();
        return () => {
            disposed = true;
            if (sceneManager) {
                sceneManager.dispose();
            }
            if (babylonGUI) {
                babylonGUI.dispose();
            }
            if (xrHelperRef.current) {
                xrHelperRef.current.baseExperience.exitXRAsync && xrHelperRef.current.baseExperience.exitXRAsync();
                xrHelperRef.current.dispose && xrHelperRef.current.dispose();
                xrHelperRef.current = null;
            }
        };
    }, [canvasRef.current, isAdmin, performanceMode, enableXR, xrOptions]);
    const handleLightingPresetChange = useCallback((preset) => {
        if (sceneManager) {
            sceneManager.applyLightingPreset(preset);
            setLightingPreset(preset);
            console.log(`Lighting preset: ${preset}`);
        }
    }, [sceneManager]);
    const handleMaterialChange = useCallback((materialId) => {
        if (sceneManager && selectedObjects.length > 0) {
            selectedObjects.forEach(objectId => {
                sceneManager.setMaterial(objectId, {
                    type: 'pbr',
                    properties: { /* material properties based on materialId */}
                });
            });
            if (xrHelperRef.current) {
                xrHelperRef.current.baseExperience.exitXRAsync && xrHelperRef.current.baseExperience.exitXRAsync();
                xrHelperRef.current.dispose && xrHelperRef.current.dispose();
                xrHelperRef.current = null;
            }
            console.log(`Applied ${materialId} material`);
        }
        else {
            console.log('Select an object first');
        }
    }, [sceneManager, selectedObjects]);
    const handleObjectToggle = useCallback((category, visible) => {
        if (sceneManager) {
            sceneManager.toggleCategory(category, visible);
            console.log(`${category} ${visible ? 'shown' : 'hidden'}`);
        }
    }, [sceneManager]);
    const handleEffectToggle = useCallback((effect, enabled) => {
        // Handle effect toggles (fog, bloom, SSAO, etc.)
        console.log(`${effect} ${enabled ? 'enabled' : 'disabled'}`);
    }, []);
    const handleSectionCutAdd = useCallback((normal, point) => {
        if (sceneManager) {
            sceneManager.addSectionPlane(new Vector3(normal.x, normal.y, normal.z), new Vector3(point.x, point.y, point.z));
            console.log('Section cut plane added');
        }
    }, [sceneManager]);
    const handleSectionCutRemove = useCallback(() => {
        if (sceneManager) {
            sceneManager.removeSectionPlanes();
            console.log('Section cut planes removed');
        }
    }, [sceneManager]);
    const handleUploadModel = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);
    const handleFileUpload = useCallback(async (event) => {
        const files = event.target.files;
        if (!files || !sceneManager)
            return;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const uploadId = `upload_${Date.now()}_${i}`;
            // Add to upload progress
            setUploadProgress(prev => [...prev, {
                    file: file.name,
                    progress: 0,
                    status: 'uploading'
                }]);
            try {
                const result = await sceneManager.loadModel(file);
                // Update progress to complete
                setUploadProgress(prev => prev.map(item => item.file === file.name
                    ? { ...item, progress: 100, status: 'complete' }
                    : item));
                setLoadedModels(prev => [...prev, result]);
                console.log(`Model ${file.name} loaded successfully`);
            }
            catch (error) {
                console.error('Failed to load model:', error);
                setUploadProgress(prev => prev.map(item => item.file === file.name
                    ? { ...item, status: 'error' }
                    : item));
                console.error(`Failed to load ${file.name}`);
            }
        }
        // Clear file input
        event.target.value = '';
    }, [sceneManager]);
    const handleDeleteModel = useCallback((modelId) => {
        if (sceneManager) {
            sceneManager.removeModel(modelId);
            setLoadedModels(prev => prev.filter(id => id !== modelId));
            console.log('Model deleted');
        }
    }, [sceneManager]);
    const handleOptimizeScene = useCallback(() => {
        if (sceneManager) {
            sceneManager.optimizeScene();
            console.log('Scene optimized');
        }
    }, [sceneManager]);
    const handleExportScene = useCallback(() => {
        if (sceneManager) {
            const state = sceneManager.exportState();
            const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `scene_${workspaceId}_${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            console.log('Scene exported');
        }
    }, [sceneManager, workspaceId]);
    const handlePerformanceModeChange = useCallback((mode) => {
        setPerformanceMode(mode);
        console.log(`Performance mode: ${mode}`);
        // Note: This would require reinitializing the scene with new settings
    }, []);
    // Gizmo controls
    const handleGizmoToggle = useCallback((gizmoType, enabled) => {
        if (sceneManager) {
            switch (gizmoType) {
                case 'position':
                    sceneManager.enablePositionGizmo(enabled);
                    break;
                case 'rotation':
                    sceneManager.enableRotationGizmo(enabled);
                    break;
                case 'scale':
                    sceneManager.enableScaleGizmo(enabled);
                    break;
            }
        }
    }, [sceneManager]);
    return (_jsxs("div", { className: "relative w-full h-screen bg-gray-900", children: [_jsx("canvas", { ref: canvasRef, className: "w-full h-full outline-none-canvas" }), enableXR && (_jsxs("div", { className: "absolute top-4 left-4 bg-black/80 text-cyan-400 px-4 py-2 rounded shadow-lg text-xs", children: ["XR Session: ", xrSessionActive ? 'Active' : 'Inactive'] })), _jsx("input", { ref: fileInputRef, type: "file", multiple: true, accept: ".glb,.gltf,.obj,.stl,.fbx,.3ds", onChange: handleFileUpload, className: "hidden", title: "Upload 3D model files" }), _jsxs("div", { className: "absolute top-4 right-4 w-72 bg-black/80 text-white border border-cyan-600 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-bold mb-2", children: "Performance & Collaboration" }), _jsxs("div", { className: "space-y-1 text-xs", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "FPS:" }), _jsx("span", { className: fps > 45 ? 'text-green-400' : fps > 30 ? 'text-yellow-400' : 'text-red-400', children: fps })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Render Time:" }), _jsxs("span", { children: [renderTime.toFixed(1), "ms"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Models:" }), _jsx("span", { children: loadedModels.length })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Mode:" }), _jsx("span", { className: "capitalize", children: performanceMode })] })] }), _jsxs("div", { className: "mt-2 border-t border-cyan-700 pt-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Collab:" }), _jsx("span", { className: collabStatus === 'connected' ? 'text-green-400' : collabStatus === 'connecting' ? 'text-yellow-400' : 'text-red-400', children: collabStatus })] }), _jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: collabUsers.map(u => (_jsx("span", { className: "bg-cyan-700 text-white px-2 py-0.5 rounded text-xs", children: u.name }, u.id))) })] })] }), uploadProgress.length > 0 && (_jsxs("div", { className: "absolute bottom-4 right-4 w-80 bg-black/80 text-white border border-gray-600 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-bold mb-2", children: "Upload Progress" }), _jsx("div", { className: "space-y-2", children: uploadProgress.map((upload, index) => (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "truncate", children: upload.file }), _jsx("span", { className: `capitalize ${upload.status === 'complete' ? 'text-green-400' :
                                                upload.status === 'error' ? 'text-red-400' : 'text-yellow-400'}`, children: upload.status })] }), upload.status !== 'error' && (_jsx("div", { className: "w-full bg-gray-700 rounded-full h-1", children: _jsx("div", { className: "bg-blue-600 h-1 rounded-full transition-all duration-300 upload-progress-bar", style: { width: `${upload.progress}%` } }) }))] }, index))) })] })), annotations.map(a => (_jsxs("div", { className: "annotation-markup", style: { color: a.color || '#FFD700' }, children: [_jsx("span", { children: "\uD83D\uDCCD" }), " ", a.text] }, a.id))), showAnnotationPanel && activeAnnotation && (_jsxs("div", { className: "annotation-panel", children: [_jsx("h3", { className: "text-sm font-bold mb-2", children: "Add Annotation" }), _jsx("textarea", { className: "w-64 h-20 p-2 rounded bg-gray-800 text-white border border-gray-600", placeholder: "Enter note...", value: activeAnnotation.text, onChange: e => setActiveAnnotation({ ...activeAnnotation, text: e.target.value }) }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsx("button", { className: "bg-green-600 px-4 py-1 rounded", onClick: () => handleSaveAnnotation(activeAnnotation.text || ''), children: "Save" }), _jsx("button", { className: "bg-red-600 px-4 py-1 rounded", onClick: () => { setActiveAnnotation(null); setShowAnnotationPanel(false); }, children: "Cancel" })] })] })), _jsxs("div", { className: "absolute bottom-4 left-4 w-96 bg-black/80 text-white border border-gray-600 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-bold mb-3", children: "Scene Controls" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "text-xs font-medium mb-2 block", children: "Performance Mode" }), _jsx("div", { className: "flex gap-2", children: ['performance', 'balanced', 'quality'].map(mode => (_jsx("button", { onClick: () => handlePerformanceModeChange(mode), className: `px-3 py-1 text-xs rounded capitalize ${performanceMode === mode
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`, children: mode }, mode))) })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "text-xs font-medium mb-2 block", children: "Transform Gizmos" }), _jsx("div", { className: "flex gap-2", children: ['position', 'rotation', 'scale'].map(gizmo => (_jsx("button", { onClick: () => handleGizmoToggle(gizmo, true), className: "px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 capitalize", children: gizmo }, gizmo))) })] }), _jsxs("div", { className: "flex gap-2 mb-3", children: [_jsx("button", { onClick: handleOptimizeScene, className: "px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700", children: "Optimize" }), _jsx("button", { onClick: handleExportScene, className: "px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700", children: "Export" }), isAdmin && (_jsx("button", { onClick: handleUploadModel, className: "px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700", children: "Upload" }))] }), _jsxs("div", { className: "text-xs space-y-1 pt-2 border-t border-gray-600", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Navigation:" }), _jsx("span", { className: "capitalize", children: navigationMode })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Lighting:" }), _jsx("span", { className: "capitalize", children: lightingPreset })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Selected:" }), _jsx("span", { children: selectedObjects.length })] })] })] }), !isInitialized && (_jsx("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center", children: _jsxs("div", { className: "bg-black/80 text-white border border-gray-600 rounded-lg p-6 text-center", children: [_jsx("div", { className: "animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { children: "Initializing 3D Workspace..." })] }) })), isAdmin && workspaceId && (_jsx("div", { className: "absolute top-24 right-4 z-40", children: _jsx(QRCodeTour, { tourId: workspaceId + '-tour', tourData: {} }) }))] }));
};
export default BabylonWorkspace;
