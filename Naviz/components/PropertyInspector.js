import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Mesh, StandardMaterial, Color3 } from '@babylonjs/core';
import './PropertyInspector.css';
const PropertyInspector = ({ scene, engine, selectedObject, onPropertyChange }) => {
    const [properties, setProperties] = useState(null);
    const [isEditing, setIsEditing] = useState(null);
    useEffect(() => {
        if (selectedObject) {
            updateProperties(selectedObject);
        }
        else {
            setProperties(null);
        }
    }, [selectedObject]);
    const updateProperties = (object) => {
        const props = {
            name: object.name,
            type: object instanceof Mesh ? 'Mesh' : 'TransformNode',
            position: {
                x: object.position.x,
                y: object.position.y,
                z: object.position.z
            },
            rotation: {
                x: object.rotation.x * 180 / Math.PI,
                y: object.rotation.y * 180 / Math.PI,
                z: object.rotation.z * 180 / Math.PI
            },
            scaling: {
                x: object.scaling.x,
                y: object.scaling.y,
                z: object.scaling.z
            },
            visible: object.isEnabled(),
            pickable: object instanceof Mesh ? object.isPickable : true
        };
        // Add mesh-specific properties
        if (object instanceof Mesh) {
            const boundingInfo = object.getBoundingInfo();
            const size = boundingInfo.maximum.subtract(boundingInfo.minimum);
            props.dimensions = {
                width: size.x,
                height: size.y,
                depth: size.z
            };
            // Material properties
            if (object.material instanceof StandardMaterial) {
                const material = object.material;
                props.material = {
                    name: material.name,
                    diffuseColor: {
                        r: material.diffuseColor.r,
                        g: material.diffuseColor.g,
                        b: material.diffuseColor.b
                    },
                    specularColor: {
                        r: material.specularColor.r,
                        g: material.specularColor.g,
                        b: material.specularColor.b
                    },
                    emissiveColor: {
                        r: material.emissiveColor.r,
                        g: material.emissiveColor.g,
                        b: material.emissiveColor.b
                    },
                    alpha: material.alpha,
                    wireframe: material.wireframe
                };
            }
        }
        setProperties(props);
    };
    const handlePropertyChange = (property, value, subProperty) => {
        if (!selectedObject || !properties)
            return;
        let newValue = value;
        // Convert degrees to radians for rotation
        if (property === 'rotation') {
            newValue = value * Math.PI / 180;
        }
        // Update the object
        if (subProperty) {
            selectedObject[property][subProperty] = newValue;
        }
        else {
            selectedObject[property] = newValue;
        }
        // Update properties state
        const updatedProps = { ...properties };
        if (subProperty) {
            updatedProps[property][subProperty] = value;
        }
        else {
            updatedProps[property] = value;
        }
        setProperties(updatedProps);
        // Notify parent
        if (onPropertyChange) {
            onPropertyChange(selectedObject, property, newValue);
        }
    };
    const handleMaterialChange = (property, value) => {
        if (!selectedObject || !(selectedObject instanceof Mesh) || !selectedObject.material)
            return;
        const material = selectedObject.material;
        if (property.includes('Color')) {
            const colorValue = new Color3(value.r, value.g, value.b);
            material[property] = colorValue;
        }
        else {
            material[property] = value;
        }
        updateProperties(selectedObject);
    };
    const renderVector3Input = (label, property, values) => (_jsxs("div", { className: "vector3-container", children: [_jsx("label", { className: "label", children: label }), _jsx("div", { className: "vector3-inputs", children: ['x', 'y', 'z'].map(axis => (_jsx("input", { type: "number", step: "0.01", value: values[axis].toFixed(3), onChange: (e) => handlePropertyChange(property, parseFloat(e.target.value), axis), className: "input-number vector3-input", "aria-label": `${label} ${axis.toUpperCase()}` }, axis))) })] }));
    const renderColorInput = (label, color, onChange) => (_jsxs("div", { className: "color-input-container", children: [_jsx("label", { className: "label", children: label }), _jsxs("div", { className: "color-input-container", children: [_jsx("input", { type: "color", value: `#${Math.round(color.r * 255).toString(16).padStart(2, '0')}${Math.round(color.g * 255).toString(16).padStart(2, '0')}${Math.round(color.b * 255).toString(16).padStart(2, '0')}`, onChange: (e) => {
                            const hex = e.target.value;
                            const r = parseInt(hex.slice(1, 3), 16) / 255;
                            const g = parseInt(hex.slice(3, 5), 16) / 255;
                            const b = parseInt(hex.slice(5, 7), 16) / 255;
                            onChange({ r, g, b });
                        }, className: "color-picker", "aria-label": `${label} picker` }), _jsx("div", { className: "color-components", children: ['r', 'g', 'b'].map(component => (_jsx("input", { type: "number", min: "0", max: "1", step: "0.01", value: color[component].toFixed(3), onChange: (e) => {
                                const newColor = { ...color, [component]: parseFloat(e.target.value) };
                                onChange(newColor);
                            }, className: "color-component-input", "aria-label": `${component.toUpperCase()} component` }, component))) })] })] }));
    if (!properties) {
        return (_jsxs("div", { className: "p-4 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 h-full", children: [_jsx("h3", { className: "m-0 mb-4 text-base", children: "Property Inspector" }), _jsx("div", { className: "flex items-center justify-center h-48 text-slate-400 text-sm", children: "Select an object to view its properties" })] }));
    }
    return (_jsxs("div", { className: "p-4 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 h-full overflow-y-auto", children: [_jsx("h3", { className: "m-0 mb-4 text-base", children: "Property Inspector" }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "m-0 mb-2 text-xs text-blue-500", children: "Basic Properties" }), _jsxs("div", { className: "mb-2", children: [_jsx("label", { htmlFor: "object-name", className: "block text-xs text-slate-400 mb-1", children: "Name" }), _jsx("input", { id: "object-name", type: "text", value: properties.name, onChange: (e) => handlePropertyChange('name', e.target.value), className: "w-full p-1 bg-slate-700 border border-slate-600 rounded text-slate-100 text-xs" })] }), _jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "block text-xs text-slate-400 mb-1", children: "Type" }), _jsx("div", { className: "p-1 bg-slate-700 rounded text-xs text-slate-100", children: properties.type })] }), _jsxs("div", { className: "flex gap-2 mb-2", children: [_jsxs("label", { className: "flex items-center text-xs text-slate-400", children: [_jsx("input", { type: "checkbox", checked: properties.visible, onChange: (e) => handlePropertyChange('isEnabled', e.target.checked), className: "mr-1" }), "Visible"] }), _jsxs("label", { className: "flex items-center text-xs text-slate-400", children: [_jsx("input", { type: "checkbox", checked: properties.pickable, onChange: (e) => handlePropertyChange('isPickable', e.target.checked), className: "mr-1" }), "Pickable"] })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "m-0 mb-2 text-xs text-blue-500", children: "Transform" }), renderVector3Input('Position', 'position', properties.position), renderVector3Input('Rotation (°)', 'rotation', properties.rotation), renderVector3Input('Scale', 'scaling', properties.scaling)] }), properties.dimensions && (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "m-0 mb-2 text-xs text-blue-500", children: "Dimensions" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { className: "p-1 bg-slate-700 rounded text-center", children: [_jsx("div", { className: "text-xs text-slate-400", children: "Width" }), _jsx("div", { className: "text-xs", children: properties.dimensions.width.toFixed(3) })] }), _jsxs("div", { className: "p-1 bg-slate-700 rounded text-center", children: [_jsx("div", { className: "text-xs text-slate-400", children: "Height" }), _jsx("div", { className: "text-xs", children: properties.dimensions.height.toFixed(3) })] }), _jsxs("div", { className: "p-1 bg-slate-700 rounded text-center", children: [_jsx("div", { className: "text-xs text-slate-400", children: "Depth" }), _jsx("div", { className: "text-xs", children: properties.dimensions.depth.toFixed(3) })] }), _jsxs("div", { className: "p-1 bg-slate-700 rounded text-center", children: [_jsx("div", { className: "text-xs text-slate-400", children: "Volume" }), _jsx("div", { className: "text-xs", children: (properties.dimensions.width * properties.dimensions.height * properties.dimensions.depth).toFixed(3) })] })] })] })), properties.material && (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "m-0 mb-2 text-xs text-blue-500", children: "Material" }), _jsxs("div", { className: "mb-2", children: [_jsx("label", { className: "block text-xs text-slate-400 mb-1", children: "Material Name" }), _jsx("div", { className: "p-1 bg-slate-700 rounded text-xs text-slate-100", children: properties.material.name })] }), renderColorInput('Diffuse Color', properties.material.diffuseColor, (color) => handleMaterialChange('diffuseColor', color)), renderColorInput('Specular Color', properties.material.specularColor, (color) => handleMaterialChange('specularColor', color)), renderColorInput('Emissive Color', properties.material.emissiveColor, (color) => handleMaterialChange('emissiveColor', color)), _jsxs("div", { className: "alpha-container", children: [_jsx("label", { className: "label", children: "Alpha (Transparency)" }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.01", value: properties.material.alpha, onChange: (e) => handleMaterialChange('alpha', parseFloat(e.target.value)), className: "alpha-range", "aria-label": "Alpha transparency" }), _jsx("div", { className: "alpha-value", children: properties.material.alpha.toFixed(2) })] }), _jsx("div", { className: "mb-2", children: _jsxs("label", { className: "flex items-center text-xs text-slate-400", children: [_jsx("input", { type: "checkbox", checked: properties.material.wireframe, onChange: (e) => handleMaterialChange('wireframe', e.target.checked), className: "mr-1" }), "Wireframe"] }) })] }))] }));
};
export default PropertyInspector;
