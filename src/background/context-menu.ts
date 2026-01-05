import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants.js';
import type { Settings } from './constants.js';
import { StorageClient } from './storage.js';
import { TranslationService } from './translation.js';
import { VocabStore } from './vocab.js';

const CONTEXT_MENU_ID = 'ytst-translate-selection';
const CONTEXT_BUBBLE_SCRIPT = 'context-bubble.js';

export class ContextMenuTranslator {
  constructor(
    private readonly storage: StorageClient,
    private readonly translationService: TranslationService,
    private readonly vocab: VocabStore
  ) {}

  init(): void {
    this.ensureContextMenu();

    chrome.contextMenus.onClicked.addListener(
      (info: { menuItemId?: string | number; selectionText?: string }, tab: { id?: number } | undefined) => {
        if (info.menuItemId !== CONTEXT_MENU_ID) {
          return;
        }

        const selection = (info.selectionText ?? '').trim().replace(/\s+/g, ' ');
        if (!selection) {
          return;
        }

        void this.handleContextTranslation(selection, tab?.id);
      }
    );
  }

  ensureContextMenu(): void {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: CONTEXT_MENU_ID,
        title: 'Translate "%s"',
        contexts: ['selection']
      });
    });
  }

  private async handleContextTranslation(selection: string, tabId: number | undefined): Promise<void> {
    if (!tabId) {
      return;
    }

    await this.ensureBubbleInjected(tabId);
    await this.showBubble(tabId, 'Translating...');

    try {
      const settings = await this.loadSettings();
      const translation = await this.translationService.translate(
        selection,
        settings.learningLang,
        settings.nativeLang
      );

      await this.vocab.saveEntry({
        word: selection,
        translation,
        sourceLang: settings.learningLang,
        targetLang: settings.nativeLang
      });

      await this.showBubble(tabId, translation);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Translation failed.';
      await this.showBubble(tabId, message);
    }
  }

  private async loadSettings(): Promise<Settings> {
    const stored = await this.storage.get([STORAGE_KEYS.settings]);
    const saved = stored[STORAGE_KEYS.settings] as Settings | undefined;
    return { ...DEFAULT_SETTINGS, ...(saved ?? {}) };
  }

  private async ensureBubbleInjected(tabId: number): Promise<void> {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [CONTEXT_BUBBLE_SCRIPT]
    });
  }

  private async showBubble(tabId: number, message: string): Promise<void> {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (text: string) => {
        const root = window as Window & {
          YTSTBubble?: {
            showForSelection: (value: string) => void;
          };
        };

        root.YTSTBubble?.showForSelection(text);
      },
      args: [message]
    });
  }
}
