import * as BABYLON from "@babylonjs/core";
import { SecurityUtils } from "./utils/SecurityUtils";
export class AnimationManager {
    constructor(scene, syncManager) {
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "syncManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "animationGroups", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "activeAnimations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "pausedAnimations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "eventCallbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "globalSpeedRatio", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1.0
        });
        Object.defineProperty(this, "isPaused", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // Animation presets and sequences
        Object.defineProperty(this, "animationPresets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "animationSequences", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "activeSequences", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        // Enhanced easing functions
        Object.defineProperty(this, "easingFunctions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        // Error tracking
        Object.defineProperty(this, "errors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "maxErrors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        });
        // Enhanced Animation Pooling System
        Object.defineProperty(this, "animationPool", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "maxPoolSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        });
        Object.defineProperty(this, "poolHitCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "poolMissCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        // LRU Cache for frequently used animations
        Object.defineProperty(this, "animationCache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "maxCacheSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 50
        });
        Object.defineProperty(this, "maxMemoryUsage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 50 * 1024 * 1024
        }); // 50MB limit
        Object.defineProperty(this, "currentMemoryUsage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        // Pool cleanup and optimization
        Object.defineProperty(this, "lastPoolCleanup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "poolCleanupInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 30000
        }); // Clean up every 30 seconds
        Object.defineProperty(this, "unusedThreshold", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 60000
        }); // Consider unused after 1 minute
        // Pool optimization based on usage patterns
        Object.defineProperty(this, "poolUsageStats", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "adaptivePoolSizing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        // Performance optimization
        Object.defineProperty(this, "frameCount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "lastPerformanceUpdate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "performanceMetrics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                totalAnimations: 0,
                activeAnimations: 0,
                averageFrameTime: 0,
                memoryUsage: 0,
                lastUpdateTime: 0,
                poolHitRate: 0,
                poolSize: 0
            }
        });
        // Update optimization
        Object.defineProperty(this, "updateFrameSkip", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        }); // Update every N frames
        Object.defineProperty(this, "sequenceUpdateFrameSkip", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 2
        }); // Update sequences less frequently
        Object.defineProperty(this, "performanceUpdateInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        }); // Update performance metrics every second
        // Cached data for performance
        Object.defineProperty(this, "cachedActiveGroups", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "lastSequenceUpdate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "sequenceUpdateInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 16
        }); // ~60fps
        // Physics-based animations
        Object.defineProperty(this, "physicsAnimations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "activePhysicsAnimations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "physicsUpdateInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 16
        }); // ~60fps physics updates
        Object.defineProperty(this, "lastPhysicsUpdate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        // Keyframe management
        Object.defineProperty(this, "animationTracks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "keyframeCallbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        // Animation blending
        Object.defineProperty(this, "animationBlends", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "activeBlends", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        // Enhanced event callbacks
        Object.defineProperty(this, "enhancedEventCallbacks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        // Real-time editing and preview state
        Object.defineProperty(this, "isPreviewMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "previewAnimationGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "previewCurrentTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        // Validate inputs
        if (!scene) {
            throw new Error('AnimationManager: Scene is required');
        }
        if (!syncManager) {
            throw new Error('AnimationManager: SyncManager is required');
        }
        this.scene = scene;
        this.syncManager = syncManager;
        try {
            // Register scene update loop
            this.scene.onBeforeRenderObservable.add(() => this.update());
            // Initialize default easing functions
            this.initializeEasingFunctions();
            // Initialize default animation presets
            this.initializeDefaultPresets();
        }
        catch (error) {
            this.logError(error, 'constructor');
            throw error;
        }
    }
    /**
     * Validate animation group data
     */
    validateAnimationGroup(group) {
        if (!group.id || typeof group.id !== 'string') {
            this.logError(new Error('Invalid animation group ID'), 'validateAnimationGroup');
            return false;
        }
        if (!group.name || typeof group.name !== 'string') {
            this.logError(new Error('Invalid animation group name'), 'validateAnimationGroup');
            return false;
        }
        if (!Array.isArray(group.animations) || group.animations.length === 0) {
            this.logError(new Error('Animation group must have at least one animation'), 'validateAnimationGroup');
            return false;
        }
        if (!Array.isArray(group.targetMeshes) || group.targetMeshes.length === 0) {
            this.logError(new Error('Animation group must have at least one target mesh'), 'validateAnimationGroup');
            return false;
        }
        if (typeof group.speedRatio !== 'number' || group.speedRatio < 0) {
            this.logError(new Error('Invalid speed ratio'), 'validateAnimationGroup');
            return false;
        }
        if (typeof group.weight !== 'number' || group.weight < 0 || group.weight > 1) {
            this.logError(new Error('Invalid weight (must be between 0 and 1)'), 'validateAnimationGroup');
            return false;
        }
        return true;
    }
    /**
     * Validate animation preset
     */
    validateAnimationPreset(preset) {
        if (!preset.name || typeof preset.name !== 'string') {
            this.logError(new Error('Invalid preset name'), 'validateAnimationPreset');
            return false;
        }
        if (!['rotation', 'scaling', 'translation', 'opacity', 'color', 'custom'].includes(preset.type)) {
            this.logError(new Error('Invalid animation type'), 'validateAnimationPreset');
            return false;
        }
        if (typeof preset.duration !== 'number' || preset.duration <= 0) {
            this.logError(new Error('Invalid duration (must be positive number)'), 'validateAnimationPreset');
            return false;
        }
        return true;
    }
    /**
     * Sanitize log data to prevent log injection
     */
    sanitizeLogData(data) {
        if (typeof data === 'string') {
            return SecurityUtils.sanitizeForLog(data);
        }
        if (typeof data === 'object' && data !== null) {
            const sanitized = {};
            for (const [key, value] of Object.entries(data)) {
                sanitized[key] = this.sanitizeLogData(value);
            }
            return sanitized;
        }
        return data;
    }
    /**
     * Log error with context
     */
    logError(error, context) {
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        else if (typeof error === 'string') {
            errorMessage = error;
        }
        const errorEntry = {
            timestamp: Date.now(),
            error: error instanceof Error ? error : new Error(errorMessage),
            context
        };
        this.errors.push(errorEntry);
        // Keep only the most recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }
        console.error(`AnimationManager Error [${SecurityUtils.sanitizeForLog(context)}]:`, SecurityUtils.sanitizeForLog(errorMessage));
        // Emit error event
        this.emitEvent({
            type: 'frame_changed',
            groupId: 'error',
            timestamp: Date.now(),
            data: { error: errorMessage, context }
        });
    }
    /**
     * Get recent errors
     */
    getRecentErrors(limit = 10) {
        return this.errors.slice(-limit);
    }
    /**
     * Clear error log
     */
    clearErrors() {
        this.errors = [];
    }
    /**
     * Register a new animation group
     */
    registerAnimationGroup(group) {
        // Create Babylon animation group
        const babylonGroup = new BABYLON.AnimationGroup(group.name, this.scene);
        // Add animations to the group
        group.animations.forEach((animation, index) => {
            const target = group.targetMeshes[index] || group.targetMeshes[0];
            if (target) {
                babylonGroup.addTargetedAnimation(animation, target);
            }
        });
        // Set group properties
        babylonGroup.loopAnimation = group.isLooping;
        babylonGroup.speedRatio = group.speedRatio;
        // Store enhanced group data
        const enhancedGroup = {
            ...group,
            babylonGroup
        };
        this.animationGroups.set(group.id, enhancedGroup);
        // Set up event listeners
        this.setupAnimationEvents(group.id, babylonGroup);
        console.log(`Animation group '${SecurityUtils.sanitizeForLog(group.name)}' registered with ${group.animations.length} animations`);
    }
    /**
     * Setup animation event listeners
     */
    setupAnimationEvents(groupId, babylonGroup) {
        babylonGroup.onAnimationGroupPlayObservable.add(() => {
            this.emitEvent({
                type: 'started',
                groupId,
                timestamp: Date.now()
            });
        });
        babylonGroup.onAnimationGroupPauseObservable.add(() => {
            this.emitEvent({
                type: 'stopped',
                groupId,
                timestamp: Date.now()
            });
        });
        babylonGroup.onAnimationGroupEndObservable.add(() => {
            this.emitEvent({
                type: 'completed',
                groupId,
                timestamp: Date.now()
            });
        });
    }
    /**
     * Play animation group
     */
    async playAnimation(groupId, options) {
        const group = this.animationGroups.get(groupId);
        if (!group) {
            console.warn(`Animation group '${SecurityUtils.sanitizeForLog(groupId)}' not found`);
            return false;
        }
        const babylonGroup = group.babylonGroup;
        if (!babylonGroup)
            return false;
        // Update properties if provided
        if (options?.speedRatio !== undefined) {
            babylonGroup.speedRatio = options.speedRatio * this.globalSpeedRatio;
            group.speedRatio = options.speedRatio;
        }
        if (options?.loop !== undefined) {
            babylonGroup.loopAnimation = options.loop;
            group.isLooping = options.loop;
        }
        // Play the animation
        babylonGroup.play(options?.loop);
        group.isPlaying = true;
        this.activeAnimations.add(groupId);
        // Sync with other users
        this.syncAnimationState(groupId);
        return true;
    }
    /**
     * Stop animation group
     */
    stopAnimation(groupId) {
        const group = this.animationGroups.get(groupId);
        if (!group)
            return false;
        const babylonGroup = group.babylonGroup;
        if (babylonGroup) {
            babylonGroup.stop();
        }
        group.isPlaying = false;
        this.activeAnimations.delete(groupId);
        // Sync with other users
        this.syncAnimationState(groupId);
        return true;
    }
    /**
     * Pause animation group
     */
    pauseAnimation(groupId) {
        const group = this.animationGroups.get(groupId);
        if (!group)
            return false;
        const babylonGroup = group.babylonGroup;
        if (babylonGroup) {
            babylonGroup.pause();
        }
        group.isPlaying = false;
        this.activeAnimations.delete(groupId);
        return true;
    }
    /**
     * Restart animation group
     */
    restartAnimation(groupId) {
        const group = this.animationGroups.get(groupId);
        if (!group)
            return false;
        const babylonGroup = group.babylonGroup;
        if (babylonGroup) {
            babylonGroup.restart();
        }
        group.isPlaying = true;
        this.activeAnimations.add(groupId);
        return true;
    }
    /**
     * Set animation speed ratio
     */
    setAnimationSpeed(groupId, speedRatio) {
        const group = this.animationGroups.get(groupId);
        if (!group)
            return false;
        const babylonGroup = group.babylonGroup;
        if (babylonGroup) {
            babylonGroup.speedRatio = speedRatio * this.globalSpeedRatio;
        }
        group.speedRatio = speedRatio;
        // Sync with other users
        this.syncAnimationState(groupId);
        return true;
    }
    /**
     * Set global speed ratio for all animations
     */
    setGlobalSpeedRatio(speedRatio) {
        this.globalSpeedRatio = speedRatio;
        // Update all active animations
        this.animationGroups.forEach((group, groupId) => {
            const babylonGroup = group.babylonGroup;
            if (babylonGroup && this.activeAnimations.has(groupId)) {
                babylonGroup.speedRatio = group.speedRatio * this.globalSpeedRatio;
            }
        });
    }
    /**
     * Toggle animation loop
     */
    setAnimationLoop(groupId, loop) {
        const group = this.animationGroups.get(groupId);
        if (!group)
            return false;
        const babylonGroup = group.babylonGroup;
        if (babylonGroup) {
            babylonGroup.loopAnimation = loop;
        }
        group.isLooping = loop;
        return true;
    }
    /**
     * Get animation state
     */
    getAnimationState(groupId) {
        const group = this.animationGroups.get(groupId);
        if (!group)
            return null;
        const babylonGroup = group.babylonGroup;
        // Get current frame - Babylon.js AnimationGroup doesn't expose current frame directly
        // We need to track it through animation events or estimate based on time
        let currentFrame = 0;
        if (babylonGroup && babylonGroup.animatables && babylonGroup.animatables.length > 0) {
            // Try to get frame from the first animatable
            const firstAnimatable = babylonGroup.animatables[0];
            if (firstAnimatable && firstAnimatable.animations && firstAnimatable.animations.length > 0) {
                // Estimate current frame based on animation progress
                const animation = firstAnimatable.animations[0];
                if (animation && animation.currentFrame !== undefined) {
                    currentFrame = animation.currentFrame;
                }
            }
        }
        return {
            groupId,
            isPlaying: group.isPlaying,
            currentFrame,
            speedRatio: group.speedRatio,
            isLooping: group.isLooping
        };
    }
    /**
     * Get all animation groups
     */
    getAnimationGroups() {
        return Array.from(this.animationGroups.values());
    }
    /**
     * Get animation groups by type
     */
    getAnimationGroupsByType(type) {
        return Array.from(this.animationGroups.values()).filter(group => group.metadata?.type === type);
    }
    /**
     * Get animation groups by category
     */
    getAnimationGroupsByCategory(category) {
        return Array.from(this.animationGroups.values()).filter(group => group.metadata?.category === category);
    }
    /**
     * Pause all animations
     */
    pauseAllAnimations() {
        this.activeAnimations.forEach(groupId => {
            this.pauseAnimation(groupId);
            this.pausedAnimations.add(groupId);
        });
        this.isPaused = true;
    }
    /**
     * Resume all animations
     */
    resumeAllAnimations() {
        this.pausedAnimations.forEach(groupId => {
            this.playAnimation(groupId);
            this.pausedAnimations.delete(groupId);
        });
        this.isPaused = false;
    }
    /**
     * Stop all animations
     */
    stopAllAnimations() {
        this.activeAnimations.forEach(groupId => {
            this.stopAnimation(groupId);
        });
    }
    /**
     * Register event callback
     */
    onAnimationEvent(callback) {
        this.eventCallbacks.push(callback);
    }
    /**
     * Remove event callback
     */
    removeAnimationEventCallback(callback) {
        const index = this.eventCallbacks.indexOf(callback);
        if (index > -1) {
            this.eventCallbacks.splice(index, 1);
        }
    }
    /**
     * Emit animation event
     */
    emitEvent(event) {
        this.eventCallbacks.forEach(callback => {
            try {
                callback(event);
            }
            catch (error) {
                let errorMessage = 'Unknown error';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                else if (typeof error === 'string') {
                    errorMessage = error;
                }
                console.error('Animation event callback error:', SecurityUtils.sanitizeForLog(errorMessage));
            }
        });
    }
    /**
     * Get current frame from Babylon animation group
     * @param babylonGroup The Babylon animation group
     * @returns Current frame number
     */
    getCurrentFrame(babylonGroup) {
        // Babylon.js AnimationGroup doesn't expose current frame directly
        // We need to track it through animation events or estimate based on time
        // For now, return 0 as a placeholder - this should be improved with proper frame tracking
        return 0;
    }
    /**
     * Sync animation state with other users
     */
    syncAnimationState(groupId) {
        const state = this.getAnimationState(groupId);
        if (state) {
            // Use the existing sync mechanism by creating a sync event
            const syncEvent = {
                type: 'animation',
                objectId: groupId,
                data: state,
                userId: 'local_user', // This should be passed from a user management system
                timestamp: Date.now()
            };
            // Emit the sync event through socket
            // This assumes syncManager has access to socket, or we need to modify the interface
            console.log('Animation sync event:', this.sanitizeLogData(syncEvent));
        }
    }
    /**
     * Handle synced animation from other users
     */
    handleSyncedAnimation(groupId, data) {
        const group = this.animationGroups.get(groupId);
        if (!group)
            return;
        if (data.isPlaying && !group.isPlaying) {
            this.playAnimation(groupId, {
                speedRatio: data.speedRatio,
                loop: data.isLooping
            });
        }
        else if (!data.isPlaying && group.isPlaying) {
            this.stopAnimation(groupId);
        }
        if (data.speedRatio !== group.speedRatio) {
            this.setAnimationSpeed(groupId, data.speedRatio);
        }
    }
    // ===== REAL-TIME EDITING METHODS =====
    /**
     * Enable or disable real-time preview mode
     */
    enableRealtimePreview(enabled) {
        this.isPreviewMode = enabled;
        if (!enabled && this.previewAnimationGroup) {
            this.previewAnimationGroup.stop();
            this.previewAnimationGroup = null;
        }
    }
    /**
     * Update animation speed in real-time
     */
    updateAnimationSpeed(groupId, speedRatio) {
        const group = this.animationGroups.get(groupId);
        if (!group)
            return false;
        const babylonGroup = group.babylonGroup;
        if (babylonGroup) {
            babylonGroup.speedRatio = speedRatio * this.globalSpeedRatio;
        }
        group.speedRatio = speedRatio;
        // Emit real-time update event
        this.emitEvent({
            type: 'realtime_update',
            groupId,
            timestamp: Date.now(),
            data: { property: 'speedRatio', value: speedRatio }
        });
        return true;
    }
    /**
     * Update animation duration in real-time
     */
    updateAnimationDuration(groupId, duration) {
        const group = this.animationGroups.get(groupId);
        if (!group)
            return false;
        // Update duration in animation group metadata
        if (group.metadata) {
            group.metadata.duration = duration;
        }
        else {
            group.metadata = {
                type: 'custom',
                category: 'animation',
                duration
            };
        }
        // Emit real-time update event
        this.emitEvent({
            type: 'realtime_update',
            groupId,
            timestamp: Date.now(),
            data: { property: 'duration', value: duration }
        });
        return true;
    }
    /**
     * Update animation weight in real-time
     */
    updateAnimationWeight(groupId, weight) {
        const group = this.animationGroups.get(groupId);
        if (!group)
            return false;
        group.weight = Math.max(0, Math.min(1, weight)); // Clamp between 0 and 1
        // Emit real-time update event
        this.emitEvent({
            type: 'realtime_update',
            groupId,
            timestamp: Date.now(),
            data: { property: 'weight', value: group.weight }
        });
        return true;
    }
    /**
     * Scrub animation to specific time
     */
    scrubToTime(groupId, time) {
        const group = this.animationGroups.get(groupId);
        if (!group)
            return false;
        const babylonGroup = group.babylonGroup;
        if (babylonGroup) {
            // Babylon.js AnimationGroup doesn't have direct time scrubbing
            // We need to restart and fast-forward to the desired time
            babylonGroup.stop();
            babylonGroup.start(false, 1.0, time);
            babylonGroup.pause();
        }
        // Update preview time
        this.previewCurrentTime = time;
        // Emit scrub event
        this.emitEvent({
            type: 'scrubbed',
            groupId,
            timestamp: Date.now(),
            data: { time }
        });
        return true;
    }
    /**
     * Update keyframe in real-time
     */
    updateKeyframeRealtime(trackId, keyframeIndex, keyframeData) {
        const track = this.animationTracks.get(trackId);
        if (!track || keyframeIndex < 0 || keyframeIndex >= track.keyframes.length)
            return false;
        const keyframe = track.keyframes[keyframeIndex];
        // Update keyframe properties
        if (keyframeData.position)
            keyframe.position = keyframeData.position;
        if (keyframeData.rotation)
            keyframe.rotation = keyframeData.rotation;
        if (keyframeData.scaling)
            keyframe.scaling = keyframeData.scaling;
        if (keyframeData.opacity !== undefined)
            keyframe.opacity = keyframeData.opacity;
        if (keyframeData.time !== undefined)
            keyframe.time = keyframeData.time;
        // Re-sort keyframes if time changed
        if (keyframeData.time !== undefined) {
            track.keyframes.sort((a, b) => a.time - b.time);
        }
        // Emit real-time keyframe update event
        this.emitEnhancedEvent({
            type: 'keyframe_updated',
            animationId: trackId,
            timestamp: Date.now(),
            data: { keyframeIndex, keyframeData }
        });
        return true;
    }
    /**
     * Get real-time preview state
     */
    getRealtimePreviewState() {
        return {
            isEnabled: this.isPreviewMode,
            currentTime: this.previewCurrentTime,
            groupId: this.previewAnimationGroup ? this.previewAnimationGroup.name : undefined
        };
    }
    /**
     * Set real-time preview time
     */
    setRealtimePreviewTime(time) {
        this.previewCurrentTime = Math.max(0, time);
    }
    /**
     * Initialize default easing functions
     */
    initializeEasingFunctions() {
        // Linear easing (no easing function needed)
        // Ease in/out functions
        const easeInOutQuad = new BABYLON.QuadraticEase();
        easeInOutQuad.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        this.easingFunctions.set('easeInOutQuad', easeInOutQuad);
        const easeInOutCubic = new BABYLON.CubicEase();
        easeInOutCubic.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        this.easingFunctions.set('easeInOutCubic', easeInOutCubic);
        // Bounce easing
        const bounceEase = new BABYLON.BounceEase();
        bounceEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        this.easingFunctions.set('bounce', bounceEase);
        // Elastic easing
        const elasticEase = new BABYLON.ElasticEase();
        elasticEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        this.easingFunctions.set('elastic', elasticEase);
        // Sine easing
        const sineEase = new BABYLON.SineEase();
        sineEase.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        this.easingFunctions.set('sine', sineEase);
    }
    /**
     * Initialize default animation presets
     */
    initializeDefaultPresets() {
        // Spin preset
        this.animationPresets.set('spin', {
            name: 'Spin',
            type: 'rotation',
            duration: 60,
            loop: true,
            properties: {
                axis: 'y',
                amplitude: Math.PI * 2
            }
        });
        // Pulse preset
        this.animationPresets.set('pulse', {
            name: 'Pulse',
            type: 'scaling',
            duration: 30,
            loop: true,
            properties: {
                amplitude: 0.2
            }
        });
        // Shake preset
        this.animationPresets.set('shake', {
            name: 'Shake',
            type: 'translation',
            duration: 20,
            loop: true,
            properties: {
                axis: 'x',
                amplitude: 0.1,
                frequency: 10
            }
        });
        // Float preset
        this.animationPresets.set('float', {
            name: 'Float',
            type: 'translation',
            duration: 120,
            loop: true,
            properties: {
                axis: 'y',
                amplitude: 0.5
            }
        });
        // Glow preset
        this.animationPresets.set('glow', {
            name: 'Glow',
            type: 'opacity',
            duration: 60,
            loop: true,
            properties: {
                amplitude: 0.5
            }
        });
        // Bounce preset
        this.animationPresets.set('bounce', {
            name: 'Bounce',
            type: 'translation',
            duration: 45,
            loop: true,
            easingFunction: this.easingFunctions.get('bounce'),
            properties: {
                axis: 'y',
                amplitude: 1.0
            }
        });
        // Wobble preset
        this.animationPresets.set('wobble', {
            name: 'Wobble',
            type: 'rotation',
            duration: 40,
            loop: true,
            easingFunction: this.easingFunctions.get('elastic'),
            properties: {
                axis: 'z',
                amplitude: Math.PI * 0.1
            }
        });
        // Fade In preset
        this.animationPresets.set('fadein', {
            name: 'Fade In',
            type: 'opacity',
            duration: 30,
            loop: false,
            properties: {
                startValue: 0.0,
                endValue: 1.0
            }
        });
        // Fade Out preset
        this.animationPresets.set('fadeout', {
            name: 'Fade Out',
            type: 'opacity',
            duration: 30,
            loop: false,
            properties: {
                startValue: 1.0,
                endValue: 0.0
            }
        });
        // Scale In preset
        this.animationPresets.set('scalein', {
            name: 'Scale In',
            type: 'scaling',
            duration: 25,
            loop: false,
            easingFunction: this.easingFunctions.get('easeInOutQuad'),
            properties: {
                startScale: new BABYLON.Vector3(0, 0, 0),
                endScale: new BABYLON.Vector3(1, 1, 1)
            }
        });
        // Scale Out preset
        this.animationPresets.set('scaleout', {
            name: 'Scale Out',
            type: 'scaling',
            duration: 25,
            loop: false,
            easingFunction: this.easingFunctions.get('easeInOutQuad'),
            properties: {
                startScale: new BABYLON.Vector3(1, 1, 1),
                endScale: new BABYLON.Vector3(0, 0, 0)
            }
        });
        // Slide In Left preset
        this.animationPresets.set('slideinleft', {
            name: 'Slide In Left',
            type: 'translation',
            duration: 30,
            loop: false,
            easingFunction: this.easingFunctions.get('easeInOutQuad'),
            properties: {
                axis: 'x',
                startValue: -2.0,
                endValue: 0.0
            }
        });
        // Slide In Right preset
        this.animationPresets.set('slideinright', {
            name: 'Slide In Right',
            type: 'translation',
            duration: 30,
            loop: false,
            easingFunction: this.easingFunctions.get('easeInOutQuad'),
            properties: {
                axis: 'x',
                startValue: 2.0,
                endValue: 0.0
            }
        });
        // Slide In Up preset
        this.animationPresets.set('slideinup', {
            name: 'Slide In Up',
            type: 'translation',
            duration: 30,
            loop: false,
            easingFunction: this.easingFunctions.get('easeInOutQuad'),
            properties: {
                axis: 'y',
                startValue: -2.0,
                endValue: 0.0
            }
        });
        // Slide In Down preset
        this.animationPresets.set('slideindown', {
            name: 'Slide In Down',
            type: 'translation',
            duration: 30,
            loop: false,
            easingFunction: this.easingFunctions.get('easeInOutQuad'),
            properties: {
                axis: 'y',
                startValue: 2.0,
                endValue: 0.0
            }
        });
        // Heartbeat preset
        this.animationPresets.set('heartbeat', {
            name: 'Heartbeat',
            type: 'scaling',
            duration: 60,
            loop: true,
            properties: {
                amplitude: 0.15,
                frequency: 2
            }
        });
        // Breathing preset
        this.animationPresets.set('breathing', {
            name: 'Breathing',
            type: 'scaling',
            duration: 120,
            loop: true,
            easingFunction: this.easingFunctions.get('sine'),
            properties: {
                amplitude: 0.1
            }
        });
        // Jiggle preset
        this.animationPresets.set('jiggle', {
            name: 'Jiggle',
            type: 'rotation',
            duration: 15,
            loop: true,
            properties: {
                axis: 'z',
                amplitude: Math.PI * 0.05,
                frequency: 20
            }
        });
        // Color Cycle preset
        this.animationPresets.set('colorcycle', {
            name: 'Color Cycle',
            type: 'color',
            duration: 180,
            loop: true,
            properties: {
                colorStart: new BABYLON.Color3(1, 0, 0), // Red
                colorMid: new BABYLON.Color3(0, 1, 0), // Green
                colorEnd: new BABYLON.Color3(0, 0, 1) // Blue
            }
        });
        // Rainbow Glow preset
        this.animationPresets.set('rainbowglow', {
            name: 'Rainbow Glow',
            type: 'color',
            duration: 120,
            loop: true,
            properties: {
                colorStart: new BABYLON.Color3(1, 0, 0),
                colorEnd: new BABYLON.Color3(0, 1, 1)
            }
        });
    }
    /**
     * Create animation from preset with pooling optimization
     */
    createAnimationFromPreset(presetName, targetMesh, options) {
        const preset = this.animationPresets.get(presetName);
        if (!preset) {
            console.warn(`Animation preset '${SecurityUtils.sanitizeForLog(presetName)}' not found`);
            return null;
        }
        const duration = options?.duration || preset.duration;
        const speedRatio = options?.speedRatio || 1.0;
        const loop = options?.loop ?? preset.loop ?? false;
        const animationGroup = new BABYLON.AnimationGroup(`${preset.name}_${targetMesh.name}`, this.scene);
        // Use pooling system for animation creation
        let animation;
        const animationProperties = { duration, ...preset.properties };
        try {
            animation = this.getAnimationFromPool(preset.type, animationProperties);
        }
        catch (error) {
            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            else if (typeof error === 'string') {
                errorMessage = error;
            }
            console.warn(`Failed to get animation from pool, creating new: ${SecurityUtils.sanitizeForLog(errorMessage)}`);
            // Fallback to direct creation
            switch (preset.type) {
                case 'rotation':
                    animation = this.createRotationAnimation(preset, duration);
                    break;
                case 'scaling':
                    animation = this.createScalingAnimation(preset, duration);
                    break;
                case 'translation':
                    animation = this.createTranslationAnimation(preset, duration);
                    break;
                case 'opacity':
                    animation = this.createOpacityAnimation(preset, duration);
                    break;
                case 'color':
                    animation = this.createColorAnimation(preset, duration);
                    break;
                default:
                    console.warn(`Unsupported animation type: ${SecurityUtils.sanitizeForLog(preset.type)}`);
                    return null;
            }
        }
        if (preset.easingFunction) {
            animation.setEasingFunction(preset.easingFunction);
        }
        animationGroup.addTargetedAnimation(animation, targetMesh);
        animationGroup.speedRatio = speedRatio;
        animationGroup.loopAnimation = loop;
        return animationGroup;
    }
    /**
     * Create rotation animation
     */
    createRotationAnimation(preset, duration) {
        const axis = preset.properties?.axis || 'y';
        const amplitude = preset.properties?.amplitude || Math.PI * 2;
        const animation = new BABYLON.Animation(`rotation_${axis}`, `rotation.${axis}`, 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const keys = [
            { frame: 0, value: 0 },
            { frame: duration, value: amplitude }
        ];
        animation.setKeys(keys);
        return animation;
    }
    /**
     * Create scaling animation
     */
    createScalingAnimation(preset, duration) {
        const amplitude = preset.properties?.amplitude || 0.2;
        const animation = new BABYLON.Animation('scaling', 'scaling', 60, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const keys = [
            { frame: 0, value: new BABYLON.Vector3(1, 1, 1) },
            { frame: duration / 2, value: new BABYLON.Vector3(1 + amplitude, 1 + amplitude, 1 + amplitude) },
            { frame: duration, value: new BABYLON.Vector3(1, 1, 1) }
        ];
        animation.setKeys(keys);
        return animation;
    }
    /**
     * Create translation animation
     */
    createTranslationAnimation(preset, duration) {
        const axis = preset.properties?.axis || 'y';
        const amplitude = preset.properties?.amplitude || 0.5;
        const animation = new BABYLON.Animation(`translation_${axis}`, `position.${axis}`, 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const keys = [
            { frame: 0, value: 0 },
            { frame: duration / 2, value: amplitude },
            { frame: duration, value: 0 }
        ];
        animation.setKeys(keys);
        return animation;
    }
    /**
     * Create opacity animation
     */
    createOpacityAnimation(preset, duration) {
        const amplitude = preset.properties?.amplitude || 0.5;
        const animation = new BABYLON.Animation('opacity', 'visibility', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const keys = [
            { frame: 0, value: 1.0 },
            { frame: duration / 2, value: 1.0 - amplitude },
            { frame: duration, value: 1.0 }
        ];
        animation.setKeys(keys);
        return animation;
    }
    /**
     * Create color animation
     */
    createColorAnimation(preset, duration) {
        const colorStart = preset.properties?.colorStart || new BABYLON.Color3(1, 1, 1);
        const colorEnd = preset.properties?.colorEnd || new BABYLON.Color3(0.5, 0.5, 0.5);
        const animation = new BABYLON.Animation('color', 'material.emissiveColor', 60, BABYLON.Animation.ANIMATIONTYPE_COLOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const keys = [
            { frame: 0, value: colorStart },
            { frame: duration / 2, value: colorEnd },
            { frame: duration, value: colorStart }
        ];
        animation.setKeys(keys);
        return animation;
    }
    /**
     * Register custom animation preset
     */
    registerAnimationPreset(preset) {
        this.animationPresets.set(preset.name.toLowerCase(), preset);
    }
    /**
     * Get available animation presets
     */
    getAnimationPresets() {
        return Array.from(this.animationPresets.values());
    }
    /**
     * Create and register animation sequence
     */
    createAnimationSequence(sequence) {
        this.animationSequences.set(sequence.id, sequence);
    }
    /**
     * Play animation sequence
     */
    playAnimationSequence(sequenceId) {
        const sequence = this.animationSequences.get(sequenceId);
        if (!sequence) {
            console.warn(`Animation sequence '${SecurityUtils.sanitizeForLog(sequenceId)}' not found`);
            return false;
        }
        sequence.isPlaying = true;
        sequence.currentStepIndex = 0;
        sequence.loop = sequence.loop ?? false;
        this.activeSequences.add(sequenceId);
        this.playSequenceStep(sequence);
        return true;
    }
    /**
     * Stop animation sequence
     */
    stopAnimationSequence(sequenceId) {
        const sequence = this.animationSequences.get(sequenceId);
        if (!sequence)
            return false;
        sequence.isPlaying = false;
        this.activeSequences.delete(sequenceId);
        // Stop current step if playing
        if (sequence.currentStepIndex < sequence.steps.length) {
            const currentStep = sequence.steps[sequence.currentStepIndex];
            this.stopAnimation(currentStep.animationGroupId);
        }
        return true;
    }
    /**
     * Update animation sequences
     */
    updateSequences() {
        this.activeSequences.forEach(sequenceId => {
            const sequence = this.animationSequences.get(sequenceId);
            if (!sequence || sequence.currentStepIndex === undefined)
                return;
            const currentStepIndex = sequence.currentStepIndex;
            const currentStep = sequence.steps[currentStepIndex];
            if (!currentStep) {
                // Sequence completed
                if (sequence.loop) {
                    sequence.currentStepIndex = 0;
                    this.playSequenceStep(sequence);
                }
                else {
                    sequence.isPlaying = false;
                    this.activeSequences.delete(sequenceId);
                }
                return;
            }
            // Check if current step is completed
            const groupState = this.getAnimationState(currentStep.animationGroupId);
            if (groupState && !groupState.isPlaying) {
                // Move to next step
                sequence.currentStepIndex = currentStepIndex + 1;
                if (sequence.currentStepIndex < sequence.steps.length) {
                    this.playSequenceStep(sequence);
                }
            }
        });
    }
    /**
     * Play current step of sequence
     */
    playSequenceStep(sequence) {
        if (sequence.currentStepIndex === undefined)
            return;
        const step = sequence.steps[sequence.currentStepIndex];
        if (!step)
            return;
        // Check condition if provided
        if (step.condition && !step.condition()) {
            // Skip this step
            sequence.currentStepIndex++;
            if (sequence.currentStepIndex < sequence.steps.length) {
                this.playSequenceStep(sequence);
            }
            return;
        }
        // Execute onStart callback
        if (step.onStart) {
            step.onStart();
        }
        // Play the animation with delay if specified
        if (step.delay && step.delay > 0) {
            setTimeout(() => {
                this.playAnimation(step.animationGroupId);
            }, step.delay);
        }
        else {
            this.playAnimation(step.animationGroupId);
        }
    }
    /**
     * Blend between two animations
     */
    blendAnimations(fromGroupId, toGroupId, blendDuration = 30) {
        const fromGroup = this.animationGroups.get(fromGroupId);
        const toGroup = this.animationGroups.get(toGroupId);
        if (!fromGroup || !toGroup)
            return false;
        // Create blend animation
        const blendAnimation = new BABYLON.Animation('blend', 'weight', 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        const keys = [
            { frame: 0, value: fromGroup.weight },
            { frame: blendDuration, value: toGroup.weight }
        ];
        blendAnimation.setKeys(keys);
        // Note: This is a simplified blend implementation
        // In a full implementation, you'd need to handle weight blending properly
        console.log(`Blending from ${SecurityUtils.sanitizeForLog(fromGroupId)} to ${SecurityUtils.sanitizeForLog(toGroupId)} over ${blendDuration} frames`);
        return true;
    }
    /**
     * Get animation sequences
     */
    getAnimationSequences() {
        return Array.from(this.animationSequences.values());
    }
    /**
     * Get animation from pool or create new one
     */
    getAnimationFromPool(type, properties) {
        const poolKey = `${type}_${JSON.stringify(properties)}`;
        let animation;
        // Check pool first
        const pool = this.animationPool.get(poolKey);
        if (pool && pool.length > 0) {
            animation = pool.pop();
            this.poolHitCount++;
        }
        else {
            this.poolMissCount++;
            // Create new animation based on type
            animation = this.createAnimationByType(type, properties);
        }
        // Update cache
        if (animation) {
            this.updateAnimationCache(poolKey, animation);
        }
        return animation;
    }
    /**
     * Return animation to pool for reuse
     */
    returnAnimationToPool(animation, type, properties) {
        const poolKey = `${type}_${JSON.stringify(properties)}`;
        let pool = this.animationPool.get(poolKey);
        if (!pool) {
            pool = [];
            this.animationPool.set(poolKey, pool);
        }
        // Only keep up to maxPoolSize animations per type
        if (pool.length < this.maxPoolSize) {
            // Reset animation to initial state - animations don't have stop() method
            // They are managed through AnimationGroups
            pool.push(animation);
        }
        else {
            // Dispose excess animations - animations don't have dispose() method
            // They are disposed when their AnimationGroup is disposed
        }
    }
    /**
     * Update LRU animation cache
     */
    updateAnimationCache(key, animation) {
        const now = Date.now();
        if (this.animationCache.has(key)) {
            const cached = this.animationCache.get(key);
            cached.lastUsed = now;
            cached.useCount++;
        }
        else {
            // Check if cache is full
            if (this.animationCache.size >= this.maxCacheSize) {
                // Remove least recently used
                let oldestKey = '';
                let oldestTime = now;
                this.animationCache.forEach((cacheValue, cacheKey) => {
                    if (cacheValue.lastUsed < oldestTime) {
                        oldestTime = cacheValue.lastUsed;
                        oldestKey = cacheKey;
                    }
                });
                if (oldestKey) {
                    this.animationCache.delete(oldestKey);
                }
            }
            // Estimate animation size (rough approximation)
            const estimatedSize = this.estimateAnimationSize(animation);
            this.animationCache.set(key, {
                animation,
                lastUsed: now,
                useCount: 1,
                size: estimatedSize
            });
        }
    }
    /**
     * Estimate animation memory size
     */
    estimateAnimationSize(animation) {
        // Rough estimation based on animation properties
        let size = 100; // Base size
        // Add size based on keys
        if (animation.getKeys()) {
            size += animation.getKeys().length * 20; // ~20 bytes per key
        }
        // Add size based on animation type
        switch (animation.dataType) {
            case BABYLON.Animation.ANIMATIONTYPE_FLOAT:
                size += 4;
                break;
            case BABYLON.Animation.ANIMATIONTYPE_VECTOR2:
                size += 8;
                break;
            case BABYLON.Animation.ANIMATIONTYPE_VECTOR3:
                size += 12;
                break;
            case BABYLON.Animation.ANIMATIONTYPE_COLOR3:
                size += 12;
                break;
            default:
                size += 16;
        }
        return size;
    }
    /**
     * Create animation by type
     */
    createAnimationByType(type, properties) {
        switch (type) {
            case 'rotation':
                return this.createRotationAnimation({ properties }, properties.duration || 60);
            case 'scaling':
                return this.createScalingAnimation({ properties }, properties.duration || 60);
            case 'translation':
                return this.createTranslationAnimation({ properties }, properties.duration || 60);
            case 'opacity':
                return this.createOpacityAnimation({ properties }, properties.duration || 60);
            case 'color':
                return this.createColorAnimation({ properties }, properties.duration || 60);
            default:
                throw new Error(`Unsupported animation type: ${type}`);
        }
    }
    /**
     * Get pooling statistics
     */
    getPoolingStatistics() {
        const totalRequests = this.poolHitCount + this.poolMissCount;
        const hitRate = totalRequests > 0 ? (this.poolHitCount / totalRequests) * 100 : 0;
        return {
            poolHitCount: this.poolHitCount,
            poolMissCount: this.poolMissCount,
            poolHitRate: hitRate,
            totalPools: this.animationPool.size,
            cacheSize: this.animationCache.size,
            maxCacheSize: this.maxCacheSize
        };
    }
    /**
     * Clear animation pools and cache
     */
    clearPools() {
        // Clear pools - animations don't have dispose() method
        // They are disposed when their AnimationGroup is disposed
        this.animationPool.clear();
        this.animationCache.clear();
        this.poolHitCount = 0;
        this.poolMissCount = 0;
    }
    /**
     * Update pool management - called every frame
     */
    updatePoolManagement() {
        const now = Date.now();
        // Periodic pool cleanup
        if (now - this.lastPoolCleanup > this.poolCleanupInterval) {
            this.performPoolCleanup();
            this.lastPoolCleanup = now;
        }
        // Update usage statistics
        this.updatePoolUsageStats();
        // Adaptive pool sizing
        if (this.adaptivePoolSizing) {
            this.adjustPoolSize();
        }
        // Update performance metrics
        this.updatePerformanceMetrics();
    }
    /**
     * Perform periodic pool cleanup
     */
    performPoolCleanup() {
        const now = Date.now();
        let cleanedCount = 0;
        // Clean up unused animations from cache
        for (const [key, cacheEntry] of this.animationCache.entries()) {
            if (now - cacheEntry.lastUsed > this.unusedThreshold) {
                this.animationCache.delete(key);
                cleanedCount++;
            }
        }
        // Clean up pools based on usage patterns
        for (const [poolKey, pool] of this.animationPool.entries()) {
            const usageStats = this.poolUsageStats.get(poolKey);
            if (usageStats && now - usageStats.lastUsed > this.unusedThreshold * 2) {
                // Reduce pool size for rarely used animations
                const targetSize = Math.max(1, Math.floor(pool.length * 0.5));
                if (pool.length > targetSize) {
                    pool.splice(targetSize);
                    cleanedCount += pool.length - targetSize;
                }
            }
        }
        if (cleanedCount > 0) {
            console.log(`Pool cleanup: removed ${cleanedCount} unused animations`);
        }
    }
    /**
     * Update pool usage statistics
     */
    updatePoolUsageStats() {
        const now = Date.now();
        // Update usage stats for active pools
        for (const poolKey of this.animationPool.keys()) {
            if (!this.poolUsageStats.has(poolKey)) {
                this.poolUsageStats.set(poolKey, { hits: 0, misses: 0, lastUsed: now });
            }
        }
        // Clean up stats for removed pools
        for (const [poolKey, stats] of this.poolUsageStats.entries()) {
            if (!this.animationPool.has(poolKey) && now - stats.lastUsed > this.unusedThreshold) {
                this.poolUsageStats.delete(poolKey);
            }
        }
    }
    /**
     * Adjust pool size based on usage patterns
     */
    adjustPoolSize() {
        const totalRequests = this.poolHitCount + this.poolMissCount;
        if (totalRequests < 10)
            return; // Not enough data
        const hitRate = this.poolHitCount / totalRequests;
        // If hit rate is low, increase pool sizes
        if (hitRate < 0.5) {
            this.maxPoolSize = Math.min(this.maxPoolSize + 10, 200);
        }
        // If hit rate is high, we can potentially reduce sizes
        else if (hitRate > 0.8) {
            this.maxPoolSize = Math.max(this.maxPoolSize - 5, 50);
        }
    }
    /**
     * Update performance metrics
     */
    updatePerformanceMetrics() {
        const now = Date.now();
        if (now - this.lastPerformanceUpdate > this.performanceUpdateInterval) {
            const totalRequests = this.poolHitCount + this.poolMissCount;
            const hitRate = totalRequests > 0 ? (this.poolHitCount / totalRequests) * 100 : 0;
            this.performanceMetrics = {
                totalAnimations: this.animationGroups.size,
                activeAnimations: this.activeAnimations.size,
                averageFrameTime: 0, // Would need frame timing data
                memoryUsage: this.currentMemoryUsage,
                lastUpdateTime: now,
                poolHitRate: hitRate,
                poolSize: this.animationPool.size
            };
            this.lastPerformanceUpdate = now;
        }
    }
    /**
     * Dispose resources
     */
    dispose() {
        this.stopAllAnimations();
        // Clear pools and cache
        this.clearPools();
        this.animationGroups.forEach((group, groupId) => {
            const babylonGroup = group.babylonGroup;
            if (babylonGroup) {
                babylonGroup.dispose();
            }
        });
        this.animationGroups.clear();
        this.activeAnimations.clear();
        this.eventCallbacks = [];
        // Clear physics animations
        this.physicsAnimations.clear();
        this.activePhysicsAnimations.clear();
        this.animationTracks.clear();
        this.keyframeCallbacks.clear();
        this.animationBlends.clear();
        this.activeBlends.clear();
        this.enhancedEventCallbacks = [];
    }
    // ===== PHYSICS-BASED ANIMATIONS =====
    /**
     * Create physics-based animation
     */
    createPhysicsAnimation(config) {
        const id = `physics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // Validate configuration
        if (!config.targetMesh) {
            throw new Error('Physics animation requires a target mesh');
        }
        // Initialize physics properties
        const physicsConfig = {
            id,
            targetMesh: config.targetMesh,
            type: config.type || 'spring',
            properties: {
                mass: config.properties?.mass || 1.0,
                damping: config.properties?.damping || 0.95,
                stiffness: config.properties?.stiffness || 0.1,
                velocity: config.properties?.velocity || new BABYLON.Vector3(0, 0, 0),
                acceleration: config.properties?.acceleration || new BABYLON.Vector3(0, 0, 0),
                ...config.properties
            },
            duration: config.duration || 1000,
            loop: config.loop || false,
            easing: config.easing || 'linear',
            onComplete: config.onComplete,
            onUpdate: config.onUpdate
        };
        this.physicsAnimations.set(id, physicsConfig);
        return id;
    }
    /**
     * Play physics animation
     */
    playPhysicsAnimation(id) {
        const config = this.physicsAnimations.get(id);
        if (!config) {
            console.warn(`Physics animation '${SecurityUtils.sanitizeForLog(id)}' not found`);
            return false;
        }
        // Initialize physics state
        config.startTime = Date.now();
        config.isPlaying = true;
        config.currentPosition = config.targetMesh.position.clone();
        config.currentVelocity = config.properties.velocity?.clone() || new BABYLON.Vector3(0, 0, 0);
        config.currentAcceleration = config.properties.acceleration?.clone() || new BABYLON.Vector3(0, 0, 0);
        this.activePhysicsAnimations.add(id);
        // Emit enhanced event
        this.emitEnhancedEvent({
            type: 'physics_started',
            animationId: id,
            timestamp: Date.now(),
            data: { config }
        });
        return true;
    }
    /**
     * Stop physics animation
     */
    stopPhysicsAnimation(id) {
        const config = this.physicsAnimations.get(id);
        if (!config)
            return false;
        config.isPlaying = false;
        this.activePhysicsAnimations.delete(id);
        // Emit enhanced event
        this.emitEnhancedEvent({
            type: 'physics_stopped',
            animationId: id,
            timestamp: Date.now(),
            data: { config }
        });
        return true;
    }
    /**
     * Update physics animations
     */
    updatePhysicsAnimations() {
        const now = Date.now();
        const deltaTime = Math.min((now - this.lastPhysicsUpdate) / 1000, 0.016); // Cap at ~60fps
        if (deltaTime <= 0)
            return;
        this.activePhysicsAnimations.forEach(id => {
            const config = this.physicsAnimations.get(id);
            if (!config || !config.isPlaying)
                return;
            const elapsed = now - (config.startTime || 0);
            const progress = Math.min(elapsed / (config.duration || 1000), 1.0);
            // Update physics simulation
            this.updatePhysicsSimulation(config, deltaTime);
            // Check completion
            if (progress >= 1.0 && !config.loop) {
                this.completePhysicsAnimation(id);
            }
            else if (config.loop && progress >= 1.0) {
                // Reset for looping
                config.startTime = now;
                if (config.targetMesh) {
                    config.currentPosition = config.targetMesh.position.clone();
                }
            }
            // Call update callback
            if (config.onUpdate) {
                config.onUpdate(config, progress);
            }
        });
        this.lastPhysicsUpdate = now;
    }
    /**
     * Update physics simulation
     */
    updatePhysicsSimulation(config, deltaTime) {
        const { properties, targetMesh } = config;
        if (!targetMesh)
            return;
        // Ensure physics properties are initialized
        if (!config.currentVelocity)
            config.currentVelocity = new BABYLON.Vector3(0, 0, 0);
        if (!config.currentAcceleration)
            config.currentAcceleration = new BABYLON.Vector3(0, 0, 0);
        if (!config.currentPosition)
            config.currentPosition = targetMesh.position.clone();
        switch (config.type) {
            case 'spring':
                this.updateSpringPhysics(config, deltaTime);
                break;
            case 'bounce':
                this.updateBouncePhysics(config, deltaTime);
                break;
            case 'gravity':
                this.updateGravityPhysics(config, deltaTime);
                break;
            case 'pendulum':
                this.updatePendulumPhysics(config, deltaTime);
                break;
            default:
                // Basic kinematic motion
                config.currentVelocity.addInPlace(config.currentAcceleration.scale(deltaTime));
                config.currentPosition.addInPlace(config.currentVelocity.scale(deltaTime));
                break;
        }
        // Apply damping
        const damping = properties?.damping ?? 0.95;
        config.currentVelocity.scaleInPlace(damping);
        // Update mesh position
        targetMesh.position.copyFrom(config.currentPosition);
    }
    /**
     * Update spring physics
     */
    updateSpringPhysics(config, deltaTime) {
        const { properties, targetMesh } = config;
        if (!targetMesh || !config.currentPosition || !config.currentVelocity || !config.currentAcceleration) {
            return;
        }
        const stiffness = properties?.stiffness ?? 0.1;
        const damping = properties?.damping ?? 0.95;
        const mass = properties?.mass ?? 1.0;
        const displacement = config.currentPosition.subtract(targetMesh.position);
        const springForce = displacement.scale(-stiffness);
        const dampingForce = config.currentVelocity.scale(-damping);
        config.currentAcceleration = springForce.add(dampingForce).scale(1 / mass);
        config.currentVelocity.addInPlace(config.currentAcceleration.scale(deltaTime));
        config.currentPosition.addInPlace(config.currentVelocity.scale(deltaTime));
    }
    /**
     * Update bounce physics
     */
    updateBouncePhysics(config, deltaTime) {
        const { properties, targetMesh } = config;
        if (!targetMesh || !config.currentPosition || !config.currentVelocity || !config.currentAcceleration) {
            return;
        }
        const damping = properties?.damping ?? 0.95;
        config.currentVelocity.addInPlace(config.currentAcceleration.scale(deltaTime));
        config.currentPosition.addInPlace(config.currentVelocity.scale(deltaTime));
        // Bounce off boundaries
        if (config.currentPosition.y <= 0) {
            config.currentPosition.y = 0;
            config.currentVelocity.y = -config.currentVelocity.y * damping;
        }
    }
    /**
     * Update gravity physics
     */
    updateGravityPhysics(config, deltaTime) {
        const { properties } = config;
        if (!config.currentPosition || !config.currentVelocity || !config.currentAcceleration) {
            return;
        }
        const mass = properties?.mass ?? 1.0;
        // Apply gravity
        config.currentAcceleration.y = -9.81 * mass;
        config.currentVelocity.addInPlace(config.currentAcceleration.scale(deltaTime));
        config.currentPosition.addInPlace(config.currentVelocity.scale(deltaTime));
    }
    /**
     * Update pendulum physics
     */
    updatePendulumPhysics(config, deltaTime) {
        const { properties, targetMesh } = config;
        if (!config.currentPosition || !config.currentVelocity) {
            return;
        }
        const mass = properties?.mass ?? 1.0;
        // Simple pendulum simulation
        const angle = Math.atan2(config.currentPosition.x, config.currentPosition.y);
        const angularAcceleration = -(9.81 / mass) * Math.sin(angle);
        const angularVelocity = config.currentVelocity.x; // Store angular velocity in x component
        const newAngularVelocity = angularVelocity + angularAcceleration * deltaTime;
        const newAngle = angle + newAngularVelocity * deltaTime;
        config.currentPosition.x = Math.sin(newAngle) * mass;
        config.currentPosition.y = Math.cos(newAngle) * mass;
        config.currentVelocity.x = newAngularVelocity;
    }
    /**
     * Complete physics animation
     */
    completePhysicsAnimation(id) {
        const config = this.physicsAnimations.get(id);
        if (!config)
            return;
        config.isPlaying = false;
        this.activePhysicsAnimations.delete(id);
        // Call completion callback
        if (config.onComplete) {
            config.onComplete(config);
        }
        // Emit enhanced event
        this.emitEnhancedEvent({
            type: 'physics_completed',
            animationId: id,
            timestamp: Date.now(),
            data: { config }
        });
    }
    // ===== KEYFRAME MANAGEMENT =====
    /**
     * Create animation track with keyframes
     */
    createAnimationTrack(track) {
        const id = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const enhancedTrack = {
            id,
            name: track.name,
            targetMesh: track.targetMesh,
            keyframes: track.keyframes.sort((a, b) => a.time - b.time),
            duration: track.duration || 1000,
            loop: track.loop || false,
            easing: track.easing || 'linear',
            targetProperty: track.targetProperty || 'position'
        };
        this.animationTracks.set(id, enhancedTrack);
        return id;
    }
    /**
     * Play animation track
     */
    playAnimationTrack(trackId) {
        const track = this.animationTracks.get(trackId);
        if (!track) {
            console.warn(`Animation track '${SecurityUtils.sanitizeForLog(trackId)}' not found`);
            return false;
        }
        track.isPlaying = true;
        track.currentTime = 0;
        track.startTime = Date.now();
        // Emit enhanced event
        this.emitEnhancedEvent({
            type: 'track_started',
            animationId: trackId,
            timestamp: Date.now(),
            data: { track }
        });
        return true;
    }
    /**
     * Stop animation track
     */
    stopAnimationTrack(trackId) {
        const track = this.animationTracks.get(trackId);
        if (!track)
            return false;
        track.isPlaying = false;
        // Emit enhanced event
        this.emitEnhancedEvent({
            type: 'track_stopped',
            animationId: trackId,
            timestamp: Date.now(),
            data: { track }
        });
        return true;
    }
    /**
     * Add keyframe to track
     */
    addKeyframe(trackId, keyframe) {
        const track = this.animationTracks.get(trackId);
        if (!track)
            return false;
        track.keyframes.push(keyframe);
        track.keyframes.sort((a, b) => a.time - b.time);
        return true;
    }
    /**
     * Remove keyframe from track
     */
    removeKeyframe(trackId, keyframeIndex) {
        const track = this.animationTracks.get(trackId);
        if (!track || keyframeIndex < 0 || keyframeIndex >= track.keyframes.length)
            return false;
        track.keyframes.splice(keyframeIndex, 1);
        return true;
    }
    /**
     * Register keyframe callback
     */
    onKeyframe(trackId, callback) {
        if (!this.keyframeCallbacks.has(trackId)) {
            this.keyframeCallbacks.set(trackId, []);
        }
        this.keyframeCallbacks.get(trackId).push(callback);
    }
    /**
     * Update animation tracks
     */
    updateAnimationTracks() {
        const now = Date.now();
        this.animationTracks.forEach((track, trackId) => {
            if (!track.isPlaying)
                return;
            const elapsed = now - (track.startTime || 0);
            const progress = elapsed / track.duration;
            if (progress >= 1.0) {
                if (track.loop) {
                    track.startTime = now;
                    track.currentTime = 0;
                }
                else {
                    this.completeAnimationTrack(trackId);
                    return;
                }
            }
            track.currentTime = elapsed || 0;
            // Interpolate keyframes
            this.interpolateKeyframes(track, progress);
            // Check for keyframe triggers
            this.checkKeyframeTriggers(track, trackId);
        });
    }
    /**
     * Interpolate between keyframes
     */
    interpolateKeyframes(track, progress) {
        const { keyframes, targetMesh } = track;
        if (keyframes.length === 0)
            return;
        const currentTime = progress * (track.duration || 1000);
        // Find surrounding keyframes
        let prevKeyframe = null;
        let nextKeyframe = null;
        for (let i = 0; i < keyframes.length; i++) {
            if (keyframes[i].time <= currentTime) {
                prevKeyframe = keyframes[i];
            }
            else {
                nextKeyframe = keyframes[i];
                break;
            }
        }
        if (!prevKeyframe) {
            // Before first keyframe
            this.applyKeyframeData(targetMesh, keyframes[0]);
        }
        else if (!nextKeyframe) {
            // After last keyframe
            this.applyKeyframeData(targetMesh, prevKeyframe);
        }
        else {
            // Interpolate between keyframes
            const t = (currentTime - prevKeyframe.time) / (nextKeyframe.time - prevKeyframe.time);
            this.interpolateKeyframeData(targetMesh, prevKeyframe, nextKeyframe, t);
        }
    }
    /**
     * Apply keyframe data to mesh
     */
    applyKeyframeData(mesh, keyframe) {
        if (!mesh)
            return;
        if (keyframe.position)
            mesh.position.copyFrom(keyframe.position);
        if (keyframe.rotation)
            mesh.rotation.copyFrom(keyframe.rotation);
        if (keyframe.scaling)
            mesh.scaling.copyFrom(keyframe.scaling);
        if (keyframe.opacity !== undefined) {
            // Assuming mesh has material with alpha
            if (mesh.material) {
                mesh.material.alpha = keyframe.opacity;
            }
        }
    }
    /**
     * Interpolate between two keyframes
     */
    interpolateKeyframeData(mesh, from, to, t) {
        if (!mesh)
            return;
        if (from.position && to.position) {
            mesh.position = BABYLON.Vector3.Lerp(from.position, to.position, t);
        }
        if (from.rotation && to.rotation) {
            mesh.rotation = BABYLON.Vector3.Lerp(from.rotation, to.rotation, t);
        }
        if (from.scaling && to.scaling) {
            mesh.scaling = BABYLON.Vector3.Lerp(from.scaling, to.scaling, t);
        }
        if (from.opacity !== undefined && to.opacity !== undefined) {
            const opacity = from.opacity + (to.opacity - from.opacity) * t;
            if (mesh.material) {
                mesh.material.alpha = opacity;
            }
        }
    }
    /**
     * Check for keyframe triggers
     */
    checkKeyframeTriggers(track, trackId) {
        const callbacks = this.keyframeCallbacks.get(trackId);
        if (!callbacks)
            return;
        track.keyframes.forEach((keyframe, index) => {
            if (Math.abs((track.currentTime || 0) - keyframe.time) < 16) { // Within 16ms
                callbacks.forEach(callback => {
                    callback(trackId, index);
                });
            }
        });
    }
    /**
     * Complete animation track
     */
    completeAnimationTrack(trackId) {
        const track = this.animationTracks.get(trackId);
        if (!track)
            return;
        track.isPlaying = false;
        // Emit enhanced event
        this.emitEnhancedEvent({
            type: 'track_completed',
            animationId: trackId,
            timestamp: Date.now(),
            data: { track }
        });
    }
    // ===== ANIMATION BLENDING =====
    /**
     * Create animation blend
     */
    createAnimationBlend(config) {
        const id = `blend_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const blendConfig = {
            id,
            name: config.name || `Blend_${id}`,
            sourceAnimationId: config.sourceAnimationId || '',
            targetAnimationId: config.targetAnimationId || '',
            fromTrackId: config.fromTrackId,
            toTrackId: config.toTrackId,
            targetMesh: config.targetMesh,
            duration: config.duration || 500,
            blendDuration: config.blendDuration || 500,
            blendCurve: config.blendCurve || 'linear',
            blendWeight: config.blendWeight || 1.0,
            easing: config.easing || 'linear',
            onComplete: config.onComplete
        };
        this.animationBlends.set(id, blendConfig);
        return id;
    }
    /**
     * Play animation blend
     */
    playAnimationBlend(blendId) {
        const blend = this.animationBlends.get(blendId);
        if (!blend) {
            console.warn(`Animation blend '${SecurityUtils.sanitizeForLog(blendId)}' not found`);
            return false;
        }
        const fromTrack = this.animationTracks.get(blend.fromTrackId);
        const toTrack = this.animationTracks.get(blend.toTrackId);
        if (!fromTrack || !toTrack) {
            console.warn('Blend tracks not found');
            return false;
        }
        blend.isPlaying = true;
        blend.startTime = Date.now();
        blend.progress = 0;
        this.activeBlends.add(blendId);
        // Emit enhanced event
        this.emitEnhancedEvent({
            type: 'blend_started',
            animationId: blendId,
            timestamp: Date.now(),
            data: { blend }
        });
        return true;
    }
    /**
     * Update animation blends
     */
    updateAnimationBlends() {
        const now = Date.now();
        this.activeBlends.forEach(blendId => {
            const blend = this.animationBlends.get(blendId);
            if (!blend || !blend.isPlaying)
                return;
            const elapsed = now - (blend.startTime || 0);
            blend.progress = Math.min(elapsed / (blend.duration || 500), 1.0);
            if (blend.progress >= 1.0) {
                this.completeAnimationBlend(blendId);
                return;
            }
            // Perform blending
            this.performBlend(blend);
        });
    }
    /**
     * Perform blend operation
     */
    performBlend(blend) {
        const fromTrack = this.animationTracks.get(blend.fromTrackId);
        const toTrack = this.animationTracks.get(blend.toTrackId);
        if (!fromTrack || !toTrack || !blend.targetMesh)
            return;
        const t = blend.progress || 0;
        // Interpolate between track states
        this.interpolateTrackStates(blend.targetMesh, fromTrack, toTrack, t);
    }
    /**
     * Interpolate between track states
     */
    interpolateTrackStates(mesh, fromTrack, toTrack, t) {
        // Get current states of both tracks
        const fromState = this.getTrackCurrentState(fromTrack);
        const toState = this.getTrackCurrentState(toTrack);
        if (fromState.position && toState.position) {
            mesh.position = BABYLON.Vector3.Lerp(fromState.position, toState.position, t);
        }
        if (fromState.rotation && toState.rotation) {
            mesh.rotation = BABYLON.Vector3.Lerp(fromState.rotation, toState.rotation, t);
        }
        if (fromState.scaling && toState.scaling) {
            mesh.scaling = BABYLON.Vector3.Lerp(fromState.scaling, toState.scaling, t);
        }
    }
    /**
     * Get current state of animation track
     */
    getTrackCurrentState(track) {
        const state = {};
        if (track.keyframes.length > 0) {
            const firstKeyframe = track.keyframes[0];
            if (firstKeyframe.position)
                state.position = firstKeyframe.position.clone();
            if (firstKeyframe.rotation)
                state.rotation = firstKeyframe.rotation.clone();
            if (firstKeyframe.scaling)
                state.scaling = firstKeyframe.scaling.clone();
            if (firstKeyframe.opacity !== undefined)
                state.opacity = firstKeyframe.opacity;
        }
        return state;
    }
    /**
     * Complete animation blend
     */
    completeAnimationBlend(blendId) {
        const blend = this.animationBlends.get(blendId);
        if (!blend)
            return;
        blend.isPlaying = false;
        this.activeBlends.delete(blendId);
        // Call completion callback
        if (blend.onComplete) {
            blend.onComplete(blend);
        }
        // Emit enhanced event
        this.emitEnhancedEvent({
            type: 'blend_completed',
            animationId: blendId,
            timestamp: Date.now(),
            data: { blend }
        });
    }
    // ===== ENHANCED EVENT SYSTEM =====
    /**
     * Register enhanced event callback
     */
    onEnhancedEvent(callback) {
        this.enhancedEventCallbacks.push(callback);
    }
    /**
     * Remove enhanced event callback
     */
    removeEnhancedEventCallback(callback) {
        const index = this.enhancedEventCallbacks.indexOf(callback);
        if (index > -1) {
            this.enhancedEventCallbacks.splice(index, 1);
        }
    }
    /**
     * Emit enhanced animation event
     */
    emitEnhancedEvent(event) {
        this.enhancedEventCallbacks.forEach(callback => {
            try {
                callback(event);
            }
            catch (error) {
                let errorMessage = 'Unknown error';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                else if (typeof error === 'string') {
                    errorMessage = error;
                }
                console.error('Enhanced animation event callback error:', SecurityUtils.sanitizeForLog(errorMessage));
            }
        });
    }
    // ===== UPDATED UPDATE LOOP =====
    /**
     * Update loop - called every frame
     */
    update() {
        if (this.isPaused)
            return;
        // Update sequence logic
        this.updateSequences();
        // Update physics animations
        this.updatePhysicsAnimations();
        // Update animation tracks
        this.updateAnimationTracks();
        // Update animation blends
        this.updateAnimationBlends();
        // Update pool cleanup and optimization
        this.updatePoolManagement();
        // Update any frame-based logic here
        // This could include checking for completed animations, etc.
    }
}
