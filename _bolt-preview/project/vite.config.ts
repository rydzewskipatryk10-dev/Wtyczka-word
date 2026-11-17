import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig, type Plugin } from 'vitest/config';
import { createOcrHandler } from './src/server/ocrHttp';

const demoWzoryDir = fileURLToPath(new URL('../../demo-wzory/', import.meta.url));

const pageTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
};

function sendDemoPage(req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) {
  const pathname = req.url?.split('?')[0] ?? '';
  if (!pathname.startsWith('/demo-wzory/')) {
    next();
    return;
  }

  let relative = pathname.slice('/demo-wzory/'.length);
  try {
    relative = decodeURIComponent(relative);
  } catch {
    next();
    return;
  }

  const filePath = path.resolve(demoWzoryDir, relative);
  const fromRoot = path.relative(demoWzoryDir, filePath);
  if (fromRoot.startsWith('..') || path.isAbsolute(fromRoot)) {
    next();
    return;
  }
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    next();
    return;
  }

  res.setHeader('Content-Type', pageTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream');
  fs.createReadStream(filePath).pipe(res);
}

function geminiOcrPlugin(env: Record<string, string>): Plugin {
  const handleOcr = createOcrHandler(env);
  return {
    name: 'gemini-ocr-api',
    configureServer(server) {
      server.middlewares.use(handleOcr);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handleOcr);
    },
  };
}

function demoWzoryPlugin(): Plugin {
  let outDir = '';

  return {
    name: 'demo-wzory',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir, 'demo-wzory');
    },
    configureServer(server) {
      server.middlewares.use(sendDemoPage);
    },
    configurePreviewServer(server) {
      server.middlewares.use(sendDemoPage);
    },
    closeBundle() {
      fs.cpSync(demoWzoryDir, outDir, { recursive: true });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), demoWzoryPlugin(), geminiOcrPlugin(env)],
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      passWithNoTests: true,
      css: true,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  };
});
