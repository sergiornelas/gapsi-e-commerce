/**
 * Barra superior de la aplicación: identidad de marca y acciones globales.
 */
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { brand } from '@/config/theme';
import type { HeaderProps } from '@/types';

export function Header({ onReset }: HeaderProps) {
  return (
    <AppBar
      position="static"
      elevation={0}
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

        <Typography variant="h1" component="h1" color="text.primary" noWrap>
          e-Commerce Gapsi
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Reiniciar aplicación">
          <IconButton
            aria-label="Reiniciar aplicación"
            onClick={onReset}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: '#d6d6d6',
              color: '#050505',
              transition: 'background-color 150ms ease, transform 150ms ease',
              '&:hover': { backgroundColor: '#c4c4c4', transform: 'scale(1.05)' },
            }}
          >
            <i className="fa-solid fa-ellipsis-vertical" aria-hidden="true" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
