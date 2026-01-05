import { getBubbleStyleText } from '../shared/bubble-style.js';
import { BUBBLE_ID, STYLE_ID } from '../shared/ui-constants.js';
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
export { BUBBLE_ID, STYLE_ID };

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
  ${getBubbleStyleText(BUBBLE_ID)}
`;
