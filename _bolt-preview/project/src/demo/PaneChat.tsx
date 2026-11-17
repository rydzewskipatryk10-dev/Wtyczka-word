import { ArrowUp } from 'lucide-react';
import { useState, type FormEvent, type KeyboardEvent } from 'react';
import type { CaseFile, TourTab } from './case';

type PaneChatProps = {
  files: CaseFile[];
  onScan: () => void;
  onOpenFile: (fileId: string) => void;
  onTab: (tab: TourTab) => void;
  onDownload: () => void;
  onMarkAmounts: () => void;
};

const FILE_HINTS: { id: string; pattern: RegExp }[] = [
  { id: 'faktura', pattern: /faktur|\bfv\b/ },
  { id: 'umowa', pattern: /umow/ },
  { id: 'wezwanie', pattern: /wezwan/ },
  { id: 'pismo', pattern: /\bpism|\bodpowiedz klienta\b/ },
  { id: 'przelew', pattern: /przelew|wplat/ },
  { id: 'wzor', pattern: /wzor|szablon/ },
];

function fold(value: string): string {
  return value.toLocaleLowerCase('pl-PL').normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function interpret(
  raw: string,
  files: CaseFile[],
  actions: Pick<PaneChatProps, 'onScan' | 'onOpenFile' | 'onTab' | 'onDownload' | 'onMarkAmounts'>,
): { run?: () => void } {
  const query = fold(raw);

  if (/\b(skanuj|skanowanie|przeskanuj|zeskanuj)\b/.test(query)) {
    return { run: actions.onScan };
  }

  if (/\bbraki?\b/.test(query)) {
    return { run: () => actions.onTab('obraz') };
  }

  if (/\bkwot/.test(query)) {
    return {
      run: () => {
        actions.onMarkAmounts();
        actions.onTab('obraz');
        window.requestAnimationFrame(() => {
          document.querySelector('[data-tour="amounts"]')?.scrollIntoView({ block: 'nearest' });
        });
      },
    };
  }

  if (/\bobraz\b/.test(query)) {
    return { run: () => actions.onTab('obraz') };
  }
  if (/\bszkic\b/.test(query)) {
    return { run: () => actions.onTab('szkic') };
  }
  if (/\bkontrol/.test(query)) {
    return { run: () => actions.onTab('kontrola') };
  }
  if (/\b(pobierz|docx)\b/.test(query)) {
    return { run: () => { void actions.onDownload(); } };
  }

  const wantsFile = /\b(otworz|pokaz|podglad)\b/.test(query);
  if (wantsFile) {
    const hint = FILE_HINTS.find((item) => item.pattern.test(query));
    const file = hint ? files.find((item) => item.id === hint.id) : undefined;
    if (file) {
      return { run: () => actions.onOpenFile(file.id) };
    }
  }

  return {};
}

export function PaneChat({
  files,
  onScan,
  onOpenFile,
  onTab,
  onDownload,
  onMarkAmounts,
}: PaneChatProps) {
  const [draft, setDraft] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const result = interpret(text, files, { onScan, onOpenFile, onTab, onDownload, onMarkAmounts });
    if (!result.run) return;
    setDraft('');
    result.run();
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <section className="pane-chat" aria-label="Polecenia">
      <form className="pane-chat-form" onSubmit={submit}>
        <textarea
          className="pane-chat-input"
          aria-label="Polecenie"
          placeholder="Napisz polecenie…"
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          type="submit"
          className="pane-chat-send"
          aria-label="Wyślij"
          disabled={!draft.trim()}
        >
          <ArrowUp size={16} strokeWidth={2.5} />
        </button>
      </form>
    </section>
  );
}
