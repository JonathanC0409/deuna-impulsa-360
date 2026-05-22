import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DeunaButton from '../../components/DeunaButton';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, spacing, radii, typography, shadows } from '../../theme';
import { useAuth } from '../../context/AuthContext';

const NIVEL_LABELS = {
  1: 'Giro básico',
  2: 'Giro mejorado',
  3: 'Giro especial',
  4: 'Giro premium',
};

const TIPO_ICON = {
  cashback: 'cash',
  descuento: 'pricetag',
  giro_premium: 'aperture',
  sorpresa: 'gift',
};

function formatearValor(premio) {
  if (premio?.tipo === 'cashback' && premio.valor != null) {
    return `$${Number(premio.valor).toFixed(2)}`;
  }
  if (premio?.tipo === 'descuento' && premio.valor != null) {
    return `${premio.valor}% OFF`;
  }
  if (premio?.tipo === 'giro_premium') return 'Giro premium';
  return 'Premio sorpresa';
}

export default function ResultadoRecompensaScreen({ navigation, route }) {
  const router = useRouter();
  const { limpiarGiroBienvenida } = useAuth();
  const { premio, recompensa, nombreNegocio, nivelGiro } = route?.params ?? {};

  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    limpiarGiroBienvenida?.();
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [limpiarGiroBienvenida, opacity, scale]);

  const irInicio = () => router.replace('/cliente');
  const irRecompensas = () => router.push('/cliente/mis-recompensas');

  if (!premio?.label) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenContainer style={styles.centered}>
          <Text style={styles.errorTitle}>Premio no disponible</Text>
          <DeunaButton title="Volver al inicio" onPress={irInicio} />
        </ScreenContainer>
      </SafeAreaView>
    );
  }

  const iconName = TIPO_ICON[premio.tipo] ?? 'gift';

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenContainer style={styles.content}>
        <Animated.View style={{ transform: [{ scale }], opacity, width: '100%' }}>
          <View style={styles.confettiCircle}>
            <Text style={styles.confettiEmoji}>🎉</Text>
          </View>

          <Text style={styles.title}>¡Felicidades!</Text>
          <Text style={styles.sub}>Ganaste en {nombreNegocio ?? 'tu compra'}</Text>
          {nivelGiro ? (
            <View style={styles.nivelPill}>
              <Text style={styles.nivelPillText}>
                {NIVEL_LABELS[nivelGiro] ?? `Nivel ${nivelGiro}`}
              </Text>
            </View>
          ) : null}

          <View style={styles.premioCard}>
            <View style={styles.premioIconWrap}>
              <Ionicons name={iconName} size={32} color={colors.white} />
            </View>
            <Text style={styles.premioLabel}>{premio.label}</Text>
            <Text style={styles.premioValor}>{formatearValor(premio)}</Text>
            <View style={styles.estadoRow}>
              <Ionicons name="checkmark-circle" size={18} color={colors.cashback} />
              <Text style={styles.estadoText}>
                {recompensa?.estado === 'disponible' || recompensa?.Estado === 'Pendiente'
                  ? 'Acreditación en menos de 24 horas'
                  : 'Guardado en tu cuenta'}
              </Text>
            </View>
          </View>
        </Animated.View>

        <DeunaButton title="Ver mis recompensas" onPress={irRecompensas} style={styles.btn} />
        <DeunaButton title="Volver al inicio" variant="outline" onPress={irInicio} />
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primaryLight },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  centered: { flex: 1, justifyContent: 'center' },
  confettiCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  confettiEmoji: { fontSize: 40 },
  title: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
  },
  sub: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  nivelPill: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  nivelPillText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  premioCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.cardElevated,
  },
  premioIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.cashback,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  premioLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  premioValor: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.cashback,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  estadoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#E6FBF5',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
  },
  estadoText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.cashbackDark,
    flex: 1,
  },
  btn: { marginBottom: spacing.md },
  errorTitle: { ...typography.h2, marginBottom: spacing.lg },
});
