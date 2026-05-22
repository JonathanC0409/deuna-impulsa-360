import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { crearItemNegocio } from '../../services/itemService';

const TIPOS_ITEM = ['Producto', 'Servicio', 'Combo', 'Paquete'];

export default function CrearItemScreen({ navigation }) {
  const { idNegocio } = useAuth();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoItem, setTipoItem] = useState('Producto');
  const [precio, setPrecio] = useState('');
  const [manejaStock, setManejaStock] = useState(true);
  const [stock, setStock] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!nombre.trim() || !precio.trim()) {
      Alert.alert('Campos requeridos', 'Nombre y precio son obligatorios.');
      return;
    }

    if (!idNegocio) {
      Alert.alert('Sesión', 'No hay negocio vinculado.');
      return;
    }

    setLoading(true);
    try {
        const payload = {
          IdNegocio: idNegocio,
          Nombre: nombre.trim(),
          Descripcion: descripcion.trim() || null,
          TipoItem: tipoItem,
          Precio: parseFloat(precio),
          ManejaStock: manejaStock,
          Stock: manejaStock ? parseInt(stock, 10) || 0 : null,
          StockMinimo: manejaStock ? parseInt(stockMinimo, 10) || 0 : null,
        };

        console.log('[CrearItemScreen] payload:', payload);

      await crearItemNegocio({
        IdNegocio: idNegocio,
        Nombre: nombre.trim(),
        Descripcion: descripcion.trim() || null,
        TipoItem: tipoItem,
        Precio: parseFloat(precio),
        ManejaStock: manejaStock,
        Stock: manejaStock ? parseInt(stock, 10) || 0 : null,
        StockMinimo: manejaStock ? parseInt(stockMinimo, 10) || 0 : null,
      });
      Alert.alert('Ítem creado', 'Se guardó correctamente en Supabase.', [
        { text: 'OK', onPress: () => {
          if (navigation.replace) navigation.replace('ItemsNegocio');
          else navigation.goBack();
        } },
      ]);
    } catch (e) {
        console.error('[CrearItemScreen] crearItem error:', e);
        const message = e?.message || JSON.stringify(e);
        Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <DeunaCard>
          <Text style={styles.label}>Nombre *</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Ej. Pizza familiar" />

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

          {manejaStock && (
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
                El Estado se calcula automáticamente al guardar (Disponible, Bajo, Crítico o Agotado).
              </Text>
            </>
          )}
        </DeunaCard>

        <DeunaButton title="Guardar ítem" onPress={handleGuardar} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
});
