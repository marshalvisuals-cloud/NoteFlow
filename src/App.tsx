import React from 'react';
import { AppProvider, useApp } from './store';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import DrawingCanvas from './components/DrawingCanvas';

function AppContent() {
  const { viewMode } = useApp();

  switch (viewMode) {
    case 'editor':
      return <Editor />;
    case 'drawing':
      return <DrawingCanvas />;
    default:
      return <Dashboard />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
