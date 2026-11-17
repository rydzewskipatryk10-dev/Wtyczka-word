export type ContractSection = {
  title: string;
  paragraphs: string[];
};

export type SignColumn = {
  caption: string;
  name: string;
};

export type PartyCell = {
  label: string;
  name: string;
};

export type TransferRow = {
  label: string;
  value: string;
};

export type TemplateBlock = {
  heading: string;
  lines: string[];
};

export type PlainBlock =
  | { role: 'title' | 'heading'; text: string }
  | { role: 'paragraph'; text: string }
  | { role: 'table'; columns: string[]; rows: string[][] };

export type ScanLayout =
  | {
      kind: 'contract';
      title: string;
      intro: string;
      parties: string[];
      join: string;
      sections: ContractSection[];
      signs: SignColumn[];
    }
  | {
      kind: 'invoice';
      title: string;
      subtitle: string;
      parties: PartyCell[];
      columns: string[];
      rows: string[][];
      total: string;
      payment: string;
      signs: string[];
    }
  | {
      kind: 'letter';
      from: string;
      date: string;
      to: string;
      title: string;
      subject: string;
      paragraphs: string[];
      sign: string;
    }
  | {
      kind: 'transfer';
      brand: string;
      subtitle: string;
      status: string;
      amount: string;
      rows: TransferRow[];
      footer: string;
    }
  | {
      kind: 'template';
      place: string;
      from: string;
      to: string;
      title: string;
      subject: string;
      blocks: TemplateBlock[];
      sign: string;
    }
  | {
      kind: 'plain';
      blocks: PlainBlock[];
    };

const DATE_LINE = /^\d{2}\.\d{2}\.\d{4}$/m;

const TRANSFER_LABELS = [
  'Data operacji',
  'Status',
  'Waluta',
  'Zleceniodawca',
  'Odbiorca',
  'Tytuł przelewu',
  'Rodzaj przelewu',
];

function linesOf(text: string): string[] {
  return text.split('\n').map((line) => line.trim()).filter((line) => line.length > 0);
}

function isPlainHeading(line: string): boolean {
  if (/^§\s*\d/.test(line)) return true;
  const letters = line.replace(/[^A-Za-zÀ-žĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, '');
  return letters.length >= 4 && letters === letters.toUpperCase() && line.length < 90;
}

function layoutContract(text: string): ScanLayout {
  const lines = linesOf(text);
  const title = lines[0] ?? 'Umowa';
  const intro = lines[1] ?? '';
  const bodyStart = lines.findIndex((line) => /^§/.test(line));
  const signStart = lines.findIndex((line) => /^Za\s/i.test(line));
  const partyLines = lines.slice(2, bodyStart === -1 ? lines.length : bodyStart);
  const join = partyLines.find((line) => /^a$/i.test(line)) ?? 'a';
  const parties = partyLines.filter((line) => !/^a$/i.test(line));
  const sectionEnd = signStart === -1 ? lines.length : signStart;
  const sectionLines = lines.slice(bodyStart === -1 ? 2 : bodyStart, sectionEnd);
  const sections: ContractSection[] = [];
  for (const line of sectionLines) {
    if (/^§/.test(line)) {
      sections.push({ title: line, paragraphs: [] });
    } else if (sections.length) {
      sections[sections.length - 1].paragraphs.push(line);
    }
  }
  const signs: SignColumn[] = [];
  const tail = signStart === -1 ? [] : lines.slice(signStart);
  for (let index = 0; index < tail.length; index += 1) {
    if (/^Za\s/i.test(tail[index])) {
      signs.push({
        caption: tail[index].replace(/:$/, ''),
        name: tail[index + 1] ?? '',
      });
      index += 1;
    }
  }
  return { kind: 'contract', title, intro, parties, join, sections, signs };
}

function layoutInvoice(text: string): ScanLayout {
  const lines = linesOf(text);
  const title = lines[0] ?? 'Faktura';
  const subtitle = /^Dotyczy\b/i.test(lines[1] ?? '') ? lines[1] : '';
  const parties: PartyCell[] = [];
  let index = subtitle ? 2 : 1;
  while (index < lines.length && /^(Sprzedawca|Nabywca)$/i.test(lines[index])) {
    parties.push({ label: lines[index], name: lines[index + 1] ?? '' });
    index += 2;
  }
  const columns: string[] = [];
  while (index < lines.length && /^(Lp\.|Nazwa usługi|Wartość)$/i.test(lines[index])) {
    columns.push(lines[index]);
    index += 1;
  }
  const rows: string[][] = [];
  while (index + 2 < lines.length && /^\d+$/.test(lines[index])) {
    rows.push([lines[index], lines[index + 1], lines[index + 2]]);
    index += 3;
  }
  let total = '';
  let payment = '';
  const signs: string[] = [];
  for (; index < lines.length; index += 1) {
    if (/^Razem\b/i.test(lines[index])) total = lines[index];
    else if (/^Forma płatności/i.test(lines[index])) payment = lines[index];
    else if (/^(Wystawił|Odebrał)$/i.test(lines[index])) signs.push(lines[index]);
  }
  return { kind: 'invoice', title, subtitle, parties, columns, rows, total, payment, signs };
}

function layoutLetter(text: string): ScanLayout {
  const lines = linesOf(text);
  const from = lines[0] ?? '';
  const dateIndex = lines.findIndex((line) => DATE_LINE.test(line));
  const date = dateIndex >= 0 ? lines[dateIndex] : '';
  const toIndex = dateIndex >= 0 ? dateIndex + 1 : 1;
  const to = lines[toIndex] ?? '';
  const titleIndex = lines.findIndex((line) => isPlainHeading(line) && line !== from);
  const title = titleIndex > toIndex ? lines[titleIndex] : '';
  const subjectIndex = lines.findIndex((line) => /^Dotyczy:/i.test(line));
  const subject = subjectIndex >= 0 ? lines[subjectIndex] : '';
  const sign = lines.length > 1 && lines[lines.length - 1] === from ? from : '';
  const skip = new Set<number>([0]);
  if (dateIndex >= 0) skip.add(dateIndex);
  if (to) skip.add(toIndex);
  if (title) skip.add(titleIndex);
  if (subject) skip.add(subjectIndex);
  if (sign) skip.add(lines.length - 1);
  const paragraphs = lines.filter((_, lineIndex) => !skip.has(lineIndex));
  return { kind: 'letter', from, date, to, title, subject, paragraphs, sign };
}

function layoutTransfer(text: string): ScanLayout {
  const lines = linesOf(text);
  const rows: TransferRow[] = [];
  let footer = '';
  for (const line of lines) {
    const label = TRANSFER_LABELS.find((item) => line.toLowerCase().startsWith(item.toLowerCase()));
    if (label) {
      rows.push({ label, value: line.slice(label.length).trim() });
    } else if (/wygenerowany automatycznie/i.test(line)) {
      footer = line;
    }
  }
  return {
    kind: 'transfer',
    brand: lines[0] ?? '',
    subtitle: lines[1] ?? '',
    status: lines.find((line) => /zrealizowany/i.test(line) && !/^Status\b/i.test(line)) ?? '',
    amount: lines.find((line) => /kwota wpłaty/i.test(line)) ?? '',
    rows,
    footer,
  };
}

function isSignRule(line: string): boolean {
  const compact = line.replace(/\s/g, '');
  return compact.length >= 4 && /^[_—–−\-]+$/.test(compact);
}

function isSignCaption(line: string): boolean {
  return /^\[?\s*podpis\b/i.test(line);
}

function layoutTemplate(text: string): ScanLayout {
  const lines = linesOf(text);
  const place = lines[0] ?? '';
  const from = lines.find((line) => /^Od:/i.test(line)) ?? '';
  const to = lines.find((line) => /^Do:/i.test(line)) ?? '';
  const title = lines.find((line) => /odpowiedź na wezwanie/i.test(line)) ?? '';
  const subject = lines.find((line) => /^Dotyczy:/i.test(line)) ?? '';
  const blocks: TemplateBlock[] = [];
  let sign = '';
  let signing = false;
  for (const line of lines) {
    if (line === place || line === from || line === to || line === title || line === subject) continue;
    if (isSignRule(line) || isSignCaption(line)) signing = true;
    if (signing) {
      if (!isSignRule(line)) sign = line;
      continue;
    }
    if (/^(Stanowisko|Uzasadnienie|Żądanie)$/.test(line)) {
      blocks.push({ heading: line, lines: [] });
      continue;
    }
    if (/^Załączniki:/i.test(line)) {
      blocks.push({ heading: '', lines: [line] });
      continue;
    }
    if (!blocks.length) blocks.push({ heading: '', lines: [] });
    blocks[blocks.length - 1].lines.push(line);
  }
  return { kind: 'template', place, from, to, title, subject, blocks, sign };
}

function layoutPlain(text: string): ScanLayout {
  const chunks = text.split(/\n\n+/).map((chunk) => chunk.trim()).filter(Boolean);
  const blocks: PlainBlock[] = chunks.map((chunk) => {
    const lines = chunk.split('\n').map((line) => line.trim()).filter(Boolean);
    if (lines.length === 1 && isPlainHeading(lines[0])) {
      return { role: 'heading', text: lines[0] };
    }
    const columns = lines.filter((line) => /^(Lp\.|Nazwa usługi|Wartość)$/i.test(line));
    if (columns.length >= 2) {
      const data = lines.filter((line) => !columns.includes(line));
      const rows: string[][] = [];
      for (let index = 0; index + 2 < data.length; index += 3) {
        if (/^\d+$/.test(data[index])) rows.push([data[index], data[index + 1], data[index + 2]]);
      }
      if (rows.length) return { role: 'table', columns, rows };
    }
    return { role: 'paragraph', text: lines.join('\n') };
  });
  if (blocks[0]?.role === 'heading') blocks[0] = { role: 'title', text: blocks[0].text };
  return { kind: 'plain', blocks };
}

export function layoutScan(text: string): ScanLayout {
  const raw = text.trim();
  if (/bankowość elektroniczna/i.test(raw)) return layoutTransfer(raw);
  if (/^faktura\b/im.test(raw)) return layoutInvoice(raw);
  if (/^umowa\b/im.test(raw)) return layoutContract(raw);
  if (/odpowiedź na wezwanie/i.test(raw)) return layoutTemplate(raw);
  if (DATE_LINE.test(raw) || /wezwanie do zapłaty/i.test(raw)) return layoutLetter(raw);
  return layoutPlain(raw);
}
