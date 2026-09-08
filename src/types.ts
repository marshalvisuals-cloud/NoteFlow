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
