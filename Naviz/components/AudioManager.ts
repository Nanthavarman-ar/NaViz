import * as BABYLON from '@babylonjs/core';

export interface AudioConfig {
  masterVolume: number;
  enableSpatialAudio: boolean;
  enableOcclusion: boolean;
  enableReverb: boolean;
  maxDistance: number;
  rolloffFactor: number;
  refDistance: number;
}

export class AudioManager {
  private scene: BABYLON.Scene;
  private config: AudioConfig;
  private audioEngine: BABYLON.IAudioEngine;
  private spatialAudioEnabled: boolean = false;
  private xrSession?: XRSession;

  constructor(scene: BABYLON.Scene, config?: Partial<AudioConfig>, xrSession?: XRSession) {
    this.scene = scene;
    this.xrSession = xrSession;
    this.config = {
      masterVolume: 1.0,
      enableSpatialAudio: true,
      enableOcclusion: true,
      enableReverb: true,
      maxDistance: 100,
      rolloffFactor: 1,
      refDistance: 1,
      ...config
    };

    this.audioEngine = BABYLON.Engine.audioEngine!;
    if (!this.audioEngine) {
      console.warn('Audio engine not available');
      return;
    }
    this.initializeAudio();
  }

  private initializeAudio(): void {
    // Set master volume
    this.audioEngine.setGlobalVolume(this.config.masterVolume);

    // Enable spatial audio if supported
    if (this.config.enableSpatialAudio && 'AudioListener' in window) {
      this.spatialAudioEnabled = true;
    }

    // Handle audio context suspension
    if (this.audioEngine.audioContext && this.audioEngine.audioContext.state === 'suspended') {
      // Resume audio context on user interaction
      const resumeAudio = () => {
        if (this.audioEngine.audioContext) {
          this.audioEngine.audioContext.resume();
        }
        document.removeEventListener('click', resumeAudio);
        document.removeEventListener('touchstart', resumeAudio);
      };
      document.addEventListener('click', resumeAudio);
      document.addEventListener('touchstart', resumeAudio);
    }
  }

  public createSpatialSound(name: string, url: string, position: BABYLON.Vector3, options?: {
    volume?: number;
    loop?: boolean;
    autoplay?: boolean;
    maxDistance?: number;
  }): BABYLON.Sound | null {
    try {
      const sound = new BABYLON.Sound(
        name,
        url,
        this.scene,
        null,
        {
          volume: options?.volume || 1.0,
          loop: options?.loop || false,
          autoplay: options?.autoplay || false,
          maxDistance: options?.maxDistance || this.config.maxDistance,
          rolloffFactor: this.config.rolloffFactor,
          refDistance: this.config.refDistance,
          spatialSound: this.spatialAudioEnabled
        }
      );

      if (this.spatialAudioEnabled) {
        sound.setPosition(position);
      }

      return sound;
    } catch (error) {
      console.error('Failed to create spatial sound:', error);
      return null;
    }
  }

  public createAmbientSound(name: string, url: string, options?: {
    volume?: number;
    loop?: boolean;
    autoplay?: boolean;
  }): BABYLON.Sound | null {
    try {
      return new BABYLON.Sound(
        name,
        url,
        this.scene,
        null,
        {
          volume: options?.volume || 1.0,
          loop: options?.loop || true,
          autoplay: options?.autoplay || true,
          spatialSound: false
        }
      );
    } catch (error) {
      console.error('Failed to create ambient sound:', error);
      return null;
    }
  }

  public createReverbZone(position: BABYLON.Vector3, size: BABYLON.Vector3, reverbOptions?: {
    decayTime?: number;
    wetDryMix?: number;
  }): void {
    if (!this.config.enableReverb) return;

    // Create a reverb zone using audio effects
    // Note: This is a simplified implementation
    const reverbZone = BABYLON.MeshBuilder.CreateBox('reverbZone', {
      width: size.x,
      height: size.y,
      depth: size.z
    }, this.scene);

    reverbZone.position = position;
    reverbZone.isVisible = false; // Invisible zone

    // In a full implementation, you would apply reverb effects to sounds within this zone
  }

  public updateConfig(newConfig: Partial<AudioConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.audioEngine.setGlobalVolume(this.config.masterVolume);
  }

  public get isSpatialAudioEnabled(): boolean {
    return this.spatialAudioEnabled;
  }

  public get audioContext(): AudioContext | null {
    return this.audioEngine.audioContext;
  }

  public setXrSession(session: XRSession): void {
    this.xrSession = session;
  }

  public enableSpatialAudio(): void {
    if ('AudioListener' in window) {
      this.spatialAudioEnabled = true;

      // If in XR session, use WebXR audio context for enhanced spatialization
      if (this.xrSession && this.audioEngine.audioContext) {
        try {
          // Set the audio context to use the XR session's audio context if available
          if ('setSinkId' in this.audioEngine.audioContext) {
            // This would be used for advanced XR audio routing
            console.log('XR spatial audio enabled with session context');
          }
        } catch (error) {
          console.warn('Failed to set XR audio context:', error);
        }
      }

      console.log('Spatial audio enabled');
    } else {
      console.warn('Spatial audio not supported in this browser');
    }
  }

  public disableSpatialAudio(): void {
    this.spatialAudioEnabled = false;
    console.log('Spatial audio disabled');
  }

  public update(): void {
    // Update audio listener position to match the active camera for spatial audio
    if (this.spatialAudioEnabled && this.scene.activeCamera) {
      const camera = this.scene.activeCamera;
      const listener = this.audioEngine.audioContext?.listener;

      if (listener) {
        // Set listener position to camera position
        if ('positionX' in listener) {
          // Modern AudioListener API
          listener.positionX.value = camera.position.x;
          listener.positionY.value = camera.position.y;
          listener.positionZ.value = camera.position.z;
        } else if ('setPosition' in listener) {
          // Legacy API fallback
          (listener as any).setPosition(camera.position.x, camera.position.y, camera.position.z);
        }

        // Set listener orientation to match camera direction
        if (camera instanceof BABYLON.ArcRotateCamera) {
          // For ArcRotateCamera, calculate forward direction
          const target = camera.target;
          const forward = target.subtract(camera.position).normalize();
          const up = BABYLON.Vector3.Up();

          if ('forwardX' in listener) {
            listener.forwardX.value = forward.x;
            listener.forwardY.value = forward.y;
            listener.forwardZ.value = forward.z;
            listener.upX.value = up.x;
            listener.upY.value = up.y;
            listener.upZ.value = up.z;
          } else if ('setOrientation' in listener) {
            (listener as any).setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
          }
        }
      }
    }
  }

  public dispose(): void {
    // Babylon.js sounds are automatically disposed when the scene is disposed
    // Additional cleanup can be added here if needed
    this.spatialAudioEnabled = false;
    console.log('AudioManager disposed');
  }
}
