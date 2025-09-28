import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { ChevronRight, Eye, Smartphone, Move, MousePointer, Monitor, Tablet, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import BabylonWorkspace from '../BabylonWorkspace';

export function HeroSection() {
    const navigate = useNavigate();
    const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
    const [modalPosition, setModalPosition] = useState({ x: 50, y: 50 });
    const [modalSize, setModalSize] = useState({ width: 375, height: 667 });
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 375, height: 667 });
    const [resizeDirection, setResizeDirection] = useState('');
    const modalRef = useRef(null);

    // Size adjustment functions
    const setSizePreset = (width, height) => {
        const maxWidth = window.innerWidth - modalPosition.x;
        const maxHeight = window.innerHeight - modalPosition.y;
        const newWidth = Math.min(width, maxWidth);
        const newHeight = Math.min(height, maxHeight);
        setModalSize({ width: newWidth, height: newHeight });
    };

    // Drag and resize handlers
    const handleMouseDown = (e) => {
        if (e.target.closest('.cursor-se-resize, .cursor-sw-resize, .cursor-ne-resize, .cursor-nw-resize, .cursor-n-resize, .cursor-s-resize, .cursor-w-resize, .cursor-e-resize')) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - modalPosition.x, y: e.clientY - modalPosition.y });
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setModalPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
        } else if (isResizing) {
            const deltaX = e.clientX - resizeStart.x;
            const deltaY = e.clientY - resizeStart.y;
            let newWidth = resizeStart.width;
            let newHeight = resizeStart.height;
            let newX = modalPosition.x;
            let newY = modalPosition.y;

            switch (resizeDirection) {
                case 'se':
                    newWidth += deltaX;
                    newHeight += deltaY;
                    break;
                case 'sw':
                    newWidth = resizeStart.width - deltaX;
                    newHeight += deltaY;
                    newX += deltaX;
                    break;
                case 'ne':
                    newWidth += deltaX;
                    newHeight = resizeStart.height - deltaY;
                    newY += deltaY;
                    break;
                case 'nw':
                    newWidth = resizeStart.width - deltaX;
                    newHeight = resizeStart.height - deltaY;
                    newX += deltaX;
                    newY += deltaY;
                    break;
                case 'n':
                    newHeight = resizeStart.height - deltaY;
                    newY += deltaY;
                    break;
                case 's':
                    newHeight += deltaY;
                    break;
                case 'w':
                    newWidth = resizeStart.width - deltaX;
                    newX += deltaX;
                    break;
                case 'e':
                    newWidth += deltaX;
                    break;
                default:
                    break;
            }

            setModalSize({ width: Math.max(200, newWidth), height: Math.max(200, newHeight) });
            setModalPosition({ x: Math.max(0, newX), y: Math.max(0, newY) });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsResizing(false);
    };

    const handleResizeMouseDown = (e, direction) => {
        setIsResizing(true);
        setResizeStart({ x: e.clientX, y: e.clientY, width: modalSize.width, height: modalSize.height });
        setResizeDirection(direction);
        e.preventDefault();
        e.stopPropagation();
    };

    // Keyboard shortcuts for size adjustment
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (workspaceModalOpen) {
                switch (e.key) {
                    case '1':
                        setSizePreset(375, 667); // Mobile
                        break;
                    case '2':
                        setSizePreset(768, 1024); // Tablet
                        break;
                    case '3':
                        setSizePreset(1200, 800); // Desktop
                        break;
                    case '4':
                        setSizePreset(1920, 1080); // Full HD
                        break;
                    case '0':
                        setSizePreset(375, 667); // Reset to mobile
                        break;
                }
            }
        };
        document.addEventListener('keydown', handleKeyPress);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [workspaceModalOpen, isDragging, isResizing, dragStart, resizeStart, resizeDirection, modalPosition, modalSize]);

    return (_jsxs("section", { className: "relative min-h-screen flex items-center", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center", children: [_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("h1", { className: "text-5xl lg:text-7xl font-bold leading-tight", children: [_jsx("span", { className: "bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent", children: "Professional" }), _jsx("br", {}), _jsx("span", { className: "text-white", children: "3D Asset" }), _jsx("br", {}), _jsx("span", { className: "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent", children: "Management" })] }), _jsx("p", { className: "text-xl text-gray-300 max-w-lg mb-6", children: "Enterprise-grade 3D model management platform with AI-powered workflows, real-time collaboration, and immersive visualization." })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsxs(Button, { onClick: () => setWorkspaceModalOpen(true), className: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-green-500/25 transform hover:scale-105 transition-all duration-300", children: ["3D Workspace", _jsx(ChevronRight, { className: "ml-2 w-5 h-5" })] }), _jsxs(Button, { onClick: () => navigate('/?page=admin-login'), className: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300", children: ["Admin Login", _jsx(ChevronRight, { className: "ml-2 w-5 h-5" })] }), _jsxs(Button, { onClick: () => navigate('/?page=client-login'), variant: "outline", className: "border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300", children: ["Client Login", _jsx(ChevronRight, { className: "ml-2 w-5 h-5" })] })] })] }), _jsx("div", { className: "relative", children: _jsxs("div", { className: "relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20", children: [_jsx("div", { className: "w-full h-80 rounded-lg bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/20 flex items-center justify-center", children: _jsxs("div", { className: "text-center space-y-4", children: [_jsx(Eye, { className: "w-16 h-16 text-cyan-400 mx-auto animate-pulse" }), _jsx("h3", { className: "text-2xl font-semibold text-white", children: "3D Viewer" })] }) }), _jsx(Button, { onClick: () => setWorkspaceModalOpen(true), className: "absolute top-4 right-4 bg-green-500 text-black px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-600 transform hover:scale-105 transition-all duration-200", children: "READY" })] }) })] }), _jsx(Dialog, { open: workspaceModalOpen, onOpenChange: setWorkspaceModalOpen, children: _jsxs(DialogContent, { ref: modalRef, className: `p-0 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`, style: {
                        position: 'fixed',
                        left: `${modalPosition.x}px`,
                        top: `${modalPosition.y}px`,
                        width: `${modalSize.width}px`,
                        height: `${modalSize.height}px`,
                        transform: 'none',
                        backgroundColor: '#1f2937',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }, onMouseDown: handleMouseDown, children: [_jsx(DialogHeader, { className: "p-6 pb-4 bg-slate-800 border-b border-slate-700", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(DialogTitle, { className: "text-lg font-bold text-white", children: "3D Workspace Preview" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MousePointer, { className: "w-4 h-4 text-gray-400" }), _jsx(Move, { className: "w-4 h-4 text-gray-400" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => setSizePreset(375, 667), className: "p-1 text-gray-400 hover:text-white transition-colors", title: "Mobile Size (1)", children: _jsx(Smartphone, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => setSizePreset(768, 1024), className: "p-1 text-gray-400 hover:text-white transition-colors", title: "Tablet Size (2)", children: _jsx(Tablet, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => setSizePreset(1200, 800), className: "p-1 text-gray-400 hover:text-white transition-colors", title: "Desktop Size (3)", children: _jsx(Monitor, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => setSizePreset(1920, 1080), className: "p-1 text-gray-400 hover:text-white transition-colors", title: "Full HD Size (4)", children: _jsx(Square, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "text-xs text-gray-400 px-2 py-1 bg-slate-700 rounded", children: [modalSize.width, "\u00D7", modalSize.height] }), _jsx("button", { onClick: (e) => {
                                                    e.stopPropagation();
                                                    setWorkspaceModalOpen(false);
                                                }, className: "p-1 text-gray-400 hover:text-white transition-colors", children: "\u2715" })] })] }) }), _jsx(DialogDescription, { className: "sr-only", children: "Preview of the 3D workspace in a draggable and resizable modal window." }), _jsx("div", { className: "flex-1 p-0 bg-slate-900 overflow-auto w-full h-full scrollbar-thin scrollbar-track-slate-700 scrollbar-thumb-slate-500", children: _jsx("div", { className: "w-full h-full min-h-[600px]", children: _jsx(BabylonWorkspace, { workspaceId: "hero-workspace-preview", isAdmin: false, layoutMode: "compact", performanceMode: "medium", enablePhysics: false, enableXR: true, enableSpatialAudio: false, renderingQuality: "high" }) }) }), _jsx("div", { className: "absolute -bottom-1 -right-1 w-4 h-4 cursor-se-resize bg-slate-600 hover:bg-slate-500", onMouseDown: (e) => handleResizeMouseDown(e, 'se') }), _jsx("div", { className: "absolute -bottom-1 -left-1 w-4 h-4 cursor-sw-resize bg-slate-600 hover:bg-slate-500", onMouseDown: (e) => handleResizeMouseDown(e, 'sw') }), _jsx("div", { className: "absolute -top-1 -right-1 w-4 h-4 cursor-ne-resize bg-slate-600 hover:bg-slate-500", onMouseDown: (e) => handleResizeMouseDown(e, 'ne') }), _jsx("div", { className: "absolute -top-1 -left-1 w-4 h-4 cursor-nw-resize bg-slate-600 hover:bg-slate-500", onMouseDown: (e) => handleResizeMouseDown(e, 'nw') }), _jsx("div", { className: "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-8 h-2 cursor-n-resize bg-slate-600 hover:bg-slate-500", onMouseDown: (e) => handleResizeMouseDown(e, 'n') }), _jsx("div", { className: "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-8 h-2 cursor-s-resize bg-slate-600 hover:bg-slate-500", onMouseDown: (e) => handleResizeMouseDown(e, 's') }), _jsx("div", { className: "absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-8 cursor-w-resize bg-slate-600 hover:bg-slate-500", onMouseDown: (e) => handleResizeMouseDown(e, 'w') }), _jsx("div", { className: "absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-2 h-8 cursor-e-resize bg-slate-600 hover:bg-slate-500", onMouseDown: (e) => handleResizeMouseDown(e, 'e') })] }) })] }));
}
