import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Note, ViewMode, AppLanguage, AppFont, translations, Translations, Tag, UISize, AppTheme } from './types';
import { VoiceRecording, InlineImage } from './types';

interface AppContextType {
  notes: Note[];
  currentNote: Note | null;
  viewMode: ViewMode;
  searchQuery: string;
  selectedTag: string;
  appLanguage: AppLanguage;
  isRTL: boolean;
  t: Translations;
  tags: Tag[];
  uiSize: UISize;
  setUISize: (size: UISize) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string) => void;
  setActiveTag: (tag: string) => void;
  setAppLanguage: (lang: AppLanguage) => void;
  createNote: () => void;
  addNote: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (note: Note | null) => void;
  openNote: (note: Note) => void;
  togglePin: (id: string) => void;
  toggleLock: (id: string) => void;
  duplicateNote: (id: string) => void;
  toggleRTL: () => void;
  setFontFamily: (font: AppFont) => void;
  addVoiceRecording: (recording: VoiceRecording) => void;
  addInlineImage: (image: InlineImage) => void;
  updateInlineImage: (id: string, updates: Partial<InlineImage>) => void;
  removeInlineImage: (id: string) => void;
  addTag: (name: string, color: string) => void;
  deleteTag: (id: string) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'جلسه تیم طراحی',
      content: 'بررسی طرح‌های جدید اپلیکیشن موبایل و تعیین اولویت‌های هفته آینده. نیاز به هماهنگی با تیم توسعه داریم.',
      tags: ['کاری'],
      color: '#a78bfa',
      pinned: true,
      locked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 30 * 60 * 1000),
      hasDrawing: false,
      hasVoiceMemo: false,
      hasImage: false,
      isRTL: true,
      fontFamily: 'vazirmatn',
      voiceRecordings: [],
      inlineImages: [],
    },
    {
      id: '2',
      title: 'Shopping List',
      content: 'Milk, eggs, bread, fruits, vegetables, and some snacks for the weekend gathering.',
      tags: ['Personal'],
      color: '#fbbf24',
      pinned: false,
      locked: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      hasDrawing: false,
      hasVoiceMemo: false,
      hasImage: false,
      isRTL: false,
      fontFamily: 'system',
      checklist: [
        { id: 'c1', text: 'Milk', checked: true },
        { id: 'c2', text: 'Eggs', checked: true },
        { id: 'c3', text: 'Bread', checked: false },
        { id: 'c4', text: 'Fruits', checked: false },
      ],
      voiceRecordings: [],
      inlineImages: [],
    },
    {
      id: '3',
      title: 'یادگیری ری‌اکت',
      content: 'مطالعه هوک‌های جدید React شامل useTransition و useDeferredValue. بررسی بهترین روش‌های بهینه‌سازی عملکرد.',
      tags: ['مطالعه'],
      color: '#34d399',
      pinned: false,
      locked: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      hasDrawing: true,
      hasVoiceMemo: true,
      hasImage: true,
      isRTL: true,
      fontFamily: 'nazanin',
      voiceRecordings: [],
      inlineImages: [],
    },
    {
      id: '4',
      title: 'Project Ideas',
      content: 'Brainstorming session notes for Q2 product roadmap. Focus on user engagement features and performance improvements.',
      tags: ['Design'],
      color: '#f472b6',
      pinned: true,
      locked: false,
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      hasDrawing: false,
      hasVoiceMemo: false,
      hasImage: false,
      isRTL: false,
      fontFamily: 'calibri',
      voiceRecordings: [],
      inlineImages: [],
    },
    {
      id: '5',
      title: 'یادداشت خصوصی',
      content: 'این یادداشت قفل شده و فقط با رمز عبور قابل دسترسی است.',
      tags: ['شخصی'],
      color: '#60a5fa',
      pinned: false,
      locked: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      hasDrawing: false,
      hasVoiceMemo: false,
      hasImage: false,
      isRTL: true,
      fontFamily: 'vazirmatn',
      voiceRecordings: [],
      inlineImages: [],
    },
    {
      id: '6',
      title: 'Workout Plan',
      content: 'Monday: Chest & Triceps\nTuesday: Back & Biceps\nWednesday: Rest\nThursday: Legs\nFriday: Shoulders & Abs',
      tags: ['Health'],
      color: '#fb923c',
      pinned: false,
      locked: false,
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      hasDrawing: false,
      hasVoiceMemo: false,
      hasImage: false,
      isRTL: false,
      fontFamily: 'system',
      checklist: [
        { id: 'w1', text: 'Monday - Chest', checked: true },
        { id: 'w2', text: 'Tuesday - Back', checked: true },
        { id: 'w3', text: 'Wednesday - Rest', checked: true },
        { id: 'w4', text: 'Thursday - Legs', checked: false },
        { id: 'w5', text: 'Friday - Shoulders', checked: false },
      ],
      voiceRecordings: [],
      inlineImages: [],
    },
    {
      id: '7',
      title: 'گزارش هفتگی',
      content: 'پیشرفت پروژه ۸۰٪ تکمیل شده. نیاز به بازبینی نهایی و ارسال به مشتری تا پایان هفته.',
      tags: ['کاری'],
      color: '#818cf8',
      pinned: false,
      locked: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      hasDrawing: false,
      hasVoiceMemo: false,
      hasImage: false,
      isRTL: true,
      fontFamily: 'vazirmatn',
      voiceRecordings: [],
      inlineImages: [],
    },
    {
      id: '8',
      title: 'Meeting Notes',
      content: 'Discussed the new feature rollout timeline. Action items assigned to the development team.',
      tags: ['Work'],
      color: '#2dd4bf',
      pinned: false,
      locked: false,
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      hasDrawing: false,
      hasVoiceMemo: false,
      hasImage: false,
      isRTL: false,
      fontFamily: 'calibri',
      voiceRecordings: [],
      inlineImages: [],
    },
  ]);

  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [appLanguage, setAppLanguageState] = useState<AppLanguage>('fa');
  const [uiSize, setUISizeState] = useState<UISize>('medium');
  const [theme, setThemeState] = useState<AppTheme>('violet');
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'کاری', color: '#a78bfa' },
    { id: '2', name: 'شخصی', color: '#fbbf24' },
    { id: '3', name: 'مطالعه', color: '#34d399' },
    { id: '4', name: 'طراحی', color: '#f472b6' },
    { id: '5', name: 'سلامتی', color: '#fb923c' },
  ]);

  const t = translations[appLanguage];
  const isRTL = appLanguage === 'fa';

  // Apply UI size to root element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('size-small', 'size-medium', 'size-large', 'size-xlarge');
    root.classList.add(`size-${uiSize}`);
  }, [uiSize]);

  // Apply theme to root element
  useEffect(() => {
    const root = document.documentElement;
    const allThemes = ['theme-violet', 'theme-ocean', 'theme-forest', 'theme-sunset', 'theme-rose', 'theme-midnight', 'theme-emerald', 'theme-coral'];
    allThemes.forEach(t => root.classList.remove(t));
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  const setUISize = useCallback((size: UISize) => {
    setUISizeState(size);
  }, []);

  const setTheme = useCallback((newTheme: AppTheme) => {
    setThemeState(newTheme);
  }, []);

  const setAppLanguage = useCallback((lang: AppLanguage) => {
    setAppLanguageState(lang);
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  const createNote = useCallback(() => {
    const isRTLDefault = appLanguage === 'fa';
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      tags: [],
      color: '#a78bfa',
      pinned: false,
      locked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      hasDrawing: false,
      hasVoiceMemo: false,
      hasImage: false,
      isRTL: isRTLDefault,
      fontFamily: isRTLDefault ? 'vazirmatn' : 'system',
      voiceRecordings: [],
      inlineImages: [],
    };
    setNotes(prev => [newNote, ...prev]);
    setCurrentNote(newNote);
    setViewMode('editor');
  }, [appLanguage]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
    ));
    setCurrentNote(prev => prev && prev.id === id ? { ...prev, ...updates, updatedAt: new Date() } : prev);
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (currentNote?.id === id) {
      setCurrentNote(null);
      setViewMode('dashboard');
    }
  }, [currentNote]);

  const openNote = useCallback((note: Note) => {
    setCurrentNote(note);
    setViewMode('editor');
  }, []);

  const togglePin = useCallback((id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) updateNote(id, { pinned: !note.pinned });
  }, [notes, updateNote]);

  const toggleLock = useCallback((id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) updateNote(id, { locked: !note.locked });
  }, [notes, updateNote]);

  const duplicateNote = useCallback((id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      const newNote: Note = {
        ...note,
        id: Date.now().toString(),
        title: note.title + ' (copy)',
        pinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        voiceRecordings: [...(note.voiceRecordings || [])],
        inlineImages: [...(note.inlineImages || [])],
        checklist: note.checklist ? [...note.checklist] : undefined,
      };
      setNotes(prev => [newNote, ...prev]);
    }
  }, [notes]);

  const toggleRTL = useCallback(() => {
    if (currentNote) {
      updateNote(currentNote.id, { isRTL: !currentNote.isRTL });
    }
  }, [currentNote, updateNote]);

  const setFontFamily = useCallback((font: AppFont) => {
    if (currentNote) {
      updateNote(currentNote.id, { fontFamily: font });
    }
  }, [currentNote, updateNote]);

  const addVoiceRecording = useCallback((recording: VoiceRecording) => {
    if (currentNote) {
      const existing = currentNote.voiceRecordings || [];
      const updated = [...existing, recording];
      updateNote(currentNote.id, { voiceRecordings: updated, hasVoiceMemo: true });
    }
  }, [currentNote, updateNote]);

  const addInlineImage = useCallback((image: InlineImage) => {
    if (currentNote) {
      const existing = currentNote.inlineImages || [];
      const updated = [...existing, image];
      updateNote(currentNote.id, { inlineImages: updated, hasImage: true });
    }
  }, [currentNote, updateNote]);

  const updateInlineImage = useCallback((id: string, updates: Partial<InlineImage>) => {
    if (currentNote) {
      const existing = currentNote.inlineImages || [];
      const updated = existing.map(img =>
        img.id === id ? { ...img, ...updates } : img
      );
      updateNote(currentNote.id, { inlineImages: updated });
    }
  }, [currentNote, updateNote]);

  const removeInlineImage = useCallback((id: string) => {
    if (currentNote) {
      const existing = currentNote.inlineImages || [];
      const updated = existing.filter(img => img.id !== id);
      updateNote(currentNote.id, { inlineImages: updated, hasImage: updated.length > 0 });
    }
  }, [currentNote, updateNote]);

  const addTag = useCallback((name: string, color: string) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name,
      color,
    };
    setTags(prev => [...prev, newTag]);
  }, []);

  const deleteTag = useCallback((id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
  }, []);

  const updateTag = useCallback((id: string, updates: Partial<Tag>) => {
    setTags(prev => prev.map(tag =>
      tag.id === id ? { ...tag, ...updates } : tag
    ));
  }, []);

  return (
    <AppContext.Provider value={{
      notes,
      currentNote,
      viewMode,
      searchQuery,
      selectedTag,
      appLanguage,
      isRTL,
      t,
      tags,
      uiSize,
      setUISize,
      theme,
      setTheme,
      setViewMode,
      setSearchQuery,
      setSelectedTag,
      setActiveTag: setSelectedTag,
      setAppLanguage,
      createNote,
      addNote: createNote,
      updateNote,
      deleteNote,
      setCurrentNote,
      openNote,
      togglePin,
      toggleLock,
      duplicateNote,
      toggleRTL,
      setFontFamily,
      addVoiceRecording,
      addInlineImage,
      updateInlineImage,
      removeInlineImage,
      addTag,
      deleteTag,
      updateTag,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
