import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Eye, EyeOff } from 'lucide-react';

export const AnimationTimeline = ({ animationManager, selectedObject, onSequenceCreate, onSequencePlay }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(120);
    const [sequences, setSequences] = useState([]);
    const [selectedSequence, setSelectedSequence] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [keyframes, setKeyframes] = useState([]);
    const [previewMode, setPreviewMode] = useState(false);
    const [speed, setSpeed] = useState(1.0);
    const [weight, setWeight] = useState(1.0);
    // Tour mode states
    const [isTourMode, setIsTourMode] = useState(false);
    const [tourKeyframes, setTourKeyframes] = useState([]);
    const [selectedTourSequence, setSelectedTourSequence] = useState('');
    const [tourSequences, setTourSequences] = useState([]);
    const [tourSpeed, setTourSpeed] = useState(1.0);
    // Timeline visibility state
    const [tourComposerVisible, setTourComposerVisible] = useState(true);

    // Add tour keyframe
    const addTourKeyframe = (position) => {
        setTourKeyframes(prev => [...prev, { time: currentTime, position: position.clone() }].sort((a, b) => a.time - b.time));
    };

    // Remove tour keyframe
    const removeTourKeyframe = (idx) => {
        setTourKeyframes(prev => prev.filter((_, i) => i !== idx));
    };

    // Create tour sequence
    const createTourSequence = () => {
        if (tourKeyframes.length === 0)
            return;
        const sequence = {
            id: `tour_${Date.now()}`,
            name: `Tour ${tourSequences.length + 1}`,
            keyframes: tourKeyframes,
            duration: totalDuration,
            loop: false
        };
        setTourSequences(prev => [...prev, sequence]);
        setSelectedTourSequence(sequence.id);
        setTourKeyframes([]);
    };

    // Smooth camera interpolation for tour playback
    const playTourSequence = async (sequenceId) => {
        const sequence = tourSequences.find(s => s.id === sequenceId);
        if (!sequence || !selectedObject)
            return;
        setIsPlaying(true);
        for (let i = 0; i < sequence.keyframes.length - 1; i++) {
            const start = sequence.keyframes[i].position;
            const end = sequence.keyframes[i + 1].position;
            const duration = (sequence.keyframes[i + 1].time - sequence.keyframes[i].time) / tourSpeed;
            let t = 0;
            while (t < 1) {
                const interp = BABYLON.Vector3.Lerp(start, end, t);
                selectedObject.position.copyFrom(interp);
                t += 0.02;
                await new Promise(res => setTimeout(res, duration * 20));
            }
            selectedObject.position.copyFrom(end);
        }
        setIsPlaying(false);
    };

    // Export tour sequence to JSON
    const exportTourSequence = (sequenceId) => {
        const sequence = tourSequences.find(s => s.id === sequenceId);
        if (!sequence)
            return;
        const dataStr = JSON.stringify(sequence, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sequence.name}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Import tour sequence from JSON
    const importTourSequence = (file) => {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const data = JSON.parse(e.target?.result);
                if (data && data.keyframes) {
                    setTourSequences(prev => [...prev, data]);
                }
            }
            catch { }
        };
        reader.readAsText(file);
    };

    const animationTypes = [
        { value: 'bounce', label: 'Bounce' },
        { value: 'fade', label: 'Fade' },
        { value: 'scale', label: 'Scale' },
        { value: 'color', label: 'Color Transition' },
        { value: 'wave', label: 'Wave' },
        { value: 'spring', label: 'Spring' },
        { value: 'rotation', label: 'Rotation' }
    ];

    const addKeyframe = () => {
        if (!selectedObject)
            return;
        const newKeyframe = {
            time: currentTime,
            position: selectedObject.position.clone(),
            rotation: selectedObject.rotation.clone(),
            scale: selectedObject.scaling.clone()
        };
        setKeyframes(prev => [...prev, newKeyframe].sort((a, b) => a.time - b.time));
    };

    const createSequence = () => {
        if (keyframes.length === 0 || !animationManager)
            return;
        const sequence = {
            id: `seq_${Date.now()}`,
            name: `Sequence ${sequences.length + 1}`,
            keyframes: keyframes,
            duration: totalDuration,
            loop: false
        };
        setSequences(prev => [...prev, sequence]);
        setSelectedSequence(sequence.id);
        setKeyframes([]);
    };

    const quickAnimation = (type) => {
        if (!selectedObject || !animationManager)
            return;
        let presetName;
        switch (type) {
            case 'bounce':
                presetName = 'bounce';
                break;
            case 'fade':
                presetName = 'fade';
                break;
            case 'scale':
                presetName = 'scale';
                break;
            case 'color':
                presetName = 'colorcycle';
                break;
            case 'wave':
                presetName = 'wave';
                break;
            case 'spring':
                presetName = 'spring';
                break;
            case 'rotation':
                presetName = 'rotation';
                break;
        }
        if (presetName) {
            const animationGroup = animationManager.createAnimationFromPreset(presetName, selectedObject);
            if (animationGroup) {
                // Register the animation group with the manager
                const groupId = `quick_${presetName}_${Date.now()}`;
                animationManager.registerAnimationGroup({
                    id: groupId,
                    name: `${presetName} Animation`,
                    animations: [], // The animation group already contains the animations
                    targetMeshes: [selectedObject],
                    speedRatio: 1.0,
                    weight: 1.0,
                    isLooping: false
                });
                animationManager.playAnimation(groupId);
            }
        }
    };

    const playSequence = (sequenceId) => {
        if (animationManager && sequenceId) {
            animationManager.playAnimation(sequenceId);
        }
    };

    return _jsxs(Card, { className: "w-full max-w-4xl", style: { resize: 'vertical', minHeight: '300px', overflow: 'auto' }, children: [
        _jsx(CardHeader, { children: _jsx(CardTitle, { children: "Animation Timeline" }) }),
        _jsxs(CardContent, { className: "space-y-4", children: [
            _jsxs("div", { className: "flex items-center space-x-4", children: [
                _jsx(Button, { onClick: () => setIsPlaying(!isPlaying), variant: isPlaying ? "destructive" : "default", children: isPlaying ? 'Pause' : 'Play' }),
                _jsx(Button, { onClick: () => setCurrentTime(0), variant: "outline", children: "Reset" }),
                _jsx(Button, { onClick: () => {
                    setPreviewMode(!previewMode);
                    if (animationManager) {
                        animationManager.enableRealtimePreview(!previewMode);
                    }
                }, variant: previewMode ? "default" : "outline", size: "sm", children: previewMode ? 'Preview ON' : 'Preview OFF' }),
                _jsx("div", { className: "flex-1", children: _jsx(Slider, { value: [currentTime], onValueChange: (value) => {
                    setCurrentTime(value[0]);
                    if (animationManager && previewMode) {
                        // Scrub to time in real-time
                        animationManager.scrubToTime(selectedSequence, value[0]);
                    }
                }, max: totalDuration, step: 1, className: "w-full" }) }),
                _jsxs("span", { className: "text-sm font-mono", children: [Math.floor(currentTime / 60), ":", (currentTime % 60).toString().padStart(2, '0')] })
            ] }),
            _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
                _jsxs("div", { className: "space-y-2", children: [
                    _jsxs("label", { className: "text-sm font-medium", children: ["Speed: ", speed.toFixed(1), "x"] }),
                    _jsx(Slider, { value: [speed], onValueChange: (value) => {
                        setSpeed(value[0]);
                        if (animationManager && selectedSequence) {
                            animationManager.updateAnimationSpeed(selectedSequence, value[0]);
                        }
                    }, min: 0.1, max: 3.0, step: 0.1, className: "w-full" })
                ] }),
                _jsxs("div", { className: "space-y-2", children: [
                    _jsxs("label", { className: "text-sm font-medium", children: ["Weight: ", weight.toFixed(1)] }),
                    _jsx(Slider, { value: [weight], onValueChange: (value) => {
                        setWeight(value[0]);
                        if (animationManager && selectedSequence) {
                            animationManager.updateAnimationWeight(selectedSequence, value[0]);
                        }
                    }, min: 0.0, max: 1.0, step: 0.1, className: "w-full" })
                ] }),
                _jsxs("div", { className: "space-y-2", children: [
                    _jsxs("label", { className: "text-sm font-medium", children: ["Duration: ", totalDuration, "s"] }),
                    _jsx(Slider, { value: [totalDuration], onValueChange: (value) => {
                        setTotalDuration(value[0]);
                        if (animationManager && selectedSequence) {
                            animationManager.updateAnimationDuration(selectedSequence, value[0]);
                        }
                    }, min: 10, max: 300, step: 5, className: "w-full" })
                ] })
            ] }),
            _jsx("div", { className: "grid grid-cols-4 gap-2", children: animationTypes.map(type => (_jsx(Button, { onClick: () => quickAnimation(type.value), variant: "outline", size: "sm", disabled: !selectedObject, children: type.label }, type.value))) }),
            _jsxs("div", { className: "flex items-center space-x-2", children: [
                _jsx(Button, { onClick: addKeyframe, disabled: !selectedObject, variant: "outline", children: "Add Keyframe" }),
                _jsx(Button, { onClick: createSequence, disabled: keyframes.length === 0, variant: "default", children: "Create Sequence" })
            ] }),
            _jsxs("div", { className: "border rounded p-2 min-h-[100px]", children: [
                _jsx("h4", { className: "text-sm font-semibold mb-2", children: "Keyframes:" }),
                _jsx("div", { className: "flex flex-wrap gap-1", children: keyframes.map((kf, index) => (_jsxs("div", { className: "bg-blue-100 px-2 py-1 rounded text-xs", children: [kf.time, "s"] }, index))) })
            ] }),
            _jsxs("div", { className: "space-y-2 border rounded p-2 min-h-[120px] max-h-[200px] overflow-y-auto", children: [
                _jsx("h4", { className: "text-sm font-semibold", children: "Sequences:" }),
                sequences.length > 0 ? sequences.map(sequence => _jsxs("div", { className: "flex items-center space-x-2 p-1 bg-gray-50 rounded", children: [
                    _jsx(Button, { onClick: () => setSelectedSequence(sequence.id), variant: selectedSequence === sequence.id ? "default" : "outline", size: "sm", className: "flex-1 text-left", children: sequence.name }),
                    _jsx(Button, { onClick: () => playSequence(sequence.id), size: "sm", variant: "outline", children: "Play" })
                ] }, sequence.id)) : _jsx("p", { className: "text-xs text-muted-foreground text-center py-2", children: "No sequences created yet" })
            ] }),
            tourComposerVisible && _jsxs(Card, { className: "mb-4", children: [
                _jsxs(CardHeader, { className: "flex justify-between items-center", children: [
                    _jsxs("div", { className: "flex items-center gap-2", children: [
                        _jsx(CardTitle, { className: "text-sm m-0", children: "Tour Composer" }),
                        _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsTourMode(!isTourMode), children: isTourMode ? 'Exit Tour Mode' : 'Enter Tour Mode' })
                    ] }),
                    _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setTourComposerVisible(false), children: _jsx(EyeOff, { className: "h-3 w-3" }) })
                ] }),
                _jsx(CardContent, { children: isTourMode && _jsxs("div", { className: "space-y-2", children: [
                    _jsxs("div", { className: "flex gap-2 mb-2", children: [
                        _jsx(Button, { size: "sm", onClick: () => addTourKeyframe(selectedObject?.position || BABYLON.Vector3.Zero()), children: "Add Waypoint" }),
                        _jsx(Button, { size: "sm", onClick: createTourSequence, disabled: tourKeyframes.length === 0, children: "Create Tour Sequence" }),
                        _jsx(Button, { size: "sm", variant: "outline", onClick: () => setTourKeyframes([]), children: "Clear Keyframes" })
                    ] }),
                    _jsxs("div", { className: "flex gap-2 items-center mb-2", children: [
                        _jsx("label", { className: "text-xs", children: "Speed:" }),
                        _jsx(Slider, { min: 0.5, max: 3, step: 0.1, value: [tourSpeed], onValueChange: arr => setTourSpeed(arr[0]) }),
                        _jsxs("span", { className: "text-xs", children: [tourSpeed, "x"] })
                    ] }),
                    _jsxs("div", { className: "space-y-1", children: [
                        _jsx("div", { className: "text-xs font-medium", children: "Keyframes" }),
                        _jsx("ul", { className: "text-xs max-h-20 overflow-y-auto", children: tourKeyframes.map((kf, idx) => _jsxs("li", { className: "flex gap-2 items-center p-1 bg-gray-50 rounded", children: [
                            _jsxs("span", { children: ["t=", kf.time, "s (", kf.position.x.toFixed(1), ", ", kf.position.y.toFixed(1), ", ", kf.position.z.toFixed(1), ")"] }),
                            _jsx(Button, { size: "sm", variant: "outline", onClick: () => removeTourKeyframe(idx), children: "Remove" })
                        ] }, idx)) })
                    ] }),
                    _jsxs("div", { className: "space-y-1", children: [
                        _jsx("div", { className: "text-xs font-medium", children: "Tour Sequences" }),
                        _jsx("ul", { className: "text-xs max-h-20 overflow-y-auto", children: tourSequences.map(seq => _jsxs("li", { className: "flex gap-2 items-center p-1 bg-gray-50 rounded", children: [
                            _jsx("span", { className: "flex-1", children: seq.name }),
                            _jsx(Button, { size: "sm", variant: "default", onClick: () => playTourSequence(seq.id), children: "Play" }),
                            _jsx(Button, { size: "sm", variant: "outline", onClick: () => exportTourSequence(seq.id), children: "Export" })
                        ] }, seq.id)) }),
                        _jsxs("div", { className: "flex gap-2 mt-2", children: [
                            _jsx("label", { htmlFor: "import-tour-file", className: "sr-only", children: "Import Tour" }),
                            _jsx("input", { id: "import-tour-file", type: "file", accept: ".json", onChange: e => {
                                if (e.target.files && e.target.files[0]) {
                                    importTourSequence(e.target.files[0]);
                                }
                            } }),
                            _jsx("span", { className: "text-xs", children: "Import Tour" })
                        ] })
                    ] })
                ] }) })
            ] }),
            !tourComposerVisible && _jsx("div", { className: "p-2 text-center border-t border-gray-200", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setTourComposerVisible(true), children: [_jsx(Eye, { className: "h-3 w-3 mr-1" }), "Show Tour Composer"] }) })
        ] })
    ] });
};
