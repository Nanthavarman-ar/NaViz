import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { Users, UserPlus, Settings, MessageSquare, Activity, Crown, Shield, Clock, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { io } from 'socket.io-client';
const CollaborationPanel = ({ isActive, onClose, currentUser, onUserRoleChange }) => {
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');
    const [inviteEmail, setInviteEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('viewer');
    const socketRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    // Initialize socket connection
    useEffect(() => {
        if (isActive && !socketRef.current) {
            initializeSocket();
        }
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [isActive]);
    const initializeSocket = () => {
        try {
            setConnectionStatus('connecting');
            socketRef.current = io(process.env.REACT_APP_WS_URL || 'ws://localhost:3001', {
                transports: ['websocket', 'polling'],
                timeout: 5000,
            });
            const socket = socketRef.current;
            socket.on('connect', () => {
                setIsConnected(true);
                setConnectionStatus('connected');
                // Join collaboration room
                socket.emit('join-collaboration', {
                    userId: currentUser.id,
                    userName: currentUser.name,
                    role: currentUser.role
                });
            });
            socket.on('disconnect', () => {
                setIsConnected(false);
                setConnectionStatus('disconnected');
            });
            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setConnectionStatus('disconnected');
                attemptReconnect();
            });
            socket.on('collaboration-users', (users) => {
                setConnectedUsers(users);
            });
            socket.on('user-joined', (user) => {
                setConnectedUsers(prev => {
                    const existing = prev.find(u => u.id === user.id);
                    if (existing) {
                        return prev.map(u => u.id === user.id ? { ...u, status: 'online' } : u);
                    }
                    return [...prev, user];
                });
                addActivityLog({
                    id: `activity_${Date.now()}`,
                    userId: user.id,
                    userName: user.name,
                    action: 'joined',
                    target: 'collaboration',
                    timestamp: new Date(),
                    type: 'system'
                });
            });
            socket.on('user-left', (userId) => {
                setConnectedUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'offline' } : u));
                const user = connectedUsers.find(u => u.id === userId);
                if (user) {
                    addActivityLog({
                        id: `activity_${Date.now()}`,
                        userId,
                        userName: user.name,
                        action: 'left',
                        target: 'collaboration',
                        timestamp: new Date(),
                        type: 'system'
                    });
                }
            });
            socket.on('food-item-activity', (activity) => {
                addActivityLog({
                    ...activity,
                    id: `activity_${Date.now()}`
                });
            });
            socket.on('user-role-changed', (data) => {
                setConnectedUsers(prev => prev.map(u => u.id === data.userId ? { ...u, role: data.newRole } : u));
                addActivityLog({
                    id: `activity_${Date.now()}`,
                    userId: data.changedBy,
                    userName: 'System',
                    action: `changed ${data.userId} role to ${data.newRole}`,
                    target: 'user permissions',
                    timestamp: new Date(),
                    type: 'system'
                });
            });
        }
        catch (error) {
            console.error('Failed to initialize socket:', error);
            setConnectionStatus('disconnected');
        }
    };
    const attemptReconnect = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
            if (!isConnected) {
                initializeSocket();
            }
        }, 5000);
    };
    const addActivityLog = (activity) => {
        setActivityLog(prev => [activity, ...prev.slice(0, 99)]); // Keep last 100 activities
    };
    const handleInviteUser = () => {
        if (!inviteEmail.trim() || !socketRef.current)
            return;
        socketRef.current.emit('invite-user', {
            email: inviteEmail,
            role: selectedRole,
            invitedBy: currentUser.name
        });
        setInviteEmail('');
        addActivityLog({
            id: `activity_${Date.now()}`,
            userId: currentUser.id,
            userName: currentUser.name,
            action: `invited ${inviteEmail} as ${selectedRole}`,
            target: 'user invitation',
            timestamp: new Date(),
            type: 'system'
        });
    };
    const handleRoleChange = (userId, newRole) => {
        if (!socketRef.current || currentUser.role !== 'admin')
            return;
        socketRef.current.emit('change-user-role', {
            userId,
            newRole,
            changedBy: currentUser.id
        });
        if (onUserRoleChange) {
            onUserRoleChange(userId, newRole);
        }
    };
    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return _jsx(Crown, { className: "w-4 h-4" });
            case 'editor': return _jsx(Settings, { className: "w-4 h-4" });
            case 'viewer': return _jsx(Shield, { className: "w-4 h-4" });
            default: return _jsx(Shield, { className: "w-4 h-4" });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'away': return 'bg-yellow-500';
            case 'offline': return 'bg-gray-500';
            default: return 'bg-gray-400';
        }
    };
    const getActivityIcon = (type) => {
        switch (type) {
            case 'create': return _jsx(UserPlus, { className: "w-4 h-4 text-green-500" });
            case 'update': return _jsx(Settings, { className: "w-4 h-4 text-blue-500" });
            case 'delete': return _jsx(AlertCircle, { className: "w-4 h-4 text-red-500" });
            case 'consume': return _jsx(CheckCircle, { className: "w-4 h-4 text-orange-500" });
            case 'system': return _jsx(Activity, { className: "w-4 h-4 text-gray-500" });
            default: return _jsx(Activity, { className: "w-4 h-4" });
        }
    };
    if (!isActive)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs(Card, { className: "w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700", children: [_jsx(CardHeader, { className: "pb-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-xl", children: [_jsx(Users, { className: "w-6 h-6 text-blue-500" }), "Collaboration Panel"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Badge, { variant: isConnected ? 'default' : 'destructive', className: "flex items-center gap-1", children: [isConnected ? _jsx(Wifi, { className: "w-3 h-3" }) : _jsx(WifiOff, { className: "w-3 h-3" }), connectionStatus] }), _jsx(Button, { size: "sm", variant: "ghost", onClick: onClose, children: _jsx(AlertCircle, { className: "w-4 h-4" }) })] })] }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs(Alert, { children: [_jsx(Wifi, { className: "h-4 w-4" }), _jsxs(AlertDescription, { children: [_jsx("strong", { children: "Real-time Collaboration:" }), " ", isConnected
                                            ? 'Connected to collaboration server. Changes will sync automatically.'
                                            : 'Connecting to collaboration server...'] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Connected Users" }), _jsxs(Badge, { variant: "outline", children: [connectedUsers.length, " users"] })] }), _jsx(ScrollArea, { className: "h-64", children: _jsxs("div", { className: "space-y-2", children: [connectedUsers.map((user) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium", children: user.name.charAt(0).toUpperCase() }), _jsx("div", { className: `absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white` })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium", children: user.name }), getRoleIcon(user.role)] }), _jsxs("div", { className: "text-xs text-slate-500 capitalize", children: [user.status, " \u2022 ", user.role] })] })] }), currentUser.role === 'admin' && user.id !== currentUser.id && (_jsxs(Select, { value: user.role, onValueChange: (newRole) => handleRoleChange(user.id, newRole), children: [_jsx(SelectTrigger, { className: "w-24 h-8", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "viewer", children: "Viewer" }), _jsx(SelectItem, { value: "editor", children: "Editor" }), _jsx(SelectItem, { value: "admin", children: "Admin" })] })] }))] }, user.id))), connectedUsers.length === 0 && (_jsxs("div", { className: "text-center py-8 text-slate-500 dark:text-slate-400", children: [_jsx(Users, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "No users connected yet." }), _jsx("p", { className: "text-sm", children: "Share your collaboration link to invite others." })] }))] }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Activity Log" }), _jsxs(Badge, { variant: "outline", children: [activityLog.length, " activities"] })] }), _jsx(ScrollArea, { className: "h-64", children: _jsxs("div", { className: "space-y-2", children: [activityLog.map((activity) => (_jsxs("div", { className: "flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg", children: [_jsx("div", { className: "mt-0.5", children: getActivityIcon(activity.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-sm", children: activity.userName }), _jsx("span", { className: "text-xs text-slate-500", children: activity.timestamp.toLocaleTimeString() })] }), _jsxs("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: [activity.action, " ", activity.target] })] })] }, activity.id))), activityLog.length === 0 && (_jsxs("div", { className: "text-center py-8 text-slate-500 dark:text-slate-400", children: [_jsx(Activity, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "No recent activity." }), _jsx("p", { className: "text-sm", children: "Activity will appear here when users make changes." })] }))] }) })] })] }), currentUser.role === 'admin' && (_jsxs("div", { className: "space-y-4 pt-4 border-t", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Invite Users" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "invite-email", children: "Email Address" }), _jsx(Input, { id: "invite-email", type: "email", placeholder: "user@example.com", value: inviteEmail, onChange: (e) => setInviteEmail(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "invite-role", children: "Role" }), _jsxs(Select, { value: selectedRole, onValueChange: (value) => setSelectedRole(value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "viewer", children: "Viewer" }), _jsx(SelectItem, { value: "editor", children: "Editor" }), _jsx(SelectItem, { value: "admin", children: "Admin" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "\u00A0" }), _jsxs(Button, { onClick: handleInviteUser, className: "w-full", children: [_jsx(UserPlus, { className: "w-4 h-4 mr-2" }), "Send Invite"] })] })] })] })), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t", children: [_jsxs("div", { className: "text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [_jsx(Users, { className: "w-8 h-8 mx-auto mb-2 text-blue-500" }), _jsx("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: connectedUsers.length }), _jsx("div", { className: "text-sm text-blue-600 dark:text-blue-400", children: "Active Users" })] }), _jsxs("div", { className: "text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [_jsx(Activity, { className: "w-8 h-8 mx-auto mb-2 text-green-500" }), _jsx("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: activityLog.length }), _jsx("div", { className: "text-sm text-green-600 dark:text-green-400", children: "Total Activities" })] }), _jsxs("div", { className: "text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg", children: [_jsx(MessageSquare, { className: "w-8 h-8 mx-auto mb-2 text-purple-500" }), _jsx("div", { className: "text-2xl font-bold text-purple-600 dark:text-purple-400", children: connectedUsers.filter(u => u.status === 'online').length }), _jsx("div", { className: "text-sm text-purple-600 dark:text-purple-400", children: "Online Now" })] }), _jsxs("div", { className: "text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg", children: [_jsx(Clock, { className: "w-8 h-8 mx-auto mb-2 text-orange-500" }), _jsxs("div", { className: "text-2xl font-bold text-orange-600 dark:text-orange-400", children: [Math.floor((Date.now() - (connectedUsers[0]?.lastSeen?.getTime() || Date.now())) / 1000 / 60), "m"] }), _jsx("div", { className: "text-sm text-orange-600 dark:text-orange-400", children: "Session Time" })] })] })] })] }) }));
};
export default CollaborationPanel;
