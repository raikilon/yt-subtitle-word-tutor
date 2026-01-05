import { STORAGE_KEYS } from './constants.js';
import type { VocabItem } from './constants.js';
import { StorageClient } from './storage.js';

export type VocabEntry = {
  word: string;
  translation: string;
  sourceLang: string;
  targetLang: string;
};

export class VocabStore {
  constructor(private readonly storage: StorageClient) {}

  async saveEntry(entry: VocabEntry): Promise<void> {
    const stored = await this.storage.get([STORAGE_KEYS.vocab]);
    const vocab = Array.isArray(stored[STORAGE_KEYS.vocab])
      ? (stored[STORAGE_KEYS.vocab] as VocabItem[])
      : [];

    const now = Date.now();
    const index = vocab.findIndex(
      (item) =>
        item.word === entry.word &&
        item.translation === entry.translation &&
        item.sourceLang === entry.sourceLang &&
        item.targetLang === entry.targetLang
    );

    if (index >= 0) {
      const existing = vocab[index];
      vocab[index] = {
        ...existing,
        lastSeen: now,
        count: (existing.count ?? 1) + 1
      };
    } else {
      vocab.push({
        ...entry,
        createdAt: now,
        lastSeen: now,
        count: 1
      });
    }

    await this.storage.set({ [STORAGE_KEYS.vocab]: vocab });
  }
}
