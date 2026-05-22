import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii } from './clienteTheme';

const ICON_MAP = {
  star: 'star-outline',
  wallet: 'wallet-outline',
  gift: 'gift-outline',
  aperture: 'aperture-outline',
  qr: 'qr-code-outline',
  card: 'card-outline',
};

export default function AccesoRapidoButton({ label, icono = 'star', onPress }) {
  const iconName = ICON_MAP[icono] ?? 'ellipse-outline';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
    >
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={24} color={colors.primary} />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    minWidth: 72,
    maxWidth: 88,
  },
  pressed: {
    opacity: 0.75,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
