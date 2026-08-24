/**
 * Retícula de resultados con scroll virtual.
 *
 * Solo se montan en el DOM las filas visibles más un pequeño margen. Con 13
 * páginas de resultados la lista puede superar los 500 productos: renderizarlos
 * todos significaría miles de nodos y un scroll con tirones.
 *
 * Se virtualizan **filas completas, no tarjetas sueltas**. Es una simplificación
 * deliberada: la retícula tiene un número conocido de columnas y las tarjetas
 * una altura fija, así que agrupar los productos en filas permite tratar la
 * retícula como una lista y evita medir cada elemento.
 */
import { useEffect, useMemo, useRef } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { useVirtualizer } from '@tanstack/react-virtual';

import { DraggableProductCard } from '@/components/products/DraggableProductCard';
import { PRODUCT_CARD_HEIGHT } from '@/components/products/ProductCard';
import { ProductSkeleton } from '@/components/products/ProductSkeleton';
import { GRID_GAP, LOAD_MORE_THRESHOLD_ROWS, VIRTUAL_OVERSCAN } from '@/constants';
import { brand } from '@/config/theme';
import { useCart } from '@/hooks/useCart';
import { useGridColumns } from '@/hooks/useGridColumns';
import type { Product, ProductGridProps } from '@/types';

/** Cuántos marcadores de carga mostrar mientras llega la primera página. */
const SKELETON_COUNT = 6;

/** Alto de una fila: la tarjeta más la separación que la sigue. */
const ROW_HEIGHT = PRODUCT_CARD_HEIGHT + GRID_GAP;

/** Reparte los productos en filas de `columns` elementos. */
const toRows = (products: readonly Product[], columns: number): Product[][] => {
  const rows: Product[][] = [];

  for (let index = 0; index < products.length; index += columns) {
    rows.push(products.slice(index, index + columns));
  }

  return rows;
};

/** Mensaje centrado con un icono, para los estados sin contenido. */
function EstadoVacio({
  icon,
  title,
  detail,
}: {
  icon: string;
  title: string;
  detail?: string;
}) {
  return (
    <Fade in appear timeout={400}>
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
        <Box
          component="i"
          className={icon}
          aria-hidden="true"
          sx={{
            fontSize: 44,
            opacity: 0.35,
            // Entrada suave del icono, que es lo primero que atrae la mirada.
            animation: 'asomar 500ms ease',
            '@keyframes asomar': {
              from: { opacity: 0, transform: 'translateY(8px) scale(0.9)' },
              to: { opacity: 0.35, transform: 'none' },
            },
          }}
        />
        <Typography variant="h2">{title}</Typography>
        {detail && (
          <Typography variant="body2" sx={{ maxWidth: 380 }}>
            {detail}
          </Typography>
        )}
      </Box>
    </Fade>
  );
}

export function ProductGrid({
  products,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  error,
  isEmpty,
  keyword,
}: ProductGridProps) {
  const columns = useGridColumns();
  const { ids } = useCart();

  // Contenedor con scroll propio: es el que observa el virtualizador.
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lo que ya está en el carrito desaparece del catálogo. El filtro se aplica
  // antes de agrupar en filas para que la retícula no quede con huecos, y para
  // que la carga incremental se mida sobre lo que el usuario realmente ve.
  const disponibles = useMemo(
    () => products.filter((product) => !ids.has(product.id)),
    [products, ids],
  );

  const rows = useMemo(() => toRows(disponibles, columns), [disponibles, columns]);

  // React Compiler no puede memoizar el objeto que devuelve useVirtualizer.
  // No aplica aquí porque el compilador no está habilitado en este proyecto, y
  // la alternativa sería renunciar a la virtualización.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: VIRTUAL_OVERSCAN,
  });

  // Al cambiar el criterio, los resultados son otros: el scroll debe volver al
  // inicio o el usuario aterrizaría a mitad de una lista que no ha visto.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [keyword]);

  const virtualRows = virtualizer.getVirtualItems();
  const ultimaFilaVisible = virtualRows.at(-1)?.index ?? -1;

  // Carga incremental: en lugar de observar el scroll con un listener aparte,
  // se aprovecha que el virtualizador ya sabe qué filas están en pantalla.
  // Cuando la última renderizada se acerca al final, se pide otra página.
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    // Sin filas no hay última fila visible que observar. Ocurre cuando el
    // usuario agregó al carrito todo lo cargado: hay que reponer el catálogo,
    // o la lista se quedaría vacía en espera de un scroll imposible.
    if (rows.length === 0) {
      onLoadMore();
      return;
    }

    if (ultimaFilaVisible < 0) return;

    if (ultimaFilaVisible >= rows.length - LOAD_MORE_THRESHOLD_ROWS) {
      onLoadMore();
    }
  }, [ultimaFilaVisible, rows.length, hasMore, loadingMore, onLoadMore]);

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

  // Todo lo cargado ya está en el carrito: sin este aviso la lista quedaría en
  // blanco sin explicación.
  if (disponibles.length === 0 && products.length > 0 && !loadingMore) {
    return (
      <EstadoVacio
        icon="fa-solid fa-cart-shopping"
        title="Ya agregaste todos estos productos"
        detail={
          hasMore
            ? 'Sigue bajando o espera un momento: se están cargando más resultados.'
            : 'Quita alguno del carrito para volver a verlo aquí.'
        }
      />
    );
  }

  // Mientras llega la primera página no hay nada que virtualizar.
  if (loading && products.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: { xs: 1.5, sm: 3 },
          pb: 3,
          ...gridSx(columns),
        }}
      >
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </Box>
    );
  }

  return (
    <Box
      ref={scrollRef}
      sx={{ flex: 1, overflowY: 'auto', px: { xs: 1.5, sm: 3 }, pb: 3 }}
    >
      {/* Espaciador con la altura total de la lista: mantiene la barra de
          scroll proporcional aunque solo unas pocas filas existan en el DOM. */}
      <Box sx={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualRows.map((virtualRow) => (
          <Box
            key={virtualRow.key}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              // Cada fila se posiciona con transform en lugar de `top` porque
              // el navegador puede componerlo sin recalcular el diseño.
              transform: `translateY(${virtualRow.start}px)`,
              height: PRODUCT_CARD_HEIGHT,
              ...gridSx(columns),
            }}
          >
            {rows[virtualRow.index].map((product) => (
              <DraggableProductCard key={product.id} product={product} />
            ))}
          </Box>
        ))}
      </Box>

      {/* Aviso de carga de la siguiente página, fuera del área virtualizada. */}
      {loadingMore && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1.5,
            py: 2.5,
          }}
        >
          <CircularProgress size={18} thickness={5} />
          <Typography variant="body2">Cargando más productos…</Typography>
        </Box>
      )}

      {/* Fin del catálogo: cierra la lista en lugar de dejarla colgando. */}
      {!hasMore && !loadingMore && disponibles.length > 0 && (
        <Typography variant="body2" sx={{ textAlign: 'center', py: 2.5, opacity: 0.7 }}>
          No hay más productos para "{keyword}".
        </Typography>
      )}
    </Box>
  );
}

/** Estilos de retícula compartidos entre las filas virtuales y los skeletons. */
function gridSx(columns: number) {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${GRID_GAP}px`,
    alignContent: 'start',
  } as const;
}
