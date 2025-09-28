import * as BABYLON from "@babylonjs/core";
export class SwimMode {
    constructor(scene, camera, underwaterMode, options) {
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
        Object.defineProperty(this, "underwaterMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isSwimming", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "swimVelocity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new BABYLON.Vector3(0, 0, 0)
        });
        Object.defineProperty(this, "buoyancyVelocity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new BABYLON.Vector3(0, 0, 0)
        });
        Object.defineProperty(this, "inputMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "lastFrameTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        // Exit rails system
        Object.defineProperty(this, "exitRails", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "railMaterial", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "comfortZone", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        // VR comfort features
        Object.defineProperty(this, "comfortModeActive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "lastComfortCheck", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "comfortCheckInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1000
        }); // ms
        // Animation and feedback
        Object.defineProperty(this, "swimAnimationGroup", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "particleSystem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "rippleEffect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.scene = scene;
        this.camera = camera;
        this.underwaterMode = underwaterMode;
        this.options = options;
        this.setupInput();
        this.createExitRails();
        this.createComfortZone();
        this.createSwimEffects();
        this.setupAnimations();
        // Register update loop
        this.scene.onBeforeRenderObservable.add(() => this.update());
    }
    /**
     * Setup input handling for swimming
     */
    setupInput() {
        this.scene.actionManager = this.scene.actionManager || new BABYLON.ActionManager(this.scene);
        // Keyboard input
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
            this.inputMap[evt.sourceEvent.key.toLowerCase()] = true;
        }));
        this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, (evt) => {
            this.inputMap[evt.sourceEvent.key.toLowerCase()] = false;
        }));
        // Touch/pointer input for mobile
        this.scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                // Handle touch input for swimming direction
                this.handlePointerInput(pointerInfo);
            }
        });
    }
    /**
     * Handle pointer input for mobile swimming
     */
    handlePointerInput(pointerInfo) {
        if (!this.isSwimming)
            return;
        const pickInfo = this.scene.pick(pointerInfo.event.clientX, pointerInfo.event.clientY);
        if (pickInfo.hit && pickInfo.pickedPoint) {
            const direction = pickInfo.pickedPoint.subtract(this.camera.position).normalize();
            direction.y = 0; // Keep horizontal movement
            this.swimVelocity = direction.scale(this.options.swimSpeed * 0.5);
        }
    }
    /**
     * Create exit rails for VR comfort
     */
    createExitRails() {
        if (!this.options.enableExitRails)
            return;
        // Create rail material
        this.railMaterial = this.options.railMaterial || this.createDefaultRailMaterial();
        // Create rails in a circle around the water area
        const railCount = 8;
        const railLength = this.options.railDistance * 2;
        const railWidth = 0.2;
        const railHeight = this.options.railHeight;
        for (let i = 0; i < railCount; i++) {
            const angle = (i / railCount) * Math.PI * 2;
            const x = Math.cos(angle) * this.options.railDistance;
            const z = Math.sin(angle) * this.options.railDistance;
            // Create rail mesh
            const rail = BABYLON.MeshBuilder.CreateBox(`exitRail_${i}`, {
                width: railWidth,
                height: railHeight,
                depth: railLength
            }, this.scene);
            rail.position.set(x, this.options.waterLevel + railHeight / 2, z);
            rail.rotation.y = angle;
            rail.material = this.railMaterial;
            rail.isVisible = false; // Hidden by default, shown when needed
            // Add glow effect for visibility
            const glowLayer = new BABYLON.GlowLayer("railGlow", this.scene);
            glowLayer.addIncludedOnlyMesh(rail);
            glowLayer.intensity = 0.5;
            this.exitRails.push(rail);
        }
    }
    /**
     * Create default rail material
     */
    createDefaultRailMaterial() {
        const material = new BABYLON.StandardMaterial("exitRailMaterial", this.scene);
        material.diffuseColor = new BABYLON.Color3(0, 1, 1); // Cyan color
        material.emissiveColor = new BABYLON.Color3(0, 0.5, 0.5);
        material.alpha = 0.7;
        return material;
    }
    /**
     * Create comfort zone indicator
     */
    createComfortZone() {
        if (!this.options.enableVRComfort)
            return;
        this.comfortZone = BABYLON.MeshBuilder.CreateCylinder("comfortZone", {
            height: 0.1,
            diameter: this.options.comfortZoneRadius * 2
        }, this.scene);
        const material = new BABYLON.StandardMaterial("comfortZoneMaterial", this.scene);
        material.diffuseColor = new BABYLON.Color3(1, 1, 0); // Yellow
        material.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0);
        material.alpha = 0.3;
        this.comfortZone.material = material;
        this.comfortZone.isVisible = false;
    }
    /**
     * Create swimming effects (bubbles, ripples)
     */
    createSwimEffects() {
        // Create particle system for bubbles
        this.particleSystem = new BABYLON.ParticleSystem("swimBubbles", 200, this.scene);
        this.particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", this.scene);
        this.particleSystem.emitter = this.camera.position;
        this.particleSystem.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
        this.particleSystem.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);
        this.particleSystem.color1 = new BABYLON.Color4(1, 1, 1, 0.8);
        this.particleSystem.color2 = new BABYLON.Color4(0.8, 0.9, 1, 0.6);
        this.particleSystem.minSize = 0.01;
        this.particleSystem.maxSize = 0.05;
        this.particleSystem.minLifeTime = 1.0;
        this.particleSystem.maxLifeTime = 3.0;
        this.particleSystem.emitRate = 0;
        this.particleSystem.direction1 = new BABYLON.Vector3(0, 1, 0);
        this.particleSystem.direction2 = new BABYLON.Vector3(0.2, 1, 0.2);
        this.particleSystem.gravity = new BABYLON.Vector3(0, 0.1, 0);
        // Create ripple effect mesh
        this.rippleEffect = BABYLON.MeshBuilder.CreateDisc("swimRipple", { radius: 0.5 }, this.scene);
        const rippleMaterial = new BABYLON.StandardMaterial("rippleMaterial", this.scene);
        rippleMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        rippleMaterial.alpha = 0;
        this.rippleEffect.material = rippleMaterial;
        this.rippleEffect.isVisible = false;
    }
    /**
     * Setup swimming animations
     */
    setupAnimations() {
        // Create swimming animation group
        this.swimAnimationGroup = new BABYLON.AnimationGroup("swimAnimation");
        // Add camera bob animation
        const bobAnimation = new BABYLON.Animation("swimBob", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        // Create animation keys
        const keys = [
            { frame: 0, value: this.camera.position.y },
            { frame: 60, value: this.camera.position.y + 0.05 },
            { frame: 120, value: this.camera.position.y }
        ];
        bobAnimation.setKeys(keys);
        this.swimAnimationGroup.addTargetedAnimation(bobAnimation, this.camera);
        this.swimAnimationGroup.pause();
    }
    /**
     * Main update loop
     */
    update() {
        const deltaTime = this.getDeltaTime();
        const cameraPosition = this.camera.position;
        // Check if camera is in water
        const wasSwimming = this.isSwimming;
        this.isSwimming = cameraPosition.y < this.options.waterLevel + 0.5; // Small offset for surface
        if (this.isSwimming) {
            this.handleSwimming(deltaTime);
            this.updateComfortFeatures();
            this.updateSwimEffects();
        }
        else if (wasSwimming) {
            this.exitSwimming();
        }
        // Update exit rails visibility
        this.updateExitRailsVisibility();
    }
    /**
     * Handle swimming movement and physics
     */
    handleSwimming(deltaTime) {
        const cameraPosition = this.camera.position;
        // Calculate input direction
        const forward = this.camera.getDirection(BABYLON.Axis.Z);
        const right = this.camera.getDirection(BABYLON.Axis.X);
        const up = BABYLON.Vector3.Up();
        let inputDirection = new BABYLON.Vector3(0, 0, 0);
        // Keyboard input
        if (this.inputMap["w"])
            inputDirection = inputDirection.add(forward);
        if (this.inputMap["s"])
            inputDirection = inputDirection.subtract(forward);
        if (this.inputMap["a"])
            inputDirection = inputDirection.subtract(right);
        if (this.inputMap["d"])
            inputDirection = inputDirection.add(right);
        if (this.inputMap[" "])
            inputDirection = inputDirection.add(up);
        if (this.inputMap["shift"])
            inputDirection = inputDirection.subtract(up);
        // Normalize and apply swim speed
        if (inputDirection.length() > 0) {
            inputDirection = inputDirection.normalize();
            this.swimVelocity = inputDirection.scale(this.options.swimSpeed);
        }
        else {
            // Apply drag when no input
            this.swimVelocity = this.swimVelocity.scale(0.9);
        }
        // Apply buoyancy
        const depth = this.options.waterLevel - cameraPosition.y;
        const buoyancyStrength = Math.max(0, Math.min(1, depth / 2)); // Max buoyancy at 2 units deep
        this.buoyancyVelocity.y = this.options.buoyancyForce * buoyancyStrength * deltaTime;
        // Apply surface tension near surface
        if (depth < 0.2) {
            const surfaceTension = (0.2 - depth) / 0.2;
            this.buoyancyVelocity.y += this.options.surfaceTension * surfaceTension * deltaTime;
        }
        // Apply movement
        const totalVelocity = this.swimVelocity.add(this.buoyancyVelocity);
        this.camera.position.addInPlace(totalVelocity.scale(deltaTime));
        // Prevent going too deep or too high
        if (cameraPosition.y > this.options.waterLevel + 0.1) {
            this.camera.position.y = this.options.waterLevel + 0.1;
        }
        if (cameraPosition.y < this.options.waterLevel - 10) {
            this.camera.position.y = this.options.waterLevel - 10;
        }
        // Start swim animation if moving
        if (this.swimVelocity.length() > 0.01 && this.swimAnimationGroup) {
            this.swimAnimationGroup.play(true);
        }
        else if (this.swimAnimationGroup) {
            this.swimAnimationGroup.pause();
        }
    }
    /**
     * Update VR comfort features
     */
    updateComfortFeatures() {
        if (!this.options.enableVRComfort)
            return;
        const now = performance.now();
        if (now - this.lastComfortCheck < this.comfortCheckInterval)
            return;
        this.lastComfortCheck = now;
        const cameraPosition = this.camera.position;
        const distanceFromCenter = Math.sqrt(cameraPosition.x * cameraPosition.x + cameraPosition.z * cameraPosition.z);
        // Check if user is too far from center
        if (distanceFromCenter > this.options.comfortZoneRadius * 0.8) {
            this.activateComfortMode();
        }
        else {
            this.deactivateComfortMode();
        }
    }
    /**
     * Activate comfort mode
     */
    activateComfortMode() {
        if (this.comfortModeActive)
            return;
        this.comfortModeActive = true;
        // Show comfort zone
        if (this.comfortZone) {
            this.comfortZone.position.set(this.camera.position.x, this.options.waterLevel - 0.05, this.camera.position.z);
            this.comfortZone.isVisible = true;
        }
        // Show exit rails
        this.exitRails.forEach(rail => {
            rail.isVisible = true;
        });
        // Add gentle vibration feedback (if WebXR available)
        this.addHapticFeedback();
        console.log("SwimMode: Comfort mode activated - showing exit rails and comfort zone");
    }
    /**
     * Deactivate comfort mode
     */
    deactivateComfortMode() {
        if (!this.comfortModeActive)
            return;
        this.comfortModeActive = false;
        // Hide comfort zone
        if (this.comfortZone) {
            this.comfortZone.isVisible = false;
        }
        // Hide exit rails
        this.exitRails.forEach(rail => {
            rail.isVisible = false;
        });
        console.log("SwimMode: Comfort mode deactivated");
    }
    /**
     * Add haptic feedback for VR comfort
     */
    addHapticFeedback() {
        // This would integrate with WebXR haptic actuators
        // For now, we'll use a simple vibration if available
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
    }
    /**
     * Update exit rails visibility based on comfort mode
     */
    updateExitRailsVisibility() {
        if (!this.options.enableExitRails)
            return;
        const shouldShowRails = this.comfortModeActive || this.isSwimming;
        this.exitRails.forEach(rail => {
            rail.isVisible = shouldShowRails;
        });
    }
    /**
     * Update swimming effects (bubbles, ripples)
     */
    updateSwimEffects() {
        if (!this.particleSystem || !this.rippleEffect)
            return;
        const cameraPosition = this.camera.position;
        // Update bubble emitter position
        this.particleSystem.emitter = cameraPosition.clone();
        // Emit bubbles when moving
        if (this.swimVelocity.length() > 0.01) {
            this.particleSystem.emitRate = 20;
        }
        else {
            this.particleSystem.emitRate = 5; // Idle bubbles
        }
        // Create surface ripples when near surface
        const depth = this.options.waterLevel - cameraPosition.y;
        if (depth < 0.3 && this.swimVelocity.length() > 0.01) {
            this.createSurfaceRipple(cameraPosition);
        }
    }
    /**
     * Create surface ripple effect
     */
    createSurfaceRipple(position) {
        if (!this.rippleEffect)
            return;
        this.rippleEffect.position.set(position.x, this.options.waterLevel + 0.01, position.z);
        this.rippleEffect.isVisible = true;
        // Animate ripple expansion
        const rippleAnimation = new BABYLON.Animation("rippleExpand", "scaling", 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
        const keys = [
            { frame: 0, value: new BABYLON.Vector3(0.1, 1, 0.1) },
            { frame: 60, value: new BABYLON.Vector3(3, 1, 3) }
        ];
        rippleAnimation.setKeys(keys);
        this.rippleEffect.animations = [rippleAnimation];
        this.scene.beginAnimation(this.rippleEffect, 0, 60, false, 1, () => {
            // Hide ripple when animation completes
            if (this.rippleEffect) {
                this.rippleEffect.isVisible = false;
                this.rippleEffect.scaling.set(1, 1, 1);
            }
        });
    }
    /**
     * Handle exiting swimming mode
     */
    exitSwimming() {
        // Stop swim animation
        if (this.swimAnimationGroup) {
            this.swimAnimationGroup.pause();
        }
        // Stop particle emission
        if (this.particleSystem) {
            this.particleSystem.emitRate = 0;
        }
        // Deactivate comfort mode
        this.deactivateComfortMode();
        // Reset velocities
        this.swimVelocity.set(0, 0, 0);
        this.buoyancyVelocity.set(0, 0, 0);
    }
    /**
     * Get delta time for smooth updates
     */
    getDeltaTime() {
        const now = performance.now();
        const delta = this.lastFrameTime ? (now - this.lastFrameTime) / 16.6667 : 1;
        this.lastFrameTime = now;
        return delta;
    }
    /**
     * Set swim speed
     */
    setSwimSpeed(speed) {
        this.options.swimSpeed = Math.max(0.1, Math.min(5.0, speed));
    }
    /**
     * Set buoyancy force
     */
    setBuoyancyForce(force) {
        this.options.buoyancyForce = Math.max(0, Math.min(10, force));
    }
    /**
     * Enable/disable VR comfort features
     */
    setVRComfort(enabled) {
        this.options.enableVRComfort = enabled;
        if (!enabled) {
            this.deactivateComfortMode();
        }
    }
    /**
     * Enable/disable exit rails
     */
    setExitRails(enabled) {
        this.options.enableExitRails = enabled;
        this.exitRails.forEach(rail => {
            rail.isVisible = enabled && this.comfortModeActive;
        });
    }
    /**
     * Get current swimming state
     */
    getSwimState() {
        return {
            isSwimming: this.isSwimming,
            comfortModeActive: this.comfortModeActive,
            swimVelocity: this.swimVelocity.clone(),
            buoyancyVelocity: this.buoyancyVelocity.clone()
        };
    }
    /**
     * Teleport to nearest exit rail
     */
    teleportToNearestExit() {
        if (!this.options.enableExitRails || this.exitRails.length === 0)
            return false;
        const cameraPosition = this.camera.position;
        let nearestRail = null;
        let nearestDistance = Infinity;
        // Find nearest rail
        for (const rail of this.exitRails) {
            if (rail && rail.position) {
                const distance = BABYLON.Vector3.Distance(cameraPosition, rail.position);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestRail = rail;
                }
            }
        }
        if (nearestRail && nearestRail.position) {
            // Teleport to rail position (slightly above water)
            this.camera.position.set(nearestRail.position.x, this.options.waterLevel + 1.0, nearestRail.position.z);
            this.exitSwimming();
            return true;
        }
        return false;
    }
    /**
     * Dispose resources
     */
    dispose() {
        // Dispose animations
        if (this.swimAnimationGroup) {
            this.swimAnimationGroup.dispose();
        }
        // Dispose particle system
        if (this.particleSystem) {
            this.particleSystem.dispose();
        }
        // Dispose meshes
        this.exitRails.forEach((rail) => {
            if (rail && rail.dispose) {
                rail.dispose();
            }
        });
        this.exitRails = [];
        if (this.comfortZone) {
            this.comfortZone.dispose();
            this.comfortZone = null;
        }
        if (this.rippleEffect) {
            this.rippleEffect.dispose();
            this.rippleEffect = null;
        }
        // Dispose materials
        if (this.railMaterial) {
            this.railMaterial.dispose();
        }
    }
}
