import { describe, expect, it } from 'vitest';
import { readGeminiEnv } from './geminiOcr';

describe('readGeminiEnv', () => {
  it('czyta klucz, projekt i model z env', () => {
    expect(readGeminiEnv({
      GEMINI_API_KEY: 'test-key',
      GEMINI_PROJECT: 'projects/85105033656',
      GEMINI_MODEL: 'gemini-3.5-flash-lite',
    })).toEqual({
      apiKey: 'test-key',
      project: 'projects/85105033656',
      model: 'gemini-3.5-flash-lite',
    });
  });

  it('ustawia domyślny model gdy brak GEMINI_MODEL', () => {
    expect(readGeminiEnv({ GEMINI_API_KEY: 'x' }).model).toBe('gemini-3.5-flash-lite');
  });
});