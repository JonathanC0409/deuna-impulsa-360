export const MOCK_USUARIO = {
  id: 1,
  nombre: 'María González',
  email: 'maria@email.com',
  puntos: 1250,
  nivel: 'Oro',
  cashback: 18.5,
};

export const MOCK_BENEFICIOS = [
  { id: 1, titulo: '2x1 en café', negocio: 'Café Andino', vence: '30 Jun' },
  { id: 2, titulo: '15% descuento', negocio: 'TechStore EC', vence: '15 Jul' },
  { id: 3, titulo: 'Envío gratis', negocio: 'Mini Market', vence: '01 Ago' },
];

export const MOCK_RECOMPENSAS = [
  { id: 1, titulo: 'Bebida gratis', estado: 'disponible', negocio: 'Café Andino' },
  { id: 2, titulo: '$5 cashback', estado: 'canjeada', negocio: 'TechStore EC' },
];

export const MOCK_ITEMS = [
  { id: 1, nombre: 'Café americano', precio: 2.5, categoria: 'Bebidas' },
  { id: 2, nombre: 'Sandwich mixto', precio: 4.0, categoria: 'Comida' },
  { id: 3, nombre: 'Brownie', precio: 1.75, categoria: 'Postres' },
];

export const MOCK_VENTAS = [
  { id: 1, cliente: 'Juan P.', monto: 12.5, fecha: 'Hoy 10:30' },
  { id: 2, cliente: 'Ana R.', monto: 8.0, fecha: 'Hoy 09:15' },
];

/** Promociones MVP — datos mock alineados al pitch */
export const MOCK_PROMOCIONES = [
  {
    id: 1,
    titulo: 'Giro premium en Tienda Don Luis',
    descripcion: 'Paga con Deuna y participa por un giro premium en la ruleta del negocio.',
    beneficio: '1 giro premium gratis',
    negocio: 'Tienda Don Luis',
    tipo: 'giro',
    destacada: true,
    dinamica: false,
    inteligente: false,
    activa: true,
  },
  {
    id: 2,
    titulo: '10% de descuento en empanadas',
    descripcion: 'Válido en empanadas de horno todos los días hasta agotar cupo diario.',
    beneficio: '10% OFF en empanadas',
    negocio: 'Tienda Don Luis',
    tipo: 'descuento',
    destacada: false,
    dinamica: false,
    inteligente: false,
    activa: true,
  },
  {
    id: 3,
    titulo: 'Cashback por pagar en horario promocional',
    descripcion: 'Recibe cashback extra si pagas entre 2:00 p.m. y 5:00 p.m. con Deuna.',
    beneficio: '5% cashback adicional',
    negocio: 'Tienda Don Luis',
    tipo: 'cashback',
    destacada: false,
    dinamica: true,
    inteligente: true,
    activa: true,
  },
  {
    id: 4,
    titulo: 'Promoción por horario bajo',
    descripcion: 'El sistema activa descuentos automáticos cuando hay poca afluencia.',
    beneficio: 'Hasta 15% en productos seleccionados',
    negocio: 'Aliados Deuna',
    tipo: 'horario',
    destacada: false,
    dinamica: true,
    inteligente: true,
    activa: false,
  },
  {
    id: 5,
    titulo: 'Promoción por stock bajo',
    descripcion: 'Descuentos inteligentes cuando el inventario está por agotarse.',
    beneficio: 'Liquidación inteligente hasta 20%',
    negocio: 'Aliados Deuna',
    tipo: 'stock',
    destacada: false,
    dinamica: true,
    inteligente: true,
    activa: true,
  },
];

export const MOCK_BENEFICIOS_INTELIGENTES = [
  {
    id: 1,
    titulo: 'Horario valle detectado',
    descripcion: 'Hay poca demanda ahora. Activa la promo por horario bajo y atrae clientes.',
    icono: '⏰',
  },
  {
    id: 2,
    titulo: 'Stock crítico en empanadas',
    descripcion: 'Quedan pocas unidades. La promo por stock bajo puede mover inventario hoy.',
    icono: '📦',
  },
  {
    id: 3,
    titulo: 'Cashback potenciado',
    descripcion: 'Estás en horario promocional: tus pagos con Deuna generan más cashback.',
    icono: '💚',
  },
];

export const MOCK_FLUJO_PASOS = [
  {
    id: 1,
    titulo: 'Negocio registra ítems',
    descripcion: 'El comercio carga productos, precios y stock en el panel.',
    icono: '🏪',
  },
  {
    id: 2,
    titulo: 'Cliente paga con Deuna',
    descripcion: 'Pago digital rápido, seguro y sin efectivo.',
    icono: '📱',
  },
  {
    id: 3,
    titulo: 'Se registra la venta',
    descripcion: 'Cada transacción queda trazada para métricas y fidelización.',
    icono: '🧾',
  },
  {
    id: 4,
    titulo: 'Se descuenta stock',
    descripcion: 'Si aplica, el inventario se actualiza en tiempo real.',
    icono: '📉',
  },
  {
    id: 5,
    titulo: 'Cliente recibe giro',
    descripcion: 'Participa en la ruleta y gana premios del negocio.',
    icono: '🎡',
  },
  {
    id: 6,
    titulo: 'Gana recompensa',
    descripcion: 'Cashback, descuentos y beneficios acumulables.',
    icono: '🎁',
  },
  {
    id: 7,
    titulo: 'Negocio vende más',
    descripcion: 'Promociones inteligentes impulsan ticket y recurrencia.',
    icono: '📈',
  },
  {
    id: 8,
    titulo: 'Deuna genera más transacciones',
    descripcion: 'Más pagos digitales, más valor para el ecosistema.',
    icono: '💜',
  },
];

export const MOCK_PREMIO_RULETA = {
  nombre: '50 puntos extra',
  descripcion: 'Válido en tu próxima compra',
};

export const MOCK_METRICAS_NEGOCIO = {
  ventasHoy: 24,
  ingresosHoy: 186.5,
  clientesActivos: 42,
  promocionesActivas: 3,
};
