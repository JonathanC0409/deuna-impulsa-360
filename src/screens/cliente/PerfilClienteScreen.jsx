import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import DeunaButton from '../../components/DeunaButton';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, spacing, radii, typography, shadows } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { totalCashbackDisponible } from '../../services/recompensaService';

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
    route: '/beneficios',
  },
  {
    id: 'promociones',
    label: 'Promociones',
    subtitle: 'Beneficios disponibles para pagar con Deuna',
    icon: 'pricetag-outline',
    route: '/promociones',
  },
  {
    id: 'ruleta',
    label: 'Gira y gana',
    subtitle: 'Ruleta después de cada pago',
    icon: 'aperture-outline',
    route: '/ruleta',
  },
  {
    id: 'ayuda',
    label: 'Ayuda',
    subtitle: 'Soporte 24 horas',
    icon: 'headset-outline',
    action: 'ayuda',
  },
];

export default function PerfilClienteScreen() {
  const { usuario, signOut } = useAuth();
  const [cashback, setCashback] = useState(0);

  const nombre = usuario?.Nombre ?? 'Usuario Deuna';
  const correo = usuario?.Correo ?? 'Sin correo';
  const inicial = nombre?.charAt(0)?.toUpperCase() ?? '?';

  useEffect(() => {
    let activo = true;

    async function cargarCashback() {
      try {
        if (!usuario?.IdUsuario) return;

        const total = await totalCashbackDisponible(usuario.IdUsuario);

        if (activo) {
          setCashback(Number(total ?? 0));
        }
      } catch (e) {
        console.log('[PerfilClienteScreen] cashback:', e);
      }
    }

    cargarCashback();

    return () => {
      activo = false;
    };
  }, [usuario?.IdUsuario]);

  const handleMenu = (item) => {
    if (item.route) {
      router.push(item.route);
      return;
    }

    if (item.action === 'ayuda') {
      Alert.alert(
        'Ayuda',
        'Comunícate con soporte Deuna o revisa las preguntas frecuentes.'
      );
    }
  };

  const handleLogout = async () => {
  try {
    console.log('[PerfilClienteScreen] Cerrando sesión...');

    if (typeof signOut === 'function') {
      await signOut();
    } else {
      console.log('[PerfilClienteScreen] signOut no existe en AuthContext');
    }

    router.replace('/');
  } catch (e) {
    console.error('[PerfilClienteScreen] error cerrar sesión:', e);
    Alert.alert('Error', 'No se pudo cerrar sesión.');
  }
};

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{inicial}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>d!</Text>
            </View>
          </View>

          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.correo}>{correo}</Text>

          <View style={styles.nivelPill}>
            <Ionicons name="shield-checkmark" size={14} color="#CD7F32" />
            <Text style={styles.nivelText}>Nivel Bronce</Text>
          </View>
        </View>

        <ScreenContainer edges={false}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="cash-outline" size={26} color={colors.cashback} />
              <Text style={styles.statLabel}>Cashback</Text>
              <Text style={styles.statValueCash}>
                ${cashback.toFixed(2)}
              </Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="trophy-outline" size={26} color={colors.primary} />
              <Text style={styles.statLabel}>Puntos</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Tu cuenta</Text>

          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <View key={item.id}>
                <Pressable
                  style={({ pressed }) => [
                    styles.menuRow,
                    pressed && styles.menuPressed,
                  ]}
                  onPress={() => handleMenu(item)}
                >
                  <View style={styles.menuIcon}>
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.menuBody}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <Text style={styles.menuSub}>{item.subtitle}</Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.textMuted}
                  />
                </Pressable>

                {index < MENU_ITEMS.length - 1 ? (
                  <View style={styles.separator} />
                ) : null}
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Sesión</Text>

          <View style={styles.sessionCard}>
            <View style={styles.sessionRow}>
              <Ionicons
                name="person-circle-outline"
                size={32}
                color={colors.primary}
              />

              <View style={styles.sessionInfo}>
                <Text style={styles.sessionLabel}>Cuenta activa</Text>
                <Text style={styles.sessionCorreo}>{correo}</Text>
              </View>
            </View>
          </View>

          <DeunaButton
  title="Cerrar sesión"
  variant="dangerFilled"
  onPress={handleLogout}
  style={styles.logoutButton}
/>

          <Text style={styles.footer}>Deuna Impulsa 360 · MVP</Text>
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
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#FFE4D6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.45)',
    marginBottom: spacing.md,
    ...shadows.cardElevated,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.primary,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: -2,
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#CD7F32',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  nombre: {
    fontSize: 23,
    fontWeight: '900',
    color: colors.white,
  },
  correo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  nivelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radii.full,
  },
  nivelText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: -spacing.xl,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  statLabel: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
  },
  statValueCash: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '900',
    color: colors.cashback,
  },
  statValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 18,
    marginBottom: spacing.md,
    color: colors.text,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    ...shadows.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    minHeight: 68,
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
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  menuSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  separator: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 78,
  },
  sessionCard: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  sessionCorreo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginTop: 3,
  },
  logoutButton: {
    marginTop: spacing.sm,
  },
  footer: {
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    color: colors.textMuted,
    fontSize: 12,
  },
});