import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii } from './clienteTheme';

export default function BannerPromo({
  titulo = 'Paga con Deuna y gana giros',
  subtitulo = 'Cada compra te acerca a premios exclusivos',
  onPress,
  style,
}) {
  const content = (
    <View style={[styles.banner, style]}>
      <View style={styles.textCol}>
        <Text style={styles.badge}>Promo</Text>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.subtitulo}>{subtitulo}</Text>
      </View>
      <View style={styles.iconCircle}>
        <Ionicons name="gift" size={28} color={colors.primary} />
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
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
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  textCol: {
    flex: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    overflow: 'hidden',
    marginBottom: 6,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 22,
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
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
