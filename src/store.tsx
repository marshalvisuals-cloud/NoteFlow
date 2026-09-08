import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Note, ViewMode } from './types';

interface AppState {
  notes: Note[];
  currentNote: Note | null;
  viewMode: ViewMode;
  searchQuery: string;
  selectedTag: string | null;
}

interface AppContextType extends AppState {
  setCurrentNote: (note: Note | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTag: (tag: string | null) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
  duplicateNote: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes - Q4 Planning',
    content: 'Discussed roadmap priorities for next quarter. Key action items include launching the new dashboard feature and improving performance metrics. Team agreed on bi-weekly sprint reviews.',
    tags: ['Work'],
    color: '#6366f1',
    pinned: true,
    locked: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    hasDrawing: false,
    hasVoiceMemo: false,
    hasImage: false,
  },
  {
    id: '2',
    title: 'Grocery List',
    content: 'Organic milk, fresh bread, avocados, cherry tomatoes, pasta, olive oil, garlic, basil leaves, parmesan cheese',
    tags: ['Personal'],
    color: '#10b981',
    pinned: false,
    locked: false,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    hasDrawing: false,
    hasVoiceMemo: false,
    hasImage: false,
    checklist: [
      { id: 'c1', text: 'Organic milk', checked: true },
      { id: 'c2', text: 'Fresh bread', checked: true },
      { id: 'c3', text: 'Avocados', checked: false },
      { id: 'c4', text: 'Cherry tomatoes', checked: false },
      { id: 'c5', text: 'Pasta', checked: false },
    ],
  },
  {
    id: '3',
    title: 'Kajian - Islamic Studies',
    content: 'Notes from today\'s study session on the importance of patience (صبر) in daily life. Key takeaways about mindfulness and gratitude.',
    tags: ['Study'],
    color: '#8b5cf6',
    pinned: false,
    locked: false,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    hasDrawing: false,
    hasVoiceMemo: true,
    hasImage: false,
  },
  {
    id: '4',
    title: 'UI Design Ideas',
    content: 'Exploring glassmorphism effects for the new app redesign. Consider using frosted glass cards with subtle gradients. Reference: Apple HIG guidelines.',
    tags: ['Design'],
    color: '#f59e0b',
    pinned: false,
    locked: false,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    hasDrawing: true,
    hasVoiceMemo: false,
    hasImage: true,
  },
  {
    id: '5',
    title: 'Password Vault',
    content: '••••••••••••',
    tags: ['Personal'],
    color: '#ef4444',
    pinned: false,
    locked: true,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
    hasDrawing: false,
    hasVoiceMemo: false,
    hasImage: false,
  },
  {
    id: '6',
    title: 'Workout Plan - January',
    content: 'Monday: Upper body strength\nTuesday: Cardio HIIT\nWednesday: Yoga & stretching\nThursday: Lower body\nFriday: Full body circuit\nWeekend: Active recovery',
    tags: ['Health'],
    color: '#06b6d4',
    pinned: false,
    locked: false,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    hasDrawing: false,
    hasVoiceMemo: false,
    hasImage: false,
    checklist: [
      { id: 'w1', text: 'Monday: Upper body', checked: true },
      { id: 'w2', text: 'Tuesday: Cardio HIIT', checked: true },
      { id: 'w3', text: 'Wednesday: Yoga', checked: true },
      { id: 'w4', text: 'Thursday: Lower body', checked: false },
      { id: 'w5', text: 'Friday: Full body', checked: false },
    ],
  },
  {
    id: '7',
    title: 'Book Recommendations',
    content: '1. Atomic Habits by James Clear\n2. Deep Work by Cal Newport\n3. The Psychology of Money by Morgan Housel\n4. Thinking, Fast and Slow by Daniel Kahneman',
    tags: ['Personal'],
    color: '#ec4899',
    pinned: false,
    locked: false,
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
    hasDrawing: false,
    hasVoiceMemo: false,
    hasImage: false,
  },
  {
    id: '8',
    title: 'API Integration Notes',
    content: 'REST endpoints for the payment gateway. Authentication uses OAuth 2.0 with JWT tokens. Rate limit: 1000 req/min. Webhook callbacks configured for payment events.',
    tags: ['Work'],
    color: '#3b82f6',
    pinned: false,
    locked: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    hasDrawing: false,
    hasVoiceMemo: false,
    hasImage: false,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const addNote = useCallback((note: Note) => {
    setNotes(prev => [note, ...prev]);
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n));
    setCurrentNote(prev => prev && prev.id === id ? { ...prev, ...updates, updatedAt: new Date() } : prev);
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    setCurrentNote(prev => prev && prev.id === id ? null : prev);
  }, []);

  const togglePin = useCallback((id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  }, []);

  const duplicateNote = useCallback((id: string) => {
    setNotes(prev => {
      const note = prev.find(n => n.id === id);
      if (!note) return prev;
      const newNote: Note = {
        ...note,
        id: Date.now().toString(),
        title: `${note.title} (Copy)`,
        pinned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return [newNote, ...prev];
    });
  }, []);

  return (
    <AppContext.Provider value={{
      notes, currentNote, viewMode, searchQuery, selectedTag,
      setCurrentNote, setViewMode, setSearchQuery, setSelectedTag,
      addNote, updateNote, deleteNote, togglePin, duplicateNote,
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
