import { logger } from './Logger';
export class CacheManager {
    constructor() {
        Object.defineProperty(this, "caches", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "cleanupInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "defaultTTL", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 5 * 60 * 1000
        }); // 5 minutes
        this.startCleanupInterval();
    }
    static getInstance() {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager();
        }
        return CacheManager.instance;
    }
    // Generic caching methods
    set(cacheName, key, data, ttl) {
        if (!this.caches.has(cacheName)) {
            this.caches.set(cacheName, new Map());
        }
        const cache = this.caches.get(cacheName);
        const entry = {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.defaultTTL,
            accessCount: 0,
            lastAccessed: Date.now()
        };
        cache.set(key, entry);
        logger.debug(`Cached item in ${cacheName}: ${key}`);
    }
    get(cacheName, key) {
        const cache = this.caches.get(cacheName);
        if (!cache)
            return null;
        const entry = cache.get(key);
        if (!entry)
            return null;
        // Check if entry has expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            cache.delete(key);
            logger.debug(`Expired cache entry removed: ${cacheName}:${key}`);
            return null;
        }
        // Update access statistics
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        return entry.data;
    }
    has(cacheName, key) {
        const cache = this.caches.get(cacheName);
        if (!cache)
            return false;
        const entry = cache.get(key);
        if (!entry)
            return false;
        // Check if entry has expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            cache.delete(key);
            return false;
        }
        return true;
    }
    delete(cacheName, key) {
        const cache = this.caches.get(cacheName);
        if (!cache)
            return false;
        const deleted = cache.delete(key);
        if (deleted) {
            logger.debug(`Deleted cache entry: ${cacheName}:${key}`);
        }
        return deleted;
    }
    clear(cacheName) {
        if (cacheName) {
            this.caches.delete(cacheName);
            logger.debug(`Cleared cache: ${cacheName}`);
        }
        else {
            this.caches.clear();
            logger.debug('Cleared all caches');
        }
    }
    // Specialized caching for mesh bounds
    setMeshBounds(meshId, bounds) {
        this.set('meshBounds', meshId, bounds, 10 * 60 * 1000); // 10 minutes TTL
    }
    getMeshBounds(meshId) {
        return this.get('meshBounds', meshId);
    }
    calculateAndCacheMeshBounds(mesh) {
        const meshId = mesh.id || mesh.name;
        let bounds = this.getMeshBounds(meshId);
        if (!bounds) {
            const boundingInfo = mesh.getBoundingInfo();
            const min = boundingInfo.boundingBox.minimumWorld;
            const max = boundingInfo.boundingBox.maximumWorld;
            bounds = {
                min: min.clone(),
                max: max.clone(),
                width: max.x - min.x,
                height: max.y - min.y,
                depth: max.z - min.z,
                center: boundingInfo.boundingBox.centerWorld.clone()
            };
            this.setMeshBounds(meshId, bounds);
            logger.debug(`Calculated and cached bounds for mesh: ${meshId}`);
        }
        return bounds;
    }
    // Specialized caching for materials
    setMaterial(materialId, material) {
        this.set('materials', materialId, material.clone(materialId), 15 * 60 * 1000); // 15 minutes TTL
    }
    getMaterial(materialId) {
        return this.get('materials', materialId);
    }
    // Specialized caching for textures
    setTexture(textureId, texture) {
        this.set('textures', textureId, texture.clone(), 30 * 60 * 1000); // 30 minutes TTL
    }
    getTexture(textureId) {
        return this.get('textures', textureId);
    }
    // Cache statistics
    getCacheStats() {
        const stats = {};
        for (const [cacheName, cache] of this.caches) {
            const entries = Array.from(cache.values());
            stats[cacheName] = {
                entries: entries.length,
                totalAccessCount: entries.reduce((sum, entry) => sum + entry.accessCount, 0)
            };
        }
        return stats;
    }
    // Cleanup expired entries
    cleanup() {
        const now = Date.now();
        let totalCleaned = 0;
        for (const [cacheName, cache] of this.caches) {
            const expiredKeys = [];
            for (const [key, entry] of cache) {
                if (now - entry.timestamp > entry.ttl) {
                    expiredKeys.push(key);
                }
            }
            expiredKeys.forEach(key => cache.delete(key));
            totalCleaned += expiredKeys.length;
            if (expiredKeys.length > 0) {
                logger.debug(`Cleaned ${expiredKeys.length} expired entries from cache: ${cacheName}`);
            }
        }
        if (totalCleaned > 0) {
            logger.info(`Cache cleanup completed. Removed ${totalCleaned} expired entries.`);
        }
    }
    // Start automatic cleanup interval
    startCleanupInterval() {
        if (this.cleanupInterval)
            return;
        // Run cleanup every 5 minutes
        this.cleanupInterval = window.setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000);
    }
    // Stop automatic cleanup
    stopCleanupInterval() {
        if (this.cleanupInterval !== null) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
    // Memory management
    dispose() {
        this.stopCleanupInterval();
        this.clear();
        logger.info('CacheManager disposed');
    }
}
// Global cache manager instance
export const cacheManager = CacheManager.getInstance();
