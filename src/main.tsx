import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './app.tsx';

const theme = createTheme({});

// Lock orientation to portrait on supported devices (e.g. Android PWA)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(screen.orientation as any)?.lock?.('portrait').catch(() => {});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
