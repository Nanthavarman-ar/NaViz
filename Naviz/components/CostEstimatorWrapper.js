import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback } from 'react';
import * as BABYLON from '@babylonjs/core';
import { CostEstimator } from './CostEstimator';
import { BIMManager } from './BIMManager';
import { SimulationManager } from './SimulationManager';
import { FeatureManager } from './FeatureManager';
import styles from './CostEstimatorWrapper.module.css';
const CostEstimatorWrapper = ({ scene, selectedMesh, onCostUpdate, bimManager: externalBimManager, simulationManager: externalSimulationManager }) => {
    // Helper functions for element type determination
    const determineElementTypeFallback = (name) => {
        const nameLower = name.toLowerCase();
        if (nameLower.includes('wall'))
            return 'wall';
        if (nameLower.includes('floor'))
            return 'floor';
        if (nameLower.includes('ceiling'))
            return 'ceiling';
        if (nameLower.includes('door'))
            return 'door';
        if (nameLower.includes('window'))
            return 'window';
        if (nameLower.includes('beam'))
            return 'beam';
        if (nameLower.includes('column'))
            return 'column';
        if (nameLower.includes('roof'))
            return 'roof';
        if (nameLower.includes('slab'))
            return 'slab';
        return 'wall'; // Default fallback
    };
    const determineElementCategoryFallback = (type) => {
        const categoryMap = {
            wall: 'Architecture',
            floor: 'Architecture',
            ceiling: 'Architecture',
            door: 'Architecture',
            window: 'Architecture',
            beam: 'Structure',
            column: 'Structure',
            roof: 'Architecture',
            slab: 'Architecture',
            duct: 'MEP',
            pipe: 'MEP',
            cable: 'MEP',
            fixture: 'Interior'
        };
        return categoryMap[type] || 'Architecture';
    };
    const getDefaultMaterialForTypeFallback = (type) => {
        const materialMap = {
            wall: 'concrete_standard',
            floor: 'concrete_standard',
            ceiling: 'concrete_standard',
            door: 'wood_sustainable',
            window: 'glass_standard',
            beam: 'steel_standard',
            column: 'steel_standard',
            roof: 'concrete_standard',
            slab: 'concrete_standard'
        };
        return materialMap[type] || 'concrete_standard';
    };
    const costEstimatorRef = useRef(null);
    const bimManagerRef = useRef(null);
    const simulationManagerRef = useRef(null);
    const [costState, setCostState] = useState({
        totalCost: 0,
        breakdown: null,
        selectedElement: null,
        isCalculating: false,
        error: null
    });
    const [region, setRegion] = useState('US_East');
    const [budget, setBudget] = useState(100000);
    // Initialize managers and cost estimator
    useEffect(() => {
        try {
            // Create FeatureManager with basic device capabilities
            const deviceCapabilities = {
                webgl: true,
                webgl2: true,
                webxr: false,
                webrtc: true,
                webassembly: true,
                gpuMemory: 1024, // MB
                cpuCores: 4,
                ram: 8192, // MB
                networkType: 'fast',
                touchEnabled: false,
                mobile: false
            };
            const featureManager = new FeatureManager(deviceCapabilities);
            // Use external managers if provided, otherwise create new ones
            // Cast scene.getEngine() to Engine to satisfy type requirements
            const engine = scene.getEngine();
            const bimManager = externalBimManager || new BIMManager(engine, scene, featureManager);
            const simulationManager = externalSimulationManager || new SimulationManager(engine, scene, featureManager);
            bimManagerRef.current = bimManager;
            simulationManagerRef.current = simulationManager;
            // Instantiate CostEstimator with dependencies
            costEstimatorRef.current = new CostEstimator(bimManager, simulationManager);
            // Set budget if specified
            if (budget > 0) {
                costEstimatorRef.current.setClientBudget(budget);
            }
            console.log('CostEstimator initialized successfully');
        }
        catch (error) {
            console.error('Failed to initialize CostEstimator:', error);
            setCostState(prev => ({
                ...prev,
                error: 'Failed to initialize cost estimation system'
            }));
        }
        return () => {
            // Dispose resources on unmount
            if (costEstimatorRef.current) {
                costEstimatorRef.current.dispose();
                costEstimatorRef.current = null;
            }
            // Only dispose if we created them
            if (!externalBimManager && bimManagerRef.current) {
                // BIMManager dispose method if available
            }
            if (!externalSimulationManager && simulationManagerRef.current) {
                // SimulationManager dispose method if available
            }
        };
    }, [scene, externalBimManager, externalSimulationManager, budget]);
    // Validate BIM element data
    const validateBIMElement = (element) => {
        if (!element.id || !element.name || !element.type) {
            console.warn('Invalid BIM element: missing required properties', element);
            return false;
        }
        if (!element.position || !element.rotation || !element.scale) {
            console.warn('Invalid BIM element: missing transform properties', element);
            return false;
        }
        return true;
    };
    // Enhanced error handling for cost calculations
    const calculateMeshCost = useCallback(async (mesh) => {
        if (!costEstimatorRef.current || !bimManagerRef.current) {
            setCostState(prev => ({
                ...prev,
                error: 'Cost estimation system not initialized'
            }));
            return;
        }
        if (!mesh) {
            setCostState(prev => ({
                ...prev,
                error: 'No mesh selected for cost calculation'
            }));
            return;
        }
        setCostState(prev => ({ ...prev, isCalculating: true, error: null }));
        try {
            // Extract element information from mesh metadata or create from mesh properties
            let element = null;
            if (mesh.metadata?.elementId) {
                // If mesh has BIM element metadata
                element = bimManagerRef.current.getElementById(mesh.metadata.elementId);
                if (!element) {
                    throw new Error(`BIM element with ID ${mesh.metadata.elementId} not found`);
                }
            }
            else {
                // Create a basic BIM element from mesh properties
                const boundingInfo = mesh.getBoundingInfo();
                const size = boundingInfo.maximum.subtract(boundingInfo.minimum);
                // Validate mesh geometry
                if (size.x <= 0 || size.y <= 0 || size.z <= 0) {
                    throw new Error('Invalid mesh geometry: zero or negative dimensions');
                }
                // Fallback simple element type determination
                const elementType = determineElementTypeFallback(mesh.name);
                const elementProperties = mesh.metadata || {};
                element = {
                    id: mesh.id,
                    name: mesh.name || `Element_${mesh.id}`,
                    type: elementType,
                    category: determineElementCategoryFallback(elementType),
                    position: new BABYLON.Vector3(mesh.position.x, mesh.position.y, mesh.position.z),
                    rotation: new BABYLON.Vector3(mesh.rotation.x, mesh.rotation.y, mesh.rotation.z),
                    scale: new BABYLON.Vector3(mesh.scaling.x, mesh.scaling.y, mesh.scaling.z),
                    material: mesh.metadata?.material || getDefaultMaterialForTypeFallback(elementType),
                    properties: elementProperties,
                    visible: mesh.isVisible ?? true
                };
            }
            // Validate the created/retrieved element
            if (!element || !validateBIMElement(element)) {
                throw new Error('Invalid BIM element data');
            }
            // Calculate quantity based on element geometry
            const quantity = calculateElementQuantity(element, mesh);
            // Validate quantity
            if (quantity <= 0 || !isFinite(quantity)) {
                throw new Error('Invalid quantity calculated for element');
            }
            // Calculate cost estimate
            const estimate = costEstimatorRef.current.calculateElementCost(element, quantity, region);
            if (estimate && estimate.costBreakdown) {
                const newState = {
                    totalCost: estimate.costBreakdown.total,
                    breakdown: estimate.costBreakdown,
                    selectedElement: element,
                    isCalculating: false,
                    error: null
                };
                setCostState(prev => newState);
                // Notify parent component
                if (onCostUpdate) {
                    onCostUpdate(estimate.costBreakdown.total, estimate.costBreakdown);
                }
            }
            else {
                throw new Error('Cost estimation returned invalid result');
            }
        }
        catch (error) {
            console.error('Error calculating mesh cost:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error during cost calculation';
            setCostState(prev => ({
                ...prev,
                isCalculating: false,
                error: errorMessage
            }));
        }
    }, [region, onCostUpdate]);
    // Calculate element quantity from mesh geometry
    const calculateElementQuantity = (element, mesh) => {
        const boundingInfo = mesh.getBoundingInfo();
        const size = boundingInfo.maximum.subtract(boundingInfo.minimum);
        switch (element.type) {
            case 'wall':
                return size.y * size.z; // Height * Width (area for wall)
            case 'floor':
            case 'ceiling':
                return size.x * size.z; // Length * Width (area)
            case 'door':
            case 'window':
                return size.x * size.y; // Width * Height (area)
            case 'beam':
            case 'column':
                return size.x * size.y * size.z; // Volume
            default:
                // For generic elements, use volume
                return size.x * size.y * size.z;
        }
    };
    // Handle mesh selection changes
    useEffect(() => {
        if (selectedMesh) {
            calculateMeshCost(selectedMesh);
        }
        else {
            setCostState(prev => ({
                ...prev,
                totalCost: 0,
                breakdown: null,
                selectedElement: null,
                error: null
            }));
        }
    }, [selectedMesh, calculateMeshCost]);
    // Handle budget changes
    const handleBudgetChange = (newBudget) => {
        setBudget(newBudget);
        if (costEstimatorRef.current) {
            costEstimatorRef.current.setClientBudget(newBudget);
            // Recalculate if we have a selected element
            if (selectedMesh) {
                calculateMeshCost(selectedMesh);
            }
        }
    };
    // Handle region changes
    const handleRegionChange = (newRegion) => {
        setRegion(newRegion);
        // Recalculate if we have a selected element
        if (selectedMesh) {
            calculateMeshCost(selectedMesh);
        }
    };
    const getBudgetStatus = () => {
        if (budget <= 0)
            return { status: 'no-budget', color: '#666', message: 'No budget set' };
        const percentage = (costState.totalCost / budget) * 100;
        if (percentage > 100)
            return { status: 'over', color: '#ff4444', message: 'Over Budget!' };
        if (percentage > 90)
            return { status: 'danger', color: '#ffaa00', message: 'Approaching Limit' };
        if (percentage > 75)
            return { status: 'warning', color: '#ffaa00', message: 'Getting High' };
        return { status: 'good', color: '#44aa44', message: 'Within Budget' };
    };
    const getProgressBarClass = (status) => {
        switch (status) {
            case 'over':
                return 'progressBarRed';
            case 'warning':
            case 'danger':
                return 'progressBarYellow';
            case 'good':
                return 'progressBarGreen';
            default:
                return 'progressBarGreen';
        }
    };
    const budgetStatus = getBudgetStatus();
    return (_jsxs("div", { className: styles.costEstimatorContainer, children: [_jsxs("h3", { className: styles.costEstimatorHeader, children: ["\uD83D\uDCB0 Cost Estimator", costState.isCalculating && (_jsx("div", { className: styles.loadingSpinner }))] }), costState.error && (_jsxs("div", { className: styles.errorMessage, children: ["\u26A0\uFE0F ", costState.error] })), _jsxs("div", { className: styles.budgetSettings, children: [_jsxs("div", { className: styles.budgetSettingRow, children: [_jsx("label", { htmlFor: "budget-input", className: styles.budgetSettingLabel, children: "Project Budget:" }), _jsx("input", { id: "budget-input", type: "number", value: budget, onChange: (e) => handleBudgetChange(Number(e.target.value)), className: styles.budgetInput, min: "0", step: "1000", title: "Project Budget", placeholder: "Enter budget" })] }), _jsxs("div", { className: styles.budgetSettingRow, children: [_jsx("label", { htmlFor: "region-select", className: styles.budgetSettingLabel, children: "Region:" }), _jsxs("select", { id: "region-select", value: region, onChange: (e) => handleRegionChange(e.target.value), className: styles.regionSelect, title: "Select Region", children: [_jsx("option", { value: "US_East", children: "US East" }), _jsx("option", { value: "US_West", children: "US West" }), _jsx("option", { value: "Europe", children: "Europe" }), _jsx("option", { value: "Asia", children: "Asia" })] })] })] }), costState.selectedElement && (_jsxs("div", { className: styles.elementInfo, children: [_jsxs("div", { className: styles.elementName, children: ["Selected: ", costState.selectedElement.name] }), _jsxs("div", { className: styles.elementDetails, children: ["Type: ", costState.selectedElement.type, " | Material: ", costState.selectedElement.material] })] })), budget > 0 && (_jsxs("div", { className: styles.budgetStatus, children: [_jsxs("div", { className: styles.budgetStatusRow, children: [_jsx("span", { children: "Budget Status:" }), _jsx("span", { className: budgetStatus.status === 'over' ? styles.budgetStatusOver :
                                    budgetStatus.status === 'warning' || budgetStatus.status === 'danger' ? styles.budgetStatusWarning :
                                        styles.budgetStatusGood, children: budgetStatus.message })] }), _jsx("div", { className: styles.budgetProgressBarContainer, children: _jsx("div", { className: `${styles.budgetProgressBar} ${styles[getProgressBarClass(budgetStatus.status)]}`, style: { width: `${Math.min((costState.totalCost / budget) * 100, 100)}%` } }) })] })), _jsxs("div", { className: styles.totalCostContainer, children: [_jsx("span", { className: styles.totalCostLabel, children: costState.selectedElement ? 'Element Cost:' : 'Total Cost:' }), _jsxs("span", { className: styles.totalCostValue, children: ["$", costState.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })] })] }), costState.breakdown && (_jsxs("div", { className: styles.costBreakdown, children: [_jsx("h4", { className: styles.breakdownHeader, children: "Cost Breakdown" }), _jsxs("ul", { className: styles.breakdownList, children: [_jsxs("li", { className: styles.breakdownItem, children: [_jsx("span", { children: "Material:" }), _jsxs("span", { children: ["$", costState.breakdown.material.toLocaleString()] })] }), _jsxs("li", { className: styles.breakdownItem, children: [_jsx("span", { children: "Labor:" }), _jsxs("span", { children: ["$", costState.breakdown.labor.toLocaleString()] })] }), _jsxs("li", { className: styles.breakdownItem, children: [_jsx("span", { children: "Equipment:" }), _jsxs("span", { children: ["$", costState.breakdown.equipment.toLocaleString()] })] }), _jsxs("li", { className: styles.breakdownItem, children: [_jsx("span", { children: "Overhead:" }), _jsxs("span", { children: ["$", costState.breakdown.overhead.toLocaleString()] })] })] })] })), !selectedMesh && !costState.isCalculating && (_jsx("div", { className: styles.noSelectionMessage, children: "Select a mesh to see cost estimate" }))] }));
};
export default CostEstimatorWrapper;
