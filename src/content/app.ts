import { CaptionWordWrapper } from './captions.js';
import { MessageClient } from './messaging.js';
import { SettingsStore } from './settings.js';
import { StorageClient } from './storage.js';
import { StyleInjector } from './style.js';
import { TranslationBubble } from './bubble.js';
import { WordClickTranslator } from './translator.js';
import { BUBBLE_ID, CAPTION_SELECTOR, STYLE_ID, STYLE_TEXT, WORD_CLASS } from './constants.js';

export class SubtitleTranslateApp {
  private readonly storage = new StorageClient();
  private readonly settings = new SettingsStore(this.storage);
  private readonly bubble = new TranslationBubble(BUBBLE_ID);
  private readonly captionWrapper = new CaptionWordWrapper(CAPTION_SELECTOR, WORD_CLASS);
  private readonly messenger = new MessageClient();
  private readonly translator = new WordClickTranslator(
    this.settings,
    this.bubble,
    this.messenger,
    WORD_CLASS
  );
  private readonly style = new StyleInjector(STYLE_TEXT, STYLE_ID);

  async init(): Promise<void> {
    this.style.ensureInjected();
    this.settings.listenForChanges();
    this.captionWrapper.init();
    this.translator.init();
    await this.settings.init();
  }
}
