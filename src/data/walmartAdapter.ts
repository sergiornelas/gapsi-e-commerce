/**
 * PATRÓN DE DISEÑO: ADAPTER
 *
 * Traduce la respuesta del servicio externo (el `__NEXT_DATA__` crudo de Walmart,
 * ~866 KB por página y con más de cien campos por producto) al modelo `Product`
 * que consume la aplicación.
 *
 * Concentrar aquí esa traducción tiene un motivo concreto: el contrato del
 * servicio no lo controlamos y tiene varias trampas verificadas contra la API real:
 *
 *   1. El precio llega en dos formatos distintos y el servicio alterna entre ellos
 *      de una petición a otra (verificado: 1 de cada 6 respuestas usa el segundo).
 *      Ver `extractPrice`.
 *   2. Entre los productos vienen anuncios y placeholders (`AdPlaceholder`,
 *      `TileTakeOverProductPlaceholder`) sin nombre ni imagen.
 *   3. La descripción llega como HTML (`<li>...</li>`), no como texto.
 *   4. Los resultados se reparten en varios `itemStacks`.
 *
 * Si el servicio cambia, este es el único archivo que hay que tocar.
 */
import {
  BULLET_SEPARATOR,
  DEFAULT_CURRENCY,
  HTML_ENTITIES,
  PRICE_LINE_LOOKUP,
  PRODUCT_TYPENAME,
} from "@/constants";
import type {
  Product,
  ProductPage,
  RawProduct,
  RawSearchResponse,
} from "@/types";

/** Convierte un precio formateado ("$189.99", "1,299.00") a número. */
const parseFormattedPrice = (value: string | undefined): number | null => {
  if (!value) return null;

  const price = Number(value.replace(/[^0-9.]/g, ""));

  return Number.isFinite(price) && price > 0 ? price : null;
};

/**
 * Extrae el precio de un producto, o `null` si el servicio no informa ninguno.
 *
 * El servicio devuelve el precio en dos formatos y alterna entre ellos sin
 * previo aviso, así que hay que soportar los dos:
 *
 *   Formato A · `priceInfo.priceDetails.priceLines[]` desglosado.
 *               `price` llega en 0 y `linePrice`/`itemPrice` vacíos.
 *   Formato B · sin `priceDetails`. El precio de venta está en
 *               `priceInfo.linePrice` ya formateado ("$189.99"), e `itemPrice`
 *               guarda el precio anterior al descuento.
 *
 * Se intenta A primero por ser el más preciso; `price` queda al final porque el
 * servicio lo entrega truncado a entero (189 en lugar de 189.99).
 */
const extractPrice = (raw: RawProduct): number | null => {
  const priceLines = raw.priceInfo?.priceDetails?.priceLines ?? [];

  // Formato A: desglose por tipo de línea.
  for (const { lineType, key } of PRICE_LINE_LOOKUP) {
    const value = priceLines
      .find((line) => line.lineType === lineType)
      ?.values?.find((entry) => entry.key === key)?.value;

    const price = Number(value);
    if (value && Number.isFinite(price) && price > 0) return price;
  }

  // Formato B: precio ya formateado. `linePrice` es el precio de venta actual.
  return (
    parseFormattedPrice(raw.priceInfo?.linePrice) ??
    parseFormattedPrice(raw.priceInfo?.itemPrice) ??
    // Último recurso: el entero truncado.
    (raw.price && raw.price > 0 ? raw.price : null)
  );
};

/**
 * Convierte a texto plano la descripción, que el servicio entrega como HTML.
 * Además de dar un texto presentable, evita tener que inyectar HTML ajeno en el
 * DOM (`dangerouslySetInnerHTML`), que sería un vector de XSS.
 */
const toPlainText = (html: string | undefined): string => {
  if (!html) return "";

  return html
    .replace(/<\/li>\s*<li>/gi, BULLET_SEPARATOR) // los bullets se vuelven separadores
    .replace(/<[^>]+>/g, "") // se eliminan las etiquetas restantes
    .replace(/&[a-z#0-9]+;/gi, (entity) => HTML_ENTITIES[entity] ?? entity)
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Normaliza un producto crudo. Devuelve `null` cuando el elemento no es un
 * producto mostrable (anuncios, placeholders o registros sin datos mínimos).
 */
const toProduct = (raw: RawProduct): Product | null => {
  if (raw.__typename !== PRODUCT_TYPENAME) return null;

  const id = raw.usItemId ?? raw.id;
  const name = raw.name?.trim();
  const image = raw.image ?? raw.imageInfo?.thumbnailUrl;

  // Sin identificador, nombre o imagen el producto no puede mostrarse ni
  // deduplicarse: se descarta en lugar de renderizar una tarjeta rota.
  if (!id || !name || !image) return null;

  return {
    id,
    name,
    price: extractPrice(raw),
    currency: raw.priceInfo?.priceDetails?.currency ?? DEFAULT_CURRENCY,
    image,
    description: toPlainText(raw.shortDescription ?? raw.description),
  };
};

/**
 * Adapta una respuesta completa del servicio a una página de productos.
 *
 * El servicio pagina de forma imperfecta: páginas consecutivas repiten algunos
 * productos, así que se deduplica por id dentro de la propia página. La
 * deduplicación entre páginas la resuelve la caché de Apollo al concatenarlas.
 */
export const adaptSearchResponse = (
  response: RawSearchResponse,
  keyword: string,
  page: number,
): ProductPage => {
  const searchResult =
    response.item?.props?.pageProps?.initialData?.searchResult;

  const seen = new Set<string>();
  const items: Product[] = [];

  for (const stack of searchResult?.itemStacks ?? []) {
    for (const raw of stack.items ?? []) {
      const product = toProduct(raw);

      if (product && !seen.has(product.id)) {
        seen.add(product.id);
        items.push(product);
      }
    }
  }

  return {
    keyword,
    page,
    // `hasMorePages` del servicio no es confiable (llega en false aun habiendo
    // más páginas); `maxPage` sí refleja el total real.
    maxPage: searchResult?.paginationV2?.maxPage ?? page,
    items,
  };
};
