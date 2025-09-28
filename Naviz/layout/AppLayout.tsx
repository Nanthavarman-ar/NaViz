import React, { useEffect, useRef } from 'react';
import { ThemeProvider } from 'next-themes';
import { Home } from '../components/Home';
import { Login } from '../components/Login';
import { AdminLogin } from '../components/AdminLogin';
import { ClientLogin } from '../components/ClientLogin';
import { AdminDashboard } from '../components/AdminDashboard';
import { ClientDashboard } from '../components/ClientDashboard';
import BabylonWorkspace from '../components/BabylonWorkspace';
import BabylonErrorBoundary from '../components/BabylonErrorBoundary';
import AIVoiceAssistant from '../components/AIVoiceAssistant';
import ButtonTestRunner from '../components/ButtonTestRunner';
import ComprehensiveButtonTest from '../components/ComprehensiveButtonTest';
// @ts-ignore
import ButtonFunctionTest from '../components/ButtonFunctionTest';
import { Toaster } from '../components/ui/sonner';
import { useAuth, useApp } from '../contexts';
import { Scene } from '@babylonjs/core';

export default function AppLayout() {
  const { user, loading } = useAuth();
  const { currentPage, setCurrentPage } = useApp();
  const sceneRef = useRef<Scene | null>(null);

  // Check for existing session and URL parameters on app start
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check URL parameters for direct navigation
        const urlParams = new URLSearchParams(window.location.search);
        const pageParam = urlParams.get('page');
        const hashPage = window.location.hash.replace('#', '');

        // Set initial page from URL
        if (pageParam) {
          setCurrentPage(pageParam);
        } else if (hashPage) {
          setCurrentPage(hashPage);
        } else {
          setCurrentPage('home');
        }
      } catch (error) {
        console.error('Navigation check error:', error);
      }
    };

    checkSession();
  }, [setCurrentPage]);

  const renderPage = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading NAVIZ...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'login':
        return <Login />;
      case 'admin-login':
        return <AdminLogin />;
      case 'client-login':
        return <ClientLogin />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'client-dashboard':
        return <ClientDashboard />;
      case 'babylon-workspace':
        return (
          <BabylonErrorBoundary>
            <BabylonWorkspace workspaceId="babylon-workspace" isAdmin={user?.role === 'admin'} />
          </BabylonErrorBoundary>
        );
      case 'integrated-workspace':
        return (
          <BabylonErrorBoundary>
            <BabylonWorkspace workspaceId="integrated-workspace" isAdmin={user?.role === 'admin'} />
          </BabylonErrorBoundary>
        );
      case 'workspace':
        return <BabylonWorkspace workspaceId="workspace" isAdmin={user?.role === 'admin'} />;
      case 'button-test-runner':
        return <ButtonTestRunner />;
      case 'comprehensive-button-test':
        return <ComprehensiveButtonTest />;
      case 'button-function-test':
        return <ButtonFunctionTest />;
      default:
        return <Home />;
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
        {/* Cyberpunk background particles */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-blue-900/20" />
          <div className="absolute inset-0 opacity-30">
            {[...Array(50)].map((_, i) => {
              const left = Math.random() * 100;
              const top = Math.random() * 100;
              const delay = Math.random() * 2;
              const duration = 2 + Math.random() * 3;
              return (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse particle"
                />
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {renderPage()}
        </div>

        {/* AI Voice Assistant - Show only when logged in */}
        {user && sceneRef.current && (
          <AIVoiceAssistant
            scene={sceneRef.current}
            isActive={true}
            onClose={() => {}}
          />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
