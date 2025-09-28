import * as BABYLON from "@babylonjs/core";
export class SyncManager {
    constructor(socket, scene, userId) {
        Object.defineProperty(this, "socket", {
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
        Object.defineProperty(this, "sceneObjects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "localUserId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isHost", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "pendingChanges", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "lastSyncTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "syncInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 100
        }); // ms
        Object.defineProperty(this, "conflictResolver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "syncIntervalId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.socket = socket;
        this.scene = scene;
        this.localUserId = userId;
        this.conflictResolver = this.defaultConflictResolver;
        if (this.socket) {
            this.setupSocketListeners();
        }
        this.startSyncLoop();
    }

    start() {
        if (this.syncIntervalId) return; // Already running
        this.syncIntervalId = setInterval(() => {
            this.processPendingChanges();
        }, this.syncInterval);
        console.log('SyncManager started');
    }

    stop() {
        if (this.syncIntervalId) {
            clearInterval(this.syncIntervalId);
            this.syncIntervalId = null;
            console.log('SyncManager stopped');
        }
    }
    // Setup socket event listeners
    setupSocketListeners() {
        if (!this.socket)
            return;
        // Listen for scene sync events
        this.socket.on('scene-sync', (data) => {
            this.handleSceneSync(data);
        });
        this.socket.on('object-sync', (event) => {
            this.handleObjectSync(event);
        });
        this.socket.on('user-joined', (data) => {
            if (data.userId === this.localUserId) {
                this.isHost = data.isHost;
            }
            this.requestSceneSync();
        });
        this.socket.on('user-left', (userId) => {
            this.removeUserObjects(userId);
        });
    }
    // Handle full scene synchronization
    handleSceneSync(data) {
        if (data.timestamp <= this.lastSyncTime)
            return;
        this.lastSyncTime = data.timestamp;
        this.sceneObjects.clear();
        data.objects.forEach(obj => {
            this.sceneObjects.set(obj.id, obj);
            this.applyObjectToScene(obj, false);
        });
    }
    // Handle individual object synchronization
    handleObjectSync(event) {
        if (event.userId === this.localUserId)
            return; // Ignore our own events
        switch (event.type) {
            case 'create':
                this.sceneObjects.set(event.objectId, event.data);
                this.applyObjectToScene(event.data, false);
                break;
            case 'update':
                const existing = this.sceneObjects.get(event.objectId);
                if (existing) {
                    const resolved = this.conflictResolver(existing, event.data);
                    this.sceneObjects.set(event.objectId, resolved);
                    this.applyObjectToScene(resolved, false);
                }
                break;
            case 'delete':
                this.sceneObjects.delete(event.objectId);
                this.removeObjectFromScene(event.objectId);
                break;
            case 'transform':
                this.applyTransform(event.objectId, event.data);
                break;
            case 'material':
                this.applyMaterial(event.objectId, event.data);
                break;
            case 'animation':
                this.applyAnimation(event.objectId, event.data);
                break;
        }
    }
    // Apply object to Babylon scene
    applyObjectToScene(obj, isLocal = true) {
        let mesh = this.scene.getMeshByName(`sync_${obj.id}`);
        if (!mesh) {
            // Create new mesh
            switch (obj.type) {
                case 'box':
                    mesh = BABYLON.MeshBuilder.CreateBox(`sync_${obj.id}`, {}, this.scene);
                    break;
                case 'sphere':
                    mesh = BABYLON.MeshBuilder.CreateSphere(`sync_${obj.id}`, {}, this.scene);
                    break;
                case 'cylinder':
                    mesh = BABYLON.MeshBuilder.CreateCylinder(`sync_${obj.id}`, {}, this.scene);
                    break;
                case 'plane':
                    mesh = BABYLON.MeshBuilder.CreatePlane(`sync_${obj.id}`, {}, this.scene);
                    break;
                default:
                    mesh = BABYLON.MeshBuilder.CreateBox(`sync_${obj.id}`, {}, this.scene);
            }
            // Set mesh properties
            mesh.position = new BABYLON.Vector3(...obj.position);
            mesh.rotation = new BABYLON.Vector3(...obj.rotation);
            mesh.scaling = new BABYLON.Vector3(...obj.scale);
            // Add material if specified
            if (obj.materialId) {
                this.applyMaterial(obj.id, { materialId: obj.materialId });
            }
            // Add user indicator for remote objects
            if (!isLocal && obj.userId) {
                this.addUserIndicator(mesh, obj.userId);
            }
        }
        else {
            // Update existing mesh
            mesh.position = new BABYLON.Vector3(...obj.position);
            mesh.rotation = new BABYLON.Vector3(...obj.rotation);
            mesh.scaling = new BABYLON.Vector3(...obj.scale);
        }
    }
    // Remove object from scene
    removeObjectFromScene(objectId) {
        const mesh = this.scene.getMeshByName(`sync_${objectId}`);
        if (mesh) {
            mesh.dispose();
        }
    }
    // Apply transform to object
    applyTransform(objectId, transform) {
        const mesh = this.scene.getMeshByName(`sync_${objectId}`);
        if (mesh) {
            if (transform.position) {
                mesh.position = new BABYLON.Vector3(...transform.position);
            }
            if (transform.rotation) {
                mesh.rotation = new BABYLON.Vector3(...transform.rotation);
            }
            if (transform.scale) {
                mesh.scaling = new BABYLON.Vector3(...transform.scale);
            }
        }
    }
    // Apply material to object
    applyMaterial(objectId, data) {
        const mesh = this.scene.getMeshByName(`sync_${objectId}`);
        if (mesh && data.materialId) {
            // This would integrate with MaterialManager
            // For now, create a simple material
            const material = new BABYLON.PBRMaterial(`mat_${objectId}`, this.scene);
            material.albedoColor = new BABYLON.Color3(0.5, 0.5, 0.5);
            mesh.material = material;
        }
    }
    // Apply animation to object
    applyAnimation(objectId, data) {
        // This would integrate with AnimationManager
        const sanitizedObjectId = objectId.replace(/[\r\n\t]/g, '_');
        const sanitizedData = JSON.stringify(data).replace(/[\r\n\t]/g, '_');
        console.log('Animation sync:', sanitizedObjectId, sanitizedData);
    }
    // Add visual indicator for user ownership
    addUserIndicator(mesh, userId) {
        // Create a small indicator sphere above the object
        const indicator = BABYLON.MeshBuilder.CreateSphere(`indicator_${mesh.name}`, { diameter: 0.1 }, this.scene);
        indicator.position = mesh.position.add(new BABYLON.Vector3(0, 1.5, 0));
        indicator.parent = mesh; // Attach to object
        const material = new BABYLON.PBRMaterial(`indicator_mat_${userId}`, this.scene);
        material.albedoColor = new BABYLON.Color3(0, 1, 0); // Green for remote users
        material.emissiveColor = new BABYLON.Color3(0, 0.5, 0);
        indicator.material = material;
    }
    // Remove objects owned by a user
    removeUserObjects(userId) {
        for (const [id, obj] of this.sceneObjects.entries()) {
            if (obj.userId === userId) {
                this.sceneObjects.delete(id);
                this.removeObjectFromScene(id);
            }
        }
    }
    // Default conflict resolver (last write wins)
    defaultConflictResolver(local, remote) {
        return remote.timestamp > local.timestamp ? remote : local;
    }
    // Public API methods
    // Create a new synchronized object
    createObject(type, position, name) {
        const objectId = `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const obj = {
            id: objectId,
            name: name || `${type}_${objectId}`,
            position,
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            type,
            userId: this.localUserId,
            timestamp: Date.now()
        };
        this.sceneObjects.set(objectId, obj);
        this.applyObjectToScene(obj, true);
        // Broadcast creation
        this.broadcastEvent({
            type: 'create',
            objectId,
            data: obj,
            userId: this.localUserId,
            timestamp: obj.timestamp
        });
        return objectId;
    }
    // Update an existing object
    updateObject(objectId, updates) {
        const obj = this.sceneObjects.get(objectId);
        if (!obj)
            return;
        const updatedObj = {
            ...obj,
            ...updates,
            timestamp: Date.now(),
            id: objectId // Ensure id is preserved
        };
        this.sceneObjects.set(objectId, updatedObj);
        this.applyObjectToScene(updatedObj, true);
        // Broadcast update
        this.broadcastEvent({
            type: 'update',
            objectId,
            data: updatedObj,
            userId: this.localUserId,
            timestamp: updatedObj.timestamp
        });
    }
    // Delete an object
    deleteObject(objectId) {
        if (!this.sceneObjects.has(objectId))
            return;
        this.sceneObjects.delete(objectId);
        this.removeObjectFromScene(objectId);
        // Broadcast deletion
        this.broadcastEvent({
            type: 'delete',
            objectId,
            data: null,
            userId: this.localUserId,
            timestamp: Date.now()
        });
    }
    // Broadcast sync event
    broadcastEvent(event) {
        if (this.socket) {
            this.socket.emit('object-sync', event);
        }
    }
    // Request full scene sync
    requestSceneSync() {
        if (this.socket) {
            this.socket.emit('request-scene-sync');
        }
    }

    // Start synchronization
    start() {
        if (this.syncIntervalId) return; // Already running
        this.syncIntervalId = setInterval(() => {
            this.processPendingChanges();
        }, this.syncInterval);
        console.log('SyncManager started');
    }

    // Stop synchronization
    stop() {
        if (this.syncIntervalId) {
            clearInterval(this.syncIntervalId);
            this.syncIntervalId = null;
            console.log('SyncManager stopped');
        }
    }

    // Start synchronization loop (legacy)
    startSyncLoop() {
        this.start();
    }

    // Process pending changes
    processPendingChanges() {
        // Process pending changes if any
        // This could be used for batching or retry logic
    }
    // Get all scene objects
    getSceneObjects() {
        return Array.from(this.sceneObjects.values());
    }
    // Get object by ID
    getObject(objectId) {
        return this.sceneObjects.get(objectId);
    }
    // Set custom conflict resolver
    setConflictResolver(resolver) {
        this.conflictResolver = resolver;
    }
    // Cleanup
    dispose() {
        this.sceneObjects.clear();
        // Remove all sync meshes
        const syncMeshes = this.scene.meshes.filter(mesh => mesh.name.startsWith('sync_'));
        syncMeshes.forEach(mesh => mesh.dispose());
    }
}
