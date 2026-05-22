import { useState, useCallback } from 'react';
import { Text, StyleSheet, ScrollView, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import PromocionCard from '../../components/PromocionCard';
import ModuloQuickNav from '../../components/ModuloQuickNav';
import { colors } from '../../theme/colors';
import {
  MOCK_PROMOCIONES,
  MOCK_BENEFICIOS_INTELIGENTES,
} from '../../data/mockData';

export default function PromocionesScreen({ navigation }) {
  const [promociones, setPromociones] = useState(MOCK_PROMOCIONES);
  const [activadasVisuales, setActivadasVisuales] = useState(() =>
    MOCK_PROMOCIONES.filter((p) => p.activa).map((p) => p.id)
  );

  const destacada = promociones.find((p) => p.destacada);
  const dinamicas = promociones.filter((p) => p.dinamica);
  const activas = promociones.filter((p) => p.activa);

  const toggleActiva = useCallback((id) => {
    setPromociones((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activa: !p.activa } : p))
    );
  }, []);

  const activarVisual = useCallback((id) => {
    setActivadasVisuales((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
    const promo = promociones.find((p) => p.id === id);
    Alert.alert(
      'Promoción activada',
      promo
        ? `${promo.titulo}\n\nBeneficio: ${promo.beneficio}`
        : 'Tu beneficio ya está disponible en el próximo pago con Deuna.'
    );
  }, [promociones]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>✨</Text>
          <Text style={styles.heroTitle}>Promociones Deuna</Text>
          <Text style={styles.heroSub}>
            Beneficios inteligentes y dinámicos para impulsar tus compras en negocios aliados.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{activas.length}</Text>
            <Text style={styles.statLabel}>Activas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.cashback }]}>{dinamicas.length}</Text>
            <Text style={styles.statLabel}>Dinámicas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.primary }]}>1</Text>
            <Text style={styles.statLabel}>Destacada</Text>
          </View>
        </View>

        <ModuloQuickNav navigation={navigation} active="Promociones" />

        {destacada ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Promoción destacada</Text>
            <PromocionCard
              promocion={{
                ...destacada,
                activa: destacada.activa || activadasVisuales.includes(destacada.id),
              }}
              onToggleActiva={toggleActiva}
              onActivarVisual={activarVisual}
            />
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Beneficios inteligentes</Text>
          <Text style={styles.sectionHint}>Sugerencias según horario, stock y comportamiento</Text>
          {MOCK_BENEFICIOS_INTELIGENTES.map((b) => (
            <DeunaCard key={b.id} style={styles.inteligenteCard}>
              <View style={styles.inteligenteRow}>
                <Text style={styles.inteligenteIcon}>{b.icono}</Text>
                <View style={styles.inteligenteBody}>
                  <Text style={styles.inteligenteTitulo}>{b.titulo}</Text>
                  <Text style={styles.inteligenteDesc}>{b.descripcion}</Text>
                </View>
              </View>
            </DeunaCard>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promociones dinámicas</Text>
          <Text style={styles.sectionHint}>Se adaptan a demanda, horario e inventario</Text>
          {dinamicas
            .filter((p) => !p.destacada)
            .map((p) => (
              <PromocionCard
                key={p.id}
                promocion={{
                  ...p,
                  activa: p.activa || activadasVisuales.includes(p.id),
                }}
                onToggleActiva={toggleActiva}
                onActivarVisual={activarVisual}
              />
            ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Todas las promociones activas</Text>
          {promociones
            .filter((p) => !p.destacada && !p.dinamica)
            .map((p) => (
              <PromocionCard
                key={p.id}
                promocion={{
                  ...p,
                  activa: p.activa || activadasVisuales.includes(p.id),
                }}
                onToggleActiva={toggleActiva}
                onActivarVisual={activarVisual}
              />
            ))}
        </View>

        <DeunaButton
          title="Ver flujo Deuna Impulsa 360"
          variant="outline"
          onPress={() => navigation.navigate('FlujoImpulsa')}
          style={styles.footerBtn}
        />
        <DeunaButton
          title="Ir a recompensas"
          variant="cashback"
          onPress={() =>
            navigation.navigate('Cliente', { screen: 'MisRecompensas' })
          }
          style={styles.footerBtn}
        />
        <DeunaButton
          title="Volver a inicio"
          variant="outline"
          onPress={() => navigation.navigate('Cliente')}
          style={styles.footerBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  hero: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  heroEmoji: { fontSize: 32, marginBottom: 8 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: colors.primary, textAlign: 'center' },
  heroSub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: colors.border },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 4 },
  sectionHint: { fontSize: 13, color: colors.textMuted, marginBottom: 12 },
  inteligenteCard: { marginBottom: 10 },
  inteligenteRow: { flexDirection: 'row', alignItems: 'flex-start' },
  inteligenteIcon: { fontSize: 28, marginRight: 12 },
  inteligenteBody: { flex: 1 },
  inteligenteTitulo: { fontSize: 15, fontWeight: '700', color: colors.text },
  inteligenteDesc: { fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 18 },
  footerBtn: { marginTop: 12 },
});
