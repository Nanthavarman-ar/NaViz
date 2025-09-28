import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import { MaterialVariant } from './MaterialVariantManager';

interface DragDropMaterialHandlerProps {
  scene: BABYLON.Scene;
  canvas: HTMLCanvasElement;
  onMaterialApplied: (mesh: BABYLON.Mesh, material: BABYLON.Material) => void;
}

export const DragDropMaterialHandler: React.FC<DragDropMaterialHandlerProps> = ({
  scene,
  canvas,
  onMaterialApplied
}) => {
  const draggedMaterialRef = useRef<BABYLON.Material | null>(null);
  const highlightLayerRef = useRef<BABYLON.HighlightLayer | null>(null);

  useEffect(() => {
    if (!scene || !canvas) return;

    // Create highlight layer for visual feedback
    const highlightLayer = new BABYLON.HighlightLayer("dragDropHighlight", scene);
    highlightLayer.innerGlow = false;
    highlightLayer.outerGlow = true;
    highlightLayerRef.current = highlightLayer;

    // Handle drag over canvas
    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      event.dataTransfer!.dropEffect = 'copy';
    };

    // Handle drop on canvas
    const handleDrop = (event: DragEvent) => {
      event.preventDefault();

      if (!draggedMaterialRef.current) return;

      // Get pick info at drop location
      const pickInfo = scene.pick(
        event.offsetX,
        event.offsetY,
        (mesh) => mesh instanceof BABYLON.Mesh && mesh.isPickable
      );

      if (pickInfo.hit && pickInfo.pickedMesh) {
        const targetMesh = pickInfo.pickedMesh as BABYLON.Mesh;

        // Apply material to mesh
        targetMesh.material = draggedMaterialRef.current;

        // Notify parent component
        onMaterialApplied(targetMesh, draggedMaterialRef.current);

        // Clear highlight
        highlightLayer.removeAllMeshes();

        // Show success feedback
        console.log(`Material applied to ${targetMesh.name}`);
      }

      draggedMaterialRef.current = null;
    };

    // Handle drag enter/leave for visual feedback
    const handleDragEnter = (event: DragEvent) => {
      event.preventDefault();
      canvas.style.border = '2px solid #3b82f6';
    };

    const handleDragLeave = (event: DragEvent) => {
      event.preventDefault();
      canvas.style.border = '';
    };

    // Add event listeners
    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);
    canvas.addEventListener('dragenter', handleDragEnter);
    canvas.addEventListener('dragleave', handleDragLeave);

    // Listen for custom drag start events from MaterialVariantManager
    const handleMaterialDragStart = (event: CustomEvent) => {
      draggedMaterialRef.current = event.detail.material;
    };

    window.addEventListener('materialDragStart', handleMaterialDragStart as EventListener);

    // Mouse move for highlight feedback
    const handleMouseMove = (event: MouseEvent) => {
      if (!draggedMaterialRef.current) return;

      const pickInfo = scene.pick(
        event.offsetX,
        event.offsetY,
        (mesh) => mesh instanceof BABYLON.Mesh && mesh.isPickable
      );

      // Clear previous highlights
      highlightLayer.removeAllMeshes();

      if (pickInfo.hit && pickInfo.pickedMesh) {
        // Highlight the mesh under cursor
        highlightLayer.addMesh(pickInfo.pickedMesh as BABYLON.Mesh, BABYLON.Color3.Blue());
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      canvas.removeEventListener('dragover', handleDragOver);
      canvas.removeEventListener('drop', handleDrop);
      canvas.removeEventListener('dragenter', handleDragEnter);
      canvas.removeEventListener('dragleave', handleDragLeave);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('materialDragStart', handleMaterialDragStart as EventListener);

      if (highlightLayerRef.current) {
        highlightLayerRef.current.dispose();
      }
    };
  }, [scene, canvas, onMaterialApplied]);

  return null; // This component doesn't render anything
};
