import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, CONTENT_MAX_WIDTH, spacing } from '../theme';

/**
 * Contenedor responsive: full-width móvil, centrado max 480px en web/tablet.
 * ISO 9241-11: legibilidad y líneas de lectura controladas en pantallas grandes.
 */
export default function ScreenContainer({
  children,
  style,
  edges = true,
  backgroundColor = colors.background,
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isWide = width > CONTENT_MAX_WIDTH;
  const horizontalPad = isWide ? spacing.xl : spacing.lg;

  return (
    <View
      style={[
        styles.root,
        { backgroundColor, paddingTop: edges ? 0 : insets.top },
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            maxWidth: CONTENT_MAX_WIDTH,
            paddingHorizontal: horizontalPad,
            alignSelf: isWide ? 'center' : 'stretch',
            width: isWide ? CONTENT_MAX_WIDTH : '100%',
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...(Platform.OS === 'web' ? { minHeight: '100vh' } : {}),
  },
  inner: {
    width: '100%',
  },
});
