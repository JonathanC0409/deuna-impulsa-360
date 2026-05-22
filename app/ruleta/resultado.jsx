import { useRouter, useLocalSearchParams } from 'expo-router';
import ResultadoRecompensaScreen from '../../src/screens/ruleta/ResultadoRecompensaScreen';
import { createExpoNavigationShim } from '../../src/navigation/expoNavigationShim';

export default function ResultadoPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const navigation = createExpoNavigationShim(router, {
    Cliente: '/cliente',
    MisRecompensas: '/cliente/mis-recompensas',
  });
  return (
    <ResultadoRecompensaScreen
      navigation={navigation}
      route={{ params: { premio: params.premio ? JSON.parse(params.premio) : undefined } }}
    />
  );
}
