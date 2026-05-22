import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CashbackCard from '../../components/cliente/CashbackCard';
import RewardItem from '../../components/cliente/RewardItem';
import { colors, spacing, radii } from '../../components/cliente/clienteTheme';
import {
  MOCK_CLIENTE,
  MOCK_PREMIOS,
  MOCK_RECOMPENSAS_RECIENTES,
} from '../../components/cliente/mockClienteData';

function PremioRow({ item }) {
  return (
    <View style={styles.premioRow}>
      <View style={styles.premioIcon}>
        <Ionicons name="trophy-outline" size={20} color={colors.primary} />
      </View>
      <View style={styles.premioBody}>
        <Text style={styles.premioTitulo}>{item.titulo}</Text>
        <Text style={styles.premioFecha}>{item.fecha}</Text>
      </View>
    </View>
  );
}

export default function MisRecompensasScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <CashbackCard monto={MOCK_CLIENTE.cashbackAcumulado} style={styles.block} />

        <Text style={styles.section}>Premios ganados</Text>
        <View style={styles.premiosCard}>
          {MOCK_PREMIOS.map((item, index) => (
            <View key={item.id}>
              <PremioRow item={item} />
              {index < MOCK_PREMIOS.length - 1 ? <View style={styles.separator} /> : null}
            </View>
          ))}
        </View>

        <Text style={[styles.section, styles.sectionSpaced]}>Tus recompensas</Text>
        {MOCK_RECOMPENSAS_RECIENTES.map((item) => (
          <View key={item.id} style={styles.rewardWrap}>
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
  block: {
    marginBottom: spacing.lg,
  },
  section: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionSpaced: {
    marginTop: spacing.sm,
  },
  premiosCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  premioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  premioIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premioBody: {
    flex: 1,
  },
  premioTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  premioFecha: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
  rewardWrap: {
    marginBottom: 10,
  },
});
