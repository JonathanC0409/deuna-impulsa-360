import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DeunaButton from '../../components/DeunaButton';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, spacing, radii, typography, shadows, MIN_TOUCH_TARGET } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { totalCashbackDisponible } from '../../services/recompensaService';

/** Altura tab bar sin @react-navigation (SDK 56 + expo-router). */
function tabBarOffset(insets) {
  if (Platform.OS === 'ios') return 49 + insets.bottom;
  if (Platform.OS === 'android') return 56;
  return 64;
}

const MENU_ITEMS = [
  {
    id: 'recompensas',
    label: 'Mis recompensas',
    subtitle: 'Cashback, descuentos y premios',
    icon: 'gift-outline',
    route: '/cliente/mis-recompensas',
  },
  {
    id: 'beneficios',
    label: 'Beneficios',
    subtitle: 'Club Deuna y promociones',
    icon: 'star-outline',
    route: '/cliente/(tabs)/beneficios',
  },
  {
    id: 'ruleta',
    label: 'Gira y gana',
    subtitle: 'Ruleta después de cada pago',
    icon: 'aperture-outline',
    action: 'ruleta',
  },
  {
    id: 'ayuda',
    label: 'Ayuda',
    subtitle: 'Soporte 24 horas',
    icon: 'headset-outline',
  },
];

export default function PerfilClienteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const tabBarHeight = tabBarOffset(insets);
  const { usuario, signOut, giroBienvenida } = useAuth();
  const [cashback, setCashback] = useState(0);

  const inicial = usuario?.Nombre?.charAt(0)?.toUpperCase() ?? '?';
  const primerNombre = usuario?.Nombre?.split(' ')[0] ?? 'Usuario';
  const logoutBarHeight = 72 + insets.bottom;
  const scrollBottomPad = tabBarHeight + logoutBarHeight + spacing.lg;

  useEffect(() => {
    if (usuario?.IdUsuario) {
      totalCashbackDisponible(usuario.IdUsuario).then(setCashback).catch(() => {});
    }
  }, [usuario?.IdUsuario]);

  const handleMenu = (item) => {
    if (item.route) {
      router.push(item.route);
      return;
    }
    if (item.action === 'ruleta') {
      if (giroBienvenida) {
        router.push('/giro-bienvenida');
        return;
      }
      Alert.alert(
        'Ruleta',
        'Realiza un pago con Deuna (botón Escanear QR en inicio) para obtener un giro.'
      );
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Salir de tu cuenta Deuna Impulsa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPad }]}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
          <View style={styles.headerOrb1} />
          <View style={styles.headerOrb2} />

          <ScreenContainer style={styles.headerInner} edges={false}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{inicial}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>d!</Text>
                </View>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.nombre}>{usuario?.Nombre ?? primerNombre}</Text>
                <Text style={styles.correo} numberOfLines={1}>
                  {usuario?.Correo ?? 'Sin correo'}
                </Text>
                <View style={styles.nivelPill}>
                  <Ionicons name="shield" size={12} color="#CD7F32" />
                  <Text style={styles.nivelPillText}>Nivel Bronce</Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: '#E6FBF5' }]}>
                  <Ionicons name="cash" size={20} color={colors.cashback} />
                </View>
                <Text style={styles.statLabel}>Cashback</Text>
                <Text style={styles.statValueCash}>${cashback.toFixed(2)}</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="trophy" size={20} color={colors.primary} />
                </View>
                <Text style={styles.statLabel}>Puntos</Text>
                <Text style={styles.statValue}>0</Text>
              </View>
            </View>
          </ScreenContainer>
        </View>

        <View style={styles.sheet}>
          <ScreenContainer edges={false}>
            <Text style={styles.sectionTitle}>Tu cuenta</Text>

            <View style={styles.menuCard}>
              {MENU_ITEMS.map((item, index) => (
                <View key={item.id}>
                  <Pressable
                    style={({ pressed }) => [styles.menuRow, pressed && styles.menuPressed]}
                    onPress={() => handleMenu(item)}
                  >
                    <View style={styles.menuIcon}>
                      <Ionicons name={item.icon} size={22} color={colors.primary} />
                    </View>
                    <View style={styles.menuBody}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      <Text style={styles.menuSub}>{item.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                  </Pressable>
                  {index < MENU_ITEMS.length - 1 ? <View style={styles.separator} /> : null}
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, styles.sectionSesion]}>Sesión</Text>
            <View style={styles.sesionCard}>
              <View style={styles.sesionInfo}>
                <Ionicons name="person-circle-outline" size={28} color={colors.primary} />
                <View style={styles.sesionTextCol}>
                  <Text style={styles.sesionLabel}>Cuenta activa</Text>
                  <Text style={styles.sesionCorreo} numberOfLines={1}>
                    {usuario?.Correo}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.footer}>Deuna Impulsa 360 · MVP</Text>
          </ScreenContainer>
        </View>
      </ScrollView>

      <View
        style={[
          styles.logoutBar,
          {
            bottom: tabBarHeight,
            paddingBottom: spacing.sm,
            paddingTop: spacing.md,
          },
        ]}
      >
        <ScreenContainer edges={false} backgroundColor="transparent">
          <DeunaButton
            title="Cerrar sesión"
            variant="dangerFilled"
            onPress={handleLogout}
            leadingIcon={<Ionicons name="log-out-outline" size={22} color={colors.white} />}
            style={styles.logoutButton}
          />
        </ScreenContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingBottom: spacing.xxxl + 20,
    overflow: 'hidden',
    position: 'relative',
  },
  headerOrb1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -40,
    right: -50,
  },
  headerOrb2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: 20,
    left: -30,
  },
  headerInner: {
    zIndex: 1,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFE4D6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    ...shadows.cardElevated,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: '#CD7F32',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.white,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  nombre: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.3,
  },
  correo: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 4,
  },
  nivelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  nivelPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'flex-start',
    ...shadows.cardElevated,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  statValueCash: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.cashback,
    marginTop: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  sheet: {
    marginTop: -radii.sheet,
    backgroundColor: colors.backgroundAlt,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
    paddingTop: spacing.xl,
    flex: 1,
    minHeight: 280,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 18,
    marginBottom: spacing.md,
    color: colors.text,
  },
  sectionSesion: {
    marginTop: spacing.sm,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    minHeight: MIN_TOUCH_TARGET + 12,
  },
  menuPressed: {
    backgroundColor: colors.overlay,
  },
  menuIcon: {
    width: 46,
    height: 46,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBody: {
    flex: 1,
    minWidth: 0,
  },
  menuLabel: {
    ...typography.bodyBold,
    fontSize: 15,
    color: colors.text,
  },
  menuSub: {
    ...typography.caption,
    marginTop: 2,
    color: colors.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 78,
  },
  sesionCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  sesionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sesionTextCol: {
    flex: 1,
    minWidth: 0,
  },
  sesionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  sesionCorreo: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  footer: {
    textAlign: 'center',
    ...typography.caption,
    marginBottom: spacing.md,
    color: colors.textMuted,
  },
  logoutBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.cardElevated,
  },
  logoutButton: {
    width: '100%',
    borderRadius: radii.lg,
    minHeight: MIN_TOUCH_TARGET + 12,
  },
});
