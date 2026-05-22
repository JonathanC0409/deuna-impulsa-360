import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows, radii } from './clienteTheme';

export default function SaldoCard({ saldo, label = 'Saldo disponible', style }) {
  const formatted = typeof saldo === 'number' ? saldo.toFixed(2) : saldo;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="wallet-outline" size={22} color={colors.primary} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.amount}>${formatted}</Text>
      <Text style={styles.hint}>Cuenta Deuna</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  amount: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
});
