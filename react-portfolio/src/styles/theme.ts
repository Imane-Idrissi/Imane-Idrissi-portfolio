export const lightTheme = {
  colors: {
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    secondary: '#64748b',
    background: '#FFFFFF',
    surface: '#F8F8FA',
    text: '#1C1917',
    textSecondary: '#57534E',
    border: '#E7E5E4',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: '#818CF8',
    primaryHover: '#6366F1',
    secondary: '#94a3b8',
    background: '#1C1917',
    surface: '#292524',
    text: '#FAFAF9',
    textSecondary: '#A8A29E',
    border: '#44403C',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export type Theme = typeof lightTheme;