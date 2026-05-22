/** Navegación unificada a /ruleta (web: http://localhost:8082/ruleta) */
export function buildRuletaParams({
  ventaId,
  usuarioId,
  negocioId,
  montoVenta,
  nombreNegocio,
  esHorarioPromocional,
}) {
  return {
    ventaId: String(ventaId ?? ''),
    usuarioId: String(usuarioId ?? ''),
    negocioId: String(negocioId ?? ''),
    montoVenta: String(montoVenta ?? ''),
    nombreNegocio: nombreNegocio ?? 'Negocio aliado',
    esHorarioPromocional: String(
      esHorarioPromocional === true || esHorarioPromocional === 'true'
    ),
  };
}

export function irARuleta(router, params) {
  router.replace({
    pathname: '/ruleta',
    params: buildRuletaParams(params),
  });
}
