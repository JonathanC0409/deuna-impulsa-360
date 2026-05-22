import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, radii } from './clienteTheme';

export default function CashbackCard({
  monto,
  label = 'Cashback acumulado',
  compact = false,
  style,
}) {
  const formatted = typeof monto === 'number' ? monto.toFixed(2) : monto;

  return (
    <View style={[styles.card, compact && styles.cardCompact, style]}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles" size={compact ? 18 : 22} color={colors.white} />
        </View>
        <View style={styles.textBlock}>
          <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
          <Text style={[styles.amount, compact && styles.amountCompact]}>${formatted}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cashback,
    borderRadius: radii.lg,
    padding: 18,
    ...shadows.card,
  },
  cardCompact: {
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  labelCompact: {
    fontSize: 12,
  },
  amount: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginTop: 2,
  },
  amountCompact: {
    fontSize: 22,
  },
});
