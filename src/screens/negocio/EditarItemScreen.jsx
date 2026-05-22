import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { obtenerItemNegocio, actualizarItemNegocio } from '../../services/itemService';

const TIPOS_ITEM = ['Producto', 'Servicio', 'Combo', 'Paquete'];

function aplicarItemEnFormulario(it, setters) {
  setters.setNombre(it.Nombre ?? '');
  setters.setDescripcion(it.Descripcion ?? '');
  setters.setTipoItem(it.TipoItem ?? 'Producto');
  setters.setPrecio(String(it.Precio ?? ''));
  setters.setManejaStock(Boolean(it.ManejaStock));
  setters.setStock(it.ManejaStock ? String(it.Stock ?? 0) : '');
  setters.setStockMinimo(it.ManejaStock ? String(it.StockMinimo ?? 0) : '');
}

export default function EditarItemScreen({ navigation, route }) {
  const { idNegocio } = useAuth();
  const itemId = route?.params?.idItemNegocio
    ? Number(route.params.idItemNegocio)
    : null;

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoItem, setTipoItem] = useState('Producto');
  const [precio, setPrecio] = useState('');
  const [manejaStock, setManejaStock] = useState(true);
  const [stock, setStock] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [cargandoItem, setCargandoItem] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const setters = {
    setNombre,
    setDescripcion,
    setTipoItem,
    setPrecio,
    setManejaStock,
    setStock,
    setStockMinimo,
  };

  const volverInventario = useCallback(() => {
    if (navigation.replace) {
      navigation.replace('ItemsNegocio');
    } else {
      navigation.goBack();
    }
  }, [navigation]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!itemId || !idNegocio) {
        if (mounted) {
          setCargandoItem(false);
          Alert.alert(
            'Ítem no encontrado',
            'No se recibió el identificador del ítem. Vuelve al inventario e intenta de nuevo.',
            [{ text: 'OK', onPress: volverInventario }]
          );
        }
        return;
      }

      try {
        setCargandoItem(true);
        const it = await obtenerItemNegocio(itemId, idNegocio);
        if (!mounted) return;
        aplicarItemEnFormulario(it, setters);
      } catch (e) {
        console.error('[EditarItemScreen] load item error', e);
        if (mounted) {
          Alert.alert('Error', e.message ?? 'No se pudo cargar el ítem.', [
            { text: 'Volver', onPress: volverInventario },
          ]);
        }
      } finally {
        if (mounted) setCargandoItem(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [itemId, idNegocio]);

  const handleGuardar = async () => {
    if (!nombre.trim() || !precio.trim()) {
      Alert.alert('Campos requeridos', 'Nombre y precio son obligatorios.');
      return;
    }

    const precioNum = parseFloat(precio.replace(',', '.'));
    if (Number.isNaN(precioNum) || precioNum < 0) {
      Alert.alert('Precio inválido', 'Ingresa un precio numérico válido.');
      return;
    }

    if (!idNegocio || !itemId) {
      Alert.alert('Sesión', 'No hay negocio o ítem vinculado.');
      return;
    }

    if (manejaStock) {
      const stockNum = parseInt(stock, 10);
      const minNum = parseInt(stockMinimo, 10);
      if (Number.isNaN(stockNum) || stockNum < 0 || Number.isNaN(minNum) || minNum < 0) {
        Alert.alert('Stock inválido', 'Stock y stock mínimo deben ser números enteros ≥ 0.');
        return;
      }
    }

    setGuardando(true);
    try {
      const payload = {
        Nombre: nombre.trim(),
        Descripcion: descripcion.trim() || null,
        TipoItem: tipoItem,
        Precio: precioNum,
        ManejaStock: manejaStock,
        Stock: manejaStock ? parseInt(stock, 10) || 0 : null,
        StockMinimo: manejaStock ? parseInt(stockMinimo, 10) || 0 : null,
      };

      await actualizarItemNegocio(itemId, payload, idNegocio);
      Alert.alert('Ítem actualizado', 'Los cambios se guardaron correctamente.', [
        { text: 'OK', onPress: volverInventario },
      ]);
    } catch (e) {
      console.error('[EditarItemScreen] update error', e);
      Alert.alert('Error', e.message ?? 'No se pudo actualizar el ítem.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargandoItem) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando ítem...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <DeunaCard>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Ej. Pizza familiar"
          />

          <Text style={[styles.label, styles.spaced]}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            placeholder="Descripción del ítem"
          />

          <Text style={[styles.label, styles.spaced]}>Tipo de ítem</Text>
          <View style={styles.chips}>
            {TIPOS_ITEM.map((t) => (
              <Pressable
                key={t}
                onPress={() => setTipoItem(t)}
                style={[styles.chip, tipoItem === t && styles.chipActive]}
              >
                <Text style={[styles.chipText, tipoItem === t && styles.chipTextActive]}>{t}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, styles.spaced]}>Precio ($) *</Text>
          <TextInput
            style={styles.input}
            value={precio}
            onChangeText={setPrecio}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />

          <View style={styles.switchRow}>
            <Text style={styles.label}>Maneja stock</Text>
            <Switch
              value={manejaStock}
              onValueChange={setManejaStock}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={manejaStock ? colors.primary : colors.textMuted}
            />
          </View>

          {manejaStock ? (
            <>
              <Text style={[styles.label, styles.spaced]}>Stock</Text>
              <TextInput
                style={styles.input}
                value={stock}
                onChangeText={setStock}
                keyboardType="number-pad"
              />
              <Text style={[styles.label, styles.spaced]}>Stock mínimo</Text>
              <TextInput
                style={styles.input}
                value={stockMinimo}
                onChangeText={setStockMinimo}
                keyboardType="number-pad"
              />
              <Text style={styles.hint}>
                El estado (Disponible, Bajo, Crítico, Agotado) se actualiza al guardar.
              </Text>
            </>
          ) : null}
        </DeunaCard>

        <DeunaButton title="Guardar cambios" onPress={handleGuardar} loading={guardando} />
        <DeunaButton
          title="Cancelar"
          variant="outline"
          onPress={volverInventario}
          style={styles.cancelBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    gap: 12,
  },
  loadingText: { color: colors.textMuted, fontSize: 14 },
  content: { padding: 20, paddingBottom: 32 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  spaced: { marginTop: 14 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text },
  chipTextActive: { color: colors.white, fontWeight: '600' },
  hint: { fontSize: 12, color: colors.textMuted, marginTop: 10, lineHeight: 18 },
  cancelBtn: { marginTop: 12 },
});
