/**
 * PATRÓN DE DISEÑO: REPOSITORY
 *
 * Única puerta de acceso al origen de datos de productos. El resto de la
 * aplicación pide productos sin saber que detrás hay HTTP, RapidAPI ni un
 * payload de Walmart: solo recibe `ProductPage`.
 *
 * Esto permite cambiar el origen (otro proveedor, un backend propio, datos de
 * prueba) sin tocar ni la capa de GraphQL ni los componentes.
 */
import { apiConfig, buildSearchUrl, searchHeaders } from "@/config/api.config";
import { adaptSearchResponse } from "@/data/walmartAdapter";
import type { ProductPage, RawSearchResponse } from "@/types";

/** Error de dominio: oculta los detalles del transporte a las capas superiores. */
export class ProductSearchError extends Error {
  /** Código HTTP, cuando el fallo viene de la respuesta del servicio. */
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ProductSearchError";
    this.status = status;
  }
}

/** Traduce un fallo del servicio a un mensaje que la interfaz pueda mostrar. */
const describeFailure = (status: number): string => {
  if (status === 401 || status === 403) {
    return "La llave de acceso al servicio de búsqueda no es válida. Revisa VITE_RAPIDAPI_KEY en tu archivo .env.";
  }

  if (status === 429) {
    return "Se alcanzó el límite de consultas al servicio de búsqueda. Intenta de nuevo en unos minutos.";
  }

  return "El servicio de búsqueda no está disponible en este momento.";
};

export const productRepository = {
  /**
   * Busca productos por palabra clave.
   *
   * @param keyword Criterio de búsqueda (el servicio responde mejor en inglés).
   * @param page    Página solicitada, 1-based.
   */
  async search(keyword: string, page: number): Promise<ProductPage> {
    const term = keyword.trim();

    // Una búsqueda vacía no se consulta: se responde una página vacía y se
    // ahorra una llamada a un servicio con cuota limitada.
    if (!term) {
      return { keyword: term, page, maxPage: 0, items: [] };
    }

    const safePage = Math.min(
      Math.max(page, apiConfig.firstPage),
      apiConfig.maxPages,
    );

    let response: Response;

    try {
      response = await fetch(buildSearchUrl(term, safePage), {
        headers: searchHeaders,
      });
    } catch {
      throw new ProductSearchError(
        "No se pudo contactar al servicio de búsqueda. Revisa tu conexión a internet.",
      );
    }

    if (!response.ok) {
      throw new ProductSearchError(
        describeFailure(response.status),
        response.status,
      );
    }

    const payload = (await response.json()) as RawSearchResponse;

    return adaptSearchResponse(payload, term, safePage);
  },
};
