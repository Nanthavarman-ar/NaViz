import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Vector3, PointerEventTypes, GizmoManager, UtilityLayerRenderer, StandardMaterial, Color3, MeshBuilder } from '@babylonjs/core';
import { FurnitureManager } from './managers/FurnitureManager';
// UI Components
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// Icons
import { Search, Sofa, Armchair, Bed, Table, Lamp, Box, Trash2, RotateCw, Move, Scale, Undo, Redo, Eye, Grid3X3, Target, Zap, X } from 'lucide-react';
const AutoFurnish = ({ sceneManager, onClose }) => {
    // State management
    const [furnitureManager, setFurnitureManager] = useState(null);
    const [activeTab, setActiveTab] = useState('catalog');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [furnitureItems, setFurnitureItems] = useState([]);
    const [placedFurniture, setPlacedFurniture] = useState([]);
    const [selectedFurniture, setSelectedFurniture] = useState(null);
    const [selectedPlacedItem, setSelectedPlacedItem] = useState(null);
    const [placementMode, setPlacementMode] = useState('manual');
    const [isPlacing, setIsPlacing] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    // Workspace area state
    const [isPlacementActive, setIsPlacementActive] = useState(false);
    const [gizmoManager, setGizmoManager] = useState(null);
    const [previewMesh, setPreviewMesh] = useState(null);
    const [snapToGrid, setSnapToGrid] = useState(false);
    const [gridSize, setGridSize] = useState(0.5);
    const [collisionVisualization, setCollisionVisualization] = useState(false);
    // Refs
    const placementPreviewRef = useRef(null);
    // Initialize FurnitureManager and workspace tools
    useEffect(() => {
        if (sceneManager?.scene && !furnitureManager) {
            const manager = new FurnitureManager(sceneManager.scene);
            setFurnitureManager(manager);
            // Initialize gizmo manager for manipulation
            const utilityLayer = new UtilityLayerRenderer(sceneManager.scene);
            const gizmoMgr = new GizmoManager(sceneManager.scene, 2, utilityLayer);
            gizmoMgr.positionGizmoEnabled = true;
            gizmoMgr.rotationGizmoEnabled = true;
            gizmoMgr.scaleGizmoEnabled = true;
            gizmoMgr.boundingBoxGizmoEnabled = false;
            setGizmoManager(gizmoMgr);
            // Load initial furniture items
            updateFurnitureItems();
            updatePlacedFurniture();
        }
        return () => {
            if (gizmoManager) {
                gizmoManager.dispose();
            }
            if (furnitureManager) {
                furnitureManager.dispose();
            }
            if (previewMesh) {
                previewMesh.dispose();
            }
        };
    }, [sceneManager, furnitureManager]);
    // Update furniture items based on filters
    const updateFurnitureItems = () => {
        if (!furnitureManager)
            return;
        let items = [];
        if (searchQuery) {
            items = furnitureManager.searchFurniture(searchQuery);
        }
        else if (selectedCategory !== 'all') {
            items = furnitureManager.getFurnitureByCategory(selectedCategory);
        }
        else if (selectedBrand !== 'all') {
            items = furnitureManager.getFurnitureByBrand(selectedBrand);
        }
        else {
            // Get all items
            const categories = furnitureManager.getCategories();
            categories.forEach(category => {
                items.push(...furnitureManager.getFurnitureByCategory(category));
            });
        }
        setFurnitureItems(items);
    };
    // Update placed furniture list
    const updatePlacedFurniture = () => {
        if (!furnitureManager)
            return;
        setPlacedFurniture(furnitureManager.getPlacedFurniture());
    };
    // Handle search and filter changes
    useEffect(() => {
        updateFurnitureItems();
    }, [searchQuery, selectedCategory, selectedBrand, furnitureManager]);
    // Create preview mesh for selected furniture
    const createPreviewMesh = useCallback(() => {
        if (!selectedFurniture || !sceneManager?.scene)
            return;
        // Dispose existing preview
        if (previewMesh) {
            previewMesh.dispose();
        }
        // Create a simple box preview with dimensions
        const { width, height, depth } = selectedFurniture.dimensions;
        const mesh = MeshBuilder.CreateBox('furniturePreview', {
            width: width,
            height: height,
            depth: depth
        }, sceneManager.scene);
        const material = new StandardMaterial('previewMaterial', sceneManager.scene);
        material.diffuseColor = new Color3(0, 1, 0);
        material.alpha = 0.5;
        mesh.material = material;
        mesh.isPickable = false;
        setPreviewMesh(mesh);
    }, [selectedFurniture, sceneManager, previewMesh]);
    // Update preview position
    const updatePreviewPosition = useCallback((position) => {
        if (previewMesh) {
            let finalPosition = position.clone();
            if (snapToGrid) {
                finalPosition.x = Math.round(finalPosition.x / gridSize) * gridSize;
                finalPosition.z = Math.round(finalPosition.z / gridSize) * gridSize;
            }
            previewMesh.position = finalPosition;
            // Update material based on clearance
            if (furnitureManager && selectedFurniture) {
                const isClear = furnitureManager.checkClearance(finalPosition, selectedFurniture.dimensions);
                const material = previewMesh.material;
                material.diffuseColor = isClear ? new Color3(0, 1, 0) : new Color3(1, 0, 0);
            }
        }
    }, [previewMesh, snapToGrid, gridSize, furnitureManager, selectedFurniture]);
    // Handle scene pointer events for placement
    useEffect(() => {
        if (!sceneManager?.scene || !isPlacementActive || placementMode !== 'manual')
            return;
        const handlePointerDown = (pointerInfo) => {
            if (pointerInfo.type === PointerEventTypes.POINTERDOWN && pointerInfo.pickInfo?.hit) {
                const pickInfo = pointerInfo.pickInfo;
                if (pickInfo.pickedPoint && selectedFurniture && furnitureManager) {
                    const position = pickInfo.pickedPoint.clone();
                    position.y = 0; // Place on ground
                    if (furnitureManager.checkClearance(position, selectedFurniture.dimensions)) {
                        furnitureManager.placeFurniture(position).then(() => {
                            updatePlacedFurniture();
                        });
                    }
                }
            }
        };
        const handlePointerMove = (pointerInfo) => {
            if (pointerInfo.type === PointerEventTypes.POINTERMOVE && pointerInfo.pickInfo?.hit && previewMesh) {
                const pickInfo = pointerInfo.pickInfo;
                if (pickInfo.pickedPoint) {
                    const position = pickInfo.pickedPoint.clone();
                    position.y = selectedFurniture ? selectedFurniture.dimensions.height / 2 : 0;
                    updatePreviewPosition(position);
                }
            }
        };
        const observerDown = sceneManager.scene.onPointerObservable.add(handlePointerDown);
        const observerMove = sceneManager.scene.onPointerObservable.add(handlePointerMove);
        return () => {
            sceneManager.scene.onPointerObservable.remove(observerDown);
            sceneManager.scene.onPointerObservable.remove(observerMove);
        };
    }, [sceneManager, isPlacementActive, placementMode, selectedFurniture, furnitureManager, previewMesh, updatePreviewPosition]);
    // Handle furniture selection with preview
    const handleFurnitureSelect = (item) => {
        setSelectedFurniture(item);
        if (furnitureManager) {
            furnitureManager.selectFurniture(item.id);
        }
        if (isPlacementActive && placementMode === 'manual') {
            createPreviewMesh();
        }
    };
    // Toggle placement mode
    const togglePlacementMode = () => {
        const newActive = !isPlacementActive;
        setIsPlacementActive(newActive);
        if (newActive && placementMode === 'manual' && selectedFurniture) {
            createPreviewMesh();
        }
        else if (!newActive && previewMesh) {
            previewMesh.dispose();
            setPreviewMesh(null);
        }
    };
    // Handle furniture placement
    const handlePlaceFurniture = async () => {
        if (!furnitureManager || !selectedFurniture)
            return;
        setIsPlacing(true);
        setLoadingProgress(0);
        try {
            if (placementMode === 'auto') {
                // Auto-placement logic (simplified - would need room analysis)
                const positions = [
                    new Vector3(-2, 0, 0),
                    new Vector3(2, 0, 0),
                    new Vector3(0, 0, -2),
                    new Vector3(0, 0, 2)
                ];
                for (let i = 0; i < Math.min(4, furnitureItems.length); i++) {
                    setLoadingProgress((i / Math.min(4, furnitureItems.length)) * 100);
                    const item = furnitureItems[i];
                    furnitureManager.selectFurniture(item.id);
                    const position = positions[i % positions.length];
                    if (furnitureManager.checkClearance(position, item.dimensions)) {
                        await furnitureManager.placeFurniture(position);
                    }
                }
            }
            else {
                // Manual placement - place at center for now
                const position = new Vector3(0, 0, 0);
                if (furnitureManager.checkClearance(position, selectedFurniture.dimensions)) {
                    await furnitureManager.placeFurniture(position);
                }
            }
            updatePlacedFurniture();
            setLoadingProgress(100);
        }
        catch (error) {
            console.error('Failed to place furniture:', error);
        }
        finally {
            setIsPlacing(false);
            setTimeout(() => setLoadingProgress(0), 1000);
        }
    };
    // Handle placed furniture selection with gizmos
    const handlePlacedItemSelect = (item) => {
        setSelectedPlacedItem(item);
        if (gizmoManager) {
            // Attach gizmo to the first child mesh of the transform node
            const childMeshes = item.mesh.getChildMeshes();
            if (childMeshes.length > 0) {
                gizmoManager.attachToMesh(childMeshes[0]);
            }
            else {
                gizmoManager.attachToMesh(null);
            }
        }
    };
    // Handle furniture removal
    const handleRemoveFurniture = (placedId) => {
        if (furnitureManager) {
            furnitureManager.removeFurniture(placedId);
            updatePlacedFurniture();
            if (selectedPlacedItem?.id === placedId) {
                setSelectedPlacedItem(null);
            }
        }
    };
    // Clear all furniture
    const handleClearAll = () => {
        if (furnitureManager) {
            furnitureManager.clearAllFurniture();
            updatePlacedFurniture();
            setSelectedPlacedItem(null);
        }
    };
    // Get category icon
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'chair': return _jsx(Armchair, { className: "w-4 h-4" });
            case 'table': return _jsx(Table, { className: "w-4 h-4" });
            case 'sofa': return _jsx(Sofa, { className: "w-4 h-4" });
            case 'bed': return _jsx(Bed, { className: "w-4 h-4" });
            case 'lamp': return _jsx(Lamp, { className: "w-4 h-4" });
            default: return _jsx(Box, { className: "w-4 h-4" });
        }
    };
    // Render furniture item card
    const renderFurnitureCard = (item) => (_jsx(Card, { className: `cursor-pointer transition-all hover:shadow-md ${selectedFurniture?.id === item.id ? 'ring-2 ring-blue-500' : ''}`, onClick: () => handleFurnitureSelect(item), children: _jsxs(CardContent, { className: "p-3", children: [_jsx("div", { className: "aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center", children: getCategoryIcon(item.category) }), _jsx("h4", { className: "font-medium text-sm truncate", children: item.name }), _jsx("p", { className: "text-xs text-gray-500", children: item.brand }), _jsxs("div", { className: "flex items-center justify-between mt-2", children: [_jsxs(Badge, { variant: "secondary", className: "text-xs", children: ["$", item.price] }), _jsx(Badge, { variant: "outline", className: "text-xs", children: item.category })] })] }) }, item.id));
    // Render placed furniture item
    const renderPlacedItem = (item) => (_jsx("div", { className: `p-3 border rounded cursor-pointer transition-all ${selectedPlacedItem?.id === item.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`, onClick: () => handlePlacedItemSelect(item), children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [getCategoryIcon(item.item.category), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: item.item.name }), _jsxs("p", { className: "text-xs text-gray-500", children: [item.position.x.toFixed(1), ", ", item.position.y.toFixed(1), ", ", item.position.z.toFixed(1)] })] })] }), _jsx(Button, { size: "sm", variant: "ghost", onClick: (e) => {
                        e.stopPropagation();
                        handleRemoveFurniture(item.id);
                    }, children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) }, item.id));
    return (_jsxs("div", { className: "absolute top-0 right-0 w-96 h-full bg-gray-900 text-white z-50 flex flex-col", children: [_jsxs("div", { className: "flex justify-between items-center p-4 border-b border-gray-700", children: [_jsx("h2", { className: "text-lg font-bold", children: "Auto Furnish" }), _jsx(Button, { size: "sm", variant: "ghost", onClick: onClose, children: _jsx(X, { className: "w-4 h-4" }) })] }), isPlacing && (_jsxs("div", { className: "px-4 py-2", children: [_jsx(Progress, { value: loadingProgress, className: "w-full" }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "Placing furniture..." })] })), _jsx("div", { className: "flex-1 overflow-hidden", children: _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "h-full flex flex-col", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3 mx-4 mt-4", children: [_jsx(TabsTrigger, { value: "catalog", children: "Catalog" }), _jsx(TabsTrigger, { value: "place", children: "Place" }), _jsx(TabsTrigger, { value: "manage", children: "Manage" })] }), _jsx(TabsContent, { value: "catalog", className: "flex-1 px-4 pb-4 mt-4 overflow-hidden", children: _jsxs("div", { className: "space-y-4 h-full flex flex-col", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), _jsx(Input, { placeholder: "Search furniture...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Select, { value: selectedCategory, onValueChange: setSelectedCategory, children: [_jsx(SelectTrigger, { className: "flex-1", children: _jsx(SelectValue, { placeholder: "Category" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Categories" }), furnitureManager?.getCategories().map(category => (_jsx(SelectItem, { value: category, children: category.charAt(0).toUpperCase() + category.slice(1) }, category)))] })] }), _jsxs(Select, { value: selectedBrand, onValueChange: setSelectedBrand, children: [_jsx(SelectTrigger, { className: "flex-1", children: _jsx(SelectValue, { placeholder: "Brand" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Brands" }), furnitureManager && (_jsx(_Fragment, { children: Array.from(new Set(furnitureItems.map(item => item.brand))).map(brand => (_jsx(SelectItem, { value: brand, children: brand }, brand))) }))] })] })] })] }), _jsxs(ScrollArea, { className: "flex-1", children: [_jsx("div", { className: "grid grid-cols-2 gap-3", children: furnitureItems.map(renderFurnitureCard) }), furnitureItems.length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-400", children: "No furniture found matching your criteria" }))] })] }) }), _jsx(TabsContent, { value: "place", className: "flex-1 px-4 pb-4 mt-4 overflow-hidden", children: _jsxs("div", { className: "space-y-4 h-full flex flex-col", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-medium", children: "Placement Mode" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { size: "sm", variant: placementMode === 'manual' ? 'default' : 'outline', onClick: () => setPlacementMode('manual'), children: [_jsx(Target, { className: "w-4 h-4 mr-1" }), "Manual"] }), _jsxs(Button, { size: "sm", variant: placementMode === 'auto' ? 'default' : 'outline', onClick: () => setPlacementMode('auto'), children: [_jsx(Zap, { className: "w-4 h-4 mr-1" }), "Auto"] })] })] }), selectedFurniture && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-3", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [getCategoryIcon(selectedFurniture.category), _jsx("span", { className: "font-medium", children: selectedFurniture.name })] }), _jsxs("div", { className: "text-sm text-gray-600 space-y-1", children: [_jsxs("p", { children: ["Brand: ", selectedFurniture.brand] }), _jsxs("p", { children: ["Dimensions: ", selectedFurniture.dimensions.width, "\" \u00D7 ", selectedFurniture.dimensions.height, "\" \u00D7 ", selectedFurniture.dimensions.depth, "\""] }), _jsxs("p", { children: ["Price: $", selectedFurniture.price] })] })] }) })), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-medium", children: "Workspace Tools" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs(Button, { size: "sm", variant: isPlacementActive ? 'default' : 'outline', onClick: togglePlacementMode, disabled: !selectedFurniture, children: [_jsx(Target, { className: "w-4 h-4 mr-1" }), isPlacementActive ? 'Exit Place Mode' : 'Enter Place Mode'] }), _jsxs(Button, { size: "sm", variant: snapToGrid ? 'default' : 'outline', onClick: () => setSnapToGrid(!snapToGrid), children: [_jsx(Grid3X3, { className: "w-4 h-4 mr-1" }), "Snap Grid"] })] }), snapToGrid && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm", children: "Grid Size:" }), _jsx(Input, { type: "number", value: gridSize, onChange: (e) => setGridSize(parseFloat(e.target.value) || 0.5), className: "w-20", min: "0.1", step: "0.1" })] })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "collisionViz", checked: collisionVisualization, onChange: (e) => setCollisionVisualization(e.target.checked) }), _jsx("label", { htmlFor: "collisionViz", className: "text-sm", children: "Collision Visualization" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "checkbox", id: "showPreview", checked: showPreview, onChange: (e) => setShowPreview(e.target.checked) }), _jsx("label", { htmlFor: "showPreview", className: "text-sm", children: "Show placement preview" })] }), _jsx(Button, { onClick: handlePlaceFurniture, disabled: !selectedFurniture || isPlacing, className: "w-full", children: placementMode === 'auto' ? 'Auto-Place Furniture' : 'Place Selected Furniture' })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "font-medium", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs(Button, { size: "sm", variant: "outline", children: [_jsx(Grid3X3, { className: "w-4 h-4 mr-1" }), "Snap to Grid"] }), _jsxs(Button, { size: "sm", variant: "outline", children: [_jsx(Eye, { className: "w-4 h-4 mr-1" }), "Toggle Preview"] })] })] })] }) }), _jsx(TabsContent, { value: "manage", className: "flex-1 px-4 pb-4 mt-4 overflow-hidden", children: _jsxs("div", { className: "space-y-4 h-full flex flex-col", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: placedFurniture.length }), _jsx("div", { className: "text-sm text-gray-400", children: "Placed Items" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-3 text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: furnitureItems.length }), _jsx("div", { className: "text-sm text-gray-400", children: "Available Items" })] }) })] }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-medium", children: "Placed Furniture" }), _jsxs(Button, { size: "sm", variant: "outline", onClick: handleClearAll, children: [_jsx(Trash2, { className: "w-4 h-4 mr-1" }), "Clear All"] })] }), _jsx(ScrollArea, { className: "h-64", children: _jsxs("div", { className: "space-y-2", children: [placedFurniture.map(renderPlacedItem), placedFurniture.length === 0 && (_jsx("div", { className: "text-center py-8 text-gray-400", children: "No furniture placed yet" }))] }) })] }), selectedPlacedItem && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-sm", children: ["Selected: ", selectedPlacedItem.item.name] }) }), _jsxs(CardContent, { className: "space-y-2", children: [_jsxs("div", { className: "grid grid-cols-3 gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", children: _jsx(Move, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "outline", children: _jsx(RotateCw, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "outline", children: _jsx(Scale, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { size: "sm", variant: "outline", className: "flex-1", children: [_jsx(Undo, { className: "w-4 h-4 mr-1" }), "Undo"] }), _jsxs(Button, { size: "sm", variant: "outline", className: "flex-1", children: [_jsx(Redo, { className: "w-4 h-4 mr-1" }), "Redo"] })] })] })] }))] }) })] }) })] }));
};
export default AutoFurnish;
