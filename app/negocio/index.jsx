import { useRouter } from 'expo-router';
import DashboardNegocioScreen from '../../src/screens/negocio/DashboardNegocioScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

const ROUTES = {
  ItemsNegocio: '/negocio/items-negocio',
  RegistrarVenta: '/negocio/registrar-venta',
  CrearPromocion: '/CrearPromocion',
  PromocionesNegocio: '/negocio/promociones',
  EditarPromocion: '/EditarPromocion',
  Cliente: '/cliente',
};

export default function NegocioDashboardPage() {
  const router = useRouter();
  const navigation = createExpoNavigationShim(router, ROUTES);
  return <DashboardNegocioScreen navigation={navigation} />;
}
