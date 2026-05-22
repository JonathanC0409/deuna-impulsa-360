import { useRouter, useLocalSearchParams } from 'expo-router';
import RuletaScreen from '../../src/screens/ruleta/RuletaScreen';
import { useAuth } from '../../src/context/AuthContext';

export default function RuletaPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { usuario } = useAuth();

  const routeParams = {
    ventaId: params.ventaId ? Number(params.ventaId) : undefined,
    usuarioId: params.usuarioId ? Number(params.usuarioId) : usuario?.IdUsuario,
    negocioId: params.negocioId ? Number(params.negocioId) : undefined,
    montoVenta: params.montoVenta ? Number(params.montoVenta) : undefined,
    nombreNegocio: params.nombreNegocio ?? 'Negocio aliado',
    esHorarioPromocional: params.esHorarioPromocional === 'true',
  };

  const navigation = {
    goBack: () => router.back(),
    replace: (name, navParams) => {
      if (name === 'ResultadoRecompensa') {
        router.replace({
          pathname: '/ruleta/resultado',
          params: {
            premio: JSON.stringify(navParams.premio),
            recompensa: navParams.recompensa
              ? JSON.stringify(navParams.recompensa)
              : undefined,
            nombreNegocio: navParams.nombreNegocio ?? '',
            nivelGiro: String(navParams.nivelGiro ?? 1),
          },
        });
        return;
      }
      router.replace('/ruleta/resultado');
    },
    navigate: (name) => {
      if (name === 'MisRecompensas') router.push('/cliente/mis-recompensas');
    },
  };

  return <RuletaScreen navigation={navigation} route={{ params: routeParams }} />;
}
