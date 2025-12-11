import { GlobalStyles as MuiGlobalStyles } from '@mui/material';

export function GlobalStyles() {
  return (
    <MuiGlobalStyles
      styles={{
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          backgroundColor: '#f8fafc',
          color: '#1e293b',
        },
        a: {
          color: 'inherit',
          textDecoration: 'none',
        },
        '::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '::-webkit-scrollbar-track': {
          background: '#f1f5f9',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#cbd5e1',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#94a3b8',
        },
        '::selection': {
          background: '#6366f1',
          color: 'white',
        },
      }}
    />
  );
}
