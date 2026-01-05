export type Settings = {
  learningLang: string;
  nativeLang: string;
};

export type TranslateResponse =
  | { ok: true; translation: string }
  | { ok: false; error: string };
