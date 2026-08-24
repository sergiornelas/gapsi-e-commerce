/**
 * Producto dentro del carrito, en formato compacto y con acción de quitar.
 */
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { brand } from '@/config/theme';
import type { CartItemProps } from '@/types';
import { formatPrice } from '@/utils/formatPrice';

export function CartItem({ product, onRemove }: CartItemProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        pl: 1,
        pr: 0.5,
        py: 0.5,
        borderRadius: 1,
        border: `1px solid ${brand.border}`,
        backgroundColor: '#fff',
        maxWidth: 260,
      }}
    >
      <Box
        component="img"
        src={product.image}
        alt=""
        sx={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }}
      />

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          title={product.name}
          sx={{
            display: 'block',
            color: brand.text,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.name}
        </Typography>
        <Typography variant="caption" sx={{ color: brand.accent, fontWeight: 500 }}>
          {formatPrice(product.price, product.currency)}
        </Typography>
      </Box>

      <Tooltip title="Quitar del carrito">
        <IconButton
          size="small"
          aria-label={`Quitar ${product.name} del carrito`}
          onClick={() => onRemove(product.id)}
          sx={{ ml: 'auto', color: brand.text, '&:hover': { color: '#d32f2f' } }}
        >
          <Box component="i" className="fa-solid fa-xmark" sx={{ fontSize: 14 }} aria-hidden="true" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
