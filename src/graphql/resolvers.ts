/**
 * Resolvers del schema local.
 *
 * Son deliberadamente delgados: toda la lógica de acceso y normalización vive en
 * el repositorio y en el adapter. El resolver solo traduce los argumentos de la
 * consulta a una llamada del dominio.
 */
import { productRepository } from '@/data/productRepository';
import type { ProductPage } from '@/types';

interface SearchProductsArgs {
  keyword: string;
  page?: number;
}

export const resolvers = {
  Query: {
    searchProducts: (
      _parent: unknown,
      { keyword, page = 1 }: SearchProductsArgs,
    ): Promise<ProductPage> => productRepository.search(keyword, page),
  },
};
