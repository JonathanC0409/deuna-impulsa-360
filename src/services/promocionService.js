import { supabase } from '../config/supabase';

const TABLE_PROMOCIONES = 'Promociones';

export async function obtenerPromocionesActivasCliente() {
  const ahora = new Date().toISOString();

  const { data, error } = await supabase
    .from(TABLE_PROMOCIONES)
    .select(`
      IdPromocion,
      IdNegocio,
      IdItemNegocio,
      Titulo,
      Descripcion,
      TipoPromocion,
      ValorDescuento,
      HoraInicio,
      HoraFin,
      FechaInicio,
      FechaFin,
      Activa,
      Negocios (
        IdNegocio,
        NombreNegocio,
        Direccion
      ),
      ItemsNegocio (
        IdItemNegocio,
        Nombre,
        Precio,
        TipoItem
      )
    `)
    .eq('Activa', true)
    .lte('FechaInicio', ahora)
    .or(`FechaFin.is.null,FechaFin.gte.${ahora}`)
    .order('FechaInicio', { ascending: false });

  if (error) {
    console.error('[obtenerPromocionesActivasCliente] error:', error);
    throw new Error(error.message ?? 'No se pudieron cargar las promociones.');
  }

  return data ?? [];
}

export async function esHorarioPromocionalActivo(idNegocio) {
  const ahora = new Date();
  const horaActual = ahora.toTimeString().slice(0, 8);
  const fechaActual = ahora.toISOString();

  const { data, error } = await supabase
    .from(TABLE_PROMOCIONES)
    .select('*')
    .eq('IdNegocio', idNegocio)
    .eq('Activa', true)
    .lte('FechaInicio', fechaActual)
    .or(`FechaFin.is.null,FechaFin.gte.${fechaActual}`);

  if (error) {
    console.error('[esHorarioPromocionalActivo] error:', error);
    return false;
  }

  return (data ?? []).some((promo) => {
    if (!promo.HoraInicio || !promo.HoraFin) return true;

    return horaActual >= promo.HoraInicio && horaActual <= promo.HoraFin;
  });
}