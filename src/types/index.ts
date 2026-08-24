/**
 * Tipos compartidos de la aplicación.
 *
 * Se centralizan aquí para que los contratos entre capas (layout, dominio y
 * datos) sean visibles en un solo lugar y no queden dispersos entre componentes.
 */
import type { ReactNode } from "react";

/* Layout */
export interface HeaderProps {
  /** Acción del botón superior derecho. Reinicia la aplicación. */
  onReset?: () => void;
}

export interface AppLayoutProps {
  children?: ReactNode;
  onReset?: () => void;
}

/* Dominio */

/**
 * Producto tal como lo consume la interfaz: plano, mínimo y ya normalizado.
 * Es el resultado de pasar la respuesta cruda del servicio por el adapter.
 */
export interface Product {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  image: string;
  description: string;
}

/** Una página de resultados de búsqueda. */
export interface ProductPage {
  keyword: string;
  page: number;
  /** Última página disponible para este criterio de búsqueda. */
  maxPage: number;
  items: Product[];
}

/* Carrito */

export interface CartState {
  items: Product[];
}

export type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'CLEAR' };

/** Lo que el proveedor del carrito publica a sus consumidores. */
export interface CartContextValue {
  items: readonly Product[];
  /** Identificadores en el carrito, para consultar pertenencia en O(1). */
  ids: ReadonlySet<string>;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clear: () => void;
}

/* Consultas y hooks */

/** Forma de la respuesta de la consulta `SearchProducts`. */
export interface SearchProductsData {
  searchProducts: ProductPage;
}

/** Interfaz que el hook `useProductSearch` expone a los componentes. */
export interface UseProductSearch {
  products: readonly Product[];
  /** Hay una primera página en camino. */
  loading: boolean;
  /** Hay una página adicional en camino, con resultados ya en pantalla. */
  loadingMore: boolean;
  /** Quedan páginas por cargar para el criterio actual. */
  hasMore: boolean;
  /** Solicita la siguiente página. Ignora la llamada si no procede. */
  loadMore: () => void;
  /** Mensaje de error listo para mostrarse, o `null` si no hubo fallo. */
  error: string | null;
  /** La búsqueda terminó sin resultados. */
  isEmpty: boolean;
}

/* Componentes */

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  /** Indica que hay una consulta en curso para mostrar el avance. */
  loading?: boolean;
}

export interface ProductCardProps {
  product: Product;
  /** Atenúa la tarjeta mientras su copia flotante se está arrastrando. */
  dragging?: boolean;
}

export interface CartItemProps {
  product: Product;
  onRemove: (id: string) => void;
}

export interface ProductGridProps {
  products: readonly Product[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  /** Se invoca cuando el scroll se acerca al final de lo cargado. */
  onLoadMore: () => void;
  error: string | null;
  isEmpty: boolean;
  /** Criterio actual, para dar contexto en los mensajes de estado. */
  keyword: string;
}

/* Respuesta cruda del servicio (Axesso / Walmart) */
/**
 * Estas interfaces describen únicamente los campos que el adapter necesita.
 * El servicio devuelve el `__NEXT_DATA__` completo de Walmart (~866 KB por
 * página) con más de cien campos por producto; modelarlo entero no aportaría
 * nada y ataría la aplicación a un contrato que no controlamos.
 */
export interface RawPriceValue {
  key: string;
  value: string;
}

export interface RawPriceLine {
  lineType: string;
  values?: RawPriceValue[];
}

export interface RawProduct {
  __typename?: string;
  usItemId?: string;
  id?: string;
  name?: string;
  image?: string;
  imageInfo?: { thumbnailUrl?: string };
  description?: string;
  shortDescription?: string;
  price?: number;
  priceInfo?: {
    linePrice?: string;
    itemPrice?: string;
    priceDetails?: {
      currency?: string;
      priceLines?: RawPriceLine[];
    };
  };
}

export interface RawSearchResponse {
  item?: {
    props?: {
      pageProps?: {
        initialData?: {
          searchResult?: {
            itemStacks?: { items?: RawProduct[] }[];
            paginationV2?: { maxPage?: number };
          };
        };
      };
    };
  };
}
