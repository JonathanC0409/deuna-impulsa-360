import { View, Text, StyleSheet, Pressable } from 'react-native';
import DeunaCard from './DeunaCard';
import DeunaButton from './DeunaButton';
import { colors, spacing, radii, typography } from '../theme';

const TIPO_LABEL = {
  giro: { label: 'Giro', color: colors.primary },
  descuento: { label: 'Descuento', color: colors.warning },
  cashback: { label: 'Cashback', color: colors.cashback },
  horario: { label: 'Horario', color: colors.turquoise },
  stock: { label: 'Stock', color: colors.danger },
};

export default function PromocionCard({ promocion, onToggleActiva, onActivarVisual }) {
  const tipo = TIPO_LABEL[promocion.tipo] ?? TIPO_LABEL.descuento;
  const activa = promocion.activa;

  return (
    <DeunaCard style={[styles.card, promocion.destacada && styles.destacada]}>
      <View style={styles.topRow}>
        <View style={[styles.tipoBadge, { backgroundColor: `${tipo.color}18` }]}>
          <Text style={[styles.tipoText, { color: tipo.color }]}>{tipo.label}</Text>
        </View>
        <Pressable
          onPress={() => onToggleActiva?.(promocion.id)}
          style={[styles.estadoPill, activa ? styles.estadoActivo : styles.estadoInactivo]}
        >
          <Text style={[styles.estadoText, activa ? styles.estadoTextActivo : styles.estadoTextInactivo]}>
            {activa ? 'Activa' : 'Inactiva'}
          </Text>
        </Pressable>
      </View>

      {promocion.destacada ? (
        <Text style={styles.destacadaLabel}>★ Destacada</Text>
      ) : null}
      {(promocion.dinamica || promocion.inteligente) && (
        <View style={styles.tagsRow}>
          {promocion.dinamica ? <Text style={styles.tagDinamica}>Dinámica</Text> : null}
          {promocion.inteligente ? <Text style={styles.tagInteligente}>Inteligente</Text> : null}
        </View>
      )}

      <Text style={styles.titulo}>{promocion.titulo}</Text>
      <Text style={styles.negocio}>{promocion.negocio}</Text>
      <Text style={styles.desc}>{promocion.descripcion}</Text>

      <View style={styles.beneficioBox}>
        <Text style={styles.beneficioLabel}>Beneficio</Text>
        <Text style={styles.beneficio}>{promocion.beneficio}</Text>
      </View>

      <DeunaButton
        title={activa ? 'Promoción activada ✓' : 'Activar promoción'}
        variant={activa ? 'cashback' : 'primary'}
        onPress={() => onActivarVisual?.(promocion.id)}
        style={styles.btn}
      />
    </DeunaCard>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  destacada: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tipoText: { fontSize: 12, fontWeight: '700' },
  estadoPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  estadoActivo: { backgroundColor: colors.primaryLight },
  estadoInactivo: { backgroundColor: colors.surface },
  estadoText: { fontSize: 12, fontWeight: '700' },
  estadoTextActivo: { color: colors.primary },
  estadoTextInactivo: { color: colors.textMuted },
  destacadaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  tagsRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tagDinamica: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tagInteligente: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.cashback,
    backgroundColor: '#E6FBF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  titulo: { ...typography.h2, fontSize: 17, lineHeight: 24 },
  negocio: { fontSize: 13, color: colors.primary, fontWeight: '600', marginTop: 4 },
  desc: { fontSize: 14, color: colors.textMuted, marginTop: 8, lineHeight: 20 },
  beneficioBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.cashback,
  },
  beneficioLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600', marginBottom: 2 },
  beneficio: { fontSize: 15, fontWeight: '700', color: colors.cashback },
  btn: { marginTop: 14 },
});
