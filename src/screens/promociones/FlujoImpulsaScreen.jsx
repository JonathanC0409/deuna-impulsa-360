import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import ModuloQuickNav from '../../components/ModuloQuickNav';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, spacing, radii, typography } from '../../theme';
import { MOCK_FLUJO_PASOS } from '../../data/mockData';

export default function FlujoImpulsaScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenContainer>
        <View style={styles.hero}>
          <Text style={styles.badge}>MVP · Demo</Text>
          <Text style={styles.heroTitle}>Deuna Impulsa 360</Text>
          <Text style={styles.heroSub}>
            Un ciclo completo que conecta pagos, promociones, stock y recompensas para MIPYMES y
            clientes.
          </Text>
        </View>

        <ModuloQuickNav navigation={navigation} active="FlujoImpulsa" />

        <View style={styles.timeline}>
          {MOCK_FLUJO_PASOS.map((paso, index) => {
            const isLast = index === MOCK_FLUJO_PASOS.length - 1;
            return (
              <View key={paso.id} style={styles.pasoWrap}>
                <View style={styles.lineCol}>
                  <View style={styles.numero}>
                    <Text style={styles.numeroText}>{index + 1}</Text>
                  </View>
                  {!isLast ? <View style={styles.linea} /> : null}
                </View>
                <DeunaCard style={styles.pasoCard}>
                  <View style={styles.pasoHeader}>
                    <Text style={styles.pasoIcon}>{paso.icono}</Text>
                    <Text style={styles.pasoTitulo}>{paso.titulo}</Text>
                  </View>
                  <Text style={styles.pasoDesc}>{paso.descripcion}</Text>
                  {index < MOCK_FLUJO_PASOS.length - 1 ? (
                    <Text style={styles.flecha}>↓ siguiente paso</Text>
                  ) : null}
                </DeunaCard>
              </View>
            );
          })}
        </View>

        <DeunaCard style={styles.resumen}>
          <Text style={styles.resumenTitle}>Resultado del ecosistema</Text>
          <Text style={styles.resumenText}>
            El cliente gana valor en cada pago; el negocio vende más con promociones inteligentes;
            Deuna incrementa transacciones digitales y fidelización en la red.
          </Text>
        </DeunaCard>

        <DeunaButton
          title="Ver promociones"
          onPress={() => navigation.navigate('Promociones')}
          style={styles.btn}
        />
        <DeunaButton
          title="Probar ruleta"
          variant="cashback"
          onPress={() => navigation.navigate('Ruleta')}
          style={styles.btn}
        />
        <DeunaButton
          title="Panel del negocio"
          variant="outline"
          onPress={() => navigation.navigate('Negocio')}
          style={styles.btn}
        />
        <DeunaButton
          title="Volver al inicio cliente"
          variant="outline"
          onPress={() => navigation.navigate('Cliente')}
          style={styles.btn}
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
    backgroundColor: colors.primary,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    marginBottom: spacing.lg,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  heroTitle: { ...typography.hero, color: colors.white, fontSize: 24 },
  heroSub: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.sm,
  },
  timeline: { marginTop: 8 },
  pasoWrap: { flexDirection: 'row', marginBottom: 4 },
  lineCol: { width: 40, alignItems: 'center' },
  numero: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeroText: { color: colors.white, fontWeight: '800', fontSize: 14 },
  linea: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 4,
    minHeight: 24,
  },
  pasoCard: { flex: 1, marginLeft: 8, marginBottom: 16 },
  pasoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  pasoIcon: { fontSize: 24, marginRight: 10 },
  pasoTitulo: { flex: 1, fontSize: 16, fontWeight: '800', color: colors.primary },
  pasoDesc: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  flecha: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: '600',
    color: colors.cashback,
  },
  resumen: {
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  resumenTitle: { fontSize: 17, fontWeight: '800', color: colors.primary, marginBottom: 8 },
  resumenText: { fontSize: 14, color: colors.text, lineHeight: 22 },
  btn: { marginTop: 12 },
});
