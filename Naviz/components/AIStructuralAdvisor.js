import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription } from './ui/alert';
import { Brain, AlertTriangle, CheckCircle, XCircle, Info, Activity, RefreshCw } from 'lucide-react';
import { Mesh, Vector3, PBRMaterial, StandardMaterial, Color3, HighlightLayer } from '@babylonjs/core';
const AIStructuralAdvisor = ({ scene, isActive, onClose, onAnalysisComplete, onRecommendationApply }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analyses, setAnalyses] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [selectedAnalysis, setSelectedAnalysis] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [analysisHistory, setAnalysisHistory] = useState([]);
    const [isRealTimeMode, setIsRealTimeMode] = useState(false);
    const analysisIntervalRef = useRef(null);
    // AI Analysis Engine
    const performStructuralAnalysis = useCallback(async () => {
        const results = [];
        // Filter for actual Mesh instances, not AbstractMesh
        const meshes = scene.meshes.filter((mesh) => {
            return mesh instanceof Mesh &&
                mesh.name !== null &&
                typeof mesh.name === 'string' &&
                !mesh.name.includes('ground');
        });
        // Analyze each mesh for structural issues
        for (let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i];
            setAnalysisProgress((i / meshes.length) * 100);
            // Stress analysis based on mesh properties
            const stressAnalysis = analyzeStress(mesh);
            if (stressAnalysis)
                results.push(stressAnalysis);
            // Load bearing analysis
            const loadAnalysis = analyzeLoadBearing(mesh);
            if (loadAnalysis)
                results.push(loadAnalysis);
            // Material analysis
            const materialAnalysis = analyzeMaterial(mesh);
            if (materialAnalysis)
                results.push(materialAnalysis);
            // Connection analysis
            const connectionAnalysis = analyzeConnections(mesh);
            if (connectionAnalysis)
                results.push(connectionAnalysis);
            // Stability analysis
            const stabilityAnalysis = analyzeStability(mesh);
            if (stabilityAnalysis)
                results.push(stabilityAnalysis);
            // Small delay to show progress
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return results;
    }, [scene]);
    const analyzeStress = (mesh) => {
        const boundingInfo = mesh.getBoundingInfo();
        const dimensions = boundingInfo.boundingBox.maximum.subtract(boundingInfo.boundingBox.minimum);
        const volume = dimensions.x * dimensions.y * dimensions.z; // Calculate volume manually
        const surfaceArea = calculateSurfaceArea(mesh);
        const stressRatio = surfaceArea / volume;
        if (stressRatio > 10) {
            return {
                id: `stress-${mesh.name}-${Date.now()}`,
                type: 'stress',
                severity: stressRatio > 20 ? 'critical' : stressRatio > 15 ? 'high' : 'medium',
                location: mesh.position.clone(),
                description: `High stress concentration detected. Surface area to volume ratio: ${stressRatio.toFixed(2)}`,
                recommendation: 'Consider adding structural reinforcements or redistributing load.',
                confidence: Math.min(0.95, 1 - (stressRatio / 30)),
                affectedMeshes: [mesh.name]
            };
        }
        return null;
    };
    const analyzeLoadBearing = (mesh) => {
        const height = mesh.getBoundingInfo().boundingBox.maximum.y - mesh.getBoundingInfo().boundingBox.minimum.y;
        const baseArea = mesh.getBoundingInfo().boundingBox.maximum.x - mesh.getBoundingInfo().boundingBox.minimum.x;
        const aspectRatio = height / baseArea;
        if (aspectRatio > 5) {
            return {
                id: `load-${mesh.name}-${Date.now()}`,
                type: 'load',
                severity: aspectRatio > 10 ? 'critical' : aspectRatio > 7 ? 'high' : 'medium',
                location: mesh.position.clone(),
                description: `Unstable load-bearing structure. Height to base ratio: ${aspectRatio.toFixed(2)}`,
                recommendation: 'Add lateral supports or increase base dimensions for stability.',
                confidence: Math.min(0.9, 1 - (aspectRatio / 15)),
                affectedMeshes: [mesh.name]
            };
        }
        return null;
    };
    const analyzeMaterial = (mesh) => {
        const material = mesh.material;
        if (!material)
            return null;
        let materialStrength = 1.0;
        if (material instanceof PBRMaterial) {
            materialStrength = 0.8; // PBR materials might be decorative
        }
        else if (material instanceof StandardMaterial) {
            materialStrength = 0.9; // Standard materials are more structural
        }
        if (materialStrength < 0.85) {
            return {
                id: `material-${mesh.name}-${Date.now()}`,
                type: 'material',
                severity: materialStrength < 0.7 ? 'high' : 'medium',
                location: mesh.position.clone(),
                description: `Material may not be suitable for structural use. Strength factor: ${materialStrength.toFixed(2)}`,
                recommendation: 'Consider using structural-grade materials or adding reinforcements.',
                confidence: 0.85,
                affectedMeshes: [mesh.name]
            };
        }
        return null;
    };
    const analyzeConnections = (mesh) => {
        // Filter for actual Mesh instances, not AbstractMesh
        const connectedMeshes = scene.meshes.filter((m) => m instanceof Mesh && m !== mesh && m.position.subtract(mesh.position).length() < 2);
        if (connectedMeshes.length === 0) {
            return {
                id: `connection-${mesh.name}-${Date.now()}`,
                type: 'connection',
                severity: 'medium',
                location: mesh.position.clone(),
                description: 'Isolated structural element detected. No nearby connections found.',
                recommendation: 'Connect to adjacent structural elements for load distribution.',
                confidence: 0.8,
                affectedMeshes: [mesh.name]
            };
        }
        return null;
    };
    const analyzeStability = (mesh) => {
        const boundingInfo = mesh.getBoundingInfo();
        const centerOfMass = boundingInfo.boundingBox.center;
        const baseCenter = new Vector3(centerOfMass.x, boundingInfo.boundingBox.minimum.y, centerOfMass.z);
        const offset = centerOfMass.subtract(baseCenter);
        if (offset.length() > 0.5) {
            return {
                id: `stability-${mesh.name}-${Date.now()}`,
                type: 'stability',
                severity: offset.length() > 1.0 ? 'high' : 'medium',
                location: mesh.position.clone(),
                description: `Center of mass offset detected. Offset distance: ${offset.length().toFixed(2)}`,
                recommendation: 'Redistribute mass or add counterweights to improve stability.',
                confidence: Math.min(0.9, 1 - (offset.length() / 2)),
                affectedMeshes: [mesh.name]
            };
        }
        return null;
    };
    const calculateSurfaceArea = (mesh) => {
        // Simplified surface area calculation
        const boundingInfo = mesh.getBoundingInfo();
        const dimensions = boundingInfo.boundingBox.maximum.subtract(boundingInfo.boundingBox.minimum);
        return 2 * (dimensions.x * dimensions.y + dimensions.x * dimensions.z + dimensions.y * dimensions.z);
    };
    const calculateOverallMetrics = useCallback((analyses) => {
        const criticalCount = analyses.filter(a => a.severity === 'critical').length;
        const highCount = analyses.filter(a => a.severity === 'high').length;
        const mediumCount = analyses.filter(a => a.severity === 'medium').length;
        const totalIssues = analyses.length;
        const overallStability = Math.max(0, 100 - (criticalCount * 30 + highCount * 20 + mediumCount * 10));
        const stressDistribution = Math.max(0, 100 - (criticalCount * 25 + highCount * 15 + mediumCount * 8));
        const loadCapacity = Math.max(0, 100 - (criticalCount * 20 + highCount * 15 + mediumCount * 5));
        const materialEfficiency = Math.max(0, 100 - (criticalCount * 15 + highCount * 10 + mediumCount * 5));
        const connectionIntegrity = Math.max(0, 100 - (criticalCount * 10 + highCount * 8 + mediumCount * 3));
        const safetyFactor = overallStability > 80 ? 2.0 :
            overallStability > 60 ? 1.5 :
                overallStability > 40 ? 1.2 : 1.0;
        return {
            overallStability,
            stressDistribution,
            loadCapacity,
            materialEfficiency,
            connectionIntegrity,
            safetyFactor
        };
    }, []);
    const runAnalysis = useCallback(async () => {
        if (!scene || isAnalyzing)
            return;
        setIsAnalyzing(true);
        setAnalysisProgress(0);
        try {
            const results = await performStructuralAnalysis();
            setAnalyses(results);
            const calculatedMetrics = calculateOverallMetrics(results);
            setMetrics(calculatedMetrics);
            // Add to history
            setAnalysisHistory(prev => [results, ...prev.slice(0, 9)]); // Keep last 10 analyses
            if (onAnalysisComplete) {
                onAnalysisComplete(results);
            }
        }
        catch (error) {
            console.error('Analysis failed:', error);
        }
        finally {
            setIsAnalyzing(false);
            setAnalysisProgress(0);
        }
    }, [scene, isAnalyzing, performStructuralAnalysis, calculateOverallMetrics, onAnalysisComplete]);
    const applyRecommendation = useCallback((analysis) => {
        if (onRecommendationApply) {
            onRecommendationApply(analysis);
        }
        // Visual feedback - highlight affected meshes
        analysis.affectedMeshes.forEach(meshName => {
            const mesh = scene.getMeshByName(meshName);
            if (mesh && mesh instanceof Mesh) {
                // Create highlight layer if it doesn't exist
                let highlightLayer = scene.getHighlightLayerByName('structural-highlight');
                if (!highlightLayer) {
                    highlightLayer = new HighlightLayer('structural-highlight', scene);
                }
                // Add highlight effect
                highlightLayer.addMesh(mesh, new Color3(1, 0.5, 0));
                setTimeout(() => {
                    highlightLayer.removeMesh(mesh);
                }, 3000);
            }
        });
    }, [scene, onRecommendationApply]);
    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'critical': return _jsx(XCircle, { className: "w-4 h-4 text-red-500" });
            case 'high': return _jsx(AlertTriangle, { className: "w-4 h-4 text-orange-500" });
            case 'medium': return _jsx(Info, { className: "w-4 h-4 text-yellow-500" });
            case 'low': return _jsx(CheckCircle, { className: "w-4 h-4 text-green-500" });
            default: return _jsx(Info, { className: "w-4 h-4 text-blue-500" });
        }
    };
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'destructive';
            case 'high': return 'destructive';
            case 'medium': return 'secondary';
            case 'low': return 'outline';
            default: return 'outline';
        }
    };
    // Real-time analysis mode
    useEffect(() => {
        if (isRealTimeMode && isActive) {
            analysisIntervalRef.current = setInterval(() => {
                runAnalysis();
            }, 10000); // Analyze every 10 seconds
        }
        else {
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
                analysisIntervalRef.current = null;
            }
        }
        return () => {
            if (analysisIntervalRef.current) {
                clearInterval(analysisIntervalRef.current);
            }
        };
    }, [isRealTimeMode, isActive, runAnalysis]);
    // Auto-run analysis when component becomes active
    useEffect(() => {
        if (isActive && analyses.length === 0) {
            runAnalysis();
        }
    }, [isActive, analyses.length, runAnalysis]);
    if (!isActive)
        return null;
    return (_jsx("div", { className: "fixed top-4 right-4 w-96 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50", children: _jsxs(Card, { className: "bg-slate-900 border-slate-700 text-white", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "w-5 h-5 text-cyan-400" }), "AI Structural Advisor"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { size: "sm", variant: isRealTimeMode ? "default" : "outline", onClick: () => setIsRealTimeMode(!isRealTimeMode), className: "text-xs", children: [_jsx(Activity, { className: "w-3 h-3 mr-1" }), "Real-time"] }), _jsx(Button, { size: "sm", variant: "ghost", onClick: onClose, children: _jsx(XCircle, { className: "w-4 h-4" }) })] })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsx(Button, { onClick: runAnalysis, disabled: isAnalyzing, className: "flex-1", size: "sm", children: isAnalyzing ? (_jsxs(_Fragment, { children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2 animate-spin" }), "Analyzing..."] })) : (_jsxs(_Fragment, { children: [_jsx(Brain, { className: "w-4 h-4 mr-2" }), "Run Analysis"] })) }) }), isAnalyzing && (_jsxs("div", { className: "space-y-2", children: [_jsx(Progress, { value: analysisProgress, className: "w-full" }), _jsxs("p", { className: "text-xs text-slate-400 text-center", children: ["Analyzing structural integrity... ", Math.round(analysisProgress), "%"] })] })), metrics && (_jsxs("div", { className: "grid grid-cols-2 gap-2 p-3 bg-slate-800 rounded-lg", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold text-cyan-400", children: [Math.round(metrics.overallStability), "%"] }), _jsx("div", { className: "text-xs text-slate-400", children: "Stability" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold text-green-400", children: [metrics.safetyFactor.toFixed(1), "x"] }), _jsx("div", { className: "text-xs text-slate-400", children: "Safety Factor" })] })] })), analyses.length > 0 && (_jsxs(Tabs, { defaultValue: "issues", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsxs(TabsTrigger, { value: "issues", className: "text-xs", children: ["Issues (", analyses.length, ")"] }), _jsx(TabsTrigger, { value: "metrics", className: "text-xs", children: "Metrics" }), _jsx(TabsTrigger, { value: "history", className: "text-xs", children: "History" })] }), _jsx(TabsContent, { value: "issues", className: "space-y-2", children: _jsx(ScrollArea, { className: "h-64", children: _jsx("div", { className: "space-y-2", children: analyses.map((analysis) => (_jsx(Alert, { className: "p-3", children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex items-start gap-2 flex-1", children: [getSeverityIcon(analysis.severity), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Badge, { variant: getSeverityColor(analysis.severity), className: "text-xs", children: analysis.severity.toUpperCase() }), _jsx("span", { className: "text-xs text-slate-400", children: analysis.type })] }), _jsx(AlertDescription, { className: "text-sm mb-2", children: analysis.description }), _jsxs("div", { className: "text-xs text-slate-400 mb-2", children: ["Confidence: ", Math.round(analysis.confidence * 100), "%"] }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => applyRecommendation(analysis), className: "text-xs", children: "Apply Fix" })] })] }) }) }, analysis.id))) }) }) }), _jsx(TabsContent, { value: "metrics", className: "space-y-3", children: metrics && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Stress Distribution" }), _jsxs("span", { className: "text-sm font-mono", children: [Math.round(metrics.stressDistribution), "%"] })] }), _jsx(Progress, { value: metrics.stressDistribution, className: "h-2" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Load Capacity" }), _jsxs("span", { className: "text-sm font-mono", children: [Math.round(metrics.loadCapacity), "%"] })] }), _jsx(Progress, { value: metrics.loadCapacity, className: "h-2" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Material Efficiency" }), _jsxs("span", { className: "text-sm font-mono", children: [Math.round(metrics.materialEfficiency), "%"] })] }), _jsx(Progress, { value: metrics.materialEfficiency, className: "h-2" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm", children: "Connection Integrity" }), _jsxs("span", { className: "text-sm font-mono", children: [Math.round(metrics.connectionIntegrity), "%"] })] }), _jsx(Progress, { value: metrics.connectionIntegrity, className: "h-2" })] })] })) }), _jsx(TabsContent, { value: "history", className: "space-y-2", children: _jsx(ScrollArea, { className: "h-64", children: _jsx("div", { className: "space-y-2", children: analysisHistory.map((history, index) => (_jsxs("div", { className: "p-2 bg-slate-800 rounded text-xs", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsxs("span", { children: ["Analysis #", analysisHistory.length - index] }), _jsxs("span", { className: "text-slate-400", children: [history.length, " issues"] })] }), _jsxs("div", { className: "flex gap-1", children: [history.slice(0, 3).map((analysis, i) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: analysis.severity }, i))), history.length > 3 && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: ["+", history.length - 3] }))] })] }, index))) }) }) })] })), analyses.length === 0 && !isAnalyzing && (_jsxs("div", { className: "text-center py-8", children: [_jsx(CheckCircle, { className: "w-12 h-12 text-green-500 mx-auto mb-3" }), _jsx("p", { className: "text-slate-400", children: "No structural issues detected" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "Run analysis to check for potential problems" })] }))] })] }) }));
};
export default AIStructuralAdvisor;
