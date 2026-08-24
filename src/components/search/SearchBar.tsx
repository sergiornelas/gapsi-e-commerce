/**
 * Campo de búsqueda de productos.
 *
 * El componente es controlado y no decide cuándo consultar: solo informa el
 * cambio. El retardo (debounce) lo aplica quien lo consume, para que la política
 * de consultas viva en un solo lugar.
 */
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import { brand } from '@/config/theme';
import type { SearchBarProps } from '@/types';

export function SearchBar({ value, onChange, loading = false }: SearchBarProps) {
  return (
    <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
      <TextField
        fullWidth
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Busca productos: nintendo, sony, computer…"
        // El servicio indexa catálogo en inglés; se advierte para evitar
        // búsquedas vacías por idioma.
        helperText="El catálogo está en inglés, usa términos o marcas en ese idioma."
        autoFocus
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={18} thickness={5} />
              </InputAdornment>
            ) : null,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fff',
            transition: 'box-shadow 200ms ease',
            '&.Mui-focused': { boxShadow: `0 0 0 3px ${brand.accent}22` },
          },
        }}
      />
    </Box>
  );
}
