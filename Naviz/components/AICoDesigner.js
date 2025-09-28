import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Palette, Sparkles, Wand2, CheckCircle, XCircle, Info, Zap, Target, Layers, RefreshCw } from 'lucide-react';
import { Mesh, Vector3, PBRMaterial, StandardMaterial, Color3, HighlightLayer } from '@babylonjs/core';
const AICoDesigner = ({ scene, isActive, onClose, onSuggestionApply, onDesignUpdate }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [appliedSuggestions, setAppliedSuggestions] = useState([]);
    const [designHistory, setDesignHistory] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const analysisIntervalRef = useRef(null);
    // AI Design Analysis Engine
    const performDesignAnalysis = useCallback(async () => {
        const results = [];
        // Filter for actual Mesh instances, not AbstractMesh
        const meshes = scene.meshes.filter((mesh) => {
            return mesh instanceof Mesh &&
                mesh.name !== null &&
                typeof mesh.name === 'string' &&
                !mesh.name.includes('ground');
        });
        setAnalysisProgress(0);
        // Analyze each mesh for design improvements
        for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i];
            setAnalysisProgress((i / meshes.length) * 100);
            // Layout optimization suggestions
            const layoutSuggestions = analyzeLayout(mesh, meshes);
            results.push(...layoutSuggestions);
            // Material improvement suggestions
            const materialSuggestions = analyzeMaterials(mesh);
            results.push(...materialSuggestions);
            // Color harmony suggestions
            const colorSuggestions = analyzeColors(mesh, meshes);
            results.push(...colorSuggestions);
            // Structural optimization suggestions
            const structureSuggestions = analyzeStructure(mesh);
            results.push(...structureSuggestions);
            // Aesthetic enhancement suggestions
            const aestheticSuggestions = analyzeAesthetics(mesh, meshes);
            results.push(...aestheticSuggestions);
            // Performance optimization suggestions
            const performanceSuggestions = analyzePerformance(mesh);
            results.push(...performanceSuggestions);
            // Small delay to show progress
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        return results.sort((a, b) => b.confidence - a.confidence);
    }, [scene]);
    const analyzeLayout = (mesh, allMeshes) => {
        const suggestions = [];
        const meshPosition = mesh.position;
        const meshBoundingInfo = mesh.getBoundingInfo();
        const meshSize = meshBoundingInfo.boundingBox.maximum.subtract(meshBoundingInfo.boundingBox.minimum);
        // Check for overlapping meshes
        const overlappingMeshes = allMeshes.filter(m => m !== mesh &&
            m.position.subtract(meshPosition).length() < (meshSize.length() + m.getBoundingInfo().boundingBox.maximum.subtract(m.getBoundingInfo().boundingBox.minimum).length()) / 4);
        if (overlappingMeshes.length > 0) {
            suggestions.push({
                id: `layout-overlap-${mesh.name}-${Date.now()}`,
                type: 'layout',
                title: 'Resolve Mesh Overlap',
                description: `Mesh "${mesh.name}" overlaps with ${overlappingMeshes.length} other mesh(es). Consider repositioning for better spatial organization.`,
                confidence: 0.85,
                impact: 'medium',
                category: 'functional',
                affectedMeshes: [mesh.name, ...overlappingMeshes.map(m => m.name)],
                estimatedTime: 30
            });
        }
        // Check for isolated meshes
        const nearbyMeshes = allMeshes.filter(m => m !== mesh &&
            m.position.subtract(meshPosition).length() < 5);
        if (nearbyMeshes.length === 0) {
            suggestions.push({
                id: `layout-isolation-${mesh.name}-${Date.now()}`,
                type: 'layout',
                title: 'Improve Spatial Grouping',
                description: `Mesh "${mesh.name}" appears isolated. Consider grouping with related elements for better visual hierarchy.`,
                confidence: 0.7,
                impact: 'low',
                category: 'aesthetic',
                affectedMeshes: [mesh.name],
                estimatedTime: 45
            });
        }
        // Check for alignment opportunities
        const alignedMeshes = allMeshes.filter(m => m !== mesh &&
            (Math.abs(m.position.x - meshPosition.x) < 0.1 ||
                Math.abs(m.position.y - meshPosition.y) < 0.1 ||
                Math.abs(m.position.z - meshPosition.z) < 0.1));
        if (alignedMeshes.length > 2) {
            suggestions.push({
                id: `layout-alignment-${mesh.name}-${Date.now()}`,
                type: 'layout',
                title: 'Enhance Alignment',
                description: `Mesh "${mesh.name}" is part of an alignment group with ${alignedMeshes.length} other meshes. Consider refining alignment for precision.`,
                confidence: 0.6,
                impact: 'low',
                category: 'aesthetic',
                affectedMeshes: [mesh.name, ...alignedMeshes.map(m => m.name)],
                estimatedTime: 20
            });
        }
        return suggestions;
    };
    const analyzeMaterials = (mesh) => {
        const suggestions = [];
        const material = mesh.material;
        if (!material) {
            suggestions.push({
                id: `material-missing-${mesh.name}-${Date.now()}`,
                type: 'material',
                title: 'Add Material Properties',
                description: `Mesh "${mesh.name}" lacks material definition. Adding appropriate materials will enhance visual appeal and realism.`,
                confidence: 0.9,
                impact: 'high',
                category: 'aesthetic',
                affectedMeshes: [mesh.name],
                estimatedTime: 60
            });
            return suggestions;
        }
        // Check for basic materials that could be enhanced
        if (material instanceof StandardMaterial) {
            suggestions.push({
                id: `material-upgrade-${mesh.name}-${Date.now()}`,
                type: 'material',
                title: 'Upgrade to PBR Material',
                description: `Mesh "${mesh.name}" uses basic StandardMaterial. Upgrading to PBR material will provide more realistic lighting and reflections.`,
                confidence: 0.8,
                impact: 'medium',
                category: 'aesthetic',
                affectedMeshes: [mesh.name],
                estimatedTime: 90
            });
        }
        // Check for material complexity
        if (material instanceof PBRMaterial) {
            const hasTextures = material.albedoTexture || material.bumpTexture || material.metallicTexture;
            if (!hasTextures) {
                suggestions.push({
                    id: `material-textures-${mesh.name}-${Date.now()}`,
                    type: 'material',
                    title: 'Add Texture Details',
                    description: `PBR material on "${mesh.name}" lacks texture maps. Adding albedo, bump, or metallic textures will enhance surface detail.`,
                    confidence: 0.75,
                    impact: 'medium',
                    category: 'aesthetic',
                    affectedMeshes: [mesh.name],
                    estimatedTime: 120
                });
            }
        }
        return suggestions;
    };
    const analyzeColors = (mesh, allMeshes) => {
        const suggestions = [];
        if (!mesh.material)
            return suggestions;
        // Extract dominant colors from materials
        let meshColor = new Color3(0.5, 0.5, 0.5);
        if (mesh.material instanceof StandardMaterial) {
            meshColor = mesh.material.diffuseColor || new Color3(0.5, 0.5, 0.5);
        }
        else if (mesh.material instanceof PBRMaterial) {
            meshColor = mesh.material.albedoColor || new Color3(0.5, 0.5, 0.5);
        }
        // Check for color harmony with nearby meshes
        const nearbyMeshes = allMeshes.filter(m => m !== mesh &&
            m.position.subtract(mesh.position).length() < 3);
        let colorHarmonyScore = 0;
        nearbyMeshes.forEach(nearbyMesh => {
            if (nearbyMesh.material) {
                let nearbyColor = new Color3(0.5, 0.5, 0.5);
                if (nearbyMesh.material instanceof StandardMaterial) {
                    nearbyColor = nearbyMesh.material.diffuseColor || new Color3(0.5, 0.5, 0.5);
                }
                else if (nearbyMesh.material instanceof PBRMaterial) {
                    nearbyColor = nearbyMesh.material.albedoColor || new Color3(0.5, 0.5, 0.5);
                }
                const colorDistance = Math.sqrt(Math.pow(meshColor.r - nearbyColor.r, 2) +
                    Math.pow(meshColor.g - nearbyColor.g, 2) +
                    Math.pow(meshColor.b - nearbyColor.b, 2));
                colorHarmonyScore += Math.max(0, 1 - colorDistance);
            }
        });
        colorHarmonyScore = colorHarmonyScore / Math.max(1, nearbyMeshes.length);
        if (colorHarmonyScore < 0.3) {
            suggestions.push({
                id: `color-harmony-${mesh.name}-${Date.now()}`,
                type: 'color',
                title: 'Improve Color Harmony',
                description: `Colors in "${mesh.name}" and nearby meshes lack harmony. Consider using complementary or analogous color schemes.`,
                confidence: 0.7,
                impact: 'medium',
                category: 'aesthetic',
                affectedMeshes: [mesh.name, ...nearbyMeshes.map(m => m.name)],
                estimatedTime: 45
            });
        }
        // Check for overly bright or dark colors
        const brightness = (meshColor.r + meshColor.g + meshColor.b) / 3;
        if (brightness > 0.9) {
            suggestions.push({
                id: `color-brightness-${mesh.name}-${Date.now()}`,
                type: 'color',
                title: 'Adjust Color Brightness',
                description: `Mesh "${mesh.name}" uses very bright colors that may cause visual fatigue. Consider slightly desaturated tones.`,
                confidence: 0.6,
                impact: 'low',
                category: 'aesthetic',
                affectedMeshes: [mesh.name],
                estimatedTime: 15
            });
        }
        return suggestions;
    };
    const analyzeStructure = (mesh) => {
        const suggestions = [];
        const boundingInfo = mesh.getBoundingInfo();
        const dimensions = boundingInfo.boundingBox.maximum.subtract(boundingInfo.boundingBox.minimum);
        // Check for extreme aspect ratios
        const aspectRatios = [dimensions.x / dimensions.y, dimensions.x / dimensions.z, dimensions.y / dimensions.z];
        const maxAspectRatio = Math.max(...aspectRatios);
        if (maxAspectRatio > 10) {
            suggestions.push({
                id: `structure-ratio-${mesh.name}-${Date.now()}`,
                type: 'structure',
                title: 'Optimize Proportions',
                description: `Mesh "${mesh.name}" has extreme proportions (${maxAspectRatio.toFixed(1)}:1 ratio). Consider more balanced dimensions.`,
                confidence: 0.8,
                impact: 'medium',
                category: 'functional',
                affectedMeshes: [mesh.name],
                estimatedTime: 60
            });
        }
        // Check for thin structures that might need reinforcement
        const minDimension = Math.min(dimensions.x, dimensions.y, dimensions.z);
        const maxDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);
        if (minDimension / maxDimension < 0.1 && maxDimension > 2) {
            suggestions.push({
                id: `structure-thin-${mesh.name}-${Date.now()}`,
                type: 'structure',
                title: 'Add Structural Support',
                description: `Mesh "${mesh.name}" has very thin sections that may need structural reinforcement for stability.`,
                confidence: 0.75,
                impact: 'high',
                category: 'functional',
                affectedMeshes: [mesh.name],
                estimatedTime: 120
            });
        }
        return suggestions;
    };
    const analyzeAesthetics = (mesh, allMeshes) => {
        const suggestions = [];
        // Check for visual balance
        const meshPosition = mesh.position;
        const sceneCenter = allMeshes.reduce((center, m) => {
            center.x += m.position.x;
            center.y += m.position.y;
            center.z += m.position.z;
            return center;
        }, new Vector3(0, 0, 0));
        sceneCenter.x /= allMeshes.length;
        sceneCenter.y /= allMeshes.length;
        sceneCenter.z /= allMeshes.length;
        const distanceFromCenter = meshPosition.subtract(sceneCenter).length();
        if (distanceFromCenter > 5) {
            suggestions.push({
                id: `aesthetic-balance-${mesh.name}-${Date.now()}`,
                type: 'aesthetic',
                title: 'Improve Visual Balance',
                description: `Mesh "${mesh.name}" is positioned far from the scene center, affecting visual balance. Consider repositioning.`,
                confidence: 0.65,
                impact: 'low',
                category: 'aesthetic',
                affectedMeshes: [mesh.name],
                estimatedTime: 30
            });
        }
        // Check for visual hierarchy
        const meshSize = mesh.getBoundingInfo().boundingBox.maximum.subtract(mesh.getBoundingInfo().boundingBox.minimum).length();
        const similarSizedMeshes = allMeshes.filter(m => m !== mesh &&
            Math.abs(m.getBoundingInfo().boundingBox.maximum.subtract(m.getBoundingInfo().boundingBox.minimum).length() - meshSize) / meshSize < 0.2);
        if (similarSizedMeshes.length > 3) {
            suggestions.push({
                id: `aesthetic-hierarchy-${mesh.name}-${Date.now()}`,
                type: 'aesthetic',
                title: 'Establish Visual Hierarchy',
                description: `Multiple meshes of similar size (${similarSizedMeshes.length + 1} total) create visual confusion. Consider varying sizes for better hierarchy.`,
                confidence: 0.7,
                impact: 'medium',
                category: 'aesthetic',
                affectedMeshes: [mesh.name, ...similarSizedMeshes.map(m => m.name)],
                estimatedTime: 90
            });
        }
        return suggestions;
    };
    const analyzePerformance = (mesh) => {
        const suggestions = [];
        // Check for high polygon count (simplified check based on mesh type)
        const vertexCount = mesh.getTotalVertices();
        if (vertexCount > 10000) {
            suggestions.push({
                id: `performance-polygons-${mesh.name}-${Date.now()}`,
                type: 'optimization',
                title: 'Optimize Mesh Geometry',
                description: `Mesh "${mesh.name}" has high polygon count (${vertexCount} vertices). Consider mesh simplification for better performance.`,
                confidence: 0.8,
                impact: 'high',
                category: 'performance',
                affectedMeshes: [mesh.name],
                estimatedTime: 180
            });
        }
        // Check for unnecessary materials
        if (mesh.material && mesh.material instanceof PBRMaterial) {
            const hasComplexTextures = mesh.material.albedoTexture || mesh.material.bumpTexture || mesh.material.metallicTexture;
            if (!hasComplexTextures && mesh.material.bumpTexture) {
                suggestions.push({
                    id: `performance-material-${mesh.name}-${Date.now()}`,
                    type: 'optimization',
                    title: 'Simplify Material',
                    description: `Mesh "${mesh.name}" uses PBR material without textures. Consider using StandardMaterial for better performance.`,
                    confidence: 0.6,
                    impact: 'low',
                    category: 'performance',
                    affectedMeshes: [mesh.name],
                    estimatedTime: 30
                });
            }
        }
        return suggestions;
    };
    const calculateDesignMetrics = useCallback((suggestions, appliedCount) => {
        const aestheticSuggestions = suggestions.filter(s => s.category === 'aesthetic');
        const functionalSuggestions = suggestions.filter(s => s.category === 'functional');
        const performanceSuggestions = suggestions.filter(s => s.category === 'performance');
        const aestheticScore = Math.max(0, 100 - (aestheticSuggestions.length * 15));
        const functionalityScore = Math.max(0, 100 - (functionalSuggestions.length * 20));
        const efficiencyScore = Math.max(0, 100 - (performanceSuggestions.length * 25));
        const overallScore = (aestheticScore + functionalityScore + efficiencyScore) / 3;
        const totalSuggestions = suggestions.length;
        return {
            aestheticScore,
            functionalityScore,
            efficiencyScore,
            overallScore,
            suggestionsApplied: appliedCount,
            totalSuggestions
        };
    }, []);
    const runAnalysis = useCallback(async () => {
        if (!scene || isAnalyzing)
            return;
        setIsAnalyzing(true);
        setAnalysisProgress(0);
        try {
            const results = await performDesignAnalysis();
            setSuggestions(results);
            const calculatedMetrics = calculateDesignMetrics(results, appliedSuggestions.length);
            setMetrics(calculatedMetrics);
            // Add to history
            setDesignHistory(prev => [results, ...prev.slice(0, 9)]); // Keep last 10 analyses
            if (onDesignUpdate) {
                onDesignUpdate(calculatedMetrics);
            }
        }
        catch (error) {
            console.error('Design analysis failed:', error);
        }
        finally {
            setIsAnalyzing(false);
            setAnalysisProgress(0);
        }
    }, [scene, isAnalyzing, performDesignAnalysis, calculateDesignMetrics, appliedSuggestions.length, onDesignUpdate]);
    const applySuggestion = useCallback(async (suggestion) => {
        if (onSuggestionApply) {
            onSuggestionApply(suggestion);
        }
        // Mark as applied
        setAppliedSuggestions(prev => [...prev, suggestion.id]);
        // Visual feedback - highlight affected meshes
        suggestion.affectedMeshes.forEach(meshName => {
            const mesh = scene.getMeshByName(meshName);
            if (mesh && mesh instanceof Mesh) {
                // Create highlight layer if it doesn't exist
                let highlightLayer = scene.getHighlightLayerByName('design-highlight');
                if (!highlightLayer) {
                    highlightLayer = new HighlightLayer('design-highlight', scene);
                }
                // Add highlight effect
                highlightLayer.addMesh(mesh, new Color3(0.5, 0.5, 1)); // Blue highlight
                setTimeout(() => {
                    highlightLayer.removeMesh(mesh);
                }, 3000);
            }
        });
        // Update metrics
        if (metrics) {
            const updatedMetrics = calculateDesignMetrics(suggestions, appliedSuggestions.length + 1);
            setMetrics(updatedMetrics);
            if (onDesignUpdate) {
                onDesignUpdate(updatedMetrics);
            }
        }
    }, [scene, onSuggestionApply, metrics, suggestions, appliedSuggestions.length, calculateDesignMetrics, onDesignUpdate]);
    const generateDesign = useCallback(async () => {
        setIsGenerating(true);
        try {
            // Simulate AI design generation
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Generate a few high-impact suggestions
            const generatedSuggestions = [
                {
                    id: `generated-aesthetic-${Date.now()}`,
                    type: 'aesthetic',
                    title: 'AI-Generated Aesthetic Enhancement',
                    description: 'Apply AI-curated color palette and material combination for enhanced visual appeal.',
                    confidence: 0.9,
                    impact: 'high',
                    category: 'aesthetic',
                    affectedMeshes: scene.meshes.filter(m => m instanceof Mesh && m.name && !m.name.includes('ground')).map(m => m.name || '').filter(Boolean),
                    estimatedTime: 180
                },
                {
                    id: `generated-layout-${Date.now()}`,
                    type: 'layout',
                    title: 'AI-Optimized Layout',
                    description: 'Rearrange elements using AI-optimized spatial relationships and visual flow principles.',
                    confidence: 0.85,
                    impact: 'medium',
                    category: 'functional',
                    affectedMeshes: scene.meshes.filter(m => m instanceof Mesh && m.name && !m.name.includes('ground')).map(m => m.name || '').filter(Boolean),
                    estimatedTime: 240
                }
            ];
            setSuggestions(prev => [...generatedSuggestions, ...prev]);
        }
        catch (error) {
            console.error('Design generation failed:', error);
        }
        finally {
            setIsGenerating(false);
        }
    }, [scene]);
    const getImpactIcon = (impact) => {
        switch (impact) {
            case 'high': return _jsx(Zap, { className: "w-4 h-4 text-red-500" });
            case 'medium': return _jsx(Target, { className: "w-4 h-4 text-yellow-500" });
            case 'low': return _jsx(Layers, { className: "w-4 h-4 text-green-500" });
            default: return _jsx(Info, { className: "w-4 h-4 text-blue-500" });
        }
    };
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'aesthetic': return _jsx(Palette, { className: "w-4 h-4 text-purple-500" });
            case 'functional': return _jsx(Target, { className: "w-4 h-4 text-blue-500" });
            case 'performance': return _jsx(Zap, { className: "w-4 h-4 text-green-500" });
            default: return _jsx(Info, { className: "w-4 h-4 text-gray-500" });
        }
    };
    const getTypeColor = (type) => {
        switch (type) {
            case 'layout': return 'bg-blue-500';
            case 'material': return 'bg-purple-500';
            case 'color': return 'bg-pink-500';
            case 'structure': return 'bg-orange-500';
            case 'optimization': return 'bg-green-500';
            case 'aesthetic': return 'bg-indigo-500';
            default: return 'bg-gray-500';
        }
    };
    // Auto-run analysis when component becomes active
    useEffect(() => {
        if (isActive && suggestions.length === 0) {
            runAnalysis();
        }
    }, [isActive, suggestions.length, runAnalysis]);
    if (!isActive)
        return null;
    return (_jsx("div", { className: "fixed top-4 left-1/2 transform -translate-x-1/2 w-[800px] bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50", children: _jsxs(Card, { className: "bg-slate-900 border-slate-700 text-white", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Palette, { className: "w-5 h-5 text-cyan-400" }), "AI Co-Designer"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: generateDesign, disabled: isGenerating, className: "text-xs", children: isGenerating ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "w-3 h-3 mr-1 animate-spin" }), "Generating..."] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "w-3 h-3 mr-1" }), "AI Generate"] })) }), _jsx(Button, { size: "sm", variant: "ghost", onClick: onClose, children: _jsx(XCircle, { className: "w-4 h-4" }) })] })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx(Button, { onClick: runAnalysis, disabled: isAnalyzing, className: "flex-1", size: "sm", children: isAnalyzing ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2 animate-spin" }), "Analyzing..."] })) : (_jsxs(_Fragment, { children: [_jsx(Wand2, { className: "w-4 h-4 mr-2" }), "Run Design Analysis"] })) }) }), isAnalyzing && (_jsxs("div", { className: "space-y-2", children: [_jsx(Progress, { value: analysisProgress, className: "w-full" }), _jsxs("p", { className: "text-xs text-slate-400 text-center", children: ["Analyzing design elements... ", Math.round(analysisProgress), "%"] })] })), metrics && (_jsxs("div", { className: "grid grid-cols-4 gap-2 p-3 bg-slate-800 rounded-lg", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold text-purple-400", children: [Math.round(metrics.aestheticScore), "%"] }), _jsx("div", { className: "text-xs text-slate-400", children: "Aesthetic" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold text-blue-400", children: [Math.round(metrics.functionalityScore), "%"] }), _jsx("div", { className: "text-xs text-slate-400", children: "Functional" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold text-green-400", children: [Math.round(metrics.efficiencyScore), "%"] }), _jsx("div", { className: "text-xs text-slate-400", children: "Performance" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold text-cyan-400", children: [Math.round(metrics.overallScore), "%"] }), _jsx("div", { className: "text-xs text-slate-400", children: "Overall" })] })] })), suggestions.length > 0 && (_jsxs(Tabs, { defaultValue: "suggestions", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsxs(TabsTrigger, { value: "suggestions", className: "text-xs", children: ["Suggestions (", suggestions.length, ")"] }), _jsx(TabsTrigger, { value: "metrics", className: "text-xs", children: "Metrics" }), _jsx(TabsTrigger, { value: "history", className: "text-xs", children: "History" })] }), _jsx(TabsContent, { value: "suggestions", className: "space-y-2", children: _jsx(ScrollArea, { className: "h-96", children: _jsx("div", { className: "space-y-2", children: suggestions.map((suggestion) => (_jsx(Alert, { className: "p-3", children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex items-start gap-2 flex-1", children: [getImpactIcon(suggestion.impact), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("div", { className: `w-2 h-2 rounded-full ${getTypeColor(suggestion.type)}` }), _jsx(Badge, { variant: "outline", className: "text-xs", children: suggestion.type.toUpperCase() }), _jsx(Badge, { variant: "secondary", className: "text-xs", children: suggestion.category }), _jsxs("span", { className: "text-xs text-slate-400", children: [Math.round(suggestion.confidence * 100), "%"] })] }), _jsxs(AlertDescription, { className: "text-sm mb-2", children: [_jsx("strong", { children: suggestion.title }), _jsx("br", {}), suggestion.description] }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsxs("span", { className: "text-xs text-slate-400", children: ["Impact: ", suggestion.impact.toUpperCase()] }), _jsxs("span", { className: "text-xs text-slate-400", children: ["Est. time: ", suggestion.estimatedTime, "s"] }), _jsxs("span", { className: "text-xs text-slate-400", children: ["Affects: ", suggestion.affectedMeshes.length, " mesh(es)"] })] }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => applySuggestion(suggestion), disabled: appliedSuggestions.includes(suggestion.id), className: "text-xs", children: appliedSuggestions.includes(suggestion.id) ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "w-3 h-3 mr-1" }), "Applied"] })) : (_jsxs(_Fragment, { children: [_jsx(Wand2, { className: "w-3 h-3 mr-1" }), "Apply Design"] })) })] })] }) }) }, suggestion.id))) }) }) }), _jsx(TabsContent, { value: "metrics", className: "space-y-3", children: metrics && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Aesthetic Score" }), _jsxs("span", { className: "text-sm font-mono", children: [Math.round(metrics.aestheticScore), "%"] })] }), _jsx(Progress, { value: metrics.aestheticScore, className: "h-2" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Functionality Score" }), _jsxs("span", { className: "text-sm font-mono", children: [Math.round(metrics.functionalityScore), "%"] })] }), _jsx(Progress, { value: metrics.functionalityScore, className: "h-2" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Performance Score" }), _jsxs("span", { className: "text-sm font-mono", children: [Math.round(metrics.efficiencyScore), "%"] })] }), _jsx(Progress, { value: metrics.efficiencyScore, className: "h-2" })] }), _jsx(Separator, {}), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "text-center p-3 bg-slate-800 rounded", children: [_jsx("div", { className: "text-2xl font-bold text-cyan-400", children: metrics.suggestionsApplied }), _jsx("div", { className: "text-xs text-slate-400", children: "Applied" })] }), _jsxs("div", { className: "text-center p-3 bg-slate-800 rounded", children: [_jsx("div", { className: "text-2xl font-bold text-purple-400", children: metrics.totalSuggestions }), _jsx("div", { className: "text-xs text-slate-400", children: "Total" })] })] })] })) }), _jsx(TabsContent, { value: "history", className: "space-y-2", children: _jsx(ScrollArea, { className: "h-96", children: _jsx("div", { className: "space-y-2", children: designHistory.map((history, index) => (_jsxs("div", { className: "p-2 bg-slate-800 rounded text-xs", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsxs("span", { children: ["Analysis #", designHistory.length - index] }), _jsxs("span", { className: "text-slate-400", children: [history.length, " suggestions"] })] }), _jsxs("div", { className: "flex gap-1 flex-wrap", children: [history.slice(0, 5).map((suggestion, i) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: suggestion.type }, i))), history.length > 5 && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["+", history.length - 5] }))] })] }, index))) }) }) })] })), suggestions.length === 0 && !isAnalyzing && (_jsxs("div", { className: "text-center py-8", children: [_jsx(Palette, { className: "w-12 h-12 text-purple-500 mx-auto mb-3" }), _jsx("p", { className: "text-slate-400", children: "No design suggestions available" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Run analysis to discover design improvements" })] }))] })] }) }));
};
export default AICoDesigner;
