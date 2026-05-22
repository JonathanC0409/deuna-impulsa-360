/**
 * Rutas válidas de Expo Router en este proyecto.
 * Usar siempre navigateSafe / createExpoNavigationShim para no ir a pantallas inexistentes.
 */
export const APP_ROUTES = {
  Home: '/',
  LoginCliente: '/login-cliente',
  LoginNegocio: '/login-negocio',
  RegistroCliente: '/registro-cliente',
  RegistroNegocio: '/registro-negocio',
  GiroBienvenida: '/giro-bienvenida',

  Cliente: '/cliente',
  ClienteInicio: '/cliente/inicio',
  ClienteBeneficios: '/cliente/beneficios',
  ClienteBilletera: '/cliente/billetera',
  ClienteTu: '/cliente/tu',
  ClientePagoExitoso: '/cliente/pago-exitoso',
  ClienteMisRecompensas: '/cliente/mis-recompensas',

  Negocio: '/negocio',
  NegocioItems: '/negocio/items-negocio',
  NegocioCrearItem: '/negocio/crear-item',
  NegocioEditarItem: '/negocio/editar-item',
  NegocioRegistrarVenta: '/negocio/registrar-venta',
  NegocioPromociones: '/negocio/promociones',
  CrearPromocion: '/CrearPromocion',
  EditarPromocion: '/EditarPromocion',

  Promociones: '/promociones',
  Ruleta: '/ruleta',
  RuletaResultado: '/ruleta/resultado',
};

/** Alias usados en navigation.navigate() de pantallas legacy */
export const ROUTE_ALIASES = {
  ClienteTabs: APP_ROUTES.Cliente,
  Cliente: APP_ROUTES.Cliente,
  DashboardNegocio: APP_ROUTES.Negocio,
  ItemsNegocio: APP_ROUTES.NegocioItems,
  CrearItem: APP_ROUTES.NegocioCrearItem,
  EditarItem: APP_ROUTES.NegocioEditarItem,
  RegistrarVenta: APP_ROUTES.NegocioRegistrarVenta,
  PromocionesNegocio: APP_ROUTES.NegocioPromociones,
  PagoExitoso: APP_ROUTES.ClientePagoExitoso,
  MisRecompensas: APP_ROUTES.ClienteMisRecompensas,
  Billetera: APP_ROUTES.ClienteBilletera,
  Beneficios: APP_ROUTES.ClienteBeneficios,
  Inicio: APP_ROUTES.ClienteInicio,
  Ruleta: APP_ROUTES.Ruleta,
  ResultadoRecompensa: APP_ROUTES.RuletaResultado,
  Promociones: APP_ROUTES.Promociones,
  Negocio: APP_ROUTES.Negocio,
  CrearPromocion: APP_ROUTES.CrearPromocion,
  EditarPromocion: APP_ROUTES.EditarPromocion,
};

export function resolveAppPath(name) {
  if (!name) return null;
  return ROUTE_ALIASES[name] ?? APP_ROUTES[name] ?? null;
}

export function navigateSafe(router, name, params, { replace = false } = {}) {
  const path = resolveAppPath(name);
  if (!path) {
    console.warn(`[navigateSafe] Ruta no registrada: "${name}"`);
    return false;
  }
  const action = replace ? router.replace : router.push;
  action({ pathname: path, params });
  return true;
}

/** Parámetro de Expo Router (a veces llega como array en web). */
export function parseRouteParam(value) {
  if (value == null) return undefined;
  if (Array.isArray(value)) return value[0];
  return String(value);
}
