export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  pinned: boolean;
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasDrawing: boolean;
  hasVoiceMemo: boolean;
  hasImage: boolean;
  checklist?: ChecklistItem[];
  voiceRecordings?: VoiceRecording[];
  inlineImages?: InlineImage[];
  isRTL: boolean;
  fontFamily: string;
}

export interface VoiceRecording {
  id: string;
  blobUrl: string;
  base64Data?: string;
  duration: number;
  insertedAt: number;
  position: number; // position in content where it's inserted
}

export interface InlineImage {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  position: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface DrawingStroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  tool: 'pen' | 'highlighter' | 'eraser';
}

export type ViewMode = 'dashboard' | 'editor' | 'drawing';

export type AppLanguage = 'en' | 'fa';

export type AppFont = 'system' | 'vazirmatn' | 'nazanin' | 'calibri';

export type UISize = 'small' | 'medium' | 'large' | 'xlarge';

export const UI_SIZE_OPTIONS: { value: UISize; labelEn: string; labelFa: string; scale: number }[] = [
  { value: 'small', labelEn: 'Small', labelFa: 'کوچک', scale: 0.875 },
  { value: 'medium', labelEn: 'Medium', labelFa: 'متوسط', scale: 1 },
  { value: 'large', labelEn: 'Large', labelFa: 'بزرگ', scale: 1.125 },
  { value: 'xlarge', labelEn: 'Extra Large', labelFa: 'خیلی بزرگ', scale: 1.25 },
];

export type AppTheme = 'violet' | 'ocean' | 'forest' | 'sunset' | 'rose' | 'midnight' | 'emerald' | 'coral';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  shadow: string;
  text: string;
  textMuted: string;
  border: string;
  bgLight: string;
  bgDark: string;
}

export const THEME_OPTIONS: { value: AppTheme; labelEn: string; labelFa: string; colors: ThemeColors; preview: string[] }[] = [
  {
    value: 'violet',
    labelEn: 'Violet',
    labelFa: 'بنفش',
    colors: {
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      secondary: '#a78bfa',
      accent: '#c084fc',
      gradientFrom: '#f5f3ff',
      gradientVia: '#ede9fe',
      gradientTo: '#ddd6fe',
      shadow: 'rgba(139, 92, 246, 0.25)',
      text: '#5b21b6',
      textMuted: '#6d28d9',
      border: '#c4b5fd',
      bgLight: '#faf5ff',
      bgDark: '#4c1d95',
    },
    preview: ['#8b5cf6', '#a78bfa', '#c084fc', '#ddd6fe'],
  },
  {
    value: 'ocean',
    labelEn: 'Ocean',
    labelFa: 'اقیانوس',
    colors: {
      primary: '#0891b2',
      primaryHover: '#0e7490',
      secondary: '#22d3ee',
      accent: '#06b6d4',
      gradientFrom: '#ecfeff',
      gradientVia: '#cffafe',
      gradientTo: '#a5f3fc',
      shadow: 'rgba(8, 145, 178, 0.25)',
      text: '#155e75',
      textMuted: '#0e7490',
      border: '#67e8f9',
      bgLight: '#f0fdfa',
      bgDark: '#164e63',
    },
    preview: ['#0891b2', '#22d3ee', '#06b6d4', '#a5f3fc'],
  },
  {
    value: 'forest',
    labelEn: 'Forest',
    labelFa: 'جنگل',
    colors: {
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#34d399',
      accent: '#10b981',
      gradientFrom: '#ecfdf5',
      gradientVia: '#d1fae5',
      gradientTo: '#a7f3d0',
      shadow: 'rgba(5, 150, 105, 0.25)',
      text: '#065f46',
      textMuted: '#047857',
      border: '#6ee7b7',
      bgLight: '#f0fdf4',
      bgDark: '#064e3b',
    },
    preview: ['#059669', '#34d399', '#10b981', '#a7f3d0'],
  },
  {
    value: 'sunset',
    labelEn: 'Sunset',
    labelFa: 'غروب',
    colors: {
      primary: '#ea580c',
      primaryHover: '#c2410c',
      secondary: '#fb923c',
      accent: '#f97316',
      gradientFrom: '#fff7ed',
      gradientVia: '#ffedd5',
      gradientTo: '#fed7aa',
      shadow: 'rgba(234, 88, 12, 0.25)',
      text: '#9a3412',
      textMuted: '#c2410c',
      border: '#fdba74',
      bgLight: '#fffbeb',
      bgDark: '#7c2d12',
    },
    preview: ['#ea580c', '#fb923c', '#f97316', '#fed7aa'],
  },
  {
    value: 'rose',
    labelEn: 'Rose',
    labelFa: 'گل سرخ',
    colors: {
      primary: '#e11d48',
      primaryHover: '#be123c',
      secondary: '#fb7185',
      accent: '#f43f5e',
      gradientFrom: '#fff1f2',
      gradientVia: '#ffe4e6',
      gradientTo: '#fecdd3',
      shadow: 'rgba(225, 29, 72, 0.25)',
      text: '#9f1239',
      textMuted: '#be123c',
      border: '#fda4af',
      bgLight: '#fef2f2',
      bgDark: '#881337',
    },
    preview: ['#e11d48', '#fb7185', '#f43f5e', '#fecdd3'],
  },
  {
    value: 'midnight',
    labelEn: 'Midnight',
    labelFa: 'نیمه‌شب',
    colors: {
      primary: '#4f46e5',
      primaryHover: '#4338ca',
      secondary: '#818cf8',
      accent: '#6366f1',
      gradientFrom: '#eef2ff',
      gradientVia: '#e0e7ff',
      gradientTo: '#c7d2fe',
      shadow: 'rgba(79, 70, 229, 0.25)',
      text: '#3730a3',
      textMuted: '#4338ca',
      border: '#a5b4fc',
      bgLight: '#f5f3ff',
      bgDark: '#312e81',
    },
    preview: ['#4f46e5', '#818cf8', '#6366f1', '#c7d2fe'],
  },
  {
    value: 'emerald',
    labelEn: 'Emerald',
    labelFa: 'زمرد',
    colors: {
      primary: '#0d9488',
      primaryHover: '#0f766e',
      secondary: '#2dd4bf',
      accent: '#14b8a6',
      gradientFrom: '#f0fdfa',
      gradientVia: '#ccfbf1',
      gradientTo: '#99f6e4',
      shadow: 'rgba(13, 148, 136, 0.25)',
      text: '#115e59',
      textMuted: '#0f766e',
      border: '#5eead4',
      bgLight: '#f0fdfa',
      bgDark: '#134e4a',
    },
    preview: ['#0d9488', '#2dd4bf', '#14b8a6', '#99f6e4'],
  },
  {
    value: 'coral',
    labelEn: 'Coral',
    labelFa: 'مرجانی',
    colors: {
      primary: '#db2777',
      primaryHover: '#be185d',
      secondary: '#f472b6',
      accent: '#ec4899',
      gradientFrom: '#fdf2f8',
      gradientVia: '#fce7f3',
      gradientTo: '#fbcfe8',
      shadow: 'rgba(219, 39, 119, 0.25)',
      text: '#9d174d',
      textMuted: '#be185d',
      border: '#f9a8d4',
      bgLight: '#fdf4ff',
      bgDark: '#831843',
    },
    preview: ['#db2777', '#f472b6', '#ec4899', '#fbcfe8'],
  },
];

export const FONT_OPTIONS: { value: AppFont; labelEn: string; labelFa: string; family: string }[] = [
  { value: 'system', labelEn: 'System', labelFa: 'سیستم', family: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif' },
  { value: 'vazirmatn', labelEn: 'Vazirmatn', labelFa: 'وزیرمتن', family: "'Vazirmatn', 'Tahoma', sans-serif" },
  { value: 'nazanin', labelEn: 'Nazanin', labelFa: 'نازنین', family: "'B Nazanin', 'Nazanin', 'Vazirmatn', 'Tahoma', sans-serif" },
  { value: 'calibri', labelEn: 'Calibri', labelFa: 'کالیبری', family: "'Calibri', 'Carlito', 'Vazirmatn', sans-serif" },
];

export const getFontFamily = (font: AppFont): string => {
  return FONT_OPTIONS.find(f => f.value === font)?.family || FONT_OPTIONS[0].family;
};

export interface Translations {
  // Header
  appName: string;
  searchPlaceholder: string;
  settings: string;
  // Dashboard
  allNotes: string;
  pinnedNotes: string;
  recentNotes: string;
  newNote: string;
  noNotes: string;
  noNotesDesc: string;
  noSearchResults: string;
  // Tags
  tagWork: string;
  tagPersonal: string;
  tagStudy: string;
  tagDesign: string;
  tagHealth: string;
  // Editor
  untitled: string;
  lastEdited: string;
  placeholder: string;
  addChecklist: string;
  newItem: string;
  // Toolbar
  bold: string;
  italic: string;
  underline: string;
  strikethrough: string;
  highlight: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  // Voice
  recordVoice: string;
  stopRecording: string;
  recording: string;
  voiceMemo: string;
  // Image
  insertImage: string;
  // Drawing
  drawingCanvas: string;
  // Options
  pin: string;
  unpin: string;
  copy: string;
  delete: string;
  lock: string;
  unlock: string;
  addThumbnail: string;
  // Export
  export: string;
  exportImage: string;
  exportPDF: string;
  exportWord: string;
  exportPages: string;
  // Font
  font: string;
  // Direction
  rtl: string;
  ltr: string;
  // Language
  language: string;
  english: string;
  persian: string;
  // Misc
  confirmDelete: string;
  cancel: string;
  locked: string;
  enterPassword: string;
  wrongPassword: string;
  justNow: string;
  minutesAgo: string;
  hoursAgo: string;
  daysAgo: string;
  notes: string;
  search: string;
  // Tag Management
  manageTags: string;
  addTag: string;
  deleteTag: string;
  renameTag: string;
  newTagName: string;
  tagName: string;
  tagColor: string;
  confirmDeleteTag: string;
  save: string;
  edit: string;
  // Settings
  settingsTitle: string;
  fontSize: string;
  colorTheme: string;
  theme: string;
  light: string;
  dark: string;
  appearance: string;
}

export const translations: Record<AppLanguage, Translations> = {
  en: {
    appName: 'NoteFlow',
    searchPlaceholder: 'Search notes...',
    settings: 'Settings',
    allNotes: 'All Notes',
    pinnedNotes: 'Pinned Notes',
    recentNotes: 'Recent Notes',
    newNote: 'New Note',
    noNotes: 'No notes yet',
    noNotesDesc: 'Tap the + button to create your first note',
    noSearchResults: 'No notes found',
    tagWork: 'Work',
    tagPersonal: 'Personal',
    tagStudy: 'Study',
    tagDesign: 'Design',
    tagHealth: 'Health',
    untitled: 'Untitled Note',
    lastEdited: 'Last edited',
    placeholder: 'Start writing...',
    addChecklist: 'Checklist',
    newItem: 'New item',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strikethrough: 'Strikethrough',
    highlight: 'Highlight',
    alignLeft: 'Align Left',
    alignCenter: 'Align Center',
    alignRight: 'Align Right',
    recordVoice: 'Record Voice',
    stopRecording: 'Stop Recording',
    recording: 'Recording...',
    voiceMemo: 'Voice Memo',
    insertImage: 'Insert Image',
    drawingCanvas: 'Drawing Canvas',
    pin: 'Pin',
    unpin: 'Unpin',
    copy: 'Make a Copy',
    delete: 'Delete',
    lock: 'Lock Note',
    unlock: 'Unlock Note',
    addThumbnail: 'Add Thumbnail',
    export: 'Export',
    exportImage: 'Export as Image',
    exportPDF: 'Export as PDF',
    exportWord: 'Export as Word',
    exportPages: 'Export as Pages',
    font: 'Font',
    rtl: 'RTL',
    ltr: 'LTR',
    language: 'Language',
    english: 'English',
    persian: 'Persian',
    confirmDelete: 'Are you sure you want to delete this note?',
    cancel: 'Cancel',
    locked: 'This note is locked',
    enterPassword: 'Enter password',
    wrongPassword: 'Wrong password',
    justNow: 'Just now',
    minutesAgo: 'min ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago',
    notes: 'Notes',
    search: 'Search',
    manageTags: 'Manage Tags',
    addTag: 'Add Tag',
    deleteTag: 'Delete Tag',
    renameTag: 'Rename Tag',
    newTagName: 'New tag name',
    tagName: 'Tag name',
    tagColor: 'Tag color',
    confirmDeleteTag: 'Are you sure you want to delete this tag?',
    save: 'Save',
    edit: 'Edit',
    settingsTitle: 'Settings',
    fontSize: 'Font Size',
    colorTheme: 'Color Theme',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    appearance: 'Appearance',
  },
  fa: {
    appName: 'نوت‌فلو',
    searchPlaceholder: 'جستجوی یادداشت‌ها...',
    settings: 'تنظیمات',
    allNotes: 'همه یادداشت‌ها',
    pinnedNotes: 'یادداشت‌های سنجاق‌شده',
    recentNotes: 'یادداشت‌های اخیر',
    newNote: 'یادداشت جدید',
    noNotes: 'هنوز یادداشتی نیست',
    noNotesDesc: 'برای ساخت اولین یادداشت روی دکمه + کلیک کنید',
    noSearchResults: 'یادداشتی یافت نشد',
    tagWork: 'کاری',
    tagPersonal: 'شخصی',
    tagStudy: 'مطالعه',
    tagDesign: 'طراحی',
    tagHealth: 'سلامتی',
    untitled: 'یادداشت بدون عنوان',
    lastEdited: 'آخرین ویرایش',
    placeholder: 'شروع به نوشتن...',
    addChecklist: 'چک‌لیست',
    newItem: 'مورد جدید',
    bold: 'پررنگ',
    italic: 'کج',
    underline: 'زیرخط',
    strikethrough: 'خط‌خورده',
    highlight: 'برجسته',
    alignLeft: 'چپ‌چین',
    alignCenter: 'وسط‌چین',
    alignRight: 'راست‌چین',
    recordVoice: 'ضبط صدا',
    stopRecording: 'توقف ضبط',
    recording: 'در حال ضبط...',
    voiceMemo: 'پیام صوتی',
    insertImage: 'درج تصویر',
    drawingCanvas: 'بوم نقاشی',
    pin: 'سنجاق کردن',
    unpin: 'برداشتن سنجاق',
    copy: 'کپی کردن',
    delete: 'حذف',
    lock: 'قفل یادداشت',
    unlock: 'باز کردن قفل',
    addThumbnail: 'افزودن تصویر بندانگشتی',
    export: 'خروجی',
    exportImage: 'خروجی تصویر',
    exportPDF: 'خروجی PDF',
    exportWord: 'خروجی Word',
    exportPages: 'خروجی Pages',
    font: 'فونت',
    rtl: 'راست‌به‌چپ',
    ltr: 'چپ‌به‌راست',
    language: 'زبان',
    english: 'انگلیسی',
    persian: 'فارسی',
    confirmDelete: 'آیا از حذف این یادداشت مطمئن هستید؟',
    cancel: 'لغو',
    locked: 'این یادداشت قفل است',
    enterPassword: 'رمز عبور را وارد کنید',
    wrongPassword: 'رمز عبور اشتباه است',
    justNow: 'همین الان',
    minutesAgo: 'دقیقه پیش',
    hoursAgo: 'ساعت پیش',
    daysAgo: 'روز پیش',
    notes: 'یادداشت‌ها',
    search: 'جستجو',
    manageTags: 'مدیریت برچسب‌ها',
    addTag: 'افزودن برچسب',
    deleteTag: 'حذف برچسب',
    renameTag: 'تغییر نام برچسب',
    newTagName: 'نام برچسب جدید',
    tagName: 'نام برچسب',
    tagColor: 'رنگ برچسب',
    confirmDeleteTag: 'آیا از حذف این برچسب مطمئن هستید؟',
    save: 'ذخیره',
    edit: 'ویرایش',
    settingsTitle: 'تنظیمات',
    fontSize: 'اندازه فونت',
    colorTheme: 'رنگ تم',
    theme: 'تم',
    light: 'روشن',
    dark: 'تیره',
    appearance: 'ظاهر',
  },
};

export type FontFamily = 'vazirmatn' | 'nazanin' | 'calibri';
export type LanguageMode = 'fa' | 'en';

export interface ExportFormat {
  type: 'image' | 'pdf' | 'word' | 'pages';
  label: string;
  icon: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface AppContextType {
  notes: Note[];
  currentNote: Note | null;
  viewMode: ViewMode;
  searchQuery: string;
  selectedTag: string;
  appLanguage: AppLanguage;
  t: Translations;
  isRTL: boolean;
  tags: Tag[];
  setViewMode: (mode: ViewMode) => void;
  openNote: (note: Note) => void;
  closeNote: () => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  duplicateNote: (note: Note) => void;
  togglePin: (id: string) => void;
  toggleLock: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setActiveTag: (tag: string) => void;
  addNote: () => void;
  toggleRTL: () => void;
  setAppLanguage: (lang: AppLanguage) => void;
  addVoiceRecording: (recording: VoiceRecording) => void;
  addInlineImage: (image: InlineImage) => void;
  updateInlineImage: (id: string, updates: Partial<InlineImage>) => void;
  removeInlineImage: (id: string) => void;
  setFontFamily: (font: AppFont) => void;
  addTag: (name: string, color: string) => void;
  deleteTag: (id: string) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
}
