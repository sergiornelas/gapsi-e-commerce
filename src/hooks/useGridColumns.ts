import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { GRID_COLUMNS } from "@/constants";

/**
 * Número de columnas de la retícula según el ancho de pantalla.
 *
 * El dato se calcula en JavaScript y no solo en CSS porque el scroll virtual
 * necesita saber cuántos productos entran por fila para poder agruparlos.
 */
export const useGridColumns = (): number => {
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.up("md"));
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  if (isMedium) {
    return GRID_COLUMNS.md;
  }
  if (isSmall) {
    return GRID_COLUMNS.sm;
  }

  return GRID_COLUMNS.xs;
};
