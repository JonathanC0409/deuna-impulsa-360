import { colors } from '../theme/colors';

/**
 * Calcula Estado del ítem según stock actual.
 * Prioridad: Agotado → Critico → Bajo → Disponible
 */
export function calcularEstadoStock(stock, stockMinimo) {
  const s = Number(stock);
  const min = Number(stockMinimo) || 0;

  if (s <= 0) return 'Agotado';
  if (min > 0 && s <= min / 2) return 'Critico';
  if (min > 0 && s <= min) return 'Bajo';
  return 'Disponible';
}

export function requiereAlertaInventario(estado) {
  return estado === 'Bajo' || estado === 'Critico' || estado === 'Agotado';
}

export function colorEstadoItem(estado) {
  switch (estado) {
    case 'Disponible':
      return colors.cashback;
    case 'Bajo':
      return colors.warning;
    case 'Critico':
    case 'Agotado':
      return colors.danger;
    default:
      return colors.textMuted;
  }
}

export function fondoEstadoItem(estado) {
  switch (estado) {
    case 'Disponible':
      return '#E6FBF4';
    case 'Bajo':
      return '#FFF8E6';
    case 'Critico':
    case 'Agotado':
      return '#FDEAEE';
    default:
      return colors.surface;
  }
}
