import { useEffect, useState } from 'react';

/**
 * Retrasa la propagación de un valor hasta que deja de cambiar.
 *
 * Se usa en el buscador para no lanzar una consulta por cada tecla: el servicio
 * tiene cuota limitada y cada respuesta pesa cerca de 866 KB.
 */
export const useDebouncedValue = <T,>(value: T, delay = 500): T => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};
