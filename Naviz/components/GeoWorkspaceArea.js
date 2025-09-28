import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const GeoWorkspaceArea = ({ scene, geoSyncManager, onWorkspaceCreated, onWorkspaceSelected }) => {
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [creationStep, setCreationStep] = useState('name');
    const [newWorkspaceName, setNewWorkspaceName] = useState('');
    const [boundsInput, setBoundsInput] = useState({
        north: 0,
        south: 0,
        east: 0,
        west: 0
    });
    const [elevation, setElevation] = useState(0);
    const [showMapOverlay, setShowMapOverlay] = useState(false);
    const [mapImageUrl, setMapImageUrl] = useState('');
    // Update workspaces list when manager changes
    useEffect(() => {
        const updateWorkspaces = () => {
            setWorkspaces(geoSyncManager.getWorkspaces());
        };
        updateWorkspaces();
        // In a real implementation, you'd subscribe to manager changes
    }, [geoSyncManager]);
    const startWorkspaceCreation = () => {
        setIsCreating(true);
        setCreationStep('name');
        setNewWorkspaceName('');
        setBoundsInput({ north: 0, south: 0, east: 0, west: 0 });
        setElevation(0);
    };
    const cancelWorkspaceCreation = () => {
        setIsCreating(false);
        setCreationStep('name');
    };
    const nextCreationStep = () => {
        if (creationStep === 'name' && newWorkspaceName.trim()) {
            setCreationStep('bounds');
        }
        else if (creationStep === 'bounds') {
            setCreationStep('confirm');
        }
    };
    const previousCreationStep = () => {
        if (creationStep === 'bounds') {
            setCreationStep('name');
        }
        else if (creationStep === 'confirm') {
            setCreationStep('bounds');
        }
    };
    const createWorkspace = () => {
        if (!newWorkspaceName.trim())
            return;
        const workspace = geoSyncManager.createWorkspaceArea(newWorkspaceName, boundsInput, elevation);
        setWorkspaces(prev => [...prev, workspace]);
        setIsCreating(false);
        setSelectedWorkspace(workspace);
        onWorkspaceCreated?.(workspace);
        onWorkspaceSelected?.(workspace);
    };
    const selectWorkspace = (workspace) => {
        setSelectedWorkspace(workspace);
        onWorkspaceSelected?.(workspace);
    };
    const deleteWorkspace = (workspaceId) => {
        geoSyncManager.removeWorkspace(workspaceId);
        setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
        if (selectedWorkspace?.id === workspaceId) {
            setSelectedWorkspace(null);
            onWorkspaceSelected?.(null);
        }
    };
    const addMapOverlay = () => {
        if (selectedWorkspace && mapImageUrl.trim()) {
            geoSyncManager.addMapOverlay(selectedWorkspace.id, mapImageUrl);
            setShowMapOverlay(false);
            setMapImageUrl('');
        }
    };
    const calculateArea = (bounds) => {
        const latDiff = bounds.north - bounds.south;
        const lngDiff = bounds.east - bounds.west;
        const centerLat = (bounds.north + bounds.south) / 2;
        return latDiff * lngDiff * 111000 * 111000 * Math.cos(centerLat * Math.PI / 180);
    };
    return (_jsxs("div", { style: {
            padding: '16px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f1f5f9'
        }, children: [_jsx("h3", { style: { margin: '0 0 16px 0', fontSize: '16px' }, children: "Workspace Areas" }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }, children: [_jsx("h4", { style: { margin: '0', fontSize: '14px' }, children: "Existing Workspaces" }), _jsx("button", { onClick: startWorkspaceCreation, style: {
                                    padding: '6px 12px',
                                    background: '#3b82f6',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }, children: "Create New" })] }), workspaces.length === 0 ? (_jsx("div", { style: { fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '16px' }, children: "No workspaces created yet" })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: '8px' }, children: workspaces.map(workspace => (_jsx("div", { style: {
                                padding: '12px',
                                background: selectedWorkspace?.id === workspace.id ? '#334155' : '#0f172a',
                                border: selectedWorkspace?.id === workspace.id ? '1px solid #3b82f6' : '1px solid #334155',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }, onClick: () => selectWorkspace(workspace), children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '14px', fontWeight: 'bold' }, children: workspace.name }), _jsxs("div", { style: { fontSize: '12px', color: '#94a3b8' }, children: ["Center: ", workspace.center.latitude.toFixed(4), ", ", workspace.center.longitude.toFixed(4)] }), _jsxs("div", { style: { fontSize: '12px', color: '#94a3b8' }, children: ["Area: ", (workspace.area / 1000000).toFixed(2), " km\u00B2"] })] }), _jsx("button", { onClick: (e) => {
                                            e.stopPropagation();
                                            deleteWorkspace(workspace.id);
                                        }, style: {
                                            padding: '4px 8px',
                                            background: '#ef4444',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: 'white',
                                            fontSize: '10px',
                                            cursor: 'pointer'
                                        }, children: "Delete" })] }) }, workspace.id))) }))] }), isCreating && (_jsx("div", { style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }, children: _jsxs("div", { style: {
                        background: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '24px',
                        width: '400px',
                        maxWidth: '90vw'
                    }, children: [_jsx("h3", { style: { margin: '0 0 16px 0', fontSize: '16px' }, children: "Create New Workspace" }), creationStep === 'name' && (_jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '8px', fontSize: '14px' }, children: "Workspace Name" }), _jsx("input", { type: "text", value: newWorkspaceName, onChange: (e) => setNewWorkspaceName(e.target.value), placeholder: "Enter workspace name", style: {
                                        width: '100%',
                                        padding: '8px',
                                        background: '#334155',
                                        border: '1px solid #475569',
                                        borderRadius: '4px',
                                        color: '#f1f5f9',
                                        fontSize: '14px',
                                        marginBottom: '16px'
                                    } })] })), creationStep === 'bounds' && (_jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '8px', fontSize: '14px' }, children: "Geographic Bounds" }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }, children: [_jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: "North" }), _jsx("input", { type: "number", step: "0.000001", value: boundsInput.north, onChange: (e) => setBoundsInput((prev) => ({ ...prev, north: parseFloat(e.target.value) || 0 })), placeholder: "Latitude", style: {
                                                        width: '100%',
                                                        padding: '6px',
                                                        background: '#334155',
                                                        border: '1px solid #475569',
                                                        borderRadius: '4px',
                                                        color: '#f1f5f9',
                                                        fontSize: '12px'
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: "South" }), _jsx("input", { type: "number", step: "0.000001", value: boundsInput.south, onChange: (e) => setBoundsInput((prev) => ({ ...prev, south: parseFloat(e.target.value) || 0 })), placeholder: "Latitude", style: {
                                                        width: '100%',
                                                        padding: '6px',
                                                        background: '#334155',
                                                        border: '1px solid #475569',
                                                        borderRadius: '4px',
                                                        color: '#f1f5f9',
                                                        fontSize: '12px'
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: "East" }), _jsx("input", { type: "number", step: "0.000001", value: boundsInput.east, onChange: (e) => setBoundsInput((prev) => ({ ...prev, east: parseFloat(e.target.value) || 0 })), placeholder: "Longitude", style: {
                                                        width: '100%',
                                                        padding: '6px',
                                                        background: '#334155',
                                                        border: '1px solid #475569',
                                                        borderRadius: '4px',
                                                        color: '#f1f5f9',
                                                        fontSize: '12px'
                                                    } })] }), _jsxs("div", { children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: "West" }), _jsx("input", { type: "number", step: "0.000001", value: boundsInput.west, onChange: (e) => setBoundsInput((prev) => ({ ...prev, west: parseFloat(e.target.value) || 0 })), placeholder: "Longitude", style: {
                                                        width: '100%',
                                                        padding: '6px',
                                                        background: '#334155',
                                                        border: '1px solid #475569',
                                                        borderRadius: '4px',
                                                        color: '#f1f5f9',
                                                        fontSize: '12px'
                                                    } })] })] }), _jsxs("div", { style: { marginBottom: '16px' }, children: [_jsx("label", { style: { display: 'block', marginBottom: '4px', fontSize: '12px' }, children: "Elevation (meters)" }), _jsx("input", { type: "number", step: "0.1", value: elevation, onChange: (e) => setElevation(parseFloat(e.target.value) || 0), placeholder: "0", style: {
                                                width: '100%',
                                                padding: '6px',
                                                background: '#334155',
                                                border: '1px solid #475569',
                                                borderRadius: '4px',
                                                color: '#f1f5f9',
                                                fontSize: '12px'
                                            } })] })] })), creationStep === 'confirm' && (_jsxs("div", { children: [_jsx("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: "Confirm Workspace Details" }), _jsxs("div", { style: { fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }, children: [_jsxs("div", { children: [_jsx("strong", { children: "Name:" }), " ", newWorkspaceName] }), _jsxs("div", { children: [_jsx("strong", { children: "Bounds:" }), " ", boundsInput.north.toFixed(4), "N, ", boundsInput.south.toFixed(4), "S, ", boundsInput.east.toFixed(4), "E, ", boundsInput.west.toFixed(4), "W"] }), _jsxs("div", { children: [_jsx("strong", { children: "Elevation:" }), " ", elevation, "m"] }), _jsxs("div", { children: [_jsx("strong", { children: "Area:" }), " ", (calculateArea(boundsInput) / 1000000).toFixed(2), " km\u00B2"] })] })] })), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', marginTop: '16px' }, children: [_jsx("button", { onClick: cancelWorkspaceCreation, style: {
                                        padding: '8px 16px',
                                        background: '#6b7280',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: 'white',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }, children: "Cancel" }), _jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [creationStep !== 'name' && (_jsx("button", { onClick: previousCreationStep, style: {
                                                padding: '8px 16px',
                                                background: '#6b7280',
                                                border: 'none',
                                                borderRadius: '4px',
                                                color: 'white',
                                                fontSize: '12px',
                                                cursor: 'pointer'
                                            }, children: "Back" })), creationStep === 'confirm' ? (_jsx("button", { onClick: createWorkspace, disabled: !newWorkspaceName.trim(), style: {
                                                padding: '8px 16px',
                                                background: '#10b981',
                                                border: 'none',
                                                borderRadius: '4px',
                                                color: 'white',
                                                fontSize: '12px',
                                                cursor: newWorkspaceName.trim() ? 'pointer' : 'not-allowed',
                                                opacity: newWorkspaceName.trim() ? 1 : 0.6
                                            }, children: "Create" })) : (_jsx("button", { onClick: nextCreationStep, disabled: creationStep === 'name' && !newWorkspaceName.trim(), style: {
                                                padding: '8px 16px',
                                                background: '#3b82f6',
                                                border: 'none',
                                                borderRadius: '4px',
                                                color: 'white',
                                                fontSize: '12px',
                                                cursor: (creationStep === 'name' && !newWorkspaceName.trim()) ? 'not-allowed' : 'pointer',
                                                opacity: (creationStep === 'name' && !newWorkspaceName.trim()) ? 0.6 : 1
                                            }, children: "Next" }))] })] })] }) })), selectedWorkspace && (_jsxs("div", { style: { borderTop: '1px solid #334155', paddingTop: '16px' }, children: [_jsxs("h4", { style: { margin: '0 0 12px 0', fontSize: '14px' }, children: ["Workspace: ", selectedWorkspace.name] }), _jsxs("div", { style: { fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }, children: [_jsxs("div", { children: [_jsx("strong", { children: "Center:" }), " ", selectedWorkspace.center.latitude.toFixed(6), ", ", selectedWorkspace.center.longitude.toFixed(6)] }), _jsxs("div", { children: [_jsx("strong", { children: "Bounds:" }), " ", selectedWorkspace.bounds.north.toFixed(4), "N to ", selectedWorkspace.bounds.south.toFixed(4), "S, ", selectedWorkspace.bounds.west.toFixed(4), "W to ", selectedWorkspace.bounds.east.toFixed(4), "E"] }), _jsxs("div", { children: [_jsx("strong", { children: "Area:" }), " ", (selectedWorkspace.area / 1000000).toFixed(2), " km\u00B2"] }), _jsxs("div", { children: [_jsx("strong", { children: "Elevation:" }), " ", selectedWorkspace.elevation, "m"] })] }), _jsxs("div", { style: { marginBottom: '12px' }, children: [_jsx("button", { onClick: () => setShowMapOverlay(!showMapOverlay), style: {
                                    padding: '6px 12px',
                                    background: '#6b7280',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: 'white',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }, children: showMapOverlay ? 'Hide Map Overlay' : 'Add Map Overlay' }), showMapOverlay && (_jsxs("div", { style: { marginTop: '8px' }, children: [_jsx("input", { type: "text", value: mapImageUrl, onChange: (e) => setMapImageUrl(e.target.value), placeholder: "Map image URL", style: {
                                            width: '100%',
                                            padding: '6px',
                                            background: '#334155',
                                            border: '1px solid #475569',
                                            borderRadius: '4px',
                                            color: '#f1f5f9',
                                            fontSize: '12px',
                                            marginBottom: '8px'
                                        } }), _jsx("button", { onClick: addMapOverlay, disabled: !mapImageUrl.trim(), style: {
                                            padding: '6px 12px',
                                            background: '#10b981',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: 'white',
                                            fontSize: '12px',
                                            cursor: mapImageUrl.trim() ? 'pointer' : 'not-allowed',
                                            opacity: mapImageUrl.trim() ? 1 : 0.6
                                        }, children: "Apply Overlay" })] }))] })] }))] }));
};
export default GeoWorkspaceArea;
