import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { colors } from '../src/theme/colors';

function RootNavigationGuard({ children }) {
  const { usuario, cargando } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (cargando) return;

    const enAuth =
      segments[0] === 'login-cliente' ||
      segments[0] === 'login-negocio' ||
      segments[0] === 'registro-cliente' ||
      segments[0] === 'registro-negocio' ||
      segments[0] === 'giro-bienvenida' ||
      segments[0] === undefined ||
      segments[0] === 'index';

    if (!usuario && !enAuth) {
      router.replace('/');
      return;
    }

    if (usuario && (segments[0] === 'index' || segments[0] === 'login-cliente' || segments[0] === 'login-negocio')) {
      if (usuario.Rol === 'Cliente') {
        router.replace('/cliente');
      } else {
        router.replace('/negocio');
      }
    }
  }, [usuario, cargando, segments, router]);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return children;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigationGuard>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login-cliente" />
            <Stack.Screen name="login-negocio" />
            <Stack.Screen name="registro-cliente" />
            <Stack.Screen name="registro-negocio" />
            <Stack.Screen name="giro-bienvenida" />
            <Stack.Screen name="cliente" />
            <Stack.Screen name="negocio" />
            <Stack.Screen
              name="promociones"
              options={{
                headerShown: true,
                title: 'Promociones',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen name="ruleta" />
            <Stack.Screen
              name="CrearPromocion"
              options={{
                headerShown: true,
                title: 'Crear promoción',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
            <Stack.Screen
              name="EditarPromocion"
              options={{
                headerShown: true,
                title: 'Editar promoción',
                headerStyle: { backgroundColor: colors.primary },
                headerTintColor: colors.white,
              }}
            />
          </Stack>
        </RootNavigationGuard>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
