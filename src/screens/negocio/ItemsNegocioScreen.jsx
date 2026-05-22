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
import {
  obtenerVentasPorItem,
  sincronizarTodasAlertasNegocio,
} from '../../services/inventarioAlertaService';
import { itemRequiereAlertaStock } from '../../services/alertaService';
import EstadoItemBadge from './components/EstadoItemBadge';

export default function ItemsNegocioScreen({ navigation, refreshKey }) {
  const { idNegocio } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [ventasPorItem, setVentasPorItem] = useState({});

  const cargar = useCallback(async (silencioso = false) => {
    if (!idNegocio) {
      setItems([]);
      setVentasPorItem({});
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      if (!silencioso) setLoading(true);
      const [data, ventas] = await Promise.all([
        obtenerItemsNegocio(idNegocio),
        obtenerVentasPorItem(idNegocio, 7),
      ]);

      if (!silencioso) {
        try {
          await sincronizarTodasAlertasNegocio(idNegocio);
        } catch (syncErr) {
          console.warn('[ItemsNegocio] sync alertas:', syncErr.message);
        }
      }
      setItems(data);
      setVentasPorItem(ventas);
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

    setEliminandoId(String(item.IdItemNegocio));

    try {
      await eliminarItemNegocio(item.IdItemNegocio, idNegocio);
      setItems((prev) =>
        prev.filter((i) => String(i.IdItemNegocio) !== String(item.IdItemNegocio))
      );
      Alert.alert('Eliminado', 'El ítem se quitó del inventario.');
    } catch (e) {
      console.error('[ItemsNegocioScreen] eliminar:', e);
      Alert.alert('Error', e.message ?? 'No se pudo eliminar el ítem.');
      await cargar(true);
    } finally {
      setEliminandoId(null);
    }
  };

  const irCrearPromocion = (item) => {
    navigation.navigate('CrearPromocion', {
      idItemNegocio: String(item.IdItemNegocio),
      nombreItem: item.Nombre,
    });
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
  <Pressable
   onPress={() => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate('DashboardNegocio');
  }
}}
  >
    <Ionicons name="arrow-back" size={22} color={colors.primary} />
  </Pressable>

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
            const borrando = String(eliminandoId) === String(item.IdItemNegocio);
            const vendidos = ventasPorItem[String(item.IdItemNegocio)] ?? 0;
            const pocaRotacion = vendidos < 2;
            const stockBajo = itemRequiereAlertaStock(item);
            const mostrarPromo = pocaRotacion || stockBajo;

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
                <Text style={styles.ventas7d}>
                  Vendidos (7 días): {vendidos} uds.
                  {stockBajo ? ' · Stock bajo' : ''}
                  {pocaRotacion ? ' · Poca rotación' : ''}
                </Text>
                <View style={styles.actionsRow}>
                  <Pressable
                    onPress={() => irEditar(item)}
                    style={({ pressed }) => [styles.actionBtn, pressed && styles.actionPressed]}
                    disabled={borrando}
                  >
                    <Ionicons name="create-outline" size={18} color={colors.primary} />
                    <Text style={styles.actionText}>Editar</Text>
                  </Pressable>
                  {mostrarPromo ? (
                    <Pressable
                      onPress={() => irCrearPromocion(item)}
                      style={({ pressed }) => [
                        styles.actionBtn,
                        styles.promoBtn,
                        pressed && styles.actionPressed,
                      ]}
                      disabled={borrando}
                    >
                      <Ionicons name="pricetag-outline" size={18} color={colors.cashback} />
                      <Text style={[styles.actionText, styles.promoText]}>
                        Crear promoción
                      </Text>
                    </Pressable>
                  ) : null}
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
  ventas7d: { fontSize: 13, color: colors.textMuted, marginTop: 8, fontWeight: '600' },
  promoBtn: { backgroundColor: '#E6FBF4' },
  promoText: { color: colors.cashback },
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
