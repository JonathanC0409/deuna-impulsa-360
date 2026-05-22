import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors, spacing, radii } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { obtenerPromocionesNegocio } from '../../services/promocionNegocioService';

export default function PromocionesNegocioScreen({ navigation }) {
  const { idNegocio } = useAuth();
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargar = useCallback(
    async (silencioso = false) => {
      if (!idNegocio) return;
      try {
        if (!silencioso) setLoading(true);
        const data = await obtenerPromocionesNegocio(idNegocio);
        setPromociones(data);
      } catch (e) {
        Alert.alert('Error', e.message ?? 'No se pudieron cargar las promociones.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [idNegocio]
  );

  useEffect(() => {
    cargar();
  }, [cargar]);

  const onRefresh = () => {
    setRefreshing(true);
    cargar(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </Pressable>
        <Text style={styles.title}>Mis promociones</Text>
        <Pressable
          onPress={() => navigation.navigate('CrearPromocion')}
          style={styles.addBtn}
        >
          <Ionicons name="add-circle" size={28} color={colors.cashback} />
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={promociones}
          keyExtractor={(p) => String(p.IdPromocion)}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Aún no tienes promociones.</Text>
              <DeunaButton
                title="Crear primera promoción"
                variant="cashback"
                onPress={() => navigation.navigate('CrearPromocion')}
                style={styles.emptyBtn}
              />
            </View>
          }
          renderItem={({ item }) => (
            <DeunaCard style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{item.Titulo}</Text>
                <View
                  style={[
                    styles.badge,
                    item.Activa ? styles.badgeOn : styles.badgeOff,
                  ]}
                >
                  <Text style={styles.badgeText}>{item.Activa ? 'Activa' : 'Inactiva'}</Text>
                </View>
              </View>
              <Text style={styles.tipo}>
                {item.TipoPromocion}
                {item.ValorDescuento > 0 ? ` · ${item.ValorDescuento}` : ''}
              </Text>
              <Text style={styles.desc} numberOfLines={2}>
                {item.Descripcion}
              </Text>
              {item.ItemsNegocio?.Nombre ? (
                <Text style={styles.itemRef}>Producto: {item.ItemsNegocio.Nombre}</Text>
              ) : null}
              <Pressable
                style={styles.editRow}
                onPress={() =>
                  navigation.navigate('EditarPromocion', {
                    idPromocion: String(item.IdPromocion),
                  })
                }
              >
                <Ionicons name="create-outline" size={18} color={colors.primary} />
                <Text style={styles.editText}>Editar promoción</Text>
              </Pressable>
            </DeunaCard>
          )}
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, fontSize: 20, fontWeight: '800', color: colors.primary },
  addBtn: { padding: 4 },
  loader: { marginTop: 40 },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.md },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  cardTitle: { flex: 1, fontSize: 17, fontWeight: '700', color: colors.text },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.full },
  badgeOn: { backgroundColor: '#E6FBF4' },
  badgeOff: { backgroundColor: colors.surface },
  badgeText: { fontSize: 11, fontWeight: '700', color: colors.text },
  tipo: { marginTop: 6, fontSize: 13, fontWeight: '600', color: colors.cashback },
  desc: { marginTop: 6, fontSize: 14, color: colors.textMuted, lineHeight: 20 },
  itemRef: { marginTop: 8, fontSize: 12, color: colors.textMuted },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  editText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  empty: { alignItems: 'center', marginTop: 48, paddingHorizontal: spacing.xl },
  emptyText: { textAlign: 'center', color: colors.textMuted, marginBottom: spacing.lg },
  emptyBtn: { width: '100%' },
});
