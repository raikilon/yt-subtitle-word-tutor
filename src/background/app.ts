import type { TranslateMessage, TranslateResponse } from './constants.js';
import { ContextMenuTranslator } from './context-menu.js';
import { DefaultsInitializer } from './defaults.js';
import { TranslateMessageHandler } from './messages.js';
import { StorageClient } from './storage.js';
import { MyMemoryTranslationProvider, TranslationService } from './translation.js';
import { VocabStore } from './vocab.js';

export class BackgroundApp {
  private readonly storage = new StorageClient();
  private readonly defaults = new DefaultsInitializer(this.storage);
  private readonly vocab = new VocabStore(this.storage);
  private readonly translationService = new TranslationService(new MyMemoryTranslationProvider());
  private readonly translator = new TranslateMessageHandler(this.translationService, this.vocab);
  private readonly contextMenu = new ContextMenuTranslator(
    this.storage,
    this.translationService,
    this.vocab
  );

  init(): void {
    this.contextMenu.init();

    chrome.runtime.onInstalled.addListener(() => {
      void this.defaults.ensureDefaults();
      this.contextMenu.ensureContextMenu();
    });

    chrome.runtime.onMessage.addListener(
      (message: TranslateMessage, _sender: unknown, sendResponse: (response: TranslateResponse) => void) => {
        if (message?.type !== 'translateAndSave') {
          return;
        }

        this.translator.handle(message, sendResponse);
        return true;
      }
    );
  }
}
