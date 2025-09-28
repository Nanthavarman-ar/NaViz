import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
const MaterialEditor = ({ sceneManager, onClose, onMaterialChange }) => {
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [editorMode, setEditorMode] = useState('properties');
    const [nodeMaterial, setNodeMaterial] = useState(null);
    const [materialProperties, setMaterialProperties] = useState({
        diffuseColor: { r: 1, g: 1, b: 1 },
        specularColor: { r: 1, g: 1, b: 1 },
        emissiveColor: { r: 0, g: 0, b: 0 },
        alpha: 1,
        metallic: 0,
        roughness: 0.5,
        specularPower: 64
    });
    // Load materials from scene
    useEffect(() => {
        if (sceneManager?.scene) {
            const sceneMaterials = sceneManager.scene.materials;
            const materialStates = [];
            sceneMaterials.forEach((mat, index) => {
                const materialState = {
                    id: mat.id || `material_${index}`,
                    name: mat.name || `Material ${index + 1}`,
                    type: mat instanceof BABYLON.PBRMaterial ? 'pbr' : 'standard',
                    properties: mat,
                    isActive: true,
                    lastModified: Date.now()
                };
                materialStates.push(materialState);
            });
            setMaterials(materialStates);
            if (materialStates.length > 0 && !selectedMaterial) {
                setSelectedMaterial(materialStates[0]);
                loadMaterialProperties(materialStates[0]);
            }
        }
    }, [sceneManager]);
    const loadMaterialProperties = (material) => {
        const babylonMaterial = material.properties;
        if (babylonMaterial instanceof BABYLON.StandardMaterial) {
            setMaterialProperties({
                diffuseColor: {
                    r: babylonMaterial.diffuseColor.r,
                    g: babylonMaterial.diffuseColor.g,
                    b: babylonMaterial.diffuseColor.b
                },
                specularColor: {
                    r: babylonMaterial.specularColor.r,
                    g: babylonMaterial.specularColor.g,
                    b: babylonMaterial.specularColor.b
                },
                emissiveColor: {
                    r: babylonMaterial.emissiveColor.r,
                    g: babylonMaterial.emissiveColor.g,
                    b: babylonMaterial.emissiveColor.b
                },
                alpha: babylonMaterial.alpha,
                metallic: 0,
                roughness: 1 - babylonMaterial.specularPower / 128,
                specularPower: babylonMaterial.specularPower
            });
        }
        else if (babylonMaterial instanceof BABYLON.PBRMaterial) {
            setMaterialProperties({
                diffuseColor: {
                    r: babylonMaterial.albedoColor.r,
                    g: babylonMaterial.albedoColor.g,
                    b: babylonMaterial.albedoColor.b
                },
                specularColor: { r: 1, g: 1, b: 1 },
                emissiveColor: {
                    r: babylonMaterial.emissiveColor.r,
                    g: babylonMaterial.emissiveColor.g,
                    b: babylonMaterial.emissiveColor.b
                },
                alpha: babylonMaterial.alpha,
                metallic: babylonMaterial.metallic || 0,
                roughness: babylonMaterial.roughness || 0.5,
                specularPower: 64
            });
        }
    };
    const handleMaterialSelect = (material) => {
        setSelectedMaterial(material);
        loadMaterialProperties(material);
    };
    const handlePropertyChange = (property, value) => {
        setMaterialProperties(prev => ({
            ...prev,
            [property]: value
        }));
    };
    const applyMaterialChanges = () => {
        if (!selectedMaterial || !sceneManager?.scene)
            return;
        const babylonMaterial = selectedMaterial.properties;
        if (babylonMaterial instanceof BABYLON.StandardMaterial) {
            babylonMaterial.diffuseColor = new BABYLON.Color3(materialProperties.diffuseColor.r, materialProperties.diffuseColor.g, materialProperties.diffuseColor.b);
            babylonMaterial.specularColor = new BABYLON.Color3(materialProperties.specularColor.r, materialProperties.specularColor.g, materialProperties.specularColor.b);
            babylonMaterial.emissiveColor = new BABYLON.Color3(materialProperties.emissiveColor.r, materialProperties.emissiveColor.g, materialProperties.emissiveColor.b);
            babylonMaterial.alpha = materialProperties.alpha;
            babylonMaterial.specularPower = materialProperties.specularPower;
        }
        else if (babylonMaterial instanceof BABYLON.PBRMaterial) {
            babylonMaterial.albedoColor = new BABYLON.Color3(materialProperties.diffuseColor.r, materialProperties.diffuseColor.g, materialProperties.diffuseColor.b);
            babylonMaterial.emissiveColor = new BABYLON.Color3(materialProperties.emissiveColor.r, materialProperties.emissiveColor.g, materialProperties.emissiveColor.b);
            babylonMaterial.alpha = materialProperties.alpha;
            babylonMaterial.metallic = materialProperties.metallic;
            babylonMaterial.roughness = materialProperties.roughness;
        }
        const updatedMaterial = {
            ...selectedMaterial,
            properties: babylonMaterial,
            lastModified: Date.now()
        };
        if (onMaterialChange) {
            onMaterialChange(updatedMaterial);
        }
    };
    const createNewMaterial = () => {
        if (!sceneManager?.scene)
            return;
        const newMaterial = new BABYLON.StandardMaterial(`New Material ${materials.length + 1}`, sceneManager.scene);
        newMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        const newMaterialState = {
            id: newMaterial.id,
            name: newMaterial.name,
            type: 'standard',
            properties: newMaterial,
            isActive: true,
            lastModified: Date.now()
        };
        setMaterials(prev => [...prev, newMaterialState]);
        setSelectedMaterial(newMaterialState);
        loadMaterialProperties(newMaterialState);
    };
    const createNodeMaterial = () => {
        if (!sceneManager?.scene)
            return;
        const nodeMat = new BABYLON.NodeMaterial(`Node Material ${materials.length + 1}`, sceneManager.scene);
        // Create simple fragment shader with color input
        const colorInput = new BABYLON.InputBlock("color");
        colorInput.value = new BABYLON.Color3(0.5, 0.5, 0.5);
        const fragmentOutput = new BABYLON.FragmentOutputBlock("FragmentOutput");
        colorInput.connectTo(fragmentOutput);
        // Add output node
        nodeMat.addOutputNode(fragmentOutput);
        nodeMat.build();
        const newMaterialState = {
            id: nodeMat.id,
            name: nodeMat.name,
            type: 'node',
            properties: nodeMat,
            isActive: true,
            lastModified: Date.now()
        };
        setMaterials(prev => [...prev, newMaterialState]);
        setSelectedMaterial(newMaterialState);
        setNodeMaterial(nodeMat);
        setEditorMode('node');
    };
    const convertToNodeMaterial = () => {
        if (!selectedMaterial || !sceneManager?.scene)
            return;
        const nodeMat = new BABYLON.NodeMaterial(`${selectedMaterial.name} (Node)`, sceneManager.scene);
        // Convert current material properties to node material
        const colorInput = new BABYLON.InputBlock("color");
        if (selectedMaterial.type === 'standard') {
            const stdMat = selectedMaterial.properties;
            colorInput.value = stdMat.diffuseColor;
        }
        else if (selectedMaterial.type === 'pbr') {
            const pbrMat = selectedMaterial.properties;
            colorInput.value = pbrMat.albedoColor;
        }
        const fragmentOutput = new BABYLON.FragmentOutputBlock("FragmentOutput");
        colorInput.connectTo(fragmentOutput);
        nodeMat.addOutputNode(fragmentOutput);
        nodeMat.build();
        const newMaterialState = {
            id: nodeMat.id,
            name: nodeMat.name,
            type: 'node',
            properties: nodeMat,
            isActive: true,
            lastModified: Date.now()
        };
        setMaterials(prev => [...prev, newMaterialState]);
        setSelectedMaterial(newMaterialState);
        setNodeMaterial(nodeMat);
        setEditorMode('node');
    };
    return (_jsxs("div", { className: "absolute top-0 left-0 w-80 h-full bg-gray-900 text-white p-4 z-50 overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-lg font-bold", children: "Material Editor" }), _jsx("button", { onClick: onClose, className: "px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm", children: "\u2715" })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Materials" }), _jsxs("div", { className: "flex gap-1", children: [_jsx("button", { onClick: createNewMaterial, className: "px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs", children: "+ Standard" }), _jsx("button", { onClick: createNodeMaterial, className: "px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs", children: "+ Node" })] })] }), _jsx("div", { className: "max-h-32 overflow-y-auto", children: materials.map(material => (_jsxs("div", { onClick: () => handleMaterialSelect(material), className: `p-2 mb-1 rounded cursor-pointer text-sm ${selectedMaterial?.id === material.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`, children: [material.name, " (", material.type, ")"] }, material.id))) })] }), selectedMaterial && selectedMaterial.type === 'node' && (_jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setEditorMode('properties'), className: `px-3 py-1 rounded text-xs ${editorMode === 'properties' ? 'bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'}`, children: "Properties" }), _jsx("button", { onClick: () => setEditorMode('node'), className: `px-3 py-1 rounded text-xs ${editorMode === 'node' ? 'bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'}`, children: "Node Editor" })] }) })), selectedMaterial && selectedMaterial.type !== 'node' && (_jsx("div", { className: "mb-4", children: _jsx("button", { onClick: convertToNodeMaterial, className: "w-full py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm font-semibold", children: "Convert to Node Material" }) })), selectedMaterial && editorMode === 'properties' && (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Properties" }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs mb-1", children: "Diffuse Color" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: materialProperties.diffuseColor.r, onChange: (e) => handlePropertyChange('diffuseColor', {
                                            ...materialProperties.diffuseColor,
                                            r: parseFloat(e.target.value)
                                        }), className: "flex-1", "aria-label": "Diffuse Color Red", title: "Diffuse Color Red", placeholder: "Diffuse Color Red" }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: materialProperties.diffuseColor.g, onChange: (e) => handlePropertyChange('diffuseColor', {
                                            ...materialProperties.diffuseColor,
                                            g: parseFloat(e.target.value)
                                        }), className: "flex-1", "aria-label": "Diffuse Color Green", title: "Diffuse Color Green", placeholder: "Diffuse Color Green" }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: materialProperties.diffuseColor.b, onChange: (e) => handlePropertyChange('diffuseColor', {
                                            ...materialProperties.diffuseColor,
                                            b: parseFloat(e.target.value)
                                        }), className: "flex-1", "aria-label": "Diffuse Color Blue", title: "Diffuse Color Blue", placeholder: "Diffuse Color Blue" })] }), _jsxs("div", { className: "flex gap-1 mt-1", children: [_jsxs("span", { className: "text-xs", children: ["R:", materialProperties.diffuseColor.r.toFixed(2)] }), _jsxs("span", { className: "text-xs", children: ["G:", materialProperties.diffuseColor.g.toFixed(2)] }), _jsxs("span", { className: "text-xs", children: ["B:", materialProperties.diffuseColor.b.toFixed(2)] })] })] }), selectedMaterial.type === 'pbr' && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-xs mb-1", children: ["Metallic: ", materialProperties.metallic.toFixed(2)] }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: materialProperties.metallic, onChange: (e) => handlePropertyChange('metallic', parseFloat(e.target.value)), className: "w-full", "aria-label": "Metallic", title: "Metallic", placeholder: "Metallic" })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs mb-1", children: ["Roughness: ", materialProperties.roughness.toFixed(2)] }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: materialProperties.roughness, onChange: (e) => handlePropertyChange('roughness', parseFloat(e.target.value)), className: "w-full", "aria-label": "Roughness", title: "Roughness", placeholder: "Roughness" })] })] })), selectedMaterial.type === 'standard' && (_jsxs("div", { children: [_jsxs("label", { className: "block text-xs mb-1", children: ["Specular Power: ", materialProperties.specularPower] }), _jsx("input", { type: "range", min: "1", max: "128", step: "1", value: materialProperties.specularPower, onChange: (e) => handlePropertyChange('specularPower', parseInt(e.target.value)), className: "w-full", "aria-label": "Specular Power", title: "Specular Power", placeholder: "Specular Power" })] })), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs mb-1", children: ["Alpha: ", materialProperties.alpha.toFixed(2)] }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: materialProperties.alpha, onChange: (e) => handlePropertyChange('alpha', parseFloat(e.target.value)), className: "w-full", "aria-label": "Alpha", title: "Alpha", placeholder: "Alpha" })] }), _jsx("button", { onClick: applyMaterialChanges, className: "w-full py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-semibold", children: "Apply Changes" })] })), selectedMaterial && editorMode === 'node' && selectedMaterial.type === 'node' && (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Node Editor" }), _jsx("div", { className: "bg-gray-800 rounded p-4 min-h-64 border-2 border-dashed border-gray-600", children: _jsxs("div", { className: "text-center text-gray-400", children: [_jsx("div", { className: "text-lg mb-2", children: "\uD83C\uDFA8 Node Editor" }), _jsx("div", { className: "text-sm mb-4", children: "Visual shader programming interface" }), _jsxs("div", { className: "flex flex-wrap justify-center gap-2 mb-4", children: [_jsx("div", { className: "bg-blue-600 px-3 py-1 rounded text-xs cursor-pointer hover:bg-blue-700", children: "Color Input" }), _jsx("div", { className: "bg-green-600 px-3 py-1 rounded text-xs cursor-pointer hover:bg-green-700", children: "Texture Sample" }), _jsx("div", { className: "bg-purple-600 px-3 py-1 rounded text-xs cursor-pointer hover:bg-purple-700", children: "Math Operation" }), _jsx("div", { className: "bg-orange-600 px-3 py-1 rounded text-xs cursor-pointer hover:bg-orange-700", children: "Mix" })] }), _jsxs("div", { className: "text-left bg-gray-700 p-3 rounded", children: [_jsx("div", { className: "text-sm font-semibold mb-2", children: "Current Node Material:" }), _jsxs("div", { className: "text-xs text-gray-300", children: [_jsxs("div", { children: ["Name: ", selectedMaterial.name] }), _jsxs("div", { children: ["ID: ", selectedMaterial.id] }), _jsx("div", { children: "Type: Node Material" })] })] })] }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => {
                                    if (nodeMaterial) {
                                        nodeMaterial.build();
                                        console.log('Node Material rebuilt');
                                    }
                                }, className: "flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold", children: "Build Material" }), _jsx("button", { onClick: () => {
                                    if (nodeMaterial) {
                                        console.log('Node Material:', nodeMaterial);
                                        console.log('Node Material name:', nodeMaterial.name);
                                        console.log('Node Material id:', nodeMaterial.id);
                                    }
                                }, className: "flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm font-semibold", children: "Debug Info" })] })] }))] }));
};
export default MaterialEditor;
