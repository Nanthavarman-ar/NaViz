import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useEffect } from 'react';
import { useWorkspace } from '../core/WorkspaceContext';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { ScrollArea } from '../../ui/scroll-area';
import { Color3 } from '@babylonjs/core';
import { Layers, Settings, Trash2, Copy, Save, RotateCcw, Play, Droplets, Flame, Mountain, Waves, Snowflake, Gem, Diamond, Circle, Square as SquareIcon } from 'lucide-react';
import './MaterialControls.css';
const MATERIAL_PRESETS = {
    standard: {
        name: 'Standard',
        icon: Layers,
        description: 'Basic material with diffuse and specular',
        defaultProperties: {
            baseColor: new Color3(0.8, 0.8, 0.8),
            metallic: 0,
            roughness: 0.5,
            emissiveColor: new Color3(0, 0, 0),
            emissiveIntensity: 0,
            opacity: 1,
            transparent: false,
            alphaTest: 0,
            backFaceCulling: true,
            wireframe: false,
            specularColor: new Color3(1, 1, 1),
            specularPower: 64,
            indexOfRefraction: 1.5
        }
    },
    pbr: {
        name: 'PBR Metallic',
        icon: Gem,
        description: 'Physically based rendering material',
        defaultProperties: {
            baseColor: new Color3(0.8, 0.8, 0.8),
            metallic: 0.8,
            roughness: 0.2,
            emissiveColor: new Color3(0, 0, 0),
            emissiveIntensity: 0,
            opacity: 1,
            transparent: false,
            alphaTest: 0,
            backFaceCulling: true,
            wireframe: false,
            specularColor: new Color3(1, 1, 1),
            specularPower: 64,
            indexOfRefraction: 1.5
        }
    },
    glass: {
        name: 'Glass',
        icon: Droplets,
        description: 'Transparent glass-like material',
        defaultProperties: {
            baseColor: new Color3(0.9, 0.95, 1),
            metallic: 0,
            roughness: 0,
            emissiveColor: new Color3(0, 0, 0),
            emissiveIntensity: 0,
            opacity: 0.1,
            transparent: true,
            alphaTest: 0,
            backFaceCulling: false,
            wireframe: false,
            specularColor: new Color3(1, 1, 1),
            specularPower: 128,
            indexOfRefraction: 1.5
        }
    },
    metal: {
        name: 'Metal',
        icon: Diamond,
        description: 'Reflective metallic material',
        defaultProperties: {
            baseColor: new Color3(0.8, 0.8, 0.9),
            metallic: 1,
            roughness: 0.1,
            emissiveColor: new Color3(0, 0, 0),
            emissiveIntensity: 0,
            opacity: 1,
            transparent: false,
            alphaTest: 0,
            backFaceCulling: true,
            wireframe: false,
            specularColor: new Color3(1, 1, 1),
            specularPower: 256,
            indexOfRefraction: 1.5
        }
    },
    plastic: {
        name: 'Plastic',
        icon: Circle,
        description: 'Smooth plastic material',
        defaultProperties: {
            baseColor: new Color3(0.9, 0.9, 0.9),
            metallic: 0,
            roughness: 0.3,
            emissiveColor: new Color3(0, 0, 0),
            emissiveIntensity: 0,
            opacity: 1,
            transparent: false,
            alphaTest: 0,
            backFaceCulling: true,
            wireframe: false,
            specularColor: new Color3(1, 1, 1),
            specularPower: 32,
            indexOfRefraction: 1.5
        }
    },
    wood: {
        name: 'Wood',
        icon: Mountain,
        description: 'Wooden material with grain texture',
        defaultProperties: {
            baseColor: new Color3(0.6, 0.4, 0.2),
            metallic: 0,
            roughness: 0.8,
            emissiveColor: new Color3(0, 0, 0),
            emissiveIntensity: 0,
            opacity: 1,
            transparent: false,
            alphaTest: 0,
            backFaceCulling: true,
            wireframe: false,
            specularColor: new Color3(0.3, 0.2, 0.1),
            specularPower: 16,
            indexOfRefraction: 1.5
        }
    },
    fabric: {
        name: 'Fabric',
        icon: Waves,
        description: 'Soft fabric material',
        defaultProperties: {
            baseColor: new Color3(0.7, 0.7, 0.8),
            metallic: 0,
            roughness: 0.9,
            emissiveColor: new Color3(0, 0, 0),
            emissiveIntensity: 0,
            opacity: 1,
            transparent: false,
            alphaTest: 0,
            backFaceCulling: true,
            wireframe: false,
            specularColor: new Color3(0.1, 0.1, 0.1),
            specularPower: 8,
            indexOfRefraction: 1.5
        }
    },
    stone: {
        name: 'Stone',
        icon: SquareIcon,
        description: 'Rough stone material',
        defaultProperties: {
            baseColor: new Color3(0.5, 0.5, 0.5),
            metallic: 0,
            roughness: 1,
            emissiveColor: new Color3(0, 0, 0),
            emissiveIntensity: 0,
            opacity: 1,
            transparent: false,
            alphaTest: 0,
            backFaceCulling: true,
            wireframe: false,
            specularColor: new Color3(0.2, 0.2, 0.2),
            specularPower: 4,
            indexOfRefraction: 1.5
        }
    },
    water: {
        name: 'Water',
        icon: Droplets,
        description: 'Transparent water material',
        defaultProperties: {
            baseColor: new Color3(0.2, 0.4, 0.8),
            metallic: 0,
            roughness: 0,
            emissiveColor: new Color3(0, 0, 0),
            emissiveIntensity: 0,
            opacity: 0.3,
            transparent: true,
            alphaTest: 0,
            backFaceCulling: false,
            wireframe: false,
            specularColor: new Color3(1, 1, 1),
            specularPower: 512,
            indexOfRefraction: 1.33
        }
    },
    fire: {
        name: 'Fire',
        icon: Flame,
        description: 'Emissive fire material',
        defaultProperties: {
            baseColor: new Color3(1, 0.5, 0),
            metallic: 0,
            roughness: 0,
            emissiveColor: new Color3(1, 0.3, 0),
            emissiveIntensity: 2,
            opacity: 0.8,
            transparent: true,
            alphaTest: 0,
            backFaceCulling: false,
            wireframe: false,
            specularColor: new Color3(1, 0.8, 0.6),
            specularPower: 32,
            indexOfRefraction: 1.5
        }
    },
    ice: {
        name: 'Ice',
        icon: Snowflake,
        description: 'Transparent ice material',
        defaultProperties: {
            baseColor: new Color3(0.8, 0.9, 1),
            metallic: 0,
            roughness: 0,
            emissiveColor: new Color3(0.1, 0.2, 0.3),
            emissiveIntensity: 0.5,
            opacity: 0.2,
            transparent: true,
            alphaTest: 0,
            backFaceCulling: false,
            wireframe: false,
            specularColor: new Color3(1, 1, 1),
            specularPower: 256,
            indexOfRefraction: 1.31
        }
    },
    custom: {
        name: 'Custom',
        icon: Settings,
        description: 'Fully customizable material',
        defaultProperties: {
            baseColor: new Color3(0.5, 0.5, 0.5),
            metallic: 0.5,
            roughness: 0.5,
            emissiveColor: new Color3(0, 0, 0),
            emissiveIntensity: 0,
            opacity: 1,
            transparent: false,
            alphaTest: 0,
            backFaceCulling: true,
            wireframe: false,
            specularColor: new Color3(0.5, 0.5, 0.5),
            specularPower: 64,
            indexOfRefraction: 1.5
        }
    }
};
export function MaterialControls({ onMaterialAdd, onMaterialRemove, onMaterialUpdate, onTextureAdd, onTextureRemove }) {
    const { state } = useWorkspace();
    const [activeTab, setActiveTab] = useState('materials');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [textures, setTextures] = useState([]);
    const [selectedTexture, setSelectedTexture] = useState(null);
    // Initialize with default materials
    useEffect(() => {
        const defaultMaterials = Object.entries(MATERIAL_PRESETS).map(([type, preset]) => ({
            id: `${type}-default`,
            name: preset.name,
            type: type,
            ...preset.defaultProperties
        }));
        setMaterials(defaultMaterials);
    }, []);
    // Handle material type selection
    const handleAddMaterial = useCallback((materialType) => {
        const preset = MATERIAL_PRESETS[materialType];
        const newMaterial = {
            id: `${materialType}-${Date.now()}`,
            name: `${preset.name} ${materials.length + 1}`,
            type: materialType,
            ...preset.defaultProperties
        };
        setMaterials(prev => [...prev, newMaterial]);
        onMaterialAdd?.(materialType);
    }, [materials.length, onMaterialAdd]);
    // Handle material removal
    const handleRemoveMaterial = useCallback((materialId) => {
        setMaterials(prev => prev.filter(m => m.id !== materialId));
        setSelectedMaterial(null);
        onMaterialRemove?.(materialId);
    }, [onMaterialRemove]);
    // Handle material property update
    const handleMaterialUpdate = useCallback((materialId, properties) => {
        setMaterials(prev => prev.map(material => material.id === materialId ? { ...material, ...properties } : material));
        onMaterialUpdate?.(materialId, properties);
    }, [onMaterialUpdate]);
    // Handle texture addition
    const handleAddTexture = useCallback((textureType) => {
        const newTexture = {
            id: `${textureType}-${Date.now()}`,
            name: `${textureType} texture`,
            url: '',
            type: textureType,
            uScale: 1,
            vScale: 1,
            uOffset: 0,
            vOffset: 0,
            rotation: 0,
            hasAlpha: false,
            invertY: false,
            coordinatesMode: 0,
            wrapU: 0,
            wrapV: 0
        };
        setTextures(prev => [...prev, newTexture]);
    }, []);
    // Handle texture removal
    const handleRemoveTexture = useCallback((textureId) => {
        setTextures(prev => prev.filter(t => t.id !== textureId));
        setSelectedTexture(null);
        onTextureRemove?.(textureId);
    }, [onTextureRemove]);
    // Handle texture property update
    const handleTextureUpdate = useCallback((textureId, properties) => {
        setTextures(prev => prev.map(texture => texture.id === textureId ? { ...texture, ...properties } : texture));
    }, []);
    // Duplicate material
    const duplicateMaterial = useCallback((materialId) => {
        const material = materials.find(m => m.id === materialId);
        if (material) {
            const newMaterial = {
                ...material,
                id: `${material.type}-${Date.now()}`,
                name: `${material.name} Copy`
            };
            setMaterials(prev => [...prev, newMaterial]);
        }
    }, [materials]);
    // Reset material to preset defaults
    const resetMaterial = useCallback((materialId) => {
        const material = materials.find(m => m.id === materialId);
        if (material) {
            const preset = MATERIAL_PRESETS[material.type];
            handleMaterialUpdate(materialId, preset.defaultProperties);
        }
    }, [materials, handleMaterialUpdate]);
    const selectedMaterialData = materials.find(m => m.id === selectedMaterial);
    const selectedTextureData = textures.find(t => t.id === selectedTexture);
    return (_jsxs("div", { className: "material-controls", children: [_jsxs("div", { className: "material-controls-header", children: [_jsx("h3", { className: "material-controls-title", children: "Material Controls" }), _jsx("div", { className: "material-controls-actions", children: _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Save, { className: "w-4 h-4" }) }) })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "material-controls-tabs", children: [_jsxs(TabsList, { className: "material-controls-tabs-list", children: [_jsx(TabsTrigger, { value: "materials", children: "Materials" }), _jsx(TabsTrigger, { value: "textures", children: "Textures" }), _jsx(TabsTrigger, { value: "shaders", children: "Shaders" })] }), _jsx(TabsContent, { value: "materials", className: "material-controls-tab-content", children: _jsxs("div", { className: "materials-section", children: [_jsxs("div", { className: "materials-header", children: [_jsx("h4", { className: "section-title", children: "Add Material" }), _jsx("div", { className: "add-material-buttons", children: Object.entries(MATERIAL_PRESETS).slice(0, 8).map(([type, preset]) => {
                                                const IconComponent = preset.icon;
                                                return (_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleAddMaterial(type), className: "add-material-button", title: preset.description, children: _jsx(IconComponent, { className: "w-4 h-4" }) }, type));
                                            }) }), _jsx("div", { className: "add-material-buttons", children: Object.entries(MATERIAL_PRESETS).slice(8).map(([type, preset]) => {
                                                const IconComponent = preset.icon;
                                                return (_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleAddMaterial(type), className: "add-material-button", title: preset.description, children: _jsx(IconComponent, { className: "w-4 h-4" }) }, type));
                                            }) })] }), _jsxs("div", { className: "materials-list", children: [_jsxs("h4", { className: "section-title", children: ["Scene Materials (", materials.length, ")"] }), _jsx(ScrollArea, { className: "materials-scroll-area", children: _jsx("div", { className: "materials-grid", children: materials.map((material) => {
                                                    const preset = MATERIAL_PRESETS[material.type];
                                                    const IconComponent = preset.icon;
                                                    return (_jsx(Card, { className: `material-card ${selectedMaterial === material.id ? 'selected' : ''}`, onClick: () => setSelectedMaterial(material.id), children: _jsxs(CardContent, { className: "material-content", children: [_jsxs("div", { className: "material-header", children: [_jsxs("div", { className: "material-info", children: [_jsx(IconComponent, { className: "w-4 h-4" }), _jsx("span", { className: "material-name", children: material.name }), _jsx(Badge, { variant: "secondary", className: "material-type", children: material.type })] }), _jsxs("div", { className: "material-actions", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        resetMaterial(material.id);
                                                                                    }, children: _jsx(RotateCcw, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        duplicateMaterial(material.id);
                                                                                    }, children: _jsx(Copy, { className: "w-3 h-3" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        handleRemoveMaterial(material.id);
                                                                                    }, children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }), _jsx("div", { className: "material-preview", children: _jsx("div", { className: "material-color", style: {
                                                                            backgroundColor: `rgb(${material.baseColor.r * 255}, ${material.baseColor.g * 255}, ${material.baseColor.b * 255})`
                                                                        } }) })] }) }, material.id));
                                                }) }) })] })] }) }), _jsx(TabsContent, { value: "textures", className: "material-controls-tab-content", children: _jsxs("div", { className: "textures-section", children: [_jsxs("div", { className: "textures-header", children: [_jsx("h4", { className: "section-title", children: "Add Texture" }), _jsx("div", { className: "add-texture-buttons", children: ['diffuse', 'normal', 'specular', 'emissive', 'ambient', 'opacity', 'bump', 'reflection', 'refraction'].map((type) => (_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleAddTexture(type), className: "add-texture-button", title: `${type} texture`, children: type.charAt(0).toUpperCase() + type.slice(1) }, type))) })] }), _jsxs("div", { className: "textures-list", children: [_jsxs("h4", { className: "section-title", children: ["Scene Textures (", textures.length, ")"] }), _jsx(ScrollArea, { className: "textures-scroll-area", children: _jsx("div", { className: "textures-grid", children: textures.map((texture) => (_jsx(Card, { className: `texture-card ${selectedTexture === texture.id ? 'selected' : ''}`, onClick: () => setSelectedTexture(texture.id), children: _jsxs(CardContent, { className: "texture-content", children: [_jsxs("div", { className: "texture-header", children: [_jsxs("div", { className: "texture-info", children: [_jsx("span", { className: "texture-name", children: texture.name }), _jsx(Badge, { variant: "secondary", className: "texture-type", children: texture.type })] }), _jsx("div", { className: "texture-actions", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                                e.stopPropagation();
                                                                                handleRemoveTexture(texture.id);
                                                                            }, children: _jsx(Trash2, { className: "w-3 h-3" }) }) })] }), _jsxs("div", { className: "texture-properties", children: [_jsxs("div", { className: "texture-property", children: [_jsx("label", { children: "URL" }), _jsx(Input, { placeholder: "Texture URL", value: texture.url, onChange: (e) => handleTextureUpdate(texture.id, { url: e.target.value }) })] }), _jsxs("div", { className: "texture-property", children: [_jsx("label", { children: "U Scale" }), _jsx(Input, { type: "number", step: "0.1", value: texture.uScale, onChange: (e) => handleTextureUpdate(texture.id, { uScale: parseFloat(e.target.value) }) })] }), _jsxs("div", { className: "texture-property", children: [_jsx("label", { children: "V Scale" }), _jsx(Input, { type: "number", step: "0.1", value: texture.vScale, onChange: (e) => handleTextureUpdate(texture.id, { vScale: parseFloat(e.target.value) }) })] })] })] }) }, texture.id))) }) })] })] }) }), _jsx(TabsContent, { value: "shaders", className: "material-controls-tab-content", children: _jsxs("div", { className: "shaders-section", children: [_jsx("h4", { className: "section-title", children: "Shader Editor" }), _jsx("div", { className: "shaders-info", children: _jsx("p", { className: "shaders-description", children: "Advanced shader customization for custom materials." }) }), _jsxs("div", { className: "shaders-content", children: [_jsxs("div", { className: "shader-editor", children: [_jsxs("div", { className: "shader-tabs", children: [_jsx(Button, { variant: "outline", size: "sm", className: "shader-tab", children: "Vertex" }), _jsx(Button, { variant: "outline", size: "sm", className: "shader-tab", children: "Fragment" }), _jsx(Button, { variant: "outline", size: "sm", className: "shader-tab", children: "Geometry" })] }), _jsx("div", { className: "shader-code", children: _jsx("textarea", { placeholder: "Enter your shader code here...", className: "shader-textarea", defaultValue: `// Vertex Shader
precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 worldViewProjection;
uniform mat4 world;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vPosition = (world * vec4(position, 1.0)).xyz;
  vNormal = normalize((world * vec4(normal, 0.0)).xyz);
  vUv = uv;
  gl_Position = worldViewProjection * vec4(position, 1.0);
}` }) })] }), _jsxs("div", { className: "shader-controls", children: [_jsxs("div", { className: "shader-control-group", children: [_jsx("label", { className: "shader-label", children: "Shader Language" }), _jsxs("div", { className: "shader-options", children: [_jsx(Button, { variant: "outline", size: "sm", children: "GLSL" }), _jsx(Button, { variant: "outline", size: "sm", children: "HLSL" }), _jsx(Button, { variant: "outline", size: "sm", children: "WGSL" })] })] }), _jsxs("div", { className: "shader-control-group", children: [_jsx("label", { className: "shader-label", children: "Compile" }), _jsxs(Button, { variant: "default", size: "sm", className: "compile-button", children: [_jsx(Play, { className: "w-4 h-4 mr-2" }), "Compile Shader"] })] }), _jsxs("div", { className: "shader-control-group", children: [_jsx("label", { className: "shader-label", children: "Presets" }), _jsxs("div", { className: "shader-presets", children: [_jsx(Button, { variant: "outline", size: "sm", children: "Basic" }), _jsx(Button, { variant: "outline", size: "sm", children: "PBR" }), _jsx(Button, { variant: "outline", size: "sm", children: "Toon" }), _jsx(Button, { variant: "outline", size: "sm", children: "Custom" })] })] })] })] })] }) })] })] }));
}
