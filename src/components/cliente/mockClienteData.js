export const MOCK_CLIENTE = {
  nombre: 'María González',
  email: 'maria@email.com',
  saldoDisponible: 156.8,
  cashbackAcumulado: 18.5,
  nivel: 'Bronce',
  nivelProgreso: 0.42,
  puntosActuales: 420,
  puntosMeta: 1000,
};

export const MOCK_PAGO = {
  comercio: 'Café Andino',
  monto: 12.5,
  cashbackGanado: 0.63,
};

export const MOCK_BENEFICIOS_DESBLOQUEADOS = [
  { id: 1, titulo: 'Cashback 1%', descripcion: 'En compras con QR Deuna', icono: 'cash' },
  { id: 2, titulo: 'Giros ruleta', descripcion: '1 giro por cada $20 pagados', icono: 'gift' },
];

export const MOCK_BENEFICIOS_PROXIMOS = [
  { id: 3, titulo: 'Cashback 2%', descripcion: 'Nivel Plata', icono: 'trending-up', nivel: 'Plata' },
  { id: 4, titulo: 'Envío gratis', descripcion: 'En aliados seleccionados', icono: 'car', nivel: 'Oro' },
];

export const MOCK_HISTORIAL = [
  { id: 1, tipo: 'pago', desc: 'Café Andino', monto: -12.5, fecha: 'Hoy, 10:30' },
  { id: 2, tipo: 'cashback', desc: 'Cashback acreditado', monto: 0.63, fecha: 'Hoy, 10:30' },
  { id: 3, tipo: 'pago', desc: 'TechStore EC', monto: -45.0, fecha: '18 May' },
  { id: 4, tipo: 'cashback', desc: 'Cashback acreditado', monto: 2.25, fecha: '18 May' },
  { id: 5, tipo: 'recarga', desc: 'Recarga Deuna', monto: 50.0, fecha: '15 May' },
];

export const MOCK_PREMIOS = [
  { id: 1, titulo: 'Giro ruleta extra', fecha: '19 May', icono: 'dice' },
  { id: 2, titulo: 'Bebida gratis', fecha: '10 May', icono: 'cafe' },
];

export const MOCK_RECOMPENSAS_RECIENTES = [
  {
    id: 1,
    titulo: 'Bebida gratis',
    negocio: 'Café Andino',
    estado: 'disponible',
    fecha: 'Vence 30 Jun',
  },
  {
    id: 2,
    titulo: '$5 cashback',
    negocio: 'TechStore EC',
    estado: 'canjeada',
    fecha: 'Canjeada 12 May',
  },
  {
    id: 3,
    titulo: '15% descuento',
    negocio: 'Mini Market',
    estado: 'disponible',
    fecha: 'Vence 15 Jul',
  },
];

export const ACCESOS_RAPIDOS = [
  { id: 'beneficios', label: 'Beneficios', icono: 'star', screen: 'Beneficios' },
  { id: 'billetera', label: 'Billetera', icono: 'wallet', screen: 'Billetera' },
  { id: 'recompensas', label: 'Recompensas', icono: 'gift', screen: 'MisRecompensas' },
  { id: 'ruleta', label: 'Ruleta', icono: 'aperture', screen: 'Ruleta' },
];
