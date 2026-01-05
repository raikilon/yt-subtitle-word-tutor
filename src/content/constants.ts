import type { Settings } from './types.js';

export const STORAGE_KEYS = {
  settings: 'settings'
} as const;

export const DEFAULT_SETTINGS: Settings = {
  learningLang: 'de',
  nativeLang: 'en'
};

export const CAPTION_SELECTOR = '.ytp-caption-segment';
export const WORD_CLASS = 'ytst-word';
export const BUBBLE_ID = 'ytst-bubble';
export const STYLE_ID = 'ytst-style';

export const STYLE_TEXT = `
  .${WORD_CLASS} {
    cursor: pointer;
    padding: 0 2px;
    border-radius: 3px;
    transition: background-color 0.12s ease;
  }
  .${WORD_CLASS}:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  .ytp-caption-window,
  .ytp-caption-segment {
    pointer-events: auto !important;
  }
  #${BUBBLE_ID} {
    position: fixed;
    z-index: 999999;
    max-width: 280px;
    padding: 6px 10px;
    border-radius: 8px;
    background: #111827;
    color: #f9fafb;
    font-size: 13px;
    font-family: "Rubik", "Trebuchet MS", sans-serif;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transform: translate(-50%, -100%);
    pointer-events: none;
    transition: opacity 0.12s ease;
  }
  #${BUBBLE_ID}.show {
    opacity: 1;
  }
`;
