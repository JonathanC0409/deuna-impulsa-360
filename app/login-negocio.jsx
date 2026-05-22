import { useRouter } from 'expo-router';
import LoginScreen from '../src/screens/auth/LoginScreen';
import { createExpoNavigationShim } from '../src/navigation/expoNavigationShim';

const ROUTES = {
  RegistroNegocio: '/registro-negocio',
  NegocioHome: '/negocio',
};

export default function LoginNegocioPage() {
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

  return <LoginScreen navigation={navigation} rol="Negocio" />;
}
