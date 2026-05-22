import { useRouter } from 'expo-router';
import PerfilClienteScreen from '../../../src/screens/cliente/PerfilClienteScreen';
import { createExpoNavigationShim } from '../../../src/navigation/expoNavigationShim';

const ROUTES = {
  MisRecompensas: '/cliente/mis-recompensas',
  Negocio: '/negocio',
};

export default function TuPage() {
  const router = useRouter();
  const navigation = createExpoNavigationShim(router, ROUTES);
  return <PerfilClienteScreen navigation={navigation} />;
}
