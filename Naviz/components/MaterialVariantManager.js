import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, Copy, Trash2, Save, RotateCcw } from 'lucide-react';
export const MaterialVariantManager = ({ scene, selectedMaterial, onVariantApply }) => {
    const [variants, setVariants] = useState([]);
    const [selectedVariantId, setSelectedVariantId] = useState('');
    const [newVariantName, setNewVariantName] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    // Load variants from localStorage on mount
    useEffect(() => {
        const savedVariants = localStorage.getItem('materialVariants');
        if (savedVariants) {
            try {
                const parsedVariants = JSON.parse(savedVariants).map((v) => ({
                    ...v,
                    createdAt: new Date(v.createdAt),
                    lastModified: new Date(v.lastModified)
                }));
                setVariants(parsedVariants);
            }
            catch (error) {
                console.error('Error loading material variants:', error);
            }
        }
    }, []);
    // Save variants to localStorage whenever variants change
    useEffect(() => {
        localStorage.setItem('materialVariants', JSON.stringify(variants));
    }, [variants]);
    // Drag and Drop state
    const [draggedVariantId, setDraggedVariantId] = useState(null);
    const createVariant = () => {
        if (!selectedMaterial || !newVariantName.trim())
            return;
        const variant = {
            id: `variant_${Date.now()}`,
            name: newVariantName.trim(),
            baseMaterial: selectedMaterial,
            properties: extractMaterialProperties(selectedMaterial),
            createdAt: new Date(),
            lastModified: new Date()
        };
        setVariants(prev => [...prev, variant]);
        setNewVariantName('');
        setIsCreateDialogOpen(false);
    };
    const duplicateVariant = (variantId) => {
        const originalVariant = variants.find(v => v.id === variantId);
        if (!originalVariant)
            return;
        const duplicatedVariant = {
            ...originalVariant,
            id: `variant_${Date.now()}`,
            name: `${originalVariant.name} Copy`,
            createdAt: new Date(),
            lastModified: new Date()
        };
        setVariants(prev => [...prev, duplicatedVariant]);
    };
    const deleteVariant = (variantId) => {
        setVariants(prev => prev.filter(v => v.id !== variantId));
        if (selectedVariantId === variantId) {
            setSelectedVariantId('');
        }
    };
    const applyVariant = (variant) => {
        if (!selectedMaterial)
            return;
        applyMaterialProperties(selectedMaterial, variant.properties);
        onVariantApply(variant);
    };
    const updateVariant = (variantId) => {
        if (!selectedMaterial)
            return;
        setVariants(prev => prev.map(v => v.id === variantId
            ? {
                ...v,
                properties: extractMaterialProperties(selectedMaterial),
                lastModified: new Date()
            }
            : v));
    };
    const extractMaterialProperties = (material) => {
        const properties = {};
        if (material instanceof BABYLON.StandardMaterial) {
            properties.type = 'standard';
            properties.diffuseColor = material.diffuseColor.asArray();
            properties.specularColor = material.specularColor.asArray();
            properties.emissiveColor = material.emissiveColor.asArray();
            properties.ambientColor = material.ambientColor.asArray();
            properties.alpha = material.alpha;
            properties.specularPower = material.specularPower;
        }
        else if (material instanceof BABYLON.PBRMaterial) {
            properties.type = 'pbr';
            properties.albedoColor = material.albedoColor?.asArray();
            properties.metallic = material.metallic;
            properties.roughness = material.roughness;
            properties.emissiveColor = material.emissiveColor?.asArray();
            properties.alpha = material.alpha;
            properties.emissiveIntensity = material.emissiveIntensity;
        }
        return properties;
    };
    const applyMaterialProperties = (material, properties) => {
        if (material instanceof BABYLON.StandardMaterial && properties.type === 'standard') {
            if (properties.diffuseColor) {
                material.diffuseColor = BABYLON.Color3.FromArray(properties.diffuseColor);
            }
            if (properties.specularColor) {
                material.specularColor = BABYLON.Color3.FromArray(properties.specularColor);
            }
            if (properties.emissiveColor) {
                material.emissiveColor = BABYLON.Color3.FromArray(properties.emissiveColor);
            }
            if (properties.ambientColor) {
                material.ambientColor = BABYLON.Color3.FromArray(properties.ambientColor);
            }
            if (properties.alpha !== undefined) {
                material.alpha = properties.alpha;
            }
            if (properties.specularPower !== undefined) {
                material.specularPower = properties.specularPower;
            }
        }
        else if (material instanceof BABYLON.PBRMaterial && properties.type === 'pbr') {
            if (properties.albedoColor) {
                material.albedoColor = BABYLON.Color3.FromArray(properties.albedoColor);
            }
            if (properties.metallic !== undefined) {
                material.metallic = properties.metallic;
            }
            if (properties.roughness !== undefined) {
                material.roughness = properties.roughness;
            }
            if (properties.emissiveColor) {
                material.emissiveColor = BABYLON.Color3.FromArray(properties.emissiveColor);
            }
            if (properties.alpha !== undefined) {
                material.alpha = properties.alpha;
            }
            if (properties.emissiveIntensity !== undefined) {
                material.emissiveIntensity = properties.emissiveIntensity;
            }
        }
    };
    // Drag and Drop Handlers
    const onDragStart = (event, variantId) => {
        setDraggedVariantId(variantId);
        event.dataTransfer.effectAllowed = 'move';
        // Dispatch custom event for scene drag-drop handler
        const variant = variants.find(v => v.id === variantId);
        if (variant) {
            const customEvent = new CustomEvent('materialDragStart', {
                detail: { material: variant.baseMaterial, variantId }
            });
            window.dispatchEvent(customEvent);
        }
    };
    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };
    const onDrop = (event, targetVariantId) => {
        event.preventDefault();
        if (!draggedVariantId || draggedVariantId === targetVariantId)
            return;
        const draggedVariant = variants.find(v => v.id === draggedVariantId);
        const targetVariant = variants.find(v => v.id === targetVariantId);
        if (!draggedVariant || !targetVariant)
            return;
        // Swap properties of the two variants
        setVariants(prevVariants => prevVariants.map(v => {
            if (v.id === draggedVariantId) {
                return { ...v, properties: targetVariant.properties, lastModified: new Date() };
            }
            else if (v.id === targetVariantId) {
                return { ...v, properties: draggedVariant.properties, lastModified: new Date() };
            }
            return v;
        }));
        // If the dragged or target variant is selected, apply the updated variant
        if (selectedVariantId === draggedVariantId) {
            applyVariant({ ...draggedVariant, properties: targetVariant.properties });
        }
        else if (selectedVariantId === targetVariantId) {
            applyVariant({ ...targetVariant, properties: draggedVariant.properties });
        }
        setDraggedVariantId(null);
    };
    if (!scene || !selectedMaterial) {
        return (_jsx(Card, { className: "w-full", children: _jsx(CardContent, { className: "p-6", children: _jsx("p", { className: "text-gray-500 text-center", children: "Select a material to manage variants" }) }) }));
    }
    return (_jsxs(Card, { className: "w-full", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center justify-between", children: ["Material Variants", _jsxs(Badge, { variant: "secondary", children: [variants.length, " variants"] })] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "mb-4", children: _jsxs(Dialog, { open: isCreateDialogOpen, onOpenChange: setIsCreateDialogOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "w-full", variant: "outline", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Create Variant"] }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Create Material Variant" }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Variant Name" }), _jsx(Input, { value: newVariantName, onChange: (e) => setNewVariantName(e.target.value), placeholder: "Enter variant name...", onKeyDown: (e) => e.key === 'Enter' && createVariant() })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { variant: "outline", onClick: () => setIsCreateDialogOpen(false), children: "Cancel" }), _jsx(Button, { onClick: createVariant, disabled: !newVariantName.trim(), children: "Create" })] })] })] })] }) }), _jsxs("div", { className: "space-y-2 max-h-96 overflow-y-auto", children: [variants.map(variant => (_jsxs("div", { draggable: true, onDragStart: (e) => onDragStart(e, variant.id), onDragOver: onDragOver, onDrop: (e) => onDrop(e, variant.id), className: `flex items-center justify-between p-3 border rounded-lg cursor-move transition-colors ${draggedVariantId === variant.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`, children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-medium", children: variant.name }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Modified: ", variant.lastModified.toLocaleDateString()] })] }), _jsxs("div", { className: "flex space-x-1", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => applyVariant(variant), title: "Apply variant", children: _jsx(RotateCcw, { className: "w-3 h-3" }) }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => updateVariant(variant.id), title: "Update variant", children: _jsx(Save, { className: "w-3 h-3" }) }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => duplicateVariant(variant.id), title: "Duplicate variant", children: _jsx(Copy, { className: "w-3 h-3" }) }), _jsx(Button, { size: "sm", variant: "destructive", onClick: () => deleteVariant(variant.id), title: "Delete variant", children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }, variant.id))), variants.length === 0 && (_jsx("div", { className: "text-center text-gray-500 py-8", children: "No variants created yet. Create your first variant to get started." }))] })] })] }));
};
