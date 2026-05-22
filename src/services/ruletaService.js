import { supabase } from '../config/supabase';
import { crearRecompensaDesdePremio } from './recompensaService';

const TABLE_GIROS = 'GirosRuleta';
const TABLE_VENTAS = 'Ventas';
const TABLE_RECOMPENSAS = 'Recompensas';

export const PREMIOS = [
  { id: 'cashback_010', tipo: 'cashback', valor: 0.1, label: '$0.10 cashback' },
  { id: 'cashback_025', tipo: 'cashback', valor: 0.25, label: '$0.25 cashback' },
  { id: 'descuento_5', tipo: 'descuento', valor: 5, label: '5% descuento' },
  { id: 'descuento_10', tipo: 'descuento', valor: 10, label: '10% descuento' },
  { id: 'giro_premium', tipo: 'giro_premium', valor: 1, label: 'Giro premium' },
  { id: 'sorpresa', tipo: 'sorpresa', valor: 0.5, label: 'Premio sorpresa' },
];

const PESOS_POR_NIVEL = {
  1: [45, 30, 12, 5, 5, 3],
  2: [35, 28, 18, 10, 6, 3],
  3: [25, 22, 22, 15, 10, 6],
  4: [18, 18, 20, 18, 14, 12],
};

export function determinarNivelGiro(montoVenta, comprasEnNegocio, esHorarioPromocional) {
  if (esHorarioPromocional) return 4;
  if (comprasEnNegocio >= 5) return 3;
  if (Number(montoVenta) >= 5) return 2;
  if (Number(montoVenta) >= 1) return 1;
  return 0;
}

export function seleccionarPremio(nivelGiro) {
  const pesos = PESOS_POR_NIVEL[nivelGiro] ?? PESOS_POR_NIVEL[1];
  const total = pesos.reduce((sum, p) => sum + p, 0);
  let random = Math.random() * total;

  for (let i = 0; i < pesos.length; i += 1) {
    random -= pesos[i];
    if (random <= 0) {
      return { ...PREMIOS[i] };
    }
  }

  return { ...PREMIOS[PREMIOS.length - 1] };
}

export async function contarComprasUsuarioEnNegocio(idCliente, idNegocio) {
  const { count, error } = await supabase
    .from(TABLE_VENTAS)
    .select('IdVenta', { count: 'exact', head: true })
    .eq('IdCliente', idCliente)
    .eq('IdNegocio', idNegocio);

  if (error) throw error;
  return count ?? 0;
}

export async function ventaTieneGiro(idVenta) {
  const { data, error } = await supabase
    .from(TABLE_GIROS)
    .select('*')
    .eq('IdVenta', idVenta)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function obtenerGiroBienvenidaPendiente(idCliente) {
  const { data, error } = await supabase
    .from(TABLE_GIROS)
    .select('*')
    .eq('IdCliente', idCliente)
    .eq('TipoGiro', 'Bienvenida')
    .eq('Usado', false)
    .order('FechaGenerado', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function crearGiro({
  idVenta,
  idCliente,
  nivelGiro,
  montoCompra,
  tipoGiro = 'Basico',
  idPromocion = null,
}) {
  const { data, error } = await supabase
    .from(TABLE_GIROS)
    .insert({
      IdVenta: idVenta,
      IdCliente: idCliente,
      IdPromocion: idPromocion,
      FechaGenerado: new Date().toISOString(),
      TipoGiro: tipoGiro,
      MontoCompra: montoCompra,
      Nivel: nivelGiro,
      Usado: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function marcarGiroUsado(idGiroRuleta) {
  const { data, error } = await supabase
    .from(TABLE_GIROS)
    .update({
      Usado: true,
      FechaUsado: new Date().toISOString(),
    })
    .eq('IdGiroRuleta', idGiroRuleta)
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function recompensaExisteParaGiro(idGiroRuleta) {
  const { data, error } = await supabase
    .from(TABLE_RECOMPENSAS)
    .select('*')
    .eq('IdGiroRuleta', idGiroRuleta)
    .maybeSingle();

  if (error) throw error;
  return data;
}

function mapPremioDesdeRecompensa(row) {
  return {
    tipo: (row.TipoRecompensa ?? 'cashback').toLowerCase(),
    valor: Number(row.Valor),
    label: row.Premio,
  };
}

export async function ejecutarGiro({ idGiroRuleta, idCliente, nivelGiro, premioPreseleccionado }) {
  const { data: giro, error: giroErr } = await supabase
    .from(TABLE_GIROS)
    .select('*')
    .eq('IdGiroRuleta', idGiroRuleta)
    .single();

  if (giroErr) throw giroErr;
  if (!giro) throw new Error('No se encontró el giro.');
  if (giro.Usado) throw new Error('Este giro ya fue utilizado.');

  const existente = await recompensaExisteParaGiro(idGiroRuleta);
  if (existente) {
    return {
      premio: mapPremioDesdeRecompensa(existente),
      recompensa: existente,
      yaExistia: true,
    };
  }

  const premio = premioPreseleccionado ?? seleccionarPremio(nivelGiro);
  await marcarGiroUsado(idGiroRuleta);
  const recompensa = await crearRecompensaDesdePremio({
    idGiroRuleta,
    idCliente,
    premio,
  });

  return { premio, recompensa, yaExistia: false };
}
