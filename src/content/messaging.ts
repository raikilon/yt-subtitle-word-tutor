import type { TranslateResponse } from './types.js';

export class MessageClient {
  translateAndSave(word: string, from: string, to: string): Promise<TranslateResponse> {
    return this.sendMessage<TranslateResponse>({
      type: 'translateAndSave',
      word,
      from,
      to
    });
  }

  private sendMessage<T>(message: unknown): Promise<T> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response: T) => {
        const error = chrome.runtime.lastError;
        if (error) {
          reject(error);
          return;
        }
        resolve(response);
      });
    });
  }
}
