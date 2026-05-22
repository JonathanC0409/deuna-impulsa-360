import { Stack } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function ClienteLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="pago-exitoso" options={{ title: 'Pago exitoso' }} />
      <Stack.Screen name="mis-recompensas" options={{ title: 'Mis recompensas' }} />
    </Stack>
  );
}
