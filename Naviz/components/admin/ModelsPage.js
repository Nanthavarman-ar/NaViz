import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useApp } from '../../contexts/AppContext';
import { useApi, apiCall } from '../../hooks/useApi';
import { Search, Grid, List, Eye, Edit, Trash2, Users, Download, Calendar, FileType, HardDrive, LogOut } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
// Mock models data
const mockModels = [
    {
        id: 1,
        name: 'Modern Conference Table',
        description: 'High-poly conference table with premium materials',
        thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
        tags: ['furniture', 'office', 'modern'],
        uploadDate: '2025-01-15',
        uploader: 'admin',
        size: '12.4 MB',
        format: 'glTF',
        assignedClients: ['client1', 'client2'],
        views: 45
    },
    {
        id: 2,
        name: 'Executive Office Chair',
        description: 'Ergonomic executive chair with leather finish',
        thumbnail: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=200&fit=crop',
        tags: ['furniture', 'chair', 'leather'],
        uploadDate: '2025-01-14',
        uploader: 'admin',
        size: '8.7 MB',
        format: 'glTF',
        assignedClients: ['client1'],
        views: 32
    },
    {
        id: 3,
        name: 'Reception Desk Setup',
        description: 'Complete reception area with desk and seating',
        thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop',
        tags: ['furniture', 'reception', 'complete'],
        uploadDate: '2025-01-12',
        uploader: 'admin',
        size: '24.1 MB',
        format: 'glTF',
        assignedClients: ['client2'],
        views: 28
    },
    {
        id: 4,
        name: 'Meeting Room Setup',
        description: 'Full meeting room with table, chairs, and decor',
        thumbnail: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=300&h=200&fit=crop',
        tags: ['room', 'meeting', 'complete'],
        uploadDate: '2025-01-10',
        uploader: 'admin',
        size: '45.3 MB',
        format: 'glTF',
        assignedClients: ['client1', 'client2'],
        views: 67
    },
    {
        id: 5,
        name: 'Modern Sofa Set',
        description: 'Modular sofa set with multiple configurations',
        thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop',
        tags: ['furniture', 'sofa', 'modular'],
        uploadDate: '2025-01-08',
        uploader: 'admin',
        size: '18.9 MB',
        format: 'glTF',
        assignedClients: [],
        views: 15
    },
    {
        id: 6,
        name: 'Standing Desk',
        description: 'Adjustable height standing desk with cable management',
        thumbnail: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=300&h=200&fit=crop',
        tags: ['furniture', 'desk', 'adjustable'],
        uploadDate: '2025-01-05',
        uploader: 'admin',
        size: '6.2 MB',
        format: 'glTF',
        assignedClients: ['client1'],
        views: 23
    }
];
export function ModelsPage() {
    const navigate = useNavigate();
    const { setCurrentPage, setSelectedModel } = useApp();
    // For admin dashboard navigation, we need to use a different approach
    const navigateToUpload = () => {
        // This will be handled by the parent AdminDashboard component
        window.dispatchEvent(new CustomEvent('navigate-admin', { detail: { view: 'upload' } }));
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedModels, setSelectedModels] = useState([]);
    // Fetch models from backend
    const { data: modelsResponse, loading, error, refetch } = useApi('/models');
    const [models, setModels] = useState(mockModels);
    // Use API data if available, otherwise use mock data
    React.useEffect(() => {
        if (modelsResponse?.models) {
            setModels(modelsResponse.models);
        }
    }, [modelsResponse]);
    const filteredModels = models.filter(model => {
        const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            model.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        if (selectedFilter === 'all')
            return matchesSearch;
        if (selectedFilter === 'assigned')
            return matchesSearch && model.assignedClients.length > 0;
        if (selectedFilter === 'unassigned')
            return matchesSearch && model.assignedClients.length === 0;
        return matchesSearch;
    });
    const handleViewModel = async (model) => {
        try {
            // Record the view
            await apiCall(`/models/${model.id}/view`, { method: 'POST' });
            setSelectedModel(model);
            setCurrentPage('babylon-workspace');
        }
        catch (error) {
            console.error('Failed to record view:', error);
            setSelectedModel(model);
            setCurrentPage('babylon-workspace');
        }
    };
    const handleSelectModel = (modelId) => {
        const idStr = modelId.toString();
        setSelectedModels(prev => prev.includes(idStr)
            ? prev.filter(id => id !== idStr)
            : [...prev, idStr]);
    };
    const handleDeleteModel = async (modelId) => {
        const model = models.find(m => m.id.toString() === modelId.toString());
        if (!confirm(`Delete "${model?.name}"? This action cannot be undone.`)) {
            return;
        }
        try {
            // Try API call first
            await apiCall(`/models/${modelId}`, { method: 'DELETE' });
            refetch();
        }
        catch (error) {
            // Fallback to local state update
            setModels(prev => prev.filter(m => m.id.toString() !== modelId.toString()));
            console.log('Model deleted from local state');
        }
    };
    const handleEditModel = (modelId) => {
        const model = models.find(m => m.id.toString() === modelId.toString());
        const newName = prompt('Enter new model name:', model?.name);
        if (newName && newName.trim()) {
            setModels(prev => prev.map(m => m.id.toString() === modelId.toString()
                ? { ...m, name: newName.trim() }
                : m));
            console.log('Model renamed successfully');
        }
    };
    const [assignDialog, setAssignDialog] = useState({ open: false, modelId: null, searchTerm: '', selectedClients: [] });
    const availableClients = [
        { id: 'client1', name: 'John Smith', email: 'john@company.com', company: 'Smith Industries' },
        { id: 'client2', name: 'Sarah Johnson', email: 'sarah@design.com', company: 'Johnson Design' },
        { id: 'client3', name: 'Michael Brown', email: 'mike@architects.com', company: 'Brown Architects' },
        { id: 'client4', name: 'Emily Davis', email: 'emily@interiors.com', company: 'Davis Interiors' }
    ];
    const handleAssignModel = (modelId) => {
        setAssignDialog({ open: true, modelId, searchTerm: '', selectedClients: [] });
    };
    const confirmAssignment = () => {
        const { modelId, selectedClients } = assignDialog;
        if (modelId) {
            setModels(prev => prev.map(m => {
                if (m.id.toString() === modelId.toString()) {
                    const newClients = [...new Set([...m.assignedClients, ...selectedClients])];
                    return { ...m, assignedClients: newClients };
                }
                return m;
            }));
            console.log(`Model assigned to ${selectedClients.length} clients`);
        }
        setAssignDialog({ open: false, modelId: null, searchTerm: '', selectedClients: [] });
    };
    const filteredClients = availableClients.filter(client => client.name.toLowerCase().includes(assignDialog.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(assignDialog.searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(assignDialog.searchTerm.toLowerCase()));
    const handleDownloadModel = (modelId) => {
        const model = models.find(m => m.id.toString() === modelId.toString());
        // Simulate download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `${model?.name || 'model'}.glb`;
        console.log(`Downloading ${model?.name}`);
    };
    const handleBulkAssign = () => {
        const clientCount = selectedModels.length;
        selectedModels.forEach(modelId => handleAssignModel(modelId));
        setSelectedModels([]);
        console.log(`${clientCount} models assigned to clients`);
    };
    const handleBulkDelete = () => {
        if (!confirm(`Delete ${selectedModels.length} selected models? This cannot be undone.`))
            return;
        setModels(prev => prev.filter(m => !selectedModels.includes(m.id.toString())));
        setSelectedModels([]);
        console.log(`${selectedModels.length} models deleted`);
    };
    const handleBulkExport = () => {
        console.log(`Exporting ${selectedModels.length} models`);
        setSelectedModels([]);
    };
    const bulkActions = [
        { label: 'Assign to Clients', action: handleBulkAssign },
        { label: 'Delete Selected', action: handleBulkDelete, dangerous: true },
        { label: 'Export Selected', action: handleBulkExport }
    ];
    if (loading) {
        return (_jsx("div", { className: "space-y-6", children: _jsx("div", { className: "flex items-center justify-center py-12", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { className: "text-white text-lg", children: "Loading models..." })] }) }) }));
    }
    if (error) {
        return (_jsx("div", { className: "space-y-6", children: _jsx("div", { className: "flex items-center justify-center py-12", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-red-400 text-lg mb-4", children: "Failed to load models" }), _jsx("p", { className: "text-gray-400 mb-4", children: error }), _jsx(Button, { onClick: refetch, variant: "outline", children: "Try Again" })] }) }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-white", children: "Models Management" }), _jsx("p", { className: "text-gray-400", children: "Manage your 3D model library" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { onClick: navigateToUpload, className: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400", children: "Upload New Model" }), _jsxs(Button, { onClick: () => navigate('/login'), className: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-red-500/25 transform hover:scale-105 transition-all duration-300", children: [_jsx(LogOut, { className: "w-4 h-4 mr-2" }), "Back to Login"] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-center", children: [_jsx("div", { className: "flex-1 max-w-md", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx(Input, { placeholder: "Search models...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400" })] }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("select", { value: selectedFilter, onChange: (e) => setSelectedFilter(e.target.value), className: "bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2", "aria-label": "Filter models", children: [_jsx("option", { value: "all", children: "All Models" }), _jsx("option", { value: "assigned", children: "Assigned" }), _jsx("option", { value: "unassigned", children: "Unassigned" })] }), _jsxs("div", { className: "flex border border-slate-600 rounded-lg overflow-hidden", children: [_jsx(Button, { variant: viewMode === 'grid' ? 'default' : 'ghost', size: "sm", onClick: () => setViewMode('grid'), className: "rounded-none", children: _jsx(Grid, { className: "w-4 h-4" }) }), _jsx(Button, { variant: viewMode === 'list' ? 'default' : 'ghost', size: "sm", onClick: () => setViewMode('list'), className: "rounded-none", children: _jsx(List, { className: "w-4 h-4" }) })] })] })] }), selectedModels.length > 0 && (_jsx("div", { className: "bg-slate-800/50 border border-slate-700 rounded-lg p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("p", { className: "text-white", children: [selectedModels.length, " model", selectedModels.length > 1 ? 's' : '', " selected"] }), _jsx("div", { className: "flex gap-2", children: bulkActions.map((action, index) => (_jsx(Button, { variant: "outline", size: "sm", onClick: action.action, className: action.dangerous ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-white' : '', children: action.label }, index))) })] }) })), viewMode === 'grid' ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: filteredModels.map((model) => (_jsxs(Card, { className: "bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 group", children: [_jsxs("div", { className: "aspect-video relative overflow-hidden rounded-t-lg", children: [_jsx("input", { type: "checkbox", checked: selectedModels.includes(model.id.toString()), onChange: () => handleSelectModel(model.id), className: "absolute top-2 left-2 z-10 w-4 h-4", "aria-label": "Select model" }), _jsx(ImageWithFallback, { src: model.thumbnail || `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop`, alt: model.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("div", { className: "absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300", children: [_jsx(Button, { onClick: () => handleViewModel(model), size: "sm", className: "bg-cyan-500 hover:bg-cyan-400", children: _jsx(Eye, { className: "w-3 h-3" }) }), _jsx(Button, { onClick: () => handleEditModel(model.id), size: "sm", variant: "outline", className: "border-white text-white hover:bg-white hover:text-black", children: _jsx(Edit, { className: "w-3 h-3" }) }), _jsx(Button, { onClick: () => handleDeleteModel(model.id), size: "sm", variant: "outline", className: "border-red-400 text-red-400 hover:bg-red-400 hover:text-white", children: _jsx(Trash2, { className: "w-3 h-3" }) })] })] }), _jsxs(CardHeader, { className: "pb-2", children: [_jsx(CardTitle, { className: "text-white text-lg", children: model.name }), _jsx(CardDescription, { className: "text-gray-400 text-sm line-clamp-2", children: model.description })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex flex-wrap gap-1", children: model.tags.map((tag) => (_jsx(Badge, { variant: "outline", className: "text-xs border-slate-600 text-gray-400", children: tag }, tag))) }), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3" }), new Date(model.uploadDate).toLocaleDateString()] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(HardDrive, { className: "w-3 h-3" }), model.size] })] }), _jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsxs("span", { className: "flex items-center gap-1 text-purple-400", children: [_jsx(Users, { className: "w-3 h-3" }), model.assignedClients.length, " client", model.assignedClients.length !== 1 ? 's' : ''] }), _jsxs("span", { className: "text-gray-500", children: [model.views, " views"] })] })] }) })] }, model.id))) })) : (_jsx("div", { className: "space-y-4", children: filteredModels.map((model) => (_jsx(Card, { className: "bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("input", { type: "checkbox", checked: selectedModels.includes(model.id.toString()), onChange: () => handleSelectModel(model.id), className: "w-4 h-4", "aria-label": "Select model" }), _jsx("div", { className: "w-16 h-16 rounded-lg overflow-hidden flex-shrink-0", children: _jsx(ImageWithFallback, { src: model.thumbnail, alt: model.name, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "text-white font-medium mb-1", children: model.name }), _jsx("p", { className: "text-gray-400 text-sm mb-2 line-clamp-1", children: model.description }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3" }), new Date(model.uploadDate).toLocaleDateString()] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(HardDrive, { className: "w-3 h-3" }), model.size] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FileType, { className: "w-3 h-3" }), model.format] }), _jsxs("span", { className: "flex items-center gap-1 text-purple-400", children: [_jsx(Users, { className: "w-3 h-3" }), model.assignedClients.length, " clients"] }), _jsxs("span", { children: [model.views, " views"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { onClick: () => handleViewModel(model), size: "sm", className: "bg-cyan-500 hover:bg-cyan-400", children: [_jsx(Eye, { className: "w-4 h-4 mr-1" }), "View"] }), _jsxs(Button, { onClick: () => handleEditModel(model.id), size: "sm", variant: "outline", className: "border-slate-600", children: [_jsx(Edit, { className: "w-4 h-4 mr-1" }), "Edit"] }), _jsxs(Button, { onClick: () => handleAssignModel(model.id), size: "sm", variant: "outline", className: "border-green-400 text-green-400 hover:bg-green-400 hover:text-white", children: [_jsx(Users, { className: "w-4 h-4 mr-1" }), "Assign"] }), _jsxs(Button, { onClick: () => handleDownloadModel(model.id), size: "sm", variant: "outline", className: "border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white", children: [_jsx(Download, { className: "w-4 h-4 mr-1" }), "Download"] }), _jsx(Button, { size: "sm", variant: "outline", className: "border-red-400 text-red-400 hover:bg-red-400 hover:text-white", onClick: () => handleDeleteModel(model.id), children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }) }) }, model.id))) })), filteredModels.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "text-gray-400 text-lg mb-2", children: "No models found" }), _jsx("p", { className: "text-gray-500", children: "Try adjusting your search terms or filters" })] })), _jsx(Dialog, { open: assignDialog.open, onOpenChange: (open) => setAssignDialog(prev => ({ ...prev, open })), children: _jsxs(DialogContent, { className: "bg-slate-800 border-slate-700 text-white max-w-md", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Assign Model to Clients" }), _jsx(DialogDescription, { children: "Search and select clients to assign this model to." })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "clientSearch", children: "Search Clients" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx(Input, { id: "clientSearch", placeholder: "Search by name, email, or company...", value: assignDialog.searchTerm, onChange: (e) => setAssignDialog(prev => ({ ...prev, searchTerm: e.target.value })), className: "pl-10 bg-slate-700 border-slate-600" })] })] }), _jsxs("div", { className: "max-h-60 overflow-y-auto space-y-2", children: [filteredClients.map((client) => {
                                            const currentModel = models.find(m => m.id.toString() === assignDialog.modelId?.toString());
                                            const isAlreadyAssigned = currentModel?.assignedClients.includes(client.id);
                                            const isSelected = assignDialog.selectedClients.includes(client.id);
                                            return (_jsxs("div", { className: "flex items-center space-x-3 p-2 bg-slate-700/30 rounded", children: [_jsx("input", { type: "checkbox", id: `client-${client.id}`, checked: isSelected, disabled: isAlreadyAssigned, onChange: (e) => {
                                                            const selected = assignDialog.selectedClients;
                                                            setAssignDialog(prev => ({
                                                                ...prev,
                                                                selectedClients: e.target.checked
                                                                    ? [...selected, client.id]
                                                                    : selected.filter(id => id !== client.id)
                                                            }));
                                                        }, className: "rounded border-slate-600" }), _jsxs("label", { htmlFor: `client-${client.id}`, className: "flex-1 cursor-pointer", children: [_jsx("div", { className: "text-white font-medium", children: client.name }), _jsx("div", { className: "text-sm text-gray-400", children: client.email }), _jsx("div", { className: "text-xs text-gray-500", children: client.company })] }), isAlreadyAssigned && (_jsx("span", { className: "text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded", children: "Assigned" }))] }, client.id));
                                        }), filteredClients.length === 0 && (_jsx("div", { className: "text-center py-4 text-gray-400", children: "No clients found matching your search" }))] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsxs(Button, { onClick: confirmAssignment, className: "flex-1 bg-blue-600 hover:bg-blue-700", disabled: assignDialog.selectedClients.length === 0, children: ["Assign to ", assignDialog.selectedClients.length, " Client", assignDialog.selectedClients.length !== 1 ? 's' : ''] }), _jsx(Button, { variant: "outline", onClick: () => setAssignDialog({ open: false, modelId: null, searchTerm: '', selectedClients: [] }), className: "border-slate-600", children: "Cancel" })] })] })] }) })] }));
}
