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

export const MOCK_PROMOCIONES = [
  { id: 1, titulo: 'Happy Hour', descripcion: '20% en bebidas de 4pm a 6pm', activa: true },
  { id: 2, titulo: 'Fin de semana', descripcion: 'Puntos dobles sábado y domingo', activa: true },
];

export const MOCK_PREMIO_RULETA = {
  nombre: '50 puntos extra',
  descripcion: 'Válido en tu próxima compra',
};

export const MOCK_METRICAS_NEGOCIO = {
  ventasHoy: 24,
  ingresosHoy: 186.5,
  clientesActivos: 42,
};
