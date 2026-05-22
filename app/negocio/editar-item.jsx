import { useRouter, useLocalSearchParams } from 'expo-router';
import EditarItemScreen from '../../src/screens/negocio/EditarItemScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

const ROUTES = {
  ItemsNegocio: '/negocio/items-negocio',
};

export default function EditarItemPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const idItemNegocio = params.idItemNegocio ? Number(params.idItemNegocio) : undefined;

  const navigation = {
    ...createExpoNavigationShim(router, ROUTES),
    replace: (name, navParams) => {
      const path = ROUTES[name];
      if (path) {
        router.replace({
          pathname: path,
          params: { refresh: String(Date.now()), ...navParams },
        });
      } else {
        router.replace(name);
      }
    },
    goBack: () => router.back(),
  };

  return (
    <EditarItemScreen
      navigation={navigation}
      route={{ params: { idItemNegocio } }}
    />
  );
}
