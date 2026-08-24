/**
 * Objeto de contexto del carrito.
 *
 * Vive en su propio archivo, separado del proveedor, porque el Fast Refresh de
 * React exige que un módulo con componentes no exporte además otras cosas.
 */
import { createContext } from 'react';

import type { CartContextValue } from '@/types';

export const CartContext = createContext<CartContextValue | null>(null);
