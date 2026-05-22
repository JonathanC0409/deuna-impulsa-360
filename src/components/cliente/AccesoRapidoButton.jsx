import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, shadows, spacing, typography, MIN_TOUCH_TARGET } from './clienteTheme';

const ICON_MAP = {
  star: 'star-outline',
  wallet: 'wallet-outline',
  gift: 'gift-outline',
  aperture: 'aperture-outline',
  qr: 'qr-code-outline',
  card: 'card-outline',
  storefront: 'storefront-outline',
  pricetag: 'pricetag-outline',
  train: 'train-outline',
};

export default function AccesoRapidoButton({ label, icono = 'star', onPress }) {
  const iconName = ICON_MAP[icono] ?? 'ellipse-outline';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.tile}>
        <Ionicons name={iconName} size={26} color={colors.primary} />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '23%',
    minWidth: 72,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  tile: {
    width: 64,
    height: 64,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    minHeight: MIN_TOUCH_TARGET,
    minWidth: MIN_TOUCH_TARGET,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 14,
  },
});
