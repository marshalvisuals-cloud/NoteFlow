import React, { useState, useEffect } from 'react';
import { useApp } from '../store';

export default function InstallPrompt() {
  const { t, isRTL } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app was launched from home screen
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstall(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  if (!showInstall || isInstalled) return null;

  return (
    <div
      className="fixed bottom-20 start-4 end-4 sm:start-auto sm:end-8 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 z-50 animate-fadeIn"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1 font-vazirmatn">
            {isRTL ? 'نصب نوت‌فلو' : 'Install NoteFlow'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 font-vazirmatn">
            {isRTL 
              ? 'برنامه را روی دستگاه خود نصب کنید تا سریع‌تر دسترسی داشته باشید'
              : 'Install the app on your device for faster access'}
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 px-4 py-2 rounded-xl bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 transition-colors font-vazirmatn"
            >
              {isRTL ? 'نصب' : 'Install'}
            </button>
            <button
              onClick={() => setShowInstall(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-vazirmatn"
            >
              {isRTL ? 'بعداً' : 'Later'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
