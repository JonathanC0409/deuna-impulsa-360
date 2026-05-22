# Deuna Impulsa 360

MVP móvil (React Native + Expo) que conecta **pagos Deuna**, **promociones**, **ruleta**, **recompensas** y **panel del negocio** para impulsar ventas y fidelización en MIPYMES.

## Inicio rápido

```bash
npm install
npx expo start
```

Abre en Expo Go, emulador Android/iOS o build de desarrollo.

## Módulos

| Módulo | Ruta principal | Descripción |
|--------|----------------|-------------|
| Cliente | `src/screens/cliente/` | Inicio, beneficios, billetera, perfil, pago exitoso |
| Negocio | `src/screens/negocio/` | Dashboard, ítems, registrar venta |
| Ruleta | `src/screens/ruleta/` | Giro y resultado de recompensa |
| Promociones | `src/screens/promociones/` | Promos activas, inteligentes y dinámicas |
| Flujo 360 | `FlujoImpulsaScreen` | Presentación del ciclo completo del producto |

Navegación central: `src/navigation/AppNavigator.jsx`.

## Promociones (demo)

Incluye datos mock en `src/data/mockData.js`:

- Giro premium en Tienda Don Luis
- 10% descuento en empanadas
- Cashback en horario promocional
- Promo por horario bajo
- Promo por stock bajo

## Pitch y documentación

Documento completo del MVP (problema, solución, Hooked, ISO):

**[documentacion/pitch.md](./documentacion/pitch.md)**

## Stack

- React Native · Expo SDK 56
- React Navigation (stack + tabs)
- Supabase (tablas ya definidas en backend; pantallas usan mock donde aplica)

## Convenciones del equipo

- No modificar `App.js`, `src/config/supabase.js` ni `package.json` sin coordinación.
- Servicios por módulo en `src/services/`.
- Sistema de diseño: `src/theme/` (colores `#4B2185`, tipografía, espaciado, sombras multiplataforma).
- Contenedor responsive web/móvil: `src/components/ScreenContainer.jsx` (max 480px centrado en web).

## Rama de trabajo

`feature/dashboard-promociones` — promociones, flujo 360, navegación y documentación del MVP.
