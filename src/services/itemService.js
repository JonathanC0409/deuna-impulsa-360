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

  if (error) {
    console.error('[obtenerNegocio] error:', error);
    throw new Error(error.message ?? 'No se pudo obtener el negocio.');
  }

  return data;
}

export async function obtenerItemsNegocio(idNegocio) {
  if (!idNegocio) {
    return [];
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('IdNegocio', idNegocio)
    .eq('Activo', true)
    .order('Nombre', { ascending: true });

  if (error) {
    console.error('[obtenerItemsNegocio] error:', error);
    throw new Error(error.message ?? 'No se pudo cargar el inventario.');
  }

  return data ?? [];
}

export async function obtenerItemPorId(idItemNegocio) {
  if (!idItemNegocio) {
    throw new Error('No se recibió el ID del ítem.');
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('IdItemNegocio', idItemNegocio)
    .maybeSingle();

  if (error) {
    console.error('[obtenerItemPorId] error:', error);
    throw new Error(error.message ?? 'No se pudo obtener el ítem.');
  }

  if (!data) {
    throw new Error('No se encontró el ítem.');
  }

  return data;
}

export async function crearItemNegocio(item) {
  const payload = {
    ...item,
    Activo: true,
  };

  if (!payload.ManejaStock) {
    payload.Stock = null;
    payload.StockMinimo = null;
    payload.Estado = 'Disponible';
  } else {
    payload.Estado = calcularEstadoStock(
      Number(payload.Stock ?? 0),
      Number(payload.StockMinimo ?? 0)
    );
  }

  if (!payload.FechaCreacion) {
    payload.FechaCreacion = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[crearItemNegocio] error:', error);
    throw new Error(error.message ?? 'No se pudo crear el ítem.');
  }

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
    payload.Estado = calcularEstadoStock(
      Number(payload.Stock ?? 0),
      Number(payload.StockMinimo ?? 0)
    );
  }

  return payload;
}

export async function obtenerItemNegocio(idItemNegocio, idNegocio) {
  if (!idItemNegocio) {
    throw new Error('No se recibió el ID del ítem.');
  }

  if (!idNegocio) {
    throw new Error('No se recibió el ID del negocio.');
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('IdItemNegocio', idItemNegocio)
    .eq('IdNegocio', idNegocio)
    .eq('Activo', true)
    .maybeSingle();

  if (error) {
    console.error('[obtenerItemNegocio] error:', error);
    throw new Error(error.message ?? 'No se pudo obtener el ítem.');
  }

  if (!data) {
    throw new Error('No se encontró el ítem o no pertenece a este negocio.');
  }

  return data;
}

export async function actualizarItemNegocio(idItemNegocio, data, idNegocio = null) {
  if (!idItemNegocio) {
    throw new Error('No se recibió el ID del ítem.');
  }

  const payload = aplicarEstadoEnPayload({ ...data });

  let query = supabase
    .from(TABLE)
    .update(payload)
    .eq('IdItemNegocio', idItemNegocio);

  if (idNegocio != null) {
    query = query.eq('IdNegocio', idNegocio);
  }

  const { data: updated, error } = await query
    .select()
    .maybeSingle();

  if (error) {
    console.error('[actualizarItemNegocio] error:', error);
    throw new Error(error.message ?? 'No se pudo actualizar el ítem.');
  }

  if (!updated) {
    throw new Error('No se encontró el ítem o no tienes permiso para editarlo.');
  }

  return updated;
}

export async function eliminarItemNegocio(idItemNegocio, idNegocio = null) {
  console.log('========== DEBUG ELIMINAR ==========');
  console.log('ID ITEM RECIBIDO:', idItemNegocio);
  console.log('ID NEGOCIO RECIBIDO:', idNegocio);

  if (!idItemNegocio) {
    throw new Error('No se recibió el ID del ítem.');
  }

  // 1. Primero verificamos si el ítem existe
  const existeRes = await supabase
    .from(TABLE)
    .select('IdItemNegocio, IdNegocio, Nombre, Activo')
    .eq('IdItemNegocio', idItemNegocio)
    .maybeSingle();

  console.log('EXISTE DATA:', existeRes.data);
  console.log('EXISTE ERROR:', existeRes.error);

  if (existeRes.error) {
    throw new Error(existeRes.error.message);
  }

  if (!existeRes.data) {
    throw new Error('El ítem no existe en la tabla ItemsNegocio.');
  }

  // 2. Verificamos si el negocio coincide
  if (idNegocio != null && String(existeRes.data.IdNegocio) !== String(idNegocio)) {
    throw new Error(
      `El IdNegocio no coincide. El ítem pertenece a ${existeRes.data.IdNegocio}, pero tu sesión tiene ${idNegocio}.`
    );
  }

  // 3. Intentamos actualizar solo por IdItemNegocio
  const { data, error } = await supabase
    .from(TABLE)
    .update({ Activo: false })
    .eq('IdItemNegocio', idItemNegocio)
    .select('IdItemNegocio, IdNegocio, Nombre, Activo')
    .maybeSingle();

  console.log('UPDATE DATA:', data);
  console.log('UPDATE ERROR:', error);
  console.log('====================================');

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(
      'Supabase no permitió actualizar el ítem. Revisa RLS o permisos UPDATE en la tabla ItemsNegocio.'
    );
  }

  return data;
}