import type { IncomingMessage, ServerResponse } from 'node:http';
import { geminiOcr, readGeminiEnv } from './geminiOcr';

function readJsonBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

export function createOcrHandler(env: Record<string, string>) {
  const gemini = readGeminiEnv(env);

  return async function handleOcr(req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) {
    const pathname = req.url?.split('?')[0] ?? '';
    if (pathname !== '/api/ocr') {
      next();
      return;
    }
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Wymagana metoda POST' }));
      return;
    }

    try {
      const raw = await readJsonBody(req);
      const body = JSON.parse(raw) as { mimeType?: string; data?: string; fileName?: string };
      if (!body.data) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Brak danych pliku (data)' }));
        return;
      }

      const text = await geminiOcr(gemini, {
        mimeType: body.mimeType ?? '',
        data: body.data,
        fileName: body.fileName,
      });

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ text, project: gemini.project, model: gemini.model }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nieznany błąd OCR';
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: message }));
    }
  };
}