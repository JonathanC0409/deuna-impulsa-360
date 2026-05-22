import { View, Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radii, typography, MIN_TOUCH_TARGET } from '../theme';

const VARIANTS = {
  primary: {
    bg: colors.primary,
    text: colors.white,
    border: colors.primary,
  },
  cashback: {
    bg: colors.cashback,
    text: colors.white,
    border: colors.cashback,
  },
  outline: {
    bg: colors.white,
    text: colors.primary,
    border: colors.primary,
  },
  danger: {
    bg: '#FFF0F3',
    text: colors.danger,
    border: colors.danger,
  },
  dangerFilled: {
    bg: colors.danger,
    text: colors.white,
    border: colors.danger,
  },
};

export default function DeunaButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  leadingIcon,
}) {
  const v = VARIANTS[variant] ?? VARIANTS.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          opacity: pressed || disabled ? 0.82 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} />
      ) : (
        <View style={styles.content}>
          {leadingIcon}
          <Text style={[styles.text, typography.button, { color: v.text }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TOUCH_TARGET + 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radii.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    textAlign: 'center',
  },
});
