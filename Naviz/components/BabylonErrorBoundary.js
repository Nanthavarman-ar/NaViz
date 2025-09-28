import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
class BabylonErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Babylon.js Error Boundary caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "flex items-center justify-center h-full bg-red-50 border border-red-200 rounded-lg", children: _jsxs("div", { className: "text-center p-8", children: [_jsx("div", { className: "text-red-600 text-lg font-semibold mb-2", children: "3D Workspace Crashed" }), _jsx("div", { className: "text-red-500 mb-4", children: this.state.error?.message || 'An unexpected error occurred' }), _jsx("div", { className: "text-sm text-gray-600 mb-4", children: "The 3D workspace encountered a critical error and needs to be restarted." }), _jsx("button", { onClick: () => {
                                this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                                window.location.reload();
                            }, className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors", children: "Restart Workspace" })] }) }));
        }
        return this.props.children;
    }
}
export default BabylonErrorBoundary;
