export class StorageClient {
  get(keys: string[]): Promise<Record<string, unknown>> {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (result: Record<string, unknown>) => resolve(result));
    });
  }

  set(items: Record<string, unknown>): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(items, () => resolve());
    });
  }
}
