import { Redo2, Settings, Undo2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { CaseFile, DemoCase, TourStep, TourTab } from './case';
import { EndScreen } from './EndScreen';
import { MoneyText, useAmountMarks } from './markMoney';
import { FileStrip } from './FileStrip';
import { PaneChat } from './PaneChat';
import { Tour } from './Tour';

export type DemoPhase = 'tour' | 'end' | 'free';

type TaskPaneProps = {
  matter: DemoCase;
  files: CaseFile[];
  phase: DemoPhase;
  tab: TourTab;
  step: TourStep | null;
  lit: string[];
  openFile: string | null;
  ocrBusy: boolean;
  ocrStatus: string | null;
  ocrError: string | null;
  onNext: () => void;
  onCloseEnd: () => void;
  onTab: (tab: TourTab) => void;
  onOpenFile: (fileId: string) => void;
  onAddFile: (file: File) => void;
  onScan: () => void;
  onDownload: () => void;
  onMarkAmounts: () => void;
};

const tabs: { id: TourTab; label: string }[] = [
  { id: 'obraz', label: 'Obraz sprawy' },
  { id: 'szkic', label: 'Szkic' },
  { id: 'kontrola', label: 'Kontrola' },
];

function litClass(lit: string[], id: string, base: string): string {
  return lit.includes(id) ? `${base} is-lit` : base;
}

export function TaskPane({
  matter,
  files,
  phase,
  tab,
  step,
  lit,
  openFile,
  ocrBusy,
  ocrStatus,
  ocrError,
  onNext,
  onCloseEnd,
  onTab,
  onOpenFile,
  onAddFile,
  onScan,
  onDownload,
  onMarkAmounts,
}: TaskPaneProps) {
  const waiting = Boolean(step?.waitForFileId && openFile !== step.waitForFileId);

  useEffect(() => {
    if (!step) return;
    const target = document.querySelector(`[data-tour="${step.highlight}"]`);
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ block: 'nearest' });
    }
  }, [step]);

  return (
    <aside className="task-pane" aria-label="Odpowiedź na wezwanie">
      <header className={litClass(lit, 'case-header', 'pane-header')} data-tour="case-header">
        <div className="pane-header-row">
          <div className="pane-header-main">
            <p className="pane-title">Odpowiedź na wezwanie</p>
            <p className="pane-deadline">
              Klient: {matter.client.name.replace(/^Firma\s+/i, '')}
            </p>
          </div>
          <div className="pane-header-actions">
            <button className="icon-button pane-header-icon" aria-label="Cofnij" type="button">
              <Undo2 size={18} strokeWidth={2.25} />
            </button>
            <button className="icon-button pane-header-icon" aria-label="Ponów" type="button">
              <Redo2 size={18} strokeWidth={2.25} />
            </button>
            <button
              className="icon-button pane-header-icon pane-header-icon-settings"
              aria-label="Ustawienia"
              type="button"
            >
              <Settings size={18} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </header>

      <FileStrip
        files={files}
        openFile={openFile}
        lit={lit}
        ocrBusy={ocrBusy}
        ocrStatus={ocrStatus}
        ocrError={ocrError}
        onOpenFile={onOpenFile}
        onAddFile={onAddFile}
        onScan={onScan}
      />

      <div className="pane-middle">
        {phase === 'end' ? <EndScreen onClose={onCloseEnd} /> : null}
        {phase === 'tour' || phase === 'free' ? (
          <PaneTabs matter={matter} files={files} tab={tab} lit={lit} onTab={onTab} onOpenFile={onOpenFile} onDownload={onDownload} />
        ) : null}
      </div>

      {step ? <Tour step={step} total={matter.steps.length} waiting={waiting} onNext={onNext} /> : null}
      <PaneChat
        files={files}
        onScan={onScan}
        onOpenFile={onOpenFile}
        onTab={onTab}
        onDownload={onDownload}
        onMarkAmounts={onMarkAmounts}
      />
    </aside>
  );
}

function PaneTabs({
  matter,
  files,
  tab,
  lit,
  onTab,
  onOpenFile,
  onDownload,
}: {
  matter: DemoCase;
  files: CaseFile[];
  tab: TourTab;
  lit: string[];
  onTab: (tab: TourTab) => void;
  onOpenFile: (fileId: string) => void;
  onDownload: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [tab]);

  return (
    <>
      <div className="pane-tabs" role="tablist" aria-label="Widok sprawy">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={tab === item.id}
            aria-controls={`panel-${item.id}`}
            onClick={() => onTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div ref={bodyRef} className="pane-body" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'obraz' ? <CasePicture matter={matter} lit={lit} onOpenFile={onOpenFile} /> : null}
        {tab === 'szkic' ? <Draft matter={matter} lit={lit} onOpenFile={onOpenFile} /> : null}
        {tab === 'kontrola' ? <Review matter={matter} lit={lit} onDownload={onDownload} /> : null}
      </div>
    </>
  );
}

function sentenceRole(role: string): string {
  return role.charAt(0).toLocaleUpperCase('pl-PL') + role.slice(1);
}

function CasePicture({
  matter,
  lit,
  onOpenFile,
}: {
  matter: DemoCase;
  lit: string[];
  onOpenFile: (fileId: string) => void;
}) {
  const decisionSummary = `Do decyzji: różnica ${matter.amounts.difference.display} · ${matter.gaps.length} braki`;

  return (
    <div className={litClass(lit, 'case-picture', 'picture')} data-tour="case-picture">
      <div className="pane-insight" role="status">
        <p className="pane-insight-label">Skrót sprawy</p>
        <p className="pane-insight-text"><MoneyText text={decisionSummary} /></p>
      </div>
      <section className="picture-block">
        <h3>Strony</h3>
        <dl className="fact-dl">
          <div>
            <dt>{sentenceRole(matter.client.role)}</dt>
            <dd>{matter.client.name}</dd>
          </div>
          <div>
            <dt>{sentenceRole(matter.claimant.role)}</dt>
            <dd>{matter.claimant.name}</dd>
          </div>
        </dl>
      </section>

      <section className="picture-block">
        <h3>Przedmiot</h3>
        <p>{matter.task}</p>
        <p>Faktura nr {matter.invoiceNumber}</p>
        <p>Umowa z {matter.contractDate}</p>
      </section>

      <section className="picture-block">
        <h3>Kwoty</h3>
        <div className="amount-row">
          <AmountCard
            label="Faktura"
            value={matter.amounts.invoice.display}
            lit={lit}
            tourId="amounts"
            onOpen={matter.amounts.invoice.fileId ? () => onOpenFile(matter.amounts.invoice.fileId!) : undefined}
          />
          <AmountCard
            label="Umowa"
            value={matter.amounts.contract.display}
            lit={lit}
            tourId="amounts"
            onOpen={matter.amounts.contract.fileId ? () => onOpenFile(matter.amounts.contract.fileId!) : undefined}
          />
          <AmountCard label="Różnica" value={matter.amounts.difference.display} lit={lit} />
        </div>
      </section>

      <section className="picture-block">
        <h3>Daty</h3>
        <ul className="link-list">
          {matter.dates.map((item) => (
            <li key={item.id}>
              <button type="button" className="link-list-item" onClick={() => onOpenFile(item.fileIds[0])}>
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="picture-block">
        <h3>Do decyzji</h3>
        <ul className="bullet-list">
          {matter.decisions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="picture-block picture-block--attention">
        <h3>Braki</h3>
        <ul className="link-list">
          {matter.gaps.map((gap) => {
            const tourId = `gap-${gap.id}`;
            return (
              <li key={gap.id}>
                <button
                  type="button"
                  className={litClass(lit, tourId, 'link-list-item link-list-item--attention')}
                  data-tour={tourId}
                  onClick={() => onOpenFile(gap.fileId)}
                >
                  {gap.text}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function AmountCard({
  label,
  value,
  onOpen,
  lit,
  tourId,
}: {
  label: string;
  value: string;
  onOpen?: () => void;
  lit: string[];
  tourId?: string;
}) {
  const marked = useAmountMarks();
  const className = `${tourId ? litClass(lit, tourId, 'amount-card') : 'amount-card'}${marked ? ' is-marked' : ''}`;
  const body = (
    <>
      <span className="amount-label">{label}</span>
      <span className="amount-value">{value}</span>
    </>
  );

  if (!onOpen) {
    return <div className={className}>{body}</div>;
  }

  return (
    <button type="button" className={className} data-tour={tourId} aria-label={`${label} ${value}`} onClick={onOpen}>
      {body}
    </button>
  );
}

function truncateWords(text: string, limit = 5): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= limit) {
    return text;
  }
  return `${words.slice(0, limit).join(' ')}...`;
}

function Draft({
  matter,
  lit,
  onOpenFile,
}: {
  matter: DemoCase;
  lit: string[];
  onOpenFile: (fileId: string) => void;
}) {
  return (
    <div className={litClass(lit, 'draft', 'draft')} data-tour="draft">
      {matter.sections.map((section) => (
        <section key={section.id} className="draft-section">
          <h3>{section.heading}</h3>
          <div className="draft-bits">
            {section.paragraphs.map((paragraph, index) => {
              const preview = truncateWords(paragraph.text);
              if (paragraph.sourceFileId) {
                return (
                  <button
                    key={`${section.id}-${index}`}
                    type="button"
                    className="draft-source"
                    onClick={() => onOpenFile(paragraph.sourceFileId!)}
                  >
                    {preview}
                  </button>
                );
              }
              return (
                <p key={`${section.id}-${index}`} className="draft-plain">
                  {preview}
                </p>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function Review({ matter, lit, onDownload }: { matter: DemoCase; lit: string[]; onDownload: () => void }) {
  return (
    <div className={litClass(lit, 'review', 'review')} data-tour="review">
      <section className="review-block review-block--blockers" aria-label="Blokery">
        <h3>Blokery</h3>
        <ul className="issue-list">
          {matter.blockers.map((item) => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </section>
      <section className="review-block review-block--warnings" aria-label="Ostrzeżenia">
        <h3>Ostrzeżenia</h3>
        <ul className="issue-list">
          {matter.warnings.map((item) => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </section>
      <div className="review-actions">
        <button
          type="button"
          className={litClass(lit, 'download', 'primary-action')}
          data-tour="download"
          onClick={() => { void onDownload(); }}
        >
          Pobierz roboczy DOCX
        </button>
        <button type="button" className="quiet-action" disabled aria-describedby="clean-export-note">
          Eksport czysty
        </button>
        <p id="clean-export-note" className="export-note">
          W kancelarii schodzi po rozwiązaniu blokerów.
        </p>
      </div>
    </div>
  );
}
