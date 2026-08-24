/**
 * Contenedor visual de la aplicación: encuadra el contenido en una tarjeta
 * centrada, con el header arriba y el pie de versión abajo, tal como se define
 * en los mockups del examen.
 */
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { Header } from '@/components/layout/Header';
import { brand } from '@/config/theme';
import type { AppLayoutProps } from '@/types';

export function AppLayout({ children, onReset, disabled }: AppLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: brand.pageBackground,
        p: { xs: 1, sm: 2.5 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: 1040,
          height: { xs: '100dvh', sm: 'min(94dvh, 900px)' },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: `1px solid ${brand.border}`,
        }}
      >
        <Header onReset={onReset} disabled={disabled} />

        {/* Área de contenido: es la que scrollea, no la página completa. */}
        <Box component="main" sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>

        <Box
          component="footer"
          sx={{
            px: 3,
            py: 1.25,
            backgroundColor: '#fff',
            borderTop: `1px solid ${brand.border}`,
            textAlign: 'right',
          }}
        >
          <Typography variant="caption" color="text.primary">
            versión {__APP_VERSION__}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
