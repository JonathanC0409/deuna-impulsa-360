import { supabase } from '../config/supabase';
import { calcularEstadoStock, requiereAlertaInventario } from '../utils/estadoInventario';

const TABLE = 'AlertasNegocio';

export function itemRequiereAlertaStock(item) {
  if (!item?.ManejaStock) return false;

  const stock = Number(item.Stock ?? 0);
  const min = Number(item.StockMinimo ?? 0);

  if (min <= 0) return false;

  const estado = item.Estado ?? calcularEstadoStock(stock, min);

  return stock <= min || requiereAlertaInventario(estado);
}

/** Al guardar ítem con stock mínimo y stock bajo, crea alerta en la base. */
export async function generarAlertaStockSiAplica(item) {
  if (!item?.IdNegocio || !itemRequiereAlertaStock(item)) {
    return null;
  }

  const existe = await existeAlertaPendiente({
    idNegocio: item.IdNegocio,
    idItemNegocio: item.IdItemNegocio,
    tipoAlerta: 'Inventario',
  });

  if (existe) return null;

  const stock = Number(item.Stock ?? 0);
  const min = Number(item.StockMinimo ?? 0);
  const estado = item.Estado ?? calcularEstadoStock(stock, min);
  const nivel = estado === 'Agotado' || estado === 'Critico' ? 'Alto' : 'Medio';

  return crearAlertaNegocio({
    IdNegocio: item.IdNegocio,
    IdItemNegocio: item.IdItemNegocio,
    Titulo: `Stock ${estado.toLowerCase()}`,
    Mensaje: `${item.Nombre}: ${stock} uds. (mínimo ${min}). Crea una promoción para impulsar ventas.`,
    TipoAlerta: 'Inventario',
    Nivel: nivel,
    Leida: false,
  });
}

export async function crearAlertaNegocio(alerta) {
  const payload = {
    ...alerta,
    FechaCreacion: alerta.FechaCreacion ?? new Date().toISOString(),
  };

  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw error;
  return data;
}

/** Evita duplicar alertas no leídas del mismo tipo e ítem. */
export async function existeAlertaPendiente({
  idNegocio,
  idItemNegocio = null,
  tipoAlerta,
}) {
  let query = supabase
    .from(TABLE)
    .select('IdAlertaNegocio')
    .eq('IdNegocio', idNegocio)
    .eq('Leida', false)
    .eq('TipoAlerta', tipoAlerta)
    .limit(1);

  if (idItemNegocio != null) {
    query = query.eq('IdItemNegocio', idItemNegocio);
  }

  const { data, error } = await query;
  if (error) {
    console.warn('[existeAlertaPendiente]', error.message);
    return false;
  }

  return (data ?? []).length > 0;
}

export async function contarAlertasActivas(idNegocio) {
  const { count, error } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('IdNegocio', idNegocio)
    .eq('Leida', false);

  if (error) throw error;
  return count ?? 0;
}

export async function listarAlertasActivas(idNegocio, limite = 5) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('IdNegocio', idNegocio)
    .eq('Leida', false)
    .order('FechaCreacion', { ascending: false })
    .limit(limite);

  if (error) throw error;
  return data ?? [];
}
