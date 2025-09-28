import { useCallback } from "react";
import { Material } from "@babylonjs/core";
export function useWorkspaceHandlers({ onMeshSelect, updateState, onAnimationCreate, onMaterialChange, workspaceState, }) {
    // Handler for mesh selection
    const handleMeshSelect = useCallback((mesh) => {
        updateState({ selectedMesh: mesh });
        if (onMeshSelect) {
            onMeshSelect(mesh);
        }
    }, [onMeshSelect, updateState]);
    // Animation handlers
    const handleAnimationCreate = useCallback((sequence) => {
        const animationGroup = {
            id: sequence.id,
            name: sequence.name,
            animations: [],
            targetMeshes: [],
            speedRatio: 1.0,
            weight: 1.0,
            isPlaying: false,
            isLooping: sequence.loop,
            from: 0,
            to: sequence.duration || 100
        };
        if (onAnimationCreate) {
            onAnimationCreate(animationGroup);
        }
    }, [onAnimationCreate]);
    // Material handlers
    const handleMaterialChange = useCallback((materialState) => {
        if (onMaterialChange) {
            onMaterialChange(materialState);
        }
    }, [onMaterialChange]);
    const handleMaterialApplied = useCallback((mesh, material) => {
        mesh.material = material;
        if (workspaceState.selectedMesh === mesh) {
            updateState({ selectedMesh: mesh });
        }
        if (onMaterialChange) {
            onMaterialChange({
                id: material.id,
                name: material.name || `Material ${material.id}`,
                type: material instanceof Material ? 'pbr' : 'standard',
                properties: material,
                isActive: true,
                lastModified: Date.now()
            });
        }
    }, [workspaceState.selectedMesh, onMaterialChange, updateState]);
    return {
        handleMeshSelect,
        handleAnimationCreate,
        handleMaterialChange,
        handleMaterialApplied,
    };
}
