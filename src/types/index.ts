/**
 * Tipos compartidos de la aplicación.
 *
 * Se centralizan aquí para que los contratos entre capas (layout, dominio y
 * datos) sean visibles en un solo lugar y no queden dispersos entre componentes.
 */
import type { ReactNode } from "react";

/* Layout */
export interface HeaderProps {
  /** Acción del botón superior derecho. Reinicia la aplicación. */
  onReset?: () => void;
}

export interface AppLayoutProps {
  children?: ReactNode;
  onReset?: () => void;
}
