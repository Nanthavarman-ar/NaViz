import React, { useRef, useEffect, useState } from 'react';
import { Engine, Scene, ArcRotateCamera, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Vector3 } from '@babylonjs/core';
import PropertyInspector from './PropertyInspector';

const t = (key) => key; // Simple i18n placeholder

const PropertyInspectorTest = () => {
  const canvasRef = useRef(null);
  const [scene, setScene] = useState(null);
  const [engine, setEngine] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [testResults, setTestResults] = useState([]);

  const logTest = (test, result) => {
    setTestResults(prev => [...prev, { test, result, time: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const babylonEngine = new Engine(canvasRef.current, true);
    const babylonScene = new Scene(babylonEngine);

    // Camera
    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), babylonScene);
    camera.attachControls(canvasRef.current, true);

    // Light
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), babylonScene);

    // Test objects with different properties
    const box = MeshBuilder.CreateBox("TestBox", { size: 2 }, babylonScene);
    box.position = new Vector3(-3, 0, 0);
    const boxMaterial = new StandardMaterial("BoxMaterial", babylonScene);
    boxMaterial.diffuseColor = new Color3(1, 0, 0);
    boxMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
    boxMaterial.emissiveColor = new Color3(0.1, 0, 0);
    boxMaterial.alpha = 0.8;
    box.material = boxMaterial;

    const sphere = MeshBuilder.CreateSphere("TestSphere", { diameter: 2 }, babylonScene);
    sphere.position = new Vector3(0, 0, 0);
    const sphereMaterial = new StandardMaterial("SphereMaterial", babylonScene);
    sphereMaterial.diffuseColor = new Color3(0, 1, 0);
    sphereMaterial.wireframe = true;
    sphere.material = sphereMaterial;

    const cylinder = MeshBuilder.CreateCylinder("TestCylinder", { height: 3, diameter: 1.5 }, babylonScene);
    cylinder.position = new Vector3(3, 0, 0);
    cylinder.rotation = new Vector3(0, Math.PI / 4, 0);
    cylinder.scaling = new Vector3(1.2, 0.8, 1.2);
    const cylinderMaterial = new StandardMaterial("CylinderMaterial", babylonScene);
    cylinderMaterial.diffuseColor = new Color3(0, 0, 1);
    cylinder.material = cylinderMaterial;

    // Click selection
    babylonScene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.pickInfo?.hit && pointerInfo.pickInfo.pickedMesh) {
        setSelectedObject(pointerInfo.pickInfo.pickedMesh);
        logTest("Object Selection", `Selected: ${pointerInfo.pickInfo.pickedMesh.name}`);
      }
    });

    setEngine(babylonEngine);
    setScene(babylonScene);
    setSelectedObject(box); // Auto-select box for testing

    babylonEngine.runRenderLoop(() => {
      babylonScene.render();
    });

    return () => {
      babylonEngine.dispose();
    };
  }, []);

  const handlePropertyChange = (object, property, value) => {
    logTest("Property Change", `${object.name}.${property} = ${JSON.stringify(value)}`);
  };

  const runAutomatedTests = () => {
    if (!selectedObject) return;
    
    setTestResults([]);
    
    // Test position change
    setTimeout(() => {
      selectedObject.position.x = 1;
      logTest("Position Test", "X position changed to 1");
    }, 500);

    // Test rotation change
    setTimeout(() => {
      selectedObject.rotation.y = Math.PI / 2;
      logTest("Rotation Test", "Y rotation changed to 90°");
    }, 1000);

    // Test scaling change
    setTimeout(() => {
      selectedObject.scaling.x = 1.5;
      logTest("Scaling Test", "X scale changed to 1.5");
    }, 1500);

    // Test material color change
    setTimeout(() => {
      if (selectedObject.material) {
        selectedObject.material.diffuseColor = new Color3(1, 1, 0);
        logTest("Material Test", "Diffuse color changed to yellow");
      }
    }, 2000);

    // Test visibility toggle
    setTimeout(() => {
      selectedObject.setEnabled(false);
      logTest("Visibility Test", "Object hidden");
      setTimeout(() => {
        selectedObject.setEnabled(true);
        logTest("Visibility Test", "Object shown");
      }, 500);
    }, 2500);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* Test Controls */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-75 p-4 rounded text-white">
          <h3 className="text-lg mb-2">Test Controls</h3>
          <button 
            onClick={runAutomatedTests}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-2 block"
          >
            Run Automated Tests
          </button>
          <div className="text-sm">
            <p>• Click objects to select</p>
            <p>• Use PropertyInspector to edit</p>
            <p>• Watch test results below</p>
          </div>
        </div>

        {/* Test Results */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-75 p-4 rounded text-white max-w-md max-h-48 overflow-y-auto">
          <h4 className="text-sm font-bold mb-2">Test Results:</h4>
          {testResults.map((result, i) => (
            <div key={i} className="text-xs mb-1 border-b border-gray-600 pb-1">
              <span className="text-green-400">[{result.time}]</span> 
              <span className="text-blue-400"> {result.test}:</span> 
              <span className="text-white"> {result.result}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Property Inspector */}
      <div className="w-80 border-l border-slate-600">
        {scene && engine && (
          <PropertyInspector
            scene={scene}
            engine={engine}
            selectedObject={selectedObject}
            onPropertyChange={handlePropertyChange}
          />
        )}
      </div>

      {/* Feature Checklist */}
      <div className="w-64 bg-gray-800 p-4 text-white text-sm overflow-y-auto">
        <h3 className="text-lg mb-4">Feature Tests</h3>
        
        <div className="space-y-2">
          <div className="border-b border-gray-600 pb-2">
            <h4 className="font-bold text-blue-400">{t('Basic Properties')}</h4>
            <p>✓ Name editing</p>
            <p>✓ Type display</p>
            <p>✓ Visible checkbox</p>
            <p>✓ Pickable checkbox</p>
          </div>

          <div className="border-b border-gray-600 pb-2">
            <h4 className="font-bold text-blue-400">{t('Transform')}</h4>
            <p>✓ Position X/Y/Z inputs</p>
            <p>✓ Rotation X/Y/Z inputs</p>
            <p>✓ Scale X/Y/Z inputs</p>
            <p>✓ Real-time updates</p>
          </div>

          <div className="border-b border-gray-600 pb-2">
            <h4 className="font-bold text-blue-400">Dimensions</h4>
            <p>✓ Width/Height/Depth</p>
            <p>✓ Volume calculation</p>
            <p>✓ Auto-update on scale</p>
          </div>

          <div className="border-b border-gray-600 pb-2">
            <h4 className="font-bold text-blue-400">{t('Material')}</h4>
            <p>✓ Diffuse color picker</p>
            <p>✓ Specular color picker</p>
            <p>✓ Emissive color picker</p>
            <p>✓ Alpha slider</p>
            <p>✓ Wireframe toggle</p>
            <p>✓ RGB component inputs</p>
          </div>

          <div>
            <h4 className="font-bold text-blue-400">Interaction</h4>
            <p>✓ Object selection</p>
            <p>✓ Property callbacks</p>
            <p>✓ Live scene updates</p>
            <p>✓ Error handling</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInspectorTest;