import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import {
  PREMIOS,
  contarComprasUsuarioEnNegocio,
  crearGiro,
  determinarNivelGiro,
  ejecutarGiro,
  ventaTieneGiro,
} from '../../services/ruletaService';

const COLORS = {
  background: '#F8F7FF',
  primary: '#7C3AED',
  cashback: '#00C896',
  text: '#1E1E1E',
  textMuted: '#6F6F7A',
  white: '#FFFFFF',
};

const SEGMENT_COLORS = ['#7C3AED', '#A78BFA', '#00C896', '#FBBF24', '#F472B6', '#60A5FA'];

const SPIN_DURATION_MS = 3200;
const MIN_SPINS = 4;

const NIVEL_LABELS = {
  1: 'Giro básico',
  2: 'Giro mejorado',
  3: 'Giro especial',
  4: 'Giro premium',
};

function validarParams(params) {
  const requeridos = [
    ['ventaId', 'ID de venta'],
    ['usuarioId', 'ID de usuario'],
    ['negocioId', 'ID de negocio'],
    ['montoVenta', 'monto de la venta'],
    ['nombreNegocio', 'nombre del negocio'],
  ];

  const faltantes = requeridos.filter(([key]) => params?.[key] == null || params?.[key] === '');
  if (faltantes.length > 0) {
    return `Faltan datos para la ruleta: ${faltantes.map(([, label]) => label).join(', ')}.`;
  }

  if (Number.isNaN(Number(params.montoVenta))) {
    return 'El monto de la venta no es válido.';
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
    nombreNegocio,
    esHorarioPromocional = false,
  } = params;

  const [cargando, setCargando] = useState(true);
  const [girando, setGirando] = useState(false);
  const [giroId, setGiroId] = useState(null);
  const [nivelGiro, setNivelGiro] = useState(0);
  const [puedeGirar, setPuedeGirar] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState('');

  const rotacion = useRef(new Animated.Value(0)).current;
  const rotacionActual = useRef(0);

  const mostrarError = useCallback((titulo, mensaje) => {
    Alert.alert(titulo, mensaje, [
      { text: 'Volver', onPress: () => navigation.goBack() },
    ]);
  }, [navigation]);

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
        setGiroId(giroExistente.id);
        setNivelGiro(giroExistente.nivel);

        if (giroExistente.usado) {
          setPuedeGirar(false);
          setMensajeEstado('Este giro ya fue utilizado para esta venta.');
          Alert.alert(
            'Giro ya usado',
            'Ya giraste la ruleta con esta compra. Revisa tus recompensas.',
          );
          return;
        }

        setPuedeGirar(true);
        setMensajeEstado(`${NIVEL_LABELS[giroExistente.nivel] ?? 'Giro'} — ¡presiona para girar!`);
        return;
      }

      const comprasEnNegocio = await contarComprasUsuarioEnNegocio(usuarioId, negocioId);
      const nivel = determinarNivelGiro(
        Number(montoVenta),
        comprasEnNegocio,
        Boolean(esHorarioPromocional),
      );

      if (nivel === 0) {
        mostrarError(
          'Sin giro disponible',
          'La compra debe ser de al menos $1 para obtener un giro en la ruleta.',
        );
        return;
      }

      const nuevoGiro = await crearGiro({
        ventaId,
        usuarioId,
        negocioId,
        nivelGiro: nivel,
      });

      setGiroId(nuevoGiro.id);
      setNivelGiro(nivel);
      setPuedeGirar(true);
      setMensajeEstado(`${NIVEL_LABELS[nivel] ?? 'Giro'} — ¡presiona para girar!`);
    } catch (error) {
      console.error('RuletaScreen init:', error);
      mostrarError(
        'Error de conexión',
        error?.message ?? 'No pudimos preparar tu giro. Intenta de nuevo más tarde.',
      );
    } finally {
      setCargando(false);
    }
  }, [params, ventaId, usuarioId, negocioId, montoVenta, esHorarioPromocional, mostrarError]);

  useEffect(() => {
    inicializarGiro();
  }, [inicializarGiro]);

  const animarRuleta = (indicePremio) =>
    new Promise((resolve) => {
      const gradosPorSegmento = 360 / PREMIOS.length;
      const centroSegmento = indicePremio * gradosPorSegmento + gradosPorSegmento / 2;
      const destino = MIN_SPINS * 360 + (360 - centroSegmento);
      const valorFinal = rotacionActual.current + destino;

      Animated.timing(rotacion, {
        toValue: valorFinal,
        duration: SPIN_DURATION_MS,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          rotacionActual.current = valorFinal % 360;
        }
        resolve();
      });
    });

  const handleGirar = async () => {
    if (!puedeGirar || girando || !giroId) return;

    setGirando(true);
    setPuedeGirar(false);

    try {
      const indiceAnimacion = Math.floor(Math.random() * PREMIOS.length);
      await animarRuleta(indiceAnimacion);

      const { premio, recompensa } = await ejecutarGiro({
        giroId,
        usuarioId,
        negocioId,
        nivelGiro,
      });

      navigation.replace('ResultadoRecompensa', {
        premio,
        recompensa,
        nombreNegocio,
        nivelGiro,
      });
    } catch (error) {
      console.error('RuletaScreen girar:', error);
      setPuedeGirar(true);
      Alert.alert(
        'No se pudo completar el giro',
        error?.message ?? 'Ocurrió un error al guardar tu premio. Intenta de nuevo.',
      );
    } finally {
      setGirando(false);
    }
  };

  const rotacionInterpolada = rotacion.interpolate({
    inputRange: [0, 3600],
    outputRange: ['0deg', '3600deg'],
    extrapolate: 'extend',
  });

  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Preparando tu giro...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.tituloPantalla}>¡Gira y gana!</Text>
        <Text style={styles.subtitulo}>{nombreNegocio}</Text>

        <DeunaCard style={styles.wheelCard}>
          <View style={styles.pointerWrap}>
            <View style={styles.pointer} />
          </View>

          <Animated.View
            style={[styles.wheel, { transform: [{ rotate: rotacionInterpolada }] }]}
          >
            {PREMIOS.map((premio, index) => {
              const angle = (360 / PREMIOS.length) * index;
              return (
                <View
                  key={premio.id}
                  style={[
                    styles.segment,
                    {
                      backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
                      transform: [{ rotate: `${angle}deg` }],
                    },
                  ]}
                >
                  <Text style={styles.segmentText} numberOfLines={2}>
                    {premio.label.split(' ')[0]}
                  </Text>
                </View>
              );
            })}
            <View style={styles.wheelCenter}>
              <Text style={styles.wheelCenterEmoji}>🎡</Text>
            </View>
          </Animated.View>
        </DeunaCard>

        {nivelGiro > 0 && (
          <View style={styles.nivelBadge}>
            <Text style={styles.nivelBadgeText}>
              {NIVEL_LABELS[nivelGiro] ?? `Nivel ${nivelGiro}`}
            </Text>
          </View>
        )}

        {mensajeEstado ? <Text style={styles.hint}>{mensajeEstado}</Text> : null}

        <DeunaButton
          title={girando ? 'Girando...' : 'Girar ruleta'}
          variant="cashback"
          onPress={handleGirar}
          disabled={!puedeGirar || girando}
          loading={girando}
          style={styles.btnGirar}
        />
      </View>
    </SafeAreaView>
  );
}

const WHEEL_SIZE = 280;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: 12,
  },
  tituloPantalla: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginBottom: 20,
  },
  wheelCard: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginBottom: 16,
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  pointerWrap: {
    position: 'absolute',
    top: 18,
    zIndex: 10,
    alignSelf: 'center',
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 22,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.primary,
  },
  wheel: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: COLORS.white,
  },
  segment: {
    position: 'absolute',
    width: '50%',
    height: '50%',
    left: '50%',
    top: 0,
    transformOrigin: 'left bottom',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
    paddingHorizontal: 4,
  },
  segmentText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.white,
    textAlign: 'center',
    width: 56,
    transform: [{ rotate: '90deg' }],
  },
  wheelCenter: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    top: WHEEL_SIZE / 2 - 32,
    left: WHEEL_SIZE / 2 - 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary,
    zIndex: 5,
  },
  wheelCenterEmoji: {
    fontSize: 28,
  },
  nivelBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  nivelBadgeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  hint: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  btnGirar: {
    width: '100%',
    borderRadius: 18,
  },
});
