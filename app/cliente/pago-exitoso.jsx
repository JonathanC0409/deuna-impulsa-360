import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { irARuleta } from '../../src/navigation/ruletaNavigation';
import PagoExitosoScreen from '../../src/screens/cliente/PagoExitosoScreen';

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
      const known = {
        'mis-recompensas': '/cliente/mis-recompensas',
        'pago-exitoso': '/cliente/pago-exitoso',
        beneficios: '/cliente/beneficios',
        billetera: '/cliente/billetera',
      };
      const path = known[name];
      if (path) {
        router.push({ pathname: path, params: navParams });
      }
    },
    getParent: () => ({
      getParent: () => ({
        navigate: (name, p) => {
          if (name === 'Ruleta') {
            irARuleta(router, {
              ventaId: p?.ventaId ?? routeParams.ventaId,
              usuarioId: p?.usuarioId ?? usuario?.IdUsuario,
              negocioId: p?.negocioId ?? routeParams.negocioId,
              montoVenta: p?.montoVenta ?? routeParams.monto,
              nombreNegocio: p?.nombreNegocio ?? params.comercio,
              esHorarioPromocional: p?.esHorarioPromocional ?? routeParams.esHorarioPromocional,
            });
          }
        },
      }),
    }),
  };

  return <PagoExitosoScreen navigation={navigation} route={{ params: routeParams }} />;
}
