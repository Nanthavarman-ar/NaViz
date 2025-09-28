import { useEffect, useCallback } from 'react';
import { Scene, ArcRotateCamera, Mesh, PointerDragBehavior, Vector3, Space, PointerEventTypes, PointerInfo, Color3, Quaternion } from '@babylonjs/core';

export interface UseMeshSceneHandlersProps {
  sceneRef: React.RefObject<Scene | null>;
  cameraRef: React.RefObject<ArcRotateCamera | null>;
  selectedMesh: Mesh | null;
  moveActive: boolean;
  rotateActive: boolean;
  scaleActive: boolean;
  cameraActive: boolean;
  perspectiveActive: boolean;
  moveBehaviorRef: React.MutableRefObject<PointerDragBehavior | null>;
  rotateBehaviorRef: React.MutableRefObject<PointerDragBehavior | null>;
  scaleBehaviorRef: React.MutableRefObject<PointerDragBehavior | null>;
  highlightLayerRef: React.RefObject<any | null>;
  onMeshSelect?: (mesh: Mesh) => void;
  updateState: (updates: any) => void;
  handleMeshSelect?: (mesh: Mesh) => void;
  collabManagerRef?: React.RefObject<any>;
  cloudAnchorManagerRef?: React.RefObject<any>;
  featureStates?: Record<string, boolean>;
}

export const useMeshSceneHandlers = ({
  sceneRef,
  cameraRef,
  selectedMesh,
  moveActive,
  rotateActive,
  scaleActive,
  cameraActive,
  perspectiveActive,
  moveBehaviorRef,
  rotateBehaviorRef,
  scaleBehaviorRef,
  highlightLayerRef,
  onMeshSelect,
  updateState,
  handleMeshSelect: externalHandleMeshSelect,
  collabManagerRef,
  cloudAnchorManagerRef,
  featureStates = {}
}: UseMeshSceneHandlersProps) => {
  const internalHandleMeshSelect = useCallback((mesh: Mesh) => {
    if (externalHandleMeshSelect) {
      externalHandleMeshSelect(mesh);
    }
    if (onMeshSelect) {
      onMeshSelect(mesh);
    }
    updateState({ selectedMesh: mesh });
    // Highlight selected mesh
    if (highlightLayerRef.current) {
      highlightLayerRef.current.addMesh(mesh, Color3.FromHexString("#00ff00"));
    }

    // Integration: Share selection with CollabManager if enabled
    if (featureStates.showCollabManager && collabManagerRef?.current) {
      try {
        const objectData = {
          id: `selection_${Date.now()}`,
          name: `Selected: ${mesh.name}`,
          type: 'annotation' as const,
          position: mesh.position.clone(),
          rotation: mesh.rotationQuaternion || Quaternion.Identity(),
          scale: mesh.scaling.clone(),
          ownerId: collabManagerRef.current.getCurrentUser()?.id || 'local-user',
          isShared: true,
          metadata: { meshId: mesh.id, action: 'selected' }
        };
        collabManagerRef.current.createObject(objectData);
      } catch (error) {
        console.error('Failed to share selection via collab:', error);
      }
    }

    // Integration: Attach cloud anchor if geo features active
    if (featureStates.showGeoLocation && cloudAnchorManagerRef?.current && !mesh.metadata?.cloudAnchorId) {
      try {
        const anchorData = {
          id: `anchor_${mesh.id}_${Date.now()}`,
          name: `Anchor for ${mesh.name}`,
          position: mesh.position.clone(),
          rotation: mesh.rotationQuaternion || Quaternion.Identity(),
          scale: Vector3.One(),
          isPersistent: true,
          gpsCoordinates: { lat: 0, lng: 0, alt: 0 }, // Placeholder; integrate real GPS
          modelUrl: undefined,
          userId: 'local-user'
        };
        const anchor = cloudAnchorManagerRef.current.createAnchor(anchorData);
        if (anchor) {
          mesh.metadata = { ...mesh.metadata, cloudAnchorId: anchor.id };
          cloudAnchorManagerRef.current.updateAnchorPosition(anchor.id, mesh.position);
        }
      } catch (error) {
        console.error('Failed to attach cloud anchor:', error);
      }
    }
  }, [externalHandleMeshSelect, onMeshSelect, updateState, highlightLayerRef, featureStates, collabManagerRef, cloudAnchorManagerRef]);

  // Mesh selection via pointer observable
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const pointerObservable = scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERDOWN && pointerInfo.pickInfo?.hit && pointerInfo.pickInfo.pickedMesh) {
        const mesh = pointerInfo.pickInfo.pickedMesh as Mesh;
        internalHandleMeshSelect(mesh);
      }
    }, PointerEventTypes.POINTERPICK);

    return () => {
      scene.onPointerObservable.remove(pointerObservable);
    };
  }, [sceneRef, internalHandleMeshSelect]);

  // Tool activation effects
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!scene || !camera) return;

    // Move tool
    if (moveActive && selectedMesh) {
      if (!moveBehaviorRef.current) {
        const behavior = new PointerDragBehavior({ dragPlaneNormal: Vector3.Up() });
        behavior.onDragObservable.add((event) => {
          selectedMesh?.position.addInPlace(event.delta);
        });
        selectedMesh.addBehavior(behavior);
        moveBehaviorRef.current = behavior;
      }
    } else if (moveBehaviorRef.current) {
      selectedMesh?.removeBehavior(moveBehaviorRef.current);
      moveBehaviorRef.current = null;
    }

    // Rotate tool
    if (rotateActive && selectedMesh) {
      if (!rotateBehaviorRef.current) {
        const behavior = new PointerDragBehavior({
          dragPlaneNormal: Vector3.Up()
        });
        behavior.dragDeltaRatio = 0.01; // For rotation sensitivity
        behavior.useObjectOrientationForDragging = true;
        behavior.onDragObservable.add((event) => {
          selectedMesh?.rotate(Vector3.Up(), event.delta.x * 0.01, Space.WORLD);
        });
        selectedMesh.addBehavior(behavior);
        rotateBehaviorRef.current = behavior;
      }
    } else if (rotateBehaviorRef.current) {
      selectedMesh?.removeBehavior(rotateBehaviorRef.current);
      rotateBehaviorRef.current = null;
    }

    // Scale tool
    if (scaleActive && selectedMesh) {
      if (!scaleBehaviorRef.current) {
        const behavior = new PointerDragBehavior();
        behavior.useObjectOrientationForDragging = false;
        behavior.dragDeltaRatio = 0.01;
        behavior.onDragObservable.add((event) => {
          const scaleFactor = 1 + (event.delta.y / 1000);
          selectedMesh?.scaling.scaleInPlace(scaleFactor);
        });
        selectedMesh.addBehavior(behavior);
        scaleBehaviorRef.current = behavior;
      }
    } else if (scaleBehaviorRef.current) {
      selectedMesh?.removeBehavior(scaleBehaviorRef.current);
      scaleBehaviorRef.current = null;
    }

    // Camera reset
    if (cameraActive) {
      camera.setPosition(new Vector3(0, 5, -10));
      camera.setTarget(Vector3.Zero());
      updateState({ cameraActive: false }); // Reset toggle
    }

    // Perspective toggle
    if (perspectiveActive) {
      if (camera.mode === 0) {
        camera.mode = 1;
        (camera as any).orthoLeft = -10;
        (camera as any).orthoRight = 10;
        (camera as any).orthoTop = 10;
        (camera as any).orthoBottom = -10;
      } else {
        camera.mode = 0;
      }
      updateState({ perspectiveActive: false }); // Reset toggle
    }

    return () => {
      // Cleanup on unmount or state change
      if (moveBehaviorRef.current) {
        selectedMesh?.removeBehavior(moveBehaviorRef.current);
        moveBehaviorRef.current = null;
      }
      if (rotateBehaviorRef.current) {
        selectedMesh?.removeBehavior(rotateBehaviorRef.current);
        rotateBehaviorRef.current = null;
      }
      if (scaleBehaviorRef.current) {
        selectedMesh?.removeBehavior(scaleBehaviorRef.current);
        scaleBehaviorRef.current = null;
      }
    };
  }, [moveActive, rotateActive, scaleActive, cameraActive, perspectiveActive, selectedMesh, sceneRef, cameraRef, updateState, moveBehaviorRef, rotateBehaviorRef, scaleBehaviorRef]);

  return { handleMeshSelect: internalHandleMeshSelect };
};
