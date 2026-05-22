import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import CashbackCard from '../../components/cliente/CashbackCard';
import RewardItem from '../../components/cliente/RewardItem';
import { colors, spacing, radii, typography, shadows } from '../../components/cliente/clienteTheme';
import { useAuth } from '../../context/AuthContext';
import {
  obtenerRecompensasUsuario,
  totalCashbackDisponible,
} from '../../services/recompensaService';

export default function MisRecompensasScreen() {
  const { usuario } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cashback, setCashback] = useState(0);
  const [recompensas, setRecompensas] = useState([]);

  useEffect(() => {
    if (!usuario?.IdUsuario) return;
    (async () => {
      try {
        const [cb, rec] = await Promise.all([
          totalCashbackDisponible(usuario.IdUsuario),
          obtenerRecompensasUsuario(usuario.IdUsuario),
        ]);
        setCashback(cb);
        setRecompensas(rec);
      } catch (e) {
        console.error('Recompensas:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [usuario?.IdUsuario]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenContainer>
          <CashbackCard monto={cashback} style={styles.block} />

          <Text style={styles.section}>Tus recompensas ({recompensas.length})</Text>
          {recompensas.length === 0 ? (
            <Text style={styles.empty}>
              Gira la ruleta después de pagar con Deuna. Siempre ganas un premio.
            </Text>
          ) : (
            recompensas.map((item) => (
              <View key={item.IdRecompensa ?? item.id} style={styles.rewardWrap}>
                <RewardItem
                  titulo={item.titulo ?? item.Premio}
                  negocio={item.TipoRecompensa}
                  estado={item.estado}
                  fecha={item.FechaGanada ? new Date(item.FechaGanada).toLocaleDateString('es-EC') : ''}
                />
              </View>
            ))
          )}
        </ScreenContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: {
    paddingBottom: spacing.xxxl,
    paddingTop: spacing.md,
  },
  block: {
    marginBottom: spacing.lg,
  },
  section: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  empty: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  rewardWrap: {
    marginBottom: spacing.md,
  },
});
