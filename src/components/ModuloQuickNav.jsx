import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

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
  wrap: { marginTop: 8, marginBottom: 4 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: { gap: 10, paddingRight: 8 },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipIcon: { fontSize: 18, marginBottom: 4 },
  chipText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  chipTextActive: { color: colors.primary },
});
