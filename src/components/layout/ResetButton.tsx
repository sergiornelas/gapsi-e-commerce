/**
 * Botón de reinicio de la aplicación, en la esquina superior derecha.
 *
 * Pide confirmación porque la acción es destructiva e irreversible: vacía el
 * carrito y descarta los resultados cargados. Cuando no hay nada que reiniciar
 * el botón se deshabilita, para que su estado comunique si hay algo en juego.
 */
import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { brand } from '@/config/theme';
import type { ResetButtonProps } from '@/types';

export function ResetButton({ onReset, disabled = false }: ResetButtonProps) {
  const [confirmando, setConfirmando] = useState(false);

  const confirmar = () => {
    setConfirmando(false);
    onReset();
  };

  return (
    <>
      {/* El `span` permite que el tooltip funcione sobre un botón deshabilitado. */}
      <Tooltip title={disabled ? 'No hay nada que reiniciar' : 'Reiniciar aplicación'}>
        <span>
          <IconButton
            aria-label="Reiniciar aplicación"
            disabled={disabled}
            onClick={() => setConfirmando(true)}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: '#d6d6d6',
              color: '#050505',
              transition: 'background-color 150ms ease, transform 150ms ease',
              '&:hover': { backgroundColor: '#c4c4c4', transform: 'scale(1.05)' },
              '&.Mui-disabled': { backgroundColor: '#e4e4e4', color: '#9e9e9e' },
            }}
          >
            <i className="fa-solid fa-ellipsis-vertical" aria-hidden="true" />
          </IconButton>
        </span>
      </Tooltip>

      <Dialog open={confirmando} onClose={() => setConfirmando(false)}>
        <DialogTitle sx={{ color: brand.textStrong }}>
          Reiniciar la aplicación
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Se vaciará el carrito y se borrarán los resultados de búsqueda. Esta acción no
            se puede deshacer.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmando(false)} sx={{ color: brand.text }}>
            Cancelar
          </Button>
          <Button onClick={confirmar} variant="contained" autoFocus>
            Reiniciar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
