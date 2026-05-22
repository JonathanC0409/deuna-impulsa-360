import { supabase } from '../config/supabase';

const TABLE = 'Recompensas';

export async function listarRecompensasUsuario(usuarioId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('usuario_id', usuarioId);
  if (error) throw error;
  return data;
}

export async function crearRecompensa(recompensa) {
  const { data, error } = await supabase.from(TABLE).insert(recompensa).select().single();
  if (error) throw error;
  return data;
}
