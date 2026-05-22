import { Text, StyleSheet } from 'react-native';
import DeunaCard from './DeunaCard';
import { colors } from '../theme/colors';

export default function MetricCard({ label, value, subtitle, accent = colors.primary, style }) {
  return (
    <DeunaCard style={[styles.metric, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </DeunaCard>
  );
}

const styles = StyleSheet.create({
  metric: {
    flex: 1,
    minWidth: 140,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
});
