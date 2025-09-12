export interface Theme {
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    border: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    warning: string;
    warningForeground: string;
    success: string;
    successForeground: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: TextStyle;
    h2: TextStyle;
    h3: TextStyle;
    body: TextStyle;
    bodySmall: TextStyle;
    caption: TextStyle;
  };
}

interface TextStyle {
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
}

export const lightTheme: Theme = {
  colors: {
    primary: '#2563eb',
    primaryForeground: '#ffffff',
    secondary: '#e2e8f0',
    secondaryForeground: '#0f172a',
    background: '#ffffff',
    foreground: '#0f172a',
    card: '#ffffff',
    cardForeground: '#0f172a',
    border: '#e2e8f0',
    muted: '#f1f5f9',
    mutedForeground: '#64748b',
    accent: '#f1f5f9',
    accentForeground: '#0f172a',
    destructive: '#dc2626',
    destructiveForeground: '#ffffff',
    warning: '#ea580c',
    warningForeground: '#ffffff',
    success: '#16a34a',
    successForeground: '#ffffff',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16,
    },
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#3b82f6',
    primaryForeground: '#ffffff',
    secondary: '#374151',
    secondaryForeground: '#f9fafb',
    background: '#111827',
    foreground: '#f9fafb',
    card: '#1f2937',
    cardForeground: '#f9fafb',
    border: '#374151',
    muted: '#1f2937',
    mutedForeground: '#9ca3af',
    accent: '#374151',
    accentForeground: '#f9fafb',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    warning: '#f97316',
    warningForeground: '#ffffff',
    success: '#22c55e',
    successForeground: '#ffffff',
  },
};