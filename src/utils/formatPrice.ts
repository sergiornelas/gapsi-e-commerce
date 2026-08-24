/**
 * Formateo de precios para la interfaz.
 */
import { DEFAULT_CURRENCY } from '@/constants';

/** Texto que se muestra cuando el servicio no informa precio del producto. */
export const NO_PRICE_LABEL = 'Precio no disponible';

/**
 * Da formato a un precio según su moneda.
 *
 * Los productos sin precio son un caso real y frecuente del servicio, así que
 * se contempla explícitamente en lugar de mostrar un "0" engañoso.
 */
export const formatPrice = (
  price: number | null,
  currency: string = DEFAULT_CURRENCY,
): string => {
  if (price === null) return NO_PRICE_LABEL;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};
