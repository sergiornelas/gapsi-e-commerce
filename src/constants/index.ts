/* Contrato del servicio de búsqueda (Axesso / Walmart) */

/**
 * Valor de `__typename` que identifica a un producto real dentro de la
 * respuesta. El resto (`AdPlaceholder`, `TileTakeOverProductPlaceholder`) son
 * anuncios y huecos de maquetación que no deben mostrarse.
 */
export const PRODUCT_TYPENAME = "Product";

/** Moneda asumida cuando el servicio no la informa. */
export const DEFAULT_CURRENCY = "USD";

/**
 * Orden en el que se busca el precio dentro de `priceInfo.priceDetails.priceLines`.
 *
 * El primero que exista gana: el precio con descuento tiene prioridad sobre el
 * de lista, y el rango de opciones es el último recurso. Modificar este orden
 * cambia qué precio ve el usuario.
 */
export const PRICE_LINE_LOOKUP: readonly { lineType: string; key: string }[] = [
  { lineType: "CURRENT_PRICE", key: "PRICE" },
  { lineType: "DISCOUNTED_PRICE", key: "PRICE" },
  { lineType: "OPTIONS", key: "LOW_PRICE" },
  { lineType: "OPTIONS_RANGE", key: "LOW_PRICE" },
];

/* Retícula de productos */

/** Columnas de la retícula por punto de ruptura. */
export const GRID_COLUMNS = { xs: 1, sm: 2, md: 3 } as const;

/** Separación entre tarjetas, en píxeles. Debe coincidir con el `gap` del CSS. */
export const GRID_GAP = 16;

/**
 * Filas de más que el virtualizador mantiene renderizadas por encima y por
 * debajo del área visible, para que el scroll rápido no muestre huecos.
 */
export const VIRTUAL_OVERSCAN = 2;

/**
 * A cuántas filas del final se pide la siguiente página.
 *
 * Se anticipa la carga para que los productos lleguen antes de que el usuario
 * toque el fondo. El margen es amplio a propósito: el servicio tarda entre 20 y
 * 40 segundos en responder (medido), así que conviene pedir con antelación.
 */
export const LOAD_MORE_THRESHOLD_ROWS = 5;

/* Limpieza de texto */

/** Separador con el que se sustituyen los bullets del HTML de la descripción. */
export const BULLET_SEPARATOR = " · ";

/** Entidades HTML que aparecen en las descripciones del servicio. */
export const HTML_ENTITIES: Readonly<Record<string, string>> = {
  "&amp;": "&",
  "&quot;": '"',
  "&apos;": "'",
  "&#39;": "'",
  "&nbsp;": " ",
};
