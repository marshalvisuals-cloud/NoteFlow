import React from 'react';
import { AppProvider, useApp } from './store';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import DrawingCanvas from './components/DrawingCanvas';

const AppContent: React.FC = () => {
  const { viewMode, appLanguage, setAppLanguage, t, isRTL } = useApp();

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Language Toggle */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent font-display">
                  {t.appName}
                </h1>
              </div>

              {/* Language Toggle - Only on Dashboard */}
              {viewMode === 'dashboard' && (
                <button
                  onClick={() => setAppLanguage(appLanguage === 'en' ? 'fa' : 'en')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 border border-slate-200 dark:border-slate-700 transition-all duration-200 group"
                  title={t.language}
                >
                  <span className="text-sm">🌐</span>
                  <span className={`text-xs font-semibold transition-colors ${appLanguage === 'fa' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-violet-600'}`}>
                    FA
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className={`text-xs font-semibold transition-colors ${appLanguage === 'en' ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-violet-600'}`}>
                    EN
                  </span>
                </button>
              )}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                {appLanguage === 'fa' ? 'ن' : 'N'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'dashboard' && <Dashboard />}
        {viewMode === 'editor' && <Editor />}
        {viewMode === 'drawing' && <DrawingCanvas />}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
