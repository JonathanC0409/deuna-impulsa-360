import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DeunaButton from '../../components/DeunaButton';
import CashbackCard from '../../components/cliente/CashbackCard';
import { colors, spacing } from '../../components/cliente/clienteTheme';
import { MOCK_PAGO } from '../../components/cliente/mockClienteData';

export default function PagoExitosoScreen({ navigation, route }) {
  const comercio = route?.params?.comercio ?? MOCK_PAGO.comercio;
  const monto = route?.params?.monto ?? MOCK_PAGO.monto;
  const cashback = route?.params?.cashback ?? MOCK_PAGO.cashbackGanado;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        </View>
        <Text style={styles.title}>¡Pago exitoso!</Text>
        <Text style={styles.status}>Confirmado</Text>

        <View style={styles.detailCard}>
          <Text style={styles.merchantLabel}>Comercio</Text>
          <Text style={styles.merchant}>{comercio}</Text>
          <View style={styles.divider} />
          <Text style={styles.amountLabel}>Monto pagado</Text>
          <Text style={styles.amount}>${monto.toFixed(2)}</Text>
        </View>

        <CashbackCard
          monto={cashback}
          label="Cashback ganado en esta compra"
          compact
          style={styles.cashback}
        />

        <DeunaButton
          title="Girar ruleta"
          variant="cashback"
          onPress={() => navigation.getParent()?.navigate('Ruleta')}
          style={styles.btn}
        />
        <DeunaButton
          title="Volver al inicio"
          variant="outline"
          onPress={() => navigation.navigate('ClienteTabs')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  iconCircle: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
  },
  status: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.success,
    marginTop: 6,
    marginBottom: spacing.xl,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  merchantLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  merchant: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  amountLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
  },
  cashback: {
    marginBottom: spacing.lg,
  },
  btn: {
    marginBottom: 12,
  },
});
