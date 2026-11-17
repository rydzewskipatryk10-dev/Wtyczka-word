export type OcrField = {
  label: string;
  value: string;
};

export type OcrTableRow = {
  cells: string[];
};

export type OcrSection = {
  title: string;
  fields?: OcrField[];
  paragraphs?: string[];
  listItems?: string[];
  tableRows?: OcrTableRow[];
};

export type ParsedOcrDocument = {
  title: string;
  subtitle?: string;
  intro?: string[];
  sections: OcrSection[];
};

const LABEL_WORDS = /^(Sprzedawca|Nabywca|Wystawił|Odebrał|Lp\.|Nazwa usługi|Wartość|Za Zamawiającego|Za Wykonawcę)$/i;

const INLINE_FIELD =
  /^(Data operacji|kwota wpłaty|Tytuł przelewu|Rodzaj przelewu|Status|Waluta|Zleceniodawca|Odbiorca|Razem do zapłaty|Forma płatności|Dotyczy)\s+(.+)$/i;

function isHeadingLine(line: string): boolean {
  const trimmed = line.trim();
  if (/^§\s*\d/.test(trimmed)) return true;
  if (/^(Stanowisko|Uzasadnienie|Żądanie|Załączniki)$/i.test(trimmed)) return true;
  const letters = trimmed.replace(/[^A-Za-zÀ-žĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, '');
  return letters.length >= 4 && letters === letters.toUpperCase() && trimmed.length < 80;
}

function isLabelLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 48) return false;
  if (LABEL_WORDS.test(trimmed)) return true;
  if (/^Za\s/.test(trimmed)) return true;
  if (trimmed.endsWith(':')) return true;
  if (/^\d+\.$/.test(trimmed)) return false;
  return /^[A-ZĄĆĘŁŃÓŚŹŻ]/.test(trimmed) && !trimmed.includes('.') && trimmed.split(/\s+/).length <= 4;
}

function parseInlineField(line: string): OcrField | null {
  const match = line.trim().match(INLINE_FIELD);
  if (!match) return null;
  const label = match[1].replace(/:$/, '');
  return { label, value: match[2].trim() };
}

function parseBlock(block: string): OcrSection | null {
  const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return null;

  const heading = isHeadingLine(lines[0]);
  if (heading) {
    const title = lines[0].replace(/:$/, '');
    const rest = lines.slice(1);
    const listItems = rest.filter((line) => /^\d+\.\s/.test(line));
    const paragraphs = rest.filter((line) => !/^\d+\.\s/.test(line));
    return {
      title,
      listItems: listItems.length ? listItems : undefined,
      paragraphs: paragraphs.length ? paragraphs : undefined,
    };
  }

  if (lines.some((line) => /^Lp\.$/i.test(line))) {
    const dataLines = lines.filter((line) => !/^(Lp\.|Nazwa usługi|Wartość)$/i.test(line));
    const tableRows: OcrTableRow[] = [];
    for (let index = 0; index < dataLines.length; ) {
      const no = dataLines[index];
      const name = dataLines[index + 1];
      const value = dataLines[index + 2];
      if (no && name && value && /^\d+$/.test(no)) {
        tableRows.push({ cells: [no, name, value] });
        index += 3;
      } else {
        index += 1;
      }
    }
    return tableRows.length
      ? { title: 'Pozycje', tableRows }
      : { title: 'Treść', paragraphs: lines };
  }

  const fields: OcrField[] = [];
  const paragraphs: string[] = [];
  let index = 0;
  while (index < lines.length) {
    const inline = parseInlineField(lines[index]);
    if (inline) {
      fields.push(inline);
      index += 1;
      continue;
    }
    if (isLabelLine(lines[index]) && lines[index + 1] && !isLabelLine(lines[index + 1])) {
      fields.push({
        label: lines[index].replace(/:$/, ''),
        value: lines[index + 1],
      });
      index += 2;
      continue;
    }
    paragraphs.push(lines[index]);
    index += 1;
  }

  if (fields.length && !paragraphs.length) {
    return { title: 'Szczegóły', fields };
  }
  if (fields.length && paragraphs.length) {
    return { title: 'Treść', fields, paragraphs };
  }
  return { title: 'Treść', paragraphs: lines };
}

function findDocumentTitle(lines: string[]): string {
  const preferred = lines.find((line) => /^(UMOWA|FAKTURA|WEZWANIE|ODPOWIEDŹ|POTWIERDZENIE)/i.test(line.trim()));
  if (preferred) return preferred.trim();
  const caps = lines.find((line) => {
    const letters = line.replace(/[^A-Za-zÀ-žĄĆĘŁŃÓŚŹŻąćęłńóśźż]/g, '');
    return letters.length >= 10 && letters === letters.toUpperCase();
  });
  return caps?.trim() ?? lines[0]?.trim() ?? 'Dokument';
}

export function parseOcrDocument(text: string): ParsedOcrDocument {
  const blocks = text.split(/\n\n+/).map((block) => block.trim()).filter(Boolean);
  const allLines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  const title = findDocumentTitle(allLines);
  const firstBlockLines = blocks[0]?.split('\n').map((line) => line.trim()).filter(Boolean) ?? [];
  const introFromFirst = firstBlockLines.filter((line) => line !== title && !isHeadingLine(line));

  const sections: OcrSection[] = [];
  for (let blockIndex = 1; blockIndex < blocks.length; blockIndex += 1) {
    const section = parseBlock(blocks[blockIndex]);
    if (section) sections.push(section);
  }

  if (!sections.length && firstBlockLines.length) {
    const fallback = parseBlock(blocks[0]);
    if (fallback) {
      fallback.title = title;
      fallback.paragraphs = (fallback.paragraphs ?? []).filter((line) => line !== title);
      sections.push(fallback);
    }
  }

  return {
    title,
    subtitle: introFromFirst[0],
    intro: introFromFirst.length > 1 ? introFromFirst.slice(1) : introFromFirst.length === 1 ? undefined : undefined,
    sections,
  };
}