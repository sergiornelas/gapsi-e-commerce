/**
 * Tarjeta de producto: imagen, nombre y precio, según el diseño entregado.
 *
 * Es un componente puramente presentacional. El arrastre lo añade
 * `DraggableProductCard`, de modo que esta misma tarjeta pueda reutilizarse como
 * vista previa flotante mientras se arrastra, sin arrastrarse a sí misma.
 *
 * La altura es fija a propósito: las tarjetas se alinean en una retícula regular
 * y el scroll virtual calcula posiciones sin medir cada elemento.
 */
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { brand } from '@/config/theme';
import type { ProductCardProps } from '@/types';
import { formatPrice } from '@/utils/formatPrice';

/** Alto total de la tarjeta. Lo consume también la retícula virtualizada. */
export const PRODUCT_CARD_HEIGHT = 280;

export function ProductCard({ product, dragging = false }: ProductCardProps) {
  const { name, price, currency, image, description } = product;

  return (
    <Card
      elevation={0}
      sx={{
        height: PRODUCT_CARD_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${brand.border}`,
        backgroundColor: '#fff',
        // El original se atenúa mientras su copia flotante viaja con el puntero.
        opacity: dragging ? 0.35 : 1,
        transition:
          'box-shadow 220ms ease, transform 220ms ease, opacity 150ms ease, border-color 220ms ease',
        '&:hover': {
          boxShadow: '0 8px 22px rgba(0, 0, 0, 0.14)',
          transform: 'translateY(-3px)',
          borderColor: brand.accent,
        },
        // La imagen acompaña el realce con un acercamiento apenas perceptible.
        '&:hover .imagen-producto': { transform: 'scale(1.06)' },
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 1.5,
        }}
      >
        <Box
          component="img"
          className="imagen-producto"
          src={image}
          alt={name}
          loading="lazy"
          sx={{
            maxHeight: '100%',
            maxWidth: '100%',
            objectFit: 'contain',
            transition: 'transform 280ms ease',
          }}
        />
      </Box>

      <Box sx={{ borderTop: `1px solid ${brand.border}`, px: 1.5, py: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Typography
            variant="body1"
            title={name}
            sx={{
              color: brand.text,
              // El nombre se limita a una línea para no descuadrar la tarjeta;
              // el título completo queda accesible en el tooltip nativo.
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </Typography>

          <Typography
            variant="h2"
            component="p"
            sx={{
              color: brand.accent,
              whiteSpace: 'nowrap',
              fontSize: price === null ? '0.75rem' : undefined,
            }}
          >
            {formatPrice(price, currency)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            color: brand.text,
            // Dos líneas fijas: hay productos sin descripción y sin esta
            // reserva de espacio el texto de las tarjetas no alinearía entre sí.
            // El alto mínimo debe coincidir con `lineHeight * 2`.
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            minHeight: '2.8em',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Card>
  );
}
