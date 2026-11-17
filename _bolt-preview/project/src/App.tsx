import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CircleHelp,
  FileText,
  Grid3X3,
  Menu,
  MoreHorizontal,
  Search,
  Sparkles,
  Undo2,
  Redo2,
  X,
  BookOpen,
  Save,
  UserRound,
} from 'lucide-react';

function App() {
  const [autoSave, setAutoSave] = useState(true);
  const [copilotOpen, setCopilotOpen] = useState(true);
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');

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
          <button className="icon-button purple" aria-label="Zapisz"><Save size={17} /></button>
          <button className="icon-button muted" aria-label="Cofnij"><Undo2 size={18} /></button>
          <button className="icon-button muted" aria-label="Ponów"><Redo2 size={18} /></button>
          <button className="icon-button muted small-chevron" aria-label="Więcej opcji"><ChevronDown size={13} /></button>
        </div>

        <div className="document-name">Dokument1 - Word</div>

        <div className="topbar-search">
          <Search size={17} />
          <span>Wyszukaj</span>
        </div>

        <div className="window-controls">
          <button className="plan-button"><Sparkles size={15} /> Uaktualnij plan</button>
          <div className="profile">PR</div>
          <button className="window-button" aria-label="Minimalizuj">−</button>
          <button className="window-button" aria-label="Maksymalizuj">□</button>
          <button className="window-button close" aria-label="Zamknij">×</button>
        </div>
      </header>

      <nav className="ribbon-nav">
        <button className="nav-item">Plik</button>
        <button className="nav-item active">Narzędzia główne</button>
        <button className="nav-item">Wstawianie</button>
        <button className="nav-item">Projektowanie</button>
        <button className="nav-item">Układ</button>
        <button className="nav-item">Odwołania</button>
        <button className="nav-item">Korespondencja</button>
        <button className="nav-item">Recenzja</button>
        <button className="nav-item">Widok</button>
        <button className="nav-item">Pomoc</button>
      </nav>

      <section className="workspace">
        <div className="editor-area">
          <div className="page-wrap">
            <article className="document-page" aria-label="Dokument z załącznikiem">
              <div className="document-canvas">
                <div
                  className="document-attachment editable-document"
                  contentEditable
                  suppressContentEditableWarning
                  spellCheck={false}
                  role="textbox"
                  aria-label="Edytowalny dokument pisma procesowego"
                >{`[LOGO KANCELARII]\nKancelaria Prawna [NAZWA KANCELARII]\nul. [ADRES KANCELARII]\n[NIP KANCELARII]\n\n[MIASTO], dnia [DATA]\n\nZnak sprawy: [NR SPRAWY]\n\n                                      Firma X sp. z o.o.\n                                      ul. [ADRES FIRMY X]\n                                      [KOD POCZTOWY] [MIASTO]\n\nDOTYCZY: wezwania do zapłaty z dnia 12.11.2026\n          kwota: 12 000 zł\n\nSTANOWISKO\n\nABC sp. z o.o. kwestionuje zasadność żądania zapłaty w zakresie kwoty 2 000 zł.\n\nUZASADNIENIE\n\nZgodnie z umową z dnia 01.03.2026 wynagrodzenie za wykonane usługi wynosiło 10 000 zł.\n\nFaktura nr 12/2026 z dnia 01.10.2026 wskazuje kwotę 12 000 zł.\n\nRóżnica w wysokości 2 000 zł wymaga wyjaśnienia. ABC sp. z o.o. nie otrzymało dokumentów potwierdzających podstawę tej różnicy.\n\nJednocześnie ABC sp. z o.o. dokonało częściowej zapłaty w dniu 05.11.2026, o czym informuje w załączonym potwierdzeniu.\n\nŻĄDANIE\n\nABC sp. z o.o. wzywa Firmę X sp. z o.o. do:\n\n1. wyjaśnienia podstawy naliczenia różnicy 2 000 zł;\n2. przedstawienia dokumentów potwierdzających zasadność roszczenia;\n3. potwierdzenia wpływu częściowej zapłaty z dnia 05.11.2026.\n\nZAŁĄCZNIKI\n\n1. Umowa z dnia 01.03.2026\n2. Faktura nr 12/2026\n3. Korespondencja z dnia 05.11.2026\n\n                                      ............................\n                                      [PODPIS]\n                                      ABC sp. z o.o.`}</div>
                <div className="document-note-area">
                  <div className="document-note-heading">Notatka do dokumentu</div>
                  {noteOpen ? (
                    <textarea
                      className="document-note-input"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Wpisz notatkę lub dalszą treść dokumentu..."
                      autoFocus
                    />
                  ) : (
                    <button className="document-add-note" onClick={() => setNoteOpen(true)}>+ Dodaj tekst pod załącznikiem</button>
                  )}
                </div>
              </div>
              <div className="document-actions">
                <button onClick={() => setNoteOpen(true)}>{noteOpen ? 'Edytuj' : 'Dodaj tekst'}</button>
                <button onClick={() => setNote('')}>Wyczyść notatkę</button>
              </div>
            </article>
          </div>
          <div className="editor-scrollbar">
            <button aria-label="Przewiń do góry"><ChevronUp size={18} /></button>
            <div className="scroll-track"><div className="scroll-thumb" /></div>
            <button aria-label="Przewiń w dół"><ChevronDown size={18} /></button>
          </div>
        </div>

        {copilotOpen && (
          <aside className="copilot-panel">
            <div className="copilot-toolbar">
              <button className="plain-button" aria-label="Menu"><Menu size={20} /></button>
              <div className="copilot-toolbar-actions">
                <button className="plain-button" aria-label="Więcej"><MoreHorizontal size={19} /></button>
                <button className="plain-button" aria-label="Zamknij panel" onClick={() => setCopilotOpen(false)}><X size={19} /></button>
              </div>
            </div>
            <div className="case-workspace">
              <section className="case-card case-header-card">
                <div className="case-heading">SPRAWA: ABC sp. z o.o. — należność 12 000 zł <span>↗⌁⌘</span></div>
                <div>Zadanie: Odpowiedź na wezwanie do zapłaty</div>
                <div>Status: <strong>3 blokery · 5 ostrzeżeń · projekt roboczy gotowy</strong></div>
              </section>

              <div className="case-tabs" role="tablist" aria-label="Sekcje sprawy">
                <button className="case-tab active" role="tab">Obraz sprawy</button>
                <button className="case-tab" role="tab">Dokumenty</button>
                <button className="case-tab" role="tab">Szkic</button>
                <button className="case-tab" role="tab">Kontrola</button>
              </div>

              <section className="case-card case-summary">
                <div className="case-section-title">OBRAZ SPRAWY</div>
                <div className="case-rule" />
                <div className="case-label">Strony</div>
                <div>• Powód / wierzyciel: Firma X sp. z o.o.</div>
                <div>• Pozwany / dłużnik: ABC sp. z o.o.</div>
                <div className="case-spacer" />
                <div className="case-label">Przedmiot</div>
                <div>• Należność z faktury nr 12/2026</div>
                <div>• Kwota według faktury: 12 000 zł</div>
                <div>• Kwota według umowy: 10 000 zł</div>
                <div className="case-spacer" />
                <div className="case-label">Kluczowe daty i terminy</div>
                <div>• 05.11.2026 — rzekoma zapłata</div>
                <div>• 12.11.2026 — wezwanie do zapłaty</div>
                <div>• 30.11.2026 — termin odpowiedzi</div>
                <div className="case-spacer" />
                <div className="case-label">Co wymaga decyzji</div>
                <div>• Czy różnica 2 000 zł dotyczy tej samej należności?</div>
                <div>• Czy zapłata 05.11 dotyczy faktury nr 12/2026?</div>
                <div>• Czy zachowano termin odpowiedzi?</div>
                <div className="case-spacer" />
                <div className="case-label">Braki</div>
                <div>• Brak potwierdzenia doręczenia wezwania</div>
                <div>• Brak dokumentu potwierdzającego zapłatę</div>
                <div className="case-actions">
                  <button>[Pokaż źródła]</button>
                  <button>[Przygotuj szkic]</button>
                  <button>[Zadaj pytanie]</button>
                </div>
              </section>

              <section className="case-card context-card">
                <div className="case-label">[Dodaj kontekst do zadania]</div>
                <div className="context-input">
                  <span>Np. „Przygotuj odpowiedź, kwestionując różnicę kwot...”</span>
                  <button aria-label="Wyślij kontekst">▶</button>
                </div>
                <div className="encryption-note">▣ Dane przetwarzane w UE · szyfrowanie</div>
              </section>
            </div>
          </aside>
        )}
      </section>

      <footer className="statusbar">
        <span>Strona 1 z 1</span>
        <span>Wyrazy: 0</span>
        <span className="status-with-icon"><UserRound size={15} /> Podpowiedzi tekstu: wyłączone</span>
        <span className="status-with-icon"><CircleHelp size={15} /> Ułatwienia dostępu: dobrze przygotowane</span>
        <div className="status-right">
          <button aria-label="Koncentracja uwagi"><FocusIcon /></button>
          <button aria-label="Widok odczytu"><BookOpen size={17} /></button>
          <button aria-label="Układ wydruku"><FileText size={17} /></button>
          <button aria-label="Układ sieci Web"><Grid3X3 size={16} /></button>
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

export default App;
