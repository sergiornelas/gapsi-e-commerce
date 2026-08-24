/**
 * PATRÓN DE DISEÑO: PROVIDER / OBSERVER
 *
 * El carrito es estado compartido: lo modifica la zona de arrastre, lo consulta
 * el contador y también la lista de productos, para ocultar lo que ya fue
 * agregado. En lugar de pasar el estado por props a través de toda la jerarquía,
 * el proveedor lo publica y cada componente interesado se suscribe con
 * `useCart()`; React re-renderiza solo a quienes lo consumen.
 */
import { useCallback, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';

import { CartContext } from '@/context/cartContext';
import { CART_INITIAL_STATE, cartReducer } from '@/context/cartReducer';
import type { CartContextValue, Product } from '@/types';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  const addItem = useCallback((product: Product) => {
    dispatch({ type: 'ADD_ITEM', product });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', id });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  // Conjunto de identificadores para consultar la pertenencia en tiempo
  // constante: la lista de productos lo evalúa en cada render.
  const ids = useMemo(() => new Set(state.items.map((item) => item.id)), [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({ items: state.items, ids, addItem, removeItem, clear }),
    [state.items, ids, addItem, removeItem, clear],
  );

  return <CartContext value={value}>{children}</CartContext>;
}
