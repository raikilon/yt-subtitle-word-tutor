export interface TranslationProvider {
  translate(word: string, from: string, to: string): Promise<string>;
}

export class MyMemoryTranslationProvider implements TranslationProvider {
  async translate(word: string, from: string, to: string): Promise<string> {
    const url = new URL('https://api.mymemory.translated.net/get');
    url.searchParams.set('q', word);
    url.searchParams.set('langpair', `${from}|${to}`);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Translation request failed.');
    }

    const data = await response.json();
    const translatedText = data?.responseData?.translatedText;

    if (!translatedText || typeof translatedText !== 'string') {
      throw new Error('No translation returned.');
    }

    return translatedText;
  }
}

export class TranslationService {
  constructor(private readonly provider: TranslationProvider) {}

  translate(word: string, from: string, to: string): Promise<string> {
    return this.provider.translate(word, from, to);
  }
}
