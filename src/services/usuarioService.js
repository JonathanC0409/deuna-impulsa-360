import { supabase } from '../config/supabase';

const TABLE = 'Usuarios';

export async function obtenerUsuario(idUsuario) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('IdUsuario', idUsuario)
    .single();

  if (error) throw error;
  return data;
}

export async function buscarUsuarioPorCorreo(correo) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('Correo', correo.trim().toLowerCase())
    .eq('Activo', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function crearUsuario(usuario) {
  const payload = {
    Nombre: usuario.Nombre,
    Rol: usuario.Rol ?? 'Cliente',
    Correo: usuario.Correo?.trim().toLowerCase(),
    Telefono: usuario.Telefono?.trim(),
    Activo: true,
  };

  const { data, error } = await supabase.from(TABLE).insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function actualizarUsuario(idUsuario, cambios) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(cambios)
    .eq('IdUsuario', idUsuario)
    .select()
    .single();

  if (error) throw error;
  return data;
}
