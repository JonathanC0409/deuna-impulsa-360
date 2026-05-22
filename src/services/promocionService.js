import { supabase } from '../config/supabase';

const TABLE = 'Promociones';

export async function listarPromocionesPorNegocio(idNegocio) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('IdNegocio', idNegocio)
    .eq('Activa', true)
    .order('FechaInicio', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function crearPromocion(promocion) {
  const { data, error } = await supabase.from(TABLE).insert(promocion).select().single();
  if (error) throw error;
  return data;
}

function horaActualComoTime() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}:00`;
}

/** ¿Hay promoción activa con ventana horaria que incluya ahora? */
export async function esHorarioPromocionalActivo(idNegocio) {
  const ahora = horaActualComoTime();

  const { data, error } = await supabase
    .from(TABLE)
    .select('IdPromocion, HoraInicio, HoraFin, Titulo')
    .eq('IdNegocio', idNegocio)
    .eq('Activa', true)
    .not('HoraInicio', 'is', null)
    .not('HoraFin', 'is', null);

  if (error) throw error;

  return (data ?? []).some((p) => {
    const inicio = String(p.HoraInicio).slice(0, 8);
    const fin = String(p.HoraFin).slice(0, 8);
    return ahora >= inicio && ahora <= fin;
  });
}
