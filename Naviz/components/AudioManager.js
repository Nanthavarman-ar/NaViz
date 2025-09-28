import * as BABYLON from '@babylonjs/core';
export class AudioManager {
    constructor(scene, config) {
        Object.defineProperty(this, "scene", {
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
        Object.defineProperty(this, "audioEngine", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "spatialAudioEnabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.scene = scene;
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
        this.audioEngine = BABYLON.Engine.audioEngine;
        if (!this.audioEngine) {
            console.warn('Audio engine not available');
            return;
        }
        this.initializeAudio();
    }
    initializeAudio() {
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
    createSpatialSound(name, url, position, options) {
        try {
            const sound = new BABYLON.Sound(name, url, this.scene, null, {
                volume: options?.volume || 1.0,
                loop: options?.loop || false,
                autoplay: options?.autoplay || false,
                maxDistance: options?.maxDistance || this.config.maxDistance,
                rolloffFactor: this.config.rolloffFactor,
                refDistance: this.config.refDistance,
                spatialSound: this.spatialAudioEnabled
            });
            if (this.spatialAudioEnabled) {
                sound.setPosition(position);
            }
            return sound;
        }
        catch (error) {
            console.error('Failed to create spatial sound:', error);
            return null;
        }
    }
    createAmbientSound(name, url, options) {
        try {
            return new BABYLON.Sound(name, url, this.scene, null, {
                volume: options?.volume || 1.0,
                loop: options?.loop || true,
                autoplay: options?.autoplay || true,
                spatialSound: false
            });
        }
        catch (error) {
            console.error('Failed to create ambient sound:', error);
            return null;
        }
    }
    createReverbZone(position, size, reverbOptions) {
        if (!this.config.enableReverb)
            return;
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
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.audioEngine.setGlobalVolume(this.config.masterVolume);
    }
    dispose() {
        // Dispose of all sounds in the main sound track
        // Note: Babylon.js sound disposal is handled automatically when scene is disposed
        // This is a simplified dispose method
    }
    get isSpatialAudioEnabled() {
        return this.spatialAudioEnabled;
    }
    get audioContext() {
        return this.audioEngine.audioContext;
    }
}
