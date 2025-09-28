import { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Mesh, StandardMaterial, Color3, Vector3, DefaultRenderingPipeline, SSAORenderingPipeline } from '@babylonjs/core';
import { showToast } from './utils/toast';
import { DeviceDetector } from './DeviceDetector';
import { FeatureManager } from './FeatureManager';
import { AnalyticsManager } from './AnalyticsManager';
import { AnimationManager } from './AnimationManager';
import { SyncManager } from './SyncManager';
import { MaterialManager } from './MaterialManager';
import { AudioManager } from './AudioManager';
const SceneRenderer = ({ canvasRef, enablePostProcessing, enableBloom, bloomIntensity, enableDepthOfField, depthOfFieldFocusDistance, enableGrain, grainIntensity, enableVignette, vignetteIntensity, enableSSAO, ssaoIntensity, onSceneReady, onEngineReady, onError, enableSpatialAudio = false }) => {
    const engineRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const pipelineRef = useRef(null);
    const ssaoPipelineRef = useRef(null);
    // Manager refs
    const analyticsManagerRef = useRef(null);
    const featureManagerRef = useRef(null);
    const animationManagerRef = useRef(null);
    const syncManagerRef = useRef(null);
    const materialManagerRef = useRef(null);
    const audioManagerRef = useRef(null);
    const bimManagerRef = useRef(null);
    const iotManagerRef = useRef(null);
    const cloudAnchorManagerRef = useRef(null);
    const collabManagerRef = useRef(null);
    const xrManagerRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current)
            return;
        try {
            const engine = new Engine(canvasRef.current, true);
            engineRef.current = engine;
            onEngineReady && onEngineReady(engine);
        }
        catch (error) {
            onError && onError(error);
            showToast.error('Failed to initialize 3D workspace. WebGL may not be supported.');
            return;
        }
        const scene = new Scene(engineRef.current);
        sceneRef.current = scene;
        const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene);
        camera.attachControl(canvasRef.current, true);
        cameraRef.current = camera;
        const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
        light.intensity = 0.7;
        const ground = Mesh.CreateGround("ground", 10, 10, 2);
        const groundMaterial = new StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseColor = new Color3(0.5, 0.5, 0.5);
        ground.material = groundMaterial;
        if (enablePostProcessing) {
            const pipeline = new DefaultRenderingPipeline("defaultPipeline", true, scene, [camera]);
            pipeline.bloomEnabled = enableBloom;
            if (enableBloom) {
                pipeline.bloomThreshold = 0.8;
                pipeline.bloomWeight = bloomIntensity;
                pipeline.bloomKernel = 64;
                pipeline.bloomScale = 0.5;
            }
            pipeline.depthOfFieldEnabled = enableDepthOfField;
            if (enableDepthOfField) {
                pipeline.depthOfField.focusDistance = depthOfFieldFocusDistance;
                pipeline.depthOfField.fStop = 1.4;
                pipeline.depthOfField.focalLength = 50;
            }
            pipeline.grainEnabled = enableGrain;
            if (enableGrain) {
                pipeline.grain.intensity = grainIntensity;
            }
            pipeline.imageProcessing.vignetteEnabled = enableVignette;
            if (enableVignette) {
                pipeline.imageProcessing.vignetteWeight = vignetteIntensity;
            }
            pipelineRef.current = pipeline;
        }
        if (enableSSAO) {
            const ssao = new SSAORenderingPipeline("ssao", scene, { ssaoRatio: 0.5, blurRatio: 1 });
            ssao.totalStrength = ssaoIntensity;
            ssao.base = 0.5;
            ssao.radius = 0.0001;
            ssao.area = 0.0075;
            ssao.fallOff = 0.000001;
            ssaoPipelineRef.current = ssao;
        }
        // Device capabilities detection
        const deviceDetector = DeviceDetector.getInstance();
        const detectedCapabilities = deviceDetector.detectCapabilities();
        if (detectedCapabilities instanceof Promise) {
            detectedCapabilities.then(capabilities => {
                featureManagerRef.current = new FeatureManager(capabilities);
            });
        }
        else {
            featureManagerRef.current = new FeatureManager(detectedCapabilities);
        }
        analyticsManagerRef.current = new AnalyticsManager(engineRef.current, scene, featureManagerRef.current);
        materialManagerRef.current = new MaterialManager(scene);
        const userId = 'local-user'; // TODO: dynamic user id
        syncManagerRef.current = new SyncManager(null, scene, userId);
        animationManagerRef.current = new AnimationManager(scene, syncManagerRef.current);
        if (enableSpatialAudio) {
            audioManagerRef.current = new AudioManager(scene);
        }
        // Initialize other managers as needed...
        if (engineRef.current) {
            engineRef.current.runRenderLoop(() => {
                scene.render();
                // Update audio manager if exists
                if (audioManagerRef.current) {
                    // audioManagerRef.current.update();
                }
            });
        }
        const handleResize = () => {
            if (engineRef.current) {
                engineRef.current.resize();
            }
        };
        window.addEventListener('resize', handleResize);
        onSceneReady && onSceneReady(scene);
        return () => {
            window.removeEventListener('resize', handleResize);
            analyticsManagerRef.current?.dispose();
            animationManagerRef.current?.dispose();
            syncManagerRef.current?.dispose();
            scene.dispose();
            if (engineRef.current) {
                engineRef.current.dispose();
            }
        };
    }, [
        canvasRef,
        enablePostProcessing,
        enableBloom,
        bloomIntensity,
        enableDepthOfField,
        depthOfFieldFocusDistance,
        enableGrain,
        grainIntensity,
        enableVignette,
        vignetteIntensity,
        enableSSAO,
        ssaoIntensity,
        enableSpatialAudio,
        onSceneReady,
        onEngineReady,
        onError
    ]);
    return null;
};
export default SceneRenderer;
