import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import JSZip from 'jszip';
import { describe, expect, it, vi } from 'vitest';
import App from './App';
import { demoCase } from './demo/case';

function fileName(id: string) {
  return demoCase.files.find((file) => file.id === id)!.name;
}

describe('powłoka demo', () => {
  it('nie pokazuje Copilota ani schematu panelu', () => {
    render(<App />);

    expect(screen.queryByText(/Uaktualnij plan/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Co chcesz utworzyć/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Pokaż źródła/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^\[.*\]$/ })).not.toBeInTheDocument();
  });

  it('pokazuje odpowiedź Firmy X na kartce', () => {
    render(<App />);

    expect(screen.getByText('Odpowiedź na wezwanie — Firma X')).toBeInTheDocument();

    const page = screen.getByRole('article', { name: 'Odpowiedź na wezwanie — Firma X' });
    expect(page).toHaveTextContent(/stanowisko/i);
    expect(page).toHaveTextContent(/uzasadnienie/i);
    expect(page).toHaveTextContent(/żądanie/i);
    expect(page).not.toHaveTextContent('[LOGO KANCELARII]');
    expect(page.textContent ?? '').not.toMatch(/\[[^\]]+\]/);
  });
});

describe('panel sprawy', () => {
  it('pokazuje nagłówek, pasek plików i zakładki sprawy od razu', () => {
    render(<App />);

    const panel = screen.getByRole('complementary', { name: 'Odpowiedź na wezwanie' });
    expect(within(panel).getByText('Odpowiedź na wezwanie')).toBeInTheDocument();
    expect(within(panel).getByText('Klient: X sp. z o.o.')).toBeInTheDocument();
    expect(within(panel).getByText('Do decyzji: różnica 2 000 zł · 2 braki')).toBeInTheDocument();

    const strip = within(panel).getByLabelText('Dokumenty sprawy');
    expect(within(panel).getByRole('tab', { name: 'Obraz sprawy' })).toBeInTheDocument();
    expect(within(panel).queryByRole('tab', { name: 'Dokumenty' })).not.toBeInTheDocument();
    expect(within(strip).getByText('Dokumenty')).toBeInTheDocument();
    expect(within(strip).queryByRole('img')).not.toBeInTheDocument();
    expect(within(strip).queryByRole('button', { name: /dodaj plik/i })).not.toBeInTheDocument();

    fireEvent.click(within(strip).getByRole('button', { name: /^dokumenty$/i }));
    expect(within(strip).getByRole('button', { name: /dodaj plik/i })).toBeInTheDocument();
    expect(strip.querySelectorAll('.file-strip-scroll img')).toHaveLength(6);

    for (const file of demoCase.files) {
      const thumb = within(strip).getByRole('button', { name: file.name });
      const image = thumb.querySelector('.thumb-frame img') as HTMLImageElement;
      expect(image).toHaveAttribute('src', `/${file.image}`);
    }
  });

  it('przełącza obraz sprawy, szkic i kontrolę', () => {
    render(<App />);

    const panel = screen.getByRole('complementary', { name: 'Odpowiedź na wezwanie' });

    expect(within(panel).queryByRole('tab', { name: 'Dokumenty' })).not.toBeInTheDocument();
    expect(within(panel).getByRole('tab', { name: 'Obraz sprawy' })).toBeInTheDocument();
    expect(within(panel).getByRole('tab', { name: 'Szkic' })).toBeInTheDocument();
    expect(within(panel).getByRole('tab', { name: 'Kontrola' })).toBeInTheDocument();

    fireEvent.click(within(panel).getByRole('tab', { name: 'Obraz sprawy' }));
    const obraz = within(panel).getByRole('tabpanel');
    expect(obraz).toHaveTextContent('Do decyzji: różnica 2 000 zł · 2 braki');
    expect(obraz).toHaveTextContent('12 000 zł');
    expect(obraz).toHaveTextContent('10 000 zł');
    for (const gap of demoCase.gaps) {
      expect(obraz).toHaveTextContent(gap.text);
    }

    fireEvent.click(within(panel).getByRole('tab', { name: 'Szkic' }));
    const szkic = within(panel).getByRole('tabpanel');
    for (const section of demoCase.sections) {
      expect(szkic).toHaveTextContent(section.heading);
    }
    expect(szkic).not.toHaveTextContent(demoCase.gaps[0].text);

    fireEvent.click(within(panel).getByRole('tab', { name: 'Kontrola' }));
    const kontrola = within(panel).getByRole('tabpanel');
    const text = kontrola.textContent ?? '';
    const blockerAt = demoCase.blockers.map((item) => text.indexOf(item.text));
    const warningAt = demoCase.warnings.map((item) => text.indexOf(item.text));
    expect(blockerAt.every((index) => index >= 0)).toBe(true);
    expect(warningAt.every((index) => index >= 0)).toBe(true);
    expect(Math.max(...blockerAt)).toBeLessThan(Math.min(...warningAt));
  });
});

function ensureFileStripExpanded(strip: HTMLElement) {
  const bar = within(strip).getByRole('button', { name: /^dokumenty$/i });
  if (bar.getAttribute('aria-expanded') !== 'true') {
    fireEvent.click(bar);
  }
}

function openThumbnail(name: string) {
  render(<App />);
  const strip = screen.getByLabelText('Dokumenty sprawy');
  ensureFileStripExpanded(strip);
  fireEvent.click(within(strip).getByRole('button', { name: 'Skanowanie' }));
  if (!within(strip).queryByRole('button', { name })) {
    ensureFileStripExpanded(strip);
  }
  const thumb = within(strip).getByRole('button', { name });
  const thumbSrc = thumb.querySelector('.thumb-frame img')!.getAttribute('src');
  fireEvent.click(thumb);

  const page = screen.getByRole('article', { name });
  expect(within(page).getByRole('img', { name })).toHaveAttribute('src', thumbSrc);
  expect(thumb).toHaveAttribute('aria-pressed', 'true');
  return page;
}

function originalPreviewHost(page: HTMLElement) {
  return within(page).getByLabelText(/Oryginał pliku|Podgląd pliku/);
}

function expectCleanOriginal(page: HTMLElement) {
  const host = originalPreviewHost(page);
  expect(host.querySelector('mark, .source-quote')).toBeNull();
  expect(host.innerHTML.toLowerCase()).not.toContain('cfe4fa');
}

function expectBackToLetter() {
  fireEvent.click(screen.getByRole('button', { name: 'Wróć do pisma' }));
  const letter = screen.getByRole('article', { name: 'Odpowiedź na wezwanie — Firma X' });
  expect(letter).toHaveTextContent(/stanowisko/i);
  expect(letter).toHaveTextContent(/uzasadnienie/i);
  expect(letter).toHaveTextContent(/żądanie/i);
  expect(screen.queryByRole('button', { name: 'Wróć do pisma' })).not.toBeInTheDocument();
}

describe('skanowanie dokumentów', () => {
  it('skanuje pliki sprawy i składa gotowe skany', () => {
    render(<App />);
    const strip = screen.getByLabelText('Dokumenty sprawy');
    fireEvent.click(within(strip).getByRole('button', { name: /^dokumenty$/i }));
    const input = strip.querySelector('input[type="file"]') as HTMLInputElement;
    const openPicker = vi.spyOn(input, 'click');

    expect(screen.queryByRole('region', { name: 'Rozpoznany dokument' })).not.toBeInTheDocument();
    fireEvent.click(within(strip).getByRole('button', { name: 'Skanowanie' }));

    expect(openPicker).not.toHaveBeenCalled();
    expect(screen.getByText('Gotowe skany: 6 z 6')).toBeInTheDocument();
    const page = screen.getByRole('article', { name: fileName('umowa') });
    expect(within(page).getByRole('region', { name: 'Rozpoznany dokument' })).toBeInTheDocument();
    expect(page).toHaveTextContent('10 000 zł');
    openPicker.mockRestore();
  });
});

describe('polecenia', () => {
  it('zostaje na dole panelu przy każdej zakładce', () => {
    render(<App />);
    const panel = screen.getByRole('complementary', { name: 'Odpowiedź na wezwanie' });
    const commands = within(panel).getByRole('region', { name: 'Polecenia' });
    expect(panel.lastElementChild).toBe(commands);
    expect(within(commands).getByRole('textbox', { name: 'Polecenie' })).toBeInTheDocument();
    expect(within(commands).queryByRole('log')).not.toBeInTheDocument();

    for (const name of ['Szkic', 'Kontrola', 'Obraz sprawy']) {
      fireEvent.click(within(panel).getByRole('tab', { name }));
      expect(within(panel).getByRole('region', { name: 'Polecenia' })).toBeInTheDocument();
      expect(within(panel).getByRole('textbox', { name: 'Polecenie' })).toBeInTheDocument();
    }
  });

  it('wykonuje skanowanie i otwiera braki bez rozmowy', () => {
    render(<App />);
    const panel = screen.getByRole('complementary', { name: 'Odpowiedź na wezwanie' });
    const input = within(panel).getByRole('textbox', { name: 'Polecenie' });

    fireEvent.change(input, { target: { value: 'przeskanuj dokumenty' } });
    fireEvent.click(within(panel).getByRole('button', { name: 'Wyślij' }));

    expect(screen.getByRole('region', { name: 'Rozpoznany dokument' })).toBeInTheDocument();
    expect(within(panel).queryByRole('log')).not.toBeInTheDocument();
    expect(input).toHaveValue('');

    fireEvent.change(input, { target: { value: 'pokaż braki' } });
    fireEvent.click(within(panel).getByRole('button', { name: 'Wyślij' }));
    expect(within(panel).getByRole('tab', { name: 'Obraz sprawy' })).toHaveAttribute('aria-selected', 'true');
    expect(within(panel).getByText(demoCase.gaps[0].text)).toBeInTheDocument();
    expect(within(panel).getByRole('region', { name: 'Polecenia' })).not.toHaveTextContent(demoCase.gaps[0].text);
  });

  it('zaznacza kwoty na zielono', () => {
    render(<App />);
    const panel = screen.getByRole('complementary', { name: 'Odpowiedź na wezwanie' });
    const input = within(panel).getByRole('textbox', { name: 'Polecenie' });

    fireEvent.change(input, { target: { value: 'wyciągnij wszystkie kwoty' } });
    fireEvent.click(within(panel).getByRole('button', { name: 'Wyślij' }));

    expect(panel.querySelectorAll('.amount-card.is-marked')).toHaveLength(3);
    const letter = screen.getByRole('article', { name: 'Odpowiedź na wezwanie — Firma X' });
    const hits = Array.from(letter.querySelectorAll('mark.amount-hit'), (node) => node.textContent);
    expect(hits).toContain('12 000 zł');
    expect(hits).toContain('10 000 zł');
    expect(hits).toContain('2 000 zł');
    expect(within(panel).queryByRole('log')).not.toBeInTheDocument();
  });
});

describe('podgląd źródła', () => {
  it('otwiera umowę z cytatem wynagrodzenia', () => {
    const file = demoCase.files.find((item) => item.id === 'umowa')!;
    const page = openThumbnail(file.name);
    expect(page).toHaveTextContent('10 000 zł');
    expectCleanOriginal(page);
    expectBackToLetter();
  });

  it('otwiera fakturę z cytatem 12 000 zł', () => {
    const file = demoCase.files.find((item) => item.id === 'faktura')!;
    const page = openThumbnail(file.name);
    expect(page).toHaveTextContent('12 000 zł');
    expectCleanOriginal(page);
    expectBackToLetter();
  });

  it('otwiera wezwanie z terminem odpowiedzi', () => {
    const file = demoCase.files.find((item) => item.id === 'wezwanie')!;
    const page = openThumbnail(file.name);
    expect(page).toHaveTextContent('30.11.2026');
    expectCleanOriginal(page);
    expectBackToLetter();
  });

  it('otwiera pismo klienta ze zdaniem o zapłacie', () => {
    const file = demoCase.files.find((item) => item.id === 'pismo')!;
    const page = openThumbnail(file.name);
    expect(page).toHaveTextContent('dokonano zapłaty');
    expectCleanOriginal(page);
    expectBackToLetter();
  });

  it('otwiera przelew z kwotą i tytułem umowy, bez numeru faktury', () => {
    const file = demoCase.files.find((item) => item.id === 'przelew')!;
    const page = openThumbnail(file.name);
    expect(page).toHaveTextContent('10 000 zł');
    expect(page).toHaveTextContent('umowy z 01.03.2026');
    expect(page).not.toHaveTextContent('12/2026');
    expect(page).not.toHaveTextContent(/faktur/i);
    expectCleanOriginal(page);
    expectBackToLetter();
  });

  it('otwiera wzór z sekcjami odpowiedzi', () => {
    const file = demoCase.files.find((item) => item.id === 'wzor')!;
    const page = openThumbnail(file.name);
    expect(page).toHaveTextContent('Stanowisko');
    expect(page).toHaveTextContent('Uzasadnienie');
    expect(page).toHaveTextContent('Żądanie');
    expectCleanOriginal(page);
    expectBackToLetter();
  });

  it('otwiera fakturę po kliknięciu kwoty 12 000 zł', () => {
    finishTour();

    const panel = screen.getByRole('complementary', { name: 'Odpowiedź na wezwanie' });
    fireEvent.click(within(panel).getByRole('tab', { name: 'Obraz sprawy' }));
    fireEvent.click(within(panel).getByRole('button', { name: /^Faktura/i }));

    const page = screen.getByRole('article', { name: fileName('faktura') });
    expect(within(page).getByRole('img', { name: fileName('faktura') })).toHaveAttribute('src', '/demo-wzory/faktura.jpg');
    expect(page).toHaveTextContent('12 000 zł');
  });

  it('otwiera fakturę albo umowę ze źródła przy różnicy', () => {
    finishTour();

    const panel = screen.getByRole('complementary', { name: 'Odpowiedź na wezwanie' });
    fireEvent.click(within(panel).getByRole('tab', { name: 'Szkic' }));
    fireEvent.click(within(panel).getByRole('button', { name: /Faktura nr 12\/2026/ }));

    const page = screen.getByRole('article', { name: new RegExp(`${fileName('faktura')}|${fileName('umowa')}`) });
    expect([fileName('faktura'), fileName('umowa')]).toContain(page.getAttribute('aria-label'));
    const opened = demoCase.files.find((file) => file.name === page.getAttribute('aria-label'));
    expect(within(page).getByRole('img', { name: opened!.name })).toHaveAttribute('src', `/${opened!.image}`);
  });
});

function clickNext() {
  const count = screen.getByText(/^Krok \d+ z 8$/);
  const current = Number(count.textContent?.match(/\d+/)?.[0]);
  if (current === 6) {
    const strip = screen.getByLabelText('Dokumenty sprawy');
    ensureFileStripExpanded(strip);
    fireEvent.click(within(strip).getByRole('button', { name: fileName('faktura') }));
  }
  fireEvent.click(screen.getByRole('button', { name: 'Dalej' }));
}

function goToStep(target: number) {
  render(<App initialPhase="tour" />);
  for (let step = 1; step < target; step += 1) clickNext();
}

function finishTour() {
  goToStep(8);
  clickNext();
  const end = screen.getByRole('region', { name: 'Praca w kancelarii' });
  fireEvent.click(within(end).getByRole('button', { name: 'Zamknij' }));
}

async function documentXml(blob: Blob): Promise<string> {
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  const xml = await zip.file('word/document.xml')?.async('string');
  if (!xml) throw new Error('brak document.xml');
  return xml;
}

async function captureDownload(action: () => void) {
  const blobs: Blob[] = [];
  const names: string[] = [];
  const create = vi.spyOn(URL, 'createObjectURL').mockImplementation((value) => {
    blobs.push(value as Blob);
    return 'blob:letter';
  });
  const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function capture(this: HTMLAnchorElement) {
    names.push(this.download);
  });

  try {
    action();
    await waitFor(() => expect(blobs).toHaveLength(1));
    return { blob: blobs[0], name: names[0] ?? '', xml: await documentXml(blobs[0]) };
  } finally {
    create.mockRestore();
    revoke.mockRestore();
    click.mockRestore();
  }
}

describe('prezentacja', () => {
  it('w trybie tour pokazuje krok 1', () => {
    render(<App initialPhase="tour" />);

    expect(screen.getByText('Krok 1 z 8')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Start prezentacji' })).not.toBeInTheDocument();
  });

  it('krok 1 podświetla nagłówek sprawy', () => {
    goToStep(1);

    expect(screen.getByText(demoCase.steps[0].sentence)).toBeInTheDocument();
    const header = document.querySelector('[data-tour="case-header"]');
    expect(header).toHaveClass('is-lit');
    expect(header).toHaveTextContent('Klient: X sp. z o.o.');
    expect(header).not.toHaveTextContent('ABC sp. z o.o.');
    expect(document.querySelector('.tour-shade')).toBeInTheDocument();
  });

  it('krok 2 otwiera obraz sprawy', () => {
    goToStep(2);

    expect(screen.getByText(demoCase.steps[1].sentence)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Obraz sprawy' })).toHaveAttribute('aria-selected', 'true');
    const obraz = screen.getByRole('tabpanel');
    expect(obraz).toHaveTextContent('Firma X sp. z o.o.');
    expect(obraz).toHaveTextContent('ABC sp. z o.o.');
    expect(obraz).toHaveTextContent(demoCase.task);
    expect(obraz).toHaveTextContent('12 000 zł');
    expect(obraz).toHaveTextContent('10 000 zł');
    expect(obraz).toHaveTextContent('05.11');
    expect(obraz).toHaveTextContent('12.11');
    expect(obraz).toHaveTextContent('30.11');
    for (const gap of demoCase.gaps) {
      expect(obraz).toHaveTextContent(gap.text);
    }
    expect(document.querySelector('[data-tour="case-picture"]')).toHaveClass('is-lit');
  });

  it('krok 3 podświetla różnicę oraz fakturę i umowę', () => {
    goToStep(3);

    expect(screen.getByText(demoCase.steps[2].sentence)).toBeInTheDocument();
    const litAmounts = document.querySelectorAll('[data-tour="amounts"].is-lit');
    const amountText = Array.from(litAmounts).map((node) => node.textContent ?? '').join(' ');
    expect(amountText).toContain('12 000 zł');
    expect(amountText).toContain('10 000 zł');

    const strip = screen.getByLabelText('Dokumenty sprawy');
    expect(within(strip).getByRole('button', { name: fileName('faktura') })).toHaveClass('is-lit');
    expect(within(strip).getByRole('button', { name: fileName('umowa') })).toHaveClass('is-lit');
    expect(within(strip).getByRole('button', { name: fileName('wezwanie') })).not.toHaveClass('is-lit');
  });

  it('krok 4 podświetla brak potwierdzenia doręczenia', () => {
    goToStep(4);

    expect(screen.getByText(demoCase.steps[3].sentence)).toBeInTheDocument();
    const gap = screen.getByRole('button', { name: /potwierdzenia doręczenia/i });
    expect(gap).toHaveClass('is-lit');
    expect(gap).toHaveTextContent('Brak potwierdzenia doręczenia wezwania');
  });

  it('krok 5 otwiera szkic i podświetla te same sekcje na piśmie', () => {
    goToStep(5);

    expect(screen.getByText(demoCase.steps[4].sentence)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Szkic' })).toHaveAttribute('aria-selected', 'true');
    const szkic = screen.getByRole('tabpanel');
    expect(document.querySelector('[data-tour="draft"]')).toHaveClass('is-lit');

    const letter = screen.getByRole('article', { name: demoCase.documentName });
    for (const section of demoCase.sections) {
      expect(szkic).toHaveTextContent(section.heading);
      expect(within(letter).getByRole('heading', { name: section.heading }).closest('section')).toHaveClass('is-lit');
    }
  });

  it('krok 6 czeka na kliknięcie faktury', () => {
    goToStep(6);

    expect(screen.getByText(demoCase.steps[5].sentence)).toBeInTheDocument();
    const strip = screen.getByLabelText('Dokumenty sprawy');
    expect(within(strip).getByRole('button', { name: fileName('faktura') })).toHaveClass('is-lit');

    fireEvent.click(screen.getByRole('button', { name: 'Dalej' }));
    expect(screen.getByText('Krok 6 z 8')).toBeInTheDocument();
    expect(screen.getByText(demoCase.steps[5].sentence)).toBeInTheDocument();

    fireEvent.click(within(strip).getByRole('button', { name: fileName('faktura') }));
    const page = screen.getByRole('article', { name: fileName('faktura') });
    expect(page).toHaveTextContent('12 000 zł');
    expectCleanOriginal(page);
  });

  it('krok 7 otwiera kontrolę, blokery nad ostrzeżeniami', () => {
    goToStep(7);

    expect(screen.getByText(demoCase.steps[6].sentence)).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Kontrola' })).toHaveAttribute('aria-selected', 'true');
    const kontrola = screen.getByRole('tabpanel');
    const text = kontrola.textContent ?? '';
    const blockerAt = demoCase.blockers.map((item) => text.indexOf(item.text));
    const warningAt = demoCase.warnings.map((item) => text.indexOf(item.text));
    expect(blockerAt.every((index) => index >= 0)).toBe(true);
    expect(warningAt.every((index) => index >= 0)).toBe(true);
    expect(Math.max(...blockerAt)).toBeLessThan(Math.min(...warningAt));
    expect(document.querySelector('[data-tour="review"]')).toHaveClass('is-lit');
  });

  it('krok 8 pokazuje pobranie i wraca do pisma', () => {
    goToStep(8);

    expect(screen.getByText(demoCase.steps[7].sentence)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pobierz roboczy DOCX' })).toHaveClass('is-lit');
    const letter = screen.getByRole('article', { name: demoCase.documentName });
    expect(letter).toHaveTextContent(/stanowisko/i);
    expect(letter).toHaveTextContent(/uzasadnienie/i);
    expect(letter).toHaveTextContent(/żądanie/i);
    expect(screen.queryByRole('button', { name: 'Wróć do pisma' })).not.toBeInTheDocument();
  });
});

describe('wygląd demo', () => {
  it('trzyma szerokość panelu, miniatury i czcionki z planu', () => {
    render(<App />);

    const panel = screen.getByRole('complementary', { name: 'Odpowiedź na wezwanie' });
    expect(panel).toHaveClass('task-pane');
    expect(panel).toHaveStyle({ flex: '0 0 400px' });

    const strip = within(panel).getByLabelText('Dokumenty sprawy');
    fireEvent.click(within(strip).getByRole('button', { name: /^dokumenty$/i }));
    const frames = within(strip)
      .getAllByRole('button')
      .filter((button) => button.querySelector('.thumb-frame img'))
      .map((button) => button.querySelector('.thumb-frame'));
    for (const frame of frames) {
      expect(frame).toHaveClass('thumb-frame');
      expect(frame).toHaveStyle({ width: '76px', height: '96px' });
    }

    const page = screen.getByRole('article', { name: 'Odpowiedź na wezwanie — Firma X' });
    const letter = page.querySelector('.letter') as HTMLElement | null;
    expect(letter).toBeTruthy();
    expect(getComputedStyle(letter!).fontFamily).toMatch(/Calibri/i);
  });
});

describe('pobranie i plansza końcowa', () => {
  it('pobiera roboczy docx z treścią pisma', async () => {
    finishTour();
    const panel = screen.getByRole('complementary', { name: 'Odpowiedź na wezwanie' });
    const demand = demoCase.sections.find((section) => section.id === 'zadanie')!.paragraphs[0].text;

    const file = await captureDownload(() => {
      fireEvent.click(within(panel).getByRole('button', { name: 'Pobierz roboczy DOCX' }));
    });

    expect(file.name).toMatch(/\.docx$/);
    expect(file.xml).toContain('Firma X sp. z o.o.');
    expect(file.xml).toContain('ABC sp. z o.o.');
    expect(file.xml).toContain('12 000 zł');
    expect(file.xml).toContain('10 000 zł');
    expect(file.xml).toContain('Żądanie');
    expect(file.xml).toContain(demand);
  });

  it('po kroku 8 pokazuje pracę w kancelarii', () => {
    goToStep(8);
    clickNext();

    const end = screen.getByRole('region', { name: 'Praca w kancelarii' });
    expect(end).toHaveTextContent('zadanie własnymi słowami');
    expect(end).toHaveTextContent('własne dokumenty');
    expect(end).toHaveTextContent('własny wzór');
    expect(end).toHaveTextContent('Wordzie');
    expect(screen.queryByRole('tab', { name: 'Szkic' })).not.toBeInTheDocument();
  });

  it('po zamknięciu planszy działa panel, a zmiana zdania wchodzi do docx', async () => {
    finishTour();

    const strip = screen.getByLabelText('Dokumenty sprawy');
    ensureFileStripExpanded(strip);
    fireEvent.click(within(strip).getByRole('button', { name: fileName('umowa') }));
    expect(screen.getByRole('article', { name: fileName('umowa') })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Wróć do pisma' }));

    const panel = screen.getByRole('complementary', { name: 'Odpowiedź na wezwanie' });
    fireEvent.click(within(panel).getByRole('tab', { name: 'Obraz sprawy' }));
    expect(within(panel).getByRole('tabpanel')).toHaveTextContent('12 000 zł');
    fireEvent.click(within(panel).getByRole('tab', { name: 'Szkic' }));
    expect(within(panel).getByRole('tabpanel')).toHaveTextContent('Stanowisko');
    fireEvent.click(within(panel).getByRole('tab', { name: 'Kontrola' }));
    expect(within(panel).getByRole('tabpanel')).toHaveTextContent(demoCase.blockers[0].text);

    const letter = screen.getByRole('article', { name: demoCase.documentName });
    const sentence = within(letter).getByText(/wnosi o wyjaśnienie różnicy/, { selector: 'p' });
    const edited = 'Prosimy o doprecyzowanie różnicy 2 000 zł.';
    sentence.textContent = edited;
    fireEvent.blur(sentence);

    const file = await captureDownload(() => {
      fireEvent.click(within(panel).getByRole('button', { name: 'Pobierz roboczy DOCX' }));
    });
    expect(file.xml).toContain(edited);
    expect(file.xml).not.toContain('wnosi o wyjaśnienie różnicy');
    expect(file.xml).toContain('Firma X sp. z o.o.');
    expect(file.xml).toContain('ABC sp. z o.o.');
    expect(file.xml).toContain('12 000 zł');
    expect(file.xml).toContain('10 000 zł');
  });
});
