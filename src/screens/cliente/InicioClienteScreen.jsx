import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import SaldoCard from '../../components/cliente/SaldoCard';
import CashbackCard from '../../components/cliente/CashbackCard';
import BannerPromo from '../../components/cliente/BannerPromo';
import RewardItem from '../../components/cliente/RewardItem';
import AccesoRapidoButton from '../../components/cliente/AccesoRapidoButton';
import { colors, spacing } from '../../components/cliente/clienteTheme';
import {
  MOCK_CLIENTE,
  ACCESOS_RAPIDOS,
  MOCK_RECOMPENSAS_RECIENTES,
} from '../../components/cliente/mockClienteData';

export default function InicioClienteScreen({ navigation }) {
  const primerNombre = MOCK_CLIENTE.nombre.split(' ')[0];

  const handleAcceso = (screen) => {
    if (screen === 'Ruleta') {
      navigation.getParent()?.navigate('Ruleta');
      return;
    }
    if (screen === 'MisRecompensas') {
      navigation.navigate('MisRecompensas');
      return;
    }
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Hola, {primerNombre} 👋</Text>
        <Text style={styles.subGreeting}>Tu dinero y recompensas en un solo lugar</Text>

        <SaldoCard saldo={MOCK_CLIENTE.saldoDisponible} style={styles.block} />
        <CashbackCard monto={MOCK_CLIENTE.cashbackAcumulado} style={styles.block} />

        <BannerPromo style={styles.block} />

        <Pressable
          style={({ pressed }) => [styles.qrButton, pressed && styles.qrPressed]}
          onPress={() =>
            navigation.navigate('PagoExitoso', {
              comercio: 'Café Andino',
              monto: 12.5,
              cashback: 0.63,
            })
          }
        >
          <Ionicons name="qr-code" size={28} color={colors.white} />
          <Text style={styles.qrText}>Escanear QR</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Acceso rápido</Text>
        <View style={styles.accesos}>
          {ACCESOS_RAPIDOS.map((item) => (
            <AccesoRapidoButton
              key={item.id}
              label={item.label}
              icono={item.icono}
              onPress={() => handleAcceso(item.screen)}
            />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recompensas recientes</Text>
          <Pressable onPress={() => navigation.navigate('MisRecompensas')}>
            <Text style={styles.verTodo}>Ver todo</Text>
          </Pressable>
        </View>
        {MOCK_RECOMPENSAS_RECIENTES.slice(0, 2).map((item) => (
          <View key={item.id} style={styles.rewardGap}>
            <RewardItem
              titulo={item.titulo}
              negocio={item.negocio}
              estado={item.estado}
              fecha={item.fecha}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  block: {
    marginBottom: spacing.md,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: spacing.lg,
    minHeight: 60,
  },
  qrPressed: {
    opacity: 0.88,
  },
  qrText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  accesos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  verTodo: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  rewardGap: {
    marginBottom: 10,
  },
});
