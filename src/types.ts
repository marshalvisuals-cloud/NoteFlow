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

export type FontFamily = 'vazirmatn' | 'nazanin' | 'calibri';
export type LanguageMode = 'fa' | 'en';

export interface ExportFormat {
  type: 'image' | 'pdf' | 'word' | 'pages';
  label: string;
  icon: string;
}
