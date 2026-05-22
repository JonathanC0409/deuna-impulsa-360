import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors, spacing, radii } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { obtenerItemsNegocio, eliminarItemNegocio } from '../../services/itemService';
import EstadoItemBadge from './components/EstadoItemBadge';

export default function ItemsNegocioScreen({ navigation, refreshKey }) {
  const { idNegocio } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);

  const cargar = useCallback(async (silencioso = false) => {
    if (!idNegocio) {
      setItems([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (!silencioso) setLoading(true);
      const data = await obtenerItemsNegocio(idNegocio);
      setItems(data);
    } catch (e) {
      console.error('[ItemsNegocioScreen] cargar:', e);
      Alert.alert('Error', e.message ?? 'No se pudo cargar el inventario.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [idNegocio]);

  useEffect(() => {
    cargar();
  }, [cargar, refreshKey]);

  const confirmarEliminar = (item) => {
    Alert.alert(
      'Eliminar ítem',
      `¿Eliminar "${item.Nombre}"? El ítem dejará de mostrarse en el inventario.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => ejecutarEliminar(item),
        },
      ]
    );
  };

  const ejecutarEliminar = async (item) => {
    if (!idNegocio) {
      Alert.alert('Sesión', 'No hay negocio vinculado.');
      return;
    }

    setEliminandoId(item.IdItemNegocio);
    try {
      await eliminarItemNegocio(item.IdItemNegocio, idNegocio);
      setItems((prev) => prev.filter((i) => i.IdItemNegocio !== item.IdItemNegocio));
      Alert.alert('Eliminado', 'El ítem se quitó del inventario.');
    } catch (e) {
      console.error('[ItemsNegocioScreen] eliminar:', e);
      Alert.alert('Error', e.message ?? 'No se pudo eliminar el ítem.');
      await cargar(true);
    } finally {
      setEliminandoId(null);
    }
  };

  const irEditar = (item) => {
    navigation.navigate('EditarItem', {
      idItemNegocio: String(item.IdItemNegocio),
    });
  };

  if (!idNegocio && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Sin negocio activo</Text>
          <Text style={styles.empty}>Inicia sesión como negocio para gestionar ítems.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Inventario</Text>
        <DeunaButton
          title="Agregar"
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
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                cargar(true);
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="cube-outline" size={48} color={colors.textMuted} />
              <Text style={styles.empty}>No hay ítems. Agrega el primero.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const borrando = eliminandoId === item.IdItemNegocio;
            return (
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
                  <Pressable
                    onPress={() => irEditar(item)}
                    style={({ pressed }) => [styles.actionBtn, pressed && styles.actionPressed]}
                    disabled={borrando}
                  >
                    <Ionicons name="create-outline" size={18} color={colors.primary} />
                    <Text style={styles.actionText}>Editar</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => confirmarEliminar(item)}
                    style={({ pressed }) => [
                      styles.actionBtn,
                      styles.deleteBtn,
                      pressed && styles.actionPressed,
                    ]}
                    disabled={borrando}
                  >
                    {borrando ? (
                      <ActivityIndicator size="small" color={colors.danger} />
                    ) : (
                      <>
                        <Ionicons name="trash-outline" size={18} color={colors.danger} />
                        <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
                      </>
                    )}
                  </Pressable>
                </View>
              </DeunaCard>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.primary, flex: 1 },
  btnHeader: { minHeight: 44, paddingVertical: 8, paddingHorizontal: 14 },
  loader: { marginTop: 40 },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.md },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  nombre: { fontSize: 17, fontWeight: '700', color: colors.text, flex: 1 },
  tipo: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  precio: { fontSize: 16, fontWeight: '700', color: colors.cashback },
  stock: { fontSize: 14, color: colors.text },
  emptyBox: { alignItems: 'center', marginTop: 48, gap: spacing.md, paddingHorizontal: spacing.xl },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  empty: { textAlign: 'center', color: colors.textMuted, lineHeight: 22 },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    minHeight: 40,
  },
  actionPressed: { opacity: 0.85 },
  actionText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  deleteBtn: { backgroundColor: '#FFF0F3' },
  deleteText: { color: colors.danger },
});
