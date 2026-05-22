import { Text, StyleSheet, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';
import { MOCK_ITEMS } from '../../data/mockData';

export default function ItemsNegocioScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sub}>Catálogo del negocio</Text>
        <DeunaButton title="+ Nuevo" onPress={() => navigation.navigate('CrearItem')} style={styles.btn} />
      </View>
      <FlatList
        data={MOCK_ITEMS}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DeunaCard style={styles.card}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text style={styles.cat}>{item.categoria}</Text>
            <Text style={styles.precio}>${item.precio.toFixed(2)}</Text>
          </DeunaCard>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sub: { fontSize: 14, color: colors.textMuted, flex: 1 },
  btn: { minHeight: 44, paddingVertical: 8, paddingHorizontal: 16 },
  list: { padding: 20, paddingBottom: 32 },
  card: { marginBottom: 12 },
  nombre: { fontSize: 17, fontWeight: '700', color: colors.text },
  cat: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  precio: { fontSize: 16, fontWeight: '700', color: colors.cashback, marginTop: 8 },
});
