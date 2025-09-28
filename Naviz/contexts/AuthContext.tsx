import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'client';
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'admin' | 'client') => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock authentication - in a real app, this would call your backend
  const login = async (username: string, password: string, role: 'admin' | 'client'): Promise<boolean> => {
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

      const isValid = validCredentials[username as keyof typeof validCredentials]?.password === password;

      if (isValid) {
        const userData: User = {
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
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
