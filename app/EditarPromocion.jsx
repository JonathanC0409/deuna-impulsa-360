import { useRouter, useLocalSearchParams } from 'expo-router';
import EditarPromocionScreen from '../src/screens/negocio/EditarPromocionScreen';

export default function EditarPromocionPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const navigation = {
    goBack: () => router.back(),
    navigate: (name, navParams) => {
      if (name === 'CrearPromocion') {
        router.push({ pathname: '/CrearPromocion', params: navParams });
      }
    },
  };

  return (
    <EditarPromocionScreen
      navigation={navigation}
      route={{ params: { idPromocion: params.idPromocion } }}
    />
  );
}
