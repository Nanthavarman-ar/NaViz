import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(username, password, role);
        if (success) {
            if (role === 'admin') {
                navigate('/admin/clients');
            }
            else {
                navigate('/workspace');
            }
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-900 flex items-center justify-center p-4", children: _jsxs(Card, { className: "w-full max-w-md bg-slate-800/50 border-slate-700", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-white text-center", children: "Login to NAVIZ" }), _jsx(CardDescription, { className: "text-gray-400 text-center", children: "Enter your credentials to access the workspace" })] }), _jsxs(CardContent, { children: [_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "username", className: "text-white", children: "Username" }), _jsx(Input, { id: "username", type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true, className: "bg-slate-700 border-slate-600 text-white" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "password", className: "text-white", children: "Password" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "bg-slate-700 border-slate-600 text-white" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "role", className: "text-white", children: "Role" }), _jsxs(Select, { value: role, onValueChange: (value) => setRole(value), children: [_jsx(SelectTrigger, { className: "bg-slate-700 border-slate-600 text-white", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { className: "bg-slate-700 border-slate-600 text-white", children: [_jsx(SelectItem, { value: "client", children: "Client" }), _jsx(SelectItem, { value: "admin", children: "Admin" })] })] })] }), _jsx(Button, { type: "submit", className: "w-full bg-cyan-600 hover:bg-cyan-700", disabled: loading, children: loading ? 'Logging in...' : 'Login' })] }), _jsxs("div", { className: "mt-4 text-sm text-gray-400", children: [_jsx("p", { children: "Demo credentials:" }), _jsx("p", { children: "Admin: admin / password" }), _jsx("p", { children: "Client: client1 or client2 / password" })] })] })] }) }));
}
