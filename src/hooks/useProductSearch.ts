/**
 * PATRÓN DE DISEÑO: FACADE
 *
 * Expone una interfaz mínima para buscar productos y esconde tras ella toda la
 * maquinaria: Apollo, la consulta GraphQL, la forma de la respuesta, la
 * paginación y el manejo de errores.
 *
 * Los componentes solo reciben la lista, los indicadores de estado y una
 * función `loadMore`; no saben que detrás hay GraphQL. Si mañana se cambiara la
 * fuente de datos, la interfaz de este hook seguiría siendo la misma.
 */
import { useCallback, useRef, useState } from 'react';

import { useQuery } from '@apollo/client/react';

import { apiConfig } from '@/config/api.config';
import { SEARCH_PRODUCTS } from '@/graphql/queries';
import type { Product, SearchProductsData, UseProductSearch } from '@/types';

const SIN_RESULTADOS: Product[] = [];

export const useProductSearch = (keyword: string): UseProductSearch => {
  const term = keyword.trim();

  const [loadingMore, setLoadingMore] = useState(false);

  // Bandera fuera del estado: el scroll puede pedir más páginas varias veces
  // antes de que React vuelva a renderizar, y esto evita peticiones repetidas.
  const enCurso = useRef(false);

  const { data, loading, error, fetchMore } = useQuery<SearchProductsData>(
    SEARCH_PRODUCTS,
    {
      variables: { keyword: term, page: apiConfig.firstPage },
      // Sin criterio no hay nada que consultar: evita gastar cuota del servicio.
      skip: !term,
    },
  );

  const page = data?.searchProducts.page ?? 0;

  // El tope real es el menor entre lo que informa el servicio y nuestro límite
  // de seguridad, por si la respuesta trajera un `maxPage` desmedido.
  const ultimaPagina = Math.min(data?.searchProducts.maxPage ?? 0, apiConfig.maxPages);
  const hasMore = page > 0 && page < ultimaPagina;

  const loadMore = useCallback(() => {
    if (!hasMore || loading || enCurso.current) return;

    enCurso.current = true;
    setLoadingMore(true);

    // La caché concatena la página entrante con lo ya cargado y descarta los
    // productos repetidos (ver `typePolicies` en apolloClient.ts).
    void fetchMore({ variables: { keyword: term, page: page + 1 } }).finally(() => {
      enCurso.current = false;
      setLoadingMore(false);
    });
  }, [fetchMore, hasMore, loading, page, term]);

  const products = data?.searchProducts.items ?? SIN_RESULTADOS;

  return {
    products,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error: error?.message ?? null,
    /** La búsqueda terminó y el servicio no devolvió ningún producto. */
    isEmpty: Boolean(term) && !loading && !error && products.length === 0,
  };
};
