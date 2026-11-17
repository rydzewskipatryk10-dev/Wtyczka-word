import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import type { LetterSection } from './case';

export type LetterFile = {
  fileName: string;
  client: string;
  clientRole: string;
  claimant: string;
  claimantRole: string;
  sections: LetterSection[];
};

const font = 'Calibri';
const size = 22;

function run(text: string, bold = false) {
  return new TextRun({ text, bold, font, size });
}

export async function exportDocx(letter: LetterFile): Promise<Blob> {
  const children = [
    new Paragraph({ children: [run(letter.client, true)] }),
    new Paragraph({ children: [run(letter.clientRole)] }),
    new Paragraph({ children: [run(letter.claimant, true)] }),
    new Paragraph({ children: [run(letter.claimantRole)] }),
    ...letter.sections.flatMap((section) => [
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [run(section.heading, true)],
      }),
      ...section.paragraphs.map((paragraph) => new Paragraph({ children: [run(paragraph.text)] })),
    ]),
    new Paragraph({ children: [run(letter.client, true)] }),
  ];

  const document = new Document({ sections: [{ children }] });
  return Packer.toBlob(document);
}

export async function downloadDocx(letter: LetterFile) {
  const blob = await exportDocx(letter);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = letter.fileName.endsWith('.docx') ? letter.fileName : `${letter.fileName}.docx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
