import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './SceneBrowser.css';
const SceneBrowser = ({ scene, engine, onObjectSelect, onObjectVisibilityChange, onObjectLockChange }) => {
    const [sceneObjects, setSceneObjects] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const [selectedObject, setSelectedObject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        updateSceneObjects();
        const observer = scene.onNewMeshAddedObservable.add(() => updateSceneObjects());
        const observer2 = scene.onMeshRemovedObservable.add(() => updateSceneObjects());
        return () => {
            scene.onNewMeshAddedObservable.remove(observer);
            scene.onMeshRemovedObservable.remove(observer2);
        };
    }, [scene]);
    const updateSceneObjects = () => {
        const objects = [];
        // Add all meshes
        scene.meshes.forEach(mesh => {
            if (!mesh.name.startsWith('__') && !mesh.name.includes('shadow') && !mesh.name.includes('traffic_viz')) {
                objects.push({
                    id: mesh.id,
                    name: mesh.name,
                    type: 'mesh',
                    parent: mesh.parent?.id,
                    children: mesh.getChildMeshes().map(child => child.id),
                    visible: mesh.isVisible,
                    locked: mesh.isPickable === false,
                    level: getObjectLevel(mesh)
                });
            }
        });
        // Add transform nodes
        scene.transformNodes.forEach(node => {
            if (!node.name.startsWith('__')) {
                objects.push({
                    id: node.id,
                    name: node.name,
                    type: 'transformNode',
                    parent: node.parent?.id,
                    children: node.getChildTransformNodes().map(child => child.id),
                    visible: node.isEnabled(),
                    locked: false,
                    level: getObjectLevel(node)
                });
            }
        });
        // Sort by hierarchy level and name
        objects.sort((a, b) => {
            if (a.level !== b.level)
                return a.level - b.level;
            return a.name.localeCompare(b.name);
        });
        setSceneObjects(objects);
    };
    const getObjectLevel = (obj) => {
        let level = 0;
        let current = obj.parent;
        while (current) {
            level++;
            current = current.parent;
        }
        return level;
    };
    const toggleExpanded = (objectId) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(objectId)) {
            newExpanded.delete(objectId);
        }
        else {
            newExpanded.add(objectId);
        }
        setExpandedNodes(newExpanded);
    };
    const handleObjectSelect = (object) => {
        setSelectedObject(object.id);
        const sceneObj = scene.getMeshById(object.id) || scene.getTransformNodeById(object.id);
        if (sceneObj && onObjectSelect) {
            onObjectSelect(sceneObj);
        }
    };
    const toggleVisibility = (object) => {
        const sceneObj = scene.getMeshById(object.id) || scene.getTransformNodeById(object.id);
        if (sceneObj) {
            const newVisible = !object.visible;
            sceneObj.setEnabled(newVisible);
            if (onObjectVisibilityChange) {
                onObjectVisibilityChange(sceneObj, newVisible);
            }
            updateSceneObjects();
        }
    };
    const toggleLock = (object) => {
        const sceneObj = scene.getMeshById(object.id);
        if (sceneObj) {
            const newLocked = !object.locked;
            sceneObj.isPickable = !newLocked;
            if (onObjectLockChange) {
                onObjectLockChange(sceneObj, newLocked);
            }
            updateSceneObjects();
        }
    };
    const renameObject = (objectId, newName) => {
        const sceneObj = scene.getMeshById(objectId) || scene.getTransformNodeById(objectId);
        if (sceneObj) {
            sceneObj.name = newName;
            updateSceneObjects();
        }
    };
    const filteredObjects = sceneObjects.filter(obj => obj.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const getObjectIcon = (type) => {
        switch (type) {
            case 'mesh': return '📦';
            case 'transformNode': return '📁';
            case 'light': return '💡';
            case 'camera': return '📷';
            default: return '❓';
        }
    };
    const getIndentation = (level) => {
        return '  '.repeat(level);
    };
    return (_jsxs("div", { className: "scene-browser-container", children: [_jsx("h3", { className: "scene-browser-title", children: "Scene Browser" }), _jsx("div", { className: "search-container", children: _jsx("input", { type: "text", placeholder: "Search objects...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "search-input" }) }), _jsx("div", { className: "object-list-container", children: filteredObjects.map((object) => {
                    const hasChildren = object.children.length > 0;
                    const isExpanded = expandedNodes.has(object.id);
                    const isSelected = selectedObject === object.id;
                    return (_jsxs("div", { children: [_jsxs("div", { className: `object-item ${isSelected ? 'object-item-selected' : ''}`, onClick: () => handleObjectSelect(object), children: [_jsx("div", { className: `expand-button ${hasChildren ? '' : 'no-children'}`, onClick: (e) => {
                                            e.stopPropagation();
                                            if (hasChildren)
                                                toggleExpanded(object.id);
                                        }, children: hasChildren ? (isExpanded ? '▼' : '▶') : '  ' }), _jsx("div", { className: `visibility-toggle ${object.visible ? '' : 'hidden'}`, onClick: (e) => {
                                            e.stopPropagation();
                                            toggleVisibility(object);
                                        }, title: object.visible ? 'Hide object' : 'Show object', children: "\uD83D\uDC41" }), _jsx("div", { className: `lock-toggle ${object.locked ? 'locked' : ''}`, onClick: (e) => {
                                            e.stopPropagation();
                                            toggleLock(object);
                                        }, title: object.locked ? 'Unlock object' : 'Lock object', children: object.locked ? '🔒' : '🔓' }), _jsx("span", { className: "object-icon", children: getObjectIcon(object.type) }), _jsxs("span", { className: "object-name", children: [getIndentation(object.level), object.name] })] }), isExpanded && hasChildren && (_jsx("div", { children: object.children.map(childId => {
                                    const childObj = filteredObjects.find(obj => obj.id === childId);
                                    if (!childObj)
                                        return null;
                                    return (_jsxs("div", { className: `child-item ${selectedObject === childId ? 'child-item-selected' : ''}`, onClick: () => handleObjectSelect(childObj), children: [_jsx("span", { className: "object-icon", children: getObjectIcon(childObj.type) }), _jsx("span", { children: childObj.name })] }, childId));
                                }) }))] }, object.id));
                }) }), _jsxs("div", { className: "statistics-container", children: [_jsxs("div", { children: ["Total Objects: ", sceneObjects.length] }), _jsxs("div", { children: ["Visible: ", sceneObjects.filter(obj => obj.visible).length] }), _jsxs("div", { children: ["Locked: ", sceneObjects.filter(obj => obj.locked).length] })] })] }));
};
export default SceneBrowser;
