import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { ArrowLeft, User } from 'lucide-react';
export function ClientLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuth();
    const { setIsLoggedIn } = useApp();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password, 'client');
        if (success) {
            setIsLoggedIn(true);
            navigate('/?page=client-dashboard');
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-900 flex items-center justify-center p-4", children: _jsxs(Card, { className: "w-full max-w-md bg-slate-800/50 border-slate-700", children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/?page=home'), className: "text-gray-400 hover:text-white transition-colors duration-200", children: _jsx(ArrowLeft, { className: "w-4 h-4" }) }), _jsx(User, { className: "w-8 h-8 text-purple-400" })] }), _jsx(CardTitle, { className: "text-white text-center", children: "Client Login" }), _jsx(CardDescription, { className: "text-gray-400 text-center", children: "Access your 3D model workspace" })] }), _jsxs(CardContent, { children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "username", className: "text-white", children: "Client Username" }), _jsx(Input, { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true, autocomplete: "username", className: "bg-slate-700 border-slate-600 text-white", placeholder: "Enter client username" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "password", className: "text-white", children: "Password" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, autocomplete: "current-password", className: "bg-slate-700 border-slate-600 text-white", placeholder: "Enter client password" })] }), _jsx(Button, { type: "submit", className: "w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200", disabled: loading, children: loading ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Logging in..."] })) : ('Access Workspace') })] }), _jsxs("div", { className: "mt-4 text-sm text-gray-400 text-center", children: [_jsx("p", { children: "Demo credentials:" }), _jsx("p", { children: "Client: client1 or client2 / password" })] })] })] }) }));
}
