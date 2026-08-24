/**
 * Separación del bundle en fragmentos.
 *
 * Las dependencias se apartan del código de la aplicación por dos motivos: un
 * cambio nuestro no invalida la caché del navegador de librerías que no se
 * movieron, y el navegador puede descargarlas en paralelo.
 *
 * Los nombres se exportan porque la ofuscación los necesita para saber qué
 * fragmentos son de terceros y dejarlos en paz.
 */

/** Fragmentos de dependencias, con el patrón que decide qué entra en cada uno. */
export const GRUPOS_DE_DEPENDENCIAS = [
  // GraphQL es la más pesada: al ejecutar el schema en el navegador viaja completa.
  { name: 'graphql', test: /node_modules\/(graphql|@graphql-tools)\// },
  { name: 'apollo', test: /node_modules\/@apollo\// },
  { name: 'mui', test: /node_modules\/(@mui|@emotion)\// },
  { name: 'react', test: /node_modules\/(react|react-dom|scheduler)\// },
] as const;

/** Nombres de los fragmentos que contienen únicamente código de terceros. */
export const NOMBRES_DE_DEPENDENCIAS: readonly string[] = GRUPOS_DE_DEPENDENCIAS.map(
  (grupo) => grupo.name,
);
