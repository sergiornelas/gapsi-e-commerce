import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import { GRUPOS_DE_DEPENDENCIAS } from './config/chunks.config.ts';
import { obfuscatorPlugin } from './config/obfuscator.config.ts';
import { pwaConfig } from './config/pwa.config.ts';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
) as { version: string };

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(pwaConfig), obfuscatorPlugin()],
  resolve: {
    alias: {
      // Alias de raíz para evitar imports relativos frágiles ('../../..').
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    // Única fuente de verdad de la versión: el package.json.
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    rolldownOptions: {
      output: {
        advancedChunks: { groups: [...GRUPOS_DE_DEPENDENCIAS] },
      },
    },
  },
});
