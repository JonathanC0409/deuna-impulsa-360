/**
 * Adapta navigation.navigate() de React Navigation a rutas de Expo Router.
 */
export function createExpoNavigationShim(router, routeMap = {}) {
  const navigate = (name, params) => {
    if (params?.screen) {
      const nestedPath = routeMap[params.screen];
      if (nestedPath) {
        router.push({ pathname: nestedPath, params: params.params });
        return;
      }
    }

    const path = routeMap[name];
    if (path) {
      router.push({ pathname: path, params });
      return;
    }

    router.push(name);
  };

  const parentNav = {
    navigate,
    getParent: () => ({
      navigate: (name, params) => {
        if (name === 'Cliente' && params?.screen === 'PagoExitoso') {
          router.push({ pathname: '/cliente/pago-exitoso', params: params.params });
          return;
        }
        const rootPath = routeMap[name];
        if (rootPath) router.push({ pathname: rootPath, params });
        else router.push(name);
      },
      getParent: () => null,
    }),
  };

  return {
    navigate,
    goBack: () => router.back(),
    getParent: () => parentNav,
  };
}
