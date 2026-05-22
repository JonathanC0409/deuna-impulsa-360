import { useRouter, useLocalSearchParams } from 'expo-router';
import ItemsNegocioScreen from '../../src/screens/negocio/ItemsNegocioScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

const ROUTES = {
  CrearItem: '/negocio/crear-item',
  EditarItem: '/negocio/editar-item',
  CrearPromocion: '/CrearPromocion',
  DashboardNegocio: '/negocio',
};

export default function ItemsNegocioPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = createExpoNavigationShim(router, ROUTES);

  return (
    <ItemsNegocioScreen
      navigation={navigation}
      refreshKey={params.refresh}
    />
  );
}
