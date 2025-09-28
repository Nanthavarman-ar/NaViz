import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, Suspense, lazy } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, Box, FileText, Settings, Upload, LogOut, Home, ChevronLeft, ChevronRight } from 'lucide-react';
// Lazy load heavy components for better performance
const ClientsPage = lazy(() => import('./admin/ClientsPage.jsx').then(module => ({ default: module.ClientsPage })));
const ModelsPage = lazy(() => import('./admin/ModelsPage.jsx').then(module => ({ default: module.ModelsPage })));
const AuditLogsPage = lazy(() => import('./admin/AuditLogsPage.jsx').then(module => ({ default: module.AuditLogsPage })));
const SettingsPage = lazy(() => import('./admin/SettingsPage.jsx').then(module => ({ default: module.SettingsPage })));
const UploadPage = lazy(() => import('./admin/UploadPage.jsx').then(module => ({ default: module.UploadPage })));
export function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentView, setCurrentView] = useState('clients');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    // Determine current view from URL params
    React.useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const viewParam = urlParams.get('view');
        if (viewParam && ['clients', 'models', 'audit', 'settings', 'upload'].includes(viewParam)) {
            setCurrentView(viewParam);
        }
    }, [location.search]);
    const handleViewChange = (view) => {
        setCurrentView(view);
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('view', view);
        navigate(`/?page=admin-dashboard&${urlParams.toString()}`);
    };
    const handleLogout = () => {
        logout();
        navigate('/?page=home');
    };
    const menuItems = [
        { id: 'clients', label: 'Client Management', icon: Users, description: 'Manage client accounts' },
        { id: 'models', label: 'Models Library', icon: Box, description: 'Manage 3D models' },
        { id: 'upload', label: 'Upload Models', icon: Upload, description: 'Upload new models' },
        { id: 'audit', label: 'Audit Logs', icon: FileText, description: 'View system logs' },
        { id: 'settings', label: 'Settings', icon: Settings, description: 'System settings' }
    ];
    const renderCurrentView = () => {
        switch (currentView) {
            case 'clients':
                return _jsx(ClientsPage, {});
            case 'models':
                return _jsx(ModelsPage, {});
            case 'upload':
                return _jsx(UploadPage, {});
            case 'audit':
                return _jsx(AuditLogsPage, {});
            case 'settings':
                return _jsx(SettingsPage, {});
            default:
                return _jsx(ClientsPage, {});
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-900 flex", children: [_jsxs("div", { className: `bg-slate-800 border-r border-slate-700 transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`, children: [_jsx("div", { className: "p-4 border-b border-slate-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [!sidebarCollapsed && (_jsxs("div", { children: [_jsx("h1", { className: "text-white font-bold text-lg", children: "Admin Panel" }), _jsx("p", { className: "text-gray-400 text-sm", children: "NAVIZ Studio" })] })), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSidebarCollapsed(!sidebarCollapsed), className: "text-gray-400 hover:text-white", children: sidebarCollapsed ? _jsx(ChevronRight, { className: "w-4 h-4" }) : _jsx(ChevronLeft, { className: "w-4 h-4" }) })] }) }), _jsx("div", { className: "p-4 space-y-2", children: menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;
                            return (_jsxs(Button, { variant: isActive ? 'default' : 'ghost', className: `w-full justify-start ${isActive ? 'bg-cyan-600 hover:bg-cyan-700' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`, onClick: () => handleViewChange(item.id), children: [_jsx(Icon, { className: "w-4 h-4 mr-3" }), !sidebarCollapsed && (_jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-medium", children: item.label }), _jsx("div", { className: "text-xs opacity-75", children: item.description })] }))] }, item.id));
                        }) }), _jsx("div", { className: "absolute bottom-4 left-4 right-4", children: _jsxs(Button, { variant: "outline", className: "w-full border-slate-600 text-gray-400 hover:text-white hover:bg-slate-700", onClick: handleLogout, children: [_jsx(LogOut, { className: "w-4 h-4 mr-2" }), !sidebarCollapsed && 'Logout'] }) })] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("div", { className: "bg-slate-800 border-b border-slate-700 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/?page=home'), className: "text-gray-400 hover:text-white", children: [_jsx(Home, { className: "w-4 h-4 mr-2" }), "Back to Home"] }), _jsxs("div", { children: [_jsx("h2", { className: "text-white text-xl font-semibold", children: menuItems.find(item => item.id === currentView)?.label }), _jsx("p", { className: "text-gray-400 text-sm", children: menuItems.find(item => item.id === currentView)?.description })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Badge, { variant: "outline", className: "border-cyan-400 text-cyan-400", children: user?.role?.toUpperCase() }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-white font-medium", children: user?.name }), _jsx("p", { className: "text-gray-400 text-sm", children: user?.email })] })] })] }) }), _jsx("div", { className: "flex-1 overflow-auto", children: _jsx(Suspense, { fallback: _jsx("div", { className: "flex items-center justify-center h-full", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { className: "text-gray-400", children: "Loading..." })] }) }), children: renderCurrentView() }) })] })] }));
}
