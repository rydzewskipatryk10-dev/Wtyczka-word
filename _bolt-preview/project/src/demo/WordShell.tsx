import { useState, type ReactNode } from 'react';
import {
  BookOpen,
  ChevronDown,
  CircleHelp,
  FileText,
  Grid3X3,
  Redo2,
  Save,
  Search,
  Undo2,
  UserRound,
} from 'lucide-react';

type WordShellProps = {
  documentName: string;
  wordCount: number;
  dimmed?: boolean;
  children: ReactNode;
};

export function WordShell({ documentName, wordCount, dimmed = false, children }: WordShellProps) {
  const [autoSave, setAutoSave] = useState(true);

  return (
    <main className="word-app">
      <header className="topbar">
        <div className="topbar-left">
          <div className="word-mark">W</div>
          <div className="autosave-control">
            <span>Autozapis</span>
            <button
              className={`toggle ${autoSave ? 'is-on' : ''}`}
              aria-label="Przełącz autozapis"
              onClick={() => setAutoSave((value) => !value)}
            >
              <span />
            </button>
          </div>
          <button className="icon-button purple" aria-label="Zapisz" type="button"><Save size={17} /></button>
          <button className="icon-button muted" aria-label="Cofnij" type="button"><Undo2 size={18} /></button>
          <button className="icon-button muted" aria-label="Ponów" type="button"><Redo2 size={18} /></button>
          <button className="icon-button muted small-chevron" aria-label="Więcej opcji" type="button"><ChevronDown size={13} /></button>
        </div>

        <div className="document-name">{documentName}</div>

        <div className="topbar-search">
          <Search size={17} />
          <span>Wyszukaj</span>
        </div>

        <div className="window-controls">
          <div className="profile">PR</div>
          <button className="window-button" aria-label="Minimalizuj" type="button">−</button>
          <button className="window-button" aria-label="Maksymalizuj" type="button">□</button>
          <button className="window-button close" aria-label="Zamknij" type="button">×</button>
        </div>
      </header>

      <nav className="ribbon-nav" aria-label="Wstążka">
        <span className="nav-item">Plik</span>
        <span className="nav-item active">Narzędzia główne</span>
        <span className="nav-item">Wstawianie</span>
        <span className="nav-item">Projektowanie</span>
        <span className="nav-item">Układ</span>
        <span className="nav-item">Odwołania</span>
        <span className="nav-item">Korespondencja</span>
        <span className="nav-item">Recenzja</span>
        <span className="nav-item">Widok</span>
        <span className="nav-item">Pomoc</span>
      </nav>

      <section className="workspace">{children}</section>

      {dimmed ? <div className="tour-shade" aria-hidden="true" /> : null}

      <footer className="statusbar">
        <span>Strona 1 z 1</span>
        <span>Wyrazy: {wordCount}</span>
        <span className="status-with-icon"><UserRound size={15} /> Podpowiedzi tekstu: wyłączone</span>
        <span className="status-with-icon"><CircleHelp size={15} /> Ułatwienia dostępu: dobrze przygotowane</span>
        <div className="status-right">
          <button aria-label="Koncentracja uwagi" type="button"><FocusIcon /></button>
          <button aria-label="Widok odczytu" type="button"><BookOpen size={17} /></button>
          <button aria-label="Układ wydruku" type="button"><FileText size={17} /></button>
          <button aria-label="Układ sieci Web" type="button"><Grid3X3 size={16} /></button>
          <span className="zoom-minus">−</span>
          <div className="zoom-track"><span /></div>
          <span className="zoom-plus">＋</span>
          <span className="zoom-value">100%</span>
        </div>
      </footer>
    </main>
  );
}

function FocusIcon() {
  return <span className="focus-icon"><span /></span>;
}
