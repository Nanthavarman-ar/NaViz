import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { MaterialManager } from './MaterialManager';
import { SyncManager } from './SyncManager';
const MaterialManagerWrapper = ({ scene, socket, userId }) => {
    const materialManagerRef = useRef(null);
    const syncManagerRef = useRef(null);
    useEffect(() => {
        try {
            // Initialize sync manager with required parameters
            syncManagerRef.current = new SyncManager(socket, scene, userId);
            // Initialize material manager with scene and sync manager
            materialManagerRef.current = new MaterialManager(scene, syncManagerRef.current);
            console.log('MaterialManager initialized successfully');
        }
        catch (error) {
            console.error('Error initializing MaterialManager:', error);
        }
        return () => {
            if (materialManagerRef.current) {
                materialManagerRef.current.dispose();
            }
            if (syncManagerRef.current) {
                syncManagerRef.current.dispose();
            }
        };
    }, [scene, socket, userId]);
    return (_jsxs("div", { className: "absolute top-15 right-2.5 w-80 bg-black bg-opacity-90 rounded-lg p-4 text-white text-xs z-[1000]", children: [_jsx("h3", { className: "m-0 mb-4 text-blue-500", children: "\uD83E\uDDF1 Material Manager" }), _jsx("p", { children: "Advanced material management system initialized." }), _jsx("p", { children: "Material presets and properties available." })] }));
};
export default MaterialManagerWrapper;
