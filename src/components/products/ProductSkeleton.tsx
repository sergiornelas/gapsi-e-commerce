/**
 * Marcador de carga con la misma silueta que `ProductCard`.
 *
 * Reproducir la forma final evita el salto visual al llegar los datos, y hace
 * que la espera se perciba más corta que con un spinner.
 */
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';

import { PRODUCT_CARD_HEIGHT } from '@/components/products/ProductCard';
import { brand } from '@/config/theme';

export function ProductSkeleton() {
  return (
    <Card
      elevation={0}
      sx={{
        height: PRODUCT_CARD_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${brand.border}`,
        backgroundColor: '#fff',
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, p: 1.5 }}>
        <Skeleton variant="rectangular" height="100%" />
      </Box>

      <Box sx={{ borderTop: `1px solid ${brand.border}`, px: 1.5, py: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
          <Skeleton variant="text" width="55%" />
          <Skeleton variant="text" width="30%" />
        </Box>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="80%" />
      </Box>
    </Card>
  );
}
