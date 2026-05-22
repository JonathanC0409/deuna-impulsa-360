import { Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';
import { MOCK_BENEFICIOS } from '../../data/mockData';

export default function BeneficiosScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.header}>Beneficios disponibles</Text>
      <FlatList
        data={MOCK_BENEFICIOS}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DeunaCard style={styles.card}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.negocio}>{item.negocio}</Text>
            <Text style={styles.vence}>Vence: {item.vence}</Text>
          </DeunaCard>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  header: { fontSize: 16, color: colors.textMuted, marginBottom: 12 },
  list: { gap: 12, paddingBottom: 24 },
  card: { marginBottom: 12 },
  titulo: { fontSize: 17, fontWeight: '700', color: colors.primary },
  negocio: { fontSize: 14, color: colors.text, marginTop: 4 },
  vence: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
});
