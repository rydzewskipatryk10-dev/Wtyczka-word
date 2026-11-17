import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import type { CaseFile, DemoCase, LetterSection } from './case';
import { MoneyText, useAmountMarks } from './markMoney';
import { ScannedSheet } from './ScannedSheet';

type DocumentCanvasProps = {
  matter: DemoCase;
  files: CaseFile[];
  sections: LetterSection[];
  editable: boolean;
  openFile: string | null;
  lit: string[];
  onCloseFile: () => void;
  onEditParagraph: (sectionId: string, index: number, text: string) => void;
};

export function DocumentCanvas({
  matter,
  files,
  sections,
  editable,
  openFile,
  lit,
  onCloseFile,
  onEditParagraph,
}: DocumentCanvasProps) {
  const file = files.find((item) => item.id === openFile) ?? null;

  return (
    <div className={`editor-area${file ? ' editor-area--gemini' : ''}`}>
      <div className="canvas-column">
        {file ? (
          <header className="gemini-preview-chrome">
            <button type="button" className="gemini-back" onClick={onCloseFile}>
              <ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" />
              Wróć do pisma
            </button>
            <p className="gemini-filename" title={file.name}>{file.name}</p>
          </header>
        ) : null}
        <div className={`page-wrap${file ? ' page-wrap--preview' : ''}`}>
          {file ? <SourcePage file={file} /> : (
            <Letter
              matter={matter}
              sections={sections}
              editable={editable}
              lit={lit}
              onEditParagraph={onEditParagraph}
            />
          )}
        </div>
      </div>
      <div className="editor-scrollbar">
        <button aria-label="Przewiń do góry" type="button"><ChevronUp size={18} /></button>
        <div className="scroll-track"><div className="scroll-thumb" /></div>
        <button aria-label="Przewiń w dół" type="button"><ChevronDown size={18} /></button>
      </div>
    </div>
  );
}

function Letter({
  matter,
  sections,
  editable,
  lit,
  onEditParagraph,
}: {
  matter: DemoCase;
  sections: LetterSection[];
  editable: boolean;
  lit: string[];
  onEditParagraph: (sectionId: string, index: number, text: string) => void;
}) {
  const marked = useAmountMarks();
  return (
    <article className="document-page" aria-label={matter.documentName}>
      <div className="letter">
        <header className="letter-head">
          <div>
            <p className="letter-party">{matter.client.name}</p>
            <p className="letter-role">{matter.client.role}</p>
          </div>
          <div className="letter-addressee">
            <p className="letter-party">{matter.claimant.name}</p>
            <p className="letter-role">{matter.claimant.role}</p>
          </div>
        </header>

        {sections.map((section) => (
          <section
            key={section.id}
            className={lit.includes('letter') ? 'letter-section is-lit' : 'letter-section'}
            data-section={section.id}
            data-tour="letter"
          >
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={`${section.id}-${index}`}
                contentEditable={editable && !marked}
                suppressContentEditableWarning
                onBlur={(event) => {
                  if (!editable || marked) return;
                  onEditParagraph(section.id, index, event.currentTarget.textContent ?? '');
                }}
              >
                <MoneyText text={paragraph.text} />
              </p>
            ))}
          </section>
        ))}

        <p className="letter-sign">{matter.client.name}</p>
      </div>
    </article>
  );
}

function sourceSrc(image: string): string {
  return image.startsWith('blob:') || image.startsWith('data:') ? image : `/${image}`;
}

function isPdfFile(file: CaseFile): boolean {
  const asset = file.image.split('?')[0].toLowerCase();
  return asset.endsWith('.pdf');
}

function SourcePage({ file }: { file: CaseFile }) {
  const src = sourceSrc(file.image);
  const showStructured = Boolean(file.ocrText);

  return (
    <article className="file-preview" aria-label={file.name}>
      <div className="gemini-reader">
        {showStructured && file.ocrText ? (
          <section className="gemini-reader-block" aria-label="Rozpoznany dokument">
            <ScannedSheet text={file.ocrText} />
          </section>
        ) : null}

        <section
          className={`gemini-reader-block gemini-reader-block--original`}
          aria-label={showStructured ? 'Oryginał pliku' : 'Podgląd pliku'}
        >
          {showStructured ? <p className="gemini-original-label">Oryginał</p> : null}
          <div className="gemini-original-frame">
            <div className="source-sheet gemini-source-sheet">
              {isPdfFile(file) ? (
                <embed className="source-pdf gemini-source-pdf" src={src} type="application/pdf" title={file.name} />
              ) : (
                <img src={src} alt={file.name} />
              )}
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}