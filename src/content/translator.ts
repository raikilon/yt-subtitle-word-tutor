import { MessageClient } from './messaging.js';
import { SettingsStore } from './settings.js';
import { TranslationBubble } from './bubble.js';

export class WordClickTranslator {
  constructor(
    private readonly settingsStore: SettingsStore,
    private readonly bubble: TranslationBubble,
    private readonly messenger: MessageClient,
    private readonly wordClass: string
  ) {}

  init(): void {
    document.addEventListener('click', this.handleClick);
  }

  private handleClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement | null;
    if (!target || !target.classList.contains(this.wordClass)) {
      return;
    }

    const cleanedWord = this.normalizeWord(target.textContent ?? '');
    if (!cleanedWord) {
      return;
    }

    void this.translate(cleanedWord, target.getBoundingClientRect());
  };

  private async translate(word: string, rect: DOMRect): Promise<void> {
    this.bubble.show(rect, 'Translating...');
    const settings = this.settingsStore.value;

    try {
      const response = await this.messenger.translateAndSave(
        word,
        settings.learningLang,
        settings.nativeLang
      );

      if (response.ok) {
        this.bubble.show(rect, response.translation);
      } else {
        this.bubble.show(rect, response.error || 'Translation failed.');
      }
    } catch {
      this.bubble.show(rect, 'Translation failed.');
    }
  }

  private normalizeWord(input: string): string {
    return input.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').trim();
  }
}
