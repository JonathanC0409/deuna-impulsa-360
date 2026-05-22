import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SaldoCard from '../../components/cliente/SaldoCard';
import CashbackCard from '../../components/cliente/CashbackCard';
import { colors, spacing } from '../../components/cliente/clienteTheme';
import { MOCK_CLIENTE, MOCK_HISTORIAL } from '../../components/cliente/mockClienteData';

function HistorialItem({ item }) {
  const esIngreso = item.monto > 0;
  const icon =
    item.tipo === 'cashback'
      ? 'sparkles'
      : item.tipo === 'recarga'
        ? 'add-circle-outline'
        : 'cart-outline';

  return (
    <View style={styles.movRow}>
      <View style={styles.movIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.movBody}>
        <Text style={styles.movDesc}>{item.desc}</Text>
        <Text style={styles.movFecha}>{item.fecha}</Text>
      </View>
      <Text style={[styles.movMonto, esIngreso ? styles.montoPos : styles.montoNeg]}>
        {esIngreso ? '+' : ''}${Math.abs(item.monto).toFixed(2)}
      </Text>
    </View>
  );
}

export default function BilleteraScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cuentaHeader}>
          <Ionicons name="logo-usd" size={20} color={colors.primary} />
          <Text style={styles.cuentaTitulo}>Cuenta Deuna</Text>
        </View>

        <SaldoCard saldo={MOCK_CLIENTE.saldoDisponible} style={styles.block} />
        <CashbackCard monto={MOCK_CLIENTE.cashbackAcumulado} compact style={styles.block} />

        <Text style={styles.section}>Historial</Text>
        <View style={styles.historialCard}>
          {MOCK_HISTORIAL.map((item, index) => (
            <View key={item.id}>
              <HistorialItem item={item} />
              {index < MOCK_HISTORIAL.length - 1 ? <View style={styles.separator} /> : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 32,
  },
  cuentaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  cuentaTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  block: {
    marginBottom: spacing.md,
  },
  section: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  historialCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  movRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  movIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  movBody: {
    flex: 1,
  },
  movDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  movFecha: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  movMonto: {
    fontSize: 15,
    fontWeight: '700',
  },
  montoPos: {
    color: colors.cashback,
  },
  montoNeg: {
    color: colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
});
