import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { colors } from '../../theme/colors';
import { ID_NEGOCIO_ACTIVO } from '../../constants/negocioActivo';
import { obtenerItemsNegocio } from '../../services/itemService';
import { obtenerClientes, crearVentaConDetalle } from '../../services/ventaService';

function SelectorModal({ visible, title, data, onSelect, onClose, labelKey }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.box}>
          <Text style={modalStyles.title}>{title}</Text>
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.IdUsuario ?? item.IdItemNegocio)}
            renderItem={({ item }) => (
              <Pressable
                style={modalStyles.option}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={modalStyles.optionText}>{item[labelKey]}</Text>
                {item.Precio != null && (
                  <Text style={modalStyles.optionSub}>${Number(item.Precio).toFixed(2)}</Text>
                )}
              </Pressable>
            )}
          />
          <DeunaButton title="Cerrar" variant="outline" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  box: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.primary, marginBottom: 12 },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: { fontSize: 16, color: colors.text, fontWeight: '600' },
  optionSub: { fontSize: 13, color: colors.cashback, marginTop: 2 },
});

export default function RegistrarVentaScreen({ navigation }) {
  const [clientes, setClientes] = useState([]);
  const [items, setItems] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [item, setItem] = useState(null);
  const [cantidad, setCantidad] = useState('1');
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [modalCliente, setModalCliente] = useState(false);
  const [modalItem, setModalItem] = useState(false);
  const [exito, setExito] = useState(null);

  const total = useMemo(() => {
    if (!item) return 0;
    const qty = parseInt(cantidad, 10) || 0;
    return Number(item.Precio) * qty;
  }, [item, cantidad]);

  const cargar = async () => {
    try {
      const [c, i] = await Promise.all([
        obtenerClientes(),
        obtenerItemsNegocio(ID_NEGOCIO_ACTIVO),
      ]);
      setClientes(c);
      setItems(i.filter((x) => x.Estado !== 'Agotado' || !x.ManejaStock));
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setExito(null);
    setLoading(true);
    cargar();
  }, []);

  const handleConfirmar = async () => {
    if (!cliente || !item) {
      Alert.alert('Selección incompleta', 'Elige cliente e ítem.');
      return;
    }
    const qty = parseInt(cantidad, 10);
    if (!qty || qty <= 0) {
      Alert.alert('Cantidad inválida', 'Ingresa una cantidad mayor a 0.');
      return;
    }

    setProcesando(true);
    try {
      const resultado = await crearVentaConDetalle({
        idNegocio: ID_NEGOCIO_ACTIVO,
        idCliente: cliente.IdUsuario,
        idItemNegocio: item.IdItemNegocio,
        cantidad: qty,
      });

      setExito(resultado);

      Alert.alert(
        'Venta exitosa',
        `Cobro Deuna confirmado por $${resultado.total.toFixed(2)}`,
        [
          {
            text: 'Ver pago exitoso',
            onPress: () => {
              navigation.getParent()?.getParent()?.navigate('Cliente', {
                screen: 'PagoExitoso',
                params: {
                  puntos: Math.floor(resultado.total * 10),
                  total: resultado.total,
                },
              });
            },
          },
          { text: 'Volver al dashboard', onPress: () => navigation.navigate('DashboardNegocio') },
        ]
      );
    } catch (e) {
      Alert.alert('No se pudo registrar', e.message);
    } finally {
      setProcesando(false);
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
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {exito && (
          <DeunaCard style={styles.exitoCard}>
            <Text style={styles.exitoTitle}>✓ Venta registrada</Text>
            <Text style={styles.exitoText}>Total: ${exito.total.toFixed(2)} · Deuna</Text>
          </DeunaCard>
        )}

        <DeunaCard>
          <Text style={styles.label}>Cliente</Text>
          <Pressable style={styles.selector} onPress={() => setModalCliente(true)}>
            <Text style={styles.selectorText}>
              {cliente ? cliente.Nombre : 'Seleccionar cliente'}
            </Text>
          </Pressable>

          <Text style={[styles.label, styles.spaced]}>Ítem</Text>
          <Pressable style={styles.selector} onPress={() => setModalItem(true)}>
            <Text style={styles.selectorText}>
              {item ? `${item.Nombre} — $${Number(item.Precio).toFixed(2)}` : 'Seleccionar ítem'}
            </Text>
          </Pressable>

          <Text style={[styles.label, styles.spaced]}>Cantidad</Text>
          <TextInput
            style={styles.input}
            value={cantidad}
            onChangeText={setCantidad}
            keyboardType="number-pad"
          />

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total a cobrar</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </DeunaCard>

        <DeunaButton
          title="Confirmar cobro con Deuna"
          variant="cashback"
          onPress={handleConfirmar}
          loading={procesando}
          disabled={!cliente || !item || total <= 0}
        />
      </ScrollView>

      <SelectorModal
        visible={modalCliente}
        title="Clientes"
        data={clientes}
        labelKey="Nombre"
        onSelect={setCliente}
        onClose={() => setModalCliente(false)}
      />
      <SelectorModal
        visible={modalItem}
        title="Ítems del negocio"
        data={items}
        labelKey="Nombre"
        onSelect={setItem}
        onClose={() => setModalItem(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20, paddingBottom: 32 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  selector: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    backgroundColor: colors.surface,
  },
  selectorText: { fontSize: 16, color: colors.text },
  spaced: { marginTop: 14 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  totalBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
  },
  totalLabel: { fontSize: 13, color: colors.primary },
  totalValue: { fontSize: 32, fontWeight: '800', color: colors.primary, marginTop: 4 },
  exitoCard: { marginBottom: 16, backgroundColor: '#E6FBF4', borderColor: colors.cashback },
  exitoTitle: { fontSize: 16, fontWeight: '700', color: colors.success },
  exitoText: { fontSize: 14, color: colors.text, marginTop: 4 },
});
