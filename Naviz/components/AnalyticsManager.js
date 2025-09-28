import { Mesh, Color3, StandardMaterial, DynamicTexture } from '@babylonjs/core';
export class AnalyticsManager {
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
        Object.defineProperty(this, "analyticsData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "usageHeatmap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "emotionData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "heartRateData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "clientEngagement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "sessionId", {
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
        Object.defineProperty(this, "heatmapTexture", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "emotionHeatmap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "engagementTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.engine = engine;
        this.scene = scene;
        this.featureManager = featureManager;
        this.sessionId = this.generateSessionId();
        this.config = {
            emotionTrackingEnabled: false,
            heartRateMonitoringEnabled: false,
            engagementTrackingEnabled: true,
            heatmapResolution: 64,
            dataRetentionDays: 30,
            workspaceTrackingEnabled: true,
            visualizationEnabled: true
        };
        this.initializeAnalytics();
    }
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    initializeAnalytics() {
        // Start engagement tracking
        this.startEngagementTracking();
        // Initialize heatmap texture
        this.initializeHeatmapTexture();
        // Set up periodic data cleanup
        setInterval(() => {
            this.cleanupOldData();
        }, 24 * 60 * 60 * 1000); // Daily cleanup
    }
    initializeHeatmapTexture() {
        // Create a plane for heatmap visualization
        const heatmapPlane = Mesh.CreateGround('analytics_heatmap', 20, 20, 2, this.scene);
        heatmapPlane.position.y = 0.1; // Slightly above ground
        heatmapPlane.setEnabled(false); // Hidden by default
        this.heatmapTexture = new DynamicTexture('heatmap_texture', {
            width: this.config.heatmapResolution,
            height: this.config.heatmapResolution
        }, this.scene, false);
        const heatmapMaterial = new StandardMaterial('heatmap_material', this.scene);
        heatmapMaterial.diffuseTexture = this.heatmapTexture;
        heatmapMaterial.emissiveTexture = this.heatmapTexture;
        heatmapMaterial.disableLighting = true;
        heatmapPlane.material = heatmapMaterial;
    }
    // Enhanced event tracking
    trackEvent(eventType, data, userId = 'anonymous') {
        const event = {
            userId,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            eventType,
            data,
        };
        this.analyticsData.push(event);
        // Update engagement metrics
        this.updateEngagementMetrics(userId, eventType, data);
        console.log('Tracked event:', this.sanitizeLogData(event));
    }
    // Enhanced usage heatmap tracking
    trackUsageHeatmap(position, intensity = 1) {
        const heatmapEntry = {
            position,
            intensity,
            timestamp: Date.now(),
        };
        this.usageHeatmap.push(heatmapEntry);
        // Update heatmap visualization
        this.updateHeatmapVisualization();
    }
    // Emotion tracking
    trackEmotion(userId, emotion, confidence, location, context = '') {
        if (!this.config.emotionTrackingEnabled)
            return;
        const emotionEntry = {
            userId,
            timestamp: Date.now(),
            emotion,
            confidence,
            location,
            context
        };
        this.emotionData.push(emotionEntry);
        // Update emotion heatmap
        const key = `${Math.round(location.x)}_${Math.round(location.z)}`;
        const currentValue = this.emotionHeatmap.get(key) || 0;
        this.emotionHeatmap.set(key, currentValue + this.getEmotionIntensity(emotion));
        console.log('Tracked emotion:', this.sanitizeLogData(emotionEntry));
    }
    // Heart rate monitoring
    trackHeartRate(userId, bpm, location) {
        if (!this.config.heartRateMonitoringEnabled)
            return;
        const stressLevel = this.calculateStressLevel(bpm);
        const heartRateEntry = {
            userId,
            timestamp: Date.now(),
            bpm,
            stressLevel,
            location
        };
        this.heartRateData.push(heartRateEntry);
        // Track significant stress changes
        if (stressLevel === 'high') {
            this.trackEvent('high_stress_detected', { bpm, location }, userId);
        }
        console.log('Tracked heart rate:', this.sanitizeLogData(heartRateEntry));
    }
    calculateStressLevel(bpm) {
        if (bpm < 70)
            return 'low';
        if (bpm > 100)
            return 'high';
        return 'medium';
    }
    getEmotionIntensity(emotion) {
        const intensityMap = {
            happy: 1.0,
            excited: 0.9,
            neutral: 0.5,
            confused: 0.3,
            frustrated: 0.2,
            bored: 0.1
        };
        return intensityMap[emotion];
    }
    // Engagement tracking
    startEngagementTracking() {
        if (!this.config.engagementTrackingEnabled)
            return;
        this.engagementTimer = window.setInterval(() => {
            this.updateEngagementData();
        }, 30000); // Update every 30 seconds
    }
    updateEngagementMetrics(userId, eventType, data) {
        // Find or create engagement record
        let engagement = this.clientEngagement.find(e => e.userId === userId);
        if (!engagement) {
            engagement = {
                userId,
                sessionDuration: 0,
                areasVisited: [],
                featuresUsed: [],
                interactionCount: 0,
                satisfactionScore: 5, // Default neutral
                timestamp: Date.now()
            };
            this.clientEngagement.push(engagement);
        }
        // Update metrics
        engagement.interactionCount++;
        if (eventType === 'area_visit' && data.area) {
            if (!engagement.areasVisited.includes(data.area)) {
                engagement.areasVisited.push(data.area);
            }
        }
        if (eventType === 'feature_use' && data.feature) {
            if (!engagement.featuresUsed.includes(data.feature)) {
                engagement.featuresUsed.push(data.feature);
            }
        }
        // Update satisfaction based on interactions
        this.updateSatisfactionScore(engagement, eventType, data);
    }
    updateSatisfactionScore(engagement, eventType, data) {
        let scoreChange = 0;
        switch (eventType) {
            case 'positive_feedback':
                scoreChange = 0.5;
                break;
            case 'negative_feedback':
                scoreChange = -0.5;
                break;
            case 'feature_use':
                scoreChange = 0.1;
                break;
            case 'long_interaction':
                scoreChange = 0.2;
                break;
            case 'confusion_detected':
                scoreChange = -0.3;
                break;
        }
        engagement.satisfactionScore = Math.max(1, Math.min(10, engagement.satisfactionScore + scoreChange));
    }
    updateEngagementData() {
        this.clientEngagement.forEach(engagement => {
            engagement.sessionDuration += 30; // Add 30 seconds
            engagement.timestamp = Date.now();
        });
    }
    // Heatmap visualization
    updateHeatmapVisualization() {
        if (!this.heatmapTexture)
            return;
        const context = this.heatmapTexture.getContext();
        const width = this.heatmapTexture.getSize().width;
        const height = this.heatmapTexture.getSize().height;
        // Clear canvas
        context.clearRect(0, 0, width, height);
        // Create heatmap data
        const heatmapData = this.generateHeatmapData(width, height);
        // Draw heatmap
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const intensity = heatmapData[y][x];
                if (intensity > 0) {
                    const alpha = Math.min(255, intensity * 255);
                    const color = this.getHeatmapColor(intensity);
                    context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha / 255})`;
                    context.fillRect(x, y, 1, 1);
                }
            }
        }
        this.heatmapTexture.update();
    }
    generateHeatmapData(width, height) {
        const data = Array(height).fill(0).map(() => Array(width).fill(0));
        // Convert world positions to texture coordinates
        this.usageHeatmap.forEach(entry => {
            const x = Math.floor((entry.position.x + 10) / 20 * width); // Assuming -10 to 10 world range
            const z = Math.floor((entry.position.z + 10) / 20 * height);
            if (x >= 0 && x < width && z >= 0 && z < height) {
                data[z][x] += entry.intensity;
            }
        });
        return data;
    }
    getHeatmapColor(intensity) {
        // Blue to red gradient
        const normalizedIntensity = Math.min(1, intensity / 10); // Normalize to 0-1
        return {
            r: Math.floor(normalizedIntensity * 255),
            g: 0,
            b: Math.floor((1 - normalizedIntensity) * 255)
        };
    }
    // Analytics methods
    getAnalyticsData() {
        return this.analyticsData;
    }
    getUsageHeatmap() {
        return this.usageHeatmap;
    }
    getEmotionData() {
        return this.emotionData;
    }
    getHeartRateData() {
        return this.heartRateData;
    }
    getClientEngagement() {
        return this.clientEngagement;
    }
    // Advanced analytics
    generateEngagementReport(userId) {
        const engagements = userId
            ? this.clientEngagement.filter(e => e.userId === userId)
            : this.clientEngagement;
        const totalSessions = engagements.length;
        const averageDuration = engagements.reduce((sum, e) => sum + e.sessionDuration, 0) / totalSessions;
        const averageSatisfaction = engagements.reduce((sum, e) => sum + e.satisfactionScore, 0) / totalSessions;
        // Most visited areas
        const areaCounts = {};
        engagements.forEach(e => {
            e.areasVisited.forEach(area => {
                areaCounts[area] = (areaCounts[area] || 0) + 1;
            });
        });
        // Most used features
        const featureCounts = {};
        engagements.forEach(e => {
            e.featuresUsed.forEach(feature => {
                featureCounts[feature] = (featureCounts[feature] || 0) + 1;
            });
        });
        return {
            totalSessions,
            averageDuration,
            averageSatisfaction,
            topAreas: Object.entries(areaCounts).sort(([, a], [, b]) => b - a).slice(0, 5),
            topFeatures: Object.entries(featureCounts).sort(([, a], [, b]) => b - a).slice(0, 5),
            engagementTrends: this.calculateEngagementTrends(engagements)
        };
    }
    generateEmotionReport() {
        const emotionCounts = {};
        const locationEmotions = {};
        this.emotionData.forEach(data => {
            emotionCounts[data.emotion] = (emotionCounts[data.emotion] || 0) + 1;
            const locationKey = `${Math.round(data.location.x)}_${Math.round(data.location.z)}`;
            if (!locationEmotions[locationKey]) {
                locationEmotions[locationKey] = [];
            }
            locationEmotions[locationKey].push(data.emotion);
        });
        // Find areas with most positive/negative emotions
        const areaSentiment = Object.entries(locationEmotions).map(([location, emotions]) => {
            const positive = emotions.filter(e => ['happy', 'excited'].includes(e)).length;
            const negative = emotions.filter(e => ['frustrated', 'bored', 'confused'].includes(e)).length;
            const sentiment = positive - negative;
            return { location, sentiment, total: emotions.length };
        });
        return {
            emotionDistribution: emotionCounts,
            topPositiveAreas: areaSentiment.filter(a => a.sentiment > 0).sort((a, b) => b.sentiment - a.sentiment).slice(0, 3),
            topNegativeAreas: areaSentiment.filter(a => a.sentiment < 0).sort((a, b) => a.sentiment - b.sentiment).slice(0, 3),
            emotionTrends: this.calculateEmotionTrends()
        };
    }
    generateStressReport() {
        const stressLevels = {};
        const timeBasedStress = {};
        this.heartRateData.forEach(data => {
            stressLevels[data.stressLevel] = (stressLevels[data.stressLevel] || 0) + 1;
            const hour = new Date(data.timestamp).getHours();
            if (!timeBasedStress[hour]) {
                timeBasedStress[hour] = [];
            }
            timeBasedStress[hour].push(data.bpm);
        });
        // Calculate average stress by hour
        const hourlyStress = Object.entries(timeBasedStress).map(([hour, bpms]) => ({
            hour: parseInt(hour),
            averageBPM: bpms.reduce((sum, bpm) => sum + bpm, 0) / bpms.length,
            stressIncidents: bpms.filter(bpm => bpm > 100).length
        }));
        return {
            stressDistribution: stressLevels,
            hourlyStress,
            peakStressHours: hourlyStress.sort((a, b) => b.stressIncidents - a.stressIncidents).slice(0, 3),
            recommendations: this.generateStressRecommendations(stressLevels)
        };
    }
    calculateEngagementTrends(engagements) {
        // Group by day and calculate trends
        const dailyEngagement = {};
        engagements.forEach(e => {
            const date = new Date(e.timestamp).toDateString();
            if (!dailyEngagement[date]) {
                dailyEngagement[date] = [];
            }
            dailyEngagement[date].push(e.satisfactionScore);
        });
        return Object.entries(dailyEngagement).map(([date, scores]) => ({
            date,
            averageSatisfaction: scores.reduce((sum, score) => sum + score, 0) / scores.length,
            sessionCount: scores.length
        }));
    }
    calculateEmotionTrends() {
        // Group emotions by hour
        const hourlyEmotions = {};
        this.emotionData.forEach(data => {
            const hour = new Date(data.timestamp).getHours();
            if (!hourlyEmotions[hour]) {
                hourlyEmotions[hour] = {};
            }
            hourlyEmotions[hour][data.emotion] = (hourlyEmotions[hour][data.emotion] || 0) + 1;
        });
        return Object.entries(hourlyEmotions).map(([hour, emotions]) => ({
            hour: parseInt(hour),
            emotions
        }));
    }
    generateStressRecommendations(stressLevels) {
        const recommendations = [];
        const highStressCount = stressLevels.high || 0;
        const totalReadings = Object.values(stressLevels).reduce((sum, count) => sum + count, 0);
        if (highStressCount / totalReadings > 0.3) {
            recommendations.push('Consider adding more relaxation areas in high-stress zones');
            recommendations.push('Implement calming lighting and audio in stressful areas');
        }
        if (stressLevels.medium > stressLevels.low) {
            recommendations.push('Monitor client stress levels during walkthroughs');
            recommendations.push('Add stress-reduction features like guided breathing exercises');
        }
        return recommendations;
    }
    // Visualization controls
    toggleHeatmapVisualization() {
        const heatmapPlane = this.scene.getMeshByName('analytics_heatmap');
        if (heatmapPlane) {
            heatmapPlane.setEnabled(!heatmapPlane.isEnabled());
            console.log(`Heatmap visualization ${heatmapPlane.isEnabled() ? 'enabled' : 'disabled'}`);
        }
    }
    sanitizeLogData(data) {
        if (typeof data === 'string') {
            return data.replace(/[\r\n\t]/g, '_');
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
    // Data cleanup
    cleanupOldData() {
        const cutoffTime = Date.now() - (this.config.dataRetentionDays * 24 * 60 * 60 * 1000);
        this.analyticsData = this.analyticsData.filter(data => data.timestamp >= cutoffTime);
        this.usageHeatmap = this.usageHeatmap.filter(data => data.timestamp >= cutoffTime);
        this.emotionData = this.emotionData.filter(data => data.timestamp >= cutoffTime);
        this.heartRateData = this.heartRateData.filter(data => data.timestamp >= cutoffTime);
        this.clientEngagement = this.clientEngagement.filter(data => data.timestamp >= cutoffTime);
    }
    // Configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    getConfig() {
        return this.config;
    }
    // Export comprehensive analytics
    exportAnalytics() {
        return JSON.stringify({
            analyticsData: this.analyticsData,
            usageHeatmap: this.usageHeatmap,
            emotionData: this.emotionData,
            heartRateData: this.heartRateData,
            clientEngagement: this.clientEngagement,
            config: this.config,
            reports: {
                engagement: this.generateEngagementReport(),
                emotion: this.generateEmotionReport(),
                stress: this.generateStressReport()
            }
        }, null, 2);
    }
    // Workspace-specific tracking methods
    trackWorkspaceEvent(event) {
        if (!this.config.workspaceTrackingEnabled)
            return;
        // Track as general analytics event
        this.trackEvent(`workspace_${event.eventType}`, {
            featureId: event.featureId,
            panelId: event.panelId,
            position: event.position,
            meshId: event.meshId,
            areaId: event.areaId,
            mode: event.mode
        }, event.userId);
        // Update engagement based on workspace interactions
        this.updateEngagementMetrics(event.userId, event.eventType, event);
        // Track usage heatmap for position-based events
        if (event.position && (event.eventType === 'camera_move' || event.eventType === 'mesh_select' || event.eventType === 'area_enter')) {
            this.trackUsageHeatmap(event.position, 0.5);
        }
        console.log('Tracked workspace event:', this.sanitizeLogData(event));
    }
    // Feature usage tracking
    trackFeatureUsage(featureId, userId = 'anonymous', position) {
        this.trackWorkspaceEvent({
            eventType: 'feature_toggle',
            featureId,
            position,
            timestamp: Date.now(),
            userId
        });
    }
    // Panel visibility tracking
    trackPanelVisibility(panelId, visible, userId = 'anonymous') {
        this.trackWorkspaceEvent({
            eventType: 'panel_visibility',
            panelId,
            timestamp: Date.now(),
            userId
        });
    }
    // Camera movement tracking
    trackCameraMovement(position, userId = 'anonymous') {
        this.trackWorkspaceEvent({
            eventType: 'camera_move',
            position,
            timestamp: Date.now(),
            userId
        });
    }
    // Mesh selection tracking
    trackMeshSelection(meshId, position, userId = 'anonymous') {
        this.trackWorkspaceEvent({
            eventType: 'mesh_select',
            meshId,
            position,
            timestamp: Date.now(),
            userId
        });
    }
    // Area entry tracking
    trackAreaEntry(areaId, position, userId = 'anonymous') {
        this.trackWorkspaceEvent({
            eventType: 'area_enter',
            areaId,
            position,
            timestamp: Date.now(),
            userId
        });
    }
    // Mode change tracking
    trackModeChange(mode, userId = 'anonymous') {
        this.trackWorkspaceEvent({
            eventType: 'mode_change',
            mode,
            timestamp: Date.now(),
            userId
        });
    }
    // Enhanced visualization methods for workspace
    createEngagementIndicators() {
        if (!this.config.visualizationEnabled)
            return;
        // Create visual indicators for high engagement areas
        const engagementReport = this.generateEngagementReport();
        const topAreas = engagementReport.topAreas || [];
        topAreas.forEach((areaData, index) => {
            const [areaId, count] = areaData;
            this.createEngagementIndicator(areaId, count, index);
        });
    }
    createEngagementIndicator(areaId, intensity, index) {
        // Create a small sphere indicator for engagement areas
        const indicator = Mesh.CreateSphere(`engagement_indicator_${areaId}`, 8, 0.2, this.scene);
        indicator.position.y = 2 + (index * 0.5); // Stack indicators vertically
        // Color based on intensity (green for high engagement)
        const material = new StandardMaterial(`engagement_material_${areaId}`, this.scene);
        const normalizedIntensity = Math.min(1, intensity / 10);
        material.diffuseColor = new Color3(0, normalizedIntensity, 0);
        material.emissiveColor = new Color3(0, normalizedIntensity * 0.3, 0);
        indicator.material = material;
        // Add text label
        const texture = new DynamicTexture(`engagement_label_${areaId}`, { width: 256, height: 64 }, this.scene, false);
        const context = texture.getContext();
        context.font = "24px Arial";
        context.fillStyle = "white";
        context.fillText(`${areaId}: ${intensity}`, 10, 40);
        texture.update();
        const labelMaterial = new StandardMaterial(`label_material_${areaId}`, this.scene);
        labelMaterial.diffuseTexture = texture;
        labelMaterial.disableLighting = true;
        const labelPlane = Mesh.CreatePlane(`engagement_label_plane_${areaId}`, 1, this.scene);
        labelPlane.position.copyFrom(indicator.position);
        labelPlane.position.z += 0.3;
        labelPlane.material = labelMaterial;
    }
    // Toggle engagement indicators
    toggleEngagementIndicators() {
        const indicators = this.scene.getMeshesByTags('engagement_indicator');
        const visible = indicators.length > 0 && indicators[0].isEnabled();
        indicators.forEach(mesh => mesh.setEnabled(!visible));
        console.log(`Engagement indicators ${!visible ? 'enabled' : 'disabled'}`);
    }
    // Generate workspace-specific reports
    generateWorkspaceReport() {
        const featureUsage = {};
        const panelUsage = {};
        const areaVisits = {};
        const modeUsage = {};
        this.analyticsData.forEach(event => {
            if (event.eventType.startsWith('workspace_')) {
                const data = event.data;
                if (event.eventType === 'workspace_feature_toggle' && data.featureId) {
                    featureUsage[data.featureId] = (featureUsage[data.featureId] || 0) + 1;
                }
                if (event.eventType === 'workspace_panel_visibility' && data.panelId) {
                    panelUsage[data.panelId] = (panelUsage[data.panelId] || 0) + 1;
                }
                if (event.eventType === 'workspace_area_enter' && data.areaId) {
                    areaVisits[data.areaId] = (areaVisits[data.areaId] || 0) + 1;
                }
                if (event.eventType === 'workspace_mode_change' && data.mode) {
                    modeUsage[data.mode] = (modeUsage[data.mode] || 0) + 1;
                }
            }
        });
        return {
            featureUsage: Object.entries(featureUsage).sort(([, a], [, b]) => b - a),
            panelUsage: Object.entries(panelUsage).sort(([, a], [, b]) => b - a),
            areaVisits: Object.entries(areaVisits).sort(([, a], [, b]) => b - a),
            modeUsage: Object.entries(modeUsage).sort(([, a], [, b]) => b - a),
            totalWorkspaceEvents: this.analyticsData.filter(e => e.eventType.startsWith('workspace_')).length
        };
    }
    // Real-time analytics updates
    enableRealTimeTracking() {
        if (!this.config.workspaceTrackingEnabled)
            return;
        // Track camera movements in real-time
        this.scene.onBeforeRenderObservable.add(() => {
            const camera = this.scene.activeCamera;
            if (camera) {
                this.trackCameraMovement(camera.position);
            }
        });
    }
    clearData() {
        this.analyticsData = [];
        this.usageHeatmap = [];
        this.emotionData = [];
        this.heartRateData = [];
        this.clientEngagement = [];
        this.emotionHeatmap.clear();
    }
    dispose() {
        if (this.engagementTimer) {
            clearInterval(this.engagementTimer);
        }
        if (this.heatmapTexture) {
            this.heatmapTexture.dispose();
        }
        const heatmapPlane = this.scene.getMeshByName('analytics_heatmap');
        if (heatmapPlane) {
            heatmapPlane.dispose();
        }
        this.clearData();
    }
}
