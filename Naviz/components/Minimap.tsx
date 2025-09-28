import React, { useState, useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { GeoWorkspaceArea } from './types';

interface MinimapProps {
  scene: BABYLON.Scene;
  camera: BABYLON.Camera;
  workspaces?: GeoWorkspaceArea[];
  selectedWorkspaceId?: string;
  onWorkspaceSelect?: (workspaceId: string) => void;
  onCameraMove?: (position: BABYLON.Vector3) => void;
}

const Minimap: React.FC<MinimapProps> = ({
  scene,
  camera,
  workspaces = [],
  selectedWorkspaceId,
  onWorkspaceSelect,
  onCameraMove
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [objects, setObjects] = useState<any[]>([]);
  const [sceneBounds, setSceneBounds] = useState({
    min: new BABYLON.Vector3(-50, -50, -50),
    max: new BABYLON.Vector3(50, 50, 50)
  });
  const [tourWaypoints, setTourWaypoints] = useState<BABYLON.Vector3[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [tourName, setTourName] = useState('My Tour');
  const [selectedWaypoint, setSelectedWaypoint] = useState<number | null>(null);

  // Add waypoint at current camera position
  const addWaypoint = (position: BABYLON.Vector3) => {
    setTourWaypoints(prev => [...prev, position.clone()]);
  };

  // Remove selected waypoint
  const removeWaypoint = () => {
    if (selectedWaypoint !== null) {
      setTourWaypoints(tourWaypoints.filter((_, idx) => idx !== selectedWaypoint));
      setSelectedWaypoint(null);
    }
  };

  // Move camera to selected waypoint
  const goToWaypoint = (idx: number) => {
    if (tourWaypoints[idx]) {
      camera.position.copyFrom(tourWaypoints[idx]);
      if (onCameraMove) onCameraMove(tourWaypoints[idx]);
    }
  };

  // Play tour (simple sequential movement)
  const playTour = async () => {
    if (tourWaypoints.length === 0 || !camera) return;
    for (let i = 0; i < tourWaypoints.length; i++) {
      camera.position.copyFrom(tourWaypoints[i]);
      if (onCameraMove) onCameraMove(tourWaypoints[i]);
      await new Promise(res => setTimeout(res, 700));
    }
  };

  const startRecordingTour = () => {
    setTourWaypoints([]);
    setIsRecording(true);
  };

  const stopRecordingTour = () => setIsRecording(false);
  const clearTour = () => setTourWaypoints([]);

  // Canvas click handler
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const boundsWidth = sceneBounds.max.x - sceneBounds.min.x;
    const boundsHeight = sceneBounds.max.z - sceneBounds.min.z;
    const scaleX = (canvas.width - 20) / boundsWidth;
    const scaleZ = (canvas.height - 20) / boundsHeight;
    const scale = Math.min(scaleX, scaleZ) * zoom;
    const offsetX = (canvas.width - boundsWidth * scale) / 2;
    const offsetY = (canvas.height - boundsHeight * scale) / 2;
    const worldX = sceneBounds.min.x + (x - offsetX) / scale;
    const worldZ = sceneBounds.min.z + (y - offsetY) / scale;

    // Check if click is inside any workspace bounds
    for (const workspace of workspaces) {
      const b = workspace.bounds;
      if (worldX >= b.minLng && worldX <= b.maxLng && worldZ >= b.minLat && worldZ <= b.maxLat) {
        onWorkspaceSelect?.(workspace.id);
        return;
      }
    }

    // If no workspace selected, move camera
    if (onCameraMove) {
      const newPosition = new BABYLON.Vector3(worldX, camera.position.y, worldZ);
      onCameraMove(newPosition);
    }

    // If recording, add waypoint
    if (isRecording) {
      addWaypoint(new BABYLON.Vector3(worldX, camera.position.y, worldZ));
      return;
    }
  };

  return (
    <div className="minimap-container">
      <div className="minimap-header">
        <h3 className="minimap-title">Minimap</h3>
        <div className="minimap-controls">
          <button className="minimap-button" onClick={() => setZoom(Math.max(0.5, zoom - 0.2))} title="Zoom Out">-</button>
          <span className="minimap-button">{Math.round(zoom * 100)}%</span>
          <button className="minimap-button" onClick={() => setZoom(Math.min(3, zoom + 0.2))} title="Zoom In">+</button>
          <button className={`minimap-button ${isVisible ? 'minimap-button-hide' : 'minimap-button-show'}`} onClick={() => setIsVisible(!isVisible)}>
            {isVisible ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      {isVisible && (
        <div style={{ position: 'relative' }}>
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            onClick={handleCanvasClick}
            style={{
              border: '1px solid #475569',
              borderRadius: '4px',
              cursor: 'crosshair',
              background: '#0f172a'
            }}
            title="Click to move camera"
          />

          {/* Legend */}
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '4px',
            borderRadius: '4px',
            fontSize: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></div>
              <span>Camera</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
              <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div>
              <span>Objects</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }}></div>
              <span>Lights</span>
            </div>
          </div>
        </div>
      )}

      {/* Status info */}
      <div style={{
        marginTop: '12px',
        fontSize: '12px',
        color: '#94a3b8'
      }}>
        <div>Objects: {objects.filter(obj => obj.type !== 'camera').length}</div>
        <div>Bounds: {sceneBounds.min.x.toFixed(1)} to {sceneBounds.max.x.toFixed(1)}</div>
      </div>

      {/* Tour Composer Controls */}
      <div style={{
        marginTop: '16px',
        padding: '8px',
        background: '#0f172a',
        borderRadius: '6px',
        color: '#f1f5f9'
      }}>
        <h4 style={{ marginBottom: '8px', fontSize: '14px' }}>Tour Composer</h4>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
          <input
            type="text"
            value={tourName}
            onChange={e => setTourName(e.target.value)}
            style={{ background: '#18181b', color: '#fff', borderRadius: '4px', border: '1px solid #334155', fontSize: '12px', padding: '2px 6px', width: '100px' }}
            placeholder="Tour Name"
          />
          <button onClick={() => addWaypoint(camera.position)} disabled={isRecording}>Add Waypoint</button>
          <button onClick={startRecordingTour} disabled={isRecording}>Record</button>
          <button onClick={stopRecordingTour} disabled={!isRecording}>Stop</button>
          <button onClick={playTour} disabled={tourWaypoints.length === 0}>Play</button>
          <button onClick={clearTour} disabled={tourWaypoints.length === 0}>Clear</button>
        </div>
        <div>
          <span>Waypoints: {tourWaypoints.length}</span>
          <ul style={{ maxHeight: '60px', overflowY: 'auto', margin: 0, padding: 0 }}>
            {tourWaypoints.map((wp, idx) => (
              <li key={idx} style={{
                background: selectedWaypoint === idx ? '#f43f5e' : 'transparent',
                color: selectedWaypoint === idx ? '#fff' : '#f1f5f9',
                padding: '2px 4px',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
                onClick={() => setSelectedWaypoint(idx)}>
                <span style={{ fontFamily: 'monospace', fontSize: '11px' }}>({wp.x.toFixed(1)}, {wp.z.toFixed(1)})</span>
                <button style={{ fontSize: '10px', background: '#334155', color: '#fff', borderRadius: '2px', border: 'none', padding: '1px 4px', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); goToWaypoint(idx); }}>Go</button>
                <button style={{ fontSize: '10px', background: '#ef4444', color: '#fff', borderRadius: '2px', border: 'none', padding: '1px 4px', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setTourWaypoints(tourWaypoints.filter((_, i) => i !== idx)); if (selectedWaypoint === idx) setSelectedWaypoint(null); }}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Minimap;
