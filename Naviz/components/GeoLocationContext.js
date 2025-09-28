import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
const GeoLocationContext = ({ scene, onLocationChange, onSunPathUpdate }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [sunPath, setSunPath] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [useRealTime, setUseRealTime] = useState(true);
    const watchIdRef = useRef(null);
    const sunLightRef = useRef(null);
    // New state for enhancements
    const [weatherData, setWeatherData] = useState(null);
    const [locationHistory, setLocationHistory] = useState([]);
    const [favoriteLocations, setFavoriteLocations] = useState([]);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);
    const [weatherApiKey, setWeatherApiKey] = useState('YOUR_API_KEY'); // Should be from env/config
    // Initialize sun light
    useEffect(() => {
        const sunLight = new BABYLON.DirectionalLight("sunLight", new BABYLON.Vector3(-1, -1, -1), scene);
        sunLight.intensity = 1.0;
        sunLightRef.current = sunLight;
        return () => {
            sunLight.dispose();
        };
    }, [scene]);
    // Calculate sun position based on location and time
    const calculateSunPosition = (location, date) => {
        const lat = location.latitude * Math.PI / 180;
        const lng = location.longitude;
        // Calculate day of year
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date.getTime() - start.getTime();
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        // Calculate solar declination
        const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180) * Math.PI / 180;
        // Calculate equation of time (simplified)
        const equationOfTime = 4 * (0.000075 + 0.001868 * Math.cos((360 * dayOfYear / 365) * Math.PI / 180) -
            0.032077 * Math.sin((360 * dayOfYear / 365) * Math.PI / 180) -
            0.014615 * Math.cos(2 * (360 * dayOfYear / 365) * Math.PI / 180) -
            0.040849 * Math.sin(2 * (360 * dayOfYear / 365) * Math.PI / 180));
        // Calculate solar time
        const solarTime = date.getHours() + date.getMinutes() / 60 + equationOfTime / 60 + (lng - 0) / 15;
        // Calculate hour angle
        const hourAngle = (solarTime - 12) * 15 * Math.PI / 180;
        // Calculate solar elevation
        const elevation = Math.asin(Math.sin(lat) * Math.sin(declination) +
            Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle));
        // Calculate solar azimuth
        const azimuth = Math.atan2(Math.sin(hourAngle), Math.cos(hourAngle) * Math.sin(lat) - Math.tan(declination) * Math.cos(lat));
        // Calculate solar intensity (simplified)
        const airMass = 1 / (Math.cos(Math.PI / 2 - elevation) + 0.50572 * Math.pow(96.07995 - elevation * 180 / Math.PI, -1.6364));
        const intensity = Math.max(0, Math.exp(-0.000118 * 2100 * airMass) * Math.sin(elevation));
        return {
            azimuth: azimuth * 180 / Math.PI,
            elevation: elevation * 180 / Math.PI,
            intensity: Math.max(0.1, intensity)
        };
    };
    // Update sun light position and intensity
    const updateSunLight = (sunPathData) => {
        if (!sunLightRef.current)
            return;
        const azimuthRad = sunPathData.azimuth * Math.PI / 180;
        const elevationRad = sunPathData.elevation * Math.PI / 180;
        // Convert to Cartesian coordinates
        const x = -Math.cos(elevationRad) * Math.sin(azimuthRad);
        const y = Math.sin(elevationRad);
        const z = -Math.cos(elevationRad) * Math.cos(azimuthRad);
        sunLightRef.current.direction = new BABYLON.Vector3(x, y, z);
        sunLightRef.current.intensity = sunPathData.intensity;
        // Update shadow generator if it exists
        const shadowGenerator = sunLightRef.current.getShadowGenerator();
        if (shadowGenerator) {
            shadowGenerator.darkness = Math.max(0.1, 1 - sunPathData.intensity);
        }
    };
    // Load weather data from OpenWeatherMap API
    const loadWeatherData = async (location) => {
        if (!weatherApiKey || weatherApiKey === 'YOUR_API_KEY')
            return;
        setIsLoadingWeather(true);
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${weatherApiKey}&units=metric`);
            if (!response.ok)
                throw new Error('Weather API request failed');
            const data = await response.json();
            const weather = {
                temperature: data.main.temp,
                humidity: data.main.humidity,
                pressure: data.main.pressure,
                windSpeed: data.wind.speed,
                windDirection: data.wind.deg,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                visibility: data.visibility / 1000, // Convert to km
                uvIndex: data.uvi || undefined
            };
            setWeatherData(weather);
            // Add to location history
            const historyEntry = {
                id: Date.now().toString(),
                location: { ...location, timestamp: Date.now() },
                timestamp: Date.now(),
                weather
            };
            setLocationHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10 entries
        }
        catch (error) {
            console.error('Error loading weather data:', error);
            setWeatherData(null);
        }
        finally {
            setIsLoadingWeather(false);
        }
    };
    // Add location to favorites
    const addToFavorites = (location, name) => {
        const favoriteLocation = { ...location, name: name || `Location ${favoriteLocations.length + 1}` };
        setFavoriteLocations(prev => [...prev, favoriteLocation]);
    };
    // Remove from favorites
    const removeFromFavorites = (index) => {
        setFavoriteLocations(prev => prev.filter((_, i) => i !== index));
    };
    // Get current location
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }
        setIsTracking(true);
        navigator.geolocation.getCurrentPosition((position) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                altitude: position.coords.altitude || undefined,
                accuracy: position.coords.accuracy,
                timestamp: Date.now()
            };
            setCurrentLocation(location);
            onLocationChange?.(location);
            // Load weather data
            loadWeatherData(location);
            // Calculate and update sun path
            if (useRealTime) {
                const newSunPath = calculateSunPosition(location, currentTime);
                setSunPath(newSunPath);
                updateSunLight(newSunPath);
                onSunPathUpdate?.(newSunPath);
            }
            setIsTracking(false);
        }, (error) => {
            console.error('Error getting location:', error);
            alert('Error getting location: ' + error.message);
            setIsTracking(false);
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        });
    };
    // Start location tracking
    const startLocationTracking = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }
        setIsTracking(true);
        watchIdRef.current = navigator.geolocation.watchPosition((position) => {
            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                altitude: position.coords.altitude || undefined,
                accuracy: position.coords.accuracy,
                timestamp: Date.now()
            };
            setCurrentLocation(location);
            onLocationChange?.(location);
            // Load weather data periodically
            if (locationHistory.length === 0 || Date.now() - locationHistory[0].timestamp > 300000) { // 5 minutes
                loadWeatherData(location);
            }
            // Update sun path continuously
            if (useRealTime) {
                const newSunPath = calculateSunPosition(location, currentTime);
                setSunPath(newSunPath);
                updateSunLight(newSunPath);
                onSunPathUpdate?.(newSunPath);
            }
        }, (error) => {
            console.error('Error tracking location:', error);
            setIsTracking(false);
        }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
        });
    };
    // Stop location tracking
    const stopLocationTracking = () => {
        if (watchIdRef.current) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setIsTracking(false);
    };
    // Set manual location
    const setManualLocation = (latitude, longitude, altitude) => {
        const location = {
            latitude,
            longitude,
            altitude,
            accuracy: 0,
            timestamp: Date.now()
        };
        setCurrentLocation(location);
        onLocationChange?.(location);
        // Load weather data
        loadWeatherData(location);
        // Calculate sun path for manual location
        const newSunPath = calculateSunPosition(location, currentTime);
        setSunPath(newSunPath);
        updateSunLight(newSunPath);
        onSunPathUpdate?.(newSunPath);
    };
    // Update time for sun path calculation
    const updateTime = (date) => {
        setCurrentTime(date);
        if (currentLocation && useRealTime) {
            const newSunPath = calculateSunPosition(currentLocation, date);
            setSunPath(newSunPath);
            updateSunLight(newSunPath);
            onSunPathUpdate?.(newSunPath);
        }
    };
    // Cleanup
    useEffect(() => {
        return () => {
            stopLocationTracking();
        };
    }, []);
    return (_jsxs("div", { style: {
            padding: '16px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f1f5f9',
            maxHeight: '80vh',
            overflowY: 'auto'
        }, children: [_jsx("h3", { style: { margin: '0 0 16px 0', fontSize: '16px' }, children: "Geo-Location Context" }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: "OpenWeatherMap API Key" }), _jsx("input", { type: "password", value: weatherApiKey, onChange: (e) => setWeatherApiKey(e.target.value), placeholder: "Enter your API key", style: {
                            padding: '6px',
                            background: '#334155',
                            border: '1px solid #475569',
                            borderRadius: '4px',
                            color: '#f1f5f9',
                            fontSize: '12px',
                            width: '100%'
                        } })] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }, children: [_jsx("div", { style: {
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: currentLocation ? '#10b981' : '#ef4444'
                                } }), _jsx("span", { style: { fontSize: '14px' }, children: currentLocation ? 'Location Available' : 'No Location Set' })] }), currentLocation && (_jsxs("div", { style: { fontSize: '12px', color: '#94a3b8' }, children: [_jsxs("div", { children: ["Lat: ", currentLocation.latitude.toFixed(6)] }), _jsxs("div", { children: ["Lng: ", currentLocation.longitude.toFixed(6)] }), currentLocation.altitude && _jsxs("div", { children: ["Alt: ", currentLocation.altitude.toFixed(1), "m"] }), currentLocation.accuracy && _jsxs("div", { children: ["Accuracy: \u00B1", currentLocation.accuracy.toFixed(1), "m"] })] }))] }), weatherData && (_jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Weather" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }, children: [_jsxs("div", { style: { textAlign: 'center' }, children: [_jsxs("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }, children: [weatherData.temperature.toFixed(1), "\u00B0C"] }), _jsx("div", { style: { fontSize: '10px', color: '#94a3b8' }, children: "Temperature" })] }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsxs("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }, children: [weatherData.humidity, "%"] }), _jsx("div", { style: { fontSize: '10px', color: '#94a3b8' }, children: "Humidity" })] }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsxs("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }, children: [weatherData.windSpeed.toFixed(1), " m/s"] }), _jsx("div", { style: { fontSize: '10px', color: '#94a3b8' }, children: "Wind Speed" })] }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }, children: weatherData.description }), _jsx("div", { style: { fontSize: '10px', color: '#94a3b8' }, children: "Conditions" })] })] })] })), _jsxs("div", { style: { display: 'flex', gap: '8px', marginBottom: '16px' }, children: [_jsx("button", { onClick: getCurrentLocation, disabled: isTracking, style: {
                            padding: '8px 16px',
                            background: '#3b82f6',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            fontSize: '12px',
                            cursor: isTracking ? 'not-allowed' : 'pointer',
                            opacity: isTracking ? 0.6 : 1
                        }, children: isTracking ? 'Getting Location...' : 'Get Current Location' }), _jsx("button", { onClick: isTracking ? stopLocationTracking : startLocationTracking, style: {
                            padding: '8px 16px',
                            background: isTracking ? '#ef4444' : '#10b981',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'white',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }, children: isTracking ? 'Stop Tracking' : 'Start Tracking' })] }), _jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Manual Location" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "latitude-input", style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: "Latitude" }), _jsx("input", { id: "latitude-input", type: "number", placeholder: "Latitude", step: "0.000001", style: {
                                            padding: '6px',
                                            background: '#334155',
                                            border: '1px solid #475569',
                                            borderRadius: '4px',
                                            color: '#f1f5f9',
                                            fontSize: '12px',
                                            width: '100%'
                                        }, onChange: (e) => {
                                            const lat = parseFloat(e.target.value);
                                            if (!isNaN(lat) && currentLocation) {
                                                setManualLocation(lat, currentLocation.longitude, currentLocation.altitude);
                                            }
                                        } })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "longitude-input", style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: "Longitude" }), _jsx("input", { id: "longitude-input", type: "number", placeholder: "Longitude", step: "0.000001", style: {
                                            padding: '6px',
                                            background: '#334155',
                                            border: '1px solid #475569',
                                            borderRadius: '4px',
                                            color: '#f1f5f9',
                                            fontSize: '12px',
                                            width: '100%'
                                        }, onChange: (e) => {
                                            const lng = parseFloat(e.target.value);
                                            if (!isNaN(lng) && currentLocation) {
                                                setManualLocation(currentLocation.latitude, lng, currentLocation.altitude);
                                            }
                                        } })] })] }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx("button", { onClick: () => {
                                    // Default location (San Francisco)
                                    setManualLocation(37.7749, -122.4194, 0);
                                }, style: {
                                    padding: '6px 12px',
                                    background: '#6b7280',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }, children: "Set San Francisco" }), currentLocation && (_jsx("button", { onClick: () => addToFavorites(currentLocation), style: {
                                    padding: '6px 12px',
                                    background: '#f59e0b',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }, children: "Add to Favorites" }))] })] }), favoriteLocations.length > 0 && (_jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px', marginBottom: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Favorite Locations" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '4px' }, children: favoriteLocations.map((location, index) => (_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("button", { onClick: () => setManualLocation(location.latitude, location.longitude, location.altitude), style: {
                                        padding: '4px 8px',
                                        background: '#475569',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: '#f1f5f9',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                        flex: 1,
                                        textAlign: 'left'
                                    }, children: location.name || `Location ${index + 1}` }), _jsx("button", { onClick: () => removeFromFavorites(index), style: {
                                        padding: '4px 8px',
                                        background: '#ef4444',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: 'white',
                                        fontSize: '11px',
                                        cursor: 'pointer',
                                        marginLeft: '4px'
                                    }, children: "\u00D7" })] }, index))) })] })), sunPath && (_jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Sun Path" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px' }, children: [_jsxs("div", { style: { textAlign: 'center' }, children: [_jsxs("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }, children: [sunPath.azimuth.toFixed(1), "\u00B0"] }), _jsx("div", { style: { fontSize: '10px', color: '#94a3b8' }, children: "Azimuth" })] }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsxs("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }, children: [sunPath.elevation.toFixed(1), "\u00B0"] }), _jsx("div", { style: { fontSize: '10px', color: '#94a3b8' }, children: "Elevation" })] }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsxs("div", { style: { fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }, children: [(sunPath.intensity * 100).toFixed(0), "%"] }), _jsx("div", { style: { fontSize: '10px', color: '#94a3b8' }, children: "Intensity" })] })] }), _jsxs("div", { style: { fontSize: '12px', color: '#94a3b8' }, children: ["Sun position calculated for ", currentTime.toLocaleTimeString()] })] })), _jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px', marginTop: '16px' }, children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Time Controls" }), _jsx("div", { style: { marginBottom: '8px' }, children: _jsxs("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: [_jsx("input", { type: "checkbox", checked: useRealTime, onChange: (e) => setUseRealTime(e.target.checked) }), "Use Real Time"] }) }), !useRealTime && (_jsxs("div", { children: [_jsx("label", { htmlFor: "datetime-input", style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: "Custom Date & Time" }), _jsx("input", { id: "datetime-input", type: "datetime-local", value: currentTime.toISOString().slice(0, 16), onChange: (e) => updateTime(new Date(e.target.value)), style: {
                                    padding: '6px',
                                    background: '#334155',
                                    border: '1px solid #475569',
                                    borderRadius: '4px',
                                    color: '#f1f5f9',
                                    fontSize: '12px',
                                    width: '100%'
                                } })] }))] })] }));
};
export default GeoLocationContext;
