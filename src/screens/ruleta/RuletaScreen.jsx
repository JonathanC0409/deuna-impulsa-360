import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DeunaButton from '../../components/DeunaButton';
import ScreenContainer from '../../components/ScreenContainer';
import RuletaWheel from '../../components/ruleta/RuletaWheel';
import { colors, spacing, radii, typography, shadows } from '../../theme';
import {
  PREMIOS,
  contarComprasUsuarioEnNegocio,
  crearGiro,
  determinarNivelGiro,
  ejecutarGiro,
  seleccionarPremio,
  ventaTieneGiro,
} from '../../services/ruletaService';

const SPIN_DURATION_MS = 4000;
const MIN_SPINS = 5;

const NIVEL_LABELS = {
  1: { label: 'Giro básico', desc: 'Compra desde $1', color: colors.primaryLight },
  2: { label: 'Giro mejorado', desc: 'Compra desde $5', color: '#E0F7F1' },
  3: { label: 'Giro especial', desc: '5.ª compra en el negocio', color: colors.primaryLight },
  4: { label: 'Giro premium', desc: 'Horario promocional', color: '#FFF8E6' },
};

function validarParams(params) {
  const requeridos = [
    ['ventaId', 'venta'],
    ['usuarioId', 'usuario'],
    ['negocioId', 'negocio'],
    ['montoVenta', 'monto'],
  ];

  const faltantes = requeridos.filter(([key]) => params?.[key] == null || params?.[key] === '');
  if (faltantes.length > 0) {
    return 'Faltan datos para girar. Vuelve desde el pago exitoso.';
  }
  return null;
}

export default function RuletaScreen({ navigation, route }) {
  const params = route?.params ?? {};
  const {
    ventaId,
    usuarioId,
    negocioId,
    montoVenta,
    nombreNegocio = 'Negocio aliado',
    esHorarioPromocional = false,
  } = params;

  const [cargando, setCargando] = useState(true);
  const [girando, setGirando] = useState(false);
  const [giroId, setGiroId] = useState(null);
  const [nivelGiro, setNivelGiro] = useState(0);
  const [puedeGirar, setPuedeGirar] = useState(false);
  const [yaUsado, setYaUsado] = useState(false);

  const rotacion = useRef(new Animated.Value(0)).current;
  const rotacionAcumulada = useRef(0);

  const mostrarError = useCallback(
    (titulo, mensaje) => {
      Alert.alert(titulo, mensaje, [{ text: 'Volver', onPress: () => navigation.goBack() }]);
    },
    [navigation]
  );

  const inicializarGiro = useCallback(async () => {
    const errorParams = validarParams(params);
    if (errorParams) {
      mostrarError('Datos incompletos', errorParams);
      return;
    }

    try {
      setCargando(true);
      const giroExistente = await ventaTieneGiro(ventaId);

      if (giroExistente) {
        setGiroId(giroExistente.IdGiroRuleta);
        setNivelGiro(giroExistente.Nivel);
        setYaUsado(Boolean(giroExistente.Usado));
        setPuedeGirar(!giroExistente.Usado);
        return;
      }

      const compras = await contarComprasUsuarioEnNegocio(usuarioId, negocioId);
      const nivel = determinarNivelGiro(
        Number(montoVenta),
        compras,
        Boolean(esHorarioPromocional)
      );

      if (nivel === 0) {
        mostrarError('Sin giro', 'La compra debe ser de al menos $1.');
        return;
      }

      const nuevo = await crearGiro({
        idVenta: ventaId,
        idCliente: usuarioId,
        nivelGiro: nivel,
        montoCompra: Number(montoVenta),
      });

      setGiroId(nuevo.IdGiroRuleta);
      setNivelGiro(nivel);
      setPuedeGirar(true);
      setYaUsado(false);
    } catch (error) {
      console.error('Ruleta init:', error);
      mostrarError('Error', error?.message ?? 'No se pudo cargar la ruleta.');
    } finally {
      setCargando(false);
    }
  }, [params, ventaId, usuarioId, negocioId, montoVenta, esHorarioPromocional, mostrarError]);

  useEffect(() => {
    inicializarGiro();
  }, [inicializarGiro]);

  const animarHastaPremio = (indicePremio) =>
    new Promise((resolve) => {
      const gradosSegmento = 360 / PREMIOS.length;
      const centro = indicePremio * gradosSegmento + gradosSegmento / 2;
      const destino = MIN_SPINS * 360 + (360 - centro);
      const valorFinal = rotacionAcumulada.current + destino;

      Animated.timing(rotacion, {
        toValue: valorFinal,
        duration: SPIN_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) rotacionAcumulada.current = valorFinal;
        resolve();
      });
    });

  const rotacionInterpolada = rotacion.interpolate({
    inputRange: [0, 10000],
    outputRange: ['0deg', '10000deg'],
    extrapolate: 'extend',
  });

  const handleGirar = async () => {
    if (!puedeGirar || girando || !giroId || yaUsado) return;

    setGirando(true);
    setPuedeGirar(false);

    try {
      const premioElegido = seleccionarPremio(nivelGiro);
      const indice = PREMIOS.findIndex((p) => p.id === premioElegido.id);
      await animarHastaPremio(indice >= 0 ? indice : 0);

      const { premio, recompensa } = await ejecutarGiro({
        idGiroRuleta: giroId,
        idCliente: usuarioId,
        nivelGiro,
        premioPreseleccionado: premioElegido,
      });

      setTimeout(() => {
        navigation.replace('ResultadoRecompensa', {
          premio: premio ?? premioElegido,
          recompensa,
          nombreNegocio,
          nivelGiro,
        });
      }, 400);
    } catch (error) {
      console.error('Girar:', error);
      setPuedeGirar(true);
      Alert.alert('Error', error?.message ?? 'No se pudo guardar tu premio.');
    } finally {
      setGirando(false);
    }
  };

  const nivelInfo = NIVEL_LABELS[nivelGiro];

  if (cargando) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Preparando tu ruleta...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenContainer>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>¡Gira y gana!</Text>
            <Text style={styles.heroSub}>Siempre ganas un premio · {nombreNegocio}</Text>
          </View>

          {nivelInfo ? (
            <View style={[styles.nivelCard, { backgroundColor: nivelInfo.color }]}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
              <View style={styles.nivelTextCol}>
                <Text style={styles.nivelTitle}>{nivelInfo.label}</Text>
                <Text style={styles.nivelDesc}>{nivelInfo.desc}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.wheelBox}>
            <RuletaWheel rotation={rotacionInterpolada} size={280} />
          </View>

          <View style={styles.garantia}>
            <Ionicons name="shield-checkmark" size={18} color={colors.cashback} />
            <Text style={styles.garantiaText}>
              Sin opción de perder — cashback o descuento en menos de 24 h
            </Text>
          </View>

          {yaUsado ? (
            <View style={styles.usadoBox}>
              <Text style={styles.usadoText}>Este giro ya fue utilizado</Text>
              <DeunaButton
                title="Ver mis recompensas"
                variant="outline"
                onPress={() => navigation.navigate?.('MisRecompensas') ?? navigation.goBack()}
                style={styles.btn}
              />
            </View>
          ) : (
            <DeunaButton
              title={girando ? 'Girando...' : 'Girar ruleta'}
              variant="cashback"
              onPress={handleGirar}
              disabled={!puedeGirar || girando}
              loading={girando}
              style={styles.btn}
            />
          )}

          <DeunaButton title="Volver" variant="outline" onPress={() => navigation.goBack()} />
        </ScreenContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.backgroundAlt },
  scroll: { paddingBottom: spacing.xxxl, paddingTop: spacing.md },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  loadingText: { ...typography.body },
  hero: { alignItems: 'center', marginBottom: spacing.lg },
  heroTitle: { ...typography.h1, color: colors.primary },
  heroSub: { ...typography.caption, marginTop: spacing.xs, textAlign: 'center' },
  nivelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radii.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nivelTextCol: { flex: 1 },
  nivelTitle: { ...typography.bodyBold, color: colors.primary },
  nivelDesc: { ...typography.caption, marginTop: 2 },
  wheelBox: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    ...shadows.cardElevated,
  },
  garantia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#E6FBF5',
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
  },
  garantiaText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.cashbackDark,
    lineHeight: 18,
  },
  btn: { marginBottom: spacing.md },
  usadoBox: { marginBottom: spacing.md },
  usadoText: {
    textAlign: 'center',
    ...typography.body,
    marginBottom: spacing.md,
  },
});
