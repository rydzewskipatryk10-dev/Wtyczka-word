const DEFAULT_MODEL = 'gemini-3.5-flash-lite';

const OCR_PROMPT = `Wykonaj pełny OCR całej strony. Przepisz każdy widoczny fragment: tytuł, strony, daty, kwoty, numery, tabelę, stopkę i podpisy. Nic nie skracaj i nic nie streszczaj.
Zwróć sam tekst po polsku, z podziałem na linie jak na stronie:
- tytuł dokumentu w osobnej linii
- nagłówki § i nazwy sekcji w osobnych liniach
- każdy punkt numerowany w osobnej linii
- tabelę faktury jako linie nagłówków (Lp., Nazwa usługi, Wartość), potem każdy wiersz w trzech kolejnych liniach: numer, opis, kwota
- etykietę i wartość przelewu w jednej linii, np. „Data operacji 05.11.2026”
- podpisy na końcu, każdy w osobnej linii
Bez komentarzy, bez markdown i bez HTML.`;

type GeminiEnv = {
  apiKey: string;
  project: string;
  model: string;
};

type OcrPayload = {
  mimeType: string;
  data: string;
  fileName?: string;
};

export function readGeminiEnv(env: Record<string, string>): GeminiEnv {
  const apiKey = env.GEMINI_API_KEY?.trim() ?? '';
  const project = env.GEMINI_PROJECT?.trim() ?? '';
  const model = env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  return { apiKey, project, model };
}

export async function geminiOcr(
  config: GeminiEnv,
  { mimeType, data, fileName }: OcrPayload,
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('Brak GEMINI_API_KEY — ustaw klucz w pliku .env.local');
  }

  const safeMime = mimeType || guessMime(fileName);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent`;

  const body = {
    contents: [
      {
        parts: [
          { text: OCR_PROMPT },
          {
            inline_data: {
              mime_type: safeMime,
              data,
            },
          },
        ],
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': config.apiKey,
    },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as {
    error?: { message?: string };
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  if (!response.ok) {
    const message = json.error?.message ?? `Gemini OCR HTTP ${response.status}`;
    throw new Error(message);
  }

  const text = json.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();
  if (!text) {
    throw new Error('Gemini nie zwróciło tekstu OCR');
  }

  return text;
}

function guessMime(fileName?: string): string {
  const lower = fileName?.toLowerCase() ?? '';
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}