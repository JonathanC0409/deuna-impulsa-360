export const MOCK_CLIENTE = {
  nombre: 'María González',
  email: 'maria@email.com',
  saldoDisponible: 156.8,
  cashbackAcumulado: 18.5,
  gasto30Dias: 3.75,
  nivel: 'Bronce',
  nivelProgreso: 0.2,
  pagosMes: 1,
  pagosMetaNivel: 5,
  puntosActuales: 420,
  puntosMeta: 1000,
  cuentaEnmascarada: '******7602',
};

export const MOCK_PAGO = {
  comercio: 'Café Andino',
  monto: 12.5,
  cashbackGanado: 0.63,
};

export const MOCK_BENEFICIOS_DESBLOQUEADOS = [
  {
    id: 1,
    titulo: 'Hasta 1 giro de Gira y Gana',
    descripcion: 'Te faltan 4 pagos para tu próxima chance de ganar',
    icono: 'aperture',
    iconName: 'aperture-outline',
  },
  {
    id: 2,
    titulo: 'Combos y promociones',
    descripcion: 'Recibe descuentos, combos y promos únicas en tus negocios favoritos.',
    icono: 'pricetag',
    iconName: 'pricetag-outline',
  },
  {
    id: 3,
    titulo: 'Soporte 24 horas',
    descripcion: 'Te ayudamos a través de nuestros canales de atención',
    icono: 'headset',
    iconName: 'headset-outline',
  },
];

export const MOCK_BENEFICIOS_PROXIMOS = [
  {
    id: 4,
    titulo: 'Reembolsos de hasta el 3%',
    descripcion: 'Completa más pagos y recibe reembolsos exclusivos.',
    icono: 'cash',
    iconName: 'cash-outline',
    nivel: 'Plata',
  },
  {
    id: 5,
    titulo: 'Regalos e invitaciones',
    descripcion: 'Continúa subiendo de nivel y participa por más premios únicos',
    icono: 'gift',
    iconName: 'gift-outline',
    nivel: 'Oro',
  },
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
  { id: 'transferir', label: 'Transferir', icono: 'card', screen: 'Beneficios' },
  { id: 'banco', label: 'Otro banco', icono: 'storefront', screen: 'Billetera' },
  { id: 'recargar', label: 'Recargar', icono: 'wallet', screen: 'Billetera' },
  { id: 'cobrar', label: 'Cobrar', icono: 'qr', screen: 'PagoExitoso' },
  { id: 'beneficios', label: 'Beneficios', icono: 'gift', screen: 'Beneficios' },
  { id: 'promos', label: 'Promociones', icono: 'pricetag', screen: 'Promociones' },
  { id: 'ruleta', label: 'Ruleta', icono: 'aperture', screen: 'Ruleta' },
  { id: 'negocio', label: 'Mi negocio', icono: 'storefront', screen: 'Negocio' },
];
