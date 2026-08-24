import { createTheme } from "@mui/material/styles";

export const brand = {
  primary: "#0050b0",
  accent: "#0098c8",
  success: "#00b858",
  badge: "#9af800",
  badgeText: "#e00000",
  pageBackground: "#c7c7c7",
  surface: "#fafafa",
  headerBackground: "#f2f2f2",
  text: "#6f6f6f",
  textStrong: "#4a4a4a",
  border: "#e0e0e0",
} as const;

export const theme = createTheme({
  palette: {
    primary: { main: brand.primary },
    secondary: { main: brand.accent },
    success: { main: brand.success },
    background: { default: brand.pageBackground, paper: brand.surface },
    text: { primary: brand.text, secondary: brand.textStrong },
    divider: brand.border,
  },
  typography: {
    fontFamily: ["Roboto", "Helvetica Neue", "Arial", "sans-serif"].join(","),
    // El diseño usa pesos ligeros en títulos y precios.
    h1: { fontSize: "1.75rem", fontWeight: 300, letterSpacing: "0.01em" },
    h2: { fontSize: "1.25rem", fontWeight: 300 },
    body2: { fontSize: "0.8125rem" },
    caption: { fontSize: "0.75rem" },
  },
  shape: { borderRadius: 4 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: brand.pageBackground },

        // Barra de scroll discreta, a tono con el diseño. Se define aquí y no
        // por componente para que cualquier área desplazable la herede.
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: '#bdbdbd',
          borderRadius: 8,
          border: '3px solid transparent',
          backgroundClip: 'content-box',
        },
        '*::-webkit-scrollbar-thumb:hover': { backgroundColor: '#9e9e9e' },
        // Equivalente estándar para navegadores que no usan el prefijo.
        '*': { scrollbarWidth: 'thin', scrollbarColor: '#bdbdbd transparent' },

        // Anillo de foco uniforme para quien navega con teclado.
        '*:focus-visible': {
          outline: `2px solid ${brand.accent}`,
          outlineOffset: 2,
        },
      },
    },

    MuiTooltip: {
      defaultProps: { arrow: true, enterDelay: 400 },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500 },
      },
    },
  },
});
