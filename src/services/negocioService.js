import { supabase } from '../config/supabase';

const TABLE_NEGOCIOS = 'Negocios';
const TABLE_CATEGORIAS = 'CategoriasNegocio';

export async function listarNegocios() {
  const { data, error } = await supabase
    .from(TABLE_NEGOCIOS)
    .select('*')
    .eq('Activo', true)
    .order('NombreNegocio');

  if (error) throw error;
  return data ?? [];
}

export async function obtenerNegocio(idNegocio) {
  const { data, error } = await supabase
    .from(TABLE_NEGOCIOS)
    .select('*')
    .eq('IdNegocio', idNegocio)
    .single();

  if (error) throw error;
  return data;
}

export async function obtenerNegocioPorPropietario(idUsuarioPropietario) {
  // Limit to 1 result to avoid errors when multiple negocios exist for the same propietario
  const { data, error } = await supabase
    .from(TABLE_NEGOCIOS)
    .select('*')
    .eq('IdUsuarioPropietario', idUsuarioPropietario)
    .eq('Activo', true)
    .order('IdNegocio', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function crearNegocio(negocio) {
  const { data, error } = await supabase.from(TABLE_NEGOCIOS).insert(negocio).select().single();
  if (error) throw error;
  return data;
}

export async function listarCategorias() {
  const { data, error } = await supabase
    .from(TABLE_CATEGORIAS)
    .select('*')
    .eq('Activa', true);

  if (error) throw error;
  return data ?? [];
}
