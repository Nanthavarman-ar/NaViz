import * as BABYLON from "@babylonjs/core";
import { TeleportManager } from "./TeleportManager";
export class NavigationManager {
    constructor(options) {
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "canvas", {
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
        Object.defineProperty(this, "camera", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "inputMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "velocity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new BABYLON.Vector3(0, 0, 0)
        });
        Object.defineProperty(this, "gravity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new BABYLON.Vector3(0, -9.81, 0)
        });
        Object.defineProperty(this, "isOnGround", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "collisionCapsuleHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1.8
        });
        Object.defineProperty(this, "collisionCapsuleRadius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.3
        });
        Object.defineProperty(this, "enablePhysics", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "enableVR", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "enableAR", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "flyMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "teleportActive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "lastFrameTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        // Enhanced navigation features
        Object.defineProperty(this, "teleportManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "xrExperience", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "xrCamera", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isInVR", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "isInAR", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // Comfort features
        Object.defineProperty(this, "movementSpeed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.1
        });
        Object.defineProperty(this, "snapTurnAngle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Math.PI / 6
        }); // 30 degrees
        Object.defineProperty(this, "vignetteEffect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "comfortModeEnabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.scene = options.scene;
        this.canvas = options.canvas;
        this.featureManager = options.featureManager;
        this.enablePhysics = options.enablePhysics || false;
        this.enableVR = options.enableVR || false;
        this.enableAR = options.enableAR || false;
        this.setupCamera();
        this.setupInput();
        this.scene.onBeforeRenderObservable.add(() => this.update());
    }
    setupCamera() {
        // Use UniversalCamera for desktop and mobile
        this.camera = new BABYLON.UniversalCamera("fpsCamera", new BABYLON.Vector3(0, this.collisionCapsuleHeight, 0), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true;
        this.camera.ellipsoid = new BABYLON.Vector3(this.collisionCapsuleRadius, this.collisionCapsuleHeight / 2, this.collisionCapsuleRadius);
        this.camera.ellipsoidOffset = new BABYLON.Vector3(0, this.collisionCapsuleHeight / 2, 0);
        this.camera.speed = 0.1;
        this.camera.minZ = 0.1;
        this.camera.angularSensibility = 5000;
        this.scene.gravity = this.gravity;
        this.scene.collisionsEnabled = true;
        // Enable collisions and gravity on camera
        this.camera.checkCollisions = true;
        this.camera.applyGravity = true;
        // VR/AR camera setup can be added here if needed
    }
    setupInput() {
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
            this.inputMap[evt.sourceEvent.key.toLowerCase()] = true;
        }));
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
            this.inputMap[evt.sourceEvent.key.toLowerCase()] = false;
        }));
        // Touch and joystick support can be added here for mobile/tablet
    }
    update() {
        if (!this.camera)
            return;
        const deltaTime = this.getDeltaTime();
        // Movement speed
        const speed = this.flyMode ? 0.3 : 0.1;
        // Calculate direction vectors
        const forward = this.camera.getDirection(BABYLON.Axis.Z);
        const right = this.camera.getDirection(BABYLON.Axis.X);
        let move = new BABYLON.Vector3(0, 0, 0);
        if (this.inputMap["w"]) {
            move = move.add(forward);
        }
        if (this.inputMap["s"]) {
            move = move.subtract(forward);
        }
        if (this.inputMap["a"]) {
            move = move.subtract(right);
        }
        if (this.inputMap["d"]) {
            move = move.add(right);
        }
        move.y = 0;
        move = move.normalize();
        if (this.flyMode) {
            if (this.inputMap[" "]) {
                move.y += 1;
            }
            if (this.inputMap["shift"]) {
                move.y -= 1;
            }
        }
        // Apply movement
        const displacement = move.scale(speed * deltaTime);
        this.camera.position.addInPlace(displacement);
        // Gravity and collision handled by Babylon if physics enabled
        if (this.enablePhysics && !this.flyMode) {
            // Physics engine should handle gravity and collisions
        }
        // Teleportation and VR locomotion can be implemented here
        // TODO: Add pathfinding/navmesh integration for AI avatars and guided tours
    }
    getDeltaTime() {
        const now = performance.now();
        const delta = this.lastFrameTime ? (now - this.lastFrameTime) / 16.6667 : 1;
        this.lastFrameTime = now;
        return delta;
    }
    /**
     * Initialize WebXR support
     */
    async initializeWebXR() {
        if (!this.enableVR && !this.enableAR)
            return;
        try {
            const xr = await BABYLON.WebXRDefaultExperience.CreateAsync(this.scene, {
                floorMeshes: this.scene.meshes.filter(mesh => mesh.checkCollisions),
                optionalFeatures: this.enableAR ? ["hit-test", "anchors"] : undefined
            });
            this.xrExperience = xr;
            this.xrCamera = xr.baseExperience.camera;
            // Initialize teleport manager for VR
            if (this.enableVR) {
                this.teleportManager = new TeleportManager({
                    scene: this.scene,
                    camera: this.xrCamera,
                    enablePhysics: this.enablePhysics,
                    maxDistance: 15,
                    arcHeight: 3,
                    fadeDuration: 200
                });
            }
            this.isInVR = this.enableVR;
            this.isInAR = this.enableAR;
            // Setup XR input handling
            this.setupXRInput();
        }
        catch (error) {
            console.warn("WebXR initialization failed:", error);
        }
    }
    /**
     * Setup XR input handling
     */
    setupXRInput() {
        if (!this.xrExperience)
            return;
        // Handle controller input for teleportation
        this.xrExperience.input.onControllerAddedObservable.add((controller) => {
            controller.onMotionControllerInitObservable.add((motionController) => {
                const xr_ids = motionController.getComponentIds();
                // Setup trigger for teleport
                const triggerComponent = motionController.getComponent(xr_ids[0]); // trigger
                if (triggerComponent) {
                    triggerComponent.onButtonStateChangedObservable.add((component) => {
                        if (component.pressed && this.teleportManager) {
                            this.teleportManager.startTeleportAim();
                        }
                        else if (!component.pressed && this.teleportManager) {
                            this.teleportManager.endTeleport();
                        }
                    });
                }
                // Setup thumbstick for movement
                const thumbstickComponent = motionController.getComponent("xr-standard-thumbstick");
                if (thumbstickComponent) {
                    thumbstickComponent.onAxisValueChangedObservable.add((values) => {
                        this.handleThumbstickInput(values.x, values.y);
                    });
                }
            });
        });
    }
    /**
     * Handle thumbstick input for movement
     */
    handleThumbstickInput(x, y) {
        if (!this.camera || this.teleportActive)
            return;
        const deadzone = 0.1;
        if (Math.abs(x) < deadzone && Math.abs(y) < deadzone)
            return;
        const forward = this.camera.getDirection(BABYLON.Axis.Z);
        const right = this.camera.getDirection(BABYLON.Axis.X);
        const moveVector = forward.scale(-y * this.movementSpeed).add(right.scale(x * this.movementSpeed));
        this.camera.position.addInPlace(moveVector);
    }
    /**
     * Enable/disable teleport mode
     */
    setTeleportMode(enabled) {
        this.teleportActive = enabled;
        if (this.teleportManager) {
            if (enabled) {
                this.teleportManager.startTeleportAim();
            }
            else {
                this.teleportManager.endTeleport();
            }
        }
    }
    /**
     * Update teleport aim direction
     */
    updateTeleportAim(direction, origin) {
        if (this.teleportManager && this.teleportActive) {
            this.teleportManager.updateTeleportAim(direction, origin);
        }
    }
    /**
     * Execute teleport to current target
     */
    async executeTeleport() {
        if (this.teleportManager && this.teleportActive) {
            return await this.teleportManager.executeTeleport();
        }
        return false;
    }
    /**
     * Enable comfort mode with vignette and snap turning
     */
    setComfortMode(enabled) {
        this.comfortModeEnabled = enabled;
        if (enabled) {
            this.setupVignetteEffect();
            this.enableSnapTurning();
        }
        else {
            this.disableVignetteEffect();
            this.disableSnapTurning();
        }
    }
    /**
     * Setup vignette effect for comfort
     */
    setupVignetteEffect() {
        if (this.vignetteEffect)
            return;
        // Use ImageProcessingPostProcess for vignette effect as VignettePostProcess is not available
        this.vignetteEffect = new BABYLON.ImageProcessingPostProcess("vignette", 1.0, this.camera);
        if (this.vignetteEffect) {
            this.vignetteEffect.imageProcessingConfiguration.vignetteEnabled = true;
            this.vignetteEffect.imageProcessingConfiguration.vignetteWeight = 1.2;
            this.vignetteEffect.imageProcessingConfiguration.vignetteColor = new BABYLON.Color4(0, 0, 0, 0.5);
        }
    }
    /**
     * Disable vignette effect
     */
    disableVignetteEffect() {
        if (this.vignetteEffect) {
            this.vignetteEffect.dispose();
            this.vignetteEffect = null;
        }
    }
    /**
     * Enable snap turning for comfort
     */
    enableSnapTurning() {
        // Snap turning is handled in input processing
        // This would typically be implemented with controller input
    }
    /**
     * Disable snap turning
     */
    disableSnapTurning() {
        // Reset to smooth turning
    }
    /**
     * Set movement speed
     */
    setMovementSpeed(speed) {
        this.movementSpeed = Math.max(0.01, Math.min(1.0, speed));
        if (this.camera) {
            this.camera.speed = this.movementSpeed;
        }
    }
    /**
     * Set snap turn angle
     */
    setSnapTurnAngle(angle) {
        this.snapTurnAngle = Math.max(Math.PI / 12, Math.min(Math.PI / 2, angle));
    }
    /**
     * Get current navigation state
     */
    getNavigationState() {
        return {
            isInVR: this.isInVR,
            isInAR: this.isInAR,
            teleportActive: this.teleportActive,
            flyMode: this.flyMode,
            comfortModeEnabled: this.comfortModeEnabled,
            movementSpeed: this.movementSpeed,
            snapTurnAngle: this.snapTurnAngle
        };
    }
    /**
     * Exit VR/AR session
     */
    async exitXRSession() {
        if (this.xrExperience) {
            await this.xrExperience.baseExperience.exitXRAsync();
            this.isInVR = false;
            this.isInAR = false;
        }
    }
    toggleFlyMode(enabled) {
        this.flyMode = enabled;
        if (this.camera) {
            this.camera.applyGravity = !enabled;
        }
    }
    setCollisionCapsule(height, radius) {
        this.collisionCapsuleHeight = height;
        this.collisionCapsuleRadius = radius;
        if (this.camera) {
            this.camera.ellipsoid = new BABYLON.Vector3(radius, height / 2, radius);
            this.camera.ellipsoidOffset = new BABYLON.Vector3(0, height / 2, 0);
        }
    }
    enableTeleportation(enabled) {
        this.teleportActive = enabled;
        // Implementation of teleportation for VR locomotion to be added
    }
    dispose() {
        if (this.teleportManager) {
            this.teleportManager.dispose();
        }
        if (this.camera) {
            this.camera.detachControl();
            this.camera.dispose();
            this.camera = null;
        }
        // Note: Observable cleanup handled by scene disposal
    }
}
