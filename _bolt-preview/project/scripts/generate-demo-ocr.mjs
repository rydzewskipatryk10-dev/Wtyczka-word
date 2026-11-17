/**
 * Jednorazowo generuje src/demo/demoOcrTexts.ts z Gemini OCR dla plików w demo-wzory/.
 * Uruchom: node scripts/generate-demo-ocr.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const wzoryRoot = path.resolve(root, '../../demo-wzory');

function loadEnvLocal() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('Brak .env.local — ustaw GEMINI_API_KEY');
  }
  const env = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
  }
  return env;
}

const OCR_PROMPT = `Wykonaj pełny OCR całej strony. Przepisz każdy widoczny fragment: tytuł, strony, daty, kwoty, numery, tabelę, stopkę i podpisy. Nic nie skracaj i nic nie streszczaj.
Zwróć sam tekst po polsku, z podziałem na linie jak na stronie:
- tytuł dokumentu w osobnej linii
- nagłówki § i nazwy sekcji w osobnych liniach
- każdy punkt numerowany w osobnej linii
- tabelę faktury jako linie nagłówków (Lp., Nazwa usługi, Wartość), potem każdy wiersz w trzech kolejnych liniach: numer, opis, kwota
- etykietę i wartość przelewu w jednej linii, np. „Data operacji 05.11.2026”
- podpisy na końcu, każdy w osobnej linii
Bez komentarzy, bez markdown i bez HTML.`;

const DEMO_FILES = [
  { id: 'umowa', file: 'umowa.jpg', mime: 'image/jpeg' },
  { id: 'faktura', file: 'faktura.jpg', mime: 'image/jpeg' },
  { id: 'wezwanie', file: 'wezwanie.png', mime: 'image/png' },
  { id: 'pismo', file: 'pismo-klienta.jpg', mime: 'image/jpeg' },
  { id: 'przelew', file: 'przelew.jpg', mime: 'image/jpeg' },
  { id: 'wzor', file: 'wzor-odpowiedzi.png', mime: 'image/png' },
];

async function ocrImage(apiKey, model, filePath, mime) {
  const data = fs.readFileSync(filePath).toString('base64');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const body = {
    contents: [
      {
        parts: [
          { text: OCR_PROMPT },
          { inline_data: { mime_type: mime, data } },
        ],
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error?.message ?? `HTTP ${response.status}`);
  }
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('').trim();
  if (!text) throw new Error('Brak tekstu OCR');
  return text;
}

function escapeForTs(text) {
  return text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

async function main() {
  const env = loadEnvLocal();
  const apiKey = env.GEMINI_API_KEY;
  const model = env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  if (!apiKey) throw new Error('GEMINI_API_KEY jest pusty');

  const texts = {};
  for (const item of DEMO_FILES) {
    const filePath = path.join(wzoryRoot, item.file);
    process.stdout.write(`OCR ${item.id}… `);
    texts[item.id] = await ocrImage(apiKey, model, filePath, item.mime);
    console.log(`OK (${texts[item.id].length} znaków)`);
  }

  const outPath = path.join(root, 'src/demo/demoOcrTexts.ts');
  const body = DEMO_FILES.map(
    (item) => `  ${item.id}: \`${escapeForTs(texts[item.id])}\`,`,
  ).join('\n');

  fs.writeFileSync(
    outPath,
    `/** Wygenerowane przez scripts/generate-demo-ocr.mjs — nie edytuj ręcznie. */\nexport const demoOcrTexts: Record<string, string> = {\n${body}\n};\n`,
    'utf8',
  );
  console.log(`Zapisano ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});