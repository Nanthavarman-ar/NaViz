import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as BABYLON from '@babylonjs/core';
import { CostEstimator } from './CostEstimator';
import { BIMManager, BIMElement } from './BIMManager';
import { SimulationManager } from './SimulationManager';
import { FeatureManager, DeviceCapabilities } from './FeatureManager';
import { CostBreakdownSection } from './BabylonWorkspace/ui/CostBreakdownSection';
import styles from './CostEstimatorWrapper.module.css';

interface CostEstimatorWrapperProps {
  scene: BABYLON.Scene;
  selectedMesh: BABYLON.AbstractMesh | null;
  onCostUpdate?: (totalCost: number, breakdown: any) => void;
  bimManager?: BIMManager;
  simulationManager?: SimulationManager;
}

interface CostState {
  totalCost: number;
  breakdown: any | null;
  selectedElement: BIMElement | null;
  isCalculating: boolean;
  error: string | null;
}

const CostEstimatorWrapper: React.FC<CostEstimatorWrapperProps> = ({
  scene,
  selectedMesh,
  onCostUpdate,
  bimManager: externalBimManager,
  simulationManager: externalSimulationManager
}) => {
  // Helper functions for element type determination
  const determineElementTypeFallback = (name: string): BIMElement['type'] => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('wall')) return 'wall';
    if (nameLower.includes('floor')) return 'floor';
    if (nameLower.includes('ceiling')) return 'ceiling';
    if (nameLower.includes('door')) return 'door';
    if (nameLower.includes('window')) return 'window';
    if (nameLower.includes('beam')) return 'beam';
    if (nameLower.includes('column')) return 'column';
    if (nameLower.includes('roof')) return 'roof';
    if (nameLower.includes('slab')) return 'slab';
    return 'wall'; // Default fallback
  };

  const determineElementCategoryFallback = (type: BIMElement['type']): BIMElement['category'] => {
    const categoryMap: Record<BIMElement['type'], BIMElement['category']> = {
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

  const getDefaultMaterialForTypeFallback = (type: string): string => {
    const materialMap: Record<string, string> = {
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
  const costEstimatorRef = useRef<CostEstimator | null>(null);
  const bimManagerRef = useRef<BIMManager | null>(null);
  const simulationManagerRef = useRef<SimulationManager | null>(null);

  const [costState, setCostState] = useState<CostState>({
    totalCost: 0,
    breakdown: null,
    selectedElement: null,
    isCalculating: false,
    error: null
  });

  const [region, setRegion] = useState<string>('US_East');
  const [budget, setBudget] = useState<number>(100000);

  // Model-wide cost data for when no element is selected
  const [modelCostData, setModelCostData] = useState<{
    total: number;
    labor: number;
    materials: number;
    overhead: number;
    elements: Array<{ id: string; name: string; cost: number }>;
  } | null>(null);

  // Initialize managers and cost estimator
  useEffect(() => {
    try {
      // Create FeatureManager with basic device capabilities
      const deviceCapabilities: DeviceCapabilities = {
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
      const engine = scene.getEngine() as BABYLON.Engine;
      const bimManager = externalBimManager || new BIMManager(engine, scene);
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
    } catch (error) {
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

  // Fetch model-wide cost data when BIM manager is available and region changes
  useEffect(() => {
    if (bimManagerRef.current) {
      const models = bimManagerRef.current.getAllModels();
      if (models.length > 0) {
        try {
          // Get the first available model ID (or use the first one)
          const modelId = models[0].id;
          const costData = bimManagerRef.current.getCostDisplayData(modelId, region);
          setModelCostData(costData);
        } catch (error) {
          console.error('Failed to fetch model cost data:', error);
          setModelCostData(null);
        }
      } else {
        setModelCostData(null);
      }
    } else {
      setModelCostData(null);
    }
  }, [region, bimManagerRef.current]);

  // Validate BIM element data
  const validateBIMElement = (element: BIMElement): boolean => {
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
  const calculateMeshCost = useCallback(async (mesh: BABYLON.AbstractMesh) => {
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
      let element: BIMElement | null = null;

      if (mesh.metadata?.elementId) {
        // If mesh has BIM element metadata
        element = bimManagerRef.current.getElementById(mesh.metadata.elementId);
        if (!element) {
          throw new Error(`BIM element with ID ${mesh.metadata.elementId} not found`);
        }
      } else {
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
      const estimate = costEstimatorRef.current!.calculateElementCost(element, quantity, region);

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
      } else {
        throw new Error('Cost estimation returned invalid result');
      }
    } catch (error) {
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
  const calculateElementQuantity = (element: BIMElement, mesh: BABYLON.AbstractMesh): number => {
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
    } else {
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
  const handleBudgetChange = (newBudget: number) => {
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
  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    // Recalculate if we have a selected element
    if (selectedMesh) {
      calculateMeshCost(selectedMesh);
    }
  };

  const getBudgetStatus = () => {
    if (budget <= 0) return { status: 'no-budget', color: '#666', message: 'No budget set' };

    const percentage = (costState.totalCost / budget) * 100;
    if (percentage > 100) return { status: 'over', color: '#ff4444', message: 'Over Budget!' };
    if (percentage > 90) return { status: 'danger', color: '#ffaa00', message: 'Approaching Limit' };
    if (percentage > 75) return { status: 'warning', color: '#ffaa00', message: 'Getting High' };
    return { status: 'good', color: '#44aa44', message: 'Within Budget' };
  };

  const getProgressBarClass = (status: string) => {
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

  return (
    <div className={styles.costEstimatorContainer}>
      <h3 className={styles.costEstimatorHeader}>
        💰 Cost Estimator
        {costState.isCalculating && (
          <div className={styles.loadingSpinner}></div>
        )}
      </h3>

      {costState.error && (
        <div className={styles.errorMessage}>
          ⚠️ {costState.error}
        </div>
      )}

      {/* Show model-wide cost breakdown when no element is selected */}
      {!selectedMesh && modelCostData && (
        <div className={styles.modelCostSection}>
          <CostBreakdownSection costBreakdown={modelCostData} />
        </div>
      )}

      {/* Budget Settings */}
      <div className={styles.budgetSettings}>
        <div className={styles.budgetSettingRow}>
          <label htmlFor="budget-input" className={styles.budgetSettingLabel}>Project Budget:</label>
          <input
            id="budget-input"
            type="number"
            value={budget}
            onChange={(e) => handleBudgetChange(Number(e.target.value))}
            className={styles.budgetInput}
            min="0"
            step="1000"
            title="Project Budget"
            placeholder="Enter budget"
          />
        </div>

        <div className={styles.budgetSettingRow}>
          <label htmlFor="region-select" className={styles.budgetSettingLabel}>Region:</label>
          <select
            id="region-select"
            value={region}
            onChange={(e) => handleRegionChange(e.target.value)}
            className={styles.regionSelect}
            title="Select Region"
          >
            <option value="US_East">US East</option>
            <option value="US_West">US West</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
          </select>
        </div>
      </div>

      {/* Cost Display */}
      {costState.selectedElement && (
        <div className={styles.elementInfo}>
          <div className={styles.elementName}>
            Selected: {costState.selectedElement.name}
          </div>
          <div className={styles.elementDetails}>
            Type: {costState.selectedElement.type} | Material: {costState.selectedElement.material}
          </div>
        </div>
      )}

      {/* Budget Status */}
      {budget > 0 && (
        <div className={styles.budgetStatus}>
          <div className={styles.budgetStatusRow}>
            <span>Budget Status:</span>
            <span className={
              budgetStatus.status === 'over' ? styles.budgetStatusOver :
              budgetStatus.status === 'warning' || budgetStatus.status === 'danger' ? styles.budgetStatusWarning :
              styles.budgetStatusGood
            }>
              {budgetStatus.message}
            </span>
          </div>
          <div className={styles.budgetProgressBarContainer}>
            <div
              className={`${styles.budgetProgressBar} ${styles[getProgressBarClass(budgetStatus.status)]}`}
              style={{ width: `${Math.min((costState.totalCost / budget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Total Cost Display */}
      <div className={styles.totalCostContainer}>
        <span className={styles.totalCostLabel}>
          {costState.selectedElement ? 'Element Cost:' : 'Total Cost:'}
        </span>
        <span className={styles.totalCostValue}>
          ${costState.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Cost Breakdown */}
      {costState.breakdown && (
        <div className={styles.costBreakdown}>
          <h4 className={styles.breakdownHeader}>Cost Breakdown</h4>
          <ul className={styles.breakdownList}>
            <li className={styles.breakdownItem}>
              <span>Material:</span>
              <span>${costState.breakdown.material.toLocaleString()}</span>
            </li>
            <li className={styles.breakdownItem}>
              <span>Labor:</span>
              <span>${costState.breakdown.labor.toLocaleString()}</span>
            </li>
            <li className={styles.breakdownItem}>
              <span>Equipment:</span>
              <span>${costState.breakdown.equipment.toLocaleString()}</span>
            </li>
            <li className={styles.breakdownItem}>
              <span>Overhead:</span>
              <span>${costState.breakdown.overhead.toLocaleString()}</span>
            </li>
          </ul>
        </div>
      )}

      {/* No selection message */}
      {!selectedMesh && !modelCostData && !costState.isCalculating && (
        <div className={styles.noSelectionMessage}>
          Select a mesh to see cost estimate or load a BIM model for project costs
        </div>
      )}
    </div>
  );
};

export default CostEstimatorWrapper;
