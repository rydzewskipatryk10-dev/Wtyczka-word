import { describe, expect, it } from 'vitest';
import { demoOcrTexts } from './demoOcrTexts';
import { layoutScan } from './layoutScan';

describe('layoutScan', () => {
  it('składa umowę w paragrafy i dwa podpisy', () => {
    const doc = layoutScan(demoOcrTexts.umowa);
    expect(doc.kind).toBe('contract');
    if (doc.kind !== 'contract') return;
    expect(doc.title).toMatch(/UMOWA/);
    expect(doc.parties[0]).toMatch(/Firma X/);
    expect(doc.parties[1]).toMatch(/ABC/);
    expect(doc.sections.map((section) => section.title)).toEqual([
      '§ 1. Przedmiot umowy',
      '§ 2. Wynagrodzenie',
      '§ 3. Postanowienia końcowe',
    ]);
    expect(doc.sections[1].paragraphs.join(' ')).toContain('10 000 zł');
    expect(doc.signs.map((sign) => sign.caption)).toEqual(['Za Zamawiającego', 'Za Wykonawcę']);
  });

  it('składa fakturę w tabelę z kwadratowymi polami stron', () => {
    const doc = layoutScan(demoOcrTexts.faktura);
    expect(doc.kind).toBe('invoice');
    if (doc.kind !== 'invoice') return;
    expect(doc.title).toMatch(/FAKTURA nr 12\/2026/);
    expect(doc.parties.map((party) => party.label)).toEqual(['Sprzedawca', 'Nabywca']);
    expect(doc.rows[0][2]).toBe('12 000 zł');
    expect(doc.total).toMatch(/12 000 zł/);
    expect(doc.signs).toEqual(['Wystawił', 'Odebrał']);
  });

  it('składa wezwanie jak pismo na stronie', () => {
    const doc = layoutScan(demoOcrTexts.wezwanie);
    expect(doc.kind).toBe('letter');
    if (doc.kind !== 'letter') return;
    expect(doc.from).toBe('ABC sp. z o.o.');
    expect(doc.date).toBe('12.11.2026');
    expect(doc.to).toMatch(/Firma X/);
    expect(doc.title).toBe('WEZWANIE DO ZAPŁATY');
    expect(doc.paragraphs.join(' ')).toContain('30.11.2026');
    expect(doc.sign).toBe('ABC sp. z o.o.');
  });

  it('składa pismo klienta z tematem i podpisem po prawej', () => {
    const doc = layoutScan(demoOcrTexts.pismo);
    expect(doc.kind).toBe('letter');
    if (doc.kind !== 'letter') return;
    expect(doc.date).toBe('05.11.2026');
    expect(doc.subject).toMatch(/Dotyczy:/);
    expect(doc.paragraphs.join(' ')).toContain('dokonano zapłaty');
    expect(doc.sign).toMatch(/Firma X/);
  });

  it('składa potwierdzenie przelewu wierszami etykieta–wartość', () => {
    const doc = layoutScan(demoOcrTexts.przelew);
    expect(doc.kind).toBe('transfer');
    if (doc.kind !== 'transfer') return;
    expect(doc.amount).toContain('10 000 zł');
    expect(doc.rows.find((row) => row.label === 'Tytuł przelewu')?.value).toContain('01.03.2026');
    expect(doc.rows.map((row) => row.value).join(' ')).not.toContain('12/2026');
  });

  it('składa wzór odpowiedzi z sekcjami pisma', () => {
    const doc = layoutScan(demoOcrTexts.wzor);
    expect(doc.kind).toBe('template');
    if (doc.kind !== 'template') return;
    expect(doc.title).toMatch(/ODPOWIEDŹ NA WEZWANIE/);
    expect(doc.blocks.map((block) => block.heading)).toEqual(['Stanowisko', 'Uzasadnienie', 'Żądanie', '']);
    expect(doc.sign).toMatch(/Podpis/);
    expect(doc.blocks.at(-1)?.lines.join(' ')).not.toMatch(/_{3,}|Podpis/);
  });

  it('zdejmuje kreskę podpisu z treści, także gdy to kreski, nie podkreślenia', () => {
    const doc = layoutScan(demoOcrTexts.wzor.replace(/_+/g, '– – – – – –'));
    expect(doc.kind).toBe('template');
    if (doc.kind !== 'template') return;
    expect(doc.sign).toMatch(/Podpis/);
    expect(doc.blocks.flatMap((block) => block.lines).join('\n')).not.toMatch(/Podpis|–/);
  });
});
