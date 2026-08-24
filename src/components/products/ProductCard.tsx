/**
 * Tarjeta de producto: imagen, nombre y precio, según el diseño entregado.
 *
 * La altura es fija a propósito. Dos motivos: las tarjetas se alinean en una
 * retícula regular, y el scroll virtual del paso siguiente puede calcular
 * posiciones sin medir cada elemento, que es bastante más barato.
 */
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { brand } from '@/config/theme';
import type { ProductCardProps } from '@/types';
import { formatPrice } from '@/utils/formatPrice';

/** Alto total de la tarjeta. Lo consume también la retícula virtualizada. */
export const PRODUCT_CARD_HEIGHT = 280;

export function ProductCard({ product }: ProductCardProps) {
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
        transition: 'box-shadow 200ms ease, transform 200ms ease',
        '&:hover': {
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-2px)',
        },
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
          src={image}
          alt={name}
          loading="lazy"
          sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
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
