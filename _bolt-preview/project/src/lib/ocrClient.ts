function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Nie udało się odczytać pliku'));
        return;
      }
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Nie udało się odczytać pliku'));
    reader.readAsDataURL(file);
  });
}

export type OcrResult = {
  text: string;
};

export async function runDocumentOcr(file: File): Promise<OcrResult> {
  const data = await readFileAsBase64(file);
  const response = await fetch('/api/ocr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mimeType: file.type,
      data,
      fileName: file.name,
    }),
  });

  const payload = (await response.json()) as { text?: string; error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? `OCR nie powiódł się (${response.status})`);
  }
  if (!payload.text) {
    throw new Error('Brak tekstu w odpowiedzi OCR');
  }
  return { text: payload.text };
}