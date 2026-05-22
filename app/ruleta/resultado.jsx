import { useRouter, useLocalSearchParams } from 'expo-router';
import ResultadoRecompensaScreen from '../../src/screens/ruleta/ResultadoRecompensaScreen';

function parseJsonSafe(value) {
  if (!value || typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

export default function ResultadoPage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const navigation = {
    goBack: () => router.back(),
    replace: () => {},
    navigate: () => {},
  };

  const routeParams = {
    premio: parseJsonSafe(params.premio),
    recompensa: parseJsonSafe(params.recompensa),
    nombreNegocio: params.nombreNegocio,
    nivelGiro: params.nivelGiro ? Number(params.nivelGiro) : undefined,
  };

  return <ResultadoRecompensaScreen navigation={navigation} route={{ params: routeParams }} />;
}
