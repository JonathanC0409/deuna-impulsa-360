import { Platform } from 'react-native';

/** ISO 9241-11 — área táctil mínima recomendada 44×44 pt */
export const MIN_TOUCH_TARGET = 44;

/** Ancho máximo contenido (web/tablet centrado, sensación app móvil) */
export const CONTENT_MAX_WIDTH = 480;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  sheet: 28,
  full: 999,
};

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#4B2185',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {
      boxShadow: '0 2px 12px rgba(75, 33, 133, 0.08)',
    },
  }),
  cardElevated: Platform.select({
    ios: {
      shadowColor: '#4B2185',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {
      boxShadow: '0 4px 16px rgba(75, 33, 133, 0.12)',
    },
  }),
  tabBar: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    android: { elevation: 8 },
    default: {
      boxShadow: '0 -1px 0 #EEEEEE',
    },
  }),
};

export const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 };
