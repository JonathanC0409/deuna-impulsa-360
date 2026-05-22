import { useRouter } from 'expo-router';
import RegistroNegocioScreen from '../src/screens/auth/RegistroNegocioScreen';
import { createExpoNavigationShim } from '../src/navigation/expoNavigationShim';

const ROUTES = {
  LoginNegocio: '/login-negocio',
  NegocioHome: '/negocio',
};

export default function RegistroNegocioPage() {
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

  return <RegistroNegocioScreen navigation={navigation} />;
}
