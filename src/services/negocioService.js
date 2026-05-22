import { supabase } from '../config/supabase';

const TABLE_NEGOCIOS = 'Negocios';
const TABLE_CATEGORIAS = 'CategoriasNegocio';

export async function listarNegocios() {
  const { data, error } = await supabase.from(TABLE_NEGOCIOS).select('*');
  if (error) throw error;
  return data;
}

export async function obtenerNegocio(id) {
  const { data, error } = await supabase.from(TABLE_NEGOCIOS).select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function listarCategorias() {
  const { data, error } = await supabase.from(TABLE_CATEGORIAS).select('*');
  if (error) throw error;
  return data;
}
