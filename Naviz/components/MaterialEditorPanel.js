import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { MaterialPropertyEditor } from './MaterialPropertyEditor';
import { MaterialPresetSelector } from './MaterialPresetSelector';
export const MaterialEditorPanel = ({ scene, selectedMesh, onMaterialChange }) => {
    const [materials, setMaterials] = useState([]);
    const [selectedMaterialId, setSelectedMaterialId] = useState('');
    const [currentMaterial, setCurrentMaterial] = useState(null);
    // Update materials list when scene changes
    useEffect(() => {
        if (!scene)
            return;
        const updateMaterials = () => {
            const materialMap = new Map();
            // Collect all materials from meshes
            scene.meshes.forEach(mesh => {
                if (mesh.material) {
                    const materialId = mesh.material.id;
                    if (!materialMap.has(materialId)) {
                        materialMap.set(materialId, {
                            id: materialId,
                            name: mesh.material.name || `Material ${materialId}`,
                            material: mesh.material,
                            meshNames: []
                        });
                    }
                    materialMap.get(materialId).meshNames.push(mesh.name);
                }
            });
            const materialList = Array.from(materialMap.values());
            setMaterials(materialList);
            // Auto-select material from selected mesh
            if (selectedMesh?.material) {
                const meshMaterialId = selectedMesh.material.id;
                setSelectedMaterialId(meshMaterialId);
                setCurrentMaterial(selectedMesh.material);
            }
            else if (materialList.length > 0 && !selectedMaterialId) {
                // Select first material if none selected
                setSelectedMaterialId(materialList[0].id);
                setCurrentMaterial(materialList[0].material);
            }
        };
        updateMaterials();
        // Listen for material changes
        const materialObserver = scene.onNewMaterialAddedObservable.add(() => updateMaterials());
        const meshObserver = scene.onNewMeshAddedObservable.add(() => updateMaterials());
        return () => {
            scene.onNewMaterialAddedObservable.remove(materialObserver);
            scene.onNewMeshAddedObservable.remove(meshObserver);
        };
    }, [scene, selectedMesh]);
    // Update current material when selection changes
    useEffect(() => {
        if (selectedMaterialId) {
            const materialInfo = materials.find(m => m.id === selectedMaterialId);
            setCurrentMaterial(materialInfo?.material || null);
        }
    }, [selectedMaterialId, materials]);
    const handleMaterialSelect = (materialId) => {
        setSelectedMaterialId(materialId);
    };
    const handlePropertyChange = (property, value) => {
        if (!currentMaterial)
            return;
        try {
            if (currentMaterial instanceof BABYLON.StandardMaterial) {
                switch (property) {
                    case 'diffuseR':
                        currentMaterial.diffuseColor.r = value;
                        break;
                    case 'diffuseG':
                        currentMaterial.diffuseColor.g = value;
                        break;
                    case 'diffuseB':
                        currentMaterial.diffuseColor.b = value;
                        break;
                    case 'specularR':
                        currentMaterial.specularColor.r = value;
                        break;
                    case 'specularG':
                        currentMaterial.specularColor.g = value;
                        break;
                    case 'specularB':
                        currentMaterial.specularColor.b = value;
                        break;
                    case 'emissiveR':
                        currentMaterial.emissiveColor.r = value;
                        break;
                    case 'emissiveG':
                        currentMaterial.emissiveColor.g = value;
                        break;
                    case 'emissiveB':
                        currentMaterial.emissiveColor.b = value;
                        break;
                    case 'alpha':
                        currentMaterial.alpha = value;
                        break;
                    case 'specularPower':
                        currentMaterial.specularPower = value;
                        break;
                }
            }
            else if (currentMaterial instanceof BABYLON.PBRMaterial) {
                switch (property) {
                    case 'metallic':
                        currentMaterial.metallic = value;
                        break;
                    case 'roughness':
                        currentMaterial.roughness = value;
                        break;
                    case 'alpha':
                        currentMaterial.alpha = value;
                        break;
                    case 'emissiveIntensity':
                        currentMaterial.emissiveIntensity = value;
                        break;
                }
            }
            onMaterialChange(currentMaterial);
        }
        catch (error) {
            console.error('Error updating material property:', error);
        }
    };
    const handlePresetApply = (preset) => {
        if (!currentMaterial)
            return;
        try {
            if (currentMaterial instanceof BABYLON.StandardMaterial) {
                if (preset.properties.diffuseColor) {
                    currentMaterial.diffuseColor = preset.properties.diffuseColor;
                }
                if (preset.properties.specularColor) {
                    currentMaterial.specularColor = preset.properties.specularColor;
                }
                if (preset.properties.emissiveColor) {
                    currentMaterial.emissiveColor = preset.properties.emissiveColor;
                }
                if (preset.properties.alpha !== undefined) {
                    currentMaterial.alpha = preset.properties.alpha;
                }
                if (preset.properties.specularPower !== undefined) {
                    currentMaterial.specularPower = preset.properties.specularPower;
                }
            }
            else if (currentMaterial instanceof BABYLON.PBRMaterial) {
                if (preset.properties.metallic !== undefined) {
                    currentMaterial.metallic = preset.properties.metallic;
                }
                if (preset.properties.roughness !== undefined) {
                    currentMaterial.roughness = preset.properties.roughness;
                }
                if (preset.properties.alpha !== undefined) {
                    currentMaterial.alpha = preset.properties.alpha;
                }
            }
            onMaterialChange(currentMaterial);
        }
        catch (error) {
            console.error('Error applying material preset:', error);
        }
    };
    if (!scene) {
        return (_jsx(Card, { className: "w-full", children: _jsx(CardContent, { className: "p-6", children: _jsx("p", { className: "text-gray-500 text-center", children: "No 3D scene available" }) }) }));
    }
    return (_jsxs(Card, { className: "w-full", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center justify-between", children: ["Material Editor", _jsxs(Badge, { variant: "secondary", children: [materials.length, " materials"] })] }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Select Material" }), _jsxs(Select, { value: selectedMaterialId, onValueChange: handleMaterialSelect, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Choose a material..." }) }), _jsx(SelectContent, { children: materials.map(material => (_jsx(SelectItem, { value: material.id, children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-medium", children: material.name }), _jsxs("span", { className: "text-xs text-gray-500", children: ["Used by: ", material.meshNames.join(', ')] })] }) }, material.id))) })] })] }), _jsxs(Tabs, { defaultValue: "properties", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsx(TabsTrigger, { value: "properties", children: "Properties" }), _jsx(TabsTrigger, { value: "presets", children: "Presets" })] }), _jsx(TabsContent, { value: "properties", className: "mt-4", children: _jsx(MaterialPropertyEditor, { material: currentMaterial, onPropertyChange: handlePropertyChange }) }), _jsx(TabsContent, { value: "presets", className: "mt-4", children: _jsx(MaterialPresetSelector, { material: currentMaterial, onPresetApply: handlePresetApply }) })] })] })] }));
};
