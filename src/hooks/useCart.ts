import { useContext } from 'react';

import { CartContext } from '@/context/cartContext';
import type { CartContextValue } from '@/types';

/**
 * Acceso al carrito compartido.
 *
 * Falla de forma explícita si se usa fuera del proveedor: es un error de
 * programación y conviene detectarlo en desarrollo, no con un `undefined`
 * silencioso más adelante.
 */
export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider.');
  }

  return context;
};
