import { Platform, ViewStyle } from 'react-native';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const COLORS = {
  primary: '#2563EB', // Blue 600 - Standard modern primary
  primaryDark: '#1E40AF',
  secondary: '#64748B', // Slate 500
  background: '#F8FAFC', // Slate 50 - Very light background
  surface: '#FFFFFF',
  text: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textTertiary: '#94A3B8', // Slate 400
  white: '#FFFFFF',
  border: '#E2E8F0', // Slate 200
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
};

export const LAYOUT = {
  gridUnit: 8,
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  maxWidth: 600, // For easier reading on tablets/web
};

export const SHADOWS = {
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
    web: {
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    },
  }) as ViewStyle,
  
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    },
  }) as ViewStyle,

  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.08,
      shadowRadius: 15,
    },
    android: {
      elevation: 10,
    },
    web: {
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    },
  }) as ViewStyle,
};

export const TYPOGRAPHY = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'System', // Roboto default
    web: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  }),
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};
