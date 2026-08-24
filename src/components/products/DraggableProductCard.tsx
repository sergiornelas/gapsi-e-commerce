/**
 * Envuelve una tarjeta de producto para hacerla arrastrable hacia el carrito.
 *
 * La responsabilidad está separada a propósito: `ProductCard` solo sabe pintar
 * un producto, y este envoltorio solo sabe de arrastre. Así la misma tarjeta
 * sirve como vista previa flotante sin quedar enganchada al sistema de arrastre.
 */
import Box from '@mui/material/Box';
import { useDraggable } from '@dnd-kit/core';

import { ProductCard } from '@/components/products/ProductCard';
import type { ProductCardProps } from '@/types';

export function DraggableProductCard({ product }: ProductCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: product.id,
    // El producto viaja con el evento: al soltarlo, el manejador lo recibe sin
    // tener que buscarlo de nuevo en la lista.
    data: { product },
  });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      sx={{
        height: '100%',
        // Los elementos de una retícula tienen `min-width: auto`: sin esto, el
        // nombre del producto (que no hace saltos de línea) ensancharía la
        // columna y desbordaría la retícula.
        minWidth: 0,
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        // Evita que el navegador interprete el arrastre como scroll táctil.
        touchAction: 'none',
        // El foco lo dibuja la tarjeta; se quita el contorno por defecto.
        outline: 'none',
        '&:focus-visible > *': { boxShadow: '0 0 0 3px rgba(0, 152, 200, 0.5)' },
      }}
    >
      <ProductCard product={product} dragging={isDragging} />
    </Box>
  );
}
