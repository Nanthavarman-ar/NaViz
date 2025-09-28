import React, { useState, useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import * as MaterialInterfaces from './interfaces/MaterialInterfaces';

interface MaterialEditorProps {
  sceneManager: any;
  onClose: () => void;
  onMaterialChange?: (material: MaterialInterfaces.MaterialState) => void;
}

const MaterialEditor: React.FC<MaterialEditorProps> = ({ sceneManager, onClose, onMaterialChange }) => {
  const [materials, setMaterials] = useState<MaterialInterfaces.MaterialState[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialInterfaces.MaterialState | null>(null);
  const [editorMode, setEditorMode] = useState<'properties' | 'node'>('properties');
  const [nodeMaterial, setNodeMaterial] = useState<BABYLON.NodeMaterial | null>(null);
  const [materialProperties, setMaterialProperties] = useState({
    diffuseColor: { r: 1, g: 1, b: 1 },
    specularColor: { r: 1, g: 1, b: 1 },
    emissiveColor: { r: 0, g: 0, b: 0 },
    alpha: 1,
    metallic: 0,
    roughness: 0.5,
    specularPower: 64
  });

  // Load materials from scene
  useEffect(() => {
    if (sceneManager?.scene) {
      const sceneMaterials = sceneManager.scene.materials;
      const materialStates: MaterialInterfaces.MaterialState[] = [];

      sceneMaterials.forEach((mat: BABYLON.Material, index: number) => {
        const materialState: MaterialInterfaces.MaterialState = {
          id: mat.id || `material_${index}`,
          name: mat.name || `Material ${index + 1}`,
          type: mat instanceof BABYLON.PBRMaterial ? 'pbr' : 'standard',
          properties: mat,
          isActive: true,
          lastModified: Date.now()
        };
        materialStates.push(materialState);
      });

      setMaterials(materialStates);
      if (materialStates.length > 0 && !selectedMaterial) {
        setSelectedMaterial(materialStates[0]);
        loadMaterialProperties(materialStates[0]);
      }
    }
  }, [sceneManager]);

  const loadMaterialProperties = (material: MaterialInterfaces.MaterialState) => {
    const babylonMaterial = material.properties as BABYLON.Material;

    if (babylonMaterial instanceof BABYLON.StandardMaterial) {
      setMaterialProperties({
        diffuseColor: {
          r: babylonMaterial.diffuseColor.r,
          g: babylonMaterial.diffuseColor.g,
          b: babylonMaterial.diffuseColor.b
        },
        specularColor: {
          r: babylonMaterial.specularColor.r,
          g: babylonMaterial.specularColor.g,
          b: babylonMaterial.specularColor.b
        },
        emissiveColor: {
          r: babylonMaterial.emissiveColor.r,
          g: babylonMaterial.emissiveColor.g,
          b: babylonMaterial.emissiveColor.b
        },
        alpha: babylonMaterial.alpha,
        metallic: 0,
        roughness: 1 - babylonMaterial.specularPower / 128,
        specularPower: babylonMaterial.specularPower
      });
    } else if (babylonMaterial instanceof BABYLON.PBRMaterial) {
      setMaterialProperties({
        diffuseColor: {
          r: babylonMaterial.albedoColor.r,
          g: babylonMaterial.albedoColor.g,
          b: babylonMaterial.albedoColor.b
        },
        specularColor: { r: 1, g: 1, b: 1 },
        emissiveColor: {
          r: babylonMaterial.emissiveColor.r,
          g: babylonMaterial.emissiveColor.g,
          b: babylonMaterial.emissiveColor.b
        },
        alpha: babylonMaterial.alpha,
        metallic: babylonMaterial.metallic || 0,
        roughness: babylonMaterial.roughness || 0.5,
        specularPower: 64
      });
    }
  };

  const handleMaterialSelect = (material: MaterialInterfaces.MaterialState) => {
    setSelectedMaterial(material);
    loadMaterialProperties(material);
  };

  const handlePropertyChange = (property: string, value: any) => {
    setMaterialProperties(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const applyMaterialChanges = () => {
    if (!selectedMaterial || !sceneManager?.scene) return;

    const babylonMaterial = selectedMaterial.properties as BABYLON.Material;

    if (babylonMaterial instanceof BABYLON.StandardMaterial) {
      babylonMaterial.diffuseColor = new BABYLON.Color3(
        materialProperties.diffuseColor.r,
        materialProperties.diffuseColor.g,
        materialProperties.diffuseColor.b
      );
      babylonMaterial.specularColor = new BABYLON.Color3(
        materialProperties.specularColor.r,
        materialProperties.specularColor.g,
        materialProperties.specularColor.b
      );
      babylonMaterial.emissiveColor = new BABYLON.Color3(
        materialProperties.emissiveColor.r,
        materialProperties.emissiveColor.g,
        materialProperties.emissiveColor.b
      );
      babylonMaterial.alpha = materialProperties.alpha;
      babylonMaterial.specularPower = materialProperties.specularPower;
    } else if (babylonMaterial instanceof BABYLON.PBRMaterial) {
      babylonMaterial.albedoColor = new BABYLON.Color3(
        materialProperties.diffuseColor.r,
        materialProperties.diffuseColor.g,
        materialProperties.diffuseColor.b
      );
      babylonMaterial.emissiveColor = new BABYLON.Color3(
        materialProperties.emissiveColor.r,
        materialProperties.emissiveColor.g,
        materialProperties.emissiveColor.b
      );
      babylonMaterial.alpha = materialProperties.alpha;
      babylonMaterial.metallic = materialProperties.metallic;
      babylonMaterial.roughness = materialProperties.roughness;
    }

    const updatedMaterial: MaterialInterfaces.MaterialState = {
      ...selectedMaterial,
      properties: babylonMaterial,
      lastModified: Date.now()
    };

    if (onMaterialChange) {
      onMaterialChange(updatedMaterial);
    }
  };

  const createNewMaterial = () => {
    if (!sceneManager?.scene) return;

    const newMaterial = new BABYLON.StandardMaterial(`New Material ${materials.length + 1}`, sceneManager.scene);
    newMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);

    const newMaterialState: MaterialInterfaces.MaterialState = {
      id: newMaterial.id,
      name: newMaterial.name,
      type: 'standard',
      properties: newMaterial,
      isActive: true,
      lastModified: Date.now()
    };

    setMaterials(prev => [...prev, newMaterialState]);
    setSelectedMaterial(newMaterialState);
    loadMaterialProperties(newMaterialState);
  };

  const createNodeMaterial = () => {
    if (!sceneManager?.scene) return;

    const nodeMat = new BABYLON.NodeMaterial(`Node Material ${materials.length + 1}`, sceneManager.scene);

    // Create simple fragment shader with color input
    const colorInput = new BABYLON.InputBlock("color");
    colorInput.value = new BABYLON.Color3(0.5, 0.5, 0.5);

    const fragmentOutput = new BABYLON.FragmentOutputBlock("FragmentOutput");
    colorInput.connectTo(fragmentOutput);

    // Add output node
    nodeMat.addOutputNode(fragmentOutput);
    nodeMat.build();

    const newMaterialState: MaterialInterfaces.MaterialState = {
      id: nodeMat.id,
      name: nodeMat.name,
      type: 'node',
      properties: nodeMat,
      isActive: true,
      lastModified: Date.now()
    };

    setMaterials(prev => [...prev, newMaterialState]);
    setSelectedMaterial(newMaterialState);
    setNodeMaterial(nodeMat);
    setEditorMode('node');
  };

  const convertToNodeMaterial = () => {
    if (!selectedMaterial || !sceneManager?.scene) return;

    const nodeMat = new BABYLON.NodeMaterial(`${selectedMaterial.name} (Node)`, sceneManager.scene);

    // Convert current material properties to node material
    const colorInput = new BABYLON.InputBlock("color");
    if (selectedMaterial.type === 'standard') {
      const stdMat = selectedMaterial.properties as BABYLON.StandardMaterial;
      colorInput.value = stdMat.diffuseColor;
    } else if (selectedMaterial.type === 'pbr') {
      const pbrMat = selectedMaterial.properties as BABYLON.PBRMaterial;
      colorInput.value = pbrMat.albedoColor;
    }

    const fragmentOutput = new BABYLON.FragmentOutputBlock("FragmentOutput");
    colorInput.connectTo(fragmentOutput);

    nodeMat.addOutputNode(fragmentOutput);
    nodeMat.build();

    const newMaterialState: MaterialInterfaces.MaterialState = {
      id: nodeMat.id,
      name: nodeMat.name,
      type: 'node',
      properties: nodeMat,
      isActive: true,
      lastModified: Date.now()
    };

    setMaterials(prev => [...prev, newMaterialState]);
    setSelectedMaterial(newMaterialState);
    setNodeMaterial(nodeMat);
    setEditorMode('node');
  };

  return (
    <div className="absolute top-0 left-0 w-80 h-full bg-gray-900 text-white p-4 z-50 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Material Editor</h2>
        <button onClick={onClose} className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
          ✕
        </button>
      </div>

      {/* Material List */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold">Materials</h3>
          <div className="flex gap-1">
            <button
              onClick={createNewMaterial}
              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
            >
              + Standard
            </button>
            <button
              onClick={createNodeMaterial}
              className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
            >
              + Node
            </button>
          </div>
        </div>
        <div className="max-h-32 overflow-y-auto">
          {materials.map(material => (
            <div
              key={material.id}
              onClick={() => handleMaterialSelect(material)}
              className={`p-2 mb-1 rounded cursor-pointer text-sm ${
                selectedMaterial?.id === material.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {material.name} ({material.type})
            </div>
          ))}
        </div>
      </div>

      {/* Editor Mode Toggle */}
      {selectedMaterial && selectedMaterial.type === 'node' && (
        <div className="mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setEditorMode('properties')}
              className={`px-3 py-1 rounded text-xs ${
                editorMode === 'properties' ? 'bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              Properties
            </button>
            <button
              onClick={() => setEditorMode('node')}
              className={`px-3 py-1 rounded text-xs ${
                editorMode === 'node' ? 'bg-purple-600' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              Node Editor
            </button>
          </div>
        </div>
      )}

      {/* Convert to Node Material */}
      {selectedMaterial && selectedMaterial.type !== 'node' && (
        <div className="mb-4">
          <button
            onClick={convertToNodeMaterial}
            className="w-full py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm font-semibold"
          >
            Convert to Node Material
          </button>
        </div>
      )}

      {/* Material Properties or Node Editor */}
      {selectedMaterial && editorMode === 'properties' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Properties</h3>

          {/* Diffuse Color */}
          <div>
            <label className="block text-xs mb-1">Diffuse Color</label>
            <div className="flex gap-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={materialProperties.diffuseColor.r}
              onChange={(e) => handlePropertyChange('diffuseColor', {
                ...materialProperties.diffuseColor,
                r: parseFloat(e.target.value)
              })}
              className="flex-1"
              aria-label="Diffuse Color Red"
              title="Diffuse Color Red"
              placeholder="Diffuse Color Red"
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={materialProperties.diffuseColor.g}
              onChange={(e) => handlePropertyChange('diffuseColor', {
                ...materialProperties.diffuseColor,
                g: parseFloat(e.target.value)
              })}
              className="flex-1"
              aria-label="Diffuse Color Green"
              title="Diffuse Color Green"
              placeholder="Diffuse Color Green"
            />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={materialProperties.diffuseColor.b}
              onChange={(e) => handlePropertyChange('diffuseColor', {
                ...materialProperties.diffuseColor,
                b: parseFloat(e.target.value)
              })}
              className="flex-1"
              aria-label="Diffuse Color Blue"
              title="Diffuse Color Blue"
              placeholder="Diffuse Color Blue"
            />
            </div>
            <div className="flex gap-1 mt-1">
              <span className="text-xs">R:{materialProperties.diffuseColor.r.toFixed(2)}</span>
              <span className="text-xs">G:{materialProperties.diffuseColor.g.toFixed(2)}</span>
              <span className="text-xs">B:{materialProperties.diffuseColor.b.toFixed(2)}</span>
            </div>
          </div>

          {/* Metallic/Roughness for PBR */}
          {selectedMaterial.type === 'pbr' && (
            <>
              <div>
                <label className="block text-xs mb-1">Metallic: {materialProperties.metallic.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={materialProperties.metallic}
                  onChange={(e) => handlePropertyChange('metallic', parseFloat(e.target.value))}
                  className="w-full"
                  aria-label="Metallic"
                  title="Metallic"
                  placeholder="Metallic"
                />
              </div>

              <div>
                <label className="block text-xs mb-1">Roughness: {materialProperties.roughness.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={materialProperties.roughness}
                  onChange={(e) => handlePropertyChange('roughness', parseFloat(e.target.value))}
                  className="w-full"
                  aria-label="Roughness"
                  title="Roughness"
                  placeholder="Roughness"
                />
              </div>
            </>
          )}

          {/* Specular Power for Standard */}
          {selectedMaterial.type === 'standard' && (
            <div>
              <label className="block text-xs mb-1">Specular Power: {materialProperties.specularPower}</label>
              <input
                type="range"
                min="1"
                max="128"
                step="1"
                value={materialProperties.specularPower}
                onChange={(e) => handlePropertyChange('specularPower', parseInt(e.target.value))}
                className="w-full"
                aria-label="Specular Power"
                title="Specular Power"
                placeholder="Specular Power"
              />
            </div>
          )}

          {/* Alpha */}
          <div>
            <label className="block text-xs mb-1">Alpha: {materialProperties.alpha.toFixed(2)}</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={materialProperties.alpha}
              onChange={(e) => handlePropertyChange('alpha', parseFloat(e.target.value))}
              className="w-full"
              aria-label="Alpha"
              title="Alpha"
              placeholder="Alpha"
            />
          </div>

          {/* Apply Button */}
          <button
            onClick={applyMaterialChanges}
            className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-semibold"
          >
            Apply Changes
          </button>
        </div>
      )}

      {/* Node Editor */}
      {selectedMaterial && editorMode === 'node' && selectedMaterial.type === 'node' && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Node Editor</h3>

          {/* Node Editor Canvas Placeholder */}
          <div className="bg-gray-800 rounded p-4 min-h-64 border-2 border-dashed border-gray-600">
            <div className="text-center text-gray-400">
              <div className="text-lg mb-2">🎨 Node Editor</div>
              <div className="text-sm mb-4">Visual shader programming interface</div>

              {/* Node Blocks */}
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <div className="bg-blue-600 px-3 py-1 rounded text-xs cursor-pointer hover:bg-blue-700">
                  Color Input
                </div>
                <div className="bg-green-600 px-3 py-1 rounded text-xs cursor-pointer hover:bg-green-700">
                  Texture Sample
                </div>
                <div className="bg-purple-600 px-3 py-1 rounded text-xs cursor-pointer hover:bg-purple-700">
                  Math Operation
                </div>
                <div className="bg-orange-600 px-3 py-1 rounded text-xs cursor-pointer hover:bg-orange-700">
                  Mix
                </div>
              </div>

              {/* Current Node Info */}
              <div className="text-left bg-gray-700 p-3 rounded">
                <div className="text-sm font-semibold mb-2">Current Node Material:</div>
                <div className="text-xs text-gray-300">
                  <div>Name: {selectedMaterial.name}</div>
                  <div>ID: {selectedMaterial.id}</div>
                  <div>Type: Node Material</div>
                </div>
              </div>
            </div>
          </div>

          {/* Node Editor Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (nodeMaterial) {
                  nodeMaterial.build();
                  console.log('Node Material rebuilt');
                }
              }}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold"
            >
              Build Material
            </button>
            <button
              onClick={() => {
                if (nodeMaterial) {
                  console.log('Node Material:', nodeMaterial);
                  console.log('Node Material name:', nodeMaterial.name);
                  console.log('Node Material id:', nodeMaterial.id);
                }
              }}
              className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm font-semibold"
            >
              Debug Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialEditor;
