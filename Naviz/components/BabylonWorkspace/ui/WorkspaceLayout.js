import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useWorkspace } from '../core/WorkspaceContext';
import './WorkspaceLayout.css';
export function WorkspaceLayout({ children, layoutMode = 'standard', onLayoutChange }) {
    const { state, dispatch } = useWorkspace();
    // Handle layout mode changes
    const handleLayoutChange = (mode) => {
        dispatch({ type: 'SET_LAYOUT_MODE', payload: mode });
        if (onLayoutChange) {
            onLayoutChange(mode);
        }
    };
    // Get layout classes based on mode
    const getLayoutClasses = () => {
        const baseClasses = ['workspace-layout'];
        switch (layoutMode) {
            case 'compact':
                baseClasses.push('workspace-layout--compact');
                break;
            case 'immersive':
                baseClasses.push('workspace-layout--immersive');
                break;
            case 'split':
                baseClasses.push('workspace-layout--split');
                break;
            default:
                baseClasses.push('workspace-layout--standard');
        }
        return baseClasses.join(' ');
    };
    // Get panel visibility classes
    const getPanelClasses = () => {
        const classes = [];
        if (state.leftPanelVisible)
            classes.push('left-panel-visible');
        if (state.rightPanelVisible)
            classes.push('right-panel-visible');
        if (state.bottomPanelVisible)
            classes.push('bottom-panel-visible');
        return classes.join(' ');
    };
    return (_jsxs("div", { className: `${getLayoutClasses()} ${getPanelClasses()}`, children: [_jsx("div", { className: "layout-mode-selector", children: _jsxs("div", { className: "layout-buttons", children: [_jsx("button", { className: `layout-button ${layoutMode === 'standard' ? 'active' : ''}`, onClick: () => handleLayoutChange('standard'), title: "Standard Layout", children: "\uD83D\uDCD0 Standard" }), _jsx("button", { className: `layout-button ${layoutMode === 'compact' ? 'active' : ''}`, onClick: () => handleLayoutChange('compact'), title: "Compact Layout", children: "\uD83D\uDDDC\uFE0F Compact" }), _jsx("button", { className: `layout-button ${layoutMode === 'split' ? 'active' : ''}`, onClick: () => handleLayoutChange('split'), title: "Split Layout", children: "\u29C9 Split" }), _jsx("button", { className: `layout-button ${layoutMode === 'immersive' ? 'active' : ''}`, onClick: () => handleLayoutChange('immersive'), title: "Immersive Layout", children: "\uD83D\uDD76\uFE0F Immersive" })] }) }), _jsx("div", { className: "workspace-content", children: children }), _jsxs("div", { className: "panel-toggles", children: [_jsx("button", { className: `panel-toggle ${state.leftPanelVisible ? 'active' : ''}`, onClick: () => dispatch({ type: 'TOGGLE_PANEL', payload: 'leftPanelVisible' }), title: "Toggle Left Panel", children: "\uD83C\uDF9B\uFE0F" }), _jsx("button", { className: `panel-toggle ${state.rightPanelVisible ? 'active' : ''}`, onClick: () => dispatch({ type: 'TOGGLE_PANEL', payload: 'rightPanelVisible' }), title: "Toggle Right Panel", children: "\u2699\uFE0F" }), _jsx("button", { className: `panel-toggle ${state.bottomPanelVisible ? 'active' : ''}`, onClick: () => dispatch({ type: 'TOGGLE_PANEL', payload: 'bottomPanelVisible' }), title: "Toggle Bottom Panel", children: "\uD83D\uDCCA" })] }), _jsxs("div", { className: "keyboard-shortcuts", children: [_jsx("button", { className: "shortcuts-button", title: "Keyboard Shortcuts", children: "?" }), _jsxs("div", { className: "shortcuts-panel", children: [_jsx("div", { className: "shortcuts-title", children: "Keyboard Shortcuts" }), _jsxs("div", { className: "shortcuts-list", children: [_jsxs("div", { children: [_jsx("kbd", { children: "Ctrl+1" }), " Standard Layout"] }), _jsxs("div", { children: [_jsx("kbd", { children: "Ctrl+2" }), " Compact Layout"] }), _jsxs("div", { children: [_jsx("kbd", { children: "Ctrl+3" }), " Split Layout"] }), _jsxs("div", { children: [_jsx("kbd", { children: "Ctrl+4" }), " Immersive Layout"] }), _jsxs("div", { children: [_jsx("kbd", { children: "Ctrl+H" }), " Toggle Left Panel"] }), _jsxs("div", { children: [_jsx("kbd", { children: "Ctrl+J" }), " Toggle Right Panel"] }), _jsxs("div", { children: [_jsx("kbd", { children: "Ctrl+K" }), " Toggle Bottom Panel"] })] })] })] })] }));
}
export function PanelContainer({ position, isVisible, children, width = 320, height = 200 }) {
    const getPanelClasses = () => {
        const classes = ['panel-container', `panel-container--${position}`];
        if (isVisible) {
            classes.push('panel-container--visible');
        }
        else {
            classes.push('panel-container--hidden');
        }
        return classes.join(' ');
    };
    const getPanelStyle = () => {
        const style = {};
        if (position === 'left' || position === 'right') {
            style.width = `${width}px`;
        }
        else {
            style.height = `${height}px`;
        }
        return style;
    };
    return (_jsx("div", { className: getPanelClasses(), style: getPanelStyle(), children: _jsx("div", { className: "panel-content", children: children }) }));
}
// Responsive design hook
export function useResponsiveLayout() {
    const [windowSize, setWindowSize] = React.useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 1920,
        height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    });
    React.useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width < 1024 && windowSize.width >= 768;
    const isDesktop = windowSize.width >= 1024;
    return {
        windowSize,
        isMobile,
        isTablet,
        isDesktop,
        shouldShowPanels: isDesktop || (isTablet && windowSize.width >= 900),
        panelWidth: isMobile ? windowSize.width : Math.min(400, windowSize.width * 0.3),
    };
}
