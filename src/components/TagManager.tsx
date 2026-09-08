import React, { useState } from 'react';
import { useApp } from '../store';
import { Tag } from '../types';

interface TagManagerProps {
  onClose: () => void;
}

export default function TagManager({ onClose }: TagManagerProps) {
  const { tags, addTag, deleteTag, updateTag, t, isRTL } = useApp();
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#a78bfa');
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddTag = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim(), newTagColor);
      setNewTagName('');
      setNewTagColor('#a78bfa');
    }
  };

  const handleDeleteTag = (id: string) => {
    if (confirm(t.confirmDeleteTag)) {
      deleteTag(id);
    }
  };

  const handleStartEdit = (tag: Tag) => {
    setEditingTag(tag);
    setEditName(tag.name);
  };

  const handleSaveEdit = () => {
    if (editingTag && editName.trim()) {
      updateTag(editingTag.id, { name: editName.trim() });
      setEditingTag(null);
      setEditName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditName('');
  };

  const colorOptions = [
    '#a78bfa', '#fbbf24', '#34d399', '#f472b6', '#fb923c',
    '#60a5fa', '#818cf8', '#2dd4bf', '#f87171', '#a3e635'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 font-vazirmatn">
          {t.manageTags}
        </h2>

        {/* Add New Tag */}
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <div className="space-y-3">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder={t.newTagName}
              className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 font-vazirmatn"
            />
            
            {/* Color Picker */}
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    newTagColor === color ? 'ring-2 ring-offset-2 ring-violet-500 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <button
              onClick={handleAddTag}
              disabled={!newTagName.trim()}
              className="w-full px-4 py-2.5 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-vazirmatn"
              style={{
                background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-hover))',
                boxShadow: '0 4px 6px -1px var(--color-shadow)',
              }}
            >
              {t.addTag}
            </button>
          </div>
        </div>

        {/* Existing Tags */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
            >
              {editingTag?.id === tag.id ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 font-vazirmatn"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    {t.save}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 rounded-lg bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
                  >
                    {t.cancel}
                  </button>
                </>
              ) : (
                <>
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 text-slate-800 dark:text-slate-100 font-vazirmatn">
                    {tag.name}
                  </span>
                  <button
                    onClick={() => handleStartEdit(tag)}
                    className="px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm"
                  >
                    {t.edit}
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm"
                  >
                    {t.delete}
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-vazirmatn"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}
