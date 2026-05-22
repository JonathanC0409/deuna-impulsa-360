import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../../components/cliente/clienteTheme';
import {
  MOCK_CLIENTE,
  MOCK_BENEFICIOS_DESBLOQUEADOS,
  MOCK_BENEFICIOS_PROXIMOS,
} from '../../components/cliente/mockClienteData';

const ICON_MAP = {
  cash: 'cash-outline',
  gift: 'gift-outline',
  'trending-up': 'trending-up-outline',
  car: 'car-outline',
};

function BeneficioRow({ item, locked = false }) {
  const iconName = ICON_MAP[item.icono] ?? 'star-outline';

  return (
    <View style={[styles.beneficioCard, locked && styles.beneficioLocked]}>
      <View style={[styles.beneficioIcon, locked && styles.beneficioIconLocked]}>
        <Ionicons
          name={iconName}
          size={22}
          color={locked ? colors.textMuted : colors.primary}
        />
      </View>
      <View style={styles.beneficioBody}>
        <Text style={[styles.beneficioTitulo, locked && styles.textMuted]}>{item.titulo}</Text>
        <Text style={styles.beneficioDesc}>{item.descripcion}</Text>
        {item.nivel ? (
          <Text style={styles.nivelTag}>Nivel {item.nivel}</Text>
        ) : null}
      </View>
      {locked ? (
        <Ionicons name="lock-closed" size={18} color={colors.textMuted} />
      ) : (
        <Ionicons name="checkmark-circle" size={22} color={colors.cashback} />
      )}
    </View>
  );
}

export default function BeneficiosScreen() {
  const progreso = MOCK_CLIENTE.nivelProgreso;
  const porcentaje = Math.round(progreso * 100);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.nivelCard}>
          <View style={styles.nivelHeader}>
            <Text style={styles.nivelLabel}>Tu nivel</Text>
            <View style={styles.nivelBadge}>
              <Ionicons name="medal" size={16} color={colors.white} />
              <Text style={styles.nivelNombre}>{MOCK_CLIENTE.nivel}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${porcentaje}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {MOCK_CLIENTE.puntosActuales} / {MOCK_CLIENTE.puntosMeta} pts para Plata ({porcentaje}%)
          </Text>
        </View>

        <Text style={styles.section}>Beneficios desbloqueados</Text>
        {MOCK_BENEFICIOS_DESBLOQUEADOS.map((item) => (
          <BeneficioRow key={item.id} item={item} />
        ))}

        <Text style={[styles.section, styles.sectionSpaced]}>Próximos beneficios</Text>
        {MOCK_BENEFICIOS_PROXIMOS.map((item) => (
          <BeneficioRow key={item.id} item={item} locked />
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
  nivelCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.lg,
    padding: 18,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nivelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  nivelLabel: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  nivelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  nivelNombre: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
  progressTrack: {
    height: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.cashback,
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 10,
  },
  section: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionSpaced: {
    marginTop: spacing.md,
  },
  beneficioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  beneficioLocked: {
    opacity: 0.85,
    backgroundColor: colors.surface,
  },
  beneficioIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beneficioIconLocked: {
    backgroundColor: colors.border,
  },
  beneficioBody: {
    flex: 1,
  },
  beneficioTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  textMuted: {
    color: colors.textMuted,
  },
  beneficioDesc: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  nivelTag: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 6,
  },
});
