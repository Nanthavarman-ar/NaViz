import { jsx as _jsx } from "react/jsx-runtime";
import EnhancedFloodSimulation from './EnhancedFloodSimulation';
const FloodSimulation = ({ scene, terrainMesh, onFloodLevelChange }) => {
    return (_jsx(EnhancedFloodSimulation, { scene: scene, terrainMesh: terrainMesh, onFloodLevelChange: onFloodLevelChange }));
};
export default FloodSimulation;
