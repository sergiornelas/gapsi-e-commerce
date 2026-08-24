/**
 * Raíz de la aplicación: mantiene el criterio de búsqueda y conecta el buscador
 * con la lista de resultados.
 */
import { useState } from "react";

import { AppLayout } from "@/components/layout/AppLayout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SearchBar } from "@/components/search/SearchBar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useProductSearch } from "@/hooks/useProductSearch";

function App() {
  // Se distinguen dos valores: el que el usuario está escribiendo y el que
  // realmente dispara la consulta, retrasado para no llamar al servicio en
  // cada tecla.
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword);

  const { products, loading, error, isEmpty } =
    useProductSearch(debouncedKeyword);

  // Hay consulta pendiente también mientras el retardo no ha vencido.
  const buscando = loading || keyword.trim() !== debouncedKeyword.trim();

  return (
    <AppLayout>
      <SearchBar
        value={keyword}
        onChange={setKeyword}
        loading={buscando && keyword !== ""}
      />

      <ProductGrid
        products={products}
        loading={buscando}
        error={error}
        isEmpty={isEmpty}
        keyword={debouncedKeyword.trim()}
      />
    </AppLayout>
  );
}

export default App;
