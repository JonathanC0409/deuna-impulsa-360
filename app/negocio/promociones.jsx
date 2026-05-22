import { useRouter } from 'expo-router';
import PromocionesNegocioScreen from '../../src/screens/negocio/PromocionesNegocioScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

const ROUTES = {
  CrearPromocion: '/CrearPromocion',
  EditarPromocion: '/EditarPromocion',
};

export default function PromocionesNegocioPage() {
  const router = useRouter();
  const navigation = createExpoNavigationShim(router, ROUTES);
  return <PromocionesNegocioScreen navigation={navigation} />;
}
