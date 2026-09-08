import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Note, ViewMode, VoiceRecording, InlineImage } from './types';

interface AppState {
  notes: Note[];
  currentNote: Note | null;
  viewMode: ViewMode;
  searchQuery: string;
  activeTag: string;
  isRTL: boolean;
  fontFamily: string;
  theme: 'light' | 'dark';
}

interface AppContextType extends AppState {
  setCurrentNote: (note: Note | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setActiveTag: (tag: string) => void;
  addNote: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  toggleLock: (id: string) => void;
  duplicateNote: (id: string) => void;
  toggleRTL: () => void;
  setFontFamily: (font: string) => void;
  toggleTheme: () => void;
  addVoiceRecording: (noteId: string, recording: VoiceRecording) => void;
  addInlineImage: (noteId: string, image: InlineImage) => void;
  updateInlineImage: (noteId: string, imageId: string, updates: Partial<InlineImage>) => void;
  removeInlineImage: (noteId: string, imageId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const createDefaultNote = (isRTL: boolean): Note => ({
  id: Date.now().toString(),
  title: isRTL ? 'یادداشت جدید' : 'New Note',
  content: '',
  tags: [],
  color: '#ffffff',
  pinned: false,
  locked: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  hasDrawing: false,
  hasVoiceMemo: false,
  hasImage: false,
  voiceRecordings: [],
  inlineImages: [],
  isRTL,
  fontFamily: isRTL ? 'vazirmatn' : 'calibri',
});

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'جلسه پروژه جدید',
    content: 'بررسی نیازمندی‌های پروژه و تقسیم وظایف بین اعضای تیم. جلسه بعدی چهارشنبه ساعت ۱۰ صبح برگزار می‌شود.',
    tags: ['کار'],
    color: '#e8f4fd',
    pinned: true,
    locked: false,
    createdAt: new Date(2024, 0, 15),
    updatedAt: new Date(2024, 0, 16),
    hasDrawing: false,
    hasVoiceMemo: false,
    hasImage: false,
    voiceRecordings: [],
    inlineImages: [],
    isRTL: true,
    fontFamily: 'vazirmatn',
  },
  {
    id: '2',
    title: 'Shopping List',
    content: 'Milk, Bread, Eggs, Fruits, Vegetables, Coffee beans',
    tags: ['شخصی'],
    color: '#fef3e2',
    pinned: false,
    locked: false,
    createdAt: new Date(2024, 0, 14),
    updatedAt: new Date(2024, 0, 14),
    hasDrawing: false,
    hasVoiceMemo: false,
    hasImage: false,
    checklist: [
      { id: 'c1', text: 'Milk', checked: true },
      { id: 'c2', text: 'Bread', checked: false },
      { id: 'c3', text: 'Eggs', checked: true },
    ],
    voiceRecordings: [],
    inlineImages: [],
    isRTL: false,
    fontFamily: 'calibri',
  },
  {
    id: '3',
    title: 'ایده‌های طراحی اپلیکیشن',
    content: 'طراحی رابط کاربری مدرن با پشتیبانی از حالت تاریک و روشن. استفاده از انیمیشن‌های نرم و روان.',
    tags: ['طراحی'],
    color: '#f3e8ff',
    pinned: false,
    locked: false,
    createdAt: new Date(2024, 0, 13),
    updatedAt: new Date(2024, 0, 15),
    hasDrawing: true,
    hasVoiceMemo: false,
    hasImage: true,
    voiceRecordings: [],
    inlineImages: [],
    isRTL: true,
    fontFamily: 'vazirmatn',
  },
  {
    id: '4',
    title: 'یادداشت قفل شده',
    content: 'اطلاعات حساس و محرمانه...',
    tags: ['شخصی'],
    color: '#fce4ec',
    pinned: false,
    locked: true,
    createdAt: new Date(2024, 0, 12),
    updatedAt: new Date(2024, 0, 12),
    hasDrawing: false,
    hasVoiceMemo: false,
    hasImage: false,
    voiceRecordings: [],
    inlineImages: [],
    isRTL: true,
    fontFamily: 'vazirmatn',
  },
  {
    id: '5',
    title: 'برنامه ورزشی هفتگی',
    content: 'شنبه: دویدن ۵ کیلومتر\nیکشنبه: بدنسازی\nدوشنبه: شنا\nسه‌شنبه: یوگا',
    tags: ['سلامت'],
    color: '#e8f5e9',
    pinned: false,
    locked: false,
    createdAt: new Date(2024, 0, 10),
    updatedAt: new Date(2024, 0, 14),
    hasDrawing: false,
    hasVoiceMemo: true,
    hasImage: false,
    checklist: [
      { id: 'c4', text: 'دوشنبه - شنا', checked: true },
      { id: 'c5', text: 'سه‌شنبه - یوگا', checked: false },
      { id: 'c6', text: 'چهارشنبه - دویدن', checked: false },
    ],
    voiceRecordings: [],
    inlineImages: [],
    isRTL: true,
    fontFamily: 'vazirmatn',
  },
  {
    id: '6',
    title: 'مطالعه فریمورک React',
    content: 'یادگیری React Hooks و Context API. بررسی بهترین روش‌های مدیریت state.',
    tags: ['مطالعه'],
    color: '#fff3e0',
    pinned: false,
    locked: false,
    createdAt: new Date(2024, 0, 9),
    updatedAt: new Date(2024, 0, 13),
    hasDrawing: false,
    hasVoiceMemo: false,
    hasImage: false,
    voiceRecordings: [],
    inlineImages: [],
    isRTL: true,
    fontFamily: 'nazanin',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('همه');
  const [isRTL, setIsRTL] = useState(true);
  const [fontFamily, setFontFamily] = useState('vazirmatn');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const addNote = useCallback(() => {
    const newNote = createDefaultNote(isRTL);
    setNotes(prev => [newNote, ...prev]);
    setCurrentNote(newNote);
    setViewMode('editor');
  }, [isRTL]);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
    ));
    setCurrentNote(prev => prev && prev.id === id ? { ...prev, ...updates, updatedAt: new Date() } : prev);
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    setCurrentNote(prev => prev?.id === id ? null : prev);
    setViewMode('dashboard');
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
    setCurrentNote(prev => prev?.id === id ? { ...prev, pinned: !prev.pinned } : prev);
  }, []);

  const toggleLock = useCallback((id: string) => {
    setNotes(prev => prev.map(note =>
      note.id === id ? { ...note, locked: !note.locked } : note
    ));
    setCurrentNote(prev => prev?.id === id ? { ...prev, locked: !prev.locked } : prev);
  }, []);

  const duplicateNote = useCallback((id: string) => {
    const note = notes.find(n => n.id === id);
    if (note) {
      const newNote: Note = {
        ...note,
        id: Date.now().toString(),
        title: note.title + ' (کپی)',
        createdAt: new Date(),
        updatedAt: new Date(),
        pinned: false,
      };
      setNotes(prev => [newNote, ...prev]);
    }
  }, [notes]);

  const toggleRTL = useCallback(() => {
    setIsRTL(prev => {
      const newVal = !prev;
      document.documentElement.dir = newVal ? 'rtl' : 'ltr';
      document.documentElement.lang = newVal ? 'fa' : 'en';
      if (!newVal) {
        document.documentElement.classList.add('ltr');
      } else {
        document.documentElement.classList.remove('ltr');
      }
      return newVal;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      return newTheme;
    });
  }, []);

  const addVoiceRecording = useCallback((noteId: string, recording: VoiceRecording) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? {
        ...note,
        voiceRecordings: [...(note.voiceRecordings || []), recording],
        hasVoiceMemo: true,
        updatedAt: new Date(),
      } : note
    ));
    setCurrentNote(prev => prev && prev.id === noteId ? {
      ...prev,
      voiceRecordings: [...(prev.voiceRecordings || []), recording],
      hasVoiceMemo: true,
      updatedAt: new Date(),
    } : prev);
  }, []);

  const addInlineImage = useCallback((noteId: string, image: InlineImage) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? {
        ...note,
        inlineImages: [...(note.inlineImages || []), image],
        hasImage: true,
        updatedAt: new Date(),
      } : note
    ));
    setCurrentNote(prev => prev && prev.id === noteId ? {
      ...prev,
      inlineImages: [...(prev.inlineImages || []), image],
      hasImage: true,
      updatedAt: new Date(),
    } : prev);
  }, []);

  const updateInlineImage = useCallback((noteId: string, imageId: string, updates: Partial<InlineImage>) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? {
        ...note,
        inlineImages: (note.inlineImages || []).map(img =>
          img.id === imageId ? { ...img, ...updates } : img
        ),
        updatedAt: new Date(),
      } : note
    ));
    setCurrentNote(prev => prev && prev.id === noteId ? {
      ...prev,
      inlineImages: (prev.inlineImages || []).map(img =>
        img.id === imageId ? { ...img, ...updates } : img
      ),
      updatedAt: new Date(),
    } : prev);
  }, []);

  const removeInlineImage = useCallback((noteId: string, imageId: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId ? {
        ...note,
        inlineImages: (note.inlineImages || []).filter(img => img.id !== imageId),
        hasImage: (note.inlineImages || []).filter(img => img.id !== imageId).length > 0,
        updatedAt: new Date(),
      } : note
    ));
    setCurrentNote(prev => prev && prev.id === noteId ? {
      ...prev,
      inlineImages: (prev.inlineImages || []).filter(img => img.id !== imageId),
      hasImage: (prev.inlineImages || []).filter(img => img.id !== imageId).length > 0,
      updatedAt: new Date(),
    } : prev);
  }, []);

  return (
    <AppContext.Provider value={{
      notes, currentNote, viewMode, searchQuery, activeTag, isRTL, fontFamily, theme,
      setCurrentNote, setViewMode, setSearchQuery, setActiveTag,
      addNote, updateNote, deleteNote, togglePin, toggleLock, duplicateNote,
      toggleRTL, setFontFamily, toggleTheme,
      addVoiceRecording, addInlineImage, updateInlineImage, removeInlineImage,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
