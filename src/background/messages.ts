import type { TranslateMessage, TranslateResponse } from './constants.js';
import { TranslationService } from './translation.js';
import { VocabStore } from './vocab.js';

export class TranslateMessageHandler {
  constructor(
    private readonly translationService: TranslationService,
    private readonly vocab: VocabStore
  ) {}

  handle(message: TranslateMessage, sendResponse: (response: TranslateResponse) => void): void {
    (async () => {
      try {
        const translation = await this.translationService.translate(
          message.word,
          message.from,
          message.to
        );

        await this.vocab.saveEntry({
          word: message.word,
          translation,
          sourceLang: message.from,
          targetLang: message.to
        });

        sendResponse({ ok: true, translation });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error.';
        sendResponse({ ok: false, error: errorMessage });
      }
    })();
  }
}
