export type Settings = {
  learningLang: string;
  nativeLang: string;
};

export type VocabItem = {
  word: string;
  translation: string;
  sourceLang: string;
  targetLang: string;
  createdAt: number;
  lastSeen: number;
  count: number;
};

export type TranslateMessage = {
  type: 'translateAndSave';
  word: string;
  from: string;
  to: string;
};

export type TranslateResponse =
  | { ok: true; translation: string }
  | { ok: false; error: string };

export const STORAGE_KEYS = {
  settings: 'settings',
  vocab: 'vocab'
} as const;

export const DEFAULT_SETTINGS: Settings = {
  learningLang: 'de',
  nativeLang: 'en'
};
