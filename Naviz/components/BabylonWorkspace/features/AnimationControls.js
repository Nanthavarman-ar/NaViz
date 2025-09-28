import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { useWorkspace } from '../core/WorkspaceContext';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { ScrollArea } from '../../ui/scroll-area';
import { Vector3 } from '@babylonjs/core';
import { Play, Pause, Square, SkipBack, SkipForward, Copy, Trash2, Eye, Lock, Settings, Plus, Save, Maximize, User, Camera, Move3D, Sun, Palette, Layers, Sparkles, Activity, FastForward, Rewind, Triangle, RotateCw } from 'lucide-react';
import './AnimationControls.css';
const ANIMATION_PRESETS = {
    position: {
        name: 'Position',
        icon: Move3D,
        description: 'Animate object position',
        defaultProperties: {
            duration: 2,
            loop: true,
            loopCount: -1,
            speed: 1,
            easing: 'easeInOut',
            autoPlay: false,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    },
    rotation: {
        name: 'Rotation',
        icon: RotateCw,
        description: 'Animate object rotation',
        defaultProperties: {
            duration: 3,
            loop: true,
            loopCount: -1,
            speed: 1,
            easing: 'linear',
            autoPlay: false,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    },
    scale: {
        name: 'Scale',
        icon: Maximize,
        description: 'Animate object scale',
        defaultProperties: {
            duration: 1.5,
            loop: false,
            loopCount: 1,
            speed: 1,
            easing: 'easeOut',
            autoPlay: false,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    },
    color: {
        name: 'Color',
        icon: Palette,
        description: 'Animate material color',
        defaultProperties: {
            duration: 2.5,
            loop: true,
            loopCount: -1,
            speed: 1,
            easing: 'easeInOut',
            autoPlay: false,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    },
    opacity: {
        name: 'Opacity',
        icon: Eye,
        description: 'Animate transparency',
        defaultProperties: {
            duration: 1,
            loop: false,
            loopCount: 1,
            speed: 1,
            easing: 'easeIn',
            autoPlay: false,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    },
    material: {
        name: 'Material',
        icon: Layers,
        description: 'Animate material properties',
        defaultProperties: {
            duration: 3,
            loop: true,
            loopCount: -1,
            speed: 1,
            easing: 'easeInOut',
            autoPlay: false,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    },
    morph: {
        name: 'Morph',
        icon: Triangle,
        description: 'Animate morph targets',
        defaultProperties: {
            duration: 2,
            loop: true,
            loopCount: -1,
            speed: 1,
            easing: 'linear',
            autoPlay: false,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    },
    skeleton: {
        name: 'Skeleton',
        icon: User,
        description: 'Animate skeletal structure',
        defaultProperties: {
            duration: 4,
            loop: true,
            loopCount: -1,
            speed: 1,
            easing: 'easeInOut',
            autoPlay: false,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    },
    camera: {
        name: 'Camera',
        icon: Camera,
        description: 'Animate camera movement',
        defaultProperties: {
            duration: 5,
            loop: false,
            loopCount: 1,
            speed: 1,
            easing: 'easeInOut',
            autoPlay: false,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    },
    light: {
        name: 'Light',
        icon: Sun,
        description: 'Animate light properties',
        defaultProperties: {
            duration: 3,
            loop: true,
            loopCount: -1,
            speed: 1,
            easing: 'easeInOut',
            autoPlay: false,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    },
    particle: {
        name: 'Particle',
        icon: Sparkles,
        description: 'Animate particle systems',
        defaultProperties: {
            duration: 2,
            loop: true,
            loopCount: -1,
            speed: 1,
            easing: 'linear',
            autoPlay: true,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    },
    custom: {
        name: 'Custom',
        icon: Settings,
        description: 'Custom animation',
        defaultProperties: {
            duration: 2,
            loop: false,
            loopCount: 1,
            speed: 1,
            easing: 'linear',
            autoPlay: false,
            enabled: true,
            blendMode: 'additive',
            weight: 1
        }
    }
};
const EASING_FUNCTIONS = [
    'linear',
    'easeIn',
    'easeOut',
    'easeInOut',
    'easeInQuad',
    'easeOutQuad',
    'easeInOutQuad',
    'easeInCubic',
    'easeOutCubic',
    'easeInOutCubic',
    'easeInQuart',
    'easeOutQuart',
    'easeInOutQuart',
    'easeInSine',
    'easeOutSine',
    'easeInOutSine',
    'easeInExpo',
    'easeOutExpo',
    'easeInOutExpo',
    'easeInCirc',
    'easeOutCirc',
    'easeInOutCirc',
    'easeInElastic',
    'easeOutElastic',
    'easeInOutElastic',
    'easeInBack',
    'easeOutBack',
    'easeInOutBack',
    'easeInBounce',
    'easeOutBounce',
    'easeInOutBounce'
];
export function AnimationControls({ onAnimationCreate, onAnimationRemove, onAnimationUpdate, onAnimationPlay, onAnimationPause, onAnimationStop }) {
    const { state } = useWorkspace();
    const [activeTab, setActiveTab] = useState('animations');
    const [selectedAnimation, setSelectedAnimation] = useState(null);
    const [animations, setAnimations] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    // Initialize with default animations
    useEffect(() => {
        const defaultAnimations = Object.entries(ANIMATION_PRESETS).slice(0, 3).map(([type, preset]) => ({
            id: `${type}-default`,
            name: `${preset.name} Animation`,
            type: type,
            targetId: '',
            keys: [],
            events: [],
            ...preset.defaultProperties
        }));
        setAnimations(defaultAnimations);
    }, []);
    // Handle animation type selection
    const handleAddAnimation = useCallback((animationType) => {
        const preset = ANIMATION_PRESETS[animationType];
        const newAnimation = {
            id: `${animationType}-${Date.now()}`,
            name: `${preset.name} Animation ${animations.length + 1}`,
            type: animationType,
            targetId: '',
            keys: [
                { frame: 0, value: new Vector3(0, 0, 0), interpolation: 'linear' },
                { frame: preset.defaultProperties.duration * 60, value: new Vector3(1, 1, 1), interpolation: 'linear' }
            ],
            events: [],
            ...preset.defaultProperties
        };
        setAnimations(prev => [...prev, newAnimation]);
        onAnimationCreate?.(animationType, newAnimation.targetId);
    }, [animations.length, onAnimationCreate]);
    // Handle animation removal
    const handleRemoveAnimation = useCallback((animationId) => {
        setAnimations(prev => prev.filter(anim => anim.id !== animationId));
        setSelectedAnimation(null);
        onAnimationRemove?.(animationId);
    }, [onAnimationRemove]);
    // Handle animation property update
    const handleAnimationUpdate = useCallback((animationId, properties) => {
        setAnimations(prev => prev.map(anim => anim.id === animationId ? { ...anim, ...properties } : anim));
        onAnimationUpdate?.(animationId, properties);
    }, [onAnimationUpdate]);
    // Handle animation play
    const handlePlayAnimation = useCallback((animationId) => {
        setIsPlaying(true);
        onAnimationPlay?.(animationId);
    }, [onAnimationPlay]);
    // Handle animation pause
    const handlePauseAnimation = useCallback((animationId) => {
        setIsPlaying(false);
        onAnimationPause?.(animationId);
    }, [onAnimationPause]);
    // Handle animation stop
    const handleStopAnimation = useCallback((animationId) => {
        setIsPlaying(false);
        setCurrentTime(0);
        onAnimationStop?.(animationId);
    }, [onAnimationStop]);
    // Handle group creation
    const handleCreateGroup = useCallback(() => {
        const selectedAnimations = animations.filter(anim => anim.id === selectedAnimation);
        if (selectedAnimations.length > 0) {
            const newGroup = {
                id: `group-${Date.now()}`,
                name: `Animation Group ${groups.length + 1}`,
                animations: selectedAnimations.map(anim => anim.id),
                duration: Math.max(...selectedAnimations.map(anim => anim.duration)),
                loop: true,
                speed: 1,
                enabled: true
            };
            setGroups(prev => [...prev, newGroup]);
        }
    }, [animations, selectedAnimation, groups.length]);
    // Handle group removal
    const handleRemoveGroup = useCallback((groupId) => {
        setGroups(prev => prev.filter(group => group.id !== groupId));
        setSelectedGroup(null);
    }, []);
    // Duplicate animation
    const duplicateAnimation = useCallback((animationId) => {
        const animation = animations.find(anim => anim.id === animationId);
        if (animation) {
            const newAnimation = {
                ...animation,
                id: `${animation.type}-${Date.now()}`,
                name: `${animation.name} Copy`
            };
            setAnimations(prev => [...prev, newAnimation]);
        }
    }, [animations]);
    // Filter animations based on search term
    const filteredAnimations = animations.filter(anim => anim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anim.type.toLowerCase().includes(searchTerm.toLowerCase()));
    const selectedAnimationData = animations.find(anim => anim.id === selectedAnimation);
    return (_jsxs("div", { className: "animation-controls", children: [_jsxs("div", { className: "animation-controls-header", children: [_jsx("h3", { className: "animation-controls-title", children: "Animation Controls" }), _jsxs("div", { className: "animation-controls-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: handleCreateGroup, children: _jsx(Plus, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Save, { className: "w-4 h-4" }) })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "animation-controls-tabs", children: [_jsxs(TabsList, { className: "animation-controls-tabs-list", children: [_jsx(TabsTrigger, { value: "animations", children: "Animations" }), _jsx(TabsTrigger, { value: "groups", children: "Groups" }), _jsx(TabsTrigger, { value: "timeline", children: "Timeline" }), _jsx(TabsTrigger, { value: "properties", children: "Properties" })] }), _jsx(TabsContent, { value: "animations", className: "animation-controls-tab-content", children: _jsxs("div", { className: "animations-section", children: [_jsxs("div", { className: "animations-header", children: [_jsx("div", { className: "search-container", children: _jsx(Input, { placeholder: "Search animations...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "search-input" }) }), _jsx("div", { className: "add-animation-buttons", children: Object.entries(ANIMATION_PRESETS).slice(0, 6).map(([type, preset]) => {
                                                const IconComponent = preset.icon;
                                                return (_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleAddAnimation(type), className: "add-animation-button", title: preset.description, children: _jsx(IconComponent, { className: "w-4 h-4" }) }, type));
                                            }) }), _jsx("div", { className: "add-animation-buttons", children: Object.entries(ANIMATION_PRESETS).slice(6).map(([type, preset]) => {
                                                const IconComponent = preset.icon;
                                                return (_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleAddAnimation(type), className: "add-animation-button", title: preset.description, children: _jsx(IconComponent, { className: "w-4 h-4" }) }, type));
                                            }) })] }), _jsxs("div", { className: "animations-list", children: [_jsxs("h4", { className: "section-title", children: ["Scene Animations (", filteredAnimations.length, ")"] }), _jsx(ScrollArea, { className: "animations-scroll-area", children: _jsx("div", { className: "animations-grid", children: filteredAnimations.map((animation) => {
                                                    const preset = ANIMATION_PRESETS[animation.type];
                                                    const IconComponent = preset.icon;
                                                    return (_jsx(Card, { className: `animation-card ${selectedAnimation === animation.id ? 'selected' : ''}`, onClick: () => setSelectedAnimation(animation.id), children: _jsxs(CardContent, { className: "animation-content", children: [_jsxs("div", { className: "animation-header", children: [_jsxs("div", { className: "animation-info", children: [_jsx(IconComponent, { className: "w-4 h-4" }), _jsx("span", { className: "animation-name", children: animation.name }), _jsx(Badge, { variant: "secondary", className: "animation-type", children: animation.type })] }), _jsxs("div", { className: "animation-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        if (isPlaying) {
                                                                                            handlePauseAnimation(animation.id);
                                                                                        }
                                                                                        else {
                                                                                            handlePlayAnimation(animation.id);
                                                                                        }
                                                                                    }, children: isPlaying ? _jsx(Pause, { className: "w-3 h-3" }) : _jsx(Play, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        handleStopAnimation(animation.id);
                                                                                    }, children: _jsx(Square, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        duplicateAnimation(animation.id);
                                                                                    }, children: _jsx(Copy, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        handleRemoveAnimation(animation.id);
                                                                                    }, children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }), _jsxs("div", { className: "animation-properties", children: [_jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Duration" }), _jsx(Input, { type: "number", min: "0.1", step: "0.1", value: animation.duration, onChange: (e) => handleAnimationUpdate(animation.id, { duration: parseFloat(e.target.value) }), className: "property-input" })] }), _jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Speed" }), _jsx(Input, { type: "number", min: "0.1", max: "5", step: "0.1", value: animation.speed, onChange: (e) => handleAnimationUpdate(animation.id, { speed: parseFloat(e.target.value) }), className: "property-input" })] }), _jsx("div", { className: "property-row", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: animation.loop, onChange: (e) => handleAnimationUpdate(animation.id, { loop: e.target.checked }) }), "Loop"] }) })] })] }) }, animation.id));
                                                }) }) })] })] }) }), _jsx(TabsContent, { value: "groups", className: "animation-controls-tab-content", children: _jsxs("div", { className: "groups-section", children: [_jsxs("div", { className: "groups-header", children: [_jsxs("h4", { className: "section-title", children: ["Animation Groups (", groups.length, ")"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleCreateGroup, children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create Group"] })] }), _jsx(ScrollArea, { className: "groups-scroll-area", children: _jsx("div", { className: "groups-grid", children: groups.map((group) => (_jsx(Card, { className: `group-card ${selectedGroup === group.id ? 'selected' : ''}`, onClick: () => setSelectedGroup(group.id), children: _jsxs(CardContent, { className: "group-content", children: [_jsxs("div", { className: "group-header", children: [_jsxs("div", { className: "group-info", children: [_jsx(Activity, { className: "w-4 h-4" }), _jsx("span", { className: "group-name", children: group.name }), _jsxs(Badge, { variant: "secondary", className: "group-count", children: [group.animations.length, " animations"] })] }), _jsxs("div", { className: "group-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                            e.stopPropagation();
                                                                            // Play group
                                                                        }, children: _jsx(Play, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                            e.stopPropagation();
                                                                            // Stop group
                                                                        }, children: _jsx(Square, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                            e.stopPropagation();
                                                                            handleRemoveGroup(group.id);
                                                                        }, children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }), _jsxs("div", { className: "group-properties", children: [_jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Duration" }), _jsx(Input, { type: "number", min: "0.1", step: "0.1", value: group.duration, onChange: (e) => {
                                                                            // Update group duration
                                                                        }, className: "property-input" })] }), _jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Speed" }), _jsx(Input, { type: "number", min: "0.1", max: "5", step: "0.1", value: group.speed, onChange: (e) => {
                                                                            // Update group speed
                                                                        }, className: "property-input" })] }), _jsx("div", { className: "property-row", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: group.loop, onChange: (e) => {
                                                                                // Update group loop
                                                                            } }), "Loop"] }) })] })] }) }, group.id))) }) })] }) }), _jsx(TabsContent, { value: "timeline", className: "animation-controls-tab-content", children: _jsxs("div", { className: "timeline-section", children: [_jsxs("div", { className: "timeline-header", children: [_jsx("h4", { className: "section-title", children: "Timeline" }), _jsxs("div", { className: "timeline-controls", children: [_jsx(Button, { variant: "outline", size: "sm", children: _jsx(SkipBack, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", children: _jsx(Rewind, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", children: isPlaying ? _jsx(Pause, { className: "w-4 h-4" }) : _jsx(Play, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", children: _jsx(FastForward, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "outline", size: "sm", children: _jsx(SkipForward, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "timeline-content", children: [_jsx("div", { className: "timeline-ruler", children: _jsx("div", { className: "ruler-marks", children: Array.from({ length: 100 }, (_, i) => (_jsx("div", { className: "ruler-mark", style: { left: `${i * 10}px` }, children: _jsx("span", { className: "mark-label", children: i }) }, i))) }) }), _jsx("div", { className: "timeline-tracks", children: animations.slice(0, 3).map((animation) => (_jsxs("div", { className: "timeline-track", children: [_jsxs("div", { className: "track-header", children: [_jsx("span", { className: "track-name", children: animation.name }), _jsxs("div", { className: "track-controls", children: [_jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Eye, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Lock, { className: "w-3 h-3" }) })] })] }), _jsx("div", { className: "track-content", children: _jsx("div", { className: "track-clip", style: {
                                                                width: `${(animation.duration / 10) * 100}px`
                                                            }, children: _jsxs("div", { className: "clip-content", children: [_jsx("span", { className: "clip-name", children: animation.type }), _jsxs("div", { className: "clip-handles", children: [_jsx("div", { className: "handle left" }), _jsx("div", { className: "handle right" })] })] }) }) })] }, animation.id))) })] })] }) }), _jsx(TabsContent, { value: "properties", className: "animation-controls-tab-content", children: selectedAnimationData ? (_jsxs("div", { className: "properties-section", children: [_jsx("h4", { className: "section-title", children: "Animation Properties" }), _jsx(ScrollArea, { className: "properties-scroll-area", children: _jsxs("div", { className: "properties-content", children: [_jsxs("div", { className: "property-group", children: [_jsx("h5", { className: "property-group-title", children: "Basic Settings" }), _jsxs("div", { className: "property-grid", children: [_jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Name" }), _jsx(Input, { value: selectedAnimationData.name, onChange: (e) => handleAnimationUpdate(selectedAnimationData.id, { name: e.target.value }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Target ID" }), _jsx(Input, { placeholder: "Object ID", value: selectedAnimationData.targetId, onChange: (e) => handleAnimationUpdate(selectedAnimationData.id, { targetId: e.target.value }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Duration (s)" }), _jsx(Input, { type: "number", min: "0.1", step: "0.1", value: selectedAnimationData.duration, onChange: (e) => handleAnimationUpdate(selectedAnimationData.id, { duration: parseFloat(e.target.value) }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Speed" }), _jsx(Input, { type: "number", min: "0.1", max: "5", step: "0.1", value: selectedAnimationData.speed, onChange: (e) => handleAnimationUpdate(selectedAnimationData.id, { speed: parseFloat(e.target.value) }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { htmlFor: "easing-select", children: "Easing" }), _jsx("select", { id: "easing-select", value: selectedAnimationData.easing, onChange: (e) => handleAnimationUpdate(selectedAnimationData.id, { easing: e.target.value }), className: "property-select", "aria-label": "Select easing function", children: EASING_FUNCTIONS.map(easing => (_jsx("option", { value: easing, children: easing }, easing))) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Blend Mode" }), _jsxs("select", { value: selectedAnimationData.blendMode, onChange: (e) => handleAnimationUpdate(selectedAnimationData.id, { blendMode: e.target.value }), className: "property-select", "aria-label": "Select blend mode", children: [_jsx("option", { value: "additive", children: "Additive" }), _jsx("option", { value: "override", children: "Override" }), _jsx("option", { value: "multiply", children: "Multiply" })] })] })] })] }), _jsxs("div", { className: "property-group", children: [_jsx("h5", { className: "property-group-title", children: "Loop Settings" }), _jsxs("div", { className: "property-grid", children: [_jsx("div", { className: "property-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: selectedAnimationData.loop, onChange: (e) => handleAnimationUpdate(selectedAnimationData.id, { loop: e.target.checked }) }), "Loop Animation"] }) }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Loop Count" }), _jsx(Input, { type: "number", min: "-1", value: selectedAnimationData.loopCount, onChange: (e) => handleAnimationUpdate(selectedAnimationData.id, { loopCount: parseInt(e.target.value) }) })] }), _jsx("div", { className: "property-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: selectedAnimationData.autoPlay, onChange: (e) => handleAnimationUpdate(selectedAnimationData.id, { autoPlay: e.target.checked }) }), "Auto Play"] }) })] })] }), _jsxs("div", { className: "property-group", children: [_jsx("h5", { className: "property-group-title", children: "Animation Keys" }), _jsxs("div", { className: "keys-list", children: [selectedAnimationData.keys.map((key, index) => (_jsxs("div", { className: "key-item", children: [_jsxs("div", { className: "key-info", children: [_jsxs("span", { className: "key-frame", children: ["Frame ", key.frame] }), _jsx("span", { className: "key-interpolation", children: key.interpolation })] }), _jsxs("div", { className: "key-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Settings, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }, index))), _jsxs(Button, { variant: "outline", size: "sm", className: "add-key-button", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Keyframe"] })] })] })] }) })] })) : (_jsx("div", { className: "no-selection", children: _jsx("p", { children: "Select an animation to view its properties" }) })) })] })] }));
}
