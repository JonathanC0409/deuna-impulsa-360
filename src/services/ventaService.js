import { supabase } from '../config/supabase';

const TABLE_VENTAS = 'Ventas';
const TABLE_DETALLES = 'DetallesVenta';

export async function listarVentasPorNegocio(negocioId) {
  const { data, error } = await supabase
    .from(TABLE_VENTAS)
    .select(`*, ${TABLE_DETALLES}(*)`)
    .eq('negocio_id', negocioId);
  if (error) throw error;
  return data;
}

export async function registrarVenta(venta) {
  const { data, error } = await supabase.from(TABLE_VENTAS).insert(venta).select().single();
  if (error) throw error;
  return data;
}

export async function registrarDetalleVenta(detalle) {
  const { data, error } = await supabase.from(TABLE_DETALLES).insert(detalle).select().single();
  if (error) throw error;
  return data;
}
