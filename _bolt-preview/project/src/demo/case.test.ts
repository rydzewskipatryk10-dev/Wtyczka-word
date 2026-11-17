import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { demoCase } from './case';

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');

describe('model sprawy', () => {
  it('ma sześć plików, każdy z obrazem strony i cytatem', () => {
    expect(demoCase.files).toHaveLength(6);

    for (const file of demoCase.files) {
      expect(file.image.startsWith('demo-wzory/')).toBe(true);
      expect(file.image).toMatch(/\.(png|jpe?g)$/);
      expect(fs.existsSync(path.join(workspace, file.image))).toBe(true);
      expect(file.quotes.length).toBeGreaterThan(0);
      for (const item of file.quotes) {
        expect(item.text.trim().length).toBeGreaterThan(0);
        expect(item.box.top).toBeGreaterThanOrEqual(0);
        expect(item.box.left).toBeGreaterThanOrEqual(0);
        expect(item.box.width).toBeGreaterThan(0);
        expect(item.box.height).toBeGreaterThan(0);
        expect(item.box.top + item.box.height).toBeLessThanOrEqual(1);
        expect(item.box.left + item.box.width).toBeLessThanOrEqual(1);
      }
    }

    const quotes = Object.fromEntries(
      demoCase.files.map((file) => [file.id, file.quotes.map((item) => item.text).join(' | ')]),
    );
    expect(quotes.umowa).toContain('wynagrodzenie 10 000 zł');
    expect(quotes.faktura).toContain('12 000 zł');
    expect(quotes.wezwanie).toContain('kwoty 12 000 zł');
    expect(quotes.wezwanie).toContain('Termin odpowiedzi 30.11.2026');
    expect(quotes.pismo).toContain('dokonano zapłaty');
    expect(quotes.pismo).toMatch(/zamknięt/);
    expect(quotes.przelew).toContain('kwota wpłaty 10 000 zł');
    expect(quotes.przelew).toContain('płatność za usługi wg umowy z 01.03.2026');
    expect(quotes.przelew).not.toContain('12/2026');
    expect(quotes.wzor).toContain('Stanowisko');
    expect(quotes.wzor).toContain('Uzasadnienie');
    expect(quotes.wzor).toContain('Żądanie');
  });

  it('trzyma kwoty, daty, braki i strony', () => {
    expect(demoCase.amounts.invoice.value).toBe(12000);
    expect(demoCase.amounts.contract.value).toBe(10000);
    expect(demoCase.amounts.difference.value).toBe(2000);
    expect(demoCase.amounts.invoice.display).toBe('12 000 zł');
    expect(demoCase.amounts.contract.display).toBe('10 000 zł');
    expect(demoCase.amounts.difference.display).toBe('2 000 zł');

    const dates = demoCase.dates.map((item) => item.text).join(' ');
    expect(dates).toContain('05.11');
    expect(dates).toContain('12.11');
    expect(dates).toContain('30.11');

    expect(demoCase.gaps).toHaveLength(2);
    expect(demoCase.gaps.map((gap) => gap.text).join(' ')).toMatch(/potwierdzenia doręczenia/i);
    expect(demoCase.gaps.map((gap) => gap.text).join(' ')).toMatch(/fakturę nr 12\/2026/);

    expect(demoCase.client.name).toBe('Firma X sp. z o.o.');
    expect(demoCase.client.role).toMatch(/odpowiadaj/);
    expect(demoCase.claimant.name).toBe('ABC sp. z o.o.');
    expect(demoCase.claimant.role).toMatch(/wzywaj/);
  });
});
