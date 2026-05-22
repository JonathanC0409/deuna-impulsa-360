import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import MetricCard from '../../components/MetricCard';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { obtenerResumenDashboard } from '../../services/ventaService';
import { listarAlertasActivas } from '../../services/alertaService';

export default function DashboardNegocioScreen({ navigation }) {
  const router = useRouter();
  const { idNegocio, negocio, signOut } = useAuth();
  const [resumen, setResumen] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = async () => {
    try {
      if (!idNegocio) return;
      const [data, alertasData] = await Promise.all([
        obtenerResumenDashboard(idNegocio),
        listarAlertasActivas(idNegocio, 3),
      ]);
      setResumen(data);
      setAlertas(alertasData);
    } catch (e) {
      console.error('Dashboard:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    cargar();
  }, [idNegocio]);

  const onRefresh = () => {
    setRefreshing(true);
    cargar();
  };

  if (loading && !resumen) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  const r = resumen ?? {
    nombreNegocio: 'Mi negocio',
    ventasHoy: 0,
    totalHoy: 0,
    ventasSemana: 0,
    totalSemana: 0,
    itemsVendidos: 0,
    clientesRecurrentes: 0,
    alertasActivas: 0,
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.greeting}>Hola, {negocio?.NombreNegocio ?? r.nombreNegocio}</Text>
        <Text style={styles.subtitle}>Resumen de tu negocio</Text>

        <View style={styles.metricsRow}>
          <MetricCard
            label="Ventas hoy"
            value={String(r.ventasHoy)}
            subtitle={`$${r.totalHoy.toFixed(2)}`}
            accent={colors.primary}
          />
          <MetricCard
            label="Ventas semana"
            value={String(r.ventasSemana)}
            subtitle={`$${r.totalSemana.toFixed(2)}`}
            accent={colors.cashback}
          />
        </View>

        <View style={styles.metricsRow}>
          <MetricCard label="Ítems vendidos" value={String(r.itemsVendidos)} accent={colors.turquoise} />
          <MetricCard
            label="Clientes recurrentes"
            value={String(r.clientesRecurrentes)}
            accent={colors.primaryDark}
          />
        </View>

        <DeunaCard style={styles.alertasCard}>
          <View style={styles.alertasHeader}>
            <Text style={styles.alertasTitle}>Alertas activas</Text>
            <View style={styles.alertasCount}>
              <Text style={styles.alertasCountText}>{r.alertasActivas}</Text>
            </View>
          </View>
          {alertas.length === 0 ? (
            <Text style={styles.sinAlertas}>Sin alertas pendientes</Text>
          ) : (
            alertas.map((a) => (
              <View key={a.IdAlertaNegocio} style={styles.alertaItem}>
                <Text style={styles.alertaTitulo}>{a.Titulo}</Text>
                <Text style={styles.alertaMsg}>{a.Mensaje}</Text>
              </View>
            ))
          )}
        </DeunaCard>

        <DeunaButton title="Inventario de ítems" onPress={() => navigation.navigate('ItemsNegocio')} />
        <DeunaButton
          title="Registrar venta"
          variant="cashback"
          onPress={() => navigation.navigate('RegistrarVenta')}
          style={styles.gap}
        />
        <DeunaButton
          title="Cerrar sesión"
          variant="outline"
          onPress={async () => {
            await signOut();
            router.replace('/');
          }}
          style={styles.gap}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32 },
  greeting: { fontSize: 26, fontWeight: '800', color: colors.primary },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 20, marginTop: 4 },
  metricsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  alertasCard: { marginBottom: 20 },
  alertasHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  alertasTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  alertasCount: {
    backgroundColor: colors.danger,
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertasCountText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  sinAlertas: { fontSize: 14, color: colors.textMuted },
  alertaItem: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border },
  alertaTitulo: { fontSize: 14, fontWeight: '600', color: colors.text },
  alertaMsg: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  gap: { marginTop: 12 },
});
