import { useRouter, useLocalSearchParams } from 'expo-router';
import PagoExitosoScreen from '../../src/screens/cliente/PagoExitosoScreen';
import { useAuth } from '../../src/context/AuthContext';

export default function PagoExitosoPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { usuario } = useAuth();

  const routeParams = {
    ...params,
    ventaId: params.ventaId ? Number(params.ventaId) : undefined,
    negocioId: params.negocioId ? Number(params.negocioId) : undefined,
    monto: params.monto ? Number(params.monto) : undefined,
    cashback: params.cashback ? Number(params.cashback) : undefined,
    esHorarioPromocional: params.esHorarioPromocional,
  };

  const navigation = {
    navigate: (name, navParams) => {
      if (name === 'ClienteTabs') {
        router.replace('/cliente');
        return;
      }
      router.push({ pathname: `/cliente/${name}`, params: navParams });
    },
    getParent: () => ({
      getParent: () => ({
        navigate: (name, p) => {
          if (name === 'Ruleta') {
            router.push({
              pathname: '/ruleta',
              params: {
                ventaId: String(p?.ventaId ?? routeParams.ventaId),
                usuarioId: String(p?.usuarioId ?? usuario?.IdUsuario ?? ''),
                negocioId: String(p?.negocioId ?? routeParams.negocioId),
                montoVenta: String(p?.montoVenta ?? routeParams.monto),
                nombreNegocio: p?.nombreNegocio ?? params.comercio,
                esHorarioPromocional: String(p?.esHorarioPromocional ?? false),
              },
            });
          }
        },
      }),
    }),
  };

  return <PagoExitosoScreen navigation={navigation} route={{ params: routeParams }} />;
}
