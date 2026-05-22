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
import { useAuth } from '../../context/AuthContext';
import { obtenerItemsNegocio } from '../../services/itemService';
import EstadoItemBadge from './components/EstadoItemBadge';
import { eliminarItemNegocio } from '../../services/itemService';
import { Alert, Pressable } from 'react-native';

export default function ItemsNegocioScreen({ navigation }) {
  const { idNegocio } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = async () => {
    try {
      if (!idNegocio) return;
      const data = await obtenerItemsNegocio(idNegocio);
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
  }, [idNegocio]);

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
              <View style={styles.actionsRow}>
                <Pressable onPress={() => navigation.navigate('EditarItem', { item })} style={styles.actionBtn}>
                  <Text style={styles.actionText}>Editar</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    Alert.alert('Eliminar ítem', '¿Estás seguro de eliminar este ítem?', [
                      { text: 'Cancelar', style: 'cancel' },
                      {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await eliminarItemNegocio(item.IdItemNegocio);
                            // refrescar lista en lugar de navegar
                            setLoading(true);
                            await cargar();
                          } catch (e) {
                            console.error('[ItemsNegocioScreen] eliminar error', e);
                            Alert.alert('Error', e.message ?? String(e));
                          }
                        },
                      },
                    ]);
                  }}
                  style={[styles.actionBtn, styles.deleteBtn]}
                >
                  <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
                </Pressable>
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
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: colors.surface },
  actionText: { color: colors.primary, fontWeight: '700' },
  deleteBtn: { backgroundColor: 'transparent' },
  deleteText: { color: colors.danger },
});
