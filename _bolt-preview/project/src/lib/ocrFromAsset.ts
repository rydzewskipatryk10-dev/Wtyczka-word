import { runDocumentOcr } from './ocrClient';

function mimeFromPath(assetPath: string): string {
  const lower = assetPath.split('?')[0].toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

function fileNameFromPath(assetPath: string): string {
  const parts = assetPath.split('/');
  return parts[parts.length - 1] ?? 'document';
}

export async function recognizeCaseFile(file: { name: string; image: string }): Promise<string> {
  if (file.image.startsWith('blob:') || file.image.startsWith('data:')) {
    const response = await fetch(file.image);
    if (!response.ok) {
      throw new Error(`Nie udało się odczytać ${file.name}`);
    }
    const blob = await response.blob();
    const uploaded = new File([blob], file.name, { type: blob.type || 'application/octet-stream' });
    const { text } = await runDocumentOcr(uploaded);
    return text;
  }
  return runDocumentOcrFromAsset(file.image);
}

/** Pobiera asset z Vite (np. demo-wzory/…) i woła /api/ocr. */
export async function runDocumentOcrFromAsset(assetPath: string): Promise<string> {
  const url = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Nie udało się pobrać ${url} (${response.status})`);
  }
  const blob = await response.blob();
  const mime = blob.type || mimeFromPath(assetPath);
  const file = new File([blob], fileNameFromPath(assetPath), { type: mime });
  const { text } = await runDocumentOcr(file);
  return text;
}