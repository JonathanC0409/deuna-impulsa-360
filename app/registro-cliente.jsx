import { useRouter } from 'expo-router';
import RegistroClienteScreen from '../src/screens/auth/RegistroClienteScreen';
import { createExpoNavigationShim } from '../src/navigation/expoNavigationShim';

const ROUTES = {
  LoginCliente: '/login-cliente',
  GiroBienvenida: '/giro-bienvenida',
};

export default function RegistroClientePage() {
  const router = useRouter();
  const navigation = {
    ...createExpoNavigationShim(router, ROUTES),
    replace: (name) => {
      const path = ROUTES[name];
      if (path) router.replace(path);
    },
    navigate: (name) => {
      const path = ROUTES[name];
      if (path) router.push(path);
    },
    goBack: () => router.back(),
  };

  return <RegistroClienteScreen navigation={navigation} />;
}
