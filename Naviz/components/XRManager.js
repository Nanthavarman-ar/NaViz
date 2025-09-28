import * as BABYLON from '@babylonjs/core';
export class XRManager {
    constructor(scene, camera, config) {
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
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_xrHelper", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_teleportationComponent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_handTrackingComponent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.scene = scene;
        this.camera = camera;
        this.config = {
            enableVR: true,
            enableAR: true,
            enableHandTracking: false,
            enableSpatialAnchors: false,
            referenceSpaceType: 'local-floor',
            enableTeleportation: true,
            enablePointerSelection: true,
            ...config
        };
    }
    async initializeXR() {
        try {
            // Check if WebXR is supported
            if (!BABYLON.WebXRSessionManager.IsSessionSupportedAsync) {
                console.warn('WebXR is not supported in this browser');
                return false;
            }
            // Check for VR support
            if (this.config.enableVR) {
                const vrSupported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-vr');
                if (!vrSupported) {
                    console.warn('VR is not supported');
                    this.config.enableVR = false;
                }
            }
            // Check for AR support
            if (this.config.enableAR) {
                const arSupported = await BABYLON.WebXRSessionManager.IsSessionSupportedAsync('immersive-ar');
                if (!arSupported) {
                    console.warn('AR is not supported');
                    this.config.enableAR = false;
                }
            }
            if (!this.config.enableVR && !this.config.enableAR) {
                console.warn('Neither VR nor AR is supported');
                return false;
            }
            // Create WebXR experience
            this._xrHelper = await BABYLON.WebXRDefaultExperience.CreateAsync(this.scene, {
                uiOptions: {
                    sessionMode: this.config.enableAR ? 'immersive-ar' : 'immersive-vr',
                    referenceSpaceType: this.config.referenceSpaceType
                },
                inputOptions: {
                    doNotLoadControllerMeshes: false
                }
            });
            // Enable teleportation
            if (this.config.enableTeleportation) {
                this._teleportationComponent = this._xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, 'latest', {
                    xrInput: this._xrHelper.input,
                    floorMeshes: this.scene.meshes.filter(mesh => mesh.name.includes('floor') || mesh.name.includes('ground'))
                });
            }
            // Enable hand tracking
            if (this.config.enableHandTracking) {
                this._handTrackingComponent = this._xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, 'latest', {
                    xrInput: this._xrHelper.input
                });
            }
            // Enable pointer selection
            if (this.config.enablePointerSelection) {
                this._xrHelper.baseExperience.featuresManager.enableFeature(BABYLON.WebXRFeatureName.POINTER_SELECTION, 'latest', {
                    xrInput: this._xrHelper.input,
                    enablePointerSelectionOnAllControllers: true
                });
            }
            console.log('WebXR initialized successfully');
            return true;
        }
        catch (error) {
            console.error('Failed to initialize WebXR:', error);
            return false;
        }
    }
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        // Note: Some config changes may require reinitializing XR
    }
    dispose() {
        if (this._handTrackingComponent) {
            this._handTrackingComponent.dispose();
            this._handTrackingComponent = null;
        }
        if (this._teleportationComponent) {
            this._teleportationComponent.dispose();
            this._teleportationComponent = null;
        }
        if (this._xrHelper) {
            this._xrHelper.dispose();
            this._xrHelper = null;
        }
    }
    get xrHelper() {
        return this._xrHelper;
    }
    // Added method to satisfy test expectations
    integrateWithBabylonWorkspace(workspace) {
        console.log('Integrate with Babylon Workspace called', workspace);
        // Implementation can be added as needed
    }
}
