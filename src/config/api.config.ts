/**
 * Configuración del servicio REST de búsqueda de productos.
 *
 * Se aísla del resto de la aplicación para que host, credenciales y parámetros
 * por defecto puedan cambiar sin tocar la capa de datos. Las credenciales se leen
 * de variables de entorno (`.env`), nunca se escriben en el código fuente.
 */

/** Lee una variable de entorno obligatoria y falla temprano si no está definida. */
const readEnv = (name: string): string => {
  const value = import.meta.env[name] as string | undefined;

  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Copia .env.example como .env y completa sus valores.`,
    );
  }

  return value;
};

export const apiConfig = {
  /** Host de RapidAPI que expone el servicio. */
  host: readEnv('VITE_RAPIDAPI_HOST'),
  /** Llave de suscripción a RapidAPI. */
  key: readEnv('VITE_RAPIDAPI_KEY'),
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
