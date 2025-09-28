import { TransformNode, Vector3, Quaternion, Color3, MeshBuilder, StandardMaterial } from '@babylonjs/core';
export class CollabManager {
    constructor(scene, options = {}) {
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "users", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "objects", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "options", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "eventListeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "isConnected", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "currentUser", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "socket", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.scene = scene;
        this.options = {
            serverUrl: options.serverUrl || 'wss://collab.example.com',
            apiKey: options.apiKey || '',
            roomId: options.roomId || 'default-room',
            userId: options.userId || this.generateUserId(),
            userName: options.userName || 'Anonymous User',
            enableRealTimeSync: options.enableRealTimeSync ?? true,
            syncInterval: options.syncInterval ?? 1000, // 1 second
            maxUsers: options.maxUsers ?? 50,
            enableVoiceChat: options.enableVoiceChat ?? false,
            enableScreenShare: options.enableScreenShare ?? false,
        };
    }
    /**
     * Connect to the collaboration server
     */
    async connect() {
        try {
            console.log(`Connecting to collaboration server: ${this.options.serverUrl}`);
            // Create WebSocket connection
            this.socket = new WebSocket(`${this.options.serverUrl}/room/${this.options.roomId}?apiKey=${this.options.apiKey}`);
            this.socket.onopen = () => {
                console.log('Connected to collaboration server');
                this.isConnected = true;
                this.joinRoom();
            };
            this.socket.onmessage = (event) => {
                this.handleMessage(JSON.parse(event.data));
            };
            this.socket.onclose = () => {
                console.log('Disconnected from collaboration server');
                this.isConnected = false;
            };
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
            return true;
        }
        catch (error) {
            console.error('Failed to connect to collaboration server:', error);
            return false;
        }
    }
    /**
     * Disconnect from the collaboration server
     */
    async disconnect() {
        try {
            if (this.socket) {
                this.socket.close();
                this.socket = null;
            }
            this.isConnected = false;
            console.log('Disconnected from collaboration server');
        }
        catch (error) {
            console.error('Error disconnecting from collaboration server:', error);
        }
    }
    /**
     * Join the collaboration room
     */
    async joinRoom() {
        if (!this.socket || !this.isConnected) {
            return;
        }
        this.currentUser = {
            id: this.options.userId,
            name: this.options.userName,
            position: Vector3.Zero(),
            rotation: Quaternion.Identity(),
            color: this.generateUserColor(),
            isOnline: true,
            lastSeen: new Date(),
        };
        this.socket.send(JSON.stringify({
            type: 'join_room',
            user: this.currentUser,
        }));
        this.emitEvent({
            type: 'user_joined',
            userId: this.currentUser.id,
            timestamp: new Date(),
            data: this.currentUser,
        });
    }
    /**
     * Update current user position
     */
    async updateUserPosition(position, rotation) {
        if (!this.currentUser) {
            return;
        }
        this.currentUser.position = position.clone();
        this.currentUser.rotation = rotation.clone();
        this.currentUser.lastSeen = new Date();
        if (this.socket && this.isConnected) {
            this.socket.send(JSON.stringify({
                type: 'user_update',
                userId: this.currentUser.id,
                position: position,
                rotation: rotation,
            }));
        }
        this.emitEvent({
            type: 'user_moved',
            userId: this.currentUser.id,
            timestamp: new Date(),
            data: { position, rotation },
        });
    }
    /**
     * Create a collaboration object
     */
    async createObject(object) {
        const fullObject = {
            ...object,
            node: this.createObjectNode(object),
        };
        this.objects.set(object.id, fullObject);
        if (this.socket && this.isConnected) {
            this.socket.send(JSON.stringify({
                type: 'object_created',
                object: fullObject,
            }));
        }
        this.emitEvent({
            type: 'object_created',
            objectId: object.id,
            userId: object.ownerId,
            timestamp: new Date(),
            data: object,
        });
        return fullObject;
    }
    /**
     * Update collaboration object
     */
    async updateObject(objectId, updates) {
        const object = this.objects.get(objectId);
        if (!object) {
            return false;
        }
        Object.assign(object, updates);
        if (object.node) {
            object.node.position = object.position;
            object.node.rotationQuaternion = object.rotation;
            object.node.scaling = object.scale;
        }
        if (this.socket && this.isConnected) {
            this.socket.send(JSON.stringify({
                type: 'object_updated',
                objectId,
                updates,
            }));
        }
        this.emitEvent({
            type: 'object_updated',
            objectId,
            userId: object.ownerId,
            timestamp: new Date(),
            data: updates,
        });
        return true;
    }
    /**
     * Delete collaboration object
     */
    async deleteObject(objectId) {
        const object = this.objects.get(objectId);
        if (!object) {
            return false;
        }
        if (object.node) {
            object.node.dispose();
        }
        this.objects.delete(objectId);
        if (this.socket && this.isConnected) {
            this.socket.send(JSON.stringify({
                type: 'object_deleted',
                objectId,
            }));
        }
        this.emitEvent({
            type: 'object_deleted',
            objectId,
            userId: object.ownerId,
            timestamp: new Date(),
        });
        return true;
    }
    /**
     * Get all users in the room
     */
    getUsers() {
        return Array.from(this.users.values());
    }
    /**
     * Get user by ID
     */
    getUser(userId) {
        return this.users.get(userId);
    }
    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }
    /**
     * Get all objects
     */
    getObjects() {
        return Array.from(this.objects.values());
    }
    /**
     * Get object by ID
     */
    getObject(objectId) {
        return this.objects.get(objectId);
    }
    /**
     * Get objects by user
     */
    getObjectsByUser(userId) {
        return this.getObjects().filter(obj => obj.ownerId === userId);
    }
    /**
     * Add event listener
     */
    addEventListener(listener) {
        this.eventListeners.push(listener);
    }
    /**
     * Remove event listener
     */
    removeEventListener(listener) {
        const index = this.eventListeners.indexOf(listener);
        if (index > -1) {
            this.eventListeners.splice(index, 1);
        }
    }
    createObjectNode(object) {
        const node = new TransformNode(`collab_object_${object.id}`, this.scene);
        node.position = object.position;
        node.rotationQuaternion = object.rotation;
        node.scaling = object.scale;
        // Create visual representation based on object type
        let mesh;
        switch (object.type) {
            case 'model':
                mesh = MeshBuilder.CreateBox(`object_mesh_${object.id}`, { size: 0.2 }, this.scene);
                break;
            case 'annotation':
                mesh = MeshBuilder.CreateSphere(`object_mesh_${object.id}`, { diameter: 0.1 }, this.scene);
                break;
            case 'measurement':
                mesh = MeshBuilder.CreateCylinder(`object_mesh_${object.id}`, { height: 0.3, diameter: 0.05 }, this.scene);
                break;
            case 'note':
                mesh = MeshBuilder.CreatePlane(`object_mesh_${object.id}`, { size: 0.2 }, this.scene);
                break;
            default:
                mesh = MeshBuilder.CreateBox(`object_mesh_${object.id}`, { size: 0.1 }, this.scene);
        }
        mesh.position = node.position;
        mesh.material = new StandardMaterial(`object_material_${object.id}`, this.scene);
        mesh.material.diffuseColor = Color3.Yellow();
        node.addChild(mesh);
        return node;
    }
    createUserNode(user) {
        const node = new TransformNode(`collab_user_${user.id}`, this.scene);
        node.position = user.position;
        node.rotationQuaternion = user.rotation;
        // Create avatar representation
        const avatar = MeshBuilder.CreateCapsule(`user_avatar_${user.id}`, { height: 1.8, radius: 0.3 }, this.scene);
        avatar.position = node.position;
        avatar.material = new StandardMaterial(`user_material_${user.id}`, this.scene);
        avatar.material.diffuseColor = user.color;
        node.addChild(avatar);
        return node;
    }
    handleMessage(message) {
        switch (message.type) {
            case 'user_joined':
                this.handleUserJoined(message.user);
                break;
            case 'user_left':
                this.handleUserLeft(message.userId);
                break;
            case 'user_update':
                this.handleUserUpdate(message.userId, message.position, message.rotation);
                break;
            case 'object_created':
                this.handleObjectCreated(message.object);
                break;
            case 'object_updated':
                this.handleObjectUpdated(message.objectId, message.updates);
                break;
            case 'object_deleted':
                this.handleObjectDeleted(message.objectId);
                break;
        }
    }
    handleUserJoined(user) {
        if (user.id !== this.currentUser?.id) {
            user.node = this.createUserNode(user);
            this.users.set(user.id, user);
            this.emitEvent({
                type: 'user_joined',
                userId: user.id,
                timestamp: new Date(),
                data: user,
            });
        }
    }
    handleUserLeft(userId) {
        const user = this.users.get(userId);
        if (user) {
            if (user.node) {
                user.node.dispose();
            }
            this.users.delete(userId);
            this.emitEvent({
                type: 'user_left',
                userId,
                timestamp: new Date(),
            });
        }
    }
    handleUserUpdate(userId, position, rotation) {
        const user = this.users.get(userId);
        if (user) {
            user.position = position;
            user.rotation = rotation;
            user.lastSeen = new Date();
            if (user.node) {
                user.node.position = position;
                user.node.rotationQuaternion = rotation;
            }
            this.emitEvent({
                type: 'user_moved',
                userId,
                timestamp: new Date(),
                data: { position, rotation },
            });
        }
    }
    handleObjectCreated(object) {
        object.node = this.createObjectNode(object);
        this.objects.set(object.id, object);
        this.emitEvent({
            type: 'object_created',
            objectId: object.id,
            userId: object.ownerId,
            timestamp: new Date(),
            data: object,
        });
    }
    handleObjectUpdated(objectId, updates) {
        const object = this.objects.get(objectId);
        if (object) {
            Object.assign(object, updates);
            if (object.node) {
                object.node.position = object.position;
                object.node.rotationQuaternion = object.rotation;
                object.node.scaling = object.scale;
            }
            this.emitEvent({
                type: 'object_updated',
                objectId,
                userId: object.ownerId,
                timestamp: new Date(),
                data: updates,
            });
        }
    }
    handleObjectDeleted(objectId) {
        const object = this.objects.get(objectId);
        if (object) {
            if (object.node) {
                object.node.dispose();
            }
            this.objects.delete(objectId);
            this.emitEvent({
                type: 'object_deleted',
                objectId,
                userId: object.ownerId,
                timestamp: new Date(),
            });
        }
    }
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }
    generateUserColor() {
        const colors = [
            new Color3(1, 0, 0), // Red
            new Color3(0, 1, 0), // Green
            new Color3(0, 0, 1), // Blue
            new Color3(1, 1, 0), // Yellow
            new Color3(0.5, 0, 0.5), // Purple
            new Color3(0, 1, 1), // Cyan
            new Color3(1, 0, 1), // Magenta
            new Color3(1, 0.5, 0), // Orange
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    emitEvent(event) {
        this.eventListeners.forEach(listener => {
            try {
                listener(event);
            }
            catch (error) {
                console.error('Error in collaboration event listener:', error);
            }
        });
    }
}
