/**
 * Flecha curva que señala la zona del carrito, como en el diseño entregado.
 *
 * Se dibuja en SVG en lugar de usar un icono de la tipografía porque ninguno
 * reproduce la curva del mockup. El trazo se anima con un vaivén sutil para
 * atraer la mirada hacia el carrito cuando aún está vacío.
 */
import Box from '@mui/material/Box';

import { brand } from '@/config/theme';

interface GuideArrowProps {
  /** La flecha solo orienta mientras el carrito está vacío. */
  visible: boolean;
}

export function GuideArrow({ visible }: GuideArrowProps) {
  return (
    <Box
      component="svg"
      viewBox="0 0 64 48"
      aria-hidden="true"
      sx={{
        // En pantallas angostas el espacio es para la zona de arrastre: la
        // flecha se oculta antes que comprimirla.
        display: { xs: 'none', sm: 'block' },
        width: 58,
        height: 44,
        flexShrink: 0,
        color: brand.success,
        opacity: visible ? 1 : 0,
        transition: 'opacity 300ms ease',
        // El vaivén se detiene solo cuando la flecha deja de ser útil.
        animation: visible ? 'empujon 1.8s ease-in-out infinite' : 'none',
        '@keyframes empujon': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(6px)' },
        },
      }}
    >
      {/* Cuerpo curvo de la flecha. */}
      <path
        d="M4 44C10 22 26 8 54 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {/* Punta. */}
      <path d="M40 0 L60 8 L40 18 Z" fill="currentColor" />
    </Box>
  );
}
