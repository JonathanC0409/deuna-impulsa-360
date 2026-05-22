import { supabase } from '../config/supabase';
import { crearRecompensa as insertarRecompensa } from './recompensaService';

const TABLE_GIROS = 'GirosRuleta';
const TABLE_VENTAS = 'Ventas';
const TABLE_RECOMPENSAS = 'Recompensas';

/** @type {Array<{ id: string, tipo: string, valor: number | null, label: string }>} */
export const PREMIOS = [
  { id: 'cashback_010', tipo: 'cashback', valor: 0.1, label: '$0.10 cashback' },
  { id: 'cashback_025', tipo: 'cashback', valor: 0.25, label: '$0.25 cashback' },
  { id: 'descuento_5', tipo: 'descuento', valor: 5, label: '5% descuento' },
  { id: 'descuento_10', tipo: 'descuento', valor: 10, label: '10% descuento' },
  { id: 'giro_premium', tipo: 'giro_premium', valor: 1, label: 'Giro premium' },
  { id: 'sorpresa', tipo: 'sorpresa', valor: null, label: 'Premio sorpresa' },
];

/** Pesos por índice de PREMIOS según nivel de giro (1–4). */
const PESOS_POR_NIVEL = {
  1: [45, 30, 12, 5, 5, 3],
  2: [35, 28, 18, 10, 6, 3],
  3: [25, 22, 22, 15, 10, 6],
  4: [18, 18, 20, 18, 14, 12],
};

/**
 * Prioridad: horario promocional (4) > quinta compra en negocio (3) > monto >= 5 (2) > monto >= 1 (1).
 * @param {number} montoVenta
 * @param {number} comprasEnNegocio Total de ventas del usuario en ese negocio (incluye la venta actual).
 * @param {boolean} esHorarioPromocional
 * @returns {number} Nivel 1–4, o 0 si no aplica giro.
 */
export function determinarNivelGiro(montoVenta, comprasEnNegocio, esHorarioPromocional) {
  if (esHorarioPromocional) return 4;
  if (comprasEnNegocio >= 5) return 3;
  if (Number(montoVenta) >= 5) return 2;
  if (Number(montoVenta) >= 1) return 1;
  return 0;
}

/**
 * Horarios promocionales: si Integrante 2 expone la consulta, úsala desde PagoExitoso
 * y pasa esHorarioPromocional en route.params. Ejemplo de adaptación con tabla Promociones:
 *
 *   const { data } = await supabase.from('Promociones').select('*')
 *     .eq('negocio_id', negocioId).eq('activa', true);
 *   // Ajustar filtros (día, hora_inicio, hora_fin, etc.) según columnas reales del proyecto.
 */
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

export async function contarComprasUsuarioEnNegocio(usuarioId, negocioId) {
  const { count, error } = await supabase
    .from(TABLE_VENTAS)
    .select('id', { count: 'exact', head: true })
    .eq('usuario_id', usuarioId)
    .eq('negocio_id', negocioId);

  if (error) throw error;
  return count ?? 0;
}

/** @returns {Promise<object|null>} Giro existente o null. */
export async function ventaTieneGiro(ventaId) {
  const { data, error } = await supabase
    .from(TABLE_GIROS)
    .select('*')
    .eq('venta_id', ventaId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function crearGiro({ ventaId, usuarioId, negocioId, nivelGiro }) {
  const { data, error } = await supabase
    .from(TABLE_GIROS)
    .insert({
      venta_id: ventaId,
      usuario_id: usuarioId,
      negocio_id: negocioId,
      nivel: nivelGiro,
      usado: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function marcarGiroUsado(giroId) {
  const { data, error } = await supabase
    .from(TABLE_GIROS)
    .update({
      usado: true,
      usado_en: new Date().toISOString(),
    })
    .eq('id', giroId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function crearRecompensa({ giroId, usuarioId, negocioId, premio }) {
  return insertarRecompensa({
    giro_id: giroId,
    usuario_id: usuarioId,
    negocio_id: negocioId,
    tipo: premio.tipo,
    valor: premio.valor,
    label: premio.label,
    estado: 'disponible',
  });
}

async function recompensaExisteParaGiro(giroId) {
  const { data, error } = await supabase
    .from(TABLE_RECOMPENSAS)
    .select('id, tipo, valor, label, estado')
    .eq('giro_id', giroId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Marca el giro como usado, persiste la recompensa y evita duplicados.
 */
export async function ejecutarGiro({ giroId, usuarioId, negocioId, nivelGiro }) {
  const giro = await ventaTieneGiroPorId(giroId);
  if (!giro) {
    throw new Error('No se encontró el giro.');
  }
  if (giro.usado) {
    throw new Error('Este giro ya fue utilizado.');
  }

  const existente = await recompensaExisteParaGiro(giroId);
  if (existente) {
    const premio = {
      tipo: existente.tipo,
      valor: existente.valor,
      label: existente.label,
    };
    return { premio, recompensa: existente, yaExistia: true };
  }

  const premio = seleccionarPremio(nivelGiro);
  await marcarGiroUsado(giroId);
  const recompensa = await crearRecompensa({ giroId, usuarioId, negocioId, premio });

  return { premio, recompensa, yaExistia: false };
}

async function ventaTieneGiroPorId(giroId) {
  const { data, error } = await supabase.from(TABLE_GIROS).select('*').eq('id', giroId).single();
  if (error) throw error;
  return data;
}
