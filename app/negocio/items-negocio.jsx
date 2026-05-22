import { useRouter } from 'expo-router';
import ItemsNegocioScreen from '../../src/screens/negocio/ItemsNegocioScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

const ROUTES = {
  CrearItem: '/negocio/crear-item',
};

export default function ItemsNegocioPage() {
  const router = useRouter();
  const navigation = createExpoNavigationShim(router, ROUTES);
  return <ItemsNegocioScreen navigation={navigation} />;
}
