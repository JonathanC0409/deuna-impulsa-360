import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
  Modal,
  FlatList,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors, spacing, radii } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { obtenerItemsNegocio } from '../../services/itemService';
import {
  obtenerPromocionPorId,
  actualizarPromocionNegocio,
} from '../../services/promocionNegocioService';

const TIPOS = ['Cashback', 'Descuento', 'Giro Especial'];

function ItemModal({ visible, data, onSelect, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>Seleccionar producto</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.IdItemNegocio)}
            renderItem={({ item }) => (
              <Pressable
                style={styles.option}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.optionTitle}>{item.Nombre}</Text>
              </Pressable>
            )}
          />
          <DeunaButton title="Cerrar" variant="outline" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export default function EditarPromocionScreen({ navigation, route }) {
  const { idNegocio } = useAuth();
  const idPromocion = route?.params?.idPromocion;

  const [items, setItems] = useState([]);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [modalItems, setModalItems] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoPromocion, setTipoPromocion] = useState('Cashback');
  const [valorDescuento, setValorDescuento] = useState('');
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFin, setHoraFin] = useState('22:00');
  const [activa, setActiva] = useState(true);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function cargar() {
      if (!idPromocion) {
        Alert.alert('Error', 'Promoción no indicada.');
        navigation.goBack();
        return;
      }

      try {
        const [promo, itemsData] = await Promise.all([
          obtenerPromocionPorId(idPromocion),
          idNegocio ? obtenerItemsNegocio(idNegocio) : [],
        ]);

        setTitulo(promo.Titulo ?? '');
        setDescripcion(promo.Descripcion ?? '');
        setTipoPromocion(promo.TipoPromocion ?? 'Cashback');
        setValorDescuento(String(promo.ValorDescuento ?? ''));
        setHoraInicio((promo.HoraInicio ?? '08:00:00').slice(0, 5));
        setHoraFin((promo.HoraFin ?? '22:00:00').slice(0, 5));
        setActiva(promo.Activa !== false);
        setItems(itemsData ?? []);

        if (promo.IdItemNegocio && promo.ItemsNegocio) {
          setItemSeleccionado(promo.ItemsNegocio);
        } else if (promo.IdItemNegocio) {
          const item = itemsData.find(
            (i) => String(i.IdItemNegocio) === String(promo.IdItemNegocio)
          );
          if (item) setItemSeleccionado(item);
        }
      } catch (e) {
        Alert.alert('Error', e.message ?? 'No se pudo cargar la promoción.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [idPromocion, idNegocio, navigation]);

  const guardar = async () => {
    if (!titulo.trim() || !descripcion.trim()) {
      Alert.alert('Campos requeridos', 'Completa título y descripción.');
      return;
    }

    const valor = Number(valorDescuento || 0);
    if (tipoPromocion !== 'Giro Especial' && valor <= 0) {
      Alert.alert('Valor inválido', 'Ingresa un valor mayor a 0.');
      return;
    }

    setGuardando(true);
    try {
      const actualizada = await actualizarPromocionNegocio(idPromocion, {
        Titulo: titulo.trim(),
        Descripcion: descripcion.trim(),
        TipoPromocion: tipoPromocion,
        ValorDescuento: tipoPromocion === 'Giro Especial' ? 0 : valor,
        IdItemNegocio: itemSeleccionado?.IdItemNegocio ?? null,
        HoraInicio: horaInicio,
        HoraFin: horaFin,
        Activa: activa,
      });

      Alert.alert(
        'Promoción actualizada',
        `"${actualizada.Titulo}" se guardó correctamente.`,
        [{ text: 'Aceptar', onPress: () => navigation.goBack() }]
      );
    } catch (e) {
      Alert.alert('Error', e.message ?? 'No se pudo actualizar.');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </Pressable>
          <Text style={styles.title}>Editar promoción</Text>
          <View style={styles.headerSpace} />
        </View>

        <DeunaCard>
          <View style={styles.switchRow}>
            <Text style={styles.labelInline}>Promoción activa</Text>
            <Switch value={activa} onValueChange={setActiva} trackColor={{ true: colors.cashback }} />
          </View>

          <Text style={styles.label}>Título</Text>
          <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
          />

          <Text style={styles.label}>Tipo</Text>
          <View style={styles.tipoRow}>
            {TIPOS.map((tipo) => (
              <Pressable
                key={tipo}
                onPress={() => setTipoPromocion(tipo)}
                style={[styles.tipoChip, tipoPromocion === tipo && styles.tipoChipActive]}
              >
                <Text style={[styles.tipoText, tipoPromocion === tipo && styles.tipoTextActive]}>
                  {tipo}
                </Text>
              </Pressable>
            ))}
          </View>

          {tipoPromocion !== 'Giro Especial' && (
            <>
              <Text style={styles.label}>Valor</Text>
              <TextInput
                style={styles.input}
                value={valorDescuento}
                onChangeText={setValorDescuento}
                keyboardType="decimal-pad"
              />
            </>
          )}

          <Text style={styles.label}>Producto</Text>
          <Pressable style={styles.selector} onPress={() => setModalItems(true)}>
            <Text style={styles.selectorText}>
              {itemSeleccionado?.Nombre ?? 'Sin producto vinculado'}
            </Text>
          </Pressable>

          <View style={styles.row}>
            <TextInput style={[styles.input, styles.inputHalf]} value={horaInicio} onChangeText={setHoraInicio} />
            <TextInput style={[styles.input, styles.inputHalf]} value={horaFin} onChangeText={setHoraFin} />
          </View>
        </DeunaCard>

        <DeunaButton
          title="Guardar cambios"
          variant="cashback"
          onPress={guardar}
          loading={guardando}
          disabled={guardando}
        />
      </ScrollView>

      <ItemModal
        visible={modalItems}
        data={items}
        onSelect={setItemSeleccionado}
        onClose={() => setModalItems(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundAlt },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '800', color: colors.primary },
  headerSpace: { width: 42 },
  label: { marginTop: spacing.md, marginBottom: 6, fontSize: 13, fontWeight: '700', color: colors.textMuted },
  labelInline: { fontSize: 15, fontWeight: '700', color: colors.text },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.white,
    fontSize: 15,
  },
  textArea: { minHeight: 88, textAlignVertical: 'top' },
  tipoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tipoChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipoChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tipoText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  tipoTextActive: { color: colors.white },
  selector: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: 13,
    backgroundColor: colors.white,
  },
  selectorText: { fontSize: 15, color: colors.text },
  row: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  inputHalf: { flex: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalBox: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: colors.primary, marginBottom: spacing.md },
  option: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  optionTitle: { fontSize: 15, fontWeight: '700' },
});
