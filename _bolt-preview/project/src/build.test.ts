import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { demoCase } from './demo/case';

const distDir = path.join(process.cwd(), 'dist');
const wzoryDir = path.join(distDir, 'demo-wzory');

describe('build statyczny', () => {
  it('pakuje index.html i strony z demo-wzory', () => {
    expect(fs.existsSync(path.join(distDir, 'index.html'))).toBe(true);
    expect(fs.existsSync(wzoryDir)).toBe(true);

    for (const file of demoCase.files) {
      const name = file.image.replace(/^demo-wzory\//, '');
      expect(fs.existsSync(path.join(wzoryDir, name))).toBe(true);
    }
  });
});