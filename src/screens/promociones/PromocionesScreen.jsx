import { Text, StyleSheet, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';
import { MOCK_PROMOCIONES } from '../../data/mockData';

export default function PromocionesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={MOCK_PROMOCIONES}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.header}>Promociones activas en negocios aliados</Text>
        }
        renderItem={({ item }) => (
          <DeunaCard style={styles.card}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Activa</Text>
            </View>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.desc}>{item.descripcion}</Text>
          </DeunaCard>
        )}
        ListFooterComponent={
          <DeunaButton
            title="Volver a inicio"
            variant="outline"
            onPress={() => navigation.navigate('Cliente')}
            style={styles.footer}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 20, paddingBottom: 32 },
  header: { fontSize: 14, color: colors.textMuted, marginBottom: 16 },
  card: { marginBottom: 12 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  titulo: { fontSize: 17, fontWeight: '700', color: colors.primary },
  desc: { fontSize: 14, color: colors.textMuted, marginTop: 6, lineHeight: 20 },
  footer: { marginTop: 8 },
});
