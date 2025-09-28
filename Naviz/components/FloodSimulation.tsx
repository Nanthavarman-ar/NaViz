import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Scene, MeshBuilder, StandardMaterial, Color3, Vector3, AbstractMesh, Observer } from '@babylonjs/core';
import { showToast } from '../utils/toast';

interface FloodSimulationProps {
  scene: Scene;
  isActive?: boolean;
  onClose?: () => void;
}

export default function FloodSimulation({ scene, isActive = true, onClose }: FloodSimulationProps): React.ReactElement | null {
  const [waterLevel, setWaterLevel] = useState(0.5);
  const [waveSpeed, setWaveSpeed] = useState(1.0);
  const waterMeshRef = useRef<AbstractMesh | null>(null);
  const animationTokenRef = useRef<Observer<Scene> | null>(null);

  useEffect(() => {
    if (!scene || !isActive || !scene.isReady()) return;

    // Get existing water mesh (created by parent handleFeatureToggle)
    let waterMesh = scene.getMeshByName('flood-water') as AbstractMesh;
    if (waterMesh) {
      waterMeshRef.current = waterMesh;
    } else {
      // Fallback creation if not present
      waterMesh = MeshBuilder.CreateGround('flood-water', { width: 20, height: 20, subdivisions: 2 }, scene);
      const waterMat = new StandardMaterial('flood-water-mat', scene);
      waterMat.diffuseColor = new Color3(0.2, 0.4, 0.8);
      waterMat.alpha = 0.7;
      waterMesh.material = waterMat;
      waterMesh.position = new Vector3(0, -0.5, 0);
      waterMeshRef.current = waterMesh;
      scene.addMesh(waterMesh);
    }

    // Animate using Babylon's render loop
    const animateWater = () => {
      if (waterMeshRef.current && scene.isReady()) {
        waterMeshRef.current.position.y = -1 + waterLevel * 2;
        // Simple wave effect based on waveSpeed
        const time = scene.getEngine().getDeltaTime() * waveSpeed / 1000;
        waterMeshRef.current.rotation.z = Math.sin(time) * 0.05;
      }
    };

    animationTokenRef.current = scene.onBeforeRenderObservable.add(animateWater);

    return () => {
      if (animationTokenRef.current !== null) {
        scene.onBeforeRenderObservable.remove(animationTokenRef.current);
        animationTokenRef.current = null;
      }
      if (waterMeshRef.current && onClose) {
        waterMeshRef.current.dispose();
        scene.removeMesh(waterMeshRef.current);
        waterMeshRef.current = null;
      }
    };
  }, [scene, isActive, waterLevel, waveSpeed, onClose]);

  if (!isActive) return null;

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-80 bg-slate-800 border-slate-600 text-white">
      <CardHeader>
        <CardTitle>Flood Simulation</CardTitle>
        <Button size="sm" variant="outline" onClick={onClose}>Close</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Water Level</Label>
          <Slider value={[waterLevel]} onValueChange={(v: [number, number]) => setWaterLevel(v[0])} max={1} step={0.1} />
        </div>
        <div>
          <Label>Wave Speed</Label>
          <Slider value={[waveSpeed]} onValueChange={(v: [number, number]) => setWaveSpeed(v[0])} max={2} step={0.1} />
        </div>
        <Button onClick={() => showToast.success('Flood simulation updated')}>Update Simulation</Button>
      </CardContent>
    </Card>
  );
}
