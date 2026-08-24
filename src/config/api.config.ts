/**
 * Configuración del servicio REST de búsqueda de productos.
 *
 * Se aísla del resto de la aplicación para que host, credenciales y parámetros
 * por defecto puedan cambiar sin tocar la capa de datos. Las credenciales se leen
 * de variables de entorno (`.env`), nunca se escriben en el código fuente.
 */

/**
 * Valida una variable de entorno obligatoria y falla temprano si falta.
 *
 * El valor se recibe como argumento en lugar de leerse con `import.meta.env[name]`
 * porque Vite sustituye estas variables de forma estática en tiempo de build: el
 * acceso dinámico por índice no se reemplaza y quedaría indefinido en producción.
 */
const requireEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copia .env.example como .env y completa sus valores.`,
    );
  }

  return value;
};

export const apiConfig = {
  /** Host de RapidAPI que expone el servicio. */
  host: requireEnv('VITE_RAPIDAPI_HOST', import.meta.env.VITE_RAPIDAPI_HOST),
  /** Llave de suscripción a RapidAPI. */
  key: requireEnv('VITE_RAPIDAPI_KEY', import.meta.env.VITE_RAPIDAPI_KEY),
  /** Endpoint de búsqueda por palabra clave. */
  searchPath: '/wlm/walmart-search-by-keyword',
  /** Criterio de ordenamiento soportado por el servicio. */
  sortBy: 'best_match',
  /** Primera página del paginado (el servicio es 1-based). */
  firstPage: 1,
  /**
   * Tope de páginas a solicitar. El servicio reporta hasta ~13 páginas por
   * búsqueda; el límite evita peticiones infinitas si la respuesta no informa
   * el total de páginas.
   */
  maxPages: 15,
} as const;

/** Construye la URL de búsqueda para una palabra clave y una página dadas. */
export const buildSearchUrl = (keyword: string, page: number): string => {
  const url = new URL(apiConfig.searchPath, `https://${apiConfig.host}`);

  url.searchParams.set('keyword', keyword);
  url.searchParams.set('page', String(page));
  url.searchParams.set('sortBy', apiConfig.sortBy);

  return url.toString();
};

/** Headers exigidos por RapidAPI para autenticar la petición. */
export const searchHeaders: HeadersInit = {
  'x-rapidapi-key': apiConfig.key,
  'x-rapidapi-host': apiConfig.host,
};
