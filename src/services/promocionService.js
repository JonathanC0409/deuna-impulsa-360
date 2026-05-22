import { supabase } from '../config/supabase';

const TABLE = 'Promociones';

export async function listarPromocionesPorNegocio(negocioId) {
  const { data, error } = await supabase.from(TABLE).select('*').eq('negocio_id', negocioId);
  if (error) throw error;
  return data;
}

export async function crearPromocion(promocion) {
  const { data, error } = await supabase.from(TABLE).insert(promocion).select().single();
  if (error) throw error;
  return data;
}
