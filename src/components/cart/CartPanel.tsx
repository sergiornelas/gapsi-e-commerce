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
import Typography from '@mui/material/Typography';
import { useDroppable } from '@dnd-kit/core';

import { CartItem } from '@/components/cart/CartItem';
import { brand } from '@/config/theme';
import { CART_DROPPABLE_ID } from '@/constants';
import { useCart } from '@/hooks/useCart';

export function CartPanel() {
  const { items, removeItem } = useCart();

  // `isOver` se activa cuando hay un producto suspendido sobre la zona: es la
  // señal que confirma al usuario que puede soltar aquí.
  const { setNodeRef, isOver } = useDroppable({ id: CART_DROPPABLE_ID });

  const vacio = items.length === 0;

  return (
    <Box sx={{ px: 3, pt: 1, pb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        {/* Flecha guía: solo tiene sentido mientras el carrito está vacío. */}
        <Box
          component="i"
          className="fa-solid fa-arrow-right-long"
          aria-hidden="true"
          sx={{
            fontSize: 30,
            color: brand.success,
            opacity: vacio ? 1 : 0,
            transition: 'opacity 250ms ease',
          }}
        />

        <Box
          ref={setNodeRef}
          role="region"
          aria-label="Carrito de compras. Suelta aquí los productos."
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            px: 4,
            py: 1.5,
            minWidth: 220,
            border: `2px dashed ${isOver ? brand.success : '#c9c9c9'}`,
            borderRadius: 1,
            backgroundColor: isOver ? 'rgba(0, 184, 88, 0.08)' : 'transparent',
            transform: isOver ? 'scale(1.03)' : 'none',
            transition: 'border-color 180ms ease, background-color 180ms ease, transform 180ms ease',
          }}
        >
          <Badge
            badgeContent={items.length}
            showZero
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: brand.badge,
                color: brand.badgeText,
                fontWeight: 700,
                border: '2px solid #fff',
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
            <CartItem key={product.id} product={product} onRemove={removeItem} />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
