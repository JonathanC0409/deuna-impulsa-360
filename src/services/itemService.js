import { supabase } from '../config/supabase';
import { calcularEstadoStock } from '../utils/estadoInventario';

const TABLE = 'ItemsNegocio';
const TABLE_NEGOCIOS = 'Negocios';

export async function obtenerNegocio(idNegocio) {
  const { data, error } = await supabase
    .from(TABLE_NEGOCIOS)
    .select('*')
    .eq('IdNegocio', idNegocio)
    .single();

  if (error) throw error;
  return data;
}

export async function obtenerItemsNegocio(idNegocio) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('IdNegocio', idNegocio)
    .eq('Activo', true)
    .order('Nombre');

  if (error) throw error;
  return data ?? [];
}

export async function obtenerItemPorId(idItemNegocio) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('IdItemNegocio', idItemNegocio)
    .single();

  if (error) throw error;
  return data;
}

export async function crearItemNegocio(item) {
  const payload = { ...item, Activo: true };

  if (!payload.ManejaStock) {
    payload.Stock = null;
    payload.StockMinimo = null;
    payload.Estado = 'Disponible';
  } else {
    payload.Estado = calcularEstadoStock(payload.Stock ?? 0, payload.StockMinimo ?? 0);
  }

  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function actualizarItemNegocio(idItemNegocio, data) {
  const { data: updated, error } = await supabase
    .from(TABLE)
    .update(data)
    .eq('IdItemNegocio', idItemNegocio)
    .select()
    .single();

  if (error) throw error;
  return updated;
}
