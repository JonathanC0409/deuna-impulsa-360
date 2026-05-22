import { useRouter, useLocalSearchParams } from 'expo-router';
import CrearPromocionScreen from '../src/screens/negocio/CrearPromocionScreen';
import { createExpoNavigationShim } from '../src/navigation/expoNavigationShim';
import { parseRouteParam } from '../src/navigation/appRoutes';

export default function CrearPromocionPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = createExpoNavigationShim(router, {
    PromocionesNegocio: '/negocio/promociones',
    Negocio: '/negocio',
  });

  return (
    <CrearPromocionScreen
      navigation={navigation}
      route={{
        params: {
          idItemNegocio: parseRouteParam(params.idItemNegocio),
          nombreItem: parseRouteParam(params.nombreItem),
        },
      }}
    />
  );
}
