import { supabase } from '../config/supabase';
import { crearAlertaNegocio } from './alertaService';

const TABLE_PROMOCIONES = 'Promociones';

function normalizarHora(hora) {
  if (!hora?.trim()) return null;
  const partes = hora.trim().split(':');
  if (partes.length === 2) {
    return `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0')}:00`;
  }
  return hora.trim();
}

function normalizarIdItem(id) {
  if (id == null || id === '' || id === 'undefined') return null;
  const num = Number(id);
  return Number.isNaN(num) ? id : num;
}

export async function crearPromocionNegocio(promocion) {
  if (!promocion?.IdNegocio) {
    throw new Error('No se recibió el negocio. Inicia sesión como negocio.');
  }

  const payload = {
    IdNegocio: Number(promocion.IdNegocio),
    IdItemNegocio: normalizarIdItem(promocion.IdItemNegocio),
    Titulo: promocion.Titulo,
    Descripcion: promocion.Descripcion,
    TipoPromocion: promocion.TipoPromocion || 'Cashback',
    ValorDescuento: Number(promocion.ValorDescuento || 0),
    HoraInicio: normalizarHora(promocion.HoraInicio),
    HoraFin: normalizarHora(promocion.HoraFin),
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

  try {
    await crearAlertaNegocio({
      IdNegocio: promocion.IdNegocio,
      Titulo: 'Promoción creada',
      Mensaje: `"${promocion.Titulo}" ya está activa. Los clientes la verán al pagar con Deuna.`,
      TipoAlerta: 'Promocion',
      Nivel: 'Bajo',
      Leida: false,
    });
  } catch (alertaError) {
    console.warn('[crearPromocionNegocio] alerta:', alertaError?.message);
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

export async function obtenerPromocionPorId(idPromocion) {
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
    .eq('IdPromocion', idPromocion)
    .single();

  if (error) {
    console.error('[obtenerPromocionPorId] error:', error);
    throw new Error(error.message ?? 'No se encontró la promoción.');
  }

  return data;
}

export async function actualizarPromocionNegocio(idPromocion, promocion) {
  const payload = {
    Titulo: promocion.Titulo,
    Descripcion: promocion.Descripcion,
    TipoPromocion: promocion.TipoPromocion,
    ValorDescuento: Number(promocion.ValorDescuento ?? 0),
    IdItemNegocio: promocion.IdItemNegocio || null,
    HoraInicio: normalizarHora(promocion.HoraInicio),
    HoraFin: normalizarHora(promocion.HoraFin),
    FechaFin: promocion.FechaFin ?? null,
    Activa: promocion.Activa !== false,
  };

  const { data, error } = await supabase
    .from(TABLE_PROMOCIONES)
    .update(payload)
    .eq('IdPromocion', idPromocion)
    .select()
    .single();

  if (error) {
    console.error('[actualizarPromocionNegocio] error:', error);
    throw new Error(error.message ?? 'No se pudo actualizar la promoción.');
  }

  try {
    await crearAlertaNegocio({
      IdNegocio: data.IdNegocio,
      Titulo: 'Promoción actualizada',
      Mensaje: `"${data.Titulo}" fue modificada correctamente.`,
      TipoAlerta: 'Promocion',
      Nivel: 'Bajo',
      Leida: false,
    });
  } catch (alertaError) {
    console.warn('[actualizarPromocionNegocio] alerta:', alertaError?.message);
  }

  return data;
}