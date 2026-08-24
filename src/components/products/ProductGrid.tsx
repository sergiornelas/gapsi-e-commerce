/**
 * Retícula de resultados de búsqueda.
 *
 * Concentra los cuatro estados posibles de la lista —sin criterio, cargando,
 * con error y sin resultados— para que el resto de la aplicación no tenga que
 * decidir qué mostrar en cada caso.
 */
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ProductCard } from '@/components/products/ProductCard';
import { ProductSkeleton } from '@/components/products/ProductSkeleton';
import { brand } from '@/config/theme';
import type { ProductGridProps } from '@/types';

/** Cuántos marcadores de carga mostrar mientras llega la primera página. */
const SKELETON_COUNT = 6;

/** Columnas por punto de ruptura. Se reutilizará al virtualizar la lista. */
const GRID_COLUMNS = {
  xs: 'repeat(1, 1fr)',
  sm: 'repeat(2, 1fr)',
  md: 'repeat(3, 1fr)',
} as const;

/** Mensaje centrado con un icono, para los estados sin contenido. */
function EstadoVacio({ icon, title, detail }: { icon: string; title: string; detail?: string }) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        py: 6,
        color: brand.text,
        textAlign: 'center',
      }}
    >
      <Box component="i" className={icon} sx={{ fontSize: 44, opacity: 0.35 }} aria-hidden="true" />
      <Typography variant="h2">{title}</Typography>
      {detail && (
        <Typography variant="body2" sx={{ maxWidth: 380 }}>
          {detail}
        </Typography>
      )}
    </Box>
  );
}

export function ProductGrid({ products, loading, error, isEmpty, keyword }: ProductGridProps) {
  if (error) {
    return (
      <Box sx={{ px: 3, py: 2 }}>
        <Alert severity="error" variant="outlined">
          {error}
        </Alert>
      </Box>
    );
  }

  if (!keyword) {
    return (
      <EstadoVacio
        icon="fa-solid fa-magnifying-glass"
        title="Busca un producto para empezar"
        detail="Escribe un término en el campo de arriba y los resultados aparecerán aquí."
      />
    );
  }

  if (isEmpty) {
    return (
      <EstadoVacio
        icon="fa-regular fa-face-frown"
        title={`Sin resultados para "${keyword}"`}
        detail="Prueba con otro término. Recuerda que el catálogo está en inglés."
      />
    );
  }

  const showSkeletons = loading && products.length === 0;

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        px: 3,
        pb: 3,
        display: 'grid',
        gridTemplateColumns: GRID_COLUMNS,
        gap: 2,
        alignContent: 'start',
      }}
    >
      {showSkeletons
        ? Array.from({ length: SKELETON_COUNT }, (_, index) => <ProductSkeleton key={index} />)
        : products.map((product) => <ProductCard key={product.id} product={product} />)}
    </Box>
  );
}
