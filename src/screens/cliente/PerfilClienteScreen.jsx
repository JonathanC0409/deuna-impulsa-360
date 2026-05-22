import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../../components/cliente/clienteTheme';
import { MOCK_CLIENTE } from '../../components/cliente/mockClienteData';

const OPCIONES = [
  { id: 'notif', label: 'Notificaciones', icono: 'notifications-outline' },
  { id: 'seguridad', label: 'Seguridad', icono: 'shield-checkmark-outline' },
  { id: 'ayuda', label: 'Ayuda y soporte', icono: 'help-circle-outline' },
  { id: 'legal', label: 'Términos y privacidad', icono: 'document-text-outline' },
];

function OpcionRow({ label, icono, onPress, danger, inCard }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        inCard ? styles.opcionInCard : styles.opcion,
        pressed && styles.opcionPressed,
      ]}
    >
      <Ionicons
        name={icono}
        size={22}
        color={danger ? colors.danger : colors.primary}
      />
      <Text style={[styles.opcionLabel, danger && styles.opcionDanger]}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

export default function PerfilClienteScreen({ navigation }) {
  const inicial = MOCK_CLIENTE.nombre.charAt(0);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicial}</Text>
        </View>
        <Text style={styles.nombre}>{MOCK_CLIENTE.nombre}</Text>
        <Text style={styles.email}>{MOCK_CLIENTE.email}</Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{MOCK_CLIENTE.nivel}</Text>
            <Text style={styles.statLabel}>Nivel</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>${MOCK_CLIENTE.cashbackAcumulado.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Cashback</Text>
          </View>
        </View>

        <Text style={styles.section}>Configuración</Text>
        <View style={styles.opcionesCard}>
          {OPCIONES.map((op, index) => (
            <View key={op.id}>
              <OpcionRow
                label={op.label}
                icono={op.icono}
                onPress={() => {}}
                inCard
              />
              {index < OPCIONES.length - 1 ? <View style={styles.separator} /> : null}
            </View>
          ))}
          <View style={styles.separator} />
          <OpcionRow
            label="Mis recompensas"
            icono="gift-outline"
            onPress={() => navigation.navigate('MisRecompensas')}
            inCard
          />
        </View>

        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && styles.logoutPressed]}
          onPress={() => navigation.getParent()?.getParent()?.navigate('Negocio')}
        >
          <Ionicons name="log-out-outline" size={22} color={colors.danger} />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    alignItems: 'center',
    paddingBottom: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 36,
    color: colors.white,
    fontWeight: '800',
  },
  nombre: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  email: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: 16,
    width: '100%',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  section: {
    alignSelf: 'flex-start',
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  opcionesCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  opcionInCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    width: '100%',
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  opcionPressed: {
    opacity: 0.8,
  },
  opcionLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  opcionDanger: {
    color: colors.danger,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 50,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingVertical: 16,
    marginTop: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: '#FFD6DE',
    backgroundColor: '#FFF8FA',
  },
  logoutPressed: {
    opacity: 0.85,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.danger,
  },
});
