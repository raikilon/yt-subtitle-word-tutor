type Settings = {
  learningLang: string;
  nativeLang: string;
};

type VocabItem = {
  word: string;
  translation: string;
  sourceLang: string;
  targetLang: string;
  createdAt: number;
  lastSeen: number;
  count: number;
};

const STORAGE_KEYS = {
  settings: 'settings',
  vocab: 'vocab'
} as const;

const DEFAULT_SETTINGS: Settings = {
  learningLang: 'de',
  nativeLang: 'en'
};

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'German' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'it', label: 'Italian' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'nl', label: 'Dutch' },
  { code: 'pl', label: 'Polish' },
  { code: 'ru', label: 'Russian' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'zh', label: 'Chinese' },
  { code: 'tr', label: 'Turkish' }
];

class CsvExporter {
  constructor(private readonly filename: string) {}

  exportVocab(items: VocabItem[]): void {
    const rows = items.map((item) => [item.word, item.translation]);
    const csv = this.buildCsv(rows);
    this.download(csv);
  }

  private buildCsv(rows: string[][]): string {
    return rows
      .map((row) => row.map((value) => this.escape(value)).join(','))
      .join('\n');
  }

  private download(csv: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = this.filename;
    link.click();

    URL.revokeObjectURL(url);
  }

  private escape(value: string): string {
    if (/[",\n]/.test(value)) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  setupSettings();
  setupVocab();
});

function setupTabs(): void {
  const tabButtons =
    document.querySelectorAll<HTMLButtonElement>('.tab-button');
  const tabPanels = document.querySelectorAll<HTMLElement>('.tab-panel');

  const activate = (tabName: string) => {
    tabButtons.forEach((button) => {
      button.classList.toggle('active', button.dataset.tab === tabName);
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === tabName);
    });
  };

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.dataset.tab) {
        activate(button.dataset.tab);
      }
    });
  });

  const firstTab = tabButtons[0]?.dataset.tab ?? 'settings';
  activate(firstTab);
}

function setupSettings(): void {
  const learningSelect = document.getElementById(
    'learningLang'
  ) as HTMLSelectElement | null;
  const nativeSelect = document.getElementById(
    'nativeLang'
  ) as HTMLSelectElement | null;
  const saveButton = document.getElementById(
    'saveSettings'
  ) as HTMLButtonElement | null;
  const status = document.getElementById('saveStatus') as HTMLDivElement | null;

  if (!learningSelect || !nativeSelect || !saveButton || !status) {
    return;
  }

  populateLanguageSelect(learningSelect);
  populateLanguageSelect(nativeSelect);

  void loadSettings().then((settings) => {
    learningSelect.value = settings.learningLang;
    nativeSelect.value = settings.nativeLang;
  });

  saveButton.addEventListener('click', async () => {
    const settings: Settings = {
      learningLang: learningSelect.value,
      nativeLang: nativeSelect.value
    };

    await storageSet({ [STORAGE_KEYS.settings]: settings });
    status.textContent = 'Saved.';
    status.classList.add('visible');

    window.setTimeout(() => {
      status.classList.remove('visible');
    }, 1500);
  });
}

function setupVocab(): void {
  const list = document.getElementById('vocabList') as HTMLUListElement | null;
  const empty = document.getElementById('vocabEmpty') as HTMLDivElement | null;
  const exportButton = document.getElementById(
    'exportCsv'
  ) as HTMLButtonElement | null;
  const resetButton = document.getElementById(
    'resetVocab'
  ) as HTMLButtonElement | null;

  if (!list || !empty || !exportButton || !resetButton) {
    return;
  }

  const exporter = new CsvExporter('yt-vocabulary.csv');
  void loadVocab().then((items) => renderVocab(items, list, empty));

  chrome.storage.onChanged.addListener(
    (changes: Record<string, { newValue?: VocabItem[] }>, area: string) => {
      if (area !== 'local') {
        return;
      }

      if (changes[STORAGE_KEYS.vocab]?.newValue) {
        renderVocab(changes[STORAGE_KEYS.vocab].newValue ?? [], list, empty);
      }
    }
  );

  exportButton.addEventListener('click', async () => {
    const items = await loadVocab();
    if (items.length === 0) {
      return;
    }
    exporter.exportVocab(items);
  });

  resetButton.addEventListener('click', async () => {
    if (!window.confirm('Reset saved vocabulary?')) {
      return;
    }
    await storageSet({ [STORAGE_KEYS.vocab]: [] });
    renderVocab([], list, empty);
  });
}

function populateLanguageSelect(select: HTMLSelectElement): void {
  select.textContent = '';
  for (const option of LANGUAGE_OPTIONS) {
    const optionEl = document.createElement('option');
    optionEl.value = option.code;
    optionEl.textContent = option.label;
    select.appendChild(optionEl);
  }
}

async function loadSettings(): Promise<Settings> {
  const stored = await storageGet([STORAGE_KEYS.settings]);
  const settings = stored[STORAGE_KEYS.settings] as Settings | undefined;
  return { ...DEFAULT_SETTINGS, ...(settings ?? {}) };
}

async function loadVocab(): Promise<VocabItem[]> {
  const stored = await storageGet([STORAGE_KEYS.vocab]);
  const vocab = stored[STORAGE_KEYS.vocab];
  return Array.isArray(vocab) ? (vocab as VocabItem[]) : [];
}

function isSameVocabItem(a: VocabItem, b: VocabItem): boolean {
  return (
    a.word === b.word &&
    a.translation === b.translation &&
    a.sourceLang === b.sourceLang &&
    a.targetLang === b.targetLang
  );
}

function renderVocab(
  items: VocabItem[],
  list: HTMLUListElement,
  empty: HTMLDivElement
): void {
  list.textContent = '';

  if (items.length === 0) {
    empty.style.display = 'block';
    return;
  }

  empty.style.display = 'none';
  const sorted = [...items].sort(
    (a, b) => (b.lastSeen ?? b.createdAt) - (a.lastSeen ?? a.createdAt)
  );

  for (const item of sorted) {
    const li = document.createElement('li');
    li.className = 'vocab-item';

    const header = document.createElement('div');
    header.className = 'vocab-header';

    const word = document.createElement('div');
    word.className = 'vocab-word';
    word.textContent = item.word;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'vocab-remove';
    remove.textContent = 'Remove';
    remove.addEventListener('click', async () => {
      const latest = await loadVocab();
      const next = latest.filter(
        (existing) => !isSameVocabItem(existing, item)
      );
      await storageSet({ [STORAGE_KEYS.vocab]: next });
      renderVocab(next, list, empty);
    });

    const translation = document.createElement('div');
    translation.className = 'vocab-translation';
    translation.textContent = item.translation;

    const meta = document.createElement('div');
    meta.className = 'vocab-meta';
    const countText = item.count > 1 ? ` · x${item.count}` : '';
    meta.textContent = `${item.sourceLang} -> ${item.targetLang}${countText}`;

    header.appendChild(word);
    header.appendChild(remove);

    li.appendChild(header);
    li.appendChild(translation);
    li.appendChild(meta);
    list.appendChild(li);
  }
}

function storageGet(keys: string[]): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result: Record<string, unknown>) =>
      resolve(result)
    );
  });
}

function storageSet(items: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set(items, () => resolve());
  });
}

export {};
