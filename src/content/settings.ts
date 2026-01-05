import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants.js';
import { StorageClient } from './storage.js';
import type { Settings } from './types.js';

export class SettingsStore {
  private current: Settings = { ...DEFAULT_SETTINGS };

  constructor(private readonly storage: StorageClient) {}

  async init(): Promise<void> {
    const stored = await this.storage.get([STORAGE_KEYS.settings]);
    const saved = stored[STORAGE_KEYS.settings] as Settings | undefined;
    this.current = { ...DEFAULT_SETTINGS, ...(saved ?? {}) };
  }

  listenForChanges(): void {
    chrome.storage.onChanged.addListener(
      (changes: Record<string, { newValue?: Settings }>, area: string) => {
        if (area !== 'local') {
          return;
        }

        const next = changes[STORAGE_KEYS.settings]?.newValue;
        if (next) {
          this.current = { ...DEFAULT_SETTINGS, ...next };
        }
      }
    );
  }

  get value(): Settings {
    return this.current;
  }
}
