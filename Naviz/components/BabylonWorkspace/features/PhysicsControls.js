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
import { Play, Pause, Square, Trash2, Eye, EyeOff, Settings, Plus, Save, User, Move3D, Sparkles, Power, Droplets, Atom, Wind as WindIcon, Droplet, Mountain as MountainIcon, Zap as ZapIcon, Car, Shirt, Link } from 'lucide-react';
import './PhysicsControls.css';
const PHYSICS_PRESETS = {
    rigidbody: {
        name: 'Rigid Body',
        icon: Atom,
        description: 'Dynamic physics object',
        defaultProperties: {
            enabled: true,
            mass: 1,
            friction: 0.5,
            restitution: 0.3,
            linearDamping: 0.1,
            angularDamping: 0.1,
            gravityFactor: 1,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(0, 0, 0),
            lockRotation: new Vector3(0, 0, 0),
            useGravity: true,
            isTrigger: false,
            collisionGroup: 1,
            collisionMask: -1,
            material: {
                staticFriction: 0.5,
                dynamicFriction: 0.3,
                restitution: 0.3,
                frictionCombine: 'average',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    static: {
        name: 'Static',
        icon: MountainIcon,
        description: 'Non-moving physics object',
        defaultProperties: {
            enabled: true,
            mass: 0,
            friction: 0.5,
            restitution: 0.3,
            linearDamping: 0,
            angularDamping: 0,
            gravityFactor: 0,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(1, 1, 1),
            lockRotation: new Vector3(1, 1, 1),
            useGravity: false,
            isTrigger: false,
            collisionGroup: 1,
            collisionMask: -1,
            material: {
                staticFriction: 0.5,
                dynamicFriction: 0.3,
                restitution: 0.3,
                frictionCombine: 'average',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    kinematic: {
        name: 'Kinematic',
        icon: Move3D,
        description: 'Animated physics object',
        defaultProperties: {
            enabled: true,
            mass: 1,
            friction: 0.5,
            restitution: 0.3,
            linearDamping: 0,
            angularDamping: 0,
            gravityFactor: 0,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(0, 0, 0),
            lockRotation: new Vector3(0, 0, 0),
            useGravity: false,
            isTrigger: false,
            collisionGroup: 1,
            collisionMask: -1,
            material: {
                staticFriction: 0.5,
                dynamicFriction: 0.3,
                restitution: 0.3,
                frictionCombine: 'average',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    character: {
        name: 'Character',
        icon: User,
        description: 'Character controller',
        defaultProperties: {
            enabled: true,
            mass: 80,
            friction: 0.1,
            restitution: 0,
            linearDamping: 0.9,
            angularDamping: 0.9,
            gravityFactor: 1,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(0, 1, 0),
            lockRotation: new Vector3(1, 0, 1),
            useGravity: true,
            isTrigger: false,
            collisionGroup: 2,
            collisionMask: -1,
            material: {
                staticFriction: 0.1,
                dynamicFriction: 0.1,
                restitution: 0,
                frictionCombine: 'min',
                restitutionCombine: 'min'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    vehicle: {
        name: 'Vehicle',
        icon: Car,
        description: 'Vehicle physics',
        defaultProperties: {
            enabled: true,
            mass: 1500,
            friction: 0.8,
            restitution: 0.2,
            linearDamping: 0.1,
            angularDamping: 0.5,
            gravityFactor: 1,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(0, 0, 0),
            lockRotation: new Vector3(0, 0, 1),
            useGravity: true,
            isTrigger: false,
            collisionGroup: 4,
            collisionMask: -1,
            material: {
                staticFriction: 0.8,
                dynamicFriction: 0.6,
                restitution: 0.2,
                frictionCombine: 'max',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    ragdoll: {
        name: 'Ragdoll',
        icon: User,
        description: 'Ragdoll physics',
        defaultProperties: {
            enabled: true,
            mass: 70,
            friction: 0.3,
            restitution: 0.1,
            linearDamping: 0.8,
            angularDamping: 0.8,
            gravityFactor: 1,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(0, 0, 0),
            lockRotation: new Vector3(0, 0, 0),
            useGravity: true,
            isTrigger: false,
            collisionGroup: 8,
            collisionMask: -1,
            material: {
                staticFriction: 0.3,
                dynamicFriction: 0.3,
                restitution: 0.1,
                frictionCombine: 'average',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    cloth: {
        name: 'Cloth',
        icon: Shirt,
        description: 'Cloth simulation',
        defaultProperties: {
            enabled: true,
            mass: 0.1,
            friction: 0.9,
            restitution: 0.1,
            linearDamping: 0.99,
            angularDamping: 0.99,
            gravityFactor: 1,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(0, 0, 0),
            lockRotation: new Vector3(0, 0, 0),
            useGravity: true,
            isTrigger: false,
            collisionGroup: 16,
            collisionMask: -1,
            material: {
                staticFriction: 0.9,
                dynamicFriction: 0.8,
                restitution: 0.1,
                frictionCombine: 'multiply',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    softbody: {
        name: 'Soft Body',
        icon: Droplet,
        description: 'Soft body simulation',
        defaultProperties: {
            enabled: true,
            mass: 0.5,
            friction: 0.7,
            restitution: 0.2,
            linearDamping: 0.95,
            angularDamping: 0.95,
            gravityFactor: 1,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(0, 0, 0),
            lockRotation: new Vector3(0, 0, 0),
            useGravity: true,
            isTrigger: false,
            collisionGroup: 32,
            collisionMask: -1,
            material: {
                staticFriction: 0.7,
                dynamicFriction: 0.6,
                restitution: 0.2,
                frictionCombine: 'multiply',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    fluid: {
        name: 'Fluid',
        icon: Droplets,
        description: 'Fluid simulation',
        defaultProperties: {
            enabled: true,
            mass: 0.01,
            friction: 0.1,
            restitution: 0.1,
            linearDamping: 0.8,
            angularDamping: 0.8,
            gravityFactor: 1,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(0, 0, 0),
            lockRotation: new Vector3(0, 0, 0),
            useGravity: true,
            isTrigger: false,
            collisionGroup: 64,
            collisionMask: -1,
            material: {
                staticFriction: 0.1,
                dynamicFriction: 0.1,
                restitution: 0.1,
                frictionCombine: 'min',
                restitutionCombine: 'min'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    particle: {
        name: 'Particle',
        icon: Sparkles,
        description: 'Particle physics',
        defaultProperties: {
            enabled: true,
            mass: 0.001,
            friction: 0,
            restitution: 0.8,
            linearDamping: 0.99,
            angularDamping: 0.99,
            gravityFactor: 1,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(0, 0, 0),
            lockRotation: new Vector3(0, 0, 0),
            useGravity: true,
            isTrigger: false,
            collisionGroup: 128,
            collisionMask: -1,
            material: {
                staticFriction: 0,
                dynamicFriction: 0,
                restitution: 0.8,
                frictionCombine: 'min',
                restitutionCombine: 'max'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    constraint: {
        name: 'Constraint',
        icon: Link,
        description: 'Physics constraint',
        defaultProperties: {
            enabled: true,
            mass: 0,
            friction: 0.5,
            restitution: 0.3,
            linearDamping: 0,
            angularDamping: 0,
            gravityFactor: 0,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(1, 1, 1),
            lockRotation: new Vector3(1, 1, 1),
            useGravity: false,
            isTrigger: false,
            collisionGroup: 256,
            collisionMask: -1,
            material: {
                staticFriction: 0.5,
                dynamicFriction: 0.3,
                restitution: 0.3,
                frictionCombine: 'average',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    joint: {
        name: 'Joint',
        icon: Settings,
        description: 'Physics joint',
        defaultProperties: {
            enabled: true,
            mass: 0,
            friction: 0.5,
            restitution: 0.3,
            linearDamping: 0,
            angularDamping: 0,
            gravityFactor: 0,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(1, 1, 1),
            lockRotation: new Vector3(1, 1, 1),
            useGravity: false,
            isTrigger: false,
            collisionGroup: 512,
            collisionMask: -1,
            material: {
                staticFriction: 0.5,
                dynamicFriction: 0.3,
                restitution: 0.3,
                frictionCombine: 'average',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    spring: {
        name: 'Spring',
        icon: ZapIcon,
        description: 'Spring constraint',
        defaultProperties: {
            enabled: true,
            mass: 0,
            friction: 0.5,
            restitution: 0.3,
            linearDamping: 0,
            angularDamping: 0,
            gravityFactor: 0,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(1, 1, 1),
            lockRotation: new Vector3(1, 1, 1),
            useGravity: false,
            isTrigger: false,
            collisionGroup: 1024,
            collisionMask: -1,
            material: {
                staticFriction: 0.5,
                dynamicFriction: 0.3,
                restitution: 0.3,
                frictionCombine: 'average',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    motor: {
        name: 'Motor',
        icon: Power,
        description: 'Motor constraint',
        defaultProperties: {
            enabled: true,
            mass: 0,
            friction: 0.5,
            restitution: 0.3,
            linearDamping: 0,
            angularDamping: 0,
            gravityFactor: 0,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(1, 1, 1),
            lockRotation: new Vector3(1, 1, 1),
            useGravity: false,
            isTrigger: false,
            collisionGroup: 2048,
            collisionMask: -1,
            material: {
                staticFriction: 0.5,
                dynamicFriction: 0.3,
                restitution: 0.3,
                frictionCombine: 'average',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    },
    custom: {
        name: 'Custom',
        icon: Settings,
        description: 'Custom physics',
        defaultProperties: {
            enabled: true,
            mass: 1,
            friction: 0.5,
            restitution: 0.3,
            linearDamping: 0.1,
            angularDamping: 0.1,
            gravityFactor: 1,
            linearVelocity: new Vector3(0, 0, 0),
            angularVelocity: new Vector3(0, 0, 0),
            lockPosition: new Vector3(0, 0, 0),
            lockRotation: new Vector3(0, 0, 0),
            useGravity: true,
            isTrigger: false,
            collisionGroup: 1,
            collisionMask: -1,
            material: {
                staticFriction: 0.5,
                dynamicFriction: 0.3,
                restitution: 0.3,
                frictionCombine: 'average',
                restitutionCombine: 'average'
            },
            constraints: [],
            forces: [],
            impulses: []
        }
    }
};
export function PhysicsControls({ onPhysicsCreate, onPhysicsRemove, onPhysicsUpdate, onPhysicsPlay, onPhysicsPause, onPhysicsStop }) {
    const { state } = useWorkspace();
    const [activeTab, setActiveTab] = useState('objects');
    const [selectedPhysics, setSelectedPhysics] = useState(null);
    const [physicsObjects, setPhysicsObjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    // Initialize with default physics objects
    useEffect(() => {
        const defaultPhysics = Object.entries(PHYSICS_PRESETS).slice(0, 3).map(([type, preset]) => ({
            id: `${type}-default`,
            name: `${preset.name} Physics`,
            type: type,
            targetId: '',
            ...preset.defaultProperties
        }));
        setPhysicsObjects(defaultPhysics);
    }, []);
    // Handle physics type selection
    const handleAddPhysics = useCallback((physicsType) => {
        const preset = PHYSICS_PRESETS[physicsType];
        const newPhysics = {
            id: `${physicsType}-${Date.now()}`,
            name: `${preset.name} Physics ${physicsObjects.length + 1}`,
            type: physicsType,
            targetId: '',
            ...preset.defaultProperties
        };
        setPhysicsObjects(prev => [...prev, newPhysics]);
        onPhysicsCreate?.(physicsType, newPhysics.targetId);
    }, [physicsObjects.length, onPhysicsCreate]);
    // Handle physics removal
    const handleRemovePhysics = useCallback((physicsId) => {
        setPhysicsObjects(prev => prev.filter(obj => obj.id !== physicsId));
        setSelectedPhysics(null);
        onPhysicsRemove?.(physicsId);
    }, [onPhysicsRemove]);
    // Handle physics property update
    const handlePhysicsUpdate = useCallback((physicsId, properties) => {
        setPhysicsObjects(prev => prev.map(obj => obj.id === physicsId ? { ...obj, ...properties } : obj));
        onPhysicsUpdate?.(physicsId, properties);
    }, [onPhysicsUpdate]);
    // Handle simulation control
    const handleSimulationControl = useCallback((action) => {
        setIsSimulationRunning(action === 'play');
        physicsObjects.forEach(obj => {
            switch (action) {
                case 'play':
                    onPhysicsPlay?.(obj.id);
                    break;
                case 'pause':
                    onPhysicsPause?.(obj.id);
                    break;
                case 'stop':
                    onPhysicsStop?.(obj.id);
                    break;
            }
        });
    }, [physicsObjects, onPhysicsPlay, onPhysicsPause, onPhysicsStop]);
    // Filter physics objects based on search term
    const filteredPhysics = physicsObjects.filter(obj => obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.type.toLowerCase().includes(searchTerm.toLowerCase()));
    const selectedPhysicsData = physicsObjects.find(obj => obj.id === selectedPhysics);
    return (_jsxs("div", { className: "physics-controls", children: [_jsxs("div", { className: "physics-controls-header", children: [_jsx("h3", { className: "physics-controls-title", children: "Physics Controls" }), _jsxs("div", { className: "physics-controls-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleSimulationControl('play'), disabled: isSimulationRunning, children: _jsx(Play, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleSimulationControl('pause'), disabled: !isSimulationRunning, children: _jsx(Pause, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleSimulationControl('stop'), children: _jsx(Square, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Save, { className: "w-4 h-4" }) })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "physics-controls-tabs", children: [_jsxs(TabsList, { className: "physics-controls-tabs-list", children: [_jsx(TabsTrigger, { value: "objects", children: "Objects" }), _jsx(TabsTrigger, { value: "forces", children: "Forces" }), _jsx(TabsTrigger, { value: "constraints", children: "Constraints" }), _jsx(TabsTrigger, { value: "properties", children: "Properties" })] }), _jsx(TabsContent, { value: "objects", className: "physics-controls-tab-content", children: _jsxs("div", { className: "objects-section", children: [_jsxs("div", { className: "objects-header", children: [_jsx("div", { className: "search-container", children: _jsx(Input, { placeholder: "Search physics objects...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "search-input" }) }), _jsx("div", { className: "add-physics-buttons", children: Object.entries(PHYSICS_PRESETS).slice(0, 6).map(([type, preset]) => {
                                                const IconComponent = preset.icon;
                                                return (_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleAddPhysics(type), className: "add-physics-button", title: preset.description, children: _jsx(IconComponent, { className: "w-4 h-4" }) }, type));
                                            }) }), _jsx("div", { className: "add-physics-buttons", children: Object.entries(PHYSICS_PRESETS).slice(6).map(([type, preset]) => {
                                                const IconComponent = preset.icon;
                                                return (_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleAddPhysics(type), className: "add-physics-button", title: preset.description, children: _jsx(IconComponent, { className: "w-4 h-4" }) }, type));
                                            }) })] }), _jsxs("div", { className: "objects-list", children: [_jsxs("h4", { className: "section-title", children: ["Physics Objects (", filteredPhysics.length, ")"] }), _jsx(ScrollArea, { className: "objects-scroll-area", children: _jsx("div", { className: "objects-grid", children: filteredPhysics.map((physics) => {
                                                    const preset = PHYSICS_PRESETS[physics.type];
                                                    const IconComponent = preset.icon;
                                                    return (_jsx(Card, { className: `physics-card ${selectedPhysics === physics.id ? 'selected' : ''}`, onClick: () => setSelectedPhysics(physics.id), children: _jsxs(CardContent, { className: "physics-content", children: [_jsxs("div", { className: "physics-header", children: [_jsxs("div", { className: "physics-info", children: [_jsx(IconComponent, { className: "w-4 h-4" }), _jsx("span", { className: "physics-name", children: physics.name }), _jsx(Badge, { variant: "secondary", className: "physics-type", children: physics.type })] }), _jsxs("div", { className: "physics-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        handlePhysicsUpdate(physics.id, { enabled: !physics.enabled });
                                                                                    }, children: physics.enabled ? _jsx(Eye, { className: "w-3 h-3" }) : _jsx(EyeOff, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        handleRemovePhysics(physics.id);
                                                                                    }, children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }), _jsxs("div", { className: "physics-properties", children: [_jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Mass" }), _jsx(Input, { type: "number", min: "0", step: "0.1", value: physics.mass, onChange: (e) => handlePhysicsUpdate(physics.id, { mass: parseFloat(e.target.value) }), className: "property-input" })] }), _jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Friction" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.1", value: physics.friction, onChange: (e) => handlePhysicsUpdate(physics.id, { friction: parseFloat(e.target.value) }), className: "property-input" })] }), _jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Restitution" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.1", value: physics.restitution, onChange: (e) => handlePhysicsUpdate(physics.id, { restitution: parseFloat(e.target.value) }), className: "property-input" })] }), _jsx("div", { className: "property-row", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: physics.useGravity, onChange: (e) => handlePhysicsUpdate(physics.id, { useGravity: e.target.checked }) }), "Gravity"] }) })] })] }) }, physics.id));
                                                }) }) })] })] }) }), _jsx(TabsContent, { value: "forces", className: "physics-controls-tab-content", children: _jsxs("div", { className: "forces-section", children: [_jsxs("div", { className: "forces-header", children: [_jsx("h4", { className: "section-title", children: "Forces & Impulses" }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Force"] })] }), _jsx(ScrollArea, { className: "forces-scroll-area", children: _jsx("div", { className: "forces-grid", children: selectedPhysicsData?.forces.map((force) => (_jsx(Card, { className: "force-card", children: _jsxs(CardContent, { className: "force-content", children: [_jsxs("div", { className: "force-header", children: [_jsxs("div", { className: "force-info", children: [_jsx(WindIcon, { className: "w-4 h-4" }), _jsx("span", { className: "force-name", children: force.type })] }), _jsxs("div", { className: "force-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                                                            // Toggle force
                                                                        }, children: force.enabled ? _jsx(Eye, { className: "w-3 h-3" }) : _jsx(EyeOff, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                                                            // Remove force
                                                                        }, children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }), _jsxs("div", { className: "force-properties", children: [_jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Magnitude" }), _jsx(Input, { type: "number", min: "0", step: "0.1", value: force.magnitude, onChange: (e) => {
                                                                            // Update force magnitude
                                                                        }, className: "property-input" })] }), _jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Duration" }), _jsx(Input, { type: "number", min: "0", step: "0.1", value: force.duration, onChange: (e) => {
                                                                            // Update force duration
                                                                        }, className: "property-input" })] })] })] }) }, force.id))) }) })] }) }), _jsx(TabsContent, { value: "constraints", className: "physics-controls-tab-content", children: _jsxs("div", { className: "constraints-section", children: [_jsxs("div", { className: "constraints-header", children: [_jsx("h4", { className: "section-title", children: "Constraints & Joints" }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Add Constraint"] })] }), _jsx(ScrollArea, { className: "constraints-scroll-area", children: _jsx("div", { className: "constraints-grid", children: selectedPhysicsData?.constraints.map((constraint) => (_jsx(Card, { className: "constraint-card", children: _jsxs(CardContent, { className: "constraint-content", children: [_jsxs("div", { className: "constraint-header", children: [_jsxs("div", { className: "constraint-info", children: [_jsx(Link, { className: "w-4 h-4" }), _jsx("span", { className: "constraint-name", children: constraint.type })] }), _jsxs("div", { className: "constraint-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                                                            // Toggle constraint
                                                                        }, children: constraint.enabled ? _jsx(Eye, { className: "w-3 h-3" }) : _jsx(EyeOff, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                                                            // Remove constraint
                                                                        }, children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }), _jsx("div", { className: "constraint-properties", children: _jsxs("div", { className: "property-row", children: [_jsx("span", { className: "property-label", children: "Target" }), _jsx(Input, { value: constraint.targetId, onChange: (e) => {
                                                                        // Update constraint target
                                                                    }, className: "property-input" })] }) })] }) }, constraint.id))) }) })] }) }), _jsx(TabsContent, { value: "properties", className: "physics-controls-tab-content", children: selectedPhysicsData ? (_jsxs("div", { className: "properties-section", children: [_jsx("h4", { className: "section-title", children: "Physics Properties" }), _jsx(ScrollArea, { className: "properties-scroll-area", children: _jsx("div", { className: "properties-content", children: _jsxs("div", { className: "property-group", children: [_jsx("h5", { className: "property-group-title", children: "Basic Properties" }), _jsxs("div", { className: "property-grid", children: [_jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Name" }), _jsx(Input, { value: selectedPhysicsData.name, onChange: (e) => handlePhysicsUpdate(selectedPhysicsData.id, { name: e.target.value }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Target ID" }), _jsx(Input, { placeholder: "Object ID", value: selectedPhysicsData.targetId, onChange: (e) => handlePhysicsUpdate(selectedPhysicsData.id, { targetId: e.target.value }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Mass" }), _jsx(Input, { type: "number", min: "0", step: "0.1", value: selectedPhysicsData.mass, onChange: (e) => handlePhysicsUpdate(selectedPhysicsData.id, { mass: parseFloat(e.target.value) }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Friction" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.1", value: selectedPhysicsData.friction, onChange: (e) => handlePhysicsUpdate(selectedPhysicsData.id, { friction: parseFloat(e.target.value) }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Restitution" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.1", value: selectedPhysicsData.restitution, onChange: (e) => handlePhysicsUpdate(selectedPhysicsData.id, { restitution: parseFloat(e.target.value) }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Linear Damping" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.1", value: selectedPhysicsData.linearDamping, onChange: (e) => handlePhysicsUpdate(selectedPhysicsData.id, { linearDamping: parseFloat(e.target.value) }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Angular Damping" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.1", value: selectedPhysicsData.angularDamping, onChange: (e) => handlePhysicsUpdate(selectedPhysicsData.id, { angularDamping: parseFloat(e.target.value) }) })] }), _jsx("div", { className: "property-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: selectedPhysicsData.useGravity, onChange: (e) => handlePhysicsUpdate(selectedPhysicsData.id, { useGravity: e.target.checked }) }), "Use Gravity"] }) })] })] }) }) })] })) : (_jsx("div", { className: "no-selection", children: _jsx("p", { children: "Select a physics object to view its properties" }) })) })] })] }));
}
