// BabylonWorkspace inspector logic
// Extracted for modularization
export function getMeshProperties(mesh) {
    return {
        name: mesh.name,
        position: mesh.position.toString(),
        rotation: mesh.rotation.toString(),
        scaling: mesh.scaling.toString(),
    };
}
export function isMeshSelected(selectedMesh) {
    return !!selectedMesh;
}
// Add more inspector logic as needed for BabylonWorkspace
