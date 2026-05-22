import { useEffect, useMemo, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import DeunaButton from '../../components/DeunaButton';
import DeunaCard from '../../components/DeunaCard';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, spacing, radii, typography, shadows } from '../../theme';
import { obtenerPromocionesActivasCliente } from '../../services/promocionService';


function formatearValorPromo(promocion) {
  const tipo = String(promocion.TipoPromocion ?? '').toLowerCase();
  const valor = Number(promocion.ValorDescuento ?? 0);

  if (tipo.includes('cashback')) {
    return valor > 0 ? `${valor}% cashback` : 'Cashback disponible';
  }

  if (tipo.includes('descuento')) {
    return valor > 0 ? `$${valor.toFixed(2)} de descuento` : 'Descuento disponible';
  }

  if (tipo.includes('giro')) {
    return 'Giro especial';
  }

  return valor > 0 ? `Beneficio de ${valor}` : 'Beneficio disponible';
}

function formatearFecha(fecha) {
  if (!fecha) return null;

  try {
    return new Date(fecha).toLocaleDateString('es-EC', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return null;
  }
}

function ClientePromocionCard({ promocion, destacada = false }) {
  const negocio = promocion.Negocios;
  const item = promocion.ItemsNegocio;
  const beneficio = formatearValorPromo(promocion);
  const fechaFin = formatearFecha(promocion.FechaFin);

  const handleUsar = () => {
    Alert.alert(
      'Promoción disponible',
      `${promocion.Titulo}\n\nComercio: ${
        negocio?.NombreNegocio ?? 'Negocio aliado'
      }\nBeneficio: ${beneficio}\n\nEste beneficio se aplicará al pagar con Deuna en el negocio participante.`
    );
  };

  return (
    <DeunaCard style={[styles.promoCard, destacada && styles.promoCardDestacada]}>
      <View style={styles.promoTop}>
        <View style={styles.promoIconBox}>
          <Ionicons
            name={destacada ? 'sparkles' : 'pricetag-outline'}
            size={24}
            color={colors.primary}
          />
        </View>

        <View style={styles.promoInfo}>
          <View style={styles.promoTitleRow}>
            <Text style={styles.promoTitle}>{promocion.Titulo}</Text>

            <View style={styles.badgeDisponible}>
              <Text style={styles.badgeText}>Disponible</Text>
            </View>
          </View>

          <Text style={styles.promoDesc}>
            {promocion.Descripcion ?? 'Promoción disponible pagando con Deuna.'}
          </Text>

          <Text style={styles.promoBenefit}>Beneficio: {beneficio}</Text>

          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <Ionicons name="storefront-outline" size={15} color={colors.textMuted} />
              <Text style={styles.metaText}>
                {negocio?.NombreNegocio ?? 'Negocio aliado'}
              </Text>
            </View>

            {item?.Nombre ? (
              <View style={styles.metaRow}>
                <Ionicons name="cube-outline" size={15} color={colors.textMuted} />
                <Text style={styles.metaText}>
                  Producto: {item.Nombre}
                  {item.Precio != null ? ` · $${Number(item.Precio).toFixed(2)}` : ''}
                </Text>
              </View>
            ) : null}

            {promocion.HoraInicio && promocion.HoraFin ? (
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={15} color={colors.textMuted} />
                <Text style={styles.metaText}>
                  Horario: {promocion.HoraInicio} - {promocion.HoraFin}
                </Text>
              </View>
            ) : null}

            {fechaFin ? (
              <View style={styles.metaRow}>
                <Ionicons name="calendar-outline" size={15} color={colors.textMuted} />
                <Text style={styles.metaText}>Válida hasta: {fechaFin}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.promoFooter}>
        <Text style={styles.promoHint}>
          Se aplica al pagar con Deuna en el comercio participante.
        </Text>

        <Pressable style={styles.useButton} onPress={handleUsar}>
          <Text style={styles.useButtonText}>Ver beneficio</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.white} />
        </Pressable>
      </View>
    </DeunaCard>
  );
}

export default function PromocionesScreen() {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const cargarPromociones = async (silencioso = false) => {
    try {
      if (!silencioso) setLoading(true);

      const data = await obtenerPromocionesActivasCliente();
      setPromociones(data);
    } catch (e) {
      console.error('[PromocionesScreen] cargar:', e);
      Alert.alert(
        'Error',
        e.message ?? 'No se pudieron cargar las promociones reales.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarPromociones();
  }, []);

  const destacada = promociones[0] ?? null;

  const promocionesSinDestacada = useMemo(() => {
    if (!destacada) return promociones;

    return promociones.filter(
      (p) => String(p.IdPromocion) !== String(destacada.IdPromocion)
    );
  }, [promociones, destacada]);

  const promosCashback = promocionesSinDestacada.filter((p) =>
    String(p.TipoPromocion ?? '').toLowerCase().includes('cashback')
  );

  const promosDescuento = promocionesSinDestacada.filter((p) =>
    String(p.TipoPromocion ?? '').toLowerCase().includes('descuento')
  );

  const otrasPromos = promocionesSinDestacada.filter((p) => {
    const tipo = String(p.TipoPromocion ?? '').toLowerCase();
    return !tipo.includes('cashback') && !tipo.includes('descuento');
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando promociones reales...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              cargarPromociones(true);
            }}
          />
        }
      >
        <ScreenContainer>
          <View style={styles.header}>
            <Pressable
              onPress={() => router.push('/beneficios')}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.backButtonPressed,
              ]}
            >
              <Ionicons name="arrow-back" size={22} color={colors.primary} />
            </Pressable>

            <Text style={styles.headerTitle}>Promociones</Text>

            <Pressable
              onPress={() => cargarPromociones()}
              style={({ pressed }) => [
                styles.refreshButton,
                pressed && styles.backButtonPressed,
              ]}
            >
              <Ionicons name="refresh" size={20} color={colors.primary} />
            </Pressable>
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>🎁</Text>
            <Text style={styles.heroTitle}>Promociones reales</Text>
            <Text style={styles.heroSub}>
              Beneficios creados por los negocios aliados y disponibles para pagar con Deuna.
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{promociones.length}</Text>
              <Text style={styles.statLabel}>Disponibles</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.cashback }]}>
                {promosCashback.length}
              </Text>
              <Text style={styles.statLabel}>Cashback</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {promosDescuento.length}
              </Text>
              <Text style={styles.statLabel}>Descuentos</Text>
            </View>
          </View>

          {promociones.length === 0 ? (
            <DeunaCard style={styles.emptyCard}>
              <Ionicons name="pricetag-outline" size={42} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No hay promociones activas</Text>
              <Text style={styles.emptyText}>
                Cuando un negocio cree promociones activas, aparecerán aquí para los clientes.
              </Text>
            </DeunaCard>
          ) : null}

          {destacada ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Promoción destacada</Text>
              <Text style={styles.sectionHint}>
                La promoción más reciente disponible para clientes.
              </Text>

              <ClientePromocionCard promocion={destacada} destacada />
            </View>
          ) : null}

          {promosCashback.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cashback disponible</Text>
              <Text style={styles.sectionHint}>
                Promociones que devuelven beneficio al pagar.
              </Text>

              {promosCashback.map((p) => (
                <ClientePromocionCard key={p.IdPromocion} promocion={p} />
              ))}
            </View>
          ) : null}

          {promosDescuento.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descuentos</Text>
              <Text style={styles.sectionHint}>
                Beneficios directos en productos o negocios aliados.
              </Text>

              {promosDescuento.map((p) => (
                <ClientePromocionCard key={p.IdPromocion} promocion={p} />
              ))}
            </View>
          ) : null}

          {otrasPromos.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Más beneficios</Text>

              {otrasPromos.map((p) => (
                <ClientePromocionCard key={p.IdPromocion} promocion={p} />
              ))}
            </View>
          ) : null}

          <DeunaButton
            title="Ir a mis recompensas"
            variant="cashback"
            onPress={() => router.push('/cliente/mis-recompensas')}
            style={styles.footerBtn}
          />

          <DeunaButton
            title="Volver a beneficios"
            variant="outline"
            onPress={() => router.push('/beneficios')}
            style={styles.footerBtn}
          />
        </ScreenContainer>
      </ScrollView>
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
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontWeight: '600',
  },
  scroll: {
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    opacity: 0.75,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  hero: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: 'center',
    ...shadows.card,
  },
  heroEmoji: {
    fontSize: 34,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
  },
  heroSub: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.amountSm,
    fontSize: 22,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.h2,
  },
  sectionHint: {
    ...typography.caption,
    marginBottom: spacing.md,
    marginTop: 4,
  },
  promoCard: {
    marginBottom: spacing.md,
  },
  promoCardDestacada: {
    borderWidth: 1,
    borderColor: colors.cashback,
  },
  promoTop: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  promoIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoInfo: {
    flex: 1,
  },
  promoTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  promoTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  promoDesc: {
    ...typography.caption,
    marginTop: 6,
    lineHeight: 18,
  },
  promoBenefit: {
    marginTop: 8,
    color: colors.cashback,
    fontWeight: '800',
    fontSize: 14,
  },
  metaBox: {
    marginTop: spacing.sm,
    gap: 5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  badgeDisponible: {
    backgroundColor: '#E6FBF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: colors.cashback,
    fontSize: 11,
    fontWeight: '800',
  },
  promoFooter: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  promoHint: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  useButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  useButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  emptyCard: {
    marginTop: spacing.xl,
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  emptyText: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.textMuted,
    lineHeight: 20,
  },
  footerBtn: {
    marginTop: spacing.md,
  },
});