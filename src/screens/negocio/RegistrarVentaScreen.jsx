import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import { useAuth } from '../../context/AuthContext';
import { obtenerItemsNegocio } from '../../services/itemService';
import { obtenerNegocio } from '../../services/negocioService';
import { esHorarioPromocionalActivo } from '../../services/promocionService';
import { crearVentaConDetalle, obtenerClientes } from '../../services/ventaService';
import { colors } from '../../theme/colors';

function getItemId(item) {
  return (
    item?.IdItemNegocio ??
    item?.idItemNegocio ??
    item?.id_item_negocio ??
    item?.IdItem ??
    item?.id
  );
}

function getUsuarioId(usuario) {
  return (
    usuario?.IdUsuario ??
    usuario?.idUsuario ??
    usuario?.id_usuario ??
    usuario?.id
  );
}

function SelectorModal({ visible, title, data, onSelect, onClose, labelKey }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={modalStyles.overlayBottom}>
        <View style={modalStyles.box}>
          <Text style={modalStyles.title}>{title}</Text>

          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              String(getUsuarioId(item) ?? getItemId(item) ?? index)
            }
            renderItem={({ item }) => (
              <Pressable
                style={modalStyles.option}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={modalStyles.optionText}>
                  {item[labelKey] ?? 'Sin nombre'}
                </Text>

                {item.Precio != null && (
                  <Text style={modalStyles.optionSub}>
                    ${Number(item.Precio).toFixed(2)}
                    {item.ManejaStock
                      ? ` · Stock: ${item.Stock}`
                      : ' · Sin control de stock'}
                  </Text>
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={modalStyles.emptyText}>
                No hay datos disponibles.
              </Text>
            }
          />

          <DeunaButton title="Cerrar" variant="outline" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export default function RegistrarVentaScreen({ navigation }) {
  const { idNegocio } = useAuth();

  const [clientes, setClientes] = useState([]);
  const [items, setItems] = useState([]);

  const [cliente, setCliente] = useState(null);
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState('1');
  const [detalleVenta, setDetalleVenta] = useState([]);

  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState(false);

  const [modalCliente, setModalCliente] = useState(false);
  const [modalItem, setModalItem] = useState(false);

  const [exito, setExito] = useState(null);
  const [modalExito, setModalExito] = useState(false);
  const [datosVentaExitosa, setDatosVentaExitosa] = useState(null);

  const total = useMemo(() => {
    return detalleVenta.reduce((sum, item) => {
      return sum + Number(item.Precio) * Number(item.Cantidad);
    }, 0);
  }, [detalleVenta]);

  const cargar = async () => {
    try {
      if (!idNegocio) {
        setClientes([]);
        setItems([]);
        return;
      }

      const [clientesData, itemsData] = await Promise.all([
        obtenerClientes(),
        obtenerItemsNegocio(idNegocio),
      ]);

      setClientes(clientesData ?? []);
      setItems(
        (itemsData ?? []).filter((x) => x.Estado !== 'Agotado' || !x.ManejaStock)
      );
    } catch (e) {
      console.error('[RegistrarVentaScreen] cargar:', e);
      Alert.alert('Error', e.message ?? 'No se pudo cargar la información.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setExito(null);
    setLoading(true);
    cargar();
  }, [idNegocio]);

  const agregarItemAVenta = () => {
    if (!itemSeleccionado) {
      Alert.alert('Ítem requerido', 'Selecciona un ítem.');
      return;
    }

    const idItem = getItemId(itemSeleccionado);

    if (!idItem) {
      Alert.alert(
        'Error',
        'El ítem seleccionado no tiene ID. Revisa el nombre de la columna en Supabase.'
      );
      return;
    }

    const qty = parseInt(cantidad, 10);

    if (!qty || qty <= 0) {
      Alert.alert('Cantidad inválida', 'Ingresa una cantidad mayor a 0.');
      return;
    }

    if (itemSeleccionado.ManejaStock && Number(itemSeleccionado.Stock) < qty) {
      Alert.alert(
        'Stock insuficiente',
        `Solo hay ${itemSeleccionado.Stock} unidades disponibles.`
      );
      return;
    }

    const existente = detalleVenta.find(
      (x) => String(x.IdItemNegocio) === String(idItem)
    );

    if (existente) {
      const nuevaCantidad = Number(existente.Cantidad) + qty;

      if (
        itemSeleccionado.ManejaStock &&
        Number(itemSeleccionado.Stock) < nuevaCantidad
      ) {
        Alert.alert(
          'Stock insuficiente',
          `No puedes agregar más de ${itemSeleccionado.Stock} unidades de este ítem.`
        );
        return;
      }

      setDetalleVenta((prev) =>
        prev.map((x) =>
          String(x.IdItemNegocio) === String(idItem)
            ? {
                ...x,
                Cantidad: nuevaCantidad,
                Subtotal: Number(x.Precio) * nuevaCantidad,
              }
            : x
        )
      );
    } else {
      setDetalleVenta((prev) => [
        ...prev,
        {
          IdItemNegocio: idItem,
          Nombre: itemSeleccionado.Nombre,
          Precio: Number(itemSeleccionado.Precio),
          Cantidad: qty,
          Subtotal: Number(itemSeleccionado.Precio) * qty,
          ManejaStock: itemSeleccionado.ManejaStock,
          Stock: itemSeleccionado.Stock,
        },
      ]);
    }

    setItemSeleccionado(null);
    setCantidad('1');
  };

  const quitarItemVenta = (idItemNegocio) => {
    setDetalleVenta((prev) =>
      prev.filter((x) => String(x.IdItemNegocio) !== String(idItemNegocio))
    );
  };

  const limpiarVenta = () => {
    setItemSeleccionado(null);
    setCantidad('1');
    setDetalleVenta([]);
  };

  const handleConfirmar = async () => {
    if (!idNegocio) {
      Alert.alert('Sesión', 'No hay negocio vinculado a tu cuenta.');
      return;
    }

    if (!cliente) {
      Alert.alert('Selección incompleta', 'Elige un cliente.');
      return;
    }

    const idCliente = getUsuarioId(cliente);

    if (!idCliente) {
      Alert.alert(
        'Error',
        'El cliente seleccionado no tiene ID. Revisa la tabla Usuarios.'
      );
      return;
    }

    if (detalleVenta.length === 0) {
      Alert.alert('Venta vacía', 'Agrega al menos un ítem a la venta.');
      return;
    }

    const itemsParaVenta = detalleVenta.map((x) => ({
      idItemNegocio: getItemId(x),
      cantidad: Number(x.Cantidad) || 0,
    }));

    const itemSinId = itemsParaVenta.find((x) => !x.idItemNegocio);

    if (itemSinId) {
      Alert.alert(
        'Error',
        'Hay un ítem en el detalle que no tiene ID. Elimínalo y vuelve a agregarlo.'
      );
      return;
    }

    setProcesando(true);

    try {
      const resultado = await crearVentaConDetalle({
        idNegocio,
        idCliente,
        items: itemsParaVenta,
      });

      const negocio = await obtenerNegocio(idNegocio);
      const horarioPromo = await esHorarioPromocionalActivo(idNegocio);
      const cashback = Number((resultado.total * 0.05).toFixed(2));

      const ventaExitosa = {
        ventaId: resultado.venta.IdVenta,
        negocioId: idNegocio,
        monto: resultado.total,
        comercio: negocio.NombreNegocio,
        cashback,
        esHorarioPromocional: horarioPromo,
        cliente: cliente.Nombre,
      };

      setExito(resultado);
      setDatosVentaExitosa(ventaExitosa);
      setModalExito(true);

      limpiarVenta();
      await cargar();
    } catch (e) {
      console.error('[RegistrarVentaScreen] confirmar venta:', e);
      Alert.alert(
        'No se pudo registrar',
        e.message ?? 'Ocurrió un error al registrar la venta.'
      );
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
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {exito && (
          <DeunaCard style={styles.exitoCard}>
            <Text style={styles.exitoTitle}>✓ Venta registrada</Text>
            <Text style={styles.exitoText}>
              Total: ${exito.total.toFixed(2)} · Deuna
            </Text>
          </DeunaCard>
        )}

        <DeunaCard>
          <Text style={styles.label}>Cliente</Text>

          <Pressable
            style={styles.selector}
            onPress={() => setModalCliente(true)}
          >
            <Text style={styles.selectorText}>
              {cliente ? cliente.Nombre : 'Seleccionar cliente'}
            </Text>
          </Pressable>

          <Text style={[styles.label, styles.spaced]}>Ítem</Text>

          <Pressable
            style={styles.selector}
            onPress={() => setModalItem(true)}
          >
            <Text style={styles.selectorText}>
              {itemSeleccionado
                ? `${itemSeleccionado.Nombre} — $${Number(
                    itemSeleccionado.Precio
                  ).toFixed(2)}`
                : 'Seleccionar ítem'}
            </Text>
          </Pressable>

          <Text style={[styles.label, styles.spaced]}>Cantidad</Text>

          <TextInput
            style={styles.input}
            value={cantidad}
            onChangeText={setCantidad}
            keyboardType="number-pad"
          />

          <DeunaButton
            title="Agregar a venta"
            variant="outline"
            onPress={agregarItemAVenta}
            disabled={!itemSeleccionado}
            style={styles.addButton}
          />
        </DeunaCard>

        <DeunaCard style={styles.detalleCard}>
          <View style={styles.detalleHeader}>
            <Text style={styles.detalleTitle}>Detalle de venta</Text>

            {detalleVenta.length > 0 && (
              <Pressable onPress={limpiarVenta}>
                <Text style={styles.limpiarText}>Limpiar</Text>
              </Pressable>
            )}
          </View>

          {detalleVenta.length === 0 ? (
            <Text style={styles.emptyDetail}>No hay ítems agregados.</Text>
          ) : (
            detalleVenta.map((item) => (
              <View
                key={String(item.IdItemNegocio)}
                style={styles.detalleItem}
              >
                <View style={styles.detalleInfo}>
                  <Text style={styles.detalleNombre}>{item.Nombre}</Text>
                  <Text style={styles.detalleSub}>
                    {item.Cantidad} x ${Number(item.Precio).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.detalleRight}>
                  <Text style={styles.detalleSubtotal}>
                    ${Number(item.Subtotal).toFixed(2)}
                  </Text>

                  <Pressable
                    onPress={() => quitarItemVenta(item.IdItemNegocio)}
                    style={styles.deleteMini}
                  >
                    <Ionicons name="close" size={16} color={colors.danger} />
                  </Pressable>
                </View>
              </View>
            ))
          )}

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
          disabled={!cliente || detalleVenta.length === 0 || total <= 0}
        />
      </ScrollView>

      <Modal visible={modalExito} animationType="fade" transparent>
        <View style={modalStyles.overlayCenter}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={42} color={colors.white} />
            </View>

            <Text style={styles.successTitle}>Cobro confirmado</Text>

            <Text style={styles.successText}>
              La venta fue registrada correctamente con Deuna.
            </Text>

            <Text style={styles.successAmount}>
              ${Number(datosVentaExitosa?.monto ?? 0).toFixed(2)}
            </Text>

            <Text style={styles.successDetail}>
              Cliente: {datosVentaExitosa?.cliente ?? 'Cliente'}
            </Text>

            <Text style={styles.successDetail}>
              Cashback estimado: $
              {Number(datosVentaExitosa?.cashback ?? 0).toFixed(2)}
            </Text>

            <DeunaButton
              title="Aceptar"
              variant="cashback"
              onPress={() => setModalExito(false)}
              style={styles.successButton}
            />

            <DeunaButton
              title="Ver flujo cliente"
              variant="outline"
              onPress={() => {
                setModalExito(false);

                navigation.getParent()?.getParent()?.navigate('Cliente', {
                  screen: 'PagoExitoso',
                  params: {
                    ventaId: datosVentaExitosa?.ventaId,
                    negocioId: datosVentaExitosa?.negocioId,
                    monto: datosVentaExitosa?.monto,
                    comercio: datosVentaExitosa?.comercio,
                    cashback: datosVentaExitosa?.cashback,
                    esHorarioPromocional:
                      datosVentaExitosa?.esHorarioPromocional,
                  },
                });
              }}
              style={styles.successButton}
            />
          </View>
        </View>
      </Modal>

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
        onSelect={setItemSeleccionado}
        onClose={() => setModalItem(false)}
      />
    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  overlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  optionSub: {
    fontSize: 13,
    color: colors.cashback,
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textMuted,
    paddingVertical: 20,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  selector: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginTop: 6,
    backgroundColor: colors.surface,
  },
  selectorText: {
    fontSize: 16,
    color: colors.text,
  },
  spaced: {
    marginTop: 14,
  },
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
  addButton: {
    marginTop: 16,
  },
  detalleCard: {
    marginTop: 16,
  },
  detalleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detalleTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  limpiarText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 13,
  },
  emptyDetail: {
    marginTop: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  detalleItem: {
    marginTop: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detalleInfo: {
    flex: 1,
  },
  detalleNombre: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  detalleSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  detalleRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  detalleSubtotal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.cashback,
  },
  deleteMini: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF0F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 13,
    color: colors.primary,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  exitoCard: {
    marginBottom: 16,
    backgroundColor: '#E6FBF4',
    borderColor: colors.cashback,
  },
  exitoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
  },
  exitoText: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  successModal: {
    backgroundColor: colors.white,
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.cashback,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  successAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.cashback,
    marginTop: 16,
  },
  successDetail: {
    fontSize: 14,
    color: colors.text,
    marginTop: 6,
    textAlign: 'center',
  },
  successButton: {
    marginTop: 14,
    width: '100%',
  },
});