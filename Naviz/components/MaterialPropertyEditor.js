import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import '@babylonjs/materials';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Input } from './ui/input';
export const MaterialPropertyEditor = ({ material, onPropertyChange }) => {
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState('');
    useEffect(() => {
        if (material) {
            updateProperties(material);
        }
    }, [material]);
    const updateProperties = (mat) => {
        const props = [];
        if (mat instanceof BABYLON.StandardMaterial) {
            props.push({ name: 'diffuseR', value: mat.diffuseColor.r || 0, min: 0, max: 1, step: 0.01 }, { name: 'diffuseG', value: mat.diffuseColor.g || 0, min: 0, max: 1, step: 0.01 }, { name: 'diffuseB', value: mat.diffuseColor.b || 0, min: 0, max: 1, step: 0.01 }, { name: 'specularR', value: mat.specularColor.r || 0, min: 0, max: 1, step: 0.01 }, { name: 'specularG', value: mat.specularColor.g || 0, min: 0, max: 1, step: 0.01 }, { name: 'specularB', value: mat.specularColor.b || 0, min: 0, max: 1, step: 0.01 }, { name: 'emissiveR', value: mat.emissiveColor.r || 0, min: 0, max: 1, step: 0.01 }, { name: 'emissiveG', value: mat.emissiveColor.g || 0, min: 0, max: 1, step: 0.01 }, { name: 'emissiveB', value: mat.emissiveColor.b || 0, min: 0, max: 1, step: 0.01 }, { name: 'alpha', value: mat.alpha || 1, min: 0, max: 1, step: 0.01 }, { name: 'specularPower', value: mat.specularPower || 64, min: 0, max: 128, step: 1 });
        }
        else if (mat instanceof BABYLON.PBRMaterial) {
            props.push({ name: 'metallic', value: mat.metallic || 0, min: 0, max: 1, step: 0.01 }, { name: 'roughness', value: mat.roughness || 0.5, min: 0, max: 1, step: 0.01 }, { name: 'alpha', value: mat.alpha || 1, min: 0, max: 1, step: 0.01 }, { name: 'emissiveIntensity', value: mat.emissiveIntensity || 1, min: 0, max: 10, step: 0.1 });
        }
        setProperties(props);
    };
    const handlePropertyChange = (propertyName, value) => {
        setProperties(prev => prev.map(prop => prop.name === propertyName ? { ...prop, value } : prop));
        onPropertyChange(propertyName, value);
    };
    const applyPreset = (preset) => {
        if (!material)
            return;
        const presets = {
            metal: { metallic: 1.0, roughness: 0.2, alpha: 1.0 },
            plastic: { metallic: 0.0, roughness: 0.5, alpha: 1.0 },
            glass: { metallic: 0.0, roughness: 0.0, alpha: 0.3 },
            wood: { metallic: 0.0, roughness: 0.8, alpha: 1.0 },
            fabric: { metallic: 0.0, roughness: 0.9, alpha: 1.0 }
        };
        const presetValues = presets[preset];
        if (presetValues) {
            Object.entries(presetValues).forEach(([key, value]) => {
                handlePropertyChange(key, value);
            });
        }
    };
    if (!material) {
        return (_jsxs(Card, { className: "w-full max-w-md", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Material Property Editor" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-500", children: "Select a material to edit properties" }) })] }));
    }
    return (_jsxs(Card, { className: "w-full max-w-md", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Material Property Editor" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-semibold", children: "Material Type" }), _jsx("p", { className: "text-sm text-gray-600", children: material.constructor.name })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-semibold mb-2 block", children: "Quick Presets" }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: ['metal', 'plastic', 'glass', 'wood', 'fabric'].map(preset => (_jsx(Button, { onClick: () => applyPreset(preset), variant: "outline", size: "sm", className: "capitalize", children: preset }, preset))) })] }), _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: properties.map(prop => (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Label, { className: "text-sm capitalize", children: prop.name.replace(/([A-Z])/g, ' $1').trim() }), _jsx(Input, { type: "number", value: prop.value.toFixed(2), onChange: (e) => handlePropertyChange(prop.name, parseFloat(e.target.value) || 0), className: "w-20 h-6 text-xs", min: prop.min, max: prop.max, step: prop.step })] }), _jsx(Slider, { value: [prop.value], onValueChange: (value) => handlePropertyChange(prop.name, value[0]), min: prop.min, max: prop.max, step: prop.step, className: "w-full" })] }, prop.name))) }), _jsx(Button, { onClick: () => material && updateProperties(material), variant: "outline", className: "w-full", children: "Reset to Default" })] })] }));
};
