import { Scene, Camera, ArcRotateCamera, FreeCamera, WebXRDefaultExperience, WebXRState, WebXRCamera, WebXRFeaturesManager, Vector3, Quaternion } from '@babylonjs/core';

// WebXR type declarations
interface XRSystem {
  isSessionSupported(sessionMode: string): Promise<boolean>;
  requestSession(sessionMode: string, options?: any): Promise<XRSession>;
}

interface XRSession {
  end(): Promise<void>;
  addEventListener(type: string, listener: (event: any) => void): void;
  removeEventListener(type: string, listener: (event: any) => void): void;
}

interface Navigator {
  xr?: XRSystem;
}

export class XRManager {
  private static instance: XRManager | null = null;

  private scene: Scene;
  private originalCamera: Camera | null = null;
  private xrExperience: WebXRDefaultExperience | null = null;
  private xrCamera: WebXRCamera | null = null;
  private isInitialized: boolean = false;
  private handTrackingEnabled: boolean = false;
  private teleportationEnabled: boolean = false;
  private currentSessionMode: 'none' | 'immersive-vr' | 'immersive-ar' = 'none';
  private audioManager: any = null; // AudioManager instance

  constructor(scene: Scene) {
    this.scene = scene;
    this.initializeXR();
  }

  static getInstance(scene: Scene): XRManager {
    if (!XRManager.instance) {
      XRManager.instance = new XRManager(scene);
    }
    return XRManager.instance;
  }

  // Initialize WebXR
  private async initializeXR(): Promise<void> {
    if (!this.scene) {
      console.error('Scene not available for XR initialization');
      return;
    }

    try {
      // Check if WebXR is supported
      if (!navigator.xr) {
        console.warn('WebXR not supported in this browser');
        return;
      }

      // Check for VR support
      const vrSupported = await navigator.xr!.isSessionSupported('immersive-vr');
      const arSupported = await navigator.xr!.isSessionSupported('immersive-ar');

      if (!vrSupported && !arSupported) {
        console.warn('Neither VR nor AR sessions are supported');
        return;
      }

      console.log('WebXR initialized:', { vrSupported, arSupported });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize WebXR:', error);
    }
  }

  // Set audio manager for spatial audio integration
  setAudioManager(audioManager: any): void {
    this.audioManager = audioManager;
  }

  // Enter VR mode
  async enterVR(): Promise<boolean> {
    if (!this.isInitialized) {
      console.error('XR not initialized');
      return false;
    }

    try {
      // Store original camera
      this.originalCamera = this.scene.activeCamera;

      // Create XR experience with audio support
      this.xrExperience = await WebXRDefaultExperience.CreateAsync(this.scene, {
        floorMeshes: [], // Add floor meshes for teleportation
        optionalFeatures: this.teleportationEnabled ? ["teleportation"] : []
      });

      if (!this.xrExperience) {
        throw new Error('Failed to create XR experience');
      }

      this.xrCamera = this.xrExperience.baseExperience.camera;
      this.currentSessionMode = 'immersive-vr';

      // Enable spatial audio if audio manager is available
      if (this.audioManager && typeof this.audioManager.enableSpatialAudio === 'function') {
        // Pass the XR session to the audio manager for enhanced spatialization
        if (this.xrExperience?.baseExperience?.sessionManager?.session) {
          this.audioManager.setXrSession(this.xrExperience.baseExperience.sessionManager.session);
        }
        this.audioManager.enableSpatialAudio();
      }

      // Configure XR features
      this.configureXRFeatures();

      console.log('Entered VR mode');
      return true;
    } catch (error) {
      console.error('Failed to enter VR mode:', error);
      return false;
    }
  }

  // Enter AR mode
  async enterAR(): Promise<boolean> {
    if (!this.isInitialized) {
      console.error('XR not initialized');
      return false;
    }

    try {
      // Store original camera
      this.originalCamera = this.scene.activeCamera;

      // Create XR experience for AR with audio support
      this.xrExperience = await WebXRDefaultExperience.CreateAsync(this.scene, {
        uiOptions: {
          sessionMode: 'immersive-ar'
        },
        optionalFeatures: this.teleportationEnabled ? ["teleportation"] : []
      });

      if (!this.xrExperience) {
        throw new Error('Failed to create AR experience');
      }

      this.xrCamera = this.xrExperience.baseExperience.camera;
      this.currentSessionMode = 'immersive-ar';

      // Enable spatial audio if audio manager is available
      if (this.audioManager && typeof this.audioManager.enableSpatialAudio === 'function') {
        // Pass the XR session to the audio manager for enhanced spatialization
        if (this.xrExperience?.baseExperience?.sessionManager?.session) {
          this.audioManager.setXrSession(this.xrExperience.baseExperience.sessionManager.session);
        }
        this.audioManager.enableSpatialAudio();
      }

      // Configure XR features
      this.configureXRFeatures();

      console.log('Entered AR mode');
      return true;
    } catch (error) {
      console.error('Failed to enter AR mode:', error);
      return false;
    }
  }

  // Exit XR mode
  async exitXR(): Promise<void> {
    if (!this.xrExperience) {
      return;
    }

    try {
      // Disable spatial audio if audio manager is available
      if (this.audioManager && typeof this.audioManager.disableSpatialAudio === 'function') {
        this.audioManager.disableSpatialAudio();
      }

      // End XR session
      await this.xrExperience.baseExperience.sessionManager.exitXRAsync();

      // Restore original camera
      if (this.originalCamera) {
        this.scene.activeCamera = this.originalCamera;
      }

      // Clean up
      this.xrExperience.dispose();
      this.xrExperience = null;
      this.xrCamera = null;
      this.currentSessionMode = 'none';

      console.log('Exited XR mode');
    } catch (error) {
      console.error('Failed to exit XR mode:', error);
    }
  }

  // Configure XR features
  private configureXRFeatures(): void {
    if (!this.xrExperience) return;

    const featuresManager = this.xrExperience.baseExperience.featuresManager;

    // Enable hand tracking if supported
    if (this.handTrackingEnabled) {
      this.enableHandTracking(featuresManager);
    }

    // Enable teleportation if supported
    if (this.teleportationEnabled) {
      this.enableTeleportation(featuresManager);
    }

    // Set up controller events
    this.setupControllerEvents();
  }

  // Enable hand tracking
  private enableHandTracking(featuresManager: WebXRFeaturesManager): void {
    try {
      // Note: Hand tracking requires additional setup and may not be supported on all devices
      // This is a placeholder for hand tracking implementation
      console.log('Hand tracking enabled');
    } catch (error) {
      console.warn('Hand tracking not supported:', error);
    }
  }

  // Enable teleportation
  private enableTeleportation(featuresManager: WebXRFeaturesManager): void {
    try {
      // Teleportation is enabled via optionalFeatures in CreateAsync
      console.log('Teleportation enabled');
    } catch (error) {
      console.warn('Teleportation not supported:', error);
    }
  }

  // Set up controller events (simplified for now)
  private setupControllerEvents(): void {
    if (!this.xrExperience) return;

    // Basic controller setup - can be expanded later
    this.xrExperience.input.onControllerAddedObservable.add((controller) => {
      console.log('XR controller added');
    });

    this.xrExperience.input.onControllerRemovedObservable.add((controller) => {
      console.log('XR controller removed');
    });
  }

  // Toggle hand tracking
  toggleHandTracking(): void {
    this.handTrackingEnabled = !this.handTrackingEnabled;

    if (this.xrExperience && this.currentSessionMode !== 'none') {
      // Reconfigure features if in XR session
      this.configureXRFeatures();
    }

    console.log(`Hand tracking ${this.handTrackingEnabled ? 'enabled' : 'disabled'}`);
  }

  // Toggle teleportation
  toggleTeleportation(): void {
    this.teleportationEnabled = !this.teleportationEnabled;

    if (this.xrExperience && this.currentSessionMode !== 'none') {
      // Reconfigure features if in XR session
      this.configureXRFeatures();
    }

    console.log(`Teleportation ${this.teleportationEnabled ? 'enabled' : 'disabled'}`);
  }

  // Switch camera mode for XR
  switchCameraForXR(cameraType: 'arcRotate' | 'free' | 'universal'): void {
    if (!this.scene) return;

    let newCamera: Camera;

    switch (cameraType) {
      case 'arcRotate':
        newCamera = new ArcRotateCamera('xr_arc_camera', -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), this.scene);
        break;
      case 'free':
        newCamera = new FreeCamera('xr_free_camera', new Vector3(0, 5, -10), this.scene);
        break;
      case 'universal':
        // Universal camera combines features of both
        newCamera = new FreeCamera('xr_universal_camera', new Vector3(0, 5, -10), this.scene);
        break;
      default:
        return;
    }

    // If not in XR mode, set as active camera
    if (this.currentSessionMode === 'none') {
      this.scene.activeCamera = newCamera;
      newCamera.attachControl();
    } else {
      // In XR mode, the XR camera is active, but we can store the preference
      console.log(`Camera mode set to ${cameraType} for next XR session`);
    }
  }

  // Get XR session state
  getXRState(): {
    isInitialized: boolean;
    currentMode: string;
    handTrackingEnabled: boolean;
    teleportationEnabled: boolean;
    isInSession: boolean;
  } {
    return {
      isInitialized: this.isInitialized,
      currentMode: this.currentSessionMode,
      handTrackingEnabled: this.handTrackingEnabled,
      teleportationEnabled: this.teleportationEnabled,
      isInSession: this.xrExperience !== null
    };
  }

  // Check if VR is supported
  async isVRSupported(): Promise<boolean> {
    if (!navigator.xr) return false;
    try {
      return await navigator.xr.isSessionSupported('immersive-vr');
    } catch {
      return false;
    }
  }

  // Check if AR is supported
  async isARSupported(): Promise<boolean> {
    if (!navigator.xr) return false;
    try {
      return await navigator.xr.isSessionSupported('immersive-ar');
    } catch {
      return false;
    }
  }

  // Update method for per-frame updates
  update(): void {
    // Handle any per-frame XR updates here
    // For now, this is mainly a placeholder for future XR-specific updates
  }

  // Dispose resources
  dispose(): void {
    this.exitXR().then(() => {
      // Dispose audio manager if available
      if (this.audioManager && typeof this.audioManager.dispose === 'function') {
        this.audioManager.dispose();
      }

      this.xrExperience = null;
      this.xrCamera = null;
      this.originalCamera = null;
      this.currentSessionMode = 'none';
      this.isInitialized = false;
    });
  }

  // Enable haptic feedback
  enableHapticFeedback(): void {
    if (!this.xrExperience) {
      console.warn('Cannot enable haptic feedback: not in XR session');
      return;
    }

    try {
      // Haptic feedback is enabled by default when controllers are available
      // This method can be used to ensure haptic actuators are ready
      console.log('Haptic feedback enabled');
    } catch (error) {
      console.error('Failed to enable haptic feedback:', error);
    }
  }

  // Disable haptic feedback
  disableHapticFeedback(): void {
    if (!this.xrExperience) {
      console.warn('Cannot disable haptic feedback: not in XR session');
      return;
    }

    try {
      // Note: Disabling haptic feedback may not be directly supported
      // This could involve setting vibration intensity to 0 for all actuators
      console.log('Haptic feedback disabled');
    } catch (error) {
      console.error('Failed to disable haptic feedback:', error);
    }
  }

  // Trigger haptic feedback on a specific controller
  triggerHapticFeedback(controllerIndex: number = 0, intensity: number = 1.0, duration: number = 100): void {
    if (!this.xrExperience) {
      console.warn('Cannot trigger haptic feedback: not in XR session');
      return;
    }

    try {
      const controllers = this.xrExperience.input.controllers;
      if (controllerIndex >= controllers.length) {
        console.warn(`Controller ${controllerIndex} not available`);
        return;
      }

      const controller = controllers[controllerIndex];
      if (controller.inputSource.gamepad && controller.inputSource.gamepad.hapticActuators) {
        const actuator = controller.inputSource.gamepad.hapticActuators[0];
        if (actuator) {
          actuator.pulse(intensity, duration);
        }
      }
    } catch (error) {
      console.error('Failed to trigger haptic feedback:', error);
    }
  }
}
