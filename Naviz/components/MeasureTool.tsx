import React, { useState, useEffect, useRef } from 'react';
import { Engine, Scene, Mesh, Vector3, MeshBuilder, StandardMaterial, Color3, LinesMesh } from '@babylonjs/core';

interface MeasureToolProps {
  scene: Scene;
  engine: Engine;
  isActive: boolean;
  onMeasurementComplete?: (measurement: Measurement) => void;
}

interface Measurement {
  id: string;
  type: 'distance' | 'area' | 'angle' | 'length' | 'breadth' | 'depth' | 'volume' | 'circumference' | 'radius';
  points: Vector3[];
  value: number;
  unit: 'meters' | 'feet' | 'inches';
  label: string;
}

interface MeasurementPoint {
  position: Vector3;
  mesh: Mesh;
}

const MeasureTool: React.FC<MeasureToolProps> = ({
  scene,
  engine,
  isActive,
  onMeasurementComplete
}) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [currentPoints, setCurrentPoints] = useState<MeasurementPoint[]>([]);
  const [measurementMode, setMeasurementMode] = useState<'distance' | 'area' | 'angle' | 'length' | 'breadth' | 'depth' | 'volume' | 'circumference' | 'radius'>('distance');
  const [unit, setUnit] = useState<'meters' | 'feet' | 'inches'>('meters');
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [previewLine, setPreviewLine] = useState<LinesMesh | null>(null);

  const measurementIdCounter = useRef(0);

  useEffect(() => {
    if (isActive) {
      setupMouseEvents();
    } else {
      cleanupMouseEvents();
      clearPreview();
    }

    return () => {
      cleanupMouseEvents();
      clearPreview();
    };
  }, [isActive, measurementMode]);

  const setupMouseEvents = () => {
    const canvas = engine.getRenderingCanvas();
    if (!canvas) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!isActive || event.button !== 0) return; // Only left click

      const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
      if (pickInfo.hit) {
        addMeasurementPoint(pickInfo.pickedPoint!);
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);

    // Store cleanup function
    (canvas as any)._measureToolCleanup = () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  };

  const cleanupMouseEvents = () => {
    const canvas = engine.getRenderingCanvas();
    if (canvas && (canvas as any)._measureToolCleanup) {
      (canvas as any)._measureToolCleanup();
    }
  };

  const addMeasurementPoint = (position: Vector3) => {
    // Create visual point marker
    const pointMesh = MeshBuilder.CreateSphere(`measure_point_${currentPoints.length}`, { diameter: 0.1 }, scene);
    pointMesh.position = position;

    const material = new StandardMaterial(`point_mat_${currentPoints.length}`, scene);
    material.diffuseColor = new Color3(1, 0, 0);
    material.emissiveColor = new Color3(0.5, 0, 0);
    pointMesh.material = material;

    const newPoint: MeasurementPoint = {
      position,
      mesh: pointMesh
    };

    const updatedPoints = [...currentPoints, newPoint];
    setCurrentPoints(updatedPoints);

    // Update preview line
    updatePreviewLine(updatedPoints);

    // Check if measurement is complete
    if ((measurementMode === 'distance' || measurementMode === 'length' || measurementMode === 'breadth' || measurementMode === 'depth') && updatedPoints.length === 2) {
      completeMeasurement(updatedPoints);
    } else if (measurementMode === 'area' && updatedPoints.length >= 3) {
      // For area, user can add more points or complete manually
      setIsMeasuring(true);
    } else if (measurementMode === 'angle' && updatedPoints.length === 3) {
      completeMeasurement(updatedPoints);
    } else if ((measurementMode === 'circumference' || measurementMode === 'radius') && updatedPoints.length === 2) {
      completeMeasurement(updatedPoints);
    } else if (measurementMode === 'volume' && updatedPoints.length === 8) {
      completeMeasurement(updatedPoints);
    }
  };

  const updatePreviewLine = (points: MeasurementPoint[]) => {
    clearPreview();

    if (points.length < 2) return;

    const positions: Vector3[] = points.map(p => p.position);

    // Add current mouse position for preview
    const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
    if (pickInfo.hit && measurementMode === 'area' && points.length >= 2) {
      positions.push(pickInfo.pickedPoint!);
    }

    const lines = MeshBuilder.CreateLines('preview_line', {
      points: positions,
      updatable: true
    }, scene);

    const material = new StandardMaterial('preview_mat', scene);
    material.diffuseColor = new Color3(1, 1, 0);
    material.alpha = 0.7;
    lines.material = material;

    setPreviewLine(lines);
  };

  const clearPreview = () => {
    if (previewLine) {
      previewLine.dispose();
      setPreviewLine(null);
    }
  };

  const completeMeasurement = (points: MeasurementPoint[]) => {
    const measurement = createMeasurement(points);
    setMeasurements(prev => [...prev, measurement]);

    // Clear current points and preview
    currentPoints.forEach(point => point.mesh.dispose());
    setCurrentPoints([]);
    clearPreview();
    setIsMeasuring(false);

    if (onMeasurementComplete) {
      onMeasurementComplete(measurement);
    }
  };

  const createMeasurement = (points: MeasurementPoint[]): Measurement => {
    const id = `measurement_${measurementIdCounter.current++}`;
    let value = 0;
    let label = '';

    if (measurementMode === 'distance' && points.length === 2) {
      value = Vector3.Distance(points[0].position, points[1].position);
      label = `${value.toFixed(3)} ${unit}`;

      // Create permanent measurement line
      const lines = MeshBuilder.CreateLines(`${id}_line`, {
        points: points.map(p => p.position)
      }, scene);

      const material = new StandardMaterial(`${id}_mat`, scene);
      material.diffuseColor = new Color3(0, 1, 0);
      lines.material = material;

      // Add measurement label (simplified - just console for now)
      console.log(`Distance measurement: ${label}`);

    } else if (measurementMode === 'area' && points.length >= 3) {
      // Calculate area using polygon area formula
      value = calculatePolygonArea(points.map(p => p.position));
      label = `${value.toFixed(3)} ${unit}²`;

      // Create area outline using lines
      const areaPoints = [...points.map(p => p.position), points[0].position]; // Close the polygon
      const areaLines = MeshBuilder.CreateLines(`${id}_area`, {
        points: areaPoints
      }, scene);

      const material = new StandardMaterial(`${id}_mat`, scene);
      material.diffuseColor = new Color3(0, 0, 1);
      material.alpha = 0.8;
      areaLines.material = material;

      console.log(`Area measurement: ${label}`);

    } else if (measurementMode === 'angle' && points.length === 3) {
      // Calculate angle at the middle point
      const v1 = points[0].position.subtract(points[1].position);
      const v2 = points[2].position.subtract(points[1].position);
      const normal = v1.cross(v2).normalize();
      value = Vector3.GetAngleBetweenVectors(v1, v2, normal) * 180 / Math.PI;
      label = `${value.toFixed(1)}°`;

      console.log(`Angle measurement: ${label}`);

    } else if ((measurementMode === 'length' || measurementMode === 'breadth' || measurementMode === 'depth') && points.length === 2) {
      value = Vector3.Distance(points[0].position, points[1].position);
      label = `${value.toFixed(3)} ${unit}`;

      // Create permanent measurement line
      const lines = MeshBuilder.CreateLines(`${id}_line`, {
        points: points.map(p => p.position)
      }, scene);

      const material = new StandardMaterial(`${id}_mat`, scene);
      material.diffuseColor = new Color3(0, 1, 0);
      lines.material = material;

      console.log(`${measurementMode} measurement: ${label}`);

    } else if ((measurementMode === 'circumference' || measurementMode === 'radius') && points.length === 2) {
      const radius = Vector3.Distance(points[0].position, points[1].position);
      if (measurementMode === 'radius') {
        value = radius;
        label = `${value.toFixed(3)} ${unit}`;
      } else {
        value = 2 * Math.PI * radius;
        label = `${value.toFixed(3)} ${unit}`;
      }

      // Create permanent measurement line
      const lines = MeshBuilder.CreateLines(`${id}_line`, {
        points: points.map(p => p.position)
      }, scene);

      const material = new StandardMaterial(`${id}_mat`, scene);
      material.diffuseColor = new Color3(0, 1, 0);
      lines.material = material;

      console.log(`${measurementMode} measurement: ${label}`);

    } else if (measurementMode === 'volume' && points.length === 8) {
      // Calculate volume of bounding box
      value = calculateBoundingBoxVolume(points.map(p => p.position));
      label = `${value.toFixed(3)} ${unit}³`;

      // Create bounding box outline
      const boxLines = createBoundingBoxLines(points.map(p => p.position), scene, id);
      const material = new StandardMaterial(`${id}_mat`, scene);
      material.diffuseColor = new Color3(1, 0, 1);
      material.alpha = 0.8;
      boxLines.forEach(line => line.material = material);

      console.log(`Volume measurement: ${label}`);
    }

    return {
      id,
      type: measurementMode,
      points: points.map(p => p.position),
      value,
      unit,
      label
    };
  };

  const calculatePolygonArea = (points: Vector3[]): number => {
    if (points.length < 3) return 0;

    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].z;
      area -= points[j].x * points[i].z;
    }
    area = Math.abs(area) / 2;
    return area;
  };

  const calculateBoundingBoxVolume = (points: Vector3[]): number => {
    if (points.length < 8) return 0;

    // Find min and max coordinates
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    points.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
      minZ = Math.min(minZ, point.z);
      maxZ = Math.max(maxZ, point.z);
    });

    const width = maxX - minX;
    const height = maxY - minY;
    const depth = maxZ - minZ;

    return width * height * depth;
  };

  const createBoundingBoxLines = (points: Vector3[], scene: Scene, id: string): LinesMesh[] => {
    if (points.length < 8) return [];

    // Find min and max coordinates
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    points.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
      minZ = Math.min(minZ, point.z);
      maxZ = Math.max(maxZ, point.z);
    });

    // Create the 8 corners of the bounding box
    const corners = [
      new Vector3(minX, minY, minZ),
      new Vector3(maxX, minY, minZ),
      new Vector3(maxX, maxY, minZ),
      new Vector3(minX, maxY, minZ),
      new Vector3(minX, minY, maxZ),
      new Vector3(maxX, minY, maxZ),
      new Vector3(maxX, maxY, maxZ),
      new Vector3(minX, maxY, maxZ)
    ];

    // Create lines for the bounding box edges
    const lines: LinesMesh[] = [];

    // Bottom face
    lines.push(MeshBuilder.CreateLines(`${id}_bottom`, {
      points: [corners[0], corners[1], corners[2], corners[3], corners[0]]
    }, scene));

    // Top face
    lines.push(MeshBuilder.CreateLines(`${id}_top`, {
      points: [corners[4], corners[5], corners[6], corners[7], corners[4]]
    }, scene));

    // Vertical edges
    lines.push(MeshBuilder.CreateLines(`${id}_vert1`, { points: [corners[0], corners[4]] }, scene));
    lines.push(MeshBuilder.CreateLines(`${id}_vert2`, { points: [corners[1], corners[5]] }, scene));
    lines.push(MeshBuilder.CreateLines(`${id}_vert3`, { points: [corners[2], corners[6]] }, scene));
    lines.push(MeshBuilder.CreateLines(`${id}_vert4`, { points: [corners[3], corners[7]] }, scene));

    return lines;
  };

  const clearAllMeasurements = () => {
    // Dispose of all measurement meshes
    measurements.forEach(measurement => {
      const meshes = scene.meshes.filter(mesh =>
        mesh.name.startsWith(`${measurement.id}`)
      );
      meshes.forEach(mesh => mesh.dispose());
    });

    setMeasurements([]);
    currentPoints.forEach(point => point.mesh.dispose());
    setCurrentPoints([]);
    clearPreview();
    setIsMeasuring(false);
  };

  const deleteMeasurement = (id: string) => {
    const measurement = measurements.find(m => m.id === id);
    if (measurement) {
      // Dispose of measurement meshes
      const meshes = scene.meshes.filter(mesh =>
        mesh.name.startsWith(id)
      );
      meshes.forEach(mesh => mesh.dispose());

      setMeasurements(prev => prev.filter(m => m.id !== id));
    }
  };

  const convertValue = (value: number, fromUnit: string, toUnit: string): number => {
    const conversions = {
      meters: { feet: 3.28084, inches: 39.3701 },
      feet: { meters: 0.3048, inches: 12 },
      inches: { meters: 0.0254, feet: 0.0833333 }
    };

    if (fromUnit === toUnit) return value;
    return value * (conversions as any)[fromUnit][toUnit];
  };

  const getMinPointsForMode = (mode: string): number => {
    switch (mode) {
      case 'distance':
      case 'length':
      case 'breadth':
      case 'depth':
      case 'circumference':
      case 'radius':
        return 2;
      case 'angle':
        return 3;
      case 'area':
        return 3;
      case 'volume':
        return 8;
      default:
        return 2;
    }
  };

  const exportMeasurements = () => {
    const data = {
      measurements: measurements.map(m => ({
        ...m,
        points: m.points.map(p => ({ x: p.x, y: p.y, z: p.z }))
      })),
      exportDate: new Date().toISOString(),
      totalMeasurements: measurements.length
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `measurements-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="p-4 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 h-full flex flex-col">
      <h3 className="m-0 mb-4 text-base">Measure Tool</h3>

      {/* Controls */}
      <div className="mb-4">
        <div className="mb-2">
          <label htmlFor="measurement-type" className="block text-xs text-slate-400 mb-1">
            Measurement Type
          </label>
          <select
            id="measurement-type"
            value={measurementMode}
            onChange={(e) => {
              setMeasurementMode(e.target.value as any);
              clearAllMeasurements();
            }}
            className="w-full p-1 bg-slate-600 border border-slate-500 rounded text-slate-100 text-xs"
          >
          <option value="distance">Distance</option>
          <option value="area">Area</option>
          <option value="angle">Angle</option>
          <option value="length">Length</option>
          <option value="breadth">Breadth</option>
          <option value="depth">Depth</option>
          <option value="volume">Volume</option>
          <option value="circumference">Circumference</option>
          <option value="radius">Radius</option>
        </select>
        </div>

        <div className="mb-2">
          <label htmlFor="unit-select" className="block text-xs text-slate-400 mb-1">
            Unit
          </label>
          <select
            id="unit-select"
            value={unit}
            onChange={(e) => setUnit(e.target.value as any)}
            className="w-full p-1 bg-slate-600 border border-slate-500 rounded text-slate-100 text-xs"
          >
            <option value="meters">Meters</option>
            <option value="feet">Feet</option>
            <option value="inches">Inches</option>
          </select>
        </div>

        <div className="flex gap-1 mb-2">
          <button
            onClick={() => completeMeasurement(currentPoints)}
            disabled={!isMeasuring || currentPoints.length < getMinPointsForMode(measurementMode)}
            className={`flex-1 px-1.5 py-1.5 border-0 rounded text-white text-xs ${
              isMeasuring && currentPoints.length >= getMinPointsForMode(measurementMode)
                ? 'bg-emerald-500 cursor-pointer opacity-100'
                : 'bg-emerald-500 cursor-not-allowed opacity-50'
            }`}
          >
            Complete
          </button>

          <button
            onClick={clearAllMeasurements}
            className="flex-1 px-1.5 py-1.5 bg-red-500 border-0 rounded text-white text-xs cursor-pointer"
          >
            Clear All
          </button>
        </div>

        {measurements.length > 0 && (
          <button
            onClick={exportMeasurements}
            className="w-full px-1.5 py-1.5 bg-blue-500 border-0 rounded text-white text-xs cursor-pointer"
          >
            Export Measurements
          </button>
        )}
      </div>

      {/* Status */}
      <div className="mb-4 p-2 bg-slate-600 rounded text-xs">
        <div className="mb-1">
          <strong>Status:</strong> {isActive ? 'Active' : 'Inactive'}
        </div>
        <div className="mb-1">
          <strong>Mode:</strong> {measurementMode}
        </div>
        <div className="mb-1">
          <strong>Points:</strong> {currentPoints.length}
        </div>
        {isMeasuring && (
          <div className="text-emerald-500">
            Click to add more points or "Complete" to finish
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mb-4 p-2 bg-slate-600 rounded text-xs text-slate-400">
        <div className="mb-1"><strong>Instructions:</strong></div>
        {measurementMode === 'distance' && (
          <div>Click two points to measure distance</div>
        )}
        {measurementMode === 'area' && (
          <div>Click multiple points to define area, then complete</div>
        )}
        {measurementMode === 'angle' && (
          <div>Click three points to measure angle at middle point</div>
        )}
        {(measurementMode === 'length' || measurementMode === 'breadth' || measurementMode === 'depth') && (
          <div>Click two points to measure {measurementMode}</div>
        )}
        {(measurementMode === 'circumference' || measurementMode === 'radius') && (
          <div>Click center point and edge point to measure {measurementMode}</div>
        )}
        {measurementMode === 'volume' && (
          <div>Click 8 points to define bounding box volume, then complete</div>
        )}
      </div>

      {/* Measurements List */}
      <div className="flex-1 overflow-y-auto border border-slate-600 rounded">
        {measurements.length === 0 ? (
          <div className="p-4 text-center text-slate-400 text-xs">
            No measurements yet
          </div>
        ) : (
          measurements.map((measurement) => (
            <div
              key={measurement.id}
              className="p-2 border-b border-slate-600 text-xs"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-blue-500">
                  {measurement.type.toUpperCase()}
                </span>
                <button
                  onClick={() => deleteMeasurement(measurement.id)}
                  className="px-1.5 py-0.5 bg-red-500 border-0 rounded text-white text-xs cursor-pointer"
                >
                  ×
                </button>
              </div>

              <div className="text-emerald-500 text-xs font-bold">
                {measurement.label}
              </div>

              <div className="text-slate-400 text-xs mt-0.5">
                Points: {measurement.points.length}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {measurements.length > 0 && (
        <div className="mt-3 p-2 bg-slate-600 rounded text-xs">
          <div><strong>Total Measurements:</strong> {measurements.length}</div>
          <div><strong>Distances:</strong> {measurements.filter(m => m.type === 'distance').length}</div>
          <div><strong>Areas:</strong> {measurements.filter(m => m.type === 'area').length}</div>
          <div><strong>Angles:</strong> {measurements.filter(m => m.type === 'angle').length}</div>
          <div><strong>Lengths:</strong> {measurements.filter(m => m.type === 'length').length}</div>
          <div><strong>Breadths:</strong> {measurements.filter(m => m.type === 'breadth').length}</div>
          <div><strong>Depths:</strong> {measurements.filter(m => m.type === 'depth').length}</div>
          <div><strong>Volumes:</strong> {measurements.filter(m => m.type === 'volume').length}</div>
          <div><strong>Circumferences:</strong> {measurements.filter(m => m.type === 'circumference').length}</div>
          <div><strong>Radii:</strong> {measurements.filter(m => m.type === 'radius').length}</div>
        </div>
      )}
    </div>
  );
};

export default MeasureTool;
