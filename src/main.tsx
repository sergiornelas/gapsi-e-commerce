import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ApolloProvider } from '@apollo/client/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import App from '@/App';
import { theme } from '@/config/theme';
import { apolloClient } from '@/graphql/apolloClient';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        {/* Normaliza estilos del navegador y aplica el fondo del tema. */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>,
);
