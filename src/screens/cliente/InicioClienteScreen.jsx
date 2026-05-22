import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import ClienteHeader from '../../components/cliente/ClienteHeader';
import SaldoCard from '../../components/cliente/SaldoCard';
import BannerPromo from '../../components/cliente/BannerPromo';
import RewardItem from '../../components/cliente/RewardItem';
import AccesoRapidoButton from '../../components/cliente/AccesoRapidoButton';
import { colors, spacing, radii, typography, MIN_TOUCH_TARGET } from '../../components/cliente/clienteTheme';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { listarNegocios } from '../../services/negocioService';
import { simularPagoClientePorMonto } from '../../services/ventaService';
import DeunaButton from '../../components/DeunaButton';
import { esHorarioPromocionalActivo } from '../../services/promocionService';
import { totalCashbackDisponible } from '../../services/recompensaService';
import { obtenerRecompensasUsuario } from '../../services/recompensaService';
import { ACCESOS_RAPIDOS } from '../../components/cliente/mockClienteData';
import { irARuleta } from '../../navigation/ruletaNavigation';
import { navigateSafe } from '../../navigation/appRoutes';

export default function InicioClienteScreen({ navigation }) {
  const router = useRouter();
  const { usuario, giroBienvenida } = useAuth();
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [cashbackTotal, setCashbackTotal] = useState(0);
  const [recompensas, setRecompensas] = useState([]);
  const [modalQrVisible, setModalQrVisible] = useState(false);
  const [montoPago, setMontoPago] = useState('');
  const [negocios, setNegocios] = useState([]);
  const [negocioPago, setNegocioPago] = useState(null);
  const [cargandoNegocios, setCargandoNegocios] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(null);

  const primerNombre = usuario?.Nombre?.split(' ')[0] ?? 'Cliente';

  useEffect(() => {
    if (!usuario?.IdUsuario) return;
    (async () => {
      try {
        const [cb, rec] = await Promise.all([
          totalCashbackDisponible(usuario.IdUsuario),
          obtenerRecompensasUsuario(usuario.IdUsuario),
        ]);
        setCashbackTotal(cb);
        setRecompensas(rec.slice(0, 3));
      } catch (e) {
        console.warn('Inicio datos:', e.message);
      }
    })();
  }, [usuario?.IdUsuario]);

  const abrirModalQr = async () => {
    if (!usuario?.IdUsuario) {
      Alert.alert('Sesión', 'Inicia sesión como cliente para pagar.');
      return;
    }

    setCargandoNegocios(true);
    setModalQrVisible(true);
    setMontoPago('');
    setPagoExitoso(null);

    try {
      const lista = await listarNegocios();
      if (!lista?.length) {
        setModalQrVisible(false);
        Alert.alert('Sin negocios', 'No hay comercios afiliados para pagar.');
        return;
      }
      setNegocios(lista);
      setNegocioPago(lista[0]);
    } catch (e) {
      setModalQrVisible(false);
      Alert.alert('Error', e.message ?? 'No se pudieron cargar los comercios.');
    } finally {
      setCargandoNegocios(false);
    }
  };

  const confirmarPagoQr = async () => {
    if (!usuario?.IdUsuario || !negocioPago) return;

    setProcesandoPago(true);
    try {
      const resultado = await simularPagoClientePorMonto({
        idCliente: usuario.IdUsuario,
        idNegocio: negocioPago.IdNegocio,
        monto: montoPago,
      });

      const horarioPromo = await esHorarioPromocionalActivo(negocioPago.IdNegocio);
      const cashback = Number((resultado.total * 0.05).toFixed(2));
      const pagoParams = {
        ventaId: resultado.venta.IdVenta,
        negocioId: negocioPago.IdNegocio,
        monto: resultado.total,
        comercio: negocioPago.NombreNegocio,
        cashback,
        esHorarioPromocional: horarioPromo,
      };

      const datosRuleta = {
        ventaId: pagoParams.ventaId,
        usuarioId: usuario.IdUsuario,
        negocioId: pagoParams.negocioId,
        montoVenta: pagoParams.monto,
        nombreNegocio: pagoParams.comercio,
        esHorarioPromocional: horarioPromo,
      };

      setPagoExitoso({
        monto: resultado.total,
        comercio: negocioPago.NombreNegocio,
        datosRuleta,
        pagoParams,
      });
    } catch (e) {
      Alert.alert('Pago no completado', e.message ?? 'No se pudo simular el pago.');
    } finally {
      setProcesandoPago(false);
    }
  };

  const handleAcceso = (item) => {
    const { screen } = item;
    if (screen === 'PagoExitoso') {
      abrirModalQr();
      return;
    }
    if (navigateSafe(router, screen)) return;
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <ScreenContainer style={styles.screenInner}>
          <ClienteHeader nombre={primerNombre} />

          {giroBienvenida ? (
            <Pressable
              style={styles.bienvenidaBanner}
              onPress={() => router.push('/giro-bienvenida')}
            >
              <Text style={styles.bienvenidaTitle}>🎁 Tienes un giro gratis de bienvenida</Text>
              <Text style={styles.bienvenidaSub}>Toca aquí para girar la ruleta</Text>
            </Pressable>
          ) : null}

          <SaldoCard
            saldo={cashbackTotal}
            label="Cashback disponible"
            onVerDetalle={() => navigateSafe(router, 'Billetera')}
            style={styles.block}
          />

          <BannerPromo
            titulo="¡Gana un giro premium!"
            subtitulo="Haz 3 pagos más en comercios aliados y participa"
            onPress={() => navigateSafe(router, 'Promociones')}
            style={styles.block}
          />

          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <View style={styles.grid}>
            {ACCESOS_RAPIDOS.map((item) => (
              <AccesoRapidoButton
                key={item.id}
                label={item.label}
                icono={item.icono}
                onPress={() => handleAcceso(item)}
              />
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [styles.qrButton, pressed && styles.qrPressed]}
            onPress={abrirModalQr}
            disabled={procesandoPago}
            accessibilityRole="button"
            accessibilityLabel="Escanear QR"
          >
            {procesandoPago ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Ionicons name="qr-code" size={26} color={colors.white} />
                <Text style={styles.qrText}>Escanear QR</Text>
              </>
            )}
          </Pressable>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis promociones</Text>
            <Pressable
              onPress={() => navigateSafe(router, 'Promociones')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.verTodo}>Ver todo</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.promoCard, pressed && { opacity: 0.92 }]}
            onPress={() => navigateSafe(router, 'Promociones')}
          >
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>Giro premium</Text>
            </View>
            <Text style={styles.promoTitle}>Tienda Don Luis</Text>
            <Text style={styles.promoDesc}>Paga con Deuna y participa por premios</Text>
          </Pressable>

          <View style={[styles.sectionHeader, styles.sectionSpaced]}>
            <Text style={styles.sectionTitle}>Recompensas recientes</Text>
            <Pressable onPress={() => navigateSafe(router, 'MisRecompensas')}>
              <Text style={styles.verTodo}>Ver todo</Text>
            </Pressable>
          </View>
        {recompensas.length === 0 ? (
          <Text style={styles.emptyRec}>Aún no tienes recompensas. ¡Paga y gira la ruleta!</Text>
        ) : (
          recompensas.slice(0, 2).map((item) => (
            <View key={item.IdRecompensa ?? item.id} style={styles.rewardGap}>
              <RewardItem
                titulo={item.titulo ?? item.Premio}
                negocio={item.TipoRecompensa}
                estado={item.estado}
                fecha={item.FechaGanada}
              />
            </View>
          ))
        )}
        </ScreenContainer>
      </ScrollView>

      <Modal visible={modalQrVisible} animationType="fade" transparent statusBarTranslucent>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            if (!procesandoPago) {
              setModalQrVisible(false);
              setPagoExitoso(null);
            }
          }}
        >
          <Pressable style={styles.pagoCard} onPress={() => {}}>
            <Pressable
              style={styles.modalClose}
              onPress={() => {
            if (!procesandoPago) {
              setModalQrVisible(false);
              setPagoExitoso(null);
            }
          }}
              hitSlop={12}
            >
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </Pressable>

            {pagoExitoso ? (
              <>
                <View style={styles.exitoIconWrap}>
                  <Ionicons name="checkmark-circle" size={56} color={colors.success} />
                </View>
                <Text style={styles.pagoCardTitle}>¡Pago exitoso!</Text>
                <Text style={styles.exitoComercio}>{pagoExitoso.comercio}</Text>
                <Text style={styles.exitoMonto}>${Number(pagoExitoso.monto).toFixed(2)}</Text>
                <Text style={styles.exitoSub}>
                  Tu compra quedó registrada. Tienes un giro en la ruleta.
                </Text>

                <DeunaButton
                  title="Girar la ruleta"
                  variant="cashback"
                  onPress={() => {
                    setModalQrVisible(false);
                    setPagoExitoso(null);
                    irARuleta(router, pagoExitoso.datosRuleta);
                  }}
                  style={styles.pagoConfirmBtn}
                />
                <DeunaButton
                  title="Ver comprobante"
                  variant="outline"
                  onPress={() => {
                    setModalQrVisible(false);
                    setPagoExitoso(null);
                    navigation.navigate('PagoExitoso', pagoExitoso.pagoParams);
                  }}
                  style={styles.btnSecundario}
                />
              </>
            ) : cargandoNegocios ? (
              <ActivityIndicator color={colors.primary} style={styles.modalLoader} />
            ) : (
              <>
                <View style={styles.qrIconWrap}>
                  <Ionicons name="qr-code" size={36} color={colors.white} />
                </View>

                <Text style={styles.pagoCardTitle}>Pagar con Deuna</Text>
                <Text style={styles.pagoCardSub}>
                  Escanea el QR del comercio, elige la tienda e ingresa el monto.
                </Text>
                <View style={styles.pagoSection}>
                  <Text style={styles.pagoSectionLabel}>Tienda</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tiendasRow}
                  >
                    {negocios.map((n) => {
                      const sel = String(negocioPago?.IdNegocio) === String(n.IdNegocio);
                      return (
                        <Pressable
                          key={String(n.IdNegocio)}
                          onPress={() => setNegocioPago(n)}
                          style={[styles.tiendaChip, sel && styles.tiendaChipActive]}
                        >
                          <Ionicons
                            name="storefront-outline"
                            size={16}
                            color={sel ? colors.primary : colors.textMuted}
                          />
                          <Text style={[styles.tiendaChipText, sel && styles.tiendaChipTextActive]}>
                            {n.NombreNegocio}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                <View style={styles.pagoSection}>
                  <Text style={styles.pagoSectionLabel}>Monto (USD)</Text>
                  <View style={styles.montoBox}>
                    <Text style={styles.montoSymbol}>$</Text>
                    <TextInput
                      style={styles.montoInput}
                      value={montoPago}
                      onChangeText={setMontoPago}
                      placeholder="0.00"
                      placeholderTextColor={colors.textMuted}
                      keyboardType="decimal-pad"
                      editable={!procesandoPago}
                    />
                  </View>
                </View>

                <View style={styles.beneficiosBox}>
                  <Text style={styles.beneficiosText}>
                    ✓ Giro en la ruleta al pagar · ✓ Cashback · ✓ Promos del comercio
                  </Text>
                </View>

                <DeunaButton
                  title={procesandoPago ? 'Procesando...' : 'Confirmar pago'}
                  variant="cashback"
                  onPress={confirmarPagoQr}
                  loading={procesandoPago}
                  disabled={procesandoPago || !montoPago.trim()}
                  style={styles.pagoConfirmBtn}
                />
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  screenInner: {
    paddingTop: spacing.md,
  },
  block: {
    marginBottom: spacing.md,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primaryMuted,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 16,
    marginBottom: spacing.xl,
    minHeight: MIN_TOUCH_TARGET + 10,
    ...typography.button,
  },
  qrPressed: {
    opacity: 0.88,
  },
  qrText: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionSpaced: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.h2,
  },
  verTodo: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  promoCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.badgeMint,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.sm,
    marginBottom: spacing.sm,
  },
  promoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },
  promoTitle: {
    ...typography.h3,
    fontSize: 16,
  },
  promoDesc: {
    ...typography.caption,
    marginTop: 4,
  },
  rewardGap: {
    marginBottom: spacing.md,
  },
  bienvenidaBanner: {
    backgroundColor: colors.cashback,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  bienvenidaTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.white,
  },
  bienvenidaSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  emptyRec: {
    ...typography.caption,
    marginBottom: spacing.lg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 10, 60, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  pagoCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  modalClose: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  qrIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  pagoCardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 6,
  },
  pagoCardSub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  pagoSection: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pagoSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  tiendasRow: { gap: spacing.sm, paddingRight: spacing.sm },
  tiendaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
  },
  tiendaChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  tiendaChipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
  tiendaChipTextActive: { color: colors.primary, fontWeight: '800' },
  montoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  montoSymbol: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    marginRight: 4,
  },
  montoInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    paddingVertical: 12,
    minWidth: 80,
  },
  beneficiosBox: {
    backgroundColor: '#E6FBF4',
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 150, 0.25)',
  },
  beneficiosText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '600',
  },
  pagoConfirmBtn: {
    borderRadius: radii.lg,
    marginTop: spacing.sm,
  },
  btnSecundario: {
    marginTop: spacing.sm,
  },
  exitoIconWrap: {
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  exitoComercio: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  exitoMonto: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  exitoSub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  modalLoader: {
    marginVertical: spacing.xl,
  },
});
