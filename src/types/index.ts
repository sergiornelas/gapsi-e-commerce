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
