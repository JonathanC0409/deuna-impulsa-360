import { useRouter } from 'expo-router';
import PromocionesScreen from '../src/screens/promociones/PromocionesScreen';
import { createExpoNavigationShim } from '../src/navigation/expoNavigationShim';

export default function PromocionesPage() {
  const router = useRouter();
  const navigation = createExpoNavigationShim(router, { Cliente: '/cliente' });
  return <PromocionesScreen navigation={navigation} />;
}
