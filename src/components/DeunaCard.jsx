import { View, StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing } from '../theme';

export default function DeunaCard({ children, style, elevated = false }) {
  return (
    <View style={[styles.card, elevated && styles.elevated, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  elevated: {
    ...shadows.cardElevated,
  },
});
