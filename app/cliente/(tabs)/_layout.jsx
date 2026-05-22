import { Tabs } from 'expo-router';
import { colors } from '../../../src/theme/colors';

export default function ClienteTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen name="inicio" options={{ title: 'Inicio', tabBarLabel: 'Inicio' }} />
      <Tabs.Screen name="beneficios" options={{ title: 'Beneficios' }} />
      <Tabs.Screen name="billetera" options={{ title: 'Billetera' }} />
      <Tabs.Screen name="tu" options={{ title: 'Tú', tabBarLabel: 'Tú' }} />
    </Tabs>
  );
}
