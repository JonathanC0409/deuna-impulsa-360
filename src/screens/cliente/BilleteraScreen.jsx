import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaCard from '../../components/DeunaCard';
import MetricCard from '../../components/MetricCard';
import { colors } from '../../theme/colors';
import { MOCK_USUARIO } from '../../data/mockData';

const MOVIMIENTOS = [
  { id: 1, desc: 'Compra Café Andino', puntos: '+80', fecha: '20 May' },
  { id: 2, desc: 'Cashback acreditado', puntos: '+$3.20', fecha: '18 May' },
  { id: 3, desc: 'Canje recompensa', puntos: '-200', fecha: '15 May' },
];

export default function BilleteraScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.metrics}>
          <MetricCard label="Puntos" value={String(MOCK_USUARIO.puntos)} accent={colors.primary} />
          <MetricCard
            label="Cashback"
            value={`$${MOCK_USUARIO.cashback}`}
            accent={colors.cashback}
            subtitle="Disponible"
          />
        </View>

        <DeunaCard>
          <Text style={styles.saldoLabel}>Saldo estimado</Text>
          <Text style={styles.saldo}>${(MOCK_USUARIO.cashback + 5).toFixed(2)}</Text>
        </DeunaCard>

        <Text style={styles.section}>Movimientos recientes</Text>
        {MOVIMIENTOS.map((m) => (
          <DeunaCard key={m.id} style={styles.mov}>
            <View style={styles.movRow}>
              <View>
                <Text style={styles.movDesc}>{m.desc}</Text>
                <Text style={styles.movFecha}>{m.fecha}</Text>
              </View>
              <Text
                style={[
                  styles.movPuntos,
                  { color: m.puntos.startsWith('-') ? colors.danger : colors.cashback },
                ]}
              >
                {m.puntos}
              </Text>
            </View>
          </DeunaCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32 },
  metrics: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  saldoLabel: { fontSize: 13, color: colors.textMuted },
  saldo: { fontSize: 32, fontWeight: '800', color: colors.primary, marginTop: 4 },
  section: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 20, marginBottom: 12 },
  mov: { marginBottom: 10 },
  movRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  movDesc: { fontSize: 15, fontWeight: '600', color: colors.text },
  movFecha: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  movPuntos: { fontSize: 16, fontWeight: '700' },
});
