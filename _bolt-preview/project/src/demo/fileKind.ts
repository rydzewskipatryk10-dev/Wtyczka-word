import type { CaseFile } from './case';

/** Skan (zdjęcie, plik *_skan_* lub upload z OCR). */
export function isScanFile(file: CaseFile): boolean {
  if (/skan/i.test(file.name)) return true;
  if (file.image.startsWith('blob:')) return true;
  const asset = file.image.split('?')[0].toLowerCase();
  return /\.(jpe?g|webp)$/.test(asset);
}