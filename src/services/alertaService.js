import { supabase } from '../config/supabase';

const TABLE = 'AlertasNegocio';

export async function crearAlertaNegocio(alerta) {
  const { data, error } = await supabase.from(TABLE).insert(alerta).select().single();
  if (error) throw error;
  return data;
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
