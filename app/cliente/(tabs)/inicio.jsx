import { useRouter } from 'expo-router';
import InicioClienteScreen from '../../../src/screens/cliente/InicioClienteScreen';
import { createExpoNavigationShim } from '../../../src/navigation/expoNavigationShim';

const ROUTES = {
  PagoExitoso: '/cliente/pago-exitoso',
  MisRecompensas: '/cliente/mis-recompensas',
  Billetera: '/cliente/billetera',
  Beneficios: '/cliente/beneficios',
  Ruleta: '/ruleta',
  Promociones: '/promociones',
  Negocio: '/negocio',
};

export default function InicioPage() {
  const router = useRouter();
  const navigation = createExpoNavigationShim(router, ROUTES);
  return <InicioClienteScreen navigation={navigation} />;
}
