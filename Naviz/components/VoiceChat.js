import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Sound, Vector3, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';
const VoiceChat = ({ scene, isActive, xrManager }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioSources, setAudioSources] = useState(new Map());
    const [volume, setVolume] = useState(1.0);
    const [spatialAudio, setSpatialAudio] = useState(true);
    const [visualizationEnabled, setVisualizationEnabled] = useState(true);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);
    const streamRef = useRef(null);
    const animationFrameRef = useRef();
    // Initialize audio context
    useEffect(() => {
        if (isActive) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isActive]);
    // Real-time audio visualization update
    const updateVisualization = useCallback(() => {
        if (!analyserRef.current || !visualizationEnabled)
            return;
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);
        // Update visualizers for all audio sources
        audioSources.forEach((source) => {
            if (source.visualizer) {
                updateAudioVisualizer(source.visualizer, dataArray);
            }
        });
        animationFrameRef.current = requestAnimationFrame(updateVisualization);
    }, [audioSources, visualizationEnabled]);
    // Update audio visualizer mesh
    const updateAudioVisualizer = (visualizer, frequencyData) => {
        if (!visualizer.mesh)
            return;
        const average = frequencyData.reduce((a, b) => a + b) / frequencyData.length;
        const scale = Math.max(0.1, average / 255);
        visualizer.mesh.scaling.y = scale;
        visualizer.mesh.material.emissiveColor = new Color3(scale, scale * 0.5, scale * 0.2);
    };
    // Start recording
    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            if (audioContextRef.current) {
                microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256;
                microphoneRef.current.connect(analyserRef.current);
                // Create Babylon sound from microphone
                const sound = new Sound('microphone', null, scene, null, {
                    streaming: true,
                    spatialSound: spatialAudio,
                    volume: volume
                });
                // Create visualizer mesh
                const visualizerMesh = MeshBuilder.CreateCylinder('audioVisualizer', {
                    height: 2,
                    diameterTop: 0.5,
                    diameterBottom: 0.5
                }, scene);
                visualizerMesh.position = new Vector3(0, 1, 0);
                const visualizerMaterial = new StandardMaterial('visualizerMat', scene);
                visualizerMaterial.emissiveColor = new Color3(0, 0.5, 1);
                visualizerMaterial.alpha = 0.7;
                visualizerMesh.material = visualizerMaterial;
                const audioSource = {
                    id: 'local',
                    position: new Vector3(0, 1, 0),
                    sound: sound,
                    visualizer: { mesh: visualizerMesh },
                    isRecording: true
                };
                setAudioSources(prev => new Map(prev.set('local', audioSource)));
                setIsRecording(true);
                // Start visualization loop
                updateVisualization();
            }
        }
        catch (error) {
            console.error('Error starting recording:', error);
        }
    }, [scene, spatialAudio, volume, updateVisualization]);
    // Stop recording
    const stopRecording = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        audioSources.forEach((source) => {
            if (source.sound) {
                source.sound.dispose();
            }
            if (source.visualizer?.mesh) {
                source.visualizer.mesh.dispose();
            }
        });
        setAudioSources(new Map());
        setIsRecording(false);
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    }, [audioSources]);
    // Toggle recording
    const toggleRecording = useCallback(() => {
        if (isRecording) {
            stopRecording();
        }
        else {
            startRecording();
        }
    }, [isRecording, startRecording, stopRecording]);
    // Update volume
    const updateVolume = useCallback((newVolume) => {
        setVolume(newVolume);
        audioSources.forEach((source) => {
            if (source.sound) {
                source.sound.setVolume(newVolume);
            }
        });
    }, [audioSources]);
    // Toggle spatial audio
    const toggleSpatialAudio = useCallback(() => {
        setSpatialAudio(prev => !prev);
        audioSources.forEach((source) => {
            if (source.sound) {
                source.sound.spatialSound = !source.sound.spatialSound;
            }
        });
    }, [audioSources]);
    // Toggle visualization
    const toggleVisualization = useCallback(() => {
        setVisualizationEnabled(prev => !prev);
    }, []);
    if (!isActive)
        return null;
    return (_jsxs("div", { className: "fixed top-4 left-4 bg-slate-800 p-4 rounded-lg border border-slate-600 text-white z-50", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Voice Chat" }), _jsx("div", { className: "mb-4", children: _jsx("button", { onClick: toggleRecording, className: `px-4 py-2 rounded font-medium ${isRecording
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'}`, children: isRecording ? 'Stop Recording' : 'Start Recording' }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium mb-1", children: ["Volume: ", Math.round(volume * 100), "%"] }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.1", value: volume, onChange: (e) => updateVolume(parseFloat(e.target.value)), className: "w-full", title: "Volume control" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "spatialAudio", checked: spatialAudio, onChange: toggleSpatialAudio }), _jsx("label", { htmlFor: "spatialAudio", className: "text-sm", children: "Spatial Audio" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "checkbox", id: "visualization", checked: visualizationEnabled, onChange: toggleVisualization }), _jsx("label", { htmlFor: "visualization", className: "text-sm", children: "Audio Visualization" })] })] }), _jsxs("div", { className: "mt-4 text-sm text-slate-300", children: ["Status: ", isRecording ? 'Recording' : 'Inactive', audioSources.size > 0 && ` (${audioSources.size} source${audioSources.size > 1 ? 's' : ''})`] })] }));
};
export default VoiceChat;
