import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import * as BABYLON from '@babylonjs/core';
export const ARAnchorUI = ({ arAnchors, cloudManager, gpsUtils, onAnchorSelected, onAnchorPlaced, onAnchorRemoved }) => {
    const [isPlacingAnchor, setIsPlacingAnchor] = useState(false);
    const [selectedAnchor, setSelectedAnchor] = useState(null);
    const [anchors, setAnchors] = useState([]);
    const [cloudAnchors, setCloudAnchors] = useState([]);
    const [showAnchorForm, setShowAnchorForm] = useState(false);
    const [formData, setFormData] = useState({
        modelUrl: '',
        gpsCoordinates: undefined
    });
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [syncStatus, setSyncStatus] = useState('idle');
    // Update anchors list
    const updateAnchors = useCallback(() => {
        const localAnchors = arAnchors.getAnchors();
        const cloudAnchorsList = cloudManager.getCloudAnchors();
        setAnchors(localAnchors);
        setCloudAnchors(cloudAnchorsList);
    }, [arAnchors, cloudManager]);
    // Set up event listeners
    useEffect(() => {
        updateAnchors();
        // Listen for online/offline status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        // Set up cloud manager callbacks
        cloudManager.setCallbacks({
            onAnchorSynced: (anchor) => {
                console.log('Anchor synced:', anchor.cloudId?.replace(/[\r\n\t]/g, '_'));
                updateAnchors();
                setSyncStatus('success');
                setTimeout(() => setSyncStatus('idle'), 2000);
            },
            onAnchorConflict: (local, remote) => {
                console.warn('Anchor conflict detected:', { local, remote });
                // Handle conflict resolution UI here
            },
            onSyncError: (error) => {
                const sanitizedError = typeof error === 'string' ? error.replace(/[\r\n\t]/g, '_') : error;
                console.error('Sync error:', sanitizedError);
                setSyncStatus('error');
                setTimeout(() => setSyncStatus('idle'), 3000);
            },
            onConnectivityChanged: (online) => {
                setIsOnline(online);
            }
        });
        // Set up AR anchor callbacks
        arAnchors.setCallbacks({
            onAnchorPlaced: (anchor) => {
                updateAnchors();
                onAnchorPlaced?.(anchor);
            },
            onAnchorRemoved: (anchorId) => {
                updateAnchors();
                onAnchorRemoved?.(anchorId);
            }
        });
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [updateAnchors, cloudManager, arAnchors, onAnchorPlaced, onAnchorRemoved]);
    // Handle anchor placement
    const handlePlaceAnchor = async () => {
        if (!arAnchors.isAREnabled()) {
            alert('AR session is not active. Please start AR first.');
            return;
        }
        setIsPlacingAnchor(true);
        setShowAnchorForm(true);
    };
    // Handle form submission for anchor placement
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Get current camera position as anchor position
            const scene = arAnchors.scene;
            if (!scene) {
                alert('No scene found');
                return;
            }
            const camera = scene.activeCamera;
            if (!camera) {
                alert('No active camera found');
                return;
            }
            // Calculate position in front of camera
            const cameraDirection = camera.getDirection(BABYLON.Vector3.Forward());
            const anchorPosition = camera.position.add(cameraDirection.scale(2));
            const rotation = camera.rotationQuaternion || BABYLON.Quaternion.Identity();
            // Create anchor through cloud manager for persistence
            const anchor = {
                id: `anchor_${Date.now()}`,
                name: 'New Anchor',
                position: anchorPosition,
                rotation,
                scale: BABYLON.Vector3.One(),
                lastSync: new Date(),
                isPersistent: true,
                modelUrl: formData.modelUrl,
                gpsCoordinates: formData.gpsCoordinates,
                userId: 'user1',
                roomId: 'room1',
                sessionId: 'session1',
                deviceId: 'device1',
                version: 1
            };
            await cloudManager.createAnchor(anchor);
            setShowAnchorForm(false);
            setFormData({ modelUrl: '', gpsCoordinates: undefined });
            updateAnchors();
        }
        catch (error) {
            const sanitizedError = typeof error === 'string' ? error.replace(/[\r\n\t]/g, '_') : error;
            console.error('Failed to place anchor:', sanitizedError);
            alert('Failed to place anchor. Please try again.');
        }
        finally {
            setIsPlacingAnchor(false);
        }
    };
    // Handle anchor selection
    const handleAnchorSelect = (anchor) => {
        setSelectedAnchor(anchor);
        onAnchorSelected?.(anchor);
    };
    // Handle anchor removal
    const handleRemoveAnchor = async (anchorId) => {
        if (confirm('Are you sure you want to remove this anchor?')) {
            const result = await cloudManager.removeAnchor(anchorId);
            if (result.success) {
                if (selectedAnchor?.id === anchorId) {
                    setSelectedAnchor(null);
                }
                updateAnchors();
            }
            else {
                console.error('Remove failed:', result.errors);
            }
        }
    };
    // Handle manual sync
    const handleSync = async () => {
        setSyncStatus('syncing');
        try {
            await cloudManager.syncAllAnchors();
            setSyncStatus('success');
            updateAnchors();
        }
        catch (error) {
            setSyncStatus('error');
            console.error('Sync error:', error);
        }
        setTimeout(() => setSyncStatus('idle'), 2000);
    };
    // Get GPS coordinates for current position
    const handleGetCurrentGPS = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const gps = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    alt: position.coords.altitude || 0
                };
                setFormData(prev => ({ ...prev, gpsCoordinates: gps }));
            }, (error) => {
                const sanitizedError = error && typeof error === 'object' && 'message' in error
                    ? error.message.replace(/[\r\n\t]/g, '_')
                    : String(error).replace(/[\r\n\t]/g, '_');
                console.error('Failed to get GPS position:', sanitizedError);
                alert('Failed to get current GPS position');
            }, { enableHighAccuracy: true, timeout: 10000 });
        }
        else {
            alert('Geolocation is not supported by this browser');
        }
    };
    return (_jsxs("div", { className: "ar-anchor-ui", children: [_jsxs("div", { className: "flex items-center justify-between p-4 bg-gray-800 text-white", children: [_jsx("h3", { className: "text-lg font-semibold", children: "AR Cloud Anchors" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}` }), _jsx("span", { className: "text-sm", children: isOnline ? 'Online' : 'Offline' }), _jsx("button", { onClick: handleSync, disabled: syncStatus === 'syncing' || !isOnline, className: `px-3 py-1 rounded text-sm ${syncStatus === 'syncing'
                                    ? 'bg-blue-600 cursor-not-allowed'
                                    : syncStatus === 'success'
                                        ? 'bg-green-600'
                                        : syncStatus === 'error'
                                            ? 'bg-red-600'
                                            : 'bg-blue-500 hover:bg-blue-600'}`, children: syncStatus === 'syncing' ? 'Syncing...' :
                                    syncStatus === 'success' ? 'Synced' :
                                        syncStatus === 'error' ? 'Error' : 'Sync' })] })] }), _jsx("div", { className: "p-4 border-b", children: _jsx("button", { onClick: handlePlaceAnchor, disabled: isPlacingAnchor || !arAnchors.isAREnabled(), className: "w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded", children: isPlacingAnchor ? 'Placing Anchor...' : 'Place New Anchor' }) }), showAnchorForm && (_jsx("div", { className: "p-4 border-b bg-gray-50", children: _jsxs("form", { onSubmit: handleFormSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "3D Model URL (optional)" }), _jsx("input", { type: "url", value: formData.modelUrl, onChange: (e) => setFormData(prev => ({ ...prev, modelUrl: e.target.value })), placeholder: "https://example.com/model.glb", className: "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "GPS Coordinates (optional)" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "number", step: "any", placeholder: "Latitude", value: formData.gpsCoordinates?.lat || '', onChange: (e) => setFormData(prev => ({
                                                ...prev,
                                                gpsCoordinates: {
                                                    lat: parseFloat(e.target.value),
                                                    lng: prev.gpsCoordinates?.lng || 0,
                                                    alt: prev.gpsCoordinates?.alt || 0
                                                }
                                            })), className: "flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("input", { type: "number", step: "any", placeholder: "Longitude", value: formData.gpsCoordinates?.lng || '', onChange: (e) => setFormData(prev => ({
                                                ...prev,
                                                gpsCoordinates: {
                                                    lat: prev.gpsCoordinates?.lat || 0,
                                                    lng: parseFloat(e.target.value),
                                                    alt: prev.gpsCoordinates?.alt || 0
                                                }
                                            })), className: "flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("input", { type: "number", step: "any", placeholder: "Altitude", value: formData.gpsCoordinates?.alt || '', onChange: (e) => setFormData(prev => ({
                                                ...prev,
                                                gpsCoordinates: {
                                                    lat: prev.gpsCoordinates?.lat || 0,
                                                    lng: prev.gpsCoordinates?.lng || 0,
                                                    alt: parseFloat(e.target.value)
                                                }
                                            })), className: "px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("button", { type: "button", onClick: handleGetCurrentGPS, className: "px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded", children: "\uD83D\uDCCD" })] })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { type: "submit", className: "flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded", children: "Place Anchor" }), _jsx("button", { type: "button", onClick: () => setShowAnchorForm(false), className: "px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded", children: "Cancel" })] })] }) })), _jsx("div", { className: "flex-1 overflow-y-auto", children: _jsxs("div", { className: "p-4", children: [_jsxs("h4", { className: "text-md font-semibold mb-3", children: ["Anchors (", anchors.length, ")"] }), anchors.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-8", children: "No anchors placed yet" })) : (_jsx("div", { className: "space-y-2", children: anchors.map((anchor) => {
                                const cloudAnchor = cloudAnchors.find(ca => ca.id === anchor.id);
                                return (_jsx("div", { className: `p-3 border rounded cursor-pointer transition-colors ${selectedAnchor?.id === anchor.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'}`, onClick: () => handleAnchorSelect(anchor), children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "font-medium", children: ["Anchor ", anchor.id.slice(-8)] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Position: (", anchor.position.x.toFixed(2), ", ", anchor.position.y.toFixed(2), ", ", anchor.position.z.toFixed(2), ")"] }), anchor.gpsCoordinates && (_jsxs("div", { className: "text-sm text-gray-600", children: ["GPS: ", anchor.gpsCoordinates.lat.toFixed(6), ", ", anchor.gpsCoordinates.lng.toFixed(6)] })), cloudAnchor && (_jsxs("div", { className: "text-xs text-gray-500 mt-1", children: ["Synced \u2022 v", cloudAnchor.version || 1, " \u2022 ", cloudAnchor.deviceId?.slice(-8) || 'unknown'] }))] }), _jsx("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    handleRemoveAnchor(anchor.id);
                                                }, className: "ml-2 p-1 text-red-500 hover:text-red-700", children: "\uD83D\uDDD1\uFE0F" })] }) }, anchor.id));
                            }) }))] }) }), selectedAnchor && (_jsxs("div", { className: "p-4 border-t bg-gray-50", children: [_jsx("h4", { className: "text-md font-semibold mb-2", children: "Selected Anchor Details" }), _jsxs("div", { className: "text-sm space-y-1", children: [_jsxs("div", { children: [_jsx("strong", { children: "ID:" }), " ", selectedAnchor.id] }), _jsxs("div", { children: [_jsx("strong", { children: "User:" }), " ", selectedAnchor.userId] }), _jsxs("div", { children: [_jsx("strong", { children: "Room:" }), " ", selectedAnchor.roomId] }), _jsxs("div", { children: [_jsx("strong", { children: "Timestamp:" }), " ", new Date(selectedAnchor.timestamp || Date.now()).toLocaleString()] }), selectedAnchor.gpsCoordinates && (_jsxs("div", { children: [_jsx("strong", { children: "GPS:" }), " ", selectedAnchor.gpsCoordinates.lat.toFixed(6), ", ", selectedAnchor.gpsCoordinates.lng.toFixed(6)] })), selectedAnchor.modelUrl && (_jsxs("div", { children: [_jsx("strong", { children: "Model:" }), " ", selectedAnchor.modelUrl] })), selectedAnchor.sessionId && (_jsxs("div", { children: [_jsx("strong", { children: "Session:" }), " ", selectedAnchor.sessionId] })), selectedAnchor.deviceId && (_jsxs("div", { children: [_jsx("strong", { children: "Device:" }), " ", selectedAnchor.deviceId.slice(-8)] }))] })] }))] }));
};
export default ARAnchorUI;
