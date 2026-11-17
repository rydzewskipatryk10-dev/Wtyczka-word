import { useState } from 'react';
import { demoCase, letterWordCount, type CaseFile, type LetterSection, type TourTab } from './demo/case';
import { recognizeCaseFile } from './lib/ocrFromAsset';
import { runDocumentOcr } from './lib/ocrClient';
import { AmountMarks } from './demo/markMoney';
import { DocumentCanvas } from './demo/DocumentCanvas';
import { downloadDocx } from './demo/exportDocx';
import { TaskPane, type DemoPhase } from './demo/TaskPane';
import { spotlightIds } from './demo/Tour';
import { WordShell } from './demo/WordShell';

function cloneSections(sections: LetterSection[]): LetterSection[] {
  return sections.map((section) => ({
    ...section,
    paragraphs: section.paragraphs.map((paragraph) => ({ ...paragraph })),
  }));
}

type AppProps = {
  initialPhase?: DemoPhase;
};

function App({ initialPhase = 'free' }: AppProps) {
  const [phase, setPhase] = useState<DemoPhase>(initialPhase);
  const [stepIndex, setStepIndex] = useState(0);
  const [tab, setTab] = useState<TourTab>(() => (
    initialPhase === 'tour' ? (demoCase.steps[0].tab ?? 'obraz') : 'obraz'
  ));
  const [openFile, setOpenFile] = useState<string | null>(null);
  const [files, setFiles] = useState<CaseFile[]>(() => demoCase.files.map((file) => (
    initialPhase === 'tour'
      ? { ...file }
      : { ...file, preparedScan: file.ocrText, ocrText: undefined }
  )));
  const [ocrBusy, setOcrBusy] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<string | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [letterSections, setLetterSections] = useState(() => cloneSections(demoCase.sections));
  const [markAmounts, setMarkAmounts] = useState(false);

  const step = demoCase.steps[stepIndex];
  const lit = phase === 'tour' ? spotlightIds(step.highlight) : [];

  function applyStep(index: number) {
    const next = demoCase.steps[index];
    if (next.tab) setTab(next.tab);
    if (next.showLetter) setOpenFile(null);
  }

  function nextStep() {
    const current = demoCase.steps[stepIndex];
    if (current.waitForFileId && openFile !== current.waitForFileId) return;
    if (stepIndex >= demoCase.steps.length - 1) {
      setPhase('end');
      return;
    }
    const index = stepIndex + 1;
    setStepIndex(index);
    applyStep(index);
  }

  function openFromPane(fileId: string) {
    if (phase === 'tour' && demoCase.steps[stepIndex].waitForFileId !== fileId) return;
    setOpenFile(fileId);
  }

  async function addFile(file: File) {
    setOcrBusy(true);
    setOcrStatus('Trwa rozpoznawanie tekstu…');
    setOcrError(null);
    const preview = URL.createObjectURL(file);
    const id = `upload-${Date.now()}`;
    try {
      const { text } = await runDocumentOcr(file);
      setFiles((current) => [
        ...current,
        {
          id,
          name: file.name,
          image: preview,
          quotes: [],
          ocrText: text,
        },
      ]);
      setOpenFile(id);
    } catch {
      setFiles((current) => [
        ...current,
        {
          id,
          name: file.name,
          image: preview,
          quotes: [],
          ocrFailed: true,
        },
      ]);
      setOpenFile(id);
    } finally {
      setOcrStatus(null);
      setOcrBusy(false);
    }
  }

  async function scanAll() {
    if (ocrBusy) return;
    const snapshot = files;
    const needsLive = snapshot.filter((file) => !file.preparedScan?.trim() && !file.ocrText?.trim());
    if (needsLive.length === 0) {
      const ready = snapshot.map((file) => {
        const text = file.preparedScan?.trim() || file.ocrText;
        return text ? { ...file, ocrText: text, ocrFailed: false } : file;
      });
      const done = ready.filter((file) => file.ocrText).length;
      setFiles(ready);
      setOcrError(null);
      setOcrStatus(`Gotowe skany: ${done} z ${ready.length}`);
      if (!openFile && ready[0]) setOpenFile(ready[0].id);
      return;
    }

    setOcrBusy(true);
    setOcrError(null);
    const failed: string[] = [];
    for (let index = 0; index < snapshot.length; index += 1) {
      const file = snapshot[index];
      setOcrStatus(`Skanowanie ${index + 1} z ${snapshot.length}: ${file.name}`);
      const prepared = file.preparedScan?.trim() || file.ocrText?.trim();
      if (prepared) {
        setFiles((current) => current.map((item) => (
          item.id === file.id ? { ...item, ocrText: prepared, ocrFailed: false } : item
        )));
        continue;
      }
      try {
        const text = await recognizeCaseFile(file);
        setFiles((current) => current.map((item) => (
          item.id === file.id ? { ...item, ocrText: text, ocrFailed: false } : item
        )));
      } catch {
        failed.push(file.name);
        setFiles((current) => current.map((item) => (
          item.id === file.id ? { ...item, ocrFailed: true } : item
        )));
      }
    }
    setOcrStatus(failed.length ? null : `Gotowe skany: ${snapshot.length - failed.length} z ${snapshot.length}`);
    setOcrError(failed.length ? `Nie udało się przeskanować: ${failed.join(', ')}` : null);
    setOcrBusy(false);
    if (!openFile && snapshot[0]) setOpenFile(snapshot[0].id);
  }

  function editParagraph(sectionId: string, index: number, text: string) {
    setLetterSections((current) => current.map((section) => {
      if (section.id !== sectionId) return section;
      return {
        ...section,
        paragraphs: section.paragraphs.map((paragraph, paragraphIndex) => (
          paragraphIndex === index ? { ...paragraph, text } : paragraph
        )),
      };
    }));
  }

  function download() {
    return downloadDocx({
      fileName: `${demoCase.documentName}.docx`,
      client: demoCase.client.name,
      clientRole: demoCase.client.role,
      claimant: demoCase.claimant.name,
      claimantRole: demoCase.claimant.role,
      sections: letterSections,
    });
  }

  return (
    <WordShell documentName={demoCase.documentName} wordCount={letterWordCount(demoCase, letterSections)} dimmed={phase === 'tour'}>
      <AmountMarks active={markAmounts}>
        <DocumentCanvas
          matter={demoCase}
          files={files}
          sections={letterSections}
          editable={phase === 'free'}
          openFile={openFile}
          lit={lit}
          onCloseFile={() => setOpenFile(null)}
          onEditParagraph={editParagraph}
        />
        <TaskPane
          matter={demoCase}
          files={files}
          phase={phase}
          tab={tab}
          step={phase === 'tour' ? step : null}
          lit={lit}
          openFile={openFile}
          ocrBusy={ocrBusy}
          ocrStatus={ocrStatus}
          ocrError={ocrError}
          onNext={nextStep}
          onCloseEnd={() => setPhase('free')}
          onTab={setTab}
          onOpenFile={openFromPane}
          onAddFile={addFile}
          onScan={scanAll}
          onDownload={download}
          onMarkAmounts={() => setMarkAmounts(true)}
        />
      </AmountMarks>
    </WordShell>
  );
}

export default App;
