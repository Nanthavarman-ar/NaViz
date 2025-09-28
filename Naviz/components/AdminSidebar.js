import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from './ui/button';
import { cn } from './ui/utils';
import { LayoutDashboard, Box, Users, Upload, Settings, FileText, LogOut, Menu, X, TestTube } from 'lucide-react';
const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'models', label: 'Models', icon: Box },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'test-buttons', label: 'Button Tests', icon: TestTube },
];
export function Sidebar({ currentView, setCurrentView, isOpen, setIsOpen }) {
    return (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: () => setIsOpen(!isOpen), className: "lg:hidden fixed top-4 left-4 z-50 bg-slate-800 border-slate-700", size: "sm", children: isOpen ? _jsx(X, { className: "w-4 h-4" }) : _jsx(Menu, { className: "w-4 h-4" }) }), _jsxs("div", { className: cn("fixed left-0 top-0 h-full bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 transition-all duration-300 z-40", isOpen ? "w-64" : "w-16"), children: [_jsx("div", { className: "p-6 border-b border-slate-700", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center", children: _jsx("span", { className: "text-black font-bold text-lg", children: "N" }) }), isOpen && (_jsx("span", { className: "text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent", children: "NAVIZ" }))] }) }), _jsx("nav", { className: "p-4 space-y-2", children: menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentView === item.id;
                            return (_jsxs(Button, { onClick: () => setCurrentView(item.id), variant: "ghost", className: cn("w-full justify-start gap-3 h-12 transition-all duration-200", isActive
                                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400"
                                    : "text-gray-400 hover:text-white hover:bg-slate-700/50", !isOpen && "justify-center"), children: [_jsx(Icon, { className: "w-5 h-5" }), isOpen && _jsx("span", { children: item.label })] }, item.id));
                        }) }), _jsx("div", { className: "absolute bottom-4 left-4 right-4", children: _jsxs(Button, { variant: "ghost", className: cn("w-full justify-start gap-3 h-12 text-red-400 hover:text-white hover:bg-red-500/20", !isOpen && "justify-center"), children: [_jsx(LogOut, { className: "w-5 h-5" }), isOpen && _jsx("span", { children: "Logout" })] }) })] }), isOpen && (_jsx("div", { className: "lg:hidden fixed inset-0 bg-black/50 z-30", onClick: () => setIsOpen(false) }))] }));
}
