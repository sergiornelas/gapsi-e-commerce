/**
 * Lógica del carrito, aislada en una función pura.
 *
 * Separarla del proveedor tiene dos ventajas: se lee de un vistazo qué puede
 * pasarle al carrito, y se puede probar sin montar React.
 */
import type { CartAction, CartState } from '@/types';

export const CART_INITIAL_STATE: CartState = { items: [] };

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      // El mismo producto puede soltarse dos veces sobre el carrito; se ignora
      // en lugar de duplicarlo.
      const yaEsta = state.items.some((item) => item.id === action.product.id);

      return yaEsta ? state : { items: [...state.items, action.product] };
    }

    case 'REMOVE_ITEM':
      return { items: state.items.filter((item) => item.id !== action.id) };

    case 'CLEAR':
      return CART_INITIAL_STATE;

    default:
      return state;
  }
};
