import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import CashbackCard from '../../components/cliente/CashbackCard';
import { colors, spacing, radii, typography, shadows } from '../../components/cliente/clienteTheme';
import { MOCK_CLIENTE, MOCK_HISTORIAL } from '../../components/cliente/mockClienteData';

function CuentaRow({ titulo, monto, icon, iconBg, iconColor = colors.white }) {
  return (
    <View style={styles.cuentaRow}>
      <View style={[styles.cuentaIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.cuentaBody}>
        <Text style={styles.cuentaTitulo}>{titulo}</Text>
        <Text style={styles.cuentaMonto}>${monto.toFixed(2)}</Text>
      </View>
    </View>
  );
}

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
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenContainer style={styles.inner}>
          <Text style={styles.section}>Cuentas</Text>
          <View style={styles.cuentasCard}>
            <CuentaRow
              titulo={`Deuna ${MOCK_CLIENTE.cuentaEnmascarada}`}
              monto={MOCK_CLIENTE.saldoDisponible}
              icon="wallet"
              iconBg={colors.primary}
            />
            <View style={styles.separator} />
            <CuentaRow
              titulo="******5883"
              monto={0.38}
              icon="card"
              iconBg="#FFEB3B"
              iconColor={colors.text}
            />
          </View>

          <Pressable style={styles.linkRow}>
            <Text style={styles.linkText}>No veo todas mis cuentas</Text>
            <Ionicons name="open-outline" size={16} color={colors.link} />
          </Pressable>

          <CashbackCard monto={MOCK_CLIENTE.cashbackAcumulado} compact style={styles.block} />

          <Text style={styles.section}>Historial</Text>
          <View style={styles.historialCard}>
            {MOCK_HISTORIAL.map((item, index) => (
              <View key={item.id}>
                <HistorialItem item={item} />
                {index < MOCK_HISTORIAL.length - 1 ? <View style={styles.sepInner} /> : null}
              </View>
            ))}
          </View>
        </ScreenContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  inner: {
    paddingTop: spacing.sm,
  },
  section: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  cuentasCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.card,
  },
  cuentaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  cuentaIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cuentaBody: {
    flex: 1,
  },
  cuentaTitulo: {
    ...typography.bodyBold,
    fontSize: 15,
  },
  cuentaMonto: {
    ...typography.caption,
    marginTop: 2,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xl,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.link,
    textDecorationLine: 'underline',
  },
  block: {
    marginBottom: spacing.xl,
  },
  historialCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  movRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  movIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  movBody: {
    flex: 1,
  },
  movDesc: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  movFecha: {
    ...typography.caption,
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
  sepInner: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.lg,
  },
});
