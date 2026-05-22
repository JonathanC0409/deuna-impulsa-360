import { APP_ROUTES, navigateSafe, resolveAppPath } from './appRoutes';

/**
 * Adapta navigation.navigate() de React Navigation a rutas de Expo Router.
 */
export function createExpoNavigationShim(router, routeMap = {}) {
  const mergedMap = { ...APP_ROUTES, ...routeMap };

  const navigate = (name, params) => {
    if (params?.screen) {
      const nestedPath = resolveAppPath(params.screen) ?? mergedMap[params.screen];
      if (nestedPath) {
        router.push({ pathname: nestedPath, params: params.params });
        return;
      }
      console.warn(`[nav] Pantalla anidada desconocida: ${params.screen}`);
      return;
    }

    if (!navigateSafe(router, name, params)) {
      const path = mergedMap[name];
      if (path) {
        router.push({ pathname: path, params });
      } else {
        console.warn(`[nav] Ruta no encontrada: "${name}"`);
      }
    }
  };

  const parentNav = {
    navigate,
    getParent: () => ({
      navigate: (name, params) => {
        if (name === 'Cliente' && params?.screen === 'PagoExitoso') {
          router.push({
            pathname: APP_ROUTES.ClientePagoExitoso,
            params: params.params,
          });
          return;
        }
        navigate(name, params);
      },
      getParent: () => null,
    }),
  };

  return {
    navigate,
    goBack: () => router.back(),
    replace: (name, params) => navigateSafe(router, name, params, { replace: true }),
    getParent: () => parentNav,
  };
}
