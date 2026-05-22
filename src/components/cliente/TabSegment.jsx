import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, typography, MIN_TOUCH_TARGET } from './clienteTheme';

export default function TabSegment({ tabs, activeKey, onChange }) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const active = tab.key === activeKey;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
            {active ? <View style={styles.indicator} /> : <View style={styles.indicatorPlaceholder} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    paddingVertical: spacing.md,
  },
  label: {
    ...typography.bodyBold,
    fontSize: 15,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.primary,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: spacing.lg,
    right: spacing.lg,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  indicatorPlaceholder: {
    height: 3,
  },
});
