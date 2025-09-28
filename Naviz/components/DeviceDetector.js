export class DeviceDetector {
    constructor() {
        Object.defineProperty(this, "capabilities", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "hardwareInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "networkInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "lastUpdate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "updateInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 30000
        }); // 30 seconds
    }
    static getInstance() {
        if (!DeviceDetector.instance) {
            DeviceDetector.instance = new DeviceDetector();
        }
        return DeviceDetector.instance;
    }
    // Detect all device capabilities
    async detectCapabilities() {
        if (this.capabilities && Date.now() - this.lastUpdate < this.updateInterval) {
            return this.capabilities;
        }
        const [webCapabilities, hardwareInfo, networkInfo] = await Promise.all([
            this.detectWebCapabilities(),
            this.detectHardwareInfo(),
            this.detectNetworkInfo()
        ]);
        this.capabilities = {
            ...webCapabilities,
            gpuMemory: hardwareInfo.memory.gpuMemory || 512, // Default fallback
            cpuCores: hardwareInfo.cpu.cores,
            ram: hardwareInfo.memory.ram,
            networkType: networkInfo.type,
            batteryLevel: await this.getBatteryLevel(),
            touchEnabled: this.isTouchEnabled(),
            mobile: this.isMobileDevice()
        };
        this.hardwareInfo = hardwareInfo;
        this.networkInfo = networkInfo;
        this.lastUpdate = Date.now();
        return this.capabilities;
    }
    // Detect web platform capabilities
    async detectWebCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const gl2 = canvas.getContext('webgl2');
        // Check for WebGPU support
        const webgpu = !!navigator.gpu;
        // Enhanced WebXR detection with feature support
        const webxr = !!navigator.xr;
        let webxrFeatures = [];
        if (webxr) {
            try {
                const xr = navigator.xr;
                const vrSupported = await xr.isSessionSupported('immersive-vr');
                if (vrSupported)
                    webxrFeatures.push('immersive-vr');
                const arSupported = await xr.isSessionSupported('immersive-ar');
                if (arSupported)
                    webxrFeatures.push('immersive-ar');
                const inlineSupported = await xr.isSessionSupported('inline');
                if (inlineSupported)
                    webxrFeatures.push('inline');
            }
            catch (e) {
                // WebXR not fully supported
            }
        }
        // WebRTC and WebAssembly checks
        const webrtc = !!(window.RTCPeerConnection || window.webkitRTCPeerConnection);
        const webassembly = !!(window.WebAssembly);
        return {
            webgl: !!gl,
            webgl2: !!gl2,
            webxr,
            webrtc,
            webassembly
        };
    }
    // Detect hardware information
    async detectHardwareInfo() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        let gpuInfo = {
            vendor: 'Unknown',
            renderer: 'Unknown',
            maxTextureSize: 2048,
            maxViewportDims: [2048, 2048],
            extensions: []
        };
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpuInfo.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown';
                gpuInfo.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
            }
            gpuInfo.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            gpuInfo.maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
            gpuInfo.extensions = gl.getSupportedExtensions() || [];
        }
        // CPU information
        const cpuInfo = {
            cores: navigator.hardwareConcurrency || 4,
            platform: navigator.platform
        };
        // Memory information
        const memoryInfo = navigator.deviceMemory ?
            { ram: navigator.deviceMemory * 1024 } : // GB to MB
            { ram: this.estimateMemorySize() };
        // GPU memory estimation based on renderer
        const gpuMemory = this.estimateGPUMemory(gpuInfo.renderer);
        return {
            gpu: gpuInfo,
            cpu: cpuInfo,
            memory: { ...memoryInfo, gpuMemory },
            display: {
                width: window.screen.width,
                height: window.screen.height,
                pixelRatio: window.devicePixelRatio,
                colorDepth: window.screen.colorDepth,
                refreshRate: this.detectRefreshRate()
            }
        };
    }
    // Detect network information
    async detectNetworkInfo() {
        const connection = navigator.connection ||
            navigator.mozConnection ||
            navigator.webkitConnection;
        let networkType = 'unknown';
        let downlink;
        let effectiveType;
        let rtt;
        if (connection) {
            downlink = connection.downlink;
            effectiveType = connection.effectiveType;
            rtt = connection.rtt;
            // Determine network type
            if (effectiveType) {
                if (['slow-2g', '2g'].includes(effectiveType)) {
                    networkType = 'slow';
                }
                else if (['3g'].includes(effectiveType)) {
                    networkType = 'slow';
                }
                else if (['4g', '5g'].includes(effectiveType)) {
                    networkType = 'fast';
                }
            }
            else if (downlink) {
                networkType = downlink < 1 ? 'slow' : 'fast';
            }
        }
        else {
            // Fallback: measure connection speed
            networkType = await this.measureConnectionSpeed();
        }
        return {
            type: networkType,
            downlink,
            effectiveType,
            rtt
        };
    }
    // Estimate system memory size
    estimateMemorySize() {
        // Rough estimation based on device type
        if (this.isMobileDevice()) {
            return 2048; // 2GB for mobile
        }
        // Desktop estimation
        const cores = navigator.hardwareConcurrency || 4;
        if (cores >= 8)
            return 16384; // 16GB for high-end
        if (cores >= 4)
            return 8192; // 8GB for mid-range
        return 4096; // 4GB for low-end
    }
    // Estimate GPU memory based on renderer string
    estimateGPUMemory(renderer) {
        const rendererLower = renderer.toLowerCase();
        // High-end GPUs
        if (rendererLower.includes('rtx') || rendererLower.includes('2080') ||
            rendererLower.includes('3080') || rendererLower.includes('3090') ||
            rendererLower.includes('radeon rx') || rendererLower.includes('vega')) {
            return 8192; // 8GB
        }
        // Mid-range GPUs
        if (rendererLower.includes('gtx') || rendererLower.includes('1060') ||
            rendererLower.includes('1070') || rendererLower.includes('1660') ||
            rendererLower.includes('2060') || rendererLower.includes('3060') ||
            rendererLower.includes('radeon') || rendererLower.includes('rx 5')) {
            return 4096; // 4GB
        }
        // Low-end GPUs
        if (rendererLower.includes('intel') || rendererLower.includes('uhd') ||
            rendererLower.includes('hd graphics') || rendererLower.includes('gt 1030')) {
            return 1024; // 1GB
        }
        // Mobile GPUs
        if (rendererLower.includes('mali') || rendererLower.includes('adreno') ||
            rendererLower.includes('powervr')) {
            return 512; // 512MB
        }
        return 2048; // Default 2GB
    }
    // Measure connection speed with a small test
    async measureConnectionSpeed() {
        try {
            const startTime = Date.now();
            const response = await fetch(window.location.origin + '/favicon.ico', {
                method: 'HEAD',
                cache: 'no-cache'
            });
            const endTime = Date.now();
            if (response.ok) {
                const rtt = endTime - startTime;
                return rtt > 500 ? 'slow' : 'fast';
            }
        }
        catch (error) {
            console.warn('Connection speed test failed:', error);
        }
        return 'unknown';
    }
    // Detect display refresh rate
    detectRefreshRate() {
        // This is approximate and may not be accurate
        if (window.screen && window.screen.refreshRate) {
            return window.screen.refreshRate;
        }
        // Fallback based on common refresh rates
        return 60; // Default assumption
    }
    // Get battery level if available
    async getBatteryLevel() {
        try {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                return Math.round(battery.level * 100);
            }
        }
        catch (error) {
            console.warn('Battery detection failed:', error);
        }
        return undefined;
    }
    // Check if touch is enabled
    isTouchEnabled() {
        return 'ontouchstart' in window ||
            navigator.maxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0;
    }
    // Check if device is mobile
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            window.innerWidth < 768;
    }
    // Get detailed hardware information
    getHardwareInfo() {
        return this.hardwareInfo;
    }
    // Get network information
    getNetworkInfo() {
        return this.networkInfo;
    }
    // Force refresh of capabilities
    async refreshCapabilities() {
        this.lastUpdate = 0;
        return this.detectCapabilities();
    }
    // Get performance score (0-100)
    getPerformanceScore() {
        if (!this.capabilities)
            return 50;
        let score = 0;
        // WebGL support (20 points)
        if (this.capabilities.webgl)
            score += 15;
        if (this.capabilities.webgl2)
            score += 5;
        // CPU cores (20 points)
        const cores = this.capabilities.cpuCores;
        if (cores >= 8)
            score += 20;
        else if (cores >= 4)
            score += 15;
        else if (cores >= 2)
            score += 10;
        else
            score += 5;
        // RAM (20 points)
        const ram = this.capabilities.ram;
        if (ram >= 8192)
            score += 20;
        else if (ram >= 4096)
            score += 15;
        else if (ram >= 2048)
            score += 10;
        else
            score += 5;
        // GPU memory (20 points)
        const gpuMem = this.capabilities.gpuMemory;
        if (gpuMem >= 4096)
            score += 20;
        else if (gpuMem >= 2048)
            score += 15;
        else if (gpuMem >= 1024)
            score += 10;
        else
            score += 5;
        // Network (10 points)
        if (this.capabilities.networkType === 'fast')
            score += 10;
        else if (this.capabilities.networkType === 'slow')
            score += 5;
        // Mobile penalty (10 points deduction)
        if (this.capabilities.mobile)
            score -= 10;
        return Math.max(0, Math.min(100, score));
    }
    // Get recommended quality settings
    getRecommendedQuality() {
        const score = this.getPerformanceScore();
        if (score >= 80)
            return 'ultra';
        if (score >= 60)
            return 'high';
        if (score >= 40)
            return 'medium';
        return 'low';
    }
    // Check if device supports a specific feature
    supportsFeature(feature) {
        if (!this.capabilities)
            return false;
        const value = this.capabilities[feature];
        return typeof value === 'boolean' ? value : false;
    }
    // Get device fingerprint for analytics
    getDeviceFingerprint() {
        if (!this.hardwareInfo)
            return 'unknown';
        const { gpu, cpu, memory, display } = this.hardwareInfo;
        const fingerprint = [
            gpu.vendor,
            gpu.renderer,
            cpu.cores.toString(),
            memory.ram.toString(),
            display.width.toString(),
            display.height.toString(),
            this.capabilities?.mobile ? 'mobile' : 'desktop'
        ].join('|');
        // Simple hash for privacy
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }
    // Export capabilities as JSON
    exportCapabilities() {
        return JSON.stringify({
            capabilities: this.capabilities,
            hardwareInfo: this.hardwareInfo,
            networkInfo: this.networkInfo,
            performanceScore: this.getPerformanceScore(),
            recommendedQuality: this.getRecommendedQuality(),
            fingerprint: this.getDeviceFingerprint()
        }, null, 2);
    }
    // Dispose method to clean up resources
    dispose() {
        this.capabilities = null;
        this.hardwareInfo = null;
        this.networkInfo = null;
        this.lastUpdate = 0;
        // Clear the singleton instance
        DeviceDetector.instance = null;
    }
}
