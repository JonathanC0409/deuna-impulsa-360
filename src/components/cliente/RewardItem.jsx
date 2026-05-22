import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, radii } from './clienteTheme';

const ESTADO_STYLES = {
  disponible: {
    bg: colors.primaryLight,
    text: colors.primary,
    label: 'Disponible',
  },
  canjeada: {
    bg: colors.surface,
    text: colors.textMuted,
    label: 'Canjeada',
  },
  expirada: {
    bg: '#FFF0F3',
    text: colors.danger,
    label: 'Expirada',
  },
};

export default function RewardItem({ titulo, negocio, estado = 'disponible', fecha, onPress }) {
  const badge = ESTADO_STYLES[estado] ?? ESTADO_STYLES.disponible;

  const inner = (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="ribbon-outline" size={22} color={colors.turquoise} />
      </View>
      <View style={styles.body}>
        <Text style={styles.titulo}>{titulo}</Text>
        {negocio ? <Text style={styles.negocio}>{negocio}</Text> : null}
        {fecha ? <Text style={styles.fecha}>{fecha}</Text> : null}
      </View>
      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
        <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
        {inner}
      </Pressable>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  negocio: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  fecha: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
