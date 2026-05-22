import { supabase } from '../config/supabase';

const TABLE = 'Recompensas';

function mapRecompensa(row) {
  if (!row) return null;
  const estadoUi =
    row.Estado === 'Pendiente' || row.Estado === 'disponible'
      ? 'disponible'
      : row.Estado === 'Acreditado' || row.Estado === 'canjeada'
        ? 'canjeada'
        : row.Estado?.toLowerCase() ?? 'disponible';

  return {
    ...row,
    id: row.IdRecompensa,
    titulo: row.Premio,
    tipo: row.TipoRecompensa,
    valor: row.Valor,
    estado: estadoUi,
    fecha: row.FechaGanada,
  };
}

export async function obtenerRecompensasUsuario(idCliente) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('IdCliente', idCliente)
    .order('FechaGanada', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRecompensa);
}

export async function listarRecompensasUsuario(idCliente) {
  return obtenerRecompensasUsuario(idCliente);
}

export async function obtenerRecompensaPorId(idRecompensa) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('IdRecompensa', idRecompensa)
    .single();

  if (error) throw error;
  return mapRecompensa(data);
}

export async function crearRecompensaDesdePremio({
  idGiroRuleta,
  idCliente,
  idPromocion = null,
  premio,
}) {
  const tipoMap = {
    cashback: 'Cashback',
    descuento: 'Descuento',
    giro_premium: 'Giro Premium',
    sorpresa: 'Sorpresa',
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      IdGiroRuleta: idGiroRuleta,
      IdCliente: idCliente,
      IdPromocion: idPromocion,
      Premio: premio.label,
      TipoRecompensa: tipoMap[premio.tipo] ?? 'Cashback',
      Valor: premio.valor ?? 0,
      Estado: 'Pendiente',
      FechaGanada: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return mapRecompensa(data);
}

export async function canjearRecompensa(idRecompensa) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      Estado: 'Acreditado',
      FechaAcreditacion: new Date().toISOString(),
    })
    .eq('IdRecompensa', idRecompensa)
    .select()
    .single();

  if (error) throw error;
  return mapRecompensa(data);
}

export async function totalCashbackDisponible(idCliente) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('Valor')
    .eq('IdCliente', idCliente)
    .eq('TipoRecompensa', 'Cashback')
    .in('Estado', ['Pendiente', 'disponible']);

  if (error) throw error;

  return (data ?? []).reduce((sum, row) => sum + Number(row.Valor ?? 0), 0);
}
