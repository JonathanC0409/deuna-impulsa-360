import { useRouter } from 'expo-router';
import RuletaScreen from '../../src/screens/ruleta/RuletaScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

const ROUTES = {
  ResultadoRecompensa: '/ruleta/resultado',
  Cliente: '/cliente',
};

export default function RuletaPage() {
  const router = useRouter();
  const navigation = createExpoNavigationShim(router, ROUTES);
  const nav = {
    ...navigation,
    navigate: (name, params) => {
      if (name === 'ResultadoRecompensa' && params?.premio) {
        router.push({
          pathname: '/ruleta/resultado',
          params: { premio: JSON.stringify(params.premio) },
        });
        return;
      }
      navigation.navigate(name, params);
    },
  };
  return <RuletaScreen navigation={nav} />;
}
