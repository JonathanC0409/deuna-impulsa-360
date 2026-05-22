import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DeunaButton from '../../components/DeunaButton';
import ScreenContainer from '../../components/ScreenContainer';
import { colors, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { obtenerGiroBienvenidaPendiente } from '../../services/ruletaService';
import { supabase } from '../../config/supabase';
import { obtenerNegocio } from '../../services/negocioService';

export default function GiroBienvenidaScreen({ navigation }) {
  const { usuario, giroBienvenida, limpiarGiroBienvenida } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [params, setParams] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const giro = giroBienvenida ?? (await obtenerGiroBienvenidaPendiente(usuario.IdUsuario));
        if (!giro) {
          navigation.replace('ClienteHome');
          return;
        }

        const ventaRes = await supabase
          .from('Ventas')
          .select('IdNegocio, Total')
          .eq('IdVenta', giro.IdVenta)
          .single();

        const idNegocio = ventaRes.data?.IdNegocio;
        const neg = idNegocio ? await obtenerNegocio(idNegocio) : null;

        if (activo) {
          setParams({
            ventaId: giro.IdVenta,
            usuarioId: usuario.IdUsuario,
            negocioId: idNegocio,
            montoVenta: Number(giro.MontoCompra ?? 1),
            nombreNegocio: neg?.NombreNegocio ?? 'Deuna Impulsa',
            esHorarioPromocional: false,
            esBienvenida: true,
          });
        }
      } catch (e) {
        console.error(e);
        navigation.replace('ClienteHome');
      } finally {
        if (activo) setCargando(false);
      }
    }

    if (usuario?.IdUsuario) {
      cargar();
    } else {
      if (activo) setCargando(false);
    }
    return () => {
      activo = false;
    };
  }, [usuario, giroBienvenida, navigation]);

  const irRuleta = () => {
    limpiarGiroBienvenida();
    navigation.replace('Ruleta', params);
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenContainer style={styles.content}>
        <Text style={styles.emoji}>🎁</Text>
        <Text style={styles.title}>¡Giro gratis de bienvenida!</Text>
        <Text style={styles.sub}>
          Por registrarte en Deuna Impulsa 360 tienes un giro en la ruleta. Siempre ganas cashback o
          descuentos — nunca pierdes.
        </Text>
        <DeunaButton title="Girar mi premio" variant="cashback" onPress={irRuleta} style={styles.btn} />
        <DeunaButton
          title="Después"
          variant="outline"
          onPress={() => {
            limpiarGiroBienvenida();
            navigation.replace('ClienteHome');
          }}
        />
      </ScreenContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primaryLight },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.xxxl },
  emoji: { fontSize: 64, marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.primary, textAlign: 'center' },
  sub: { ...typography.body, textAlign: 'center', marginTop: spacing.md, marginBottom: spacing.xl },
  btn: { width: '100%', marginBottom: spacing.md },
});
