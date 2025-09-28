import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import '@babylonjs/materials';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
export const MaterialPresetSelector = ({ material, onPresetApply }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreatePreset, setShowCreatePreset] = useState(false);
    const [newPresetName, setNewPresetName] = useState('');
    const [customPresets, setCustomPresets] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const materialPresets = [
        // Metals
        {
            id: 'gold',
            name: 'Gold',
            category: 'metal',
            properties: {
                diffuseColor: new BABYLON.Color3(1, 0.8, 0),
                specularColor: new BABYLON.Color3(1, 1, 0.8),
                emissiveColor: new BABYLON.Color3(0.1, 0.05, 0),
                alpha: 1.0,
                specularPower: 64,
                metallic: 1.0,
                roughness: 0.1
            },
            preview: '#FFD700'
        },
        {
            id: 'silver',
            name: 'Silver',
            category: 'metal',
            properties: {
                diffuseColor: new BABYLON.Color3(0.8, 0.8, 0.9),
                specularColor: new BABYLON.Color3(1, 1, 1),
                emissiveColor: new BABYLON.Color3(0.05, 0.05, 0.05),
                alpha: 1.0,
                specularPower: 128,
                metallic: 1.0,
                roughness: 0.05
            },
            preview: '#C0C0C0'
        },
        {
            id: 'copper',
            name: 'Copper',
            category: 'metal',
            properties: {
                diffuseColor: new BABYLON.Color3(0.8, 0.5, 0.2),
                specularColor: new BABYLON.Color3(1, 0.7, 0.4),
                emissiveColor: new BABYLON.Color3(0.1, 0.02, 0),
                alpha: 1.0,
                specularPower: 32,
                metallic: 1.0,
                roughness: 0.2
            },
            preview: '#B87333'
        },
        // Plastics
        {
            id: 'red_plastic',
            name: 'Red Plastic',
            category: 'plastic',
            properties: {
                diffuseColor: new BABYLON.Color3(0.8, 0.1, 0.1),
                specularColor: new BABYLON.Color3(0.3, 0.3, 0.3),
                emissiveColor: new BABYLON.Color3(0, 0, 0),
                alpha: 1.0,
                specularPower: 32,
                metallic: 0.0,
                roughness: 0.3
            },
            preview: '#CC0000'
        },
        {
            id: 'blue_plastic',
            name: 'Blue Plastic',
            category: 'plastic',
            properties: {
                diffuseColor: new BABYLON.Color3(0.1, 0.3, 0.8),
                specularColor: new BABYLON.Color3(0.4, 0.4, 0.4),
                emissiveColor: new BABYLON.Color3(0, 0, 0),
                alpha: 1.0,
                specularPower: 32,
                metallic: 0.0,
                roughness: 0.3
            },
            preview: '#0066CC'
        },
        // Woods
        {
            id: 'oak',
            name: 'Oak Wood',
            category: 'wood',
            properties: {
                diffuseColor: new BABYLON.Color3(0.6, 0.4, 0.2),
                specularColor: new BABYLON.Color3(0.2, 0.2, 0.2),
                emissiveColor: new BABYLON.Color3(0, 0, 0),
                alpha: 1.0,
                specularPower: 16,
                metallic: 0.0,
                roughness: 0.8
            },
            preview: '#8B4513'
        },
        {
            id: 'pine',
            name: 'Pine Wood',
            category: 'wood',
            properties: {
                diffuseColor: new BABYLON.Color3(0.7, 0.6, 0.4),
                specularColor: new BABYLON.Color3(0.3, 0.3, 0.3),
                emissiveColor: new BABYLON.Color3(0, 0, 0),
                alpha: 1.0,
                specularPower: 16,
                metallic: 0.0,
                roughness: 0.7
            },
            preview: '#DEB887'
        },
        // Fabrics
        {
            id: 'cotton_white',
            name: 'White Cotton',
            category: 'fabric',
            properties: {
                diffuseColor: new BABYLON.Color3(0.95, 0.95, 0.95),
                specularColor: new BABYLON.Color3(0.1, 0.1, 0.1),
                emissiveColor: new BABYLON.Color3(0, 0, 0),
                alpha: 1.0,
                specularPower: 8,
                metallic: 0.0,
                roughness: 0.9
            },
            preview: '#F5F5F5'
        },
        {
            id: 'wool_gray',
            name: 'Gray Wool',
            category: 'fabric',
            properties: {
                diffuseColor: new BABYLON.Color3(0.5, 0.5, 0.5),
                specularColor: new BABYLON.Color3(0.2, 0.2, 0.2),
                emissiveColor: new BABYLON.Color3(0, 0, 0),
                alpha: 1.0,
                specularPower: 8,
                metallic: 0.0,
                roughness: 0.95
            },
            preview: '#808080'
        },
        // Glass
        {
            id: 'clear_glass',
            name: 'Clear Glass',
            category: 'glass',
            properties: {
                diffuseColor: new BABYLON.Color3(0.9, 0.9, 1.0),
                specularColor: new BABYLON.Color3(1, 1, 1),
                emissiveColor: new BABYLON.Color3(0, 0, 0),
                alpha: 0.2,
                specularPower: 256,
                metallic: 0.0,
                roughness: 0.0
            },
            preview: '#E0F7FF'
        },
        {
            id: 'tinted_glass',
            name: 'Tinted Glass',
            category: 'glass',
            properties: {
                diffuseColor: new BABYLON.Color3(0.3, 0.5, 0.7),
                specularColor: new BABYLON.Color3(0.8, 0.9, 1.0),
                emissiveColor: new BABYLON.Color3(0, 0, 0),
                alpha: 0.4,
                specularPower: 256,
                metallic: 0.0,
                roughness: 0.0
            },
            preview: '#4A90E2'
        }
    ];
    const categories = ['all', ...Array.from(new Set(materialPresets.map(p => p.category)))];
    const filteredPresets = materialPresets.filter(preset => {
        const matchesCategory = selectedCategory === 'all' || preset.category === selectedCategory;
        const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    const applyPreset = (preset) => {
        if (!material)
            return;
        onPresetApply(preset);
    };
    if (!material) {
        return (_jsxs(Card, { className: "w-full max-w-2xl", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Material Preset Selector" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-500", children: "Select a material to apply presets" }) })] }));
    }
    return (_jsxs(Card, { className: "w-full max-w-2xl", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Material Preset Selector" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("div", { className: "flex space-x-2", children: _jsx("input", { type: "text", placeholder: "Search presets...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "flex-1 px-3 py-2 border rounded-md text-sm" }) }), _jsx("div", { className: "flex flex-wrap gap-2", children: categories.map(category => (_jsx(Button, { onClick: () => setSelectedCategory(category), variant: selectedCategory === category ? "default" : "outline", size: "sm", className: "capitalize", children: category }, category))) }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto", children: filteredPresets.map(preset => (_jsxs("div", { className: "border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer", onClick: () => applyPreset(preset), children: [_jsx("div", { className: "w-full h-16 rounded mb-2 border", style: { backgroundColor: preset.preview } }), _jsx("h4", { className: "text-sm font-semibold mb-1", children: preset.name }), _jsx(Badge, { variant: "secondary", className: "text-xs capitalize", children: preset.category })] }, preset.id))) }), filteredPresets.length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No presets found matching your criteria" }))] })] }));
};
