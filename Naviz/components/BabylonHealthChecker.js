import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const BabylonHealthChecker = ({ scene, engine }) => {
    const [health, setHealth] = useState({
        engine: false,
        scene: false,
        rendering: false,
        fps: 0,
        meshes: 0,
        materials: 0,
        lights: 0
    });
    useEffect(() => {
        const checkHealth = () => {
            setHealth({
                engine: !!engine,
                scene: !!scene,
                rendering: engine ? !engine.isDisposed : false,
                fps: engine ? Math.round(engine.getFps()) : 0,
                meshes: scene?.meshes?.length || 0,
                materials: scene?.materials?.length || 0,
                lights: scene?.lights?.length || 0
            });
        };
        const interval = setInterval(checkHealth, 1000);
        checkHealth();
        return () => clearInterval(interval);
    }, [scene, engine]);
    const getStatus = (value) => value ? '✅' : '❌';
    return (_jsxs("div", { className: "fixed top-4 left-4 bg-slate-800 border border-slate-600 rounded-lg p-3 z-50 text-xs text-white", children: [_jsx("div", { className: "font-bold mb-2", children: "Babylon.js Status" }), _jsxs("div", { children: ["Engine: ", getStatus(health.engine)] }), _jsxs("div", { children: ["Scene: ", getStatus(health.scene)] }), _jsxs("div", { children: ["Rendering: ", getStatus(health.rendering)] }), _jsxs("div", { children: ["FPS: ", health.fps] }), _jsxs("div", { children: ["Meshes: ", health.meshes] }), _jsxs("div", { children: ["Materials: ", health.materials] }), _jsxs("div", { children: ["Lights: ", health.lights] })] }));
};
export default BabylonHealthChecker;
