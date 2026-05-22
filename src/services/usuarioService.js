import { supabase } from '../config/supabase';

const TABLE = 'Usuarios';

export async function obtenerUsuario(id) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function crearUsuario(usuario) {
  const { data, error } = await supabase.from(TABLE).insert(usuario).select().single();
  if (error) throw error;
  return data;
}

export async function actualizarUsuario(id, cambios) {
  const { data, error } = await supabase.from(TABLE).update(cambios).eq('id', id).select().single();
  if (error) throw error;
  return data;
}
