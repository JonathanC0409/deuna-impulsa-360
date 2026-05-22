import { useRouter } from 'expo-router';
import InicioClienteScreen from '../../../src/screens/cliente/InicioClienteScreen';
import { createExpoNavigationShim } from '../../../src/navigation/expoNavigationShim';

const ROUTES = {
  PagoExitoso: '/cliente/pago-exitoso',
  Ruleta: '/ruleta',
  Promociones: '/promociones',
  Negocio: '/negocio',
  Beneficios: '/cliente/(tabs)/beneficios',
};

export default function InicioPage() {
  const router = useRouter();
  const navigation = createExpoNavigationShim(router, ROUTES);
  return <InicioClienteScreen navigation={navigation} />;
}
