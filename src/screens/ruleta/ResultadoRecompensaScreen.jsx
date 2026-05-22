import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';

const COLORS = {
  background: '#F8F7FF',
  primary: '#7C3AED',
  cashback: '#00C896',
  text: '#1E1E1E',
  textMuted: '#6F6F7A',
};

const NIVEL_LABELS = {
  1: 'Giro básico',
  2: 'Giro mejorado',
  3: 'Giro especial',
  4: 'Giro premium',
};

function formatearValor(premio) {
  if (premio?.tipo === 'cashback' && premio.valor != null) {
    return `$${Number(premio.valor).toFixed(2)}`;
  }
  if (premio?.tipo === 'descuento' && premio.valor != null) {
    return `${premio.valor}%`;
  }
  if (premio?.tipo === 'giro_premium') {
    return '1 giro extra';
  }
  if (premio?.tipo === 'sorpresa') {
    return '¡Sorpresa!';
  }
  return premio?.valor != null ? String(premio.valor) : '—';
}

export default function ResultadoRecompensaScreen({ navigation, route }) {
  const { premio, recompensa, nombreNegocio, nivelGiro } = route?.params ?? {};

  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);

  if (!premio?.label) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorTitle}>Premio no disponible</Text>
          <Text style={styles.errorText}>
            No recibimos los datos del premio. Vuelve al inicio e intenta de nuevo.
          </Text>
          <DeunaButton
            title="Volver al inicio"
            onPress={() =>
              navigation.navigate('Cliente', {
                screen: 'ClienteTabs',
                params: { screen: 'Inicio' },
              })
            }
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>¡Felicidades!</Text>
        {nombreNegocio ? (
          <Text style={styles.negocio}>Ganaste en {nombreNegocio}</Text>
        ) : null}
        {nivelGiro ? (
          <Text style={styles.nivel}>{NIVEL_LABELS[nivelGiro] ?? `Nivel ${nivelGiro}`}</Text>
        ) : null}

        <Animated.View style={{ transform: [{ scale }], opacity, width: '100%' }}>
          <DeunaCard style={styles.card}>
            <Text style={styles.premioLabel}>{premio.label}</Text>
            <View style={styles.detalleRow}>
              <Text style={styles.detalleKey}>Tipo</Text>
              <Text style={styles.detalleVal}>{premio.tipo}</Text>
            </View>
            <View style={styles.detalleRow}>
              <Text style={styles.detalleKey}>Valor</Text>
              <Text style={[styles.detalleVal, styles.valorDestacado]}>
                {formatearValor(premio)}
              </Text>
            </View>
            {recompensa?.estado ? (
              <View style={styles.estadoBadge}>
                <Text style={styles.estadoText}>Guardado · {recompensa.estado}</Text>
              </View>
            ) : null}
          </DeunaCard>
        </Animated.View>

        <DeunaButton
          title="Ver mis recompensas"
          onPress={() =>
            navigation.navigate('Cliente', {
              screen: 'MisRecompensas',
            })
          }
          style={styles.btn}
        />
        <DeunaButton
          title="Volver al inicio"
          variant="outline"
          onPress={() =>
            navigation.navigate('Cliente', {
              screen: 'ClienteTabs',
              params: { screen: 'Inicio' },
            })
          }
          style={styles.gap}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: COLORS.primary,
    marginVertical: 12,
  },
  negocio: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  nivel: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    marginBottom: 20,
  },
  card: {
    alignItems: 'center',
    width: '100%',
    borderRadius: 24,
    paddingVertical: 28,
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  premioLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.cashback,
    textAlign: 'center',
    marginBottom: 20,
  },
  detalleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8E2F2',
  },
  detalleKey: {
    fontSize: 14,
    color: COLORS.textMuted,
    textTransform: 'capitalize',
  },
  detalleVal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  valorDestacado: {
    color: COLORS.cashback,
    fontSize: 18,
  },
  estadoBadge: {
    marginTop: 16,
    backgroundColor: '#EEE5FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  btn: {
    width: '100%',
    borderRadius: 18,
  },
  gap: {
    marginTop: 12,
    width: '100%',
    borderRadius: 18,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
});
