import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { Home } from '../components/Home';
import { Login } from '../components/Login';
import { AdminLogin } from '../components/AdminLogin';
import { AdminForgotCredentials } from '../components/AdminForgotCredentials';
import { AdminChangeCredentials } from '../components/AdminChangeCredentials';
import { ClientLogin } from '../components/ClientLogin';
import { AdminDashboard } from '../components/AdminDashboard';
import { ClientDashboard } from '../components/ClientDashboard';
import BabylonWorkspace from '../components/BabylonWorkspace.jsx';
import BabylonErrorBoundary from '../components/BabylonErrorBoundary';
import AIVoiceAssistant from '../components/AIVoiceAssistant';
import ButtonTestRunner from '../components/ButtonTestRunner';
import ComprehensiveButtonTest from '../components/ComprehensiveButtonTest';
// @ts-ignore
import ButtonFunctionTest from '../components/ButtonFunctionTest';
import { Toaster } from '../components/ui/sonner';
import { useAuth, useApp } from '../contexts';
export default function AppLayout() {
    const { user, loading } = useAuth();
    const { currentPage, setCurrentPage } = useApp();
    const sceneRef = useRef(null);
    const location = useLocation();
    // Check for URL parameters on navigation changes
    useEffect(() => {
        try {
            // Check URL parameters for direct navigation
            const urlParams = new URLSearchParams(location.search);
            const pageParam = urlParams.get('page');
            const hashPage = location.hash.replace('#', '');
            // Set page from URL
            if (pageParam) {
                setCurrentPage(pageParam);
            }
            else if (hashPage) {
                setCurrentPage(hashPage);
            }
            else {
                setCurrentPage('home');
            }
        }
        catch (error) {
            console.error('Navigation check error:', error);
        }
    }, [location.search, location.hash, setCurrentPage]);
    const renderPage = () => {
        if (loading) {
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" }), _jsx("p", { className: "text-white text-lg", children: "Loading NAVIZ..." })] }) }));
        }
        switch (currentPage) {
            case 'home':
                return _jsx(Home, {});
            case 'login':
                return _jsx(Login, {});
            case 'admin-login':
                return _jsx(AdminLogin, {});
            case 'admin-forgot-credentials':
                return _jsx(AdminForgotCredentials, {});
            case 'admin-change-credentials':
                return _jsx(AdminChangeCredentials, {});
            case 'client-login':
                return _jsx(ClientLogin, {});
            case 'admin-dashboard':
                return _jsx(AdminDashboard, {});
            case 'client-dashboard':
                return _jsx(ClientDashboard, {});
            case 'babylon-workspace':
                return (_jsx("div", { className: "h-screen w-full overflow-hidden", children: _jsx(BabylonErrorBoundary, { children: _jsx(BabylonWorkspace, { workspaceId: "babylon-workspace", isAdmin: user?.role === 'admin' }) }) }));
            case 'integrated-workspace':
                return (_jsx("div", { className: "h-screen w-full overflow-hidden", children: _jsx(BabylonErrorBoundary, { children: _jsx(BabylonWorkspace, { workspaceId: "integrated-workspace", isAdmin: user?.role === 'admin' }) }) }));
            case 'workspace':
                return (_jsx("div", { className: "h-screen w-full overflow-hidden", children: _jsx(BabylonWorkspace, { workspaceId: "workspace", isAdmin: user?.role === 'admin' }) }));
            case 'button-test-runner':
                return _jsx(ButtonTestRunner, {});
            case 'comprehensive-button-test':
                return _jsx(ComprehensiveButtonTest, {});
            case 'button-function-test':
                return _jsx(ButtonFunctionTest, {});
            default:
                return _jsx(Home, {});
        }
    };
    return (_jsx(ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, children: _jsxs("div", { className: "min-h-screen bg-slate-900 text-white relative overflow-hidden", children: [_jsxs("div", { className: "fixed inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/20" }), _jsx("div", { className: "absolute inset-0 opacity-30", children: [...Array(50)].map((_, i) => {
                                const left = Math.random() * 100;
                                const top = Math.random() * 100;
                                const delay = Math.random() * 2;
                                const duration = 2 + Math.random() * 3;
                                return (_jsx("div", { className: "absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse particle" }, i));
                            }) })] }), _jsx("div", { className: "relative z-10", children: renderPage() }), user && sceneRef.current && (_jsx(AIVoiceAssistant, { scene: sceneRef.current, isActive: true, onClose: () => { } })), _jsx(Toaster, {})] }) }));
}
