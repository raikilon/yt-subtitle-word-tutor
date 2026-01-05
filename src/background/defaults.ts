import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants.js';
import { StorageClient } from './storage.js';

export class DefaultsInitializer {
  constructor(private readonly storage: StorageClient) {}

  async ensureDefaults(): Promise<void> {
    const stored = await this.storage.get([STORAGE_KEYS.settings, STORAGE_KEYS.vocab]);
    const next: Record<string, unknown> = {};

    if (!stored[STORAGE_KEYS.settings]) {
      next[STORAGE_KEYS.settings] = DEFAULT_SETTINGS;
    }

    if (!Array.isArray(stored[STORAGE_KEYS.vocab])) {
      next[STORAGE_KEYS.vocab] = [];
    }

    if (Object.keys(next).length > 0) {
      await this.storage.set(next);
    }
  }
}
