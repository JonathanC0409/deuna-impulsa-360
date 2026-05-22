# Flujos implementados — Deuna Impulsa 360

## Autenticación (MVP)

- **Registro cliente**: crea fila en `Usuarios` (Rol `Cliente`) + venta simbólica $1 + giro `TipoGiro = Bienvenida`.
- **Registro negocio**: crea `Usuarios` (Rol `Negocio`) + fila en `Negocios` vinculada por `IdUsuarioPropietario`.
- **Entrada demo**: solo correo. Si no existe el usuario, se crea automáticamente según el rol elegido.
- **Sesión**: `AuthContext` + almacenamiento web (`localStorage`); en native persiste mientras la app siga abierta.

## Giro gratis al registrarse

1. `registrarCliente` → `crearGiroBienvenida`
2. Pantalla `/giro-bienvenida` → ruleta con nivel 1
3. Al girar → `Recompensas` en estado `Pendiente`

## Flujo cliente (pago → ruleta)

1. **Escanear QR** (inicio): `simularPagoCliente` → `Ventas` + `DetallesVenta` + descuento stock + alertas
2. **Pago exitoso**: muestra monto y cashback estimado
3. **Ruleta**: niveles según `determinarNivelGiro`:
   - ≥ $1 → nivel 1
   - ≥ $5 → nivel 2
   - 5.ª compra en el mismo negocio → nivel 3
   - Horario promocional activo (`Promociones.HoraInicio`–`HoraFin`) → nivel 4
4. **Resultado**: premio en `Recompensas` (siempre gana)

## Flujo negocio

1. Login/registro negocio
2. **Dashboard**: métricas desde `Ventas` / `DetallesVenta` / `AlertasNegocio`
3. **Inventario**: CRUD `ItemsNegocio` con estados de stock
4. **Registrar venta**: elige cliente + ítem → actualiza inventario → cliente puede ir a ruleta

## Tablas Supabase usadas

`Usuarios`, `Negocios`, `ItemsNegocio`, `Ventas`, `DetallesVenta`, `Promociones`, `GirosRuleta`, `Recompensas`, `AlertasNegocio`

## Políticas RLS recomendadas (Supabase)

Habilitar RLS y políticas de lectura/escritura para `anon` en tablas del MVP, o usar `service_role` solo en backend. Sin políticas, los inserts desde la app pueden fallar.
