import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
) as { version: string };

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
});
