import { supabase } from '../config/supabase';

const TABLE = 'Recompensas';
const ESTADO_DISPONIBLE = 'disponible';
const ESTADO_CANJEADA = 'canjeada';

export async function obtenerRecompensasUsuario(usuarioId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('usuario_id', usuarioId)
    .order('creado_en', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

/** Alias por compatibilidad con código previo. */
export async function listarRecompensasUsuario(usuarioId) {
  return obtenerRecompensasUsuario(usuarioId);
}

export async function obtenerRecompensaPorId(recompensaId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', recompensaId).single();
  if (error) throw error;
  return data;
}

export async function crearRecompensa(recompensa) {
  const { data, error } = await supabase.from(TABLE).insert(recompensa).select().single();
  if (error) throw error;
  return data;
}

export async function canjearRecompensa(recompensaId) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      estado: ESTADO_CANJEADA,
      canjeada_en: new Date().toISOString(),
    })
    .eq('id', recompensaId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function totalCashbackDisponible(usuarioId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('valor')
    .eq('usuario_id', usuarioId)
    .eq('tipo', 'cashback')
    .eq('estado', ESTADO_DISPONIBLE);

  if (error) throw error;

  return (data ?? []).reduce((sum, row) => sum + Number(row.valor ?? 0), 0);
}
