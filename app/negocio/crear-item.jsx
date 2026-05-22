import { useRouter } from 'expo-router';
import CrearItemScreen from '../../src/screens/negocio/CrearItemScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

const ROUTES = {
  ItemsNegocio: '/negocio/items-negocio',
};

export default function CrearItemPage() {
  const router = useRouter();
  const baseNav = createExpoNavigationShim(router, ROUTES);
  const navigation = {
    ...baseNav,
    replace: (name, params) => {
      const path = ROUTES[name];
      if (path) router.replace({ pathname: path, params: { refresh: String(Date.now()), ...params } });
      else router.replace(name);
    },
    goBack: () => router.back(),
  };

  return <CrearItemScreen navigation={navigation} />;
}
