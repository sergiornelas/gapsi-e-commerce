/**
 * PATRÓN DE DISEÑO: FACADE
 *
 * Expone una interfaz mínima para buscar productos y esconde tras ella toda la
 * maquinaria: Apollo, la consulta GraphQL, la forma de la respuesta y el manejo
 * de errores.
 *
 * Los componentes solo reciben `products`, `loading` y `error`; no saben que
 * detrás hay GraphQL. Si mañana se cambiara la fuente de datos, la interfaz de
 * este hook seguiría siendo la misma.
 */
import { useQuery } from "@apollo/client/react";

import { SEARCH_PRODUCTS } from "@/graphql/queries";
import type { Product, SearchProductsData, UseProductSearch } from "@/types";

const SIN_RESULTADOS: Product[] = [];

export const useProductSearch = (keyword: string): UseProductSearch => {
  const term = keyword.trim();

  const { data, loading, error } = useQuery<SearchProductsData>(
    SEARCH_PRODUCTS,
    {
      variables: { keyword: term, page: 1 },
      // Sin criterio no hay nada que consultar: evita gastar cuota del servicio.
      skip: !term,
    },
  );

  const products = data?.searchProducts.items ?? SIN_RESULTADOS;

  return {
    products,
    loading,
    error: error?.message ?? null,
    isEmpty: Boolean(term) && !loading && !error && products.length === 0,
  };
};
