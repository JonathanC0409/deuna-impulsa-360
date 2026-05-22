import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography, shadows } from './clienteTheme';

export default function BannerPromo({
  titulo = 'Paga con Deuna y gana giros',
  subtitulo = 'Cada compra te acerca a premios exclusivos',
  onPress,
  style,
}) {
  const content = (
    <View style={[styles.banner, style]}>
      <View style={styles.textCol}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Pressable style={styles.linkRow}>
          <Text style={styles.link}>Conoce más</Text>
          <Ionicons name="open-outline" size={14} color={colors.primary} />
        </Pressable>
        <Text style={styles.subtitulo}>{subtitulo}</Text>
      </View>
      <View style={styles.iconCircle}>
        <Ionicons name="gift" size={28} color={colors.primary} />
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
    ...shadows.card,
  },
  textCol: {
    flex: 1,
  },
  titulo: {
    ...typography.h3,
    color: colors.primary,
    lineHeight: 22,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    marginBottom: 4,
  },
  link: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitulo: {
    ...typography.caption,
    lineHeight: 18,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
