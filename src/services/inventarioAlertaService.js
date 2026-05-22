import { supabase } from '../config/supabase';
import { obtenerItemsNegocio } from './itemService';
import {
  crearAlertaNegocio,
  existeAlertaPendiente,
  generarAlertaStockSiAplica,
  itemRequiereAlertaStock,
} from './alertaService';

const TABLE_DETALLES = 'DetallesVenta';
const TABLE_VENTAS = 'Ventas';

const DIAS_ROTACION = 7;
const UMBRAL_VENTAS_BAJAS = 2;

function inicioPeriodo(dias) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Cantidad vendida por ítem en los últimos N días (datos reales de DetallesVenta). */
export async function obtenerVentasPorItem(idNegocio, dias = DIAS_ROTACION) {
  const desde = inicioPeriodo(dias);

  const ventasRes = await supabase
    .from(TABLE_VENTAS)
    .select('IdVenta')
    .eq('IdNegocio', idNegocio)
    .gte('FechaVenta', desde);

  if (ventasRes.error) throw ventasRes.error;

  const idsVentas = (ventasRes.data ?? []).map((v) => v.IdVenta);
  if (idsVentas.length === 0) {
    return {};
  }

  const detallesRes = await supabase
    .from(TABLE_DETALLES)
    .select('IdItemNegocio, Cantidad')
    .in('IdVenta', idsVentas);

  if (detallesRes.error) throw detallesRes.error;

  const mapa = {};
  (detallesRes.data ?? []).forEach((d) => {
    const id = String(d.IdItemNegocio);
    mapa[id] = (mapa[id] ?? 0) + Number(d.Cantidad ?? 0);
  });

  return mapa;
}

export { generarAlertaStockSiAplica, itemRequiereAlertaStock };

/** Crea alertas de stock según estado actual en ItemsNegocio (sin duplicar pendientes). */
export async function sincronizarAlertasStockNegocio(idNegocio) {
  const items = await obtenerItemsNegocio(idNegocio);
  let creadas = 0;

  for (const item of items) {
    if (!itemRequiereAlertaStock(item)) continue;

    const creada = await generarAlertaStockSiAplica(item);
    if (creada) creadas += 1;
  }

  return creadas;
}

/** Alerta productos con pocas ventas en el periodo — sugiere crear promoción. */
export async function sincronizarAlertasBajaRotacion(idNegocio, umbral = UMBRAL_VENTAS_BAJAS) {
  const [items, ventasMap] = await Promise.all([
    obtenerItemsNegocio(idNegocio),
    obtenerVentasPorItem(idNegocio, DIAS_ROTACION),
  ]);

  let creadas = 0;

  for (const item of items) {
    const vendidos = ventasMap[String(item.IdItemNegocio)] ?? 0;
    if (vendidos >= umbral) continue;

    const existe = await existeAlertaPendiente({
      idNegocio,
      idItemNegocio: item.IdItemNegocio,
      tipoAlerta: 'Rotacion',
    });

    if (existe) continue;

    await crearAlertaNegocio({
      IdNegocio: idNegocio,
      IdItemNegocio: item.IdItemNegocio,
      Titulo: 'Poca rotación',
      Mensaje: `"${item.Nombre}" vendió ${vendidos} uds. en ${DIAS_ROTACION} días. Crea una promoción para impulsarlo.`,
      TipoAlerta: 'Rotacion',
      Nivel: 'Medio',
      Leida: false,
    });
    creadas += 1;
  }

  return creadas;
}

export async function sincronizarTodasAlertasNegocio(idNegocio) {
  const [stock, rotacion] = await Promise.all([
    sincronizarAlertasStockNegocio(idNegocio),
    sincronizarAlertasBajaRotacion(idNegocio),
  ]);
  return { stock, rotacion };
}
