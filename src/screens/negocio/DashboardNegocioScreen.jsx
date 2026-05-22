import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import MetricCard from '../../components/MetricCard';
import ModuloQuickNav from '../../components/ModuloQuickNav';
import { colors } from '../../theme/colors';
import { MOCK_METRICAS_NEGOCIO, MOCK_VENTAS } from '../../data/mockData';

export default function DashboardNegocioScreen({ navigation }) {
  const m = MOCK_METRICAS_NEGOCIO;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dashboard del negocio</Text>
        <Text style={styles.subtitle}>Tienda Don Luis · Panel Impulsa 360</Text>
        <View style={styles.metrics}>
          <MetricCard label="Ventas hoy" value={String(m.ventasHoy)} accent={colors.primary} />
          <MetricCard
            label="Ingresos"
            value={`$${m.ingresosHoy}`}
            accent={colors.cashback}
          />
        </View>
        <View style={styles.metrics}>
          <MetricCard
            label="Clientes activos"
            value={String(m.clientesActivos)}
            accent={colors.primary}
          />
          <MetricCard
            label="Promos activas"
            value={String(m.promocionesActivas)}
            accent={colors.cashback}
          />
        </View>

        <DeunaCard style={styles.insight}>
          <Text style={styles.insightTitle}>Insight del día</Text>
          <Text style={styles.insightText}>
            Activa la promo por horario bajo entre 2:00 y 5:00 p.m. para aumentar tráfico con
            cashback extra.
          </Text>
        </DeunaCard>

        <ModuloQuickNav navigation={navigation} active="Negocio" />

        <Text style={styles.section}>Últimas ventas</Text>
        {MOCK_VENTAS.map((v) => (
          <View key={v.id} style={styles.ventaRow}>
            <Text style={styles.ventaCliente}>{v.cliente}</Text>
            <Text style={styles.ventaMonto}>${v.monto}</Text>
            <Text style={styles.ventaFecha}>{v.fecha}</Text>
          </View>
        ))}

        <DeunaButton
          title="Registrar venta"
          onPress={() => navigation.navigate('RegistrarVenta')}
          style={styles.gap}
        />
        <DeunaButton
          title="Gestionar items"
          variant="outline"
          onPress={() => navigation.navigate('ItemsNegocio')}
          style={styles.gap}
        />
        <DeunaButton
          title="Ver promociones"
          variant="cashback"
          onPress={() => navigation.navigate('Promociones')}
          style={styles.gap}
        />
        <DeunaButton
          title="Flujo Impulsa 360"
          variant="outline"
          onPress={() => navigation.navigate('FlujoImpulsa')}
          style={styles.gap}
        />
        <DeunaButton
          title="Volver a cliente"
          variant="outline"
          onPress={() => navigation.navigate('Cliente')}
          style={styles.gap}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 16 },
  metrics: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  insight: { marginBottom: 16 },
  insightTitle: { fontSize: 15, fontWeight: '700', color: colors.primary, marginBottom: 6 },
  insightText: { fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 10 },
  ventaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ventaCliente: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  ventaMonto: { fontSize: 15, fontWeight: '700', color: colors.cashback },
  ventaFecha: { width: '100%', fontSize: 12, color: colors.textMuted, marginTop: 2 },
  gap: { marginTop: 12 },
});
