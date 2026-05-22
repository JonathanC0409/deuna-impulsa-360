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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors, spacing, radii } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { obtenerItemsNegocio } from '../../services/itemService';
import { crearPromocionNegocio } from '../../services/promocionNegocioService';

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
                <Text style={styles.optionSub}>
                  ${Number(item.Precio).toFixed(2)}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No hay productos disponibles.</Text>
            }
          />

          <DeunaButton title="Cerrar" variant="outline" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export default function CrearPromocionScreen({ navigation }) {
  const { idNegocio } = useAuth();

  const [items, setItems] = useState([]);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [modalItems, setModalItems] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoPromocion, setTipoPromocion] = useState('Cashback');
  const [valorDescuento, setValorDescuento] = useState('');
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFin, setHoraFin] = useState('22:00');
  const [diasDuracion, setDiasDuracion] = useState('30');

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        if (!idNegocio) return;

        const data = await obtenerItemsNegocio(idNegocio);
        setItems(data ?? []);
      } catch (e) {
        Alert.alert('Error', e.message ?? 'No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [idNegocio]);

  const guardarPromocion = async () => {
    if (!idNegocio) {
      Alert.alert('Sesión', 'No hay negocio vinculado.');
      return;
    }

    if (!titulo.trim()) {
      Alert.alert('Campo requerido', 'Ingresa un título para la promoción.');
      return;
    }

    if (!descripcion.trim()) {
      Alert.alert('Campo requerido', 'Ingresa una descripción.');
      return;
    }

    const valor = Number(valorDescuento || 0);

    if (tipoPromocion !== 'Giro Especial' && valor <= 0) {
      Alert.alert('Valor inválido', 'Ingresa un valor mayor a 0.');
      return;
    }

    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setDate(fechaInicio.getDate() + Number(diasDuracion || 30));

    setGuardando(true);

    try {
      await crearPromocionNegocio({
        IdNegocio: idNegocio,
        IdItemNegocio: itemSeleccionado?.IdItemNegocio ?? null,
        Titulo: titulo.trim(),
        Descripcion: descripcion.trim(),
        TipoPromocion: tipoPromocion,
        ValorDescuento: tipoPromocion === 'Giro Especial' ? 0 : valor,
        HoraInicio: horaInicio || null,
        HoraFin: horaFin || null,
        FechaInicio: fechaInicio.toISOString(),
        FechaFin: fechaFin.toISOString(),
      });

      Alert.alert(
        'Promoción creada',
        'La promoción ya está disponible para los clientes.',
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (e) {
      Alert.alert('Error', e.message ?? 'No se pudo crear la promoción.');
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
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </Pressable>

          <Text style={styles.title}>Crear promoción</Text>

          <View style={styles.headerSpace} />
        </View>

        <DeunaCard>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ej: 10% cashback en bebidas"
          />

          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Describe el beneficio para el cliente"
            multiline
          />

          <Text style={styles.label}>Tipo de promoción</Text>
          <View style={styles.tipoRow}>
            {TIPOS.map((tipo) => (
              <Pressable
                key={tipo}
                onPress={() => setTipoPromocion(tipo)}
                style={[
                  styles.tipoChip,
                  tipoPromocion === tipo && styles.tipoChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.tipoText,
                    tipoPromocion === tipo && styles.tipoTextActive,
                  ]}
                >
                  {tipo}
                </Text>
              </Pressable>
            ))}
          </View>

          {tipoPromocion !== 'Giro Especial' && (
            <>
              <Text style={styles.label}>
                {tipoPromocion === 'Cashback'
                  ? 'Porcentaje de cashback'
                  : 'Valor de descuento'}
              </Text>
              <TextInput
                style={styles.input}
                value={valorDescuento}
                onChangeText={setValorDescuento}
                keyboardType="decimal-pad"
                placeholder={tipoPromocion === 'Cashback' ? 'Ej: 5' : 'Ej: 0.50'}
              />
            </>
          )}

          <Text style={styles.label}>Producto relacionado</Text>
          <Pressable
            style={styles.selector}
            onPress={() => setModalItems(true)}
          >
            <Text style={styles.selectorText}>
              {itemSeleccionado
                ? itemSeleccionado.Nombre
                : 'Opcional: seleccionar producto'}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
          </Pressable>

          <Text style={styles.label}>Horario</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              value={horaInicio}
              onChangeText={setHoraInicio}
              placeholder="08:00"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              value={horaFin}
              onChangeText={setHoraFin}
              placeholder="22:00"
            />
          </View>

          <Text style={styles.label}>Duración en días</Text>
          <TextInput
            style={styles.input}
            value={diasDuracion}
            onChangeText={setDiasDuracion}
            keyboardType="number-pad"
            placeholder="30"
          />
        </DeunaCard>

        <DeunaButton
          title="Crear promoción"
          variant="cashback"
          onPress={guardarPromocion}
          loading={guardando}
          disabled={guardando}
          style={styles.button}
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
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  headerSpace: {
    width: 42,
  },
  label: {
    marginTop: spacing.md,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.white,
    fontSize: 15,
    color: colors.text,
  },
  textArea: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  tipoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tipoChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipoChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tipoText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  tipoTextActive: {
    color: colors.white,
  },
  selector: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    color: colors.text,
    fontSize: 15,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  inputHalf: {
    flex: 1,
  },
  button: {
    marginTop: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  option: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  optionSub: {
    marginTop: 3,
    color: colors.cashback,
    fontSize: 13,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    paddingVertical: spacing.lg,
  },
});