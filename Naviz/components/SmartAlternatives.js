import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import * as BABYLON from '@babylonjs/core';
import './SmartAlternatives.css';
const SmartAlternatives = ({ currentMaterial, budget, ecoPriority = 3, durabilityPriority = 3, scene, selectedMesh, onAlternativeSelect }) => {
    const [alternatives, setAlternatives] = useState([]);
    const [selectedAlternative, setSelectedAlternative] = useState('');
    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState('overall');
    // Mock AI-powered alternatives database
    const mockAlternatives = {
        paint: [
            {
                id: 'paint_eco_latex',
                name: 'Eco-Friendly Latex Paint',
                category: 'paint',
                baseCost: 42,
                ecoImpact: -8,
                durability: 8,
                maintenance: 25,
                availability: 'high',
                supplier: 'Benjamin Moore',
                reasoning: [
                    '50% lower VOC emissions',
                    'Made from renewable plant-based resins',
                    'Comparable durability to premium paints',
                    'LEED certified for green building'
                ],
                compatibility: 95
            },
            {
                id: 'paint_recycled_content',
                name: 'Recycled Content Paint',
                category: 'paint',
                baseCost: 38,
                ecoImpact: -6,
                durability: 6,
                maintenance: 30,
                availability: 'medium',
                supplier: 'Sherwin Williams',
                reasoning: [
                    'Contains 30% recycled materials',
                    'Reduces landfill waste',
                    'Slightly lower durability but excellent coverage',
                    'Cost-effective eco alternative'
                ],
                compatibility: 90
            },
            {
                id: 'paint_mildew_resistant',
                name: 'Mildew-Resistant Paint',
                category: 'paint',
                baseCost: 48,
                ecoImpact: -2,
                durability: 10,
                maintenance: 20,
                availability: 'high',
                supplier: 'Behr',
                reasoning: [
                    'Superior mold and mildew resistance',
                    'Ideal for humid environments',
                    'Longer lifespan reduces replacement frequency',
                    'Premium performance for high-traffic areas'
                ],
                compatibility: 98
            }
        ],
        wood: [
            {
                id: 'wood_bamboo',
                name: 'Bamboo Flooring',
                category: 'wood',
                baseCost: 6.50,
                ecoImpact: -9,
                durability: 15,
                maintenance: 15,
                availability: 'high',
                supplier: 'Bamboo Flooring Co',
                reasoning: [
                    'Grows 3x faster than traditional hardwoods',
                    'Renewable resource with minimal environmental impact',
                    'Naturally resistant to moisture and insects',
                    'Comparable aesthetics to oak flooring'
                ],
                compatibility: 85
            },
            {
                id: 'wood_reclaimed',
                name: 'Reclaimed Wood',
                category: 'wood',
                baseCost: 8.75,
                ecoImpact: -10,
                durability: 25,
                maintenance: 10,
                availability: 'low',
                supplier: 'Reclaimed Wood Specialists',
                reasoning: [
                    'Zero environmental impact from harvesting',
                    'Unique character and patina',
                    'Extremely durable with proven longevity',
                    'Supports sustainable building practices'
                ],
                compatibility: 80
            },
            {
                id: 'wood_engineered',
                name: 'Engineered Wood',
                category: 'wood',
                baseCost: 5.25,
                ecoImpact: -4,
                durability: 20,
                maintenance: 12,
                availability: 'high',
                supplier: 'Flooring Direct',
                reasoning: [
                    'Uses less wood than solid hardwood',
                    'More stable in varying humidity',
                    'Cost-effective with good durability',
                    'Easier installation process'
                ],
                compatibility: 92
            }
        ],
        tile: [
            {
                id: 'tile_recycled_glass',
                name: 'Recycled Glass Tile',
                category: 'tile',
                baseCost: 12.50,
                ecoImpact: -9,
                durability: 30,
                maintenance: 5,
                availability: 'medium',
                supplier: 'Eco Tile Works',
                reasoning: [
                    'Made from 100% recycled glass',
                    'Dramatically reduces landfill waste',
                    'Beautiful iridescent finish',
                    'Extremely durable for high-traffic areas'
                ],
                compatibility: 88
            },
            {
                id: 'tile_porcelain_eco',
                name: 'Eco Porcelain Tile',
                category: 'tile',
                baseCost: 8.75,
                ecoImpact: -6,
                durability: 35,
                maintenance: 3,
                availability: 'high',
                supplier: 'Tile Warehouse',
                reasoning: [
                    'Lower firing temperature reduces energy use',
                    'Excellent durability and stain resistance',
                    'Wide variety of colors and patterns',
                    'Cost-effective long-term solution'
                ],
                compatibility: 95
            }
        ]
    };
    useEffect(() => {
        generateAlternatives();
    }, [currentMaterial, budget, ecoPriority, durabilityPriority]);
    const generateAlternatives = async () => {
        setLoading(true);
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        const materialCategory = getMaterialCategory(currentMaterial);
        const availableAlternatives = mockAlternatives[materialCategory] || [];
        // Filter by budget if specified
        let filteredAlternatives = availableAlternatives;
        if (budget) {
            const currentCost = getCurrentMaterialCost(currentMaterial);
            filteredAlternatives = availableAlternatives.filter(alt => alt.baseCost <= budget || alt.baseCost <= currentCost * 1.2);
        }
        // Score alternatives based on priorities
        const scoredAlternatives = filteredAlternatives.map(alt => ({
            ...alt,
            score: calculateAlternativeScore(alt, ecoPriority, durabilityPriority)
        }));
        // Sort based on selected criteria
        const sortedAlternatives = scoredAlternatives.sort((a, b) => {
            switch (sortBy) {
                case 'cost':
                    return a.baseCost - b.baseCost;
                case 'eco':
                    return b.ecoImpact - a.ecoImpact;
                case 'durability':
                    return b.durability - a.durability;
                case 'overall':
                default:
                    return b.score - a.score;
            }
        });
        setAlternatives(sortedAlternatives);
        setLoading(false);
    };
    const getMaterialCategory = (material) => {
        if (material.includes('paint'))
            return 'paint';
        if (material.includes('wood') || material.includes('floor'))
            return 'wood';
        if (material.includes('tile'))
            return 'tile';
        return 'paint'; // default
    };
    const getCurrentMaterialCost = (material) => {
        // Mock current material costs
        const costs = {
            'paint_standard': 35,
            'wood_oak': 8,
            'tile_ceramic': 6
        };
        return costs[material] || 30;
    };
    const calculateAlternativeScore = (alt, ecoPriority, durabilityPriority) => {
        const ecoScore = (alt.ecoImpact + 10) / 20 * ecoPriority; // Normalize eco impact to 0-1
        const durabilityScore = alt.durability / 30 * durabilityPriority; // Assume max 30 years
        const costEfficiency = Math.max(0, 1 - (alt.baseCost / getCurrentMaterialCost(currentMaterial)));
        const compatibilityScore = alt.compatibility / 100;
        return (ecoScore + durabilityScore + costEfficiency * 2 + compatibilityScore * 3) / 7;
    };
    const handleAlternativeSelect = (alternative) => {
        setSelectedAlternative(alternative.id);
        if (onAlternativeSelect) {
            onAlternativeSelect(alternative);
        }
        // Apply preview to selected mesh
        if (selectedMesh) {
            applyMaterialPreview(alternative, selectedMesh);
        }
    };
    const applyMaterialPreview = (alternative, mesh) => {
        // Clear existing preview materials
        if (mesh.material && mesh.material.name?.includes('preview_')) {
            mesh.material.dispose();
        }
        // Create preview material based on alternative
        const previewMaterial = new BABYLON.PBRMaterial(`preview_${alternative.id}`, scene);
        previewMaterial.albedoColor = getAlternativeColor(alternative.category, alternative.id);
        previewMaterial.metallic = getMetallicValue(alternative.category);
        previewMaterial.roughness = getRoughnessValue(alternative.category);
        mesh.material = previewMaterial;
    };
    const getAlternativeColor = (category, id) => {
        const colors = {
            paint_eco_latex: new BABYLON.Color3(0.9, 0.9, 0.9),
            paint_recycled_content: new BABYLON.Color3(0.8, 0.8, 0.8),
            paint_mildew_resistant: new BABYLON.Color3(0.85, 0.85, 0.85),
            wood_bamboo: new BABYLON.Color3(0.7, 0.6, 0.4),
            wood_reclaimed: new BABYLON.Color3(0.5, 0.4, 0.3),
            wood_engineered: new BABYLON.Color3(0.6, 0.5, 0.3),
            tile_recycled_glass: new BABYLON.Color3(0.8, 0.9, 1.0),
            tile_porcelain_eco: new BABYLON.Color3(0.9, 0.9, 0.9)
        };
        return colors[id] || new BABYLON.Color3(0.8, 0.8, 0.8);
    };
    const getMetallicValue = (category) => {
        return category === 'tile' ? 0.1 : 0.0;
    };
    const getRoughnessValue = (category) => {
        switch (category) {
            case 'paint': return 0.3;
            case 'wood': return 0.7;
            case 'tile': return 0.2;
            default: return 0.5;
        }
    };
    const getEcoColor = (impact) => {
        if (impact <= -7)
            return '#4CAF50'; // Excellent
        if (impact <= -4)
            return '#8BC34A'; // Good
        if (impact <= -1)
            return '#FFC107'; // Fair
        return '#FF9800'; // Poor
    };
    const getAvailabilityColor = (availability) => {
        switch (availability) {
            case 'high': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'low': return '#F44336';
            default: return '#9E9E9E';
        }
    };
    const getEcoClass = (impact) => {
        if (impact <= -7)
            return 'excellent';
        if (impact <= -4)
            return 'good';
        if (impact <= -1)
            return 'fair';
        return 'poor';
    };
    return (_jsxs("div", { className: "smart-alternatives-panel", children: [_jsx("h3", { className: "smart-alternatives-header", children: "\uD83E\uDDE0 Smart Alternatives" }), _jsxs("div", { className: "current-material-info", children: [_jsxs("div", { className: "current-material-title", children: ["Current: ", currentMaterial] }), _jsxs("div", { className: "current-material-details", children: ["Budget: $", budget || 'No limit', " \u2022 Eco Priority: ", ecoPriority, "/5 \u2022 Durability Priority: ", durabilityPriority, "/5"] })] }), _jsx("div", { className: "sort-options", children: _jsx("div", { className: "sort-buttons", children: ['overall', 'cost', 'eco', 'durability'].map(option => (_jsx("button", { onClick: () => setSortBy(option), className: `sort-button ${sortBy === option ? 'selected' : ''}`, children: option.charAt(0).toUpperCase() + option.slice(1) }, option))) }) }), _jsxs("div", { children: [_jsx("h4", { className: "smart-alternatives-header", children: "AI-Recommended Alternatives" }), loading ? (_jsx("div", { className: "loading-message", children: "\uD83E\uDD16 Analyzing alternatives..." })) : (_jsx("div", { className: "alternatives-list", children: alternatives.map(alternative => (_jsxs("div", { onClick: () => handleAlternativeSelect(alternative), className: `alternative-item ${selectedAlternative === alternative.id ? 'selected' : ''}`, children: [_jsxs("div", { className: "alternative-header", children: [_jsx("div", { className: "alternative-name", children: alternative.name }), _jsxs("div", { className: "alternative-cost", children: ["$", alternative.baseCost] })] }), _jsxs("div", { className: "alternative-stats", children: [_jsxs("div", { className: `eco-impact ${getEcoClass(alternative.ecoImpact)}`, children: ["\uD83C\uDF31 ", alternative.ecoImpact > 0 ? '+' : '', alternative.ecoImpact] }), _jsxs("div", { className: "durability", children: ["\uD83D\uDCC5 ", alternative.durability, "yrs"] }), _jsxs("div", { className: `availability-${alternative.availability}`, children: ["\uD83D\uDCE6 ", alternative.availability] })] }), _jsx("div", { className: "alternative-supplier", children: alternative.supplier }), _jsxs("div", { className: "alternative-reasoning", children: [_jsx("div", { className: "alternative-reasoning-title", children: "Why this alternative:" }), _jsx("ul", { className: "alternative-reasoning-list", children: alternative.reasoning.slice(0, 2).map((reason, index) => (_jsx("li", { children: reason }, index))) })] }), _jsxs("div", { className: "alternative-compatibility", children: ["Compatibility: ", alternative.compatibility, "%"] })] }, alternative.id))) })), alternatives.length === 0 && !loading && (_jsx("div", { className: "no-alternatives-message", children: "No alternatives found. Try adjusting your priorities or budget." }))] })] }));
};
export default SmartAlternatives;
