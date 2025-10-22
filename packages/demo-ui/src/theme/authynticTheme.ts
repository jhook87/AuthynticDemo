export const authynticTheme = {
  colors: {
    secure: '#27AE60',
    warning: '#F39C12',
    critical: '#E74C3C',
    background: '#050b14',
    foreground: '#ecf0f1',
  },
  typography: {
    family: '"IBM Plex Sans", "Segoe UI", sans-serif',
    baseSize: '16px',
  },
  animation: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type AuthynticTheme = typeof authynticTheme;
