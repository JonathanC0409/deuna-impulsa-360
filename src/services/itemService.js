import { supabase } from '../config/supabase';

const TABLE = 'ItemsNegocio';

export async function listarItemsPorNegocio(negocioId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('negocio_id', negocioId);
  if (error) throw error;
  return data;
}

export async function crearItem(item) {
  const { data, error } = await supabase.from(TABLE).insert(item).select().single();
  if (error) throw error;
  return data;
}

export async function actualizarItem(id, cambios) {
  const { data, error } = await supabase.from(TABLE).update(cambios).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
