import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { fetchWeatherByCoords } from '../src/utils/weatherApi';
class WeatherSystemManager {
    constructor(scene) {
        Object.defineProperty(this, "scene", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "particleSystem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "emitter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "currentWeather", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'sunny'
        });
        Object.defineProperty(this, "intensity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1.0
        });
        Object.defineProperty(this, "realtimeInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "weatherConditions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [
                {
                    id: 'sunny',
                    name: 'Sunny',
                    icon: '☀️',
                    description: 'Clear blue sky with bright sunlight',
                    skyColor: new BABYLON.Color3(0.5, 0.7, 1.0),
                    fogColor: new BABYLON.Color3(0.9, 0.9, 0.95),
                    fogDensity: 0.0
                },
                {
                    id: 'cloudy',
                    name: 'Cloudy',
                    icon: '☁️',
                    description: 'Overcast with diffused lighting',
                    skyColor: new BABYLON.Color3(0.7, 0.8, 0.9),
                    fogColor: new BABYLON.Color3(0.8, 0.8, 0.85),
                    fogDensity: 0.001
                },
                {
                    id: 'rainy',
                    name: 'Rainy',
                    icon: '🌧️',
                    description: 'Heavy rain with water droplets',
                    skyColor: new BABYLON.Color3(0.4, 0.5, 0.6),
                    fogColor: new BABYLON.Color3(0.6, 0.7, 0.8),
                    fogDensity: 0.005,
                    particleSystem: 'rain'
                },
                {
                    id: 'foggy',
                    name: 'Foggy',
                    icon: '🌫️',
                    description: 'Dense fog reducing visibility',
                    skyColor: new BABYLON.Color3(0.8, 0.8, 0.85),
                    fogColor: new BABYLON.Color3(0.9, 0.9, 0.95),
                    fogDensity: 0.02
                },
                {
                    id: 'snowy',
                    name: 'Snowy',
                    icon: '❄️',
                    description: 'Falling snow with winter atmosphere',
                    skyColor: new BABYLON.Color3(0.9, 0.9, 0.95),
                    fogColor: new BABYLON.Color3(0.95, 0.95, 0.98),
                    fogDensity: 0.008,
                    particleSystem: 'snow'
                },
                {
                    id: 'stormy',
                    name: 'Stormy',
                    icon: '⛈️',
                    description: 'Thunderstorm with heavy rain',
                    skyColor: new BABYLON.Color3(0.3, 0.4, 0.5),
                    fogColor: new BABYLON.Color3(0.5, 0.6, 0.7),
                    fogDensity: 0.01,
                    particleSystem: 'rain'
                }
            ]
        });
        this.scene = scene;
    }
    createRainSystem() {
        // Create emitter for rain
        this.emitter = BABYLON.MeshBuilder.CreateBox("rainEmitter", { size: 100 }, this.scene);
        this.emitter.position.y = 50;
        this.emitter.isVisible = false;
        // Create particle system for rain
        const particleSystem = new BABYLON.ParticleSystem("rain", 5000, this.scene);
        particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", this.scene);
        particleSystem.emitter = this.emitter;
        particleSystem.minEmitBox = new BABYLON.Vector3(-50, 0, -50);
        particleSystem.maxEmitBox = new BABYLON.Vector3(50, 0, 50);
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1, 1);
        particleSystem.color2 = new BABYLON.Color4(0.5, 0.6, 0.9, 1);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0);
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.3;
        particleSystem.minLifeTime = 0.5;
        particleSystem.maxLifeTime = 1.5;
        particleSystem.emitRate = 500;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
        particleSystem.direction1 = new BABYLON.Vector3(-0.2, -1, -0.2);
        particleSystem.direction2 = new BABYLON.Vector3(0.2, -1, 0.2);
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;
        particleSystem.minEmitPower = 10;
        particleSystem.maxEmitPower = 20;
        particleSystem.updateSpeed = 0.01;
        return particleSystem;
    }
    createSnowSystem() {
        // Create emitter for snow
        this.emitter = BABYLON.MeshBuilder.CreateBox("snowEmitter", { size: 100 }, this.scene);
        this.emitter.position.y = 50;
        this.emitter.isVisible = false;
        // Create particle system for snow
        const particleSystem = new BABYLON.ParticleSystem("snow", 3000, this.scene);
        particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", this.scene);
        particleSystem.emitter = this.emitter;
        particleSystem.minEmitBox = new BABYLON.Vector3(-50, 0, -50);
        particleSystem.maxEmitBox = new BABYLON.Vector3(50, 0, 50);
        particleSystem.color1 = new BABYLON.Color4(1, 1, 1, 1);
        particleSystem.color2 = new BABYLON.Color4(0.9, 0.9, 1, 1);
        particleSystem.colorDead = new BABYLON.Color4(0.8, 0.8, 0.9, 0);
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.15;
        particleSystem.minLifeTime = 2;
        particleSystem.maxLifeTime = 4;
        particleSystem.emitRate = 300;
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        particleSystem.gravity = new BABYLON.Vector3(0, -1, 0);
        particleSystem.direction1 = new BABYLON.Vector3(-0.1, -0.5, -0.1);
        particleSystem.direction2 = new BABYLON.Vector3(0.1, -0.5, 0.1);
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI / 2;
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.01;
        return particleSystem;
    }
    applyWeather(weatherId) {
        const weather = this.weatherConditions.find(w => w.id === weatherId);
        if (!weather)
            return;
        this.currentWeather = weatherId;
        // Apply sky color
        if (this.scene.clearColor) {
            this.scene.clearColor = new BABYLON.Color4(weather.skyColor.r, weather.skyColor.g, weather.skyColor.b, 1.0);
        }
        // Apply fog
        this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
        this.scene.fogColor = weather.fogColor;
        this.scene.fogDensity = weather.fogDensity * this.intensity;
        // Dispose existing particle system
        if (this.particleSystem) {
            this.particleSystem.dispose();
            this.particleSystem = null;
        }
        if (this.emitter) {
            this.emitter.dispose();
            this.emitter = null;
        }
        // Create new particle system if needed
        if (weather.particleSystem === 'rain') {
            this.particleSystem = this.createRainSystem();
            this.particleSystem.emitRate *= this.intensity;
            this.particleSystem.start();
        }
        else if (weather.particleSystem === 'snow') {
            this.particleSystem = this.createSnowSystem();
            this.particleSystem.emitRate *= this.intensity;
            this.particleSystem.start();
        }
        console.log(`Weather changed to: ${weather.name}`);
    }
    adjustIntensity(newIntensity) {
        this.intensity = newIntensity;
        // Update fog density
        const weather = this.weatherConditions.find(w => w.id === this.currentWeather);
        if (weather) {
            this.scene.fogDensity = weather.fogDensity * this.intensity;
        }
        // Update particle system
        if (this.particleSystem) {
            const baseRate = this.particleSystem.name === 'rain' ? 500 : 300;
            this.particleSystem.emitRate = baseRate * this.intensity;
        }
    }
    startRealtimeSimulation() {
        if (this.realtimeInterval)
            return;
        this.realtimeInterval = window.setInterval(() => {
            // Randomly adjust intensity for dynamic effect
            const variation = (Math.random() - 0.5) * 0.2; // ±0.1 variation
            const newIntensity = Math.max(0.1, Math.min(2.0, this.intensity + variation));
            this.adjustIntensity(newIntensity);
            // Occasionally change weather (10% chance every 5 seconds)
            if (Math.random() < 0.1) {
                const randomWeather = this.weatherConditions[Math.floor(Math.random() * this.weatherConditions.length)];
                this.applyWeather(randomWeather.id);
            }
        }, 5000);
    }
    stopRealtimeSimulation() {
        if (this.realtimeInterval) {
            clearInterval(this.realtimeInterval);
            this.realtimeInterval = null;
        }
    }
    dispose() {
        this.stopRealtimeSimulation();
        if (this.particleSystem) {
            this.particleSystem.dispose();
            this.particleSystem = null;
        }
        if (this.emitter) {
            this.emitter.dispose();
            this.emitter = null;
        }
    }
    getCurrentWeather() {
        return this.currentWeather;
    }
    getIntensity() {
        return this.intensity;
    }
    getWeatherConditions() {
        return this.weatherConditions;
    }
}
const WeatherSystem = ({ scene }) => {
    const [selectedWeather, setSelectedWeather] = useState('sunny');
    const [intensity, setIntensity] = useState(1.0);
    const [isRealtimeEnabled, setIsRealtimeEnabled] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [useLiveWeather, setUseLiveWeather] = useState(false);
    const weatherManagerRef = useRef(null);
    // Initialize weather system
    useEffect(() => {
        if (scene && !weatherManagerRef.current) {
            weatherManagerRef.current = new WeatherSystemManager(scene);
            weatherManagerRef.current.applyWeather('sunny');
        }
        return () => {
            if (weatherManagerRef.current) {
                weatherManagerRef.current.dispose();
                weatherManagerRef.current = null;
            }
        };
    }, [scene]);
    // Fetch live weather data if enabled
    useEffect(() => {
        if (!useLiveWeather || !isActive)
            return;
        if (!navigator.geolocation) {
            console.warn('Geolocation is not supported by this browser.');
            return;
        }
        const fetchLiveWeather = async (lat, lon) => {
            const data = await fetchWeatherByCoords(lat, lon);
            if (data && weatherManagerRef.current) {
                // Map real weather to preset
                const mainWeather = data.weather[0]?.main.toLowerCase() || 'sunny';
                let mappedWeather = 'sunny';
                if (mainWeather.includes('rain'))
                    mappedWeather = 'rainy';
                else if (mainWeather.includes('cloud'))
                    mappedWeather = 'cloudy';
                else if (mainWeather.includes('snow'))
                    mappedWeather = 'snowy';
                else if (mainWeather.includes('fog') || mainWeather.includes('mist'))
                    mappedWeather = 'foggy';
                else if (mainWeather.includes('storm') || mainWeather.includes('thunder'))
                    mappedWeather = 'stormy';
                else if (mainWeather.includes('clear'))
                    mappedWeather = 'sunny';
                setSelectedWeather(mappedWeather);
                weatherManagerRef.current.applyWeather(mappedWeather);
                // Optionally adjust intensity based on precipitation or other data
                weatherManagerRef.current.adjustIntensity(1.0);
            }
        };
        navigator.geolocation.getCurrentPosition((position) => {
            fetchLiveWeather(position.coords.latitude, position.coords.longitude);
        }, (error) => {
            console.error('Error getting geolocation:', error);
        });
    }, [useLiveWeather, isActive]);
    // Handle weather changes
    useEffect(() => {
        if (weatherManagerRef.current && isActive && !useLiveWeather) {
            weatherManagerRef.current.applyWeather(selectedWeather);
        }
    }, [selectedWeather, isActive, useLiveWeather]);
    // Handle intensity changes
    useEffect(() => {
        if (weatherManagerRef.current && isActive) {
            weatherManagerRef.current.adjustIntensity(intensity);
        }
    }, [intensity, isActive]);
    // Handle realtime simulation
    useEffect(() => {
        if (weatherManagerRef.current && isActive) {
            if (isRealtimeEnabled) {
                weatherManagerRef.current.startRealtimeSimulation();
            }
            else {
                weatherManagerRef.current.stopRealtimeSimulation();
            }
        }
        return () => {
            if (weatherManagerRef.current) {
                weatherManagerRef.current.stopRealtimeSimulation();
            }
        };
    }, [isRealtimeEnabled, isActive]);
    const toggleWeatherSystem = () => {
        setIsActive(!isActive);
        if (!isActive) {
            // Activating - apply current settings
            if (weatherManagerRef.current) {
                weatherManagerRef.current.applyWeather(selectedWeather);
                weatherManagerRef.current.adjustIntensity(intensity);
                if (isRealtimeEnabled) {
                    weatherManagerRef.current.startRealtimeSimulation();
                }
            }
        }
        else {
            // Deactivating - reset to default
            if (weatherManagerRef.current) {
                weatherManagerRef.current.applyWeather('sunny');
                weatherManagerRef.current.adjustIntensity(1.0);
                weatherManagerRef.current.stopRealtimeSimulation();
            }
        }
    };
    const resetWeather = () => {
        setSelectedWeather('sunny');
        setIntensity(1.0);
        setIsRealtimeEnabled(false);
        setUseLiveWeather(false);
        if (weatherManagerRef.current) {
            weatherManagerRef.current.applyWeather('sunny');
            weatherManagerRef.current.adjustIntensity(1.0);
            weatherManagerRef.current.stopRealtimeSimulation();
        }
    };
    const weatherConditions = weatherManagerRef.current?.getWeatherConditions() || [];
    return (_jsxs("div", { style: {
            padding: '16px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f1f5f9',
            maxWidth: '320px'
        }, children: [_jsx("h3", { style: { margin: '0 0 16px 0', fontSize: '16px' }, children: "Weather System" }), _jsx("div", { style: { marginBottom: '16px' }, children: _jsx("button", { onClick: toggleWeatherSystem, style: {
                        padding: '8px 16px',
                        background: isActive ? '#dc2626' : '#10b981',
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '14px',
                        cursor: 'pointer'
                    }, children: isActive ? 'Disable Weather' : 'Enable Weather' }) }), _jsx("div", { style: { marginBottom: '16px' }, children: _jsxs("label", { style: { fontSize: '14px', cursor: 'pointer' }, children: [_jsx("input", { type: "checkbox", checked: useLiveWeather, onChange: (e) => setUseLiveWeather(e.target.checked), disabled: !isActive, style: { marginRight: '8px' } }), "Use Live Weather Data (Geolocation)"] }) }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 8px 0', fontSize: '14px' }, children: "Weather Conditions" }), _jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }, children: weatherConditions.map((weather) => (_jsxs("button", { onClick: () => setSelectedWeather(weather.id), disabled: useLiveWeather, style: {
                                padding: '8px',
                                background: selectedWeather === weather.id ? '#3b82f6' : '#334155',
                                border: '1px solid #475569',
                                borderRadius: '4px',
                                color: '#f1f5f9',
                                fontSize: '12px',
                                cursor: useLiveWeather ? 'not-allowed' : 'pointer',
                                textAlign: 'left'
                            }, children: [_jsx("div", { style: { fontSize: '16px', marginBottom: '2px' }, children: weather.icon }), _jsx("div", { style: { fontWeight: 'bold', marginBottom: '2px' }, children: weather.name }), _jsx("div", { style: { fontSize: '10px', opacity: 0.8 }, children: weather.description })] }, weather.id))) })] }), _jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Weather Controls" }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: ["Intensity: ", intensity.toFixed(1), "x"] }), _jsx("input", { type: "range", min: "0.1", max: "2.0", step: "0.1", value: intensity, onChange: (e) => setIntensity(parseFloat(e.target.value)), disabled: useLiveWeather, style: { width: '100%' }, "aria-label": "Weather Intensity" })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: [_jsx("input", { type: "checkbox", checked: isRealtimeEnabled, onChange: (e) => setIsRealtimeEnabled(e.target.checked), disabled: !isActive, "aria-label": "Enable Ultra Pro Realtime Weather Simulation" }), "Ultra Pro Realtime Simulation"] }), _jsx("div", { style: { fontSize: '10px', opacity: 0.7, marginTop: '4px' }, children: "Dynamic weather changes and intensity variations" })] })] }), _jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 8px 0', fontSize: '14px' }, children: "Current Settings" }), _jsxs("div", { style: { fontSize: '12px', color: '#94a3b8' }, children: [_jsxs("div", { children: ["Weather: ", weatherConditions.find(w => w.id === selectedWeather)?.name || 'Sunny'] }), _jsxs("div", { children: ["Intensity: ", intensity.toFixed(1), "x"] }), _jsxs("div", { children: ["Realtime: ", isRealtimeEnabled ? 'Enabled' : 'Disabled'] }), _jsxs("div", { children: ["Live Data: ", useLiveWeather ? 'Enabled' : 'Disabled'] })] })] }), _jsx("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px' }, children: _jsx("button", { onClick: resetWeather, style: {
                        padding: '8px 16px',
                        background: '#6b7280',
                        border: '1px solid #9ca3af',
                        borderRadius: '4px',
                        color: '#f1f5f9',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }, children: "Reset to Default" }) })] }));
};
export default WeatherSystem;
