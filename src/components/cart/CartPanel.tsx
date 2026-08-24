/**
 * Carrito de compras: zona donde se sueltan los productos arrastrados y lista
 * de lo que ya se agregó.
 *
 * Reproduce la zona punteada del diseño, con la flecha guía y el contador sobre
 * el icono del carrito.
 */
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grow from '@mui/material/Grow';
import Typography from '@mui/material/Typography';
import { useDndContext, useDroppable } from '@dnd-kit/core';

import { CartItem } from '@/components/cart/CartItem';
import { GuideArrow } from '@/components/cart/GuideArrow';
import { brand } from '@/config/theme';
import { CART_DROPPABLE_ID } from '@/constants';
import { useCart } from '@/hooks/useCart';

export function CartPanel() {
  const { items, removeItem } = useCart();

  // `isOver` se activa cuando hay un producto suspendido sobre la zona: es la
  // señal que confirma al usuario que puede soltar aquí.
  const { setNodeRef, isOver } = useDroppable({ id: CART_DROPPABLE_ID });

  // Hay un arrastre en curso en cualquier parte de la aplicación. La zona se
  // realza desde que el producto se levanta, no solo cuando ya está encima:
  // así el usuario sabe a dónde llevarlo antes de acercarse.
  const { active } = useDndContext();
  const arrastreEnCurso = active !== null;

  const vacio = items.length === 0;

  return (
    <Box sx={{ px: { xs: 1.5, sm: 3 }, pt: 1, pb: 1.5 }}>
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}
      >
        {/* Flecha guía: solo tiene sentido mientras el carrito está vacío. */}
        <GuideArrow visible={vacio && !arrastreEnCurso} />

        <Box
          ref={setNodeRef}
          role="region"
          aria-label="Carrito de compras. Suelta aquí los productos."
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            px: { xs: 2, sm: 4 },
            py: 1.5,
            minWidth: { xs: 0, sm: 220 },
            flex: { xs: 1, sm: 'none' },
            border: `2px dashed ${isOver || arrastreEnCurso ? brand.success : '#c9c9c9'}`,
            borderRadius: 1,
            backgroundColor: isOver ? 'rgba(0, 184, 88, 0.12)' : 'transparent',
            transform: isOver ? 'scale(1.06)' : 'none',
            transition:
              'border-color 180ms ease, background-color 180ms ease, transform 180ms ease',
            // Latido mientras hay algo en el aire, para que la zona no pase
            // desapercibida detrás de la tarjeta que sigue al puntero.
            animation:
              arrastreEnCurso && !isOver ? 'latido 1.4s ease-in-out infinite' : 'none',
            '@keyframes latido': {
              '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 184, 88, 0)' },
              '50%': { boxShadow: '0 0 0 8px rgba(0, 184, 88, 0.14)' },
            },
          }}
        >
          <Badge
            badgeContent={items.length}
            showZero
            // Cambiar la clave remonta el contador, lo que reinicia la
            // animación en cada alta o baja y confirma que el carrito cambió.
            key={items.length}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: brand.badge,
                color: brand.badgeText,
                fontWeight: 700,
                border: '2px solid #fff',
                animation: 'brinco 420ms ease',
              },
              '@keyframes brinco': {
                '0%': { transform: 'scale(1)' },
                '45%': { transform: 'scale(1.45)' },
                '100%': { transform: 'scale(1)' },
              },
            }}
          >
            <Box
              component="i"
              className="fa-solid fa-cart-shopping"
              aria-hidden="true"
              sx={{ fontSize: 34, color: brand.textStrong }}
            />
          </Badge>

          <Typography variant="body2" sx={{ color: brand.accent }}>
            arrastra aquí tus productos
          </Typography>
        </Box>
      </Box>

      {/* Contenido del carrito: aparece solo cuando hay algo dentro. */}
      <Collapse in={!vacio}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
            pt: 1.5,
            maxHeight: 120,
            overflowY: 'auto',
          }}
        >
          {items.map((product) => (
            <Grow key={product.id} in appear>
              <Box>
                <CartItem product={product} onRemove={removeItem} />
              </Box>
            </Grow>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
