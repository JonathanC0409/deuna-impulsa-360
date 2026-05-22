import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import ScreenContainer from '../../components/ScreenContainer';
import TabSegment from '../../components/cliente/TabSegment';
import ListRow from '../../components/cliente/ListRow';
import {
  colors,
  spacing,
  radii,
  typography,
  shadows,
} from '../../components/cliente/clienteTheme';
import {
  MOCK_CLIENTE,
  MOCK_BENEFICIOS_DESBLOQUEADOS,
  MOCK_BENEFICIOS_PROXIMOS,
} from '../../components/cliente/mockClienteData';

const NIVELES = [
  { key: 'bronce', label: '0', activo: true },
  { key: 'plata', label: '5' },
  { key: 'oro', label: '11' },
  { key: 'morado', label: '20+' },
];

function BeneficioRow({ item, locked = false, onPress }) {
  return (
    <ListRow
      icon={item.iconName ?? 'star-outline'}
      title={item.titulo}
      subtitle={item.descripcion}
      locked={locked}
      onPress={onPress}
    />
  );
}

export default function BeneficiosScreen() {
  const [tab, setTab] = useState('club');
  const progreso = MOCK_CLIENTE.nivelProgreso;
  const porcentaje = Math.round(progreso * 100);

  const irPromociones = () => {
    router.push('/promociones');
  };

  const irRuleta = () => {
    router.replace('/ruleta');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ScreenContainer style={styles.inner}>
          <TabSegment
            tabs={[
              { key: 'club', label: 'Club Deuna' },
              { key: 'promos', label: 'Promociones' },
            ]}
            activeKey={tab}
            onChange={(key) => {
              if (key === 'promos') {
                irPromociones();
                return;
              }

              setTab(key);
            }}
          />

          {tab === 'club' ? (
            <>
              <View style={styles.nivelCard}>
                <View style={styles.nivelTop}>
                  <View style={styles.hexBadge}>
                    <Text style={styles.hexText}>d!</Text>
                  </View>

                  <View style={styles.nivelInfo}>
                    <View style={styles.nivelTitleRow}>
                      <Text style={styles.nivelNombre}>Nivel {MOCK_CLIENTE.nivel}</Text>
                      <Ionicons name="help-circle-outline" size={20} color={colors.textMuted} />
                    </View>

                    <Text style={styles.nivelDesc}>
                      Completa los pagos necesarios y sube tu nivel. Se actualizará a inicios del
                      próximo mes.
                    </Text>
                  </View>
                </View>

                <Text style={styles.pagosText}>
                  Este mes completaste{' '}
                  <Text style={styles.pagosBold}>{MOCK_CLIENTE.pagosMes} pagos</Text>
                </Text>

                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${porcentaje}%` }]} />
                </View>

                <View style={styles.milestones}>
                  {NIVELES.map((n) => (
                    <View key={n.key} style={styles.milestone}>
                      <View
                        style={[
                          styles.milestoneHex,
                          n.activo && styles.milestoneHexActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.milestoneHexText,
                            n.activo && styles.milestoneHexTextActive,
                          ]}
                        >
                          ★
                        </Text>
                      </View>
                      <Text style={styles.milestoneLabel}>{n.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <Pressable style={styles.linkRow} onPress={() => {}}>
                <Text style={styles.linkText}>¿Cómo funciona el Club Deuna?</Text>
                <Ionicons name="open-outline" size={16} color={colors.link} />
              </Pressable>

              <Text style={styles.section}>
                Mis beneficios de Nivel {MOCK_CLIENTE.nivel}
              </Text>

              <View style={styles.listCard}>
                {MOCK_BENEFICIOS_DESBLOQUEADOS.map((item, index) => {
                  const titulo = String(item.titulo ?? '').toLowerCase();

                  return (
                    <View key={item.id}>
                      <BeneficioRow
                        item={item}
                        onPress={
                          titulo.includes('gira')
                            ? irRuleta
                            : titulo.includes('promociones') || titulo.includes('promoción')
                              ? irPromociones
                              : undefined
                        }
                      />

                      {index < MOCK_BENEFICIOS_DESBLOQUEADOS.length - 1 ? (
                        <View style={styles.separator} />
                      ) : null}
                    </View>
                  );
                })}
              </View>

              <Text style={[styles.section, styles.sectionSpaced]}>
                Beneficios de los siguientes niveles
              </Text>

              <View style={styles.listCard}>
                {MOCK_BENEFICIOS_PROXIMOS.map((item, index) => (
                  <View key={item.id}>
                    <BeneficioRow item={item} locked />

                    {index < MOCK_BENEFICIOS_PROXIMOS.length - 1 ? (
                      <View style={styles.separator} />
                    ) : null}
                  </View>
                ))}
              </View>
            </>
          ) : null}
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
  scroll: {
    paddingBottom: spacing.xxxl,
  },
  inner: {
    paddingTop: spacing.sm,
  },
  nivelCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  nivelTop: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  hexBadge: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: '#CD7F32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hexText: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.white,
  },
  nivelInfo: {
    flex: 1,
  },
  nivelTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nivelNombre: {
    ...typography.h2,
    fontSize: 16,
  },
  nivelDesc: {
    ...typography.caption,
    marginTop: 6,
    lineHeight: 18,
  },
  pagosText: {
    ...typography.body,
    marginBottom: spacing.sm,
  },
  pagosBold: {
    fontWeight: '800',
    color: colors.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  milestone: {
    alignItems: 'center',
    flex: 1,
  },
  milestoneHex: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  milestoneHexActive: {
    backgroundColor: colors.primaryLight,
  },
  milestoneHexText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  milestoneHexTextActive: {
    color: colors.primary,
  },
  milestoneLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xl,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.link,
    textDecorationLine: 'underline',
  },
  section: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  sectionSpaced: {
    marginTop: spacing.md,
  },
  listCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  separator: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 56,
  },
});