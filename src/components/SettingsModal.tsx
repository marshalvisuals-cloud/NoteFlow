import React from 'react';
import { useApp } from '../store';
import { UI_SIZE_OPTIONS, UISize } from '../types';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { uiSize, setUISize, t, isRTL, appLanguage } = useApp();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 font-vazirmatn">
            {t.settingsTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Font Size Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 font-vazirmatn">
            {t.fontSize}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {UI_SIZE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setUISize(option.value)}
                className={`px-4 py-3 rounded-xl border-2 transition-all font-vazirmatn ${
                  uiSize === option.value
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-700'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-medium">
                    {appLanguage === 'fa' ? option.labelFa : option.labelEn}
                  </span>
                  <span
                    className="text-slate-500 dark:text-slate-400"
                    style={{ fontSize: `${option.scale * 0.875}rem` }}
                  >
                    Aa
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 font-vazirmatn">
            {appLanguage === 'fa' ? 'پیش‌نمایش' : 'Preview'}
          </p>
          <p className="text-slate-800 dark:text-slate-100 font-vazirmatn">
            {appLanguage === 'fa'
              ? 'این یک متن نمونه برای نمایش اندازه فونت است.'
              : 'This is a sample text to preview the font size.'}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-600 transition-colors font-vazirmatn"
        >
          {t.save}
        </button>
      </div>
    </div>
  );
}
