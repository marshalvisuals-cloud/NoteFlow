import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { AppFont, FONT_OPTIONS, getFontFamily, VoiceRecording } from '../types';
import VoiceRecorder, { VoicePlayer } from './VoiceRecorder';
import ImageBlock from './ImageBlock';
import ExportMenu from './ExportMenu';

const VoiceRecordingModal: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { addVoiceRecording, t } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md mx-4 shadow-2xl font-fontBody">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">{t.recordVoice}</h3>
        <VoiceRecorder
          onRecordingComplete={(rec: VoiceRecording) => {
            addVoiceRecording(rec);
            onCancel();
          }}
          onCancel={onCancel}
        />
        <button
          onClick={onCancel}
          className="mt-4 w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
};

const InlineImagesSection: React.FC = () => {
  const { currentNote, updateInlineImage, removeInlineImage } = useApp();
  if (!currentNote?.inlineImages || currentNote.inlineImages.length === 0) return null;
  return (
    <div className="mb-4 space-y-3">
      {currentNote.inlineImages.map(img => (
        <ImageBlock
          key={img.id}
          image={img}
          onUpdate={(updates) => updateInlineImage(img.id, updates)}
          onRemove={() => removeInlineImage(img.id)}
        />
      ))}
    </div>
  );
};

const VoiceRecordingsSection: React.FC = () => {
  const { currentNote } = useApp();
  if (!currentNote?.voiceRecordings || currentNote.voiceRecordings.length === 0) return null;
  return (
    <div className="mb-4 space-y-2">
      {currentNote.voiceRecordings.map(rec => (
        <VoicePlayer key={rec.id} recording={rec} />
      ))}
    </div>
  );
};

const Editor: React.FC = () => {
  const {
    currentNote,
    isRTL,
    t,
    updateNote,
    setViewMode,
    toggleRTL,
    setFontFamily,
    deleteNote,
    addInlineImage,
  } = useApp();

  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [recordingPosition, setRecordingPosition] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fontMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentNote && contentRef.current) {
      contentRef.current.innerHTML = currentNote.content;
    }
  }, [currentNote?.id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(e.target as Node)) {
        setShowFontMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentNote) return null;

  const noteFontFamily = getFontFamily((currentNote.fontFamily || 'system') as AppFont);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    contentRef.current?.focus();
  };

  const handleContentChange = () => {
    if (contentRef.current) {
      updateNote(currentNote.id, { content: contentRef.current.innerHTML });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNote(currentNote.id, { title: e.target.value });
  };

  const handleInsertVoice = () => {
    const position = contentRef.current?.innerHTML.length || 0;
    setRecordingPosition(position);
  };

  const handleInsertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result as string;
          addInlineImage({
            id: Date.now().toString(),
            src: dataUrl,
            width: 400,
            height: 300,
            alt: file.name,
            position: contentRef.current?.innerHTML.length || 0,
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleFontChange = (font: AppFont) => {
    setFontFamily(font);
    setShowFontMenu(false);
  };

  const highlightColors = [
    { color: '#fef08a', name: 'Yellow' },
    { color: '#c4b5fd', name: 'Purple' },
    { color: '#bbf7d0', name: 'Green' },
    { color: '#fecaca', name: 'Red' },
    { color: '#bfdbfe', name: 'Blue' },
    { color: '#fed7aa', name: 'Orange' },
  ];

  const noteColors = [
    '#a78bfa', '#fbbf24', '#34d399', '#f472b6',
    '#60a5fa', '#fb923c', '#818cf8', '#2dd4bf',
  ];

  const currentFontLabel = FONT_OPTIONS.find(f => f.value === currentNote.fontFamily);

  return (
    <div className="max-w-4xl mx-auto" dir={currentNote.isRTL ? 'rtl' : 'ltr'}>
      {/* Editor Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setViewMode('dashboard')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-fontBody"
        >
          <svg className={`w-5 h-5 ${currentNote.isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{t.allNotes}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Font Selector */}
          <div className="relative" ref={fontMenuRef}>
            <button
              onClick={() => setShowFontMenu(!showFontMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-400 transition-colors text-sm font-fontBody"
              title={t.font}
            >
              <span className="text-violet-500">🔤</span>
              <span className="text-slate-700 dark:text-slate-200 max-w-[80px] truncate">
                {isRTL ? currentFontLabel?.labelFa : currentFontLabel?.labelEn}
              </span>
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showFontMenu && (
              <div className="absolute top-full mt-2 end-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 min-w-[200px] z-50">
                <div className="px-3 py-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider font-fontBody">
                  {t.font}
                </div>
                {FONT_OPTIONS.map(font => (
                  <button
                    key={font.value}
                    onClick={() => handleFontChange(font.value)}
                    className={`w-full px-4 py-2.5 text-start flex items-center justify-between hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors ${
                      currentNote.fontFamily === font.value ? 'bg-violet-50 dark:bg-violet-900/30' : ''
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-800 dark:text-slate-100" style={{ fontFamily: font.family }}>
                        {isRTL ? font.labelFa : font.labelEn}
                      </span>
                      <span className="text-xs text-slate-400" style={{ fontFamily: font.family }}>
                        {font.value === 'system' ? 'System Default' : font.family.split(',')[0].replace(/'/g, '')}
                      </span>
                    </div>
                    {currentNote.fontFamily === font.value && (
                      <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RTL/LTR Toggle */}
          <button
            onClick={toggleRTL}
            className={`px-3 py-2 rounded-xl border text-sm font-semibold transition-colors font-fontBody ${
              currentNote.isRTL
                ? 'bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-violet-400'
            }`}
            title={currentNote.isRTL ? t.ltr : t.rtl}
          >
            {currentNote.isRTL ? 'راست‌به‌چپ' : 'LTR'}
          </button>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-400 transition-colors"
              title={t.export}
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
            {showExportMenu && <ExportMenu onClose={() => setShowExportMenu(false)} />}
          </div>

          {/* Options Menu */}
          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-400 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            {showOptionsMenu && (
              <div className="absolute top-full mt-2 end-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 min-w-[200px] z-50 font-fontBody">
                <button
                  onClick={() => { updateNote(currentNote.id, { pinned: !currentNote.pinned }); setShowOptionsMenu(false); }}
                  className="w-full px-4 py-2.5 text-start text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                >
                  <span>📌</span>
                  <span>{currentNote.pinned ? t.unpin : t.pin}</span>
                </button>
                <button
                  onClick={() => { updateNote(currentNote.id, { locked: !currentNote.locked }); setShowOptionsMenu(false); }}
                  className="w-full px-4 py-2.5 text-start text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                >
                  <span>🔒</span>
                  <span>{currentNote.locked ? t.unlock : t.lock}</span>
                </button>
                <button
                  onClick={handleInsertImage}
                  className="w-full px-4 py-2.5 text-start text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                >
                  <span>🖼️</span>
                  <span>{t.addThumbnail}</span>
                </button>
                <button
                  onClick={() => { setViewMode('drawing'); setShowOptionsMenu(false); }}
                  className="w-full px-4 py-2.5 text-start text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                >
                  <span>🎨</span>
                  <span>{t.drawingCanvas}</span>
                </button>
                <hr className="my-1 border-slate-200 dark:border-slate-700" />
                {/* Note Color Picker */}
                <div className="px-4 py-2">
                  <p className="text-xs text-slate-400 mb-2">Note Color</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {noteColors.map(color => (
                      <button
                        key={color}
                        onClick={() => { updateNote(currentNote.id, { color }); setShowOptionsMenu(false); }}
                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${currentNote.color === color ? 'border-slate-800 dark:border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <hr className="my-1 border-slate-200 dark:border-slate-700" />
                <button
                  onClick={() => { deleteNote(currentNote.id); setShowOptionsMenu(false); }}
                  className="w-full px-4 py-2.5 text-start text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
                >
                  <span>🗑️</span>
                  <span>{t.delete}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        value={currentNote.title}
        onChange={handleTitleChange}
        placeholder={t.untitled}
        className="w-full text-3xl font-bold text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none placeholder-slate-300 dark:placeholder-slate-600 mb-2 font-fontBody"
        style={{ fontFamily: noteFontFamily, textAlign: currentNote.isRTL ? 'right' : 'left' }}
        dir={currentNote.isRTL ? 'rtl' : 'ltr'}
      />

      {/* Date */}
      <p className="text-sm text-slate-400 mb-6 font-fontBody">
        {t.lastEdited}: {new Date(currentNote.updatedAt).toLocaleDateString(isRTL ? 'fa-IR' : 'en-US')}
      </p>

      {/* Inline Images */}
      {currentNote.inlineImages && currentNote.inlineImages.length > 0 && (
        <InlineImagesSection />
      )}

      {/* Voice Recordings */}
      {currentNote.voiceRecordings && currentNote.voiceRecordings.length > 0 && (
        <VoiceRecordingsSection />
      )}

      {/* Content Area */}
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
        className="min-h-[400px] text-lg text-slate-700 dark:text-slate-200 outline-none leading-relaxed font-fontBody prose prose-slate dark:prose-invert max-w-none"
        style={{
          fontFamily: noteFontFamily,
          textAlign: currentNote.isRTL ? 'right' : 'left',
          direction: currentNote.isRTL ? 'rtl' : 'ltr',
        }}
        dir={currentNote.isRTL ? 'rtl' : 'ltr'}
        data-placeholder={t.placeholder}
      />

      {/* Checklist */}
      {showChecklist && currentNote.checklist && (
        <div className="mt-4 space-y-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          {currentNote.checklist.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <button
                onClick={() => {
                  const updated = currentNote.checklist!.map(ci =>
                    ci.id === item.id ? { ...ci, checked: !ci.checked } : ci
                  );
                  updateNote(currentNote.id, { checklist: updated });
                }}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.checked
                    ? 'bg-violet-500 border-violet-500'
                    : 'border-slate-300 dark:border-slate-600 hover:border-violet-400'
                }`}
              >
                {item.checked && <span className="text-white text-xs">✓</span>}
              </button>
              <span className={`text-slate-700 dark:text-slate-200 font-fontBody ${item.checked ? 'line-through text-slate-400' : ''}`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="fixed bottom-0 start-0 end-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 py-3 px-4 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {/* Text formatting */}
            <button
              onClick={() => execCommand('bold')}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.bold}
            >
              <span className="font-bold text-slate-700 dark:text-slate-200">B</span>
            </button>
            <button
              onClick={() => execCommand('italic')}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.italic}
            >
              <span className="italic text-slate-700 dark:text-slate-200">I</span>
            </button>
            <button
              onClick={() => execCommand('underline')}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.underline}
            >
              <span className="underline text-slate-700 dark:text-slate-200">U</span>
            </button>
            <button
              onClick={() => execCommand('strikeThrough')}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.strikethrough}
            >
              <span className="line-through text-slate-700 dark:text-slate-200">S</span>
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Headers */}
            <button
              onClick={() => execCommand('formatBlock', 'h1')}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="H1"
            >
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">H1</span>
            </button>
            <button
              onClick={() => execCommand('formatBlock', 'h2')}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="H2"
            >
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">H2</span>
            </button>
            <button
              onClick={() => execCommand('formatBlock', 'h3')}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="H3"
            >
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">H3</span>
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Highlight */}
            <div className="relative">
              <button
                onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={t.highlight}
              >
                <span className="text-lg">🖍️</span>
              </button>
              {showHighlightPicker && (
                <div className="absolute bottom-full mb-2 start-0 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-3 flex gap-2">
                  {highlightColors.map(hc => (
                    <button
                      key={hc.color}
                      onClick={() => { execCommand('hiliteColor', hc.color); setShowHighlightPicker(false); }}
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-600 shadow-sm hover:scale-110 transition-transform"
                      style={{ backgroundColor: hc.color }}
                      title={hc.name}
                    />
                  ))}
                  <button
                    onClick={() => { execCommand('hiliteColor', 'transparent'); setShowHighlightPicker(false); }}
                    className="w-7 h-7 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs"
                    title="Clear"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Alignment */}
            <button
              onClick={() => execCommand('justifyLeft')}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.alignLeft}
            >
              <svg className="w-4 h-4 text-slate-700 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
              </svg>
            </button>
            <button
              onClick={() => execCommand('justifyCenter')}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.alignCenter}
            >
              <svg className="w-4 h-4 text-slate-700 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M8 12h8M6 18h12" />
              </svg>
            </button>
            <button
              onClick={() => execCommand('justifyRight')}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.alignRight}
            >
              <svg className="w-4 h-4 text-slate-700 dark:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 12h10M6 18h14" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* Checklist */}
            <button
              onClick={() => {
                if (!currentNote.checklist) {
                  updateNote(currentNote.id, {
                    checklist: [{ id: Date.now().toString(), text: t.newItem, checked: false }]
                  });
                }
                setShowChecklist(!showChecklist);
              }}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.addChecklist}
            >
              <span className="text-lg">☑️</span>
            </button>

            {/* Voice Recording */}
            <button
              onClick={handleInsertVoice}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.recordVoice}
            >
              <span className="text-lg">🎙️</span>
            </button>

            {/* Image */}
            <button
              onClick={handleInsertImage}
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.insertImage}
            >
              <span className="text-lg">🖼️</span>
            </button>
          </div>
        </div>
      </div>

      {/* Voice Recording Modal */}
      {recordingPosition !== null && (
        <VoiceRecordingModal
          onCancel={() => setRecordingPosition(null)}
        />
      )}
    </div>
  );
};

export default Editor;
