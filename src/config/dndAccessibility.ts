/**
 * Textos que dnd-kit anuncia a los lectores de pantalla durante el arrastre.
 *
 * Se traducen porque los que trae por defecto están en inglés, y la aplicación
 * está en español. Se mantienen aparte de los componentes para poder revisarlos
 * o traducirlos sin tocar la lógica.
 */
import type { Announcements, ScreenReaderInstructions } from '@dnd-kit/core';

import { CART_DROPPABLE_ID } from '@/constants';

/** Devuelve el nombre del producto que se está arrastrando. */
const nombreDe = (data: Record<string, unknown> | null | undefined): string => {
  const product = data?.product as { name?: string } | undefined;

  return product?.name ?? 'el producto';
};

const enElCarrito = (id: string | number | undefined) =>
  id === CART_DROPPABLE_ID ? 'sobre el carrito' : 'fuera del carrito';

export const dndAnnouncements: Announcements = {
  onDragStart: ({ active }) => `Tomaste ${nombreDe(active.data.current)}.`,

  onDragOver: ({ active, over }) =>
    `${nombreDe(active.data.current)} está ${enElCarrito(over?.id)}.`,

  onDragEnd: ({ active, over }) =>
    over?.id === CART_DROPPABLE_ID
      ? `${nombreDe(active.data.current)} se agregó al carrito.`
      : `Soltaste ${nombreDe(active.data.current)} fuera del carrito. No se agregó.`,

  onDragCancel: ({ active }) =>
    `Cancelaste el arrastre de ${nombreDe(active.data.current)}.`,
};

export const dndInstructions: ScreenReaderInstructions = {
  draggable:
    'Presiona la barra espaciadora para tomar el producto. Usa las flechas para moverlo hasta el carrito y la barra espaciadora otra vez para agregarlo. Presiona Escape para cancelar.',
};
