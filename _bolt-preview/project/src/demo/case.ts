import { demoOcrTexts } from './demoOcrTexts';

export type QuoteBox = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type CaseQuote = {
  text: string;
  box: QuoteBox;
};

export type CaseFile = {
  id: string;
  name: string;
  image: string;
  quotes: CaseQuote[];
  /** Tekst złożony na kartce A4. Pojawia się po skanowaniu. */
  ocrText?: string;
  /** Tekst przygotowany do złożenia, zanim prawnik uruchomi skan. */
  preparedScan?: string;
  /** OCR nie rozpoznał skanu — podświetlenie miniatury w pasku plików. */
  ocrFailed?: boolean;
};

export type Party = {
  name: string;
  role: string;
};

export type AmountFact = {
  display: string;
  value: number;
  fileId?: string;
};

export type CaseDate = {
  id: string;
  text: string;
  fileIds: string[];
};

export type CaseGap = {
  id: string;
  text: string;
  fileId: string;
};

export type LetterParagraph = {
  text: string;
  sourceFileId?: string;
};

export type LetterSection = {
  id: string;
  heading: string;
  paragraphs: LetterParagraph[];
};

export type ReviewItem = {
  id: string;
  text: string;
};

export type TourTab = 'obraz' | 'szkic' | 'kontrola';

export type TourStep = {
  index: number;
  sentence: string;
  tab: TourTab | null;
  highlight: string;
  waitForFileId: string | null;
  showLetter: boolean;
};

export type DemoCase = {
  documentName: string;
  task: string;
  client: Party;
  claimant: Party;
  invoiceNumber: string;
  contractDate: string;
  amounts: {
    invoice: AmountFact;
    contract: AmountFact;
    difference: AmountFact;
  };
  dates: CaseDate[];
  decisions: string[];
  gaps: CaseGap[];
  files: CaseFile[];
  sections: LetterSection[];
  blockers: ReviewItem[];
  warnings: ReviewItem[];
  steps: TourStep[];
};

const quote = (text: string, top: number, left: number, width: number, height: number): CaseQuote => ({
  text,
  box: { top, left, width, height },
});

export function quotePercent(value: number): string {
  return `${Math.round(value * 10000) / 100}%`;
}

export const demoCase: DemoCase = {
  documentName: 'Odpowiedź na wezwanie — Firma X',
  task: 'Odpowiedź na wezwanie do zapłaty',
  client: { name: 'Firma X sp. z o.o.', role: 'strona odpowiadająca' },
  claimant: { name: 'ABC sp. z o.o.', role: 'strona wzywająca' },
  invoiceNumber: '12/2026',
  contractDate: '01.03.2026',
  amounts: {
    invoice: { display: '12 000 zł', value: 12000, fileId: 'faktura' },
    contract: { display: '10 000 zł', value: 10000, fileId: 'umowa' },
    difference: { display: '2 000 zł', value: 2000 },
  },
  dates: [
    {
      id: 'wplata',
      text: '05.11.2026 — wpłata i pismo Firmy X o zamknięciu rozliczenia',
      fileIds: ['przelew', 'pismo'],
    },
    {
      id: 'wezwanie',
      text: '12.11.2026 — wezwanie ABC',
      fileIds: ['wezwanie'],
    },
    {
      id: 'termin',
      text: '30.11.2026 — termin odpowiedzi',
      fileIds: ['wezwanie'],
    },
  ],
  decisions: [
    'Czy różnica 2 000 zł dotyczy tej samej należności?',
    'Czy zapłata 05.11.2026 dotyczy faktury nr 12/2026?',
    'Czy zachowano termin odpowiedzi?',
  ],
  gaps: [
    {
      id: 'doreczenie',
      text: 'Brak potwierdzenia doręczenia wezwania',
      fileId: 'wezwanie',
    },
    {
      id: 'tytul-przelewu',
      text: 'Tytuł przelewu wskazuje umowę z 01.03.2026, a nie fakturę nr 12/2026',
      fileId: 'przelew',
    },
  ],
  files: [
    {
      id: 'umowa',
      name: 'umowa_ABC_skan_01032026.pdf',
      image: 'demo-wzory/umowa.jpg',
      quotes: [quote('wynagrodzenie 10 000 zł', 0.5, 0.46, 0.34, 0.035)],
      ocrText: demoOcrTexts.umowa,
    },
    {
      id: 'faktura',
      name: 'FV_12_2026_skan.jpg',
      image: 'demo-wzory/faktura.jpg',
      quotes: [quote('12 000 zł', 0.255, 0.52, 0.4, 0.022)],
      ocrText: demoOcrTexts.faktura,
    },
    {
      id: 'wezwanie',
      name: 'Wezwanie_zapłata_12.11.2026.pdf',
      image: 'demo-wzory/wezwanie.png',
      quotes: [
        quote('kwoty 12 000 zł', 0.245, 0.62, 0.28, 0.028),
        quote('Termin odpowiedzi 30.11.2026', 0.275, 0.58, 0.34, 0.028),
      ],
      ocrText: demoOcrTexts.wezwanie,
    },
    {
      id: 'pismo',
      name: 'odpowiedź_klienta_15-11-2026.pdf',
      image: 'demo-wzory/pismo-klienta.jpg',
      quotes: [
        quote('dokonano zapłaty', 0.3, 0.18, 0.24, 0.03),
        quote('uważamy sprawę rozliczenia za zamkniętą', 0.345, 0.14, 0.64, 0.032),
      ],
      ocrText: demoOcrTexts.pismo,
    },
    {
      id: 'przelew',
      name: 'potwierdzenie_wpłaty_05.11.2026.jpg',
      image: 'demo-wzory/przelew.jpg',
      quotes: [
        quote('kwota wpłaty 10 000 zł', 0.25, 0.18, 0.64, 0.06),
        quote('płatność za usługi wg umowy z 01.03.2026', 0.69, 0.4, 0.52, 0.045),
      ],
      ocrText: demoOcrTexts.przelew,
    },
    {
      id: 'wzor',
      name: 'szablon_odpowiedzi_v2.docx',
      image: 'demo-wzory/wzor-odpowiedzi.png',
      quotes: [
        quote('Stanowisko', 0.265, 0.12, 0.22, 0.028),
        quote('Uzasadnienie', 0.34, 0.12, 0.24, 0.028),
        quote('Żądanie', 0.5, 0.12, 0.18, 0.028),
      ],
      ocrText: demoOcrTexts.wzor,
    },
  ],
  sections: [
    {
      id: 'dotyczy',
      heading: 'DOTYCZY',
      paragraphs: [
        {
          text: 'wezwania do zapłaty z dnia 12.11.2026, faktury nr 12/2026, na kwotę 12 000 zł.',
        },
      ],
    },
    {
      id: 'stanowisko',
      heading: 'Stanowisko',
      paragraphs: [
        {
          text: 'W odpowiedzi na wezwanie do zapłaty z dnia 12.11.2026 Firma X sp. z o.o. nie uznaje roszczenia w części 2 000 zł. Należność wynikającą z umowy z dnia 01.03.2026, w kwocie 10 000 zł, uznaje za zapłaconą w dniu 05.11.2026.',
        },
      ],
    },
    {
      id: 'uzasadnienie',
      heading: 'Uzasadnienie',
      paragraphs: [
        {
          text: 'Z § 2 umowy z dnia 01.03.2026 wynagrodzenie za wykonanie przedmiotu umowy wynosi 10 000 zł. Zmiana wysokości wynagrodzenia wymaga formy pisemnej.',
          sourceFileId: 'umowa',
        },
        {
          text: 'Faktura nr 12/2026, wystawiona przez ABC sp. z o.o., wskazuje kwotę 12 000 zł. Różnica między fakturą a umową wynosi 2 000 zł. Podstawy tej różnicy nie przedstawiono.',
          sourceFileId: 'faktura',
        },
        {
          text: 'W dniu 05.11.2026 Firma X sp. z o.o. przelała na rzecz ABC sp. z o.o. kwotę 10 000 zł. Tytuł przelewu brzmi: „płatność za usługi wg umowy z 01.03.2026”. Numeru faktury 12/2026 na potwierdzeniu nie ma. Tego samego dnia Firma X sp. z o.o. poinformowała ABC sp. z o.o., że dokonano zapłaty należności wynikającej z umowy i że sprawę rozliczenia uważa za zamkniętą.',
          sourceFileId: 'przelew',
        },
        {
          text: 'W aktach sprawy nie ma potwierdzenia doręczenia wezwania z dnia 12.11.2026. Termin odpowiedzi wskazany w wezwaniu upływa 30.11.2026.',
          sourceFileId: 'wezwanie',
        },
      ],
    },
    {
      id: 'zadanie',
      heading: 'Żądanie',
      paragraphs: [
        {
          text: 'Firma X sp. z o.o. wnosi o wyjaśnienie różnicy 2 000 zł między fakturą nr 12/2026 a wynagrodzeniem z umowy z dnia 01.03.2026 oraz o wskazanie, czy wpłata z dnia 05.11.2026 została zaliczona na należność z tej umowy.',
          sourceFileId: 'faktura',
        },
      ],
    },
  ],
  blockers: [
    { id: 'kwoty', text: 'Sprzeczność kwot bez wyjaśnienia w czystym eksporcie' },
    { id: 'zaplata', text: 'Twierdzenie o zapłacie bez powiązania z fakturą' },
  ],
  warnings: [
    { id: 'doreczenie', text: 'Brak potwierdzenia doręczenia' },
    { id: 'termin', text: 'Termin 30.11' },
  ],
  steps: [
    {
      index: 1,
      sentence: 'To jest Twoja sprawa.',
      tab: null,
      highlight: 'case-header',
      waitForFileId: null,
      showLetter: true,
    },
    {
      index: 2,
      sentence: 'System już rozpoznał strony, przedmiot i termin.',
      tab: 'obraz',
      highlight: 'case-picture',
      waitForFileId: null,
      showLetter: true,
    },
    {
      index: 3,
      sentence: 'To jest różnica, której nie można pominąć.',
      tab: 'obraz',
      highlight: 'amounts',
      waitForFileId: null,
      showLetter: true,
    },
    {
      index: 4,
      sentence: 'To jest brak, który może zatrzymać sprawę.',
      tab: 'obraz',
      highlight: 'gap-doreczenie',
      waitForFileId: null,
      showLetter: true,
    },
    {
      index: 5,
      sentence: 'To jest gotowy szkic odpowiedzi.',
      tab: 'szkic',
      highlight: 'draft',
      waitForFileId: null,
      showLetter: true,
    },
    {
      index: 6,
      sentence: 'To jest źródło — kliknij i sprawdź.',
      tab: 'szkic',
      highlight: 'file-faktura',
      waitForFileId: 'faktura',
      showLetter: false,
    },
    {
      index: 7,
      sentence: 'To jest kontrola przed eksportem.',
      tab: 'kontrola',
      highlight: 'review',
      waitForFileId: null,
      showLetter: true,
    },
    {
      index: 8,
      sentence: 'To jest roboczy DOCX — gotowy do redakcji.',
      tab: 'kontrola',
      highlight: 'download',
      waitForFileId: null,
      showLetter: true,
    },
  ],
};

export function letterWordCount(matter: DemoCase, sections: LetterSection[] = matter.sections): number {
  const chunks = [
    matter.client.name,
    matter.client.role,
    matter.claimant.name,
    matter.claimant.role,
    ...sections.flatMap((section) => [section.heading, ...section.paragraphs.map((paragraph) => paragraph.text)]),
    matter.client.name,
  ];
  return chunks.join(' ').split(/\s+/).filter(Boolean).length;
}
