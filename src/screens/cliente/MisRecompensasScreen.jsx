import { Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';
import { MOCK_RECOMPENSAS } from '../../data/mockData';

export default function MisRecompensasScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={MOCK_RECOMPENSAS}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.header}>Tus recompensas activas</Text>}
        renderItem={({ item }) => (
          <DeunaCard style={styles.card}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.negocio}>{item.negocio}</Text>
            <View style={[styles.badge, item.estado === 'disponible' && styles.badgeOk]}>
              <Text style={styles.badgeText}>{item.estado}</Text>
            </View>
          </DeunaCard>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 20, paddingBottom: 32 },
  header: { fontSize: 16, color: colors.textMuted, marginBottom: 16 },
  card: { marginBottom: 12 },
  titulo: { fontSize: 17, fontWeight: '700', color: colors.text },
  negocio: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  badgeOk: { backgroundColor: colors.primaryLight },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.primary, textTransform: 'capitalize' },
});
