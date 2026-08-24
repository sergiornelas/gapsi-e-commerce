/**
 * Barra superior de la aplicación: identidad de marca y acciones globales.
 */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { ResetButton } from '@/components/layout/ResetButton';
import { brand } from '@/config/theme';
import type { HeaderProps } from '@/types';

export function Header({ onReset, disabled }: HeaderProps) {
  return (
    <AppBar
      position="static"
      elevation={0}
      // `color="transparent"` evita que MUI imponga el contrastText blanco de
      // la paleta primaria sobre el contenido de la barra.
      color="transparent"
      sx={{
        backgroundColor: brand.headerBackground,
        borderBottom: `1px solid ${brand.border}`,
      }}
    >
      <Toolbar sx={{ gap: 2, py: 1.5 }}>
        <Box
          component="img"
          src="/logo.webp"
          alt="Gapsi"
          sx={{ height: 34, width: 'auto', display: 'block' }}
        />

        <Typography variant="h1" component="h1" noWrap sx={{ color: brand.text }}>
          e-Commerce Gapsi
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <ResetButton onReset={onReset} disabled={disabled} />
      </Toolbar>
    </AppBar>
  );
}
