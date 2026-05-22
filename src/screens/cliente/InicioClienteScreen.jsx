import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
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
import { obtenerItemsNegocio } from '../../services/itemService';
import { simularPagoCliente } from '../../services/ventaService';
import { esHorarioPromocionalActivo } from '../../services/promocionService';
import { totalCashbackDisponible } from '../../services/recompensaService';
import { obtenerRecompensasUsuario } from '../../services/recompensaService';
import { ACCESOS_RAPIDOS } from '../../components/cliente/mockClienteData';

export default function InicioClienteScreen({ navigation }) {
  const router = useRouter();
  const { usuario, giroBienvenida } = useAuth();
  const [procesandoPago, setProcesandoPago] = useState(false);
  const [cashbackTotal, setCashbackTotal] = useState(0);
  const [recompensas, setRecompensas] = useState([]);

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

  const handleEscanearQR = async () => {
    if (!usuario?.IdUsuario) return;

    setProcesandoPago(true);
    try {
      const negocios = await listarNegocios();
      const negocio = negocios[0];
      if (!negocio) {
        Alert.alert('Sin negocios', 'No hay comercios afiliados para pagar.');
        return;
      }

      const items = await obtenerItemsNegocio(negocio.IdNegocio);
      const item = items.find((i) => i.Estado !== 'Agotado') ?? items[0];
      if (!item) {
        Alert.alert('Sin productos', 'Este negocio no tiene ítems disponibles.');
        return;
      }

      const qty = 1;
      const resultado = await simularPagoCliente({
        idCliente: usuario.IdUsuario,
        idNegocio: negocio.IdNegocio,
        idItemNegocio: item.IdItemNegocio,
        cantidad: qty,
      });

      const horarioPromo = await esHorarioPromocionalActivo(negocio.IdNegocio);
      const cashback = Number((resultado.total * 0.05).toFixed(2));

      navigation.navigate('PagoExitoso', {
        ventaId: resultado.venta.IdVenta,
        negocioId: negocio.IdNegocio,
        monto: resultado.total,
        comercio: negocio.NombreNegocio,
        cashback,
        esHorarioPromocional: horarioPromo,
      });
    } catch (e) {
      Alert.alert('Pago', e.message ?? 'No se pudo simular el pago.');
    } finally {
      setProcesandoPago(false);
    }
  };

  const handleAcceso = (item) => {
    const { screen } = item;
    if (screen === 'Ruleta' || screen === 'Negocio' || screen === 'Promociones') {
      navigation.getParent()?.navigate(screen);
      return;
    }
    if (screen === 'MisRecompensas') {
      navigation.navigate('MisRecompensas');
      return;
    }
    if (screen === 'PagoExitoso') {
      handleEscanearQR();
      return;
    }
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
            onVerDetalle={() => navigation.navigate('Billetera')}
            style={styles.block}
          />

          <BannerPromo
            titulo="¡Gana un giro premium!"
            subtitulo="Haz 3 pagos más en comercios aliados y participa"
            onPress={() => navigation.getParent()?.navigate('Promociones')}
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
            onPress={handleEscanearQR}
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
              onPress={() => navigation.getParent()?.navigate('Promociones')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.verTodo}>Ver todo</Text>
            </Pressable>
          </View>

          <Pressable
            style={({ pressed }) => [styles.promoCard, pressed && { opacity: 0.92 }]}
            onPress={() => navigation.getParent()?.navigate('Promociones')}
          >
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>Giro premium</Text>
            </View>
            <Text style={styles.promoTitle}>Tienda Don Luis</Text>
            <Text style={styles.promoDesc}>Paga con Deuna y participa por premios</Text>
          </Pressable>

          <View style={[styles.sectionHeader, styles.sectionSpaced]}>
            <Text style={styles.sectionTitle}>Recompensas recientes</Text>
            <Pressable onPress={() => navigation.navigate('MisRecompensas')}>
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
});
