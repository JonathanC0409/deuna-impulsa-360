import { supabase } from '../config/supabase';
import { crearAlertaNegocio, existeAlertaPendiente } from './alertaService';
import { obtenerItemPorId, actualizarItemNegocio, obtenerItemsNegocio } from './itemService';
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

function getItemId(item) {
  return (
    item?.idItemNegocio ??
    item?.IdItemNegocio ??
    item?.id_item_negocio ??
    item?.IdItem ??
    item?.id
  );
}

function getCantidad(item) {
  return Number(item?.cantidad ?? item?.Cantidad ?? 0);
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

  const [ventasSemanaRes, ventasHoyRes, alertasCountRes, negocioRes] =
    await Promise.all([
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

      supabase
        .from('Negocios')
        .select('NombreNegocio')
        .eq('IdNegocio', idNegocio)
        .single(),
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

    itemsVendidos = (detallesRes.data ?? []).reduce(
      (sum, d) => sum + Number(d.Cantidad),
      0
    );
  }

  const conteoClientes = {};

  ventasSemana.forEach((v) => {
    if (v.IdCliente) {
      conteoClientes[v.IdCliente] = (conteoClientes[v.IdCliente] || 0) + 1;
    }
  });

  const clientesRecurrentes = Object.values(conteoClientes).filter(
    (n) => n > 1
  ).length;

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
    return {
      ...item,
      nuevoStock: null,
      nuevoEstado: item.Estado,
    };
  }

  const nuevoStock = Number(item.Stock) - Number(cantidad);
  const nuevoEstado = calcularEstadoStock(nuevoStock, item.StockMinimo);

  const actualizado = await actualizarItemNegocio(item.IdItemNegocio, {
    Stock: nuevoStock,
    Estado: nuevoEstado,
  });

  return {
    ...actualizado,
    nuevoStock,
    nuevoEstado,
  };
}

async function crearAlertaPorEstado(item, estado) {
  if (!requiereAlertaInventario(estado)) return null;

  const yaExiste = await existeAlertaPendiente({
    idNegocio: item.IdNegocio,
    idItemNegocio: item.IdItemNegocio,
    tipoAlerta: 'Inventario',
  });

  if (yaExiste) return null;

  const nivel = estado === 'Agotado' || estado === 'Critico' ? 'Alto' : 'Medio';

  return crearAlertaNegocio({
    IdNegocio: item.IdNegocio,
    IdItemNegocio: item.IdItemNegocio,
    Titulo: `Stock ${estado.toLowerCase()}`,
    Mensaje: `${item.Nombre}: inventario en estado ${estado} (${item.Stock ?? 0} uds.).`,
    TipoAlerta: 'Inventario',
    Nivel: nivel,
    Leida: false,
  });
}

export async function crearVentaConDetalle({
  idNegocio,
  idCliente,
  idItemNegocio = null,
  cantidad = null,
  items = [],
}) {
  let detalleItems = [];

  if (Array.isArray(items) && items.length > 0) {
    detalleItems = items.map((x) => ({
      idItemNegocio: getItemId(x),
      cantidad: getCantidad(x),
    }));
  }

  if (detalleItems.length === 0 && idItemNegocio) {
    detalleItems = [
      {
        idItemNegocio,
        cantidad: Number(cantidad),
      },
    ];
  }

  console.log('[crearVentaConDetalle] idNegocio:', idNegocio);
  console.log('[crearVentaConDetalle] idCliente:', idCliente);
  console.log('[crearVentaConDetalle] items recibidos:', items);
  console.log('[crearVentaConDetalle] detalleItems:', detalleItems);

  if (!idNegocio) {
    throw new Error('No se recibió el ID del negocio.');
  }

  if (!idCliente) {
    throw new Error('No se recibió el ID del cliente.');
  }

  if (detalleItems.length === 0) {
    throw new Error('Agrega al menos un ítem a la venta.');
  }

  for (const detalle of detalleItems) {
    if (!detalle.idItemNegocio) {
      throw new Error('No se recibió el ID del ítem.');
    }

    if (!detalle.cantidad || detalle.cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0.');
    }
  }

  const itemsCompletos = [];

  for (const detalle of detalleItems) {
    const item = await obtenerItemPorId(detalle.idItemNegocio);

    if (!item) {
      throw new Error('Uno de los ítems no existe.');
    }

    if (String(item.IdNegocio) !== String(idNegocio)) {
      throw new Error(`El ítem "${item.Nombre}" no pertenece a este negocio.`);
    }

    if (item.Activo === false) {
      throw new Error(`El ítem "${item.Nombre}" no está activo.`);
    }

    if (item.ManejaStock && Number(item.Stock) < Number(detalle.cantidad)) {
      throw new Error(
        `Stock insuficiente para "${item.Nombre}". Disponible: ${item.Stock}`
      );
    }

    const precioUnitario = Number(item.Precio);
    const subtotal = precioUnitario * Number(detalle.cantidad);

    itemsCompletos.push({
      item,
      cantidad: Number(detalle.cantidad),
      precioUnitario,
      subtotal,
    });
  }

  const total = itemsCompletos.reduce(
    (sum, detalle) => sum + Number(detalle.subtotal),
    0
  );

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

  if (ventaRes.error) {
    console.error('[crearVentaConDetalle] error venta:', ventaRes.error);
    throw ventaRes.error;
  }

  const detallesPayload = itemsCompletos.map((detalle) => ({
    IdVenta: ventaRes.data.IdVenta,
    IdItemNegocio: detalle.item.IdItemNegocio,
    Cantidad: detalle.cantidad,
    PrecioUnitario: detalle.precioUnitario,
    Subtotal: detalle.subtotal,
  }));

  const detalleRes = await supabase
    .from(TABLE_DETALLES)
    .insert(detallesPayload)
    .select();

  if (detalleRes.error) {
    console.error('[crearVentaConDetalle] error detalle:', detalleRes.error);
    throw detalleRes.error;
  }

  const itemsActualizados = [];

  for (const detalle of itemsCompletos) {
    const itemActualizado = await descontarStock(
      detalle.item,
      detalle.cantidad
    );

    await crearAlertaPorEstado(itemActualizado, itemActualizado.Estado);

    itemsActualizados.push(itemActualizado);
  }

  return {
    venta: ventaRes.data,
    detalle: detalleRes.data?.[0] ?? null,
    detalles: detalleRes.data ?? [],
    items: itemsActualizados,
    total,
  };
}

/** Simula pago QR del cliente: crea venta mínima y devuelve datos para ruleta. */
export async function simularPagoCliente({
  idCliente,
  idNegocio,
  idItemNegocio,
  cantidad = 1,
}) {
  return crearVentaConDetalle({
    idNegocio,
    idCliente,
    idItemNegocio,
    cantidad,
  });
}

/**
 * Simula pago QR con monto ingresado por el cliente (venta + detalle en Supabase).
 */
export async function simularPagoClientePorMonto({ idCliente, idNegocio, monto }) {
  const montoNum = Number(String(monto).replace(',', '.'));

  if (!idCliente) {
    throw new Error('Inicia sesión como cliente para pagar.');
  }
  if (!idNegocio) {
    throw new Error('No se encontró el comercio.');
  }
  if (!montoNum || Number.isNaN(montoNum) || montoNum < 1) {
    throw new Error('Ingresa un monto válido de al menos $1.00.');
  }

  const items = await obtenerItemsNegocio(idNegocio);
  const item =
    items.find((i) => i.Activo !== false && i.Estado !== 'Agotado') ?? items[0];

  if (!item) {
    throw new Error(
      'Este comercio no tiene productos registrados. Pide al negocio que cree ítems en inventario.'
    );
  }

  const ventaRes = await supabase
    .from(TABLE_VENTAS)
    .insert({
      IdNegocio: idNegocio,
      IdCliente: idCliente,
      Total: montoNum,
      MetodoPago: 'Deuna QR',
      EstadoPago: 'Confirmado',
      FechaVenta: new Date().toISOString(),
      GeneroGiro: true,
    })
    .select()
    .single();

  if (ventaRes.error) {
    console.error('[simularPagoClientePorMonto] venta:', ventaRes.error);
    throw new Error(ventaRes.error.message ?? 'No se pudo registrar el pago.');
  }

  const detalleRes = await supabase
    .from(TABLE_DETALLES)
    .insert({
      IdVenta: ventaRes.data.IdVenta,
      IdItemNegocio: item.IdItemNegocio,
      Cantidad: 1,
      PrecioUnitario: montoNum,
      Subtotal: montoNum,
    })
    .select()
    .single();

  if (detalleRes.error) {
    console.error('[simularPagoClientePorMonto] detalle:', detalleRes.error);
    throw new Error(detalleRes.error.message ?? 'No se pudo registrar el detalle del pago.');
  }

  return {
    venta: ventaRes.data,
    detalle: detalleRes.data,
    total: montoNum,
  };
}

export async function obtenerUltimasVentasNegocio(idNegocio, limite = 5) {
  const { data, error } = await supabase
    .from(TABLE_VENTAS)
    .select('IdVenta, Total, FechaVenta, IdCliente, Usuarios:Nombre')
    .eq('IdNegocio', idNegocio)
    .order('FechaVenta', { ascending: false })
    .limit(limite);

  if (error) {
    const fallback = await supabase
      .from(TABLE_VENTAS)
      .select('IdVenta, Total, FechaVenta, IdCliente')
      .eq('IdNegocio', idNegocio)
      .order('FechaVenta', { ascending: false })
      .limit(limite);

    if (fallback.error) throw fallback.error;
    return fallback.data ?? [];
  }

  return data ?? [];
}