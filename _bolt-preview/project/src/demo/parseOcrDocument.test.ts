import { describe, expect, it } from 'vitest';
import { demoOcrTexts } from './demoOcrTexts';
import { parseOcrDocument } from './parseOcrDocument';

describe('parseOcrDocument', () => {
  it('wyciąga tytuł faktury i pola sprzedawca/nabywca', () => {
    const doc = parseOcrDocument(demoOcrTexts.faktura);
    expect(doc.title).toMatch(/FAKTURA/i);
    const fields = doc.sections.flatMap((section) => section.fields ?? []);
    expect(fields.some((field) => field.label === 'Sprzedawca' && field.value.includes('ABC'))).toBe(true);
    expect(fields.some((field) => field.label === 'Nabywca' && field.value.includes('Firma X'))).toBe(true);
  });

  it('rozpoznaje wezwanie jako tytuł dokumentu', () => {
    const doc = parseOcrDocument(demoOcrTexts.wezwanie);
    expect(doc.title).toMatch(/WEZWANIE DO ZAPŁATY/i);
  });

  it('rozbija paragrafy umowy na sekcje §', () => {
    const doc = parseOcrDocument(demoOcrTexts.umowa);
    expect(doc.title).toMatch(/UMOWA/i);
    expect(doc.sections.some((section) => section.title.startsWith('§ 2'))).toBe(true);
  });
});