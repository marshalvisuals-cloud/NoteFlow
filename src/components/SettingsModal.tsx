import React from 'react';
import { useApp } from '../store';
import { UI_SIZE_OPTIONS, UISize, THEME_OPTIONS, AppTheme } from '../types';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { uiSize, setUISize, theme, setTheme, t, isRTL, appLanguage } = useApp();

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
                    ? 'text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
                style={uiSize === option.value ? {
                  borderColor: 'var(--color-primary)',
                  backgroundColor: 'var(--color-primary)',
                  boxShadow: '0 4px 6px -1px var(--color-shadow)',
                } : undefined}
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

        {/* Color Theme Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 font-vazirmatn">
            {t.colorTheme}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`relative p-3 rounded-xl border-2 transition-all group ${
                  theme === option.value
                    ? 'border-current shadow-lg scale-105'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                style={{
                  borderColor: theme === option.value ? option.colors.primary : undefined,
                  backgroundColor: theme === option.value ? option.colors.gradientFrom : undefined,
                }}
              >
                {/* Color Swatches */}
                <div className="flex gap-1 mb-2 justify-center">
                  {option.preview.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-4 h-4 rounded-full shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                {/* Theme Name */}
                <p
                  className="text-xs font-medium text-center"
                  style={{ color: option.colors.text }}
                >
                  {appLanguage === 'fa' ? option.labelFa : option.labelEn}
                </p>

                {/* Selected Indicator */}
                {theme === option.value && (
                  <div
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: option.colors.primary }}
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2.5 rounded-xl text-white font-medium transition-all duration-300 font-vazirmatn"
          style={{
            background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-hover))',
            boxShadow: '0 10px 15px -3px var(--color-shadow)',
          }}
        >
          {t.save}
        </button>
      </div>
    </div>
  );
}
