import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
const PrefabModulePreview = ({ scene, onModuleSelect, onAssemblyComplete }) => {
    const [modules, setModules] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);
    const [assemblySteps, setAssemblySteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isAssembling, setIsAssembling] = useState(false);
    const [previewMode, setPreviewMode] = useState('single');
    const [selectedCategory, setSelectedCategory] = useState('all');
    // Mock prefab modules database
    const mockModules = [
        {
            id: 'wall_standard',
            name: 'Standard Wall Panel',
            type: 'wall',
            dimensions: { width: 4, height: 2.4, depth: 0.15 },
            materials: ['gypsum', 'wood_frame', 'insulation'],
            connections: ['top_rail', 'bottom_rail', 'side_studs'],
            weight: 45,
            assemblyTime: 15,
            cost: 280,
            ecoRating: 3
        },
        {
            id: 'wall_glass',
            name: 'Glass Wall Panel',
            type: 'wall',
            dimensions: { width: 2.4, height: 2.4, depth: 0.08 },
            materials: ['tempered_glass', 'aluminum_frame'],
            connections: ['top_track', 'bottom_track', 'side_clips'],
            weight: 35,
            assemblyTime: 10,
            cost: 450,
            ecoRating: 4
        },
        {
            id: 'floor_wood',
            name: 'Engineered Wood Floor',
            type: 'floor',
            dimensions: { width: 1.2, height: 0.02, depth: 0.8 },
            materials: ['oak_veneer', 'plywood_core'],
            connections: ['tongue_groove', 'click_system'],
            weight: 18,
            assemblyTime: 5,
            cost: 8,
            ecoRating: 4
        },
        {
            id: 'ceiling_acoustic',
            name: 'Acoustic Ceiling Panel',
            type: 'ceiling',
            dimensions: { width: 0.6, height: 0.025, depth: 0.6 },
            materials: ['mineral_fiber', 'aluminum_grid'],
            connections: ['grid_clips', 'suspension_wires'],
            weight: 2.5,
            assemblyTime: 3,
            cost: 12,
            ecoRating: 3
        },
        {
            id: 'roof_truss',
            name: 'Roof Truss System',
            type: 'roof',
            dimensions: { width: 8, height: 0.3, depth: 0.15 },
            materials: ['spruce_lumber', 'steel_connectors'],
            connections: ['ridge_connection', 'wall_plates', 'bracing_points'],
            weight: 85,
            assemblyTime: 25,
            cost: 320,
            ecoRating: 3
        },
        {
            id: 'foundation_block',
            name: 'Concrete Foundation Block',
            type: 'foundation',
            dimensions: { width: 0.4, height: 0.2, depth: 0.2 },
            materials: ['concrete', 'reinforcement'],
            connections: ['mortar_joints', 'rebar_ties'],
            weight: 25,
            assemblyTime: 8,
            cost: 15,
            ecoRating: 2
        }
    ];
    const mockAssemblySteps = [
        {
            step: 1,
            description: 'Prepare foundation and layout wall positions',
            duration: 30,
            tools: ['measuring_tape', 'chalk_line', 'level'],
            safetyNotes: ['Wear safety glasses', 'Check for underground utilities']
        },
        {
            step: 2,
            description: 'Install bottom wall plates and anchor bolts',
            duration: 45,
            tools: ['drill', 'hammer', 'wrench'],
            safetyNotes: ['Use proper lifting techniques', 'Secure work area']
        },
        {
            step: 3,
            description: 'Assemble and erect wall panels',
            duration: 60,
            tools: ['circular_saw', 'nail_gun', 'ladder'],
            safetyNotes: ['Work with a partner for large panels', 'Secure panels before releasing']
        },
        {
            step: 4,
            description: 'Install top plates and temporary bracing',
            duration: 30,
            tools: ['nail_gun', 'bracing_material'],
            safetyNotes: ['Ensure proper alignment', 'Check plumb frequently']
        },
        {
            step: 5,
            description: 'Install roof trusses and secure connections',
            duration: 90,
            tools: ['ladder', 'drill', 'ratchet_set'],
            safetyNotes: ['Work from stable platforms', 'Secure trusses before climbing']
        }
    ];
    useEffect(() => {
        setModules(mockModules);
        setAssemblySteps(mockAssemblySteps);
    }, []);
    const handleModuleSelect = (module) => {
        if (onModuleSelect) {
            onModuleSelect(module);
        }
        if (previewMode === 'single') {
            // Create 3D preview of single module
            createModulePreview(module);
        }
        else if (previewMode === 'assembly') {
            setSelectedModules(prev => [...prev, module]);
        }
    };
    const createModulePreview = (module) => {
        // Clear existing previews
        scene.meshes.forEach(mesh => {
            if (mesh.name.startsWith('preview_')) {
                mesh.dispose();
            }
        });
        // Create 3D representation based on module type
        let mesh;
        switch (module.type) {
            case 'wall':
                mesh = BABYLON.MeshBuilder.CreateBox(`preview_${module.id}`, {
                    width: module.dimensions.width,
                    height: module.dimensions.height,
                    depth: module.dimensions.depth
                }, scene);
                break;
            case 'floor':
                mesh = BABYLON.MeshBuilder.CreateBox(`preview_${module.id}`, {
                    width: module.dimensions.width,
                    height: module.dimensions.height,
                    depth: module.dimensions.depth
                }, scene);
                mesh.rotation.x = Math.PI / 2;
                break;
            case 'ceiling':
                mesh = BABYLON.MeshBuilder.CreateBox(`preview_${module.id}`, {
                    width: module.dimensions.width,
                    height: module.dimensions.height,
                    depth: module.dimensions.depth
                }, scene);
                mesh.position.y = 3;
                break;
            default:
                mesh = BABYLON.MeshBuilder.CreateBox(`preview_${module.id}`, {
                    width: module.dimensions.width,
                    height: module.dimensions.height,
                    depth: module.dimensions.depth
                }, scene);
        }
        // Apply material based on module
        const material = new BABYLON.PBRMaterial(`material_${module.id}`, scene);
        material.albedoColor = getMaterialColor(module.materials[0]);
        mesh.material = material;
        // Position in scene
        mesh.position = new BABYLON.Vector3(0, module.dimensions.height / 2, 0);
    };
    const getMaterialColor = (material) => {
        const colors = {
            gypsum: new BABYLON.Color3(0.9, 0.9, 0.8),
            wood_frame: new BABYLON.Color3(0.6, 0.4, 0.2),
            insulation: new BABYLON.Color3(0.8, 0.8, 0.8),
            tempered_glass: new BABYLON.Color3(0.7, 0.9, 1.0),
            aluminum_frame: new BABYLON.Color3(0.8, 0.8, 0.9),
            oak_veneer: new BABYLON.Color3(0.5, 0.3, 0.1),
            plywood_core: new BABYLON.Color3(0.7, 0.6, 0.4),
            mineral_fiber: new BABYLON.Color3(0.8, 0.8, 0.7),
            aluminum_grid: new BABYLON.Color3(0.9, 0.9, 0.9),
            spruce_lumber: new BABYLON.Color3(0.8, 0.7, 0.5),
            steel_connectors: new BABYLON.Color3(0.6, 0.6, 0.7),
            concrete: new BABYLON.Color3(0.7, 0.7, 0.7),
            reinforcement: new BABYLON.Color3(0.5, 0.5, 0.5)
        };
        return colors[material] || new BABYLON.Color3(0.8, 0.8, 0.8);
    };
    const startAssemblySequence = () => {
        setIsAssembling(true);
        setCurrentStep(0);
    };
    const nextAssemblyStep = () => {
        if (currentStep < assemblySteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
        else {
            setIsAssembling(false);
            if (onAssemblyComplete) {
                onAssemblyComplete(selectedModules);
            }
        }
    };
    const getFilteredModules = () => {
        if (selectedCategory === 'all')
            return modules;
        return modules.filter(module => module.type === selectedCategory);
    };
    const getTotalAssemblyTime = () => {
        return selectedModules.reduce((total, module) => total + module.assemblyTime, 0);
    };
    const getTotalCost = () => {
        return selectedModules.reduce((total, module) => total + module.cost, 0);
    };
    const getEcoScore = () => {
        if (selectedModules.length === 0)
            return 0;
        const avgEco = selectedModules.reduce((sum, module) => sum + module.ecoRating, 0) / selectedModules.length;
        return Math.round(avgEco * 10) / 10;
    };
    return (_jsxs("div", { className: "absolute top-15 left-2.5 w-80 bg-black bg-opacity-90 rounded-lg p-4 text-white text-xs z-[1000] max-h-[80vh] overflow-y-auto", children: [_jsx("h3", { className: "m-0 mb-4 text-orange-500", children: "\uD83C\uDFD7\uFE0F Prefab Module Preview" }), _jsx("div", { className: "mb-4", children: _jsx("div", { className: "flex gap-1 mb-2", children: ['single', 'assembly', 'sequence'].map(mode => (_jsx("button", { onClick: () => setPreviewMode(mode), className: `flex-1 px-1.5 py-1.5 text-white border-0 rounded cursor-pointer text-xs ${previewMode === mode ? 'bg-orange-500' : 'bg-gray-700'}`, children: mode.charAt(0).toUpperCase() + mode.slice(1) }, mode))) }) }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "category-filter", className: "sr-only", children: "Category Filter" }), _jsxs("select", { id: "category-filter", value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "w-full p-1 bg-gray-700 text-white border border-gray-600 rounded", children: [_jsx("option", { value: "all", children: "All Categories" }), _jsx("option", { value: "wall", children: "Walls" }), _jsx("option", { value: "floor", children: "Floors" }), _jsx("option", { value: "ceiling", children: "Ceilings" }), _jsx("option", { value: "roof", children: "Roof" }), _jsx("option", { value: "foundation", children: "Foundation" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "m-0 mb-2 text-orange-500", children: "Available Modules" }), _jsx("div", { className: "max-h-72 overflow-y-auto", children: getFilteredModules().map(module => (_jsxs("div", { onClick: () => handleModuleSelect(module), className: `p-2 mb-2 rounded-md cursor-pointer border border-gray-600 transition-all duration-200 ${selectedModules.includes(module) ? 'bg-orange-500' : 'bg-gray-700'}`, children: [_jsx("div", { className: "font-bold mb-1", children: module.name }), _jsxs("div", { className: "text-xs text-gray-300 mb-1", children: [module.dimensions.width, "m \u00D7 ", module.dimensions.height, "m \u00D7 ", module.dimensions.depth, "m"] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "text-xs text-green-500", children: ["$", module.cost, " \u2022 ", module.assemblyTime, "min"] }), _jsxs("div", { className: `text-xs ${module.ecoRating >= 4 ? 'text-green-500' :
                                                module.ecoRating >= 3 ? 'text-orange-500' : 'text-red-500'}`, children: ["\uD83C\uDF31 ", module.ecoRating, "/5"] })] })] }, module.id))) })] }), selectedModules.length > 0 && (_jsxs("div", { className: "mb-4 p-2 bg-gray-700 rounded-md", children: [_jsx("h4", { className: "m-0 mb-2 text-orange-500", children: "Assembly Summary" }), _jsxs("div", { className: "text-xs mb-1", children: ["Modules: ", selectedModules.length] }), _jsxs("div", { className: "text-xs mb-1", children: ["Total Time: ", getTotalAssemblyTime(), " minutes"] }), _jsxs("div", { className: "text-xs mb-1", children: ["Total Cost: $", getTotalCost()] }), _jsxs("div", { className: "text-xs mb-2", children: ["Eco Score: ", getEcoScore(), "/5"] }), !isAssembling && (_jsx("button", { onClick: startAssemblySequence, className: "w-full p-2 bg-green-500 text-white border-0 rounded cursor-pointer", children: "Start Assembly Sequence" }))] })), isAssembling && (_jsxs("div", { className: "p-2 bg-gray-700 rounded-md", children: [_jsxs("h4", { className: "m-0 mb-2 text-orange-500", children: ["Step ", currentStep + 1, " of ", assemblySteps.length] }), assemblySteps[currentStep] && (_jsxs("div", { children: [_jsx("div", { className: "mb-2 text-xs", children: assemblySteps[currentStep].description }), _jsxs("div", { className: "mb-2 text-xs text-gray-300", children: ["Duration: ", assemblySteps[currentStep].duration, " minutes"] }), _jsxs("div", { className: "mb-2", children: [_jsx("div", { className: "text-xs font-bold mb-1", children: "Tools Needed:" }), _jsx("div", { className: "text-xs text-gray-300", children: assemblySteps[currentStep].tools.join(', ') })] }), _jsxs("div", { className: "mb-4", children: [_jsx("div", { className: "text-xs font-bold mb-1 text-red-500", children: "Safety Notes:" }), _jsx("ul", { className: "text-xs text-gray-300 m-0 pl-4", children: assemblySteps[currentStep].safetyNotes.map((note, index) => (_jsx("li", { children: note }, index))) })] }), _jsx("button", { onClick: nextAssemblyStep, className: "w-full p-2 bg-orange-500 text-white border-0 rounded cursor-pointer", children: currentStep === assemblySteps.length - 1 ? 'Complete Assembly' : 'Next Step' })] }))] }))] }));
};
export default PrefabModulePreview;
