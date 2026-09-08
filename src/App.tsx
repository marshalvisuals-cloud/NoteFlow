import React from 'react';
import { AppProvider, useApp } from './store';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import DrawingCanvas from './components/DrawingCanvas';

function AppContent() {
  const { viewMode, isRTL, theme } = useApp();

  React.useEffect(() => {
    // Set initial direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = isRTL ? 'fa' : 'en';
    if (!isRTL) {
      document.documentElement.classList.add('ltr');
    }
    // Set initial theme
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {viewMode === 'dashboard' && <Dashboard />}
      {viewMode === 'editor' && <Editor />}
      {viewMode === 'drawing' && <DrawingCanvas />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
