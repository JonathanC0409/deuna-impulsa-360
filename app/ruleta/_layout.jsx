import { Stack } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function RuletaLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Ruleta' }} />
      <Stack.Screen name="resultado" options={{ title: 'Tu premio' }} />
    </Stack>
  );
}
