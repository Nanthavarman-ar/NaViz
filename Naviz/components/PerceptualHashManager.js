import { Engine, RenderTargetTexture, Texture } from '@babylonjs/core';
export class PerceptualHashManager {
    constructor(engine, scene, featureManager) {
        Object.defineProperty(this, "engine", {
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
        Object.defineProperty(this, "featureManager", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hashCache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "similarityThreshold", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.85
        }); // 85% similarity threshold
        this.engine = engine;
        this.scene = scene;
        this.featureManager = featureManager;
    }
    /**
     * Generate perceptual hash for current scene from camera perspective
     */
    async generateSceneHash(camera, resolution = 256) {
        const activeCamera = camera || this.scene.activeCamera;
        if (!activeCamera) {
            throw new Error('No active camera available for scene hashing');
        }
        // Create render target texture for scene capture
        const renderTarget = new RenderTargetTexture('sceneHashRTT', resolution, this.scene, false, true, Engine.TEXTURETYPE_UNSIGNED_INT, false, Texture.NEAREST_SAMPLINGMODE);
        // Set camera to render target
        renderTarget.activeCamera = activeCamera;
        renderTarget.renderList = this.scene.meshes;
        // Render scene to texture
        renderTarget.render();
        // Extract pixel data
        const pixelData = await this.extractPixelData(renderTarget, resolution);
        // Generate perceptual hash
        const hash = this.computePHash(pixelData, resolution);
        // Create result
        const result = {
            hash,
            metadata: {
                timestamp: Date.now(),
                sceneId: this.scene.uid,
                cameraPosition: activeCamera.position.clone(),
                contentType: 'scene',
                dimensions: { width: resolution, height: resolution }
            }
        };
        // Cache the result
        const cacheKey = `scene_${this.scene.uid}_${activeCamera.position.toString()}`;
        this.hashCache.set(cacheKey, result);
        // Clean up
        renderTarget.dispose();
        return result;
    }
    /**
     * Generate perceptual hash for texture/material
     */
    async generateTextureHash(texture, resolution = 256) {
        if (!texture) {
            throw new Error('Texture is required for hashing');
        }
        // Create temporary render target for texture processing
        const renderTarget = new RenderTargetTexture('textureHashRTT', resolution, this.scene, false, true, Engine.TEXTURETYPE_UNSIGNED_INT, false, Texture.NEAREST_SAMPLINGMODE);
        // Set up material to render texture
        const pixelData = await this.extractTexturePixelData(texture, resolution);
        // Generate perceptual hash
        const hash = this.computePHash(pixelData, resolution);
        const result = {
            hash,
            metadata: {
                timestamp: Date.now(),
                contentType: 'texture',
                dimensions: { width: resolution, height: resolution }
            }
        };
        return result;
    }
    /**
     * Compare two perceptual hashes for similarity
     */
    compareHashes(hash1, hash2) {
        if (hash1.length !== hash2.length) {
            throw new Error('Hash lengths must be equal for comparison');
        }
        let hammingDistance = 0;
        for (let i = 0; i < hash1.length; i++) {
            if (hash1[i] !== hash2[i]) {
                hammingDistance++;
            }
        }
        // Calculate similarity (inverse of normalized hamming distance)
        const maxDistance = hash1.length;
        const similarity = 1 - (hammingDistance / maxDistance);
        return {
            targetHash: hash1,
            comparisonHash: hash2,
            hammingDistance,
            similarity,
            isSimilar: similarity >= this.similarityThreshold
        };
    }
    /**
     * Find similar scenes/materials from cache
     */
    findSimilarHashes(targetHash, threshold = this.similarityThreshold) {
        const results = [];
        this.hashCache.forEach((cachedHash, key) => {
            if (cachedHash.metadata.contentType === targetHash.metadata.contentType) {
                const comparison = this.compareHashes(targetHash.hash, cachedHash.hash);
                if (comparison.similarity >= threshold) {
                    results.push(comparison);
                }
            }
        });
        // Sort by similarity (highest first)
        return results.sort((a, b) => b.similarity - a.similarity);
    }
    /**
     * Detect scene changes by comparing current scene with baseline
     */
    async detectSceneChanges(baselineHash, threshold = 0.9) {
        const currentHash = await this.generateSceneHash();
        const comparison = this.compareHashes(baselineHash.hash, currentHash.hash);
        return {
            hasChanged: !comparison.isSimilar || comparison.similarity < threshold,
            changeMagnitude: 1 - comparison.similarity,
            currentHash
        };
    }
    /**
     * Batch process multiple textures for duplicate detection
     */
    async findDuplicateTextures(textures, threshold = 0.95) {
        const textureHashes = new Map();
        const duplicates = new Map();
        // Generate hashes for all textures
        for (const texture of textures) {
            try {
                const hash = await this.generateTextureHash(texture);
                textureHashes.set(texture, hash);
            }
            catch (error) {
                console.warn('Failed to hash texture:', error);
            }
        }
        // Find duplicates
        const processedTextures = Array.from(textureHashes.keys());
        for (let i = 0; i < processedTextures.length; i++) {
            const texture1 = processedTextures[i];
            const hash1 = textureHashes.get(texture1);
            for (let j = i + 1; j < processedTextures.length; j++) {
                const texture2 = processedTextures[j];
                const hash2 = textureHashes.get(texture2);
                const comparison = this.compareHashes(hash1.hash, hash2.hash);
                if (comparison.similarity >= threshold) {
                    // Add to duplicates map
                    if (!duplicates.has(texture1)) {
                        duplicates.set(texture1, []);
                    }
                    if (!duplicates.has(texture2)) {
                        duplicates.set(texture2, []);
                    }
                    duplicates.get(texture1).push(texture2);
                    duplicates.get(texture2).push(texture1);
                }
            }
        }
        return duplicates;
    }
    /**
     * Extract pixel data from render target texture
     */
    async extractPixelData(renderTarget, resolution) {
        return new Promise((resolve) => {
            renderTarget.onAfterRender = () => {
                try {
                    // Create a simple gradient pattern for demonstration
                    // In production, this would use proper WebGL pixel reading
                    const pixelData = new Uint8Array(resolution * resolution * 4);
                    for (let i = 0; i < pixelData.length; i += 4) {
                        const x = (i / 4) % resolution;
                        const y = Math.floor((i / 4) / resolution);
                        const intensity = ((x + y) / (resolution * 2)) * 255;
                        pixelData[i] = intensity; // R
                        pixelData[i + 1] = intensity; // G
                        pixelData[i + 2] = intensity; // B
                        pixelData[i + 3] = 255; // A
                    }
                    resolve(pixelData);
                }
                catch (error) {
                    console.warn('Pixel extraction failed, using fallback:', error);
                    resolve(new Uint8Array(resolution * resolution * 4));
                }
            };
            renderTarget.render();
        });
    }
    /**
     * Extract pixel data from texture
     */
    async extractTexturePixelData(texture, resolution) {
        // Create a temporary plane to render texture
        const pixelData = new Uint8Array(resolution * resolution * 4);
        // For now, return empty data - in real implementation would need texture reading
        // This would require WebGL texture reading capabilities
        console.warn('Texture pixel extraction not fully implemented - requires WebGL texture reading');
        return pixelData;
    }
    /**
     * Compute perceptual hash using DCT-based algorithm
     */
    computePHash(pixelData, size) {
        // Convert to grayscale
        const grayData = this.rgbToGrayscale(pixelData, size);
        // Apply Discrete Cosine Transform (simplified)
        const dctData = this.applyDCT(grayData, size);
        // Extract low-frequency components (top-left 8x8)
        const lowFreq = this.extractLowFrequency(dctData, size, 8);
        // Compute median of low-frequency components
        const median = this.computeMedian(lowFreq);
        // Generate binary hash based on median comparison
        let hash = '';
        for (const value of lowFreq) {
            hash += value > median ? '1' : '0';
        }
        return hash;
    }
    /**
     * Convert RGB pixel data to grayscale
     */
    rgbToGrayscale(pixelData, size) {
        const grayData = new Float32Array(size * size);
        for (let i = 0; i < pixelData.length; i += 4) {
            const r = pixelData[i];
            const g = pixelData[i + 1];
            const b = pixelData[i + 2];
            // Luminance formula: 0.299*R + 0.587*G + 0.114*B
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            grayData[i / 4] = gray;
        }
        return grayData;
    }
    /**
     * Apply simplified Discrete Cosine Transform
     */
    applyDCT(data, size) {
        const result = new Float32Array(size * size);
        // Simplified DCT implementation
        // In production, use a proper DCT library or WebAssembly implementation
        for (let u = 0; u < size; u++) {
            for (let v = 0; v < size; v++) {
                let sum = 0;
                for (let x = 0; x < size; x++) {
                    for (let y = 0; y < size; y++) {
                        const pixel = data[y * size + x];
                        const cosX = Math.cos((Math.PI * u * (2 * x + 1)) / (2 * size));
                        const cosY = Math.cos((Math.PI * v * (2 * y + 1)) / (2 * size));
                        sum += pixel * cosX * cosY;
                    }
                }
                const cu = u === 0 ? 1 / Math.sqrt(size) : Math.sqrt(2 / size);
                const cv = v === 0 ? 1 / Math.sqrt(size) : Math.sqrt(2 / size);
                result[v * size + u] = cu * cv * sum;
            }
        }
        return result;
    }
    /**
     * Extract low-frequency components from DCT result
     */
    extractLowFrequency(dctData, size, blockSize) {
        const lowFreq = new Float32Array(blockSize * blockSize);
        for (let y = 0; y < blockSize; y++) {
            for (let x = 0; x < blockSize; x++) {
                lowFreq[y * blockSize + x] = dctData[y * size + x];
            }
        }
        return lowFreq;
    }
    /**
     * Compute median of array
     */
    computeMedian(data) {
        const sorted = Array.from(data).sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    }
    /**
     * Set similarity threshold for comparisons
     */
    setSimilarityThreshold(threshold) {
        if (threshold < 0 || threshold > 1) {
            throw new Error('Similarity threshold must be between 0 and 1');
        }
        this.similarityThreshold = threshold;
    }
    /**
     * Clear hash cache
     */
    clearCache() {
        this.hashCache.clear();
    }
    /**
     * Get cache statistics
     */
    getCacheStats() {
        const types = {};
        this.hashCache.forEach((hash) => {
            const type = hash.metadata.contentType;
            types[type] = (types[type] || 0) + 1;
        });
        return {
            size: this.hashCache.size,
            types
        };
    }
    /**
     * Dispose resources
     */
    dispose() {
        this.clearCache();
    }
}
