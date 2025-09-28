import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(null);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error('useAuth must be used within AuthProvider');
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    // Mock authentication - in a real app, this would call your backend
    const login = async (username, password, role) => {
        setLoading(true);
        try {
            // Small delay for loading state visibility (reduced from 1000ms to 100ms)
            await new Promise(resolve => setTimeout(resolve, 100));
            // Mock credentials
            const validCredentials = {
                admin: { username: 'admin', password: 'password' },
                client1: { username: 'client1', password: 'password' },
                client2: { username: 'client2', password: 'password' }
            };
            const isValid = validCredentials[username]?.password === password;
            if (isValid) {
                const userData = {
                    id: Date.now().toString(),
                    username,
                    role,
                    name: username === 'admin' ? 'Administrator' : `Client ${username}`,
                    email: `${username}@example.com`
                };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Login error:', error);
            return false;
        }
        finally {
            setLoading(false);
        }
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };
    useEffect(() => {
        // Check for existing session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const value = { user, login, logout, loading };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
