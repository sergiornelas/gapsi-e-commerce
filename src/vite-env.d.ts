/// <reference types="vite/client" />

/** Versión de la aplicación, inyectada en tiempo de build desde package.json. */
declare const __APP_VERSION__: string;

/** Variables de entorno de la aplicación (ver `.env.example`). */
interface ImportMetaEnv {
  readonly VITE_RAPIDAPI_KEY: string;
  readonly VITE_RAPIDAPI_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
