import { supabase } from '../config/supabase';

const TABLE_PROMOCIONES = 'Promociones';

export async function crearPromocionNegocio(promocion) {
  const payload = {
    IdNegocio: promocion.IdNegocio,
    IdItemNegocio: promocion.IdItemNegocio || null,
    Titulo: promocion.Titulo,
    Descripcion: promocion.Descripcion,
    TipoPromocion: promocion.TipoPromocion || 'Cashback',
    ValorDescuento: Number(promocion.ValorDescuento || 0),
    HoraInicio: promocion.HoraInicio || null,
    HoraFin: promocion.HoraFin || null,
    FechaInicio: promocion.FechaInicio || new Date().toISOString(),
    FechaFin: promocion.FechaFin || null,
    Activa: true,
  };

  const { data, error } = await supabase
    .from(TABLE_PROMOCIONES)
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error('[crearPromocionNegocio] error:', error);
    throw new Error(error.message ?? 'No se pudo crear la promoción.');
  }

  return data;
}

export async function obtenerPromocionesNegocio(idNegocio) {
  const { data, error } = await supabase
    .from(TABLE_PROMOCIONES)
    .select(`
      *,
      ItemsNegocio (
        IdItemNegocio,
        Nombre,
        Precio
      )
    `)
    .eq('IdNegocio', idNegocio)
    .order('FechaInicio', { ascending: false });

  if (error) {
    console.error('[obtenerPromocionesNegocio] error:', error);
    throw new Error(error.message ?? 'No se pudieron cargar las promociones.');
  }

  return data ?? [];
}