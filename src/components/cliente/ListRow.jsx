import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, MIN_TOUCH_TARGET } from './clienteTheme';

export default function ListRow({
  icon,
  iconColor = colors.primary,
  title,
  subtitle,
  onPress,
  rightElement,
  locked = false,
  showChevron = true,
}) {
  const content = (
    <>
      <View style={[styles.iconWrap, locked && styles.iconLocked]}>
        <Ionicons
          name={locked ? 'lock-closed-outline' : icon}
          size={22}
          color={locked ? colors.textMuted : iconColor}
        />
      </View>
      <View style={styles.body}>
        <Text style={[styles.title, locked && styles.titleMuted]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightElement ??
        (showChevron ? (
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        ) : null)}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return <View style={styles.row}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET + 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  pressed: {
    backgroundColor: colors.overlay,
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLocked: {
    opacity: 0.7,
  },
  body: {
    flex: 1,
  },
  title: {
    ...typography.bodyBold,
    fontSize: 15,
  },
  titleMuted: {
    color: colors.textMuted,
  },
  subtitle: {
    ...typography.caption,
    marginTop: 4,
    lineHeight: 18,
  },
});
