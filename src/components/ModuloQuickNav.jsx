import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { colors, spacing, radii, typography, shadows, MIN_TOUCH_TARGET } from '../theme';

const MODULOS = [
  { key: 'Cliente', label: 'Cliente', icono: '👤', screen: null },
  { key: 'Negocio', label: 'Negocio', icono: '🏪', screen: null },
  { key: 'Ruleta', label: 'Ruleta', icono: '🎡', screen: null },
  { key: 'Promociones', label: 'Promos', icono: '✨', screen: null },
  {
    key: 'Recompensas',
    label: 'Recompensas',
    icono: '🎁',
    screen: { name: 'Cliente', params: { screen: 'MisRecompensas' } },
  },
  { key: 'FlujoImpulsa', label: 'Flujo 360', icono: '🔗', screen: null },
];

export default function ModuloQuickNav({ navigation, active }) {
  const ir = (mod) => {
    if (mod.screen) {
      navigation.navigate(mod.screen.name, mod.screen.params);
      return;
    }
    navigation.navigate(mod.key);
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Explorar módulos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {MODULOS.map((mod) => {
          const isActive = active === mod.key;
          return (
            <Pressable
              key={mod.key}
              onPress={() => ir(mod)}
              style={[styles.chip, isActive && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={styles.chipIcon}>{mod.icono}</Text>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{mod.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: spacing.md },
  label: {
    ...typography.label,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  row: { gap: spacing.sm, paddingRight: spacing.sm },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
    minHeight: MIN_TOUCH_TARGET + 16,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipIcon: { fontSize: 18, marginBottom: 4 },
  chipText: {
    ...typography.caption,
    fontWeight: '600',
  },
  chipTextActive: { color: colors.primary },
});
