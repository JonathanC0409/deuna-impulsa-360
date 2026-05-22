import { useState, useCallback } from 'react';
import { Text, StyleSheet, ScrollView, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import PromocionCard from '../../components/PromocionCard';
import ModuloQuickNav from '../../components/ModuloQuickNav';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, spacing, radii, typography, shadows } from '../../theme';
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
        <ScreenContainer>
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
        </ScreenContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  scroll: { paddingBottom: spacing.xxxl, paddingTop: spacing.md },
  hero: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    ...shadows.card,
  },
  heroEmoji: { fontSize: 32, marginBottom: spacing.sm },
  heroTitle: { ...typography.h1, color: colors.primary, textAlign: 'center' },
  heroSub: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { ...typography.amountSm, fontSize: 22, color: colors.text },
  statLabel: { ...typography.caption, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: colors.border },
  section: { marginTop: spacing.xl },
  sectionTitle: { ...typography.h2 },
  sectionHint: { ...typography.caption, marginBottom: spacing.md },
  inteligenteCard: { marginBottom: spacing.sm },
  inteligenteRow: { flexDirection: 'row', alignItems: 'flex-start' },
  inteligenteIcon: { fontSize: 28, marginRight: spacing.md },
  inteligenteBody: { flex: 1 },
  inteligenteTitulo: { ...typography.bodyBold },
  inteligenteDesc: { ...typography.caption, marginTop: 4, lineHeight: 18 },
  footerBtn: { marginTop: spacing.md },
});
