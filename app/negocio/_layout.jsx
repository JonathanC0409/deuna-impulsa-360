import { Stack } from 'expo-router';
import { colors } from '../../src/theme/colors';

export default function NegocioLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Mi negocio' }} />
      <Stack.Screen name="items-negocio" options={{ title: 'Inventario' }} />
      <Stack.Screen name="crear-item" options={{ title: 'Crear ítem' }} />
      <Stack.Screen name="editar-item" options={{ title: 'Editar ítem' }} />
      <Stack.Screen name="registrar-venta" options={{ title: 'Registrar venta' }} />
      <Stack.Screen name="promociones" options={{ title: 'Mis promociones', headerShown: false }} />
    </Stack>
  );
}
