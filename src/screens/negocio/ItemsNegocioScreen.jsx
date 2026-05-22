import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';
import { ID_NEGOCIO_ACTIVO } from '../../constants/negocioActivo';
import { obtenerItemsNegocio } from '../../services/itemService';
import EstadoItemBadge from './components/EstadoItemBadge';

export default function ItemsNegocioScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = async () => {
    try {
      const data = await obtenerItemsNegocio(ID_NEGOCIO_ACTIVO);
      setItems(data);
    } catch (e) {
      console.error('Items:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    cargar();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventario</Text>
        <DeunaButton
          title="Agregar ítem"
          onPress={() => navigation.navigate('CrearItem')}
          style={styles.btnHeader}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.IdItemNegocio)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); cargar(); }} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No hay ítems. Agrega el primero.</Text>
          }
          renderItem={({ item }) => (
            <DeunaCard style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.nombre}>{item.Nombre}</Text>
                <EstadoItemBadge estado={item.Estado} />
              </View>
              <Text style={styles.tipo}>{item.TipoItem}</Text>
              <View style={styles.row}>
                <Text style={styles.precio}>${Number(item.Precio).toFixed(2)}</Text>
                {item.ManejaStock ? (
                  <Text style={styles.stock}>Stock: {item.Stock}</Text>
                ) : (
                  <Text style={styles.stock}>Sin control de stock</Text>
                )}
              </View>
            </DeunaCard>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.primary, flex: 1 },
  btnHeader: { minHeight: 44, paddingVertical: 8, paddingHorizontal: 14 },
  loader: { marginTop: 40 },
  list: { padding: 20, paddingBottom: 32 },
  card: { marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  nombre: { fontSize: 17, fontWeight: '700', color: colors.text, flex: 1 },
  tipo: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  precio: { fontSize: 16, fontWeight: '700', color: colors.cashback },
  stock: { fontSize: 14, color: colors.text },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40 },
});
