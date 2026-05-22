import { Platform } from 'react-native';

/** Familia sans-serif nativa por plataforma (sin dependencias extra) */
export const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default:
    'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
});

/** Escala tipográfica Deuna — jerarquía clara (ISO 9241-210) */
export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 16,
  lg: 17,
  xl: 18,
  xxl: 22,
  display: 26,
  hero: 34,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.55,
};

export const typography = {
  hero: {
    fontFamily,
    fontSize: fontSize.display,
    fontWeight: fontWeight.extrabold,
    color: '#1A1A1A',
    letterSpacing: -0.3,
  },
  h1: {
    fontFamily,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    color: '#1A1A1A',
  },
  h2: {
    fontFamily,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: '#1A1A1A',
  },
  h3: {
    fontFamily,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: '#1A1A1A',
  },
  body: {
    fontFamily,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    color: '#757575',
    lineHeight: fontSize.md * lineHeight.relaxed,
  },
  bodyBold: {
    fontFamily,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: '#1A1A1A',
  },
  caption: {
    fontFamily,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    color: '#757575',
  },
  label: {
    fontFamily,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: '#757575',
  },
  button: {
    fontFamily,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
  },
  tab: {
    fontFamily,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  amount: {
    fontFamily,
    fontSize: fontSize.hero,
    fontWeight: fontWeight.extrabold,
    letterSpacing: -0.5,
  },
  amountSm: {
    fontFamily,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    letterSpacing: -0.3,
  },
};
