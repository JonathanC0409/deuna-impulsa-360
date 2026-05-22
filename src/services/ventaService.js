import { supabase } from '../config/supabase';
import { crearAlertaNegocio } from './alertaService';
import { obtenerItemPorId, actualizarItemNegocio } from './itemService';
import {
  calcularEstadoStock,
  requiereAlertaInventario,
} from '../utils/estadoInventario';

const TABLE_VENTAS = 'Ventas';
const TABLE_DETALLES = 'DetallesVenta';
const TABLE_USUARIOS = 'Usuarios';

function inicioDelDia() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function inicioDeSemana() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function obtenerClientes() {
  const { data, error } = await supabase
    .from(TABLE_USUARIOS)
    .select('IdUsuario, Nombre, Correo, Telefono, Rol')
    .eq('Rol', 'Cliente')
    .eq('Activo', true)
    .order('Nombre');

  if (error) throw error;
  return data ?? [];
}

export async function obtenerResumenDashboard(idNegocio) {
  const desdeSemana = inicioDeSemana();
  const desdeHoy = inicioDelDia();

  const [ventasSemanaRes, ventasHoyRes, alertasCountRes, negocioRes] = await Promise.all([
    supabase
      .from(TABLE_VENTAS)
      .select('IdVenta, IdCliente, Total, FechaVenta')
      .eq('IdNegocio', idNegocio)
      .gte('FechaVenta', desdeSemana),
    supabase
      .from(TABLE_VENTAS)
      .select('IdVenta, Total')
      .eq('IdNegocio', idNegocio)
      .gte('FechaVenta', desdeHoy),
    supabase
      .from('AlertasNegocio')
      .select('*', { count: 'exact', head: true })
      .eq('IdNegocio', idNegocio)
      .eq('Leida', false),
    supabase.from('Negocios').select('NombreNegocio').eq('IdNegocio', idNegocio).single(),
  ]);

  if (ventasSemanaRes.error) throw ventasSemanaRes.error;
  if (ventasHoyRes.error) throw ventasHoyRes.error;
  if (alertasCountRes.error) throw alertasCountRes.error;
  if (negocioRes.error) throw negocioRes.error;

  const ventasSemana = ventasSemanaRes.data ?? [];
  const ventasHoy = ventasHoyRes.data ?? [];
  const idsVentasSemana = ventasSemana.map((v) => v.IdVenta);

  let itemsVendidos = 0;
  if (idsVentasSemana.length > 0) {
    const detallesRes = await supabase
      .from(TABLE_DETALLES)
      .select('Cantidad')
      .in('IdVenta', idsVentasSemana);

    if (detallesRes.error) throw detallesRes.error;
    itemsVendidos = (detallesRes.data ?? []).reduce((sum, d) => sum + Number(d.Cantidad), 0);
  }

  const conteoClientes = {};
  ventasSemana.forEach((v) => {
    if (v.IdCliente) {
      conteoClientes[v.IdCliente] = (conteoClientes[v.IdCliente] || 0) + 1;
    }
  });
  const clientesRecurrentes = Object.values(conteoClientes).filter((n) => n > 1).length;

  const totalHoy = ventasHoy.reduce((sum, v) => sum + Number(v.Total), 0);
  const totalSemana = ventasSemana.reduce((sum, v) => sum + Number(v.Total), 0);

  return {
    nombreNegocio: negocioRes.data?.NombreNegocio ?? 'Mi negocio',
    ventasHoy: ventasHoy.length,
    totalHoy,
    ventasSemana: ventasSemana.length,
    totalSemana,
    itemsVendidos,
    clientesRecurrentes,
    alertasActivas: alertasCountRes.count ?? 0,
  };
}

export async function descontarStock(item, cantidad) {
  if (!item.ManejaStock) {
    return { ...item, nuevoStock: null, nuevoEstado: item.Estado };
  }

  const nuevoStock = Number(item.Stock) - Number(cantidad);
  const nuevoEstado = calcularEstadoStock(nuevoStock, item.StockMinimo);

  const actualizado = await actualizarItemNegocio(item.IdItemNegocio, {
    Stock: nuevoStock,
    Estado: nuevoEstado,
  });

  return { ...actualizado, nuevoStock, nuevoEstado };
}

async function crearAlertaPorEstado(item, estado) {
  if (!requiereAlertaInventario(estado)) return null;

  const nivel = estado === 'Agotado' || estado === 'Critico' ? 'Alto' : 'Medio';

  return crearAlertaNegocio({
    IdNegocio: item.IdNegocio,
    IdItemNegocio: item.IdItemNegocio,
    Titulo: `Stock ${estado.toLowerCase()}`,
    Mensaje: `${item.Nombre}: inventario en estado ${estado}`,
    TipoAlerta: 'Inventario',
    Nivel: nivel,
    Leida: false,
  });
}

export async function crearVentaConDetalle({
  idNegocio,
  idCliente,
  idItemNegocio,
  cantidad,
}) {
  const item = await obtenerItemPorId(idItemNegocio);
  const qty = Number(cantidad);

  if (qty <= 0) {
    throw new Error('La cantidad debe ser mayor a 0');
  }

  if (item.ManejaStock && Number(item.Stock) < qty) {
    throw new Error(`Stock insuficiente. Disponible: ${item.Stock}`);
  }

  const precioUnitario = Number(item.Precio);
  const subtotal = precioUnitario * qty;
  const total = subtotal;

  const ventaRes = await supabase
    .from(TABLE_VENTAS)
    .insert({
      IdNegocio: idNegocio,
      IdCliente: idCliente,
      Total: total,
      MetodoPago: 'Deuna',
      EstadoPago: 'Confirmado',
      FechaVenta: new Date().toISOString(),
      GeneroGiro: true,
    })
    .select()
    .single();

  if (ventaRes.error) throw ventaRes.error;

  const detalleRes = await supabase
    .from(TABLE_DETALLES)
    .insert({
      IdVenta: ventaRes.data.IdVenta,
      IdItemNegocio: idItemNegocio,
      Cantidad: qty,
      PrecioUnitario: precioUnitario,
      Subtotal: subtotal,
    })
    .select()
    .single();

  if (detalleRes.error) throw detalleRes.error;

  const itemActualizado = await descontarStock(item, qty);
  await crearAlertaPorEstado(itemActualizado, itemActualizado.Estado);

  return {
    venta: ventaRes.data,
    detalle: detalleRes.data,
    item: itemActualizado,
    total,
  };
}
