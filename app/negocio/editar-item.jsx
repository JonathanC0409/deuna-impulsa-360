import { useRouter } from 'expo-router';
import EditarItemScreen from '../../src/screens/negocio/EditarItemScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

const ROUTES = {
  ItemsNegocio: '/negocio/items-negocio',
};

export default function EditarItemPage() {
  const router = useRouter();
  const navigation = createExpoNavigationShim(router, ROUTES);
  const wrapped = {
    ...navigation,
    replace: (name, params) => {
      const path = ROUTES[name];
      if (path) router.replace({ pathname: path, params });
      else router.replace(name);
    },
    goBack: () => router.back(),
  };

  return <EditarItemScreen navigation={wrapped} />;
}
