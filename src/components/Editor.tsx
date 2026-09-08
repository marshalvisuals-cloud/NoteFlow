import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import VoiceRecorder, { VoicePlayer } from './VoiceRecorder';
import ImageBlock, { ImageUploader } from './ImageBlock';
import ExportMenu from './ExportMenu';
import { InlineImage } from '../types';

export default function Editor() {
  const {
    currentNote, updateNote, setViewMode, isRTL, toggleRTL,
    addVoiceRecording, addInlineImage, updateInlineImage, removeInlineImage,
    setFontFamily
  } = useApp();

  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [highlightPos, setHighlightPos] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);

  if (!currentNote) return null;

  const note = currentNote;
  const noteRTL = note.isRTL;

  const getFontClass = (font: string) => {
    switch (font) {
      case 'vazirmatn': return 'font-vazir';
      case 'nazanin': return 'font-nazanin';
      case 'calibri': return 'font-calibri';
      default: return 'font-vazir';
    }
  };

  const getFontFamilyCSS = (font: string) => {
    switch (font) {
      case 'vazirmatn': return "'Vazirmatn', 'B Nazanin', sans-serif";
      case 'nazanin': return "'Noto Naskh Arabic', 'B Nazanin', 'Vazirmatn', sans-serif";
      case 'calibri': return "'Calibri', 'Vazirmatn', 'Segoe UI', sans-serif";
      default: return "'Vazirmatn', sans-serif";
    }
  };

  // Handle text selection for highlight
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setHighlightPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
      setShowHighlightPicker(true);
    }
  };

  const applyHighlight = (color: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = color;
      span.style.padding = '0 4px';
      span.style.borderRadius = '3px';
      range.surroundContents(span);
      setShowHighlightPicker(false);
    }
  };

  // Format commands
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Content update
  const handleContentChange = () => {
    if (editorRef.current) {
      updateNote(note.id, { content: editorRef.current.innerHTML });
    }
  };

  // Set initial content
  useEffect(() => {
    if (editorRef.current && note.content && editorRef.current.innerHTML !== note.content) {
      editorRef.current.innerHTML = note.content;
    }
  }, [note.id]);

  // Handle voice recording completion
  const handleVoiceRecordingComplete = (recording: any) => {
    addVoiceRecording(note.id, recording);
    setShowVoiceRecorder(false);
  };

  // Handle image insertion
  const handleImageSelected = (image: InlineImage) => {
    addInlineImage(note.id, image);
  };

  // Toggle note RTL
  const toggleNoteRTL = () => {
    updateNote(note.id, { isRTL: !note.isRTL });
  };

  const formatDate = (date: Date) => {
    if (noteRTL) {
      return new Date(date).toLocaleDateString('fa-IR', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    }
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const noteColors = [
    '#ffffff', '#fef3e2', '#e8f4fd', '#f3e8ff', '#e8f5e9',
    '#fce4ec', '#fff3e0', '#f0f4ff'
  ];

  return (
    <div
      className="h-full flex flex-col"
      dir={noteRTL ? 'rtl' : 'ltr'}
      style={{ backgroundColor: note.color + '15' }}
    >
      {/* Top Toolbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-4 py-2">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setViewMode('dashboard')}
            className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <i className={`fas ${noteRTL ? 'fa-arrow-right' : 'fa-arrow-left'}`}></i>
          </button>

          {/* Center actions */}
          <div className="flex items-center gap-2">
            {/* RTL Toggle */}
            <button
              onClick={toggleNoteRTL}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                noteRTL
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}
            >
              {noteRTL ? 'فا' : 'EN'}
            </button>

            {/* Font selector */}
            <div className="relative">
              <button
                onClick={() => setShowFontMenu(!showFontMenu)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-font ml-1"></i>
                {note.fontFamily === 'vazirmatn' ? 'وزیر' :
                 note.fontFamily === 'nazanin' ? 'نازنین' : 'Calibri'}
              </button>
              {showFontMenu && (
                <div className={`absolute top-full mt-1 ${noteRTL ? 'right-0' : 'left-0'} bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 min-w-[150px] z-50`}>
                  {[
                    { id: 'vazirmatn', label: 'وزیر متن (Vazirmatn)', labelEn: 'Vazirmatn' },
                    { id: 'nazanin', label: 'بی نازنین (Nazanin)', labelEn: 'Nazanin' },
                    { id: 'calibri', label: 'کالیبری (Calibri)', labelEn: 'Calibri' },
                  ].map(font => (
                    <button
                      key={font.id}
                      onClick={() => { setFontFamily(font.id); updateNote(note.id, { fontFamily: font.id }); setShowFontMenu(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-right hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                        note.fontFamily === font.id ? 'text-violet-600 dark:text-violet-400' : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <span>{noteRTL ? font.label : font.labelEn}</span>
                      {note.fontFamily === font.id && <i className="fas fa-check text-xs"></i>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Export */}
            <button
              onClick={() => setShowExport(true)}
              className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={noteRTL ? 'خروجی' : 'Export'}
            >
              <i className="fas fa-file-export text-sm"></i>
            </button>

            {/* Options menu */}
            <div className="relative">
              <button
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <i className="fas fa-ellipsis-v"></i>
              </button>
              {showOptionsMenu && (
                <div className={`absolute top-full mt-1 ${noteRTL ? 'left-0' : 'right-0'} bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1 min-w-[200px] z-50`}>
                  <button onClick={() => { updateNote(note.id, { pinned: !note.pinned }); setShowOptionsMenu(false); }} className="w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <i className="fas fa-thumbtack text-amber-500 w-5"></i>
                    {note.pinned ? (noteRTL ? 'برداشتن سنجاق' : 'Unpin') : (noteRTL ? 'سنجاق کردن' : 'Pin to top')}
                  </button>
                  <button onClick={() => { updateNote(note.id, { locked: !note.locked }); setShowOptionsMenu(false); }} className="w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <i className="fas fa-lock text-red-500 w-5"></i>
                    {note.locked ? (noteRTL ? 'باز کردن قفل' : 'Unlock') : (noteRTL ? 'قفل کردن' : 'Lock note')}
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  {/* Color picker */}
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-400 mb-2">{noteRTL ? 'رنگ یادداشت' : 'Note color'}</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {noteColors.map(color => (
                        <button
                          key={color}
                          onClick={() => { updateNote(note.id, { color }); setShowOptionsMenu(false); }}
                          className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${note.color === color ? 'border-violet-500 scale-110' : 'border-gray-200 dark:border-gray-600'}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                  <button onClick={() => { updateNote(note.id, { content: '', title: noteRTL ? 'یادداشت جدید' : 'New Note' }); if (editorRef.current) editorRef.current.innerHTML = ''; setShowOptionsMenu(false); }} className="w-full px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <i className="fas fa-copy text-blue-500 w-5"></i>
                    {noteRTL ? 'پاک کردن محتوا' : 'Clear content'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Editor Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Title */}
          <input
            type="text"
            value={note.title}
            onChange={(e) => updateNote(note.id, { title: e.target.value })}
            placeholder={noteRTL ? 'عنوان یادداشت...' : 'Note title...'}
            className="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 mb-2"
            style={{ fontFamily: getFontFamilyCSS(note.fontFamily), direction: noteRTL ? 'rtl' : 'ltr' }}
          />

          {/* Date */}
          <p className="text-sm text-gray-400 mb-6">
            {noteRTL ? 'آخرین ویرایش: ' : 'Last edited: '}
            {formatDate(note.updatedAt)}
          </p>

          {/* Inline Images */}
          {note.inlineImages && note.inlineImages.length > 0 && (
            <div className="mb-4">
              {note.inlineImages.map(img => (
                <ImageBlock
                  key={img.id}
                  image={img}
                  onUpdate={(updates) => updateInlineImage(note.id, img.id, updates)}
                  onRemove={() => removeInlineImage(note.id, img.id)}
                />
              ))}
            </div>
          )}

          {/* Voice Recordings */}
          {note.voiceRecordings && note.voiceRecordings.length > 0 && (
            <div className="mb-4 space-y-2">
              {note.voiceRecordings.map(rec => (
                <VoicePlayer key={rec.id} recording={rec} />
              ))}
            </div>
          )}

          {/* Rich Text Editor */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            dir={noteRTL ? 'rtl' : 'ltr'}
            onMouseUp={handleMouseUp}
            onInput={handleContentChange}
            className="min-h-[400px] outline-none text-gray-700 dark:text-gray-200 leading-relaxed text-base prose prose-lg max-w-none"
            style={{
              fontFamily: getFontFamilyCSS(note.fontFamily),
              fontSize: '16px',
              lineHeight: '2',
            }}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

          {/* Checklist */}
          {note.checklist && note.checklist.length > 0 && (
            <div className="mt-6 space-y-2">
              {note.checklist.map(item => (
                <div key={item.id} className="flex items-center gap-3 group">
                  <button
                    onClick={() => {
                      const updated = note.checklist!.map(c =>
                        c.id === item.id ? { ...c, checked: !c.checked } : c
                      );
                      updateNote(note.id, { checklist: updated });
                    }}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      item.checked
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-violet-400'
                    }`}
                  >
                    {item.checked && <i className="fas fa-check text-white text-[10px]"></i>}
                  </button>
                  <span className={`text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Formatting Toolbar */}
      <div className="sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {/* Text formatting */}
          <button onClick={() => execCommand('bold')} className="toolbar-btn" title={noteRTL ? 'ضخیم' : 'Bold'}>
            <i className="fas fa-bold"></i>
          </button>
          <button onClick={() => execCommand('italic')} className="toolbar-btn" title={noteRTL ? 'کج' : 'Italic'}>
            <i className="fas fa-italic"></i>
          </button>
          <button onClick={() => execCommand('underline')} className="toolbar-btn" title={noteRTL ? 'زیرخط' : 'Underline'}>
            <i className="fas fa-underline"></i>
          </button>
          <button onClick={() => execCommand('strikeThrough')} className="toolbar-btn" title={noteRTL ? 'خط‌خورده' : 'Strikethrough'}>
            <i className="fas fa-strikethrough"></i>
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

          {/* Headers */}
          <button onClick={() => execCommand('formatBlock', 'h1')} className="toolbar-btn text-xs font-bold" title="H1">
            H1
          </button>
          <button onClick={() => execCommand('formatBlock', 'h2')} className="toolbar-btn text-xs font-bold" title="H2">
            H2
          </button>
          <button onClick={() => execCommand('formatBlock', 'h3')} className="toolbar-btn text-xs font-bold" title="H3">
            H3
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

          {/* Alignment */}
          <button onClick={() => execCommand('justifyRight')} className="toolbar-btn" title={noteRTL ? 'راست‌چین' : 'Align right'}>
            <i className="fas fa-align-right"></i>
          </button>
          <button onClick={() => execCommand('justifyCenter')} className="toolbar-btn" title={noteRTL ? 'وسط‌چین' : 'Align center'}>
            <i className="fas fa-align-center"></i>
          </button>
          <button onClick={() => execCommand('justifyLeft')} className="toolbar-btn" title={noteRTL ? 'چپ‌چین' : 'Align left'}>
            <i className="fas fa-align-left"></i>
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

          {/* Lists */}
          <button onClick={() => execCommand('insertUnorderedList')} className="toolbar-btn" title={noteRTL ? 'لیست' : 'Bullet list'}>
            <i className="fas fa-list-ul"></i>
          </button>
          <button onClick={() => execCommand('insertOrderedList')} className="toolbar-btn" title={noteRTL ? 'لیست عددی' : 'Numbered list'}>
            <i className="fas fa-list-ol"></i>
          </button>
          <button onClick={() => execCommand('formatBlock', 'blockquote')} className="toolbar-btn" title={noteRTL ? 'نقل قول' : 'Quote'}>
            <i className="fas fa-quote-right"></i>
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1"></div>

          {/* Media insertion */}
          <ImageUploader onImageSelected={handleImageSelected} />

          <button
            onClick={() => setShowVoiceRecorder(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <i className="fas fa-microphone text-red-500 w-5"></i>
            {noteRTL ? 'ضبط صدا' : 'Record'}
          </button>

          <button
            onClick={() => setViewMode('drawing')}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <i className="fas fa-paint-brush text-purple-500 w-5"></i>
            {noteRTL ? 'طراحی' : 'Draw'}
          </button>
        </div>
      </div>

      {/* Highlight Picker */}
      {showHighlightPicker && (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 flex gap-1.5"
          style={{ top: highlightPos.y - 50, left: highlightPos.x - 80 }}
        >
          {['#fef08a', '#bbf7d0', '#bfdbfe', '#e9d5ff', '#fecdd3', '#fed7aa'].map(color => (
            <button
              key={color}
              onClick={() => applyHighlight(color)}
              className="w-7 h-7 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
          <button
            onClick={() => setShowHighlightPicker(false)}
            className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 text-xs"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Voice Recorder Modal */}
      {showVoiceRecorder && (
        <VoiceRecorder
          onRecordingComplete={handleVoiceRecordingComplete}
          onCancel={() => setShowVoiceRecorder(false)}
        />
      )}

      {/* Export Menu */}
      {showExport && (
        <ExportMenu onClose={() => setShowExport(false)} />
      )}

      {/* Close menus on outside click */}
      {(showOptionsMenu || showFontMenu) && (
        <div className="fixed inset-0 z-30" onClick={() => { setShowOptionsMenu(false); setShowFontMenu(false); }} />
      )}
    </div>
  );
}
