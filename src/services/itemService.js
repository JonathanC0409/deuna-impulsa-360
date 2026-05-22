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

  // Asegurar FechaCreacion para cumplir con restricciones NOT NULL en la tabla
  if (!payload.FechaCreacion) {
    payload.FechaCreacion = new Date().toISOString();
  }

  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw error;
  return data;
}

function aplicarEstadoEnPayload(payload) {
  if (payload.ManejaStock === false) {
    payload.Stock = null;
    payload.StockMinimo = null;
    payload.Estado = 'Disponible';
  } else if (
    payload.ManejaStock === true ||
    payload.Stock != null ||
    payload.StockMinimo != null
  ) {
    payload.Estado = calcularEstadoStock(payload.Stock ?? 0, payload.StockMinimo ?? 0);
  }
  return payload;
}

export async function obtenerItemNegocio(idItemNegocio, idNegocio) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('IdItemNegocio', idItemNegocio)
    .eq('IdNegocio', idNegocio)
    .eq('Activo', true)
    .single();

  if (error) throw error;
  return data;
}

export async function actualizarItemNegocio(idItemNegocio, data, idNegocio = null) {
  const payload = aplicarEstadoEnPayload({ ...data });

  let query = supabase.from(TABLE).update(payload).eq('IdItemNegocio', idItemNegocio);
  if (idNegocio != null) {
    query = query.eq('IdNegocio', idNegocio);
  }

  const { data: updated, error } = await query.select().single();

  if (error) throw error;
  if (!updated) throw new Error('No se encontró el ítem o no tienes permiso para editarlo.');
  return updated;
}

export async function eliminarItemNegocio(idItemNegocio, idNegocio = null) {
  const payload = { Activo: false };

  let query = supabase.from(TABLE).update(payload).eq('IdItemNegocio', idItemNegocio);
  if (idNegocio != null) {
    query = query.eq('IdNegocio', idNegocio);
  }

  const { data: updated, error } = await query.select().single();

  if (error) throw error;
  if (!updated) throw new Error('No se pudo eliminar el ítem.');
  return updated;
}
