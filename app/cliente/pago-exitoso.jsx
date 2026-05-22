import { useRouter, useLocalSearchParams } from 'expo-router';
import PagoExitosoScreen from '../../src/screens/cliente/PagoExitosoScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

export default function PagoExitosoPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = createExpoNavigationShim(router, {
    ClienteTabs: '/cliente',
  });
  return <PagoExitosoScreen navigation={navigation} route={{ params }} />;
}
