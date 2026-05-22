import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DeunaButton from '../../components/DeunaButton';
import CashbackCard from '../../components/cliente/CashbackCard';
import { colors, spacing } from '../../components/cliente/clienteTheme';
import { MOCK_PAGO } from '../../components/cliente/mockClienteData';
import { useAuth } from '../../context/AuthContext';
import { irARuleta } from '../../navigation/ruletaNavigation';
import { navigateSafe } from '../../navigation/appRoutes';

export default function PagoExitosoScreen({ navigation, route }) {
  const router = useRouter();
  const { usuario } = useAuth();
  const comercio = route?.params?.comercio ?? route?.params?.nombreNegocio ?? MOCK_PAGO.comercio;
  const monto = Number(route?.params?.monto ?? route?.params?.total ?? MOCK_PAGO.monto);
  const cashback = Number(
    route?.params?.cashback ?? route?.params?.cashbackGanado ?? monto * 0.05
  );

  const ventaId = route?.params?.ventaId ? Number(route.params.ventaId) : null;
  const negocioId = route?.params?.negocioId ? Number(route.params.negocioId) : null;
  const esHorarioPromocional = route?.params?.esHorarioPromocional === true
    || route?.params?.esHorarioPromocional === 'true';

  const irRuleta = () => {
    if (!ventaId || !usuario?.IdUsuario || !negocioId) {
      navigateSafe(router, 'ClienteTabs');
      return;
    }

    irARuleta(router, {
      ventaId,
      usuarioId: usuario.IdUsuario,
      negocioId,
      montoVenta: monto,
      nombreNegocio: comercio,
      esHorarioPromocional,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={72} color={colors.success} />
        </View>
        <Text style={styles.title}>¡Pago exitoso!</Text>
        <Text style={styles.status}>Confirmado con Deuna</Text>

        <View style={styles.detailCard}>
          <Text style={styles.merchantLabel}>Comercio</Text>
          <Text style={styles.merchant}>{comercio}</Text>
          <View style={styles.divider} />
          <Text style={styles.amountLabel}>Monto pagado</Text>
          <Text style={styles.amount}>${monto.toFixed(2)}</Text>
        </View>

        <CashbackCard
          monto={cashback}
          label="Cashback estimado en esta compra"
          compact
          style={styles.cashback}
        />

        {ventaId ? (
          <>
            <View style={styles.giroBanner}>
              <Text style={styles.giroBannerTitle}>🎡 ¡Ganaste un giro en la ruleta!</Text>
              <Text style={styles.giroHint}>
                Tu pago de ${monto.toFixed(2)} fue registrado. Gira ahora y guarda tu premio en
                Supabase.
              </Text>
            </View>
            <DeunaButton
              title="Girar ruleta ahora"
              variant="cashback"
              onPress={irRuleta}
              style={styles.btn}
            />
          </>
        ) : (
          <DeunaButton
            title="Volver al inicio"
            variant="cashback"
            onPress={() => navigation.navigate('ClienteTabs')}
            style={styles.btn}
          />
        )}
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
    marginBottom: spacing.md,
  },
  giroBanner: {
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  giroBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  giroHint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  btn: {
    marginBottom: 12,
  },
});
