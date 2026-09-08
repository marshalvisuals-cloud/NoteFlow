import React, { useState } from 'react';
import { useApp } from '../store';
import { Note } from '../types';

export default function Dashboard() {
  const {
    notes, searchQuery, setSearchQuery, activeTag, setActiveTag,
    setCurrentNote, setViewMode, addNote, togglePin, toggleLock,
    duplicateNote, deleteNote, isRTL
  } = useApp();

  const [contextMenu, setContextMenu] = useState<{ noteId: string; x: number; y: number } | null>(null);

  const tags = ['همه', 'کار', 'شخصی', 'مطالعه', 'طراحی', 'سلامت'];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeTag === 'همه' || note.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const unpinnedNotes = filteredNotes.filter(n => !n.pinned);

  const openNote = (note: Note) => {
    if (note.locked) {
      const pass = prompt(isRTL ? 'رمز عبور را وارد کنید:' : 'Enter password:');
      if (pass !== '1234') return;
    }
    setCurrentNote(note);
    setViewMode('editor');
  };

  const handleContextMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    setContextMenu({ noteId, x: e.clientX, y: e.clientY });
  };

  const formatDate = (date: Date) => {
    if (isRTL) {
      return new Date(date).toLocaleDateString('fa-IR');
    }
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderNoteCard = (note: Note) => (
    <div
      key={note.id}
      className="note-card group relative rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 overflow-hidden"
      style={{ backgroundColor: note.color + '20', borderRight: `4px solid ${note.color}` }}
      onClick={() => openNote(note)}
      onContextMenu={(e) => handleContextMenu(e, note.id)}
    >
      {/* Lock indicator */}
      {note.locked && (
        <div className="absolute top-3 left-3 text-gray-400">
          <i className="fas fa-lock text-sm"></i>
        </div>
      )}

      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-3 right-3 text-amber-500">
          <i className="fas fa-thumbtack text-sm"></i>
        </div>
      )}

      {/* Title */}
      <h3 className="font-bold text-base mb-2 mt-2 line-clamp-2 text-gray-800 dark:text-gray-100">
        {note.locked ? (isRTL ? '🔒 یادداشت قفل شده' : '🔒 Locked Note') : note.title}
      </h3>

      {/* Date */}
      <p className="text-xs text-gray-400 mb-2">{formatDate(note.updatedAt)}</p>

      {/* Content preview */}
      {!note.locked && (
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3 leading-relaxed">
          {note.content}
        </p>
      )}

      {/* Checklist preview */}
      {note.checklist && !note.locked && (
        <div className="mb-3 space-y-1">
          {note.checklist.slice(0, 3).map(item => (
            <div key={item.id} className="flex items-center gap-2 text-xs text-gray-500">
              <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                {item.checked && <i className="fas fa-check text-white text-[8px]"></i>}
              </div>
              <span className={item.checked ? 'line-through opacity-50' : ''}>{item.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {note.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300">
            {tag}
          </span>
        ))}
      </div>

      {/* Media indicators */}
      <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
        {note.hasDrawing && (
          <span className="text-[10px] text-purple-500 flex items-center gap-1">
            <i className="fas fa-paint-brush"></i> {isRTL ? 'طراحی' : 'Drawing'}
          </span>
        )}
        {note.hasVoiceMemo && (
          <span className="text-[10px] text-blue-500 flex items-center gap-1">
            <i className="fas fa-microphone"></i> {isRTL ? 'صدا' : 'Voice'}
          </span>
        )}
        {note.hasImage && (
          <span className="text-[10px] text-green-500 flex items-center gap-1">
            <i className="fas fa-image"></i> {isRTL ? 'تصویر' : 'Image'}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <i className="fas fa-feather-alt text-white text-sm"></i>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
              {isRTL ? 'نوت‌فلو' : 'NoteFlow'}
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xl mx-auto relative">
            <i className={`fas fa-search absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-gray-400 text-sm`}></i>
            <input
              type="text"
              placeholder={isRTL ? 'جستجو در یادداشت‌ها...' : 'Search notes...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all`}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <i className="fas fa-user text-sm"></i>
            </button>
          </div>
        </div>
      </header>

      {/* Tags Filter */}
      <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-7xl mx-auto scrollbar-hide">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTag === tag
                  ? 'bg-violet-500 text-white shadow-md shadow-violet-500/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 max-w-7xl mx-auto w-full">
        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <i className="fas fa-thumbtack text-amber-500"></i>
              {isRTL ? 'سنجاق شده' : 'Pinned'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {pinnedNotes.map(renderNoteCard)}
            </div>
          </section>
        )}

        {/* All Notes */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <i className="fas fa-layer-group"></i>
            {isRTL ? 'همه یادداشت‌ها' : 'All Notes'}
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {filteredNotes.length}
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {unpinnedNotes.map(renderNoteCard)}
          </div>
          {filteredNotes.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <i className="fas fa-search text-4xl mb-4 opacity-30"></i>
              <p className="text-lg">{isRTL ? 'یادداشتی یافت نشد' : 'No notes found'}</p>
            </div>
          )}
        </section>
      </main>

      {/* FAB */}
      <button
        onClick={addNote}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-xl shadow-violet-500/30 flex items-center justify-center text-xl hover:scale-110 transition-transform z-50`}
      >
        <i className="fas fa-plus"></i>
      </button>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 min-w-[180px]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button onClick={() => { togglePin(contextMenu.noteId); setContextMenu(null); }} className="w-full px-4 py-2.5 text-sm text-right hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
              <i className="fas fa-thumbtack text-amber-500 w-4"></i>
              {isRTL ? 'سنجاق کردن' : 'Pin to top'}
            </button>
            <button onClick={() => { toggleLock(contextMenu.noteId); setContextMenu(null); }} className="w-full px-4 py-2.5 text-sm text-right hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
              <i className="fas fa-lock text-red-500 w-4"></i>
              {isRTL ? 'قفل کردن' : 'Lock note'}
            </button>
            <button onClick={() => { duplicateNote(contextMenu.noteId); setContextMenu(null); }} className="w-full px-4 py-2.5 text-sm text-right hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
              <i className="fas fa-copy text-blue-500 w-4"></i>
              {isRTL ? 'کپی کردن' : 'Make a copy'}
            </button>
            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            <button onClick={() => { deleteNote(contextMenu.noteId); setContextMenu(null); }} className="w-full px-4 py-2.5 text-sm text-right hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 flex items-center gap-3">
              <i className="fas fa-trash w-4"></i>
              {isRTL ? 'حذف' : 'Delete'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
