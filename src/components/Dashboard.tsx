import React, { useState } from 'react';
import { useApp } from '../store';
import { Note } from '../types';
import TagManager from './TagManager';

const Dashboard: React.FC = () => {
  const {
    notes,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    appLanguage,
    isRTL,
    t,
    tags,
    createNote,
    openNote,
    togglePin,
    toggleLock,
    duplicateNote,
    deleteNote,
  } = useApp();

  const [contextMenu, setContextMenu] = useState<{ noteId: string; x: number; y: number } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showTagManager, setShowTagManager] = useState(false);

  const tagFilters = [
    { id: 'all', label: t.allNotes, icon: '📋', color: '#6b7280' },
    ...tags.map(tag => ({ id: tag.name, label: tag.name, icon: '🏷️', color: tag.color })),
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const recentNotes = filteredNotes.filter(n => !n.pinned);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t.justNow;
    if (minutes < 60) return `${minutes} ${t.minutesAgo}`;
    if (hours < 24) return `${hours} ${t.hoursAgo}`;
    return `${days} ${t.daysAgo}`;
  };

  const handleContextMenu = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    setContextMenu({ noteId, x: e.clientX, y: e.clientY });
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    setDeleteConfirm(null);
  };

  const NoteCard: React.FC<{ note: Note }> = ({ note }) => (
    <div
      className={`group relative rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border ${
        note.locked
          ? 'bg-slate-100/80 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
          : 'bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50'
      } backdrop-blur-sm`}
      style={{ borderInlineStart: `4px solid ${note.color}` }}
      onClick={() => !note.locked && openNote(note)}
      onContextMenu={(e) => handleContextMenu(e, note.id)}
    >
      {/* Lock overlay */}
      {note.locked && (
        <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-fontBody">{t.locked}</p>
          </div>
        </div>
      )}

      {/* Pin badge */}
      {note.pinned && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
          <span className="text-xs">📌</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className={`font-bold text-slate-800 dark:text-slate-100 line-clamp-1 font-fontBody ${note.isRTL ? 'text-right' : 'text-left'}`} dir={note.isRTL ? 'rtl' : 'ltr'}>
          {note.title || t.untitled}
        </h3>
      </div>

      {/* Content preview */}
      <p className={`text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-3 font-fontBody ${note.isRTL ? 'text-right' : 'text-left'}`} dir={note.isRTL ? 'rtl' : 'ltr'}>
        {note.content || t.placeholder}
      </p>

      {/* Checklist preview */}
      {note.checklist && note.checklist.length > 0 && (
        <div className="mb-3 space-y-1">
          {note.checklist.slice(0, 3).map(item => (
            <div key={item.id} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className={`w-3.5 h-3.5 rounded border-2 flex items-center justify-center ${item.checked ? 'bg-violet-500 border-violet-500' : 'border-slate-300 dark:border-slate-600'}`}>
                {item.checked && <span className="text-white text-[8px]">✓</span>}
              </div>
              <span className={item.checked ? 'line-through' : ''}>{item.text}</span>
            </div>
          ))}
          {note.checklist.length > 3 && (
            <p className="text-xs text-slate-400">+{note.checklist.length - 3} more</p>
          )}
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {note.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium font-fontBody">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 dark:text-slate-500 font-fontBody">
          {formatDate(note.updatedAt)}
        </span>
        <div className="flex items-center gap-1.5">
          {note.hasVoiceMemo && <span className="text-xs" title={t.voiceMemo}>🎙️</span>}
          {note.hasImage && <span className="text-xs" title={t.insertImage}>🖼️</span>}
          {note.hasDrawing && <span className="text-xs" title={t.drawingCanvas}>🎨</span>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="w-full ps-12 pe-4 py-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 backdrop-blur-sm transition-all font-fontBody"
          style={{
            // @ts-ignore
            '--tw-ring-color': 'var(--color-shadow)',
          }}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Tags Filter */}
      <div className="flex flex-wrap gap-2">
        {tagFilters.map(tag => (
          <button
            key={tag.id}
            onClick={() => setSelectedTag(tag.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 font-fontBody ${
              selectedTag === tag.id
                ? 'text-white shadow-lg'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
            style={selectedTag === tag.id ? {
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 10px 15px -3px var(--color-shadow)',
            } : undefined}
          >
            <span>{tag.icon}</span>
            <span>{tag.label}</span>
          </button>
        ))}
        
        {/* Manage Tags Button */}
        <button
          onClick={() => setShowTagManager(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 font-fontBody bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
          title={t.manageTags}
        >
          <span>⚙️</span>
        </button>
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 font-fontBody">
            <span>📌</span>
            <span>{t.pinnedNotes}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Notes */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 font-fontBody">
          <span>📝</span>
          <span>{recentNotes.length > 0 ? t.recentNotes : t.allNotes}</span>
          <span className="text-sm font-normal text-slate-400">({recentNotes.length})</span>
        </h2>
        {recentNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-slate-500 dark:text-slate-400 font-fontBody">
              {searchQuery ? t.noSearchResults : t.noNotes}
            </p>
            {!searchQuery && (
              <p className="text-sm text-slate-400 mt-2 font-fontBody">{t.noNotesDesc}</p>
            )}
          </div>
        )}
      </div>

      {/* FAB - New Note */}
      <button
        onClick={createNote}
        className="fixed bottom-8 end-8 w-14 h-14 rounded-full text-white flex items-center justify-center hover:scale-110 transition-all duration-200 z-40"
        style={{
          background: 'linear-gradient(to bottom right, var(--color-primary), var(--color-primary-hover))',
          boxShadow: '0 20px 25px -5px var(--color-shadow), 0 10px 10px -5px var(--color-shadow)',
        }}
        title={t.newNote}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setContextMenu(null)} />
          <div
            className="fixed z-50 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 min-w-[180px] font-fontBody"
            style={{ top: contextMenu.y, left: isRTL ? undefined : contextMenu.x, right: isRTL ? window.innerWidth - contextMenu.x : undefined }}
          >
            <button
              onClick={() => { togglePin(contextMenu.noteId); setContextMenu(null); }}
              className="w-full px-4 py-2.5 text-start text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
            >
              <span>📌</span>
              <span>{t.pin}</span>
            </button>
            <button
              onClick={() => { toggleLock(contextMenu.noteId); setContextMenu(null); }}
              className="w-full px-4 py-2.5 text-start text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
            >
              <span>🔒</span>
              <span>{t.lock}</span>
            </button>
            <button
              onClick={() => { duplicateNote(contextMenu.noteId); setContextMenu(null); }}
              className="w-full px-4 py-2.5 text-start text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
            >
              <span>📄</span>
              <span>{t.copy}</span>
            </button>
            <hr className="my-1 border-slate-200 dark:border-slate-700" />
            <button
              onClick={() => { setDeleteConfirm(contextMenu.noteId); setContextMenu(null); }}
              className="w-full px-4 py-2.5 text-start text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3"
            >
              <span>🗑️</span>
              <span>{t.delete}</span>
            </button>
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl font-fontBody">
            <p className="text-slate-800 dark:text-slate-100 mb-6 text-center">{t.confirmDelete}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Manager Modal */}
      {showTagManager && (
        <TagManager onClose={() => setShowTagManager(false)} />
      )}
    </div>
  );
};

export default Dashboard;
