import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="cliente" />
        <Stack.Screen name="negocio" />
        <Stack.Screen
          name="promociones"
          options={{
            headerShown: true,
            title: 'Promociones',
            headerStyle: { backgroundColor: '#4B168C' },
            headerTintColor: '#FFFFFF',
          }}
        />
        <Stack.Screen name="ruleta" />
      </Stack>
    </SafeAreaProvider>
  );
}
