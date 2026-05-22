import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';
import { iniciarSesion } from '../services/authService';
import { obtenerGiroBienvenidaPendiente } from '../services/ruletaService';

const SESSION_KEY = 'deuna_impulsa_session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [negocio, setNegocio] = useState(null);
  const [giroBienvenida, setGiroBienvenida] = useState(null);
  const [cargando, setCargando] = useState(true);

  const persistir = async (payload) => {
    await setItem(SESSION_KEY, JSON.stringify(payload));
  };

  const restaurarSesion = useCallback(async () => {
    console.log('[AuthContext] restaurarSesion: start');
    try {
      const raw = await getItem(SESSION_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      setUsuario(parsed.usuario ?? null);
      setNegocio(parsed.negocio ?? null);

      if (parsed.usuario?.IdUsuario && parsed.usuario?.Rol === 'Cliente') {
        const giro = await obtenerGiroBienvenidaPendiente(parsed.usuario.IdUsuario);
        setGiroBienvenida(giro);
      }
      console.log('[AuthContext] restaurarSesion: success', {
        usuario: parsed.usuario?.Correo,
        rol: parsed.usuario?.Rol,
      });
    } catch (e) {
      console.error('[AuthContext] restaurarSesion: error', e?.message ?? e, e);
      try {
        await removeItem(SESSION_KEY);
      } catch (remErr) {
        console.error('[AuthContext] restaurarSesion: removeItem error', remErr);
      }
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    restaurarSesion();
  }, [restaurarSesion]);

  const signIn = useCallback(async ({ correo, rolEsperado }) => {
    console.log('[AuthContext] signIn: start', { correo, rolEsperado });
    try {
      const { usuario: user, negocio: neg, giroBienvenida: giro } = await iniciarSesion({
        correo,
        rolEsperado,
      });

      setUsuario(user);
      setNegocio(neg);
      setGiroBienvenida(giro);
      await persistir({ usuario: user, negocio: neg });

      console.log('[AuthContext] signIn: success', { correo: user?.Correo, rol: user?.Rol });
      return { usuario: user, negocio: neg, giroBienvenida: giro };
    } catch (err) {
      console.error('[AuthContext] signIn: error', err?.message ?? err, err);
      throw err;
    }
  }, []);

  const signInDirecto = useCallback(async ({ usuario: user, negocio: neg = null, giro = null }) => {
    setUsuario(user);
    setNegocio(neg);
    setGiroBienvenida(giro);
    await persistir({ usuario: user, negocio: neg });
    return { usuario: user, negocio: neg, giroBienvenida: giro };
  }, []);

  const signOut = useCallback(async () => {
    setUsuario(null);
    setNegocio(null);
    setGiroBienvenida(null);
    await removeItem(SESSION_KEY);
  }, []);

  const limpiarGiroBienvenida = useCallback(() => {
    setGiroBienvenida(null);
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      negocio,
      giroBienvenida,
      cargando,
      isCliente: usuario?.Rol === 'Cliente',
      isNegocio: usuario?.Rol === 'Negocio' || usuario?.Rol === 'Propietario',
      idUsuario: usuario?.IdUsuario,
      idNegocio: negocio?.IdNegocio,
      signIn,
      signInDirecto,
      signOut,
      limpiarGiroBienvenida,
    }),
    [usuario, negocio, giroBienvenida, cargando, signIn, signInDirecto, signOut, limpiarGiroBienvenida]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
