import { supabase } from '../config/supabase';
import { crearUsuario, buscarUsuarioPorCorreo } from './usuarioService';
import { crearNegocio, listarNegocios, obtenerNegocioPorPropietario } from './negocioService';
import { obtenerGiroBienvenidaPendiente } from './ruletaService';
import { crearGiro } from './ruletaService';

const TABLE_VENTAS = 'Ventas';

/**
 * Acceso simulado: solo correo. Si no existe, crea el usuario automáticamente.
 */
export async function iniciarSesion({ correo, rolEsperado }) {
  const email = correo.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    throw new Error('Ingresa un correo válido.');
  }

  let usuario = await buscarUsuarioPorCorreo(email);

  if (!usuario) {
    const nombreBase = email.split('@')[0].replace(/[._-]/g, ' ') || 'Usuario';
    const nombre = nombreBase.charAt(0).toUpperCase() + nombreBase.slice(1);

    if (rolEsperado === 'Negocio') {
      const r = await registrarNegocio({
        nombrePropietario: nombre,
        correo: email,
        telefono: '0900000000',
        nombreNegocio: `Negocio ${nombre}`,
        direccion: '',
      });
      return { usuario: r.usuario, negocio: r.negocio, giroBienvenida: null };
    }

    const r = await registrarCliente({
      nombre,
      correo: email,
      telefono: '0900000000',
    });
    return {
      usuario: r.usuario,
      negocio: null,
      giroBienvenida: r.giroBienvenida?.giro ?? null,
    };
  }

  let negocio = null;
  let giroBienvenida = null;

  if (rolEsperado === 'Negocio') {
    negocio = await obtenerNegocioPorPropietario(usuario.IdUsuario);
    if (!negocio) {
      negocio = await crearNegocio({
        IdUsuarioPropietario: usuario.IdUsuario,
        NombreNegocio: `Negocio ${usuario.Nombre}`,
        Propietario: usuario.Nombre,
        Direccion: '',
        Telefono: usuario.Telefono ?? '0900000000',
        TipoOperacion: 'Productos',
        ManejaInventario: true,
        Activo: true,
      });
    }
  } else {
    giroBienvenida = await obtenerGiroBienvenidaPendiente(usuario.IdUsuario);
  }

  return { usuario, negocio, giroBienvenida };
}

export async function registrarCliente({ nombre, correo, telefono }) {
  const existe = await buscarUsuarioPorCorreo(correo);
  if (existe) {
    throw new Error('Ya existe una cuenta con este correo.');
  }

  const usuario = await crearUsuario({
    Nombre: nombre.trim(),
    Correo: correo,
    Telefono: telefono,
    Rol: 'Cliente',
  });

  const giroBienvenida = await crearGiroBienvenida(usuario.IdUsuario);

  return { usuario, giroBienvenida };
}

export async function registrarNegocio({
  nombrePropietario,
  correo,
  telefono,
  nombreNegocio,
  direccion,
}) {
  const existe = await buscarUsuarioPorCorreo(correo);
  if (existe) {
    throw new Error('Ya existe una cuenta con este correo.');
  }

  const usuario = await crearUsuario({
    Nombre: nombrePropietario.trim(),
    Correo: correo,
    Telefono: telefono,
    Rol: 'Negocio',
  });

  const negocio = await crearNegocio({
    IdUsuarioPropietario: usuario.IdUsuario,
    NombreNegocio: nombreNegocio.trim(),
    Propietario: nombrePropietario.trim(),
    Direccion: direccion?.trim() ?? '',
    Telefono: telefono.trim(),
    TipoOperacion: 'Productos',
    ManejaInventario: true,
    Activo: true,
  });

  return { usuario, negocio };
}

/** Venta simbólica $1 + giro nivel 1 tipo Bienvenida (primer inicio). */
export async function crearGiroBienvenida(idCliente) {
  const negocios = await listarNegocios();
  const negocio = negocios[0];
  if (!negocio) {
    throw new Error('No hay negocios afiliados para activar tu giro de bienvenida.');
  }

  const ventaRes = await supabase
    .from(TABLE_VENTAS)
    .insert({
      IdNegocio: negocio.IdNegocio,
      IdCliente: idCliente,
      Total: 1,
      MetodoPago: 'Registro Deuna',
      EstadoPago: 'Confirmado',
      GeneroGiro: true,
    })
    .select()
    .single();

  if (ventaRes.error) throw ventaRes.error;

  const giro = await crearGiro({
    idVenta: ventaRes.data.IdVenta,
    idCliente,
    nivelGiro: 1,
    montoCompra: 1,
    tipoGiro: 'Bienvenida',
  });

  return {
    giro,
    venta: ventaRes.data,
    negocio,
  };
}
