import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { useWorkspace } from '../core/WorkspaceContext';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { ScrollArea } from '../../ui/scroll-area';
import { Vector3, Color3 } from '@babylonjs/core';
import { Cube, Circle, Triangle, Hexagon, Star, Copy, Trash2, Eye, EyeOff, Lock, Unlock, Settings, Plus, Save, Square, Diamond } from 'lucide-react';
import './ObjectControls.css';
const OBJECT_PRESETS = {
    box: {
        name: 'Box',
        icon: Cube,
        description: 'Rectangular prism',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: true,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 1,
            friction: 0.5,
            restitution: 0.3
        }
    },
    sphere: {
        name: 'Sphere',
        icon: Circle,
        description: 'Perfect sphere',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: true,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 1,
            friction: 0.5,
            restitution: 0.3
        }
    },
    cylinder: {
        name: 'Cylinder',
        icon: Circle,
        description: 'Cylindrical shape',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: true,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 1,
            friction: 0.5,
            restitution: 0.3
        }
    },
    cone: {
        name: 'Cone',
        icon: Triangle,
        description: 'Conical shape',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: true,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 1,
            friction: 0.5,
            restitution: 0.3
        }
    },
    plane: {
        name: 'Plane',
        icon: Square,
        description: 'Flat plane surface',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: false,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 0,
            friction: 0.5,
            restitution: 0.3
        }
    },
    torus: {
        name: 'Torus',
        icon: Circle,
        description: 'Donut-shaped ring',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: true,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 1,
            friction: 0.5,
            restitution: 0.3
        }
    },
    capsule: {
        name: 'Capsule',
        icon: Circle,
        description: 'Capsule shape',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: true,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 1,
            friction: 0.5,
            restitution: 0.3
        }
    },
    tetrahedron: {
        name: 'Tetrahedron',
        icon: Triangle,
        description: 'Four-sided pyramid',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: true,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 1,
            friction: 0.5,
            restitution: 0.3
        }
    },
    octahedron: {
        name: 'Octahedron',
        icon: Diamond,
        description: 'Eight-sided polyhedron',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: true,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 1,
            friction: 0.5,
            restitution: 0.3
        }
    },
    dodecahedron: {
        name: 'Dodecahedron',
        icon: Hexagon,
        description: 'Twelve-sided polyhedron',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: true,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 1,
            friction: 0.5,
            restitution: 0.3
        }
    },
    icosahedron: {
        name: 'Icosahedron',
        icon: Star,
        description: 'Twenty-sided polyhedron',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: true,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 1,
            friction: 0.5,
            restitution: 0.3
        }
    },
    custom: {
        name: 'Custom',
        icon: Settings,
        description: 'Custom 3D model',
        defaultProperties: {
            position: new Vector3(0, 0, 0),
            rotation: new Vector3(0, 0, 0),
            scale: new Vector3(1, 1, 1),
            color: new Color3(0.8, 0.8, 0.8),
            opacity: 1,
            wireframe: false,
            castShadows: true,
            receiveShadows: true,
            physicsEnabled: false,
            mass: 1,
            friction: 0.5,
            restitution: 0.3
        }
    }
};
export function ObjectControls({ onObjectAdd, onObjectRemove, onObjectUpdate, onObjectSelect, onGroupCreate, onGroupRemove }) {
    const { state } = useWorkspace();
    const [activeTab, setActiveTab] = useState('objects');
    const [selectedObject, setSelectedObject] = useState(null);
    const [objects, setObjects] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    // Get objects from scene
    useEffect(() => {
        if (state.scene) {
            const sceneObjects = state.scene.meshes?.map((mesh, index) => ({
                id: mesh.name || `object-${index}`,
                name: mesh.name || `Object ${index + 1}`,
                type: 'box', // Default type for now
                position: mesh.position || new Vector3(0, 0, 0),
                rotation: mesh.rotation || new Vector3(0, 0, 0),
                scale: mesh.scaling || new Vector3(1, 1, 1),
                visible: mesh.isVisible,
                locked: false,
                color: new Color3(0.8, 0.8, 0.8),
                opacity: mesh.visibility || 1,
                wireframe: false,
                castShadows: true,
                receiveShadows: true,
                physicsEnabled: false,
                mass: 1,
                friction: 0.5,
                restitution: 0.3,
                tags: [],
                metadata: {}
            })) || [];
            setObjects(sceneObjects);
        }
    }, [state.scene]);
    // Handle object type selection
    const handleAddObject = useCallback((objectType) => {
        const preset = OBJECT_PRESETS[objectType];
        const newObject = {
            id: `${objectType}-${Date.now()}`,
            name: `${preset.name} ${objects.length + 1}`,
            type: objectType,
            ...preset.defaultProperties
        };
        setObjects(prev => [...prev, newObject]);
        onObjectAdd?.(objectType, newObject.position);
    }, [objects.length, onObjectAdd]);
    // Handle object removal
    const handleRemoveObject = useCallback((objectId) => {
        setObjects(prev => prev.filter(obj => obj.id !== objectId));
        setSelectedObject(null);
        onObjectRemove?.(objectId);
    }, [onObjectRemove]);
    // Handle object property update
    const handleObjectUpdate = useCallback((objectId, properties) => {
        setObjects(prev => prev.map(obj => obj.id === objectId ? { ...obj, ...properties } : obj));
        onObjectUpdate?.(objectId, properties);
    }, [onObjectUpdate]);
    // Handle object selection
    const handleObjectSelect = useCallback((objectId) => {
        setSelectedObject(objectId);
        onObjectSelect?.(objectId);
    }, [onObjectSelect]);
    // Handle group creation
    const handleCreateGroup = useCallback(() => {
        const selectedObjects = objects.filter(obj => obj.id === selectedObject);
        if (selectedObjects.length > 0) {
            const newGroup = {
                id: `group-${Date.now()}`,
                name: `Group ${groups.length + 1}`,
                objectIds: selectedObjects.map(obj => obj.id),
                color: new Color3(Math.random(), Math.random(), Math.random()),
                visible: true,
                locked: false
            };
            setGroups(prev => [...prev, newGroup]);
            onGroupCreate?.(newGroup.name, newGroup.objectIds);
        }
    }, [objects, selectedObject, groups.length, onGroupCreate]);
    // Handle group removal
    const handleRemoveGroup = useCallback((groupId) => {
        setGroups(prev => prev.filter(group => group.id !== groupId));
        setSelectedGroup(null);
        onGroupRemove?.(groupId);
    }, [onGroupRemove]);
    // Toggle object visibility
    const toggleObjectVisibility = useCallback((objectId) => {
        const object = objects.find(obj => obj.id === objectId);
        if (object) {
            handleObjectUpdate(objectId, { visible: !object.visible });
        }
    }, [objects, handleObjectUpdate]);
    // Toggle object lock
    const toggleObjectLock = useCallback((objectId) => {
        const object = objects.find(obj => obj.id === objectId);
        if (object) {
            handleObjectUpdate(objectId, { locked: !object.locked });
        }
    }, [objects, handleObjectUpdate]);
    // Duplicate object
    const duplicateObject = useCallback((objectId) => {
        const object = objects.find(obj => obj.id === objectId);
        if (object) {
            const newObject = {
                ...object,
                id: `${object.type}-${Date.now()}`,
                name: `${object.name} Copy`,
                position: new Vector3(object.position.x + 2, object.position.y, object.position.z + 2)
            };
            setObjects(prev => [...prev, newObject]);
        }
    }, [objects]);
    // Filter objects based on search term
    const filteredObjects = objects.filter(obj => obj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.type.toLowerCase().includes(searchTerm.toLowerCase()));
    const selectedObjectData = objects.find(obj => obj.id === selectedObject);
    return (_jsxs("div", { className: "object-controls", children: [_jsxs("div", { className: "object-controls-header", children: [_jsx("h3", { className: "object-controls-title", children: "Object Controls" }), _jsxs("div", { className: "object-controls-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: handleCreateGroup, children: _jsx(Plus, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Save, { className: "w-4 h-4" }) })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "object-controls-tabs", children: [_jsxs(TabsList, { className: "object-controls-tabs-list", children: [_jsx(TabsTrigger, { value: "objects", children: "Objects" }), _jsx(TabsTrigger, { value: "groups", children: "Groups" }), _jsx(TabsTrigger, { value: "properties", children: "Properties" })] }), _jsx(TabsContent, { value: "objects", className: "object-controls-tab-content", children: _jsxs("div", { className: "objects-section", children: [_jsxs("div", { className: "objects-header", children: [_jsx("div", { className: "search-container", children: _jsx(Input, { placeholder: "Search objects...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "search-input" }) }), _jsx("div", { className: "add-object-buttons", children: Object.entries(OBJECT_PRESETS).slice(0, 6).map(([type, preset]) => {
                                                const IconComponent = preset.icon;
                                                return (_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleAddObject(type), className: "add-object-button", title: preset.description, children: _jsx(IconComponent, { className: "w-4 h-4" }) }, type));
                                            }) }), _jsx("div", { className: "add-object-buttons", children: Object.entries(OBJECT_PRESETS).slice(6).map(([type, preset]) => {
                                                const IconComponent = preset.icon;
                                                return (_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleAddObject(type), className: "add-object-button", title: preset.description, children: _jsx(IconComponent, { className: "w-4 h-4" }) }, type));
                                            }) })] }), _jsxs("div", { className: "objects-list", children: [_jsxs("h4", { className: "section-title", children: ["Scene Objects (", filteredObjects.length, ")"] }), _jsx(ScrollArea, { className: "objects-scroll-area", children: _jsx("div", { className: "objects-grid", children: filteredObjects.map((object) => {
                                                    const preset = OBJECT_PRESETS[object.type];
                                                    const IconComponent = preset.icon;
                                                    return (_jsx(Card, { className: `object-card ${selectedObject === object.id ? 'selected' : ''}`, onClick: () => handleObjectSelect(object.id), children: _jsxs(CardContent, { className: "object-content", children: [_jsxs("div", { className: "object-header", children: [_jsxs("div", { className: "object-info", children: [_jsx(IconComponent, { className: "w-4 h-4" }), _jsx("span", { className: "object-name", children: object.name }), _jsx(Badge, { variant: "secondary", className: "object-type", children: object.type })] }), _jsxs("div", { className: "object-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        toggleObjectVisibility(object.id);
                                                                                    }, children: object.visible ? _jsx(Eye, { className: "w-3 h-3" }) : _jsx(EyeOff, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        toggleObjectLock(object.id);
                                                                                    }, children: object.locked ? _jsx(Lock, { className: "w-3 h-3" }) : _jsx(Unlock, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        duplicateObject(object.id);
                                                                                    }, children: _jsx(Copy, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        handleRemoveObject(object.id);
                                                                                    }, children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }), _jsx("div", { className: "object-preview", children: _jsx("div", { className: "object-color", style: {
                                                                            backgroundColor: `rgb(${object.color.r * 255}, ${object.color.g * 255}, ${object.color.b * 255})`,
                                                                            opacity: object.opacity
                                                                        } }) })] }) }, object.id));
                                                }) }) })] })] }) }), _jsx(TabsContent, { value: "groups", className: "object-controls-tab-content", children: _jsxs("div", { className: "groups-section", children: [_jsxs("div", { className: "groups-header", children: [_jsxs("h4", { className: "section-title", children: ["Object Groups (", groups.length, ")"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleCreateGroup, children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create Group"] })] }), _jsx(ScrollArea, { className: "groups-scroll-area", children: _jsx("div", { className: "groups-grid", children: groups.map((group) => (_jsx(Card, { className: `group-card ${selectedGroup === group.id ? 'selected' : ''}`, onClick: () => setSelectedGroup(group.id), children: _jsxs(CardContent, { className: "group-content", children: [_jsxs("div", { className: "group-header", children: [_jsxs("div", { className: "group-info", children: [_jsx("div", { className: "group-color", style: {
                                                                            backgroundColor: `rgb(${group.color.r * 255}, ${group.color.g * 255}, ${group.color.b * 255})`
                                                                        } }), _jsx("span", { className: "group-name", children: group.name }), _jsxs(Badge, { variant: "secondary", className: "group-count", children: [group.objectIds.length, " objects"] })] }), _jsx("div", { className: "group-actions", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                        e.stopPropagation();
                                                                        handleRemoveGroup(group.id);
                                                                    }, children: _jsx(Trash2, { className: "w-3 h-3" }) }) })] }), _jsxs("div", { className: "group-controls", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    // Toggle group visibility
                                                                }, children: group.visible ? _jsx(Eye, { className: "w-3 h-3" }) : _jsx(EyeOff, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    // Toggle group lock
                                                                }, children: group.locked ? _jsx(Lock, { className: "w-3 h-3" }) : _jsx(Unlock, { className: "w-3 h-3" }) })] })] }) }, group.id))) }) })] }) }), _jsx(TabsContent, { value: "properties", className: "object-controls-tab-content", children: selectedObjectData ? (_jsxs("div", { className: "properties-section", children: [_jsx("h4", { className: "section-title", children: "Object Properties" }), _jsx(ScrollArea, { className: "properties-scroll-area", children: _jsxs("div", { className: "properties-content", children: [_jsxs("div", { className: "property-group", children: [_jsx("h5", { className: "property-group-title", children: "Transform" }), _jsxs("div", { className: "property-grid", children: [_jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Position X" }), _jsx(Input, { type: "number", step: "0.1", value: selectedObjectData.position.x, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                            position: new Vector3(parseFloat(e.target.value), selectedObjectData.position.y, selectedObjectData.position.z)
                                                                        }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Position Y" }), _jsx(Input, { type: "number", step: "0.1", value: selectedObjectData.position.y, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                            position: new Vector3(selectedObjectData.position.x, parseFloat(e.target.value), selectedObjectData.position.z)
                                                                        }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Position Z" }), _jsx(Input, { type: "number", step: "0.1", value: selectedObjectData.position.z, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                            position: new Vector3(selectedObjectData.position.x, selectedObjectData.position.y, parseFloat(e.target.value))
                                                                        }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Rotation X" }), _jsx(Input, { type: "number", step: "0.01", value: selectedObjectData.rotation.x, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                            rotation: new Vector3(parseFloat(e.target.value), selectedObjectData.rotation.y, selectedObjectData.rotation.z)
                                                                        }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Rotation Y" }), _jsx(Input, { type: "number", step: "0.01", value: selectedObjectData.rotation.y, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                            rotation: new Vector3(selectedObjectData.rotation.x, parseFloat(e.target.value), selectedObjectData.rotation.z)
                                                                        }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Rotation Z" }), _jsx(Input, { type: "number", step: "0.01", value: selectedObjectData.rotation.z, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                            rotation: new Vector3(selectedObjectData.rotation.x, selectedObjectData.rotation.y, parseFloat(e.target.value))
                                                                        }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Scale X" }), _jsx(Input, { type: "number", step: "0.1", value: selectedObjectData.scale.x, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                            scale: new Vector3(parseFloat(e.target.value), selectedObjectData.scale.y, selectedObjectData.scale.z)
                                                                        }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Scale Y" }), _jsx(Input, { type: "number", step: "0.1", value: selectedObjectData.scale.y, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                            scale: new Vector3(selectedObjectData.scale.x, parseFloat(e.target.value), selectedObjectData.scale.z)
                                                                        }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Scale Z" }), _jsx(Input, { type: "number", step: "0.1", value: selectedObjectData.scale.z, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                            scale: new Vector3(selectedObjectData.scale.x, selectedObjectData.scale.y, parseFloat(e.target.value))
                                                                        }) })] })] })] }), _jsxs("div", { className: "property-group", children: [_jsx("h5", { className: "property-group-title", children: "Appearance" }), _jsxs("div", { className: "property-grid", children: [_jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Color" }), _jsx("div", { className: "color-picker", children: _jsx("input", { type: "color", value: selectedObjectData.color.toHexString(), onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                                color: Color3.FromHexString(e.target.value)
                                                                            }) }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Opacity" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.1", value: selectedObjectData.opacity, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                            opacity: parseFloat(e.target.value)
                                                                        }) })] }), _jsx("div", { className: "property-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: selectedObjectData.wireframe, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                                wireframe: e.target.checked
                                                                            }) }), "Wireframe"] }) })] })] }), _jsxs("div", { className: "property-group", children: [_jsx("h5", { className: "property-group-title", children: "Shadows" }), _jsxs("div", { className: "property-grid", children: [_jsx("div", { className: "property-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: selectedObjectData.castShadows, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                                castShadows: e.target.checked
                                                                            }) }), "Cast Shadows"] }) }), _jsx("div", { className: "property-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: selectedObjectData.receiveShadows, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                                receiveShadows: e.target.checked
                                                                            }) }), "Receive Shadows"] }) })] })] }), _jsxs("div", { className: "property-group", children: [_jsx("h5", { className: "property-group-title", children: "Physics" }), _jsxs("div", { className: "property-grid", children: [_jsx("div", { className: "property-item", children: _jsxs("label", { className: "checkbox-label", children: [_jsx("input", { type: "checkbox", checked: selectedObjectData.physicsEnabled, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                                physicsEnabled: e.target.checked
                                                                            }) }), "Physics Enabled"] }) }), selectedObjectData.physicsEnabled && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Mass" }), _jsx(Input, { type: "number", min: "0", step: "0.1", value: selectedObjectData.mass, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                                    mass: parseFloat(e.target.value)
                                                                                }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Friction" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.1", value: selectedObjectData.friction, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                                    friction: parseFloat(e.target.value)
                                                                                }) })] }), _jsxs("div", { className: "property-item", children: [_jsx("label", { children: "Restitution" }), _jsx(Input, { type: "number", min: "0", max: "1", step: "0.1", value: selectedObjectData.restitution, onChange: (e) => handleObjectUpdate(selectedObjectData.id, {
                                                                                    restitution: parseFloat(e.target.value)
                                                                                }) })] })] }))] })] })] }) })] })) : (_jsx("div", { className: "no-selection", children: _jsx("p", { children: "Select an object to view its properties" }) })) })] })] }));
}
