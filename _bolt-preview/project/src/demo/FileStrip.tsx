import { useId, useRef, useState } from 'react';
import type { CaseFile } from './case';

function thumbSrc(image: string): string {
  return image.startsWith('blob:') || image.startsWith('data:') ? image : `/${image}`;
}

type FileStripProps = {
  files: CaseFile[];
  openFile: string | null;
  lit: string[];
  ocrBusy?: boolean;
  ocrStatus?: string | null;
  ocrError?: string | null;
  onOpenFile: (fileId: string) => void;
  onAddFile: (file: File) => void;
  onScan: () => void;
};

export function FileStrip({
  files,
  openFile,
  lit,
  ocrBusy = false,
  ocrStatus = null,
  ocrError = null,
  onOpenFile,
  onAddFile,
  onScan,
}: FileStripProps) {
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [expanded, setExpanded] = useState(false);
  const tourLit = lit.some((id) => id.startsWith('file-'));
  const listOpen = expanded || tourLit;

  return (
    <div className={`file-strip${listOpen ? ' is-expanded' : ''}`} aria-label="Dokumenty sprawy">
      {ocrError ? <p className="file-strip-ocr-error" role="alert">{ocrError}</p> : null}
      {ocrStatus ? <p className="file-strip-ocr-status" aria-live="polite">{ocrStatus}</p> : null}
      <input
        ref={inputRef}
        type="file"
        className="file-strip-input"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) onAddFile(file);
        }}
      />

      <button
        type="button"
        className="file-strip-bar"
        aria-expanded={listOpen}
        aria-controls={listId}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className="file-strip-heading">
          <span className="file-strip-label">Dokumenty</span>
          <span className="file-strip-chevron" aria-hidden="true" />
        </span>
      </button>

      <div className="file-strip-body">
        <div className="file-strip-body-inner">
          <div
            className="file-strip-panel"
            aria-hidden={!listOpen}
            inert={!listOpen ? '' : undefined}
          >
          <ul
            id={listId}
            className="file-strip-scroll"
            aria-label="Lista dokumentów"
          >
            {files.map((file) => {
              const selected = openFile === file.id;
              const tourId = `file-${file.id}`;
              const className = [
                'file-thumb',
                'file-thumb-strip',
                selected ? 'is-selected' : '',
                file.ocrFailed ? 'is-ocr-failed' : '',
                lit.includes(tourId) ? 'is-lit' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <li key={file.id}>
                  <button
                    type="button"
                    className={className}
                    data-tour={tourId}
                    aria-pressed={selected}
                    aria-label={file.name}
                    title={file.name}
                    onClick={() => onOpenFile(file.id)}
                  >
                    <span className="thumb-frame thumb-frame-strip">
                      <img src={thumbSrc(file.image)} alt="" />
                    </span>
                    <span className="thumb-name" aria-hidden="true">
                      {file.name}
                    </span>
                  </button>
                </li>
              );
            })}
            <li className="file-strip-add-slot">
              <button
                type="button"
                className="file-thumb file-thumb-add file-thumb-strip"
                aria-label="Dodaj plik"
                title="Dodaj plik — OCR przez Gemini"
                disabled={ocrBusy}
                onClick={() => inputRef.current?.click()}
              >
                <span className="thumb-frame thumb-frame-strip">
                  <span className="thumb-add-icon" aria-hidden="true">+</span>
                </span>
                <span className="thumb-name" aria-hidden="true">
                  Dodaj
                </span>
              </button>
            </li>
          </ul>
          <div className="file-strip-actions">
            <button
              type="button"
              className="primary-action file-strip-scan"
              disabled={ocrBusy}
              onClick={onScan}
            >
              {ocrBusy ? 'Skanowanie…' : 'Skanowanie'}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}