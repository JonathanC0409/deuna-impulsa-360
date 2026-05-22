import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, hitSlop, MIN_TOUCH_TARGET } from './clienteTheme';

export default function ClienteHeader({
  nombre,
  onNotificaciones,
  onSoporte,
  showActions = true,
}) {
  const inicial = nombre?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicial}</Text>
        </View>
        <Text style={styles.greeting}>Hola, {nombre} 👋</Text>
      </View>
      {showActions ? (
        <View style={styles.actions}>
          <Pressable
            onPress={onNotificaciones}
            hitSlop={hitSlop}
            style={styles.iconBtn}
            accessibilityLabel="Notificaciones"
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.dot} />
          </Pressable>
          <Pressable
            onPress={onSoporte}
            hitSlop={hitSlop}
            style={styles.iconBtn}
            accessibilityLabel="Soporte"
          >
            <Ionicons name="headset-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFE4D6',
    borderWidth: 2,
    borderColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  greeting: {
    ...typography.h2,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
});
