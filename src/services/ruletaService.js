import { supabase } from '../config/supabase';

const TABLE = 'GirosRuleta';

export async function listarGirosPorUsuario(usuarioId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('usuario_id', usuarioId);
  if (error) throw error;
  return data;
}

export async function registrarGiro(giro) {
  const { data, error } = await supabase.from(TABLE).insert(giro).select().single();
  if (error) throw error;
  return data;
}
