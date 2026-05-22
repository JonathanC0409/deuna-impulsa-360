import { useRouter } from 'expo-router';
import CrearItemScreen from '../../src/screens/negocio/CrearItemScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

export default function CrearItemPage() {
  const router = useRouter();
  const navigation = createExpoNavigationShim(router);
  return <CrearItemScreen navigation={navigation} />;
}
