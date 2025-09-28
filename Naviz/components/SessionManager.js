import { WebXRDefaultExperience } from '@babylonjs/core';
export class SessionManager {
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
        Object.defineProperty(this, "vrConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "arConfig", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentSession", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "xrExperience", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sessionMetrics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "performanceMonitor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "interactionCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "areasVisited", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        this.engine = engine;
        this.scene = scene;
        this.featureManager = featureManager;
        this.vrConfig = {
            enableVR: true,
            enableHandTracking: false,
            enableEyeTracking: false,
            enableSpatialAudio: false,
            sessionTimeout: 120, // 2 hours
            qualitySettings: 'high'
        };
        this.arConfig = {
            enableImageTracking: false,
            enablePlaneDetection: true,
            enableFaceTracking: false,
            enableWorldTracking: true,
            lightingEstimation: true,
            enableDepth: false
        };
        this.initializeSessionManagement();
    }
    initializeSessionManagement() {
        // Set up performance monitoring
        this.startPerformanceMonitoring();
        // Initialize XR if supported
        this.initializeXR();
        // Set up session event listeners
        this.setupSessionEventListeners();
    }
    async initializeXR() {
        try {
            // Check for XR support
            if (!navigator.xr) {
                console.warn('WebXR not supported in this browser');
                return;
            }
            // Create XR experience
            this.xrExperience = await WebXRDefaultExperience.CreateAsync(this.scene, {
                uiOptions: {
                    sessionMode: 'immersive-vr',
                    referenceSpaceType: 'local-floor'
                },
                optionalFeatures: [
                    'hand-tracking',
                    'hit-test',
                    'anchors',
                    'plane-detection',
                    'depth-sensing'
                ]
            });
            console.log('XR experience initialized');
        }
        catch (error) {
            console.error('Failed to initialize XR:', error);
        }
    }
    setupSessionEventListeners() {
        // Listen for XR session events
        if (this.xrExperience) {
            this.xrExperience.baseExperience.sessionManager.onXRSessionInit.add(() => {
                console.log('XR session initialized');
                this.onXRSessionStart();
            });
            this.xrExperience.baseExperience.sessionManager.onXRSessionEnded.add(() => {
                console.log('XR session ended');
                this.onXRSessionEnd();
            });
        }
        // Listen for scene changes
        this.scene.onActiveCameraChanged.add(() => {
            this.trackAreaVisit();
        });
        // Listen for user interactions
        this.scene.onPointerObservable.add(() => {
            this.interactionCount++;
        });
    }
    // Start VR session
    async startVRSession(userId) {
        if (!this.vrConfig.enableVR) {
            console.warn('VR is disabled in configuration');
            return false;
        }
        if (!navigator.xr) {
            console.error('WebXR not supported');
            return false;
        }
        try {
            // Check if VR is available
            const isVRAvailable = await navigator.xr.isSessionSupported('immersive-vr');
            if (!isVRAvailable) {
                console.error('Immersive VR not available');
                return false;
            }
            // Create VR session
            const session = await navigator.xr.requestSession('immersive-vr', {
                optionalFeatures: this.getVROptionalFeatures(),
                requiredFeatures: ['local-floor']
            });
            // Initialize session state
            this.currentSession = {
                isActive: true,
                sessionType: 'VR',
                currentScene: this.scene.activeCamera?.name || 'default',
                userPosition: { x: 0, y: 0, z: 0 },
                userRotation: { x: 0, y: 0, z: 0, w: 1 },
                activeFeatures: [],
                sessionMetrics: this.createSessionMetrics('VR', userId)
            };
            console.log('VR session started successfully');
            return true;
        }
        catch (error) {
            console.error('Failed to start VR session:', error);
            return false;
        }
    }
    // Start AR session
    async startARSession(userId) {
        if (!this.arConfig.enablePlaneDetection) {
            console.warn('AR is disabled in configuration');
            return false;
        }
        if (!navigator.xr) {
            console.error('WebXR not supported');
            return false;
        }
        try {
            // Check if AR is available
            const isARAvailable = await navigator.xr.isSessionSupported('immersive-ar');
            if (!isARAvailable) {
                console.error('Immersive AR not available');
                return false;
            }
            // Create AR session
            const session = await navigator.xr.requestSession('immersive-ar', {
                optionalFeatures: this.getAROptionalFeatures(),
                requiredFeatures: ['local-floor', 'hit-test']
            });
            // Initialize session state
            this.currentSession = {
                isActive: true,
                sessionType: 'AR',
                currentScene: this.scene.activeCamera?.name || 'default',
                userPosition: { x: 0, y: 0, z: 0 },
                userRotation: { x: 0, y: 0, z: 0, w: 1 },
                activeFeatures: [],
                sessionMetrics: this.createSessionMetrics('AR', userId)
            };
            console.log('AR session started successfully');
            return true;
        }
        catch (error) {
            console.error('Failed to start AR session:', error);
            return false;
        }
    }
    // End current session
    async endSession() {
        if (!this.currentSession) {
            return;
        }
        try {
            // End XR session if active
            if (this.xrExperience?.baseExperience.sessionManager.session) {
                await this.xrExperience.baseExperience.sessionManager.session.end();
            }
            // Update session metrics
            if (this.currentSession.sessionMetrics) {
                this.currentSession.sessionMetrics.endTime = Date.now();
                this.currentSession.sessionMetrics.duration =
                    this.currentSession.sessionMetrics.endTime - this.currentSession.sessionMetrics.startTime;
                // Store final metrics
                this.sessionMetrics.set(this.currentSession.sessionMetrics.sessionId, this.currentSession.sessionMetrics);
            }
            console.log('Session ended:', this.currentSession.sessionMetrics);
            this.currentSession = null;
        }
        catch (error) {
            console.error('Error ending session:', error);
        }
    }
    createSessionMetrics(deviceType, userId) {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
            sessionId,
            startTime: Date.now(),
            duration: 0,
            userId,
            deviceType,
            featuresUsed: [],
            performanceMetrics: {
                averageFPS: 0,
                memoryUsage: 0,
                networkLatency: 0
            },
            userInteractions: 0,
            areasVisited: []
        };
    }
    getVROptionalFeatures() {
        const features = [];
        if (this.vrConfig.enableHandTracking) {
            features.push('hand-tracking');
        }
        if (this.vrConfig.enableEyeTracking) {
            features.push('eye-tracking');
        }
        if (this.vrConfig.enableSpatialAudio) {
            features.push('spatial-audio');
        }
        return features;
    }
    getAROptionalFeatures() {
        const features = [];
        if (this.arConfig.enableImageTracking) {
            features.push('image-tracking');
        }
        if (this.arConfig.enablePlaneDetection) {
            features.push('plane-detection');
        }
        if (this.arConfig.enableFaceTracking) {
            features.push('face-tracking');
        }
        if (this.arConfig.enableWorldTracking) {
            features.push('anchors');
        }
        if (this.arConfig.lightingEstimation) {
            features.push('light-estimation');
        }
        if (this.arConfig.enableDepth) {
            features.push('depth-sensing');
        }
        return features;
    }
    onXRSessionStart() {
        if (!this.currentSession)
            return;
        // Enable XR features
        this.enableXRFeatures();
        // Start tracking user position and interactions
        this.startUserTracking();
        console.log('XR session fully started');
    }
    onXRSessionEnd() {
        // Clean up XR features
        this.disableXRFeatures();
        // Stop user tracking
        this.stopUserTracking();
        console.log('XR session fully ended');
    }
    enableXRFeatures() {
        if (!this.xrExperience)
            return;
        // Enable hand tracking if configured
        if (this.vrConfig.enableHandTracking) {
            this.xrExperience.baseExperience.featuresManager.enableFeature('hand-tracking', 'latest', { xrInput: this.xrExperience.input });
        }
        // Enable hit testing for AR
        if (this.currentSession?.sessionType === 'AR') {
            this.xrExperience.baseExperience.featuresManager.enableFeature('hit-test', 'latest');
        }
    }
    disableXRFeatures() {
        if (!this.xrExperience)
            return;
        // Disable all XR features
        this.xrExperience.baseExperience.featuresManager.disableFeature('hand-tracking');
        this.xrExperience.baseExperience.featuresManager.disableFeature('hit-test');
    }
    startUserTracking() {
        // Track user position updates
        if (this.xrExperience?.baseExperience.camera) {
            this.xrExperience.baseExperience.camera.onViewMatrixChangedObservable.add(() => {
                this.updateUserPosition();
            });
        }
    }
    stopUserTracking() {
        if (this.xrExperience?.baseExperience.camera) {
            this.xrExperience.baseExperience.camera.onViewMatrixChangedObservable.clear();
        }
    }
    updateUserPosition() {
        if (!this.currentSession || !this.xrExperience?.baseExperience.camera)
            return;
        const camera = this.xrExperience.baseExperience.camera;
        this.currentSession.userPosition = {
            x: camera.position.x,
            y: camera.position.y,
            z: camera.position.z
        };
        // Update rotation (simplified to quaternion)
        this.currentSession.userRotation = {
            x: camera.rotationQuaternion?.x || 0,
            y: camera.rotationQuaternion?.y || 0,
            z: camera.rotationQuaternion?.z || 0,
            w: camera.rotationQuaternion?.w || 1
        };
    }
    trackAreaVisit() {
        if (!this.currentSession)
            return;
        const currentArea = this.getCurrentArea();
        if (currentArea && !this.areasVisited.has(currentArea)) {
            this.areasVisited.add(currentArea);
            this.currentSession.sessionMetrics.areasVisited.push(currentArea);
        }
    }
    getCurrentArea() {
        // Determine current area based on user position
        // This is a simplified implementation
        if (!this.currentSession)
            return 'unknown';
        const pos = this.currentSession.userPosition;
        if (pos.x > 5)
            return 'east_wing';
        if (pos.x < -5)
            return 'west_wing';
        if (pos.z > 5)
            return 'north_area';
        if (pos.z < -5)
            return 'south_area';
        return 'central_area';
    }
    startPerformanceMonitoring() {
        this.performanceMonitor = window.setInterval(() => {
            this.updatePerformanceMetrics();
        }, 5000); // Update every 5 seconds
    }
    updatePerformanceMetrics() {
        if (!this.currentSession)
            return;
        const fps = this.engine.getFps();
        const memoryUsage = performance.memory?.usedJSHeapSize || 0;
        const networkLatency = this.measureNetworkLatency();
        // Update running averages
        const metrics = this.currentSession.sessionMetrics.performanceMetrics;
        const sampleCount = Math.max(1, this.currentSession.sessionMetrics.duration / 5000);
        metrics.averageFPS = (metrics.averageFPS * (sampleCount - 1) + fps) / sampleCount;
        metrics.memoryUsage = Math.max(metrics.memoryUsage, memoryUsage);
        metrics.networkLatency = networkLatency;
    }
    measureNetworkLatency() {
        // Simple network latency measurement
        const start = performance.now();
        // In a real implementation, you might ping a server
        return performance.now() - start;
    }
    // Feature activation tracking
    trackFeatureUsage(featureName) {
        if (!this.currentSession)
            return;
        if (!this.currentSession.activeFeatures.includes(featureName)) {
            this.currentSession.activeFeatures.push(featureName);
        }
        if (!this.currentSession.sessionMetrics.featuresUsed.includes(featureName)) {
            this.currentSession.sessionMetrics.featuresUsed.push(featureName);
        }
    }
    // Session state queries
    getCurrentSessionState() {
        return this.currentSession;
    }
    isSessionActive() {
        return this.currentSession?.isActive || false;
    }
    getSessionType() {
        return this.currentSession?.sessionType || null;
    }
    // Session metrics
    getSessionMetrics(sessionId) {
        if (sessionId) {
            return this.sessionMetrics.get(sessionId) || null;
        }
        return Array.from(this.sessionMetrics.values());
    }
    getActiveSessionMetrics() {
        return this.currentSession?.sessionMetrics || null;
    }
    // Quality settings management
    setQualitySettings(quality) {
        this.vrConfig.qualitySettings = quality;
        // Apply quality settings to engine
        switch (quality) {
            case 'low':
                this.engine.setHardwareScalingLevel(2);
                break;
            case 'medium':
                this.engine.setHardwareScalingLevel(1.5);
                break;
            case 'high':
                this.engine.setHardwareScalingLevel(1);
                break;
            case 'ultra':
                this.engine.setHardwareScalingLevel(0.8);
                break;
        }
        const sanitizedQuality = quality.replace(/[\r\n\t]/g, '_');
        console.log(`Quality settings changed to: ${sanitizedQuality}`);
    }
    // Configuration management
    updateVRConfig(config) {
        this.vrConfig = { ...this.vrConfig, ...config };
    }
    updateARConfig(config) {
        this.arConfig = { ...this.arConfig, ...config };
    }
    getVRConfig() {
        return this.vrConfig;
    }
    getARConfig() {
        return this.arConfig;
    }
    // Session timeout handling
    checkSessionTimeout() {
        if (!this.currentSession)
            return;
        const elapsed = Date.now() - this.currentSession.sessionMetrics.startTime;
        const timeoutMs = this.vrConfig.sessionTimeout * 60 * 1000;
        if (elapsed >= timeoutMs) {
            console.warn('Session timeout reached, ending session');
            this.endSession();
        }
    }
    // Export session data
    exportSessionData() {
        const allMetrics = Array.from(this.sessionMetrics.values());
        const currentMetrics = this.currentSession?.sessionMetrics;
        if (currentMetrics) {
            allMetrics.push(currentMetrics);
        }
        return JSON.stringify({
            sessions: allMetrics,
            currentSession: this.currentSession,
            config: {
                vr: this.vrConfig,
                ar: this.arConfig
            }
        }, null, 2);
    }
    // Cleanup
    dispose() {
        this.endSession();
        if (this.performanceMonitor) {
            clearInterval(this.performanceMonitor);
        }
        if (this.xrExperience) {
            this.xrExperience.dispose();
        }
        this.sessionMetrics.clear();
        this.areasVisited.clear();
    }
}
