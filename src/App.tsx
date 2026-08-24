/**
 * Raíz de la aplicación: mantiene el criterio de búsqueda, conecta el buscador
 * con la lista de resultados y coordina el arrastre de productos al carrito.
 */
import { useCallback, useState } from 'react';

import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useApolloClient } from '@apollo/client/react';
import Box from '@mui/material/Box';

import { CartPanel } from '@/components/cart/CartPanel';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SearchBar } from '@/components/search/SearchBar';
import { dndAnnouncements, dndInstructions } from '@/config/dndAccessibility';
import { CART_DROPPABLE_ID, DRAG_ACTIVATION_DISTANCE } from '@/constants';
import { CartProvider } from '@/context/CartProvider';
import { useCart } from '@/hooks/useCart';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useProductSearch } from '@/hooks/useProductSearch';
import type { Product } from '@/types';

/**
 * Vista principal. Vive dentro del proveedor del carrito para poder consumirlo.
 */
function Tienda() {
  // Se distinguen dos valores: el que el usuario está escribiendo y el que
  // realmente dispara la consulta, retrasado para no llamar al servicio en
  // cada tecla.
  const [keyword, setKeyword] = useState('');
  const retrasado = useDebouncedValue(keyword);

  // El retardo existe para no lanzar una consulta por cada tecla. Un criterio
  // vacío no genera ninguna consulta, así que no hay nada que retrasar: se
  // aplica de inmediato para que borrar el campo (o reiniciar la aplicación)
  // limpie la pantalla al instante en lugar de medio segundo después.
  const debouncedKeyword = keyword.trim() === '' ? '' : retrasado;

  // Producto que viaja con el puntero durante el arrastre.
  const [arrastrando, setArrastrando] = useState<Product | null>(null);

  const { addItem, clear: vaciarCarrito, items: enCarrito } = useCart();

  // Se toma del contexto en lugar de importar la instancia directamente: así el
  // componente no queda atado al módulo del cliente.
  const apollo = useApolloClient();

  const { products, loading, loadingMore, hasMore, loadMore, error, isEmpty } =
    useProductSearch(debouncedKeyword);

  // Hay consulta pendiente también mientras el retardo no ha vencido.
  const buscando = loading || keyword.trim() !== debouncedKeyword.trim();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Sin este umbral, un clic simple sobre la tarjeta iniciaría un arrastre.
      activationConstraint: { distance: DRAG_ACTIVATION_DISTANCE },
    }),
    // El arrastre también se puede completar con el teclado: espacio para
    // tomar el producto, flechas para moverlo y espacio otra vez para soltarlo.
    useSensor(KeyboardSensor),
  );

  const alIniciarArrastre = useCallback((event: DragStartEvent) => {
    setArrastrando((event.active.data.current?.product as Product | undefined) ?? null);
  }, []);

  /**
   * Devuelve la aplicación a su estado inicial.
   *
   * El orden importa: primero se limpia el criterio, con lo que la consulta
   * queda omitida (`skip`), y solo entonces se descarta la caché. Al revés,
   * Apollo volvería a pedir la búsqueda que estamos borrando.
   */
  const reiniciar = useCallback(() => {
    setKeyword('');
    vaciarCarrito();
    void apollo.clearStore();
  }, [apollo, vaciarCarrito]);

  // Sin búsqueda ni productos en el carrito no hay nada que reiniciar.
  const hayAlgoQueReiniciar = keyword !== '' || enCarrito.length > 0;

  const alSoltar = useCallback(
    (event: DragEndEvent) => {
      setArrastrando(null);

      if (event.over?.id !== CART_DROPPABLE_ID) return;

      const product = event.active.data.current?.product as Product | undefined;
      if (product) addItem(product);
    },
    [addItem],
  );

  return (
    <DndContext
      sensors={sensors}
      accessibility={{
        announcements: dndAnnouncements,
        screenReaderInstructions: dndInstructions,
      }}
      onDragStart={alIniciarArrastre}
      onDragEnd={alSoltar}
      onDragCancel={() => setArrastrando(null)}
    >
      <AppLayout onReset={reiniciar} disabled={!hayAlgoQueReiniciar}>
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          loading={buscando && keyword !== ''}
        />

        <CartPanel />

        <ProductGrid
          products={products}
          loading={buscando}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          error={error}
          isEmpty={isEmpty}
          keyword={debouncedKeyword.trim()}
        />
      </AppLayout>

      {/* Copia flotante que sigue al puntero. Se renderiza fuera de la lista
          para que la virtualización pueda desmontar la tarjeta original sin
          interrumpir el arrastre. */}
      <DragOverlay dropAnimation={null}>
        {arrastrando && (
          <Box sx={{ width: 300, cursor: 'grabbing', opacity: 0.95 }}>
            <ProductCard product={arrastrando} />
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function App() {
  return (
    <CartProvider>
      <Tienda />
    </CartProvider>
  );
}

export default App;
