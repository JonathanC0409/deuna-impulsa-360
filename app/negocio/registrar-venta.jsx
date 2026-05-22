import { useRouter } from 'expo-router';
import RegistrarVentaScreen from '../../src/screens/negocio/RegistrarVentaScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

const ROUTES = {
  DashboardNegocio: '/negocio',
  Cliente: '/cliente',
};

export default function RegistrarVentaPage() {
  const router = useRouter();
  const navigation = createExpoNavigationShim(router, {
    ...ROUTES,
    PagoExitoso: '/cliente/pago-exitoso',
  });
  return <RegistrarVentaScreen navigation={navigation} />;
}
