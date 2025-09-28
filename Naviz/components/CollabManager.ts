import { Scene, TransformNode, Vector3, Quaternion, Color3, MeshBuilder, StandardMaterial } from '@babylonjs/core';

export interface CollabUser {
  id: string;
  name: string;
  avatar?: string;
  position: Vector3;
  rotation: Quaternion;
  color: Color3;
  isOnline: boolean;
  lastSeen: Date;
  node?: TransformNode;
}

export interface CollabObject {
  id: string;
  name: string;
  type: 'model' | 'annotation' | 'measurement' | 'note';
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
  ownerId: string;
  isShared: boolean;
  metadata?: any;
  node?: TransformNode;
}

export interface CollabManagerOptions {
  serverUrl?: string;
  apiKey?: string;
  roomId?: string;
  userId?: string;
  userName?: string;
  enableRealTimeSync?: boolean;
  syncInterval?: number;
  maxUsers?: number;
  enableVoiceChat?: boolean;
  enableScreenShare?: boolean;
}

export class CollabManager {
  private scene: Scene;
  private users: Map<string, CollabUser> = new Map();
  private objects: Map<string, CollabObject> = new Map();
  private options: Required<CollabManagerOptions>;
  private eventListeners: Array<(event: CollabEvent) => void> = [];
  private isConnected: boolean = false;
  private currentUser: CollabUser | null = null;
  private socket: WebSocket | null = null;

  constructor(scene: Scene, options: CollabManagerOptions = {}) {
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
  async connect(): Promise<boolean> {
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
    } catch (error) {
      console.error('Failed to connect to collaboration server:', error);
      return false;
    }
  }

  /**
   * Disconnect from the collaboration server
   */
  async disconnect(): Promise<void> {
    try {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
      this.isConnected = false;
      console.log('Disconnected from collaboration server');
    } catch (error) {
      console.error('Error disconnecting from collaboration server:', error);
    }
  }

  /**
   * Join the collaboration room
   */
  private async joinRoom(): Promise<void> {
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
  async updateUserPosition(position: Vector3, rotation: Quaternion): Promise<void> {
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
  async createObject(object: Omit<CollabObject, 'node'>): Promise<CollabObject> {
    const fullObject: CollabObject = {
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
  async updateObject(objectId: string, updates: Partial<CollabObject>): Promise<boolean> {
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
  async deleteObject(objectId: string): Promise<boolean> {
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
  getUsers(): CollabUser[] {
    return Array.from(this.users.values());
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): CollabUser | undefined {
    return this.users.get(userId);
  }

  /**
   * Get current user
   */
  getCurrentUser(): CollabUser | null {
    return this.currentUser;
  }

  /**
   * Get all objects
   */
  getObjects(): CollabObject[] {
    return Array.from(this.objects.values());
  }

  /**
   * Get object by ID
   */
  getObject(objectId: string): CollabObject | undefined {
    return this.objects.get(objectId);
  }

  /**
   * Get objects by user
   */
  getObjectsByUser(userId: string): CollabObject[] {
    return this.getObjects().filter(obj => obj.ownerId === userId);
  }

  /**
   * Add event listener
   */
  addEventListener(listener: (event: CollabEvent) => void): void {
    this.eventListeners.push(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(listener: (event: CollabEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  private createObjectNode(object: CollabObject): TransformNode {
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
    (mesh.material as StandardMaterial).diffuseColor = Color3.Yellow();

    node.addChild(mesh);

    return node;
  }

  private createUserNode(user: CollabUser): TransformNode {
    const node = new TransformNode(`collab_user_${user.id}`, this.scene);
    node.position = user.position;
    node.rotationQuaternion = user.rotation;

    // Create avatar representation
    const avatar = MeshBuilder.CreateCapsule(`user_avatar_${user.id}`, { height: 1.8, radius: 0.3 }, this.scene);
    avatar.position = node.position;
    avatar.material = new StandardMaterial(`user_material_${user.id}`, this.scene);
    (avatar.material as StandardMaterial).diffuseColor = user.color;

    node.addChild(avatar);

    return node;
  }

  private handleMessage(message: any): void {
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

  private handleUserJoined(user: CollabUser): void {
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

  private handleUserLeft(userId: string): void {
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

  private handleUserUpdate(userId: string, position: Vector3, rotation: Quaternion): void {
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

  private handleObjectCreated(object: CollabObject): void {
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

  private handleObjectUpdated(objectId: string, updates: Partial<CollabObject>): void {
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

  private handleObjectDeleted(objectId: string): void {
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

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  private generateUserColor(): Color3 {
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

  private emitEvent(event: CollabEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in collaboration event listener:', error);
      }
    });
  }

  /**
   * Update the collaboration manager (called per frame)
   */
  update(): void {
    // Update user positions, sync objects, etc.
    // This method is called from the render loop
  }

  /**
   * Dispose of the collaboration manager resources
   */
  dispose(): void {
    // Close WebSocket connection
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    // Clear all users and objects
    this.users.clear();
    this.objects.clear();

    // Clear event listeners
    this.eventListeners.length = 0;

    console.log('CollabManager disposed');
  }
}

export interface CollabEvent {
  type: 'user_joined' | 'user_left' | 'user_moved' | 'object_created' | 'object_updated' | 'object_deleted';
  userId?: string;
  objectId?: string;
  timestamp: Date;
  data?: any;
}
