/**
 * Configuración de la Progressive Web App.
 *
 * Se mantiene fuera de `vite.config.ts` porque es un bloque extenso con su
 * propio criterio (qué se precachea, qué se cachea en tiempo de ejecución y con
 * qué política), y mezclarlo con la configuración del bundler haría ilegibles
 * las dos cosas.
 */
import type { VitePWAOptions } from 'vite-plugin-pwa';

/** Dominio desde el que Walmart sirve las imágenes de producto. */
const IMAGENES_DE_PRODUCTO = /^https:\/\/i5\.walmartimages\.com\/.*/i;

export const pwaConfig: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',

  // Los assets de la carpeta public que no entran en el precache automático.
  includeAssets: ['icon.webp', 'logo.webp'],

  manifest: {
    name: 'e-Commerce Gapsi',
    short_name: 'Gapsi',
    description: 'Buscador de productos de Gapsi con carrito de compras por arrastre.',
    lang: 'es',
    start_url: '/',
    display: 'standalone',
    background_color: '#c7c7c7',
    theme_color: '#0050b0',
    icons: [
      { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
      // `maskable` permite que Android recorte el icono a la forma del sistema
      // sin dejar bordes vacíos.
      { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },

  workbox: {
    // El shell de la aplicación se precachea completo: con él, la app abre sin
    // conexión aunque no pueda consultar productos.
    globPatterns: ['**/*.{js,css,html,webp,png,svg,woff2}'],

    runtimeCaching: [
      {
        // Las imágenes de producto son inmutables y pesadas: se sirven desde
        // caché en cuanto se han visto una vez.
        urlPattern: IMAGENES_DE_PRODUCTO,
        handler: 'CacheFirst',
        options: {
          cacheName: 'imagenes-de-producto',
          expiration: {
            maxEntries: 300,
            maxAgeSeconds: 60 * 60 * 24 * 14, // dos semanas
          },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
      {
        // La tipografía y los iconos del CDN cambian con muy poca frecuencia.
        urlPattern: /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)\/.*/i,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'recursos-de-cdn',
          expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 30 },
          cacheableResponse: { statuses: [0, 200] },
        },
      },
    ],
  },

  devOptions: {
    // Permite comprobar el service worker con `npm run dev`, sin tener que
    // generar un build cada vez.
    enabled: true,
    type: 'module',
  },
};
