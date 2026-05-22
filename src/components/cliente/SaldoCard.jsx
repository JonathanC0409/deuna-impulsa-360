import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, radii, spacing, typography, hitSlop } from './clienteTheme';

export default function SaldoCard({
  saldo,
  label = 'Saldo disponible',
  gasto30dias,
  onVerDetalle,
  style,
}) {
  const [visible, setVisible] = useState(true);
  const formatted = typeof saldo === 'number' ? saldo.toFixed(2) : saldo;
  const display = visible ? `$${formatted}` : '$••••';

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Pressable
            onPress={() => setVisible((v) => !v)}
            hitSlop={hitSlop}
            accessibilityLabel={visible ? 'Ocultar saldo' : 'Mostrar saldo'}
          >
            <Ionicons
              name={visible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        </View>
        {onVerDetalle ? (
          <Pressable onPress={onVerDetalle} hitSlop={hitSlop}>
            <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.amount}>{display}</Text>

      {gasto30dias != null ? (
        <View style={styles.banner}>
          <Ionicons name="stats-chart" size={16} color={colors.primary} />
          <Text style={styles.bannerText}>
            Gastaste $ {gasto30dias} los últimos 30 días
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
  },
  amount: {
    ...typography.amount,
    color: colors.text,
    marginBottom: spacing.md,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    lineHeight: 18,
  },
});
