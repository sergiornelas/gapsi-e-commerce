/**
 * PATRÓN DE DISEÑO: SINGLETON
 *
 * Una única instancia de Apollo Client para toda la aplicación. La caché
 * normalizada es estado compartido: si existiera más de un cliente, cada uno
 * tendría su propia copia de los productos y la paginación se duplicaría.
 *
 * El cliente se conecta al schema local mediante `SchemaLink` (ver
 * `src/graphql/schema.ts`). Cambiar a un backend real sería sustituir ese enlace
 * por un `HttpLink`, sin tocar componentes ni consultas.
 */
import { ApolloClient, InMemoryCache } from '@apollo/client';
import type { Reference } from '@apollo/client/cache';
import { SchemaLink } from '@apollo/client/link/schema';

import { schema } from '@/graphql/schema';
import type { ProductPage } from '@/types';

/**
 * Forma en la que la caché guarda una página: los productos no se almacenan como
 * objetos completos sino como referencias normalizadas (`Product:<id>`), que es
 * lo que la función `merge` recibe y debe devolver.
 */
type CachedPage = Omit<ProductPage, 'items'> & {
  items: readonly Reference[];
};

export const apolloClient = new ApolloClient({
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchProducts: {
            // Cada criterio de búsqueda tiene su propia entrada en la caché;
            // `page` se excluye a propósito para que todas las páginas de un
            // mismo criterio se acumulen en una sola lista.
            keyArgs: ['keyword'],

            /**
             * Concatena la página entrante con lo ya cargado.
             *
             * La deduplicación es indispensable: se verificó contra la API que
             * páginas consecutivas repiten productos (entre la 1 y la 2 se
             * repitieron 3), y React exige claves únicas en las listas.
             */
            merge(
              existing: CachedPage | undefined,
              incoming: CachedPage,
              { readField },
            ): CachedPage {
              // Una búsqueda nueva (o un reinicio) empieza de cero.
              if (!existing || incoming.page <= 1) return incoming;

              const seen = new Set(
                existing.items.map((item) => readField<string>('id', item)),
              );

              const nuevos = incoming.items.filter(
                (item) => !seen.has(readField<string>('id', item)),
              );

              return { ...incoming, items: [...existing.items, ...nuevos] };
            },
          },
        },
      },
    },
  }),
});
