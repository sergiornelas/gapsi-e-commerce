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
      },
    },
  },
});
