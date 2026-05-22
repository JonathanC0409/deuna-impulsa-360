import { useRouter } from 'expo-router';
import LoginScreen from '../src/screens/auth/LoginScreen';
import { createExpoNavigationShim } from '../src/navigation/expoNavigationShim';

const ROUTES = {
  RegistroCliente: '/registro-cliente',
  ClienteHome: '/cliente',
  GiroBienvenida: '/giro-bienvenida',
};

export default function LoginClientePage() {
  const router = useRouter();
  const navigation = {
    ...createExpoNavigationShim(router, ROUTES),
    replace: (name, params) => {
      const path = ROUTES[name];
      if (path) router.replace({ pathname: path, params });
      else router.replace(name);
    },
    goBack: () => router.back(),
  };

  return <LoginScreen navigation={navigation} rol="Cliente" />;
}
